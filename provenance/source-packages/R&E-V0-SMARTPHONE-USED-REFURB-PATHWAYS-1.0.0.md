## Research & Evidence → V0 — Cloud Prototype

# CROSS-WORKSTREAM HANDOFF

**Package:** `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0`

**Parent:** `R&E-V0-SMARTPHONE-1.0.0`

**Status:** `IMPLEMENTATION_READY`

### Determination

**Used/second-hand and refurbished should be represented as separate V0 pathways.**

The distinction is not primarily commercial wording; it is a **process-boundary distinction**.

A used/second-hand phone may simply pass from one user to another. A refurbished phone may additionally undergo inspection, testing, cleaning, repair, replacement of parts, packaging and logistics before second use. Current smartphone reuse research explicitly models ordinary second-hand transactions and refurbishment as separate terms, and ITU-T L.1410 assigns refurbishment production processes to the next life cycle. 

V0 should therefore use:

```
```

```
replacement_pathway =
    "used_secondhand"
    | "refurbished"
    | "new"
```

not one combined `"used/refurbished"` pathway.

---

# 1. Shared principle for both secondary pathways

Both pathways reuse an already-manufactured handset.

For prospective V0 accounting, the original manufacturing burden is **not automatically charged again in full** to the second user's direct acquisition decision.

But neither pathway is environmentally “free,” and neither may automatically receive:

```
```

```
-1 new phone manufactured
```

as a consequential credit.

The 2026 U.S. smartphone market study found an empirical displacement rate of about **0.40 new devices per second-hand transaction**, despite 98% of surveyed second-hand purchasers reporting that they would otherwise have bought new. It also found shorter possession times offset part of the potential benefit. This demonstrates why personal substitution and market displacement must remain distinct. 

---

# 2. Pathway A — Used / second-hand

## 2.1 Definition

Use this pathway when the handset is transferred for another user's use **without evidence of a substantive refurbishment process**.

Examples:

-  direct private sale; 
-  gift; 
-  family/friend hand-down; 
-  marketplace resale; 
-  reseller transaction where only ordinary transfer/handling is known; 
-  used phone sold “as-is.” 

Stored classification:

```
```

```
USED_SECONDHAND {
    existing_device_reused = true
    refurbishment_process_known = false
}
```

A commercial seller calling something “used” is not enough to prove zero processing; where actual treatment is unknown, preserve that uncertainty.

---

# 3. Used-phone system boundary

## Direct/prospective boundary

Include only additional burdens caused by placing that existing handset into the second use **where supported**:

```
```

```
used_direct_burden =
    known_transfer_transport
    + known_packaging
    + known_pre_use_repair_or_parts
    + charging_during_second_use
```

The previous handset manufacture is:

```
```

```
historical manufacturing
```

and is not automatically re-added in a cut-off/direct prospective view.

Likewise, generic future EOL remains excluded/unquantified under the existing V0 rule.

---

# 4. Used-phone transfer/transport

V0 currently has **no approved generic second-hand shipping factor**.

The 2026 U.S. study used a study-specific assumption of 0.475 kg CO₂e per transaction based on a 0.5 kg parcel, 500 km land shipment, and ecoinvent data. That is useful as evidence that transaction logistics are non-zero, but it is not a defensible universal V0 shipping default. 

Therefore:

```
```

```
used.transfer_CO2e:
    EVIDENCE_LOOKUP
    | OPTIONAL_EXPERT_OVERRIDE
    | MUST_REMAIN_UNKNOWN
```

No generic shipping burden is currently authorized.

For face-to-face/private hand-down:

```
```

```
additional_transfer_transport
```

may be negligible in practice, but V0 should not encode an exact zero unless the boundary explicitly excludes incidental travel or there is no additional transport event attributable to the transaction.

---

# 5. Used-phone repair burden

If a used phone is repaired before transfer:

```
```

```
used + repair
```

must no longer be modelled as “pure resale only.”

Apply the existing repair logic:

```
```

```
battery:
    lookup -> fallback 0.3–0.7 kg CO2e

display:
    lookup -> fallback 3–8 kg CO2e

major_board:
    lookup -> otherwise unknown

other repair:
    lookup -> otherwise unknown
```

If multiple parts/processes are known:

```
```

```
sum only supported non-overlapping burdens
```

Do not assume undocumented refurbishment.

---

# 6. Used-phone direct carbon quantification

A generic direct used-phone footprint is **not approved**.

Therefore:

```
```

```
generic_used_phone_direct_CO2e = null
```

