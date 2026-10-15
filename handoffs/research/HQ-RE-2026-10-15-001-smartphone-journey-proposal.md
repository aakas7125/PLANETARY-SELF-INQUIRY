# HQ-RE-2026-10-15-001 — Generic smartphone evidence, lifecycle journey and legitimate Impact propagation proposal

**Issue:** #140  
**Workstream:** Research & Evidence  
**Execution class:** Tier 3 — empirical / product-semantics proposal  
**Branch:** `research/hq-re-2026-10-15-001-smartphone-journey-proposal`  
**Starting main:** `a7c24939f9ef43f58c6854199d7e5282d1b6efb4`  
**Proposal status:** Research specialist proposal only; not accepted product behavior  
**Self-merge:** NO

## 1. Executive finding

The accepted repository already contains enough product-class evidence to show useful generic smartphone knowledge without pretending that the user's exact phone is known. The current comparison already exposes some of that evidence, especially the accepted generic new-phone production and distribution ranges. What is missing is an explicit evidence-layer model, a real approved-model lookup path, a compact lifecycle presentation, and a typed bridge that carries only condition-establishing empirical facts from comparison into Impact.

The most important propagation finding is asymmetric:

- **Climate can be propagated in bounded cases** when an authoritative comparison result contains a supported positive prospective GHG burden for the selected scenario, such as the generic new-phone production/distribution ranges or an applicable repair/refurbishment value. That establishes the accepted climate resolver condition `scenario_produces_ghg_emissions=true`; it does not establish a victim, location, avoided harm, or causal proof.
- **Mining/ecosystems cannot currently be propagated from generic new-phone production alone.** The accepted production footprint includes raw-material extraction/processing, but the specific resolver condition is that relevant **primary metal extraction occurs**. The accepted evidence explicitly leaves primary/recycled feedstock uncertain, so the condition remains unknown without additional authoritative material/supply evidence.
- **Mining/people cannot currently be propagated.** No current comparison or situation output establishes the relevant supply-chain geography/process.
- **E-waste/people and e-waste/ecosystems cannot currently be propagated.** A selected replacement, a discard label, or general e-waste context does not establish unsafe/informal handling or an unsound site.
- **Water may remain visible as generic product-class lifecycle context**, because the accepted water claim is qualitative, but current evidence does not establish a user-phone-specific local consequence or quantitative indicator. Generic water context must therefore be explicitly marked non-case-specific and ineligible to open the AP/Otherness evidence gate.

The current production bridge loses useful typed comparison facts: `SmartphoneSituation` passes only comparison labels into `describeImpact()`, while `impact-pathways-ux.mjs` resolves domain conditions only from explicit typed overrides. The labels are intentionally non-authoritative. This is correct fail-closed behavior, but it means legitimate climate facts never reach the resolver.

A second accepted-boundary mismatch exists downstream. `ap-otherness-ux.mjs` correctly requires an emitted empirical record to carry explicit support status, independent-support status and extent before it can become a consequence reference. Current Impact presentation records carry none of those gate fields, so the current Impact → Otherness production bridge cannot activate from the existing Impact domain cards. This proposal defines the empirical object needed to close that gap without weakening either resolver or AP gates.

## 2. Authorities and source pins examined

Repository baseline inspected at starting main `a7c24939f9ef43f58c6854199d7e5282d1b6efb4`.

Governance:
- `OWNER_CONTROL.md`
- `project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md`

Accepted contracts and immutable provenance:
- `contracts/EMPIRICAL_SMARTPHONE_V0.md`
- `contracts/USER_INPUT_MODEL_V0.md`
- `contracts/SECONDARY_PATHWAYS_V0.md`
- `contracts/REGRESSION_INVARIANTS_V0.md`
- `provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md`
- `provenance/source-packages/R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0.md`
- `provenance/source-packages/R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0.md`
- accepted empirical package/registry commit pin `024a95392d2e1555a3c9b598fdc291bd341c3d6b`

Registries:
- `evidence/CLAIM_REGISTRY.json`
- `evidence/SOURCE_REGISTRY.json`
- `evidence/model-specific/README.md`

Production implementation:
- `app/src/lib/smartphone/input-decision.mjs` (blob `2d8530e0d9c653f353b787b437c4c7bc1340f800`)
- `app/src/lib/smartphone/secondary-pathway.mjs` (blob `06f18c6dfbf91da10426568a7274eb0878b2c50f`)
- `app/src/lib/smartphone/comparison-ux.mjs` (blob `ebaa841aae9636d1ed591c20923730ef859511d8`)
- `app/src/lib/smartphone/impact-pathways-ux.mjs` (blob `ab4d7b378f3d4c2d96005ee2253e6fae71374a22`)
- empirical boundary modules for climate, mining/ecosystems, mining/people, e-waste/people, e-waste/ecosystems and water
- `app/src/lib/smartphone/ap-otherness.mjs`
- `app/src/lib/smartphone/ap-otherness-ux.mjs`
- `app/src/components/smartphone-situation.tsx`
- `app/src/components/smartphone-comparison.tsx`
- `app/src/components/smartphone-impact.tsx`
- `app/scripts/smartphone-comparison-ux.test.mjs`
- `app/scripts/smartphone-impact-pathways-ux.test.mjs`

