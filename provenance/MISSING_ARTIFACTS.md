# Missing Artifacts

The following expected artifacts were not found during LOCAL-SOURCE-INTEGRATION-001. Their contents must not be reconstructed from filenames or guesses.

## Imported source artifact

| Artifact | Integration status | Canonical outputs |
| --- | --- | --- |
| `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json` | Imported verbatim and hash-verified | `contracts/USER_INPUT_MODEL_V0.md`; input-semantics subset of `contracts/REGRESSION_INVARIANTS_V0.md` |

| Expected artifact | Why needed | Canonical destination fed | Does absence block further migration? |
| --- | --- | --- | --- |
| `AP-V0-INTERACTION-0.2.0` | Authoritative AP interaction rules and attribution provenance | `contracts/AP_INTERACTION_V0.md`; `tests/ap-integrity/` | Blocks authoritative AP contract integration and its full regression import; does not block repository governance |
| `R&E-V0-SMARTPHONE-0.3.0` | Approved core empirical smartphone model and claims | `contracts/EMPIRICAL_SMARTPHONE_V0.md`; evidence registries; relevant fixtures | Blocks authoritative empirical contract and claim/source registry migration |
| `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0` | Approved distinction and handling for used and refurbished pathways | `contracts/SECONDARY_PATHWAYS_V0.md`; evidence registries | Blocks authoritative secondary-pathway contract integration |
| `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0` | Approved regression cases for secondary pathways | `tests/secondary-pathways/`; `contracts/REGRESSION_INVARIANTS_V0.md` | Blocks import and provenance verification of those regressions |
| V17 UI/source snapshot | Establishes exact accepted source and visual reference | `design/V17_UI_SNAPSHOT.txt`, application baseline, browser references | Blocks exact V17 checkout verification and creation of `v0.17-cloud-baseline` tag |
| V17 deterministic/SEC/browser validation artifacts | Supports the recorded validation claims and maps them to exact source | `tests/`, project state, baseline release evidence | Blocks independent verification of historical SEC and browser validation claims |

## Recovery update — 2026-09-05

The three Research artifacts previously listed as missing were located in the ChatGPT Project/File Library, read completely, checksum-recorded, and published verbatim under `provenance/source-packages/` on the recovery branch. The core package has two complete same-version Library variants; both are preserved and the later formal handoff is routed as the primary recovered candidate. Canonical contract integration remains an HQ-controlled review step.
