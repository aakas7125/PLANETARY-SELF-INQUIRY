# AP-Integrity Regressions

Authoritative AP integration is now available.

Pinned inputs:

- `AP-V0-INTERACTION-0.2.0`
- `AP-CORPUS-V0.3.0`
- canonical contract: `contracts/AP_INTERACTION_V0.md`

Required AP integrity behavior is specified in `AP_V0_INVARIANTS.md`.

Existing implementation tests may remain under `src/tests/`, but V0 acceptance should map relevant tests back to these versioned AP invariants. Tests must not invent motive scores, hidden diagnoses, source-lens claims, or behavioural requirements absent from the authoritative package.
