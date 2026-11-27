import { CodeBlock } from '../../components/CodeBlock/CodeBlock';
import { COMMUNITY, COMMUNITY_JOIN_URL } from '../../community';
import { DataTable, K } from './GuideLayout';

// Sections both guides share: what you need, the installer, reverse proxy,
// email, federation, push, updates and help. Sources: boson-chat/stack
// README.md, install.sh, docs/{setup,reverse-proxy,federation,push,updates}.md
// and the wizard's code (images/setup/internal/stack: answers.go, plan.go).

export const INSTALL_CMD = 'curl -fsSL https://get.boson.chat | sudo sh';
export const STACK_REPO = 'https://github.com/boson-chat/stack';
const STACK_DOCS = `${STACK_REPO}/blob/main/docs`;

interface ModeProps {
  /** The add-on path (the bridge in front of an existing IRC server). */
  addon?: boolean;
}

export function StackDoc({ path, children }: { path: string; children: string }) {
  return (
    <a class="docs-link" href={`${STACK_DOCS}/${path}`} rel="noopener">
      {children}
    </a>
  );
}

/** The server: size, OS, what install.sh accepts. */
export function ServerRequirements() {
  return (
    <DataTable
      caption="The server"
      head={['', 'What it needs']}
      rows={[
        ['System', 'Linux on amd64 (x86_64) or arm64. Ubuntu, Debian, Fedora and RHEL-likes (Rocky, AlmaLinux, CentOS) are tested; the installer asks before going on with anything else.'],
        ['Memory', <>About <strong>2 GB</strong>. The installer warns below that.</>],
        ['Access', <>Root, or a user with <K>sudo</K>.</>],
        ['Docker', 'Installed for you if it’s missing (Docker’s official script, after asking). An existing Docker is used as it is.'],
        ['Disk', 'Uploads are stored on this disk by default; keep room for them and for the backups updates make (or put uploads in an S3 bucket).'],
      ]}
    />
  );
}

/** The ports to open, per feature. */
export function PortsTable({ addon }: ModeProps) {
  return (
    <DataTable
      caption="Ports to open"
      head={['Port', 'For']}
      rows={[
        ['80/tcp', 'Let’s Encrypt’s HTTP-01 check, and the redirect to https'],
        ['443/tcp', 'Sign-in, the web client, the admin panel, the API, uploads, and the IRC WebSocket'],
        ['6697/tcp', addon ? 'IRC over TLS for Boson apps: the bridge to your server' : 'IRC over TLS (Ergo), for Boson and any IRC client'],
        ['7700/udp', 'Voice (QUIC)'],
        ['7710/udp', 'Video and screen share (QUIC and WebTransport), only with video on'],
        ['8443/tcp', 'The setup wizard, only while it runs (or tunnel it over SSH instead)'],
      ]}
    />
  );
}

/** DNS: every name the wizard checks, for example.com. */
export function DnsTable({ addon }: ModeProps) {
  return (
    <>
      <DataTable
        caption="DNS records (A, plus AAAA if the server has IPv6), for example.com"
        head={['Name', 'For', 'When']}
        rows={[
          [<K>irc.example.com</K>, addon ? 'IRC for Boson apps (the bridge, port 6697)' : 'IRC (port 6697)', 'Always'],
          [<K>auth.example.com</K>, 'Accounts and sign-in', 'Always'],
          [<K>chat.example.com</K>, 'The web client', 'Always'],
          [<K>admin.example.com</K>, 'The admin panel', 'Always'],
          [<K>api.example.com</K>, 'The Boson API (profiles)', 'Always'],
          [<K>voice.example.com</K>, 'Voice', 'Voice on (the default)'],
          [<K>files.example.com</K>, 'File uploads', 'Uploads on (the default)'],
          [<K>video.example.com</K>, 'Video and screen share', 'Video on (off by default)'],
          [<K>directory.example.com</K>, 'Your own network directory', 'Only if you run one'],
          [<K>example.com</K>, <>App discovery: <K>/.well-known/boson.json</K></>, 'App discovery on (the default)'],
        ]}
      />
      <p>
        Point every name at the server’s address. One wildcard record, <K>*.example.com</K>, covers
        all of them but the bare domain. If the server has IPv6, add AAAA records too, or none at all:
        a name pointing somewhere else stops the wizard until it’s fixed. It checks the records
        live, every 5 seconds, so you can add them while it runs.
      </p>
      <div class="doc-callout">
        <strong>The bare domain.</strong> The Boson app finds your server’s accounts, voice, uploads
        and federation through <K>https://example.com/.well-known/boson.json</K>; without it the app
        sees plain IRC. If <K>example.com</K> is your website on another server, turn app discovery
        off on the Domain step: it then shows the JSON to publish on your website yourself.
      </div>
    </>
  );
}

