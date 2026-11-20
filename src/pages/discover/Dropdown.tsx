import { useEffect, useRef, useState } from 'preact/hooks';

// The directory's Dropdown (boson-chat/directory ui/src/lib/components/
// Dropdown.svelte), single-select only: a WAI-ARIA select-only combobox.
// Focus stays on the trigger; the highlighted option is announced through
// aria-activedescendant. Keys: ↓ ↑ Enter Space open; Home/End; Escape
// closes; Tab chooses and moves on; typing jumps (type-ahead).

export interface DropdownOption<V extends string = string> {
  value: V;
  label: string;
  /** A second, quieter line under the label. */
  description?: string;
}

interface Props<V extends string> {
  id: string;
  options: DropdownOption<V>[];
  value: V;
  onChange: (v: V) => void;
  labelledby?: string;
}

const GAP = 6;
const MARGIN = 8;
const MAX = 320;

export function Dropdown<V extends string>({ id, options, value, onChange, labelledby }: Props<V>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [place, setPlace] = useState({ up: false, end: false, maxH: MAX });
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ s: '', at: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const optId = (i: number) => `${id}-opt-${i}`;

  const show = (i: number) => {
    setActive(i < 0 ? 0 : i);
    setOpen(true);
  };
  const hide = (refocus = true) => {
    setOpen(false);
    setActive(-1);
    if (refocus) trigger.current?.focus();
  };
  const choose = (i: number) => {
    const o = options[i];
    if (!o) return;
    hide();
    if (o.value !== value) onChange(o.value);
  };

  // Place the list below (or above, when there's no room) and keep it on screen.
  useEffect(() => {
    if (!open || !trigger.current || !list.current) return;
    const position = () => {
      const t = trigger.current!.getBoundingClientRect();
      const l = list.current!;
      const below = window.innerHeight - t.bottom - GAP - MARGIN;
      const above = t.top - GAP - MARGIN;
      const up = below < Math.min(l.scrollHeight, MAX) && above > below;
      const roomRight = document.documentElement.clientWidth - t.left - MARGIN;
      setPlace({ up, end: l.offsetWidth > roomRight && t.right - MARGIN > roomRight, maxH: Math.floor(Math.min(MAX, Math.max(up ? above : below, 120))) });
    };
    position();
    const down = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) hide(false);
    };
    document.addEventListener('pointerdown', down, true);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, { passive: true, capture: true });
    return () => {
      document.removeEventListener('pointerdown', down, true);
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, { capture: true });
    };
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) list.current?.querySelector<HTMLElement>('#' + CSS.escape(optId(active)))?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const typeahead = (ch: string) => {
    const now = Date.now();
    const t = typed.current;
    t.s = now - t.at > 600 ? ch : t.s + ch;
    t.at = now;
    const q = t.s.toLocaleLowerCase();
    const same = [...q].every((c) => c === q[0]);
    const needle = same ? q[0] : q;
    const from = open ? active : selectedIndex;
    const start = same ? from + 1 : Math.max(from, 0);
    const n = options.length;
    for (let k = 0; k < n; k++) {
      const i = (start + k + n) % n;
      if (options[i].label.toLocaleLowerCase().startsWith(needle)) {
        if (open) setActive(i);
        else show(i);
        return;
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key;
    const plain = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (!open) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') {
        e.preventDefault();
        show(selectedIndex);
      } else if (k === 'Home' || k === 'End') {
        e.preventDefault();
        show(k === 'Home' ? 0 : options.length - 1);
      } else if (plain && k !== ' ') typeahead(k);
      return;
    }
    switch (k) {
      case 'ArrowDown':
        e.preventDefault();
        setActive(Math.min(active + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (e.altKey) choose(active);
        else setActive(Math.max(active - 1, 0));
        break;
      case 'PageDown':
        e.preventDefault();
        setActive(Math.min(active + 10, options.length - 1));
        break;
      case 'PageUp':
        e.preventDefault();
        setActive(Math.max(active - 10, 0));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        hide();
        break;
      case 'Tab':
        if (active >= 0 && active !== selectedIndex) choose(active);
        hide(false);
        break;
      default:
        if (plain) typeahead(k);
    }
  };

  return (
    <div
      class={`dsc-dd${open ? ' open' : ''}`}
      ref={root}
      onFocusOut={(e) => {
        const to = (e as FocusEvent).relatedTarget as Node | null;
        if (open && (!to || !root.current?.contains(to))) hide(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        id={id}
        class="dsc-dd-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
        aria-labelledby={labelledby}
        onClick={() => (open ? hide() : show(selectedIndex))}
        onKeyDown={onKeyDown}
      >
        <span class="dsc-dd-value">{selected?.label ?? 'Choose…'}</span>
        <span class="dsc-dd-chev" aria-hidden="true" />
      </button>
      <div
        ref={list}
        id={`${id}-list`}
        class={`dsc-dd-list${place.up ? ' up' : ''}${place.end ? ' end' : ''}`}
        style={{ maxHeight: `${place.maxH}px` }}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={labelledby}
        hidden={!open}
        onMouseDown={(e) => e.preventDefault()}
      >
        {options.map((o, i) => (
          <div
            key={o.value}
            id={optId(i)}
            role="option"
            class={`dsc-dd-opt${i === active ? ' active' : ''}`}
            aria-selected={i === selectedIndex}
            onClick={() => choose(i)}
            onPointerMove={() => active !== i && setActive(i)}
          >
            <span class="dsc-dd-label">{o.label}</span>
            {o.description ? <span class="dsc-dd-desc">{o.description}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
