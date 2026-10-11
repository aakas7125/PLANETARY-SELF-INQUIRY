# Cursor return — HQ-CURSOR-2026-10-11-029 / INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated implementation head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-11-029`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/100
- PR: the single pull request from branch `cursor/hq-cursor-2026-10-11-029-empirical-ewaste-eco-boundary` targeting `main`
- Branch: `cursor/hq-cursor-2026-10-11-029-empirical-ewaste-eco-boundary`
- Dispatch / cycle: `HQ-CURSOR-2026-10-11-029 / INITIAL-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/100#issuecomment-6106737311

## SHAs

- Starting `origin/main` SHA: `aaf1b72432ceb93f5848d76638ad0a928b35c868`
- Prior reviewed head: none (new task)
- VALIDATED_IMPLEMENTATION_HEAD: `8536abbcd9739bdbd6b73403ae07ecfc7f35053b`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the PR description and Cursor executor return; not embedded here to avoid self-hash churn)

## Authorized scope implemented

Direct deterministic behavior for exactly `SP-PATH-EWASTE-ECO-001` / `S12`.

Authority used, unchanged from current `main` registries:

- claim ID: `SP-PATH-EWASTE-ECO-001`
- package commit: `024a95392d2e1555a3c9b598fdc291bd341c3d6b`
- package provenance: `R&E-V0-SMARTPHONE-0.3.0`
- statement: `Unsound e-waste recycling sites can contaminate soil, water and sediment with hazardous metals.`
- domains: `waste`, `water`, `ecosystems`
- confidence: `high`
- attribution: `conditional_pathway`
- scope: `systematic_review`
- status: `APPROVED`
- condition: `unsound site handling occurs`
- source `S12` citation: `Systematic review of environmental heavy-metal contamination at e-waste sites.`
- source `S12` scope: `59 studies / 8,286 measurements.`
- source `S12` metadata limit preserved exactly

The study/measurement counts remain source-scope metadata on the preserved S12 record. They are not parsed into output quantities.

## Direct evidence

Positive:

- Complete claim/source authority plus `unsound_site_handling_established === true` emits only the qualitative conditional pathway.
- Output keeps the accepted statement, domains, systematic-review scope, confidence, attribution, condition, status, and exact S12 record.
- Quantitative, metal, concentration, contamination-magnitude, study-count, measurement-count, biodiversity, species-loss, location, probability, collection-rate, and score fields stay null.
- An incidental `case_id` does not change that emission.

Negative:

- Missing, malformed, unknown, wrong-version, and conflicting claim identity/version fail closed.
- Malformed non-object source maps (`null`, arrays, string, number, boolean, `undefined`) fail closed without throwing.
- Altered, reordered domain arrays, extra, and substituted claim/source records fail closed. Object key order alone is not a second authority.
- Missing, false, null, and inferred unsound-site handling do not emit.
- Continued use, reuse, drawer storage, formal recycling, trade-in, general disposal, unknown fate, collection-rate context, and S12 count context do not establish unsound site handling.
- `continue_use`, `sell_or_gift_for_reuse`, `store_in_drawer`, and `formal_recycling` with an explicit unsound-site flag fail closed as `contradictory_old_device_fate`. Formal recycling is included by the reused fate-consistency rule: it is a distinct formal route, not unsound site handling.
- Uncertain fates (`trade_in_unknown_next_use`, `discard_general_waste`, `unknown`) with an independently established condition emit the conditional pathway only and are not copied as a route.
- Named site, place, water body, ecosystem, species, or event attribution is denied.
- One-device-to-site/soil/water/sediment/ecosystem attribution is denied.
- Metal identity, concentration, contamination magnitude, measurement quantities, and supplied source-scope counts are denied.
- Biodiversity area, species-loss quantities, and exact individual ecological damage are denied.
- Unified environmental, safety, Protect Four, and moral scores are denied.
- Causal-proof wording, unknown-to-zero/false coercion, case/test metadata as authority, and quantitative, probability, or location-bearing output are denied.

## Mapping / preserved gaps

- Covered: `SP-PATH-CLIMATE-001`, `SP-PATH-MINING-ECO-001`, `SP-PATH-MINING-PEOPLE-001`, `SP-PATH-EWASTE-PEOPLE-001`, `SP-PATH-EWASTE-ECO-001`
- Newly covered: `SP-PATH-EWASTE-ECO-001`
- Pending: `SP-PATH-WATER-001` only
- Empirical-suite TODO retained
- Input, secondary, and AP mappings unchanged
- Earlier slices now treat `SP-PATH-EWASTE-ECO-001` as covered elsewhere (`unknown_claim`) and keep only water pending. Their own positive emission is unchanged.
- No water-pathway implementation
- No contract, registry, source-package, AP, UI, Journey, dependency, or lockfile change
- Durable GitHub Issue status not written (no native Issue-write action)

## Changed implementation files

- `app/src/lib/smartphone/empirical-ewaste-eco-boundary.mjs` (new)
- `app/src/lib/smartphone/empirical-climate-boundary.mjs`
- `app/src/lib/smartphone/empirical-mining-eco-boundary.mjs`
- `app/src/lib/smartphone/empirical-mining-people-boundary.mjs`
- `app/src/lib/smartphone/empirical-ewaste-people-boundary.mjs`
- `app/scripts/smartphone-empirical-boundary.test.mjs`
- `app/scripts/contract-regression-map.mjs`
- `app/scripts/contract-regression-map.test.mjs`

## Validation toolchain

- Node: `v22.14.0`
- npm: `11.19.0`
- TypeScript: `5.9.3`
- Working directory: `app/`
- Validated commit: `8536abbcd9739bdbd6b73403ae07ecfc7f35053b`

### Commands and exit codes

| Command | Exit code |
| --- | --- |
| `npm ci --ignore-scripts` | `0` |
| `npm test` | `0` |
| `npm run typecheck` | `0` |
| `npm run build` | `0` |

### Test totals

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 472 pass / 0 fail / 1 todo
- TypeScript suite: 50 pass / 0 fail / 0 todo

### Lockfile integrity

- SHA-256 unchanged: `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`
- Tracked lockfile not modified

## Discrepancies

None.

## Self-merge

NO

## Executor result

`VERIFIED_FOR_HQ_REVIEW`
