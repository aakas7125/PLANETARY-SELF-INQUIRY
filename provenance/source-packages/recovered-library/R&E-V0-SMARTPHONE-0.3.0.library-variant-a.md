**Package version:** `R&E-V0-SMARTPHONE-0.3.0`

**Issued:** 2026-09-03

**Scope:** V0 vertical slice — **“Should I replace my still-working smartphone?”**

**Supersedes:** none.

### Purpose

Provide V0 with implementation-ready empirical records for comparing **keep / repair / refurbished / new** without inventing precision, conflating accounting conventions, or converting aggregate environmental evidence into individualized harm claims.

---

## Approved inputs

### A. Common comparison boundary

Use the **same functional service horizon** **`H`** **for all four options**.

```
```

```
functional_unit =
"provision of smartphone service to the user for H years from the decision date"
```

`H` must be identical across scenarios. A **3-year default is permitted as a V0 modelling default**, not as a scientific fact; it aligns with several available smartphone LCAs and ADEME's reference first-life assumption. User-supplied expected use duration should override it.

```
```

```
H_default_years = 3
status = PROVISIONAL_MODEL_DEFAULT
```

Do **not** re-charge past manufacturing emissions of the already-owned phone to a prospective keep/repair decision. Past production is sunk for the decision being evaluated.

All climate outputs use:

```
```

```
unit = kg_CO2e
metric = GWP100
```

Where a product LCA explicitly specifies another convention, preserve the source metadata.

---

# B. Core climate equations

## B1. Charging/use

Generic use-phase fallback:

```math
C_\text{use}=E_\text{charge}\times H\times CI_\text{grid}
```

where:

```
```

```
E_charge_central = 4 kWh/year
E_charge_sensitivity = 2–8 kWh/year
CI_grid = kg CO2e/kWh for relevant electricity mix
```

JRC adopted 4 kWh/year after reviewing estimates spanning approximately 2–7.74 kWh/year. 

**Status:** `APPROVED_V0_FALLBACK`

**Confidence:** moderate

**Evidence scope:** product-class / older smartphone energy literature

**Constraint:** communication networks/data centres are excluded from this handset-replacement calculation. JRC treats them as a separate system contribution; adding them here would mostly model digital behaviour rather than physical handset replacement. 

---

## B2. Keep existing phone

```
```

```
C_keep_direct =
    C_use(existing, H)
  + Σ C_future_repairs_within_H
  + C_EOL_existing_if_EOL_occurs_within_H
```

```
```

```
C_new_whole_device_production_now = 0
```

Past production:

```
```

```
display_in_history = true
include_in_prospective_total = false
```

**Status:** `APPROVED`

**Boundary:** additional burden from decision date forward.

---

## B3. Repair existing phone now

```
```

```
C_repair_direct =
    C_repair_now
  + C_use(existing, H)
  + Σ C_future_repairs_within_H
  + C_EOL_existing_if_EOL_occurs_within_H
```

### Generic repair fallbacks

```
```

```
battery_replacement_CO2e = 0.3–0.7 kg
status = PROVISIONAL_GENERIC_RANGE

full_display_replacement_CO2e = 3–8 kg
status = PROVISIONAL_GENERIC_RANGE
```

These are cross-study modelling brackets, **not statistical confidence intervals**. JRC found battery replacement increased its baseline footprint by about 1%, display replacement by about 9%, while lifetime extension with those repairs still reduced total carbon impacts under its scenarios. 

For Fairphone 5 specifically, Fraunhofer reports battery replacement overhead of 0.568 kg CO₂e DIY / 0.617 kg repair-centre and display module replacement of 7.431 / 7.493 kg CO₂e. 

### Major-board rule

```
```

```
if repair_type in ["motherboard", "mainboard", "primary_pcba", "logic_board"]:
    use_generic_small_repair_assumption = false
    repair_impact_class = "major_board"
```

There is **no approved generic mainboard CO₂e fallback**.

For **Fairphone 5 only**:

```
```

```
primary_PCBA_full_module_DIY = 17.840 kg CO2e
primary_PCBA_full_module_repair_center = 17.909 kg CO2e
primary_PCBA_board_level_part_repair_center = 6.959 kg CO2e
```

