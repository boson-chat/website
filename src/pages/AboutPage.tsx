import { Card } from '@boson/shared';
import { useScrollSpy } from '../hooks/useScrollSpy';
import './AboutPage.css';

interface TocEntry {
  id: string;
  label: string;
  index: string;
}

const TOC: TocEntry[] = [
  { id: 'problem', index: '01', label: 'The problem' },
  { id: 'design', index: '02', label: 'Design decisions' },
  { id: 'security', index: '03', label: 'Security model' },
  { id: 'not-doing', index: '04', label: "What we won't build" },
  { id: 'free', index: '05', label: 'On being free' },
  { id: 'roadmap', index: '06', label: 'Where we are' },
  { id: 'who', index: '07', label: 'Who made this' },
];

const TOC_IDS = TOC.map((entry) => entry.id);

export function AboutPage() {
  const active = useScrollSpy(TOC_IDS);
  return (
    <>
      <section class="section essay-section">
        <div class="container">
          <div class="essay-grid">
            <aside class="essay-toc">
              <h4>In this piece</h4>
              <ul>
                {TOC.map((entry) => (
                  <li key={entry.id}>
                    <a
                      href={`#${entry.id}`}
                      class={active === entry.id ? 'active' : undefined}
                      aria-current={active === entry.id ? 'location' : undefined}
                    >
                      <span class="toc-counter">{entry.index}</span>
                      {entry.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            <article class="essay">
              <div class="essay-meta">
                <span>About</span>
                <span>·</span>
                <span>Updated 2026-11-27</span>
                <span>·</span>
                <span>5 min read</span>
              </div>
              <h1>Why a modern chat client, in 2026?</h1>
              <p class="essay-lead">
                Because the people you want to talk to no longer use the clients that existed for
                this. They use products that work, and the open networks have spent two decades
                hoping users would put up with config files. Boson is the client that doesn't.
              </p>

              <h2 id="problem">The problem we're solving.</h2>
              <p>
                There is a protocol that has been carrying group chat reliably since 1988. It is
                small, well-specified, federated, self-hostable, and supported by a dozen
                independent server implementations. None of that has changed.
              </p>
              <p>
                What changed is that almost nobody is on it any more. The people you actually want
                to talk to have moved to vendor-hosted products — chat apps that demand an account
                on a single company's servers, that go down when that company goes down, and that
                gate access to the conversation behind that company's continued goodwill.
              </p>
              <p>
                The reason isn't that the vendor products are technically better. It's that they
                have usable clients, and the open networks have nearly four decades of clients that
                ship with a config file. <strong>The protocol is fine. The product is the
                problem.</strong>
              </p>

              <div class="pull-quote">
                Boson is what happens when you take the protocol as given, and admit that the
                client is what's been missing.
              </div>

              <h2 id="design">Design decisions, in plain words.</h2>

              <h3>1. Hide the plumbing.</h3>
              <p>
                If you're a normal user, you should never see the letters <span class="num">SASL</span>.
                You shouldn't have to pick a nick separate from your username. You shouldn't have to
                know that <span class="num">/msg NickServ identify</span> is a thing — you shouldn't
                even know there's a thing called NickServ. The app handles all of that on your
                behalf, every time it connects.
              </p>
              <p>
                If you're a power user who already lives in <span class="num">weechat</span> or{' '}
                <span class="num">irssi</span>, those keep working — Boson doesn't claim your
                servers, it just gives you a nicer way in. That isn't an escape hatch; it's a
                load-bearing feature. The day Boson stops being the best client for these networks
                is the day you can leave without losing anything.
              </p>

              <h3>2. Keep secrets where they belong.</h3>
              <p>
                Your password stays with your account's own server. Boson servers sign you in to
                IRC, voice and uploads with short-lived tokens; another Boson server gets your home
                server's signed word that you're you, never your password.
              </p>
              <p>
                The logins you save for other networks (NickServ passwords, bouncers) are a different
                kind of secret, so they get a different lock: an identity key made on your device,
                which encrypts them before they sync. boson.chat holds that key only in encrypted
                form. The honest part: we can reset your account password by email, but we can't
                open that key for you. Your password opens it, and so does the one-time recovery
                code you save; lose both and the saved logins are gone for good.
              </p>

              <h3>3. Index the open network, and make running your own easy.</h3>
              <p>
                boson.chat runs one network, on the same open-source stack anyone can install with
                one command. Everyone else's networks are theirs: operators add a TXT record and
                they're in the directory, and directories federate with each other. If we vanish
                tomorrow, those networks keep running, Boson servers keep signing their own people
                in, and your <span class="num">weechat</span> setup keeps working.
              </p>
              <p>
                This is the part that took the longest to get right. The temptation is always to
                hold more — host everyone's daemons, run a "platform server," become the thing
                instead of the thing-finder. We resisted, and we're going to keep resisting.
              </p>

              <h2 id="security">The security model in one diagram.</h2>
              <p>
                Two things have to stay true for this to be honest. First, boson.chat can't read
                the logins you save for other networks. Second, a server you sign in to never needs
                your password. Here's who holds what:
              </p>

              <div class="security-grid">
                <Card>
                  <div class="sec-card-inner">
                    <h4>What boson.chat holds</h4>
                    <p>
                      Your account: email, username and a password hash. Your saved servers and
                      synced settings. Your 32-byte identity key and your saved logins,{' '}
                      <strong>only encrypted</strong>, with a key we don't possess and can't
                      derive.
                    </p>
                  </div>
                </Card>
                <Card>
                  <div class="sec-card-inner">
                    <h4>What you hold</h4>
                    <p>
                      Your password, and your recovery code. On your device, Argon2id turns the
                      password into the key that unlocks the identity key; from the identity key,
                      HMAC derives a separate key per network for its saved login.{' '}
                      <strong>IRC servers get tokens, not your password.</strong>
                    </p>
                  </div>
                </Card>
              </div>
              <p class="essay-fine">
                The Boson client is open source. The derivation, the storage path, the keychain
                bindings — all readable, all auditable. If you're the kind of person who wants to
                read it before trusting it, that's exactly the kind of person we want reading it.
              </p>

              <h2 id="not-doing">What we're deliberately not doing.</h2>
              <ul>
                <li>
                  <strong>A parallel metadata layer.</strong> Replies, threads, reactions and read
                  markers ride on IRCv3 message tags, on the IRC connection itself, and replies keep
                  a quoted text line for classic clients. We are not going to build a hidden layer
                  that secretly turns Boson into a non-IRC service that happens to use IRC for text
                  transport. Voice and video, where a network offers them, run on separate
                  open-source servers beside IRC — the text stays plain IRC, readable from any
                  client.
                </li>
                <li>
                  <strong>Hosting everyone's servers.</strong> boson.chat runs one network; for your
                  own, there's the stack to install. We've sketched a hosted offering for later —
                  it's deferred, deliberately, until the directory side is solid.
                </li>
                <li>
                  <strong>A key backdoor.</strong> A password reset gets you back into your account,
                  but we never hold a key to your identity key, so we can't open your saved logins.
                  Recovery rides on a one-time code you save — never a switch we can flip.
                </li>
                <li>
                  <strong>Cross-server social graphs.</strong> Profiles and friends, yes: friends
                  live with your account on its own network, for calling each other. A
                  search-engine-grade graph of who-talks-to-whom across networks, no.
                </li>
              </ul>

              <h2 id="free">On being free.</h2>
              <p>
                Boson is free right now, and we don't know what comes after. We don't want to lie
                about that. The likely path is a paid tier for self-hosters who'd rather have us
                run the IRC daemon for them — but that's months out, conditional on the directory
                side being healthy.
              </p>
              <p>
                What is <em>not</em> the plan: charging end users, monetizing identity, ads, "AI
                features," selling the directory data, or any other variation on extracting rent
                from people who showed up to chat with their friends.
              </p>

              <h2 id="roadmap">Where we are.</h2>
              <ol class="roadmap">
                <li class="shipped">
                  <span class="when">Shipped</span>
                  <span>
                    <strong>v0.0.x — first public builds.</strong> Multi-server IRC chat, server
                    directory, guest mode, channel topics, away tracking, bundled engine sidecar,
                    macOS &amp; Windows &amp; Linux installers.
                  </span>
                </li>
                <li class="shipped">
                  <span class="when">Shipped</span>
                  <span>
                    <strong>v0.55 – v0.81 — talk, not just type.</strong> Voice channels on desktop
                    and phones, cameras with lip sync, screen sharing on desktop, guests in calls,
                    file uploads, network themes, channel registration, and an Android app (APK).
                  </span>
                </li>
                <li class="shipped">
                  <span class="when">Shipped</span>
                  <span>
                    <strong>v0.82 – v0.104 — a chat app, everywhere.</strong> The web app at
                    chat.boson.chat, friends and private calls, read markers, search, reactions,
                    replies and threads, message deletion, browser push, and "Continue as
                    alice@boson.chat" on other Boson servers.
                  </span>
                </li>
                <li class="shipped">
                  <span class="when">Shipped</span>
                  <span>
                    <strong>The Boson stack 1.0, for anyone.</strong> The server side boson.chat
                    runs on — IRC, accounts, the web app, voice, video, files, push, a directory and
                    an admin panel — on your own domain with one command, or next to the IRC server
                    you already run. Versioned releases, with updates, backups and rollback from the
                    admin panel.
                  </span>
                </li>
                <li>
                  <span class="when">Next</span>
                  <span>
                    <strong>Phones, further.</strong> The iOS app out of testing, phone push in the
                    builds you can download, and screen sharing from phones.
                  </span>
                </li>
                <li>
                  <span class="when">After</span>
                  <span>
                    <strong>The desktop app, further.</strong> Push while it's closed, echo
                    cancellation, and sending a camera and screen from Linux.
                  </span>
                </li>
                <li>
                  <span class="when">Later</span>
                  <span>
                    <strong>Hosted Boson servers.</strong> The paid path. Conditional on the
                    directory being healthy, the protocol stays the same.
                  </span>
                </li>
              </ol>

              <h2 id="who">Who made this.</h2>
              <p>
                A small team that's been on Discord, Slack, IRC, Matrix, XMPP, and most of the
                things in between, and is tired of having to pick. If you want to help — read the
                code, run an IRCd, register it, tell us what we got wrong.
              </p>
              <p class="essay-signoff">
                — The Boson team ·{' '}
                <a class="num" href="https://github.com/boson-chat/boson" rel="noopener">
                  github.com/boson-chat/boson
                </a>{' '}
                · <a href="mailto:hi@boson.chat">hi@boson.chat</a>
              </p>
            </article>
          </div>
        </div>
      </section>

      <section class="section cta-strip about-cta">
        <div class="container">
          <h2 style="margin-bottom: 16px;">Try Boson.</h2>
          <p class="lead">
            A 10 MB download on desktop, or nothing at all in your browser. About a minute from
            install to first message. Free, and if it ever isn't, we'll tell you on this page
            first.
          </p>
          <div class="hero-cta" style="justify-content: center;">
            <a class="btn btn-primary" href="/download">Download Boson</a>
            <a class="btn btn-secondary" href="/docs#host-start">List your server</a>
          </div>
        </div>
      </section>
    </>
  );
}
