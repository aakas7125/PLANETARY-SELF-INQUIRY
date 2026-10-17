# HQ-RE-2026-10-17-005 — Household Ledger goods-scale construct and calibration audit

**Issue:** #210 | **Cycle:** INITIAL-1 | **Workstream:** Research & Evidence  
**Execution class:** Tier 3 — focused empirical construct/calibration audit only  
**Actual execution-start `main`:** `d2d1659b43de61d0a59ed1e7b48eddce9b91a132`  
**Research branch:** `research/hq-re-2026-10-17-005-goods-scale`  
**Source access:** 2026-10-17  
**Return:** `VERIFIED_FOR_HQ_REVIEW` (specialist audit, not empirical/product adoption)  
**Self-merge:** **NO**

## 1. Short conclusion

The current **“Goods, fashion, devices”** input is a real interactive integer `0–10` slider, but **no inspectable accepted instrument, operational anchors, observation period, household-goods coverage rule or empirical calibration** defines what any nonendpoint position represents.

The implementation maps an unexplained index to annual household greenhouse-gas output `0.35 + (goods/10)*3.4` **tCO₂e**, a `goods*40` addition to `landM2`, and an `goods>=7` “Parcels are a large line” message. The exact arithmetic is reproducible. That **does not** establish a scientific measure of purchases or support interpreting 3/10 as € per month, number of clothes/devices, shopping frequency, goods mass, necessity, privilege, compulsive buying or personal motives.

This is an **input construct/measurement and quantitative authority gap**, not merely a small tooltip defect. It is also not evidence that consumer goods have zero real footprint. The existing broad Ledger “illustrative estimate” label does not calibrate the index.

**Recommendation:** HQ should treat numeric goods-specific environmental consequences and the `>=7` prompt as **unqualified for measured household inference** until it accepts an explicit construct and traceable methodology. The smallest low-risk route is a bounded product/Owner decision on **suspension or strictly contextual nonquantitative treatment of this uncalibrated input**, separately followed by Tier-2 implementation/acceptance as needed. Research neither changes the app nor invents a replacement coefficient or question.

## 2. Authority and current-state pins

**Owner/reviewer and HQ mapping:**
- Issue #209: real first-time Reviewer D **did not understand two controls**. Exact reported Hindi: “Mujhe ye do points nahi samjh aye.” This is a comprehension observation, **not** a report that the reviewer thought goods meant monthly spending or shopping frequency. Review deployment/device/screenshots/session specifics remain unknown.
- `project-state/LEDGER_TWO_CONTROL_CLARITY_MAPPING_2026-10-17.md` (HQ read-only mapping): goods meaning/calibration is unresolved; EV distance-share label has its **separate** ordinary-language mapping and is **not** subject to this scientific audit.
- D-022 authorizes investigation, not product meaning, public figures or execution.
- `OWNER_CONTROL.md`, `project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md`: Research may publish a report/PR; HQ/Owner independently accepts any meaning-changing implementation.
- Accepted #185 / PR #188 covered **Budget used** and **cooling**; goods coefficients were **expressly not audited**. D-016 / #189 suspended the audited unsupported headline/cooling channels; it did not empirically certify the retained goods channel.

**Pinned implementation (`main` `d2d1659...`):**
- `app/src/lib/calc.ts`: `HouseholdInput.goods: number`; `defaultHousehold.goods=5`; `PEOPLE=4`; goods carbon/land/narrative formulas; `computeHousehold` output.
- `app/src/components/calculator-section.tsx`: visible goods label, integer slider, pie/legend, household/per-person cards, top-3 cards and narrative display.
- `app/src/store/household.ts`: `setField("goods", value)` recalculates through `withResult`; reset restores default. No other numeric measurement interface/calibration attached.
- `app/src/lib/places.ts`: location-dependent `gridG` feeds home/road, but not goods. Same goods index implies same goods carbon/land at every available place.
- Current code's generic introduction mentions “Poore & Nemecek; household consumption reviews; national grid intensities” but gives **no goods-specific source, report/table, model unit or citation ID** for `0.35`, `3.4`, `40`, default 5 or narrative cutoff 7.

The audit uses the accepted **post-#189 cooling-removed** calculator, not outdated #185 numeric totals containing cooling.

## 3. Exact input/formula/dependency table

