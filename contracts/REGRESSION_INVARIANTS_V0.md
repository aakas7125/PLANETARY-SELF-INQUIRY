# Regression Invariants V0 Contract

Status: **Partially integrated ? input-semantics subset**

## Imported authority

`R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json` is authoritative for this subset (SHA-256 `DC0DCA01C60C9A69F00562D5FEEB95F3EA6D0B74C7D7201DC62A3FD80149D661`). It contains 35 cases (`T01`?`T35`), global and logic assertions, prohibited interpretations, severity rules, and release-critical groups.

## Release-critical groups

| Group | Required behavior |
| --- | --- |
| RC01?RC02 | Use the user horizon; do not default unknown remaining service to three years. |
| RC03?RC04 | Remove unsafe keep-as-is; support expiry never forces replacement. |
| RC05?RC07 | Preserve battery range and extension; do not infer unknown extension or generic major-board impact. |
| RC08 | Include foreseeable repair-replacement sequences or return insufficient information. |
| RC09 | Do not invent refurbished values; preserve ADEME as opaque and source-specific. |
| RC10 | Preserve old-device fate, e-waste, mass, unknown, and displacement semantics. |

## Global invariants

- Unknown is neither zero nor false; user facts never receive defaults.
- Comparative ranking requires equivalent adequate service representation.
- Historic manufacture is excluded from prospective keep totals.
- Generic EOL climate and recycling credit remain null.
- Qualitative domains do not alter climate totals or create one harm score.

A CRITICAL regression or prohibited inference fails alignment. This is not a complete V0 regression contract until the missing AP, empirical, secondary-pathway, secondary-test, and V17-validation artifacts are imported and reconciled.
