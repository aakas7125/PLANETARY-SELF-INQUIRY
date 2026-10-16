# HQ-RE-2026-10-16-001 — Optional old-phone fate and bounded end-of-life context

**Issue:** #170  
**Task ID:** `HQ-RE-2026-10-16-001`  
**Cycle:** `INITIAL-1`  
**Workstream:** Research & Evidence  
**Execution class:** Tier 3 — empirical / product input semantics  
**Branch:** `research/hq-re-2026-10-16-001-old-phone-fate-and-context`  
**Issue starting accepted main:** `b0e1c6f060c32f0006c0a70358d4a675eb61c400`  
**Actual execution starting main:** `696afa9822cfe7048b80805b57778572d46aa76a`  
**Status:** Research specialist proposal only; receipt/merge is not adoption  
**Self-merge:** NO

## 1. Result

A single optional old-phone-fate question is empirically supportable as a **hypothetical, user-reported scenario input** when at least one replacement alternative is being compared.

It must not be presented as:
- an observed disposal event;
- a verified downstream route;
- a probability;
- a final purchase commitment;
- evidence of unsafe/informal handling;
- evidence of an unsound e-waste site;
- avoided e-waste, avoided production, market displacement or recycling credit.

The accepted seven fate categories remain authoritative. The new work is only:
1. when/how to ask the optional question;
2. how to preserve unanswered versus explicit uncertainty;
3. how the anticipated fate can annotate comparison/education without fabricating Impact conditions;
4. what bounded contextual statistics can be shown separately.

The current app has no exposed fate question. The current evaluator also contains an important vocabulary mismatch: accepted contract/source semantics use the seven canonical values, while `input-decision.mjs` still recognizes older internal values for several historical tests (`reuse_by_other`, `stored`, `trade_in_unknown`). A future implementation must reconcile that explicitly rather than silently treating the two vocabularies as identical.

No AP interaction change is required by this Research result.

---

# 2. Authority and inspected state

## 2.1 Owner/product direction

`project-state/DECISIONS.md`, D-010:

- preserve the accepted eight-stage lifecycle;
- Research specifies the optional/contextual old-phone-fate input first;
- proposed owner question was: “If you stop using your current phone, what do you think will happen to it?”;
- use existing contract categories;
- preserve unanswered versus unknown;
- distinguish anticipated fate from established route;
- no answer is forced;
- no comparison choice becomes a final decision;
- fate/context alone cannot manufacture a personal e-waste consequence or AP gate.

## 2.2 Accepted empirical authority

`contracts/EMPIRICAL_SMARTPHONE_V0.md`:
- accepted fate set;
- prospective accounting;
- exact-mass-only waste rule;
- global e-waste rates are context, not individual probability;
- generic EOL climate remains unquantified;
- generic recycling credit remains null;
- no 1:1 avoided-production credit.

`contracts/SECONDARY_PATHWAYS_V0.md`:
- reuse and refurbishment remain distinct;
- prior manufacture excluded under the direct/cut-off view is not avoided production;
- market displacement remains separate and disabled in the primary score.

`provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md`, §D–F:
- seven accepted fate values;
- `continue_use`: no current retirement event / no e-waste now;
- `sell_or_gift_for_reuse`: second life, no immediate e-waste, no avoided-new credit absent displacement evidence;
- `trade_in_unknown_next_use`: downstream fate unknown, no avoided-production credit;
- `store_in_drawer`: dormant/retired, not formal recycling;
- `formal_recycling`: physical mass only if exact mass known; global rate not applied to the individual;
- `discard_general_waste`: conditional pollution/e-waste explanation allowed; no inferred informal destination/probability;
- `unknown`: no silent recycling/dumping/reuse/storage assumption.

`R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0` / RC10:
- T19 reuse;
- T20 storage;
- T21/T22 formal recycling exact/unknown mass;
- T23 unknown trade-in downstream;
- unknown never becomes a route/default.

## 2.3 Current app / resolver state

Inspected at execution main `696afa9822cfe7048b80805b57778572d46aa76a`:

- `comparison-ux.mjs`: no exposed old-device-fate answer.
- `impactContextFromComparison`: carries current comparison cards/labels; accepted generic-new manufacturing → Climate bridge only.
- `empirical-ewaste-people-boundary.mjs`: all seven canonical fate values are explicitly **non-establishing** for unsafe/informal handling.
- `empirical-ewaste-eco-boundary.mjs`: all seven canonical fate values are explicitly **non-establishing** for unsound-site handling.
- `continue_use`, `sell_or_gift_for_reuse`, `store_in_drawer`, and `formal_recycling` contradict same-record unsafe/unsound handling assertions.
- `trade_in_unknown_next_use`, `discard_general_waste`, and `unknown` remain uncertain; they do not establish unsafe/unsound handling.
- global collection-rate context does not establish handling or route.
- current generic lifecycle module already keeps end-of-life context separate from one phone’s fate/probability.
- #168 accepted usability review found generic/new evidence and “not shown” pathways behaved as accepted; it made no human-comprehension claim. U-05/U-06 are heuristic questions, not authority for this input.

## 2.4 Current evaluator vocabulary discrepancy

`input-decision.mjs::applyOldDeviceFate` currently recognizes:

- `reuse_by_other`
- `stored`
- `formal_recycling`
- `trade_in_unknown`

The immutable input-test package uses those historical strings in T19–T23.

The accepted core empirical contract/source package instead uses:

- `continue_use`
- `sell_or_gift_for_reuse`
- `trade_in_unknown_next_use`
- `store_in_drawer`
- `formal_recycling`
- `discard_general_waste`
- `unknown`

This is an implementation vocabulary gap, not permission to replace the accepted public semantics with legacy names.

---

# 3. Exact optional question and state

## 3.1 Why the Owner draft needs one minimal adjustment

Owner draft:

> If you stop using your current phone, what do you think will happen to it?

That wording makes the accepted `continue_use` category awkward or contradictory: if use has already stopped, “continue use” no longer naturally applies.

The smallest faithful repair is to make the scenario about obtaining a replacement, not about asserting that use has stopped.

## 3.2 Implementation-ready question

> **If you ended up getting another phone, what do you think would happen to your current phone next?**

Helper:

> **Optional and hypothetical. This does not mean you have decided to replace your phone. Choose what you currently expect. If it would depend on the option or you do not know, choose “I’m not sure.”**

Unanswered status:

> **No old-phone fate has been supplied. No route is assumed.**

Answered status:

> **This is what you currently expect in a hypothetical replacement scenario. It is not a verified event or downstream route.**

Explicit-unknown status:

> **You’re not sure what would happen. No route is assumed.**

Limit text beside any fate-based context:

> **This answer does not establish unsafe handling, a disposal site, a recycling probability, avoided production, or harm to a particular person or ecosystem.**

## 3.3 Neutral option labels

| Canonical value | Public label | Accepted meaning retained |
|---|---|---|
| `continue_use` | **Keep it in active use (for example, as a backup)** | no retirement/e-waste-now event established |
| `sell_or_gift_for_reuse` | **Sell it or give it to someone else to use** | second life; no immediate e-waste; no automatic displaced-new credit |
| `trade_in_unknown_next_use` | **Trade it in; I don’t know what happens after that** | downstream next use/fate remains unknown |
| `store_in_drawer` | **Keep it stored or in a drawer** | dormant/retired; not formal recycling |
| `formal_recycling` | **Send it for formal e-waste recycling** | hypothetical formal route; not a global-rate probability |
| `discard_general_waste` | **Throw it away with general household waste** | general discard only; no inferred landfill/informal-recycling destination |
| `unknown` | **I’m not sure** | explicit user uncertainty |

A trade-in must remain separate from formal recycling unless the downstream route is actually known.

## 3.4 Trigger and location

Show the optional question **once in the empirical comparison step** when at least one replacement alternative is currently selected:

- `used_secondhand`
- `refurbished`
- `new`

Do not show it for a keep/repair-only comparison.

Recommended location:
- after the common comparison horizon and candidate-specific service inputs;
- before the comparison result cards.

Reason:
- it is a scenario fact that can apply to replacement pathways;
- it is not AP inquiry;
- it is not final choice;
- it should not be repeated per replacement candidate.

## 3.5 Multi-alternative rule

The answer is **not bound to a specific candidate phone**.

Its scope is:

> “what I currently expect would happen to my current phone if I ended up getting another phone.”

