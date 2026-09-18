# UX polish audit

Baseline recorded locally with `tests/browser/ux-audit.spec.ts` across the public
routes at 390, 768, 1440 and 1920px, including representative scroll and
interaction states.

Typography now self-hosts the required Latin WOFF2 subsets (DM Sans 400/500/600/700
and Inter 400/500/600). Roboto Mono remains a system stack because it is not a
material part of the public visual language.

## P1

- The async, `display=optional` Google Fonts strategy could leave Windows users
  on Segoe UI and made heading/body geometry vary between loads.
- `content-visibility` with a generic 700px intrinsic height made long sections
  appear late and could change scroll geometry when their actual height differed.
- Services and About displayed unfinished letter tiles in place of product marks.
- Full-card service links gave no persistent indication that they led to a more
  detailed service, and hash arrivals had no visual acknowledgement.

## P2

- Resources and mobile navigation changed state abruptly; the contact disclosure
  and Turnstile slot could also change surrounding geometry abruptly.
- Health Check states have substantially different content heights, making the
  page feel less stable during the first transitions.

## Deliberately retained

No router, page-wide hydration, animation package, remote logo request, or
security/scoring boundary is introduced. The existing case-study and hero motion
remain server-first and reduced-motion aware.

The Contact disclosure remains native `<details>`: Chrome does not reliably
animate its closed content, so no ineffective animation layer is retained.
