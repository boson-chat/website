import type { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import '../DocsPage.css';
import './SelfHost.css';

/** The self-host section's pages, in reading order (the tabs under the hero). */
export const SELF_HOST_PAGES = [
  { href: '/self-host', label: 'Overview' },
  { href: '/self-host/new-server', label: 'New server' },
  { href: '/self-host/existing-irc', label: 'Existing IRC server' },
  { href: '/self-host/features', label: 'Features' },
] as const;

export interface TocGroup {
  title: string;
  items: { id: string; label: string }[];
}

interface GuideLayoutProps {
  eyebrow: string;
  title: string;
  lead: ComponentChildren;
  toc?: TocGroup[];
  children: ComponentChildren;
}

/** The tabs that move between the self-host pages. */
export function SelfHostTabs() {
  const { path } = useLocation();
  return (
    <nav class="sh-tabs" aria-label="Self-host guides">
      <ul>
        {SELF_HOST_PAGES.map((p) => (
          <li key={p.href}>
            <a href={p.href} aria-current={path === p.href ? 'page' : undefined}>
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Hero + tabs + (optionally) the docs-style sticky table of contents with
 * scrollspy, as on /docs. Sections in `children` are `<article
 * class="doc-section" id=…>` whose ids match `toc`.
 */
export function GuideLayout({ eyebrow, title, lead, toc, children }: GuideLayoutProps) {
  const ids = toc ? toc.flatMap((g) => g.items.map((i) => i.id)) : [];
  const active = useScrollSpy(ids);

  // A link from another page to /self-host/...#section: the router doesn't
  // scroll to the anchor, so do it once the page has rendered.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) window.requestAnimationFrame(() => el.scrollIntoView());
  }, []);

  return (
    <>
      <section class="section docs-hero sh-hero sh-page">
        <div class="container">
          <p class="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <div class="lead sh-lead">{lead}</div>
          <SelfHostTabs />
        </div>
      </section>
      <section class="section docs-content sh-page">
        <div class="container">
          {toc ? (
            <div class="docs-grid">
              <aside class="docs-sidebar" aria-label="On this page">
                {toc.map((g) => (
                  <div key={g.title}>
                    <h2 class="sh-toc-title">{g.title}</h2>
                    <ul>
                      {g.items.map((i) => (
                        <li key={i.id}>
                          <a href={`#${i.id}`} class={active === i.id ? 'active' : undefined}>
                            {i.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </aside>
              <div class="docs-body">{children}</div>
            </div>
          ) : (
            children
          )}
        </div>
      </section>
    </>
  );
}

/** A table that scrolls sideways on its own at phone width, not the page. */
export function DataTable({ caption, head, rows }: { caption?: string; head: string[]; rows: ComponentChildren[][] }) {
  return (
    <div class="sh-table-wrap" role="region" aria-label={caption} tabIndex={0}>
      <table class="sh-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Inline code. */
export function K({ children }: { children: ComponentChildren }) {
  return <code class="sh-k">{children}</code>;
}
