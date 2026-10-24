# HQ-RE-2026-10-24-001 — Fairphone Gen. 6 / Gen. 6+ source-edition and LCA provenance appraisal

**Issue:** #223  
**Task:** `HQ-RE-2026-10-24-001`  
**Cycle:** INITIAL-1  
**Workstream:** Research & Evidence  
**Execution class:** bounded source/provenance appraisal only  
**Execution-start accepted main:** `6028333a703a691b5784b4fb8343a2d18390f018`  
**Branch:** `research/hq-re-2026-10-24-001-fairphone-gen6-provenance`  
**Source verification:** 2026-10-24; primary Fairphone-hosted Fraunhofer PDFs accessed and selected tables/figures **visually inspected**  
**Proposed final state:** `VERIFIED_FOR_HQ_REVIEW`  
**Self-merge:** **NO**. Publication/merge of this report is not scientific or runtime adoption.

## 1. Executive disposition

**Appraise as two distinct CANDIDATE, model-specific source editions; do not yet add a source-registry record, expand the model picker, change the generic climate/repair brackets, or replace any accepted figure.**

The 131-page manufacturer-commissioned Fraunhofer IZM report is for **The Fairphone (Gen. 6), 8 GB RAM / 256 GB storage**, with a three-year cradle-to-grave functional unit. The company's October 2026 resource index links that report. Its headline source-reported scenarios are **41.8 kg CO₂e (RM)** and **29.3 kg CO₂e (RM + RE)** full three-year lifecycle; the source states that RM + RE includes documented supplier renewable-energy accounting and represents the as-sold footprint scenario. Its phase values and roundings reconcile.

A separately dated Fraunhofer **12 June 2026** one-page addition, packaged alongside Fairphone's summary into a **three-page Gen. 6+ combined PDF**, changes **RAM 8→12 GB** (256 GB storage), describes a processor update judged to require no revised modelling, and introduces energy previously **omitted for battery-cell manufacturing** in the original report. It also gives US-grid use-phase sensitivities. The updated **Gen. 6+ RM + RE** reported three-year total **29.6 kg CO₂e** and production **25.5 kg CO₂e** agree across the two supplement tables, within presented rounding. However the **RM** and **no-reduction** supplement figures do *not* fully reconcile (details §5); block these as accepted exact-value records until Fairphone/Fraunhofer clarify the columns or source an unambiguous correction.

**Important:** 29.3→29.6 is *not* the isolated battery electricity impact: RAM/processor configuration, battery-grid modelling and other assumptions differ. These are not temporal samples of one unchanged phone. The Gen. 6+ addition does not automatically supersede every Gen. 6 assumption/repair scenario.

The Gen. 6 **battery module replacement 1.75** and **display module replacement 2.12 kg CO₂e** fall outside the existing **provisional generic** 0.3–0.7 battery and 3–8 display brackets in opposite directions; these are not statistical prediction intervals. The published result warns of model boundary/repair-type heterogeneity, **not** that universal replacement factors should be expanded or overwritten.

## 2. Primary source identity, boundaries and access

