# Research & Evidence → Project HQ

## HQ recovery update

**Date:** 2026-09-05

**Previous blocker:** `ORIGINAL ARTIFACT RECOVERY REQUIRED`

**Current state:** `ORIGINAL ARTIFACTS LOCATED; TEXTUAL CONTENT RECOVERED; TERMINAL-BYTE SERIALIZATION UNRESOLVED`

## Settled

The File Library contains complete native artifacts for:

- `R&E-V0-SMARTPHONE-0.3.0`;
- `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0`;
- `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0`.

The used/refurbished and SEC artifacts are unambiguous at the textual-content level. The core package has two complete, non-identical File Library variants. Both remain preserved; the later formal handoff artifact remains routed as the primary recovered candidate while the earlier variant remains alongside it.

Research re-opened the native File Library artifacts under HQ Issue #7. Their package identities, versions, issued/status metadata, constraints, provenance sections, requested-action sections, and complete text are recoverable. The currently available File Library interface does not expose the terminal raw byte of the source artifact, so it cannot establish whether the original immutable payload ended with LF.

No package content was reconstructed from summaries or chat recollection.

## Serialization reconciliation

Local Codex verification of PR #3 established that the four Git package blobs are each exactly one byte shorter than the earlier recovery-manifest serialization and end in `0x2E` with no final LF. Appending one LF byte in memory reproduces the earlier recovery hash for each file exactly.

Research cannot therefore truthfully select one terminal-byte representation as the historical original from currently accessible evidence.

The bounded correction is:

- preserve all four package payloads unchanged;
- do not append LF merely to force checksum equality;
- do not normalize line endings;
- record the exact Git-stored raw-byte sizes and SHA-256 values separately;
- retain the prior LF-inclusive sizes/hashes as recovery/export-serialization records, not as independently verified native File Library raw-byte checksums;
- document the unresolved terminal-byte limitation explicitly in `provenance/source-packages/RECOVERY_MANIFEST_2026-09-05.md`.

Correction commit: `3bf3d93272f5c208373c71640de4490206af4cf5` plus this handoff update commit.

## Publication

The following recovered packages remain published on the Research branch under the bounded provenance area, unchanged in payload:

- `provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md`;
- `provenance/source-packages/R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0.md`;
- `provenance/source-packages/R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0.md`;
- `provenance/source-packages/recovered-library/R&E-V0-SMARTPHONE-0.3.0.library-variant-a.md`.

The reconciliation changes only provenance documentation.

## Receiving state

- Core package: `blocked` for exact-byte provenance acceptance because the historical terminal-LF state cannot be independently observed; both variants remain visible.
- Used/refurbished package: `blocked` for exact-byte provenance acceptance for the same serialization reason; textual-content recovery remains intact.
- SEC regression package: `blocked` for exact-byte provenance acceptance for the same serialization reason; textual-content recovery remains intact.
- No package is accepted as integrated canonical project truth by this handoff.
- No application, scientific, AP, V17, product, canonical-contract, or semantic behavior changed.

## Requested HQ action

1. Treat the original “artifact missing” blocker as superseded: the native File Library artifacts are found and their complete text is recovered.
2. Treat exact historical terminal-byte identity as a narrower unresolved provenance limitation.
3. Review the corrected manifest and decide whether canonical acceptance requires byte-identical historical newline proof or whether the preserved text plus explicit dual-serialization record is sufficient governance evidence.
4. If byte-identical terminal-byte proof is mandatory, the task remains blocked until a File Library/export mechanism that exposes raw bytes is available.
5. Do not authorize package rewriting, re-research, or semantic reconstruction to resolve a one-byte serialization ambiguity.
6. Canonical empirical contracts and regression imports remain HQ-controlled and must not be updated merely from this publication.

## Migration debt

After HQ disposition, retain the source packages as immutable Git-tracked files with explicit raw-byte checksums and remote backup. Future workstreams must not rely on a document interface that hides serialization details when exact byte identity is a release requirement.