because V0 lacks a generic evidence-supported package covering:

-  transfer logistics; 
-  packaging; 
-  testing; 
-  incidental repair; 
-  seller operations. 

If these are all absent/explicitly outside the boundary, V0 may describe the direct acquisition burden qualitatively as low relative to whole-device manufacturing, but should not fabricate an exact `0 kg CO₂e`.

### Quantitative result permitted when

All material direct processes are known or intentionally excluded by a transparent boundary:

```
```

```
used_direct_CO2e =
    supported transfer
    + supported repair
    + supported other preparation
```

Otherwise:

```
```

```
result_capability =
    qualitative_only
    or partial_quantitative
```

depending on what is known.

---

# 7. Used-phone allocation treatment

Three views must stay separate.

## A. Direct/cut-off V0 view — primary

```
```

```
prior manufacturing allocated to first life = not charged again
```

Only second-use preparation/transfer/service burdens are included.

This is the preferred **prospective direct decision view**.

## B. Lifecycle/depreciation allocation

A share of original manufacturing may be attributed to later life if an explicit allocation method is selected.

Current numeric V0 status:

```
```

```
DISABLED
```

because no single accepted generic depreciation function has been frozen.

## C. Consequential market displacement

Potential reduction in future new-device production.

Current primary status:

```
```

```
credit = disabled
```

The U.S. `D=0.40` may appear only as a labelled market-specific scenario, never as direct attribution. 

---

# 8. Used-phone service-life assumption

Required user/scenario input:

```
```

```
used.expected_adequate_service = USER_PROVIDED
```

Question:

> “How long do you realistically expect this used phone to remain adequate for you?”

No default from:

-  phone age; 
-  seller claim; 
-  marketplace grade; 
-  price; 
-  model prestige. 

The 2026 smartphone study shows that actual possession/lifetime patterns materially affect reuse benefits, including rebound from shorter use periods. 

If expected service is unknown and functional equivalence depends on it:

```
```

```
result = insufficient_information
```

If bounded:

```
```

```
compare across bounds
```

and return `conditional` if ranking flips.

---

# 9. Used-phone old age

Device age may be collected if known, but:

```
```

```
used_phone_age -> remaining_service
```

is prohibited.

If first-use age is unavailable:

```
```

```
MUST_REMAIN_UNKNOWN
```

Do not derive exact device age merely from model launch year.

---

# 10. Pathway B — Refurbished

## 10.1 Definition

Use this pathway when there is evidence that the handset has undergone a structured preparation process for second use, such as some combination of:

-  inspection; 
-  diagnostics/testing; 
-  cleaning; 
-  data wiping; 
-  repair; 
-  systematic or conditional component replacement; 
-  functional grading; 
-  packaging; 
-  reseller/refurbisher operations. 

ITU-T L.1410 explicitly states that environmental impact associated with the refurbishment production process that makes the device fit for second use belongs in the **production stage of the next life**. 

---

# 11. Refurbished system boundary

Primary direct/cut-off view:

```
```

```
refurb_direct_burden =
    inspection/testing
    + cleaning
    + repairs/replacement parts
    + refurbishing energy/processes
    + packaging/accessories
    + attributable transport/logistics
    + charging during second use
```

but only to the extent those stages are supported by the selected source.

Past original manufacture:

```
```

```
not automatically charged again
```

in the direct/cut-off view.

---

# 12. Why refurbished cannot use the used-phone boundary

ADEME found large variation in refurbished-product impacts because practices differ in:

-  service-life extension; 
-  new accessories; 
-  systematic versus selective replacement of parts; 
-  use of second-hand parts; 
-  packaging quantity/material; 
-  sourcing market; 
-  refurbishment location.  

Therefore:

```
```

```
refurbished ≠ used + generic constant
```

and:

```
```

```
used ≠ refurbished with zero repair
```

unless actual process evidence supports those equivalences.

---

# 13. Refurbished direct carbon quantification

## Generic arbitrary refurbished phone

```
```

```
generic_refurb_direct_CO2e = null
```

No universal direct-footprint fallback is approved.

ADEME's sector evidence supports the **direction** that refurbished smartphones generally have lower annual environmental impact than new equivalents under its studied scenarios, but it also reports factors-of-2-to-11 variation in refurbishment practices. 

Therefore V0 must not turn ADEME averages into an arbitrary-device footprint.

---

# 14. ADEME reference

Existing V0 treatment remains:

```
```

