# Empirical Smartphone V0 Contract

Status: **Proposed derivation for HQ review; not accepted canonical truth**

Task: `HQ-LC-2026-09-06-001` (Issue #12). Sources accepted through PR #3 merge `024a95392d2e1555a3c9b598fdc291bd341c3d6b`; dual-serialization provenance is recorded in `provenance/source-packages/RECOVERY_MANIFEST_2026-09-05.md`.

## Authority and boundary

This proposal derives only from `R&E-V0-SMARTPHONE-0.3.0`, with secondary rules in `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0` and exact secondary cases in `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0`. Source packages remain immutable. Their terminal-LF history is unresolved; the directly verified Git serializations are the provenance baseline for this repository and are not represented as historical native-byte proof.

All climate values use `kg CO2e`, `GWP100`, with source-specific conventions retained. Direct prospective results begin at the decision date. Historical manufacture of the already-owned phone is displayed as history and excluded from prospective keep/repair totals. Results compare equivalent adequate service over one common user-supplied horizon `H`; the permitted 3-year default is a `PROVISIONAL_MODEL_DEFAULT`, never a scientific fact. Unknown service, events, parameters and burdens remain unknown or insufficient; they never become zero.

## Core pathway accounting

| Pathway | Direct prospective result |
| --- | --- |
| Keep | `C_use(existing,H) + future supported repairs within H + EOL only if it occurs within H` |
| Repair | `C_repair_now + C_use(existing,H) + future supported repairs within H + EOL only if it occurs within H` |
| New | `C_production + C_distribution + C_use(new,H) + EOL if within H + old-device fate event` |
| Refurbished | Separate direct/cut-off and lifecycle-attributed accounting objects; never sum them |
| Used/second-hand | Separate empirical pathway; see `SECONDARY_PATHWAYS_V0.md` |

Charging is `E_charge × H × CI_grid`. Approved product-class fallback: central 4 kWh/year, sensitivity 2–8 kWh/year, moderate confidence. Network/data-centre impacts are excluded from handset replacement. If no approved relevant grid factor exists, charging carbon remains unknown or omitted.

## Values, statuses and constraints

- Generic new production: 25–70 kg CO2e/device, `APPROVED_V0_FALLBACK`, heterogeneous LCA bracket, moderate confidence. A 40 kg central visual is `PROVISIONAL_SCENARIO_VALUE`, never an average smartphone.
- Generic finished-device distribution: 2–4 kg CO2e/device, `APPROVED_V0_FALLBACK`; prefer applicable model-specific values.
- Battery repair: 0.3–0.7 kg CO2e; display repair: 3–8 kg CO2e. Both are `PROVISIONAL_GENERIC_RANGE`, modelling brackets rather than confidence intervals.
- No generic major-board footprint is approved. For Fairphone 5 only: PCBA full module DIY 17.840, repair-centre 17.909, board-level part repair-centre 6.959 kg CO2e.
- Fairphone 5, three-year cradle-to-grave: total 42.10; production 32.70; transport 2.81; use 6.59; EOL 0.041 kg CO2e, `APPROVED_MODEL_SPECIFIC`.
- Samsung Galaxy S25 EUR: total 45.7 kg CO2e, with derived approximate production 40.22, distribution 2.38, use 2.97 and disposal 0.14; `APPROVED_MODEL_SPECIFIC`, manufacturer report, rounding uncertainty retained.
- iPhone 16 128 GB: total 56.0 kg CO2e; derived production about 44.8, transport about 1.68, use about 10.08, EOL below 0.56; three-year first-owner model-specific report. Do not transfer to other storage configurations.

## Refurbished accounting

The direct/cut-off ADEME reference is 7.61 kg CO2e for its two-year refurbished reference scenario. It is `APPROVED_SOURCE_SPECIFIC_REFERENCE`, opaque, non-decomposable, not universal and never a default. Its paired new-phone reference is 85.2 kg CO2e for three years; do not compare unequal service horizons.

Lifecycle-attributed/depreciation accounting may be explained but has `METHODOLOGY_APPROVED / NUMERIC_IMPLEMENTATION_NOT_APPROVED`: the allocation function remains unresolved. Never add a separately calculated refurbishment burden to 7.61 or mix cut-off and depreciation totals. See the secondary contract for arbitrary-refurbished and used-pathway rules.

## Old-device fate, waste, materials and water

Allowed old-device fate values: `continue_use`, `sell_or_gift_for_reuse`, `trade_in_unknown_next_use`, `store_in_drawer`, `formal_recycling`, `discard_general_waste`, `unknown`. Reuse is not immediate e-waste; trade-in next use, disposal and recycling remain uncertain unless evidenced. No 1:1 avoided-production credit is allowed. Global e-waste collection rates are context, not individual probability.

Quantify discarded hardware mass only when exact device/component mass and actual discard/recycling route are known. Do not call phone mass “e-waste avoided” without an explicit counterfactual. New-device materials may be described as additional processed-material demand, with primary/recycled feedstock uncertainty; do not add mining carbon already included in product LCA. Model-specific water indicators require their source’s indicator, unit, boundary and method. Generic litres per phone and drinking-water-denial claims are unsupported.

## Conditional pathways and prohibited outputs

`SP-PATH-CLIMATE-001`, `SP-PATH-MINING-ECO-001`, `SP-PATH-MINING-PEOPLE-001`, `SP-PATH-EWASTE-PEOPLE-001`, `SP-PATH-EWASTE-ECO-001`, and `SP-PATH-WATER-001` are recorded in the claim registry with source IDs, scope, confidence, conditions and attribution limits. They may explain conditional pressure-to-outcome pathways. They never establish harm to a named person, species, place or event from one phone.

Unsupported outputs: victims/deaths caused or avoided; biodiversity area/species loss; litres of drinking water denied; fixed primary ore per arbitrary phone; an exact second-hand displacement credit; an exact individual human/ecological damage value; and unified environmental or moral scores.

Every displayed estimate retains value/range, unit, source scope, model-specific/fallback status, confidence and major assumptions. Keep climate, materials, water, waste, people and ecosystems distinct.

## Source and derivation mapping

Core package sections A–F supply boundary, equations, pathway, fate, waste/material/water rules; sections G–J supply record schema, claims, uncertainty and user-facing limits; section K supplies hard prohibitions. Sections C and provenance S1–S12 supply model-specific values and source records. `SECONDARY_PATHWAYS_V0.md` derives the split secondary pathways; `REGRESSION_INVARIANTS_V0.md` imports their exact case contract. Claim/source records retain package provenance and do not invent bibliographic metadata beyond the package.
