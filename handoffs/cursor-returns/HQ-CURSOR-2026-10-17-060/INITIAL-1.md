# HQ-CURSOR-2026-10-17-060 INITIAL-1 return

- Task ID: HQ-CURSOR-2026-10-17-060
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/190
- PR: the single linked PR for this branch (see PR description)
- Cycle: INITIAL-1
- Starting main SHA: cceb2a7fa64e27bdb9a01d4a51eec7f54e647419
- VALIDATED_IMPLEMENTATION_HEAD: f2d4cd852e13945e6bc92b13aee40a46ef3b7ed3
- EVIDENCE_RETURN_HEAD: the commit that adds this file and updates the lease (changes only `handoffs/`)
- Self-merge: NO
- Executor result: VERIFIED_FOR_HQ_REVIEW

## Implementation (D-015 comparison-period copy only)

Changed implementation file:
- `app/src/lib/smartphone/comparison-ux.mjs` — public strings only.

Changed test/smoke files (exact-copy assertions and focused additions):
- `app/scripts/smartphone-comparison-ux.test.mjs` (updated result-statement assertion; new D-015 test covering label, opening, helper, missing, invalid for `0`/`-1`/`1e2`/`3 years`/`abc`, valid raw `2.50`, and no standalone "horizon" in presented output)
- `app/scripts/smartphone-model-evidence.test.mjs` (regexes renamed to comparison-period wording; added no-"horizon" and source-period assertions)
- `app/scripts/smartphone-primary-pathway-facts.test.mjs`, `app/scripts/smartphone-secondary-service-facts.test.mjs` (renamed regexes; the "service must not copy the shared period" check is kept as `/is 4 years(?! for every alternative)/` plus a positive assertion of the new result statement)
- `app/scripts/e2e-local-preview-smoke.mjs` (result-statement text only)

No component edit. No layout, state, parser, internal identifier (`horizonRaw`, `set_horizon`, `comparison-horizon`, `common_service_horizon_years`, evaluator H, `not_substituted_into_user_horizon`), contract, source record, model record, lockfile, or dependency change.

Copy applied (exact D-015 strings):
- Label: "How many years of phone use would you like to compare?"
- Opening: "Choose one period of phone use, in years, for comparing the alternatives."
- Helper: "Every alternative you select uses this same number of years of adequate phone service for comparison. It is a period you choose, not a prediction of how long any phone will last."
- Missing: "No comparison period yet. Enter a number of years. Nothing is filled in for you."
- Invalid: "That number of years cannot be used. Enter a positive number using digits and, if needed, a decimal point. Nothing was replaced with zero or a default."
- Results: "The selected comparison period is N years for every alternative." with N the verbatim raw text.
- Disclaimer: "Expected adequate service is not assumed from the comparison period."
- Grammatical substitutions of "shared horizon", "horizon entered here", "this horizon", "the horizon" with "comparison period" forms in the remaining/post-repair/used/refurbished helpers, uncovered/equivalent-service lines, and source-reference/disclosure lines. Remaining assertion, unit, source-period, and condition meaning is untouched. "was entered separately" is not used.

## Validation toolchain

- Node v22.14.0, npm 11.19.0 (installed to a temp prefix to match the CI pin), TypeScript 5.9.3.
- Install: `npm ci --ignore-scripts` from `app/` after removing `node_modules` — exit 0.
- Lockfile integrity: `app/package-lock.json` SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`, identical before and after install; `git status` shows no lockfile change.
- `npm test`: scripts suite 629 tests, 629 pass, 0 fail; TypeScript suite 50 tests, 50 pass, 0 fail; exit 0.
- `npm run lint`: exit 0.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- `node scripts/public-beta-profile-graph.mjs`: `result: clear` (18 prohibited patterns, 57 files).
- Routine GitHub CI owns the pinned full run: ROUTINE_CI PENDING at return.

## Baseline before edit

Before the new copy, the 8 failing targeted subtests were all exact-text assertions in the four test files listed above (comparison-ux 1, model-evidence 2, primary-pathway-facts 1, secondary-service-facts 4). After the assertions were updated no semantic case was skipped, deleted, or weakened. All pre-existing parser cases (0, 0.0, -1, "3 years", abc, Infinity, NaN, 1e2, numeric 3, null reject; 2.50 and " 4 " accept) still pass unchanged.

## Rendered evidence (built public profile, Chrome via Playwright, reduced motion)

Existing `scripts/e2e-local-preview-smoke.mjs` against the built profile at 390 and 1280: exit 0, no page error, console error, HTTP failure, external host, or prohibited request, no overflow, no cookie/localStorage/sessionStorage.

Targeted comparison-period probe at 390x844 and 1280x800 (probe script kept outside the repository):
- Visible label equals the accessible name of `#comparison-horizon`; input starts empty; the input takes focus and shows a visible focus ring.
- Missing: exact missing text visible; no "horizon" word anywhere in the page text.
- Invalid `abc` and `0`: exact invalid text visible; `aria-invalid="true"` for `abc`.
- Valid `2.50` with generic selection (keep, new, used, refurbished): "The selected comparison period is 2.50 years for every alternative." and the disclaimer visible; raw 2.50 preserved.
- Source-model (Fairphone 5 owned, Samsung Galaxy S25 EUR candidate): "not added to this comparison period", "not applied to this comparison period", and "outside the comparison period entered here" visible; no "horizon" word.
- Horizontal overflow 0 at both widths; page, console, and HTTP errors none.

Frames (4 of the 3-5 requested):
- `INITIAL-1-390-comparison-period-missing.png`
- `INITIAL-1-390-source-model-reference.png`
- `INITIAL-1-1280-comparison-period-missing.png`
- `INITIAL-1-1280-valid-2-50.png`

## Preserved gaps and discrepancies

- Not a human-study or comprehension claim; this is a text slice only.
- The helper is not programmatically linked with `aria-describedby`; the accepted slice did not require a component edit and none was made.
- Internal identifiers keep the word "horizon" by design (`comparison-horizon`, `horizonRaw`, etc.) and are not public text.
- In the rendered source-model frames, the use-period-known "Source time assumption" sentence is not shown because the current records used there state no use period; its new wording is asserted at the lines level in `smartphone-model-evidence.test.mjs`.
- Durable Issue status was not written by Cursor (no native Issue-write action). HQ reconciles #190.
- Ledger #189 untouched.