```
ADEME_REFURB_REFERENCE {
    value = 7.61 kg CO2e
    second_life_reference = 2 years
    accounting = source_specific / cut_off_reference
    decomposable = false
    generic_default = false
}
```

It may be shown as:

> “In ADEME's reference refurbished-smartphone scenario…”

It may not be shown as:

> “A refurbished phone emits 7.61 kg.”

Because refurbishment practices vary materially. ADEME explicitly identifies those process differences as major drivers of impact. 

---

# 15. Refurbished allocation treatment

## Direct/cut-off — primary V0

Prior manufacture belongs to prior life; second-life refurbishment processes belong to the next life.

This aligns with ITU-T L.1410's second-life boundary description. 

## Depreciation/lifecycle attribution — optional methodology

ITU-T L.1410 also describes a depreciation approach in which part of first-life manufacturing/EOL may be imputed to a refurbished second life when first use is shorter than a hypothetical first lifetime. 

Current V0 numeric status:

```
```

```
DISABLED
```

unless the exact method and all required first-life inputs are explicitly implemented.

Do not mix direct/cut-off and depreciation totals.

## Consequential displacement

Same rule as used:

```
```

```
disabled in primary score
```

No 1:1 new-production credit.

---

# 16. Refurbished service-life assumption

Required:

```
```

```
refurbished.expected_adequate_service = USER_PROVIDED
```

where functional-equivalent comparison needs it.

No default from:

```
```

```
Excellent
Grade A
Premium
12-month warranty
```

ADEME itself identifies total lifetime extension as one of the major determinants of refurbishment benefit. 

If V0 lacks expected second-life service:

```
```

```
quantitative comparison may be conditional/insufficient
```

especially where a refurbished option may require an additional acquisition before the comparison horizon ends.

---

# 17. Refurbishment process evidence requirements

To produce a device-specific quantitative refurbished direct burden, require one of:

```
```

```
A. approved product/refurbisher-specific LCA
B. documented bill of refurbishment processes and supported process/part burdens
C. explicitly selected source-specific reference scenario
```

Minimum process metadata should include where applicable:

```
```

```
RefurbishmentEvidence {
    source_id
    model_scope
    process_boundary
    testing_cleaning_included
    repair_parts[]
    replacement_parts[]
    accessories_included
    packaging_included
    inbound_transport_included
    outbound_transport_included
    refurbishing_energy_included
    second_use_charging_included
    allocation_method
    reference_second_life
}
```

If these are not known, do **not** decompose a published aggregate.

---

# 18. Marketplace classification rules

V0 should ask:

> “Is the replacement used/second-hand, refurbished, or new?”

Plain explanation:

**Used / second-hand:** previously owned, being resold/transferred without a known refurbishment process.

**Refurbished:** previously owned and professionally or systematically inspected/prepared for resale, potentially including repairs or replaced parts.

### When user doesn't know

```
```

```
secondary_condition = unknown
```

Do not automatically classify a reseller product as refurbished.

If the distinction materially changes quantification:

```
```

```
result = qualitative_only
or insufficient_information
```

---

# 19. Direct/prospective burden matrix

| BurdenUsed/second-handRefurbished |                                                                |                                         |
| --------------------------------- | -------------------------------------------------------------- | --------------------------------------- |
| Original manufacturing            | excluded in primary direct/cut-off                             | excluded in primary direct/cut-off      |
| Transfer/shipping                 | include if supported                                           | include if supported                    |
| Packaging                         | include if supported                                           | include if supported                    |
| Inspection/testing                | normally absent/unknown                                        | include if source covers it             |
| Cleaning                          | normally absent/unknown                                        | include if source covers it             |
| Repair parts                      | include if actually performed                                  | include if actually performed           |
| Systematic component replacement  | no assumption                                                  | potentially material; evidence required |
| Refurbisher operational energy    | no assumption                                                  | include if supported                    |
| Accessories                       | no assumption                                                  | include if supported                    |
| Charging                          | separate, currently CO₂e unquantified absent valid grid factor | same                                    |
| Generic EOL climate               | excluded/unquantified                                          | excluded/unquantified                   |
| Production-displacement credit    | disabled                                                       | disabled                                |

---

# 20. What can V0 quantify today?

## Used / second-hand

### Can quantify

-  supported repair parts/processes; 
-  known transfer burden if evidence supplied; 
-  physical old-device fate/waste quantities; 
-  charging kWh; 
-  model-specific data where available. 

### Cannot generically quantify

```
```

```
total direct used-phone acquisition CO2e
```