Sibling AP proposal:
- Issue #139 / PR #142
- `handoffs/ap/HQ-AP-2026-10-15-001-system-participation-proposal.md`
- inspected AP proposal head: `aae18bcd1bcfd453095ba019cf87d7962a110378`

No accepted value, source package, registry, integrated contract or application code is changed by this proposal.

## 3. Accepted evidence layers

### 3.1 Layer G — generic/product-class knowledge

This layer answers: **What is defensible to say about smartphones as a product class even when the exact phone is unknown?**

It may contain accepted product-class fallback ranges, qualitative lifecycle pathways, methodology boundaries and global context. It must always retain status, scope, confidence and assumptions. It does not become a claim about the user's exact handset.

Accepted examples:

| Record | Accepted value / statement | Status / scope | Required qualification |
|---|---|---|---|
| New-phone production | 25–70 kg CO2e/device | `APPROVED_V0_FALLBACK`, heterogeneous LCA evidence bracket | not a distribution; 40 kg is not an average |
| Finished-device distribution | 2–4 kg CO2e/device | `APPROVED_V0_FALLBACK` | prefer applicable model-specific record |
| Charging electricity | 4 kWh/year central; 2–8 kWh/year sensitivity | approved product-class energy fallback | carbon stays unknown without approved relevant grid intensity |
| Battery replacement | 0.3–0.7 kg CO2e | `PROVISIONAL_GENERIC_RANGE` | scenario bracket, not statistical confidence interval |
| Full display replacement | 3–8 kg CO2e | `PROVISIONAL_GENERIC_RANGE` | scenario bracket, not statistical confidence interval |
| Generic used acquisition | no approved universal direct CO2e | unknown / qualitative only | no zero, no universal shipping factor |
| Generic arbitrary refurbished acquisition | no approved universal direct CO2e | unknown / qualitative only | ADEME 7.61 is not a fallback |
| Water | production can require substantial water use | approved qualitative product-class pathway | no generic litres/device; local consequences depend on geography and indicator |
| Mining/ecosystem pathway | metal extraction/processing can create land/water/biodiversity pressures | approved qualitative pathway | not attributable to an arbitrary phone or mine |
| Mining/people pathway | relevant mining/processing can expose workers/communities to hazards | qualitative conditional pathway | supply-chain geography/process must be established before case-specific emission |
| E-waste pathways | unsound/informal handling can harm people/ecosystems | conditional | the user's old phone route must not be inferred from global context |

Generic lifecycle knowledge may be shown even where a complete prospective comparison is impossible. It must be labelled **generic context**, not silently suppressed because exact model identity is unavailable.

### 3.2 Layer M — approved model-specific evidence

This layer answers: **Do we have an accepted record that exactly matches the identified product/configuration and relevant boundary?**

Existing canonical values include:

| Model / configuration | Accepted climate record | Boundary notes |
|---|---|---|
| Fairphone 5 | 42.10 kg CO2e total; 32.70 production; 2.81 transport; 6.59 use; 0.041 EOL | 3-year cradle-to-grave; Fraunhofer IZM; commissioned by Fairphone; repair overrides separately supported |
| Galaxy S25 EUR | 45.7 total; derived approx 40.22 production, 2.38 distribution, 2.97 use, 0.14 disposal | manufacturer environmental report; EUR configuration; derived shares retain rounding uncertainty |
| iPhone 16 128 GB | 56.0 total; approx 44.8 production, 1.68 transport, 10.08 use, EOL <0.56 | 3-year first-owner model; storage-specific; do not transfer to 256/512 GB |

**Repository discrepancy:** these model-specific values are accepted in the canonical contract/source package, but `evidence/model-specific/README.md` still states that no model-specific records were imported during the bootstrap. The running input evaluator therefore does not perform an actual product lookup. It recognizes only the synthetic value `approved_registry_match` as a marker. This is an implementation/data-encoding gap, not permission to invent a model registry in this Tier-3 task.

### 3.3 Layer C — case/user-specific decision facts

This layer answers: **What is actually known about this user's current/candidate phone and decision scenario?**

Examples include:
- safety/functions/support adequacy;
- expected remaining adequate service;
- repair type and expected post-repair service;
- used/refurbished expected adequate service;
- actual candidate model/configuration if supplied;
- actual old-device fate/route if supplied and supported;
- actual handling condition only when independently established;
- relevant grid factor only if an approved source exists.

