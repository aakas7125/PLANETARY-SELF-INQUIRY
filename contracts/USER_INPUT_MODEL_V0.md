# User Input Model V0 Contract

Status: **Integrated within available source scope**

## Authority and scope

Derived from immutable `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json` (SHA-256 `DC0DCA01C60C9A69F00562D5FEEB95F3EA6D0B74C7D7201DC62A3FD80149D661`). This package provides scientific input semantics, not the absent AP, core empirical, secondary-pathway, or V17 source contracts.

## Canonical rules derived from T01?T35

- Raw user situation facts are authoritative. Missing user facts never receive defaults; missing research parameters remain null/unknown unless an explicit approved fallback exists. The two missingness classes remain distinguishable.
- Unknown is neither zero nor false. ?I don't know? is legitimate. User ranges remain ranges and invalid lifetime values fail validation rather than silently clamping.
- Adequacy depends on safety, required functions, and support adequacy for required use. Device age does not determine adequacy or remaining life; a phone that powers on is not necessarily adequate.
- Unsafe keep-as-is is infeasible. Ended support is not an automatic replacement trigger. Unknown remaining service has no three-year fallback.
- Users do not supply technical grid-carbon intensity. If the system has no approved factor, charging carbon remains unknown or omitted.
- Repair requires a traceable type and post-repair service. Battery (0.3?0.7 kg CO2e) and display (3?8 kg CO2e) remain provisional generic ranges only where their approved scenario applies. Generic major-board impact remains null; Fairphone 5's 17.84 kg CO2e override is model-specific.
- A repair shorter than the common service horizon includes a foreseeable next event; if that event is unknown, the comparison is insufficient rather than truncated. New-phone life cannot amortize upfront production to favor early replacement.
- Arbitrary refurbished phones remain unquantified without approved direct evidence. ADEME 7.61 kg CO2e is opaque, two-year, source-specific, non-decomposable, and never a default.
- Reuse, storage, trade-in, formal recycling, mass, EOL, and market-displacement states retain their explicit unknown/boundary semantics. No generic mass, EOL value, recycling credit, or 1:1 displacement credit is inserted.
- Qualitative materials, water, people, and ecosystem pathways do not alter climate totals or create a unified harm score. Upstream materials are not double-counted inside a product LCA.

## Release rule

All CRITICAL cases and release-critical groups RC01?RC10 must pass before an implementation claims alignment. Current application tests are not certified coverage until mapped case-by-case to T01?T35.
