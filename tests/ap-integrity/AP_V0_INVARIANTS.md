# AP V0 Integrity Invariants

Version pins:

- Interaction: `AP-V0-INTERACTION-0.2.0`
- Corpus: `AP-CORPUS-V0.3.0`

These are deterministic acceptance invariants for any V0 implementation of the AP inquiry.

## INV-AP-01 — exact question order

The six questions must remain ordered:

1. `APQ1_FUNCTION`
2. `APQ2_EXPECTATION`
3. `APQ3_ORIGIN`
4. `APQ4_VISIBILITY`
5. `APQ5_NONPURCHASE`
6. `APQ6_RESEE`

Question wording must not insert presumed motives.

## INV-AP-02 — raw answer authority

Every derived observation must retain the exact originating user answer and an exact supporting span. Derived observations must never overwrite raw answers.

## INV-AP-03 — unclear is valid

If extraction requires guessing or no exact span supports an observation, use `unclear`. `unclear` must remain a valid terminal state and must not be auto-filled from AP theory.

## INV-AP-04 — no motive scoring

No visible or hidden ego, greed, selfishness, conditioning, fear, authenticity, or planetary-concern score may be calculated from the AP interaction.

## INV-AP-05 — chronology is not causality

A user saying desire appeared or intensified after product exposure may trigger the exposure branch, but must not be transformed into a claim that advertising caused or conditioned that user’s desire.

## INV-AP-06 — visibility is not diagnosis

A changed desire under private ownership may trigger the visibility/identity branch but must not be transformed into status-seeking, validation-seeking, vanity, appropriation, or identity dependence as a diagnosed state.

## INV-AP-07 — practical concern is not automatically fear

A user’s difficulty with keeping an old phone may remain practical. Do not relabel every non-purchase concern as fear.

## INV-AP-08 — branch precedence

If several branch signals coexist, primary precedence is:

```text
apparent_contradiction
mixed
insufficient_observation
exposure_or_novelty
visibility_or_identity
concrete_need
```

Branch names are presentation states, not psychological classes.

## INV-AP-09 — contradiction prompts inquiry

Answer-level tension must generate a question such as “How do those observations fit together for you?” It must not generate rationalization, denial, hypocrisy, lying, hidden-motive, or “true answer” claims.

## INV-AP-10 — mixed motives remain legitimate

A concrete practical limitation may coexist with novelty, exposure, visibility, or another attraction. Mixed motives must not invalidate replacement or force a cheaper product.

## INV-AP-11 — concrete-need branch is limited

If the user reports a concrete limitation and no stronger branch applies, the reflection may state only that the user did not identify certain additional factors. It must not conclude “non-egoic,” “genuine need,” “no conditioning,” or AP approval.

## INV-AP-12 — buy-new remains legitimate

`buy_new` is a valid provisional and final choice. Selecting it must not be treated as a failed inquiry.

## INV-AP-13 — reflection grammar

Generated AP reflection must use only:

```text
RESTATEMENT
optional JUXTAPOSITION
QUESTION
optional SOURCE_LENS
final OPEN_CHOICE
```

Every substantive reflection assertion must be traceable to an exact user span, a versioned approved AP claim, or an explicitly marked Project Interpretation.

## INV-AP-14 — Source Lens allowlist

Initial inquiry may use only:

- `APF-SEE-001@1.2`
- `APF-CON-001@1.1`
- `APF-APP-001@1.1`
- `APF-DES-001@1.1`
- `APF-FEAR-001@1.1`
- `MOB-CON-001@1.1`

`APF-INC-001@1.1` is background-only.

`AP-OTH-001@1.1` and `AP-PLAN-001@1.1` are post-evidence only.

## INV-AP-15 — AI is not AP’s external-reference authority

The implementation may surface approved AP source material as an external reference. The AI reflection engine itself must not claim to be the epistemically necessary teacher/text/tradition described by the AP Framework.

## INV-AP-16 — no behavioural experiment required

The AP subsystem must not require a user to stop reviews, ads, social media, shopping, or product research for any duration before proceeding.

## INV-AP-17 — otherness is evidence-gated

The otherness question must not activate until at least one independently supported empirical consequence extending beyond the user’s immediate circle has been displayed.

The exact approved wording is:

**Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?**

Optional follow-up:

**What makes you see it that way?**

The effects referenced must come from Research & Evidence, not from AP attribution.

## INV-AP-18 — Protect My Four classification

“Protect My Four” is Project Interpretation, not a Direct AP claim. The UI must not attribute the project phrase or its exact proposition to Acharya Prashant.

## INV-AP-19 — licensing-safe display

Public V0 should use narrow project-authored paraphrases and official source links. It must not reproduce substantial AP Framework text without project-level licensing/legal resolution.

## INV-AP-20 — historical provenance pin

Whenever a Source Lens is used, preserve:

```text
claim_id
claim_version
corpus_version
```

A later corpus update must not silently change the philosophical basis of an already-recorded reflection.
