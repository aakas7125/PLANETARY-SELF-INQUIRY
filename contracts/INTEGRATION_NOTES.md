# Contract Integration Notes

Use this log to record conflicts and reconciliations between verbatim source packages before updating a canonical contract.

## Required record fields

- Record ID and date
- Source package names and immutable identifiers or checksums
- Affected canonical contract or regression
- Exact propositions in conflict
- Whether the conflict is empirical, AP attribution, Project Interpretation, input-model, pathway, test, or terminology related
- Interim handling, including any blocked behavior
- Authorized reconciliation and rationale
- Approver and acceptance evidence

## Open integration conflicts

### INT-001 ? Input-test package integration

- Date: 2026-09-05
- Source package: `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json`
- Immutable copy: `provenance/source-packages/R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json`
- SHA-256: `DC0DCA01C60C9A69F00562D5FEEB95F3EA6D0B74C7D7201DC62A3FD80149D661`
- Affected contracts: `USER_INPUT_MODEL_V0.md`; input-semantics subset of `REGRESSION_INVARIANTS_V0.md`.
- Scope: 35 scientific input-semantics cases, global/logic assertions, prohibited interpretations, severity rules, and RC01?RC10 groups.
- Reconciliation: no cross-package choice was made; the other expected packages are absent.
- Interim handling: AP, empirical, secondary-pathway, secondary-test, and V17-dependent contracts remain pending. Candidate code is not a substitute source.

None discovered among imported packages: only one approved package is available. Absence of remaining packages must not be mistaken for agreement.
