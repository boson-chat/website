import { Badge, Card } from '@boson/shared';
import { Step, Steps } from '../components/StepList/StepList';
import { Terminal, Line, C } from '../components/Terminal/Terminal';
import { DIRECTORY_URL, LIST_NETWORK_URL, joinUrl } from './discover/directory';
import './OperatorsPage.css';

// For people who run an IRC server: why and how to list it in the network
// directory (directory.boson.chat), and where to find us. The steps follow
// the directory's own flow (boson-chat/directory ui/src/routes/me/new,
// NetworkForm.svelte, DnsSteps.svelte and its README's Verification section).

const DIRECTORY_HOST = new URL(DIRECTORY_URL).host;

/** The Boson community network, as it's listed in the directory. */
const COMMUNITY = { hostname: 'irc.boson.chat', port: 6697, tls: true, name: 'Boson', channel: '#lobby' };

const WHY = [
  {
    title: 'Found where people look',
    body: `Listed networks show up in the directory inside the Boson app and on ${DIRECTORY_HOST}, searchable by name, topic and language.`,
  },
  {
    title: 'One-click joins',
    body: 'Every listing has an “Open in Boson” link. One click opens the app and connects, with no host, port or nick to type.',
  },
  {
    title: 'Your own look',
    body: 'Add an icon, a banner and your network’s theme, with a light and a dark version. Cards and the app show your colours.',
  },
  {
    title: 'Health and user counts',
    body: 'The directory checks your server every 15 minutes and shows whether it’s online and how many people are on it.',
  },
  {
    title: 'Federated',
    body: 'Other directories can import your listing, so people see it there too. Each one checks your DNS record for itself.',
  },
  {
    title: 'Free, and nothing to install',
    body: 'Listing costs nothing and needs no Boson software on your server. You prove the hostname is yours with one DNS record.',
  },
];

