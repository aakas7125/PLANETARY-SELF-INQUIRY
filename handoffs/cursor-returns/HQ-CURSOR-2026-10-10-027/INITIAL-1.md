# Cursor return — HQ-CURSOR-2026-10-10-027 / INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated implementation head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-10-027`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/96
- PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/97
- Branch: `cursor/hq-cursor-2026-10-10-027-empirical-mining-people-boundary`
- Dispatch / cycle: `HQ-CURSOR-2026-10-10-027 / INITIAL-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/96#issuecomment-6102211827

## SHAs

- Starting `origin/main` SHA: `244cbb993a9d72b671c51ca8385e46a3dfc061ed`
- Prior reviewed head: n/a (new task INITIAL-1)
- VALIDATED_IMPLEMENTATION_HEAD: `45ee4bd5bcca73e5a5e3a7f4c8d4f66bfef41f6c`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Authorized scope implemented

1. Deterministic qualitative emission for registry-backed
   `SP-PATH-MINING-PEOPLE-001` / exact `S10` when complete claim/source authority
   passes and relevant supply-chain geography/process is explicitly established.
2. Preserve exact claim/source fields, condition dependence, `QUALITATIVE`
   status, `conditional_pathway` attribution, and site-specific scope — no
   worker/community outcome attributed to one phone.
3. Fail closed for identity/version defects; altered/reordered/extra/substituted
   authority; missing/unknown/generic-inferred geography/process; device/worker/
   community attribution; named worker/community/person/place/site/event
   attribution; illness/injury/death counts; exposure/dose/risk/probability;
   exact individual/community damage; unified scores; unsupported causal-proof
   wording; unknown-to-zero/false coercion; quantitative/location requests;
   case/test metadata as production authority.
4. Mapping: climate and mining-eco retained covered; mining-people newly covered;
   three remaining empirical IDs pending; empirical-suite TODO retained.
5. Climate and mining-eco behavior unchanged; no excluded-scope mutation.

## Changed implementation files

- `app/src/lib/smartphone/empirical-mining-people-boundary.mjs` (new)
- `app/src/lib/smartphone/empirical-climate-boundary.mjs` (pending-ID list only)
- `app/src/lib/smartphone/empirical-mining-eco-boundary.mjs` (pending-ID list only)
- `app/scripts/smartphone-empirical-boundary.test.mjs`
- `app/scripts/contract-regression-map.mjs`
- `app/scripts/contract-regression-map.test.mjs`

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

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 426 pass / 0 fail / 1 todo
- TypeScript suite: 50 pass / 0 fail / 0 todo

### Lockfile integrity

- `package-lock.json` SHA-256:
  `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`
- Unchanged before/after `npm ci --ignore-scripts`
- Tracked lockfile diff: none

## Authority inputs used

- claim ID: `SP-PATH-MINING-PEOPLE-001`
- package commit: `024a95392d2e1555a3c9b598fdc291bd341c3d6b`
- package provenance: `R&E-V0-SMARTPHONE-0.3.0`
- source: exact `S10` registry record only
- registries/contracts read-only; no reconstruction or enrichment

## Direct positive / negative evidence

- Positive: exact-authority emission when claim/source complete and
  `relevant_supply_chain_geography_process_established === true`
- Negative: direct regressions for every prohibited category listed in Issue #96

## Discrepancies

None.

## Self-merge

NO

## Executor result

`VERIFIED_FOR_HQ_REVIEW`
