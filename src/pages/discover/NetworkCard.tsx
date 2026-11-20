import { useMemo, useState } from 'preact/hooks';
import { address, joinUrl, langName, num, originLabel, DIRECTORY_URL, type HealthStatus, type Network } from './directory';
import { listingStyle, readTheme } from './theme';

// Ports of boson-chat/directory ui/src/lib/components/NetworkCard.svelte,
// NetworkIcon.svelte and Health.svelte.

/** A network's square icon, or its initial on a tinted tile. */
export function NetworkIcon({ name, url }: { name: string; url?: string | null }) {
  const [failed, setFailed] = useState(false);
  const initial = (name.trim()[0] ?? '#').toUpperCase();
  return (
    <span class="dsc-icon" aria-hidden="true">
      {url && !failed ? (
        <img src={url} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span class="dsc-icon-letter">{initial}</span>
      )}
    </span>
  );
}

const HEALTH_LABEL: Record<HealthStatus, string> = { up: 'Online', down: 'Offline', unknown: 'Not checked' };

export function Health({ status, users }: { status: HealthStatus; users?: number | null }) {
  return (
    <span class="dsc-health" data-h={status}>
      <span class="dsc-dot" aria-hidden="true" />
      <span>{HEALTH_LABEL[status] ?? status}</span>
      {status === 'up' && users !== null && users !== undefined ? (
        <span class="dsc-health-users">
          <strong>{num(users)}</strong> {users === 1 ? 'user' : 'users'}
        </span>
      ) : null}
    </span>
  );
}

export function NetworkCard({ network: n }: { network: Network }) {
  const [bannerFailed, setBannerFailed] = useState(false);
  // The network's own colours, where they read (see listingStyle).
  const theme = useMemo(() => readTheme(n.theme), [n.theme]);
  const style = useMemo(() => listingStyle(theme), [theme]);
  const themed = Object.keys(style).length > 0;
  const tinted = '--accent' in style;
  const hasBanner = !!n.banner_url && !bannerFailed;
  const titleId = `nc-${n.id}`;

  return (
    <article class={`dsc-card${themed ? ' themed' : ''}`} aria-labelledby={titleId} style={style}>
      <div class={`dsc-banner${hasBanner ? '' : ' empty'}${tinted ? ' tinted' : ''}`}>
        {hasBanner ? <img src={n.banner_url!} alt="" loading="lazy" onError={() => setBannerFailed(true)} /> : null}
      </div>
      <div class="dsc-body">
        <div class="dsc-head">
          <span class="dsc-ic">
            <NetworkIcon name={n.name} url={n.icon_url ?? theme?.logo} />
          </span>
          <div class="dsc-title">
            <h2 id={titleId}>
              {/* the whole card opens the listing; the join button sits above it */}
              <a href={`${DIRECTORY_URL}/n/${encodeURIComponent(n.id)}`}>{n.name}</a>
            </h2>
            <span class="dsc-addr">{address(n)}</span>
          </div>
        </div>
        {n.description ? <p class="dsc-desc">{n.description}</p> : null}
        <div class="dsc-meta">
          <Health status={n.health_status} users={n.user_count} />
          {n.languages.length ? (
            <span class="dsc-langs" title={n.languages.map(langName).join(', ')}>
              {n.languages.slice(0, 3).join(' ').toUpperCase()}
              {n.languages.length > 3 ? ' +' : ''}
            </span>
          ) : null}
        </div>
        {n.tags.length || n.is_nsfw || n.origin !== 'local' ? (
          <div class="dsc-tags">
            {n.is_nsfw ? <span class="dsc-tag dsc-tag-bad">18+</span> : null}
            {n.tags.slice(0, 4).map((t) => (
              <span key={t} class="dsc-tag">{t}</span>
            ))}
            {n.origin !== 'local' ? (
              <span class="dsc-tag dsc-tag-src" title={`Imported from ${originLabel(n)}, re-checked here`}>
                via {originLabel(n)}
              </span>
            ) : null}
          </div>
        ) : null}
        <div class="dsc-actions">
          <a class="dsc-btn dsc-btn-small dsc-join" href={joinUrl(n)}>Open in Boson</a>
        </div>
      </div>
    </article>
  );
}
