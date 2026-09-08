# Executable Contract Test Mapping V0

Status: **Proposed mapping of accepted contracts; T01–T35 case-level input slices, all ten `A-GLOBAL-*` assertions, and the seven core `A-LOGIC` adequacy/life/repair assertions execute, with remaining logic and prohibited-interpretation identifiers unimplemented**

Task: `HQ-LC-2026-09-06-002` (Issue #16); global unknown/default slice `HQ-CURSOR-2026-09-08-004` (Issue #40); global comparison/scoring-boundary slice `HQ-CURSOR-2026-09-08-005` (Issue #43); core logic slice `HQ-CURSOR-2026-09-08-006` (Issue #45)

## Purpose and execution boundary

This record maps accepted contract and regression identifiers into the current
application test harness and identifies the scope backed by executing tests.
It does not present the governed baseline as a complete smartphone implementation. It neither modifies a source package nor derives a
new scientific or AP rule. This mapping itself remains subject to HQ review.

The executable registry is `app/scripts/contract-regression-map.mjs`; its
auto-discovered validation is `app/scripts/contract-regression-map.test.mjs`.
The validation checks identifier completeness, source references, coverage kind,
and each row's coverage state. It is a mapping-integrity check, not
a complete smartphone-behavior certification.

## Mapped suites

| Domain | Exact identifiers mapped | Governing material | Planned behavioral test target | Coverage kind | Current state |
| --- | --- | --- | --- | --- | --- |
| Input model | `T01`–`T35`, their listed `A-T-*` assertions, `RC01`–`RC10`, all ten `A-GLOBAL-*` assertions, and the seven core `A-LOGIC` adequacy/life/repair assertions execute. Remaining input IDs (`A-LOGIC-REFURB-*`, `A-LOGIC-FATE-*`, `A-LOGIC-MISSING-*`, `A-LOGIC-EOL-001`, `A-LOGIC-MATERIALS-001`, `PI-001`–`PI-020`) remain mapped gaps. | `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json`, `USER_INPUT_MODEL_V0.md`, `REGRESSION_INVARIANTS_V0.md` | `app/scripts/smartphone-input-contract.test.mjs` | Positive, prohibitions, release gates | Mixed: `covered_by_executing_assertion` for T01–T35 case assertions, RC01–RC10, all ten executed `A-GLOBAL-*` assertions, and the seven executed core `A-LOGIC-*` assertions; remaining input rows stay `requires_smartphone_implementation` |
| Secondary pathways | `SEC-01`–`SEC-12` and every source `A-SEC-*` assertion | `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0.md`, `SECONDARY_PATHWAYS_V0.md`, `REGRESSION_INVARIANTS_V0.md` | `app/scripts/smartphone-secondary-contract.test.mjs` | Positive and prohibited behavior | `requires_smartphone_implementation` |
| AP inquiry | `APQ1_FUNCTION`–`APQ6_RESEE`; `INV-AP-01`–`INV-AP-20` | `tests/ap-integrity/AP_V0_INVARIANTS.md`, `AP_INTERACTION_V0.md` | `app/scripts/smartphone-ap-contract.test.mjs` | Positive and prohibited behavior | `requires_smartphone_implementation` |
| Empirical claim boundary | `SP-PATH-CLIMATE-001`, `SP-PATH-MINING-ECO-001`, `SP-PATH-MINING-PEOPLE-001`, `SP-PATH-EWASTE-PEOPLE-001`, `SP-PATH-EWASTE-ECO-001`, `SP-PATH-WATER-001` | `EMPIRICAL_SMARTPHONE_V0.md` | `app/scripts/smartphone-empirical-boundary.test.mjs` | Prohibited unsupported impact/displacement claims | `requires_smartphone_implementation` |

The registry reads the immutable test packages and the accepted AP-invariant
record to enumerate the individual IDs. This keeps the mapping exact without
copying, normalizing, or silently maintaining a second package serialization.

## Current test disposition

- Existing baseline tests remain baseline/harness tests only; none are claimed
  as coverage for a canonical smartphone rule beyond the executed slice below.
- `smartphone-input-contract.test.mjs` executes the immutable T01–T35 inputs
  and their listed assertions and release groups, all ten `A-GLOBAL-*`
  assertions, and the seven core `A-LOGIC` adequacy/life/repair assertions;
  it does not cover remaining `A-LOGIC-*` or `PI-001`–`PI-020`.
- The mapping-integrity tests distinguish those executing assertions from every
  remaining implementation gap.
- Four explicit `todo` entries remain in the application test output. The input
  TODO now names only uncovered `A-LOGIC-REFURB/FATE/MISSING/EOL/MATERIALS`
  and `PI-*` families; the other three TODOs remain wholly unimplemented suites.
- A later implementation task must change only the registry rows backed by its
  executing assertions from `requires_smartphone_implementation`.

## Preserved boundaries

The map preserves unknown-is-not-zero, equivalent-service and full-sequence
requirements, used/refurbished separation, no unsupported displacement or
individual-impact claims, AP raw-answer authority, `unclear`, traceability,
branch precedence, non-diagnostic language, and the no-motive-score rule as
test requirements. This bounded slice executes only listed input-contract behavior; it does not display it. No UI,
scientific semantics, AP semantics, V17 material, or
source package changes are included.