because no generic transaction/process package is approved.

### Allowed V0 output

Often:

```
```

```
qualitative or partially quantitative
```

with:

> This pathway reuses an already-manufactured handset and does not introduce a new whole-device manufacturing event in the direct prospective accounting. Additional transfer/repair burdens are not fully quantified.

That is defensible.

---

# 21. What can refurbished quantify today?

### Can quantify

-  explicit ADEME reference scenario when deliberately selected; 
-  approved source-specific refurb LCAs; 
-  supported individual repair components/processes where boundaries are known. 

### Cannot generically quantify

```
```

```
arbitrary refurbished phone footprint
```

because refurbishment processes vary too strongly.

### Allowed output

If no applicable direct footprint exists:

```
```

```
qualitative_only
```

with:

> Refurbishment extends the use of an existing handset but adds inspection/repair/logistics burdens whose magnitude depends on the actual refurbishment process.

ADEME supports that the process typically remains much lower-impact than new manufacturing in the studied cases, while also showing substantial process variation. 

---

# 22. Comparison between used and refurbished

V0 must **not** hard-code:

```
```

```
used < refurbished < new
```

for climate.

Used often has fewer direct preparation processes, but a refurbished phone might:

-  have a replaced battery; 
-  be more likely to provide longer adequate service; 
-  avoid an early subsequent replacement. 

Conversely, extensive refurbishment can involve substantial parts/process burdens.

Therefore the valid comparison is:

```
```

```
direct intervention burden
+
adequate service delivered
+
foreseeable subsequent events
```

over an equivalent horizon.

If service-life differences are unknown:

```
```

```
USED vs REFURBISHED = CONDITIONAL / UNKNOWN
```

not an automatic winner.

---

# 23. Sequence rules

Example:

```
```

```
used phone:
    no known repair
    expected adequate use = 0.75 years

refurbished phone:
    battery replaced
    expected adequate use = 3 years
```

A comparison that only counts initial transaction burden is invalid if the used phone needs another acquisition after 0.75 years.

Apply existing `ServiceSequence`.

Likewise, a long-lived used handset can outperform a more heavily refurbished alternative.

---

# 24. Displacement wording

For either pathway, approved user-facing wording:

> “Choosing an existing phone can contribute to reducing demand for new production.”

Or:

> “In your personal decision, this option substitutes for buying new if that is what you would otherwise do.”

Do not say:

> “This purchase prevents one new phone from being manufactured.”

The U.S. 2026 market study estimates `0.40` new devices displaced per second-hand transaction in its specific market model, not `1.0`, and explicitly separates this from the 98% personal purchase-substitution response. 

---

# 25. Market terminology

The 2026 evidence treats “second-hand” broadly as resale/transfer for subsequent users and then separately adds refurbishment burdens for the subset of transactions involving refurbishment. In that study, 22% of second-hand purchasers reported buying refurbished, and the authors model refurbishment emissions separately. 

This directly supports the V0 architecture:

```
```

```
SECONDARY_DEVICE
    ├── USED_SECONDHAND
    └── REFURBISHED
```

rather than one undifferentiated node.

---

# 26. Input amendments

Replace:

```
```

```
replacement.type =
    refurbished
    | new
```

with:

```
```

```
replacement.type =
    used_secondhand
    | refurbished
    | new
    | compare_multiple
    | unspecified
```

Add:

```
```

```
SecondaryDeviceInput {
    pathway:
        used_secondhand
        | refurbished
        | unknown

    manufacturer?
    model?
    variant?
    device_age_years?
    marketplace_condition_label?

    expected_adequate_service {
        low_years
        expected_years
        high_years
    }

    known_repairs_or_replacements[]

    transfer_method?
    process_evidence_id?
}
```

---

# 27. Used evidence state

```
```

```
UsedPathwayEvidence {
    prior_manufacturing:
        status = SUNK_OR_PRIOR_LIFE

    transaction_CO2e:
        evidence_lookup | unknown

    repair_CO2e:
        existing repair rules

    direct_total_CO2e:
        calculable only if material processes sufficiently bounded

    lifecycle_allocation:
        disabled

    market_displacement_credit:
        disabled_primary

    result_capability:
        quantitative
        | partial_quantitative
        | qualitative_only
        | conditional
        | insufficient_information
}
```

---

# 28. Refurbished evidence state

```
```

