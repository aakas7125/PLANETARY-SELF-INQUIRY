# Cursor return — HQ-CURSOR-2026-10-10-028 / CORRECTION-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated correction head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-10-028`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/98
- PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/99
- Branch: `cursor/hq-cursor-2026-10-10-028-empirical-ewaste-people-boundary`
- Dispatch / cycle: `HQ-CURSOR-2026-10-10-028 / CORRECTION-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/98#issuecomment-6104116910
- PR review: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/99#pullrequestreview-5481459277

## SHAs

- Starting `origin/main` SHA: `d817375b54176db3c3b01dfd19cc4c4616e60346`
- Prior reviewed head: `2d9f0fbe493bedd62abf6b4a1bfdfd7721c11d99`
- VALIDATED_IMPLEMENTATION_HEAD: `ba155278fe170b6abf076ba0ccd84a20db2cb6ff`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Bounded correction implemented

1. Fail closed when `unsafe_or_informal_handling_established === true` is
   combined with a same-record fate that affirmatively means the device is
   not in unsafe or informal e-waste processing:
   `continue_use`, `sell_or_gift_for_reuse`, `store_in_drawer`, and
   `formal_recycling`.
2. Denial reason for that contradiction is inspectable
   `contradictory_old_device_fate`. The pathway is not emitted.
3. When the handling condition is absent, `trade_in_unknown_next_use`,
   `discard_general_waste`, and `unknown` remain non-establishing under the
   existing `fate_or_context_does_not_establish_unsafe_or_informal_handling`
   reason. No route is invented from them.
4. Chosen fail-closed boundary for an independently established handling
   condition alongside an uncertain fate: emit only the accepted conditional
   pathway and do not copy the fate as a route, destination, or probability.
   Source-package authority defends showing the conditional pathway for
   general discard without assigning an informal destination, and it forbids
   assuming trade-in or unknown fate into recycling, dumping, reuse, or
   storage. Fate uncertainty is not treated as negation of a separately
   established handling condition, and it is not resolved into a device route.
5. Direct regressions replace the previous expectation that `continue_use`
   plus an explicit handling flag emits.
6. Exact claim/source records, non-quantification, mapping, prior empirical
   emission, and exclusions are unchanged.

## Changed implementation files

- `app/src/lib/smartphone/empirical-ewaste-people-boundary.mjs`
- `app/scripts/smartphone-empirical-boundary.test.mjs`

## Direct evidence

- Explicit handling with no contradictory fate still emits exact
  `SP-PATH-EWASTE-PEOPLE-001` / `S11` conditional pathway output.
- `continue_use`, `sell_or_gift_for_reuse`, `store_in_drawer`, and
  `formal_recycling` with the explicit flag: `emitted = false`,
  `reason_code = contradictory_old_device_fate`, `pathway = null`.
- The same four fates with the condition false or omitted stay
  non-establishing and do not use the contradiction reason.
- `trade_in_unknown_next_use`, `discard_general_waste`, and `unknown` with
  the condition absent or null stay non-establishing.
- Those three uncertain fates with the explicit flag emit the conditional
  pathway only. The pathway object has no `old_device_fate`, `route`, or
  `destination` field, and its serialized text does not contain the fate
  value. Probability, location, and collection rate stay null.

## Mapping / preserved gaps

- Covered: `SP-PATH-CLIMATE-001`, `SP-PATH-MINING-ECO-001`,
  `SP-PATH-MINING-PEOPLE-001`, `SP-PATH-EWASTE-PEOPLE-001`
  → `covered_by_executing_assertion`
- Pending: `SP-PATH-EWASTE-ECO-001`, `SP-PATH-WATER-001`
- Empirical-suite TODO retained
- No UI / contract / registry / source-package / AP / dependency / lockfile mutation
- Durable GitHub Issue status not written (no native Issue-write action)
- Next empirical slice is not implemented here

## Validation toolchain

- Node: `v22.14.0`
- npm: `11.19.0`
- TypeScript: `5.9.3`
- Working directory: `app/`
- Validated commit: `ba155278fe170b6abf076ba0ccd84a20db2cb6ff`

### Commands and exit codes

| Command | Exit code |
| --- | --- |
| `npm ci --ignore-scripts` | `0` |
| `npm test` | `0` |
| `npm run typecheck` | `0` |
| `npm run build` | `0` |

### Test totals

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 450 pass / 0 fail / 1 todo
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