| Item | Source expression / state | Unit and actual behavior | Missing scientific meaning |
|---|---|---|---|
| Public label | `Goods, fashion, devices` | Groups distinct categories without defining coverage | Does it include all annual non-food goods, electronics, second-hand goods, home furnishing, repair, gifts or durable-stock replacement? None specified. |
| Accessible slider label | `Goods intensity` | Accessible-name text; rendered effective thumb naming not independently tested | “Intensity” has no measured operation/anchors; ARIA alone does not make input interpretable. |
| Index and bounds | `goods` integer, 0–10, step 1, default **5** | UI displays `N / 10` and no helper explaining what N is | No period, recall window, quantity, prices, product count, mass, reuse ratio, household-vs-person declaration or validated respondent instrument. |
| Carbon contribution | `goodsT=0.35+(goods/10)*3.4` | For current UI, **0.35–3.75 tCO₂e per 4-person household per implied year**; 0.34 t added per slider step | Intercept `0.35` and span `3.4` have no traced accepted data calibration; fixed universal additive across locations. `goods=0` **does not** mean zero modelled goods. No uncertainty interval or source boundary for embodied trade, lifecycle/durable-stock annualization, delivery, disposal and overlap with services. |
| Household total | `sum(slices.t)` | Goods added to food, flights, road, home and shared systems | A coherent coverage/non-double-count boundary for goods vs shared systems is not documented. This is an **overlap risk**, not proof of actual double count. |
| Per-person number | `totalT / PEOPLE` | Every 0.34 t household step yields 0.085 t/person/year change | Arithmetic allocation to four, **not evidence** that each person bought the same amount. |
| Land | `landM2 = diet.land*4 + goods*40` | Adds **40 m² per goods index point**, 0–400 m² across slider; `landM2` returned in model | No land inventory, land occupation/transformation distinction, functional period, m² vs m²·year, geography, product mix or lifecycle land-impact method attached. **Not visibly rendered as a land stat in the inspected Ledger component**; latent downstream model value still changes. |
| `goods>=7` threshold | Append “Parcels are a large line in this ledger...” and optional AP lens about wanting/comparison/identity | A step from 6 to 7 switches qualitative narrative on | No calibrated threshold for high spending/shopping, shipment count, parcels or carbon burden. Product wording assumes “parcels” even when goods may not be delivered. No motive inference permitted. |
| Rank/top 3 | sort all `slices.t` descending; top three shown with inquiry/lens/notice, plus top-ranked “one of largest empirical burdens” message | An arbitrary goods multiplier can move the goods card into top three | Rank is calculated faithfully from chosen placeholder numbers, **not an audited relative household burden**. |
| Pie and legend | `result.slices` and formatted `t` | Goods slice and its proportion visibly respond; `0.35 t` even at goods 0 | Pie graphics/2-decimal appearance can project more empirical confidence than present provenance supports. |
| State change/reset | `setField` → `computeHousehold`; `reset` → default `goods=5` | Recomputes deterministically | Responsiveness cannot validate scale or “typical” default. |

**Unit note:** The UI presents household/per-person outputs with tCO₂e/year. The goods slider itself gives **no period**; the implied annual unit comes from surrounding calculator totals, not an independently defined “goods per year” questionnaire.

**Zero note:** Modelled `goodsT(0)=0.35`, not 0. Neither this nonzero model intercept nor absence/suspension of goods output proves anything about an individual household's real emissions.

## 4. Minimal deterministic probes at the pinned code

**Procedure:** recomputed exactly from the inspected `computeHousehold` formulas for the unchanged default fictional Delhi household, varying **only** goods 0/3/5/6/7/10. Baseline non-goods slices: food 7.4, flights 1.7, road 1.36, home 2.485, shared services 4.4 tCO₂e; their sum = **17.345 tCO₂e/year**. Food land = `2400×4=9600 m²` in the model. `goodsT=0.35+0.34*g`, `landM2=9600+40*g`. This is source arithmetic, **not** deployed-browser testing or empirical validation.

| Goods g | Goods tCO₂e/year | Total household tCO₂e/year | ÷4 per-person tCO₂e/year | Model `landM2` | Goods rank among 6 slices | Goods in displayed top 3? | `Parcels` prompt? |
|---:|---:|---:|---:|---:|---:|---|---|
| 0 | 0.35 | 17.695 | 4.42375 | 9,600 | 6 | No | No |
| **3** | **1.37** | **18.715** | **4.67875** | **9,720** | **5** | **No** | **No** |
| **5 (default)** | **2.05** | **19.395** | **4.84875** | **9,800** | **4** | **No** | **No** |
| 6 | 2.39 | 19.735 | 4.93375 | 9,840 | 4 | No | No |
| **7** | **2.73** | **20.075** | **5.01875** | **9,880** | **3** | **Yes** | **Yes** |
| 10 | 3.75 | 21.095 | 5.27375 | 10,000 | 3 | Yes | Yes |

