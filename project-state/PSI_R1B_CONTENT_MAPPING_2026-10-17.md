# R1b exact comparison-card content mapping — 2026-10-17

Authority: Owner continuation direction selecting Alternative A in the existing [UX Evidence-to-Design Brief](PSI_UX_EVIDENCE_TO_DESIGN_BRIEF_2026-10-17.md). This is bounded implementation preparation, not new empirical authority or a parallel research workstream.

Baseline: accepted main `83d4e08dba2b29e715886a7a6ce25a8525737929`, including accepted #194/#195. HQ ran the current actual `createComparisonState → reduceComparison → describeComparison` producers in Node on that checkout. Fictional engineering fixtures below are not user observations, defaults or life predictions.

## Source/render inventory and faithful presentation selection

Current `smartphone-comparison.tsx` renders `card.label` as h3, every `card.publicLines` entry as a paragraph, then `SourcesAndLimits(card.sourcesAndLimits)`. Cards already stack; R1b improves their internal hierarchy rather than adding a second column or a new summary. The similarly named SourcesAndLimits helper currently renders an **always-visible section with an h4 and paragraphs, NOT an expandable details control**. Do not convert it to a disclosure, hide it or change the shared helper's treatment of owned-model history.

Map every header/body/source statement exactly once, in the same original reading order. Keep all existing shared result headings, fixed-order note, period statement, boundary/later note and Continue outside the cards as today. Generic cards have a null source section; do not invent provenance rows or move the generic guide into those cards.

Small selected visual treatment:
- One-column equal-status cards at mobile and desktop; existing pathway order, no rank colour/number.
- Distinct h3 header separated from body through whitespace and a neutral border; no new heading text, badge or verdict.
- Body prose uses readable base-size text, comfortable line spacing and a constrained readable width within the existing container. Give the first existing paragraph modest typographic emphasis, with the same rule for every card; do not invent a status from an internal flag.
- Give each existing paragraph exactly matching any `card.values[].line` a restrained neutral inset/border/padding. Render the **whole unchanged paragraph**, including all qualifiers, at normal prose scale. Match by exact equality with existing producer metadata, not regex, numeric extraction, keyword inference, indexes or new capability classification. No standalone enlarged numbers, paired axes, bars or totals. Preserve its original position and text even if not present in values.
- The source section, where supplied, stays after all body paragraphs and stays visible. Use the existing SourcesAndLimits component unchanged. All other body lines remain visible; no truncation, new accordion, tabs, sorting or reordering.
- Missing/incomplete-service lines precede numeric paragraphs in I1, with their original order and normal readable prominence. Do not let the inset values make the card look complete. Existing capability labels remain exact body statements, not new verdicts.

This selection groups by existing producer structure, not a new empirical interpretation. It does not require Research approval for spacing. Any later proposal to condense, reclassify, hide, rewrite or move assertions to optional detail is outside this task and must return to HQ.

## Reproducible fixtures

All three fixtures use this exact context:

```json
{
  "inquiryReviewComplete": true,
  "situationAnswers": {
    "safe_to_use": true,
    "required_functions_met": true,
    "security_support": true
  }
}
```

Start each from `createComparisonState()` and apply its actions below in order. No direct mutation. Unspecified fields remain exactly the existing state defaults.

### G1 — generic new, available component evidence

```json
[
  {
    "type": "toggle",
    "pathwayId": "new"
  },
  {
    "type": "set_horizon",
    "text": "4"
  },
  {
    "type": "set_candidate_new_model",
    "modelId": "generic"
  },
  {
    "type": "set_remaining_service",
    "text": "4"
  }
]
```

Header: `card.label` → **Buy a new phone**, unchanged h3.

| Original body index (1-based) | Exact existing displayed statement | Destination and treatment |
|---|---|---|
| 1 | Expected remaining adequate service without repair is 4 years. | Body paragraph 1; first-paragraph typographic emphasis; always visible |
| 2 | The new-phone model is not known. Approved generic smartphone evidence is used. | Body paragraph 2; ordinary readable body; always visible |
| 3 | A quantified range is available | Body paragraph 3; ordinary readable body; always visible |
| 4 | Production: 25–70 kg CO2e (GWP100). Generic fallback. This bracket is not an average and does not finish the comparison. | Body paragraph 4; whole-paragraph numeric-evidence inset, qualifiers inseparable; always visible |
| 5 | Distribution: 2–4 kg CO2e (GWP100). Generic fallback. This bracket is not an average and does not finish the comparison. | Body paragraph 5; whole-paragraph numeric-evidence inset, qualifiers inseparable; always visible |
| 6 | Earlier manufacture of the phone you already have is left out of any forward-looking keep or repair total. That history does not offset a new phone. | Body paragraph 6; ordinary readable body; always visible |
| 7 | End of life and recycling are not given amounts. | Body paragraph 7; ordinary readable body; always visible |

