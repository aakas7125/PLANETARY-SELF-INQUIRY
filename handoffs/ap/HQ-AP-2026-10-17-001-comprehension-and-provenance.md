# HQ-AP-2026-10-17-001 — System-inquiry comprehension and provenance clarity

**Issue:** #183  
**Task ID:** `HQ-AP-2026-10-17-001`  
**Cycle:** `INITIAL-1`  
**Workstream:** AP Framework & Corpus  
**Execution class:** Tier 3 — AP/product semantic clarity proposal  
**Authorizing direction:** D-014 (Owner, 2026-10-17); Reviewer B feedback #180 B-04–B-07 is non-authoritative experience evidence  
**Issue-named accepted main:** `00f68fe41092280cc9e4044023b47de897354873`  
**Actual execution-start main:** `667b41a45cc39871a6539a5f78fda0389a758d27`  
**Branch:** `ap/hq-ap-2026-10-17-001-comprehension-provenance`  
**Status:** AP specialist proposal; not adopted product copy or implementation  
**Self-merge:** NO

## 1. Recommendation in brief

**Keep QSP1–QSP3 and the positively received Otherness question exactly as accepted.** The smaller defensible clarity change is brief ordinary-language context near the existing questions, plus a better visible explanation of Project Interpretation versus independent empirical support. Neither the Owner direction nor one version-unpinned review establishes a need to change the prompts themselves.

For Constitution scene 2, propose only a narrower English heading replacement, leaving scene body, IDs, visuals and German copy unchanged pending review.

This is a proposal only. No AP question, evidence gate, domain claim, source, interaction code or public copy is changed here.

## 2. Current authoritative interaction and reviewer suggestion

### Source anchors

- `contracts/AP_INTERACTION_V0.md` §§1–3, 8–11, 14–15; `tests/ap-integrity/AP_V0_INVARIANTS.md` INV-AP-01–04, 12–14, 17–20.
- Accepted AP integration handoff `handoffs/ap/HQ-AP-2026-10-15-002-system-participation-integration.md` §§2–12; D-005.
- Current `app/src/lib/smartphone/system-participation-ux.mjs` and `app/src/components/smartphone-system-participation.tsx`.
- Current `app/src/lib/smartphone/ap-otherness.mjs`, `ap-otherness-ux.mjs`, `app/src/components/smartphone-otherness.tsx`.
- `project-state/DECISIONS.md` D-014 and #180 B-04–B-07.

### Exact protected QSP wording — no change

**QSP1:** “Looking at that pathway, what relationship, if any, do you think you already have with the wider system involved?”

**QSP2:** “Would that relationship look different to you if a consequence of this kind reached you, or someone you call ‘mine’? Why or why not?”

**QSP3:** “Given what you see now, is there any action you think is available to you beyond the immediate phone decision?”

The exact source stores typographic curly quotation marks around **“mine”**. That typography should be preserved in implementation. These questions are project-authored inquiry / Project Interpretation, **not Direct AP quotations**.

### Purpose and authority map

| Element | Accepted purpose | What a general Yes/No/Maybe would lose or change | Status |
|---|---|---|---|
| QSP1 | First-person examination of **what relationship, if any**, the person sees with a particular **evidence-referenced wider system**. Rejecting relationship is allowed. | “Are personal decisions connected to wider systems?” changes the referent from one's own relationship to a general proposition about systems. It risks a leading factual/moral agreement check instead of inquiry. | **Accepted wording preserved** |
| QSP2 | Hypothetical contrast between consequences affecting unknown others versus oneself/someone regarded as **“mine”**, with reasoning open. | A generic Yes/No/Maybe connectedness answer removes the self/close-person contrast and risks assuming the user must respond affirmatively to be concerned. | **Accepted wording preserved** |
| QSP3 | The person's assessment of **possible action beyond this phone choice**, including none/unclear/no perceived agency. No action prescribed. | A general connectedness choice says nothing about practical agency and may misleadingly imply affirmative connectedness demands activism or a buying rule. | **Accepted wording preserved** |
| Gate and anchor | Reflection occurs only after a Research-owned, displayed, independently supported qualifying conditional/modelled consequence pathway reaches beyond the immediate circle. It does not certify an individual harmful act. | A generic environmental-awareness question could be shown even without the case-qualified evidence gate or could imply that any comparison checkbox establishes harm. | **Accepted gate and empirical anchor preserved** |
| Existing Otherness | After qualifying evidence, invites inquiry into whether **affected interests** are seen as separate from or connected with what the user cares about. | Replacing it with a general connectedness question loses the distinct relationship-to-affected-interests inquiry. | **Exact accepted wording preserved** |

