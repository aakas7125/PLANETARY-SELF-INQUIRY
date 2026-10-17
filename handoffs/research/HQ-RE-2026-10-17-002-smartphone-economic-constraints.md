# HQ-RE-2026-10-17-002 — Smartphone affordability and practical economic constraints

**Issue:** #186  
**Task ID:** `HQ-RE-2026-10-17-002`  
**Cycle:** `INITIAL-1`  
**Workstream:** Research & Evidence  
**Execution class:** Tier 3, evidence/product-boundary proposal only  
**Issue release starting main:** `63f4edd0b47b1772cf0f12c1275400b9d2abddac`  
**Actual execution starting main:** `a3cfa4d42d94d9eb2a3a5202a1668ae45312dc60`  
**Branch:** `research/hq-re-2026-10-17-002-economic-constraints`  
**Primary-source access:** 2026-10-17  
**Result:** `VERIFIED_FOR_HQ_REVIEW` — specialist proposal, **not product adoption**  
**Self-merge:** **NO**

## 1. Decision summary

**Finding:** The accepted smartphone inquiry **recognizes practical needs and preserves a legitimate final choice**, but it has **no structured representation of out-of-pocket repair/replacement cost, whether money is actually available, how soon a functioning device is needed, or repair downtime**. Consequently it is possible for PSI to display an environmental pathway without making it obvious that the pathway may not be financially or temporally feasible.

This is a **coverage/product-design gap**, not proof the current environmental estimator is numerically defective, and not a finding that repair ought to be selected. An AP prompt permitting a practical answer is not a financial comparison.

**Smallest proportionate candidate:** a distinct **optional, user-authored practical-constraints note alongside empirical comparison**. It may capture current price/affordability/time constraints in the user's own words (or stay unanswered), be shown faithfully beside the relevant options, and leave environmental estimates, eligibility, AP answers and final choice untouched. **Do not initially build a monetary calculator, budget score or cost-per-year ranking.**

A later **optional typed quote/cost record** for a selected pathway may be worth separate adoption if human review shows that unstructured context is insufficient. This document defines its evidence/validation boundaries but **does not authorize or recommend implementing it now**.

No car domain, financial advice, seller search, subscription/payment feature, data collection service, direct purchase recommendation, or universal economic threshold is proposed.

## 2. Evidence and authority reviewed

### 2.1 Feedback status

**Reviewer C — Issue #181:** anonymous Owner-supplied paraphrase; **reviewer did not use PSI**. The hypothetical “repair costs as much as an adequate replacement” is a **question**, not a measured current price, representative survey finding, UI defect or instruction to favor replacement. The electric-car example is outside the smartphone vertical. Do not attach the reviewer's identity, location, budget or financial situation.

**Owner D-014:** independently authorizes this bounded Research investigation, which is separate from Ledger #185, Cursor #182/#190 and AP #183. No new smartphone economic model was adopted by D-014.

### 2.2 Accepted PSI authority

