# Missing Artifacts

The following expected artifacts were not found in the local checkout during LOCAL-BOOTSTRAP-001. Their contents must not be reconstructed from filenames or guesses.

| Expected artifact | Why needed | Canonical destination fed | Does absence block further migration? |
| --- | --- | --- | --- |
| `AP-V0-INTERACTION-0.2.0` | Authoritative AP interaction rules and attribution provenance | `contracts/AP_INTERACTION_V0.md`; `tests/ap-integrity/` | Blocks authoritative AP contract integration and its full regression import; does not block repository governance |
| `R&E-V0-SMARTPHONE-0.3.0` | Approved core empirical smartphone model and claims | `contracts/EMPIRICAL_SMARTPHONE_V0.md`; evidence registries; relevant fixtures | Blocks authoritative empirical contract and claim/source registry migration |
| `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0` | Approved distinction and handling for used and refurbished pathways | `contracts/SECONDARY_PATHWAYS_V0.md`; evidence registries | Blocks authoritative secondary-pathway contract integration |
| `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0` | Approved regression cases for secondary pathways | `tests/secondary-pathways/`; `contracts/REGRESSION_INVARIANTS_V0.md` | Blocks import and provenance verification of those regressions |
| `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json` | Approved user-input model fixtures and expectations | `contracts/USER_INPUT_MODEL_V0.md`; `tests/input-model/fixtures/` | Blocks authoritative input-model contract and fixture integration |
| V17 UI/source snapshot | Establishes exact accepted source and visual reference | `design/V17_UI_SNAPSHOT.txt`, application baseline, browser references | Blocks exact V17 checkout verification and creation of `v0.17-cloud-baseline` tag |
| V17 deterministic/SEC/browser validation artifacts | Supports the recorded validation claims and maps them to exact source | `tests/`, project state, baseline release evidence | Blocks independent verification of historical SEC and browser validation claims |
