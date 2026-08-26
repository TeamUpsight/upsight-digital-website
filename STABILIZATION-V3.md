# Stabilization V3

This build intentionally uses `client:only="react"` for the remaining migrated React page bodies.

Why: Astro + React 19 + the Cloudflare adapter currently has development/SSR edge cases that can produce invalid hook calls, especially through libraries such as `lucide-react`. This stabilization step makes every route usable first.

The shared shell (layout, metadata, navigation, footer, sitemap) is already native Astro. The next optimization pass is to convert static React page bodies (Services, About, Process, Who It’s For, Case Studies index, Cookie Consent) into `.astro` components and keep React only for genuinely interactive islands.

Also patched: the legacy Wouter-compatible `Link` now explicitly performs normal document navigation so CTA buttons inherited from the old SPA navigate reliably.
