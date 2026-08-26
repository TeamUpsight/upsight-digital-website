# Architecture

## Rendering model

- Astro owns routing, layout, metadata, sitemap and static delivery.
- Content-heavy pages are pre-rendered to HTML.
- React is retained only where stateful browser interaction is useful: Contact, Health Check, and interactive case-study sections.
- The homepage network animation is a small vanilla-JavaScript canvas enhancement rather than a hydrated React animation loop.

## Server functionality

- `/api/contact` validates submissions and sends email through Resend.
- `/api/health-check` validates assessment results and sends email through Resend.
- Secrets are accessed with `astro:env/server` so the same source works locally and on Cloudflare.

## Analytics

Google Tag Manager is loaded from `BaseLayout.astro`. The ad-blocker detector is intentionally delayed until after page load so it does not compete with critical rendering.

## Asset policy

Only assets referenced by the live site, email templates, SEO metadata or browser endpoints should remain under `public/`. Prefer WebP for website imagery; PNG is retained only where broader email/client compatibility is useful.
