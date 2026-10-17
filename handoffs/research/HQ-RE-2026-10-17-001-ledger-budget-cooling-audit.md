# HQ-RE-2026-10-17-001 — Household Ledger budget-time and cooling-metric authority audit

**Issue:** #185  
**Task ID:** `HQ-RE-2026-10-17-001`  
**Cycle:** `INITIAL-1`  
**Workstream:** Research & Evidence  
**Execution class:** Tier 3 — focused empirical/model authority audit; proposal only  
**HQ Issue's starting accepted main:** `00f68fe41092280cc9e4044023b47de897354873`  
**Actual execution starting main:** `667b41a45cc39871a6539a5f78fda0389a758d27`  
**Branch:** `research/hq-re-2026-10-17-001-ledger-metrics`  
**Source-access date:** 2026-10-17  
**Status:** `VERIFIED_FOR_HQ_REVIEW`; not accepted Ledger semantics  
**Self-merge:** **NO**

## 1. Short answer and prioritized findings

The reported fixed **“Budget used / 0 min”** does **not** result from a stale state/calculator. The React/Zustand update recomputes every time. It results from a tiny floating-point time-equivalence, followed by rounding to whole minutes.

More importantly, “Budget used” is **not a remaining-carbon-budget allocation or depletion calculation**. It divides a four-person annual household footprint expressed as tCO₂e/year by an average worldwide instantaneous emission flow in tCO₂/second, then converts the result to hours. The hard-coded 41.6 Gt figure matches a **2024 projection of annual anthropogenic CO₂** in the 2024 Global Carbon Budget, **not** all-greenhouse-gas CO₂e. The two measures have different scopes and accounting conventions. The internally computed “seconds of global emissions” do not justify a public personal budget/time-remaining statement. The remaining-carbon-budget constant (150 GtCO₂) is used in a **different** 55-year extrapolation and does not enter `budgetHours`.

**“Manufactured cool / 0–10”** is a dimensionless slider transformed into **0–1.8 tCO₂e/year per household**, independent of geography, air-conditioner type, cooling use, cooling-electricity consumption, efficiency or household size. There is **no source-backed 1.8 t endpoint or validated conversion from that slider** in the inspected applicable repository authority. Its added amount may also double-count electricity when the `homeKwh` input represents the household's whole utility bill, including cooling.

**Research recommendation: do not merely change the displayed precision or replace 0–10 with “12/year.”** HQ should treat both quantities as **unsupported quantitative public semantics** pending independent model/product decisions. The smallest clearing action is to remove/suspend their unsupported public quantitative implications in a separately authorized Tier-2 slice, or visibly quarantine an explicitly illustrative, non-scientific simulation only after an explicit authorized decision on what such a display means. Research does **not** choose a new scientific coefficient or dictate a homepage redesign.

## 2. Code-precise trace (accepted-code behavior is not scientific acceptance)

Inspected:
- `app/src/lib/calc.ts` lines 3–27, 47–53, 78–90, 122–125, 151–160, 180–183, 194–206;
- `app/src/lib/places.ts` lines 9–106 (all location grid rates);
- `app/src/store/household.ts` lines 16–32 (derived state recomputation);
- `app/src/components/calculator-section.tsx` lines 61–80, 175–300 (controls/output);
- `project-state/DECISIONS.md` D-014; #180 B-11/B-12.

### 2.1 Household state and bounds

`defaultHousehold` is a four-person constructed baseline:
- `placeId=delhi`, `gridG=710` gCO₂e/kWh in the place table;
- diet `average` = 1.85 tCO₂e/person/year; `vegan` = 0.7;
- flights 1 LHE/year, car 8,000 km/year, EV share 0%, `homeKwh=3500` kWh/year;
- goods intensity 5/10; cooling intensity 5/10.