| Repository authority | What it actually settles | What it does not settle |
|---|---|---|
| `contracts/USER_INPUT_MODEL_V0.md`, canonical rules | Raw situation facts authoritative; missing user fact ≠ invented default; adequacy combines safety, required functionality and adequate software/security support; repair type and post-repair adequate service required for applicable environmental modelling | Price, cash available now, affordability, quote certainty, repair downtime or a user budget |
| `contracts/EMPIRICAL_SMARTPHONE_V0.md` §§Core pathway accounting, Values | Prospective kg CO₂e pathways over common **explicit** adequate-service period, conditional repairs, new production/distribution, no unknown-to-zero | Currency, invoices, price prediction, financing, total cost of ownership or economic winner |
| `contracts/SECONDARY_PATHWAYS_V0.md` §§Pathway split, Used, Refurbished, Input/results | Used vs refurbished differ; user-provided expected service; unknown direct emission evidence remains unknown; grade/price may **not** infer device lifetime | Actual secondary-device price, warranty value, affordability, delivery time or market quotes |
| `contracts/AP_INTERACTION_V0.md` §§APQ1/APQ5/APQ6 | APQ1 asks what the current phone cannot do adequately; APQ5 permits practical difficulties when imagining keeping; Q6 and final choice remain open and unranked; raw answer authority remains | AP-derived financial constraints, hidden motive inference, a monetary calculation, preference for repair/keep |
| `app/src/lib/smartphone/situation-ux.mjs` `SITUATION_QUESTIONS`; `input-decision.mjs` `deriveAdequacy` / `evaluateAdequacyAndUnknownState` | Three structured trivalent inputs: safety, required functions and security/support; an inadequate phone is not rescued by a price field | No structured economic-input field or monetary feasibility gate |
| `app/src/lib/smartphone/comparison-ux.mjs` `createComparisonState` (lines 477–493), `buildPathwayEvaluatorInput` (734–770), `describeComparison` (1600ff); `secondary-pathway.mjs` | Selected keep/repair/used/refurb/new; common service period, remaining service, repair category and post-repair service, used/refurb service, optional exact/generic model IDs and anticipated old-phone fate | No stored prices, currencies, funds, monthly payment, availability/downtime fields, explicit economic calculation or automatic economic ranking |
| `app/src/components/smartphone-comparison.tsx`; `smartphone-situation.tsx` | Forms expose only above accepted input set; no hidden monetary control found | No evidence of a finance calculator in the current production comparison |
| `app/src/lib/smartphone/final-choice-ux.mjs` | Explicit final pathways keep/repair/used/refurb/new/investigate/unclear, fixed order and nonrecommendation | Does not infer final choice from price, climate or self-reported urgency |
| `project-state/PUBLIC_BETA_PROFILE.md` | Approved minimal anonymous public runtime profile has no accounts, persistent personal-data store or tracking; client state and runtime checks are separately validated for accepted surface | Not a guarantee that every future input remains device-only, is deleted instantly, or cannot leak without testing |

At inspected main, targeted source scan of `input-decision.mjs`, `comparison-ux.mjs`, `secondary-pathway.mjs`, `smartphone-situation.tsx`, `smartphone-comparison.tsx` found **zero** `cost/price/money/afford/budget/currency/downtime/urgent/quote/discount/interest/financial` field or label occurrences. This is **current production/contract coverage**, not a claim no other research or backlog document mentions economics.

### 2.3 Independent primary institutional evidence (bounded)

The scope does not require a general finance or behavioral-economics literature review. Two original institutional sources confirm **what decision dimensions matter**, without determining what any PSI user can afford:

**E1 — European Commission, SWD(2023) 59 final**, *Impact assessment accompanying proposed common rules promoting the repair of goods*, 22 March 2023, EUR-Lex primary HTML: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52023SC0059 ; inspected **§2, Driver 2 (lack of transparency on availability/conditions), Driver 3 (inconvenience), Driver 4 (repair economic attractiveness)**, and decision factors at around lines 503–520 in the retrieved document.

- Commission assessment links repair/replacement decisions to quoted **price**, diagnosis uncertainty, repairer availability, **repair duration**, replacement-device availability, trust and service quality.
- It explicitly recognizes that a repair can be expensive relative to an available replacement and that finding its price can require diagnosis.
- Basis: institutional impact assessment consolidating surveys, interviews and behavioral experiments for **EU consumer durable-goods policy**; it is not a current smartphone price catalogue or an individualized affordability test.
- The document discusses a sample-specific average “acceptable repair price” from contributing literature. **Do not transfer that percentage to a PSI threshold**: category, year, market, personal conditions and study designs differ.
- No new price, coefficient, rule or assertion of repair preference is adopted into PSI.

**E2 — European Commission, 31 July 2026**, *Right to repair: New consumer rights for easy and attractive repairs*: https://commission.europa.eu/news-and-media/news/right-repair-new-consumer-rights-easy-and-attractive-repairs-2026-07-31_en .

- EU policy context says qualifying products including mobile phones have rights concerning manufacturer repair availability, reasonable price/time, and consumer information under applicable rules.
- Geography: EU; product/repair eligibility and national implementation/current consumer rights require case-specific confirmation. It is **not** a quote, guarantee that a particular smartphone is repairable in time, or legal advice.
- No European rule is presumed to apply globally, and no rights/discount/subsidy are auto-filled into a PSI financial field.

