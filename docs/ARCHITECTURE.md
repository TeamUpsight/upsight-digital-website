# Architecture

## Rendering model

- Astro owns routing, layout, metadata, sitemap and static delivery.
- Content-heavy pages are pre-rendered to HTML.
- Hydrated React is limited to the Contact form, Health Check, and Slice video. The article/content components remain TSX rendered by Astro on the server, without hydration. Roadsurfer ships no React client code.
- Case-study reveals, counters and charts use one shared IntersectionObserver; final content and values remain visible without JavaScript and with reduced motion.
- The homepage network animation is a small vanilla-JavaScript canvas enhancement rather than a hydrated React animation loop.

## Server functionality

- `/api/contact` validates submissions and sends email through Resend.
- `/api/health-check` validates questionnaire answers, recomputes results in the shared pure scoring module, and sends email through Resend. Client-supplied report fields are rejected.
- Both endpoints require server-verified Turnstile tokens, check a honeypot, limit actual request bytes and field lengths, enforce same-origin browser submissions, and time out provider requests.
- Secrets are accessed with `astro:env/server` so the same source works locally and on Cloudflare.

## Analytics

Google Tag Manager is loaded from `BaseLayout.astro` with its existing container. The delayed ad-blocker detector runs locally in DOM-only mode until the documented consent bridge explicitly permits network probes/reporting. It never reads the GA cookie or reports query strings. See `HARDENING.md` for the consent contract.

## Asset policy

Only assets referenced by the live site, email templates, SEO metadata or browser endpoints should remain under `public/`. Prefer WebP for website imagery; PNG is retained only where broader email/client compatibility is useful.
