# Cursor return — HQ-CURSOR-2026-10-11-035 / INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated implementation head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-11-035`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/112
- PR: recorded in the Cursor executor return after the pull request is opened
- Branch: `cursor/hq-cursor-2026-10-11-035-smartphone-secondary-service-facts`
- Dispatch / cycle: `HQ-CURSOR-2026-10-11-035 / INITIAL-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/112#issuecomment-6111639808

## SHAs

- Starting `origin/main` SHA: `d61d83183b33f3313ca9aa22a661f4c07f448974`
- Prior reviewed head: not applicable (initial implementation)
- VALIDATED_IMPLEMENTATION_HEAD: `d65b08042d46c29ba35db2ea26ef0c15d52a0a76`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Authorized scope implemented

When Used/second-hand is selected, the comparison asks for that candidate's expected years of adequate service. When Refurbished is selected, it asks separately. Exact typed text stays separate from the parsed value. Explicit Not sure, empty text, and unusable text stay missing or unknown and are not turned into zero or a default. Only accepted secondary-evaluator fields are passed. Cards restate the explicit user fact and the evaluator's capability, service sequence, or absence of equivalent service. No next event, transfer, process evidence, source reference, credit, ranking, or impact card is collected.

## Changed implementation files

- `app/src/lib/smartphone/comparison-ux.mjs`
- `app/src/components/smartphone-comparison.tsx`
- `app/scripts/smartphone-secondary-service-facts.test.mjs`

Domain evaluators, contracts, registries, source packages, Journey, homepage, dependencies, and the lockfile were not modified.

## Input-to-evaluator mapping

- Shared horizon text stays on `horizonRaw`. A separate positive finite parse is the only value passed as `comparison.common_service_horizon_years`.
- Used candidate service is asked only when Used/second-hand is selected. Exact typed text stays on `usedServiceRaw`. A separate parse is passed only on that pathway.
- Refurbished candidate service is asked only when Refurbished is selected. Exact typed text stays on `refurbishedServiceRaw`. It is not copied from the used candidate or from the shared horizon.
- A positive finite year is passed as `replacement.expected_adequate_service.expected_years`.
- The same explicit selection is also passed as `replacement.pathway` and `replacement.pathway_user_selection`. The composed evaluator reads `replacement.pathway` for the used short-service sequence. `pathway_user_selection` remains so the pathway stays classified when service is not shorter than the horizon. No seller, grade, age, warranty, price, or process evidence is added.
- Explicit Not sure, and non-empty text that is not a positive finite year, are passed as `unknown`. Empty text omits `expected_adequate_service` and `pathway`. None of those become zero.
- No `next_event_after_secondary_failure`, transfer, repair burden, source-specific reference, or refurbishment-evidence field is supplied.
- Deselecting Used clears only used facts. Deselecting Refurbished clears only refurbished facts. Situation edit/reset and inquiry edits still clear the whole comparison. Changing the horizon re-evaluates and does not rewrite either candidate fact.
- Current-phone and repair facts stay on their existing fields.

## Unknown, coverage, and prohibited-output evidence

- Neither secondary service value is preselected.
- A used candidate shorter than the shared horizon produces the evaluator's `service_sequence_required`, covered years, and uncovered years, with `result_capability` `insufficient_information`. `next_event` is absent because the next event is not collected.
- A used candidate at or above the horizon does not establish equivalent service. The card says equivalent service is not established.
- A generic refurbished candidate, including a two-year fact on a two-year horizon, stays `qualitative_only`. Direct refurbishment burden stays null with `UNKNOWN_NO_FALLBACK`. No service sequence, 7.61 value, generic footprint, transfer amount, market-displacement credit, winner, recommendation, or score is produced.
- Not-sure used service does not trigger the SEC-05 missing-service structure, because that structure also requires `current_device.adequacy_status` inadequate, which this task does not supply. The passed value remains `unknown`, not zero, and the card says not sure.

## Validation toolchain

- Node: `v22.14.0` (`/exec-daemon/node`)
- npm: `11.19.0` (`/exec-daemon/node /tmp/npm-1119/node_modules/npm/bin/npm-cli.js`)
- TypeScript: `5.9.3`
- Working directory: `app/`
- Validated tree: `d65b08042d46c29ba35db2ea26ef0c15d52a0a76`

### Commands and exit codes

| Command | Exit code |
| --- | --- |
| `npm ci --ignore-scripts` | `0` |
| `npm test` | `0` |
| `npm run typecheck` | `0` |
| `npm run build` | `0` |

### Test totals

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 545 pass / 0 fail / 0 todo
- TypeScript suite: 50 pass / 0 fail / 0 todo

### Lockfile integrity

- SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`
- Unchanged after `npm ci --ignore-scripts`
- No tracked lockfile diff

## Rendered and accessibility evidence

Local Chrome at 390×844 and 1280×900, keyboard for the changed controls:

- `/` and `/journey` load.
- Situation Yes answers, six inquiry answers, and comparison entry work.
- Used and refurbished service fields are absent until that pathway is selected. Inputs start empty.
- Used `1.50` stays exact in the field and is shown as 1.5 years, distinct from shared horizon `4`. Refurbished `3` is not copied from used or from the horizon.
- Short used service shows the required sequence, the unsupplied next event, and 2.5 uncovered years.
- Refurbished shows that equivalent service is not established and that no generic refurbished footprint is used.
- Not sure keeps the typed text and does not substitute zero. Deselecting Used removes only that field.
- No horizontal overflow. Visible focus rings on the service inputs. Labels and descriptions are present.
- No 7.61, winner, recommendation, or internal snake-case token in the rendered text.
- A first 390 pass reported one transient Vite `504 Outdated Optimize Dep` while the interaction still completed. The immediate rerun at 390 and 1280 reported no console or page errors.

## Preserved gaps

- Generic refurbished expected service does not by itself establish a service sequence or equivalent coverage. That incompleteness is preserved; it is not invented in the adapter.
- Transfer/shipping, refurbishment-process evidence, source-specific references, repair history, and the next event are not collected.
- Impact and dependency cards, Source Lens, otherness, and final choice are not in this slice.
- No persistence, backend, network, or analytics.

## Discrepancies

The first 390 browser pass logged a transient Vite dev-server `504 Outdated Optimize Dep`. The same checks passed with no console or page errors on the immediate rerun. Application behavior did not depend on that resource failure.

## Self-merge

NO

## Executor result

`VERIFIED_FOR_HQ_REVIEW`

Durable Issue status was not written. No native Issue-write action is available in this runtime.
