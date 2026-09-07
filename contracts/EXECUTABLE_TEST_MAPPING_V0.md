# Executable Contract Test Mapping V0

Status: **Proposed mapping of accepted contracts; smartphone behavior remains unimplemented**

Task: `HQ-LC-2026-09-06-002` (Issue #16)

## Purpose and execution boundary

This record maps accepted contract and regression identifiers into the current
application test harness without presenting the governed baseline as a
smartphone implementation. It neither modifies a source package nor derives a
new scientific or AP rule. This mapping itself remains subject to HQ review.

The executable registry is `app/scripts/contract-regression-map.mjs`; its
auto-discovered validation is `app/scripts/contract-regression-map.test.mjs`.
The validation checks identifier completeness, source references, coverage kind,
and the explicit non-implementation state. It is a mapping-integrity check, not
a passing smartphone-behavior certification.

## Mapped suites

| Domain | Exact identifiers mapped | Governing material | Planned behavioral test target | Coverage kind | Current state |
| --- | --- | --- | --- | --- | --- |
| Input model | `T01`–`T35`; every source `A-T-*`, `A-GLOBAL-*`, `A-LOGIC-*`, `PI-*`, and `RC01`–`RC10` identifier | `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json`, `USER_INPUT_MODEL_V0.md`, `REGRESSION_INVARIANTS_V0.md` | `app/scripts/smartphone-input-contract.test.mjs` | Positive, prohibitions, release gates | `requires_smartphone_implementation` |
| Secondary pathways | `SEC-01`–`SEC-12` and every source `A-SEC-*` assertion | `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0.md`, `SECONDARY_PATHWAYS_V0.md`, `REGRESSION_INVARIANTS_V0.md` | `app/scripts/smartphone-secondary-contract.test.mjs` | Positive and prohibited behavior | `requires_smartphone_implementation` |
| AP inquiry | `APQ1_FUNCTION`–`APQ6_RESEE`; `INV-AP-01`–`INV-AP-20` | `tests/ap-integrity/AP_V0_INVARIANTS.md`, `AP_INTERACTION_V0.md` | `app/scripts/smartphone-ap-contract.test.mjs` | Positive and prohibited behavior | `requires_smartphone_implementation` |
| Empirical claim boundary | `SP-PATH-CLIMATE-001`, `SP-PATH-MINING-ECO-001`, `SP-PATH-MINING-PEOPLE-001`, `SP-PATH-EWASTE-PEOPLE-001`, `SP-PATH-EWASTE-ECO-001`, `SP-PATH-WATER-001` | `EMPIRICAL_SMARTPHONE_V0.md` | `app/scripts/smartphone-empirical-boundary.test.mjs` | Prohibited unsupported impact/displacement claims | `requires_smartphone_implementation` |

The registry reads the immutable test packages and the accepted AP-invariant
record to enumerate the individual IDs. This keeps the mapping exact without
copying, normalizing, or silently maintaining a second package serialization.

## Current test disposition

- Existing baseline tests remain baseline/harness tests only; none are claimed
  as coverage for a canonical smartphone rule.
- The mapping-integrity tests pass on the current baseline.
- Four explicit `todo` entries remain in the application test output. They are
  not skipped passing tests and not behavioral coverage: each names a required
  future implementation suite.
- A later implementation task must replace only the applicable `todo` entry
  with real behavior tests and change the corresponding registry rows from
  `requires_smartphone_implementation` only after those tests execute.

## Preserved boundaries

The map preserves unknown-is-not-zero, equivalent-service and full-sequence
requirements, used/refurbished separation, no unsupported displacement or
individual-impact claims, AP raw-answer authority, `unclear`, traceability,
branch precedence, non-diagnostic language, and the no-motive-score rule as
test requirements. It does not implement or display any of them. No UI,
smartphone behavior, scientific semantics, AP semantics, V17 material, or
source package changes are included.
