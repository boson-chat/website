import { useEffect, useState } from 'preact/hooks';
import { Card, Badge } from '@boson/shared';
import { Terminal, Line, C } from '../components/Terminal/Terminal';
import { useLatestRelease, versionLabel } from '../hooks/useLatestRelease';
import './DownloadPage.css';

type DetectedOS = 'mac' | 'windows' | 'linux' | 'android' | 'ios' | null;

/**
 * Best-effort OS detection from navigator. Runs after hydration so the
 * initial paint shows no "Recommended" badge anywhere — better to skip
 * the highlight for one frame than to highlight the wrong card on every
 * visit. Modern browsers expose userAgentData with a structured platform
 * field; older ones still hand us a userAgent string we can sniff.
 */
function detectOS(): DetectedOS {
  if (typeof navigator === 'undefined') return null;
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  const platform = (uaData?.platform ?? navigator.platform ?? '').toLowerCase();
  const ua = (navigator.userAgent ?? '').toLowerCase();
  // Phones first: Android reports Linux, and iOS says "like Mac OS X".
  if (platform.includes('android') || ua.includes('android')) return 'android';
  if (/iphone|ipad|ipod/.test(ua) || (platform.includes('mac') && navigator.maxTouchPoints > 1)) return 'ios';
  if (platform.includes('mac') || ua.includes('mac os')) return 'mac';
  if (platform.includes('win') || ua.includes('windows')) return 'windows';
  if (platform.includes('linux') || ua.includes('linux')) return 'linux';
  return null;
}

// Repo + download URL templates. Versionless paths (releases/latest/...)
// are what we hand visitors so each link keeps working across every
// future release; the eyebrow / changelog row pull the actual
// version+date from the live GitHub Releases API via useLatestRelease.
const REPO_URL = 'https://github.com/boson-chat/boson';
const LATEST_URL = `${REPO_URL}/releases/latest`;
const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
const WEB_APP_URL = 'https://chat.boson.chat';
const DL = (name: string) => `${REPO_URL}/releases/latest/download/${name}`;

