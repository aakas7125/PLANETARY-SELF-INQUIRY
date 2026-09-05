# AP-V0-INTERACTION-0.2.0

Status: **Authoritative specialist source package**  
Workstream: **AP Framework & Corpus**  
Issued: **2026-09-03**  
Published to canonical repository: **2026-09-05**  
Corpus baseline: **AP-CORPUS-V0.3.0**

## Purpose

Implementation contract for the V0 case: **“I have a functioning smartphone but want to replace it with a newer one.”**

This package lets V0 implement AP-grounded self-inquiry without inventing Acharya Prashant doctrine, diagnosing motives, scoring psychology, or using AP attribution as scientific evidence.

## 1. Mandatory category separation

Every philosophical record used by V0 must distinguish:

- `attribution_status = direct_ap | project_interpretation`
- `evidence_domain = philosophical | empirical | mixed`

Rules:

1. A **Direct AP claim** is a proposition explicitly supported by an approved official AP source.
2. A **Project Interpretation** is Planetary Self-Inquiry’s application of AP to the smartphone decision.
3. An empirical proposition remains an **empirical claim** even if AP also stated it; scientific truth does not inherit authority from AP attribution.
4. Never transform `AP said X` into `science establishes X`.

## 2. Exact six-question sequence

These strings are approved V0 wording. Changes that insert or remove philosophical meaning require a new AP package/version.

### `APQ1_FUNCTION`

**What would the new phone let you do that your current phone cannot do adequately?**

Purpose: establish the user’s own practical case before interrogating desire.  
Classification: **Project Interpretation**.

### `APQ2_EXPECTATION`

**Imagine you already have the new phone. Besides what it can technically do, what do you expect to be different for you?**

Purpose: make anticipated non-functional change observable without telling the user that they are seeking “completion.”  
Basis: `APF-DES-001@1.1`.  
Classification: **Project Interpretation**.

### `APQ3_ORIGIN`

**When did you first begin seriously wanting this phone or an upgrade? What were you seeing, hearing or comparing around that time? Was the desire already this strong before that?**

Purpose: expose chronology rather than infer conditioning.  
Basis: `MOB-CON-001@1.1`.  
Classification: **Project Interpretation closely operationalizing a Direct AP example**.

### `APQ4_VISIBILITY`

**Would wanting this phone change if nobody else ever knew which phone you owned? Why or why not?**

Purpose: test whether visibility has significance without presuming status-seeking.  
Basis: `APF-APP-001@1.1`.  
Classification: **Project Interpretation**.

### `APQ5_NONPURCHASE`

**Imagine deciding today to keep your current phone for another year. What, if anything, feels difficult about that?**

Optional neutral follow-up:

**Is that difficulty mainly practical, or is something else involved too?**

Purpose: expose the experience associated with absence/non-acquisition without calling it “fear.”  
Basis: `APF-FEAR-001@1.1`.  
Classification: **Project Interpretation**.

### `APQ6_RESEE`

**Reading your own answers together, does anything about the desire look different now? What seems appropriate now?**

Approved provisional choices:

- `keep_current`
- `repair_current`
- `consider_used_or_refurbished`
- `buy_new`
- `investigate_further`
- `unclear`

V0 must not pre-rank these choices philosophically.  
Basis: `APF-SEE-001@1.2`.  
Classification: **Project Interpretation**.

## 3. Raw-answer and observation schema

Raw answers are authoritative. Derived observations are subordinate annotations.

```text
ap_answer_record {
  interaction_version
  question_id
  question_version
  exact_question_text
  exact_user_answer
  derived_observations[]
}

derived_observation {
  observation_id
  observation_type
  value
  supporting_answer_question_id
  supporting_exact_span
  derivation_status
}
```

Allowed:

```text
derivation_status = explicit | unclear
```

Do not introduce motive-level states such as `inferred`, `probable`, `likely_motive`, or psychological confidence scores.

### Q1

```text
functional_limitation =
  concrete_limitation_stated |
  no_specific_limitation_stated |
  unclear
```

Optional literal field: `functional_limitation_text`.

### Q2

```text
anticipated_change =
  nonfunctional_change_stated |
  functional_change_only_stated |
  no_change_beyond_function_stated |
  unclear
```

Keep the user’s own wording. Do not normalize “fun,” “excitement,” “confidence,” etc. into ego, incompleteness, or validation.

### Q3

```text
exposure_chronology =
  desire_predated_exposure |
  desire_appeared_after_exposure |
  desire_intensified_after_exposure |
  exposure_helped_select_product |
  no_relevant_exposure_identified |
  unclear
```

Chronology is not causality. `desire_intensified_after_exposure` must not become `exposure_caused_desire` or `conditioned_desire = true`.

### Q4

```text
visibility_response =
  unchanged |
  somewhat_weaker |
  substantially_weaker |
  stronger |
  unclear
```

