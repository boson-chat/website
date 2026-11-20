// The public network directory (directory.boson.chat) as its own browse UI
// uses it: GET /v1/networks (filtered, sorted and paged on the server) and
// GET /v1/facets. Both answer any origin (Access-Control-Allow-Origin: *).
// Ported from boson-chat/directory ui/src/lib/{api,types,links,filters,
// format}.ts; keep the two in step.

export const DIRECTORY_URL =
  (import.meta.env.VITE_DIRECTORY_URL as string | undefined)?.replace(/\/+$/, '') ?? 'https://directory.boson.chat';
/** Where the directory's "List your network" goes (ui/src/routes/me/new). */
export const LIST_NETWORK_URL = `${DIRECTORY_URL}/me/new`;

export type HealthStatus = 'up' | 'down' | 'unknown';
export type Sort = 'users' | 'active' | 'newest' | 'name';

export interface Network {
  id: string;
  hostname: string;
  port: number;
  tls: boolean;
  name: string;
  description?: string | null;
  tags: string[];
  languages: string[];
  is_nsfw: boolean;
  icon_url?: string | null;
  banner_url?: string | null;
  /** boson-theme/1 branding; null when the network has none. */
  theme?: unknown;
  /** `local` or `peer:<id>`. */
  origin: string;
  origin_name?: string | null;
  health_status: HealthStatus;
  user_count?: number | null;
}

export interface NetworkPage {
  networks: Network[];
  next_cursor: string | null;
  total_estimate: number;
}

export interface FacetCount { value: string; count: number }
export interface SourceFacet { id: string; name: string; url?: string; count: number }
export interface Facets { tags: FacetCount[]; languages: FacetCount[]; sources?: SourceFacet[] }

export interface Filters {
  q: string;
  lang: string;
  tag: string;
  source: string;
  sort: Sort;
  nsfw: boolean;
}

const SORTS: Sort[] = ['users', 'active', 'newest', 'name'];
export const DEFAULT_FILTERS: Filters = { q: '', lang: '', tag: '', source: 'all', sort: 'users', nsfw: false };

/** Browse filters from the address bar, so searches can be shared and survive reloads. */
export function readFilters(p: URLSearchParams): Filters {
  const sort = p.get('sort') as Sort;
  return {
    q: (p.get('q') ?? '').slice(0, 200),
    lang: p.get('lang') ?? '',
    tag: p.get('tag') ?? '',
    source: p.get('source') || 'all',
    sort: SORTS.includes(sort) ? sort : 'users',
    nsfw: p.get('nsfw') === 'true',
  };
}

/** The query string for f, leaving out defaults. */
export function writeFilters(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.lang) p.set('lang', f.lang);
  if (f.tag) p.set('tag', f.tag);
  if (f.source && f.source !== 'all') p.set('source', f.source);
  if (f.sort !== 'users') p.set('sort', f.sort);
  if (f.nsfw) p.set('nsfw', 'true');
  const s = p.toString();
  return s ? '?' + s : '';
}

export function isFiltered(f: Filters): boolean {
  return writeFilters({ ...f, sort: 'users' }) !== '';
}

export class DirectoryError extends Error {}

function message(status: number): string {
  if (status === 429) return 'Too many requests. Wait a moment and try again.';
  if (status >= 500) return 'The directory had a problem. Try again in a minute.';
  return 'The request failed.';
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(DIRECTORY_URL + path, { headers: { Accept: 'application/json' }, signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new DirectoryError('The directory is unreachable. Check your connection and try again.');
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error page from a proxy */
  }
  if (!res.ok) {
    const e = (data ?? {}) as { message?: string };
    throw new DirectoryError(e.message || message(res.status));
  }
  return data as T;
}

export function listNetworks(f: Filters, cursor: string | null, signal?: AbortSignal): Promise<NetworkPage> {
  const p = new URLSearchParams({ limit: '24' });
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.lang) p.set('lang', f.lang);
  if (f.tag) p.set('tag', f.tag);
  if (f.source && f.source !== 'all') p.set('source', f.source);
  p.set('sort', f.sort);
  if (f.nsfw) p.set('nsfw', 'true');
  if (cursor) p.set('cursor', cursor);
  return get<NetworkPage>('/v1/networks?' + p.toString(), signal).then((r) => ({
    networks: Array.isArray(r.networks) ? r.networks.map(normalise) : [],
    next_cursor: r.next_cursor || null,
    total_estimate: typeof r.total_estimate === 'number' ? r.total_estimate : 0,
  }));
}

export function getFacets(nsfw: boolean): Promise<Facets> {
  return get<Facets>('/v1/facets' + (nsfw ? '?nsfw=true' : ''));
}

// Defensive defaults for the fields the card reads.
function normalise(n: Network): Network {
  const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
  return {
    ...n,
    name: n.name || n.hostname,
    port: typeof n.port === 'number' ? n.port : 6697,
    tls: n.tls !== false,
    tags: list(n.tags),
    languages: list(n.languages),
    origin: n.origin || 'local',
    health_status: n.health_status === 'up' || n.health_status === 'down' ? n.health_status : 'unknown',
  };
}

/** The client deep link: boson://join?host=&port=&tls=&name= */
export function joinUrl(n: Pick<Network, 'hostname' | 'port' | 'tls' | 'name'>): string {
  const u = new URLSearchParams({ host: n.hostname, port: String(n.port), tls: n.tls ? '1' : '0', name: n.name });
  return 'boson://join?' + u.toString();
}

/** irc.example.org:+6697 (TLS) as people type it into other clients. */
export function address(n: Pick<Network, 'hostname' | 'port' | 'tls'>): string {
  return `${n.hostname}:${n.tls ? '+' : ''}${n.port}`;
}

/** "local" or the peer's label for a listing's origin. */
export function originLabel(n: Pick<Network, 'origin' | 'origin_name'>): string {
  if (n.origin === 'local') return 'local';
  return n.origin_name || 'another directory';
}

const langNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'language' }) : null;

/** "en" → "English". */
export function langName(code: string): string {
  try {
    return langNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

const nf = new Intl.NumberFormat('en');
export function num(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—';
  if (Math.abs(v) >= 10000) return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
  return nf.format(v);
}

export const plural = (n: number, one: string, many: string) => `${num(n)} ${n === 1 ? one : many}`;