Fraunhofer's repair table includes module/part production, relevant additional transport and EOL activities in the repair overhead. 

**Status:** Fairphone 5 values `APPROVED_MODEL_SPECIFIC`; generic major-board value `UNSUPPORTED`.

---

# B4. Buy new

```
```

```
C_new_direct =
    C_new_production
  + C_new_distribution
  + C_use(new, H)
  + C_new_EOL_if_EOL_occurs_within_H
  + C_old_device_fate_event
```

### Generic manufacturing fallback

```
```

```
C_new_production = 25–70 kg CO2e/device
```

This is an **evidence bracket**, not a population distribution. JRC's own virtual smartphone yielded 26.7 kg CO₂e manufacturing, while reviewed Apple/Huawei and other smartphone LCAs spanned about 24.8–70.4 kg CO₂e/device. Manufacturing includes raw-material extraction/processing, parts manufacture and assembly. The authors explicitly warn that studies are not fully comparable because assumptions and datasets differ. 

```
```

```
status = APPROVED_V0_FALLBACK
confidence = moderate
range_type = heterogeneous_LCA_bracket
```

Optional central visual value:

```
```

```
40 kg CO2e
status = PROVISIONAL_SCENARIO_VALUE
```

It must **never** be described as “the average smartphone.”

### Generic finished-device distribution

```
```

```
C_distribution = 2–4 kg CO2e/device
status = APPROVED_V0_FALLBACK
confidence = moderate
```

Use model-specific values whenever available.

---

# B5. Refurbished

V0 must maintain **two separate accounting objects**.

## Direct / cut-off view

```
```

```
refurb_accounting_mode = "cut_off/direct"
```

ADEME's reference smartphone under the cut-off approach assigns original production/EOL to the first life and assigns the refurbished life the impacts arising from refurbishment. Its reference result is:

```
```

```
C_refurb_ADEME_reference = 7.61 kg CO2e
second_life = 2 years
```

The corresponding ADEME new-phone reference is:

```
```

```
C_new_ADEME_reference = 85.2 kg CO2e
first_life = 3 years
```

Fraunhofer's review reports these as the ADEME cut-off comparison; ADEME reports large variation with refurbishment practice and lifetime. 

**Implementation rule:**

```
```

```
7.61 must be stored as an ADEME reference scenario.
Do not decompose it into invented:
    parts + transport + cleaning + use + packaging
unless ADEME source fields are explicitly recovered.
```

```
```

```
status = APPROVED_SOURCE_SPECIFIC_REFERENCE
not_universal = true
```

Do **not** treat 7.61 kg as “the carbon footprint of every refurbished phone.”

---

## Lifecycle-attributed / depreciation view

ITU-T L.1410 records ADEME's alternative **depreciation approach**, where part of original manufacturing/EOL is transferred to a refurbished product when refurbishment occurs before the theoretical end of its first life. 

Required schema:

```
```

```
C_refurb_lifecycle_attributed =
    C_refurb_direct
  + C_allocated_prior_manufacturing_EOL
```

However:

```
```

```
allocation_function_for_C_allocated_prior_manufacturing_EOL =
UNRESOLVED_FOR_IMPLEMENTATION
```

**Status:** `METHODOLOGY_APPROVED / NUMERIC_IMPLEMENTATION_NOT_APPROVED`

V0 may explain this accounting view, but **must not invent an allocation percentage or depreciation formula** from the summary evidence.

### Critical rule

Never:

```
```

```
C_refurb_result =
C_refurb_cutoff_7.61
+
a second separately calculated refurbishment burden
```

That risks double counting.

And never compare a 2-year refurbished reference directly with a 3-year new reference without normalizing to equal service.

---

# C. Model-specific climate overrides approved for V0

Priority:

```
```

```
1. exact model + configuration + credible LCA
2. exact model family where configuration difference is immaterial and disclosed
3. generic fallback range
```

## Fairphone 5

Source functional unit: use of one Fairphone 5 for **3 years**, cradle-to-grave. Fraunhofer states total 42.1 kg CO₂e: production 32.7; transport 2.81; use 6.59; EOL 0.041. The study was commissioned by Fairphone B.V.; preserve that provenance. 

```
```