Missing case facts remain unknown. Generic lifecycle knowledge can coexist with case uncertainty but may not fill it.

## 4. Proposed model identity and fallback contract

### 4.1 User-facing identity modes

Propose an optional identity input for the current phone and any candidate phone:

```text
device_identity {
  mode:
    exact_model |
    generic_smartphone |
    unknown

  manufacturer?       // literal user-supplied text or controlled selection
  model?              // literal user-supplied text or controlled selection
  configuration?      // storage/region only when relevant
}
```

The UI must offer an explicit route equivalent to:

**“I don’t know / use generic smartphone evidence.”**

No model identity should be required merely to enter comparison.

### 4.2 Lookup result

A future accepted lookup layer should return:

```text
model_evidence_match {
  status:
    approved_exact_match |
    no_approved_match |
    ambiguous_match |
    generic_route_selected

  record_id?
  model_scope?
  configuration_scope?
  source_ids[]
  applicable_fields[]
  unavailable_fields[]
}
```

Rules:

1. **Approved exact match:** use the model-specific value only for fields and boundaries actually supported by that record.
2. **No approved match:** retain the user's literal identity, explain that no approved exact record is available, and use an approved generic fallback only for fields where the canonical contract already permits it.
3. **Ambiguous match:** do not guess. Keep the exact field unresolved or ask for configuration only if the distinction materially changes the approved evidence.
4. **Generic route selected:** use approved product-class evidence with explicit `generic_fallback` / `generic_context` labeling.
5. A model match must never set adequacy, remaining service, repairability of the actual unit, AP interpretation, motive, desire legitimacy, purchase ranking or old-device fate.
6. Historical manufacture of the **current already-owned phone** remains historical context and must not be inserted into the forward-looking keep/repair total.

### 4.3 Semantic decision needed before implementation

HQ/Owner should decide whether V0 uses:
- a controlled list of only the currently accepted exact configurations; or
- free text plus deterministic exact matching.

Research recommends the smallest safe V0: **controlled accepted records + explicit generic/unknown route; no fuzzy matching.**

A bounded model-evidence registry can then encode already-accepted values without changing scientific semantics.

## 5. Accepted vs proposed behavior

| Area | Accepted/current behavior | Proposal |
|---|---|---|
| Generic new evidence | input evaluator uses 25–70 production and 2–4 distribution when new model is unknown | retain; expose as generic product-class evidence, never exact phone |
| Model-specific evidence | canonical values exist; production implementation has only `approved_registry_match` sentinel | add deterministic approved-record lookup in a later Tier-2 slice |
| Missing identity | comparison is not blocked | preserve |
| Used/refurb distinction | accepted and implemented | preserve |
| ADEME 7.61 | source-specific only | preserve; lifecycle journey may explain it but never use as arbitrary refurb value |
| Impact selection labels | labels shown; explicitly non-authoritative | preserve |
| Comparison → Impact facts | production passes labels only; condition-establishing facts are lost | later pass a typed empirical condition object, never prose labels |
| Climate Impact | resolver requires explicit scenario GHG condition | derive only from authoritative positive prospective GHG result |
| Mining Impact | strict explicit conditions | do not derive from generic new-production range |
| E-waste Impact | strict handling conditions | do not derive from replacement choice or fate label |
| Water Impact | generic qualitative card can emit | keep as `generic_context`; ineligible for AP evidence gate |
| Impact → Otherness | accepted AP gate requires support/extent fields, but current Impact records omit them | attach only Research-issued gate fields to qualifying case-specific consequence records |
| Lifecycle journey | no compact evidence journey | add generic/contextual journey with no invented stage allocation |

## 6. Current production bridge audit

### 6.1 Comparison output

`comparison-ux.mjs` retains complete evaluator `decision` objects inside each comparison card. For a generic new-phone selection, repository tests show the card can contain:
- production range 25–70 kg CO2e;
- distribution range 2–4 kg CO2e;
- `generic_fallback` scope;
- explicit “not an average” qualification.

Repair can similarly expose accepted battery/display ranges when repair type is explicitly supplied.

Used/refurbished pathways preserve qualitative/unknown state unless supported direct evidence is present.

### 6.2 Loss at the production call site

`smartphone-situation.tsx` calls Impact as:

```text
describeImpact(impact, {
  comparisonAvailable,
  comparisonEntered,
  comparisonEvaluated,
  inspectedPathways: comparisonView.cards.map(card => ({ label: card.label }))
})
```

No evaluator decision, value range, fate, process evidence or case condition is propagated. Therefore the resolver sees only its pinned claim identity/version/requested-output.

This is why:
- climate does not emit despite a displayed positive new-phone production range;
- mining does not emit;
- e-waste does not emit;
- water emits because its resolver is qualitative and does not require a case-specific condition.

