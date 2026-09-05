## Research & Evidence → V0 — Cloud Prototype

# CROSS-WORKSTREAM HANDOFF

**Package:** `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0`

**Parent:** `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0`

**Status:** `IMPLEMENTATION_READY`

**Cases:** `SEC-01`–`SEC-12`

This is the complete regression contract for the used/second-hand versus refurbished pathway split. V0 should implement these cases literally; no test semantics need to be inferred from the earlier summary.

---

# 1. Canonical test vocabulary

```
```

```
SecondaryPathway =
    used_secondhand
    | refurbished
    | unknown
```

```
```

```
ResultCapability =
    quantitative
    | range_quantitative
    | partial_quantitative
    | conditional
    | qualitative_only
    | insufficient_information
```

```
```

```
ImpactStatus =
    APPROVED
    | APPROVED_MODEL_SPECIFIC
    | APPROVED_SOURCE_SPECIFIC
    | APPROVED_SCENARIO_SPECIFIC
    | PROVISIONAL_GENERIC_RANGE
    | QUALITATIVE
    | UNKNOWN_NO_FALLBACK
    | EXCLUDED_UNQUANTIFIED
    | UNSUPPORTED
```

Primary secondary-device accounting mode:

```
```

```
accounting_mode = DIRECT_CUTOFF_PROSPECTIVE
```

Under this mode:

```
```

```
original_manufacturing_burden_of_secondary_device
    = excluded_from_direct_acquisition_burden
```

This exclusion is **not** an avoided-production credit.

---

# 2. Global secondary-pathway assertions

These apply to **every** `SEC-*` case.

```
```

```
A-SEC-GLOBAL-01:
used_secondhand != refurbished
```

```
```

```
A-SEC-GLOBAL-02:
prior manufacturing excluded under direct/cutoff
!= avoided new manufacturing credit
```

```
```

```
A-SEC-GLOBAL-03:
market_displacement_credit == null
unless an explicitly enabled consequential scenario supplies a valid coefficient
```

```
```

```
A-SEC-GLOBAL-04:
unknown environmental burden != 0
```

```
```

```
A-SEC-GLOBAL-05:
seller condition grade
must not derive service life
```

```
```

```
A-SEC-GLOBAL-06:
equivalent-service comparison requires adequate service over the common horizon
or a complete ServiceSequence
```

```
```

```
A-SEC-GLOBAL-07:
ADEME 7.61 kgCO2e
must never be a generic refurbished fallback
```

```
```

```
A-SEC-GLOBAL-08:
U.S. displacement coefficient 0.40
must never be applied to primary direct scoring
```

Any violation of `A-SEC-GLOBAL-01`, `02`, `03`, `04`, `06`, `07`, or `08` is **CRITICAL**.

---

# 3. SEC-01 — Direct private resale

## Purpose

Verify that simple resale without evidence of refurbishment enters the **used/second-hand** pathway.

## Exact input

```
```

```
case_id = "SEC-01"

replacement = {
    pathway_user_selection: "used_secondhand",

    seller_type: "private_person",

    process_evidence: {
        inspection_testing: false,
        cleaning: unknown,
        component_replacement: [],
        repair_processes: [],
        refurbishment_program: false
    },

    transfer: {
        method: "direct_private_resale",
        quantified_CO2e: null
    },

    expected_adequate_service: {
        low_years: null,
        expected_years: 2.0,
        high_years: null
    }
}
```

## Expected state

```
```

```
secondary_pathway = used_secondhand

original_manufacturing.status = PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF

refurbishment_process.status = NOT_EVIDENCED

transfer_CO2e.value = null
transfer_CO2e.status = UNKNOWN_NO_FALLBACK

market_displacement_credit = null
```

## Expected result capability

```
```

```
qualitative_only
```

unless other supported direct burdens independently allow a partial quantitative result.

## Assertions

```
```

```
A-SEC-01-01:
secondary_pathway == used_secondhand
```

```
```

```
A-SEC-01-02:
refurbishment_process must not be inferred
```

```
```

```
A-SEC-01-03:
prior_manufacturing must not enter direct acquisition total
```

```
```