```
model = Fairphone 5
total_3y = 42.10
production = 32.70
transport = 2.81
use_3y = 6.59
EOL = 0.041
unit = kg CO2e
status = APPROVED_MODEL_SPECIFIC
source_type = independent_LCA_commissioned_by_manufacturer
```

Repair overrides are those specified above.

---

## Samsung Galaxy S25 — EUR configuration

Samsung reports:

```
```

```
total = 45.7 kg CO2e
production_share = 88.0%
distribution_share = 5.2%
use_share = 6.5%
disposal_share = 0.3%
```

Derived:

```
```

```
production ≈ 40.22 kg CO2e
distribution ≈ 2.38 kg CO2e
use ≈ 2.97 kg CO2e
disposal ≈ 0.14 kg CO2e
```

```
```

```
status = APPROVED_MODEL_SPECIFIC
derived_values = true
rounding_uncertainty = true
source_type = manufacturer_LCA_report
```

Do not transfer these figures to other Galaxy models.

---

## Apple iPhone 16 128 GB

Apple reports 56 kg CO₂e lifecycle total, with 80% production, 3% transportation, 18% product use and <1% EOL. Apple assumes **three years of first-owner product use** for iOS devices; production includes raw-material extraction/production/transport plus component and product manufacture. 

Derived:

```
```

```
model = iPhone 16 128GB
total_3y = 56.0 kg CO2e
production ≈ 44.8 kg CO2e
transport ≈ 1.68 kg CO2e
use_3y ≈ 10.08 kg CO2e
EOL < 0.56 kg CO2e
status = APPROVED_MODEL_SPECIFIC
source_type = manufacturer_LCA_report
```

Apple itself notes inherent modelling uncertainty from data limitations. 

Do not transfer 128-GB values to higher storage variants: Apple reports higher totals for 256 and 512 GB. 

---

# D. Old-device-fate rules

The fate of the currently owned phone is a **separate event object**.

```
```

```
old_device_fate ∈ {
  continue_use,
  sell_or_gift_for_reuse,
  trade_in_unknown_next_use,
  store_in_drawer,
  formal_recycling,
  discard_general_waste,
  unknown
}
```

## `continue_use`

```
```

```
e_waste_now = 0
retirement_event = false
```

## `sell_or_gift_for_reuse`

```
```

```
e_waste_now = 0
second_life = true
avoided_new_phone_credit = 0 unless displacement evidence explicitly supplied
```

JRC found large benefits **under a 1:1 displacement assumption**, but that is a scenario assumption, not a fact about every used-device transaction. 

## `trade_in_unknown_next_use`

```
```

```
fate = uncertain
e_waste_now = unknown
avoided_production_credit = unsupported
```

## `store_in_drawer`

```
```

```
active_service = false
e_waste_now = false
status = retired/dormant hardware
```

Do not label stored equipment as formally recycled or automatically as generated e-waste.

## `formal_recycling`

```
```

```
physical_mass_entering_EOL = exact_device_mass_if_known
```

Do **not** apply the global 22.3% formal-collection rate to the individual phone. That figure describes global 2022 e-waste flows, not the probability of a particular user's German phone being recycled. 

## `discard_general_waste`

Show conditional pollution/e-waste pathways. Do not assign an informal-recycling destination or probability without evidence.

## `unknown`

Show uncertainty; do not silently assume recycling, dumping, reuse or storage.

---

# E. Waste rule

Quantifiable V0 field:

```
```

```
discarded_hardware_mass_g =
sum(mass of device/components actually entering discard/recycling route)
```

Use exact model/component mass where available.

Do **not** calculate:

```
```

```
"e-waste avoided" = phone_mass
```

unless the counterfactual fate is explicitly defined.

Global context may state that 62 billion kg of e-waste were generated in 2022 and 22.3% was documented as formally collected and environmentally soundly recycled; small IT/telecom equipment accounted for 4.6 billion kg with roughly 22% documented collection. 

`evidence_scope = global_context`, never individual attribution.

---

# F. Materials and water

## Materials

Allowed V0 output:

```
```

```
additional_whole_device_material_demand =
true / false / conditional
```

Do not output a generic:

```
```

```
kg_mined
kg_primary_ore
habitat_area_destroyed
```