This is a **bridge gap**, not a resolver defect. The resolver gates should remain strict.

### 6.3 Downstream AP gate gap

`ap-otherness-ux.mjs` accepts a presented Impact record only when it already contains:
- an explicit consequence reference or claim/version;
- `displayed=true`;
- `independently_supported` boolean;
- recognized `support_status`;
- explicit `extent`.

It explicitly refuses to infer extent from domain name, statement, attribution limits or source metadata.

Current `presentDomain()` output from Impact contains claim identity, emitted state, lines, conditions, limits and disclosure, but not independent-support status or extent. Consequently current displayed Impact records cannot become qualifying consequence references for Otherness.

That fail-closed behavior is scientifically safer than inventing the fields. Research should supply them only for condition-established case-specific records.

## 7. Propagation condition matrix

| Domain | Accepted resolver condition | Current authoritative comparison/situation basis | Current mapping | Proposed typed propagation | Gate status |
|---|---|---|---|---|---|
| Climate | `scenario_produces_ghg_emissions === true` | Supported positive prospective GHG value/range for the selected case can establish it. Generic-new production/distribution and supported repair ranges are examples. | Lost; only labels passed | Set true only from a supported **positive** prospective GHG record tied to selected pathway/scenario. Preserve source scope/status/value separately; do not copy the number into the qualitative claim. | Can become case-specific and gate-eligible when emitted |
| Mining / ecosystems | `relevant_primary_metal_extraction_occurs === true` | None in current comparison. Generic production includes material extraction/processing but primary vs recycled feedstock remains uncertain. | No mapping | Remain unknown. Future explicit accepted material/feedstock record may establish. | Not currently gate-eligible |
| Mining / people | `relevant_supply_chain_geography_process_established === true` | None. Model identity/new production does not establish geography/process. | No mapping | Remain unknown. Generic inferred geography/process is explicitly prohibited. | Not currently gate-eligible |
| E-waste / people | `unsafe_or_informal_handling_established === true` | None. Replacement choice and generic fate/context do not establish unsafe handling. | No mapping | Remain unknown unless an authoritative actual handling fact is supplied. | Not currently gate-eligible |
| E-waste / ecosystems | `unsound_site_handling_established === true` | None. Fate/context/source counts do not establish unsound site handling. | No mapping | Remain unknown unless an authoritative actual handling fact is supplied. | Not currently gate-eligible |
| Water | no case condition for qualitative product-class claim; quantitative/local consequence requires accepted model-specific water record not currently registered in production boundary | Accepted generic/product-class knowledge only | Emits qualitative card automatically | Label `generic_context`; do not create case-specific consequence or local outcome. Model-specific quantitative display requires a future accepted record/boundary. | Not gate-eligible from generic context |

### 7.1 Why climate propagation is legitimate

The climate claim condition is merely that the evaluated scenario produces GHG emissions. A supported positive prospective GHG range is direct empirical evidence of that condition.

The bridge must use a typed factual record, not:
- “new phone” label;
- user selection itself;
- public prose;
- a historical manufacture record of the already-owned phone.

A safe condition derivation example:

```text
comparison_fact {
  pathway_id: new
  field: production_CO2e_kg
  value_range: [25, 70]
  unit: kg_CO2e
  evidence_status: APPROVED_V0_FALLBACK
  prospective: true
  positive_burden_established: true
}
↓
resolver_condition {
  claim_id: SP-PATH-CLIMATE-001
  scenario_produces_ghg_emissions: true
  basis_ref: comparison_fact_ref
}
```

The climate pathway remains qualitative pressure-to-outcome; the 25–70 range stays on the comparison/lifecycle evidence layer. It must not be restated as “this phone caused X climate harm.”

### 7.2 Why generic production does not establish primary mining

The canonical production footprint includes raw-material extraction/processing, but the materials contract says a new phone creates demand for processed material supply that may be met by primary and/or recycled feedstock. Therefore:

```text
new production burden known
≠
primary extraction for this phone established
```

No automatic `relevant_primary_metal_extraction_occurs=true`.

### 7.3 Why a fate value is not unsafe handling

The e-waste resolvers explicitly reject using fate/context alone to establish unsafe/informal or unsound-site handling. Even an eventual discard event does not identify downstream handling. Formal recycling is affirmatively incompatible with inferring unsafe informal processing from the same record.

Therefore no production bridge should translate:
- `discard_general_waste`,
- `trade_in_unknown`,
- global 22.3% collection context,
- an e-waste pathway checkbox,

into the resolver condition.

## 8. Proposed empirical consequence interface

Research proposes a single typed object that can serve both Impact presentation and the AP proposal in Issue #139 without making AP infer evidence:

