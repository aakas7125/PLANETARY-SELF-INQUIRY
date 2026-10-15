# HQ-AP-2026-10-15-002 — System-participation integration handoff

**Issue:** #145  
**Workstream:** AP Framework & Corpus  
**Execution class:** Tier 3 — AP / product semantic reconciliation  
**Branch:** `ap/hq-ap-2026-10-15-002-system-participation-integration`  
**Starting main:** `662c23b31a9177468ba5715f9af9a29fabb02719`  
**Status:** specialist reconciliation proposal for HQ review  
**Self-merge:** NO

## 1. Result in one sentence

Use an optional, raw-text-only system-participation reflection **only after** Research supplies a qualifying displayed empirical consequence reference; describe that reference as a supported prospective/modelled pathway rather than as a realized harm; then continue to the existing unchanged Protect My Four / Otherness inquiry.

No change to `AP-CORPUS-V0.3.0` is required.

## 2. Exact proposed interaction

### Opening

**One more question about your relationship with the wider system behind this choice.**

Classification: project-authored inquiry / Project Interpretation.

### Empirical-reference anchor

When a qualifying reference exists, render a short factual anchor from the Research-owned record, for example:

**The evidence shown here describes a supported prospective pathway that extends beyond you and the people closest to you. It does not show that you bought anything, that a specific harm already happened, or that one phone caused an outcome for a particular person or place.**

Classification:
- first sentence: empirical presentation, only if supplied/authorized by Research;
- second sentence: empirical boundary/attribution limit, supplied from the accepted Research interface.

AP must not manufacture either sentence from claim names, domain labels, pathway selection or AP philosophy.

### QSP1 — relationship

**Looking at that pathway, what relationship, if any, do you think you already have with the wider system involved?**

Classification: Project Interpretation / project-authored inquiry.

This replaces the earlier phrase “the consequence you just saw” and “the system that produces it,” because the displayed record may be a conditional/modelled pathway rather than proof of a realized consequence or a uniquely identified causal system.

### QSP2 — self / mine contrast

**Would that relationship look different to you if a consequence of this kind reached you, or someone you call “mine”? Why or why not?**

Classification: Project Interpretation / project-authored inquiry.

Boundary: this is explicitly hypothetical. It must not be rendered or stored as a prediction that the consequence will reach the user or their close circle.

### QSP3 — perceived action

**Given what you see now, is there any action you think is available to you beyond the immediate phone decision?**

Optional guidance:

**You can also say that you are not sure, that you do not see a meaningful relationship, or that you do not see any meaningful action available to you.**

Classification: Project Interpretation / project-authored inquiry.

The guidance is permissive, not corrective. No activism, political, donation, boycott, purchase or advocacy outcome is implied.

## 3. Controls and labels

Proposed labels:

- continue from evidence: **Reflect on your relationship with the wider system**
- skip: **Skip this reflection**
- continue after QSP1–QSP3: **Continue to Protect My Four**
- back: **Back to evidence**
- optional disclosure: **Why this question appears**

Optional disclosure content:

**This reflection appears only because the evidence layer supplied a qualifying supported pathway extending beyond your immediate circle. The evidence and this philosophical reflection are separate: the evidence does not determine what you should think or choose.**

Classification:
- qualifying-pathway statement: empirical/gate metadata, only from Research;
- separation/autonomy statement: Project Interpretation consistent with accepted AP boundaries.

## 4. Exact gate

The AP layer may open the system-participation reflection only when it receives a Research-owned typed reference satisfying all of these conditions:

```text
displayed = true
independently_supported = true
support_status = supported
extent = beyond_immediate_circle
gate_eligible = true
```

and with exact:
- consequence reference ID;
- claim ID;
- claim version;
- source IDs;
- attribution limits;
- case-specificity / condition basis sufficient for Research to set `gate_eligible=true`.

AP must not derive, infer, repair or default any of those empirical fields.

### Conditional/modelled climate pathway

AP considers a Research-approved, displayed **prospective/modelled climate pathway** eligible for the existing broader-consequence gate when Research explicitly sets the above fields and records that:
- the underlying scenario condition is established by accepted evidence;
- the pathway extends beyond the immediate circle;
- the record does not assert an actual completed purchase;
- the record does not assert realized harm to a named person/place;
- the record does not attribute individual causation or blame.

This is compatible with the existing gate because the gate requires an evidence-backed effect/pathway extending beyond the immediate circle; it does not require a named victim or a completed historical event.

AP does **not** independently decide that any positive GHG quantity is sufficient. Research owns the condition derivation and `gate_eligible` decision.

## 5. What does not qualify

