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

// /self-host/existing-irc: Boson next to an IRC server someone already
// runs, through the bridge (evrd in managed mode). Sources: boson-chat/stack
// docs/bridge.md, docs/setup.md, docs/federation.md "Add-on installs", and
// the wizard's code: images/setup/web/flows/addon.js (steps, account
// strategies) and internal/stack/snippets.go (the exact config snippets).

const TOC: TocGroup[] = [
  {
    title: 'Install',
    items: [
      { id: 'how', label: 'How it works' },
      { id: 'need', label: 'What you need' },
      { id: 'dns', label: 'DNS records' },
      { id: 'install', label: 'Run the installer' },
      { id: 'wizard', label: 'The setup wizard' },
    ],
  },
  {
    title: 'Your IRC server',
    items: [
      { id: 'accounts', label: 'Accounts' },
      { id: 'ircd-config', label: 'WEBIRC & limits' },
      { id: 'services', label: 'Services & SASL' },
      { id: 'guests', label: 'Guests & nick protection' },
      { id: 'web-voice', label: 'Web, voice & uploads' },
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
      { id: 'not-yet', label: 'Not yet' },
      { id: 'help', label: 'Getting help' },
    ],
  },
];

const UNREAL_WEBIRC = `/* Boson: the bridge passes each Boson user's own address (WEBIRC). */
webirc {
	mask BOSON-SERVER-IP;
	password "WEBIRC-PASSWORD";
};`;

const UNREAL_LIMITS = `/* Boson: every Boson user connects from this server. */
allow {
	mask BOSON-SERVER-IP;
	class clients;
	maxperip 10000;
	global-maxperip 10000;
};
except throttle {
	mask BOSON-SERVER-IP;
};
except ban {
	mask BOSON-SERVER-IP;
	type { connect-flood; handshake-data-flood; };
};
set {
	connthrottle { except { mask BOSON-SERVER-IP; } }
};`;

const INSP_CONNECT = `# Boson: every Boson user connects from this server.
<connect name="boson-bridge" allow="BOSON-SERVER-IP" localmax="10000" globalmax="10000" limit="10000"
         threshold="1000" commandrate="100000" useident="no" usednsbl="no" resolvehostnames="no">`;

const INSP_WEBIRC = `# Boson: the bridge passes each Boson user's own address (WEBIRC).
<module name="gateway">
<gateway type="webirc" mask="BOSON-SERVER-IP" password="WEBIRC-PASSWORD">`;

const NGIRCD_WEBIRC = `# Boson: the bridge passes each Boson user's own address (WEBIRC).
# ngIRCd takes WEBIRC from any host that knows this password: keep it secret.
[Options]
	WebIRCPassword = WEBIRC-PASSWORD`;

const NGIRCD_LIMITS = `# Boson: every Boson user connects from this server (BOSON-SERVER-IP).
# ngIRCd can't exempt one address: this lifts the limit for everyone.
[Limits]
	MaxConnectionsIP = 0`;

const ANOPE_RPC = `module { name = "httpd"; httpd { name = "httpd/main"; ip = "PRIVATE-ADDRESS"; port = 8080; timeout = 30; } }
module {
	name = "jsonrpc"
	server = "httpd/main"
	token { token = "CHOOSE-A-TOKEN"; methods = "anope.checkCredentials anope.account"; }
}
module { name = "rpc_user" }
module { name = "rpc_data" }`;

const ATHEME_RPC = `loadmodule "modules/misc/httpd";
loadmodule "modules/transport/jsonrpc";
httpd {
	host = "PRIVATE-ADDRESS";
	port = 8080;
};`;

