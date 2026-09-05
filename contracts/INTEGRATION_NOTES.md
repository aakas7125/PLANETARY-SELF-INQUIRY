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

## AP-DER-010 — Proposed derivation, 2026-09-06

- Authority: HQ task [Issue #10](https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/10); specialist verification and conditions in [Issue #9](https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/9).
- Source pins: AP-V0-INTERACTION-0.2.0, AP-CORPUS-V0.3.0 and AP_V0_INVARIANTS.md at received commit da29b79d373c90d5af6cc886253f2a763914f2d1. Source files and historical receiving review are unchanged.
- Affected output: contracts/AP_INTERACTION_V0.md, proposed only; its section 16 maps all 20 candidate invariants to the source clauses. No accepted AP integration record is created.
- Reconciliation: raw-answer authority and unclear handling are compatible with USER_INPUT_MODEL_V0.md. APQ5's imagined one-year scenario is not a research/service-life default. Exact Q6 consider_used_or_refurbished wording does not collapse distinct empirical pathways. Empirical truth remains with Research & Evidence. No conflicting accepted AP rule exists in the placeholder.
- Unresolved licensing: substantial public/commercial Framework reproduction requires project-level licensing/legal resolution. Narrow project-authored paraphrase/inquiry and official links remain the specialist display boundary; no legal clearance is inferred.
- Unresolved attribution: AP-OTH-001@1.1 retains approved claim/P3 transcript support, unresolved exact primary-video lineage, post-evidence-only use and AI-summary exclusion. No provenance upgrade is inferred.
- Interim handling: proposed contract only, no application change or accepted regression implementation. Historical da29b79 contract promotion remains unaccepted by implication; the receiving-state review is retained.
- Acceptance evidence: none for canonical integration. Issue #10 authorizes derivation and branch/PR publication only; HQ must separately accept, reject or request changes.
- Index reconciliation: the AP source is physically present and specialist-verified under Issue #9, so physical absence is no longer the AP blocker. Canonical integration and the stated licensing/provenance conditions remain pending. Earlier INT-001 absence statements are historical at its recorded date, not a claim of current absence.
