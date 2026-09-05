# AP-CORPUS-V0.3.0

Status: **Frozen V0 philosophical acceptance baseline**  
Workstream: **AP Framework & Corpus**  
Frozen: **2026-09-03**  
Published to canonical repository: **2026-09-05**

## 1. Scope

This corpus is the approved AP-grounded philosophical baseline for V0 smartphone replacement inquiry.

It does not attempt to represent all of Acharya Prashant’s teaching. It contains only claims accepted for this V0 use case and the provenance/version rules needed to stop later source edits from silently changing historical interpretations.

## 2. Core separation

Keep distinct:

1. **Direct AP claim** — explicitly supported by an approved official AP source.
2. **Project Interpretation** — Planetary Self-Inquiry’s reasoned application of AP.
3. **Empirical claim** — a proposition about the external world requiring Research & Evidence support.

Internally use two dimensions where useful:

```text
attribution_status = direct_ap | project_interpretation
evidence_domain = philosophical | empirical | mixed
```

A statement can be a Direct AP attribution while still containing an empirical assertion whose truth must be independently checked.

## 3. Provenance grades

- `P1` — official canonical/framework text.
- `P2` — verified official AP original video/audio with identifiable session metadata.
- `P3` — official AP transcript explicitly attributed to AP sessions.
- `P4` — official AP description/editorial metadata.
- `P5` — secondary/non-AP source; discovery only, not authoritative attribution.

AI-generated summaries on official AP pages are **discovery metadata only** and must never support a Direct AP claim.

## 4. Frozen claim registry

### `APF-SEE-001@1.2`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved  
**V0 use:** Source Lens / architecture

Approved paraphrase:

> The AP Framework distinguishes seeing from thinking about oneself. Seeing is direct observation prior to interpretation and self-protective narrative; it is necessary but not sufficient for change. The Framework states that genuine change requires Seeing + Intent.

Source:

- Title: **The AP Framework**
- Source class: `P1`
- URL: https://acharyaprashant.org/en/ap-framework
- Copyright shown by source: © 2026 PrashantAdvait Foundation
- Retrieval baseline: 2026-09-03

Scope limit:

The Framework says an external reference such as a teacher, text, or tradition is epistemically necessary because the ego cannot reliably assess its own movement. V0 may surface approved AP material as an external reference. The AI reflection engine itself must **not** claim the epistemic status assigned by AP to teacher/text/tradition.

---

### `APF-CON-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved  
**V0 use:** optional exposure/conditioning Source Lens

Approved paraphrase:

> The Framework defines conditioning as socially instilled beliefs, preferences, habits and reactions that the ego absorbs and can mistake for its own nature.

Source:

- **The AP Framework**
- `P1`
- https://acharyaprashant.org/en/ap-framework
- retrieved 2026-09-03

Scope limit: the definition does not establish that a particular user’s phone desire is conditioned.

---

### `APF-APP-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved  
**V0 use:** optional identity/visibility Source Lens

Approved paraphrase:

> The Framework calls appropriation the ego’s reaching into the world, claiming external material as identity, and installing it as “me.”

Source:

- **The AP Framework**
- `P1`
- https://acharyaprashant.org/en/ap-framework
- retrieved 2026-09-03

Scope limit:

- Direct AP: external material can be appropriated into identity.
- Project Interpretation: a smartphone may be such material.
- User observation: whether this particular phone functions that way.

---

### `APF-DES-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved  
**V0 use:** background basis for APQ2

Approved paraphrase:

> The Framework describes desire as the ego reaching toward objects through acquisition, possession or experience for imagined completion.

Source:

- **The AP Framework**
- `P1`
- https://acharyaprashant.org/en/ap-framework
- retrieved 2026-09-03

Scope limit: V0 must not tell an individual user that they are trying to complete themselves through a phone merely because they want one.

---

### `APF-FEAR-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved  
**V0 use:** background basis for APQ5

Approved paraphrase:

> The Framework describes fear as desire’s structural twin: when the ego wants X, it fears X’s absence or loss.

Source:

- **The AP Framework**
- `P1`
- https://acharyaprashant.org/en/ap-framework
- retrieved 2026-09-03