Therefore:
- used/refurbished/new may be inspected together;
- one old-phone-fate answer remains a single anticipated scenario annotation;
- selecting several alternatives does not create several disposal events;
- if the user expects fate to depend on the candidate, they may choose `unknown` or leave the question unanswered;
- no per-candidate fate questionnaire is introduced.

## 3.6 Smallest state schema

```text
OldPhoneFateInput {
  active: boolean                    // derived: any replacement alternative selected
  answer_status: "unanswered" | "answered"
  anticipated_fate:
    null |
    "continue_use" |
    "sell_or_gift_for_reuse" |
    "trade_in_unknown_next_use" |
    "store_in_drawer" |
    "formal_recycling" |
    "discard_general_waste" |
    "unknown"

  evidence_class:
    null | "user_anticipated_hypothetical"

  applies_to: "replacement_scenario_set"
  actual_event_occurred: false
  actual_route_verified: false
}
```

Important distinction:

- `anticipated_fate = null` + `answer_status=unanswered` = user gave no answer.
- `anticipated_fate = unknown` = user explicitly said they do not know.

Neither may be silently converted into another category.

---

# 4. Canonical-to-current evaluator mapping

A Tier-2 implementation should make the canonical enum the public/runtime authority and isolate legacy test/evaluator strings behind a compatibility layer until the evaluator is normalized.

| Canonical accepted value | Existing legacy evaluator value | Current evaluator consequence | Required future handling |
|---|---|---|---|
| `continue_use` | none | no direct `applyOldDeviceFate` branch | implement canonical scenario semantics directly; do not invent a legacy synonym |
| `sell_or_gift_for_reuse` | `reuse_by_other` | immediate e-waste false; displacement credit null | compatibility mapping is semantically safe if explicit |
| `trade_in_unknown_next_use` | `trade_in_unknown` | immediate e-waste unknown; next use unknown; displacement credit null | compatibility mapping is semantically safe if explicit |
| `store_in_drawer` | `stored` | immediate e-waste false; dormant/retired | compatibility mapping is semantically safe if explicit |
| `formal_recycling` | `formal_recycling` | immediate e-waste true; exact mass only if known | same string; keep scenario/hypothetical label |
| `discard_general_waste` | none | no direct current evaluator branch | add canonical scenario handling; no inferred landfill/unsafe route |
| `unknown` | none in current `applyOldDeviceFate` branch | no fate derivatives created | preserve explicit unknown and derivatives as unknown |

Do not expose legacy strings in UI or new contracts.

---

# 5. Propagation and evidence truth table

All rows below describe an **anticipated hypothetical fate**, not an observed event.

| Fate | Comparison/display effect that is legitimate | Impact / resolver effect | Quantities available | Prohibited deductions |
|---|---|---|---|---|
| **Unanswered** | show no route; “No old-phone fate has been supplied.” | no e-waste condition; no resolver override | none | no default route, no probability, no e-waste event |
| **continue_use** | “Current phone is expected to remain in active use even if another phone is obtained.” | may be passed only as canonical fate context; it does not establish unsafe/unsound handling and contradicts a same-record unsafe/unsound assertion | no EOL mass/event | no retirement, recycling, avoided production or displaced-new credit |
| **sell_or_gift_for_reuse** | “Expected second life with another user.” | non-establishing for unsafe/unsound handling; contradictory to same-record e-waste processing claim | no generic transfer burden; no displacement credit | no 1:1 avoided new phone, no immediate e-waste, no market displacement inference |
| **trade_in_unknown_next_use** | “Expected trade-in; what happens afterwards is unknown.” | fate remains non-establishing; independent handling evidence would still be required | no route probability; no credit | do not assume reuse, recycling, export, landfill or disposal |
| **store_in_drawer** | “Expected to be stored/dormant.” | non-establishing and contradictory to same-record unsafe/unsound handling | no recycling/EOL quantity | storage ≠ recycling; storage ≠ environmentally recovered; not automatically generated e-waste |
| **formal_recycling** | “Expected to enter a formal recycling route.” Always label as hypothetical/user-anticipated. | does not establish unsafe/unsound handling; same-record unsafe/unsound assertion is contradictory | exact device/component mass may be shown only as a **conditional scenario mass** if an exact accepted mass is available and the route occurs; otherwise null | no global-rate probability; no recovery percentage; no recycling credit; no generic EOL CO₂e |
| **discard_general_waste** | may show an accepted **conditional** pollution/e-waste explanation: downstream handling is not known | fate alone does not set `unsafe_or_informal_handling_established` or `unsound_site_handling_established` | exact scenario hardware mass only if separately supported; no generic mass | no landfill claim, no informal-processing destination, no probability, no person/site attribution |
| **unknown** | “You’re not sure what would happen.” | non-establishing; no route; no AP consequence | none | no recycling/dumping/reuse/storage assumption |

