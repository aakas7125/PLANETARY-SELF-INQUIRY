# Ledger two-control clarity mapping — HQ, 2026-10-17

Authority: Owner #209 intake and autonomous-continuation clarification D-022. This is completed read-only HQ preparation, not a new empirical calibration or app implementation. Current accepted source inspected at8aa8f0ef41672412254767f4e129e7199f0e1aa5; subsequent main changes are governance only. Source app tree d48217e3efcc290bee8218b22c257ce9fa3cd0d2. No participant session or screenshots independently inspected here; original exact feedback/coverage limits remain in [#209](https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/209).

## Electric-distance mapping and specific wording recommendation

| Existing surface/behavior | Exact meaning established from code | Recommended bounded treatment |
|---|---|---|
| Prior “Household road travel”, value km/yr, carKm0–40000 step500 | Household annual road-distance input; calculation partitions this same value. | Keep current prior label/value/control/period unchanged. |
| “Share of those kilometres electric”, evShare0–100%, step5, default0 | Fraction of entered carKm assigned to electric travel: evKm=carKm*evShare/100; remaining distance iceKm=carKm*(1-evShare/100). It is distance share, not number of cars, trips or percentage of electricity renewable. | Recommended visible label: **“Household road kilometres travelled by electric vehicle (%)”**. Names denominator without an indirect “those”. |
| Accessible name “Electric vehicle share” | Current component sets aria-label on Slider root; Thumb is rendered in shared wrapper. Source inspection alone does not establish effective accessible name/description on focusable thumb. | Any later implementation must inspect actual rendered accessibility tree and label the real slider control; do not assume root ARIA propagates. Same visible and accessible meaning. No global wrapper redesign without demonstrated need. |
| Existing helper: “An electric kilometre still carries the local grid. Quieter is not the same as disconnected.” | Existing context is not an instruction for estimating share. No transport coefficient validation follows. | Candidate task replaces this helper with **“Of your household’s road travel entered above for one year, what percentage is travelled in an electric vehicle? 0% means none of those kilometres; 100% means all of them.”** Associate helper with actual focusable slider. This is instruction only; no new impact claim or model value. |
| State setField(evShare), computeHousehold and reset | Zustand recomputes from same raw inputs; reset restores defaults. | No values/defaults/bounds/rounding/reducer/calculation change. No hybrid/vehicle-type/occupancy/unknown rules, new input or explanatory numerical footprint. |

The replacement helper is a presentation proposal under existing distance meaning, not AP copy: no philosophical prompt/lens/corpus is rewritten. Naming current denominator does not require Research approval of layout or wording. The goods investigation is not a scientific dependency for that independent wording correction.

## Executed deterministic source probe — not scientific validation

HQ executed actual computeHousehold from unchanged app source with Node's TypeScript support, default fictional Delhi household except carKm and evShare. This is behavior evidence only; it does not certify factors, real household emissions or the reviewed deployment.

| Annual road km | EV share | Computed road slice t | Total t |
|---:|---:|---:|---:|
|0|0/50/100%|0 for all three|18.035 (floating output18.034999999999997) for all three|
|8000|0%|1.36|19.395 (floating output19.394999999999996)|
|8000|50%|1.1912|19.2262|
|8000|100%|1.0224|19.0574|

Future wording-only acceptance: deep-equal all complete producer results and raw state for these fixtures and one other location, unchanged step/bounds/default/reset; actual390/1280/320 render, keyboard arrows/Home/End, effective accessible name/help/value and no new overflow/errors. Existing meaningful regressions + normal app CI; no duplicated numerical scientific tests needed just for a text substitution. Human understanding of proposed wording remains unverified.

## Goods mapping and bounded specialist question

| Confirmed source | Unresolved meaning/evidence |
|---|---|
| “Goods, fashion, devices”; integer0–10, default5; aria-label “Goods intensity”; no helper/time/anchors | What observable household behavior corresponds to3/10? No inspected UI/calc/store definition establishes spending, quantity, frequency, period, new/used mix or household coverage. |
| goodsT=0.35+(goods/10)*3.4 | Provenance/calibration/year/geography/system boundary of intercept/slope and index not established. |
| landM2=diet.land*4+goods*40 | Source and stock/flow/time/area meaning of40 not established. |
| goods>=7 adds “Parcels are a large line...” followed by optional AP lens | Threshold/measurement basis not established; report dependency without new motive classification/AP interpretation or rewriting it. |

Existing Research#185/PR#188 explicitly did not audit goods/car coefficients. D-016/#189 retained those fields without validating them. A focused goods construct/provenance report is the smallest appropriate Research investigation, not a repeat budget/cooling audit, full Ledger assessment or deferred replacement-metric project. Determine source-backed construct or absence in applicable authority, limits and smallest responsible disposition. Unsupported is not automatically invalid worldwide; illustrative qualification alone does not supply user-reportable anchors. New units/calibration, factor adoption or suspension that changes totals requires explicit appropriate domain/product acceptance before implementation.

## Execution decision

HQ has completed EV copy/meaning mapping and computational baseline. Publish focused report-only goods Research task now under delegated investigative authority, no Owner confirmation required. No scientific/AP/product adoption follows. A later EV task can be a small independent Tier2 correction once exact scope, actual model-selection and execution gates are satisfied; do not hide that gate or switch Cursor's manually selected model. No broad redesign, analytics, contact, recruitment or screenshot publication.