Accessible control minima:
- flights **0** (0–12);
- car **0 km** (0–40,000);
- EV share **0%** (0–100; irrelevant if car=0);
- home electricity **500 kWh/year**, **not zero** (500–12,000);
- cooling **0/10** (0–10);
- goods **0/10** (0–10);
- diet has discrete categories, Plant=vegan 0.7 t/person/year, not 0;
- fixed shared services **4.4 tCO₂e/year** and fixed goods intercept **0.35 tCO₂e/year** remain even at accessible minima.

`setField` in the Zustand store calls `withResult(next)` → `computeHousehold` for every input update. The UI accesses the fresh `result`. Reset also recomputes defaults.

### 2.2 Budget pipeline, units and public output

```ts
const totalT = slices.reduce((s,x) => s + x.t, 0);              // tCO2e / household / year
const worldPerSecond = (WORLD_EMISSIONS_GT * 1e9)
    / (365.25 * 24 * 3600);                                     // global tCO2 / second if source is CO2
const budgetHours = (totalT / worldPerSecond) / 3600;           // hours; NOT remaining carbon budget
```

`WORLD_EMISSIONS_GT=41.6`; seconds per year = 31,557,600; `worldPerSecond=1,318.2244530636044` tonnes CO₂/second.

UI:
```tsx
label="Budget used"
value={result.budgetHours < 1
  ? (result.budgetHours * 60).toFixed(0) + " min"
  : result.budgetHours.toFixed(1) + " h"}
hint="of current global emissions, every year"
```

This is not “minutes of remaining budget consumed”; it is a constructed time-equivalent relative to a global annual CO₂ rate. Even with compatible units it would not be a fair-share, allocation, probability, depletion clock or per-capita burden.

`REMAINING_BUDGET_GT=150` **does not appear** in the budget-time path. It appears in:
```ts
const lifetimeT = totalT * 55;                                   // assumes 55 repetitions of annual household output
const lifetimeSharePct = lifetimeT / (REMAINING_BUDGET_GT*1e9)*100;
```
This other channel is not currently the “Budget used” Stat, but has a direct denominator/source/semantics concern (§6).

### 2.3 Cooling pipeline, units and public output

UI:
```tsx
<FieldLabel title="Manufactured cool" value={`${state.cooling} / 10`} />
<Slider min={0} max={10} step={1}
  onValueChange={([v]) => state.setField("cooling", v ?? 0)}
  aria-label="Cooling intensity" />
```

Calculation:
```ts
const homeT = input.homeKwh * place.gridG / 1_000_000;
const coolT = (input.cooling / 10) * 1.8;
home_slice.t = homeT + coolT;
```

- `input.cooling`: **dimensionless index, 0–10**; NOT frequency, minutes, days, appliance-hours, thermal exposure, room temperature, kWh, or number of air conditioners.
- `coolT`: **tCO₂e/year**, linearly scaled 0–1.8; source/units of the conversion factor **not pinned**.
- `homeT`: kWh/year × gCO₂e/kWh ÷ 1,000,000 = tCO₂e/year.
- `coolT` does **not** use `place.gridG`. Equal slider settings imply equal 1.8 t endpoint in Delhi, London, São Paulo, etc.
- `homeKwh` is merely labelled “Home electricity,” **not** “non-cooling home electricity.” Therefore cooling electricity ordinarily already belongs inside it unless explicitly excluded. This is an **overlap/double-count risk**, not proof that a real user's metered bill contains every cooling load.

A secondary `seeing` sentence appears at `cooling>=6`, associating cooling with heat returned outdoors and posing an AP lens. Its trigger also rests on the uncalibrated ordinal index. This audit does not review AP prose/philosophy, but a slider without a defined measurement meaning cannot establish comparative exposure or culpability.

## 3. Deterministic reproduction

**Procedure:** evaluated the exact `computeHousehold` arithmetic at the inspected source SHA using the listed inputs/constant values and standard JavaScript floating-point arithmetic; reproduced the UI formatting rule (`.toFixed(0)`). These are **source-code determinism checks**, not an independently deployed-browser test and not scientific validation of the factors.

