# HQ-RE-2026-10-16-002 — Smartphone ownership adaptation and replacement evidence audit

**Issue:** #173  
**Task:** `HQ-RE-2026-10-16-002`  
**Cycle:** `INITIAL-1`  
**Execution class:** Tier 3 — bounded empirical psychology / product evidence audit  
**Research branch:** `research/hq-re-2026-10-16-002-ownership-and-replacement`  
**Issue's historical starting main:** `2c0311b89038d523ef94725407eb81a3bc2d67b5`  
**Actual execution starting main:** `362e9711cd511fdfb0eafc5935da7e6dcc9952e0`  
**Source access date:** 2026-10-16  
**Output type:** Research proposal / audit; **not** accepted empirical or AP/product semantics  
**Self-merge:** **NO**

## 1. Executive disposition

**No additional V0 question or behavioral intervention is empirically warranted now.**

The independent literature supports a limited educational distinction between:

1. **Material/device change** — battery degradation, storage and software compatibility, failures, physical wear, repairs and security/support limits.
2. **Changed use or context** — new work or accessibility needs, changing apps and expectations, constraints of the social/technical environment.
3. **Changed evaluation** — perceived datedness, emotional satiation, changed valuation, novelty, advertising, status, peer comparison, and the attractiveness of newer products.

The three can coexist. A functioning phone can be inadequate, a visibly worn phone can remain adequate, and someone may have both serious operational friction and interest in a newly released phone.

The directly relevant evidence consists mostly of **retrospective/cross-sectional self-reports**, some qualitative interviews and scenario modelling. An experiment on generic social-media consumption sharing supports that exposure **can** influence measured emotions/purchase intentions in its experimental context, not that tech-review viewing caused a specific upgrade or that stopping such viewing can diagnose a user's “real need.” No inspected primary study validates the six-stage video taxonomy, 90% assertion, price-bracket lifetime thresholds, universal fixed problem-count rule, or 30-day rule.

PSI already asks about:
- practical adequacy / safety / required functions / support;
- anticipated change beyond technical functions;
- exposure chronology without causal diagnosis;
- visibility / identity context;
- nonpurchase difficulty;
- rereading the user's exact answers and open final choice.

Thus the smallest scientifically defensible disposition is **retain current APQ1–APQ6 and empirical inputs; optionally supply carefully scoped, non-diagnostic educational context only if later independently adopted by HQ**. Do not publish a new interaction merely to reflect creator commentary.

## 2. Provenance and what was actually reviewed

### Repository authority (read-only)

At the actual starting main:

- `OWNER_CONTROL.md`;
- `project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md`;
- `project-state/DECISIONS.md` D-010, D-011 and D-005;
- `contracts/USER_INPUT_MODEL_V0.md`;
- `contracts/EMPIRICAL_SMARTPHONE_V0.md`;
- `contracts/SECONDARY_PATHWAYS_V0.md`;
- `contracts/AP_INTERACTION_V0.md`;
- `tests/ap-integrity/AP_V0_INVARIANTS.md`;
- `app/src/lib/smartphone/ap-inquiry.mjs`;
- `app/src/lib/smartphone/lifecycle-presentation.mjs`;
- `handoffs/research/HQ-RE-2026-10-15-002-evidence-presentation-map.md`;
- accepted corrected `handoffs/research/HQ-RE-2026-10-16-001-old-phone-fate-and-context.md`.

D-010 and #170 own old-phone-fate input and context. #175 / PR #176 independently implement that bounded input. This audit does not change that work.

### Creator commentary (discovery only)

Owner-provided Tech Junkies video reference: https://youtu.be/C7OD898gp_U . HQ's #173 provenance addendum records the Owner-supplied Hindi transcript `Eingefügter Text(2).txt` (35,338 bytes, SHA-256 `e89037763eae0b3f036590841a69a8198e71aab3390cb845623e1d6bdcecd75c`), with locators but without verified audio/transcription fidelity.

The user-provided transcript is a **source of questions**, not independent empirical evidence. The creator explicitly calls the 30-day rule his own and the price/lifetime bands personal non-scientific estimates. The claim that repeated forum/ChatGPT/review consultation reveals the absence of practical need is an **unsupported inference** about private motivation. The “90%” figure, six-stage trajectory and fixed-number-of-problems threshold remain unaccepted. The creator does **not** establish a validated baseline-problem logging experiment. None of these claims becomes PSI authority by inclusion in this document.

