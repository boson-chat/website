import { Card } from '@boson/shared';
import { CodeBlock } from '../../components/CodeBlock/CodeBlock';
import { DataTable, GuideLayout, K } from './GuideLayout';
import { INSTALL_CMD, STACK_REPO } from './common';

// /self-host: pick between the two setup wizard paths (boson-chat/stack
// docs/setup.md: "New Boson server" and "Add Boson to my existing IRC
// server", docs/bridge.md).

export function SelfHostPage() {
  return (
    <GuideLayout
      eyebrow="Self-host"
      title="Run Boson on your own server."
      lead={
        <>
          <p>
            Accounts, chat, voice, video, uploads, a web client and an admin panel on your own
            domain, with automatic TLS. One command on a Linux server starts a setup wizard in
            your browser that does the rest.
          </p>
          <p>
            It’s open source (AGPL-3.0):{' '}
            <a class="docs-link" href={STACK_REPO} rel="noopener">boson-chat/stack</a>.
          </p>
        </>
      }
    >
      <div class="sh-block">
        <h2 class="sr-only">Pick a path</h2>
        <div class="sh-paths">
          <Card variant="raised">
            <div class="sh-path sh-path-body">
              <p class="eyebrow">Path 1</p>
              <h2>A new server, from scratch.</h2>
              <p>
                You’re starting a community, or moving to Boson. You get the whole stack, with
                its own IRC server (Ergo) set up for Boson.
              </p>
              <ul>
                <li>Boson accounts are the IRC accounts: one sign-in everywhere.</li>
                <li>Network roles become IRC operators and vhosts.</li>
                <li>History, reactions, read markers and push, natively.</li>
              </ul>
              <a class="btn btn-primary btn-arrow" href="/self-host/new-server">New server guide</a>
            </div>
          </Card>
          <Card variant="raised">
            <div class="sh-path sh-path-body">
              <p class="eyebrow">Path 2</p>
              <h2>Add Boson to your IRC server.</h2>
              <p>
                You already run ngIRCd, UnrealIRCd or InspIRCd, with Anope or Atheme. Keep it.
                Boson goes on a server next to it, and Boson users join through a bridge.
              </p>
              <ul>
                <li>Sign in with Boson accounts or existing NickServ accounts.</li>
                <li>Classic IRC clients keep using your server as before.</li>
                <li>You add a WEBIRC block and a connection limit; the wizard never edits your server.</li>
              </ul>
              <a class="btn btn-primary btn-arrow" href="/self-host/existing-irc">Existing IRC server guide</a>
            </div>
          </Card>
        </div>
      </div>

      <div class="sh-block">
        <h2>Which one?</h2>
        <DataTable
          head={['', 'New server', 'Existing IRC server']}
          rows={[
            ['IRC server', 'Ergo, installed and run by Boson', 'Yours, unchanged; Boson adds a bridge (evrd)'],
            ['Accounts', 'Boson accounts', 'Boson accounts, or your NickServ accounts'],
            ['Guests', 'Chat, and voice if you allow it', 'Chat (not voice yet)'],
            ['Network roles on IRC', 'Opers, WHOIS lines and vhosts', 'Your server’s own opers'],
            ['Voice, video, uploads, web client, admin panel', 'Yes', 'Yes'],
            ['Federation, directory, push', 'Yes', 'Yes'],
            ['Machine', 'One VPS', 'A VPS for Boson, next to your IRC server'],
          ]}
        />
        <p>
          Both use the same installer and wizard: its first screen asks which one. What either
          gives you and your users: <a class="docs-link" href="/self-host/features">Features</a>.
        </p>
      </div>

      <div class="sh-block">
        <h2>Before you start.</h2>
        <ul class="sh-list">
          <li>A Linux VPS (amd64 or arm64) with about <strong>2 GB</strong> of memory and root access.</li>
          <li>A domain you can add DNS records to: Boson uses <K>irc.</K>, <K>auth.</K>, <K>chat.</K>, <K>admin.</K>, <K>api.</K> and more under it.</li>
          <li>Ports 80, 443 and 6697/tcp, 7700/udp for voice, 7710/udp for video.</li>
          <li>Email (SMTP) is optional. Push notifications need nothing.</li>
        </ul>
        <CodeBlock code={INSTALL_CMD} shell label="The installer" />
        <p class="muted">
          It starts the wizard on <K>https://&lt;server-ip&gt;:8443</K> with a one-time code.
          Prefer to read it first? <a class="docs-link" href="https://get.boson.chat/install.sh" rel="noopener">get.boson.chat/install.sh</a>.
        </p>
        <p class="muted">
          The admin panel sends anonymous <a class="docs-link" href="/telemetry">usage &amp; health
          stats</a> once a day (no names, messages or hostnames). Turn them off in the panel’s
          Settings, with <K>TELEMETRY=off</K> in <K>.env</K>, or in the setup wizard.
        </p>
      </div>
    </GuideLayout>
  );
}
