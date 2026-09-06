# Missing Artifacts

The following expected artifacts were not found during LOCAL-SOURCE-INTEGRATION-001. Their contents must not be reconstructed from filenames or guesses.

## Imported source artifact

| Artifact | Integration status | Canonical outputs |
| --- | --- | --- |
| `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json` | Imported verbatim and hash-verified | `contracts/USER_INPUT_MODEL_V0.md`; input-semantics subset of `contracts/REGRESSION_INVARIANTS_V0.md` |

| Expected artifact | Why needed | Canonical destination fed | Does absence block further migration? |
| --- | --- | --- | --- |
| `AP-V0-INTERACTION-0.2.0` (received; not physically missing) | Preserved specialist publication, verified for derivation under Issue #9 | `contracts/AP_INTERACTION_V0.md`; `tests/ap-integrity/` | HQ acceptance of proposed derivation under Issue #10 remains pending; substantial-public-reproduction licensing and AP-OTH primary-video lineage remain unresolved |
| `R&E-V0-SMARTPHONE-0.3.0` (accepted source; proposed derivation pending HQ review) | Approved core empirical smartphone model and claims | `contracts/EMPIRICAL_SMARTPHONE_V0.md`; evidence registries; relevant fixtures | No; the source is present. HQ acceptance of this proposed derivation remains required. |
| `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0` (accepted source; proposed derivation pending HQ review) | Approved distinction and handling for used and refurbished pathways | `contracts/SECONDARY_PATHWAYS_V0.md`; evidence registries | No; the source is present. HQ acceptance of this proposed derivation remains required. |
| `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0` (accepted source; proposed derivation pending HQ review) | Approved regression cases for secondary pathways | `tests/secondary-pathways/`; `contracts/REGRESSION_INVARIANTS_V0.md` | No; the source is present. HQ acceptance of this proposed derivation remains required. |
| V17 UI/source snapshot | Establishes exact accepted source and visual reference | `design/V17_UI_SNAPSHOT.txt`, application baseline, browser references | Blocks exact V17 checkout verification and creation of `v0.17-cloud-baseline` tag |
| V17 deterministic/SEC/browser validation artifacts | Supports the recorded validation claims and maps them to exact source | `tests/`, project state, baseline release evidence | Blocks independent verification of historical SEC and browser validation claims |

## Recovery update — 2026-09-05

The three Research artifacts previously listed as missing were located in the ChatGPT Project/File Library, read completely, checksum-recorded, and published verbatim under `provenance/source-packages/` on the recovery branch. The core package has two complete same-version Library variants; both are preserved and the later formal handoff is routed as the primary recovered candidate. Canonical contract integration remains an HQ-controlled review step.
