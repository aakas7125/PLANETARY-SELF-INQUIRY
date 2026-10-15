# HQ-AP-2026-10-15-001 — System-participation bridge proposal

**Issue:** #139  
**Workstream:** AP Framework & Corpus  
**Execution class:** Tier 3 — AP / product-semantics proposal  
**Branch:** `ap/hq-ap-2026-10-15-001-system-participation-proposal`  
**Starting main:** `a7c24939f9ef43f58c6854199d7e5282d1b6efb4`  
**Proposal status:** specialist proposal only; not accepted product behavior  
**Self-merge:** NO

## 1. Objective

Add the smallest optional reflection between evidence/journey material and the already-accepted Protect My Four / otherness inquiry, without weakening the existing evidence gate or expanding `AP-CORPUS-V0.3.0`.

The proposed bridge asks the user to examine their relationship with a wider system only after a qualifying empirical consequence is actually established. It does not tell the user what that relationship is, infer complicity or motive, or require activism.

## 2. Accepted baseline preserved

This proposal preserves the accepted `AP_INTERACTION_V0` rules:

- empirical claims remain Research & Evidence authority;
- raw answers remain authoritative;
- no hidden motive inference, diagnosis, score, purchase ranking, guilt test or compulsory action;
- `unclear`, disagreement and non-response remain legitimate;
- Protect My Four remains Project Interpretation;
- AP attribution cannot substitute for empirical evidence;
- the post-evidence gate remains necessary;
- the final choice remains the user's.

Existing accepted otherness gate remains the authority:
- at least one displayed consequence must be independently supported;
- support status must be supported;
- extent must explicitly reach beyond the immediate circle;
- AP-only claims cannot open the gate.

## 3. Proposed placement and trigger

Proposed sequence:

```text
phone journey / empirical comparison
→ qualifying impact/dependency consequence
→ SYSTEM-PARTICIPATION BRIDGE (new, optional)
→ existing Protect My Four / otherness inquiry
→ final user choice
```

### Trigger

The system-participation bridge may become available only when the same evidence gate required by the current otherness inquiry is satisfied.

It must not activate from:
- generic lifecycle context alone;
- a checked comparison pathway;
- AP attribution;
- a hypothetical possibility;
- an unsupported or unknown consequence;
- an immediate-circle-only consequence.

This proposal does not weaken or bypass the existing gate.

## 4. Exact-wording candidate

### Opening

**One more question about the wider system behind this choice.**

Classification: project-authored inquiry.

### QSP1 — relationship

**Looking at the consequence you just saw, what relationship, if any, do you think you already have with the system that produces it?**

Classification: Project Interpretation / project-authored inquiry.

Purpose: asks for the user's own description of relationship; does not assert responsibility, causation, complicity or guilt.

### QSP2 — personal-circle contrast

**Would that relationship look different to you if the same kind of consequence reached you, or someone you call “mine”? Why or why not?**

Classification: Project Interpretation / project-authored inquiry.

Important boundary: “the same kind of consequence” refers only to the already-established consequence category. It must not be rendered as a prediction that the consequence will actually reach the user or their close circle.

### QSP3 — available action

**Given what you see now, is there any action you think is available to you beyond the immediate phone decision?**

Optional follow-up:

**“No,” “I’m not sure,” or “I don’t think I have meaningful agency here” are valid answers.**

Classification: Project Interpretation / project-authored inquiry.

Purpose: permits perceived agency, no agency, uncertainty or disagreement without prescribing activism, politics, advocacy, donation, boycott or any other outcome.

## 5. Transition to existing Protect My Four

After QSP1–QSP3, the existing accepted otherness question remains unchanged:

> Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?

No replacement wording is proposed here.

The bridge should be described internally as a reflection on **relationship with systems**, while the existing Protect My Four step remains the reflection on **relationship with affected interests / otherness**.

These are adjacent but not identical:
- system-participation asks: “what relationship, if any, do I have with the process/system?”
- Protect My Four asks: “are affected interests separate from what I care about?”

## 6. State and raw-answer contract

Proposed raw record:

```text
system_participation_record {
  interaction_version
  trigger_consequence_refs[]
  qsp1_exact_question_text
  qsp1_exact_user_answer
  qsp2_exact_question_text
  qsp2_exact_user_answer
  qsp3_exact_question_text
  qsp3_exact_user_answer
}
```

No motive extraction is required.

If implementation needs presentation-only annotations, they must be literal and non-psychological, for example:

```text
relationship_response =
  relationship_stated |
  no_relationship_stated |
  uncertain |
  unanswered

personal_circle_contrast =
  would_change |
  would_not_change |
  uncertain |
  unanswered

agency_response =
  action_stated |
  no_action_seen |
  uncertain |
  unanswered
```

These values must be derived only from explicit answer content. They must not become:
- complicity;
- selfishness;
- indifference;
- empathy;
- ego;
- concern score;
- responsibility score;
- moral consistency score.

Raw answers remain authoritative and must survive Back/edit/reset according to the same project rules used for other AP inquiry state.

## 7. Attribution classification

