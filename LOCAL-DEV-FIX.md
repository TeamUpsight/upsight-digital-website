# Local React + Cloudflare development workaround

Astro/React currently has a development-only issue in some Cloudflare-adapter setups where React hook components fail during server rendering with `Invalid hook call` / `useState` errors.

This project therefore uses `client:only="react"` for the remaining React-heavy page components **only during `astro dev`**. Production builds continue to use `client:load`, so Astro still server-renders those pages in production.

No application behavior is intentionally changed by this workaround.
