# Upsight Digital — Performance, SEO & UI Optimization Pass

Updated: 2026-08-27

## Main performance changes

- Removed `client:only="react"` from the homepage and other content-heavy static pages so their content is generated as HTML at build time instead of waiting for a full React page bundle in the browser.
- Rebuilt the homepage animated hero as server-rendered markup plus a small progressive canvas enhancement (`/hero-canvas.js`). The canvas is disabled on mobile and for reduced-motion users and is throttled to ~30 FPS on desktop.
- Rebuilt the logo slider as CSS-only markup and reduced duplicate logo nodes from three sets to two.
- Added `content-visibility: auto` to below-the-fold sections to reduce initial layout/rendering work.
- Added explicit image dimensions/lazy loading where missing and added a 151×32 navigation logo asset to avoid downloading the larger 400×85 logo for the header.
- Deferred the non-essential custom ad-blocker detector until after critical page load.
- Google Fonts are loaded non-render-blocking and use `display=optional`; Roboto Mono was replaced with the system monospace stack.
- Kept GTM asynchronous and intact to avoid breaking analytics measurement.

## Lighthouse/accessibility fixes

- Added a single semantic `<main>` landmark in the shared layout.
- Added a keyboard-accessible skip link.
- Darkened primary CTA button backgrounds to meet text contrast requirements while retaining the Upsight teal family.
- Replaced generic `Learn More` links with descriptive link/button text.
- Added explicit image dimensions where missing.
- Added reduced-motion handling.

## SEO & AI discovery changes

- Core marketing pages now ship their actual content in initial HTML instead of relying on client-side React rendering.
- Canonical URL, robots, Open Graph, Twitter and rich preview metadata centralized in the shared layout.
- Added site-wide Organization and WebSite structured data.
- Added automatic BreadcrumbList structured data on internal pages.
- Added Service structured data to service pages and Article-style case-study structured data to case studies.
- Added CollectionPage + ItemList structured data to the case-study index.
- Corrected organization logo metadata.
- Corrected `robots.txt` to reference Astro's real `/sitemap-index.xml`.
- Configured Astro sitemap generation and removed unused sitemap namespaces.
- Rewrote `/llms.txt` with descriptive Markdown links to the site's core first-party resources. This is maintained for agent/browser compatibility; Google Search does not require it for AI visibility.
- Improved case-study title/description snippets.

## Requested UI/navigation changes

- `Case Studies` is now a top-level navigation item immediately after `Services`.
- `Case Studies` was removed from the Resources dropdown.
- Resources chevron now matches the original Manus treatment (proper 16px desktop / 20px mobile SVG, spacing and alignment).
- Restored the original-style Free Health Check navigation treatment without React.
- Homepage solution cards are fully clickable and deep-link to the corresponding service on `/services`.
- Footer service links use matching service IDs; static rendering means the target exists when the browser processes a hash URL.
- Cookie Consent `Audit My Tracking & Compliance` now links to `/health-check`.
- Slice and Roadsurfer case-study pages now include `Back to Case Studies` links with arrows.

## Intentionally unchanged

GTM/GA4 and Meta Pixel were not disabled or artificially delayed because that could alter analytics/advertising measurement. Lighthouse shows they remain significant third-party JavaScript contributors. Review firing rules, consent gating and unnecessary tags inside GTM separately after this code release.

## Validation before production

1. `npm run dev`
2. Test homepage navigation and Resources dropdown on desktop/mobile.
3. Test all six homepage solution cards.
4. Test footer service deep links from the homepage and another page.
5. Test Cookie Consent CTA.
6. Test both case-study back links and their interactive content.
7. Test Contact and Health Check submissions.
8. `npm run build`
9. Commit/push through GitHub Desktop.
10. After Cloudflare deploys, rerun Lighthouse in Incognito/Guest mode with extensions disabled.