| ID | Exact document | What it is / inspected locations | Source quality/limitations |
|---|---|---|---|
| **G6-ORIG (candidate)** | Fraunhofer IZM, *Life Cycle Assessment of The Fairphone (Gen. 6)*, 131 pages. Manufacturer-hosted original: https://www.fairphone.com/wp-content/uploads/2026/05/TheFairphoneGen6_LCA_Report.pdf ; Fairphone source index (labels October 2026): https://www.fairphone.com/hub/en/resources-policies/ | Primary PDF visually inspected: PDF pp. **13–14** Tables 1-1/1-2/1-3; p. **21** §3.1; p. **60** Table 6-1; p. **62** Fig. 6-16. Extracted text additionally inspected pp. **20–25, 56, 61–63, 121**. Physical PDF page index is printed page minus one. | Fraunhofer IZM did the study **for and commissioned by Fairphone B.V.**; §2 (printed p.20) explicitly: **no critical review by an independent third party**. Fraunhofer's research authorship is not equivalent to outside ISO critical-review certification. Full report's title/front/legal material does not establish a unique final execution/publication date; Fairphone's index month and URL path month are **not** claimed as the study date. |
| **G6PLUS-ADD (candidate)** | Combined PDF, front title *Supplement – Life Cycle Assessment (LCA) Results for the Fairphone (Gen. 6) with New Gen. 6+ Configuration*, plus Fraunhofer IZM *Addition to 'Life Cycle Assessment of the Fairphone:6 Product and production changes'*, **dated Berlin 12/06/2026**. https://www.fairphone.com/wp-content/uploads/2026/10/Fairphone_Gen6plus_LCA_Combined.pdf ; Fairphone index lists October 2026. | Three-page PDF: **p.1 cover; p.2 Fairphone summary with battery/memory values, phase table, US use table; p.3 the dated Fraunhofer addition with Table A US sensitivity and Table B scenario impacts.** All three visually inspected. | **Not** a full new 131-page LCA with updated inventories/uncertainty/independent critical review. Its front marketing-summary and underlying Fraunhofer Table B are *not fully numerically consistent*. Date **12 June 2026** is the dated addition, not proof of when the combined PDF was first publicly posted. |
| **SOURCE REGISTRY CURRENT** | `evidence/SOURCE_REGISTRY.json` at exact main: S1–S12 | S2 is the **Fairphone 5** 2024 commissioned LCA. No separate Gen. 6 or Gen. 6+ source ID. | New reports are outside currently accepted source authority. |
| **CONTRACT CURRENT** | `contracts/EMPIRICAL_SMARTPHONE_V0.md`; `provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md` §B3/§B4/§C; `evidence/CLAIM_REGISTRY.json` | Existing exact-model records: Fairphone 5, Galaxy S25 EUR, iPhone 16 128GB; generic production 25–70 kg; distribution 2–4 kg; battery repair 0.3–0.7; display repair 3–8; no generic mainboard value. | These remain accepted and **unchanged**. No retroactive insertion into historical immutable package, and no new claim ID is required for this investigative report. |

### 2.1 Gen. 6 original scope, source pins

From original §3.1/3.2/3.4/3.5–3.7 (printed pp. **21–25**):
- exact product: **Gen. 6, 8 GB RAM and 256 GB internal storage**; extensions/accessories treated separately; case/charger/accessory emissions are not silently included in the device-only figure.
- cradle-to-grave: raw-material acquisition, **production transport**, parts/component manufacturing, assembly, **finished-device transport**, use, EOL. Production carbon already contains upstream manufacturing; do not sum a new “mining” or “parts” carbon stage on top.
- **3 years of one device's use** is the functional unit. Longer 5/8/10-year cases are distinct sensitivity scenarios with explicit maintenance assumptions, not a validated remaining-life prediction for the PSI user.
- **2025 foreground/reference year**, background Sphera/Ecoinvent datasets in 2025 editions with heterogeneous underlying activity geography/date.
- **Production electricity method**: `w/o reduction` = hypothetical no recycled content/no supplier renewable accounting; `RM` = recycled content with geographically allocated electricity; `RM + RE` = recycled content plus supplier-documented renewable electricity when available, other production electricity geographically allocated (§3.3.2 pp.22–23). Source recognizes use of supplier documents/RECs; scenario emissions are dependent on allocation rules and certificates, not a measurement of a unique physically traceable electron for each phone.
- **Regional boundaries**: geographically selected manufacturing datasets where possible; generic semiconductor datasets often broader/global; use-phase electricity mix derived from Fairphone's **sales distribution**, not a single uniform German grid factor (§3.6 printed p.25).
- `IPCC AR6 GW based excluding biogenic carbon` as labelled in main cradle-to-grave tables; keep indicator label and units attached to any candidate.
- §2 printed p.20 claims ISO 14040/14044/14067 method conformity while **expressly** reporting lack of an independent critical review. Do not conflate an ISO-method-aligned report with a verified independent review.

### 2.2 Supplement applicability, source pins