## 3. Scope and measurement distinctions

An exact observed purchase or phone exchange, a user's retrospective report that an exchange occurred, a survey rating of an influence on a past purchase, an **intention** to repurchase, and satisfaction with the current phone are **different measured outcomes**.

- **Functionality** is not binary: a device can still perform its main function but have consequential partial defects.
- **Perceived obsolescence** is not synonymous with irrationality or manufacturer intent. It can reflect real incompatibility, social requirements, degraded performance, or valuation of new capabilities.
- **Psychological obsolescence** is a research classification of some perceptions/replacement reasons; it is **not** an individual diagnosis or a moral category.
- **Satiation/adaptation** is a group-level explanatory construct; declining reported satisfaction does not establish that an individual's original need was false.
- **Exposure chronology** (“I watched reviews before wanting a new phone”) is not randomized exposure and does not establish causation.
- **Self-selection and reverse causation** matter: people already contemplating an upgrade may actively seek reviews, friends' opinions, forums or ChatGPT advice. Advice-seeking can also reflect due diligence for a legitimate practical limitation.
- **Functioning-device replacement** is not inherently avoidable: a phone can power on but lack security updates, accessibility capability or an essential service.

## 4. Focused primary research matrix

This is a bounded **eight-source audit**, not a systematic meta-analysis. Sources are separated by actual inspection level. No effect size, sample count, comparison or intervention outcome is invented where full primary text was unavailable. Direct DOI/URLs are provided for independent review.

### P1 — Wieser & Tröger (2018), Austria: perceived obsolescence and replacement

**Full source:** Harald Wieser & Nina Tröger, *Exploring the inner loops of the circular economy: Replacement, repair, and reuse of mobile phones in Austria*. *Journal of Cleaner Production* 172 (2018), 3042–3055. https://doi.org/10.1016/j.jclepro.2017.11.106 . Publisher article: https://www.sciencedirect.com/science/article/pii/S0959652617327798 .

**Inspection and location:** publisher's primary abstract/highlights and University of Manchester author/publication record, retrieved 2026-10-16; full article not accessible through this retrieval, so no fabricated table/page-specific coefficient.

**Population/design:** Austrian survey **n=988** plus **25 household interviews**; retrospective questionnaire plus qualitative interviews, not randomized intervention or prospective observed purchasing. Survey field dates/sample representation and detailed coefficients not confirmed here.

**Finding:** replacements related to perceived obsolescence involving basic functionality, up-to-dateness and the ability to participate in social practices. The study explicitly challenges a “novelty alone” account. Consideration of repair/reuse interacts with how rapidly a phone is perceived to become obsolete.

**Warrant/limits:** establishes useful *categories of reported reasons*, not a causal partition, universal trajectory or judgment about a person's motive. Austria and the period constrain transfer; even a reported practical or social reason must be understood in context. No direct study of stopping review content.

**Disposition:** **supported background** for coexistence of practical/social/evaluation changes. No new PSI input required.

### P2 — Magnier & Mugge (2022), Western Europe: actual replacements reported retrospectively

**Full source:** Lise Magnier & Ruth Mugge, *Replaced too soon? An exploration of Western European consumers’ replacement of electronic products*. *Resources, Conservation and Recycling* 185 (2022), 106448. https://doi.org/10.1016/j.resconrec.2022.106448 . Final published institutional PDF: https://pure.tudelft.nl/ws/portalfiles/portal/125928925/1_s2.0_S0921344922002919_main.pdf .

**Inspection and location:** full final-paper primary text, methods §3 pp. 4–5, **Table 5 p. 6**, repair §4.3 pp. 7–8, replacement §4.5 p. 10; institutional PDF opened and relevant page inspected.

**Population/design:** 617 Western European respondents who **recently replaced** one of four electronic product classes; May 2021 multilingual online questionnaire. **182** reported smartphone replacements. Retrospective self-report; not logged field behavior, random sample of all owners, or a longitudinal cohort.

**Direct smartphone findings:** Table 5:
- **47/182 (25.8%)** said the replaced smartphone was working well;
- **103/182 (56.6%)** reported a partly malfunctioning smartphone that still performed its main function;
- **32/182 (17.6%)** reported a broken smartphone unable to perform its main function.
Among respondents replacing a defective smartphone, **30.1%** with a partly malfunctioning phone considered repair versus **62.5%** with a broken phone (§4.3; tested subgroup).
Smartphone reason ratings placed loss of original performance first (mean **5.09**), “time for a new phone” next (**4.60**), and greater energy efficiency next (**4.27**) (§4.5). These are ratings of recalled influence, **not causal effect estimates** and not proof that the claimed energy-efficiency difference was true.