Source footer: `sourcesAndLimits === null`; no source heading or lines currently render. Keep absent; generic guide, existing source access elsewhere and its accepted boundaries remain unchanged.

Mapping count: 7 body paragraphs; 2 whole-paragraph value matches; 0 visible source paragraphs. Original capability `range_quantitative` remains unchanged producer data.

### I1 — missing remaining service, numeric components still available

```json
[
  {
    "type": "toggle",
    "pathwayId": "new"
  },
  {
    "type": "set_horizon",
    "text": "4"
  },
  {
    "type": "set_candidate_new_model",
    "modelId": "generic"
  }
]
```

Header: `card.label` → **Buy a new phone**, unchanged h3.

| Original body index (1-based) | Exact existing displayed statement | Destination and treatment |
|---|---|---|
| 1 | More information is needed before a new phone can be compared. | Body paragraph 1; first-paragraph typographic emphasis; always visible |
| 2 | How long the current phone can still provide adequate service was not supplied. It was not replaced with a default. | Body paragraph 2; ordinary readable body; always visible |
| 3 | The new-phone model is not known. Approved generic smartphone evidence is used. | Body paragraph 3; ordinary readable body; always visible |
| 4 | More information is needed | Body paragraph 4; ordinary readable body; always visible |
| 5 | Production: 25–70 kg CO2e (GWP100). Generic fallback. This bracket is not an average and does not finish the comparison. | Body paragraph 5; whole-paragraph numeric-evidence inset, qualifiers inseparable; always visible |
| 6 | Distribution: 2–4 kg CO2e (GWP100). Generic fallback. This bracket is not an average and does not finish the comparison. | Body paragraph 6; whole-paragraph numeric-evidence inset, qualifiers inseparable; always visible |
| 7 | Earlier manufacture of the phone you already have is left out of any forward-looking keep or repair total. That history does not offset a new phone. | Body paragraph 7; ordinary readable body; always visible |
| 8 | End of life and recycling are not given amounts. | Body paragraph 8; ordinary readable body; always visible |

Source footer: `sourcesAndLimits === null`; no source heading or lines currently render. Keep absent; generic guide, existing source access elsewhere and its accepted boundaries remain unchanged.

Mapping count: 8 body paragraphs; 2 whole-paragraph value matches; 0 visible source paragraphs. Original capability `insufficient_information` remains unchanged producer data.

### M1 — source-model reference and visible source section

```json
[
  {
    "type": "toggle",
    "pathwayId": "new"
  },
  {
    "type": "set_horizon",
    "text": "4"
  },
  {
    "type": "set_candidate_new_model",
    "modelId": "MS-CLIMATE-FAIRPHONE5-S2-V0"
  },
  {
    "type": "set_remaining_service",
    "text": "4"
  }
]
```

Header: `card.label` → **Buy a new phone**, unchanged h3.

| Original body index (1-based) | Exact existing displayed statement | Destination and treatment |
|---|---|---|
| 1 | Expected remaining adequate service without repair is 4 years. | Body paragraph 1; first-paragraph typographic emphasis; always visible |
| 2 | Candidate new phone: Fairphone 5. Exact model. No additional configuration restriction is recorded. These figures are source-model estimates for that configuration, not a measurement of a physical handset. | Body paragraph 2; ordinary readable body; always visible |
| 3 | A quantified result is available | Body paragraph 3; ordinary readable body; always visible |
| 4 | Production: 32.70 kg CO2e (GWP100). Specific to the stated model. This is a source-reported estimate for the matched configuration, not a measurement of this physical handset. It does not finish the comparison. | Body paragraph 4; whole-paragraph numeric-evidence inset, qualifiers inseparable; always visible |
| 5 | Transport: 2.81 kg CO2e (GWP100). Specific to the stated model. This is a source-reported estimate for the matched configuration, not a measurement of this physical handset. It does not finish the comparison. | Body paragraph 5; whole-paragraph numeric-evidence inset, qualifiers inseparable; always visible |
| 6 | Source whole-life reference: 42.10 kg CO2e (GWP100). It stays separate from the phase values and is not added to this comparison period. | Body paragraph 6; ordinary readable body; always visible |
| 7 | Source use-phase reference: 6.59 kg CO2e (GWP100) over the source 3-year period. That period is not expected service, and this value is not applied to the comparison period. | Body paragraph 7; ordinary readable body; always visible |
| 8 | Source end-of-life reference: 0.041 kg CO2e (GWP100). It is not included in a prospective total. | Body paragraph 8; ordinary readable body; always visible |
| 9 | Earlier manufacture of the phone you already have is left out of any forward-looking keep or repair total. That history does not offset a new phone. | Body paragraph 9; ordinary readable body; always visible |
| 10 | End of life and recycling are not given amounts. | Body paragraph 10; ordinary readable body; always visible |

Source footer heading → **Sources and limits**, unchanged h4 and always visible. No collapse control.

