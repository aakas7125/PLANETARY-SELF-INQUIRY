# AP Interaction V0 Contract

Status: **Authoritative integrated contract**  
Interaction package: `AP-V0-INTERACTION-0.2.0`  
Corpus baseline: `AP-CORPUS-V0.3.0`  
Integrated: **2026-09-05**

Immutable specialist sources:

- `provenance/source-packages/AP-V0-INTERACTION-0.2.0.md`
- `provenance/source-packages/AP-CORPUS-V0.3.0.md`

This contract is the current implementation truth for the AP-grounded V0 smartphone interaction. If this file conflicts with the immutable source packages, record the conflict in `contracts/INTEGRATION_NOTES.md` before changing behavior.

## Governing separation

Keep distinct:

1. Direct AP claim.
2. Project Interpretation.
3. Empirical claim owned by Research & Evidence.

`AP said X` must never be treated as `science establishes X`.

## Exact six questions

1. `APQ1_FUNCTION` — **What would the new phone let you do that your current phone cannot do adequately?**
2. `APQ2_EXPECTATION` — **Imagine you already have the new phone. Besides what it can technically do, what do you expect to be different for you?**
3. `APQ3_ORIGIN` — **When did you first begin seriously wanting this phone or an upgrade? What were you seeing, hearing or comparing around that time? Was the desire already this strong before that?**
4. `APQ4_VISIBILITY` — **Would wanting this phone change if nobody else ever knew which phone you owned? Why or why not?**
5. `APQ5_NONPURCHASE` — **Imagine deciding today to keep your current phone for another year. What, if anything, feels difficult about that?**
   - Optional follow-up: **Is that difficulty mainly practical, or is something else involved too?**
6. `APQ6_RESEE` — **Reading your own answers together, does anything about the desire look different now? What seems appropriate now?**

Approved Q6 outcomes:

- `keep_current`
- `repair_current`
- `consider_used_or_refurbished`
- `buy_new`
- `investigate_further`
- `unclear`

None is philosophically pre-ranked.

## Answer authority and traceability

Raw answers are authoritative. Every derived observation must preserve:

```text
question_id
exact_question_text
exact_user_answer
observation_type
observation_value
supporting_exact_span
derivation_status = explicit | unclear
```

If no exact answer span supports a derived observation, use `unclear` rather than inference.

Derived observations never overwrite raw answers.

## Approved observation enums

```text
functional_limitation =
  concrete_limitation_stated |
  no_specific_limitation_stated |
  unclear

anticipated_change =
  nonfunctional_change_stated |
  functional_change_only_stated |
  no_change_beyond_function_stated |
  unclear

exposure_chronology =
  desire_predated_exposure |
  desire_appeared_after_exposure |
  desire_intensified_after_exposure |
  exposure_helped_select_product |
  no_relevant_exposure_identified |
  unclear

visibility_response =
  unchanged |
  somewhat_weaker |
  substantially_weaker |
  stronger |
  unclear

nonpurchase_difficulty =
  practical_only_stated |
  nonpractical_element_stated |
  mixed_stated |
  no_significant_difficulty_stated |
  unclear

self_reported_shift = changed | unchanged | uncertain | unclear
```

Chronology is not causality. Visibility significance is not status-seeking. Non-practical difficulty is not automatically fear.

## Reflection grammar

Allowed operations:

```text
RESTATEMENT     mandatory
JUXTAPOSITION   optional
QUESTION        mandatory
SOURCE_LENS     optional
OPEN_CHOICE     mandatory at final AP reflection
```

Reflection claims must be traceable to either:

- an exact user-answer span;
- an approved versioned AP claim;
- an explicitly marked Project Interpretation.

Never infer a hidden motive.

## Primary branch precedence

```text
1 apparent_contradiction
2 mixed
3 insufficient_observation
4 exposure_or_novelty
5 visibility_or_identity
6 concrete_need
```

Branch names are presentation states, not diagnoses.

### `apparent_contradiction`

Use only for explicit answer-level tension. Ask how the two observations fit together. Never call it denial, hypocrisy, rationalization, lying to oneself, or reveal a “true” answer.

### `mixed`

Use when a concrete functional limitation coexists with an explicit non-functional, exposure, visibility, or non-purchase signal. Ask whether more than one thing is being sought. Never treat practical need as an excuse or require a cheaper option.

### `insufficient_observation`

Use when at least three primary fields are `unclear` or no substantive reflection can be made without inference. `unclear` remains valid and must not block empirical comparison.

### `exposure_or_novelty`

Use only when the user explicitly reports desire appearing/intensifying after exposure, or directly identifies novelty as attraction. Optional lens: `MOB-CON-001@1.1`. Never state that exposure caused or conditioned the user’s desire.

### `visibility_or_identity`

Use when the user explicitly reports that private ownership would change the desire. Optional lens: `APF-APP-001@1.1`. Never state status-seeking, validation-seeking, or appropriation as a diagnosis.

### `concrete_need`

Use when the user states a concrete limitation and no stronger branch applies. State only that the user did not identify the other factors; never claim absence of ego/conditioning or AP approval.

## Prohibited behavior

Do not generate or hide-compute:

- ego/greed/selfishness/conditioning/fear/authenticity/planetary-concern scores;
- “deep down” claims;
- “real motive” claims;
- “your ego” diagnoses;
- “AP says you should buy/not buy” prescriptions;
- circular invalidation in which disagreement proves the diagnosis.

A `buy_new` outcome is legitimate and does not mean inquiry failed.

No behavioural experiment is required.

## Approved AP Source Lens allowlist

Initial inquiry:

- `APF-SEE-001@1.2`
- `APF-CON-001@1.1`
- `APF-APP-001@1.1`
- `APF-DES-001@1.1`
- `APF-FEAR-001@1.1`
- `MOB-CON-001@1.1`

Background-only:

- `APF-INC-001@1.1`

Post-evidence only:

- `AP-OTH-001@1.1`
- `AP-PLAN-001@1.1`

The AI reflection engine itself must not claim to be AP’s epistemically necessary external reference. It may surface approved AP text/lenses as external references.

## Evidence-gated otherness inquiry

Activate only after Research & Evidence has displayed at least one evidence-backed consequence extending beyond the user’s immediate circle.

Exact wording:

**Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?**

Optional follow-up:

**What makes you see it that way?**

This wording is a **Project Interpretation**. The “effects” referenced must come from independently supported empirical records.

Do not present “Protect My Four” as a Direct AP claim.

## Licensing boundary

Use narrow paraphrases, claim IDs, provenance, and official source links. Do not reproduce substantial AP Framework text publicly without project-level licensing/legal resolution.

## Required implementation sequence

```text
Situation
→ APQ1_FUNCTION
→ APQ2_EXPECTATION
→ APQ3_ORIGIN
→ APQ4_VISIBILITY
→ APQ5_NONPURCHASE
→ constrained reflection
→ APQ6_RESEE / provisional choice
→ empirical comparison
→ evidence-gated otherness inquiry
→ final user choice
```

The final decision belongs to the user.
