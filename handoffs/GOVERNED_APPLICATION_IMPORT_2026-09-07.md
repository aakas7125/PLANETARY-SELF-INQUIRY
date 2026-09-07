# Governed Application Import — 2026-09-07

Task: `HQ-LC-2026-09-07-001` (Issue #24)

## Receiving state

- Target base: `origin/main` `77622dca5b2f74ed9e23ee7f5d95ee16820b7c9d`.
- Application source: `origin/substitute` `d37f3c567b1a02fe76d4cc8b0325170b125b5193`.
- Verified fixture source: `aakas7125/drift-acre-cabin-marble` commit `590e2e937fe2dadafe196a114e023ebb05842f52`.
- Fixture incorporation: PR #27 merged into PR #25's branch at `e60342c2d3ee7ef4afd878a95b198b0595f1d097`.
- Method: path-scoped imports into a dedicated branch based on the named target; no history rewrite or direct write to `main` occurred.
- Status: final governed baseline candidate accepted for canonical merge review. This accepts the application/test-harness baseline only, not smartphone behavior or new AP/empirical semantics.

## Exact path mapping

The import preserves the source-relative `app/` layout. Imported application and harness paths are:

- `app/package.json`, `app/package-lock.json`, `app/vite.config.ts`, `app/tsconfig.json`, `app/eslint.config.mjs`, `app/.prettierrc`, and `app/.grok/app-env.json`;
- `app/src/`, `app/scripts/`, `app/server/`, `app/migrations/`, and `app/public/`.

The verified fixture follow-up adds:

- `app/.grok/skills/og/SKILL.md`;
- `app/.grok/skills/og/references/`;
- `app/AGENTS.md`, required by the existing brand assertions and retained as source fixture material, not project governance.

No root application paths were substituted. `app/BASELINE_TEST_DISPOSITION.md` and `app/BASELINE_VALIDATION_GAPS_2026-09-07.md` were not imported. The import contains no `node_modules/`, `.vercel/`, build output, credentials, local environment files, or temporary/generated state.

## Conflict and authority assessment

All imported application paths were absent from the target base, so no canonical target file was overwritten. Contracts, provenance, project-state records, evidence, source packages, AP material, and V17 records remain outside the imported `app/` path and retain their target-base authority.

The imported baseline does not integrate canonical smartphone rules into behavior, add AP/empirical defaults, change AP/empirical semantics, redesign the UI, or establish V17 provenance.

## Final validation

Issue #26 verified the recovered fixture bytes and resolved the four former fixture failures. Issue #28 then verified unprivileged symbolic-link creation with Windows Developer Mode and reran both previously environment-limited cases without administrator elevation or policy bypass.

Final accepted candidate results at PR #27 head `de2df4561d4e1a875dddaae0588d23e3e003a5a5`, incorporated into this branch:

- `npm test`: **195 passed / 0 failed**;
- `npm run typecheck`: passed;
- `npm run build`: passed;
- no tests skipped, weakened, deleted, or fabricated;
- no application, AP, empirical, V17, source-package, UI-semantic, or smartphone-behavior change occurred during revalidation.

The former six validation limitations are resolved. HQ may accept this bounded baseline into `main` and then restore Issue #16 to `READY_FOR_LOCAL_CODEX` for contract/AP-invariant test mapping.