```
RefurbishedPathwayEvidence {
    prior_manufacturing:
        status = PRIOR_LIFE_UNDER_CUTOFF

    refurb_process_CO2e:
        source_specific_lookup | unknown

    ADEME_reference:
        optional_source_scenario

    lifecycle_depreciation:
        disabled

    market_displacement_credit:
        disabled_primary

    result_capability:
        quantitative
        | partial_quantitative
        | qualitative_only
        | conditional
        | insufficient_information
}
```

---
# 29. Conditions requiring unknown / qualitative result

## Used

Return `qualitative_only` or `insufficient_information` when:

-  transaction preparation/repair is materially unknown; 
-  service life is unknown and affects equivalent service; 
-  a short second use requires a subsequent acquisition whose type is unknown; 
-  the device is labelled “used” but substantial preparation may have occurred and is not documented. 

## Refurbished

Return qualitative/unknown when:

-  no applicable refurbishment LCA/process inventory exists; 
-  source boundary is unclear; 
-  published aggregate cannot be decomposed safely; 
-  second-life duration is unknown and matters to comparison; 
-  refurbishment grade is the only evidence; 
-  original manufacturing allocation is requested but first-life/depreciation data are unavailable. 

## Both

No exact production-displacement benefit unless an explicit consequential market scenario is enabled.

---

# 30. Prohibited inferences

V0 must not infer:

-  used phone = zero environmental burden; 
-  refurbished phone = ADEME 7.61 kg by default; 
-  refurbished = used plus battery replacement; 
-  seller “excellent” grade = quantified remaining life; 
-  professional reseller = necessarily refurbished; 
-  used < refurbished climate impact regardless of service duration; 
-  refurbished < used because “better condition”; 
-  one used/refurb transaction = one new device avoided; 
-  U.S. displacement coefficient applies globally; 
-  prior manufacturing should simultaneously be excluded under cut-off **and** credited as avoided manufacturing; 
-  refurbishment aggregate may be decomposed without source-stage evidence. 

---

# 31. Regression additions

```
```

```
SEC-01:
direct private resale, no refurbishment evidence
→ pathway = used_secondhand
```

```
```

```
SEC-02:
documented inspection + battery replacement + resale
→ pathway = refurbished
```

```
```

```
SEC-03:
commercial listing says "used", process unknown
→ pathway = used_secondhand with process uncertainty
→ no refurb impact inferred
```

```
```

```
SEC-04:
commercial listing says "refurbished", no applicable LCA
→ refurb direct_CO2e = null
```

```
```

```
SEC-05:
used service life unknown
→ no definitive used-vs-new quantitative ranking where service equality matters
```

```
```

```
SEC-06:
used direct transfer has no quantified shipping evidence
→ shipping=null, not zero
```

```
```

```
SEC-07:
ADEME reference selected explicitly
→ 7.61 reference allowed
```

```
```

```
SEC-08:
ADEME not explicitly applicable
→ 7.61 forbidden as default
```

```
```

```
SEC-09:
used=0.5y + next purchase unknown
→ ServiceSequence required
→ insufficient_information
```

```
```

```
SEC-10:
refurb=3y with known process footprint
→ sequence/quantitative comparison permitted
```

```
```

```
SEC-11:
used and refurb both lack direct footprint but reuse existing devices
→ qualitative comparison only
→ no arbitrary numerical winner
```

```
```

```
SEC-12:
personal counterfactual = buy_new
→ store substitution
→ market displacement credit remains null
```

All are regression-critical for pathway separation.

---

# 32. Evidence status

**High confidence:**

-  second-hand reuse and refurbishment are physically/accountingly distinct; 
-  refurbishment burdens belong to second-life production under ITU-T L.1410; 
-  second-hand displacement is not generically 1:1; 
-  service duration materially affects reuse benefit.  

**Moderate/high confidence:**

-  refurbished processes can vary substantially in burden according to repairs, accessories, packaging, supply and location; ADEME documents large variability.  

**Unsupported generically:**

-  one exact used-phone transaction footprint; 
-  one universal refurbished footprint; 
-  exact used-vs-refurb ranking without process/service evidence. 

---

## Requested V0 action

Implement **used/second-hand and refurbished as separate pathways now**.

The public journey should distinguish them without forcing detailed expert questions:

> **Used / second-hand** — previously owned and being resold or passed on without a known refurbishment process.

> **Refurbished** — previously owned and inspected/prepared for resale, potentially including repairs or replaced parts.

Where the user cannot distinguish them:

```
```

```
secondary pathway = unknown
```

and V0 should preserve uncertainty rather than assign a footprint.

No additional generic CO₂ factor is authorized by this handoff.