**Research confidence:** strong that price/availability/time can be real constraints in practice; **no scientific warrant for a universal affordable price, repair/new price ratio, money-vs-CO₂ exchange rate or financial winner**.

## 3. Exact coverage and gap matrix

Legend: **structured** = typed current state and evaluator; **open-text** = a relevant accepted AP question may receive literal user words; **absent** = no dedicated current structured economic field; **unverified** = cannot infer from inputs or sources.

| Question | Accepted current capture | Coverage classification | Scientific/product implication |
|---|---|---|---|
| Is the existing phone safe for required use? | `situation-ux.mjs` safety tri-state | **structured** | A financial note cannot turn unsafe keep into adequate |
| Does it do required tasks incl. work/accessibility? | required-functions tri-state; APQ1 raw text | **structured + open-text** | Real tasks and changed needs matter; APQ1 may mention an unaffordable purchase, but does not parse money |
| Is software/security support adequate? | security/support tri-state | **structured** | Security urgency must not be postponed to wait for an economic exercise |
| Current no-repair remaining service | `remainingServiceRaw` / not-sure | **structured** | User fact; never inferred from price |
| Repair type and expected post-repair service | `repairCategoryId`, `postRepairServiceRaw` / not-sure | **structured** | Environmental repair burden ≠ repair bill |
| Used/refurb adequate service | `usedServiceRaw`, `refurbishedServiceRaw` | **structured** | No lifetime from grade, market asking price or model |
| New candidate price | no corresponding comparison field | **absent** | Not sourced by the model-specific product LCA |
| Used/refurb candidate purchase price | no corresponding comparison field | **absent** | Used vs refurbished still distinct; user may face different local offers |
| Repair price / quote | no current typed input | **absent**; may be described in AP text | Quote, diagnosis fee, parts/labor/tax and uncertainty vary |
| Affordability / cash available now | no monetary/feasibility gate | **absent**; practical constraint may be mentioned in APQ5 | “Can afford” is not deducible from price or annual climate effect |
| Upfront payment vs lowest total price | no current construct | **absent** | Payment now, future purchases and monthly obligations are different; don't conflate |
| Repair turnaround / downtime | no structured input | **absent**; practical descriptions possible in APQ1/5 | Repair requiring days/weeks away can be infeasible even when cheaper |
| Replacement delivery/availability and service deadline | no dedicated input | **absent** | User may need an adequate phone immediately for work, access or safety |
| Future repair/replacement cost risk | service sequence tracks physical events, not cash flows | **unverified/absent** | No unsupported extrapolation, probability, interest/discount rate or expected future price |
| Region/date/currency/shop/warranty/taxes | exact model control covers only accepted LCA configuration; no price-source record | **absent** for economics | Exact source/year/geography scope essential to any optional quoted price |
| AP emotional/practical difficulty | exact APQ5 raw answer + optional neutral follow-up | **open-text** | Not a structured budget and cannot be mined for financial inference |
| Final choice | `final-choice-ux.mjs` explicit selection | **structured** | Final choice remains user's even if a pathway is cheaper or higher-carbon |

**Critical distinction:** current user-authored AP raw text **might** already communicate economic circumstances, but no evaluator translates it into availability or prices. That is the safe behavior today; a future financial feature must not silently infer a person's means or motives from AP responses.

## 4. Four questions that must not be collapsed

| Dimension | Question | Example, purely hypothetical | Why it differs |
|---|---|---|---|
| **Cash/feasible now** | Can this person actually pay at the needed time without unacceptable compromise? | Repair €150, replacement €150; funds available today unknown | Same sticker price ≠ known affordability |
| **Lowest quoted upfront cost** | What must be paid now for each currently feasible option? | Repair €150, adequate replacement €150 | A price tie neither proves equal outcomes nor favors repair |
| **Timely adequate service** | Can the device provide the required functions by the deadline, considering downtime/loaner/accessibility/support? | Repair may take two weeks; replacement available tomorrow, or vice versa | Timing and quality may outweigh a small price difference |
| **Future uncertain cost** | What later repairs, failure, service and payment burdens are plausible? | Repair might last 1–3 years; later costs unknown | Environmental service horizon cannot become a financial forecast |

The two €150 figures are **illustrations only**, not real offers or PSI defaults.