**Reviewer B's Yes/No/Maybe suggestion is not adopted.** It is one preliminary, anonymous, version/device/completion-unpinned comprehension report—not a validated semantic-equivalence result, a new AP claim or an implementation command.

## 3. Smallest proposed system-inquiry clarity layer

**Recommendation:** no question rewriting and no new input control. Retain current accepted opening, empirical anchor, QSP1–QSP3, optional permissive guidance, skip, continue and Back actions. Add only the following presentation text where indicated.

| Proposal ID | Placement | Exact proposed public string | Old → new purpose/authority | Status |
|---|---|---|---|---|
| CL-QSP-01 | One brief visible helper **after the existing empirical anchor, before QSP1** | **“Here, ‘wider system’ means the processes and connections described by the evidence above. You may see a relationship, see none, or be unsure.”** | Old: QSP1 poses “wider system” without a short plain referent. New: defines the phrase only by the displayed evidence and preserves no relationship/uncertainty. Project Interpretation, not new empirical support. | **Equivalent editorial explanation proposed** |
| CL-QSP-02 | Small visible helper immediately under QSP2, without changing the question | **“‘Mine’ means someone you regard as close to you. This is a hypothetical question, not a prediction about them.”** | Old: QSP2 requires reading “mine” and hypothetical status from context. New: explains the self/close-person comparison without predicting harm or prescribing concern. Project-authored explanation of existing wording. | **Equivalent editorial explanation proposed** |
| CL-QSP-03 | No new helper; keep existing `SYSTEM_PARTICIPATION_GUIDANCE` at its current point of use | **“You can also say that you are not sure, that you do not see a meaningful relationship, or that you do not see any meaningful action available to you.”** | Old = new. Protects uncertainty, rejection and lack of perceived agency. | **Accepted text unchanged** |

The source-backed **`SYSTEM_PARTICIPATION_ANCHOR` stays verbatim**. It already distinguishes a supported *prospective* pathway from a completed purchase, realized harm or named victim/event. CL-QSP-01 must never stand in for or activate the empirical anchor.

If field observation later shows even two helpers increase cognitive burden, HQ may instead test only CL-QSP-01 plus existing guidance, while retaining QSP2 unchanged. That sequencing is a presentation test choice, not permission to alter underlying meaning.

### Explicit non-adoptions

Do not introduce:
- a new Yes/No/Maybe connectedness answer state;
- a compulsory answer to QSP1–3;
- a moral-connection score or inferred ego, complicity, guilt, empathy or agency label;
- a factual statement that this person's phone caused a named harm;
- a conclusion that no perceived relationship or agency is a defective answer;
- a preference for buy-new, keep, repair, used/refurbished, politics or activism.

## 4. Provenance: keep separation public, not only internal

### Confirmed current string

`app/src/lib/smartphone/ap-otherness-ux.mjs` currently renders:

> Protect Four is a project interpretation. It is mixed with the empirical record. It is not a direct statement from Acharya Prashant.

Internally the accepted activated Otherness state uses `attribution_status=project_interpretation` and `evidence_domain=mixed`. **Mixed is a metadata descriptor of a stage that consumes two independently governed domains, not a claim that philosophical and empirical epistemic authority become interchangeable.** To a public reader, “It is mixed with the empirical record” may wrongly suggest exactly that conflation.

