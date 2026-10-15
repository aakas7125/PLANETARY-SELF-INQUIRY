# HQ-RE-2026-10-15-002 — Evidence presentation map and AP consequence interface

**Issue:** #146  
**Task ID:** `HQ-RE-2026-10-15-002`  
**Workstream:** Research & Evidence  
**Execution class:** Tier 3 — empirical / product implementation handoff reconciliation  
**Branch:** `research/hq-re-2026-10-15-002-evidence-presentation-map`  
**Starting main from Issue:** `662c23b31a9177468ba5715f9af9a29fabb02719`  
**Accepted production baseline inspected:** `1a2008ca71d9edbb7924af2488d0cebe71cd9424` (#144 / PR #147 merged)  
**Status:** specialist implementation handoff only; not integrated product acceptance  
**Self-merge:** NO

## 1. Scope and result

This handoff finalizes the three bounded items requested by Issue #146:

1. an exact lifecycle-presentation evidence map for the eight already-proposed stages;
2. a field-by-field runtime transcription plan for the three already-accepted exact model/configuration records;
3. the Research-owned empirical projection that AP #145 may consume for the already-accepted generic-new manufacturing → Climate Impact subset.

No new generic value, scientific claim, harm model, AP wording, model fuzzy-match rule, registry authority, source-package edit, app implementation, integrated contract or immutable provenance package is created here.

The task reuses #140 and the accepted #144 production bridge. It does not restart or broaden #144.

## 2. Source pins and accepted baseline

### 2.1 Canonical Research authority

- `contracts/EMPIRICAL_SMARTPHONE_V0.md`
  - Core pathway accounting
  - Values, statuses and constraints
  - Refurbished accounting
  - Old-device fate, waste, materials and water
  - Conditional pathways and prohibited outputs
  - Source and derivation mapping
- `contracts/USER_INPUT_MODEL_V0.md`
  - raw user facts authoritative;
  - unknown ≠ zero/false;
  - unknown remaining service has no three-year fallback;
  - model/age cannot determine adequacy or remaining service.
- `contracts/SECONDARY_PATHWAYS_V0.md`
  - used/refurbished split;
  - direct cut-off prospective accounting;
  - arbitrary used/refurbished direct burdens remain null absent evidence;
  - ADEME 7.61 kg CO₂e is source-specific, two-year, opaque and never a default.
- `provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md`
  - §B1 charging/use
  - §B3 repair
  - §B4 buy new
  - §C model-specific climate overrides
  - §D old-device fate
  - §E waste
  - §F materials and water
  - §H conditional pathway claims
  - provenance registry S1–S12
- `evidence/CLAIM_REGISTRY.json`
- `evidence/SOURCE_REGISTRY.json`
- `evidence/model-specific/README.md` — currently no runtime model-specific records imported.

Accepted empirical claim/package version used below:

`024a95392d2e1555a3c9b598fdc291bd341c3d6b`

### 2.2 Production baseline after #144

At `1a2008ca71d9edbb7924af2488d0cebe71cd9424`:

- `smartphone-situation.tsx` calls `impactContextFromComparison(comparisonView, { comparisonEntered })`;
- `impact-pathways-ux.mjs` derives a strict `manufacturingBasis` only from the current evaluated `new` card;
- the basis requires `replacement.new.production_CO2e_kg = [25,70]`, `provenance_scope = generic_fallback`, no model-specific primary source, and the same displayed Production value;
- if the parallel numeric channel exists it must agree;
- climate receives only `scenario_produces_ghg_emissions=true`;
- mining and e-waste resolver conditions remain unset;
- water remains its existing generic qualitative context;
- no `independently_supported`, `support_status` or `extent` fields exist yet;
- Otherness therefore remains closed from this bridge.

The returned #144 regression file explicitly rejects label-only, number-only, absent/unknown/malformed production, distribution-only, synthetic model markers, repair-only, historic owned production, stale/deselected alternatives and upstream-reset state.

---

# TABLE A — lifecycle presentation map

## 3. Public-presentation rule

Lifecycle cards are educational evidence presentation, not a disaggregated calculator.

A permanent public boundary should accompany the journey:

> **These stages show where smartphone impacts can arise. They are not additive shares of one phone’s footprint unless an accepted source explicitly provides compatible stage values.**

Each stage should expose:

- **What we know generally** — accepted product/process evidence;
- **What we know about this phone** — exact matched/case evidence or “not known”;
- **Source and limits** — accepted source ID/package scope/status;
- optional **Explore further** link.

Generic education does not establish a personal consequence and cannot itself open the AP evidence gate.

## 4. Eight-stage exact map

| Stage | Minimal public wording | Accepted basis | Status / scope / uncertainty | “This phone” boundary | Optional explainer |
|---|---|---|---|---|---|
| **1. Raw materials** | **“A new phone creates demand for processed materials. That supply can include primary and recycled feedstock.”** | S1; `R&E-V0-SMARTPHONE-0.3.0 §F Materials`; `EMPIRICAL_SMARTPHONE_V0 §Old-device fate, waste, materials and water` | Approved generic process statement. Primary/recycled share is unknown for an arbitrary phone. | Do not state mine, ore grade, primary-mined mass, habitat area or exact recycled share unless an accepted exact record supplies it. Model identity alone does not establish primary extraction. | Fairphone 5 LCA as a **model-specific manufacturer-commissioned worked example**, not generic authority: https://www.fairphone.com/wp-content/uploads/2024/09/Fairphone5_LCA_Report_2024.pdf |
| **2. Refining / processing** | **“Raw-material extraction and processing sit inside the manufacturing boundary used by the accepted smartphone LCA evidence.”** | S1; source package §B4 and §F; source package states manufacturing includes extraction/processing, parts manufacture and assembly. | Approved boundary statement; no generic refining-only carbon share is accepted. | No facility, process chemistry, electricity mix, geography or stage subtotal may be inferred for this phone. | Fairphone 5 LCA, same limitations as above. |
| **3. Components** | **“Component and parts manufacture is part of the production footprint. We do not have a supported generic component-by-component split.”** | S1; source package §B4; `EMPIRICAL_SMARTPHONE_V0 §Values, statuses and constraints`. | Approved production-boundary statement; component allocation unavailable generically. Battery/display repair burdens are separate intervention records, not a decomposition of original production. | Do not allocate the 25–70 kg bracket to chip, display, battery or camera by guessed percentages. | Fairphone 5 LCA, model-specific worked example only. |
| **4. Assembly** | **“Assembly is included in the accepted manufacturing boundary. No separate generic assembly footprint is assigned here.”** | S1; source package §B4 and §F. | Approved boundary statement; assembly-only value unavailable. | No subtraction-derived or guessed assembly subtotal. | Fairphone 5 LCA, model-specific worked example only. |
| **5. Distribution / transport** | **“For a generic new phone, finished-device distribution is represented by an approved 2–4 kg CO₂e fallback range when no applicable exact model record is available.”** | S1/package provenance; source package §B4 “Generic finished-device distribution”; `EMPIRICAL_SMARTPHONE_V0 §Values`. | `APPROVED_V0_FALLBACK`, moderate confidence; model-specific source phase preferred when applicable. | The exact route, mode and distance for this phone remain unknown unless sourced. “Transport” and “distribution” retain the source’s own phase label/boundary. | No separate explainer required. |
| **6. Use and repair** | **“Charging energy depends on use. V0 uses 4 kWh/year as a central product-class fallback with a 2–8 kWh/year sensitivity; charging carbon stays unknown without an approved relevant grid factor. Supported battery/display repair ranges apply only to their stated repair scenarios.”** | S1; source package §B1 and §B3; `EMPIRICAL_SMARTPHONE_V0 §Core pathway accounting / Values`; S2 for Fairphone 5 exact repair overrides. | Charging: `APPROVED_V0_FALLBACK`, moderate confidence. Battery 0.3–0.7 and display 3–8 kg CO₂e: `PROVISIONAL_GENERIC_RANGE`. | Actual charging, grid factor, repair type, repair timing, success and post-repair service remain user/case facts. No silent 3-year service default. | European Commission smartphones/tablets page — **institutional/regulatory**, useful for durability, battery-cycle, repair/spares/update context, not a footprint dataset: https://energy-efficient-products.ec.europa.eu/product-list/smartphones-and-tablets_en |
| **7. Resale / refurbishment / second life** | **“Used and refurbished phones are different second-life pathways. Earlier manufacture stays a prior-life burden in the primary direct/cut-off view; it is not an avoided-new-phone credit. An arbitrary used or refurbished phone has no approved generic acquisition footprint.”** | S5, S6; `SECONDARY_PATHWAYS_V0 §§Pathway split, Used, Refurbished`; source package §B5. | Accepted secondary-pathway semantics. ADEME 7.61 kg CO₂e is `APPROVED_SOURCE_SPECIFIC_REFERENCE`, two-year, opaque, not a generic fallback. | Candidate service, refurbishment process, shipping/preparation and market displacement remain unknown unless supported. | Fairphone 5 LCA may illustrate repair/lifetime mechanics, but not generic refurbishment. |
| **8. End of life** | **“Global e-waste figures are context, not the fate of this phone. A phone’s actual route and handling stay unknown unless established. Unsafe or unsound handling pathways are conditional.”** | S7 for global context; S11 human-health pathway; S12 environmental contamination pathway; source package §D, §E and §H; `EMPIRICAL_SMARTPHONE_V0 §Old-device fate, waste, materials and water`. | Global context + conditional pathways. Exact individual route/probability is not established by global collection rates. | Do not infer informal handling, dumpsite, recycling probability, victim, site or pollution quantity. Quantify discarded mass only with exact mass plus actual route. | ITU/UNITAR Global E-waste Monitor 2024 — **institutional/global statistics**, not individual fate: https://www.itu.int/pub/D-GEN-E_WASTE.01-2024 . WHO e-waste health explainer — **international public-health institution**, conditional unsafe-handling context, not this phone’s fate: https://www.who.int/news-room/questions-and-answers/item/children-and-digital-dumpsites-e-waste-and-health |

### 4.1 Double-counting and presentation invariants

The following are mandatory:

- the generic 25–70 kg CO₂e production range already includes upstream raw-material extraction/processing, parts manufacture and assembly under its source boundary;
- raw-material, processing, components and assembly cards therefore explain pathways and boundaries; they do not add carbon to the product production value;
- model-specific lifecycle totals are shown separately from overlapping phase values;
- no total is calculated by adding a whole-life total to production/transport/use/EOL phases;
- no generic ore mass, primary-mined mass, litres/device, victims, biodiversity loss, recycling credit, displacement credit or unified harm score;
- “I don’t know / use generic smartphone” still receives useful generic education where approved;
- generic education remains visible even when a complete prospective comparison is impossible.

---

# TABLE B — exact model-record encoding

## 5. Controlled identity choice

HQ has settled the V0 control:

- optional controlled list containing only already-accepted exact model/configuration records;
- explicit **“I don’t know / use generic smartphone evidence”** route;
- no fuzzy matching.

Research proposes three runtime IDs only as implementation identifiers, not new scientific authority:

- `MS-CLIMATE-FAIRPHONE5-S2-V0`
- `MS-CLIMATE-GALAXY-S25-EUR-S3-V0`
- `MS-CLIMATE-IPHONE16-128GB-S4-V0`

The canonical values remain in the existing contract/source package.

## 6. Canonical-to-runtime transcription

| Runtime field | Fairphone 5 | Galaxy S25 EUR | iPhone 16 128 GB |
|---|---|---|---|
| `record_id` | `MS-CLIMATE-FAIRPHONE5-S2-V0` | `MS-CLIMATE-GALAXY-S25-EUR-S3-V0` | `MS-CLIMATE-IPHONE16-128GB-S4-V0` |
| `source_id` | S2 | S3 | S4 |
| `source_year` | 2024 | 2025 | 2024 |
| `source_provenance` | Fraunhofer IZM LCA, commissioned by Fairphone B.V. | Samsung manufacturer product environmental report | Apple manufacturer product environmental report |
| `status` | `APPROVED_MODEL_SPECIFIC` | `APPROVED_MODEL_SPECIFIC` | `APPROVED_MODEL_SPECIFIC` |
| `manufacturer` | Fairphone | Samsung | Apple |
| `model` | Fairphone 5 | Galaxy S25 | iPhone 16 |
| `configuration` | exact model; no additional configuration restriction recorded in accepted package | EUR configuration; storage configuration not recorded in accepted package | 128 GB only |
| `region` | not separately constrained in accepted package | EUR | not separately constrained in accepted package |
| `metric` | GWP100 / kg CO₂e per accepted package convention | GWP100 / kg CO₂e per accepted package convention | GWP100 / kg CO₂e per accepted package convention |
| `boundary` | cradle-to-grave | manufacturer lifecycle-carbon report; exact detailed boundary beyond accepted package metadata not invented | manufacturer ISO-based product footprint; first-owner model |
| `source_use_period_years` | 3 | **unknown in accepted package metadata** | 3 |
| `total_lifecycle_CO2e_kg` | 42.10 — source-reported | 45.7 — source-reported | 56.0 — source-reported |
| `production_CO2e_kg` | 32.70 — source-reported | ≈40.22 — derived from 88.0% share × 45.7 | ≈44.8 — derived from 80% share × 56.0 |
| `distribution_or_transport_CO2e_kg` | 2.81, source phase label **transport**, source-reported | ≈2.38, source phase label **distribution**, derived from 5.2% × 45.7 | ≈1.68, source phase label **transportation**, derived from 3% × 56.0 |
| `use_phase_CO2e_kg` | 6.59 over source 3-year functional unit — source-reported | ≈2.97 — derived from 6.5% × 45.7; accepted package does not record use-period years | ≈10.08 over source 3-year first-owner model — derived from 18% × 56.0 |
| `eol_CO2e_kg` | 0.041 — source-reported | ≈0.14 — derived from 0.3% × 45.7 | <0.56 — upper bound derived from <1% × 56.0 |
| `derived_values` | false for listed lifecycle values | true for phase kg values; total/shares are source-reported | true for phase kg values; total/shares are source-reported |
| `rounding_or_bound` | preserve supplied precision; do not manufacture extra digits | `rounding_uncertainty=true`; keep approximate symbol/status | phase kg approximate; EOL is an inequality, not 0.56 exact |
| `water_indicator_record` | unavailable in accepted runtime contract/package transcription: package only permits retaining properly defined model-specific indicators but does not encode an exact numeric Fairphone water record here | unavailable | unavailable |
| `generic_major_board_override` | no generic value; exact Fairphone 5 repair records exist separately | none | none |

Canonical source:
- `R&E-V0-SMARTPHONE-0.3.0 §C`;
- `EMPIRICAL_SMARTPHONE_V0 §Values, statuses and constraints`;
- S2/S3/S4 in `SOURCE_REGISTRY.json`.

## 7. Fairphone 5 repair sub-records

These are accepted exact model/scenario overrides and should be encoded separately from lifecycle phase values:

| Proposed runtime field | Value kg CO₂e | Source/status | Applicability |
|---|---:|---|---|
| `repair.battery.diy` | 0.568 | S2 / `APPROVED_MODEL_SPECIFIC` | Fairphone 5 battery, DIY scenario |
| `repair.battery.repair_center` | 0.617 | S2 / `APPROVED_MODEL_SPECIFIC` | Fairphone 5 battery, repair-centre scenario |
| `repair.display.diy` | 7.431 | S2 / `APPROVED_MODEL_SPECIFIC` | Fairphone 5 display module, DIY |
| `repair.display.repair_center` | 7.493 | S2 / `APPROVED_MODEL_SPECIFIC` | Fairphone 5 display module, repair-centre |
| `repair.primary_pcba.full_module_diy` | 17.840 | S2 / `APPROVED_MODEL_SPECIFIC` | Fairphone 5 only |
| `repair.primary_pcba.full_module_repair_center` | 17.909 | S2 / `APPROVED_MODEL_SPECIFIC` | Fairphone 5 only |
| `repair.primary_pcba.board_level_part_repair_center` | 6.959 | S2 / `APPROVED_MODEL_SPECIFIC` | Fairphone 5 only |

The source package states that these repair overheads include the source-defined module/part production plus relevant additional transport and EOL activities. They must not be decomposed further without source support.

## 8. Runtime substitution permissions

### 8.1 Candidate new phone

For an **exact controlled match**:

- model-specific **production** may replace generic 25–70 production;
- the source-defined **transport/distribution phase** may replace the generic 2–4 finished-device distribution fallback, while preserving the source phase label and boundary;
- the record remains exact-model/configuration scoped.

For no match / unsupported / ambiguous configuration:

- no exact-model claim;
- approved generic production/distribution fallbacks remain available;
- exact model text, if separately retained, must not be used as scientific authority.

### 8.2 Fields stored for reference but not substituted into the explicit user horizon

The following MUST NOT be scaled, annualized, prorated or substituted into the user’s explicit adequate-service horizon merely because the model matches:

- `total_lifecycle_CO2e_kg`;
- Fairphone `use_3y`;
- iPhone `use_3y`;
- Samsung `use_phase_CO2e_kg` because the accepted package does not preserve a use-period duration;
- lifecycle EOL phase values.

They may be displayed as **source-model reference values** with their source boundary/time assumptions.

A later calculator change would require a separately accepted method for mapping source use/EOL assumptions into the user’s explicit prospective service sequence. This task does not provide that method.

### 8.3 Current owned phone

If the current owned phone exactly matches one of these records:

- its production/lifecycle record may be shown as **historical model context**;
- historical production remains excluded from prospective keep/repair totals;
- it cannot create avoided-production credit.

### 8.4 Identity does not determine decision facts

Model identity must not determine:

- safety or adequacy;
- remaining service;
- support adequacy unless a separately accepted support record is explicitly integrated;
- repair need;
- user motive/desire;
- AP interpretation;
- old-device fate;
- final choice;
- market displacement.

## 9. Small runtime-data encoding plan

A future Tier-2 implementation may add one read-only runtime data module/file containing only the three records above and Fairphone repair sub-records.

Requirements:

1. values transcribed from canonical contract/source package only;
2. every record pins `source_id`, package commit, status, boundary/configuration and derived/rounding metadata;
3. deterministic controlled match only;
4. no accepted-registry or immutable-package mutation required;
5. no fuzzy aliases beyond explicit UI labels accepted by HQ;
6. unsupported configuration → generic route, not nearest-model substitution;
7. tests assert exact bytes/numbers/inequalities and that whole-life/use/EOL fields are not fed into the explicit user horizon.

The existing `evidence/model-specific/README.md` gap is therefore a runtime-encoding gap, not a scientific-evidence gap.

---

# TABLE C — AP-facing consequence projection

## 10. Exact empirical case in scope

This table covers only the subset already accepted and implemented in #144:

**current evaluated generic-new alternative → accepted generic manufacturing production record → existing Climate Impact resolver**

It does not authorize repair/use/distribution-only propagation, model-specific propagation, mining/e-waste propagation or generic-water gating.

## 11. Current accepted producer shape

The accepted #144 `manufacturingBasis` is:

```text
{
  pathwayId: "new",
  scenarioRef: "replacement.new",
  field: "production_CO2e_kg",
  valueRange: [25, 70],
  unit: "kg CO2e",
  provenanceScope: "generic_fallback",
  acceptedFallbackStatus: "APPROVED_V0_FALLBACK",
  contractRef: "EMPIRICAL_SMARTPHONE_V0",
  claimId: "SP-PATH-CLIMATE-001",
  claimVersion: "024a95392d2e1555a3c9b598fdc291bd341c3d6b",
  prospective: true
}
```

This exists only when:

- exactly one current `new` comparison card is present;
- the evaluator’s `replacement.new` contains the accepted [25,70] production record with `generic_fallback` scope;
- no model-specific primary climate source is present;
- the displayed Production value is the same accepted range;
- any parallel production value agrees.

The climate resolver then emits the exact accepted claim:

> Manufacturing-related smartphone GHG emissions contribute incrementally to climate change; climate change increases risks to people and ecosystems.

Claim/source authority:

- claim `SP-PATH-CLIMATE-001`;
- version/package commit `024a95392d2e1555a3c9b598fdc291bd341c3d6b`;
- S1 — smartphone manufacturing LCA evidence;
- S8 — cumulative CO₂ → warming;
- S9 — climate impacts on people/ecosystems and interdependence;
- evidence scope: product class + global assessment;
- attribution: pressure-to-outcome only;
- no named person/species/place/event, victim count or exact individual damage.

## 12. Research-owned consequence record

Research proposes that a future Tier-2 projection derive the following object only from an actually displayed emitted climate domain that retains the exact accepted `manufacturingBasis` above:

```text
EmpiricalConsequenceRecord {
  consequence_ref_id:
    "SP-PATH-CLIMATE-001@024a95392d2e1555a3c9b598fdc291bd341c3d6b::replacement.new::production_CO2e_kg::generic_fallback"

  claim_id: "SP-PATH-CLIMATE-001"
  claim_version: "024a95392d2e1555a3c9b598fdc291bd341c3d6b"
  consequence_category: "climate"

  scenario_status: "modelled_alternative"
  actual_purchase_established: false
  actual_harm_event_established: false

  case_specificity: "condition_established_for_modelled_alternative"

  condition: {
    key: "scenario_produces_ghg_emissions"
    status: "established"
    basis_ref: "replacement.new.production_CO2e_kg"
    basis_kind: "accepted_generic_new_manufacturing_fallback"
  }

  displayed: true
  independently_supported: true
  support_status: "supported"

  extent: "beyond_immediate_circle"
  extent_semantics: "conditional_global_pathway_scope"

  gate_eligible: true

  source_ids: ["S1", "S8", "S9"]

  attribution_limits: [
    "pressure_to_outcome_only",
    "no_named_person_species_place_or_event_attribution",
    "no_victims_or_deaths_caused_or_avoided",
    "no_exact_individual_human_or_ecological_damage",
    "no_unified_environmental_safety_protect_four_or_moral_score",
    "conditional_pathway_is_not_causal_proof"
  ]
}
```

### 12.1 Meaning of `independently_supported=true`

It means:

- the empirical condition basis comes from accepted Research authority, not AP/user prose;
- the emitted climate claim passes the frozen claim/source authority boundary;
- support is traceable to S1/S8/S9 and the accepted generic production record.

It does **not** mean:
- an actual purchase has occurred;
- a specific person/ecosystem has been harmed;
- every source is independent of all manufacturers in a general-purpose evidentiary sense;
- AP independently verified the science.

### 12.2 Meaning of `support_status=supported`

It means the exact conditional pathway is supported for the exact modelled alternative because:

1. the current comparison carries the accepted positive generic production record;
2. the existing climate resolver condition is therefore established;
3. the exact frozen climate claim/version/source set emits.

It is not a statement that an actual realized harm event has been observed.

## 13. Extent derivation

Research can support:

`extent = "beyond_immediate_circle"`

**only with the explicit semantic definition**:

`extent_semantics = "conditional_global_pathway_scope"`

Basis:

- the accepted claim is scoped to `product_class` + `global_assessment`;
- S8 supports cumulative CO₂ → warming;
- S9 supports climate impacts on people/ecosystems and interdependence;
- the claim itself states that climate change increases risks to people and ecosystems;
- therefore the supported conditional pathway is not confined to the user or their immediate circle.

This field does **not** establish:

- a named target;
- a location;
- an affected population count;
- that the user bought the phone;
- that one phone caused a particular harm;
- that harm has already occurred;
- user responsibility, blame or guilt.

### 13.1 Cross-domain condition for AP #145

Research agrees that AP may consume `extent=beyond_immediate_circle` **only if AP treats it as the scope of the supported conditional/modelled pathway, not as proof of a realized consequence**.

If the AP gate or public anchor instead interprets `extent` as “a specific harm actually occurred beyond your circle,” then Research does **not** support setting the field and the gate must stay closed.

AP therefore needs wording that anchors to a **modelled compared alternative / supported pathway**, not “the harm that happened” or “what your purchase caused.”

Research does not author the AP wording.

## 14. AP-facing projection

The smallest AP-facing projection of an eligible Research record is:

```text
system_participation_evidence {
  consequence_ref_id
  claim_id
  claim_version
  displayed: true
  independently_supported: true
  support_status: "supported"
  extent: "beyond_immediate_circle"
  consequence_category: "climate"
  scenario_status: "modelled_alternative"
  actual_purchase_established: false
  actual_harm_event_established: false
  source_ids: ["S1", "S8", "S9"]
  attribution_limits: [...]
}
```

AP may consume this record; AP may not manufacture or override it.

## 15. Explicit non-qualifying records

### Generic water

Current water output remains:

- qualitative product-class/model-specific context;
- not attributable to an arbitrary device;
- local consequences depend on geography and indicator;
- no accepted personal/local quantitative consequence.

Therefore:

```text
gate_eligible = false
extent = unknown
```

It may remain visible educationally.

### Mining / ecosystems

Generic new production does not establish:

`relevant_primary_metal_extraction_occurs=true`

because primary vs recycled feedstock is unresolved.

No AP-facing consequence record.

### Mining / people

Model/new-phone identity does not establish relevant supply-chain geography/process.

No AP-facing consequence record.

### E-waste / people and ecosystems

Replacement/fate/global context does not establish unsafe/informal handling or unsound-site handling.

No AP-facing consequence record.

### Deferred climate cases

Repair-only, charging/use-only, distribution-only and model-specific climate projection are outside #146 table C and remain deferred.

## 16. Positive / negative / invalidation examples

| Case | Accepted producer state | Research projection |
|---|---|---|
| **C-01 qualifying generic new** | Current evaluated `new` card; exact accepted [25,70] generic production in evaluator + display; Climate card emitted | Create eligible climate consequence record; modelled alternative; no actual purchase/harm; conditional-global extent |
| **C-02 service facts incomplete** | Comparison still evaluated; production record remains accepted; ranking incomplete | Consequence projection may remain eligible because the narrow climate condition is established; it must not fill service facts or produce ranking |
| **C-03 label only** | “Buy a new phone” label without authoritative card record | No condition, no consequence projection |
| **C-04 number only** | Caller object containing [25,70] but no evaluator/provenance/display agreement | No projection |
| **C-05 synthetic model marker** | `approved_registry_match` or other synthetic marker without accepted runtime model record | No projection |
| **C-06 distribution only** | Distribution value present, qualifying production record absent | No projection in this task |
| **C-07 repair only** | Battery/display repair burden only | No projection in this task |
| **C-08 current-owned historical production** | Historical model production context | No prospective climate consequence basis |
| **C-09 generic water displayed** | Water qualitative card | Educational only; no AP consequence projection |
| **C-10 mining/e-waste unknown** | Resolver conditions not independently established | No projection |
| **C-11 new alternative deselected** | Current cards no longer contain qualifying `new` record | Projection removed; downstream AP state must invalidate |
| **C-12 horizon cleared / comparison not evaluated** | `comparisonEvaluated=false` | No current projection |
| **C-13 upstream situation/inquiry reset/edit** | Existing comparison/Impact state cleared | Consequence reference removed; downstream system-participation/Otherness presentation must clear |
| **C-14 valid re-evaluation** | Qualifying new record returns after valid current evaluation | A new current consequence record may be produced; stale reference must not be reused silently |

## 17. Focused future Tier-2 slices

### R2-1 — lifecycle presentation

Implement Table A only:

- static/accepted generic evidence cards;
- generic vs “this phone” separation;
- source/status/uncertainty display;
- four already-verified optional explainers;
- no calculator change;
- no AP gate effect.

### R2-2 — controlled model runtime records

Implement Table B:

- three exact records + Fairphone repair sub-records;
- controlled list + generic route;
- exact deterministic matching;
- model-specific production/transport-distribution substitution only where allowed;
- totals/use/EOL reference-only, not horizon-scaled;
- historical current-phone manufacture remains sunk.

### R2-3 — Research consequence projection

Implement Table C after HQ/AP reconciliation:

- derive projection only from the accepted #144 manufacturing basis + emitted exact climate claim;
- add Research-owned support/status/extent semantics;
- no repair/use/distribution/model-specific expansion;
- generic water/mining/e-waste remain non-gate-eligible;
- edit/reset invalidation.

### AP implementation dependency

AP #145 owns:
- public anchor/question wording;
- skip/back/continue behavior;
- raw reflection state;
- interpretation of the Research record in the project inquiry.

Research owns only the empirical record.

## 18. Remaining decisions / discrepancies

### Settled in #146

- controlled exact-model list + explicit generic route;
- no fuzzy matching;
- model identity does not determine adequacy/AP/final choice;
- exact model production and source-defined transport/distribution may replace corresponding generic fallbacks for a matched **candidate new** phone;
- whole-life/use/EOL phase values are not scaled into the explicit user horizon by this design;
- generic lifecycle education remains independent of case-specific resolver gates;
- generic water/mining/e-waste context cannot open AP gate;
- generic-new manufacturing climate record can support an AP-facing conditional pathway reference under the exact semantics above.

### Cross-domain item for #145

AP must confirm that its gate/public wording consumes **conditional global pathway scope for a modelled alternative**, not a realized harm event.

If AP requires realized actual harm, the current evidence is insufficient and the AP gate remains closed.

This is a semantic interface question, not a missing Research source.

### No Owner decision required from Research

No new Owner decision is necessary for the empirical map itself. HQ/AP reconciliation is sufficient unless AP chooses a product meaning for `extent` that exceeds the empirical definition above.

## 19. Validation

Validation performed against accepted repository state:

- Issue #146 identity/status/branch checked before work;
- no matching #146 PR existed;
- #140 handoff re-used rather than repeated;
- canonical empirical/input/secondary contracts inspected;
- immutable 0.3.0 source package exact sections inspected;
- claim/source registries inspected;
- model-specific runtime directory confirmed empty except bootstrap README;
- accepted #144 production code inspected at `1a2008ca71d9edbb7924af2488d0cebe71cd9424`;
- #144 exact task regression patch inspected, including positive, negative and invalidation cases;
- AP #145 Issue/comments inspected; no AP return/PR existed at Research execution time;
- no application/source-package/contract/registry changes made.

No application test run is required for this Markdown-only specialist handoff; executable behavior is unchanged.

## 20. Return status

**Research result:** `VERIFIED_FOR_HQ_REVIEW`

Research recommends HQ review this map together with AP #145’s eventual return before issuing R2-3 / AP implementation. R2-1 and R2-2 are empirically separable once HQ accepts this map.

**Self-merge:** NO