| Sentence / element | Classification | Basis |
|---|---|---|
| “One more question about the wider system behind this choice.” | project-authored inquiry | none required |
| QSP1 | Project Interpretation | `AP-OTH-001@1.1`, `AP-PLAN-001@1.1` as philosophical background only |
| QSP2 | Project Interpretation | Owner product direction + `AP-OTH-001@1.1` / `AP-PLAN-001@1.1`; not a Direct AP quotation |
| QSP3 | Project Interpretation | project autonomy principle; no Direct AP attribution required |
| Existing otherness question | accepted Project Interpretation | existing canonical contract |
| Empirical trigger statement | empirical | Research & Evidence only |

No sentence in this proposed bridge should be rendered as “Acharya Prashant says...”.

## 8. Philosophical source boundary

The proposed bridge can be philosophically compatible with the frozen corpus without creating a new Direct AP claim.

Relevant accepted claims:

- `AP-OTH-001@1.1`: AP links otherness with boundaries that divide self/interest from what is treated as separate.
- `AP-PLAN-001@1.1`: AP questions the assumed opposition between one’s own interests and interests treated as “others,” including people, species and ecosystems.

These claims support inquiry into self/other boundaries. They do **not** establish:
- that a specific user is complicit;
- that participation in a phone market makes them morally responsible for a specific harm;
- that any particular action is required;
- that consequences will reach their family;
- that AP endorsed this exact proposed wording.

No corpus change is required for this proposal.

## 9. Scooter / Fortuner interview source check

The Owner direction referenced a scooter/Fortuner YouTube interview example as inspiration but supplied no exact source.

**Owner attestation added 2026-10-15:** the Owner states that they personally watched the YouTube video and guarantee that the speaker was Acharya Prashant himself. The transcript available to the Owner was YouTube auto-generated/self-generated transcript text.

This materially improves **speaker authenticity confidence**, but it does not yet establish the exact original video identity, timestamp, transcript accuracy, or exact wording/context required for a versioned Direct AP claim.

A bounded official-source search also found an official AP article, **“Things You DON'T Need to Have a Great Life”**, containing a Fortuner example in a broader discussion of consumption and values:
https://acharyaprashant.org/en/articles/things-you-dont-need-to-have-a-great-life-1_7641b74

That article may offer an independently usable analogy if HQ/AP later chooses it, but it must not be silently treated as the source of the Owner-remembered scooter/Fortuner passage.

Current classification:

- speaker identity for the remembered video: **Owner-attested Acharya Prashant**;
- transcript: **YouTube auto-generated/self-generated transcript**, useful for discovery/context but not authoritative claim text by itself;
- exact video URL/title/timestamp: unresolved;
- Direct AP claim status for the remembered analogy: **not yet approved**;
- no quotation or precise meaning should be attributed until the original source is pinned and context checked.

This unresolved source does not block the proposed interaction because the interaction remains fully classifiable as Project Interpretation.

## 10. Research interface required from Issue #140

The bridge should consume only a bounded empirical interface, not prose labels.

Minimum proposed input:

```text
system_participation_evidence {
  consequence_ref_id
  claim_id
  claim_version
  displayed: true
  independently_supported: true
  support_status: supported
  extent: beyond_immediate_circle
  consequence_category
  source_ids[]
  attribution_limits[]
}
```

Research owns whether this object is valid.

The AP layer must not:
- infer extent from a lifecycle-stage label;
- infer harm from pathway selection;
- infer specific victims, location, route, handling, mining quantity or exposure;
- turn generic smartphone knowledge into a case-specific consequence;
- convert unknown into false/zero.

If Research #140 proposes a different typed interface, HQ should reconcile the two proposals while preserving the same gate semantics.

## 11. Proposed semantic acceptance invariants

### SP-01 — evidence gate preserved
Bridge cannot activate without a qualifying displayed, independently supported, beyond-immediate-circle consequence.

### SP-02 — generic lifecycle context is insufficient
A generic phone-journey card alone cannot activate QSP1–QSP3.

### SP-03 — hypothetical is not prediction
QSP2 must not produce or store a claim that the consequence will reach the user or someone close to them.

### SP-04 — raw answers authoritative
All three exact answers are stored verbatim; no normalized motive replaces them.

### SP-05 — disagreement valid
Answers such as “I don’t think I have any relationship with it” remain valid and are not treated as denial or evidence of hidden concern.

### SP-06 — uncertainty valid
“I don’t know” / “I’m not sure” remain terminally valid.

### SP-07 — lack of agency valid
“I don’t think there is anything meaningful I can do” remains valid and does not trigger guilt, activism prompts or corrective messaging.

### SP-08 — no compulsory action
No answer can automatically produce boycott, repair, used/refurbished, keep, buy-new, advocacy, donation, voting or political recommendations.

### SP-09 — no motive diagnosis
No answer or non-answer may generate selfishness, complicity, indifference, ego, empathy, concern or responsibility scores/labels.

### SP-10 — no purchase ranking
Bridge responses do not rank keep/repair/used/refurbished/new.

