import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Toggle } from '@boson/shared';
import { useLatestRelease } from '../hooks/useLatestRelease';
import { Dropdown, type DropdownOption } from './discover/Dropdown';
import { NetworkCard } from './discover/NetworkCard';
import {
  DEFAULT_FILTERS,
  DIRECTORY_URL,
  LIST_NETWORK_URL,
  getFacets,
  isFiltered,
  langName,
  listNetworks,
  plural,
  readFilters,
  writeFilters,
  type Facets,
  type Filters,
  type Network,
  type Sort,
} from './discover/directory';
import './DiscoverPage.css';

// The directory's browse page (boson-chat/directory ui/src/routes/
// +page.svelte) on the site: same API, same filters (applied by the
// directory, server-side), same cards and states.

const SORT_OPTIONS: DropdownOption<Sort>[] = [
  { value: 'users', label: 'Most users' },
  { value: 'active', label: 'Recently active' },
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name' },
];

const initialFilters = (): Filters =>
  typeof window === 'undefined' ? DEFAULT_FILTERS : readFilters(new URLSearchParams(window.location.search));

export function DiscoverPage() {
  const [f, setF] = useState<Filters>(initialFilters);
  const [query, setQuery] = useState(f.q);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moreError, setMoreError] = useState('');
  const [facets, setFacets] = useState<Facets | null>(null);
  const [reload, setReload] = useState(0);
  const release = useLatestRelease();
  const ctrl = useRef<AbortController | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  // Filters live in the address bar, so a search can be shared and survives reloads.
  const apply = (patch: Partial<Filters>) => {
    setF((prev) => {
      const next = { ...prev, ...patch };
      const qs = writeFilters(next);
      if (qs !== window.location.search) history.replaceState(history.state, '', window.location.pathname + qs);
      return next;
    });
  };

  // Follow back/forward navigation.
  useEffect(() => {
    const onPop = () => {
      const next = readFilters(new URLSearchParams(window.location.search));
      setF(next);
      setQuery(next.q);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const onSearch = (v: string) => {
    setQuery(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => apply({ q: v }), 250);
  };

  const load = (more: boolean, from: string | null) => {
    ctrl.current?.abort();
    const c = (ctrl.current = new AbortController());
    setLoading(true);
    if (more) setMoreError('');
    else setError('');
    listNetworks(f, more ? from : null, c.signal)
      .then((r) => {
        if (c.signal.aborted) return;
        setNetworks((prev) => (more ? [...prev, ...r.networks.filter((n) => !prev.some((p) => p.id === n.id))] : r.networks));
        setCursor(r.next_cursor);
        setTotal(r.total_estimate);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        const msg = e instanceof Error ? e.message : String(e);
        if (more) setMoreError(msg);
        else setError(msg);
      })
      .finally(() => {
        if (ctrl.current === c) setLoading(false);
      });
  };

  // Reload from the first page whenever a filter changes.
  const key = writeFilters(f);
  useEffect(() => {
    setNetworks([]);
    setCursor(null);
    load(false, null);
    return () => ctrl.current?.abort();
  }, [key, reload]);

  useEffect(() => {
    let live = true;
    getFacets(f.nsfw)
      .then((x) => live && setFacets(x))
      .catch(() => live && setFacets({ tags: [], languages: [] }));
    return () => {
      live = false;
    };
  }, [f.nsfw]);

  // Infinite scroll: fetch the next page as the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && cursor && !loading && !moreError) load(true, cursor);
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [cursor, loading, moreError, networks.length]);

  const langOptions = useMemo<DropdownOption[]>(
    () => [
      { value: '', label: 'Any language' },
      ...(facets?.languages ?? []).map((l) => ({ value: l.value, label: langName(l.value), description: plural(l.count, 'network', 'networks') })),
    ],
    [facets],
  );
  const tagOptions = useMemo<DropdownOption[]>(
    () => [
      { value: '', label: 'Any topic' },
      ...(facets?.tags ?? []).map((t) => ({ value: t.value, label: t.value, description: plural(t.count, 'network', 'networks') })),
    ],
    [facets],
  );
  const sourceOptions = useMemo<DropdownOption[]>(
    () => [
      { value: 'all', label: 'All directories', description: 'This directory and its peers' },
      ...(facets?.sources ?? [{ id: 'local', name: 'This directory', count: -1 }]).map((s) => ({
        value: s.id,
        label: s.id === 'local' ? 'Listed here' : s.name,
        description: [
          s.id === 'local' ? `Registered with ${new URL(DIRECTORY_URL).host}` : (s.url?.replace(/^https?:\/\//, '') ?? ''),
          s.count >= 0 ? plural(s.count, 'network', 'networks') : '',
        ]
          .filter(Boolean)
          .join(' · '),
      })),
    ],
    [facets],
  );
  const popular = (facets?.tags ?? []).slice(0, 8);
  const sourceCount = (facets?.sources ?? []).filter((s) => s.count > 0).length;
  const countText =
    plural(total, 'network', 'networks') + (sourceCount > 1 && f.source === 'all' ? ` from ${sourceCount} directories` : '');
  const filtered = isFiltered(f);
  const clear = () => {
    setQuery('');
    apply({ ...DEFAULT_FILTERS, sort: f.sort });
  };

  return (
    <>
      <div class="container discover">
        <section class="dsc-hero" aria-labelledby="dsc-h">
          <h1 id="dsc-h">Find a network to join</h1>
          <p class="dsc-lede">
            IRC networks people run for every kind of community. Each one proves it owns its hostname with a DNS
            record before it shows up here.
          </p>
          <form
            class="dsc-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              clearTimeout(debounce.current);
              apply({ q: query });
            }}
          >
            <label class="dsc-sr" for="dsc-q">Search networks</label>
            <span class="dsc-prompt" aria-hidden="true">/</span>
            <input
              id="dsc-q"
              type="search"
              value={query}
              onInput={(e) => onSearch((e.target as HTMLInputElement).value)}
              placeholder="Search by name, topic or hostname"
              autocomplete="off"
              spellcheck={false}
            />
            <span class="dsc-count" aria-live="polite">
              {!error && (!loading || networks.length) ? countText : ''}
            </span>
          </form>
          {popular.length ? (
            <div class="dsc-chips" aria-label="Popular topics">
              {popular.map((t) => (
                <button
                  key={t.value}
                  class="dsc-chip"
                  type="button"
                  aria-pressed={f.tag === t.value}
                  onClick={() => apply({ tag: f.tag === t.value ? '' : t.value })}
                >
                  {t.value}
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <div class="dsc-filters" aria-label="Filters">
          <div class="dsc-f">
            <span class="dsc-flabel" id="fl-lang">Language</span>
            <Dropdown id="dd-lang" options={langOptions} value={f.lang} onChange={(v) => apply({ lang: v })} labelledby="fl-lang" />
          </div>
          <div class="dsc-f">
            <span class="dsc-flabel" id="fl-tag">Topic</span>
            <Dropdown id="dd-tag" options={tagOptions} value={f.tag} onChange={(v) => apply({ tag: v })} labelledby="fl-tag" />
          </div>
          <div class="dsc-f">
            <span class="dsc-flabel" id="fl-src">Source</span>
            <Dropdown id="dd-src" options={sourceOptions} value={f.source} onChange={(v) => apply({ source: v })} labelledby="fl-src" />
          </div>
          <div class="dsc-f">
            <span class="dsc-flabel" id="fl-sort">Sort</span>
            <Dropdown id="dd-sort" options={SORT_OPTIONS} value={f.sort} onChange={(v) => apply({ sort: v })} labelledby="fl-sort" />
          </div>
          <div class="dsc-f dsc-nsfw">
            <Toggle label="Show 18+" checked={f.nsfw} onChange={(v) => apply({ nsfw: v })} />
          </div>
          {filtered ? (
            <button class="dsc-btn dsc-btn-small dsc-btn-ghost dsc-clear" type="button" onClick={clear}>
              Clear filters
            </button>
          ) : null}
        </div>

        {error ? (
          <State kind="error" title="The directory didn’t answer">
            <p>{error}</p>
            <div class="dsc-state-act">
              <button class="dsc-btn dsc-btn-small" type="button" onClick={() => setReload((n) => n + 1)}>Try again</button>
            </div>
          </State>
        ) : loading && !networks.length ? (
          <ul class="dsc-grid" aria-busy="true" aria-label="Loading networks">
            {[0, 1, 2, 3, 4, 5].map((i) => <li key={i} class="dsc-ghost" aria-hidden="true" />)}
          </ul>
        ) : !networks.length ? (
          filtered ? (
            <State kind="empty" title="No networks match">
              <p>Try a shorter search, another language or topic, or look in every directory.</p>
              <div class="dsc-state-act">
                <button class="dsc-btn dsc-btn-small" type="button" onClick={clear}>Clear filters</button>
              </div>
            </State>
          ) : (
            <State kind="empty" title="No networks are listed yet">
              <p>Run an IRC network? Be the first: register it and prove you own the hostname with a TXT record.</p>
              <div class="dsc-state-act">
                <a class="dsc-btn dsc-btn-small dsc-btn-primary" href={LIST_NETWORK_URL}>List your network</a>
              </div>
            </State>
          )
        ) : (
          <>
            <ul class="dsc-grid">
              {networks.map((n) => (
                <li key={n.id}>
                  <NetworkCard network={n} />
                </li>
              ))}
            </ul>
            <div class="dsc-more" ref={sentinel}>
              {moreError ? (
                <State kind="error" title="The next page didn’t load">
                  <p>{moreError}</p>
                  <div class="dsc-state-act">
                    <button class="dsc-btn dsc-btn-small" type="button" onClick={() => load(true, cursor)}>Try again</button>
                  </div>
                </State>
              ) : cursor ? (
                <button class="dsc-btn" type="button" onClick={() => load(true, cursor)} disabled={loading}>
                  {loading ? 'Loading more…' : 'Show more networks'}
                </button>
              ) : networks.length > 12 ? (
                <p class="dsc-end">That’s every network{filtered ? ' that matches' : ''}.</p>
              ) : null}
            </div>
          </>
        )}

        <section class="dsc-cta" aria-labelledby="dsc-cta-h">
          <div>
            <h2 id="dsc-cta-h">Run a network?</h2>
            <p>
              List it on {new URL(DIRECTORY_URL).host} with your Boson account. Any IRC server works: you prove
              you own the hostname with a DNS record. <a href="/operators">How listing works</a>
            </p>
          </div>
          <a class="dsc-btn" href={LIST_NETWORK_URL}>List your network</a>
        </section>
      </div>

      <section class="section cta-strip discover-cta">
        <div class="container">
          <h2 style="margin-bottom: 16px;">Don't have Boson yet?</h2>
          <p class="lead">
            The "Open in Boson" buttons need the desktop app installed — it registers the{' '}
            <span class="num">boson://</span> URL scheme with your OS at install time. Grab it below and any
            directory link on this page works as a one-click connect. In the web app or on Android, add a
            network by its address instead.
          </p>
          <div class="hero-cta" style="justify-content: center;">
            <a class="btn btn-primary" href="/download">
              Download Boson{release.version ? ` v${release.version}` : ''}
            </a>
            <a class="btn btn-secondary" href="/docs#add-manual">
              Add a server by address
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/** One look for empty and error states (the directory's State.svelte). */
function State({ kind, title, children }: { kind: 'empty' | 'error'; title: string; children?: ComponentChildren }) {
  return (
    <div class={`dsc-state ${kind}`} role={kind === 'error' ? 'alert' : undefined}>
      <span class="dsc-state-glyph" aria-hidden="true" />
      <div class="dsc-state-text">
        <p class="dsc-state-title">{title}</p>
        <div class="dsc-state-body">{children}</div>
      </div>
    </div>
  );
}
