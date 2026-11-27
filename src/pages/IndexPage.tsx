import { Card } from '@boson/shared';
import { FeatureCard } from '../components/FeatureCard/FeatureCard';
import { ScreenshotFrame } from '../components/ScreenshotFrame/ScreenshotFrame';
import { Step, Steps } from '../components/StepList/StepList';
import { Terminal, Line, C } from '../components/Terminal/Terminal';
import { useLatestRelease, versionLabel } from '../hooks/useLatestRelease';
import './IndexPage.css';
import './OperatorsPage.css';

export function IndexPage() {
  const release = useLatestRelease();
  return (
    <>
      <section class="section hero">
        <div class="container hero-split">
          <div>
            <span class="hero-availability">
              <span class="badge-dot" />
              Early access · {versionLabel(release)} · macOS, Windows, Linux, Android, Web
            </span>
            <h1>A modern chat client. On infrastructure you can host.</h1>
            <p class="lead" style="margin-top: 20px;">
              Channels, DMs, replies and threads, reactions, voice and video, file uploads and
              notifications: the things you expect. Underneath it's IRC, an open protocol: join any
              network, or run Boson's own server stack on your domain, so the network stays boring,
              open, and yours.
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
            <FeatureCard title="One account, many servers." icon={<LockIcon />}>
              Sign in once. Boson servers let you in with a short-lived token, not your password,
              and other Boson servers take you as <span class="num">alice@boson.chat</span> without a
              new sign-up. Logins you save for other networks are encrypted on your device before
              they sync.
            </FeatureCard>
            <FeatureCard title="An open protocol underneath." icon={<ProtocolIcon />}>
              Networks run Ergo, InspIRCd, UnrealIRCd, ngIRCd or any other IRC server: a
              38-year-old standard with a dozen independent implementations. No proprietary
              protocol, no vendor lock-in, and your existing CLI clients keep working too.
            </FeatureCard>
            <FeatureCard title="A directory, not a walled garden." icon={<GlobeIcon />}>
              Operators list their network with a DNS TXT record, and directories federate with
              each other. Users browse by topic, language, and activity. If we vanish tomorrow,
              the networks keep running.
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
            <li><strong>Desktop, Android and the web app</strong> share the same calls: voice, camera, lip-synced video. The Linux app watches video but doesn't send a camera yet; iOS is in testing.</li>
            <li><strong>Phones and browsers cancel echo</strong> with their own voice processing, so the loudspeaker is fine. In the desktop app, use headphones.</li>
            <li><strong>Screen sharing</strong> from macOS, Windows and the web app, with its sound on macOS 13+.</li>
            <li><strong>Private calls:</strong> call a friend one to one, on the same network. It rings while their app is open.</li>
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
            <Step index="01" title="Install the app, or open it in your browser.">
              Create a boson.chat account, sign in to another Boson server, or continue as a guest.
              The web app at chat.boson.chat needs no install at all.
            </Step>
            <Step index="02" title="Pick a server from the directory.">
              Search by topic, language, or activity, and click Connect. Boson signs you in where
              it can (your account on Boson servers, your saved NickServ login elsewhere) and joins
              the network's channels.
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
              <h2 style="margin-bottom: 20px;">Servers never need your password.</h2>
              <p class="lead" style="margin-bottom: 24px;">
                Your password stays with your account's own server. Everything else gets something
                that expires, or something it can't read.
              </p>
              <ul class="privacy-list">
                <li>Boson servers sign you in to IRC, voice and uploads with short-lived tokens.</li>
                <li>On another Boson server, your home server vouches for you with a signed, short-lived assertion; your password never goes there.</li>
                <li>NickServ and bouncer logins you save for other networks are encrypted on your device with your identity key. boson.chat stores only ciphertext, so your other devices can sync them and nobody else can read them.</li>
                <li>Push notifications are encrypted by the server to your device's own key: the push relay, Apple, Google and browser vendors can't read them.</li>
              </ul>
              <p class="privacy-tradeoff">
                Forgot your password? Reset it by email. Your identity key is a separate lock: it
                opens with the password it was locked with, or with the{' '}
                <strong>one-time recovery code</strong> you saved. Lose <em>both</em> and the saved logins are gone. We can't open them for you,
                by design.
              </p>
            </div>
            <Terminal ariaLabel="How the identity key protects saved logins">
              <Line><C tone="cmt"># at sign-up, on your device</C></Line>
              <Line>
                <C tone="key">identity_key</C> := <C tone="fn">random</C>(32)
              </Line>
              <Line>
                <C tone="key">kek</C> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:= <C tone="fn">argon2id</C>(password)
              </Line>
              <Line>
                <C tone="key">wrapped</C> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:= <C tone="fn">seal</C>(kek, identity_key)
              </Line>
              <Line><C tone="cmt">// → kept with your account; a recovery code wraps it too</C></Line>
              <Line />
              <Line><C tone="cmt"># saving a NickServ login for a network</C></Line>
              <Line>
                <C tone="key">creds_key</C> &nbsp;&nbsp;:= <C tone="fn">hmac_sha256</C>(
              </Line>
              <Line>&nbsp;&nbsp;identity_key,</Line>
              <Line>
                &nbsp;&nbsp;<C tone="str">"nickserv-creds-v1"</C> || <C tone="acc">server_id</C>,
              </Line>
              <Line>)</Line>
              <Line>
                <C tone="key">blob</C> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:= <C tone="fn">aes_gcm</C>(creds_key, login)
              </Line>
              <Line><C tone="cmt">// → synced; only your devices can open it</C></Line>
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
                  <li>Channels, DMs, replies and threads, reactions, read markers, search, uploads and push notifications: the things a modern chat app is supposed to have.</li>
                  <li>Voice and video channels, on networks that run a voice server.</li>
                  <li>Server discovery and topic search across federated directories of independent IRC networks.</li>
                  <li>One account across Boson servers, and saved logins for other networks that sync end-to-end encrypted.</li>
                  <li>An app that just works without you ever needing to know what SASL is.</li>
                </ul>
              </div>
            </Card>
            <Card>
              <div class="compare-inner">
                <h4>What it doesn't try to be</h4>
                <ul>
                  <li>A parallel chat protocol. Messages are plain IRC; replies, reactions and read markers use IRCv3 message tags, and replies carry a quoted text line so classic clients can follow them. Voice and video run beside IRC on separate open servers, not inside it.</li>
                  <li>A hosting company. boson.chat runs one network; for your own community, install the open-source Boson stack on your server, or keep the IRC server you have.</li>
                  <li>A key escrow. A password reset gets you back into your account, but only your password or your recovery code opens your identity key.</li>
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
            No accounts to buy, no seats to count. Run the Boson stack with one command, or bring
            the IRC server you already have, list it with a DNS record, and your network is in the
            directory next time you open the app.
          </p>
          <div class="hero-cta" style="justify-content: center;">
            <a class="btn btn-primary" href="/download">Download Boson</a>
            <a class="btn btn-secondary" href="/self-host">Read the self-host guide</a>
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