### Proposed visible copy

| Proposal ID | Where | Exact mandatory-visible public string | Authority / status |
|---|---|---|---|
| CL-PROV-01 | On System Participation before/with QSP prompts, replacing only the current `SYSTEM_PARTICIPATION_CLASSIFICATION` presentation line | **“These reflection questions are written by PSI, not quoted from Acharya Prashant. The evidence above is supported and presented separately from the philosophical inquiry.”** | Project Interpretation; empirical separation under AP contract §1, Constitution P1–P2. **Equivalent editorial replacement proposed**; do not remove the actual empirical anchor. |
| CL-PROV-02 | On activated Otherness, replacing only `OTHERNESS_CLASSIFICATION` text, **at the point where the exact question appears** | **“Protect Four is PSI’s own interpretation, not a statement by Acharya Prashant. The effects referred to here come from separately sourced empirical evidence.”** | Constitution P1, P10–12; `INV-AP-17`–19 and D-005 gate. **Equivalent editorial replacement proposed**. |

Keep both visible; placing essential classification only in a collapsed disclosure would weaken the accepted attribution boundary. Do not alter `attribution_status=project_interpretation`, `evidence_domain=mixed` or source/claim pins internally. They remain auditable.

The qualifying empirical anchor at Otherness also remains visible under its accepted conditions. No statement here independently certifies a scientific finding; the evidence producer and its exact claims remain Research & Evidence authority.

### Optional expandable source text

| Proposal ID | Where | Exact proposed expandable strings | Authority / status |
|---|---|---|---|
| CL-DISC-01 | System Participation's existing “Why this question appears” disclosure, after the existing gate rationale | **“PSI asks these questions as its own interpretation. The empirical evidence establishes a supported conditional pathway under its stated assumptions; it does not establish your motive, responsibility, or what you should choose.”** | Project-authored domain-boundary explanation; **equivalent clarification proposed**. Preserve existing explanation of why the question is gated. |
| CL-DISC-02 | Otherness's existing `Support and provenance` disclosure | **Summary: “Evidence and philosophical sources”. Intro: “The effects mentioned in this question rely on the separately sourced evidence shown above. The philosophical references below are optional context, not proof of those effects or an instruction about your choice.”** | **Equivalent editorial wrapper proposed**, conditional on retaining every existing claim/version/corpus/source link and boundary below. |

**Existing source provenance must remain inspectable.** The current `ap-otherness-ux.mjs` disclosure already generates corpus version, approved claim ID/version, narrow paraphrase and official source links from the accepted post-evidence claim records. Do not remove these in a presentation simplification.

Approved post-evidence AP contextual claims, if surfaced by that existing allowlist:
- `AP-OTH-001@1.1`, official transcript *When Peace Looks Like War*: https://acharyaprashant.org/en/articles/peace-looks-like-war-1_ddeebcc (P3; primary-video lineage unresolved; no AI-generated summary as authority).
- `AP-PLAN-001@1.1`, official video https://www.youtube.com/watch?v=ZVEwREWFOW4 and official transcript https://acharyaprashant.org/en/articles/how-to-choose-balance-1_f174f53 (existing approved claim/version).

These links explain a **philosophical lens**; they do not:
- source the empirical climate/mining/waste claims;
- make the project-composed Otherness question a Direct AP quotation;
- establish the user's motives or responsibilities;
- license substantial copied AP text.

No scooter/Fortuner source disclosure is proposed: Owner attested the speaker, but the exact interview/segment remains unpinned under D-005.

## 5. Protect Four / Otherness protected text

**Exact accepted question — unchanged:**

> Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?

**Exact optional follow-up — unchanged:**

> What makes you see it that way?