## 5.1 Exact resolver predicates

E-waste people:

```text
unsafe_or_informal_handling_established === true
```

is required for `SP-PATH-EWASTE-PEOPLE-001`.

Fate/context alone returns non-emission.

E-waste ecosystems:

```text
unsound_site_handling_established === true
```

is required for `SP-PATH-EWASTE-ECO-001`.

Fate/context alone returns non-emission.

The old-phone-fate question must **never** write either predicate.

## 5.2 What can be shown without a personal resolver emission

Generic education may still explain:
- formal recycling as one possible route;
- storage/dormancy;
- reuse/second life;
- that general discard can lead to waste-management/pollution concerns depending on what happens downstream;
- global/european aggregate context in §8 below.

These are educational/context statements, not “this phone caused/entered X.”

## 5.3 Quantities that remain unavailable

Unless another accepted exact record supplies them:

- generic phone mass;
- generic EOL CO₂e;
- recycling credit;
- material recovery percentage;
- probability of formal recycling;
- probability of landfill;
- probability of informal handling;
- unsafe-processing exposure;
- site/location;
- pollution quantity;
- victim/illness/death count;
- ecosystem/biodiversity loss;
- avoided e-waste;
- displaced new-device production;
- market-displacement credit.

Unknown remains unknown, not zero.

---

# 6. Comparison, lifecycle and AP boundaries

## 6.1 Comparison

The fate answer may:
- annotate replacement scenario cards with the same hypothetical old-phone fate;
- show supported scenario-state facts such as second-life, dormant, or route unknown;
- show exact mass only under the strict formal-recycling scenario rule if an exact accepted device/component mass exists.

It must not:
- change adequacy;
- change service horizon;
- choose a winner;
- preselect final choice;
- add generic EOL climate;
- add a recycling/displacement credit.

Keep/repair cards must not inherit a replacement-triggered fate event.

## 6.2 Lifecycle guide

The eight accepted lifecycle stages remain unchanged.

End-of-life may add a clearly separated **“Wider context”** block containing accepted/newly proposed aggregate statistics (§8).

That block:
- is generic/global/EU context;
- does not use the user’s answer as denominator/probability;
- does not say “your phone is likely to…”;
- does not open Impact/AP gates.

## 6.3 Impact

The answer may be supplied to the e-waste resolvers only as `old_device_fate` context for fail-closed/contradiction handling.

It must not set:
- `unsafe_or_informal_handling_established`;
- `unsound_site_handling_established`;
- any named site/person/ecosystem;
- collection probability.

For `discard_general_waste`, any public pathway language remains explicitly conditional because downstream handling is not established.

## 6.4 D-005 / QSP / Otherness

Under currently accepted D-005 semantics, this fate answer is **annotation/context only**.

It is not a material basis for the accepted climate consequence record.

Therefore changing/clearing it does **not** by itself invalidate existing raw QSP or Otherness answers.

If a future separately authorized Research slice adds independent evidence that actually establishes an e-waste condition, then that condition/basis becomes material. Removal/change of such a qualifying record must follow D-005’s existing downstream invalidation rule.

No such new gate is created here.

---

# 7. State and invalidation matrix

