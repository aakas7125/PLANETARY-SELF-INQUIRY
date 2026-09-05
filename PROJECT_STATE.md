# Project State

Last updated: 2026-09-05

## Accepted baseline

V0 Version 17 (V17) is the owner-accepted, owner-only smartphone reference baseline and must remain frozen. This repository currently contains a smartphone-decision application consistent with many described V17 properties, but the checkout has not been independently verified as the exact accepted V17 source. See **Migration status**.

## Validation status

The accepted V17 state is recorded as having passed:

- deterministic suites;
- SEC-01 through SEC-12;
- browser QA at 1280 px desktop width; and
- browser QA at 390 px mobile width.

Those historical validation artifacts are not currently present in this repository. During bootstrap, the locally available suite was run: 33 Vitest tests passed, lint completed with warnings and no errors, and the production build succeeded. This local run does not substitute for the missing SEC and browser-QA records or prove V17 identity.

## Integrity status

The accepted V17 baseline preserves scientific boundaries, AP provenance, uncertainty and unknown handling, conditional outcomes, and the user's freedom to choose any legitimate result. The permanent governing requirements are in `PROJECT_CONSTITUTION.md`.

## Known limitations

No approved generic value is currently established for:

- used-transfer footprint;
- an arbitrary refurbished-phone footprint;
- a grid dataset; or
- market-displacement credit.

These remain unknown rather than being silently filled. They are tracked separately from defects in `project-state/KNOWN_LIMITATIONS.md`.

## UX status

Operational and browser validation is recorded as passed for accepted V17. Fresh external comprehension validation remains incomplete. External feedback has identified clutter, jargon, difficult Situation terminology, cognitive burden or perceived length, and a desire for a more engaging presentation. Animation is not part of the accepted V17 baseline.

## Development state

This is an implemented application, not a pre-build or planning-only project. The current checkout is a React, TypeScript, and Vite client-side application with deterministic Vitest coverage. V17 remains the frozen reference while future work is governed locally.

## Migration status

The canonical governance and project-state scaffold was established in LOCAL-BOOTSTRAP-001. LOCAL-SOURCE-INTEGRATION-001 imported the approved input-test package `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json` verbatim and integrated its scoped input and regression semantics. Cloud specialist histories and remaining approved packages have not yet been completely imported. The absence of a V17 source snapshot, release identifier, historical validation records, and remaining expected specialist packages prevents verification that the current commit is the exact accepted V17 source; therefore no V17 baseline tag has been created.