Fraunhofer addition (combined PDF **p.3**):
- **“new memory configuration”** changes **8→12 GB DRAM**, 256 GB storage; processor has changed but authors judge technical parameters sufficiently similar for no processor model update.
- original Gen. 6 LCA **omitted battery-cell production electricity** from its battery manufacturing stage; updated inventory uses China national grid and supplier renewable share.
- US use-phase extension models **US-specific electricity factor** with given electricity consumption over 3/5/10-year model periods, **not** a universally applicable kWh/year fallback.
- manufacturer summary (combined PDF p.2) is explicitly for **Gen. 6+ 12 GB / 256 GB** and refers to RM + RE as preferred scenario.
- The addition is **method/configuration-specific**, not evidence that all original Gen. 6 results, repairs, supplier regions or impacts should be overwritten with Gen. 6+ values.

An earlier §6.1 battery discussion in original report (printed p.56) already describes an estimated ~17% underestimation of battery-cell GW and ~2% at overall battery level from its source-data limitations. **This does not quantify** the whole-device Gen. 6+ revision; the supplement explicitly identifies omitted electricity and a changed configuration.

## 3. Source-pinned climate table — separate generations/scenarios

Values are **source-reported kg CO₂e for the source's three-year model**, not PSI current-device service predictions. The `RM + RE` column is *a supplier-accounting scenario*, distinct from location-based RM. Printed source figures are rounded; keep reported totals distinct from stage sums.

| Exact record / scenario | Production | Transport | Use | EOL | Reported total | Provenance / decision |
|---|---:|---:|---:|---:|---:|---|
| Gen. 6 **8/256**, without reductions | **38.1** | 1.94 | 2.19 | 0.0368 | **42.3** | Original Table 1-1 (PDF p.13), **reference hypothetical**, not as-sold footprint. |
| Gen. 6 **8/256**, **RM** | **37.6** | 1.94 | 2.19 | 0.0368 | **41.8** | Original Table 1-2 (PDF pp.13–14), geography-based production electricity. |
| Gen. 6 **8/256**, **RM + RE** | **25.1** | 1.94 | 2.19 | 0.0368 | **29.3** | Original Table 1-3 (PDF p.14), documented supplier RE where available, battery electricity omission cautioned by later addition. |
| Gen. 6+ **12/256**, **RM + RE** | **25.5** | 1.9 | 2.2 | 0.04 | **29.6** | Supplement PDF p.2 summary and p.3 Fraunhofer Table B `2.96E+01`; **internally consistent at shown precision**; **candidate with method/config scope**, not approved runtime record. |
| Gen. 6+ **12/256**, **RM** | **38.9** | 1.9 | 2.2 | 0.04 | **42.8** | Supplement p.2 and Fraunhofer Table B `4.28E+01`; **phase sum discrepancy, see §5**. **Hold for clarification**. |
| Gen. 6+ **12/256**, **without reductions** | **38.9** (summary) | 1.9 | 2.2 | 0.04 | **42.8 (summary) / 43.3 (Fraunhofer Table B)** | Conflicting totals **and** phase sum. This is **unresolved**, not a determinate corrected value. |

**Do not treat `RM`, `RM + RE`, and `without reductions` as simultaneous separable emission reductions to add or subtract from a single purchased phone.** Their units match but reference cases/certificates and supplier/material assumptions differ. Likewise a life-cycle total **includes** production/transport/use/EOL: never add total plus phases.

### Source figure caveats

Original Table 6-1 (printed p.60) has RM **land use = 130 Pt**, RM+RE **300 Pt**, blue-water use RM **67,000 kg**, RM+RE **78,800 kg**. These are **source indicators under scenario choices**, not m² of land used by a specific phone, litres of drinking water denied or evidence of harm at a named site. Original p.60 explicitly cautions that toxicology comparisons can be distorted by mixing Ecoinvent and Sphera datasets, and discusses photovoltaic-system modelling choices for LU/water changes. Do **not** turn carbon reduction into “all ecological indicators improve” or generalize this one study's tradeoffs to every renewable source.

## 4. Repair module estimates, overheads and generic-bracket comparison

**Exact original source:** Fig. 6-16 (printed **p.62**; visually inspected) and Table 9-5 (printed **p.121**, text extracted) for **Gen. 6 8 GB/256 GB, RM + RE modelling basis**. §6.2.2 (printed pp.61–63) describes costs of parts/new modules, transport/packaging and where relevant soldering/desoldering as **repair environmental overhead**, not a financial invoice. Modeled components do not all permit board-level repair. These are scenario GWP values.

