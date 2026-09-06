# Governed Application Baseline Receiving State — 2026-09-06

Task: `HQ-LC-2026-09-06-003` (Issue #17)  
Status: **Candidate received and assessed; import not recommended pending validation repair and HQ review**

## Candidate identity

The candidate is the `app/` tree at `origin/substitute` commit `4ba18df8fc86f34d27ec65f1012959fb4c4425a2` (`Add vision manager direction for HQ`). The last documented synchronization merge in its ancestry is `01fd81b`; the candidate is not currently synchronized with `origin/main` (`1a901e70162fd6f7a2d85044e2b41666e8b4ca87`). The candidate therefore remains experimental source material, not canonical application state.

The application’s repository inputs are limited to the committed `app/` tree: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `src/`, `scripts/`, `server/`, `migrations/`, `public/`, `.grok/app-env.json`, and `.prettierrc`. Excluded from any governed import are `node_modules/`, `.vercel/` build output, local environment values, credentials, temporary files, and untracked/generated runtime state.

## Boundary assessment

The candidate preserves the experimental Grok UX lineage, including the prior non-diagnostic/inquiry-led correction and synthetic-risk cleanup recorded on `substitute`. This inspection is not an acceptance of its product behavior. It does not map accepted AP or empirical contracts into behavior, change those contracts, import source packages, redesign the UI, or establish V17 identity.

`substitute` contains prior canonical contract files only through its recorded merge; it is behind current `origin/main`. Any eventual import must originate from current canonical `main` on a dedicated branch, import only an explicitly reviewed candidate allowlist, and retain current canonical contracts/provenance/state records as authoritative.

## Validation reproduction

At candidate commit `4ba18df`, after `npm ci --ignore-scripts` within `app/`:

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm test` | Failed: 181 passed, 14 failed of 195 tests |
| `npm run build` | Passed; migration correctly reported unset `DATABASE_URL` and skipped external migration |

The test failures are not silently waived. They include missing committed `.grok/skills/og` documentation fixtures, host-denied symlink tests, and multiple PWA identity/OG expectation mismatches. The previously reported “45-of-45” result was not reproduced by the candidate’s present test command.

## Recommendation

Do **not** import `app/` into canonical `main` under this task. The baseline is not mechanically safe for governed import while its committed test command fails and current `main` lacks an accepted application baseline. A later HQ-authorized task may first repair or explicitly disposition the candidate validation failures, establish the exact import allowlist, and then propose an import for separate HQ review. Issue #16 remains blocked until that later baseline is accepted.

