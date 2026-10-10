# Cursor return — HQ-CURSOR-2026-10-10-027 / CORRECTION-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated correction head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-10-027`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/96
- PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/97
- Branch: `cursor/hq-cursor-2026-10-10-027-empirical-mining-people-boundary`
- Dispatch / cycle: `HQ-CURSOR-2026-10-10-027 / CORRECTION-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/96#issuecomment-6102279962
- PR review: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/97#pullrequestreview-5480837359

## SHAs

- Starting `origin/main` SHA: `244cbb993a9d72b671c51ca8385e46a3dfc061ed`
- Prior reviewed head: `47a85bee2fcf92b54ea7e6b66f5032d239319a10`
- VALIDATED_IMPLEMENTATION_HEAD: `defe439871f73e8401a051643434c334a6f978e4`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Bounded correction implemented

1. Added an explicit non-null, non-array record-shape guard in
   `validateMiningPeopleSourceRecords` before `Object.keys(sourceMap)`.
2. Explicitly supplied malformed source maps (`null`, arrays, and other
   non-object values) fail closed with existing
   `missing_required_source_metadata` and do not throw.
3. Direct negative regressions cover resolve-boundary and validator paths.
4. Omitted/`undefined` `authority_source_map` at resolve remains the accepted
   default (unchanged production semantics).
5. No claim/source value, positive emission, mapping, or exclusion changes.

## Changed implementation files

- `app/src/lib/smartphone/empirical-mining-people-boundary.mjs`
- `app/scripts/smartphone-empirical-boundary.test.mjs`

## Mapping / preserved gaps

- Covered: `SP-PATH-CLIMATE-001`, `SP-PATH-MINING-ECO-001`,
  `SP-PATH-MINING-PEOPLE-001` → `covered_by_executing_assertion`
- Pending: `SP-PATH-EWASTE-PEOPLE-001`, `SP-PATH-EWASTE-ECO-001`,
  `SP-PATH-WATER-001`
- Empirical-suite TODO retained
- No UI / contract / registry / source-package / AP / dependency / lockfile mutation
- Durable GitHub Issue status not written (no native Issue-write action)

## Validation toolchain

- Node: `v22.14.0`
- npm: `11.19.0`
- TypeScript: `5.9.3`
- Working directory: `app/`

### Commands and exit codes

| Command | Exit code |
| --- | --- |
| `npm ci --ignore-scripts` | `0` |
| `npm test` | `0` |
| `npm run typecheck` | `0` |
| `npm run build` | `0` |

### Test totals

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 427 pass / 0 fail / 1 todo
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
