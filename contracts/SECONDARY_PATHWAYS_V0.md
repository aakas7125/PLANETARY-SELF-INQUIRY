# Secondary Pathways V0 Contract

Status: **Accepted canonical contract**

Authority: `R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0`, accepted through PR #3 merge `024a95392d2e1555a3c9b598fdc291bd341c3d6b`; exact tests are in `R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0`.

## Pathway split and direct boundary

`used_secondhand`, `refurbished`, and `new` are distinct. Used means an existing handset transferred without evidence of substantive refurbishment. Refurbished requires evidence of structured inspection/preparation, potentially testing, cleaning, repair, replacement parts, packaging, logistics or refurbisher operations. A commercial seller or marketplace label alone does not establish refurbishment; unknown stays unknown.

Primary accounting is `DIRECT_CUTOFF_PROSPECTIVE`: original manufacture is prior-life burden excluded from direct second-life acquisition, which is not an avoided-new-production credit. For either secondary pathway, direct burdens include only supported additional preparation, repair, transport, packaging and second-use charging. Generic EOL climate remains excluded/unquantified.

## Used / second-hand

Generic used acquisition CO2e is null. No generic shipping factor is approved; the study-specific 0.475 kg CO2e transaction assumption is not a V0 fallback. Face-to-face transfer is not a numerical zero unless the boundary expressly supports it. Known repairs use applicable repair logic; major-board value remains unknown absent an applicable model-specific source. A quantitative result requires all material direct processes to be known or transparently excluded; otherwise result capability is `qualitative_only` or `partial_quantitative`.

Expected adequate service is user-provided. Device age, seller claim, warranty, price, grade or model launch date cannot supply a default. If service is unknown or shorter than the shared horizon, use a complete `ServiceSequence`; unknown next event yields `insufficient_information`, never a truncated winner.

## Refurbished

Generic arbitrary refurbished direct CO2e is null. Quantitative direct burden requires an approved product/refurbisher LCA, documented process bill with supported burdens, or an explicitly selected source-specific reference. ADEME 7.61 kg CO2e is only its two-year, source-specific, cut-off reference: opaque, non-decomposable and never a generic default. Refurbished process boundaries include only documented inspection/testing, cleaning, parts/repairs, energy, packaging/accessories, logistics and second-use charging.

Lifecycle depreciation allocation is disabled until an exact accepted method and first-life inputs exist. Consequential displacement is disabled in the primary score. Personal “would have bought new” is not market displacement. The U.S. D≈0.40 coefficient is only a labelled market-specific scenario, never default or direct attribution.

## Comparison and prohibitions

Compare direct intervention burden plus adequate service and foreseeable subsequent events over an equivalent horizon. Do not hard-code used < refurbished < new. Both unquantified secondary options may be qualitatively described as reuse of an existing handset without fabricating a numerical winner.

Prohibited: `used_secondhand == refurbished`; unknown process or transport equals zero; refurbished equals used plus battery; arbitrary refurbished equals 7.61; commercial seller proves refurbishment; grade/age proves service; excluded prior manufacture becomes avoided-production credit; one transfer equals one new phone displaced; generic secondary CO2 default; source aggregate decomposition without evidence.

## Input and result requirements

Store pathway classification, process evidence, expected adequate service, supported direct components, `result_capability`, allocation method and displacement state separately. If the pathway distinction or material process/service evidence is unknown, preserve `unknown`, `qualitative_only`, `conditional` or `insufficient_information` as applicable.