None of the following may open system-participation or Protect My Four:

- generic lifecycle education by itself;
- a pathway checkbox/label;
- generic water context;
- generic mining context without established required condition;
- generic e-waste context without established handling condition;
- an unsupported, missing or unknown record;
- AP attribution or philosophical-source material;
- hypothetical prose not backed by a Research-owned qualifying reference.

These generic educational materials may remain visible in the evidence/journey layer independently. Their educational value does not make them a personal consequence.

## 6. Order and state

Accepted/proposed order:

```text
phone evidence / Impact
→ optional System Participation
→ existing Protect My Four / Otherness
→ final choice
```

The existing Protect My Four wording remains unchanged.

### First implementation state

Use literal raw text only:

```text
system_participation_state {
  opened
  skipped
  trigger_consequence_refs[]
  qsp1_raw
  qsp2_raw
  qsp3_raw
}
```

Do not implement derived classifications, agreement detectors, motive extraction, agency classification or psychological annotations in the first slice.

### Valid user states

All of these are valid:
- full answers;
- partial answers;
- empty answers if user chooses skip;
- disagreement with the premise;
- “I don’t know”;
- “I do not think I have a relationship with it”;
- “I do not think I can do anything meaningful”;
- answers saying the self/mine hypothetical would change their view;
- answers saying it would not.

None alters the empirical gate or proves a moral/philosophical state.

## 7. Skip / continue behavior

**System Participation is optional.**

If skipped:
- no answer is synthesized;
- no concern/indifference/agency inference is made;
- existing Protect My Four may still appear if its independent existing empirical gate remains satisfied;
- final choice remains available through the accepted flow.

Skipping system-participation must not be treated as skipping evidence, rejecting AP, lack of concern, or a reason to change purchase options.

Partial answers may be preserved when the user continues. No minimum text length is required by AP semantics.

## 8. Back, edit, reset and reference changes

### Back

Back to evidence preserves current raw system-participation answers while the same qualifying consequence reference remains current.

### Upstream evidence change

If the qualifying consequence reference changes materially:
- system-participation must not silently keep presenting the old reference as current;
- the bridge should close/revalidate against the new reference;
- existing answers tied to the old reference must not be reinterpreted against the new evidence.

For the smallest implementation, clearing current bridge answers on qualifying-reference replacement is acceptable and safer than silently rebinding them. A historical reflection archive would require separate design authority.

### Qualifying reference removed

If edit/reset removes all qualifying references:
- system-participation becomes unavailable;
- Protect My Four remains governed by its existing gate and likewise must not stay activated from stale evidence;
- no “effects are absent” conclusion is created.

### Full reset

Clear current bridge state and references.

## 9. Existing Protect My Four remains unchanged

The accepted question remains:

**Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?**

Optional follow-up remains:

**What makes you see it that way?**

The new bridge does not:
- replace this wording;
- broaden its source claims;
- make it mandatory;
- change its Project Interpretation classification;
- turn “Protect My Four” into Direct AP attribution.

## 10. Attribution and disclosure separation

| Surface | Authority |
|---|---|
| empirical anchor / qualifying pathway | Research & Evidence |
| QSP1–QSP3 | Project Interpretation / project-authored inquiry |
| AP philosophical disclosure, if shown | frozen approved AP claim IDs only |
| scooter/Fortuner remembered example | Owner-attested speaker identity; not pinned Direct AP source |
| existing Protect My Four | accepted Project Interpretation |

No QSP sentence should be introduced with “Acharya Prashant says”.

Optional AP disclosure is not required for the first implementation. If later shown, it may cite only already-approved post-evidence claims such as `AP-OTH-001@1.1` / `AP-PLAN-001@1.1`, with existing provenance and licensing limits.

The original scooter/Fortuner video remains unpinned. Owner attests the speaker was Acharya Prashant, but exact URL/title/timestamp/context remain unresolved. Do not display a source link for it, quote its auto-generated transcript as authoritative, or substitute the separate Fortuner article as though it were the remembered source.

## 11. Acceptance matrix

