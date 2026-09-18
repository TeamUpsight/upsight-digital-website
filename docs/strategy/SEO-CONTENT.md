# SEO and content strategy

## Existing technical foundation

The repository already provides canonicals, an Astro sitemap and `robots.txt`, Organization/WebSite schema, Service schema, Article/case-study schema, breadcrumbs, Open Graph/Twitter metadata, `llms.txt`, and server-rendered/prerendered content. Maintain and validate this foundation; do not rebuild it merely because it appears on a generic SEO checklist.

## Technical SEO

Check titles, descriptions, canonical URLs, links, sitemap output and structured-data validity when a related route changes. Centralized `BaseLayout.astro` and `src/lib/seo.ts` make metadata maintainable, but copy changes can still make schema or descriptions drift. Treat `llms.txt` as optional machine-readable context, not a ranking mechanism.

## Content and topical authority

The useful gap is dedicated, evidence-led content around real implementation needs currently grouped on `/services`: server-side tracking, GA4/GTM implementation, Meta CAPI, tracking audits, ecommerce tracking and dashboards/reporting. These are hypotheses until search demand and commercial priority are validated; do not fabricate keyword volume.

For each prospective service page, establish user intent, page purpose, supporting proof, internal links and conversion action before writing. Use first-party case studies, implementation examples and original technical insight to create defensible authority.

## Internal linking model

Use a simple cluster: service hub -> dedicated service -> relevant case study/process -> contact or Health Check. Case studies should link to the implementation services demonstrated; guides should link to the appropriate service and a useful next step. Links must be contextual and genuinely helpful, not repeated boilerplate.

## First-party evidence and AI discoverability

Prioritize approved case studies, concrete implementation detail and source-consistent metrics. Make entities and services explicit through descriptive headings, concise definitions, factual Q&A where it helps, strong About/company context, and crawlable server-rendered content. Do not rely on hidden prompts, keyword stuffing or thin pages to explain the business.

## Editorial standards

Answer the visitor's question early. Use technically precise language, show nuance and limitations, and prefer evidence over unsupported claims. Avoid generic AI filler, repetitive city/service pages, keyword stuffing and near-duplicate posts. Improve an existing page when that best serves the intent rather than publishing a duplicate.
