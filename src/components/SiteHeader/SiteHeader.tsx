import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { BosonGlyph } from '@boson/shared';
import './SiteHeader.css';

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

// The web app isn't a page of the site: it's offered as a button next to
// Download (header and mobile menu), not as a nav link.
const WEB_APP_URL = 'https://chat.boson.chat';

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Overview' },
  { href: '/features', label: 'Features' },
  { href: '/discover', label: 'Discover' },
  { href: '/docs', label: 'Docs' },
  { href: '/self-host', label: 'Self-host' },
  { href: '/about', label: 'About' },
  { href: 'https://github.com/boson-chat/boson', label: 'GitHub', external: true },
];

// A section's link stays current on its sub-pages (/self-host/new-server).
function isCurrent(path: string, href: string): 'page' | undefined {
  if (path === href) return 'page';
  return href !== '/' && path.startsWith(href + '/') ? 'page' : undefined;
}

export function SiteHeader() {
  const { path } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on every route change. preact-iso re-renders
  // this component when `path` changes, so we just react to that. Also
  // close on Escape and lock body scroll while open — anything that
  // doesn't would let the page underneath scroll behind the overlay.
  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      {path !== '/operators' && (
        <aside class="opbar" aria-label="For IRC server operators">
          <div class="container opbar-inner">
            <span class="opbar-ask">Run an IRC server?</span>
            <span class="opbar-pitch">Put it in the Boson directory and come say hi in #lobby.</span>
            <a class="opbar-link" href="/operators">For operators</a>
          </div>
        </aside>
      )}
      <header class="topnav">
        <div class="container topnav-inner">
          <a class="topnav-logo" href="/" aria-label="Boson — Home">
            <BosonGlyph size={18} class="topnav-logo-mark" />
            <span>Boson</span>
          </a>
          <nav class="topnav-nav">
            {NAV_LINKS.map((link) =>
              link.external ? (
                <a key={link.href} href={link.href} rel="noopener">
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent(path, link.href)}
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>
          <div class="topnav-actions">
            <a class="btn btn-secondary btn-sm topnav-webapp" href={WEB_APP_URL} rel="noopener">
              Chat now
            </a>
            <a
              class="btn btn-primary btn-sm topnav-download"
              href="/download"
              aria-current={path === '/download' ? 'page' : undefined}
            >
              Download
            </a>
          </div>
          <button
            type="button"
            class={`topnav-burger ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {/* Three lines that morph into an X via CSS when .is-open is set. */}
            <span class="topnav-burger-line" />
            <span class="topnav-burger-line" />
            <span class="topnav-burger-line" />
          </button>
        </div>
      </header>

      {/* The mobile drawer is always in the DOM so we can animate enter
         AND exit (display:none would skip the exit). Pointer events +
         visibility are controlled by the .is-open class instead. */}
      <div
        id="mobile-menu"
        class={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        onClick={(e) => {
          // Tap on the backdrop (anywhere not on an interactive child)
          // dismisses. The inner panel stops propagation below.
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <div class="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
          <nav class="mobile-menu-nav">
            {NAV_LINKS.map((link, i) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  rel="noopener"
                  style={`--i: ${i};`}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent(path, link.href)}
                  style={`--i: ${i};`}
                >
                  {link.label}
                </a>
              ),
            )}
          </nav>
          <div class="mobile-menu-ctas">
            <a
              class="btn btn-secondary mobile-menu-cta"
              href={WEB_APP_URL}
              rel="noopener"
              style={`--i: ${NAV_LINKS.length};`}
            >
              Chat now
            </a>
            <a
              class="btn btn-primary mobile-menu-cta"
              href="/download"
              aria-current={path === '/download' ? 'page' : undefined}
              style={`--i: ${NAV_LINKS.length + 1};`}
            >
              Download Boson
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