```
A-SEC-01-04:
market_displacement_credit == null
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “Private resale means refurbished.” 
-  “Used phone has zero environmental burden.” 
-  “Because prior manufacturing is excluded, one new phone is avoided.” 
-  “Unknown transfer burden equals zero.” 

---

# 4. SEC-02 — Documented refurbishment with battery replacement

## Purpose

Verify classification as refurbished when structured preparation and component replacement are documented.

## Exact input

```
```

```
case_id = "SEC-02"

replacement = {
    pathway_user_selection: "refurbished",

    process_evidence: {
        inspection_testing: true,
        cleaning: true,
        refurbishment_program: true,

        component_replacement: [
            {
                type: "battery",
                model_specific_impact: null
            }
        ]
    },

    expected_adequate_service: {
        expected_years: 3.0
    }
}
```

## Expected state

```
```

```
secondary_pathway = refurbished

original_manufacturing.status = PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF

battery_replacement_CO2e = [0.3, 0.7]
battery_replacement_CO2e.status = PROVISIONAL_GENERIC_RANGE

inspection_testing_CO2e = null
cleaning_CO2e = null

refurb_total_direct_CO2e = null
```

The total remains unknown because inspection/cleaning/refurbisher operations are unquantified.

## Expected result capability

```
```

```
partial_quantitative
```

The battery intervention can be quantified as a range, but the complete refurbished direct footprint cannot.

## Assertions

```
```

```
A-SEC-02-01:
secondary_pathway == refurbished
```

```
```

```
A-SEC-02-02:
battery fallback [0.3,0.7] may be applied
```

```
```

```
A-SEC-02-03:
unknown inspection/cleaning burdens must not become zero
```

```
```

```
A-SEC-02-04:
refurb_total_direct_CO2e must remain null
unless all material included processes have supported burdens
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “Refurbished = used + exactly battery impact.” 
-  “Known battery burden makes total refurbished footprint known.” 
-  “Inspection and cleaning can silently be treated as zero.” 
-  “Refurbished always has exactly 0.3–0.7 kg CO₂e burden.” 

---

# 5. SEC-03 — Commercial listing labelled “used”

## Purpose

Ensure marketplace seller type does not itself imply refurbishment.

## Exact input

```
```

```
case_id = "SEC-03"

replacement = {
    listing_label: "used",
    seller_type: "commercial_reseller",

    documented_process: null,

    expected_adequate_service: {
        expected_years: 2.0
    }
}
```

## Expected state

```
```

```
secondary_pathway = used_secondhand

process_uncertainty = true

refurbishment_process = unknown

direct_secondary_CO2e = null
```

## Expected result capability

```
```

```
qualitative_only
```

## Assertions

```
```

```
A-SEC-03-01:
commercial_reseller must not imply refurbished
```

```
```

```
A-SEC-03-02:
listing_label "used" may map to used_secondhand
while preserving process_uncertainty=true
```

```
```

```
A-SEC-03-03:
unknown preparation processes must not be fabricated
```

## Severity

**MAJOR**

Upgrade to **CRITICAL** if V0 assigns a numerical refurbishment burden solely because seller is commercial.

## Prohibited interpretations

-  “Commercial reseller means refurbishment occurred.” 
-  “Used listing means no testing/cleaning could have occurred.” 
-  “Unknown seller operations equal zero.” 

---

# 6. SEC-04 — Refurbished listing with no applicable LCA

## Purpose

Verify that “refurbished” does not itself authorize a generic footprint.

## Exact input

```
```

```
case_id = "SEC-04"

replacement = {
    pathway_user_selection: "refurbished",

    marketplace_condition_label: "Excellent",

    process_evidence_id: null,
    model_specific_refurb_LCA: null,
    source_specific_reference_selected: null,

    expected_adequate_service: {
        expected_years: 3.0
    }
}
```

## Expected state

```
```

```
secondary_pathway = refurbished

refurb_direct_CO2e.value = null
refurb_direct_CO2e.status = UNKNOWN_NO_FALLBACK

ADEME_7_61_applied = false
```

## Expected result capability

```
```

```
qualitative_only
```

## Assertions

```
```

```
A-SEC-04-01:
refurbished label alone must not produce numerical footprint
```