| Source index | Exact existing displayed source statement | Destination |
|---|---|---|
| 1 | Source S2, 2024. Fraunhofer IZM LCA, commissioned by Fairphone B.V.. | Visible source paragraph 1; preserve exact text/order |
| 2 | Manufacturer: Fairphone. Configuration: Exact model. No additional configuration restriction is recorded. | Visible source paragraph 2; preserve exact text/order |
| 3 | Source boundary: cradle-to-grave. | Visible source paragraph 3; preserve exact text/order |
| 4 | Source time assumption: 3 years. That source period is not the comparison period entered here. | Visible source paragraph 4; preserve exact text/order |
| 5 | Source whole-life, use, and end-of-life values remain references outside the comparison period entered here. | Visible source paragraph 5; preserve exact text/order |
| 6 | Production used from this record is a source-reported point. | Visible source paragraph 6; preserve exact text/order |
| 7 | No rounding-uncertainty flag is recorded. The supplied precision is kept, and no confidence rating is added. | Visible source paragraph 7; preserve exact text/order |
| 8 | Accepted package R&E-V0-SMARTPHONE-0.3.0. Package reference 024a95392d2e1555a3c9b598fdc291bd341c3d6b. | Visible source paragraph 8; preserve exact text/order |

Mapping count: 10 body paragraphs; 2 whole-paragraph value matches; 8 visible source paragraphs. Original capability `quantitative` remains unchanged producer data.


## Meaning and data boundaries

G1 has ranges for production/distribution, not a complete common-service footprint; `complete_service_sequence_represented` remains false. Its existing “A quantified range is available” is not permission for a new complete-result summary. I1 has a chosen four-year period but missing remaining service; its evaluator's primary service years remain null, equivalent adequate service unknown and missing field remains `remaining_service.without_repair`. Both retain component evidence and all limitations. M1's source three-year use reference stays separate from the user-selected four-year period, and source whole-life/use/end-of-life references stay outside prospective totals exactly as rendered.

Do not consume `rankingPermitted` or other internal flags to create UI ranks. G1's existing evaluator data permits an internal comparative flag while the public presentation still explicitly does not rank; this visual task preserves both, does not audit/adopt/repair that domain rule. All `values`, `decision`, `evaluatorInputs`, explicit/raw state and unknowns must deep-equal baseline outputs. No new arithmetic, guessed service, source precision adjustment, metric, numerical sum or altered qualifier.

Shared result content (same all three):
- Heading from `COMPARISON_CHROME.resultHeading`: “What can be said so far”.
- Order note: “Selected pathways are shown in a fixed order. That order is not a ranking.”
- Period statement: “The selected comparison period is 4 years for every alternative.”
- Boundary: “This comparison does not tell you what to buy, and it does not rank the pathways.”
- Later note: “Impact and dependency pathways stay later. They are not shown here.”
- Existing Continue label/action, always-available lifecycle guide/model note and both #195 native links remain unchanged.

No new scientific, AP or privacy claim or human-comprehension finding follows from this mapping.

## Validation handoff

Cursor must reproduce G1/I1/M1 on its starting accepted main and compare built candidate output against that same baseline: exact ordered card labels/body/source strings, count and visibility, null source section, unchanged evaluator/state JSON and calculated results. Distinguish normalized render whitespace from actual word/punctuation changes. No additional text or duplicated screen-reader content. Model source section remains expanded. Include keep/repair/used/refurbished/multi-selection, explicit not-sure, invalid/missing period and keep-only regression coverage using existing fixtures where appropriate; no new semantic fixtures or source-package edits.

At ~390 and ~1280 capture matching meaningful result frames for G1 and I1 and at least M1 source section; check ~320/reflow/200% zoom, wrapping of longest qualification and source identifiers, keyboard Tab/Shift+Tab/Enter, source links if present, native lifecycle links and Continue/Back/reset. No clipped text, obscured focus introduced, new tab stops on static prose, horizontal overflow or page/console errors. Preserve focus, state and #195 source order. Targeted existing comparison/lifecycle/model/fate tests plus narrow presentation checks; routine pinned CI handles full install/lock/test/lint/typecheck/build. No whole-site conformance, human understanding or public deployment identity claim.

## R2 serial dependency and preparation

Owner authorizes narrowly defined R2 **after R1b acceptance**. Current source still shows period helper without aria-describedby; Edit-answer focus and long-step smooth-scroll observations are documented in the brief/#182. Reproduce at the next accepted build; do not silently fix them in R1b. R2 should distinguish helper association, useful focus restoration, and measured transition behaviour; preserve browser Back/edit/reset, raw answers, conditional gates and reduced-motion support. No global scroll disabling or AP wording changes. Owner has manually confirmed Claude Sonnet 5.5 Medium for both R1b and R2; High/other model changes require fresh Owner confirmation. No second model question or premature R2 wake.