| Case | Source inputs | Food | Flights | Road | Home incl. cooling | Goods | Shared services | Total tCO₂e/year | `budgetHours×60` (min) | UI “Budget used” |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| L-01 default | Delhi; average; 1 flight; 8,000 km ICE; 3,500 kWh; goods 5; cooling 5 | 7.400 | 1.700 | 1.360 | 3.385 | 2.050 | 4.400 | **20.295** | 0.000256595 | **0 min** |
| L-02 Plant | L-01 except diet vegan | 2.800 | 1.700 | 1.360 | 3.385 | 2.050 | 4.400 | **15.695** | 0.000198436 | **0 min** |
| L-03 accessible minima | Delhi, vegan, flights 0, car 0, EV 0, **home 500**, goods 0, cooling 0 | 2.800 | 0 | 0 | 0.355 | 0.350 | 4.400 | **7.905** | 0.000099945 | **0 min** |
| L-04 cooling contrast 0 | L-01 except cooling 0 | 7.400 | 1.700 | 1.360 | 2.485 | 2.050 | 4.400 | **19.395** | 0.000245216 | **0 min** |
| L-05 cooling contrast 10 | L-01 except cooling 10 | 7.400 | 1.700 | 1.360 | 4.285 | 2.050 | 4.400 | **21.195** | 0.000267974 | **0 min** |

`budgetHours×3600`, if interpreted as a global CO₂-flow time, equals:
- L-01 **0.0153957 seconds**;
- L-02 **0.0119062 seconds**;
- L-03 **0.0059967 seconds**.

This shows why whole-minute rounding masks any normal slider change. **Do not simply display milliseconds or seconds as a valid “personal carbon budget”**: doing so would hide the underlying CO₂e-vs-CO₂ and allocation problems, not solve them.

Other traced source outputs for L-01:
- `perPersonT=20.295/4=5.07375` tCO₂e/year;
- `earths=5.07375/2.0=2.536875` (label “Earths required”; see §6);
- `lifetimeSharePct=(20.295×55)/(150×10^9)×100≈0.00000074415%` (not currently the “Budget used” field).

For L-03 the household remains nonzero because `homeKwh>=500`, the diet factors and the goods/services intercepts remain positive.

## 4. Budget and source-authority audit

### 4.1 CO₂, CO₂e, rates, budgets and allocations are different concepts

**A global instantaneous *CO₂* flow** can be calculated from a suitably defined annual global CO₂ emissions rate by dividing by seconds/year.

**A household consumption estimate in *CO₂e*** may cover multiple GHGs (CH₄, N₂O, etc.) and modeled supply chains. Its boundary must be checked before comparing with a global annual inventory that includes only physical CO₂. Multiplying by “seconds” does not make the climate metrics interchangeable.

**A remaining carbon budget** for a warming target is a finite cumulative **CO₂** quantity, with baseline date, warming threshold, likelihood, climate/non-CO₂ assumptions and uncertainty. It is not the average annual world flow.

**A per-capita “fair share”** is a normative allocation requiring explicit fairness principles and jurisdiction/time allocation; dividing a global remaining carbon budget by world population would not, on its own, establish the household's fair share and would omit equity/history/dynamic pathways.

**A multi-gas annual household footprint** is not automatically a physical depletion of a global CO₂-only budget. `lifetimeSharePct` also assumes 55 identical future annual household emissions without a validated service/demographic/pathway model.

### 4.2 Is `WORLD_EMISSIONS_GT=41.6` traceable?

**Yes, to a specific historical CO₂ estimate**, although no exact source/year is attached to the constant in repository code.

The **Global Carbon Budget 2024** FAQ explicitly reports:
- 37.4 GtCO₂ fossil;
- 4.2 GtCO₂ land-use change;
- **41.6 GtCO₂ total projected anthropogenic emissions in 2024**.

Source: Global Carbon Project / University of Exeter, FAQ **“What are the latest results of the GCB?”** (2024 archive), https://globalcarbonbudget.org/gcb-2024/faqs/ , accessed 2026-10-17.

This provides a plausible provenance for the **number** but **not** for the public “budget” interpretation, source currentness, mixing with tCO₂e or annual-rate-to-personal-budget equivalence.

