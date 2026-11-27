import { DataTable, GuideLayout, K, type TocGroup } from './selfhost/GuideLayout';
import { STACK_REPO } from './selfhost/common';
import './TelemetryPage.css';

// /telemetry: what Boson's anonymous usage & health stats are, what is and
// isn't sent, how long it's kept and how to turn it off. The source of truth
// is boson-chat/stack docs/telemetry.md (schema 1); keep this page in step
// with it.

const SPEC_URL = `${STACK_REPO}/blob/main/docs/telemetry.md`;

const TOC: TocGroup[] = [
  {
    title: 'Usage & health stats',
    items: [
      { id: 'why', label: 'Why we collect it' },
      { id: 'servers', label: 'From servers' },
      { id: 'apps', label: 'From apps' },
      { id: 'never', label: 'Never collected' },
      { id: 'kept', label: 'What we keep' },
      { id: 'opt-out', label: 'How to turn it off' },
    ],
  },
];

const BUCKETS = ['0', '1', '2-10', '11-50', '51-100', '101-500', '501-1k', '1k-5k', '5k+'];

export function TelemetryPage() {
  return (
    <GuideLayout
      eyebrow="Usage & health stats"
      title="What Boson sends us, and why."
      tabs={false}
      lead={
        <p>
          We collect a small amount of anonymous usage and health data to make Boson better: to
          see which versions and features people use, and to catch failed updates, crashes and
          struggling servers so we can fix them, often before anyone has to report them.
        </p>
      }
      toc={TOC}
    >
      <article class="doc-section" id="why">
        <p class="eyebrow">01</p>
        <h2>Why a small team needs it.</h2>
        <p>
          Boson is made by a few people. Without these numbers we can’t tell how many servers run
          Boson, or which versions they’re on, so we don’t know when a release breaks something,
          or when an old version is still widespread and needs care. We can’t see which features
          are worth our time, or when updates fail and servers run out of CPU, memory or disk.
        </p>
        <p>
          None of it identifies a person, a server or a network, and turning it off is one
          switch. Every field, its allowed values and the JSON schema are in the{' '}
          <a class="docs-link" href={SPEC_URL} rel="noopener">full spec on GitHub</a>.
        </p>
      </article>

      <article class="doc-section" id="servers">
        <p class="eyebrow">02 · What’s collected</p>
        <h2>From servers: the daily install report.</h2>
        <p>
          The admin panel of a self-hosted Boson server sends one report a day, at a random
          minute, to <K>telemetry.boson.chat</K>. It also sends one a few minutes after a new
          install first starts, and after each update or rollback, so a failed update shows up
          the same day.
        </p>
        <DataTable
          caption="What the install report contains"
          head={['', 'What it says']}
          rows={[
            ['Versions', 'The stack release and the version of each service (Ergo, auth, voice, the panel…).'],
            ['Features', 'Which parts are turned on (voice, video, uploads, directory, metrics…), and whether the install runs its own IRC server or sits in front of an existing one, and which kind (Ergo, UnrealIRCd, InspIRCd…). CPU architecture.'],
            ['Counts, bucketed', 'Accounts, people active in the last 7 and 30 days, peak IRC users, channels, and in the last 24 hours voice and video minutes, files uploaded and push notifications sent.'],
            ['Settings', 'Registration mode (open, invite, closed), whether guests are allowed, whether email is set up, the kind of single sign-on (OIDC, SAML…, never which provider), how many federation peers, whether it’s listed in a directory.'],
            ['Update health', 'Updates started, failed and rolled back in the last day, and for each failure the step it failed at (backup, download, migration, health check…), never the error text.'],
            ['Service health', 'Each service’s state (running, restarting, unhealthy…) and restart count.'],
            ['Host health', 'With the metrics profile: CPU (p95 and peak), memory, disk used and load, as percentages, and days since the host booted.'],
          ]}
        />
        <p>
          Every count is sent as a <strong>bucket</strong>, never an exact number:
        </p>
        <ul class="tm-buckets" aria-label="Buckets">
          {BUCKETS.map((b) => (
            <li key={b}><K>{b}</K></li>
          ))}
        </ul>
      </article>

      <article class="doc-section" id="apps">
        <p class="eyebrow">03 · What’s collected</p>
        <h2>From apps: one ping a day per device.</h2>
        <p>
          The Boson desktop, iOS, Android and web apps send one small ping a day, the first time
          the app is open after 24 hours:
        </p>
        <DataTable
          caption="What the app ping contains"
          head={['', 'What it says']}
          rows={[
            ['App version', 'For example 0.106.0.'],
            ['Platform', 'macOS, Windows, Linux, iOS, Android or web.'],
            ['Build channel', 'Stable, beta or a development build.'],
            ['Crashes', 'How many times the app crashed since the last ping.'],
            ['Servers', 'How many servers the app is connected to, bucketed, never which.'],
          ]}
        />
      </article>

      <article class="doc-section" id="never">
        <p class="eyebrow">04</p>
        <h2>Never collected.</h2>
        <p>Not in any field, not in logs, not stored:</p>
        <ul>
          <li>usernames, nicks, real names, emails or account IDs;</li>
          <li>channel names, topics, message content, per-person counts or who talks to whom;</li>
          <li>IP addresses, hostnames, domains, network names or URLs;</li>
          <li>secrets: passwords, tokens, keys, <K>.env</K> values, SSO client IDs;</li>
          <li>free-text error messages or logs.</li>
        </ul>
        <p>
          <strong>Country</strong> is looked up from the IP address while the report arrives,
          in an offline database (DB-IP Lite), and stored as a two-letter code. The IP is then
          dropped: it is never written to the database, metrics or logs.
        </p>
        <p>
          The install and device IDs are random (128 bits, made once, not derived from
          anything), and we store them only as hashes.
        </p>
      </article>

      <article class="doc-section" id="kept">
        <p class="eyebrow">05</p>
        <h2>What we keep, and for how long.</h2>
        <ul>
          <li><strong>The raw request</strong> (body, headers, IP address): never stored.</li>
          <li><strong>Each install’s or device’s daily report</strong>, validated and bucketed: <strong>90 days</strong>.</li>
          <li><strong>Daily totals</strong> across all installs and devices, with no IDs: <strong>2 years</strong>.</li>
        </ul>
        <p class="muted">
          An install or device we haven’t heard from in 2 years is deleted entirely.
        </p>
      </article>

      <article class="doc-section" id="opt-out">
        <p class="eyebrow">06</p>
        <h2>How to turn it off.</h2>
        <h3>On a server</h3>
        <p>Any one of these stops the install report:</p>
        <ul>
          <li>
            Admin panel → <strong>Settings</strong> → <strong>Usage &amp; health stats</strong> →
            off. It takes effect at once. The same card has <strong>See exactly what’s
            sent</strong>, which shows the next report as JSON.
          </li>
          <li>
            Set <K>TELEMETRY=off</K> in <K>.env</K>, then <K>docker compose up -d admin</K>. This
            wins over the panel; its switch shows as off and locked.
          </li>
          <li>The setup wizard’s Usage &amp; health stats note has a one-click <strong>Turn off</strong>.</li>
          <li>Without the <K>admin</K> profile nothing is ever sent: the report comes from the panel.</li>
        </ul>
        <h3>In an app</h3>
        <p>
          <strong>Settings</strong> → <strong>Privacy</strong> → <strong>Usage &amp; health
          stats</strong> → off. The web app starts with it off when your browser sends Do Not
          Track or Global Privacy Control.
        </p>
        <div class="doc-callout">
          <strong>Removing what was sent.</strong> Turning it off stops the next send; nothing is
          sent to say so, and old rows age out as above. To have an install’s rows removed now,
          email <a class="docs-link" href="mailto:hi@boson.chat">hi@boson.chat</a> with its
          install ID (shown under See exactly what’s sent) and we’ll delete them.
        </div>
        <p class="muted tm-attrib">
          IP to country data:{' '}
          <a class="docs-link" href="https://db-ip.com" rel="noopener">IP Geolocation by DB-IP</a>,{' '}
          <a class="docs-link" href="https://creativecommons.org/licenses/by/4.0/" rel="noopener">CC BY 4.0</a>.
        </p>
      </article>
    </GuideLayout>
  );
}
