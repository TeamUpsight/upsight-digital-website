# Website hardening review

Branch: `codex/site-hardening`. No push, deployment, history rewrite, secret changes, DNS changes, or GTM container changes are part of this pass.

## P0 findings and changes

- Removed 16 committed `.wrangler/` runtime/state files from the index and ignored future state. Local files remain available; `wrangler.jsonc` is retained. A limited scan of the original tracked blobs found no recognizable email addresses or credential patterns. This is not a full historical secret/PII audit; history has not been rewritten.
- Removed deprecated TypeScript `baseUrl`; kept `@/*` mapped to `./src/*` and preserved matching Vite aliases.
- Added Astro type checks, TypeScript, and Rules of Hooks linting. `build` now runs `check`, regression tests, and Astro build; `deploy` runs that build first. Added GitHub validation for pull requests and pushes.
- Replaced nested Link/Button controls throughout the site with a typed `ButtonLink` sharing the existing button styles. Buttons remain buttons for actions. Removed misleading `asChild` support and unused custom accordion/collapsible components.
- Removed the Slice hook-in-map violation. Case-study static content no longer calls animation hooks; hook lint covers every source React component.
- Investigated the official workerd install script and added only `workerd` to the existing `esbuild` install-script allowlist. Compatible Astro, Cloudflare adapter, Wrangler and dependency updates resolved the initial six audit findings. No arbitrary install scripts are enabled.

## P1 findings and changes

- Roadsurfer now has zero React islands. Slice renders its article/charts/counters as server HTML with one deferred video island. A shared vanilla IntersectionObserver progressively enhances reveals/counters/charts; content and final values remain visible without JavaScript and respect reduced motion.
- Contact's consultation content and FAQs render without hydration; only the form is a React island. Native details/summary preserve keyboard behavior and `?form=open` remains supported.
- Extracted typed Health Check domain data and scoring from the large component. Nine fixtures captured the original scoring outputs before extraction; all report fields match. Server validation accepts bounded answers and recomputes the report, rejecting caller-supplied score/maturity/breakdown/risks/recommendations/report fields.
- Both public endpoints enforce JSON, same-origin browser requests, 24 KiB actual streamed body limits, field/array limits, honeypots and server-side Turnstile validation. Verification requires the expected action and hostname and fails closed. Body reads, Siteverify and Resend requests have 10/8/10 second limits. Team notifications, visitor confirmations, HTML escaping and reply-to behavior remain.
- Form verification refreshes after attempts, expiry/error is announced, and retry UI is available. Secrets are only read in server code. Tests intercept providers; they never send real emails.
- Adblock detection remains available locally through `upsight:adblock-detected`. Ad-tech probes and reporting require explicit relevant consent; reports omit query strings, fragments and GA client IDs. No cookies are read. Network checks omit credentials/referrers and abort on revocation.
- Hero canvas retains its particle density, glow, pointer interaction and height. It stops RAF offscreen, when the document is hidden, and for reduced motion. Static grid geometry is cached.
- Services and About technology logos now use small text/initial fallbacks within the existing card layout. Redistribution rights were not established from the repository, so no third-party assets were copied. This removes technology-logo requests rather than adding asset weight.
- Replaced invented client-number alt text with decorative treatment and kept duplicate slider content hidden from assistive technology. Added focus handling/visibility, accessible progress and errors, keyboard Resources/mobile menus, and corrected skipped headings and low-contrast labels/numerals. Layout and approved business copy are retained.

## P2 findings and changes

- Explicit service, answer, scoring, risk, recommendation, report and email input types replace avoidable unsafe typing. Stale migration comments were removed.
- Existing canonicals, sitemap, robots, Organization/WebSite/Service/Article/breadcrumb schemas, Open Graph, Twitter and llms content are retained. Asset/structured-data checks are recorded below.
- Business claims and contact hours were not rewritten. See decisions below.

## Required configuration before merge/deployment

1. Create/configure a managed Turnstile widget for `upsight.digital` and `www.upsight.digital` in the Cloudflare account. Set **PUBLIC_TURNSTILE_SITE_KEY in the build environment**, then rebuild. It is intentionally public and embedded in browser assets.
2. Set **TURNSTILE_SECRET_KEY as a runtime Worker secret**, retaining the existing `RESEND_API_KEY`. Never use a `PUBLIC_` prefix for either secret. No secrets were set by this pass.
3. Keep `TURNSTILE_LOCAL_BYPASS` unset/false in production. The bypass requires all three conditions: Astro development mode, loopback hostname, and explicit `true`. Local development may use the documented bypass with a blank public key, or a widget registered for localhost. Production preview builds intentionally do not bypass verification.
4. Check the connected Cloudflare build command is `npm run build`; direct `astro build` would skip the validation gate. Retain the existing deployment target. Require the GitHub Validate check for merges if branch protection is available; no repository settings were changed.
5. Before the approved merge, verify real Turnstile success/expiry/replay and both Resend deliveries on an approved environment. Server verification currently allowlists the two production hostnames; another preview hostname needs explicit allowlisting and widget registration. Do not wildcard this list or enable the production bypass.