**Discontinuity at 6→7:** The physical model increases smoothly by another 0.34 tCO₂e and 40 m², but goods suddenly enters the **displayed top three** under these default other slices and a separate unconditional `goods>=7` **parcel narrative** is enabled. The narrative cutoff is pegged to the raw **unvalidated index**, not to a source-defined share of emissions or observed delivered packages. At other household input combinations, ranking/visibility may differ; the threshold still triggers at 7.

**Other deterministic implications:** At 0, the Goods slice and carbon cost persist; at 10, goods is 3.75 t household/year independent of city, actual goods use or number of purchased products; the returned land value moves, although the inspected Ledger JSX does not render it as a visible top-level land metric. Reset returns to 5 and `2.05` goods t; changes to names alone cannot calibrate goods.

## 5. Targeted evidence / source provenance table

This is a **source-lead audit**, not a representative goods life-cycle review. Independent external sources below provide **methodological contrasts**, not retroactive proof that this implementation drew these particular parameters from them.

| Evidence ID | Actual link / version / inspection | What it legitimately supports | Does it support the **current** 0–10, 0.35, 3.4, 40, cutoff 7? | Status |
|---|---|---|---|---|
| **G0 — current repository** | `calc.ts`, `calculator-section.tsx`, `store/household.ts`, `places.ts`, D-022/#209/HQ clarity mapping, #185/#188 and #189. Files directly fetched at `d2d1659...`, 2026-10-17. | Actual slider values/formulas/dependencies and lack of internal documented anchors. Generic intro says “household consumption reviews” without bibliographic mapping. | **No empirical construct/source mapping recorded**. Code is the producer, not scientific validation. | **Code behavior verified; quantitative calibration unsupported in inspected authority**. |
| **G1 — EU JRC goods-basket method (2019/2020)** | European Commission JRC, *Consumer footprint: Basket of products indicator on household goods*, report JRC116120, official institutional report/abstract: https://publications.jrc.ec.europa.eu/repository/handle/JRC116120 . Primary report **metadata/abstract inspected**, not every appendix. | EU consumer-basket LCA models **30 representative goods** (such as clothing/footwear, furniture, detergents, paper), linked to amounts purchased/used by average citizen **in a reference year** and process-based life-cycle product inventories. Geography EU and representative consumer, not this four-person Delhi household. | **No.** This report is **not** an instrument mapping “Goods 3/10” to 1.37 tCO₂e or 120 m², and is not provenance for the Ledger literal constants. | **Methodological comparison only**; no new values imported. |
| **G2 — EU JRC current Consumption Footprint approach (2024 report)** | European Commission JRC, *Consumption Footprint and Domestic Footprint Monitoring Report 2024*, JRC138470: https://publications.jrc.ec.europa.eu/repository/handle/JRC138470 ; official summary and institutional model description https://web.jrc.ec.europa.eu/policy-model-inventory/explore/models/model-consumption-footprint/ . **Institutional methodological/summary text inspected**, report PDF not fully audited. Model uses **164 representative products and official 2010–2022 data** at EU/member-state scale across food, mobility, housing, household goods and appliances; lifetime products can be annualized by inventory assumptions. | Valid assessments require product-category mix, **quantified annual consumption**, supply-chain / life-cycle boundaries, year and region. Carbon and land are distinct impact categories. | **No.** No calibrated universal 0–10 slider or 0.35+0.34g household response function, and no `goods*40` universal land measure is documented. | **Source-backed methodological context only**, not literal Ledger calibration. |
| **G3 — household expenditure/output-based footprint literature** | Ivanova et al. (2016), *Environmental Impact Assessment of Household Consumption*, *Journal of Industrial Ecology* 20, 526–536, DOI 10.1111/jiec.12371: https://onlinelibrary.wiley.com/doi/full/10.1111/jiec.12371 . **Publisher full article/abstract and method summary accessed**; environmental extended multi-regional input-output accounting, countries and expenditure categories. | Household impacts can be assessed by **explicit expenditure, region and economy-wide supply-chain tables**, with system-boundary/price-year/accounting qualifications. This is a different approach than physical product basket LCA. | **No.** It does not establish that a respondent's unspecific “3/10 goods intensity” has a fixed annual GHG/land implication across all locations. | **Independent methodological contrast only**, not actual factor origin. |
| **G4 — source name in Ledger introduction** | Poore & Nemecek (2018), *Reducing food's environmental impacts through producers and consumers*, *Science* 360:987–992, DOI 10.1126/science.aaq0216, publication abstract: https://pubmed.ncbi.nlm.nih.gov/29853680/ . **Primary indexed abstract/metadata inspected**. | Diverse farm/food LCA evidence; directly pertinent to **food** but not a generic goods/fashion/device 0–10 input. | **No**: cannot certify goods intercept/slope or land factor. | **Non-applicable for goods calibration**. |
| **G5 — unlabelled “household consumption reviews” source lead** | Intro copy only, no document title, DOI, model or goods-factor derivation in inspected repo authority. Narrow source comparison limited to G1–G4; no systematic global search. | A general statement that household goods have supply-chain impacts is defensible. | **No provenance established** for any of the 0–10 mapping constants or cutoff. | **Source-needed for literal coefficients**; absence in inspected sources is not universal impossibility. |

