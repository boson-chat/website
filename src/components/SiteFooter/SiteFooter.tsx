import { BosonGlyph } from '@boson/shared';
import { COMMUNITY, COMMUNITY_JOIN_URL } from '../../community';
import './SiteFooter.css';

export function SiteFooter() {
  return (
    <footer class="pagefoot">
      <div class="container">
        <section class="foot-community" aria-labelledby="foot-community-title">
          <div class="foot-community-text">
            <h2 id="foot-community-title">Join the community</h2>
            <p>
              Chat with the people building Boson and the people using it, in{' '}
              <span class="num">{COMMUNITY.channel}</span> on{' '}
              <span class="num">{COMMUNITY.hostname}</span>{' '}
              ({COMMUNITY.port}, TLS). Questions, ideas, or running a network you want listed.
            </p>
          </div>
          <div class="foot-community-act">
            <a class="btn btn-primary" href={COMMUNITY_JOIN_URL}>Open in Boson</a>
            <a class="btn btn-ghost btn-arrow" href="/operators#community">Connection details</a>
          </div>
        </section>
        <div class="foot-cols">
          <div class="foot-col foot-col-brand">
            <a class="foot-logo" href="/">
              <BosonGlyph size={18} class="foot-logo-mark" />
              <span>Boson</span>
            </a>
            <p class="foot-tag">
              Chat, voice and video for IRC servers. Identity in the client, plumbing in the open.
            </p>
          </div>
          <div class="foot-col">
            <h4>Product</h4>
            <ul>
              <li><a href="/download">Download</a></li>
              <li><a href="https://chat.boson.chat" rel="noopener">Web app</a></li>
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="/#gallery">Screenshots</a></li>
            </ul>
          </div>
          <div class="foot-col">
            <h4>Using Boson</h4>
            <ul>
              <li><a href="/docs#join-directory">Join from the directory</a></li>
              <li><a href="/docs#add-manual">Add a server manually</a></li>
              <li><a href="/docs#commands">Slash commands</a></li>
            </ul>
          </div>
          <div class="foot-col">
            <h4>Run a network</h4>
            <ul>
              <li><a href="/operators">For operators</a></li>
              <li><a href="/self-host">Self-host Boson</a></li>
              <li><a href="/self-host/new-server">New server guide</a></li>
              <li><a href="/self-host/existing-irc">Add to your IRC server</a></li>
              <li><a href="/operators#how">List your network</a></li>
              <li><a href="/operators#community">Join {COMMUNITY.channel}</a></li>
            </ul>
          </div>
          <div class="foot-col">
            <h4>Project</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/about#security">Security model</a></li>
              <li><a href="https://github.com/boson-chat/boson" rel="noopener">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div class="row-between foot-base">
          <span>© Boson · 2026 · A directory and a client.</span>
          <span class="meta">Built on IRC. RFC 1459 · RFC 2812 · IRCv3.</span>
        </div>
      </div>
    </footer>
  );
}