### 4.1 Equal-price repair versus replacement

If two routes have a **similar or identical upfront quote**, PSI has no empirical or philosophical authority to conclude repair is preferable. Repair can offer adequate service and retain existing hardware, but may involve uncertainty, downtime or a weaker warranty. An adequate alternative may solve support/accessibility issues, have immediate availability or different future risk. Equally, the replacement price alone does not prove replacement is preferable. A person may reasonably choose either.

A lower-carbon intervention can be unaffordable, infeasible, unsafe or too late for an essential task. Such constraints are legitimate, **not excuses, guilt indicators or evidence of hidden desire**. Conversely the cheapest offer need not provide equivalent adequate service. Keep the financial/practical context separate from source-bound environmental results, and keep all final options open.

## 5. Proposed **minimal** optional feature — for HQ/Owner adoption only

### 5.1 Purpose and placement

Candidate: **one optional “Practical costs and timing” disclosure in the empirical comparison area** (not APQ7, not in the situation adequacy gate, not on the final choice as a new recommendation).

Proposed public question, **NOT yet adopted**:

> **Are cost, availability, or timing important constraints for any of the options you are considering?**

Optional helper:

> **You may describe them in your own words, or skip this. A lower impact does not automatically make an option affordable or workable. No price, budget or outcome is assumed.**

A small textarea can preserve the user's *exact* response; it is not converted to a feasibility boolean, positive/negative sentiment, motive or conclusion. If user supplies a rough figure, keep it literal and marked as **user estimate**, not an approved current price.

Minimum client-only proposal object:

```text
PracticalConstraintAnnotation {
  status: "unanswered" | "answered" | "explicitly_unsure"
  raw_user_text: string | null
  evidence_class: "user_reported_context" | null
  applies_to: "selected_comparison_options"
  displayed: boolean
  generated_feasibility_inference: false
  affects_lca: false
  affects_ap: false
  affects_final_choice: false
}
```

This object is **not scientific evidence** of a price, income or imminent purchase. No derivation beyond literal display/clear is permitted. “Not sure” is different from an untouched blank answer; hidden/default financial facts are forbidden.

### 5.2 Presentation semantics

- Show the note only while empirical comparison is entered; optional even when no comparison can be quantified.
- Keep selected pathway statuses and environmental evidence as they are. Place the note **near** results, not inside numeric carbon totals.
- If the user says “Repair may take two weeks and I need a phone tomorrow,” show the exact user note with a neutral label **“Your practical context (not independently verified)”**; do **not** mark repair `infeasible` automatically.
- A field left blank shows **“No cost or timing information supplied”**, not “affordable” or zero.
- Edits/clear remove the previous annotation immediately. Reset/upstream invalidation follows existing comparison state rules.
- Do not echo these contents into AP motive classification, Impact, Otherness, system participation, product ranking or final purchase.
- A typed longer note should be skippable, fully editable, not retained beyond the accepted temporary state profile, and absent from logs/analytics. Runtime privacy behavior must be **technically checked before any public promise**; current profile alone is not verification of a new surface.
- A user who supplies no economic note may still inspect scientific comparison and make the final choice.

**Research trade-off:** This minimalist option recognizes economic practicality without asking about income, debt, savings or vulnerable personal financial details. It is still an extra question after an already long journey, so a non-input explanatory note may be preferable if the current human pilot finds significant burden. Adoption should consider the #182 pilot findings rather than reflexively adding a field.

### 5.3 Contingent later stage — optional quote records, not authorized now

If a separately reviewed need for structured **side-by-side price facts** emerges, a possible record is:

```text
OptionalPriceQuote {
  pathway: "repair" | "used_secondhand" | "refurbished" | "new"
  status: "unanswered" | "user_estimate" | "user_reported_quote" | "verified_source"
  amount_min: number | null
  amount_max: number | null
  currency: ISO_4217 | null
  as_of_date: ISO_date | null
  market_region: string | null
  basis: "total_payable_upfront" | "partial_price" | "unknown"
  included_costs: string[] | null
  excluded_costs: string[] | null
  source_kind: "user_statement" | "provider_quote" | "official_fee" | "unknown"
  source_ref: string | null
  quote_expiry: ISO_date | null
}
```

