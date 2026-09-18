# Reusable task prompts

## Small UI or content change

Read `AGENTS.md`, inspect the relevant route/component and `DOMAIN.md`, then make the smallest safe change on a task branch. Avoid unrelated refactors, preserve accessibility/performance, run relevant validation, and report changes, tests and risks.

## Feature or refactor

Read `AGENTS.md`, `ARCHITECTURE.md`, `RISKS.md` and the existing implementation. Work on a task branch, preserve Astro-first rendering and security boundaries, avoid new dependencies unless justified, run validation, and report changed architecture and risks.

## SEO or content improvement

Read `AGENTS.md`, `DOMAIN.md`, `SEO-CONTENT.md` and the target pages. Use only supported claims, inspect existing metadata before changing it, avoid thin/duplicate content, run validation, and report evidence gaps plus internal-linking effects.

## Bug investigation

Read `AGENTS.md`, search for the existing path, reproduce or inspect evidence, and identify the smallest root-cause fix on a task branch. Do not refactor speculatively. Run targeted and standard validation; report cause, fix, tests and residual risk.

## Pre-merge audit

Read `AGENTS.md` and the diff. Check scope, accessibility, rendering/hydration, security/configuration, public claims and tests. Run validation, flag risks with evidence, and do not make unrelated cleanup changes.
