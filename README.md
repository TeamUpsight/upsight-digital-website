# Upsight Digital Website

Production website for [upsight.digital](https://upsight.digital), built with Astro and deployed to Cloudflare Workers.

## Quick start

```bash
npm ci
npm run dev
```

Local development runs Astro without the Cloudflare adapter to avoid Miniflare/workerd development-runtime issues.

## Production

```bash
npm run build
```

Production deployments are handled automatically by Cloudflare from the GitHub `main` branch.

## Secrets

Copy `.env.example` to `.env` for local development and set `RESEND_API_KEY` locally. Never commit `.env`.

Production requires `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` as Cloudflare Worker secrets, plus `PUBLIC_TURNSTILE_SITE_KEY` in the build environment. Forms fail closed until Turnstile is configured.

Use Node 24 LTS (minimum 22.18). `npm run build` runs type/hook checks and the scoring/security tests before building. `npm run test:browser` runs browser and accessibility checks with mocked delivery; install its browser with `npx playwright install chromium` first.

See [hardening and deployment notes](docs/HARDENING.md) before merging or deploying these changes.

See `docs/DEVELOPMENT.md` and `docs/ARCHITECTURE.md` for details.