The question's activation still requires a displayed, independently supported empirical consequence that satisfies the existing Otherness gate; for the accepted modelled global climate pathway, the full typed Research record and attribution limits govern eligibility under D-005. Generic lifecycle education, generic water/mining/e-waste cards, a pathway checkbox, or an AP source alone cannot open it.

The user can disagree, be unsure, see no relationship, or feel no meaningful agency. Skip/continue/Back, preserved exact raw answers, upstream edit/reset and material evidence-reference invalidation remain as accepted. None of those answers preselects, ranks or invalidates a final choice. `buy_new` remains legitimate.

**No wording/order/state change to APQ1–APQ6, QSP1–QSP3, Otherness or final-choice options** is proposed.

## 6. Constitution scene 2: one narrow title candidate

**Current accepted English title:** “Ordinary choices repeat”  
**Proposed replacement English title:** **“We make choices every day”**

| Element | Old → proposed | Purpose / authority | Status |
|---|---|---|---|
| `LBL-SCENE-2` only | “Ordinary choices repeat” → “We make choices every day” | Makes the frequency/ordinary-life point clearer while leaving choices plural and non-ranked. Scene 2's `PC-CHOICE-01` and `PC-INPUT-01` already express multiple legitimate pathways and asking only reasonable user-known information. `PROJECT_CONSTITUTION.md` P3–P4, P15, D-007 six-scene direction. | **Equivalent English editorial proposal** |
| `PC-CHOICE-01`, `PC-INPUT-01`, scene order/visual | No change | Avoids introducing promises, a correct path, a new score or a homepage/Constitution redesign. | **Accepted unchanged** |
| German pilot label for scene 2 | No translation chosen here | If HQ adopts the English edit, route a **bounded German-equivalence reconciliation** for the already accepted pilot/implemented locale; do not silently replace its canonical accepted translation. | **Dependency for later localization alignment** |

The proposed title is intentionally not “Every choice changes the planet” or “Every purchase has a victim,” both of which would exceed accepted causal boundaries.

## 7. Compact semantic acceptance / counterexample matrix

| Case | Expected result |
|---|---|
| Qualifying Research consequence displayed with explicit support, gate, scope and source limits | Existing prospective empirical anchor remains visible; CL-QSP helpers may appear, QSP wording and optionality unchanged. |
| Generic eight-stage lifecycle education only; generic water or unconditioned mining/e-waste | No System Participation or activated Otherness from generic context alone; educational material still available. |
| User says “I see no relationship with that system” | Exact raw text preserved, no forced Yes and no denial/indifference/complicity diagnosis. |
| User says “I’m not sure” | Valid, preserved literally; no automatic yes/no, no inferred concern. |
| User says “I cannot do anything meaningful beyond this phone decision” | Valid raw answer; no activism, guilt or corrective action prompt. |
| QSP2 says the answer would change if someone close were affected | Hypothetical only; no prediction of personal harm or selfishness diagnosis. |
| QSP2 says nothing would change | Valid; no virtue/consistency grade. |
| User skips, partially responds, goes Back or edits upstream facts | Accepted skip/partial/Back semantics remain; materially changed/removed Research binding invalidates stale downstream state. |
| Person sees a supported conditional global climate pathway | Never render it as a realized named harm, one-phone causation, personal blame or verified purchase. |
| User rejects philosophical interpretation but chooses `buy_new` | New purchase remains legitimate; no forced connection or failed-inquiry label. |
| Otherness active with revised provenance line | Visible Project Interpretation/Direct AP boundary stays explicit, separately sourced empirical anchor remains; optional disclosure preserves approved claim/version/corpus links. |
| Someone reads “mixed” internal metadata | That term is **not** rendered as an assertion that empirical and philosophical authorities are mixed into one proof. |
| English scene-2 title is adopted | Only the stable label text changes; scene narrative, PC units, six-scene order and source meaning stay unchanged; German counterpart is reviewed separately. |
| Feedback author did not finish the inquiry / deployment unknown | No inference that any copy revision has passed real human comprehension testing. |