Currentness check:
- Friedlingstein et al., **Global Carbon Budget 2025**, *Earth System Science Data* 18 (2026), https://doi.org/10.5194/essd-18-3211-2026 , executive summary: preliminary **42.2 GtCO₂/year for 2025** total anthropogenic CO₂; 2024 updated total **42.4 GtCO₂/year**.
- IGCC 2025 indicators, Forster et al., *Earth System Science Data* 18 (2026), https://doi.org/10.5194/essd-18-3889-2026 , §9 / Table 8: approx **42 GtCO₂/year** current 2025-level emission rate.

Neither source justifies replacing 41.6 with a new coefficient inside the current flawed public “Budget used” construction without first settling compatible accounting and public meaning.

### 4.3 Are `REMAINING_BUDGET_GT=150` and `FAIR_SHARE_T=2.0` accepted/traceable?

**150 GtCO₂:** Code comment calls it an “illustrative remaining 1.5°C (50%) budget from 2026.” No exact source/version, initial date or uncertainty is pinned there. Independent current scientific estimates are not identical:

- **IGCC 2025** (Forster et al. 2026), §9 Table 8: **130 GtCO₂** from start 2026 for 50% likelihood of staying below 1.5°C, under stated assumptions.
- **Global Carbon Budget 2025** (Friedlingstein et al. 2026), remaining-budget summary: **170 GtCO₂** from start 2026 for 50% 1.5°C, under its assessment/method choices.

The repository's **150** must not be presented as an accepted current single-point empirical truth or inferred as a supported average of those two papers. These assessments depend on method, warming estimation, non-CO₂ pathways, and uncertainty. An illustrative assumption could be labelled as such **only if separately authorized** with corresponding uncertainty/meaning.

**2.0 tCO₂e/person/year:** Code comment calls it a “1.5°C-aligned 2030 per-capita fair share” in the “order of UNEP/IPCC pathways” with no cited exact source, scope or normative allocation method. No inspected repository accepted source defines a binding or scientifically unique 2.0 tCO₂e/year fair-share quota for every person and every city. The factor is **unverified as a fair-share authority**. It may be an illustrative threshold, but this task cannot adopt it or treat `earths` as an Earth-system carrying-capacity measure.

The latest UNEP Emissions Gap Report index at access date lists **2026 (14 October 2026)** in addition to 2025/2024: https://www.unep.org/en/publication-series/emissions-gap-report . These reports assess aggregate GHG pathways; a mention of UNEP in a source-code comment does not validate a literal global “2 t/person fair share.”

### 4.4 Is “Budget used” scientifically supported?

**No.** Its code is arithmetically reproducible and its global CO₂-rate constant has a plausible historical source. But the public semantics are not supported:
- no remaining-budget variable enters it;
- no per-capita/fair-share allocation is encoded;
- numerator vs denominator gas coverage differs;
- it is a “flow-time equivalent,” not a personal carbon-budget time;
- both annual household and global emissions are estimated, not observed exact values;
- unit-level pseudo-precision in minute/second displays would imply unsupported certainty.

**Clearing classification:** **scientific/model semantic gap**, not a pure formatting defect. Remove/suspend the public budget-time quantity pending a separately accepted metric definition. A future purely cosmetic change of label/precision is insufficient unless an accepted source-compatible quantitative interpretation and adequate disclaimers have first been adopted.

## 5. Cooling construct and primary evidence

### 5.1 What can scientific cooling data support?

The IEA has empirical/modelled analyses of electricity consumed by air conditioners, but energy requirements depend on equipment efficiency, setpoint, climate, hours, thermal demand/building insulation and other boundary conditions, not simply “occurrences of hot days.”