/** The one-line installer and what it prints. */
export function Installer() {
  return (
    <>
      <p>On the server, as root or with sudo:</p>
      <CodeBlock code={INSTALL_CMD} shell label="Install" />
      <p>
        It checks the system, installs Docker if needed, downloads the setup wizard and starts it.
        Then it prints where to open it:
      </p>
      <CodeBlock
        label="What it prints"
        code={`Boson setup is running.

  Open https://203.0.113.5:8443 and enter code 7KQ4-MXR2

The page has a self-signed certificate, so your browser warns once.`}
      />
      <ul>
        <li>
          The page has a <strong>self-signed certificate</strong>: your browser warns once. The
          installer prints its SHA-256 fingerprint, to compare with what the browser shows.
        </li>
        <li>
          The <strong>code works once</strong>, in one browser. Run the installer again for a new one.
        </li>
        <li>
          Port 8443 closed by your provider? Tunnel it:{' '}
          <K>ssh -L 8443:localhost:8443 root@203.0.113.5</K>, then open{' '}
          <K>https://localhost:8443</K>.
        </li>
        <li>
          Options (after <K>sh -s --</K>): <K>--yes</K> (don’t ask), <K>--dir</K> (install
          directory, default <K>/opt/boson-stack</K>), <K>--port</K> (wizard port, default 8443).
        </li>
      </ul>
      <CodeBlock code="curl -fsSL https://get.boson.chat | sudo sh -s -- --yes --dir /opt/boson-stack" shell label="With options" />
      <p class="muted">
        The wizard switches itself off when you press <strong>Close setup</strong> at the end, or
        after 30 minutes. Running the installer again later is safe: the wizard reads your install
        back, keeps every secret and never creates the admin twice.
      </p>
    </>
  );
}

/** "This server already runs a reverse proxy on 80 and 443". */
export function ReverseProxySection() {
  const names = 'irc., auth., chat., admin., api., voice., files.';
  return (
    <>
      <p>
        If something on the server already has ports 80 and 443 (Traefik, nginx, Caddy, HAProxy),
        Boson goes behind it. Say so on the wizard’s TLS step (“This server already runs a reverse
        proxy on ports 80 and 443”), or on the ports step, which offers it when 80 or 443 is taken.
      </p>
      <ul>
        <li>
          Boson’s own Traefik listens on two private addresses instead, by default{' '}
          <K>127.0.0.1:8081</K> (HTTP) and <K>127.0.0.1:8444</K> (HTTPS). For a proxy running in a
          container, the wizard finds the gateway of its Docker network and offers that.
        </li>
        <li>
          Your proxy <strong>passes TLS for Boson’s names through untouched</strong>, routed by SNI
          and never terminated, <strong>with a PROXY protocol v2 header</strong>, so Boson still
          sees each visitor’s own address (sign-in rate limits, bans, logs, WEBIRC).
        </li>
        <li>Port 80 for Boson’s names goes to Boson’s HTTP address (certificate checks and the https redirect).</li>
        <li>6697/tcp, 7700/udp and 7710/udp stay Boson’s own, published directly.</li>
      </ul>
      <p>
        The wizard shows the snippet for your proxy with your names filled in ({names} and any
        others your features need), listed one by one so your other sites under the same domain
        stay yours. It never edits your proxy; the install’s last check goes through it and points
        you back at the snippet if it isn’t in place yet. For Caddy you need the{' '}
        <a class="docs-link" href="https://github.com/mholt/caddy-l4" rel="noopener">caddy-l4</a>{' '}
        plugin, since plain Caddy can’t pass TLS through.
      </p>
      <p>The same settings by hand, in the install’s <K>.env</K>:</p>
      <CodeBlock
        label=".env"
        code={`TRAEFIK_HTTP_PUBLISH=127.0.0.1:8081
TRAEFIK_HTTPS_PUBLISH=127.0.0.1:8444
TRAEFIK_PROXY_PROTOCOL_TRUSTED_IPS=10.203.53.1`}
      />
      <p class="muted">
        Trust <K>10.203.53.1</K>, the gateway of Boson’s own Docker network (the first address of{' '}
        <K>STACK_SUBNET</K>), not your proxy’s address: Docker hands Boson every connection from
        there. Snippets for Traefik, nginx, HAProxy and Caddy, and how to check that visitors’
        addresses get through: <StackDoc path="reverse-proxy.md">docs/reverse-proxy.md</StackDoc>.
      </p>
    </>
  );
}