export function ExistingIrcPage() {
  return (
    <GuideLayout
      eyebrow="Self-host · Existing IRC server"
      title="Add Boson to the IRC server you already run."
      lead={
        <p>
          Keep your ngIRCd, UnrealIRCd or InspIRCd, your Anope or Atheme services, your channels
          and your users. Boson goes on a server next to it and adds accounts, the web client,
          voice, video, uploads and the admin panel. Boson users join your network through a
          bridge; classic IRC clients don’t notice a thing.
        </p>
      }
      toc={TOC}
    >
      <article class="doc-section" id="how">
        <p class="eyebrow">01</p>
        <h2>How it works.</h2>
        <p>
          Boson apps don’t connect to your server directly. They connect to a <strong>bridge</strong>{' '}
          on the Boson server, <K>irc.example.com:6697</K>:{' '}
          <a class="docs-link" href="https://github.com/4evrd/evrd" rel="noopener">evrd</a> in
          managed mode. For each signed-in Boson user it keeps a connection to your server, made
          with <strong>WEBIRC</strong> so your server sees the user’s own address, and gives Boson
          apps what your server may lack: message tags and IDs, server time, echo, chat history and
          read markers.
        </p>
        <CodeBlock
          label="The path"
          code={`Boson app ──TLS──▶ irc.example.com:6697 (the bridge) ──WEBIRC──▶ your IRC server
classic IRC client ─────────────────────────────────────────▶ your IRC server`}
        />
        <ul>
          <li>Each Boson user is on your network under their own nick, with their own address.</li>
          <li>Nothing Boson users see names the bridge: its lines come from your server’s name.</li>
          <li><strong>The wizard never edits your IRC server.</strong> It shows the lines to add, then checks them.</li>
          <li>There’s no Ergo on this path: your server stays the IRC server.</li>
        </ul>
        <DataTable
          caption="IRC servers"
          head={['Software', 'Support']}
          rows={[
            ['UnrealIRCd 6', 'Snippets from the wizard, tested in CI. An optional module lets reactions through.'],
            ['InspIRCd 4', 'Snippets from the wizard, tested in CI.'],
            ['ngIRCd', 'Snippets from the wizard, tested in CI. No SASL: NickServ sign-in goes through IDENTIFY.'],
            ['Others', 'Works if it has WEBIRC (CGI:IRC gateway) blocks and lets one address open many connections; the wizard says what to add in words.'],
          ]}
        />
      </article>

      <article class="doc-section" id="need">
        <p class="eyebrow">02</p>
        <h2>What you need.</h2>
        <ul>
          <li>
            <strong>A server for Boson</strong>, usually a VPS of its own. The bridge takes port
            6697 on it, so if your IRC server runs on the same machine and listens on 6697, give
            Boson its own VPS.
          </li>
          <li><strong>Admin access to your IRC server’s config</strong> (and your services’, for the optional RPC), and a way to rehash it.</li>
          <li><strong>A domain</strong> for Boson’s names (below), and an email address for Let’s Encrypt.</li>
          <li><strong>Optional:</strong> an SMTP account.</li>
        </ul>
        <ServerRequirements />
        <PortsTable addon />
        <p class="muted">
          The Boson server must also reach your IRC server (its IRC port, and the services RPC if
          you use one). Your IRC server needs nothing new opened.
        </p>
      </article>

      <article class="doc-section" id="dns">
        <p class="eyebrow">03</p>
        <h2>DNS records.</h2>
        <p>The same names as a new server, all pointing at the Boson server:</p>
        <DnsTable addon />
        <div class="doc-callout">
          <strong><K>irc.</K> is the bridge.</strong> <K>irc.example.com</K> must point at the
          Boson server, because that’s where Boson apps connect. If your IRC server already uses{' '}
          <K>irc.example.com</K>, give Boson a domain of its own, such as <K>boson.example.com</K>{' '}
          (then <K>irc.boson.example.com</K>, <K>chat.boson.example.com</K> and so on); your IRC
          server keeps its name.
        </div>
      </article>

      <article class="doc-section" id="install">
        <p class="eyebrow">04</p>
        <h2>Run the installer.</h2>
        <p>On the Boson server, not on your IRC server:</p>
        <Installer />
      </article>

      <article class="doc-section" id="wizard">
        <p class="eyebrow">05</p>
        <h2>The setup wizard.</h2>
        <p>
          Open the address, enter the code, and pick{' '}
          <strong>Add Boson to my existing IRC server</strong>. Then:
        </p>
        <ol class="step-list">
          <li>
            <h3>Your IRC server.</h3>
            <p class="muted">
              Address, port (6697) and TLS. Setup connects as a normal client to see what it
              supports. A certificate that isn’t from a trusted CA is pinned: the bridge accepts
              exactly that one. Optionally, your services’ RPC address and token, and a test
              account.
            </p>
          </li>
          <li>
            <h3>What Boson gets.</h3>
            <p class="muted">
              A table of each capability: from your server, through the bridge, or not
              available, with how to get it natively.
            </p>
          </li>
          <li>
            <h3>The bridge.</h3>
            <p class="muted">
              What it does, and the address your server sees the Boson server connect from
              (read from your server’s welcome; change it for NAT). The WEBIRC block and
              connection limits use it.
            </p>
          </li>
          <li>
            <h3>Accounts.</h3>
            <p class="muted">Boson accounts or NickServ accounts, with a recommendation (below).</p>
          </li>
          <li>
            <h3>Domain, TLS, admin, features, ports.</h3>
            <p class="muted">
              As on a <a class="docs-link" href="/self-host/new-server#wizard">new server</a>. With
              NickServ accounts the admin is your NickServ account: you sign in with its password.
            </p>
          </li>
          <li>
            <h3>Your server’s config.</h3>
            <p class="muted">
              The lines to add to your IRC server, for its software, with your address and a
              generated WEBIRC password, each with a Copy button. Add them, rehash, and press{' '}
              <strong>Re-check</strong> until WEBIRC and the connection limits are green (and the
              RPC, and reactions on UnrealIRCd, if you chose them).
            </p>
          </li>
          <li>
            <h3>Review, install, done.</h3>
            <p class="muted">As on a new server.</p>
          </li>
        </ol>
      </article>

      <article class="doc-section" id="accounts">
        <p class="eyebrow">06</p>
        <h2>Accounts: Boson’s or NickServ’s.</h2>
        <p>Either way, each Boson user is on your network under their own nick.</p>
        <DataTable
          head={['Choice', 'What it means']}
          rows={[
            ['Boson accounts', 'Boson has its own sign-up and passwords. A Boson user’s nick on your network is their Boson username; it isn’t linked to NickServ. The default when your services can’t check passwords for Boson.'],
            ['NickServ accounts', 'People sign in to Boson with their NickServ account and password, and the bridge identifies their connection to NickServ. Recommended when your services offer an RPC or SASL.'],
          ]}
        />
        <p>With NickServ accounts, Boson checks passwords through, in order of preference:</p>
        <DataTable
          head={['Method', 'How']}
          rows={[
            ['Anope’s RPC', <>Anope 2.1 <K>jsonrpc</K>: <K>anope.checkCredentials</K>. Also gives Boson the account’s email.</>],
            ['Atheme’s JSON-RPC', <>Atheme <K>transport/jsonrpc</K>: <K>atheme.login</K>. New Boson sign-ups register NickServ accounts.</>],
            ['Atheme’s XML-RPC', 'As JSON-RPC, over XML-RPC.'],
            ['SASL on your IRC server', 'SASL PLAIN on a connection that never joins. No email from the services.'],
            ['IDENTIFY (last resort)', 'A short-lived client reads NickServ’s reply; depends on its wording. Offered, never recommended.'],
          ]}
        />
      </article>

      <article class="doc-section" id="ircd-config">
        <p class="eyebrow">07</p>
        <h2>WEBIRC and connection limits.</h2>
        <p>
          Two things on your IRC server: a <strong>WEBIRC</strong> block for the Boson server, so
          each Boson user shows up with their own address, and room for <strong>many
          connections from one address</strong>, since every Boson user connects from the Boson
          server. The wizard fills in <K>BOSON-SERVER-IP</K> and <K>WEBIRC-PASSWORD</K>; copy
          its version rather than these.
        </p>

        <h3>UnrealIRCd 6</h3>
        <p class="muted">In <K>unrealircd.conf</K> (or an included file), then <K>/REHASH</K>.</p>
        <CodeBlock label="unrealircd.conf · WEBIRC" code={UNREAL_WEBIRC} />
        <p class="muted">
          After your own <K>allow</K> blocks: UnrealIRCd uses the last one that matches.
        </p>
        <CodeBlock label="unrealircd.conf · limits" code={UNREAL_LIMITS} />
        <p class="muted">
          UnrealIRCd drops <K>+draft/react</K>, so Boson reactions don’t reach others. The
          wizard can add a small module (<K>boson-react.c</K>): save it as{' '}
          <K>src/modules/third/boson-react.c</K> in your UnrealIRCd source tree, run{' '}
          <K>make &amp;&amp; make install</K>, then <K>loadmodule "third/boson-react";</K>.
        </p>

        <h3>InspIRCd 4</h3>
        <p class="muted">
          In <K>inspircd.conf</K>, then <K>/REHASH</K>. The connect class goes{' '}
          <strong>before</strong> your other <K>&lt;connect&gt;</K> blocks: InspIRCd uses the
          first that matches.
        </p>
        <CodeBlock label="inspircd.conf · connect class (first)" code={INSP_CONNECT} />
        <p class="muted">Anywhere; leave out the module line if <K>gateway</K> is loaded already.</p>
        <CodeBlock label="inspircd.conf · WEBIRC" code={INSP_WEBIRC} />

        <h3>ngIRCd</h3>
        <p class="muted">In <K>ngircd.conf</K> (or a file in its IncludeDir), then reload ngIRCd (<K>kill -HUP</K>).</p>
        <CodeBlock label="ngircd.conf · WEBIRC" code={NGIRCD_WEBIRC} />
        <CodeBlock label="ngircd.conf · limits" code={NGIRCD_LIMITS} />
        <div class="doc-callout">
          <strong>ngIRCd can’t exempt one address.</strong> <K>MaxConnectionsIP = 0</K> removes
          the per-address limit for every client on your server, not just Boson’s. If that’s not
          acceptable, keep your limit: Boson works until that many Boson users are online at
          once, and the rest are refused.
        </div>

        <h3>Something else</h3>
        <p class="muted">
          Add a WEBIRC (CGI:IRC) gateway block for the Boson server’s address with the wizard’s
          password, and exempt that address from per-address connection limits, throttling and
          connect-flood protection. Your server’s documentation has the syntax.
        </p>
      </article>

      <article class="doc-section" id="services">
        <p class="eyebrow">08</p>
        <h2>Services and SASL.</h2>
        <ul>
          <li>
            <strong>Without an RPC</strong>, NickServ accounts work through SASL when your IRC
            server offers SASL linked to your services. The bridge identifies each user’s
            connection with SASL too.
          </li>
          <li>
            <strong>ngIRCd has no SASL</strong>: the bridge sends <K>IDENTIFY</K> to NickServ once
            connected, and Boson checks passwords through the RPC (or, as a last resort, IDENTIFY).
          </li>
          <li>
            <strong>The RPC is optional</strong> but the best way to check NickServ passwords.
            Keep it on a private address only the Boson server reaches. The wizard shows these
            while the RPC doesn’t answer.
          </li>
        </ul>
        <h3>Anope 2.1</h3>
        <p class="muted">In <K>modules.conf</K>, then restart Anope. Use the same token in the wizard’s first step.</p>
        <CodeBlock label="anope modules.conf" code={ANOPE_RPC} />
        <h3>Atheme</h3>
        <p class="muted">
          In <K>atheme.conf</K>, then restart Atheme. Atheme’s RPC has no token: only a private
          network that only the Boson server reaches.
        </p>
        <CodeBlock label="atheme.conf" code={ATHEME_RPC} />
      </article>

      <article class="doc-section" id="guests">
        <p class="eyebrow">09</p>
        <h2>Guests and nick protection.</h2>
        <p>
          <strong>Guests</strong> (on by default) chat in Boson without an account, under a nick.
          Each gets a temporary connection to your server through the bridge, with WEBIRC and
          their own address, kept off nicks registered with NickServ, and gone 30 seconds after
          they leave. At most 100 at once and 3 per address; change those in{' '}
          <K>bridge/evrd.conf</K> (<K>managed_guests_max</K>, <K>managed_guests_per_ip</K>).
          The switch is the admin panel’s guest access setting.
        </p>
        <p>
          <strong>Nick protection.</strong> A Boson user without a services login who lands on a
          nick registered with NickServ has 60 seconds to <K>IDENTIFY</K> before the bridge moves
          them to another nick (<K>managed_nick_guard_grace</K>). One who identifies keeps it,
          and the bridge tries it first next time. When your services rename or kill a user over
          a registered nick, the bridge moves them to <K>nick_</K>, then <K>nick_2</K>, and holds
          their channel joins until the nick has settled, so a registered nick never shows in a
          channel.
        </p>
      </article>

      <article class="doc-section" id="web-voice">
        <p class="eyebrow">10</p>
        <h2>Web client, voice and uploads.</h2>
        <ul>
          <li>
            <strong>The web client</strong> at <K>chat.example.com</K> reaches your network
            through the bridge too, with WEBIRC on the way, so web users (guests included) show
            up with their own address.
          </li>
          <li>
            <strong>Voice, video and uploads</strong> work as on a new server, for Boson accounts.
            They run on the Boson server; your IRC server isn’t involved.
          </li>
          <li>
            <strong>Roles</strong>: Boson’s network roles don’t become IRC operator classes on this
            path (there’s no Ergo); your server’s own opers and services stay as they are.
          </li>
        </ul>
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
        <FederationSection addon />
      </article>

      <article class="doc-section" id="push">
        <p class="eyebrow">Running it</p>
        <h2>Push notifications.</h2>
        <PushSection addon />
      </article>

      <article class="doc-section" id="updates">
        <p class="eyebrow">Running it</p>
        <h2>Updates, backups and rollback.</h2>
        <UpdatesSection addon />
      </article>

      <article class="doc-section" id="not-yet">
        <p class="eyebrow">Running it</p>
        <h2>Not yet on this path.</h2>
        <ul>
          <li><strong>Guests in voice</strong>: guests chat, but only accounts join voice.</li>
          <li>
            <strong>A web user’s new address</strong>: the bridge keeps the address a user’s
            connection was made with until it reconnects.
          </li>
        </ul>
        <p class="muted">
          The bridge in depth: <StackDoc path="bridge.md">docs/bridge.md</StackDoc>.
        </p>
      </article>

      <article class="doc-section" id="help">
        <p class="eyebrow">Running it</p>
        <h2>Getting help.</h2>
        <HelpSection />
      </article>
    </GuideLayout>
  );
}