```
```

```
A-SEC-04-02:
marketplace grade must not select an LCA
```

```
```

```
A-SEC-04-03:
ADEME 7.61 must not be applied
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “Any refurbished phone = 7.61 kg CO₂e.” 
-  “Excellent grade establishes environmental footprint.” 
-  “Refurbished automatically means quantified.” 

---

# 7. SEC-05 — Used-phone service life unknown

## Purpose

Ensure service-life uncertainty prevents a false equivalent-service comparison.

## Exact input

```
```

```
case_id = "SEC-05"

current_device = {
    adequacy_status: inadequate
}

replacement = {
    pathway: "used_secondhand",

    expected_adequate_service: {
        low_years: null,
        expected_years: null,
        high_years: null
    }
}

comparison = {
    common_service_horizon_years: 2.0
}
```

## Expected state

```
```

```
secondary_pathway = used_secondhand

used_service_life = null

equivalent_service_established = false

missing_required_fields includes:
    replacement.expected_adequate_service
```

## Expected result capability

```
```

```
insufficient_information
```

for a definitive used-vs-new or used-vs-refurbished comparison over the 2-year horizon.

## Assertions

```
```

```
A-SEC-05-01:
unknown used service life must remain unknown
```

```
```

```
A-SEC-05-02:
no seller/model/age default may substitute
```

```
```

```
A-SEC-05-03:
definitive equivalent-service ranking prohibited
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “Used phones last 2 years by default.” 
-  “Used service life equals seller warranty.” 
-  “A known device age determines remaining adequate service.” 

---

# 8. SEC-06 — Used transfer burden unavailable

## Purpose

Ensure absence of shipping/transfer evidence does not become zero burden.

## Exact input

```
```

```
case_id = "SEC-06"

replacement = {
    pathway: "used_secondhand",

    transfer: {
        required_for_transaction: true,
        mode: "parcel_delivery",
        quantified_CO2e: null,
        evidence_id: null
    },

    repairs: [],

    expected_adequate_service: {
        expected_years: 2.0
    }
}
```

## Expected state

```
```

```
transfer_CO2e.value = null
transfer_CO2e.status = UNKNOWN_NO_FALLBACK

used_direct_CO2e.value = null
```

## Expected result capability

```
```

```
qualitative_only
```

unless another known component supports a `partial_quantitative` result.

## Assertions

```
```

```
A-SEC-06-01:
parcel delivery without evidence must not be 0
```

```
```

```
A-SEC-06-02:
study-specific 0.475 kgCO2e transaction value must not be imported as generic fallback
```

```
```

```
A-SEC-06-03:
used_direct_CO2e remains null where material transfer burden is unresolved
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “Unknown shipping = zero.” 
-  “All second-hand transactions use 0.475 kg CO₂e.” 
-  “Used acquisition footprint can always be calculated generically.” 

---

# 9. SEC-07 — ADEME reference explicitly selected

## Purpose

Verify that the ADEME refurbished value is allowed only as an explicit source-specific reference scenario.

## Exact input

```
```

```
case_id = "SEC-07"

replacement = {
    pathway: "refurbished",

    source_specific_reference: {
        source_id: "ADEME_REFURB_SMARTPHONE_REFERENCE",
        explicitly_selected: true
    },

    expected_adequate_service: {
        expected_years: 2.0
    }
}
```

## Expected state

```
```

```
refurb_direct_reference_CO2e.value = 7.61
refurb_direct_reference_CO2e.unit = "kgCO2e"
refurb_direct_reference_CO2e.status = APPROVED_SOURCE_SPECIFIC

reference_second_life_years = 2.0

decomposable = false

generic_default = false
```

## Expected result capability

```
```

```
quantitative
```

**only for that explicitly labelled source-specific reference scenario.**

## Assertions

```
```

```
A-SEC-07-01:
explicit ADEME selection permits 7.61
```

```
```

```
A-SEC-07-02:
output must retain ADEME/source-specific label
```

```
```

```
A-SEC-07-03:
decomposable == false
```

```
```

```
A-SEC-07-04:
generic_default == false
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “7.61 kg is the footprint of the user's arbitrary refurbished phone.” 
-  “The 7.61 kg total can be decomposed into stages without source evidence.” 
-  “Generic transport/charging may be added to 7.61 automatically.” 

