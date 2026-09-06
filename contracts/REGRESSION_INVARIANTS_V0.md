# Regression Invariants V0 Contract

Status: **Proposed derivation for HQ review: input semantics plus accepted secondary-pathway contract**

## Imported authority

- Input subset: `R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json`, SHA-256 `DC0DCA01C60C9A69F00562D5FEEB95F3EA6D0B74C7D7201DC62A3FD80149D661`, T01–T35 and RC01–RC10.
- Secondary subset: `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0`, accepted through PR #3. Exact cases and assertions remain immutable in the source package; this contract imports their required behavior without claiming executable coverage.

## Global invariants

Unknown is neither zero nor false. User facts receive no defaults. Equivalent adequate service or a complete service sequence is required for a comparative ranking. Historical manufacture is excluded from prospective keep/repair and direct secondary totals, not credited as avoided manufacture. Generic EOL/recycling credit remains null. Qualitative domains do not alter climate totals or form one harm score.

For every secondary case: used and refurbished differ; excluded prior manufacture is not avoided manufacture; market-displacement credit remains null absent explicit valid consequential scenario; grade does not derive service life; ADEME 7.61 is never generic; U.S. 0.40 never enters primary direct scoring.

## Required secondary cases

| Case | Required outcome | Severity |
| --- | --- | --- |
| SEC-01 | Private resale is used; unknown transfer remains null; no displacement credit | CRITICAL |
| SEC-02 | Documented structured preparation/battery repair is refurbished; unknown total remains unknown | CRITICAL |
| SEC-03 | Commercial used listing preserves process uncertainty | MAJOR / CRITICAL if numerical refurbishment is fabricated |
| SEC-04 | Refurbished label/grade alone yields qualitative-only, no 7.61 | CRITICAL |
| SEC-05 | Unknown used service blocks definitive equivalent-service ranking | CRITICAL |
| SEC-06 | Unknown parcel transfer is not zero and has no generic 0.475 fallback | CRITICAL |
| SEC-07 | Explicit ADEME scenario permits labelled 7.61 only, non-decomposable | CRITICAL |
| SEC-08 | Arbitrary refurbished phone does not inherit ADEME | CRITICAL |
| SEC-09 | Short secondary service requires a sequence; unknown next event is insufficient | CRITICAL |
| SEC-10 | Complete source-specific burden plus full service permits quantitative comparison | MAJOR / CRITICAL if boundary label is lost or stages double-counted |
| SEC-11 | Both unquantified secondary pathways have no numeric winner | CRITICAL |
| SEC-12 | Personal buy-new counterfactual is stored separately from displacement | CRITICAL |

A secondary release passes only when all SEC-01–SEC-12 execute, zero CRITICAL assertions fail, pathways remain split, and no unsupported generic secondary CO2 default exists. The detailed source assertion IDs `A-SEC-*`, expected structures and prohibited interpretations remain the canonical immutable test specification. Current application tests are not certified coverage until mapped and executed separately.