| Action | Fate state | Comparison/context | Impact | QSP / Otherness |
|---|---|---|---|---|
| first replacement alternative selected | question becomes active; starts unanswered | no fate annotation until answered | none | unchanged |
| answer selected | store canonical anticipated fate | recompute only fate-related annotation | may pass non-establishing fate context; no unsafe/unsound flag | unchanged |
| answer changed | replace previous raw fate value | remove prior annotation and recompute | remove prior fate context; recompute fail-closed state | unchanged unless a future independently qualifying e-waste basis exists |
| answer cleared | set `answer_status=unanswered`, `anticipated_fate=null` | clear fate annotation | clear fate context | unchanged |
| explicit “I’m not sure” | `anticipated_fate=unknown` | show uncertainty | no e-waste condition | unchanged |
| add/switch replacement alternatives while one remains selected | answer remains because it is defined for the generic “get another phone” scenario, not a candidate ID | same answer may annotate all replacement scenario cards without creating multiple events | no new condition | unchanged |
| remove all replacement alternatives | question inactive; raw answer may remain in local comparison state but MUST NOT be displayed/propagated while inactive | clear active fate annotations | clear fate context | unchanged |
| re-add a replacement alternative in same comparison session | question active again; show the retained raw answer visibly so user can revise; do not silently hide/rebind it | recompute | recompute | unchanged |
| comparison reset | clear fate answer with comparison state | clear | clear | existing accepted downstream reset behavior applies |
| upstream situation/inquiry edit/back that resets comparison | clear fate answer with comparison state | clear | clear | existing accepted downstream invalidation applies |
| current-phone exact model changes | fate answer itself unchanged; any exact-mass annotation recomputes | stale mass removed/replaced | no new route condition | unchanged |
| evidence/source/reference changes | fate raw answer unchanged; derived annotations recompute | stale source-derived quantity removed | no silent claim rebinding | D-005 material-basis rule applies only if a qualifying consequence basis changed |

The “raw answer may remain while inactive” rule is safe because:
- it is not candidate-bound;
- it is displayed again when reactivated;
- it produces no hidden evidence while inactive;
- reset/upstream invalidation clears it.

A future product implementation may choose to clear it when all replacement alternatives are removed, but that would be a UX choice, not an empirical requirement.

---

# 8. Contextual statistics — bounded candidate set

Access date for all source verification: **2026-10-16**.

No statistic below changes a user’s fate result or resolver condition.

## Candidate 1 — global e-waste generation and documented formal collection/recycling

**Disposition:** accepted-source transcription; useful.

**Value**
- 62 billion kg e-waste generated globally in 2022.
- 13.8 billion kg documented as formally collected and recycled in 2022.
- 22.3% documented formal collection/recycling rate.

**Numerator / denominator**
- numerator: mass documented as formally collected and recycled;
- denominator: total global e-waste generated in 2022;
- ITU reports both 13.8 billion kg and 62 billion kg.

**Scope**
- geography: global;
- year: 2022;
- unit: mass / percentage of generated e-waste mass;
- all electrical/electronic equipment covered by GEM, **not smartphones**;
- annual generated/recycled flow, not household stock.

**Source status**
- already represented by accepted S7 / Global E-waste Monitor 2024;
- ITU/UNITAR institutional global statistics;
- GESP uses an internationally harmonized e-waste statistics framework; this is compiled global statistical/modelled evidence, not direct observation of every discarded device.

**Primary source**
- ITU, *The Global E-waste Monitor 2024*, Key Findings & Statistics:
  https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-Waste-Monitor-2024.aspx
- launched 20 March 2024; the ITU/UNITAR partnership is preparing the next Monitor for 2027, so 2024 remains the current global Monitor at this access date.

**Ready-to-use copy**
> **Globally, 62 billion kg of e-waste was generated in 2022. About 22.3% of that mass was documented as formally collected and recycled.**

**Required limit**
> **This covers all e-waste, not phones alone, and it is not the probability that your phone will be recycled. The undocumented share must not be labelled “landfill.”**

## Candidate 2 — small IT and telecommunication equipment

**Disposition:** accepted-source transcription; useful if the product wants a closer category than all e-waste.

**Value**
- 4.6 billion kg of e-waste in 2022 in **small IT and telecommunication equipment**;
- 22% documented collection and recycling rate.

**Category examples**
- laptops;
- mobile phones;
- GPS devices;
- routers.

**Numerator / denominator**
- denominator: generated e-waste mass in this equipment category;
- numerator: category mass documented as formally collected/recycled;
- the official public summary gives the 22% rate but does not provide a phone-only numerator.

**Scope**
- global;
- 2022 annual flow;
- mixed equipment category, **not smartphone-only**.

**Primary source**
- UNITAR/ITU Global E-waste Monitor 2024 official release, “E-waste by category”:
  https://unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling
- matching ITU report Figure 10 records a 22% documented formal collection/recycling rate for the category.

