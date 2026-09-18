# Agent workflow

## Start

1. Read `AGENTS.md`.
2. Confirm current `main` and a clean/understood working tree.
3. Identify exact scope and success criteria.
4. Read only the relevant context files using the guide in `AGENTS.md`.
5. Search before assuming a component, helper, copy source or prior decision does not exist.
6. Create a task branch from latest `main` (`codex/<task>` unless a name is specified).
7. Record material assumptions before changing an architectural boundary.

## During work

Keep scope narrow, follow existing patterns, reuse components/helpers and avoid unrelated refactors or abstractions. Preserve accessibility, reduced motion and existing performance choices. Keep client JavaScript minimal. Update documentation only when behaviour, architecture or a roadmap item materially changes.

## Validation

Minimum validation for a normal change:

```bash
npm ci
npm run check
npm run build
```

For user-facing behaviour also run `npm run test:browser`. If Chromium is absent, use `npx playwright install chromium`. Do not claim Lighthouse or Core Web Vitals improvement without an actual appropriate measurement.

## End of session

Provide a concise summary, files changed, tests/results, known limitations, configuration required, unresolved decisions and next recommended task. Update `docs/strategy/ROADMAP.md` only if the roadmap status truly changed. Do not use Markdown as a running scratchpad.

## Avoid token waste

- Do not reread `HARDENING.md` unless security, forms, privacy or runtime concerns are in scope.
- Search before opening many files; read files/ranges, not broad directory dumps.
- Do not repeatedly summarize source already covered by maintained docs.
- Do not inspect `package-lock.json` unless dependency resolution is the task.
- Do not inspect generated `dist`, `node_modules`, `.astro` or `.wrangler` state.
- Read strategy docs only for content, SEO or growth work; read `DOMAIN.md` for public copy.
- Keep hand-offs factual and short.

## Shared work and PRs

Each task gets its own branch, branches start from latest `main`, and PRs target `main`. Refresh a branch from `main` before merge when `main` changed and resolve conflicts intentionally. Never force-push a shared branch unless explicitly authorized. Never push directly to `main` or deploy without explicit authorization.