Also preserve `visibility_meaning_text` from the user’s explanation. Do not derive status-seeking, vanity, or an identity problem.

### Q5

```text
nonpurchase_difficulty =
  practical_only_stated |
  nonpractical_element_stated |
  mixed_stated |
  no_significant_difficulty_stated |
  unclear
```

Do not automatically rename a non-practical element as fear.

### Q6

```text
self_reported_shift = changed | unchanged | uncertain | unclear

provisional_choice =
  keep_current |
  repair_current |
  consider_used_or_refurbished |
  buy_new |
  investigate_further |
  unclear
```

A choice of `buy_new` does not mean inquiry failed.

## 4. `unclear` handling

`unclear` is a valid terminal observation state.

Use it when:

- the user says “I don’t know” or equivalent;
- the answer does not resolve the requested distinction;
- extraction would require guessing;
- the answer supports mutually exclusive enum values without resolving them;
- no exact supporting span can be identified.

V0 must not use AP theory to fill an unclear answer.

Allowed reflection: **“You weren’t sure what is operating here. That can remain unclear.”**

No behavioural experiment is required. In particular, do not require stopping reviews, advertisements, social media, shopping, or product research for any period.

## 5. Constrained reflection grammar

A reflection may contain only these operations:

```text
1. RESTATEMENT     mandatory
2. JUXTAPOSITION   optional
3. QUESTION        mandatory
4. SOURCE_LENS     optional
5. OPEN_CHOICE     mandatory at final AP reflection
```

### `RESTATEMENT`

Template: **“You said [faithful paraphrase of supported answer].”**

Every substantive assertion must map to an exact answer span.

### `JUXTAPOSITION`

Templates:

- **“You also said/noticed [second supported observation].”**
- **“You described X, and you also described Y.”**

Do not add causal connectors such as “therefore,” “thus,” “which proves,” “which shows that you really,” “because deep down,” or “so your true motive is,” unless repeating causality explicitly asserted by the user.

### `QUESTION`

Approved generic forms:

- **“What do you make of that?”**
- **“How do those observations fit together for you?”**
- **“Is there more than one thing being sought here?”** — mixed branch only.

### `SOURCE_LENS`

Optional; never lead with it.

Template:

**“AP lens: [approved source-lens paraphrase]. Do you see anything resembling that in your own answer?”**

A Source Lens offers a concept; it never assigns the concept to the user.

### `OPEN_CHOICE`

At the final reflection:

**“Having seen your answers together, what now seems appropriate?”**

Then show the approved Q6 choices.

## 6. Deterministic branch rules

Branch names are internal presentation states, not diagnoses. Compute all flags first.

Primary-branch precedence:

```text
1. apparent_contradiction
2. mixed
3. insufficient_observation
4. exposure_or_novelty
5. visibility_or_identity
6. concrete_need
```

A lower-priority observation may still appear in a juxtaposition but does not replace the primary branch.

### Branch `concrete_need`

Trigger:

- `functional_limitation = concrete_limitation_stated`
- no explicit non-functional signal sufficient for mixed, exposure/novelty, visibility/identity, or contradiction
- insufficient observation is false.

May say:

**“You identified [limitation] as something your current phone does not do adequately. In your other answers you did not identify much additional attraction around visibility, outside exposure, or non-functional change. Does replacing the device still seem appropriate for the limitation you described?”**

Must not say the purchase is non-egoic, that the user genuinely needs it, that there is no conditioning, or that AP approves the purchase. The permitted claim is only that the user has not identified those additional factors.

### Branch `exposure_or_novelty`

Trigger:

- `exposure_chronology = desire_appeared_after_exposure | desire_intensified_after_exposure`, or the user explicitly describes novelty/newness as an attraction;
- `mixed = false`.

May say:

**“You said the desire [appeared/intensified] around [user-stated exposure]. You also described [user-stated attraction, if any]. What do you make of that sequence?”**

Optional Source Lens: `MOB-CON-001@1.1`.

Must not say exposure caused the desire, advertising manipulated this user, the desire is conditioned, or the desire is “not really theirs.”

### Branch `visibility_or_identity`

Trigger:

- `visibility_response = somewhat_weaker | substantially_weaker | stronger`
- `mixed = false`.

May say:

**“You noticed that whether other people know which phone you own changes some of its appeal. What does the phone represent to you beyond its functions?”**

Optional Source Lens: `APF-APP-001@1.1`.

Must not say the user wants status, seeks validation, depends on the phone for identity, or that this is appropriation.

### Branch `mixed`

Trigger:

- `functional_limitation = concrete_limitation_stated`
- and at least one explicit non-functional/exposure/visibility/non-purchase signal:
  - `anticipated_change = nonfunctional_change_stated`, or
  - `exposure_chronology = desire_appeared_after_exposure | desire_intensified_after_exposure`, or
  - `visibility_response = somewhat_weaker | substantially_weaker | stronger`, or
  - `nonpurchase_difficulty = nonpractical_element_stated | mixed_stated`.

