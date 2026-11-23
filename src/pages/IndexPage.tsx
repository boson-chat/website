import { Card } from '@boson/shared';
import { FeatureCard } from '../components/FeatureCard/FeatureCard';
import { ScreenshotFrame } from '../components/ScreenshotFrame/ScreenshotFrame';
import { Step, Steps } from '../components/StepList/StepList';
import { Terminal, Line, C } from '../components/Terminal/Terminal';
import { useLatestRelease } from '../hooks/useLatestRelease';
import './IndexPage.css';
import './OperatorsPage.css';

export function IndexPage() {
  const { version } = useLatestRelease();
  return (
    <>
      <section class="section hero">
        <div class="container hero-split">
          <div>
            <span class="hero-availability">
              <span class="badge-dot" />
              Early access · v{version} · macOS, Windows, Linux, Android, Web
            </span>
            <h1>A modern chat client. On infrastructure you can host.</h1>
            <p class="lead" style="margin-top: 20px;">
              Channels, DMs, voice and video channels, file uploads, notifications — the things you
              expect. Built on an open, federated protocol you can self-host, with identity and key
              derivation in the client so the network underneath stays boring, open, and yours.
            </p>
            <div class="hero-cta" style="margin-top: 28px;">
              <a class="btn btn-primary" href="/download">Download Boson</a>
              <a class="btn btn-secondary" href="https://chat.boson.chat" rel="noopener">Chat in your browser</a>
              <a class="btn btn-ghost btn-arrow" href="#how-it-works">How it works</a>
            </div>
            <p class="muted hero-web-note">
              Nothing to install. Guests can join without an account.
            </p>
            <div class="hero-meta" aria-label="Supported platforms">
              <span class="os">macOS 12+</span>
              <span class="os">Windows 10+</span>
              <span class="os">Linux (x64)</span>
              <span class="os">Android 8+ (APK)</span>
              <span class="os">Web (no install)</span>
            </div>
          </div>
          <ScreenshotFrame
            src="/screenshots/02-chat-readable.png"
            alt="Boson chat window showing a server with channels, message timeline, and member list."
            caption="CHAT · #dev · irc.nebula.example"
            width={1440}
            height={900}
            loading="eager"
          />
        </div>
      </section>

      <section class="section">
        <div class="container stack" style="gap: 56px;">
          <div style="max-width: 38ch;">
            <p class="eyebrow">What's different</p>
            <h2>Three decisions that shape the whole product.</h2>
          </div>
          <div class="grid-3">
            <FeatureCard title="One password, every server." icon={<LockIcon />}>
              Your platform password derives a unique credential for every server you join — via
              Argon2id + HMAC, in the local process. The directory never holds anything
              decryptable.
            </FeatureCard>
            <FeatureCard title="An open protocol underneath." icon={<ProtocolIcon />}>
              Servers run ergo, InspIRCd, or anything that speaks SASL over TLS — a 38-year-old
              standard with a dozen independent implementations. No proprietary protocol, no
              vendor lock-in, and your existing CLI clients keep working too.
            </FeatureCard>
            <FeatureCard title="A directory, not a walled garden." icon={<GlobeIcon />}>
              Self-hosters register their server with a DNS TXT record. Users browse by tag,
              language, and activity. If we vanish tomorrow, the network keeps running.
            </FeatureCard>
          </div>
        </div>
      </section>

      <section class="section" id="calls">
        <div class="container stack" style="gap: 56px;">
          <div class="row-between">
            <div style="max-width: 46ch;">
              <p class="eyebrow">Voice &amp; video</p>
              <h2>Drop into a voice channel. Turn on a camera if you like.</h2>
              <p class="lead" style="margin-top: 16px;">
                On networks that run a voice server, channels come with voice rooms: talk, share a
                camera or your screen, and see who's in before you join. Text stays plain IRC; calls
                run beside it on their own open-source servers.
              </p>
            </div>
            <a class="btn btn-ghost btn-arrow" href="/features#voice">What calls can do</a>
          </div>
          <div class="calls-row">
            <ScreenshotFrame
              src="/screenshots/feat-call.png"
              alt="A voice channel call on desktop: one camera large, the others in a strip, and the participant list on the right."
              caption="CALL · General · camera tiles"
              width={1440}
              height={900}
            />
            <ScreenshotFrame
              src="/screenshots/phone-call.png"
              alt="The same call on a phone: two camera tiles, a picture-in-picture self view and the call controls."
              caption="PHONE · the same call"
              width={786}
              height={1704}
              variant="phone"
            />
          </div>
          <ul class="calls-points">
            <li><strong>Desktop, Android and the web app</strong> share the same calls: voice, camera, lip-synced video. iOS is in testing.</li>
            <li><strong>Phones cancel echo</strong> with the system's own voice processing, so the loudspeaker is fine.</li>
            <li><strong>Screen sharing</strong> on desktop, with its sound on macOS 13+.</li>
            <li><strong>Guests can join</strong> where the network allows it, marked with a guest badge.</li>
          </ul>
        </div>
      </section>

      <section class="section" id="how-it-works">
        <div class="container stack" style="gap: 56px;">
          <div style="max-width: 38ch;">
            <p class="eyebrow">How it works</p>
            <h2>From install to first message in about a minute.</h2>
          </div>
          <Steps>
            <Step index="01" title="Install the app.">
              Sign in or create an account. The app generates a 32-byte secret on your machine and
              stores the encrypted form in your OS keychain.
            </Step>
            <Step index="02" title="Pick a server from the directory.">
              Search by tag, language, or activity. Click join — the client registers a nick over
              SASL using a password derived for that server.
            </Step>
            <Step index="03" title="Chat. The plumbing stays invisible.">
              Channels, DMs, notifications, member lists. No <code class="inline-code">/msg NickServ identify</code>,
              no manual nicks, no port numbers — unless you want them.
            </Step>
          </Steps>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="privacy-row">
            <div>
              <p class="eyebrow">Security &amp; privacy</p>
              <h2 style="margin-bottom: 20px;">We hold the ciphertext. You hold the key.</h2>
              <p class="lead" style="margin-bottom: 24px;">
                Boson generates a random secret on your device at signup. We store it encrypted
                with a key derived from your password — a key we can't reconstruct, even if we
                wanted to.
              </p>
              <p class="privacy-intro">
                Each server you join receives a unique, random-looking password. That means:
              </p>
              <ul class="privacy-list">
                <li>A breach on one server reveals nothing about your others.</li>
                <li>Server operators never see your platform password.</li>
                <li>You can switch any server to manual mode and walk away.</li>
              </ul>
              <p class="privacy-tradeoff">
                For the day you forget your password, enroll a <strong>one-time recovery code</strong> —
                an independent second wrap of the same secret. The trade-off is honest: lose
                <em> both</em> your password and your recovery code and the secret is gone — we can't
                reconstruct it. Per-server identity can still be reclaimed via NickServ.
              </p>
            </div>
            <Terminal ariaLabel="Per-server password derivation formula">
              <Line><C tone="cmt"># on signup, in the local Go process</C></Line>
              <Line>
                <C tone="key">user_secret</C> &nbsp;:= <C tone="fn">random</C>(32) &nbsp;&nbsp;<C tone="cmt">// never leaves the device</C>
              </Line>
              <Line>
                <C tone="key">kek</C> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:= <C tone="fn">argon2id</C>(password)
              </Line>
              <Line>
                <C tone="key">ciphertext</C> &nbsp;:= <C tone="fn">seal</C>(kek, user_secret)
              </Line>
              <Line><C tone="cmt">// → uploaded to the directory</C></Line>
              <Line />
              <Line><C tone="cmt"># when joining a server</C></Line>
              <Line>
                <C tone="key">server_pw</C> &nbsp;&nbsp;&nbsp;:= <C tone="fn">hmac_sha256</C>(
              </Line>
              <Line>&nbsp;&nbsp;user_secret,</Line>
              <Line>
                &nbsp;&nbsp;<C tone="str">"irc-password"</C> || <C tone="acc">server_id</C>,
              </Line>
              <Line>)</Line>
              <Line><C tone="cmt">// → handed to SASL, never displayed</C></Line>
            </Terminal>
          </div>
        </div>
      </section>

      <section class="section" id="gallery">
        <div class="container stack" style="gap: 56px;">
          <div class="row-between">
            <div style="max-width: 38ch;">
              <p class="eyebrow">Inside the app</p>
              <h2>Familiar shape. Different foundation.</h2>
            </div>
            <a class="btn btn-ghost btn-arrow" href="/download">Download to try it</a>
          </div>
          <div class="gallery">
            <ScreenshotFrame
              src="/screenshots/03-directory.png"
              alt="Server directory with public networks from two directories, language and topic filters."
              caption="DIRECTORY · two directories, one list"
              width={1440}
              height={900}
            />
            <ScreenshotFrame
              src="/screenshots/feat-screenshare.png"
              alt="A screen share of a code editor filling the call stage, with camera tiles underneath."
              caption="CALL · screen share (desktop)"
              width={1440}
              height={900}
            />
            <ScreenshotFrame
              src="/screenshots/feat-uploads.png"
              alt="The upload sheet with three images ready to send to #dev and the account's storage quota."
              caption="UPLOADS · several files at once"
              width={1440}
              height={900}
            />
            <ScreenshotFrame
              src="/screenshots/feat-network-theme.png"
              alt="A channel shown in a network's own theme: violet colours and a background picture behind the messages."
              caption="NETWORK THEMES · the network's own look"
              width={1440}
              height={900}
            />
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container stack" style="gap: 56px;">
          <div style="max-width: 42ch;">
            <p class="eyebrow">Why Boson</p>
            <h2>Modern shape, open plumbing. The trade-offs are deliberate.</h2>
          </div>
          <div class="compare">
            <Card>
              <div class="compare-inner">
                <h4>What you get</h4>
                <ul class="yes">
                  <li>Channels, DMs, notifications, member lists, uploads — the things a modern chat app is supposed to have.</li>
                  <li>Voice and video channels, on networks that run a voice server.</li>
                  <li>Server discovery and tag-based search across a directory of independent IRC networks.</li>
                  <li>Cryptographically isolated per-server identities, derived locally from one password.</li>
                  <li>An app that just works without you ever needing to know what SASL is.</li>
                </ul>
              </div>
            </Card>
            <Card>
              <div class="compare-inner">
                <h4>What it doesn't try to be</h4>
                <ul>
                  <li>A parallel chat protocol. Messages are plain IRC, so threads and reactions wait for IRC to carry them; voice and video run beside IRC on separate open servers, not inside it.</li>
                  <li>A hosted-server service. We index the open network; you bring your own daemon.</li>
                  <li>A server-side password reset. We can't see your secret — recovery rides on a one-time code you save, not a "forgot password" email.</li>
                  <li>Free forever as a promise. Free for now, as the truth.</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section class="section" id="operators">
        <div class="container ops-teaser">
          <div style="max-width: 60ch;">
            <p class="eyebrow">For network operators</p>
            <h2>Run an IRC server? List it where Boson users look.</h2>
            <p class="lead">
              Any IRC daemon can go in the directory: sign in with a Boson account, add your network
              and prove the hostname with a DNS record. Then come say hi in #lobby on irc.boson.chat.
            </p>
          </div>
          <div class="hero-cta">
            <a class="btn btn-primary" href="/operators">How listing works</a>
            <a class="btn btn-ghost btn-arrow" href="/operators#community">Join the community</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container quote-block">
          <blockquote>
            The protocol is fine. The product is the problem. Boson is what happens when you take
            the protocol as given, and admit that the client is what's been missing.
          </blockquote>
          <p class="quote-author">
            — from <a href="/about" class="quote-link">the project's design notes</a>
          </p>
        </div>
      </section>

      <section class="section cta-strip">
        <div class="container">
          <p class="eyebrow">Free, for now and the foreseeable</p>
          <h2>The chat is free. The plumbing is open. Bring your own server.</h2>
          <p class="lead">
            No accounts to buy, no seats to count. Self-host an IRC daemon, register over DNS, and
            your network is on the directory next time you open the app.
          </p>
          <div class="hero-cta" style="justify-content: center;">
            <a class="btn btn-primary" href="/download">Download Boson</a>
            <a class="btn btn-secondary" href="/docs">Read the self-host guide</a>
          </div>
        </div>
      </section>
    </>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function ProtocolIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="8" cy="7" r="0.8" fill="currentColor" />
      <circle cx="14" cy="12" r="0.8" fill="currentColor" />
      <circle cx="10" cy="17" r="0.8" fill="currentColor" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
