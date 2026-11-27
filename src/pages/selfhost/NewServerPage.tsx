import { CodeBlock } from '../../components/CodeBlock/CodeBlock';
import { DataTable, GuideLayout, K, type TocGroup } from './GuideLayout';
import {
  DnsTable,
  EmailSection,
  FederationSection,
  HelpSection,
  Installer,
  PortsTable,
  PushSection,
  ReverseProxySection,
  ServerRequirements,
  StackDoc,
  UpdatesSection,
} from './common';

// /self-host/new-server: the whole Boson stack on a fresh VPS. The steps
// follow the setup wizard (boson-chat/stack docs/setup.md, images/setup:
// web/flows/fresh.js and internal/stack/answers.go for the defaults).

const TOC: TocGroup[] = [
  {
    title: 'Install',
    items: [
      { id: 'what-you-get', label: 'What you get' },
      { id: 'need', label: 'What you need' },
      { id: 'dns', label: 'DNS records' },
      { id: 'install', label: 'Run the installer' },
      { id: 'wizard', label: 'The setup wizard' },
      { id: 'after', label: 'After the install' },
    ],
  },
  {
    title: 'Running it',
    items: [
      { id: 'reverse-proxy', label: 'Behind a reverse proxy' },
      { id: 'email', label: 'Email (SMTP)' },
      { id: 'federation', label: 'Federation & directory' },
      { id: 'push', label: 'Push notifications' },
      { id: 'updates', label: 'Updates & backups' },
      { id: 'help', label: 'Getting help' },
    ],
  },
];