/** SMTP: optional, and what you lose without it. */
export function EmailSection() {
  return (
    <>
      <p>
        Email is <strong>optional</strong>. The Features step has an SMTP form with a test-send
        button; leave the server empty to skip it, and add it later in the admin panel. Without
        it, Boson can’t send:
      </p>
      <ul>
        <li><strong>Email verification</strong> at sign-up (the wizard won’t let you require it without SMTP),</li>
        <li><strong>Password reset</strong> emails,</li>
        <li><strong>Invite and account-setup</strong> emails (“choose your password” links from the admin panel).</li>
      </ul>
      <p>
        Everything else works. Any SMTP provider does: host, port (587 with STARTTLS by default,
        465 for TLS), a sender like <K>Boson &lt;noreply@example.com&gt;</K>, and a user and
        password if it needs one. The password stays in <K>.env</K>; the rest is in{' '}
        <K>config/boson.yaml</K> under <K>auth.smtp</K>. The admin panel’s Emails page brands
        and rewords the emails.
      </p>
    </>
  );
}

/** Federated login and the directory listing. */
export function FederationSection({ addon }: ModeProps) {
  return (
    <>
      <p>
        People with an account on another Boson server, such as boson.chat, can use yours without
        signing up: when they add your server, the Boson app offers{' '}
        <strong>Continue as alice@boson.chat</strong> next to the usual sign-in. It works the
        other way round too: your users can sign in elsewhere with their account here. No
        passwords or chat cross servers. The home server signs a short-lived assertion, your
        server checks it, and the person gets a local account under your rules, roles, bans and
        quotas.
      </p>
      <DataTable
        caption="Who may sign in with an account from another server"
        head={['Mode', 'Who gets in']}
        rows={[
          [<>Verified servers <span class="muted">(default)</span></>, <>Servers with a <strong>verified</strong> listing in the Boson directory: their owner proved the domain with a DNS record.</>],
          ['Only servers you list', <>The home domains you list (<K>boson.chat</K>, or <K>*.example.org</K> for a domain and its subdomains).</>],
          ['Any server', 'Any server whose boson.json and keys check out. Spammers can set up servers too: only with active moderation.'],
          ['Off', 'Nobody, and your users can’t take their account to other servers either.'],
        ]}
      />
      <p>
        Pick the mode on the wizard’s Features step, change it any time on the admin panel’s
        Federation page (live, no restart), where you also see remote users, ban an identity or
        block a whole server. Federation needs app discovery on (the bare domain pointing at this
        server) and outgoing HTTPS (443) from the server. Nothing new to open.
      </p>
      {addon ? (
        <p>
          On an add-on install, remote users reach your IRC server through the bridge like every
          Boson user, but <strong>without a services account there</strong>, and under a nick that
          carries their home server: <K>alice@boson.chat</K> is <K>alice-bosonchat</K> on your
          network, never <K>alice</K>. The bridge’s nick guard moves them off any nick registered
          with your services.
        </p>
      ) : null}
      <h3>The directory listing</h3>
      <p>
        <strong>List this network in the Boson directory</strong> is on by default in the
        Features step, so people find your network in the app’s server browser and at
        directory.boson.chat. Finish it on the admin panel’s Directory page: it gives you a TXT
        record, <K>_boson.irc.example.com</K> = <K>boson-verify=…</K>, to add at your DNS
        provider. A verified listing is also what lets your users into other servers in the
        default “verified servers” mode. You can also run a directory of your own (its own
        hostname, <K>directory.example.com</K>), which includes directory.boson.chat’s listings
        by default. More: <StackDoc path="federation.md">docs/federation.md</StackDoc>,{' '}
        <StackDoc path="directory.md">docs/directory.md</StackDoc>.
      </p>
    </>
  );
}

