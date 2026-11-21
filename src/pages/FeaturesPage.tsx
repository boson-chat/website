import type { ComponentChildren } from 'preact';
import { Badge } from '@boson/shared';
import { FeatureCard } from '../components/FeatureCard/FeatureCard';
import { ScreenshotFrame } from '../components/ScreenshotFrame/ScreenshotFrame';
import './FeaturesPage.css';

// All-features overview. Grouped into themed sections, each a grid of
// FeatureCards. Icons are small 24×24 line marks matching the rest of the site.

export function FeaturesPage() {
  return (
    <>
      <section class="section hero features-hero">
        <div class="container" style="max-width: 760px;">
          <p class="eyebrow">Features</p>
          <h1>Everything Boson does.</h1>
          <p class="lead" style="margin-top: 20px;">
            A modern client for self-hosted IRC on desktop and Android — rich chat, voice and video
            channels, uploads, moderation, and services automation on top of an open protocol. No
            walled garden, no lock-in.
          </p>
          <div class="hero-cta" style="margin-top: 28px;">
            <a class="btn btn-primary" href="/download">Download</a>
            <a class="btn btn-ghost btn-arrow" href="/docs">Read the docs</a>
          </div>
        </div>
      </section>

      <FeatureSection
        eyebrow="Messaging"
        title="Chat that reads like chat."
        blurb="The message view understands modern formatting instead of dumping raw text."
        image="/screenshots/02-chat-readable.png"
        imageAlt="Boson chat showing a rendered table, markdown, and link cards"
        features={[
          { icon: <MarkdownIcon />, title: 'Markdown & tables', body: 'Bold, italic, strikethrough, inline code, links, and real HTML tables — pasted box-drawing and pipe tables are reconstructed into clean, scrollable grids.' },
          { icon: <EyeOffIcon />, title: 'Spoilers & emoji', body: 'Hide spoilers behind a click, drop in emoji from a searchable picker, and see your own nick right in the composer.' },
          { icon: <CodeIcon />, title: 'Code & monospace', body: 'Fenced code and columnar bot output render in aligned monospace blocks instead of wrapping into noise.' },
        ]}
      />

      <FeatureSection
        eyebrow="Rich media"
        title="Links that come alive — on your terms."
        blurb="Images, video, music, and link previews render inline, with a privacy-first click-to-load mode you control."
        image="/screenshots/02-chat.png"
        imageAlt="Inline Spotify track list and YouTube card in a Boson channel"
        features={[
          { icon: <ImageIcon />, title: 'Images & video', body: 'Inline images open in a full-screen lightbox; direct video files get an in-app player — no bouncing out to a browser.' },
          { icon: <PlayIcon />, title: 'YouTube & Spotify', body: 'YouTube plays inline; Spotify shows a native card with the full track list and 30-second previews — no account or API keys needed.' },
          { icon: <LinkIcon />, title: 'Link previews & safe files', body: 'Website links unfurl into rich cards (title, description, image). File links warn before download. Toggle any of it off globally.' },
        ]}
      />

      <FeatureSection
        id="voice"
        eyebrow="Voice & video"
        title="Voice channels, with cameras and screens."
        blurb="On networks that run a voice server, each one lists its voice channels in the sidebar. See who's in, join from a pre-join view, and turn on a camera or share your screen."
        image="/screenshots/feat-call.png"
        imageAlt="A call in a voice channel: one camera large, the rest in a strip, and who's speaking on the right"
        features={[
          { icon: <MicIcon />, title: 'Voice channels', body: 'Open mic or push to talk, a mic test, per-person volume, and Standard, High or Music quality. On desktop, use headphones: echo cancellation there is still to come.' },
          { icon: <CameraIcon />, title: 'Cameras, lip-synced', body: 'Every voice channel is also a video channel. Video waits for its sound, so lips match words; the stage shows one person big or everyone in a grid.' },
          { icon: <ScreenIcon />, title: 'Screen sharing (desktop)', body: 'Pick a screen or a window from thumbnails. On macOS 13+ you can share its sound too, heard in sync by everyone watching.' },
          { icon: <GuestIcon />, title: 'Guests in calls', body: 'Where a network allows it, people without an account can join voice and video under their IRC nick, with a guest badge.' },
          { icon: <LockIcon />, title: 'Roles and locks', body: 'Voice channels can sit under a text channel and be limited to its ops or voiced members, or be listen-only for most people, as the server allows.' },
          { icon: <GaugeIcon />, title: 'Data saver', body: 'Camera quality on Auto, Data saver or High. On mobile data, Data saver keeps your camera at 360p.' },
        ]}
      />

      <PhoneSection />

      <FeatureSection
        eyebrow="Uploads"
        title="Send files, not just links."
        blurb="Drop images and files on a channel, or pick them, and Boson uploads them and posts the links. Images show inline like any other."
        image="/screenshots/feat-uploads.png"
        imageAlt="The upload sheet with three images ready to send to #dev and the storage quota below"
        features={[
          { icon: <UploadIcon />, title: 'Several at once', body: 'Up to 20 files in one go, each renamable, with one caption for the lot. Progress shows in the channel while they send.' },
          { icon: <ServersIcon />, title: "The network's own host", body: "Uploads go to the network's files host when it has one; otherwise to the one that comes with your Boson account." },
          { icon: <GaugeIcon />, title: 'Quota at a glance', body: "The sheet shows how much of your rolling quota you've used, so a big upload doesn't fail halfway." },
        ]}
      />

      <FeatureSection
        eyebrow="Moderation"
        title="Full channel-operator control."
        blurb="Everything a channel op needs, from a clean UI instead of memorized slash commands."
        image="/screenshots/feat-moderation.png"
        imageAlt="Channel settings, Registration tab: a registered channel, its founder, and the roles given to accounts when they join"
        features={[
          { icon: <ShieldIcon />, title: 'Channel modes', body: 'Toggle moderated, invite-only, topic-lock, secret, and more — set a key or user limit — from the Channel Settings panel.' },
          { icon: <GavelIcon />, title: 'Kick, ban & promote', body: 'Right-click any member to kick, ban, kick-ban, or grant op / halfop / voice / admin / owner — gated by your own rank.' },
          { icon: <ListIcon />, title: 'Registration & roles', body: 'Register a channel with ChanServ and manage who gets admin, op, half-op or voice on join, plus topic lock and history — on Ergo, Anope and Atheme. Bans and topic sit on the Channel tab.' },
        ]}
      />

      <FeatureSection
        eyebrow="Services"
        title="NickServ, automated."
        blurb="Boson talks to network services for you — no /msg NickServ choreography."
        image="/screenshots/feat-services.png"
        imageAlt="Server Identity panel: detected Atheme services, an E2E-synced NickServ password, and auto-IDENTIFY"
        features={[
          { icon: <KeyIcon />, title: 'Auto-identify', body: 'Saved per-server credentials identify you to NickServ on connect. Atheme, Anope, and Ergo are detected automatically.' },
          { icon: <InboxIcon />, title: 'MemoServ inbox', body: 'Memos surface in an in-app inbox with unread tracking, instead of scrolling past service notices.' },
          { icon: <UserCheckIcon />, title: 'Nick claims', body: 'Where a network turns it on, signed-in users get an automated nick-registration flow so your nick stays yours.' },
        ]}
      />

      <FeatureSection
        eyebrow="Connectivity"
        title="Many servers, always on."
        blurb="Connect to any self-hosted network, with or without a bouncer."
        image="/screenshots/03-directory.png"
        imageAlt="Server directory with searchable, verified self-hosted IRC servers"
        features={[
          { icon: <RelayIcon />, title: 'Bouncers', body: 'ZNC, and bouncers that speak the soju protocol (soju, evrd): always-on presence, backlog fetched on every attach, DMs included, and scrollback that loads as you scroll up.' },
          { icon: <ServersIcon />, title: 'Multi-server', body: 'Run several networks side by side; per-server identity, nicks, and credentials stay isolated. Networks with their own accounts sign you in there, with SSO where they offer it.' },
          { icon: <GlobeIcon />, title: 'A federated directory', body: 'Browse directory.boson.chat and any other directory you add, merged into one list — or add a private server by hand in seconds.' },
        ]}
      />

      <FeatureSection
        eyebrow="Desktop app"
        title="Built for the desktop."
        blurb="A native app, not a tab — with the polish you'd expect."
        image="/screenshots/feat-desktop.png"
        imageAlt="Notification settings: in-app toasts, system notifications, mentions, direct messages and friends"
        features={[
          { icon: <BellIcon />, title: 'Desktop notifications', body: 'Native alerts for mentions and DMs when the window is in the background — not for the channel you are reading; click to jump straight to the conversation.' },
          { icon: <ResizeIcon />, title: 'Your layout, kept', body: 'Resize the channel and member lists and drag channels into your own order; layout, positions and session persist across restarts.' },
          { icon: <DesktopIcon />, title: 'Cross-platform, updates in-app', body: 'macOS (Apple Silicon and Intel), Windows and Linux, on each system’s own webview. Updates install from inside the app, with what changed in every release since yours.' },
        ]}
      />

      <FeatureSection
        eyebrow="Appearance"
        title="Make it yours."
        blurb="Every colour in the app comes from its theme. Pick one, build your own, or let a network bring its own look."
        image="/screenshots/feat-network-theme.png"
        imageAlt="A channel in a network's own theme: violet colours and a picture behind the messages"
        features={[
          { icon: <PaletteIcon />, title: 'Five built-in themes', body: 'Terminal, Daylight, Nord, Solarized, and Phosphor — switch in one click, applied instantly across the app.' },
          { icon: <DropperIcon />, title: 'Live theme editor', body: 'A colour picker with hue, opacity, hex, eyedropper, and the theme\'s own colours to reuse — plus corners, font, and nick colours, all previewed live. Themes are plain JSON files you can share.' },
          { icon: <FileIcon />, title: 'Network themes', body: 'A network can publish its own colours (light and dark), logo, pane backgrounds and sign-in picture. They apply while you are on it; turn them off for one network or all.' },
        ]}
      />

      <FeatureSection
        eyebrow="Privacy & security"
        title="Your keys, your machine."
        blurb="Credentials never leave your control, and previews never leak your IP unasked."
        image="/screenshots/feat-privacy.png"
        imageAlt="Content settings with per-type embed toggles and click-to-load"
        features={[
          { icon: <LockIcon />, title: 'One account, every server', body: 'Sign in once; per-server IRC credentials are encrypted and stored in your OS keychain — never in plain text.' },
          { icon: <EyeOffIcon />, title: 'Privacy-first previews', body: 'Switch embeds to click-to-load so no remote content (or your IP) is fetched until you ask. Link unfurls are SSRF-guarded.' },
          { icon: <ProtocolIcon />, title: 'Open protocol, local engine', body: 'Plain IRC underneath, spoken by a local Go engine on your machine. No proprietary lock-in — leave whenever you like.' },
        ]}
      />

      <FeatureSection
        id="self-hosting"
        eyebrow="Self-hosting"
        badge="Coming soon"
        title="The whole server side, on your own domain."
        blurb="Today you can point Boson at any IRC server and list it in the directory. We're preparing the Boson stack — everything boson.chat itself runs on — for others to install. There's no supported way to set it up yet."
        features={[
          { icon: <ServersIcon />, title: 'The Boson stack', body: 'IRC (Ergo), accounts with SSO and network roles, voice, video, file uploads and a directory, wired together for one domain with automatic TLS.' },
          { icon: <GaugeIcon />, title: 'An admin panel', body: 'Users and invites, sign-in providers, network settings such as guest access, an audit log, and the health and metrics of each service.' },
          { icon: <GlobeIcon />, title: 'Your own directory', body: 'A directory of your own that federates with directory.boson.chat, so your members see the whole network plus your listings.' },
        ]}
      />

      <section class="section cta-strip">
        <div class="container">
          <div class="cta-row">
            <div>
              <h2>Ready to try it?</h2>
              <p class="lead" style="margin-top: 12px;">Free, open-source, and self-hostable.</p>
            </div>
            <div class="hero-cta">
              <a class="btn btn-primary" href="/download">Download Boson</a>
              <a class="btn btn-secondary" href="/discover">Browse servers</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureSection({
  id, eyebrow, badge, title, blurb, features, image, imageAlt,
}: {
  id?: string;
  eyebrow: string;
  // A status label beside the eyebrow ("Coming soon").
  badge?: string;
  title: string;
  blurb: string;
  features: { icon: ComponentChildren; title: string; body: string }[];
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section class="section features-section" id={id}>
      <div class="container stack" style="gap: 40px;">
        <div class="features-section-head">
          <p class="eyebrow">
            {eyebrow}
            {badge ? <> <Badge tone="warn">{badge}</Badge></> : null}
          </p>
          <h2>{title}</h2>
          <p class="lead">{blurb}</p>
        </div>
        {image && (
          <figure class="features-shot">
            <img src={image} alt={imageAlt ?? title} loading="lazy" />
          </figure>
        )}
        <div class="grid-3">
          {features.map((f) => (
            <FeatureCard key={f.title} title={f.title} icon={f.icon}>{f.body}</FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// Phones: two phone-size shots side by side instead of one window shot.
function PhoneSection() {
  return (
    <section class="section features-section" id="phones">
      <div class="container stack" style="gap: 40px;">
        <div class="features-section-head">
          <p class="eyebrow">On your phone</p>
          <h2>The same app, in your pocket.</h2>
          <p class="lead">
            Boson runs on Android with a phone layout: one pane at a time, a composer that stays
            above the keyboard, and calls that fill the screen.
          </p>
        </div>
        <div class="features-phones">
          <ScreenshotFrame
            src="/screenshots/phone-chat.png"
            alt="Boson on a phone: #dev with a YouTube card, the composer, and a bar for the voice call in progress"
            width={786}
            height={1704}
            variant="phone"
          />
          <ScreenshotFrame
            src="/screenshots/phone-call.png"
            alt="A video call on a phone: two camera tiles, a self view in the corner and the call controls"
            width={786}
            height={1704}
            variant="phone"
          />
        </div>
        <div class="grid-3">
          <FeatureCard title="Android, iOS in testing" icon={<PhoneIcon />}>
            Android 8.0 and newer, as an APK from the releases page (not on Google Play yet) that
            updates itself in-app. The iOS app is in testing and not available to install yet.
          </FeatureCard>
          <FeatureCard title="Calls on the go" icon={<MicIcon />}>
            Voice and camera calls with the phone's own echo cancelling, speaker or earpiece,
            Bluetooth headsets, a call that keeps going with the screen locked, and a screen that
            stays awake while you're in one.
          </FeatureCard>
          <FeatureCard title="Stays connected" icon={<RelayIcon />}>
            Connections are kept alive on mobile data and checked when you come back or switch
            networks. With a bouncer or IRCv3 history, what you missed fills in. No push
            notifications yet.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

/* ---- icons (24×24 line marks, currentColor) ---- */
const svg = (children: ComponentChildren) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    {children}
  </svg>
);
const MarkdownIcon = () => svg(<><rect x="3" y="6" width="18" height="12" rx="1.5" /><path d="M6 14V9.5l2.2 2.2L10.4 9.5V14M14 9.5V14m0 0 2 -2m-2 2-2-2" /></>);
const EyeOffIcon = () => svg(<><path d="M3 3l18 18M10.6 6.1A9.5 9.5 0 0 1 21 12a10 10 0 0 1-3.3 3.9M6.3 6.3A10 10 0 0 0 3 12a9.6 9.6 0 0 0 11 4.7" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>);
const CodeIcon = () => svg(<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" />);
const ImageIcon = () => svg(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="M21 16l-5-5L5 21" /></>);
const PlayIcon = () => svg(<><circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5z" /></>);
const LinkIcon = () => svg(<><path d="M9.5 14.5l5-5" /><path d="M7 12l-2 2a3.5 3.5 0 0 0 5 5l2-2" /><path d="M17 12l2-2a3.5 3.5 0 0 0-5-5l-2 2" /></>);
const ShieldIcon = () => svg(<path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />);
const GavelIcon = () => svg(<><path d="M14 4l6 6-3 3-6-6z" /><path d="M11 7L4 14l3 3 7-7" /><path d="M3 21h9" /></>);
const ListIcon = () => svg(<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />);
const KeyIcon = () => svg(<><circle cx="7.5" cy="15.5" r="3.5" /><path d="M10 13l9-9M16 4l3 3M14 6l2 2" /></>);
const InboxIcon = () => svg(<><path d="M3 13l3-8h12l3 8v6H3z" /><path d="M3 13h5l1 2h6l1-2h5" /></>);
const UserCheckIcon = () => svg(<><circle cx="9" cy="8" r="3.5" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 12l2 2 4-4" /></>);
const RelayIcon = () => svg(<><path d="M3 8h12M12 5l3 3-3 3" /><path d="M21 16H9m3 3l-3-3 3-3" /></>);
const ServersIcon = () => svg(<><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><path d="M7 7.5h.01M7 16.5h.01" /></>);
const GlobeIcon = () => svg(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>);
const BellIcon = () => svg(<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 19a2 2 0 0 0 4 0" /></>);
const ResizeIcon = () => svg(<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M14 4v16M17.5 10l2 2-2 2M10.5 10l-2 2 2 2" /></>);
const DesktopIcon = () => svg(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>);
const LockIcon = () => svg(<><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
const PaletteIcon = () => svg(<><path d="M12 3a9 9 0 0 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.6 0-.9.7-1.4 1.6-1.4H17a4 4 0 0 0 4-4c0-4.6-4-8.3-9-8.3z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10" cy="7" r="1" /><circle cx="15" cy="7.5" r="1" /></>);
const DropperIcon = () => svg(<><path d="M14.5 4.5a2.1 2.1 0 0 1 3 3L9 16l-4 1 1-4z" /><path d="M13 6l5 5" /><path d="M4 20h4" /></>);
const FileIcon = () => svg(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9.5 13l-1.5 1.5L9.5 16M14.5 13l1.5 1.5-1.5 1.5" /></>);
const MicIcon = () => svg(<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>);
const CameraIcon = () => svg(<><rect x="3" y="7" width="13" height="10" rx="2" /><path d="M16 11l5-3v8l-5-3" /></>);
const ScreenIcon = () => svg(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4M9.5 10l2.5-2.5L14.5 10M12 7.5V13" /></>);
const GuestIcon = () => svg(<><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /><path d="M18 4h3M19.5 2.5v3" /></>);
const GaugeIcon = () => svg(<><path d="M4 17a8 8 0 1 1 16 0" /><path d="M12 17l4-5" /></>);
const UploadIcon = () => svg(<><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>);
const PhoneIcon = () => svg(<><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></>);
const ProtocolIcon = () => svg(<><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M6 8.5v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3M12 13.5v2" /></>);