Primary sources inspected:
- IEA, **The Future of Cooling** public release, 14 May 2018, https://www.iea.org/news/air-conditioning-use-emerges-as-one-of-the-key-drivers-of-global-electricity-demand-growth — building AC electricity is a significant energy-demand category; does not specify a 0–10 household index → 1.8 tCO₂e mapping.
- IEA 2025 source-backed model chart, **Energy consumption of air conditioners at different temperature setpoints and additional energy demand for fans to reach equal thermal comfort**, updated 23 July 2025, https://www.iea.org/data-and-statistics/charts/energy-consumption-of-air-conditioners-at-different-temperature-setpoints-and-additional-energy-demand-for-fans-to-reach-equal-thermal-comfort . Unit **kWh/year**; explicitly for a **medium-well insulated one-room Singapore apartment**, SEER 3.9 W/W AC and specified fan assumptions. This example shows why appliance/setting/use/building/geography assumptions must accompany a numerical estimate; it is not a generic Delhi or four-person default.

The inspected repository has **no accepted Ledger-specific evidence record** defining “cooling intensity,” a measurement instrument for its values 0–10, or a calibrated 1.8 t/year upper bound. `places.ts` includes grid factors but **none is used in the additive cooling term**.

### 5.2 Why 12/year is not a valid substitute

“12 times per year” is a **count**, not energy; one short fan use, a brief AC session and days of continuous room cooling differ hugely.

A frequency/duration model would additionally need at least:
- what counts as an occasion;
- AC vs evaporative cooler vs fan vs passive cooling;
- actual power/energy or thermal load and appliance efficiency;
- hours/use, location/season/building and household boundary;
- electricity source and grid factor;
- whether cooling energy is **already included in the entered household's home kWh**.

If home kWh is the utility-bill annual total, cooling electricity belongs to that total and **cannot be added again**. If home kWh is expressly *non-cooling* electricity, a separately validated cooling estimate might be additive, but the present label/input is not constructed that way. The physical heat rejected outdoors is not an additional GHG quantity to add to power-generation CO₂e.

With the current code, the 1.8 t/year increment is independent of grid and could be added even at identical household electricity consumption and identical climate. That is a **model untraceability and potential double count**, not an accepted cooling footprint.

### 5.3 Smallest responsible disposition

For the current user-facing Ledger:
- **Do not introduce occurrences/year** or re-label 0–10 as “heat exposure”; neither is an accepted measurement.
- **Do not keep an unsupported 1.8 t additive value solely because it makes the total move**.
- **Do not silently set the cooling footprint to zero** or claim a household has no cooling-related climate impact: zero production from this subcomponent can mean **excluded/not quantified**, not no actual energy or impact.
- HQ should authorize a small separate scoped decision and Tier-2 action to **remove/suspend the uncalibrated additive cooling term and quantitative label** until a defensible input/boundary exists, while preserving truthful household-electricity entry. Any resulting base-total change is real, must be acknowledged, and is not allowed as an executor-only silent “bug fix.”
- If a future optional cooling-use calculator is desired, accept an actual energy model first, avoid double counting with household electricity, and verify location/period/scope and input accessibility before code.

**Clearing classification:** **scientific/model semantic gap + potential double counting**, not slider styling or a formatting-only issue.

## 6. Direct downstream dependency inventory (bounded)

The task audits only budget-time and cooling authority, but their formulas lead to concrete adjacent public values.

| Derived output/label | Direct dependency | Consequence of audited gap | Status |
|---|---|---|---|
| “Budget used” time | `totalT` and `WORLD_EMISSIONS_GT` | incompatible CO₂e/CO₂ rate and misleading budget label; always rounds to 0 min in normal scenarios | **material unsupported quantity** |
| “Home energy” slice | `homeKwh × gridG` **plus** `coolT` | possible cooling-electricity double count; 1.8 t maximum untraceable | **affected** |
| “Household” total | sum of all slices, including `coolT` | inherits unsupported cooling amount; other slices not audited, not automatically validated | **affected, not fully audited** |
| “Each of the four” | `totalT / 4` | inherits cooling; four-person assumption is an explicit toy scenario | **affected** |
| “Earths required” | `(totalT/4)/FAIR_SHARE_T` | inherits cooling and unverified 2.0 threshold; “Earths” name implies a biocapacity equivalence not in code | **separate authority gap flagged; not an Earth calculation** |
| `lifetimeSharePct` (computed internal) | `totalT×55/(150 GtCO₂)` | inherits cooling; years fixed/assumed; CO₂e/CO₂ mismatch and unpinned 150; no personalized remaining-budget consumption established | **unsupported scenario if publicly surfaced; not current time Stat** |
| Home cooling-triggered `seeing` line | `cooling>=6` | threshold is ordinal and uncalibrated; does not establish exposure or cause | **dependent text trigger** |