A new phone creates demand for processed material supply, but feedstock may be **primary and/or recycled**.

Product-LCA production emissions already include upstream material extraction/processing where the LCA says so. JRC explicitly defines manufacturing as including extraction/processing of raw materials, parts manufacture and assembly; Apple likewise includes raw-material extraction and production in its production stage. 

### Non-double-count rule

If:

```
```

```
product_LCA.production.includes_upstream_materials = true
```

then material cards may **explain** those pathways but:

```
```

```
C_total ≠
C_product_LCA
+ cobalt_mining_CO2
+ gold_mining_CO2
+ lithium_mining_CO2
...
```

unless the added material values are demonstrably excluded from the product LCA.

This is a hard implementation constraint.

---

## Water

Allowed:

```
```

```
model_specific_water_indicator
```

only if the source defines:

```
```

```
indicator_type
unit
boundary
method
```

Never interchange:

```
```

```
water withdrawal
water consumption
blue-water consumption
scarcity-weighted m3-eq
water-deprivation metrics
```

Generic litres-per-phone:

```
```

```
status = UNSUPPORTED
```

Fairphone 5 may retain its LCA water indicators model-specifically, but V0 must not convert them into “litres of drinking water denied.”

---

# G. Evidence/pathway record schema

```
```

```
ImpactPathwayRecord {
  record_id
  version
  claim
  evidence_domain
  confidence
  evidence_scope
  attribution_status
  conditions[]
  status
  quantitative_value? 
  unit?
  source_ids[]
  notes
}
```

### Allowed `confidence`

```
```

```
high
moderate
low
```

### Allowed `evidence_scope`

```
```

```
model_specific
product_class
global_assessment
systematic_review
site_specific
global_context
methodological
```

### Allowed `attribution_status`

```
```

```
device_specific
product_class_generalization
pressure_to_outcome
conditional_pathway
scenario_assumption
not_attributable_to_specific_device
unknown
```

### Allowed `status`

```
```

```
APPROVED
PROVISIONAL
QUALITATIVE
UNSUPPORTED
```

---

# H. Approved pathway records

## `SP-PATH-CLIMATE-001`

```
```

```
claim:
"Manufacturing-related greenhouse-gas emissions associated with
smartphone production contribute incrementally to anthropogenic climate
change; climate change increases risks to people and ecosystems."

evidence_domain:
["climate", "human_health", "ecosystems"]

confidence: high
evidence_scope:
["product_class", "global_assessment"]

attribution_status: pressure_to_outcome
status: APPROVED

conditions:
- product/repair/refurbishment scenario actually produces GHG emissions
- no individual victim/ecosystem attribution
```

IPCC finds a near-linear relationship between cumulative anthropogenic CO₂ and warming; every additional 1,000 GtCO₂ produces a likely 0.27–0.63°C warming, best estimate 0.45°C.  IPCC WGII concludes human-induced climate change has already caused widespread adverse impacts to nature and people. 

**Forbidden inference:** “this phone caused X person's illness / X biodiversity loss.”

---

## `SP-PATH-MINING-ECO-001`

```
```

```
claim:
"Metal extraction and processing can cause land transformation,
water consumption/pollution and biodiversity impacts."

evidence_domain:
["materials", "water", "ecosystems"]

confidence: high
evidence_scope: systematic_review
attribution_status: not_attributable_to_specific_device
status: APPROVED_QUALITATIVE

conditions:
- relevant primary metal extraction occurs
- impact magnitude/location depends on mine, ore, processing and ecosystem
```

A 2025 *Nature Reviews Earth & Environment* review covering 47 metal ores finds impacts on land use, water resources and biodiversity, and notes that about 70% of global metal extraction is connected to international supply chains. 

**Forbidden:** assigning hectares, species losses, a particular mine, or primary-mining mass to an arbitrary handset.

---

## `SP-PATH-MINING-PEOPLE-001`

```
```

```
claim:
"Mining and processing can expose workers and nearby communities to
environmental and occupational hazards."

evidence_domain:
["materials", "human_health"]

confidence: moderate
evidence_scope:
["systematic_review", "site_specific"]

attribution_status: conditional_pathway
status: QUALITATIVE
```

