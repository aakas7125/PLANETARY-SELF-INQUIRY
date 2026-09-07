# Governed Application Import — 2026-09-07

Task: `HQ-LC-2026-09-07-001` (Issue #24)

## Receiving state

- Target base: `origin/main` `77622dca5b2f74ed9e23ee7f5d95ee16820b7c9d`.
- Source: `origin/substitute` `d37f3c567b1a02fe76d4cc8b0325170b125b5193`.
- Method: a path-scoped Git import from the named source into a dedicated branch based on the named target. No merge, rebase, history rewrite, or direct write to `main` occurred.
- Status: proposed governed import for HQ review; it does not accept application/product behavior or change canonical contracts.

## Exact path mapping

The import preserves the source-relative `app/` layout exactly. Imported paths are:

- `app/package.json`, `app/package-lock.json`, `app/vite.config.ts`, `app/tsconfig.json`, `app/eslint.config.mjs`, `app/.prettierrc`, and `app/.grok/app-env.json`;
- `app/src/`, `app/scripts/`, `app/server/`, `app/migrations/`, and `app/public/`.

No root application paths were substituted. `app/BASELINE_TEST_DISPOSITION.md` and `app/BASELINE_VALIDATION_GAPS_2026-09-07.md` were not imported because they are candidate documentation, not an allowlisted runtime or test-harness input. The import contains no `node_modules/`, `.vercel/`, build output, credentials, local environment files, temporary/generated state, or missing `.grok/skills/og` material.

## Conflict and authority assessment

All imported application paths were absent from the target base, so no canonical target file was overwritten. Contracts, provenance, project-state records, evidence, source packages, AP material, and V17 records remain outside the imported `app/` path and retain their target-base authority.

The imported baseline is the reviewed substitute application/harness only. It does not integrate canonical smartphone rules into behavior, add AP/empirical defaults, change AP/empirical semantics, redesign the UI, or establish V17 provenance.

## Qualified validation limits

The full `app` test command is expected to retain the six explicitly qualified failures:

1. Three `brand-check.test.mjs` assertions require the unrecovered original `.grok/skills/og/SKILL.md`.
2. One `write-atomic.test.mjs` assertion requires unrecovered original `.grok/skills/og/references`.
3. Two symlink cases require a Windows environment that permits symbolic-link creation (elevated permission or Developer Mode/policy permission).

These are not waived, skipped, deleted, weakened, fabricated, or reported as passing. HQ acceptance remains required before reopening Issue #16 for contract/AP-invariant test mapping.