export function NewServerPage() {
  return (
    <GuideLayout
      eyebrow="Self-host · New server"
      title="Run Boson on a fresh server."
      lead={
        <p>
          The whole stack on one Linux VPS: an IRC server, accounts, the web client, voice, video,
          uploads, the directory and an admin panel, on your own domain with automatic TLS. One
          command starts a setup wizard in your browser that does the rest.
        </p>
      }
      toc={TOC}
    >
      <article class="doc-section" id="what-you-get">
        <p class="eyebrow">01</p>
        <h2>What you get.</h2>
        <p>
          Every part runs in Docker, from one compose project in <K>/opt/boson-stack</K>.
          Traefik in front gets and renews Let’s Encrypt certificates for every name.
        </p>
        <DataTable
          caption="The stack on a new server"
          head={['Part', 'What it does', 'Default']}
          rows={[
            ['IRC (Ergo)', 'The chat server, with history, read markers, reactions, always-on and built-in NickServ/ChanServ. Any IRC client connects too.', 'On'],
            ['Accounts (auth)', 'Sign-up, sign-in, sessions, network roles, invites, sign-in providers. One account for IRC, voice, uploads and the web client.', 'On'],
            ['Web client', <>Boson in the browser at <K>chat.example.com</K>.</>, 'On'],
            ['Admin panel', <>Users, roles, settings, services, updates, at <K>admin.example.com</K>.</>, 'On'],
            ['Voice', 'Voice channels over QUIC.', 'On'],
            ['Uploads', 'Files people share in chat, with quotas and expiry. This disk, MinIO or S3.', 'On'],
            ['Video', 'Camera and screen share in voice channels.', 'Off'],
            ['Directory', 'Your own network directory, federated with directory.boson.chat.', 'Off'],
          ]}
        />
        <p class="muted">
          What each feature does for you and your users, and where it’s configured:{' '}
          <a class="docs-link" href="/self-host/features">Features</a>.
        </p>
      </article>

      <article class="doc-section" id="need">
        <p class="eyebrow">02</p>
        <h2>What you need.</h2>
        <ul>
          <li><strong>A VPS</strong> with a public IPv4 address. A fresh one is best: the wizard needs ports 80 and 443 (or an existing reverse proxy on them, see below).</li>
          <li><strong>A domain</strong> you can add DNS records to. The examples use <K>example.com</K>.</li>
          <li><strong>An email address</strong> for the admin account and Let’s Encrypt’s expiry notices.</li>
          <li><strong>Optional:</strong> an SMTP account for sign-up and password-reset email.</li>
        </ul>
        <ServerRequirements />
        <PortsTable />
        <p class="muted">
          Open them in your provider’s firewall too. The wizard tests each port from inside the
          server (another program on it, the host’s own firewall) and says which ones it can’t
          check from there.
        </p>
      </article>

      <article class="doc-section" id="dns">
        <p class="eyebrow">03</p>
        <h2>DNS records.</h2>
        <p>
          Boson uses a name per service under your domain. With the default features, add A
          records for these, pointing at the server:
        </p>
        <DnsTable />
      </article>

      <article class="doc-section" id="install">
        <p class="eyebrow">04</p>
        <h2>Run the installer.</h2>
        <Installer />
      </article>

      <article class="doc-section" id="wizard">
        <p class="eyebrow">05</p>
        <h2>The setup wizard.</h2>
        <p>
          Open the address, enter the code, and pick <strong>New Boson server</strong>. Then:
        </p>
        <ol class="step-list">
          <li>
            <h3>Domain.</h3>
            <p class="muted">
              Your network’s name (one word, it’s also the IRC network name) and domain. Every
              name the chosen features need is looked up live; the step waits until they all
              point at this server. App discovery is on here.
            </p>
          </li>
          <li>
            <h3>TLS certificates.</h3>
            <p class="muted">
              Let’s Encrypt (or its staging CA, or any ACME directory). The switch for an
              existing reverse proxy is here too.
            </p>
          </li>
          <li>
            <h3>Admin account.</h3>
            <p class="muted">
              Username (also your IRC nick), email and a password of at least 10 characters.
              It’s created as the network’s <strong>Owner</strong>.
            </p>
          </li>
          <li>
            <h3>Features.</h3>
            <p class="muted">
              Voice, video, uploads (this disk, MinIO or an S3 bucket), the directory listing
              and a directory of your own, who can sign up (open, invite only, closed), guests
              (and guests in voice), email verification, accounts from other Boson servers,
              SMTP with a test send, and whether the admin panel may apply updates.
            </p>
          </li>
          <li>
            <h3>Firewall and ports.</h3>
            <p class="muted">
              Checks 80, 443, 6697/tcp, 7700/udp and 7710/udp. A blocked UDP port is a warning
              with a button to turn voice off. A taken 80 or 443 offers the reverse-proxy mode.
            </p>
          </li>
          <li>
            <h3>Review.</h3>
            <p class="muted">
              The <K>.env</K> lines and <K>config/boson.yaml</K> keys it will write (secrets
              masked), and the version of each component it installs.
            </p>
          </li>
          <li>
            <h3>Install.</h3>
            <p class="muted">
              Pulls and starts everything, waits for every service and certificate, creates the
              admin, checks each public address and IRC on 6697. Progress is live; a failed step
              shows its error and a <strong>Retry</strong>, and every service has a{' '}
              <strong>Logs</strong> button.
            </p>
          </li>
          <li>
            <h3>Done.</h3>
            <p class="muted">
              Links to the web client and the admin panel, and the emergency <K>/OPER</K>{' '}
              password, shown once: save it. <strong>Close setup</strong> switches the wizard off.
            </p>
          </li>
        </ol>
        <p class="muted">
          The defaults: voice and uploads on, video off, open sign-up, guests on, no email
          verification, federation with verified servers, directory listing on, updates from the
          panel on.
        </p>
      </article>

      <article class="doc-section" id="after">
        <p class="eyebrow">06</p>
        <h2>After the install.</h2>
        <ul>
          <li><strong>Sign in</strong> at <K>https://chat.example.com</K>, or add <K>irc.example.com</K> in the Boson desktop or phone app: it finds your accounts, voice and uploads through <K>example.com</K>’s boson.json.</li>
          <li><strong>The admin panel</strong> is at <K>https://admin.example.com</K>, with the same account.</li>
          <li><strong>Any IRC client</strong> connects to <K>irc.example.com</K> on 6697 with TLS, and SASL with a Boson username and password.</li>
          <li>
            <strong>Finish the directory listing</strong> on the panel’s Directory page (a DNS
            TXT record), so your users can sign in on other servers too.
          </li>
        </ul>
        <p>
          The install lives in <K>/opt/boson-stack</K>: <K>.env</K> (secrets and hostnames,
          0600), <K>config/boson.yaml</K> (runtime settings the panel edits, reloaded live) and
          the compose files. Plain <K>docker compose</K> works from there:
        </p>
        <CodeBlock
          shell
          label="On the server"
          code={`cd /opt/boson-stack
docker compose ps
docker compose logs --tail 100 auth`}
        />
        <p class="muted">
          Voice logs a warning unless the host allows larger UDP buffers:{' '}
          <K>sysctl -w net.core.rmem_max=7500000 net.core.wmem_max=7500000</K>. With ufw, the
          panel’s host metrics also need{' '}
          <K>ufw allow from 10.203.53.0/24 to 10.203.53.1 port 9100 proto tcp</K>.
        </p>
        <p class="muted">
          Back up <K>.env</K> (it holds the key that encrypts the signing keys) and the data
          volumes; the update backups don’t replace an off-server copy. Details:{' '}
          <StackDoc path="config.md">docs/config.md</StackDoc>.
        </p>
      </article>

      <article class="doc-section" id="reverse-proxy">
        <p class="eyebrow">Running it</p>
        <h2>Behind a reverse proxy you already run.</h2>
        <ReverseProxySection />
      </article>

      <article class="doc-section" id="email">
        <p class="eyebrow">Running it</p>
        <h2>Email (SMTP).</h2>
        <EmailSection />
      </article>

      <article class="doc-section" id="federation">
        <p class="eyebrow">Running it</p>
        <h2>Federation and the directory.</h2>
        <FederationSection />
      </article>

      <article class="doc-section" id="push">
        <p class="eyebrow">Running it</p>
        <h2>Push notifications.</h2>
        <PushSection />
      </article>

      <article class="doc-section" id="updates">
        <p class="eyebrow">Running it</p>
        <h2>Updates, backups and rollback.</h2>
        <UpdatesSection />
      </article>

      <article class="doc-section" id="help">
        <p class="eyebrow">Running it</p>
        <h2>Getting help.</h2>
        <HelpSection />
      </article>
    </GuideLayout>
  );
}
