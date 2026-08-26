# Upsight Digital Website

Production website for [upsight.digital](https://upsight.digital), built with Astro and deployed to Cloudflare Workers.

## Quick start

```bash
npm install
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

The production `RESEND_API_KEY` is stored as a Cloudflare Worker secret.

See `docs/DEVELOPMENT.md` and `docs/ARCHITECTURE.md` for details.