Items **not audited and not certified invalid here**:
- diet categories' complete LCA methods;
- car, long-haul-flight, goods and services coefficients;
- locality grid-factor version;
- land and water outputs;
- the broader AP/Otherness/Constitution wording;
- total supply-chain completeness and representativeness of the four-person scenario.

A problem in a specific audited quantity does not prove each other Ledger term is wrong; conversely a reference to Poore & Nemecek or national grid intensities in the introductory prose does not validate every hard-coded number.

## 7. Source/constant authority matrix

| Record | Actual origin checked | Match to source? | Scientific/acceptance status |
|---|---|---|---|
| `WORLD_EMISSIONS_GT=41.6` | Global Carbon Budget 2024 FAQ, projected 2024 global total anthropogenic **CO₂** 41.6 Gt | **numeric provenance plausible/exact**, source/year/gas scope absent in code; superseded by revised newer estimates | **not accepted** as tCO₂e “budget” denominator |
| `REMAINING_BUDGET_GT=150` | repository says “illustrative 1.5°C (50%) from 2026”; compared with IGCC 2025 **130** and GCB 2025 **170** GtCO₂ from 2026 | **no exact supporting selection/method** in repo; uncertainty and method differ | **illustrative/unverified** |
| `FAIR_SHARE_T=2.0` | “order of UNEP/IPCC” comment, no exact source/equity allocation method | **not traced** as a universally accepted fair share | **unverified normative/model threshold** |
| `WORLD_POPULATION=8.2e9` | repo constant, not used in audited `budgetHours` | not audited for source/year, irrelevant to displayed time | **unused in audited path** |
| household `totalT` | `computeHousehold` six source-model slices; tCO₂e/year | arithmetic verified; component scientific factors not fully audited | **illustrative household model; not certified inventory** |
| `cooling/10×1.8` | only numeric literal in `calc.ts`; no applicable accepted source record | **no quantitative calibration found** | **untraceable** |
| `homeKwh×place.gridG` | dimensionally consistent energy × per-kWh rate; `places.ts` static location factors | dimensionally correct; grid source/year/location detail not audited | **conditional model assumption** |
| `PEOPLE=4` | repository scenario constant | exact toy four-person case; not user-calibrated | **explicit modelling choice** |
| `55` years extrapolation | literal in `calc.ts`; not linked to household tenure or future pathway | **no justified household scenario duration** found | **illustrative/unverified** |
| Cooling scientific principle | IEA 2018 & 2025 cooling electricity source/chart | evidence of energy dependence; **not** evidence of 1.8 t or index | **background only; no V0 Ledger factor adopted** |

The repo's accepted smartphone scientific packages/registries are **not** provenance for these Ledger coefficients. This review does not expand those contracts.

## 8. Recommended smallest clearing path and acceptance cases

### BUDGET — decision before cosmetic code

**Finding B-1:** current public “Budget used” is misleading even though the UI reacts and displays a rounded result.

**Owner/HQ gate:** new public model meaning/metric and abandonment of the current label are **scientific/product semantics**. HQ should choose an authorized small clearing task consistent with Owner direction and require a new empirical model/Owner decision if a replacement measure is proposed.

**Conservative safe candidate without new quantity:** omit the budget-time Stat from public headline until a supported metric exists, while preserving an explanatory note that current annual household footprint is an illustrative model, not a personal carbon-budget allocation. No fixed time substitute.