---

# 10. SEC-08 — ADEME not explicitly applicable

## Purpose

Verify the source-specific reference never leaks into generic refurbished calculations.

## Exact input

```
```

```
case_id = "SEC-08"

replacement = {
    pathway: "refurbished",

    exact_model: "arbitrary_model",

    source_specific_reference: null,
    model_specific_refurb_LCA: null,

    expected_adequate_service: {
        expected_years: 2.0
    }
}
```

## Expected state

```
```

```
refurb_direct_CO2e.value = null
refurb_direct_CO2e.status = UNKNOWN_NO_FALLBACK

ADEME_7_61_applied = false
```

## Expected result capability

```
```

```
qualitative_only
```

## Assertions

```
```

```
A-SEC-08-01:
absence of applicable evidence -> refurb_direct_CO2e=null
```

```
```

```
A-SEC-08-02:
7.61 must not be selected by pathway name alone
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “All refurbished phones inherit the ADEME reference.” 
-  “Two-year expected use makes ADEME automatically applicable.” 
-  “Similar product category is enough for exact numerical substitution.” 

---

# 11. SEC-09 — Used handset too short-lived, next event unknown

## Purpose

Verify `ServiceSequence` prevents truncated comparisons.

## Exact input

```
```

```
case_id = "SEC-09"

comparison = {
    common_service_horizon_years: 3.0
}

replacement = {
    pathway: "used_secondhand",

    expected_adequate_service: {
        expected_years: 0.5
    }
}

next_event_after_secondary_failure = null
```

## Expected state

```
```

```
service_sequence_required = true

covered_service_years = 0.5

uncovered_service_years = 2.5

next_event = unknown
```

## Expected result capability

```
```

```
insufficient_information
```

## Assertions

```
```
```
A-SEC-09-01:
comparison must not stop at 0.5 years
```

```
```

```
A-SEC-09-02:
ServiceSequence.required == true
```

```
```

```
A-SEC-09-03:
unknown next event must not default to buy_new
```

```
```

```
A-SEC-09-04:
definitive ranking prohibited
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “Used option wins because only its first 0.5 years are counted.” 
-  “Next event can be ignored.” 
-  “After used-phone failure, assume a new phone automatically.” 

---

# 12. SEC-10 — Refurbished phone with complete known process footprint

## Purpose

Verify quantitative comparison is permitted when both refurbishment burden and adequate service are sufficiently bounded.

## Exact input

```
```

```
case_id = "SEC-10"

comparison = {
    common_service_horizon_years: 3.0
}

replacement = {
    pathway: "refurbished",

    expected_adequate_service: {
        expected_years: 3.0
    },

    applicable_refurbishment_evidence: {
        process_boundary_complete_for_direct_V0: true,
        aggregate_direct_CO2e: 7.61,
        source_id: "ADEME_REFURB_SMARTPHONE_REFERENCE",
        source_specific: true,
        decomposable: false
    }
}
```

## Expected state

```
```

```
service_sequence_required = false

adequate_service_coverage_years = 3.0

refurb_direct_CO2e = 7.61
refurb_direct_CO2e.status = APPROVED_SOURCE_SPECIFIC

equivalent_service_established = true
```

## Expected result capability

```
```

```
quantitative
```

for the source-specific scenario.

## Assertions

```
```

```
A-SEC-10-01:
known burden + full adequate horizon permits quantitative comparison
```

```
```

```
A-SEC-10-02:
source-specific boundary must remain attached to value
```

```
```

```
A-SEC-10-03:
do not add undocumented refurbishment stages outside source boundary
```

## Severity

**MAJOR**

Becomes **CRITICAL** if V0 strips the source-specific label or double counts stages.

## Prohibited interpretations

-  “Any 3-year refurbished phone can use 7.61.” 
-  “A source aggregate may be freely decomposed.” 
-  “Charging/transport may be added without checking boundary compatibility.” 

---

# 13. SEC-11 — Used and refurbished both unquantified

## Purpose