```text
EmpiricalConsequenceRecord {
  consequence_ref_id
  claim_id
  claim_version
  consequence_category:
    climate |
    mining_ecosystems |
    mining_people |
    ewaste_people |
    ewaste_ecosystems |
    water

  case_specificity:
    case_condition_established |
    generic_context

  condition {
    key
    status: established | unknown | not_established
    basis_refs[]
  }

  displayed: boolean
  independently_supported: boolean
  support_status: supported | unknown | missing | unsupported

  extent:
    beyond_immediate_circle |
    immediate_circle_only |
    unknown

  gate_eligible: boolean

  source_ids[]
  evidence_status
  evidence_scope[]
  attribution_limits[]
}
```

### 8.1 Gate-eligibility rule

`gate_eligible=true` only when all are true:

1. the accepted claim/version is exact;
2. its required case condition is established by authoritative typed evidence, not by label/prose;
3. the pathway is actually displayed;
4. independent support is present;
5. `support_status=supported`;
6. Research can explicitly support an extent value from the accepted empirical pathway;
7. attribution limits remain attached.

For the currently evidenced climate case, an emitted climate pathway can carry:

```text
case_specificity = case_condition_established
independently_supported = true
support_status = supported
extent = beyond_immediate_circle
gate_eligible = true
```

The `extent` does not identify a victim or location. It records only that the accepted global climate pressure-to-outcome pathway extends beyond the user's immediate circle.

For current generic water context:

```text
case_specificity = generic_context
extent = unknown
gate_eligible = false
```

### 8.2 Reconciliation with AP Issue #139

AP #139 proposed:

```text
system_participation_evidence {
  consequence_ref_id
  claim_id
  claim_version
  displayed
  independently_supported
  support_status
  extent
  consequence_category
  source_ids[]
  attribution_limits[]
}
```

Research accepts those fields as the **AP-facing projection** of `EmpiricalConsequenceRecord`.

Research additionally requires `case_specificity`, `condition` and `gate_eligible` on the empirical side so that:
- generic lifecycle context cannot masquerade as a case-specific consequence;
- the exact condition basis remains auditable;
- AP never derives empirical truth itself.

The AP-facing projection must be produced only when `gate_eligible=true`.

## 9. Representative repository traces

These traces reproduce accepted behavior visible in the current APIs/tests; they are not new runtime results.

### TRACE-01 — generic new comparison

Input shape:
- adequate situation facts;
- selected pathway `new`;
- explicit common horizon;
- no exact new-phone model.

Observed repository behavior:
- evaluator uses generic new production [25,70];
- evaluator uses generic distribution [2,4];
- comparison renders both as `generic_fallback`;
- comparison text states the bracket is not an average;
- no exact model is claimed.

Proposed propagation:
- climate condition: **established** from the positive supported prospective range;
- mining primary extraction: **unknown**;
- mining people geography/process: **unknown**;
- e-waste handling: **unknown**;
- water: generic context only.

### TRACE-02 — battery/display repair

Input shape:
- repair pathway;
- explicit battery or display repair type;
- supported expected post-repair service.

Observed:
- battery gets [0.3,0.7] or display [3,8], `PROVISIONAL_GENERIC_RANGE`.

Proposed:
- climate condition may be established from supported positive repair burden;
- do not infer primary mining, supply geography, waste handling or water consequence.

If repair service/next event is incomplete, comparison may remain insufficient; the existence of a positive repair burden can still establish the narrow climate-condition fact without creating a definitive ranking.

### TRACE-03 — generic used / refurbished

Observed:
- used and refurbished remain distinct;
- generic direct acquisition burden is not fabricated;
- service and process gaps remain qualitative/insufficient;
- no displacement credit.

Proposed:
- do not set climate condition merely because pathway selected;
- no mining/e-waste condition;
- lifecycle journey may explain reuse/second-life accounting generically.

### TRACE-04 — Impact with no overrides

Current `describeImpact(opened, READY)` behavior:
- water qualitative card emits from accepted product-class authority;
- climate/mining/e-waste cards do not emit because their conditions are not established.

This is correct fail-closed resolver behavior.

### TRACE-05 — Impact test overrides

Existing tests manually set:
- climate scenario GHG true;
- mining primary extraction true;
- mining people geography/process true;
- e-waste unsafe handling true;
- e-waste unsound-site handling true.

All six cards then emit with exact claim/version pins.

These overrides prove resolver capability only. They are **not** evidence that production currently has facts to set those flags.

### TRACE-06 — Impact → Otherness current production

`smartphone-situation.tsx` passes `impactView.domains` to Otherness.

`displayedConsequenceReferences()` requires explicit:
- support status,
- independent support,
- extent.

Current Impact domain presentation lacks them. Result: the accepted Otherness gate has no qualifying consequence reference.

Proposed: later produce Research-owned gate fields only on `case_condition_established` consequence records.

## 10. Phone lifecycle journey proposal

