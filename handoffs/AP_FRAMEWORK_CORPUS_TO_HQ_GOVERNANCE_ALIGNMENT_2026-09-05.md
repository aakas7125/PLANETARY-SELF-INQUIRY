# AP Framework & Corpus → Project HQ

## CROSS-WORKSTREAM HANDOFF

**Status:** published AP-originating governance handoff  
**Version:** `AP-HANDOFF-GOV-ALIGN-2026-09-05.1`  
**Receiving state:** `blocked` — awaiting HQ reconciliation/acceptance decision  
**Published:** 2026-09-05

## Purpose

Align the AP Framework & Corpus repository state with the HQ standing publication protocol approved on 2026-09-05.

The AP workstream is authorized to routinely publish immutable AP source packages, AP proposals, AP-integrity tests, and AP-originating handoffs. It is not authorized to independently alter empirical authority, integrated contracts, project state, cross-domain semantics, or accepted implementation behavior.

## Approved inputs

The following AP-originating artifacts are within standing AP publication authority and may remain published:

- `provenance/source-packages/AP-V0-INTERACTION-0.2.0.md`
- `provenance/source-packages/AP-CORPUS-V0.3.0.md`
- `tests/ap-integrity/AP_V0_INVARIANTS.md`
- `tests/ap-integrity/README.md`

The AP specialist baseline remains:

- interaction package: `AP-V0-INTERACTION-0.2.0`
- frozen philosophical corpus: `AP-CORPUS-V0.3.0`

## Provenance

The relevant repository commit is:

- `da29b79d373c90d5af6cc886253f2a763914f2d1` — `integrate AP V0 interaction and corpus baseline`

That commit published legitimate AP source packages and AP-integrity material, but it also directly modified integrated repository state, including:

- `contracts/AP_INTERACTION_V0.md`
- `contracts/INTEGRATION_NOTES.md`
- `provenance/MISSING_ARTIFACTS.md`

The contract modification promoted AP-derived interaction semantics into an integrated contract on `main` without a separate HQ acceptance/review step. Under the newly approved standing protocol, that promotion is outside the AP workstream's independent authority.

## Status

### Approved AP specialist material

**Approved for routine AP publication:**

- immutable AP source packages;
- AP-integrity tests;
- AP-originating handoffs;
- future AP proposals within `proposals/`.

### Governance mismatch requiring HQ reconciliation

**Not independently accepted by this workstream under the new protocol:**

- direct modification of `contracts/AP_INTERACTION_V0.md` in commit `da29b79d...`;
- any interpretation of that direct write as HQ acceptance solely because it is now on `main`.

This handoff does **not** assert that the integrated contract content is substantively wrong. The issue is authority and acceptance procedure, not AP content quality.

## Constraints

Project HQ should not infer that:

- publication of the AP source package equals acceptance of an integrated contract;
- the AP workstream may independently re-edit or revert `contracts/AP_INTERACTION_V0.md` to cure this mismatch;
- AP-integrity tests establish empirical truth or implementation acceptance;
- `main` presence alone retroactively supplies the missing HQ review decision.

The AP workstream will not independently change the integrated contract again. Any retain/revert/re-accept action belongs to HQ under the standing protocol.

## Open dependencies

- **Owner:** Project HQ
- **Needed input:** determine the accepted receiving state of the AP integrated contract introduced by commit `da29b79d373c90d5af6cc886253f2a763914f2d1`.
- **Why:** restore consistency between repository history and the new authority model.
- **Blocking?:** yes for declaring the current `contracts/AP_INTERACTION_V0.md` governance-clean/accepted under the new protocol; no for AP corpus maintenance or AP source publication.
- **Can continue meanwhile?:** yes. AP Framework & Corpus can maintain the frozen corpus, publish provenance-preserving source packages, proposals, integrity tests, and handoffs without modifying integrated contracts.

## Requested action

HQ may choose one of the following governance-equivalent paths:

1. explicitly review and accept the current integrated AP contract as-is;
2. supersede/revert that integrated change and later re-promote through HQ-controlled review;
3. retain parts and reconcile others through an HQ-controlled proposal/PR.

The AP workstream makes no recommendation among those project-level acceptance options; it only identifies the authority mismatch.

## Receiving-state tracking

Current state: `blocked` pending HQ reconciliation.

Allowed future states:

- `consumed` — HQ explicitly accepts/reconciles the integrated AP contract;
- `partially consumed` — HQ accepts only part of the supplied semantics/artifacts;
- `blocked` — unresolved governance or contract conflict remains;
- `superseded` — a later HQ-controlled handoff/contract replaces this package.
