# Upsight Digital — Astro migration notes

This project was migrated from the latest Manus React/Vite/Express export to Astro.

## Already migrated
- Astro file-based routes for all current public URLs.
- Static SEO metadata, canonical tags, Open Graph, Twitter cards and JSON-LD.
- Shared Astro navigation and footer.
- Current Tailwind 4 design system and public images/assets.
- GTM container `GTM-T737M5FZ` preserved.
- Manus runtime, Manus analytics, auth, Wouter SPA router, Express and tRPC removed from the runtime architecture.
- Contact and Health Check now call Astro API endpoints designed for Cloudflare Workers.
- Resend email is called through the HTTPS API from the Worker; the secret stays server-side.
- Raw contact PII/email was removed from dataLayer events.
- The old Health Check PDF generation was removed because the current UI did not expose the generated PDF to the visitor.

## React still intentionally retained
Astro is already the application/router, but these high-interactivity page bodies are temporarily hydrated as React islands to preserve behavior during the first migration:
- Homepage (animated hero)
- Slice case study
- Roadsurfer case study
- Contact form
- Health Check

Services, Who It's For, Process, About, Case Studies index and Cookie Consent are server-rendered without client hydration.

A later performance pass can split the homepage/case studies into smaller Astro sections and hydrate only individual interactive widgets.

## Local commands
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Local email testing
1. Copy `.dev.vars.example` to `.dev.vars`.
2. Put the real Resend key in `.dev.vars`.
3. Restart `npm run dev`.

## Cloudflare secret
Before production form testing:
```bash
npx wrangler secret put RESEND_API_KEY
```

Do not put the API key in source files or GitHub.