**Acceptance cases:**
- BUD-01: default/Plant/minima `totalT` recomputes and no false “stale state” diagnosis;
- BUD-02: no public “0 min” or seconds-as-personal-budget headline without an accepted model;
- BUD-03: exact field labels/source/year/gas scopes are explicit for any future quantitative replacement;
- BUD-04: global CO₂ vs household CO₂e are not equated; remaining budget, annual flow and per-capita allocation remain separate;
- BUD-05: no unknown-to-zero, hidden fair-share default, precision laundering or user guilt implication.

### COOLING — model qualification before input redesign

**Finding C-1:** ordinal index creates an untraceable additive annual tCO₂e and possible electricity double count.

**Owner/HQ gate:** cannot silently remove 1.8 t from totals, classify as zero, invent “12/year”, or import IEA's Singapore apartment calculation as default. A separately accepted scientific boundary must define cooling's relation to home electricity.

**Conservative safe candidate:** keep home electricity as the electricity-use input but suspend the stand-alone additional “manufactured cool” carbon number/uncalibrated control until separately justified; clearly communicate that cooling electricity is included **only where** the user's home kWh entry includes it.

**Acceptance cases:**
- COOL-01: a whole-house electricity figure including cooling does not acquire a second cooling electricity carbon term;
- COOL-02: an undefined index cannot generate a quantitative emission number;
- COOL-03: no frequency/year conversion or thermal exposure inference from ordinal score;
- COOL-04: excluded/unquantified cooling burden is **not** represented as proof of zero impact;
- COOL-05: location/grid, appliance, duration, efficiency, user-reported included/excluded scope and period all explicit before any future separate model;
- COOL-06: dependent total/per-person/“Earths”/extrapolation values and the `cooling>=6` narrative trigger are inspected after any accepted change;
- COOL-07: no AP/Owner-value diagnosis from household cooling usage.

### Downstream / sequencing

1. HQ independently reviews this empirical/model audit and notes the two unsupported public quantitative semantics promptly.
2. HQ/Owner determine the bounded product response (suspend misleading metrics vs explicitly adopt a fully supported new measure). The research handoff is **not** automatic implementation authorization.
3. Only then separately authorize a narrow Cursor Tier-2 change with targeted source-formula/format/double-count tests and rendered verification.
4. #186 affordability audit remains `BLOCKED` until this #185 return receives HQ disposition/release. No concurrency bypass or speculative economic inputs.
5. The ongoing #182 Cursor kit and #183 AP proposal are independent; do not reassign their semantics.

## 9. Validation and limitations

- Fresh #185 Issue inspected as `READY_FOR_RESEARCH`; branch/PR/handoff identity check found no existing execution.
- Created only `research/hq-re-2026-10-17-001-ledger-metrics`; marked Issue `IN_PROGRESS`.
- Pinned actual starting main `667b41a45cc39871a6539a5f78fda0389a758d27` instead of outdated Issue starting main.
- Inspected four specified source files, D-014/#180, applicable source-package/file inventory and controlling repository governance.
- Direct numeric recomputation covers L-01 through L-05 and demonstrates exact whole-minute formatting. This is code-arithmetic validation, **not** deployed-build matching or scientific validation.
- Primary sources checked: archived GCB 2024 FAQ; Friedlingstein et al. GCB 2025; Forster et al. IGCC 2025; IEA 2018 cooling and IEA 2025 model chart; UNEP official Emissions Gap Report series listing. Source versions/dates/scopes recorded; no scraped snippet alone was used to accept a new factor.
- No 1.8 t household index study or accepted Ledger-specific coefficient registry found. That is an **absence of support in the inspected source set**, not proof that no study exists globally.
- Deployment SHA for HQ's public Render observation is unknown and not assumed to equal inspected main.
- No application changes, tests, numerical constants, accepted contracts, source registry/packages, AP corpus, profile, Site, homepage redesign or data tracking performed.
- Docs-only: no app build/render/full regression or hosted CI required for this specialist proposal; independent HQ review controls disposition.

**Research conclusion:** `VERIFIED_FOR_HQ_REVIEW`.  
**Self-merge:** **NO**.