May say:

**“You described [practical limitation]. You also described [non-functional/exposure/visibility observation]. Do those have to be answered by the same decision?”**

or

**“Is there more than one thing being sought here?”**

Must not say the practical need is an excuse, that one motive is real and another false, that mixed motives invalidate purchase, or that the user must select a cheaper product.

### Branch `apparent_contradiction`

This means answer-level tension, not psychological inconsistency.

Trigger only explicit conflicts, for example:

- Q2 says the choice is entirely functional, while Q4 says the desire would become substantially weaker if ownership were private; or
- an equivalent directly conflicting pair in the user’s own statements.

Do not trigger merely because two motives coexist; that is `mixed`.

May say:

**“You described X, and you also said Y. How do those two observations fit together for you?”**

Must not say rationalization, denial, hypocrisy, lying to oneself, hidden motive, or that one answer is the true one.

### Branch `insufficient_observation`

Trigger when three or more of the following are `unclear`, or when no substantive reflection can be produced without inference:

- `functional_limitation`
- `anticipated_change`
- `exposure_chronology`
- `visibility_response`
- `nonpurchase_difficulty`

May say:

**“Some of these questions do not yet have clear answers for you. You do not need to manufacture them. Reading what you do know, is there anything you want to look at again before deciding?”**

Must not infer missing motives, default into another branch, require more introspection, require a behavioural experiment, or block the user from empirical comparison.

## 7. Universal prohibitions

Never generate or hide-compute motive scores such as:

- ego score
- greed score
- selfishness score
- conditioning score
- fear score
- authenticity score
- planetary-concern score.

Never say or imply:

- “Deep down…”
- “The real reason…”
- “Your ego is…”
- “AP says you should buy/not buy…”
- “If you truly cared…”
- “Your denial proves…”
- “You are rationalizing…”
- “This purchase is selfish/egoic.”

Never treat rejection of an AP interpretation as evidence that the interpretation is correct.

## 8. Exact-answer traceability

Every reflection segment must be traceable:

```text
reflection_segment {
  rendered_text
  basis_type: user_answer | direct_ap | project_interpretation
  basis_ids[]
}
```

For `basis_type = user_answer`, basis IDs must resolve to `question_id` and `supporting_exact_span`.

For `basis_type = direct_ap`, basis IDs must resolve to an approved versioned claim in `AP-CORPUS-V0.3.0`.

The complete raw answer must remain preserved even when a shortened paraphrase is displayed. Derived observations never overwrite raw answers.

## 9. Approved Source Lens allowlist

Initial six-question subsystem:

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

No other AP proposition may silently enter V0 without a new corpus version.

### External-reference correction

The Framework says the ego needs an external reference and gives examples such as a teacher, text, or tradition. V0 may surface approved AP source material as an external reference. The **AI reflection engine itself must not claim to be the epistemically necessary external reference described by AP**.

## 10. Smallest licensing-safe otherness inquiry

This step occurs **only after** the empirical comparison has displayed at least one evidence-backed consequence extending outside the user’s immediate circle.

Exact wording:

**Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?**

Optional follow-up:

**What makes you see it that way?**

Classification:

- `attribution_status = project_interpretation`
- `evidence_domain = mixed`

The question structure is a Project Interpretation grounded in `AP-OTH-001@1.1` and `AP-PLAN-001@1.1`. The phrase “effects of this choice” may refer only to consequences already established by Research & Evidence.

Must not render:

- “AP says protecting your family requires protecting the whole planet.”
- “If you really love your four people, you must protect everyone.”

“Protect My Four” remains a **Project Interpretation**, not a Direct AP claim.

## 11. Licensing constraint

The official AP Framework page states that it is available for personal, non-commercial study and restricts copying, modification, publication, redistribution, and public/commercial display without prior written permission.

Therefore V0 may use:

- narrow project-authored paraphrases;
- claim IDs and provenance;
- source links;
- the project-authored inquiry wording in this package.

This package does **not** authorize copying substantial AP Framework prose into a public product.

## 12. Implementation flow

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

## 13. Status

Approved for V0 implementation:

- six exact questions;
- answer/observation schema;
- `unclear` semantics;
- deterministic branch precedence and rules;
- reflection grammar;
- exact-answer traceability;
- universal prohibitions;
- versioned Source Lens allowlist;
- licensing-safe post-evidence otherness wording.

Unsupported/prohibited:

- motive scoring;
- inferred greed/selfishness/conditioning;
- compulsory anti-purchase outcome;
- behavioural experiments as a requirement;
- “Protect My Four” as a Direct AP quotation or Direct AP claim.