The journey should be an evidence navigator, not a pseudo-LCA calculator.

### Stage 1 — Raw materials

**Generic supported context**
- Smartphones require processed metals/minerals and other materials.
- Metal extraction/processing can create land, water and biodiversity pressures.
- New-device production creates demand for processed materials; supply can include primary and recycled feedstock.

**Unknown about this phone**
- exact primary/recycled share unless model-specific evidence supports it;
- mine, country, ore grade or extraction route;
- kilograms of newly mined ore attributable to one phone.

**Do not do**
- no “this phone mined X kg”;
- no hectares/species loss;
- no mining CO2 added on top of a whole-device LCA unless boundary exclusion is proven.

### Stage 2 — Refining and material processing

**Generic supported context**
- refining/separation/processing are part of upstream production systems and can use energy/water and create pollution pressures.
- upstream material processing is already inside production footprints where the LCA boundary says so.

**Unknown**
- facility, electricity mix, process chemistry and local impacts for arbitrary phone.

**Do not do**
- do not invent a stage-specific share of the 25–70 kg bracket.

### Stage 3 — Components

**Generic supported context**
- production footprint covers component manufacture under the accepted LCA boundary.
- selected repairs have bounded evidence: battery 0.3–0.7; display 3–8.
- exact model records may expose additional module-specific values.

**Unknown**
- component-level allocation for an arbitrary phone;
- exact chip/display/battery burden without applicable source.

**Do not do**
- no arbitrary disaggregation of whole-phone LCA.

### Stage 4 — Assembly

**Generic supported context**
- assembly is within production/manufacturing boundaries of the accepted smartphone LCAs.

**Unknown**
- assembly-factory burden for arbitrary phone.

**Do not do**
- do not create an assembly subtotal by subtraction or guessed percentage.

### Stage 5 — Distribution / transport

**Generic supported context**
- approved finished-device fallback: 2–4 kg CO2e/device.
- model-specific values take precedence when applicable.

**Unknown**
- exact route/mode for user's candidate absent source.

**Display**
- show fallback status/source scope next to range.

### Stage 6 — Use and repair

**Generic supported context**
- charging central 4 kWh/year; sensitivity 2–8.
- charging **carbon** requires an approved relevant grid factor; without it, CO2e remains unknown/omitted.
- repair can extend useful service; battery/display repair ranges may be shown only under applicable repair scenarios.

**Unknown**
- user's actual charging energy/grid factor unless supported;
- future repair timing/success unless supplied.

### Stage 7 — Resale, refurbishment and second life

**Generic supported context**
- used and refurbished are distinct pathways.
- earlier manufacture is prior-life burden excluded from direct second-life acquisition under the primary cut-off prospective view; exclusion is not avoided-production credit.
- arbitrary used/refurbished direct footprints remain unknown without evidence.
- ADEME 7.61 kg CO2e is only its explicit two-year source-specific refurbishment reference.

**Unknown**
- second-life service;
- refurbishment process;
- shipping/preparation unless supplied;
- displacement effect in the user's market.

### Stage 8 — End of life

**Generic supported context**
- global e-waste context may be shown separately.
- unsafe/informal and unsound-site pathways are conditional.
- exact discarded mass may be tracked only with exact device/component mass and actual discard/recycling route.

**Unknown**
- user's future route unless supplied;
- downstream handling;
- generic EOL climate value;
- recycling credit.

**Do not do**
- no global collection rate as personal probability;
- no automatic informal-handling assumption;
- no generic recycling credit.

## 11. Presentation rules for the lifecycle journey

Each stage should use three visually distinct blocks:

1. **What we know generally** — accepted generic/process evidence, source scope/status.
2. **What we know about this phone** — exact model/case evidence only; otherwise “not known”.
3. **Explore further** — optional verified source link, clearly labelled as explanatory context.

Whole-device product totals should remain separate from lifecycle stage cards. A banner should state:

> Stage cards explain where impacts can arise. They are not additive shares of the phone’s total footprint unless an accepted source explicitly provides compatible stage values.

No stage may generate a unified harm score.

## 12. Optional further-exploration links

These links were re-verified during this task. They are explanatory references, not automatic new PSI numerical authority.

### European Commission — Smartphones and Tablets
https://energy-efficient-products.ec.europa.eu/product-list/smartphones-and-tablets_en

**Origin:** institutional/regulatory.  
**Useful for:** durability, repairability, battery-cycle, spare-parts and OS-update context.  
**Verified context:** EU ecodesign/energy-labelling requirements apply to covered products placed on the market from 20 June 2025; battery requirement includes at least 800 cycles with at least 80% remaining capacity, plus repair/spare-parts/update requirements.  
**Limit:** regulatory product requirements, not a lifecycle-footprint dataset and not evidence about an individual phone’s actual condition.

