# Cleanup report — V8

## Asset cleanup

- Public asset directory reduced from ~5.7 MB to ~460 KB.
- Image count reduced from 67 to 21.
- Removed 46 unreferenced duplicate/legacy images, including old PNG copies of WebP client logos, unused service illustrations, legacy partner logos, and superseded site logos.
- Replaced the 2048×434 PNG used only in transactional email with a dedicated 400×85 `logo-email.png` (~19 KB).
- Verified every remaining `/images/...` source reference resolves to an existing file.

## JavaScript/code cleanup

- Removed `framer-motion`; Health Check entry/loading transitions now use CSS/Tailwind.
- Removed a dead Health Check contact mutation that was never called.
- Removed unused icon/react imports.
- Replaced the legacy `trpc` compatibility facade with `src/lib/api.ts`, a small JSON API helper.
- Simplified the Wouter migration helper to a plain anchor compatibility component.
- Removed unused Card exports and duplicate case-study schema declared inside the page component.

## Repository cleanup

Removed obsolete migration/debug files from older stabilization iterations and replaced them with concise maintained documentation under `docs/`.

## Intentionally retained

- `public/hero-canvas.js`: active lightweight homepage animation.
- `public/adblocker-detector.js`: active delayed ad-block measurement.
- `public/robots.txt`, `public/llms.txt`, favicons: public discovery/browser endpoints.
- `public/.assetsignore`: Cloudflare asset deployment control.
- `astro.config.local.mjs`: required for reliable local development without Miniflare/workerd.
- React/lucide: still required by Contact, Health Check, and interactive case-study components.
