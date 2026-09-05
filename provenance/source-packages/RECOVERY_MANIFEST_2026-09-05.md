# Research & Evidence Library Recovery Manifest

**Recovery date:** 2026-09-05  
**Reconciliation date:** 2026-09-05  
**Recovery state:** ORIGINAL ARTIFACTS LOCATED IN CHATGPT FILE LIBRARY — CONTENT RECOVERED; TERMINAL-BYTE SERIALIZATION LIMITATION RECORDED  
**Source:** ChatGPT Project/File Library  
**Method:** Each native Markdown artifact was read in full from the File Library, including continuation windows. Package text was not reconstructed from summaries, filenames, implementation behavior, or chat recollection.

## Scope of this reconciliation

Local Codex verification of draft PR #3 found that every stored Git package blob is exactly one byte shorter than the previously recorded recovery serialization and that appending one LF byte (`0x0A`) in memory reproduces the previously recorded SHA-256 exactly.

Research re-opened the native File Library artifacts. The File Library read interface confirms the complete package text, package identities, metadata, both same-version core variants, and their semantic contents, but it does **not expose the terminal byte of the stored source object**. It therefore cannot independently establish whether a final LF is part of the historical immutable payload or was introduced by the recovery/export serialization.

Accordingly:

- no package payload has been changed;
- no LF has been appended merely to force a checksum match;
- no line-ending normalization has been performed;
- the prior LF-inclusive values are retained as **recovery-serialization records**, not asserted as independently verified native File Library raw bytes;
- the exact raw bytes currently stored in Git are separately recorded below.

The historical packages did not contain an embedded delivery checksum.

## Recovered Research packages

| Package | File Library source | Package metadata |
| --- | --- | --- |
| `R&E-V0-SMARTPHONE-0.3.0` | native File Library Markdown artifact; later formal handoff variant | Issued 2026-09-03; supersedes none; complete formal handoff; status recorded in package |
| `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0` | native File Library Markdown artifact | Parent `R&E-V0-SMARTPHONE-1.0.0`; status `IMPLEMENTATION_READY` |
| `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0` | native File Library Markdown artifact | Parent `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0`; cases SEC-01–SEC-12; status `IMPLEMENTATION_READY` |

## Core-package variant record

The File Library contains a second complete, non-identical artifact for the same core package. Variant A and the primary recovered candidate differ only in the formal handoff wrapper at the beginning and one bullet-list line-break/whitespace region. Both remain preserved. The later artifact with the explicit `Research & Evidence → V0 — Cloud Prototype` and `CROSS-WORKSTREAM HANDOFF` wrapper remains routed as the primary recovered candidate; this routing choice is documented and is not substantive HQ acceptance.

## Raw-byte reconciliation

### A. Git-stored package blobs — directly verified raw bytes

These are the exact bytes currently stored in draft PR #3 and were verified by Local Codex from Git blob bytes without text decoding or checkout newline conversion.

| Payload | Git bytes | Git raw-byte SHA-256 | Terminal byte |
| --- | ---: | --- | --- |
| Core `R&E-V0-SMARTPHONE-0.3.0` | 25,141 | `06752e7f346c98e354e23480f63b78668f4c440a9eed39d8bd62cbbf92c314f9` | `0x2E` (`.`), no final LF |
| Used/refurb `1.0.0` | 25,450 | `5f59d10a6d1e4dac0a99ca02a3328e06e73e6725aaa4b56cc26d8941ad4036d2` | `0x2E` (`.`), no final LF |
| Secondary-pathway tests `1.0.0` | 24,431 | `9a917a788579b656058d94cdbc0d0cbfe1b1a35b0358edfd79b35e482f76a74b` | `0x2E` (`.`), no final LF |
| Core variant A | 25,062 | `a9344e43f55cc1ab5db0118c2044b5e63535f9f93db15ad119332e98dd33176b` | `0x2E` (`.`), no final LF |

### B. Previously recorded recovery serialization — LF-inclusive

The earlier recovery process recorded the following sizes/hashes. Local Codex demonstrated that each value is reproduced exactly by taking the corresponding Git blob above and appending one LF byte in memory. Because the File Library interface does not expose the historical object's terminal byte, these values are retained as recovery/export-serialization records rather than asserted native-byte checksums.

| Payload | Recovery-serialization bytes | Recovery-serialization SHA-256 |
| --- | ---: | --- |
| Core `R&E-V0-SMARTPHONE-0.3.0` | 25,142 | `e0010e22dc045842a5670c492b7d4beff705eb3a47f4c45837e6fb7f3702553d` |
| Used/refurb `1.0.0` | 25,451 | `e9c5b9cbc4502c5d63e1570c4e7c292a69574be091a60942bbd19957d7f0da42` |
| Secondary-pathway tests `1.0.0` | 24,432 | `362f67cc8f0e11dd545642094b29c4e95b940f8d449cc667199d76e4f701f3b7` |
| Core variant A | 25,063 | `b5378d1af3272f9c03228fbe87e4b8fb387cc70ef1ea4e80eb75da3ca7ec6500` |

## Verification result

- All three Research artifacts are present as complete native File Library text artifacts and contain their package identity/version.
- The used/refurbished and SEC artifacts are complete and unambiguous at the textual-content level.
- The core package is complete in both File Library variants; the variant relationship remains visible.
- Status, constraints, provenance sections, and requested-action sections are present.
- No artifact was reconstructed from a summary.
- The File Library interface available to Research does not expose the terminal raw byte, so the historical presence/absence of a final LF remains unresolvable from currently accessible evidence.
- The package files in PR #3 are therefore preserved unchanged; the provenance record now distinguishes directly verified Git bytes from LF-inclusive recovery serialization.
- Publication does not equal acceptance or canonical contract integration.
- Canonical Research/AP contract integration remains an HQ-controlled follow-up.

## Status of Issue #7 reconciliation

**Result:** `BLOCKED — exact historical terminal-byte identity cannot be independently established with the available File Library interface.`

This is a serialization/provenance limitation only. No scientific, package-semantic, AP, V17, application, product, or canonical-contract change is implied.

The smallest evidence-disciplined correction is this manifest clarification. Selecting either terminal-LF state as the historical original by inference would exceed the available evidence.

## Related Library material

A complete `AP-V0-INTERACTION-0.2.0` Library artifact was also located during the earlier recovery. This Research publication does not replace the already received AP specialist publication or change AP acceptance state.