Scope limit: the Framework also distinguishes fear from practical caution. V0 must not relabel every practical concern about keeping an old phone as fear.

---

### `APF-INC-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved, **background-only for V0**

Approved paraphrase:

> The Framework treats incompleteness as fundamental to the ego and presents desire and fear as arising from that condition.

Source:

- **The AP Framework**
- `P1`
- https://acharyaprashant.org/en/ap-framework
- retrieved 2026-09-03

Reason for background-only status: surfacing this strongly during a phone decision can pre-structure the user’s answer rather than help the user observe their own movement.

---

### `MOB-CON-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical/application example  
**Status:** approved  
**V0 use:** strongest smartphone-specific Source Lens

Approved paraphrase:

> AP explicitly uses repeated exposure to advertising for a new mobile phone as an example and asks listeners to investigate where the resulting desire came from.

Primary official record:

- Title: **Decoding desires || Acharya Prashant, archives (2014)**
- Source class: `P2` official AP archive record
- Session year: **2014**
- Exact session date: **unknown**
- Official record URL: https://acharyaprashant.org/on-youtube/cb08d24

Official transcript:

- Title: **Decoding desires**
- Source class: `P3`
- URL: https://acharyaprashant.org/en/articles/the-illusion-of-desire-understanding-true-individuality-1_1cd9811
- Page states it was created by PrashantAdvait Foundation volunteers from transcriptions of AP sessions.
- Retrieval baseline: 2026-09-03

Scope limit: the example licenses inquiry into chronology and conditioning. It does not prove that exposure caused a particular user’s desire.

---

### `AP-OTH-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved claim; exact primary-video lineage unresolved  
**V0 use:** post-evidence only

Approved paraphrase:

> AP links otherness to drawing a boundary around oneself such that what lies beyond it is treated as separate from one’s own interests, and develops this separation in relation to violence.

Official transcript:

- Title: **When Peace Looks Like War**
- Source class: `P3`
- URL: https://acharyaprashant.org/en/articles/peace-looks-like-war-1_ddeebcc
- Retrieval baseline: 2026-09-03

Important provenance rule: the page’s AI-generated summary is excluded from claim support; only the transcript supports the claim.

---

### `AP-PLAN-001@1.1`

**Type:** Direct AP claim  
**Evidence domain:** philosophical  
**Status:** approved, high provenance  
**V0 use:** post-evidence otherness/circle-of-concern basis

Approved paraphrase:

> AP explicitly questions the assumed opposition between one’s own interests and those treated as “others,” including other people, endangered species, ecosystems and river systems.

Primary official recording:

- Video title: **Desire vs Duty: How to choose? || Acharya Prashant, BITS Pilani, Dubai Tour (2025)**
- Source class: `P2`, verified official Acharya Prashant channel
- Session date: **2025-04-09**
- Session location: **BITS Pilani, Dubai**
- Video publication date: **2025-06-27**
- Video URL: https://www.youtube.com/watch?v=ZVEwREWFOW4

Official transcript:

- Title: **Duty vs Desire: How to Choose or Balance?**
- Source class: `P3`
- URL: https://acharyaprashant.org/en/articles/how-to-choose-balance-1_f174f53
- Retrieval baseline: 2026-09-03

The transcript directly begins from a question contrasting personal/immediate-family interests with broader responsibility and explicitly extends “others” to species and ecosystems.

Scope limit: AP’s stronger philosophical claims about self/world interests do not become empirical proof about smartphone causal pathways. Research & Evidence owns those pathways.

## 5. V0 allowlist

Initial six-question subsystem may use only:

```text
APF-SEE-001@1.2
APF-CON-001@1.1
APF-APP-001@1.1
APF-DES-001@1.1
APF-FEAR-001@1.1
MOB-CON-001@1.1
```

Background-only:

```text
APF-INC-001@1.1
```

Post-evidence only:

```text
AP-OTH-001@1.1
AP-PLAN-001@1.1
```

No other AP proposition may silently enter V0 without a new corpus version.

## 6. Important V0 philosophical safeguard

The external act **“buy phone” is insufficient to classify the user’s inner movement**.