### Fraunhofer IZM / Fairphone — Fairphone 5 LCA
https://www.fairphone.com/wp-content/uploads/2024/09/Fairphone5_LCA_Report_2024.pdf

**Origin:** LCA by Fraunhofer IZM, commissioned by Fairphone.  
**Useful for:** a concrete worked example of LCA boundaries, stages, repair scenarios and water/resource indicators.  
**Limit:** Fairphone 5 model-specific; report states no independent critical review; do not generalize exact values to arbitrary smartphones.

### ITU / UNITAR — Global E-waste Monitor 2024
https://www.itu.int/pub/D-GEN-E_WASTE.01-2024

**Origin:** international institutional/global statistics.  
**Useful for:** global e-waste generation, collection and policy context.  
**Limit:** global aggregate data never establishes the route/probability of one user's phone.

### World Health Organization — Electronic waste: digital dumpsites and children’s health
https://www.who.int/news-room/questions-and-answers/item/children-and-digital-dumpsites-e-waste-and-health

**Origin:** international public-health institution.  
**Useful for:** why unsafe/unsound e-waste processing can expose workers, families and communities.  
**Limit:** conditional on actual unsafe/informal handling; must not be displayed as the fate of a formally recycled or unknown-route device.

## 13. Focused acceptance / regression cases for a future implementation

### ID-01 — exact supported model match
Given an exact supported model/configuration, model-specific evidence is used only for compatible fields and retains source/boundary metadata.

### ID-02 — unsupported model
An unsupported model remains literally identified; approved generic fallback is used only where permitted, labelled generic.

### ID-03 — generic route
“I don’t know / use generic smartphone” does not block comparison and never becomes an exact-model claim.

### ID-04 — identity independence
Changing model identity cannot change adequacy, AP answers, desire legitimacy or old-device fate unless a separately accepted empirical field explicitly depends on it.

### PROP-CLIMATE-01 — positive generic new burden
New selection with supported positive production/distribution range creates climate condition evidence and emits climate pathway with case-specific support metadata.

### PROP-CLIMATE-02 — label alone
“Buy a new phone” label without factual burden record does not set climate condition.

### PROP-CLIMATE-03 — historic current-phone production
Historical production of currently owned phone does not establish a prospective keep/repair climate consequence.

### PROP-MINING-ECO-01 — generic production is insufficient
25–70 kg production fallback does not set primary-extraction condition.

### PROP-MINING-PEOPLE-01 — model identity is insufficient
Named phone/model without accepted supply-chain geography/process does not emit mining/people pathway.

### PROP-EWASTE-01 — fate label is insufficient
Discard/trade-in/unknown/global e-waste context does not set unsafe/informal or unsound-site handling.

### PROP-EWASTE-02 — contradictory formal route
Formal recycling must not coexist with an inferred unsafe/unsound handling condition.

### PROP-WATER-01 — generic qualitative context
Water card may display generic qualitative evidence with `case_specificity=generic_context`, `gate_eligible=false`.

### PROP-WATER-02 — caller number rejected
User/caller-supplied litres or local consequence cannot become quantitative authority.

### AP-GATE-01 — climate consequence projection
A displayed, condition-established climate consequence projects an AP-facing consequence reference with exact claim/version, support and extent fields.

### AP-GATE-02 — generic water does not activate
Generic water context produces no AP-facing consequence reference.

### AP-GATE-03 — selected pathway does not activate
A comparison checkbox/label alone never becomes a qualifying consequence.

### INVALIDATE-01 — comparison fact edit
Changing/removing a fact that established climate condition invalidates/recomputes the consequence record and clears downstream system-participation/Otherness presentation state.

### INVALIDATE-02 — comparison reset
Reset clears all case-specific consequence records; generic lifecycle context may remain available as static knowledge but cannot preserve a case gate.

### INVALIDATE-03 — situation/inquiry edit
Existing accepted upstream invalidation behavior remains; stale consequence records must not survive as current evidence.

### JOURNEY-01 — no additive stage total
Journey stage cards cannot be summed into a device total unless source-compatible stage totals explicitly authorize it.

### JOURNEY-02 — ADEME remains source-specific
No arbitrary refurbished candidate inherits 7.61 kg CO2e.

## 14. Smallest coherent future Tier-2 slices

These slices should be separately authorized after HQ/domain acceptance.

### Slice R2-A — approved model-evidence lookup
- encode only already-accepted exact model/configuration records;
- add explicit generic/unknown route;
- remove reliance on the synthetic `approved_registry_match` sentinel;
- preserve generic fallback rules and historical-manufacture boundary;
- tests ID-01–ID-04.

No new scientific values.

### Slice R2-B — typed comparison → Impact condition bridge
- derive climate condition only from supported positive prospective burden records;
- leave mining/e-waste conditions unknown absent explicit facts;
- tag water as generic context;
- attach auditable condition basis refs;
- tests PROP-* and invalidation cases.