This is **only an interface sketch** for future scientific/product acceptance. `verified_source` must require separately reviewed provenance; a user saying “the shop quoted €150” remains `user_reported_quote` unless PSI independently validates the quote. No access to bank accounts, transactions or automatically searched prices. Keep different currencies separate; no exchange conversion by guess. Income/cash, financing and future cost remain distinct.

**No price calculator is proposed for V0.** Were one ever considered, full method acceptance would need:
- common adequate-service period, equivalent safety/functional capability, actual timely availability;
- repair/replacement costs in the **same currency/date/geography**;
- warranty/diagnostic/transport/tax/timing inclusions explicitly scoped;
- uncertainty for later events, repair reliability, fees and user-estimated costs;
- no unsupported discount rate, lifetime amortization, resale or carbon-to-money conversion;
- no forced winner even where a difference is computed.

### 5.4 Why financial comparison is not climate comparison

- Monetary outlay: currency at a location/date, paid to suppliers, taxes, labor and market conditions.
- Prospective embodied emissions: source-specific kg CO₂e over an accepted boundary and service period.
- There is no canonical exchange rate from € or ₹ to CO₂e, no accepted monetary damage factor and no universal cost/impact composite.
- A low-cost alternative can have higher emissions; a lower-emission alternative can be unaffordable. PSI may present both **separately** if independently supported; it must not rank their moral worth or override user choice.

## 6. Price provenance, rights and privacy

### 6.1 Source conditions for any **future** price record

A price visible to the user should identify:
- exact phone configuration and intervention/service (part, labor, diagnosis, warranty condition);
- geography and currency, reference/offer date and whether tax/shipping/handling are included;
- quoted vs estimated vs historical reference vs independent verified provider offer;
- repairer/model suitability, turnaround and expiry;
- conditional availability and actual user's need-by date where supplied;
- missing components stated as unknown, not included at zero.

Different repairers, local labor/taxes, availability and warranty coverage make a generic phone-model carbon record unusable as a price source. An LCA value cannot be interpreted as a bill.

E1/E2 give **policy/decision-context** support, not prices. The existence of EU repair rules does not establish repair feasibility, amount or rights for an arbitrary phone, country or claim; applicable protection may alter the user's out-of-pocket price but needs confirmation, not automatic subtraction.

### 6.2 Privacy

Money constraints can be sensitive. The minimal proposal should avoid asking for:
- account/bank balances, credentials, payslips, private invoices or identifiable seller communications;
- income and debt levels;
- third-party payment details;
- exact employer/work tasks where unnecessary.

If ever implemented, raw notes should remain in the same temporary in-memory smartphone inquiry state, without persistence, network submission, analytics, account, history or telemetry. That is a **design requirement**, not a verified existing behavior for an unbuilt feature. Follow `PUBLIC_BETA_PROFILE.md` and verify runtime graph/browser checks; do **not** promise absolute deletion, “only on device” processing or universal confidentiality without specific evidence.

## 7. Authority classification and proposed routing

| Item | Status | Owner / workstream action |
|---|---|---|
| Safety/required functions/support, service periods, unknown handling, pathway separation, final user choice | **already accepted** | Preserve; no rewrite or economic inference |
| Practical cost/time can influence consumer repair choice | **supported generic background** (E1/E2); no individual price | Can motivate a bounded candidate, not a financial scoring rule |
| Reviewer C equal-price repair/replacement example | **concept-only feedback** | Do not turn it into price evidence or a decision preference |
| Optional plain-language practical context near comparison | **unadopted product semantics** | HQ evaluates #182 pilot burden and requests specific Owner/product acceptance if needed |
| Typed user quote/price values | **unadopted second-stage proposal** | New focused product/method/data/privacy acceptance required; do not dispatch now |
| Budget/affordability threshold, price-per-year outcome, discounted future cost, cost–CO₂ composite, universal recommended option | **not supported/authorized** | Exclude |
| EU repair rights | **jurisdiction/product/eligibility-specific context** | No legal advice, global default or automatic discount |
| Current initial-price tie | **no automatic preferred outcome** | User decides after actual capability, availability, cost and values |
| Car purchase economics, PDF, decision-change counts | **outside scope/backlog** | No action |