export function OperatorsPage() {
  return (
    <>
      <section class="section ops-hero">
        <div class="container">
          <p class="eyebrow">For network operators</p>
          <h1>Run an IRC server? Put it in the directory.</h1>
          <p class="lead" style="margin-top: 20px;">
            Boson users find networks through the directory at {DIRECTORY_HOST}. List yours with a
            Boson account and a DNS record, and come say hi in <span class="num">{COMMUNITY.channel}</span>{' '}
            on {COMMUNITY.hostname}.
          </p>
          <div class="hero-cta" style="margin-top: 28px;">
            <a class="btn btn-primary" href={LIST_NETWORK_URL}>List your network</a>
            <a class="btn btn-secondary" href="#community">Join the community</a>
          </div>
        </div>
      </section>

      <section class="section" id="why">
        <div class="container stack" style="gap: 48px;">
          <div style="max-width: 40ch;">
            <p class="eyebrow">Why list</p>
            <h2>More people, fewer port numbers.</h2>
          </div>
          <ul class="ops-why">
            {WHY.map((w) => (
              <li key={w.title}>
                <Card variant="raised">
                  <div class="ops-why-inner">
                    <h3>{w.title}</h3>
                    <p>{w.body}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section class="section" id="any-daemon">
        <div class="container ops-split">
          <div>
            <p class="eyebrow">Any IRC daemon</p>
            <h2>Keep the server you have.</h2>
          </div>
          <div class="ops-prose">
            <p>
              Listing doesn’t need Boson software on your server. InspIRCd, UnrealIRCd, Ergo, Solanum,
              ngIRCd: if people can reach it, it can be listed. The directory only looks at DNS for
              ownership and connects like a client for health checks.
            </p>
            <p>
              For the Boson app to sign people in, the server needs what it needs from any network:
              TLS with a certificate from a public CA, and SASL for account login. Details are in{' '}
              <a class="docs-link" href="/docs#ref-tls">TLS &amp; ports</a> and{' '}
              <a class="docs-link" href="/docs#ref-sasl">SASL requirements</a>.
            </p>
          </div>
        </div>
      </section>

      <section class="section" id="how">
        <div class="container stack" style="gap: 48px;">
          <div class="row-between">
            <div style="max-width: 40ch;">
              <p class="eyebrow">How listing works</p>
              <h2>Four steps, about ten minutes.</h2>
            </div>
            <a class="btn btn-primary" href={LIST_NETWORK_URL}>List your network</a>
          </div>
          <div class="ops-steps">
          <Steps>
            <Step index="01" title="Sign in.">
              Go to {DIRECTORY_HOST} and sign in with your Boson account. Browsing needs no account;
              listing does.
            </Step>
            <Step index="02" title="Add your network.">
              Hostname, port and TLS, then a name, a description, topics, languages, a website and
              the 18+ flag if it applies. The listing stays hidden until the DNS check passes.
            </Step>
            <Step index="03" title="Publish the TXT record.">
              The directory gives you a record for <span class="num">_boson.&lt;hostname&gt;</span>{' '}
              with the value <span class="num">boson-verify=&lt;token&gt;</span>. Add it at your DNS
              provider within 72 hours.
            </Step>
            <Step index="04" title="Check it.">
              Press “Check DNS now”. Cloudflare, Google and Quad9 must all see the record the first
              time; then the listing is live.
            </Step>
          </Steps>
          </div>
          <div class="ops-record">
            <Terminal ariaLabel="Example DNS TXT record for irc.example.org and the dig command that checks it">
              <Line><C tone="cmt">; at your DNS provider, for irc.example.org (TTL 300 keeps the wait short)</C></Line>
              <Line>
                _boson.irc.example.org. &nbsp;300 &nbsp;IN &nbsp;TXT &nbsp;<C tone="str">"boson-verify=&lt;token&gt;"</C>
              </Line>
              <Line> </Line>
              <Line><C tone="cmt">; see what the world sees</C></Line>
              <Line prompt>dig +short TXT _boson.irc.example.org</Line>
            </Terminal>
            <div class="ops-notes">
              <p>
                <strong>Leave the record in place.</strong> Verified listings are re-checked daily.
                If the record is gone for 14 days the listing lapses and hides; it comes back by
                itself once the record does.
              </p>
              <p>
                <strong>Then make it yours.</strong> From <span class="num">My networks</span> on{' '}
                {DIRECTORY_HOST} you can add an icon, a banner and your theme, and edit the listing
                any time.
              </p>
              <p class="ops-soon">
                <Badge tone="warn">Coming soon</Badge> Self-hosted Boson stacks will be able to
                register from their admin panel later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="community">
        <div class="container ops-split">
          <div>
            <p class="eyebrow">Join the community</p>
            <h2>Talk to us on IRC.</h2>
            <p class="lead" style="margin-top: 16px;">
              Questions about listing, a feature you want for your network, or just to say hello:
              we’re in <span class="num">{COMMUNITY.channel}</span> on {COMMUNITY.hostname}.
            </p>
            <div class="hero-cta" style="margin-top: 24px;">
              <a class="btn btn-primary" href={joinUrl(COMMUNITY)}>Open in Boson</a>
              <a class="btn btn-ghost btn-arrow" href="/download">Get the app</a>
            </div>
          </div>
          <div class="ops-conn">
            <dl aria-label="Connection details">
              <div><dt>Server</dt><dd class="num">{COMMUNITY.hostname}</dd></div>
              <div><dt>Port</dt><dd class="num">{COMMUNITY.port}</dd></div>
              <div><dt>TLS</dt><dd class="num">on</dd></div>
              <div><dt>Channel</dt><dd class="num">{COMMUNITY.channel}</dd></div>
            </dl>
            <p class="ops-conn-note">Any IRC client works. In Boson, “Open in Boson” connects you; then join {COMMUNITY.channel}.</p>
          </div>
        </div>
      </section>

      <section class="section cta-strip">
        <div class="container">
          <h2>Ready when your DNS is.</h2>
          <p class="lead">
            Sign in at {DIRECTORY_HOST}, add your network and publish one TXT record. It shows up in
            the app as soon as the check passes.
          </p>
          <div class="hero-cta" style="justify-content: center;">
            <a class="btn btn-primary" href={LIST_NETWORK_URL}>List your network</a>
            <a class="btn btn-secondary" href="/discover">See who’s listed</a>
          </div>
        </div>
      </section>
    </>
  );
}