**Assessment distinction:** A published study that household purchases cause emissions/land burdens does **not** validate a linear index-to-impact mapping. To justify a number, the method must define the **actual explanatory variable**, annual household denominator, item category coverage, region, climate/land impact units, life-cycle boundary, calibration dataset, fit/uncertainty and allowable extrapolation.

**Overlap caution:** Goods may partially overlap a “Shared systems” residual or home/transport depending on adopted consumption-based inventory. No reviewed goods/system allocation table prevents double counting. This is **an unresolved compatibility risk, not proof of actual overlap**.

## 6. Can an ordinary user choose 3/10 meaningfully?

**Not as a verifiable report of household consumption on the currently displayed evidence.**

A user can physically choose 3; the UI offers no anchored comparison for deciding whether it represents one pair of shoes, a laptop, household expenditure of some amount, annual purchases, purchases relative to neighbours, a monthly shopping habit, an in-store vs delivered mix, or any other measurable state.

Assigning `3/10=...€`, purchases/year, items/month, clothes quantity, sustainability virtue or lifestyle class now would create **new unsupported semantics**. Even “average shopping = 5” is not evidenced: `default=5` is a code default, not a population median/benchmark.

A single “goods intensity” index also collapses products with very different lifetimes, manufacturing, raw materials and land footprints; without weighting/definitions, equal index steps cannot be assumed equal kgCO₂e increments. JRC's quantity/product-based method contrasts precisely with this shortcut. It does not supply replacement coefficients.

**Empirical judgement:** the reviewer’s actual confusion is congruent with this unresolved construct, but the precise reason they were confused remains unknown. The review is one preliminary instance, not measured prevalence, and no human comprehension of a proposed alternative has been tested.

## 7. Next disposition — no premature quantitative repair

The Research task is **complete as an audit**. The goods construct is **not qualified** to produce a measured individual household goods-carbon or goods-land quantity without a separately accepted definition/calibration.

**Recommended HQ/Owner semantic decision:**
1. First choose whether to **temporarily suspend the current uncalibrated quantitative goods control and its dependent goods slice/land increment/ranking/narrative**, or retain it only inside a clearly non-calibrated **static illustrative** demonstration after specific product acceptance. Suspending the coefficient from calculation may change headline totals: this is a **material semantic change**, not a Research-authorized “bug fix.”
2. If a future actual **goods impact calculator** is desired, authorize separate scientific method design for product categories and annual quantities or transparent expenditure with geography/currency/price-year plus inventory factors and uncertainties. Do not copy EU coefficients into a Delhi/default-global household or add novel market prices.
3. If a later **qualitative goods reflection** is desired, it must be proposed by the appropriate product/AP authority; do not use the existing `>=7` cutoff as a proxy for need, status, ego or moral worth.
4. Keep the accepted EV distance-share wording mapping independent; it is a separate HQ Tier-2 candidate, not blocked on Research goods factors.
5. Keep #185/#189 Ledger budget/cooling suspension accepted; do not re-enable or replace discarded budget/cooling metrics.

