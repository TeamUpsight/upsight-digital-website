# SEO release checklist

Use this checklist when a public route, metadata, or internal-link change is released.

- Confirm each public URL has one final HTTPS, non-www, trailing-slash URL and no avoidable redirect hop.
- Confirm the canonical, Open Graph URL, breadcrumbs, structured-data URLs, internal links, and sitemap use that exact URL.
- Check title, description, one meaningful H1, robots/indexability, and sitemap inclusion for each changed route.
- Parse JSON-LD and confirm it matches visible content; do not add unsupported proof, location, review, award, or certification data.
- Test internal links, mobile navigation, keyboard navigation, accessibility, forms, and interactive tools affected by the change.
- Confirm analytics events remain intentional where a conversion path changed; do not add scripts without privacy and performance review.
- Verify public claims, case-study proof, client references, legal/privacy wording, and certification labels with the appropriate business owner.
- After deployment, verify HTTP, www, and HTTPS redirect behaviour at the edge; the desired final URL is `https://upsight.digital/` via one permanent redirect.
- Recheck the production `robots.txt`, sitemap, Search Console URL inspection/indexing, and field Core Web Vitals before making performance architecture changes.
