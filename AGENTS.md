# Upsight Digital agent guide

Upsight Digital is the production marketing website for a technical digital analytics consultancy. It explains services, audiences, implementation approach and approved case studies, and offers a Contact form and interactive Analytics Health Check. Production is [upsight.digital](https://upsight.digital). The goal of this guide is to let an agent make a safe, focused change without rediscovering the whole repository.

## Stack and map

Astro owns routing, layout, metadata, sitemap and mostly static HTML. Cloudflare Workers provides the runtime API boundary. React is present, but hydration is deliberately narrow: Contact hydrates the form, Health Check is interactive, and Slice hydrates video interaction. Roadsurfer has no React island. The homepage canvas animation is small vanilla JavaScript.

- `src/pages/` — page routes and `/api` endpoints.
- `src/components/` — Astro shell components, server-rendered page TSX, and the few interactive islands.
- `src/layouts/BaseLayout.astro` — site shell, metadata, schema, GTM and ad-block loading.
- `src/lib/` — SEO, form security, API, mail and Health Check scoring logic.
- `public/` — only live-site, mail, SEO or browser-endpoint assets; `llms.txt` and `robots.txt` live here.
- `docs/ARCHITECTURE.md` and `docs/DEVELOPMENT.md` — current technical references.
- `docs/HARDENING.md`, `docs/CLEANUP-REPORT.md`, `docs/CHANGELOG.md` — detailed audit/history records, not default reading.
- `docs/ai/` — task routing, stable domain context, risks and short reusable prompts.
- `docs/strategy/` — living growth, SEO/content and roadmap context.

## Read only what your task needs

Do not read the whole repository by default. Search first, then open the component, route, helper and context named by the result.

UI or copy task: `AGENTS.md` -> relevant route/component -> `docs/ai/DOMAIN.md`; add `docs/strategy/SEO-CONTENT.md` only when the change is SEO-related.

Architecture or backend task: `AGENTS.md` -> `docs/ARCHITECTURE.md` -> `docs/ai/RISKS.md` -> relevant code.

Forms, security or privacy task: `AGENTS.md` -> relevant section of `docs/HARDENING.md` -> `docs/ai/RISKS.md` -> API/component files.

Deployment task: `AGENTS.md` -> `docs/DEVELOPMENT.md` -> `wrangler.jsonc` -> the relevant GitHub workflow/configuration. Do not deploy unless asked.

Growth, content or SEO task: `AGENTS.md` -> `docs/ai/DOMAIN.md` -> `docs/strategy/SEO-CONTENT.md` and `WEBSITE-GROWTH.md` -> relevant public pages.

## Critical rules

- Never push directly to `main`. Use one `codex/<task>` branch per task and open a reviewed PR to `main`.
- `main` is production: Cloudflare automatically builds/deploys it. Do not deploy, change DNS, Cloudflare configuration, GTM, secrets or external services unless the request explicitly authorizes it.
- Prefer Astro/static rendering. Do not add React hydration, a SPA pattern, animation libraries or dependencies when CSS, native JavaScript or Astro is sufficient.
- Preserve the server-authoritative Health Check scoring path. Browser report fields are not trusted.
- Preserve server-side Turnstile verification and fail-closed form behaviour. Production hostname validation is intentional.
- `PUBLIC_TURNSTILE_SITE_KEY` is a build-time public value. `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` are Worker runtime secrets. Never commit `.env` or expose a secret to client code.
- `astro.config.local.mjs` intentionally avoids the Cloudflare adapter due to prior Miniflare/workerd local-runtime problems. Do not unify configs without proving that issue is resolved.
- Keep accessibility, keyboard support and reduced-motion behaviour intact. Keep public assets lean.
- Do not add third-party scripts without a clear business need plus performance and privacy review. GTM and the consent-gated ad-block behaviour have deliberate constraints.
- Do not invent client results, testimonials, metrics, legal/compliance claims, awards, certifications, partners or capabilities. See `docs/ai/DOMAIN.md` before public-facing copy work.

## Working session

Start on current `main`, inspect status, search for existing implementation, and create the task branch before edits. Keep scope narrow; reuse established patterns and do not refactor unrelated code. Record material architectural assumptions in the PR/hand-off rather than silently changing a boundary.

Run the relevant checks, and before a normal coding PR run:

```bash
npm ci
npm run check
npm run build
npm run test:browser
```

`npm run build` also runs unit/security tests. Install Playwright Chromium when needed with `npx playwright install chromium`. Use Node 24 LTS (minimum 22.18). Local development is `npm run dev`; see `docs/DEVELOPMENT.md` for safe local form testing and Playwright details.

Before hand-off, report changed files, validation results, configuration needed, known limitations, unresolved decisions and the recommended next task. Update a context document only for a material behaviour, architecture or roadmap change—never use documentation as a scratchpad.

## Token-efficient habits

Use targeted `rg` searches before opening files. Read specific files or ranges, not directory dumps. Do not inspect `dist`, `node_modules`, `.astro`, `.wrangler`, `package-lock.json`, or historical docs unless the task requires them. Do not reread `HARDENING.md` for ordinary content/UI work. Avoid repeatedly summarizing code that these documents already cover; keep hand-offs short and factual.

For the full session checklist, branch/PR coordination and token guidance, read `docs/ai/WORKFLOW.md`. For known non-negotiable boundaries, read `docs/ai/RISKS.md`. For concise task prompts, read `docs/ai/PROMPTS.md`.

## Configuration and forms

Use `.env.example` only as a local setup template; never place credentials in source, browser-visible environment variables, screenshots or test fixtures. `RESEND_API_KEY` is needed for delivery and `TURNSTILE_SECRET_KEY` is required for production verification. Local form verification may use the tightly limited development bypass described in `docs/DEVELOPMENT.md`; it is not a production workaround. Automated tests mock providers and must not send email. Treat changed validation limits, origin checks, schema fields, mail templates and Turnstile actions as one end-to-end form change, not independent cosmetic work.

## Review and merge expectations

Review the diff before committing: confirm an implementation change did not accidentally alter business copy, schema, canonical URLs, client hydration or runtime configuration. A PR description should state user impact and configuration impact separately. Include screenshots only for an interface change and never include credentials or submitted personal data. If `main` advances while the PR is open, update intentionally and rerun validation affected by the merge. A green build is necessary but does not replace review of public claims, production configuration and privacy boundaries.

## Useful deeper references

- `docs/ARCHITECTURE.md`: rendering model, APIs, analytics and asset policy.
- `docs/DEVELOPMENT.md`: local environment, browser testing and important files.
- `docs/HARDENING.md`: precise security, consent and deployment audit details.
- `docs/ai/DOMAIN.md`: supported business language and evidence standards.
- `docs/ai/WORKFLOW.md`: session lifecycle and multi-agent coordination.
- `docs/ai/RISKS.md`: critical invariants and safe-change procedures.
- `docs/strategy/SEO-CONTENT.md`: maintain existing SEO foundation and plan meaningful content.
- `docs/strategy/ROADMAP.md`: living priorities and human decisions still needed.