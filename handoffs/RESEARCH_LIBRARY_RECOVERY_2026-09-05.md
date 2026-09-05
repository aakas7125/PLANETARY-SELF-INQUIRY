# Research & Evidence → Project HQ

## HQ recovery update

**Date:** 2026-09-05

**Previous blocker:** `ORIGINAL ARTIFACT RECOVERY REQUIRED`

**Current state:** `ORIGINAL ARTIFACTS LOCATED IN CHATGPT FILE LIBRARY — RECOVERY/VERIFICATION REQUIRED`

## Settled

The File Library contains complete native artifacts for:

- `R&E-V0-SMARTPHONE-0.3.0`;
- `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0`;
- `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0`.

The used/refurbished and SEC artifacts are unambiguous. The core package has two complete, non-identical Library variants. Both are preserved verbatim; the later formal handoff artifact is routed as the primary recovered candidate, while the earlier variant is retained beside it.

The artifacts were read completely from the File Library. Their package identities, versions, issued/status metadata, constraints, provenance sections, and requested-action sections were verified. None contained a historical embedded checksum, so raw UTF-8 SHA-256 values were computed and recorded in `provenance/source-packages/RECOVERY_MANIFEST_2026-09-05.md`.

No package content was reconstructed from summaries or chat recollection.

## Publication

The following verbatim recovered packages are published on this branch under the bounded Research provenance area:

- `provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md`;
- `provenance/source-packages/R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0.md`;
- `provenance/source-packages/R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0.md`;
- `provenance/source-packages/recovered-library/R&E-V0-SMARTPHONE-0.3.0.library-variant-a.md`;
- `provenance/source-packages/RECOVERY_MANIFEST_2026-09-05.md`.

## Receiving state

- Core package: `routed` for HQ review because two same-version Library variants must remain visible and reconciled.
- Used/refurbished package: `routed` for canonical-contract review.
- SEC regression package: `routed` for regression import/review.
- No package is accepted as integrated canonical project truth by this handoff.
- No application, scientific, AP, V17, product, or semantic behavior changed.

## Requested HQ action

1. Review the recovery manifest and the two core-package variants.
2. Mark the original-artifact blocker as superseded by verified File Library recovery, subject to the documented core variant review.
3. Review/accept/reject/supersede the bounded Research publications through the normal repository gate.
4. Update canonical empirical contracts and regression imports only after HQ acceptance.
5. Do not authorize superseding re-research for these three packages unless a specific recovered artifact is later shown to be incomplete or not authoritative.

## Migration debt

After acceptance, retain these packages as immutable Git-tracked files with checksums and remote backup. Future workstreams must not depend on recovering authoritative source only from conversation history.