**Warrant/limits:** “Working well” and “partly malfunctioning” were respondents' own classifications. A phone that still made calls could nevertheless impose meaningful burdens or fail a necessary task. Country/product samples and recall restrict generality; 60% of *defective products across categories* did not consider repair—do not mislabel this as a smartphone-only percentage.

**Disposition:** **strongest directly inspected smartphone decision-state evidence** for not equating powers-on with adequate, and for not reducing reported replacement to novelty. Does not warrant an individual threshold.

### P3 — Oraee, Pohl, Geurts & Reichel (2024), UK/EU young adults

**Full source:** *Overcoming Premature Smartphone Obsolescence amongst Young Adults*. *Cleaner and Responsible Consumption* 12 (2024), 100174. https://doi.org/10.1016/j.clrc.2024.100174 . Published author-institution PDF: https://eprints.lse.ac.uk/122180/1/Oraee_overcoming_premature_smartphone_published.pdf .

**Inspection and location:** publisher's indexed published article text, full institutional PDF text, methods §3.2–3.3 pp. 4–5, results §4.1–4.2 pp. 5–10. The article's **proposed solutions are not experimentally evaluated**.

**Population/design:** **122 valid survey responses** recruited via social media from smartphone owners aged 18–29 in metropolitan UK/EU contexts; **five 30-minute expert interviews** with European resale/refurbishment company staff. Exploratory mixed methods, convenience selection, stakeholder opinions, cross-sectional self-report; no probability sample or randomized product-use intervention.

**Finding:** respondents frequently reported software/hardware difficulties; article reports approximately **70%** mentioning software issues and **51%** physical defect reasons (items may overlap, not an exclusive partition); nearly **25%** reported embarrassment using an older phone around friends. Expert observations corroborate that repair barriers and social pressures can matter, but professionals are not an independent representative sample of owners.

**Warrant/limits:** these proportions are **sample-specific**, not population rates, and do not support claims that “70% of all upgrades are necessary” or “25% upgrade for status.” The proposed “Slow Smartphone Movement,” pledges, badges, modularity encouragement and education are **untested proposals**, not proven interventions. The paper's incidental landfill percentage is **not** imported: it lacks the source-specific route precision required by accepted #170.

**Disposition:** **limited/supported background** for multiple coexisting drivers and potentially observable functional friction. **No intervention adoption.**

### P4 — Corrocher & Paganuzzi (2025), Italy: obsolescence typology and reported lifetime

**Full source:** Nicoletta Corrocher & Sara Paganuzzi, *Planned obsolescence and smartphone replacement: Empirical evidence on the Italian market*. *Telecommunications Policy* 49(8) (2025), 103022. https://doi.org/10.1016/j.telpol.2025.103022 . Institutional final-publication record: https://iris.unibocconi.it/handle/11565/4076866 .

**Inspection and location:** publisher primary article's indexed methods §3, empirical strategy §4, limitations §6.2 and Tables 1–2 excerpts; publisher full-document fetch was access-restricted, so no coefficient magnitude or uninspected figure is asserted.

**Population/design:** **381** responses from Italian smartphone users recruited through social media/personal networks, raffle incentive; survey includes retrospective histories of prior smartphones, **44% aged 16–30**, 64% women. Regression of self-reported device lifespan on coded obsolescence/reason variables, attitudes and controls. Authors explicitly state cross-sectional data do **not** establish causation. The prior-device comparison is recall, not longitudinal remeasurement of the same users over time.

**Finding:** functional/material/psychological/economic reasons have different associations with smartphone lifespan; repair attitudes and technological engagement can be relevant, and some economic incentives/cohort differences appear.

**Major measurement qualification:** their “psychological obsolescence” operationalization **combines** desire/need for latest model, upgrade contracts, beliefs about residual lifetime/too many repairs and a desired-lifetime threshold. That composite does **not** constitute a validated measure of hidden motives, authentic desire or manipulation. Their “planned obsolescence” label likewise cannot prove a manufacturer deliberately caused a given person's problem.