Do not weaken resolver modules.

### Slice R2-C — lifecycle evidence journey
- add stage presentation based on accepted generic/model-specific records;
- no additive stage calculator;
- verified optional external explainers;
- explicit generic vs “this phone” separation;
- tests JOURNEY-01/02.

This slice can be independent of AP.

### Slice R2-D / AP interface — consequence projection
After #139 and this proposal are reconciled:
- project only `gate_eligible=true` records into the AP-facing consequence shape;
- preserve exact claim/version/source/limits;
- current generic water and unestablished mining/e-waste remain non-qualifying;
- tests AP-GATE-*.

If HQ accepts AP #139, the sequence can become:

```text
phone journey / empirical evidence
→ case-qualified Impact consequence(s)
→ optional system-participation inquiry
→ existing Protect My Four / otherness
→ final choice
```

Research supplies evidence objects only; AP owns inquiry wording.

## 15. Unresolved decisions / discrepancies for HQ

1. **Model lookup UX:** controlled accepted-record list vs free-text exact matching. Research recommends controlled list + generic/unknown route for V0.
2. **Model-specific registry location:** accepted model-specific values exist in canonical contracts/source package, but `evidence/model-specific/` does not contain runtime records. A future implementation needs an explicit canonical-to-runtime encoding plan.
3. **Climate condition scope:** Research proposes condition establishment from any supported positive **prospective** GHG record tied to a selected scenario. HQ should accept this rule before implementation.
4. **Extent semantics:** Research proposes `beyond_immediate_circle` for the case-established climate pressure-to-outcome pathway because the accepted claim is global and explicitly concerns risks to people/ecosystems. This is not named-target attribution. HQ/AP should reconcile this exact gate meaning.
5. **Generic water placement:** it should remain valuable lifecycle education but must not be presented as “this choice caused water harm” or as a qualifying AP consequence.
6. **No current route for mining/e-waste case qualification:** if product direction later requires these to activate from user facts, a new bounded input/evidence design is needed; do not manufacture those facts from lifecycle knowledge.
7. **Common-horizon contract history:** current canonical empirical contract still mentions a permitted provisional 3-year modelling default, while current user-input/comparison implementation requires explicit user horizon and tests reject silent 3-year substitution. This proposal does not resolve that historical contract tension because #140 does not authorize changing service-horizon semantics. Any future implementation must follow the currently accepted application/input invariants unless HQ explicitly reconciles the contract wording.

## 16. Explicit prohibitions

A future implementation based on this proposal must not:

- treat generic evidence as the user's exact phone;
- fuzzy-match a model to a different configuration;
- infer adequacy or remaining life from model/age/grade;
- infer primary mining from a generic production footprint;
- infer supply-chain geography from brand/model;
- infer unsafe e-waste handling from replacement choice, discard context or global collection rates;
- use water-context cards as a personal/local consequence;
- convert unknown into zero/false;
- use selection labels or public prose as empirical authority;
- copy Impact labels into resolver condition fields;
- set AP gate fields from AP interpretation;
- attach named victims, places, species, mines or sites to one phone;
- create generic ore masses, water litres, biodiversity losses or human harm counts;
- apply ADEME 7.61 to arbitrary refurbishment;
- apply U.S. displacement 0.40 to primary/direct scoring or Germany;
- add lifecycle-stage values to a whole-device product total without boundary compatibility;
- create a unified environmental, safety, Protect Four or moral score;
- rank purchases from qualitative pathways;
- modify immutable source packages or accepted registries under this task.

## 17. Validation and traceability

This was a proposal/audit task, not an application implementation task.

Validation performed:
- inspected the accepted contracts, source packages, registries and production bridge at the pinned starting main;
- inspected all six empirical resolver conditions;
- inspected current comparison and Impact regression fixtures;
- inspected accepted AP/Otherness gate translation requirements;
- reproduced representative API/test traces from repository source;
- checked sibling AP #139 proposal and reconciled the empirical interface direction;
- re-verified four optional external explainer URLs and their provenance/limitations;
- verified no matching Research task branch/PR existed before task start;
- created only the deterministic proposal branch required by Issue #140.

No test was weakened or skipped because no executable behavior was changed. No scientific, AP, V17, application, product, integrated-contract, accepted-registry or immutable-package change is part of this proposal.

## 18. Return status

**Research result:** `VERIFIED_FOR_HQ_REVIEW`

This proposal is implementation-ready at the empirical/product-semantics level. It does not itself accept the proposed semantics, modify canonical truth, authorize Cursor implementation, or merge anything.

HQ should reconcile this proposal with AP Issue #139 / PR #142 and then accept/reject the explicit product-semantic decisions before issuing the smallest Tier-2 implementation slice(s).
