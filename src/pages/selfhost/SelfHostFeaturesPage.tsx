import type { ComponentChildren } from 'preact';
import { Card } from '@boson/shared';
import { GuideLayout, K } from './GuideLayout';

// /self-host/features: what a Boson install gives an admin and their users,
// and where each thing is configured. Every claim comes from boson-chat/stack
// (README.md, docs/*.md, images/ergo/helper/ircd.yaml.tmpl), boson-chat/admin
// README.md, boson-chat/auth README.md, or the boson app's source.

interface Feature {
  title: string;
  body: ComponentChildren;
  points?: ComponentChildren[];
  where: ComponentChildren;
}

interface Group {
  id: string;
  title: string;
  features: Feature[];
}

const GROUPS: Group[] = [
  {
    id: 'chat',
    title: 'Chat',
    features: [
      {
        title: 'IRC with modern extras',
        body: (
          <>
            On a new server the IRC server is Ergo, set up for Boson: any IRC client connects,
            and IRCv3 clients like Boson get the rest. History is kept for a week and replayed
            with <K>chathistory</K>; read markers follow you between devices; replies and
            reactions are stored, so a removed reaction stays removed.
          </>
        ),
        points: [
          'Message deletion: your own messages, any message in a channel you op; opers with history rights, anything.',
          'Always-on: signed-in users stay connected with no device open, and catch up when they come back (people can opt out).',
          'Nick protection: your nick is your username, reserved once you’ve signed in.',
          'Channel registration with ChanServ, optionally to the creator automatically, and idle channels unregistered after a number of days you pick.',
        ],
        where: <>Admin panel → Network settings; <K>config/boson.yaml</K> <K>irc.*</K>.</>,
      },
      {
        title: 'Roles that IRC understands',
        body: (
          <>
            Network roles (Owner, Admin, Moderator, Member and your own) are IRC-native on a new
            server: a role
            with IRC powers makes its members IRC operators at sign-in, with no <K>/OPER</K>,
            a WHOIS line and a vhost such as <K>staff/alice</K>, visible in any client, mIRC
            included. Roles also decide who joins which channels (private channels, auto-join)
            and who may create voice channels. <K>/msg RoleServ HELP</K> lists them from IRC.
          </>
        ),
        where: <>Admin panel → Roles, Channel access. On an add-on install your IRC server’s own opers stay as they are.</>,
      },
    ],
  },
  {
    id: 'accounts',
    title: 'Accounts',
    features: [
      {
        title: 'One account for everything',
        body: (
          <>
            A Boson account signs in to IRC (SASL), voice, video, uploads and the web client.
            Passwords live only in the auth service. On an add-on install you can use{' '}
            <strong>NickServ accounts</strong> instead: people sign in with the account they
            already have on your network.
          </>
        ),
        points: [
          'Sign-up: open, invite only (codes with uses, expiry and a note) or closed.',
          'Guests: people chat under a nick without an account; optionally in voice too (new servers).',
          'Sign-in providers: single sign-on through OIDC and SAML identity providers.',
          'Optional email verification, and password reset by email (both need SMTP).',
        ],
        where: <>Admin panel → Users, Invites, Sign-in providers, Network settings.</>,
      },
    ],
  },
  {
    id: 'voice',
    title: 'Voice and video',
    features: [
      {
        title: 'Voice channels',
        body: (
          <>
            Voice rooms over QUIC: the channels you configure, plus ones people create, optionally
            under an IRC channel and locked to IRC roles (founder, op, voice). You decide who may
            create them: admins, channel founders or anyone signed in.
          </>
        ),
        where: <>Wizard → Features; admin panel → Network settings; <K>voice.rooms</K> in <K>config/boson.yaml</K>.</>,
      },
      {
        title: 'Camera and screen share',
        body: (
          <>
            Each voice channel has a video room. Join the channel, then turn on your camera or
            share your screen; leaving voice leaves video. Off by default: it needs its own name
            (<K>video.example.com</K>) and port 7710/udp.
          </>
        ),
        where: <>Wizard → Features (Video).</>,
      },
    ],
  },
  {
    id: 'uploads',
    title: 'File uploads',
    features: [
      {
        title: 'Uploads in chat',
        body: (
          <>
            Images, video, audio and documents the Boson app links in chat, served from their own
            hostname (<K>files.example.com</K>) so an upload never runs as your site. Each person
            has a quota over a rolling window, and files expire on their own. Stored on the
            server’s disk, in MinIO, or in an S3 bucket.
          </>
        ),
        points: [
          'Guests can upload too, with smaller limits, or not at all.',
          'Moderation: search, open and delete uploads; per-user quota overrides.',
        ],
        where: <>Admin panel → Uploads, Uploaded files; <K>files.*</K> in <K>config/boson.yaml</K>.</>,
      },
    ],
  },
  {
    id: 'clients',
    title: 'Web client and apps',
    features: [
      {
        title: 'Boson in the browser and on devices',
        body: (
          <>
            The web client at <K>chat.example.com</K> is the same app as the desktop one, run in
            the browser: chat, voice and video, signed in to your server. The Boson apps for
            macOS, Windows, Linux and Android connect to your server too, and find its accounts,
            voice and uploads through your domain’s <K>boson.json</K>.
          </>
        ),
        where: <>Always on. <a class="docs-link" href="/download">Download the apps</a>.</>,
      },
      {
        title: 'Your look',
        body: (
          <>
            Brand the client for your network: theme colours (dark or light base), a background
            per pane, corner radius and font, a logo and wordmark, and a sign-in background. The
            editor previews the client and the sign-in screen and warns about low contrast. The
            account emails take your logo, colours and wording too.
          </>
        ),
        where: <>Admin panel → Branding, Emails.</>,
      },
    ],
  },
  {
    id: 'network',
    title: 'Federation, directory and push',
    features: [
      {
        title: 'Federation',
        body: (
          <>
            People with an account on another Boson server use yours with{' '}
            <strong>Continue as alice@boson.chat</strong>, and yours sign in elsewhere. No
            passwords or chat cross servers. You choose who gets in: servers verified in the
            directory (the default), only servers you list, any server, or nobody; ban
            identities or block whole servers.
          </>
        ),
        where: <>Wizard → Features; admin panel → Federation.</>,
      },
      {
        title: 'The directory',
        body: (
          <>
            List your network in the Boson directory so people find it in the app’s server
            browser and on directory.boson.chat; you prove the hostname with one DNS TXT record.
            You can also run a directory of your own, federated with others.
          </>
        ),
        where: <>Wizard → Features; admin panel → Directory.</>,
      },
      {
        title: 'Push notifications',
        body: (
          <>
            DMs and mentions reach people while none of their devices is connected: in the
            browser, and on phones through boson.chat’s push relay. Encrypted on your server to
            the device’s key, so the relay, Apple and Google can’t read them. Accounts only.
          </>
        ),
        where: <>Nothing to set up.</>,
      },
    ],
  },
  {
    id: 'existing',
    title: 'For existing IRC servers',
    features: [
      {
        title: 'The bridge (evrd)',
        body: (
          <>
            On an add-on install, Boson users reach your UnrealIRCd, InspIRCd or ngIRCd through a
            bridge that connects each of them with WEBIRC, under their own nick and address, and
            adds what your server lacks: history, read markers, message IDs, echo. It keeps
            guests and federated users off registered nicks, and updates never drop anyone.
          </>
        ),
        where: <><a class="docs-link" href="/self-host/existing-irc">Existing IRC server guide</a>.</>,
      },
    ],
  },
  {
    id: 'admin',
    title: 'The admin panel',
    features: [
      {
        title: 'Run the network from a browser',
        body: (
          <>
            At <K>admin.example.com</K>, for the people whose roles allow it. It edits{' '}
            <K>config/boson.yaml</K>, which every service reloads live.
          </>
        ),
        points: [
          'Users (create, disable, sessions, reset emails), roles, channel access, invites, sign-in providers.',
          'Network settings, branding, emails, uploads, directory, federation.',
          'Audit log: admin actions, roles, sign-ins, SSO and password events.',
          'Stack health and certificates, services (restart, stop, start, logs), host metrics.',
          'Updates with changelogs, a backup first, checks after, and automatic rollback.',
        ],
        where: <>Always on. <a class="docs-link" href="/self-host/new-server#updates">How updates work</a>.</>,
      },
    ],
  },
];

export function SelfHostFeaturesPage() {
  return (
    <GuideLayout
      eyebrow="Self-host · Features"
      title="What a Boson install gives you."
      lead={
        <p>
          Everything below comes with the stack the installer sets up. Each card says where it’s
          configured: the setup wizard, the admin panel, or <K>config/boson.yaml</K> on the
          server.
        </p>
      }
      toc={[{ title: 'Features', items: GROUPS.map((g) => ({ id: g.id, label: g.title })) }]}
    >
      {GROUPS.map((g) => (
        <article class="doc-section" id={g.id} key={g.id} aria-labelledby={`${g.id}-h`}>
          <h2 id={`${g.id}-h`}>{g.title}</h2>
          <ul class="sh-features">
            {g.features.map((f) => (
              <li key={f.title}>
                <Card variant="raised">
                  <div class="sh-feature">
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                    {f.points ? (
                      <ul>
                        {f.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p class="sh-where">
                      <strong>Where:</strong> {f.where}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </GuideLayout>
  );
}
