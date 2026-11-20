import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { fileURLToPath } from 'node:url';

// `@boson/shared` used to be a monorepo workspace package; it now lives in
// ./shared (a vendored copy of the bits this site uses).
const sharedSrc = fileURLToPath(new URL('./shared/src', import.meta.url));

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: [
      { find: /^@boson\/shared$/, replacement: `${sharedSrc}/index.ts` },
      { find: /^@boson\/shared\/(.*)$/, replacement: `${sharedSrc}/$1` },
    ],
  },
  server: {
    port: 5174,
    strictPort: false,
    // Allow all hosts — convenient for previewing through ngrok /
    // cloudflared / any tunnel without maintaining an allowlist.
    // Dev only; vite preview and the production build are unaffected.
    allowedHosts: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