Verify V0 does not invent a numerical winner when neither secondary pathway has a defensible complete direct footprint.

## Exact input

```
```

```
case_id = "SEC-11"

used_candidate = {
    pathway: "used_secondhand",

    expected_adequate_service: {
        expected_years: 2.0
    },

    transfer_CO2e: null,
    repair_CO2e: null
}

refurbished_candidate = {
    pathway: "refurbished",

    expected_adequate_service: {
        expected_years: 2.0
    },

    refurb_direct_CO2e: null
}

comparison = {
    common_service_horizon_years: 2.0
}
```

## Expected state

```
```

```
used.direct_CO2e = null
refurbished.direct_CO2e = null

used.reuses_existing_device = true
refurbished.reuses_existing_device = true

numeric_winner = null
```

## Expected result capability

```
```

```
qualitative_only
```

## Allowed qualitative statement

> Both pathways extend use of an already-manufactured handset. Used resale may involve fewer preparation processes, while refurbishment may involve additional inspection, repairs or replacement parts and may also provide different remaining service. The available evidence does not support an exact numerical ranking here.

## Assertions

```
```

```
A-SEC-11-01:
numeric_winner == null
```

```
```

```
A-SEC-11-02:
used must not automatically rank below refurbished
```

```
```

```
A-SEC-11-03:
refurbished must not automatically rank below used
```

```
```

```
A-SEC-11-04:
qualitative reuse advantage over new whole-device manufacturing
must not become a fabricated CO2 number
```

## Severity

**CRITICAL**

## Prohibited interpretations

- `used < refurbished < new` as a universal numeric ordering. 
-  “Refurbished is always better because it is professionally repaired.” 
-  “Used is always better because less processing occurs.” 
-  Any invented zero/default footprint used to break the tie. 

---

# 14. SEC-12 — Personal counterfactual is “buy new”

## Purpose

Verify that personal substitution is stored separately from market displacement.

## Exact input

```
```

```
case_id = "SEC-12"

replacement = {
    pathway: "used_secondhand",

    personal_counterfactual_if_unavailable: "buy_new",

    market_context: {
        geography: "unspecified"
    }
}
```

## Expected state

```
```

```
personal_purchase_substitution = "buy_new"

market_displacement_credit = null

avoided_new_production_CO2e = null

US_displacement_coefficient_applied = false
```

## Expected result capability

No downgrade is required solely because consequential credit is absent.

Primary direct result remains governed by the direct pathway evidence.

## Assertions

```
```

```
A-SEC-12-01:
personal counterfactual must be stored
```

```
```

```
A-SEC-12-02:
personal counterfactual buy_new
!= one new phone displaced
```

```
```

```
A-SEC-12-03:
market_displacement_credit == null
```

```
```

```
A-SEC-12-04:
D_US_0_40 must not apply without explicit US consequential scenario
```

## Severity

**CRITICAL**

## Prohibited interpretations

-  “The user would have bought new, therefore one new phone was prevented.” 
-  “98% substitution response means displacement coefficient 0.98.” 
-  “Use `D=0.40` globally.” 
-  “Subtract new-production footprint from the direct secondary-device score.” 

---

# 15. Release-critical matrix

All 12 cases should run, but the following are **release-blocking CRITICAL semantics**:

```
```

```
SEC-01
SEC-02
SEC-04
SEC-05
SEC-06
SEC-07
SEC-08
SEC-09
SEC-11
SEC-12
```

`SEC-03` and `SEC-10` are `MAJOR` under their normal failure modes, with the escalation rules specified above.

---

# 16. Severity definitions

```
```

```
CRITICAL:
A failure can reverse or fabricate the environmental comparison,
create unsupported quantitative precision,
double-count/credit manufacturing,
or erase material uncertainty.
```

```
```

```
MAJOR:
A failure materially misclassifies evidence/provenance/pathway semantics
without necessarily fabricating the final environmental ranking.
```

```
```

```
MINOR:
Presentation/provenance formatting issue with calculation semantics intact.
```

Any CRITICAL failure blocks pathway-split release.

---

# 17. Global prohibited interpretations

The `SEC-*` suite must reject all of the following:

