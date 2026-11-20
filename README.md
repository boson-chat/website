# boson.chat website

The marketing site for [Boson](https://boson.chat): Vite + Preact
(`preact-iso` for routing), served from the Cloudflare Worker `boson-chat`
using Workers Static Assets.

## Layout

| Path | What |
| --- | --- |
| `src/` | Pages, components and site styles |
| `shared/` | Vendored copy of the Boson design-system pieces the site uses (tokens, Card, Badge, Toggle, AtomLoader, BosonGlyph). Imported as `@boson/shared`, an alias set in `vite.config.ts` and `tsconfig.json`. |
| `public/` | Static files copied as-is, including `.well-known/boson.json` (client discovery) and `_headers` |
| `wrangler.toml` | Worker config (`boson-chat`, assets from `./dist`, SPA fallback) |

## Develop

Requires Node 20+ (CI uses Node 24).

```sh
npm ci
npm run dev        # http://localhost:5174
```

The Discover page reads the public network directory's API
(`/v1/networks`, `/v1/facets`), which answers any origin. Set
`VITE_DIRECTORY_URL` (default `https://directory.boson.chat`) in
`.env.local` to point it elsewhere. Production builds need no env.

## Build

```sh
npm run typecheck
npm run build      # → dist/
npm run preview    # serve dist/ locally
```

## Deploy

`.github/workflows/deploy.yml` does it:

- **Pull request** — typecheck + build, then `wrangler versions upload
  --preview-alias pr-<n>`: a preview URL that is *not* deployed to
  production (same-repo PRs only).
- **Push to `main`** — typecheck + build, then `wrangler deploy` to the
  `boson-chat` Worker, which serves boson.chat.

It needs the repo secrets `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit +
User Details: Read) and `CLOUDFLARE_ACCOUNT_ID`. If the token is missing the
deploy steps are skipped with a notice and only the build runs.

Manual deploy, with the same credentials in your environment:

```sh
npm run build
npx wrangler@4 deploy
```

## License

Copyright (C) 2026 bludot / the boson authors

Licensed under the [GNU Affero General Public License v3.0](LICENSE) only (`AGPL-3.0-only`).

In plain English: if you run a modified version of this software as a network service, you must offer its source code to the people who use that service.