**Condition:** supply-chain geography/process must be relevant.

**Forbidden:** “people harmed per phone.”

---

## `SP-PATH-EWASTE-PEOPLE-001`

```
```

```
claim:
"Unsafe/informal e-waste processing can expose workers, families and
communities to hazardous substances and is associated with adverse
health outcomes."

evidence_domain:
["waste", "human_health"]

confidence: high
evidence_scope: authoritative_assessment
attribution_status: conditional_pathway
status: APPROVED
```

WHO states inappropriate e-waste recycling can release mixtures of toxicants affecting workers, families and communities, with children and pregnant women especially vulnerable. 

**Condition:** unsafe/informal handling actually occurs.

**Forbidden:** automatically displaying this as the fate of a formally recycled device.

---

## `SP-PATH-EWASTE-ECO-001`

```
```

```
claim:
"Unsound e-waste recycling sites can contaminate soil, water and
sediment with hazardous metals."

evidence_domain:
["waste", "water", "ecosystems"]

confidence: high
evidence_scope: systematic_review
attribution_status: conditional_pathway
status: APPROVED
```

A systematic review of 59 studies and 8,286 measurements found widespread metal contamination around studied e-waste sites, though studies were geographically concentrated and cross-sectional. 

---

## `SP-PATH-WATER-001`

```
```

```
claim:
"Smartphone/electronics production can have substantial water-use
requirements, but local human/ecological consequences depend strongly
on manufacturing geography and the indicator used."

evidence_domain:
["water", "ecosystems", "human_health"]

confidence:
high for water use
low-to-moderate for arbitrary-phone local consequence

evidence_scope:
["model_specific", "product_class"]

attribution_status: not_attributable_to_specific_device
status: QUALITATIVE unless model-specific indicator available
```

**Forbidden:** “X litres of drinking water deprived” or universal litres/device.

---

# I. Material-card rules

Cards may describe **conditional pathways**, not calculate additional carbon when upstream carbon is already inside the product LCA.

Approved qualitative cards:

```
```

```
cobalt:
  pathway = mining / processing → exposure + ecosystem pressure
  attribution = unknown without provenance

gold:
  pathway = mercury-using artisanal mining → mercury exposure +
            deforestation/aquatic pollution
  condition = only applicable to relevant ASGM supply
  attribution = unknown without provenance

rare_earths/neodymium:
  pathway = extraction/separation → pollution/ecosystem pressures
  attribution = group-level evidence stronger than neodymium-specific harm

lithium:
  pathway = extraction → water/hydrology/ecosystem/community pressure
  condition = highly deposit/extraction-method specific

copper:
  pathway = mining/smelting/tailings → local pollution/water/ecosystem pressure

tantalum:
  pathway = some high-risk sourcing → conflict/human-rights concerns
  constraint = do not describe tantalum itself as strongly toxic without evidence
```

All six:

```
```

```
quantitative_person_harm = UNSUPPORTED
quantitative_biodiversity_area = UNSUPPORTED
fixed_primary_mining_per_phone = UNSUPPORTED
```

---

# J. User-facing uncertainty rules

V0 may say:

> “A comparable new smartphone typically carries tens of kilograms of production emissions.”

It may show the `25–70 kg CO₂e` fallback band.

It may **not** say:

> “A smartphone emits 40 kg.”

unless 40 kg is tied to a specified model/scenario.

For every displayed estimate:

```
```

```
show:
- value/range- source scope
- whether model-specific or fallback
- confidence
- major assumptions
```

At minimum internally retain:

```
```

```
claim_id
source_id
source_version/date
value
unit
system_boundary
functional_unit
confidence
evidence_scope
attribution_status
evidence_domain
conditions
status
```

---

# K. Unsupported V0 outputs — hard prohibition

```
```

```
victims caused
people harmed
deaths caused/avoided
biodiversity area destroyed
species lost
litres of drinking water denied
kg of ore newly mined for arbitrary phone
unified environmental-harm score
unified "planet damage" score
exact avoided manufacturing from a second-hand transaction
exact human/ecological damage caused by one replacement
```

These are **not currently supported** by the evidence package.

---

## Provenance registry