/** Push: nothing to set up. */
export function PushSection({ addon }: ModeProps) {
  return (
    <>
      <p>
        <strong>Nothing to set up.</strong> People signed in with an account get a notification
        for DMs and mentions while none of their devices is connected: in the browser (the web
        client), and on phones through the push relay at boson.chat, which holds the official
        app’s Apple and Google push keys. Your server needs no account with anyone and no keys of
        its own; its <K>boson.json</K> names the relay, <K>https://push.boson.chat</K>, by
        default.
      </p>
      <ul>
        <li>
          Notifications are encrypted on your server to the device’s own key: the relay, Apple,
          Google and browser vendors can’t read them.
        </li>
        <li>Accounts only, federated ones included; guests don’t get push.</li>
        <li>
          On the people’s side: browser push works in the web client today. Phone push needs an
          app build with it, and the Android APK on the releases page doesn’t have it yet; the
          desktop app notifies while it’s running and doesn’t take push.
        </li>
        <li>
          {addon
            ? 'The bridge sends them (evrd 0.62 or later, the stack’s default). An older add-on install gets it by updating evrd from the admin panel.'
            : 'Ergo sends them for always-on accounts (on by default), 20 seconds after the message, and not if it was read on another device meanwhile.'}
        </li>
        <li>
          It needs outgoing HTTPS (443) from the server, without an HTTP proxy as the only way out.
          To turn phone push off, set <K>PUSH_RELAY_URL=</K> (empty) in <K>.env</K>; browser
          push keeps working.
        </li>
      </ul>
    </>
  );
}

/** Updates from the admin panel. */
export function UpdatesSection({ addon }: ModeProps) {
  return (
    <>
      <p>
        A new install starts on the newest release of everything. After that, the admin panel’s{' '}
        <strong>Updates</strong> page checks every 6 hours (and on <strong>Check now</strong>)
        and lists what’s newer: the stack itself, Ergo, auth, the API, the web client, voice,
        video, uploads, the directory, the panel{addon ? ', and the bridge (evrd)' : ''}. Each
        shows the changelogs in between, who the update affects (IRC disconnects, dropped calls,
        a brief pause, nothing) and any breaking change that needs a manual step.
      </p>
      <ol>
        <li>It checks the disk has room, then <strong>backs up</strong> <K>.env</K>, <K>config/</K>, the compose files, every database and the data volumes. If the backup fails, nothing changes.</li>
        <li>It pulls the new images and recreates only the services that change.</li>
        <li>It checks the stack the way people use it: IRC over TLS, sign-in, voice, video, uploads, the web client.</li>
        <li>If anything fails, it <strong>rolls back on its own</strong>; you can also roll back a finished update from the page.</li>
      </ol>
      <p>
        The stack itself is a <strong>versioned release</strong> (compose files, config layout,
        migrations): the page shows every file that changes, with its diff, before you apply it.
        A file you edited on the server is replaced and your copy kept next to it as{' '}
        <K>&lt;file&gt;.local</K>; put your own changes in <K>compose.override.yaml</K> or{' '}
        <K>traefik/dynamic/</K> instead. Backups go to <K>/root/backups/boson-updates</K>.
      </p>
      {addon ? (
        <p>
          Updates never restart <K>evrd-links</K>, the part of the bridge that holds every Boson
          user’s connection to your server: updating the bridge keeps everyone online.
        </p>
      ) : null}
      <div class="doc-callout">
        <strong>Applying updates gives the panel root on the server.</strong> “Let the admin panel
        apply updates” (on by default in the Features step) lets the panel run Docker on the host,
        which is root-equivalent, for the people with the <K>services.manage</K> and{' '}
        <K>settings.manage</K> permissions. Turn it off and the Updates page only lists updates;
        you apply them on the server (<StackDoc path="updates.md">docs/updates.md</StackDoc>).
      </div>
    </>
  );
}

/** Where to ask. */
export function HelpSection() {
  return (
    <>
      <ul>
        <li>
          <strong>Chat with us</strong> in <K>{COMMUNITY.channel}</K> on{' '}
          <K>{COMMUNITY.hostname}</K> (port {COMMUNITY.port}, TLS):{' '}
          <a class="docs-link" href={COMMUNITY_JOIN_URL}>open in Boson</a>, or any IRC client.
        </li>
        <li>
          <strong>Report a problem</strong> with the install or the wizard:{' '}
          <a class="docs-link" href={`${STACK_REPO}/issues`} rel="noopener">boson-chat/stack issues</a>.
          The wizard’s Install page has a <strong>Logs</strong> button for every service, with
          secrets redacted, to copy into a report.
        </li>
        <li>
          <strong>Reference</strong>: every setting, profile and file is documented in the{' '}
          <a class="docs-link" href={STACK_REPO} rel="noopener">stack repository</a>, starting
          with <StackDoc path="setup.md">docs/setup.md</StackDoc> (the wizard) and{' '}
          <StackDoc path="config.md">docs/config.md</StackDoc> (settings).
        </li>
      </ul>
    </>
  );
}