**If the unsupported goods term is removed or suspended:** mark it `unquantified/excluded`, **not** an empirically established zero; recalculate displayed totals with a transparent incomplete-boundary qualifier. Do not leave an outdated overall total, stale land number, pie/legend, top-three badge, or model-dependent “Parcels are a large line” text. HQ should decide whether the illustrative household can still communicate useful context without pretending to be a full consumption inventory.

**If retained as a toy control:** do not present its direct output as an audited environmental footprint, and do not call 0/5/10 a meaningful shopping rate without accepted anchors. An uncalibrated index cannot support apparently precise annual numbers merely by adding “illustrative.” The consequences for public scope must be decided first.

This report does not recommend an exact replacement slider value or numeric factor.

## 8. Focused future acceptance checks (after separate authorization)

| Test ID | Requirement |
|---|---|
| GOODS-01 | Any surviving public input has clear literal unit/period/household coverage, meaningful anchors, optional unknown handling and source-approved mapping, or remains expressly nonquantitative. |
| GOODS-02 | No unsupported `0–10` choice is quietly equated to money/month, items/year, shopping frequency, moral virtue, consumption mass or repair/reuse share. |
| GOODS-03 | 0/3/5/6/7/10 deterministic fixtures from §4 are captured as **current behavior before change**, not scientific ground truth. |
| GOODS-04 | If quantitative input is suspended, no presentational `0.35+0.34g` goods carbon, `40g` land impact, ranked goods pressure or parcels-threshold inference remains active under a different label. |
| GOODS-05 | Dependent household and per-person outputs/pie/legend/top-three/rank update coherently, with incomplete-boundary qualification. No implicit `goods=0` proof of zero footprint. |
| GOODS-06 | The existing `goods>=7` narrative/AP lens does not automatically classify user motive; any retained reflective copy is separately reviewed. |
| GOODS-07 | No invented coefficient, source, region, year, product mix, CO₂e/land category or uncertainty precision. Global/other-country data do not silently calibrate a specific place. |
| GOODS-08 | Source-compatible accounting prevents double-counting between goods and shared services, transport or housing if a future calculator is accepted. |
| GOODS-09 | Reset/default/keyboard, 390px/1280px layout, effective slider name/helper/value and accessible state are checked for whatever later UI is actually adopted; no claim of validated reviewer comprehension from a code check alone. |
| GOODS-10 | Existing #189 budget/cooling exclusions and independent EV road-denominator semantics remain unchanged; no whole-Ledger/new-domain expansion. |
| GOODS-11 | `landM2` is recomputed/removed consistently if goods term changes; m² vs m²·year/flow period is established before public scientific display. |
| GOODS-12 | Any UI showing approximate annual tCO₂e does not claim a complete audited household inventory when important goods impact remains unknown/excluded. |

## 9. Honest validation and limits

- Fresh Issue #210 `READY_FOR_RESEARCH` checked; no matching Task-ID branch/PR/report found at intake. Claimed `IN_PROGRESS` and branched deterministically at `d2d1659b43de61d0a59ed1e7b48eddce9b91a132`.
- Re-read actual `calc.ts`, `calculator-section.tsx`, `store/household.ts`, `places.ts`, Owner/HQ #209 clarity map, `OWNER_CONTROL`, Issue plane, D-022 and prior #185 audit; scope limited to requested goods producers/consumers. No EV factor audit or unrelated sector review.
- Evaluated deterministic source formulas at six goods inputs using the current post-#189 non-goods default slices. **Not a deployed build/React interaction test**; final output arithmetic may have floating-point formatting variation.
- Followed actual intro citation leads and a small official/publisher methodological check: JRC2019 household-goods product basket, JRC2024 CF methodology/model, Ivanova2016 household input-output assessment and Poore/Nemecek2018 food scope. Identified **no published mapping for these exact goods literals** in inspected sources or repo, without asserting no such literature could exist.
- Reviewer D feedback is Owner paraphrase only; neither screenshots nor live participant workflow independently observed. No interviews/contact, tracking or analytics.
- No application code, tests, immutable package, contract, registry, AP corpus, Owner control, wider Ledger metrics, Cursor tasks, model selection or deployment changed. Markdown-only Research task; hosted CI/build/render not required for this report and not claimed.

**Research return: `VERIFIED_FOR_HQ_REVIEW`.**  
**Self-merge: NO.**
