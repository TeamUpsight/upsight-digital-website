# V4 local development fix

`npm run dev` now uses `astro.config.local.mjs`, which intentionally omits the Cloudflare adapter. This avoids Miniflare/workerd intercepting local page requests.

- Local development: `npm run dev`
- Optional Cloudflare-runtime development: `npm run dev:cloudflare`
- Production Cloudflare build: `npm run build`
- Production-style Cloudflare preview after build: `npm run preview`

Do not use `npm run dev:cloudflare` while validating page navigation; the current Cloudflare Vite/Miniflare path is the source of the local `fetch failed` issue seen on Windows.
