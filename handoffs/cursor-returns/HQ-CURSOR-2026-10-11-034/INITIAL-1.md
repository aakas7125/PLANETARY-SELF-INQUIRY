# Cursor return — HQ-CURSOR-2026-10-11-034 / INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated implementation head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-11-034`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/110
- PR: recorded in the Cursor executor return after the pull request is opened
- Branch: `cursor/hq-cursor-2026-10-11-034-smartphone-primary-pathway-facts`
- Dispatch / cycle: `HQ-CURSOR-2026-10-11-034 / INITIAL-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/110#issuecomment-6109478057

## SHAs

- Starting `origin/main` SHA: `dccb708ab1b1bc36dfe3d129f4ba1db5aa9bf6b3`
- Prior reviewed head: not applicable (initial implementation)
- VALIDATED_IMPLEMENTATION_HEAD: `0ae2c9dc616231f2b39725d30c7b1ddbfe1b3e21`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Authorized scope implemented

Current-phone remaining adequate service, and, only when Repair is selected, repair category plus expected adequate service after repair. Those explicit facts are passed into the existing adequacy evaluator. Keep, Repair, and New cards repeat evaluator output, including qualified battery and display ranges, unsupported generic major-board impact, and an incomplete service sequence when the evaluator requires one. Used and refurbished pathways are unchanged. No next-event form and no impact or dependency cards were added.

## Changed implementation files

- `app/src/lib/smartphone/comparison-ux.mjs`
- `app/src/components/smartphone-comparison.tsx`
- `app/scripts/smartphone-primary-pathway-facts.test.mjs`

Domain evaluators, contracts, registries, source packages, Journey, homepage, dependencies, and the lockfile were not modified.

## Input-to-evaluator mapping

- Shared horizon text stays on `horizonRaw`. A separate positive finite parse is the only value passed as `common_service_horizon_years`.
- Current-phone remaining service is asked only when Keep or New is selected. Exact typed text stays on `remainingServiceRaw`. A separate parse is passed only as `remaining_service.without_repair.expected_years` on Keep and New inputs.
- Explicit Not sure, and non-empty text that is not a positive finite year, are passed as `unknown`. Empty text omits the key. None of those become zero.
- An out-of-bounds remaining-service number is passed through. The evaluator's validation error is shown as not accepted, and the number is not clamped.
- Repair category buttons map only `battery`, `display`, and `major_board` to `repair.type`. Another kind of repair and Not sure do not set `repair.type`.
- Post-repair service maps only to `repair.expected_adequate_service_after_repair.expected_years` on the Repair input. It is not copied from the shared horizon or from remaining service without repair.
- No manufacturer, model, repair mode, or next-event field is supplied. Generic major-board impact therefore stays the evaluator's null / unsupported result.
- Used and refurbished inputs stay limited to `comparison.common_service_horizon_years` and `replacement.pathway_user_selection`.
- Deselecting the last of Keep and New clears remaining-service facts. Deselecting Repair clears repair facts. Situation edit/reset and inquiry edits still clear the whole comparison.

## Unknown and qualified-result evidence

- No fact is preselected or defaulted.
- Battery and display cards show only the evaluator's returned range, unit `kg CO2e`, scope `PROVISIONAL_GENERIC_RANGE`, and the ordinary qualification that the bracket is not an average and does not finish the comparison.
- Generic major-board impact is null and unsupported. No 17.84 kg CO2e value is shown.
- Missing or Not sure post-repair service stays insufficient. A repair shorter than the shared horizon reports the evaluator's required service sequence and the missing next event, and does not invent that event.
- The evaluator may set its internal comparative-ranking permission when Keep is adequate and remaining service is an accepted number. That flag is not rendered. No winner, recommendation, ranking, score, or avoided-production credit is shown.

## Validation toolchain

- Node: `v22.14.0`
- npm: `11.19.0` (`node /tmp/npm-11/node_modules/npm/bin/npm-cli.js`)
- TypeScript: `5.9.3`
- Working directory: `app/`
- Validated tree: `0ae2c9dc616231f2b39725d30c7b1ddbfe1b3e21`

### Commands and exit codes

| Command | Exit code |
| --- | --- |
| `npm ci --ignore-scripts` | `0` |
| `npm test` | `0` |
| `npm run typecheck` | `0` |
| `npm run build` | `0` |

### Test totals

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 534 pass / 0 fail / 0 todo
- TypeScript suite: 50 pass / 0 fail / 0 todo

### Lockfile integrity

- SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`
- Unchanged after `npm ci --ignore-scripts`
- No tracked lockfile diff

## Rendered and accessibility evidence

Local Chrome at 390×844 and 1280×800, keyboard only for the changed controls:

- `/` and `/journey` load.
- Situation Yes answers, inquiry answers, and comparison entry work.
- Fact fields are absent until Keep, New, or Repair is selected. Inputs start empty. No repair category is pressed.
- Remaining service `2.50` stays exact in the field and is shown as 2.5 years, distinct from shared horizon `4`.
- Battery repair with post-repair `0.5` shows the qualified provisional range and the required complete service sequence. Not sure removes the sequence and does not substitute zero.
- Remaining service stays when New remains selected after Keep is cleared, and clears when neither Keep nor New remains.
- No horizontal overflow. Visible focus rings on the inputs and buttons. Labels and descriptions are present. No console or page errors.
- No winner, recommendation, internal snake-case token, or 17.84 value in the rendered text.

## Preserved gaps

- Used and refurbished candidate facts are not collected.
- The next event in a short repair sequence is not collected.
- Impact and dependency cards, Source Lens, otherness, and final choice are not in this slice.
- Model-specific major-board conditions are not collected, so that impact stays unsupported.
- No persistence, backend, network, or analytics.

## Discrepancies

None.

## Self-merge

NO

## Executor result

`VERIFIED_FOR_HQ_REVIEW`

Durable Issue status was not written. No native Issue-write action is available in this runtime.