**Warrant/limits:** observational cross-sectional retrospective design, selection/recall/social-desirability bias and geographic skew. Associations must not be turned into a rule that a given user “just wants novelty” or “must replace.”

**Disposition:** **supported background / contested inference**. Useful typology and measured-context warning; no diagnosis or new scoring category.

### P5 — Ying, Jing, Nguyen & Chen (2016), China: ownership satisfaction / hedonic adaptation

**Full source:** *As time goes by … maintaining longitudinal satisfaction: a perspective of hedonic adaptation*. *Journal of Services Marketing* 30(1) (2016), 63–74. https://doi.org/10.1108/JSM-05-2014-0160 . Publisher abstract: https://www.emerald.com/insight/content/doi/10.1108/JSM-05-2014-0160/full/html .

**Inspection and location:** primary publisher abstract/metadata; full article inaccessible, so precise N, recruitment dates, coefficients, page-specific instruments and time-order cannot be independently confirmed.

**Population/design:** smartphone owners sampled from four MBA classes and eight business venues in China, two studies, structural equation modelling of satisfaction/attribute variability/use. Although the title says “longitudinal satisfaction,” inspected methodological description does **not** establish a repeated-measures panel following the same new phone through all ownership stages. Do **not** call this a longitudinal causal trajectory.

**Finding:** author reports associations consistent with hedonic adaptation in phone-owner satisfaction and variation by product attributes and consumption behavior.

**Warrant/limits:** conceptual/associational support only. Neither time-to-adaptation nor a universal honeymoon → frustration sequence, motivation shift or validity of 30 days has been shown through the accessible material. Newer phones, locales and owners can differ.

**Disposition:** **limited background, insufficient for an ownership-stage UI**.

### P6 — Liu et al. (2024), China: randomized content exposure and stated purchase intention

**Full source:** Dege Liu et al., *How social media sharing drives consumption intention: the role of social media envy and social comparison orientation*. *BMC Psychology* (2024). https://doi.org/10.1186/s40359-024-01627-7 . Full publisher article: https://link.springer.com/article/10.1186/s40359-024-01627-7 .

**Inspection and location:** primary full published article, Methods / Design and stimuli, Participants and procedure, Results / Tables 1–2, Discussion (2026-10-16). PubMed ID 38491525.

**Population/design:** **544** university students in Guangxi/Guangdong, China (mean age 21.45); randomized between four simulated Weibo purchase-sharing stimuli; social-comparison orientation was a **measured trait**, not randomized. Stimuli were **travel and shoes**, not phones, phone reviews or real purchase choices.

**Finding:** manipulated type/luxury of displayed content affected immediate self-reported benign envy; some contrasts/interactions related to purchase intention. Not all hypothesized moderated mediation effects were supported.

**Warrant/limits:** causal warrant limited to the randomized simulated-content contrasts and measured short-run reactions in this setting. No evidence for actual phone upgrading, a 30-day abstention exercise, an individual motivation diagnosis, reduced social-media use as treatment, or the idea that asking friends/ChatGPT for advice proves no need.

**Disposition:** **indirect experimental support** that content features can influence short-run responses. Product transfer is **not supported** without new direct study.

### P7 — Cordella, Alfieri & Sanfelix (2021), Europe: smartphone lifetime LCA scenarios

**Full source:** *Reducing the carbon footprint of ICT products through material efficiency strategies: A life cycle analysis of smartphones*. *Journal of Industrial Ecology* 25 (2021), 448–464. https://doi.org/10.1111/jiec.13119 . Full publisher article: https://link.springer.com/article/10.1111/jiec.13119 . Canonical PSI source **S1**.

**Inspection and location:** primary open-access full article, abstract, Methods “Functional unit and reference flow”, Table 1 scenarios, §§Results/Discussion, 2026-10-16.

**Population/design:** **engineering scenario model**, not a behavioral sample. EU-oriented generic virtual smartphone assessed over **4.5-year common reference period**, e.g. baseline replacement every two years and extended 3-/4-year replacement scenarios; assumes device mix, production/repair needs and scenario-specific end-of-life boundaries.

**Finding:** in that model, extending replacement from **two to three years** lowered modelled carbon footprint by **23–30%** depending on repair assumptions. The **52–79%** used-device result presupposes **1:1 new-device displacement** and an explicitly scoped system boundary. Neither is an empirical universal German displacement coefficient.