**Recommended next step:** HQ independently reviews this handoff. If the human-comprehension pilot supports a minimal addition, seek explicit acceptance of either a static economic-constraints acknowledgment **or** the single optional note; do not write a large financial calculator first. A small future Tier-2 implementation requires separately accepted wording, field semantics, temporary-state verification, and regression cases. Nothing here creates an automatic Cursor task or Owner-level purchase decision.

No further Research sampling, pricing database, vendor investigation or economy literature expansion is justified by this particular gap.

## 8. Focused acceptance cases for a later **separately authorized** product slice

| ID | Scenario | Expected |
|---|---|---|
| ECON-01 | No note supplied | Comparison remains available, no cost defaults, no inference of affordability |
| ECON-02 | User selects explicit uncertainty | Status explicitly unsure, not zero or affordable |
| ECON-03 | User writes “Repair and replacement seem to cost the same” | Preserve literal claim; no repair/new winner |
| ECON-04 | User writes repair downtime conflicts with an essential work need | Show literal constraint; no automatic diagnosis/infeasibility or guilt |
| ECON-05 | New phone appears lower upfront price but lacks essential function/security | Price cannot override adequacy gate |
| ECON-06 | Repair lower upfront cost but service duration unknown | No monetary or climate winner; preserve unknown service |
| ECON-07 | User quote in EUR, separate source in another currency/date | Never combine or convert absent separately accepted FX/source/currency rule |
| ECON-08 | Quote has excluded taxes/parts and expiry | Label partial, not confirmed total; no inference of absent costs as zero |
| ECON-09 | Practical note edited/cleared/reset | Previous raw note removed immediately; no stale display or inference |
| ECON-10 | Comparison option changed | Note remains contextual/clearly user-authored or resets under adopted choice; must not silently bind a specific quote to another candidate |
| ECON-11 | Existing APQ1/APQ5 answers mention money | Do not extract financial facts or modify raw answers without explicit authority |
| ECON-12 | User picks buy-new, keep, repair, used, refurbished, investigate, or unclear | All remain ordinary valid final choices; no morality/economic score |
| ECON-13 | Personal constraint entered | No persistence, analytics, network submission, account or hidden log in a verified future build; no unsupported deletion/device-only promise |
| ECON-14 | LCA numbers available, price numbers absent | Show environmental evidence without fabricating currency totals or ranking |
| ECON-15 | Financial and climate figures both provided in future | Keep units/panels independent; no carbon-per-euro “best” without separate accepted method |
| ECON-16 | No exact region/date for a purported retail price | Price remains user estimate/uncertain, not verified current quotation |

## 9. Validation and unresolved boundaries

### Repository checks
- #185 / PR #188 independently accepted and merged by HQ; explicit #186 release and approvals verified.
- Checked there was no matching #186 Research branch/PR/handoff before starting, then claimed `IN_PROGRESS` on deterministic authorized branch.
- Pinned actual `main` at `a3cfa4d42d94d9eb2a3a5202a1668ae45312dc60` (distinct from release commit).
- Read accepted contracts, the three situation facts, comparison state/input/evaluation/presentation, secondary pathways, final-choice UX, APQ1/APQ5 read-only, privacy profile, D-014 and #181 provenance.
- Searched relevant production code for structured monetary/timing terms and found none, with scope stated.
- Independent primary institutional documents E1/E2 examined for cost, repair quality/availability/timing context. Did not turn survey percentages into user thresholds or assume current market prices.
- No other workstream's files or live implementation edited; no app code/tests/contracts/registries/AP corpus/source packages/profile/Site changes.
- Markdown-only audit; no app build, render, hosted CI or broad regression required.

### Decisions still outside Research authority
- Whether a new question is worth additional cognitive load relative to human-review findings;
- exact wording and placement of any accepted economic acknowledgment;
- privacy verification of the hypothetical new user-text surface;
- whether structured prices ever warrant new model semantics.

**No unresolved scientific blocker** prevents HQ review of the submitted analysis. Adoption of any new product/economic interaction remains separate and is **not requested by the feedback alone**.

**Research return:** `VERIFIED_FOR_HQ_REVIEW`.  
**Self-merge:** **NO**.