**S1 — Cordella, Alfieri & Sanfelix, 2021, Journal of Industrial Ecology / JRC-origin research.** Smartphone material-efficiency LCA; manufacturing comparisons, charging, repair/lifetime and 1:1 reuse scenarios. 

**S2 — Sánchez, Baur & Eguren / Fraunhofer IZM, 2024, Fairphone 5 LCA.** Cradle-to-grave, ISO 14040/14044/14067; 3-year functional unit; commissioned by Fairphone B.V. 

**S3 — Samsung Electronics, Galaxy S25 Product Environmental Report, 2025.** Manufacturer lifecycle-carbon report, EUR configuration. 

**S4 — Apple, iPhone 16 / 16 Plus Product Environmental Report, 2024.** Manufacturer ISO-based product footprint; first-owner use period three years. 

**S5 — ADEME, 2022, Assessment of environmental impact of refurbished products.** New/refurbished reference comparison and variability. 

**S6 — ITU-T L.1410, 11/2024.** ICT LCA methodology and ADEME refurbishment/depreciation example. 

**S7 — ITU/UNITAR, Global E-waste Monitor 2024.** Global e-waste mass/collection context. 

**S8 — IPCC AR6 WGI.** Cumulative CO₂ → warming. 

**S9 — IPCC AR6 WGII.** Climate impacts on people/ecosystems and interdependence. 

**S10 — Giljum et al., Nature Reviews Earth & Environment, 2025.** Global metal-mining land/water/biodiversity pathways. 

**S11 — WHO, Children and Digital Dumpsites, 2021 + updated e-waste health material.** Unsafe e-waste → human exposure/health pathway. 

**S12 — Systematic review of environmental heavy-metal contamination at e-waste sites.** 59 studies / 8,286 measurements. 

---

## Status

**Approved:** prospective decision boundary; common service-horizon requirement; generic new-production band; charging fallback; exact listed model overrides; old-device-fate logic; major-board special treatment; pathway records and causal-language constraints.

**Provisional:** 3-year default comparison horizon; generic battery/display repair ranges; optional 40-kg central manufacturing scenario.

**Qualitative:** mining→people; generic water consequences; material-specific people/ecosystem cards without supply-chain provenance.

**Unresolved:** numeric ADEME depreciation/lifecycle-allocation function for refurbished phones; actual market displacement caused by an individual refurbished/second-hand purchase.

**Unsupported:** victim, biodiversity-area, drinking-water-denial, fixed-primary-mining and unified-harm scores.

### Constraints

The receiving workstream must **not**:

-  convert evidence brackets into exact averages; 
-  treat past production of the owned phone as a new burden of keeping it; 
-  present `7.61 kg` as universal refurbished-phone carbon; 
-  mix cut-off and depreciation accounting; 
-  award a 1:1 avoided-new-phone credit without an explicit scenario label; 
-  treat global recycling rates as an individual's fate probability; 
-  treat drawer storage as recycling; 
-  treat sale/gifting as immediate e-waste; 
-  double-count mining emissions already included in production LCAs; 
-  turn general pathways into identifiable human/ecosystem harm; 
-  remove conditions from qualitative pathway records. 

### Open dependencies

**Workstream:** Project HQ / accounting decision

**Needed input:** whether V0 should expose the refurbishment **cut-off/direct view only**, or also a separate lifecycle-attributed/depreciation view once its exact allocation function is implemented.

**Why:** prevents silent mixing of incompatible refurbishment accounting conventions.

**Blocking?:** no for direct V0 comparison; yes for a numeric depreciation-mode output.

**Can continue meanwhile?:** yes — implement the cut-off/direct reference with explicit attribution status and leave depreciation numeric output disabled.

**Workstream:** V0 — Cloud Prototype

**Needed input:** none from Research to begin implementation; this package is executable as supplied.

**Blocking?:** no.

### Requested action

V0 may now implement:

1.  equal-horizon keep / repair / refurbished / new comparison; 
2.  generic uncertainty ranges with model-specific overrides; 
3.  separate old-device-fate handling; 
4.  major-board repair branch; 
5.  evidence-backed impact-pathway cards; 
6.  provenance/confidence/status fields; 
7.  strict separation of direct vs lifecycle-attributed refurbished accounting.