export function DownloadPage() {
  // useState seeded with null so SSR / first-paint HTML has no card
  // marked "Recommended". useEffect kicks in on the client only and
  // re-renders with the detected OS so the matching card lights up.
  const [os, setOS] = useState<DetectedOS>(null);
  useEffect(() => { setOS(detectOS()); }, []);
  const release = useLatestRelease();
  const releaseUrl = release.source === 'github'
    ? release.url
    : LATEST_URL;
  const wrapClass = (target: DetectedOS) =>
    `dl-card-wrap${os === target ? ' featured' : ''}`;
  const cardVariant = (target: DetectedOS) => (os === target ? 'raised' : undefined);
  const recommended = (target: DetectedOS) =>
    os === target ? <Badge tone="info">Recommended for your OS</Badge> : null;
  return (
    <>
      <section class="section hero download-hero">
        <div class="container" style="max-width: 720px;">
          <p class="eyebrow">
            Download · {versionLabel(release)}{release.releaseDate ? ` · ${release.releaseDate}` : ''}
          </p>
          <h1>Get Boson.</h1>
          <p class="lead" style="margin-top: 20px;">
            A native app for macOS, Windows, and Linux — and Android — with the Go IRC engine
            built in. Pick your platform; assets live on the GitHub release page. Or skip the
            install and <a href={WEB_APP_URL} rel="noopener" class="dl-source-link">open Boson in your browser</a>.
          </p>
        </div>
      </section>

      <section class="section download-grid-section">
        <div class="container">
          <div class="dl-grid">
            <article class={wrapClass('mac')}>
              <Card variant={cardVariant('mac')}>
                <div class="dl-card">
                  <MacIcon />
                  {recommended('mac')}
                  <h3>macOS</h3>
                  <span class="dl-arch">12.0+ · Apple Silicon or Intel</span>
                  <div class="dl-actions">
                    <a class="btn btn-primary" href={DL('Boson-mac-arm64.dmg')} rel="noopener">
                      Apple Silicon (.dmg)
                    </a>
                    <a class="btn btn-secondary btn-sm" href={DL('Boson-mac-x64.dmg')} rel="noopener">
                      Intel (.dmg)
                    </a>
                  </div>
                  <span class="dl-bytes">
                    Signed &amp; notarized by Apple · see{' '}
                    <a href="#first-launch-macos">first-launch notes</a>
                  </span>
                </div>
              </Card>
            </article>

            <article class={wrapClass('windows')}>
              <Card variant={cardVariant('windows')}>
                <div class="dl-card">
                  <WinIcon />
                  {recommended('windows')}
                  <h3>Windows</h3>
                  <span class="dl-arch">x64 · Windows 10 / 11</span>
                  <div class="dl-actions">
                    <a class="btn btn-primary" href={DL('Boson-windows-x64.zip')} rel="noopener">
                      Download (.zip)
                    </a>
                  </div>
                  <span class="dl-bytes">Unzip and run Boson.exe · not yet code-signed, so SmartScreen will warn on first launch</span>
                </div>
              </Card>
            </article>

            <article class={wrapClass('linux')}>
              <Card variant={cardVariant('linux')}>
                <div class="dl-card">
                  <LinuxIcon />
                  {recommended('linux')}
                  <h3>Linux</h3>
                  <span class="dl-arch">x64 · GTK 4 &amp; WebKitGTK 6.0</span>
                  <div class="dl-actions">
                    <a class="btn btn-primary" href={DL('Boson-linux-x86_64.tar.gz')} rel="noopener">
                      Download (.tar.gz)
                    </a>
                  </div>
                  <span class="dl-bytes">The app, a .desktop entry and its icon. Calls: voice, and watching video; sending a camera or screen isn't in Linux builds yet</span>
                </div>
              </Card>
            </article>
          </div>
          <p class="meta dl-meta-row">
            Source:{' '}
            <a href={REPO_URL} rel="noopener" class="dl-source-link">
              github.com/boson-chat/boson
            </a>{' '}
            · <a class="num" href={releaseUrl} rel="noopener">{versionLabel(release)}</a>
            {release.releaseDate ? ` tagged ${release.releaseDate}` : ''} · AGPL-3.0
          </p>
        </div>
      </section>

      <section class="section" id="phones">
        <div class="container stack" style="gap: 40px;">
          <div style="max-width: 46ch;">
            <p class="eyebrow">On your phone, or in a browser</p>
            <h2>Android now. iPhone soon. The web today.</h2>
          </div>
          <div class="dl-grid">
            <article class={wrapClass('android')}>
              <Card variant={cardVariant('android')}>
                <div class="dl-card">
                  <AndroidIcon />
                  {recommended('android')}
                  <h3>Android</h3>
                  <span class="dl-arch">8.0+ · arm64 or x86_64</span>
                  <div class="dl-actions">
                    <a class="btn btn-primary" href={DL('Boson-android.apk')} rel="noopener">
                      Download (.apk)
                    </a>
                  </div>
                  <span class="dl-bytes">
                    Not on Google Play yet: allow installs from your browser or file manager when
                    Android asks. Later updates install from inside the app. Push notifications
                    aren't in this build yet.
                  </span>
                </div>
              </Card>
            </article>
            <article class="dl-card-wrap">
              <Card>
                <div class="dl-card">
                  <AppleMobileIcon />
                  <Badge tone="warn">Coming soon</Badge>
                  <h3>iPhone &amp; iPad</h3>
                  <span class="dl-arch">iOS 16+</span>
                  <span class="dl-bytes">
                    Coming soon to the App Store. Until then, the web app works in Safari on your
                    iPhone or iPad: nothing to install.
                  </span>
                </div>
              </Card>
            </article>
            <article class="dl-card-wrap" id="web">
              <Card>
                <div class="dl-card">
                  <WebIcon />
                  <h3>Web</h3>
                  <span class="dl-arch">Chrome, Edge, Firefox or Safari</span>
                  <div class="dl-actions">
                    <a class="btn btn-primary" href={WEB_APP_URL} rel="noopener">
                      Open in browser
                    </a>
                  </div>
                  <span class="dl-bytes">
                    Nothing to install. Join as a guest and land in #lobby, or sign in with your
                    boson.chat account and get push notifications with the tab closed. Calls need
                    Chrome, Edge or Firefox.
                  </span>
                </div>
              </Card>
            </article>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container stack" style="gap: 40px;">
          <div style="max-width: 38ch;">
            <p class="eyebrow">System requirements</p>
            <h2>Minimums, not aspirations.</h2>
          </div>
          <div class="reqs-grid">
            <div>
              <h3>macOS</h3>
              <ul>
                <li>macOS 12 Monterey or newer</li>
                <li>250 MB free disk</li>
                <li>Keychain access for credential storage</li>
                <li>Outbound TCP/TLS to your servers (port 6697 by default)</li>
                <li>Microphone / camera permission for calls</li>
              </ul>
            </div>
            <div>
              <h3>Windows</h3>
              <ul>
                <li>Windows 10 (build 19041+) or Windows 11</li>
                <li>250 MB free disk</li>
                <li>Credential Manager available (default)</li>
                <li>Microsoft Edge WebView2 (built into Windows 10/11)</li>
              </ul>
            </div>
            <div>
              <h3>Linux</h3>
              <ul>
                <li>GTK 4 and WebKitGTK 6.0 (Ubuntu 24.04+, Fedora 39+, Debian 13+)</li>
                <li>libsecret + Secret Service backend (GNOME Keyring, KWallet)</li>
                <li>Wayland or X11 supported</li>
              </ul>
            </div>
            <div>
              <h3>Web</h3>
              <ul>
                <li>A recent Chrome, Edge, Firefox or Safari</li>
                <li>Nothing to install; each visit runs the latest version</li>
                <li>Calls: Chrome, Edge or Firefox (WebTransport), with microphone / camera permission</li>
                <li>Signed in on a Boson server, you stay online after closing the tab; guests disconnect</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container stack" style="gap: 40px;">
          <div style="max-width: 38ch;">
            <p class="eyebrow">Verify your download</p>
            <h2>Three commands, one minute.</h2>
          </div>
          <div class="grid-2" style="gap: 48px; align-items: start;">
            <div>
              <h3 style="margin-bottom: 12px; font-size: 16px;">macOS · Linux</h3>
              <Terminal>
                <Line><C tone="cmt"># 1. compute the SHA-256 of the package you downloaded</C></Line>
                <Line prompt>shasum -a 256 Boson-mac-arm64.dmg</Line>
                <Line><C tone="ok">…</C> &nbsp;Boson-mac-arm64.dmg</Line>
                <Line />
                <Line><C tone="cmt"># 2. compare against the checksum on the release page</C></Line>
                <Line><C tone="cmt">#    {LATEST_URL}</C></Line>
                <Line />
                <Line><C tone="cmt"># 3. macOS: confirm Apple notarized it</C></Line>
                <Line prompt>spctl -a -vv /Applications/Boson.app</Line>
                <Line><C tone="ok">accepted</C> &nbsp;source=Notarized Developer ID</Line>
                <Line><C tone="cmt">#    signed by Developer ID team FJY7UPX884</C></Line>
              </Terminal>
            </div>
            <div>
              <h3 style="margin-bottom: 12px; font-size: 16px;">Windows (PowerShell)</h3>
              <Terminal>
                <Line><C tone="cmt"># 1. compute the SHA-256 hash</C></Line>
                <Line prompt>Get-FileHash Boson-windows-x64.zip -Algorithm SHA256</Line>
                <Line />
                <Line><C tone="cmt"># 2. compare against the checksum on the release page</C></Line>
                <Line><C tone="cmt">#    {LATEST_URL}</C></Line>
                <Line />
                <Line><C tone="cmt"># 3. not yet code-signed — SmartScreen will warn</C></Line>
                <Line><C tone="cmt">#    "More info" → "Run anyway" the first time</C></Line>
              </Terminal>
            </div>
          </div>
          <Card>
            <div class="checksum-block">
              <h4>Checksums</h4>
              <p style="margin: 0;">
                SHA-256 checksums (<span class="num">SHA256SUMS.txt</span>) and the full asset list are
                published on the GitHub release page:{' '}
                <a href={LATEST_URL} rel="noopener">{LATEST_URL}</a>
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section class="section" id="first-launch-macos">
        <div class="container stack" style="gap: 28px;">
          <div style="max-width: 42ch;">
            <p class="eyebrow">First launch on macOS</p>
            <h2>Opens like any other app.</h2>
          </div>
          <p style="max-width: 72ch;">
            Since v0.32.1, Boson for macOS is signed with an Apple Developer ID (team{' '}
            <span class="num">FJY7UPX884</span>) and notarized by Apple, so Gatekeeper lets it open
            without an "unverified developer" or "damaged" warning. Drag it to Applications and
            launch it — no right-click or Terminal workaround needed.
          </p>
          <div class="grid-2" style="gap: 32px; align-items: start;">
            <div>
              <h3 style="margin-bottom: 12px; font-size: 16px;">Upgrading from an earlier version</h3>
              <p class="muted" style="margin-bottom: 12px;">
                The app was rebuilt on a native webview, and earlier versions can't update
                themselves to it. Download it from this page once and replace{' '}
                <strong>Boson.app</strong> in /Applications, then sign in again. After that,
                updates install from inside the app.
              </p>
            </div>
            <div>
              <h3 style="margin-bottom: 12px; font-size: 16px;">Check it yourself</h3>
              <p class="muted" style="margin-bottom: 12px;">
                Gatekeeper's verdict on the installed app:
              </p>
              <Terminal>
                <Line prompt>spctl -a -vv /Applications/Boson.app</Line>
                <Line><C tone="ok">accepted</C> &nbsp;source=Notarized Developer ID</Line>
              </Terminal>
            </div>
          </div>
          <p class="muted" style="max-width: 72ch;">
            On Windows, SmartScreen will show a "Windows protected your PC" prompt the first time —
            click <strong>More info</strong> then <strong>Run anyway</strong>. Linux builds
            don't need any of this.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="container stack" style="gap: 40px;">
          <div class="row-between">
            <div style="max-width: 38ch;">
              <p class="eyebrow">Release notes</p>
              <h2>Recent builds.</h2>
            </div>
            <a class="btn btn-ghost btn-arrow" href={CHANGELOG_URL} rel="noopener">
              Full changelog
            </a>
          </div>
          <div>
            <ReleaseRow
              date={release.releaseDate || '—'}
              title={release.version ? `v${release.version} — latest` : 'The latest release'}
              platforms="macOS · Windows · Linux · Android"
            >
              The current build for desktop and Android. Multi-server IRC chat with replies, threads
              and reactions, the server directory, voice and video channels, uploads, guest mode and
              sign-in with your account on other Boson servers, with the Go IRC engine built in. See the{' '}
              <a href={releaseUrl} rel="noopener">release page</a> for the full asset list and
              the changelog entry for what's new.
            </ReleaseRow>
          </div>
        </div>
      </section>

      <section class="section cta-strip download-cta">
        <div class="container">
          <h2 style="margin-bottom: 20px;">Ready when you are.</h2>
          <p class="lead" style="margin-bottom: 32px;">
            The app is the same on every platform — pick whichever download matches the device
            you're on.
          </p>
          <div class="hero-cta" style="justify-content: center;">
            <a class="btn btn-primary" href={LATEST_URL} rel="noopener">
              See all platforms on GitHub
            </a>
            <a class="btn btn-secondary" href="/self-host">Self-hosting guide</a>
          </div>
        </div>
      </section>
    </>
  );
}