Cloudflare references: [server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [widget rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [Workers build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

## Consent bridge

The source does not inspect undocumented GTM internals or infer permission from cookies. Until the site's CMP emits this bridge, the detector uses DOM checks only and sends no reports. GTM itself remains unchanged. The CMP owner should pass its actual Consent Mode state, including every later revocation:

```js
const consent = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
};
// Populate these values from the real CMP; do not unconditionally grant consent.
window.upsightConsent = consent;
window.dispatchEvent(new CustomEvent('upsight:consent', { detail: consent }));
```

All four must be `granted` for network checks/reporting. Default/missing/denied state blocks them. The initial window value supports consent established before script load. Reports use origin + pathname, blocked status, detector signal and a random per-event identifier. Optional per-session deduplication starts only after consent. An already sent report cannot be recalled by later revocation.

## Technology asset audit

| Technologies | Original source | Result |
| --- | --- | --- |
| GA4, GTM, Server-Side GTM, Consent Mode v2, Looker Studio | gstatic.com | Local text/initial fallback |
| Meta Conversions API | Wikimedia | Local text/initial fallback |
| Segment, Shopify, WooCommerce, BigQuery | worldvectorlogo.com | Local text/initial fallback |
| Tealium | g2crowd.com | Local text/initial fallback |
| Custom Platforms | Existing API text | Retained |

About's six duplicate technology references use the same fallback approach. The existing Cookiebot Certified Partner badge and Slice testimonial video still use the original CloudFront URLs. They carry business-specific branding/media and were not silently removed or replaced. Provide approved local originals/redistribution permission to eliminate those remaining external dependencies.

## Decisions and remaining debt

- Confirm whether Contact's **Dubai, UAE** and **Mon–Fri, 9 AM–6 PM EST** are intentional. Both were preserved.
- Confirm ownership/configuration of the CMP bridge and the existing Google Apps Script reporting endpoint before enabling consented reports.
- Supply authorized local Cookiebot partner badge/video assets and accurate testimonial captions. The video currently has native controls but no source caption file; no transcript or certification was invented.
- The existing team Health Check email labels raw category points with `%`; browser scoring uses category maxima. This existing presentation inconsistency is flagged for confirmation rather than changing the scoring or approved report wording.
- Turnstile limits automated submissions but is not an absolute rate limit or transactional delivery system. Concurrent team/visitor email delivery can partially succeed; retries may duplicate a message. No paid database or new stateful service was introduced.
- No Lighthouse/CWV comparison is claimed. The optional [web-perf skill](<C:/Users/LENOVO/.agents/skills/web-perf/SKILL.md>) requires Chrome DevTools MCP and says, "If unavailable, STOP—the chrome-devtools MCP server isn't configured." That MCP is unavailable here; browser/axe and explicit animation/hydration checks were used. Configure Chrome DevTools MCP for a follow-up performance trace; do not interpret browser test duration as LCP/TBT/INP.

## Validation

Validated on 2026-09-18 with Node 24.19.0, npm 11.17.0 and local Chrome. No production submissions were made.

| Check | Result |
| --- | --- |
| npm install / final npm ci | Success; 466 packages installed, 467 audited; 0 vulnerabilities; no blocked workerd script warning |
| npm run check | Success; 62 files, 0 errors, 0 warnings, 0 hints; hook lint passes |
| npm run build | Success; check + 31 tests + Astro/Cloudflare production build; 12 prerendered routes |
| npm test | 31/31 pass, including 9 original-scoring fixtures, security and privacy tests |
| npm run test:browser | 19/19 pass; targeted About test also passes after its final logo fallback change |
| Production Worker preview | All 12 requested routes have one H1, no nested interactive controls, no broken images, no console errors and no axe WCAG 2 A/AA, WCAG 2.1 AA or best-practice violations |
| API preview rejection | Malformed inputs: 400. Valid-shaped inputs without configured verification: 503 (fail closed); no email sent |
| 404 handling | /404 is the direct static error-page alias (200); an unknown URL returns 404 |
| Mobile | Home, About, Contact and Slice at 390 x 844: no horizontal overflow; mobile menu keyboard test passes |
| Static hygiene | No Button-in-Link AST matches, remaining as-any/asChild/ts-ignore matches, or tracked .wrangler files |
| Assets and SEO | 21 explicit local image references checked; none missing. Built image references load. JSON-LD parses, sitemap has 11 public URLs, existing SEO source content unchanged |
| Secret isolation | No configured private environment values found in public HTML/JS; no secret values printed |
| Visual review | Desktop home/Contact/Slice and mobile home screenshots inspected; no layout redesign |

The production preview includes normal GTM loading; its console checks are distinct from browser form tests that mock third-party providers. Native details, keyboard nav/skip link/Resources/Escape, service anchors/cards, case-study back links, Contact retry/success/repeat, Health Check completion/reset, video focus, no-JavaScript article content and reduced-motion/offscreen RAF behavior are covered.

Structured-data dimensions match actual files: organization logo **400 x 85**, Open Graph image **1200 x 800**. The email logo exists and is **400 x 85**. Robots and llms files remain unchanged; the sitemap preserves its existing trailing-slash serialization while page canonicals retain existing URLs.

Roadsurfer ships **0 React islands**; Slice ships **1 client:visible video island**, with the article rendered as HTML; Contact ships **1 form island**; Health Check ships **1 interactive island**. Other pages ship no React islands. Current raw chunks are SliceVideo 4,244 bytes, ContactForm 6,622 bytes, HealthCheck 35,522 bytes and shared Turnstile 3,013 bytes, plus shared React/runtime chunks when an island loads. These are raw build file sizes, not transfer sizes or measured CWV improvements.

The ordinary sandbox runner failed to initialize during the final pass. Authorized commands and browser checks ran through the reviewed elevated runner; this was a local tooling issue, not a build failure.

## Complete file manifest

### Added (17)

- `.github/workflows/validate.yml`
- `docs/HARDENING.md`
- `eslint.config.mjs`
- `playwright.config.ts`
- `src/components/CaseStudyEnhancements.astro`
- `src/components/ContactForm.tsx`
- `src/components/SliceVideo.tsx`
- `src/components/Turnstile.tsx`
- `src/lib/health-check/domain.ts`
- `src/lib/health-check/schema.ts`
- `src/lib/submission-security.ts`
- `tests/browser/site.spec.ts`
- `tests/fixtures/health-check.json`
- `tests/health-check.test.mjs`
- `tests/load-endpoint.mjs`
- `tests/privacy.test.mjs`
- `tests/submissions.test.mjs`

### Modified (38)

- `.env.example`
- `.gitignore`
- `astro.config.local.mjs`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `package-lock.json`
- `package.json`
- `public/adblocker-detector.js`
- `public/hero-canvas.js`
- `README.md`
- `src/components/AnimatedHero.tsx`
- `src/components/DataFlowDiagram.tsx`
- `src/components/LogoSlider.tsx`
- `src/components/Navigation.astro`
- `src/components/pages/About.tsx`
- `src/components/pages/CaseStudies.tsx`
- `src/components/pages/CaseStudyRoadsurfer.tsx`
- `src/components/pages/CaseStudySlice.tsx`
- `src/components/pages/Contact.tsx`
- `src/components/pages/CookieConsent.tsx`
- `src/components/pages/HealthCheck.tsx`
- `src/components/pages/Home.tsx`
- `src/components/pages/NotFound.tsx`
- `src/components/pages/Process.tsx`
- `src/components/pages/Services.tsx`
- `src/components/pages/WhoItsFor.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/progress.tsx`
- `src/layouts/BaseLayout.astro`
- `src/lib/email.ts`
- `src/pages/api/contact.ts`
- `src/pages/api/health-check.ts`
- `src/pages/case-studies/roadsurfer.astro`
- `src/pages/case-studies/slice.astro`
- `src/pages/contact.astro`
- `src/styles/global.css`
- `tsconfig.json`

### Deleted from version control (18)

- `.wrangler/deploy/config.json`
- `.wrangler/state/v3/cache/miniflare-CacheObject/metadata.sqlite`
- `.wrangler/state/v3/cache/miniflare-CacheObject/metadata.sqlite-shm`
- `.wrangler/state/v3/cache/miniflare-CacheObject/metadata.sqlite-wal`
- `.wrangler/state/v3/images/miniflare-images-KVNamespaceObject/metadata.sqlite`
- `.wrangler/state/v3/images/miniflare-images-KVNamespaceObject/metadata.sqlite-shm`
- `.wrangler/state/v3/images/miniflare-images-KVNamespaceObject/metadata.sqlite-wal`
- `.wrangler/state/v3/kv/miniflare-KVNamespaceObject/metadata.sqlite`
- `.wrangler/state/v3/kv/miniflare-KVNamespaceObject/metadata.sqlite-shm`
- `.wrangler/state/v3/kv/miniflare-KVNamespaceObject/metadata.sqlite-wal`
- `.wrangler/state/v3/observability/miniflare-wobs-trace-store/a590acd76969f996ec6e4b599c3c09f58c283a76f2d61392b5d3046caf557602.sqlite`
- `.wrangler/state/v3/observability/miniflare-wobs-trace-store/a590acd76969f996ec6e4b599c3c09f58c283a76f2d61392b5d3046caf557602.sqlite-shm`
- `.wrangler/state/v3/observability/miniflare-wobs-trace-store/a590acd76969f996ec6e4b599c3c09f58c283a76f2d61392b5d3046caf557602.sqlite-wal`
- `.wrangler/state/v3/observability/miniflare-wobs-trace-store/metadata.sqlite`
- `.wrangler/state/v3/observability/miniflare-wobs-trace-store/metadata.sqlite-shm`
- `.wrangler/state/v3/observability/miniflare-wobs-trace-store/metadata.sqlite-wal`
- `src/components/ui/accordion.tsx`
- `src/components/ui/collapsible.tsx`

The 16 .wrangler removals remove tracked runtime artifacts, not Git history. Local ignored files may be recreated by normal development. dist, node_modules, .astro, test-results and .hardening audit outputs are not committed.