| Gen. 6 operation | Full-module replacement kg CO₂e | Module/part-level repair kg CO₂e | Scope/limits |
|---|---:|---:|---|
| Battery module replacement | **1.75** | n/a | module replacement, **not** small generic battery cell only; later supplement revises battery-cell electricity modelling, **but does not independently reissue these repair overheads**. |
| Display module replacement | **2.12** | **0.64** (glass) | distinct operations. **0.64 is NOT the full-display module burden**. |
| Main PCBA 8 GB/256 GB | **17.72** | **4.27** (memory chip repair) | exact original RAM, not automatically Gen. 6+ 12 GB PCBA. |
| Main camera | 4.34 | 0.62 | other scenario-specific module; no generic override. |

**Generic accepted PSI fallbacks:**
- battery 0.3–0.7 kg CO₂e, status `PROVISIONAL_GENERIC_RANGE`: Gen. 6 **1.75 is above** the upper bound by **1.05**, or **2.5×** that upper endpoint. This does not make the existing generic bracket a failed statistical confidence interval (it isn't one), but highlights use-condition/repair-type heterogeneity.
- display full-module 3–8 kg CO₂e: Gen. 6 **2.12 below** 3 by **0.88**. Do not substitute 0.64 glass-only into a **full display** comparison.
- main board: PSI has **no approved generic** footprint; Gen. 6-specific **17.72** full and **4.27** memory repair cannot become one.
- Gen. 6+ needs **separate repair provenance** if adopted; original full-module battery/PCBA estimates predate battery-electricity/RAM changes.

**6-year modeled repair example** (original §6.2.1 printed pp.60–61 and §3.3.3 p.23): one phone with **one weighted mixed repair and one battery replacement**, compared to **two complete phones over two consecutive 3-year lives**. The paper reports the mixed-repair case **34% lower** full climate impacts under its scenario assumptions. Repair probabilities/cases draw on Fairphone 5 sales/warranty data, not a verified event sequence or market displacement for a PSI visitor. **No avoided-production credit**, universal repair life or guaranteed 34% for one person's phone.

## 5. Numerical reconciliation — confirmed and unresolved

The source **has multiple distinguishable numerical consistency checks**.

| Check | Explicit arithmetic / source | Result / status |
|---|---|---|
| Original Gen. 6 RM + RE | 25.1 + 1.94 + 2.19 + 0.0368 = **29.2668** vs reported **29.3** | **PASS**, reasonable reporting rounding. |
| Original Gen. 6 RM | 37.6 + 1.94 + 2.19 + 0.0368 = **41.7668** vs **41.8** | **PASS**, reporting rounding. |
| Gen. 6+ RM + RE | 25.5 + 1.9 + 2.2 + 0.04 = **29.64** vs **29.6** | **PASS**, reporting rounding. |
| Gen. 6+ RM | 38.9 + 1.9 + 2.2 + 0.04 = **43.04** vs **42.8** (p.2 and Fraunhofer Table B) | **UNRESOLVED**, difference **0.24**. With conventional rounding to shown precision, stage total can lie approximately **[42.885, 43.195)** while a stated total 42.8 corresponds to **[42.75, 42.85)**; intervals do **not overlap**. Thus ordinary displayed-value rounding does **not** fully resolve it. |
| Gen. 6+ without reductions | Summary p.2 **42.8**, Fraunhofer p.3 Table B **43.3**, same 38.9+1.9+2.2+0.04 phase values printed in summary | **UNRESOLVED**: direct total discrepancy **0.5** and neither reported total follows exactly from the phase sum **43.04** at its stated precision. The summary *repeats identical RM and no-reduction phase values*, suspicious for a copy/reference-column error but **not evidence enough to correct**. |
| Gen. 6+ compared with Gen. 6 as-sold source | 29.6 – 29.3 = **0.3** kg CO₂e across **different exact configurations and modified battery manufacturing assumptions** | **Arithmetic only**; **NOT** the standalone electricity omission correction or measured intervention effect. |
| Gen. 6+ US use cases | **3.52, 5.87, 11.75 kg CO₂e** for **3, 5, 10 years** (supplement p.2); Fraunhofer p.3 Table A prints **3.5, 5.9, 11.8** | **PASS at rounding**; US use-phase-only, not complete-device totals and not a universal `kWh/year` consumption factor. |

**Resolution request only if future admission requires RM/no-reduction values:** ask source publisher for exact numerical reconciliation and dated corrected table/footnote. Do not set a made-up “correct” total, choose whichever figure seems conservative, or guess the missing columns. The preferred **RM + RE 29.6** is not affected by the specific table inconsistency at the reported precision, but still awaits explicit independent PSI source acceptance and boundary review.

## 6. Confirmed / qualified / contradicted / unresolved claims

| Source-led claim | Appraisal | Exact basis / why |
|---|---|---|
| A new Fraunhofer/Fairphone model-specific report family exists | **CONFIRMED** | 131-page original, 3-page combined updated product/config and dated Fraunhofer addition, listed by Fairphone (URLs §2). |
| Both original and supplement describe one identical hardware/energy configuration | **CONTRADICTED** | Gen. 6 8/256, Gen. 6+ 12/256; updated battery-cell electricity and processor. |
| Original 29.3 and Gen. 6+ 29.6 are valid *source-reported* preferred-scenario three-year figures | **CONFIRMED WITH SCOPE** | Original Table 1-3 and supplement summary/Table B, stage sums at displayed precision. Neither is automatically adopted. |
| Battery-cell manufacturing electricity was included in original full accounting | **CONTRADICTED** | Supplement Fraunhofer addition p.3 expressly says **omitted** originally; updated through China grid and supplier RE data. |
| Every numeric Gen. 6+ table/scenario total is internally consistent | **CONTRADICTED** | 42.8 vs 43.3 no-reduction; RM phases sum to 43.04, not 42.8. |
| A deterministic isolated battery-cell omission effect can be calculated as 0.3 from comparing Gen6/Gen6+ totals | **CONTRADICTED** | RAM/model and other changes confound; differing backgrounds/roundings. |
| Gen. 6 battery/display full repairs lie within generic PSI brackets | **CONTRADICTED** | 1.75 > 0.7 battery; 2.12 < 3 display; generic range not a confidence interval. |
| Module figures include source-defined repair overheads, not generic device repairs | **CONFIRMED** | Original §6.2.2 Fig.6-16 and Annex Table 9-5. |
| Same model-specific battery/PCBA figures directly apply to Gen. 6+ | **UNRESOLVED / NOT ESTABLISHED** | Supplement updates corresponding materials/electricity; no reissued repair table. |
| Gen. 6+ supplement is itself a complete new independently reviewed cradle-to-grave LCA | **CONTRADICTED** | 3-page mixed summary/addition; original explicitly lacks independent outside critical review; no evidence of a later such review. |
| US `3.52/5.87/11.75` figures can set Germany or generic charging kWh per year | **CONTRADICTED** | US use-only CO₂e computed with US electricity factor, not handset kWh and not user case. |
| Gen. 6 or Gen. 6+ already accepted by PSI's official source registry | **CONTRADICTED** | Current S1–S12 contains Fairphone **5** S2 only; canonical exact values remain 5/S25/iPhone16. |
| New Gen6-specific mass, water or land figure proves an individual human/ecosystem harm | **NOT SUPPORTED** | Modelled aggregate LCA indicators, no named site/person, primary-mined share or route established. |

## 7. Proposed additive evidence-record disposition — **proposal, not registry mutation**

### 7.1 Candidate source objects

**Candidate A — exact Gen. 6 LCA source (NOT accepted)**

```text
candidate_id: CANDIDATE-FAIRPHONE-GEN6-ORIGINAL-IZM
authority_status: CANDIDATE_UNAPPROVED
document: Life Cycle Assessment of The Fairphone (Gen. 6)
author/institution: Fraunhofer IZM
commissioned_by: Fairphone B.V.
independent_third_party_critical_review: false (explicit report statement)
publication_version: exact URL and 131-page edition; no invented release day
foreground_year: 2025
background_dataset_editions: 2025 (underlying temporal/geographic variation)
unit: kg CO2e, report's AR6 GW excluding biogenic carbon
model: The Fairphone (Gen. 6)
configuration: RAM 8GB, storage 256GB
functional_unit: one phone used 3 years
boundary: device cradle-to-grave, source-defined production/transport/use/EOL
scenarios:
  RM: total 41.8; production 37.6; transport 1.94; use 2.19; EOL 0.0368
  RM_RE: total 29.3; production 25.1; transport 1.94; use 2.19; EOL 0.0368
  without_reductions: total 42.3; production 38.1; transport 1.94; use 2.19; EOL 0.0368
revision_caution: battery-cell electricity omitted in original battery manufacturing;
  do not hide later supplement or imply fully updated life-cycle scope
repair_subrecords: distinct scenario figures; no generic overrides
source: https://www.fairphone.com/wp-content/uploads/2026/05/TheFairphoneGen6_LCA_Report.pdf
```

**Candidate B — Gen. 6+ supplement (NOT accepted)**

```text
candidate_id: CANDIDATE-FAIRPHONE-GEN6PLUS-2026-SUPPLEMENT
authority_status: CANDIDATE_UNAPPROVED
document: Fairphone Gen. 6+ combined supplement with Fraunhofer IZM addition
addition_date: 2026-06-12 (not conflated with index date October 2026)
commissioned_context: Fairphone / Fraunhofer IZM; same original-method lineage
model: The Fairphone (Gen. 6+)
configuration: RAM 12GB, storage 256GB (updated processor)
delta: battery-cell production electricity included under source's China grid /
  supplier renewable share; increased RAM; US use-phase sensitivity
functional_unit: inherited 3-year device model for main totals
scenario_preferred_RM_RE:
  total 29.6; production 25.5; transport 1.9; use 2.2; EOL 0.04
US_use_only_kgCO2e:
  years_3: 3.52
  years_5: 5.87
  years_10: 11.75
other_scenario_values:
  RM: ON_HOLD (42.8 reported; sum discrepancy)
  without_reductions: ON_HOLD (42.8 summary vs 43.3 Fraunhofer, phase conflict)
repair_values: NOT_ESTABLISHED for new configuration
source: https://www.fairphone.com/wp-content/uploads/2026/10/Fairphone_Gen6plus_LCA_Combined.pdf
```

The above candidate IDs are **proposal identifiers only**, NOT new `S13/S14`, statuses such as `APPROVED_MODEL_SPECIFIC`, or permitted product-picker labels. Preserve old `S2` Fairphone 5 and immutable `R&E-V0-SMARTPHONE-0.3.0`.

### 7.2 If HQ later requests acceptance

Safest potential ordering:
1. HQ independently validates exact primary PDFs/edition and the source quality/repair caveats, and decides whether these **two candidate source objects** merit a separately authorized *additive* source-record task.
2. For **Gen. 6+ RM + RE only**, require acceptance of the distinct model/configuration and 3-year manufacturer-commissioned figure (with its limitations and source cross-reference) before creating any approved exact record. For RM/no-reduction, **hold** until source correction or explicit unresolved-data rule.
3. For original Gen. 6, decide whether preserving the pre-supplement 29.3 reference is useful as *historical/config-specific* evidence despite the acknowledged omitted battery-cell manufacturing electricity; do not silently label it updated/fully measured.
4. Any registry/import task must be **newly authorized**: append candidates without modifying historical immutable packages; source metadata/version/field verification, exact mode/config deterministic selection, source-specific repair and EOL/use-only restrictions, no universal proxy.
5. No task #223 action changes `EMPIRICAL_SMARTPHONE_V0.md`, the source/claim registries, runtime picker, accepted conditions, central charging or user adequacy/horizon.

### 7.3 Focused future regression/verification tests

| ID | Condition | Required behavior |
|---|---|---|
| FP6-01 | Gen6 source 8/256 vs Gen6+ 12/256 | Exact model/config matched separately; no fuzzy alias/cross-family substitution. |
| FP6-02 | Gen6+ preferred 29.6 total and 25.5 production | Source-pinned, 3-year, RM+RE/certificates and battery-update warning retained; no “average smartphone” language. |
| FP6-03 | RM/no-reduction disputed 42.8/43.3 and 43.04 stage sum | Unresolved values cannot be silently chosen, averaged or passed as exact accepted stages. |
| FP6-04 | Repair type battery 1.75/display 2.12/memory-PCBA 4.27 | Gen6-specific operation and source overhead distinguished; never generic override, never apply Gen6 PCBA record to Gen6+. |
| FP6-05 | Historical existing device matches Gen6/Gen6+ | Pre-decision manufacture excluded from keep/repair prospective total; can only be historical context. |
| FP6-06 | User enters unsupported model/config/storage or unknown | Stay explicit generic fallback/unknown; never infer RAM from brand name. |
| FP6-07 | 3-year source use/GWP/EOL phases | Reference-only; no scaling into user-explicit `H` without separately accepted method. |
| FP6-08 | 3/5/10-year US use-only values | Never treated as full lifecycle or Germany default or kWh/year; no acceptance from arithmetic divisibility. |
| FP6-09 | 25–70 generic and 2–4 finished distribution fallback | No change merely due to Gen6 near/below bracket endpoints (1.9 transport is source-specific). |
| FP6-10 | Battery/display provisional generic brackets | Do not read as probability or broaden from one model; alternative repair-type/source remains distinct. |
| FP6-11 | Whole-device/phase additive rendering | No total+phases double counting, no material-mining carbon addition, no generic water/site harm inference. |
| FP6-12 | New source/claim package acceptance | Only separately HQ-authorized additive update; immutable package and existing S1–S12 exact provenance remain unchanged. |

## 8. Validation, limits and handoff

- Fresh `#223` **READY_FOR_RESEARCH** and authorization checked; no equivalent branch or PR at claim; source lead `#222` treated as **non-executable** and verified independently rather than repeated broad freshness research.
- Deterministic research branch created from **`6028333a703a691b5784b4fb8343a2d18390f018`**; Issue moved to `IN_PROGRESS` before substantive work.
- Directly fetched both publicly accessible manufacturer-hosted primary PDFs; **original printed pp.13–14 / p.21 / p.60 / p.62 and all three supplement pages viewed as page images**, with further text inspection for §2, §3, §6 and Annex 9.2. Some large-PDF screenshot requests returned cache misses; exact extracted text was cross-checked with successfully rendered pages and the repair graph.
- Verified Fairphone primary source index's **October 2026** listing separately from **12 June 2026** supplementary document date.
- Repo accepted `EMPIRICAL_SMARTPHONE_V0.md`, `SOURCE_REGISTRY.json` (S1–S12), `CLAIM_REGISTRY.json`, immutable source package and prior accepted exact-model handoff inspected. No existing accepted Gen6/Gen6+ source record.
- Numeric phase additions independently recomputed for **both original RM / RM+RE and Gen6+ RM / RM+RE**, plus two no-reduction comparisons. **Detected a second non-rounding discrepancy** in summary RM phases beyond 42.8 vs 43.3; this is a warning and not an attempt to repair the source.
- **Access/verification limits:** manufacturer-hosted documents, not third-party reviewed; no audit of confidential supplier raw inventory, certificate validation, on-device electricity monitoring, independent Fairphone supplier data, source PDF bytes/hashes, actual market availability, or primary-person case. No new regional/LCA averaging. No audio or other unrelated external research.
- No app, user-facing selector, test, source package, registry, accepted contract, claim, AP corpus, deployment, Owner-control or other workstream change.
- Markdown-only Research proposal; no app build/CI/render is required and none is claimed. PR exact head and one-file scope must be verified before final return.

**Research recommendation:** HQ review this as an exact, **qualified source-candidate appraisal**; only after independent acceptance decide whether a **separate** additive source record is justified. The unresolved published Gen6+ RM/no-reduction numerical inconsistency is a **data-provenance hold** for those particular candidate fields, not a reason to fabricate a correction. No Owner decision is needed just to receive this appraisal; no automatic product adoption follows.

**Return intended:** `VERIFIED_FOR_HQ_REVIEW` | **Self-merge: NO**.