import type { ComponentChildren } from 'preact';

interface ReleaseRowProps {
  date: string;
  title: string;
  platforms: string;
  children: ComponentChildren;
}

function ReleaseRow({ date, title, platforms, children }: ReleaseRowProps) {
  return (
    <div class="release-row">
      <span class="meta">{date}</span>
      <div>
        <h3 class="release-title">{title}</h3>
        <p class="release-body">{children}</p>
      </div>
      <span class="meta release-platforms">{platforms}</span>
    </div>
  );
}

function MacIcon() {
  return (
    <svg class="os-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 1.2c0 1-.4 2-1 2.7-.7.8-1.8 1.4-2.9 1.3-.1-1 .4-2 1-2.7.7-.8 1.9-1.4 2.9-1.3zM20 17.6c-.6 1.4-1 2-1.7 3.2-1 1.7-2.4 3.7-4.1 3.7-1.5 0-1.9-.9-3.9-.9-2 0-2.5.9-3.9.9-1.7 0-3-1.9-4-3.6-2.7-4.4-3-9.5-1.3-12.2 1.2-1.9 3-3 4.8-3 1.7 0 2.8 1 4.3 1 1.4 0 2.2-1 4.3-1 1.6 0 3.2.9 4.4 2.4-3.8 2.1-3.2 7.6.1 9.5z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg class="os-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 16V11a7 7 0 0 1 14 0v5z" />
      <path d="M8 4.5 6.5 2.5M16 4.5l1.5-2M5 16v3.5M19 16v3.5M9.5 16v4.5M14.5 16v4.5" />
      <circle cx="9.5" cy="10" r="0.7" fill="currentColor" />
      <circle cx="14.5" cy="10" r="0.7" fill="currentColor" />
    </svg>
  );
}

function AppleMobileIcon() {
  return (
    <svg class="os-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="6.5" y="2" width="11" height="20" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

function WebIcon() {
  return (
    <svg class="os-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function WinIcon() {
  return (
    <svg class="os-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 5.5l8-1.1v7.5H3V5.5zm0 13l8 1.1v-7.5H3v6.4zm9-14.3L22 3v8.9H12V4.2zm0 9.7v7.9l10 1.4v-9.3H12z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg
      class="os-mark"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2c-2.5 0-4 2.2-4 5 0 1.5.4 2.6.4 3.6 0 1.1-.8 1.9-1.6 2.7C5.6 14.6 4 16 4 18c0 2 1.6 3 3 3h10c1.4 0 3-1 3-3 0-2-1.6-3.4-2.8-4.7-.8-.8-1.6-1.6-1.6-2.7 0-1 .4-2.1.4-3.6 0-2.8-1.5-5-4-5z" />
      <circle cx="10" cy="8" r="0.7" fill="currentColor" />
      <circle cx="14" cy="8" r="0.7" fill="currentColor" />
    </svg>
  );
}