V0 therefore must not implement a rule such as:

```text
functioning_phone + buy_new => egoic / wrong
```

The inquiry examines what the user can observe about the centre, desire, conditioning, identity, fear/caution, and consequences while leaving keep, repair, used/refurbished, new, investigate-further, and unclear open.

## 7. Immutable source and claim versioning

### Source snapshot

```text
source_snapshot {
  source_id
  canonical_url
  source_class
  source_title
  author_attribution
  session_date
  publication_date
  retrieved_at
  content_fingerprint
  snapshot_version
}
```

`content_fingerprint` should be derived from claim-relevant source text, not unstable page chrome such as read counters, recommendations, navigation, or AI summaries.

### Claim support

```text
claim_support {
  claim_id
  claim_version
  source_snapshot_id
  support_locator
  support_text_internal
  approved_paraphrase
  attribution_status
  evidence_domain
  reviewer_status
}
```

Internal support text is for provenance/audit and remains subject to licensing constraints. Public V0 should prefer narrow paraphrase plus source link rather than substantial source reproduction.

### Claim immutability

Never silently rewrite an existing claim version.

If support or interpretation materially changes, create a new version, for example:

```text
MOB-CON-001@1.2
supersedes: MOB-CON-001@1.1
change_reason: source_changed | interpretation_narrowed |
               provenance_upgraded | correction
```

Historical user sessions must store at least:

```text
claim_id
claim_version
corpus_version
```

so future corpus updates cannot retroactively change the philosophical basis of old reflections.

## 8. Source-change classification

### `NO_SEMANTIC_CHANGE`

Examples: punctuation, formatting, read counts, navigation, image changes, AI-summary edits while transcript support is unchanged.

Action: new source snapshot; claim version unchanged.

### `TRANSCRIPT_EDITORIAL_CHANGE`

Same proposition, editorial wording changed.

Action: new source snapshot; review affected claim; normally retain claim version and update support location.

### `CLAIM_RELEVANT_CHANGE`

Claim-supporting material added, removed, or materially altered.

Action: preserve old claim, require review, then retain/narrow/strengthen/supersede/withdraw future use as appropriate.

### `PRIMARY_SOURCE_UPGRADE`

Better authoritative provenance becomes available without philosophical change.

Action: new claim version with `change_reason = provenance_upgraded` when the provenance improvement matters downstream.

### `SOURCE_CONFLICT`

Later AP material appears to contradict or qualify an earlier claim.

Action: preserve chronology; use `qualified_by` or a superseding claim. Never erase the historical source.

## 9. AI-summary quarantine

An AI-generated summary on an official AP page is not Direct AP evidence.

```text
AI-generated summary = discovery_metadata
AI-generated summary != claim_support
```

Where the same page includes a transcript, only the transcript may support Direct AP attribution.

## 10. Licensing boundary

The official AP Framework page states that the document is for personal, non-commercial study and restricts copying, reproduction, modification, publication, redistribution, and public/commercial display without prior written permission.

Accordingly:

- this corpus stores narrow project-authored paraphrases and provenance;
- V0 should link to official sources rather than reproduce substantial Framework prose;
- this corpus does not decide whether broader intended use legally requires permission;
- future public display of substantial Framework text requires project-level licensing/legal resolution.

## 11. Protect My Four classification

The proposition that protecting the people closest to oneself requires protecting the wider planet is **not stored as a Direct AP claim**.

Approved status:

- AP provides philosophical support for questioning the self/other division: `AP-OTH-001@1.1`, `AP-PLAN-001@1.1`.
- The project’s “Protect My Four” framing remains a **Project Interpretation**.
- Any claim about concrete consequences connecting a smartphone option to people/ecosystems/climate is an empirical dependency owned by Research & Evidence.

## 12. Maintenance rule

`AP-CORPUS-V0.3.0` is frozen for the smartphone V0 baseline.

Do not expand V0 philosophy merely because additional AP material exists. Create a later corpus version only for:

- a genuine provenance correction;
- a stronger primary-source upgrade;
- a material official-source change;
- a V0 implementation ambiguity requiring philosophical clarification;
- or an explicit HQ-approved broader scope.
