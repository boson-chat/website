// A listing's boson-theme/1 colours on its card: the parts of
// boson-chat/directory ui/src/lib/theme.ts the browse cards use (readTheme,
// themeFor, listingStyle, listingAccent), keep them in step. The site is
// dark-only, so cards always take a theme's dark look (its dark variant
// when the theme is light-based and has one).

type Base = 'dark' | 'light';
const TOKENS = [
  'bg', 'surface', 'surface-raised', 'surface-hover', 'border', 'border-soft',
  'fg', 'fg-2', 'fg-3', 'muted', 'meta', 'accent', 'accent-on', 'success', 'warn', 'danger', 'info',
] as const;
type Token = (typeof TOKENS)[number];
type Colors = Record<Token, string>;

interface Look { colors?: Partial<Colors> }
export interface Theme extends Look {
  base: Base;
  logo?: string;
  variants?: Partial<Record<Base, Look>>;
}

// The client's stock dark ("Terminal") and light ("Daylight") colours.
const TERMINAL: Colors = {
  bg: '#070709', surface: '#0d0d11', 'surface-raised': '#141418', 'surface-hover': '#1a1a20',
  border: '#24242e', 'border-soft': '#1c1c24', fg: '#e2e2ea', 'fg-2': '#9898a8', 'fg-3': '#686878',
  muted: '#444452', meta: '#363644', accent: '#d97706', 'accent-on': '#070709',
  success: '#10b981', warn: '#f59e0b', danger: '#ef4444', info: '#3b82f6',
};
const DAYLIGHT: Colors = {
  bg: '#f4f4f0', surface: '#fbfbf9', 'surface-raised': '#ffffff', 'surface-hover': '#ecece6',
  border: '#d6d6ce', 'border-soft': '#e4e4dd', fg: '#1b1b21', 'fg-2': '#4e4e5a', 'fg-3': '#6e6e7a',
  muted: '#9c9ca6', meta: '#c2c2c8', accent: '#b45309', 'accent-on': '#ffffff',
  success: '#047857', warn: '#b45309', danger: '#dc2626', info: '#2563eb',
};
const MIN_CONTRAST = 4.5;
const HEX = /^#[0-9a-fA-F]{6}$/;

function isImageUrl(v: unknown): v is string {
  if (typeof v !== 'string' || v.length > 2048) return false;
  try {
    const u = new URL(v);
    return !u.username && !u.password && u.protocol === 'https:';
  } catch {
    return false;
  }
}

function readLook(o: Record<string, unknown>): Look {
  const out: Look = {};
  if (o.colors && typeof o.colors === 'object') {
    const c: Partial<Colors> = {};
    for (const key of TOKENS) {
      const v = (o.colors as Record<string, unknown>)[key];
      if (typeof v === 'string' && HEX.test(v)) c[key] = v.toLowerCase();
    }
    if (Object.keys(c).length) out.colors = c;
  }
  return out;
}

/** Reads a theme leniently: invalid fields are dropped. */
export function readTheme(v: unknown): Theme | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  if (o.version !== undefined && o.version !== 1) return null;
  const t: Theme = { base: o.base === 'light' ? 'light' : 'dark', ...readLook(o) };
  if (isImageUrl(o.logo)) t.logo = o.logo;
  const other: Base = t.base === 'dark' ? 'light' : 'dark';
  const vs = o.variants as Record<string, unknown> | undefined;
  const vr = vs && typeof vs === 'object' ? vs[other] : undefined;
  if (vr && typeof vr === 'object' && !Array.isArray(vr)) t.variants = { [other]: readLook(vr as Record<string, unknown>) };
  return t;
}

function themeFor(t: Theme, scheme: Base): { base: Base; colors?: Partial<Colors> } {
  const v = scheme !== t.base ? t.variants?.[scheme] : undefined;
  if (!v) return { base: t.base, colors: t.colors };
  return { base: scheme, colors: v.colors && Object.keys(v.colors).length ? v.colors : undefined };
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/**
 * CSS custom properties that paint a card in the network's colours,
 * guarded: surfaces and text only apply when the theme sets its own
 * surfaces and its text reads at 4.5:1 on them; the accent only when the
 * text on it does too. Anything that fails keeps the page's defaults.
 */
export function listingStyle(theme: Theme | null, scheme: Base = 'dark'): Record<string, string> {
  const vars: Record<string, string> = {};
  if (!theme) return vars;
  const t = themeFor(theme, scheme);
  const c: Colors = { ...(t.base === 'light' ? DAYLIGHT : TERMINAL), ...(t.colors ?? {}) };
  const own = t.colors ?? {};
  let ground: string | null = null;
  if ((own.bg || own.surface || own['surface-raised']) && contrast(c.fg, c.surface) >= MIN_CONTRAST && contrast(c.fg, c.bg) >= MIN_CONTRAST) {
    ground = c.surface;
    const quiet = contrast(c['fg-2'], c.surface) >= MIN_CONTRAST ? c['fg-2'] : c.fg;
    Object.assign(vars, {
      '--bg': c.bg,
      '--surface': c.surface,
      '--surface-raised': c['surface-raised'],
      '--surface-hover': c['surface-hover'],
      '--border': c.border,
      '--border-soft': c['border-soft'],
      '--dsc-border-strong': `color-mix(in oklab, ${c.border}, ${c.fg} 18%)`,
      '--fg': c.fg,
      '--fg-2': quiet,
      '--fg-3': c['fg-3'],
      '--dsc-fg-quiet': quiet,
      'color-scheme': t.base,
    });
    for (const k of ['success', 'warn', 'danger', 'info'] as const) {
      vars[`--${k}`] = c[k];
      vars[`--dsc-${k}-text`] = contrast(c[k], c.surface) >= MIN_CONTRAST ? c[k] : c.fg;
    }
  }
  if (own.accent) {
    let on = c['accent-on'];
    if (contrast(on, c.accent) < MIN_CONTRAST) {
      on = contrast('#ffffff', c.accent) >= contrast('#070709', c.accent) ? '#ffffff' : '#070709';
    }
    if (contrast(on, c.accent) >= MIN_CONTRAST) {
      vars['--accent'] = c.accent;
      vars['--accent-on'] = on;
      vars['--accent-dim'] = `color-mix(in oklab, ${c.accent}, transparent 85%)`;
    }
  }
  if (ground) vars['--dsc-accent-text'] = contrast(c.accent, ground) >= MIN_CONTRAST ? c.accent : c.fg;
  return vars;
}