1. `used_secondhand == refurbished`. 
2.  Used handset = zero direct environmental burden. 
3.  Refurbished handset = ADEME `7.61 kg CO₂e` by default. 
4.  Commercial resale automatically means refurbishment. 
5.  Refurbished listing guarantees a known process boundary. 
6.  Marketplace grade establishes remaining service life. 
7.  Used-phone age establishes remaining adequate life. 
8.  Unknown transfer/refurbishment burden = zero. 
9.  A study-specific transaction logistics value is a universal default. 
10.  Battery replacement alone equals total refurbishment footprint. 
11.  Prior manufacturing excluded under cut-off = avoided manufacturing credit. 
12.  One secondary transaction = one new phone displaced. 
13.  Personal `buy_new` counterfactual = `D=1`. 
14. `0.98` survey substitution probability = market displacement coefficient. 
15.  U.S. `D≈0.40` applies outside its explicit scenario. 
16.  Used is always lower-carbon than refurbished. 
17.  Refurbished is always lower-carbon than used. 
18.  Short-lived secondary options may be compared without subsequent events. 
19.  A source-specific aggregate can be decomposed without stage evidence. 
20.  Refurbished/used qualitative reuse benefit may be converted into an invented CO₂ credit. 

---

# 18. Minimum machine-readable expected structure

V0 can encode each result with:

```
```

```
SecondaryPathwayTestResult {
    case_id
    passed

    observed {
        secondary_pathway
        direct_CO2e
        direct_CO2e_status
        prior_manufacturing_status
        service_sequence_required
        equivalent_service_established
        market_displacement_credit
        result_capability
    }

    failed_assertion_ids[]
    severity_if_failed
}
```

A complete run passes only when:

```
```

```
case_count == 12
failed_CRITICAL_assertions == 0
```

---

# 19. Assertion index

```
```

```
A-SEC-01-01
A-SEC-01-02
A-SEC-01-03
A-SEC-01-04

A-SEC-02-01
A-SEC-02-02
A-SEC-02-03
A-SEC-02-04

A-SEC-03-01
A-SEC-03-02
A-SEC-03-03

A-SEC-04-01
A-SEC-04-02
A-SEC-04-03

A-SEC-05-01
A-SEC-05-02
A-SEC-05-03

A-SEC-06-01
A-SEC-06-02
A-SEC-06-03

A-SEC-07-01
A-SEC-07-02
A-SEC-07-03
A-SEC-07-04

A-SEC-08-01
A-SEC-08-02

A-SEC-09-01
A-SEC-09-02
A-SEC-09-03
A-SEC-09-04

A-SEC-10-01
A-SEC-10-02
A-SEC-10-03

A-SEC-11-01
A-SEC-11-02
A-SEC-11-03
A-SEC-11-04

A-SEC-12-01
A-SEC-12-02
A-SEC-12-03
A-SEC-12-04
```

Plus:

```
```

```
A-SEC-GLOBAL-01
A-SEC-GLOBAL-02
A-SEC-GLOBAL-03
A-SEC-GLOBAL-04
A-SEC-GLOBAL-05
A-SEC-GLOBAL-06
A-SEC-GLOBAL-07
A-SEC-GLOBAL-08
```

---

# 20. Implementation pass/fail rule

```
```

```
PASS =
    all SEC-01..SEC-12 executed
    AND zero failed CRITICAL assertions
    AND pathway split preserved
    AND no unsupported generic secondary-device CO2 default introduced
```

```
```

```
FAIL =
    any CRITICAL assertion fails
    OR used/refurbished collapse to one pathway
    OR ADEME 7.61 becomes generic
    OR unknown process burden becomes zero
    OR displacement credit enters primary score
    OR truncated service sequence changes ranking
```

---

## Status

**Case count:** 12

**Case range:** `SEC-01`–`SEC-12`

**Semantics:** complete

**Ready for V0 implementation:** yes

**New generic CO₂ defaults authorized:** none

**Primary market-displacement credits authorized:** none

### Requested action

V0 should add these exact twelve cases to the regression suite before implementing the used/refurbished pathway separation. A pathway-split build should not be accepted if any `CRITICAL` assertion fails.