# Architectural risks and safe-change rules

## Critical invariants

### Turnstile

**Risk:** The public key is build-time configuration while the secret is a Worker runtime secret; forms deliberately fail closed and production host validation is restricted.

**Why it matters:** Moving secrets client-side, weakening verification or making missing configuration succeed creates spam/security exposure.

**Safe change:** Trace `submission-security.ts`, both API routes and the relevant form. Keep server verification, action/hostname checks and failure paths; test both configured and unavailable-security cases.

### Health Check

**Risk:** Browser state is presentation only; scoring is recomputed on the server and forged score/report fields are rejected.

**Why it matters:** Trusting client output permits manipulated reports and misleading email records.

**Safe change:** Change shared scoring/schema logic and API validation together, retain server recomputation, and exercise security tests.

### Rendering and performance

**Risk:** Static Astro HTML and limited islands are intentional. Simple animation is native canvas/DOM, not a large client framework.

**Why it matters:** Broad hydration or heavy animation silently harms page speed, resilience and crawlability.

**Safe change:** Prefer server rendering, CSS and small progressive enhancements; add client code only with a measured user need and preserve no-JS/reduced-motion behaviour.

### Local versus production config

**Risk:** `astro.config.local.mjs` intentionally excludes the Cloudflare adapter because normal Miniflare/workerd local development had runtime problems.

**Why it matters:** Merging configurations can make local development unreliable or mask production differences.

**Safe change:** Keep separate configs unless the historical issue is reproduced, fixed and verified in both local and Cloudflare-compatible paths.

### Analytics and privacy

**Risk:** GTM is intentional; ad-block network reporting is consent-gated. The detector must not infer consent from undocumented cookies/GTM internals or send personal information to `dataLayer`.

**Why it matters:** A shortcut can create privacy and consent defects.

**Safe change:** Read the relevant HARDENING consent contract, document a bridge decision, and test non-consented behaviour before enabling reporting.

### Deployment and dependencies

**Risk:** `main` triggers production Cloudflare deployment. Cookiebot badge/testimonial media can be externally hosted; third-party assets and scripts carry availability, rights and performance risk.

**Why it matters:** An apparently cosmetic edit can affect production or use media without confirmed rights.

**Safe change:** Use reviewed PRs to `main`; confirm ownership/permission before copying assets, and review performance/privacy before new external dependencies.

### Business content

**Risk:** Case-study metrics, testimonials and privacy/compliance claims have evidence and legal implications.

**Why it matters:** Stronger wording can become an unsupported result or legal guarantee.

**Safe change:** Use repository-approved evidence exactly or obtain human confirmation; follow `DOMAIN.md`.

### Maintainability and coverage

**Risk:** Astro route wrappers compose page-oriented TSX components, while metadata is shared in `BaseLayout.astro`/`seo.ts` and public service/proof copy can be represented in several page sections. This is intentionally practical but can drift when a change updates only one layer. Browser coverage is separate from static/security checks, and documentation can drift when behaviour changes without a focused update.

**Why it matters:** A locally correct component edit can leave stale metadata, schema, conversion links or agent guidance; a passing static check does not demonstrate all user-facing browser paths.

**Safe change:** Trace the route, composed component, metadata/schema and linked page/case-study together. Run browser checks for user-facing flows and update one relevant maintained document only when architecture or public behaviour materially changed.