| Case | System Participation | Protect My Four | Required behavior |
|---|---|---|---|
| qualifying Research record | available | existing gate may qualify | show empirical anchor + optional QSP flow |
| generic lifecycle education only | unavailable | unavailable from that context alone | education remains visible |
| generic water card | unavailable | unavailable from that card | no inferred extent |
| pathway checkbox only | unavailable | unavailable | selection is not evidence |
| supported record, extent unknown | unavailable | unavailable | fail closed |
| unsupported/missing record | unavailable | unavailable | fail closed |
| qualifying modelled climate pathway | available if Research sets gate fields | eligible under existing gate | describe as prospective/modelled, not realized harm |
| user skips QSP | skipped | still governed independently by existing gate | no inference from skip |
| user answers partially | valid | unchanged | preserve raw text |
| user disagrees | valid | unchanged | no denial/complicity inference |
| user says no relationship | valid | unchanged | no correction |
| user says no agency | valid | unchanged | no activism funnel |
| user says self/mine changes view | valid | unchanged | no selfishness/hypocrisy inference |
| user says self/mine does not change view | valid | unchanged | no virtue/consistency score |
| upstream reference changes | revalidate/clear current binding | revalidate existing gate | no stale evidence |
| upstream reference removed/reset | unavailable | fail closed | no absence-of-harm inference |
| any QSP answer | no final-choice preselection | no final-choice preselection | final choice remains user-owned |

## 12. Focused implementation invariants

1. **SP-I01:** AP consumes but never creates Research gate fields.
2. **SP-I02:** prospective/modelled pathway language never becomes “harm occurred.”
3. **SP-I03:** QSP1 uses “pathway” / “wider system involved,” not “harm you caused” or “system that caused this specific outcome.”
4. **SP-I04:** QSP2 is visibly hypothetical.
5. **SP-I05:** skip is valid and non-diagnostic.
6. **SP-I06:** raw QSP answers are authoritative.
7. **SP-I07:** no derived answer classifiers in first implementation.
8. **SP-I08:** no answer changes empirical truth.
9. **SP-I09:** no answer ranks phone options.
10. **SP-I10:** no answer or non-answer produces guilt, complicity, selfishness, ego, concern or agency score.
11. **SP-I11:** changed/removed evidence cannot retain stale current reference.
12. **SP-I12:** generic education cannot open the gate.
13. **SP-I13:** AP-only material cannot open the gate.
14. **SP-I14:** existing Protect My Four wording remains exact.
15. **SP-I15:** final choice remains unselected until explicit user action.

## 13. Cross-domain reconciliation with Research #140 / #146

### Agreement with received Research #140

AP agrees with:
- typed consequence records rather than prose-label inference;
- `generic_context` vs condition-established distinction;
- generic water being non-gate-eligible;
- mining/e-waste remaining non-qualifying absent their strict conditions;
- AP-facing projection only from a Research-owned qualifying record;
- exact claim/version/source/limits remaining attached.

### AP requirement for Research #146

Research #146 should make explicit, for the first manufacturing-climate subset:
- the exact claim/version and source basis;
- the exact scenario condition;
- why `independently_supported=true`;
- the precise meaning and basis for `extent=beyond_immediate_circle`;
- that the record is prospective/modelled rather than proof of realized personal harm;
- the attribution limits that must travel with the reference.

If Research #146 cannot support `extent=beyond_immediate_circle` under accepted sources, the AP gate must remain closed. AP does not fill that gap.

## 14. Product/AP decisions resolved here

Resolved within existing Owner direction and accepted boundaries:
- bridge is optional;
- exact QSP wording is as above;
- raw-text-only first implementation;
- skip is permitted;
- no derived classifications;
- existing Protect My Four remains unchanged;
- Research-owned qualifying conditional/modelled climate pathway may be consumed if Research explicitly establishes the gate fields;
- no named target or realized historical harm is required by AP, but AP cannot invent extent/support.

No new Owner decision is required for these bounded semantics.

## 15. Inspected pins

Inspected:
- `handoffs/ap/HQ-AP-2026-10-15-001-system-participation-proposal.md` at received final proposal state;
- `handoffs/research/HQ-RE-2026-10-15-001-smartphone-journey-proposal.md` at received Research proposal;
- HQ review/disposition on Research #140 / PR #143;
- `contracts/AP_INTERACTION_V0.md`;
- `provenance/source-packages/AP-V0-INTERACTION-0.2.0.md`;
- `provenance/source-packages/AP-CORPUS-V0.3.0.md`;
- `tests/ap-integrity/AP_V0_INVARIANTS.md`;
- `app/src/lib/smartphone/ap-otherness.mjs`;
- `app/src/lib/smartphone/ap-otherness-ux.mjs`;
- `app/src/components/smartphone-situation.tsx`.

No app code, integrated contract, frozen corpus, source package, empirical registry or scientific claim was changed.

## 16. Return

**AP specialist status:** `VERIFIED_FOR_HQ_REVIEW`

This handoff finalizes the AP/product-semantics side. Research #146 remains the authority for the exact empirical presentation and extent derivation. HQ must reconcile both before Tier-2 implementation.
