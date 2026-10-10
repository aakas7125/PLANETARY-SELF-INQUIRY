# Cursor return — HQ-CURSOR-2026-10-10-028 / INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated implementation head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-10-028`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/98
- PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/99
- Branch: `cursor/hq-cursor-2026-10-10-028-empirical-ewaste-people-boundary`
- Dispatch / cycle: `HQ-CURSOR-2026-10-10-028 / INITIAL-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/98#issuecomment-6102366777

## SHAs

- Starting `origin/main` SHA: `d817375b54176db3c3b01dfd19cc4c4616e60346`
- Prior reviewed head: n/a (new task INITIAL-1)
- VALIDATED_IMPLEMENTATION_HEAD: `a7c1135c26aca7aa64cf072147b36988e3195265`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Authorized scope implemented

1. Deterministic conditional emission for registry-backed
   `SP-PATH-EWASTE-PEOPLE-001` / exact `S11` when complete claim/source authority
   passes and unsafe or informal handling is explicitly established.
2. Preserve exact claim/source fields, condition dependence, `APPROVED`
   status, `conditional_pathway` attribution, and authoritative-assessment
   scope. No exposure or health outcome is attributed to a named person,
   child, worker, community, place, site, event, or one phone.
3. Fail closed for identity/version defects; malformed non-object source maps;
   altered, reordered, extra, or substituted authority; missing, false,
   unknown, or inferred unsafe/informal handling; fate or disposal context
   and global collection-rate context that do not establish the condition;
   formal recycling attached as this pathway's fate; named-target attribution;
   one-device-to-person/community exposure or health-outcome attribution;
   illness, injury, death, or victim counts; exact exposure, dose, risk, or
   probability; global collection rates used as an individual route or
   probability; exact individual/community damage; unified environmental,
   safety, Protect Four, or moral scores; unsupported causal-proof wording;
   unknown-to-zero/false coercion; quantitative or location-bearing output;
   case/test metadata as production authority.
4. Mapping: climate, mining-eco, and mining-people retained covered;
   e-waste-people newly covered; `SP-PATH-EWASTE-ECO-001` and
   `SP-PATH-WATER-001` pending; empirical-suite TODO retained.
5. Earlier resolvers still do not emit this pathway. Their pending lists now
   treat it as covered elsewhere (`unknown_claim`), matching the prior slice
   handoff. Positive climate, mining-eco, and mining-people emission is
   unchanged. No excluded-scope mutation.

## Changed implementation files

- `app/src/lib/smartphone/empirical-ewaste-people-boundary.mjs` (new)
- `app/src/lib/smartphone/empirical-climate-boundary.mjs` (pending-list handoff only)
- `app/src/lib/smartphone/empirical-mining-eco-boundary.mjs` (pending-list handoff only)
- `app/src/lib/smartphone/empirical-mining-people-boundary.mjs` (pending-list handoff only)
- `app/scripts/smartphone-empirical-boundary.test.mjs`
- `app/scripts/contract-regression-map.mjs`
- `app/scripts/contract-regression-map.test.mjs`

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

### Commands and exit codes

| Command | Exit code |
| --- | --- |
| `npm ci --ignore-scripts` | `0` |
| `npm test` | `0` |
| `npm run typecheck` | `0` |
| `npm run build` | `0` |

### Test totals

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 448 pass / 0 fail / 1 todo
- TypeScript suite: 50 pass / 0 fail / 0 todo

### Lockfile integrity

- `package-lock.json` SHA-256:
  `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`
- Unchanged before/after `npm ci --ignore-scripts`
- Tracked lockfile diff: none

## Authority inputs used

- claim ID: `SP-PATH-EWASTE-PEOPLE-001`
- package commit: `024a95392d2e1555a3c9b598fdc291bd341c3d6b`
- package provenance: `R&E-V0-SMARTPHONE-0.3.0`
- statement: `Unsafe or informal e-waste processing can expose people to hazardous substances and adverse health outcomes.`
- domains: `waste`, `human_health`
- confidence: `high`
- attribution: `conditional_pathway`
- scope: `authoritative_assessment`
- status: `APPROVED`
- condition: `unsafe or informal handling occurs`
- source: exact `S11` registry record
  - citation: `WHO, Children and Digital Dumpsites, 2021 plus updated e-waste health material.`
  - scope: `Unsafe e-waste exposure and health pathway.`
  - metadata limit preserved from the registry

## Direct evidence

- Positive: explicit unsafe/informal handling plus exact claim/source authority emits the conditional pathway with null quantity, exposure, dose, burden, risk, counts, location, probability, and collection rate.
- Negative: each prohibited category above has a direct non-emission regression, including malformed non-object source maps and reordered `evidence_domain`.
- Fate values `continue_use`, `sell_or_gift_for_reuse`, `trade_in_unknown_next_use`, `store_in_drawer`, `formal_recycling`, `discard_general_waste`, and `unknown` do not establish the condition. `formal_recycling` does not attach this pathway even when the explicit condition flag is also true.

## Discrepancies

None.

## Self-merge

NO

## Executor result

VERIFIED_FOR_HQ_REVIEW