**Ready-to-use copy**
> **Small IT and telecommunication equipment — a category that includes mobile phones alongside laptops, routers and other devices — generated 4.6 billion kg of e-waste globally in 2022. About 22% of that category was documented as collected and recycled.**

**Required limit**
> **This is a mixed equipment category, not a smartphone-only rate and not an individual route probability.**

## Candidate 3 — EU self-reported fate of old mobile phones/smartphones

**Disposition:** genuinely new contextual evidence proposal; useful and directly phone-specific.

**Values, EU 2024**
- 51% of individuals aged 16–74: old mobile phone/smartphone kept in the household;
- 18%: gave or sold it to someone outside the household;
- 11%: recycled it;
- 2%: threw it away without recycling.

**Denominator**
- Eurostat reports percentages of **EU individuals aged 16–74**, not a device-count denominator and not only people who currently hold an old phone.
- The four percentages therefore should not be normalized to 100% or treated as a conditional distribution over old-phone owners.

**Measure**
- survey response / self-report from Eurostat’s ICT use in households and by individuals survey;
- not observed downstream waste handling;
- green-ICT information is collected every two years;
- most national surveys occur in Q2 asking about activities in Q1.

**Scope**
- EU;
- 2024;
- mobile phones and smartphones together;
- personal/household reported disposition;
- this is not a count of devices, not a mass flow and not proof of actual recycling quality.

**Primary source**
- Eurostat, *Green ICT — digital devices in households*, data extracted June 2025, publication current at 2 June 2026.
- Table 1: “Methods of disposing of a mobile/smartphone no longer in use, 2024 (% of individuals aged 16 to 74)”
- dataset: `isoc_eco_dd`
- PDF:
  https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/118992.pdf
- Eurostat news/data pointer:
  https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250725-2

**Ready-to-use copy**
> **In Eurostat’s 2024 EU survey, 51% of people aged 16–74 reported keeping an old mobile phone or smartphone at home; 18% gave or sold one to someone else, 11% reported recycling one, and 2% reported throwing one away without recycling.**

**Required limit**
> **These are self-reported shares of EU individuals, not probabilities for this phone and not observed downstream routes. “Thrown away without recycling” must not be relabelled “landfilled.”**

## Not selected / not supported

### Phone-specific landfill probability
**NOT SUPPORTED for V0.**

No inspected primary source justifies:
- “X% of old smartphones go to landfill” as a general personal probability;
- interpreting the undocumented global e-waste share as landfill;
- converting Eurostat’s “threw it away without recycling” into landfill.

### 700 million unused/waste mobile phones in EU households
The European Commission has cited an estimated stock around 700 million in earlier policy material. This task does **not** select it because the newer Eurostat 2024 survey provides a clearer current phone-specific household measure with an explicit statistical denominator and method. No quota needs filling.

---

# 9. Visual / quantitative integration boundary

The three context candidates belong only in a separately labelled **End-of-life — wider context** presentation.

They may be shown as:
- global all-e-waste flow;
- global small-IT/telecom category;
- EU old-phone self-report.

They must never be combined into a single probability tree.

Do not:
- multiply the user’s phone mass by 22.3%;
- assign the user a 51% storage probability;
- use 11% as this phone’s formal-recycling probability;
- infer unsafe processing from the undocumented share;
- add any of these statistics to climate totals;
- make them AP gate evidence;
- use them to recommend keep/repair/replacement.

The accepted eight-stage non-additive production boundary remains unchanged:
- production 25–70 kg CO₂e/device is a whole manufacturing bracket;
- distribution 2–4 kg CO₂e;
- charging 4 kWh/year central, 2–8 sensitivity;
- repair ranges only where their accepted scenario applies;
- no new stage allocation.

---

# 10. Focused future acceptance matrix

A later Tier-2 implementation should cover at least:

| ID | Input/state | Expected |
|---|---|---|
| FATE-01 | keep/repair only | fate question absent/inactive; no hidden fate context |
| FATE-02 | one replacement option | optional question visible; unanswered remains null |
| FATE-03 | several replacement options | one shared hypothetical answer; no multiple old-phone events |
| FATE-04 | explicit unknown | `anticipated_fate=unknown`; no default route |
| FATE-05 | sell/gift | second-life annotation; no immediate e-waste/displacement credit |
| FATE-06 | storage | dormant/storage annotation; not formal recycling |
| FATE-07 | trade-in unknown | downstream route unknown; no reuse/recycling assumption |
| FATE-08 | formal recycling + exact accepted mass | conditional scenario mass may display; no global probability/recovery/credit |
| FATE-09 | formal recycling + no exact mass | no generic mass |
| FATE-10 | general waste | conditional context only; unsafe/informal and unsound-site predicates remain unset |
| FATE-11 | any fate + no independent handling evidence | e-waste people/ecosystem resolver does not emit |
| FATE-12 | continue/reuse/store/formal recycle + injected same-record unsafe/unsound flag | resolver fails closed as contradictory |
| FATE-13 | edit/clear answer | previous fate annotation/context removed immediately |
| FATE-14 | remove all replacement alternatives | fate question/context inactive; no stale display/Impact record |
| FATE-15 | comparison reset/upstream edit | fate state cleared with comparison; no stale downstream evidence |
| FATE-16 | exact current-phone model changes | raw fate answer retained; exact-mass annotation recomputed/cleared |
| FATE-17 | global context displayed | no probability applied to user/device; no AP trigger |
| FATE-18 | Eurostat context displayed | labels EU/2024/individuals/self-report; no normalization or individual inference |
| FATE-19 | QSP/Otherness answers already exist | fate annotation edit alone does not silently rebind or rewrite them |
| FATE-20 | future actual qualifying e-waste basis removed | existing D-005 material-basis invalidation required; not implemented by this task |

No broad app regression/build/render is required for this docs-only specialist task.

---

# 11. Smallest implementation slices after HQ acceptance

## Slice A — optional fate input

- add the question/helper/options in comparison;
- canonical enum state;
- unanswered vs unknown;
- replacement-only activation;
- legacy evaluator compatibility isolated and tested;
- fate annotations only;
- no new statistics required to ship this slice.

## Slice B — bounded context

- add accepted S7 global/all-e-waste and small-IT context;
- optionally add the new Eurostat 2024 EU old-phone context if HQ accepts it;
- source/scope/limits visible;
- no resolver/AP effect.

These can be one small Tier-2 task if HQ prefers, but the new Eurostat evidence should be explicitly accepted before Cursor writes public scientific copy.

---

# 12. Unresolved items and domain routing

## No AP/Owner blocker

No new AP question, Protect My Four meaning, QSP meaning, philosophical interpretation or reserved Owner decision is required.

The minimal wording change from “if you stop using” to “if you ended up getting another phone” is needed only to make the already-directed optional question internally consistent with the already-accepted `continue_use` category.

## Implementation discrepancy for HQ/Cursor

Before Tier-2 implementation, HQ should explicitly require canonical fate values at the UI/context boundary and a tested compatibility/normalization path for the historical evaluator strings.

Do not let Cursor choose ad hoc mappings.

## New evidence requiring scoped HQ adoption

Only Candidate 3 (Eurostat 2024) is genuinely new scientific/context evidence.

Candidates 1–2 are current-source verification/transcription of already accepted S7 context.

---

# 13. Validation record

Repository checks:
- Issue #170 was `READY_FOR_RESEARCH`, no owner/specialist approval pending.
- No matching task branch, PR or handoff existed before claim.
- Claimed `IN_PROGRESS`.
- Branch created from actual main `696afa9822cfe7048b80805b57778572d46aa76a`.
- #173 remains `BLOCKED` by explicit priority/concurrency dependency and was not started.
- #157 and #148 remain non-executable external-feedback/backlog records.

Repository material inspected:
- D-010;
- empirical/secondary/regression contracts;
- immutable 0.3.0 package and input-test fate cases;
- accepted #146 evidence map;
- lifecycle presentation;
- comparison / Impact / input-decision;
- e-waste people/ecosystem boundaries;
- #168 usability handoff.

External primary/institutional material verified:
- ITU Global E-waste Monitor 2024 current official page and key statistics;
- UNITAR/ITU official 2024 report release/category statistics;
- Eurostat 2024 `isoc_eco_dd` Green ICT old-phone results and methodology;
- current status checked against ITU/UNITAR 2027 Monitor preparation.

No app, contract, invariant, registry, source-package, corpus, Owner-control or profile file changed.

## Return

**Research result: VERIFIED_FOR_HQ_REVIEW**

**Self-merge: NO**