### SP-11 — consequence traceability
The bridge stores the exact qualifying consequence reference(s) that opened it.

### SP-12 — invalidation
If upstream situation/inquiry/comparison/impact edits invalidate the qualifying consequence, bridge availability and any derived presentation state must clear according to accepted edit/reset semantics. Raw historical persistence, if later desired, requires a separate accepted history design.

### SP-13 — AP attribution boundary
No proposed bridge sentence is rendered as a Direct AP quotation/claim.

### SP-14 — Protect My Four unchanged
Existing otherness question and its Project Interpretation classification remain unchanged.

### SP-15 — final choice remains open
No bridge response can close, preselect or constrain the later final-choice state.

## 12. Representative semantic cases

### Case A — qualifying consequence, user sees relationship
Input: valid consequence ref with beyond-immediate-circle extent.
User: “I buy from companies in this market, so I am part of it in some way.”
Expected: preserve exact answer; no responsibility score; proceed optionally.

### Case B — user rejects relationship
User: “I don’t think buying one phone gives me a meaningful relationship with the wider system.”
Expected: preserve exact answer; no denial/rationalization label; Protect My Four remains available because the empirical gate, not agreement, controls availability.

### Case C — personal-circle contrast changes answer
User: “Yes, I would take it more seriously if it affected my family.”
Expected: preserve answer only. Do not infer selfishness, hypocrisy or lack of concern for others.

### Case D — personal-circle contrast does not change answer
User: “No, I think I should judge it the same way.”
Expected: preserve answer; no virtue/consistency score.

### Case E — no agency
User: “I don’t know what I can realistically do beyond choosing a phone.”
Expected: valid answer; no activism funnel.

### Case F — generic lifecycle card only
No qualifying consequence ref.
Expected: bridge unavailable.

### Case G — unsupported / conditional consequence
Support status unknown/unsupported.
Expected: bridge unavailable; do not fill the gap with AP.

### Case H — upstream edit invalidates evidence
Qualifying consequence disappears after edit/reset.
Expected: bridge no longer active and cannot keep presenting the previous consequence as current evidence.

## 13. Accepted vs proposed behavior

| Area | Accepted now | Proposed |
|---|---|---|
| Evidence gate | required before otherness | unchanged; reused for bridge |
| Protect My Four wording | accepted | unchanged |
| System-participation questions | none | QSP1–QSP3 |
| Direct AP attribution | frozen claim allowlist | no new Direct AP claim |
| Corpus | `AP-CORPUS-V0.3.0` frozen | unchanged |
| Empirical authority | Research & Evidence | unchanged |
| Raw answer authority | accepted | extended to QSP1–QSP3 |
| Final choice autonomy | accepted | unchanged |
| Political/action outcome | none required | remains non-compulsory |

## 14. Discrepancies / decisions for HQ

1. **Placement choice:** this proposal places the bridge immediately before existing Protect My Four. If Research #140 produces a multi-stage journey where only some stages yield qualifying consequences, HQ must decide which displayed consequence(s) are carried forward.
2. **QSP3 scope:** asking about action beyond the purchase is product-semantic expansion, though explicitly requested by Owner direction. HQ should accept the exact wording before implementation.
3. **History behavior:** this proposal defines current-state invalidation but does not add a longitudinal historical reflection feature.
4. **Source disclosure:** the specific scooter/Fortuner interview remains unresolved and should be omitted unless authenticated.
5. **No corpus amendment required:** the proposal uses existing frozen philosophical claims as background and introduces only Project Interpretation. If HQ later wants any sentence presented as Direct AP, a separately versioned corpus amendment/review would be required.

## 15. Smallest future Tier-2 implementation slice if accepted

One bounded implementation task could:
- add a `system-participation` state/module between Impact and Otherness;
- consume only an accepted Research evidence object;
- implement QSP1–QSP3 exact accepted copy;
- preserve raw answers and edit/reset invalidation;
- leave existing otherness module/question unchanged;
- add the semantic tests SP-01–SP-15.

It must not invent evidence mapping, change impact gates, change the frozen corpus, or create new AP copy.

## 16. Provenance / examined pins

Examined at starting main `a7c24939f9ef43f58c6854199d7e5282d1b6efb4`:

- `OWNER_CONTROL.md`
- `project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md`
- `contracts/AP_INTERACTION_V0.md`
- `provenance/source-packages/AP-V0-INTERACTION-0.2.0.md`
- `provenance/source-packages/AP-CORPUS-V0.3.0.md`
- `tests/ap-integrity/AP_V0_INVARIANTS.md`
- `app/src/lib/smartphone/ap-otherness.mjs`
- `app/src/lib/smartphone/ap-otherness-ux.mjs`
- `app/src/lib/smartphone/impact-pathways-ux.mjs`
- Issue #140 interface requirements (coordination only; no Research authority inherited)

Official-source search limitation recorded above.

## 17. Return status

**Specialist result:** `VERIFIED_FOR_HQ_REVIEW`

The proposal is implementation-ready at the semantic-contract level, but no app implementation, integrated-contract edit, corpus change, immutable-package edit or empirical change is authorized by this result.
