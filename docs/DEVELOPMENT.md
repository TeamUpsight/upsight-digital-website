# Development workflow

## Normal edit cycle

1. Open the repository in VS Code.
2. Run `npm run dev`.
3. Test changes at `http://localhost:4321`.
4. Stop the dev server with `Ctrl+C`.
5. Run `npm run build` before committing.
6. Commit and push with GitHub Desktop.
7. Cloudflare automatically builds and deploys `main`.

## Local environment

Create `.env` from `.env.example` and add the local `RESEND_API_KEY` when testing Contact or Health Check submissions.

## Important files

- `src/pages/` — routes and API endpoints
- `src/components/` — page sections, interactive React islands, shared UI
- `src/layouts/BaseLayout.astro` — site shell, metadata, GTM and structured data
- `src/lib/api.ts` — browser API requests
- `src/lib/email.ts` — transactional email rendering/sending
- `src/lib/seo.ts` — structured data helpers
- `public/images/` — production image assets only
- `public/hero-canvas.js` — lightweight homepage canvas animation
- `wrangler.jsonc` — Cloudflare Worker deployment configuration