## 8. Authority classification and later approvals

**Already accepted / unchanged:** QSP1–QSP3 exact prompts, optional guidance and flow; empirical post-evidence gate; existing empirical anchor; protected Otherness wording/follow-up; raw-answer authority; skip/back/reset/binding invalidation; source-lens allowlist and pins; legitimate `buy_new`; scene 2 meaning.

**Equivalent editorial proposals only:** CL-QSP-01/02, CL-PROV-01/02, CL-DISC-01/02 and `LBL-SCENE-2` English title candidate. These are **not** adopted by publishing this handoff.

**Genuinely new semantics proposed:** none. A compulsory connectedness choice, revised QSP wording, reinterpretation of “mine,” changed AP gate, new direct AP attribution or a moral/purchase recommendation would be new semantics and require additional review/Owner authority; this handoff authorizes none.

HQ must independently review the exact proposed strings and their authority. If accepted as faithful equivalents under D-014/standing governance, HQ may explicitly select the smallest copy-only Tier-2 Cursor task with relevant tests and visually verify that required classification remains visible; the German label requires its own bounded consistency review. **No automatic Cursor task/wake follows from this AP return.**

Reviewer B's observations are useful hypotheses about comprehension, not population evidence or a completed usability study. Independent human testing remains with the separately authorized voluntary pilot, not this AP proposal.

## 9. Inspected sources and scope verification

Read on actual execution-start main `667b41a45cc39871a6539a5f78fda0389a758d27`:
- `OWNER_CONTROL.md`;
- `project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md`;
- `project-state/DECISIONS.md` D-005/D-007/D-008/D-014;
- #180 B-04–B-07;
- `contracts/AP_INTERACTION_V0.md`;
- `tests/ap-integrity/AP_V0_INVARIANTS.md`;
- `handoffs/ap/HQ-AP-2026-10-15-002-system-participation-integration.md`;
- `handoffs/ap/HQ-AP-2026-10-15-003-public-constitution.md`;
- `app/src/lib/smartphone/system-participation-ux.mjs` and `app/src/components/smartphone-system-participation.tsx`;
- `app/src/lib/smartphone/ap-otherness.mjs`, `ap-otherness-ux.mjs` and `app/src/components/smartphone-otherness.tsx`;
- `app/src/lib/constitution/public-constitution.mjs`;
- frozen `AP-CORPUS-V0.3.0.md` sections for the two already-approved post-evidence source-link pins only.

Verified against source: QSP strings; source classifications; exact protected Otherness question/follow-up; current `OTHERNESS_CLASSIFICATION` wording; currently present disclosure links/claim version behavior; the stable `LBL-SCENE-2` / scene-2 PC references; no new empirical or AP claim.

**Allowed changed file:** this handoff alone. No app, tests, contract, registry, AP corpus/package, empirical source, Constitution copy or localization implementation is modified. Docs-only proposal: no app-wide build/CI or human usability test is claimed.

## 10. HQ return

**AP specialist result:** `VERIFIED_FOR_HQ_REVIEW` after publication and one-file scope verification.

**Settled:** Existing first-person system inquiry and Otherness question remain semantically distinct; replacing them with a general Yes/No/Maybe would lose accepted meaning. Narrow presentation-only explanation and attribution strings are proposed.

**Uncertain:** Human comprehension on a pinned build/device remains untested by this specialist task. HQ must decide which editorial suggestions to adopt. A German pilot equivalent would need a later bounded language review if the English scene heading changes.

**V0 implication:** A future copy-only task may clarify the experience without weakening evidence gates, raw-answer autonomy, attribution boundaries or open purchase outcomes.

**Needs another workstream:** HQ independent selection/review; Cursor only after separate authorization; qualified German semantic review only if the English scene heading is adopted.

**Recommended next action:** HQ review this exact PR head, adopt only faithful copy refinements, then consider the smallest non-overlapping implementation task after current Cursor work.

**Self-merge: NO.**