**Warrant/limits:** modelling demonstrates a *conditional comparison*, not that a particular person prevented manufacture or realized an exact avoided footprint. Communication network/service impacts were treated separately; material/recycling credits are specific to this paper's choices. Longer use may reduce production demand in a model **if adequate service and system changes actually support that scenario**.

**PSI boundary:** retain accepted generic new production **25–70 kg CO₂e/device** and distribution **2–4 kg** (not this paper's stage figures added anew), charging **4 kWh/year** central / **2–8 sensitivity** (no CO₂ without approved grid), battery/display conditional repair ranges, explicit adequate-service horizon, unknown generic EOL, sunk existing manufacturing, no automatic displacement credit.

**Disposition:** **already accepted model evidence**; no new lifetime default, optimal replacement age or consequential credit.

### P8 — Cordella, Alfieri, Clemm & Berwald (2021), smartphone technical durability

**Full source:** *Durability of smartphones: A technical analysis of reliability and repairability aspects*. *Journal of Cleaner Production* 286 (2021), 125388. https://doi.org/10.1016/j.jclepro.2020.125388 .

**Inspection and location:** publisher primary article abstract/highlights (full publisher text access-restricted). No device-specific failure-rate distributions or numerical durability thresholds were verified.

**Population/design:** technical engineering/design analysis, not a randomized owner study; smartphones and their design/failure/repairability conditions.

**Finding:** technical failures including battery and display problems can motivate early replacement; reliability, repairability and design choices are relevant and can trade off.

**Warrant/limits:** a reason to take physical friction seriously, not authority to estimate a specific handset's remaining life or diagnose a software/hardware failure from a subjective report. Product and model heterogeneity remain.

**Disposition:** **supported technical background**; existing adequacy/repair inputs suffice for V0.

## 5. Owner questions → accepted coverage / genuine gaps

| Owner topic or claim | Accepted PSI coverage | Research finding | Disposition |
|---|---|---|---|
| “It works; why replace?” | safety, essential functions and support adequacy; APQ1 | powers-on is not adequacy; partially malfunctioning can matter | **already covered** |
| New-device pleasure fading | APQ2 nonfunctional anticipated changes; APQ6 re-see | hedonic adaptation is plausible but no uniform six-stage/30-day trajectory proven | **limited background** |
| A device feels outdated although unchanged | APQ2, APQ3 and APQ4; raw answers | perceived obsolescence can involve functionality, social practices or reevaluation | **supported background** |
| Changed work, accessibility, app or social demands | situation required functions, safety and support | legitimate changed demands can coexist with interest in novelty | **already covered / contextual** |
| Comparisons after reviews, ads or new launches | APQ3 exposure chronology; INV-AP-05 | group and experimental findings exist; no case-specific causal inference | **already covered / indirect evidence** |
| Wanting something others can see | APQ4 visibility, INV-AP-06 | social norms are reported factors; not a motive diagnosis | **already covered** |
| Repeated justifications, Reddit/GPT/friends | APQ5 difficulty and open inquiry | information-seeking is ambiguous; may be due diligence | **no diagnostic support** |
| Price bracket gives minimum lifetime | explicit adequate-service inputs, not price/age | creator openly non-scientific; no validated threshold | **not supported** |
| “90% abandon upgrades” | none | insufficient inspected independent evidence | **not supported** |
| Count 2–3 problems → upgrade | adequate required-function/safety/support facts | number of annoyances ignores severity/context | **not supported** |
| Exposure-free 30 days proves true need | optional nonrequired behavior experiment invariant | no directly validating trial found in focused audit | **unadopted hypothesis** |
| Longer phone life avoids new production | fixed forward-looking scenario and direct accounting | longer service can change modelled footprint; realized displacement is separate | **already covered; do not credit automatically** |
| What happens to the old phone | accepted #170 hypothetical optional fate schema and separate context | anticipated fate is not verified actual disposal/route | **belongs to #170/#175, not this audit** |

## 6. Functional-friction observations — assess, do not implement

Candidate examples are **user observations**, not telemetry, independent diagnoses, or proof of inadequate devices.

| Possible observation | Relation to current authority | Conditions/ambiguity | Recommendation |
|---|---|---|---|
| Battery lasts too little / carries power bank / charging interrupts tasks | existing adequacy required functions; battery repair scenario | heavy use, temperature, signal, background apps, battery aging, charger/access, changed routine; inconvenience severity differs | **no new required field**; optional free explanation within existing adequacy |
| Storage clearing repeatedly | required-function adequacy; no storage-age inference | user preferences, cache/apps/media, cloud constraints, extra costs, changed needs | optional narrative; not universal GB/weekly threshold |
| Freezes, crashes, slow launch | required tasks, supported app/software | app version, OS support, updates, connectivity, thermal limits, expectations | ask user what task cannot be completed if needed; no automated failure diagnosis |
| Essential app unavailable / security updates ended | support adequacy / required function | model/region/app security requirement must be verified separately; “OS old” alone not failure | already covered; **do not delay safety/security action** |
| Camera or accessibility feature inadequate | actual task and changed personal context | needs can become stricter; new features may be genuinely enabling | already covered via user's functional requirements |
| Repairs, workarounds, time/effort, costs | adequacy + separately applicable repair/service sequence | user-specific opportunity cost, skills, available support and repair reliability | not a score or moral test |
| Cosmetic irritation/novelty | APQ2/APQ4 user reflection | not necessarily false, unethical, or evidence of coercion | already covered; user chooses |

**Finding:** a single severe limitation may matter more than several minor ones. A count of problems or arbitrary time interval is not a validated adequacy instrument. PSI should not add a compulsory checklist, hidden rule, monitoring/telemetry, repair diagnosis, score or purchase ranking.

## 7. Voluntary self-observation concept — evidence and boundaries

### 7.1 Investigated candidate

The **Owner's exploratory candidate**, not a validated Tech Junkies intervention:

> Record current device problems → voluntarily reduce comparison-content exposure → return to the same practical observations later.

This is **self-observation**, not a controlled experiment, causal inference method, motive authentication test or scientific instrument.

### 7.2 Scientific status

**Not directly validated** by the inspected eight sources.

- The cross-sectional studies measure reported reasons, not exposure withdrawal.
- The Chinese consumption-sharing experiment randomizes short-run stimulus content but not a month of tech-review abstention or smartphone replacement behavior.
- Hedonic adaptation literature does not establish that 30 days is a relevant, optimal or diagnostic interval for smartphone desire.
- A before/after change cannot uniquely identify content exposure as cause: technical conditions, tasks, finances, security, season, attention, memory, social context and other inputs can also change.
- Stable desire after an observation period does not prove necessity. Fading desire does not prove illegitimacy. An unchanged device can still become inadequate when needs change.

### 7.3 Safe **concept only**, if ever separately authorized

Any future optional educational prompt would need:
- explicit opt-in and immediate skip/stop;
- no required wait, abstention, timer, recurring reminder or persistent history;
- no rule that a replacement/repair/security response must be postponed;
- no precommitment to keeping or replacing;
- answers may become stronger, weaker, unchanged, mixed, uncertain or conflicting;
- no assignment of “genuine/artificial desire,” ego/greed or moral worth;
- no generated summary replacing exact raw answers;
- no causal inference or behavioral scoring;
- no social-media account access and no data-collection architecture.

Given existing APQ3 and APQ6, **Research recommends no additional experiment or AP task now**. If real future usability evidence reveals a specific comprehension gap, HQ could seek a bounded product/AP semantic proposal then.

## 8. Environmental and lifetime reconciliation

### Distinguish four frequently conflated propositions

| Statement | What it can mean | What it does **not** automatically mean |
|---|---|---|
| Longer useful lifetime lowers *annualized* footprint under an LCA | a model spreads fixed manufacturing over more years or uses fewer devices for comparable service | every unsafe/inadequate old phone should be kept |
| A planned future replacement is delayed | a user reports not purchasing today or modelled service lasts longer | manufacturer production was actually reduced by one unit |
| An acquired used phone displaces a new sale | separately evidenced market-level counterfactual, market scope and uncertainty | each used transaction prevents one new phone by default |
| One person's choice avoids a precise environmental harm | requires causal/system evidence generally unavailable in V0 | a named person/species/mine/landfill or exact avoided victim |

The primary Cordella model's extended-use percentage is **scenario sensitivity** not an optimization rule for one user. An individual modelled “keep” path may be infeasible due to security, safety, accessibility, support or core functional needs. The accepted service horizon must remain user-established; no silent three-year default. Keep, repair, used, refurbished and new remain legitimate conditional possibilities, with the final choice owned by the user.

Do not:
- import the study's EOL recycling credits into PSI's generic EOL;
- add extraction/manufacturing phases to an already inclusive production value;
- borrow a universal market-displacement factor;
- treat source model use years as the current user's expected remaining service;
- rank options by qualitative ecological/human consequence pathways;
- assume a proposed old-phone resale/charity route is an observed reuse event.

**Connection without expanded authority:** the accepted Use/Repair journey can explain common technical friction; the existing comparison can present bounded forward-looking burdens; #170/#175 can optionally ask what the person *expects* would happen to the old phone. The connection remains a narrative of possibilities, not inferred personal fate or new AP gate evidence.

## 9. Disposition and routing recommendation

| Candidate | Classification | Recommendation |
|---|---|---|
| Distinguish material change / changed needs / changed evaluation | **supported background, partly already covered** | keep as Research understanding; optional later education subject to HQ acceptance |
| Acknowledge perceived/psychological obsolescence in general | **supported/limited background** | only neutral non-diagnostic words if public copy is separately accepted |
| Product-specific technical limitations and workarounds | **already covered** | no new form |
| Review, advertising, peer influence | **limited or contested transfer** | existing APQ3/APQ4, no causal sentence about person |
| Hedonic “honeymoon” and staged lifecycle of ownership | **indirect / unvalidated taxonomy** | no sequence/visual stage model |
| Creator's 30-day test | **not supported as threshold/diagnostic** | no rule, timer, task or delay |
| Optional exposure-change/recheck | **unadopted product hypothesis** | no implementation or new AP question now |
| Price/lifetime bands, 90% upgrade-abandonment, fixed friction count | **not supported** | exclude |
| Phone lifespan / repair / environmental service accounting | **already accepted** | preserve current boundaries |
| Old-phone fate/context | **separately accepted #170** | do not duplicate |

**Recommendation:** close this specific Research audit after independent HQ review. **No new Issue, AP workstream task, Owner decision, visual/animation implementation or Cursor task is justified solely by the evidence reviewed.** If HQ later wants a new public educational paragraph about replacement reasons, it should be proposed separately with exact neutral wording and source/scope map; it must not overwrite APQ1–APQ6 or import a motivation diagnosis.

## 10. Validation and open limitations

### Evidence validation

- Eight directly relevant first-party/publisher/institutional research records located and compared.
- Full primary text inspected for P2, P3, P6 and P7; P1 abstract/institutional abstract; P4 publisher-indexed methods/results/limitations; P5 publisher abstract only; P8 publisher abstract/highlights only.
- Exact direct DOI/URLs provided, publication years, methods, populations, sample and measured outcome types tracked.
- Missing full-text details and noncausal designs are flagged rather than invented.
- Study-specific statistics never presented as universal population rates.
- Positive evidence that context/exposure can matter kept separate from evidence that reducing exposure identifies a “real” need (not found).
- The creator transcript is discovery provenance only; no creator claim promoted to empirical authority.
- Existing PSI numeric environmental brackets and frozen claims/contracts reused; no new source package/registry values.

### Repository validation

- Issue #170 / PR #174 is accepted and terminal, satisfying #173 priority dependency.
- #173 explicitly released `READY_FOR_RESEARCH` by HQ, no Owner/model-selection approval pending.
- Matching branch/PR/handoff absent at identity check; task claimed `IN_PROGRESS` and deterministic branch created from actual `362e9711cd511fdfb0eafc5935da7e6dcc9952e0`.
- Separate Cursor #175 / PR #176 does not overlap this documentation-only audit.
- Only the authorized Markdown handoff is added; no app, tests, source package, contracts, registry, AP corpus, constitution, profile or owner-control edits.
- Docs-only: no app build, regression, render or broad CI is authorized/required.

### Open limitations (not blockers)

- Full primary methods/results were not accessible for P1/P5/P8; P4 publisher indexed sections were available but not an independently downloaded full article. Do not treat them as stronger causal/longitudinal evidence than inspected.
- No directly validated 30-day smartphone comparison-content abstention study identified in the bounded search. This is **lack of supporting evidence in the inspected material**, not a proof that no study exists anywhere.
- Self-report and recall bias, nonrepresentative youth/student samples, product transfer, selection, reverse causality and varying definitions of “working” remain material.
- No actual human PSI comprehension study was conducted; none is claimed.
- A psychological explanation is not licensed by an ecological LCA model.

**Research return:** `VERIFIED_FOR_HQ_REVIEW`.  
**Self-merge:** **NO**.
