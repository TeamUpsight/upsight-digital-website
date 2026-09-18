# Development workflow

## Normal edit cycle

1. Open the repository in VS Code.
2. Run `npm run dev`.
3. Test changes at `http://localhost:4321`.
4. Stop the dev server with `Ctrl+C`.
5. Run `npm ci`, `npm run check`, `npm run build`, and `npm run test:browser` before committing.
6. Commit to a feature branch. Review the changes and configuration before merging.
7. Cloudflare automatically builds and deploys `main`; use `npm run build` as its build command.

## Local environment

Create `.env` from `.env.example` and add the local `RESEND_API_KEY` when testing Contact or Health Check submissions.

For verification locally, set `TURNSTILE_LOCAL_BYPASS=true` and leave the public site key blank, or use a widget registered for your local hostname. The bypass is ignored outside development on loopback. The automated tests mock both providers and never send emails. Do not send automated tests to production with a live Resend key.

Use Node 24 LTS (minimum 22.18). Install the browser with `npx playwright install chromium`. On this Windows workstation, `PLAYWRIGHT_CHANNEL=chrome` uses the installed Chrome instead. Playwright owns a foreground dev server on port 4322; Astro's dev toolbar is disabled only in that test environment.

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


For agent session/branch guidance, start at [AGENTS.md](../AGENTS.md); this remains the current technical development reference.
