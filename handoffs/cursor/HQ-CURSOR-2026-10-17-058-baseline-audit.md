# HQ-CURSOR-2026-10-17-058: current-baseline audit (internal, HQ only)

Internal HQ report. It is separate from the participant-facing kit (`HQ-CURSOR-2026-10-17-058-human-review-kit.md`) and must not be shown to participants.

Task `HQ-CURSOR-2026-10-17-058`, Issue #182, cycle `INITIAL-1`. No app, source, contract, registry, corpus, package, lock, or dependency file was changed. Every proposal below is a proposal. None is accepted, and none authorizes implementation.

## 0. Evidence classes and limits

| Class | Meaning here |
| --- | --- |
| SOURCE | Read in the repository at the tree below. |
| BUILT | Observed by driving the built public profile with a synthetic fixture in headless Chrome. Not a person's experience. |
| FEEDBACK | Real human feedback. **None exists in this report.** No participant was recruited, contacted, or recorded. |

- This report makes no human-comprehension claim. A BUILT observation shows what the page did. It does not show what anyone understood.
- Reviewer B's feedback (#180) is background only. It has not been used as an expected answer, and nothing below says Reviewer B was right or wrong.
- Not run: `npm test`, lint, typecheck, Docker, hosted-app checks, or a full regression replay. Routine regression belongs to CI.
- The fixture walks used English only, one browser, and one machine. Real devices, touch scrolling, screen readers, zoom, and system font scaling were not exercised.
- All typed values were synthetic text such as `a`, `Fixture answer one.`, and numbers.

## 1. Build and run provenance

| Item | Record |
| --- | --- |
| Starting accepted main | `00f68fe41092280cc9e4044023b47de897354873` |
| Task branch head used for the build | `c060e6a7c68b883ffb84fd78f7c6f9dd0bcfeaef` (starting main plus the lease file). `git diff origin/main -- app` is empty, so the `app/` tree is the starting main tree. |
| Toolchain | Node `v22.14.0`; `npm install` via `corepack npm@11.19.0`; npm on PATH `10.9.9`; TypeScript `5.9.3` |
| Install | `corepack npm@11.19.0 ci --ignore-scripts`, exit 0 |
| Lock SHA-256 | `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`, unchanged |
| Build | `npm run build` (from `app/`), exit 0, no warning or error lines in the log |
| Profile graph | `node scripts/public-beta-profile-graph.mjs`, exit 0: 57 files scanned, 18 prohibited patterns, `"result": "clear"` |
| Server | `HOST=127.0.0.1 PORT=8081 npm run start` |
| Browser | Headless Google Chrome `154.0.8037.92` through Playwright |
| Viewports | 390×844 and 1280×800 |
| Motion | Default motion, and `prefers-reduced-motion: reduce` for the 390 walk |
| Visible version | The pages do not expose a Git SHA. Build identity is the tree above. No hosted deployment was checked or matched to a SHA. |
| Overflow | `scrollWidth` equalled `clientWidth` (390/390 and 1280/1280) on entry, situation status, inquiry Q1, review, comparison empty, comparison with five pathways, impact, reflection, otherness, and user choice. |
| Errors | 0 page errors, 0 console errors, 0 HTTP failures on every walk below. |

`app/.output/` is a local build artifact and was not committed.

## 2. Navigation, scroll, and focus (reproduction of the B-03 area)

### 2.1 What the source does (SOURCE)

- Each step is a separate mounted component. Only the active step is in the document (`app/src/components/smartphone-situation.tsx`, the `step` branches).
- On mount (or when the question index or phase changes), the step focuses a heading with `tabIndex={-1}` and calls `scrollIntoView({ block: "nearest" })`. The effect lines are `smartphone-inquiry.tsx:35-38`, `smartphone-comparison.tsx:59-62`, `smartphone-impact.tsx:27-30`, `smartphone-system-participation.tsx:25-28`, `smartphone-otherness.tsx:23-26`, and `smartphone-final-choice.tsx:27-30`. The situation step calls `scrollIntoView` on the status result (`smartphone-situation.tsx:255-258`) and on focused form controls (`smartphone-situation.tsx:~430-437`).
- The heading carries `scroll-mt-32` (128 px). The sticky `header` is `sticky top-0 z-40` (`site-nav.tsx:24-26`).
- `app/src/styles.css:37-41` sets `html { scroll-behavior: smooth; }`. `styles.css:83-86` resets it to `auto` under `prefers-reduced-motion: reduce`.

### 2.2 Built transitions (BUILT)

Each row clicks the control after bringing it into view, then waits about 2.2 s and samples every animation frame. "Settle" is the time of the last scroll movement. A settle of about 40 ms means one instant jump (the browser clamping the scroll position when the page shrinks). A settle of 500 ms or more means an animated scroll. "Focus top vs header" is the focused heading's top edge minus the sticky header's bottom edge (a positive number is visible below the header).

Sticky header height: 113 px at 390 (13.4% of the 844 px viewport) and 65 px at 1280 (8.1% of 800).

| # | Transition | 390 default: scrollY before → settled | 390: travel / settle | 390: focus target; focus top vs header | 1280 default: scrollY → settled; travel / settle | 1280: focus top vs header | 390 reduced motion: scrollY settled; travel / settle |
|---|---|---|---|---|---|---|---|
| 1 | Situation → Inquiry Q1 (click Continue to inquiry) | 1104 → 363 | 741 px / 41 ms | h2; +255 px | 861 → 365; 496 px / 40 ms | +276 px | 363; 741 px / 41 ms |
| 2 | Q1 → Q2 (Enter on Continue) | 363 → 363 | 0 px / 0 ms | h2; +255 px | 365 → 365; 0 px / 0 ms | +276 px | 363; 0 px / 0 ms |
| 3 | Q2 → Q3 | 364 → 364 | 0 px / 0 ms | h2; +254 px | 365 → 365; 0 px / 0 ms | +276 px | 364; 0 px / 0 ms |
| 4 | Q3 → Q4 | 397 → 363 | 34 px / 42 ms | h2; +255 px | 365 → 365; 0 px / 0 ms | +276 px | 363; 34 px / 42 ms |
| 5 | Q4 → Q5 | 363 → 363 | 0 px / 0 ms | h2; +255 px | 365 → 365; 0 px / 0 ms | +276 px | 363; 0 px / 0 ms |
| 6 | Q5 → Q6 | 363 → 363 | 0 px / 0 ms | h2; +255 px | 365 → 365; 0 px / 0 ms | +276 px | 363; 0 px / 0 ms |
| 7 | Q6 → Your answers review | 1666 → 575 | 1091 px / 575 ms | h2; +15 px | 1548 → 550; 998 px / 558 ms | +63 px | 233; 1433 px / 40 ms |
| 8 | Review Back → Q6 | 2242 → 603 | 1639 px / 576 ms | h2; +15 px | 2060 → 578; 1482 px / 541 ms | +63 px | 311; 1931 px / 39 ms |
| 9 | Q6 → review again | 1698 → 575 | 1123 px / 575 ms | h2; +15 px | 1548 → 550; 998 px / 557 ms | +63 px | 233; 1465 px / 43 ms |
| 10 | Review → Empirical comparison | 2242 → 45 | 2197 px / 809 ms | h1; +15 px | 2060 → 13; 2047 px / 791 ms | +63 px | 0; 2242 px / 41 ms |
| 11 | Comparison → Impact | 7649 → 45 | 7604 px / 1125 ms | h1; +15 px | 5758 → 13; 5745 px / 958 ms | +63 px | 0; 7649 px / 40 ms |
| 12 | Impact → optional reflection (open) | 4367 → 45 | 4322 px / 576 ms | h1; +15 px | 3172 → 13; 3159 px / 525 ms | +63 px | 0; 4367 px / 42 ms |
| 13 | Reflection → Protect Four/otherness (skip) | 1133 → 45 | 1088 px / 576 ms | h1; +15 px | 875 → 13; 862 px / 526 ms | +63 px | 0; 1133 px / 44 ms |
| 14 | Otherness → User choice | 1067 → 45 | 1022 px / 575 ms | h1; +15 px | 837 → 13; 824 px / 508 ms | +63 px | 0; 1067 px / 41 ms |
| 15 | User choice Back → otherness | 1136 → 45 | 1091 px / 577 ms | h1; +15 px | 1080 → 13; 1067 px / 527 ms | +63 px | 0; 1136 px / 43 ms |
| 16 | Otherness Back → Impact | 1067 → 45 | 1022 px / 574 ms | h1; +15 px | 837 → 13; 824 px / 524 ms | +63 px | 0; 1067 px / 43 ms |
| 17 | Impact Back → Comparison | 4367 → 45 | 4322 px / 1141 ms | h1; +15 px | 3172 → 13; 3159 px / 974 ms | +63 px | 0; 4367 px / 43 ms |
| 18 | Comparison Back → Inquiry review | 5762 → 575 | 5187 px / 707 ms | h2; +15 px | 4447 → 550; 3897 px / 676 ms | +63 px | 233; 5529 px / 41 ms |

Raw tooling output for these rows was kept outside the repository. The screenshots listed in §11 are the only images retained.

Further built observations:

- Rows 1 to 18: in all 54 settled samples (18 transitions across the three runs) the focused element was the intended heading, inside the viewport, and not under the sticky header. In row 11 at 390 the click happened at scrollY 7649 and the active element afterwards was the h1 "Impact and dependency pathways".
- Row 1: after Continue to inquiry the page settled at scrollY 363 (390) or 365 (1280). The Inquiry title, opening paragraph, and the first stage rows are above the viewport. The first thing visible is "Question 1 of 6" (see `INITIAL-1-390-inquiry-entry.png`).
- A mid-flight timeline for row 11 at 390 showed the mount clamping scrollY from 7649 to 4367, then 1100 ms of smooth scrolling from 4367 to 45. Under reduced motion the same transition was a single jump.
- Back from Impact (row 17) lands on the h1, not on the controls the person left. Back from the comparison (row 18) lands on "Your answers" in the review, not on Q6.
- Situation step: "See situation status" scrolled 419 px over about 390 ms at 390 (305 px over 334 ms at 1280). The result is brought into view with the focus left on the submit button.
- Keyboard order after the heading is focused on the comparison page: the first Tab stop is a "Sources and limits" summary in the lifecycle guide, then the stage summaries. Thirty forward Tab presses at both widths never left a focused in-page control under the sticky header. Shift+Tab from the Q1 heading reached the header link "Principles". The header links themselves sit under the header by design.

### 2.3 Classification (HQ to decide)

| ID | Observation | Distinguishing note | Status |
| --- | --- | --- | --- |
| N-1 | On step changes from a long page, the document animates a smooth scroll of up to 7604 px (about 1.1 s) to the new heading. Under reduced motion it is one jump. | The destination is correct and the focus is visible. The long animation comes from `html { scroll-behavior: smooth }` combined with `scrollIntoView` in the mount effects. This reproduces "advancing a step moves the page toward the top." It does not show what the original reviewer saw, or that it is wrong. | Reproduced. Intentional focus management plus an incidental animation. Not shown to be an accepted-behavior contradiction. |
| N-2 | At Inquiry Q1 the title and orientation text are above the viewport on first entry. | The page keeps the person where the browser clamped them, then the heading focus keeps the question in view. There is no accepted rule that the title must be visible. | Observation only. |
| N-3 | After "Edit answers" on the situation step, the active element is `BODY` (the button that had focus is unmounted). Scroll also clamps from 1104 to 685. | Keyboard and screen-reader position falls to the start of the document. Neither the contracts nor the tests searched here address this focus case. The smoke asserts the continuation is removed, not where focus lands. | Candidate accessibility defect. HQ must classify. Not an accepted-behavior contradiction. |
| N-4 | Back lands on the heading of the previous step, not on a previous scroll position. | Matches the source (fresh mount, focus heading). Not tested against any accepted rule here. | Observation only. |

Focus management is not removed or weakened by anything in this report.

### 2.4 Smallest clearing scope, if HQ later authorizes it (proposal only)

- N-1: either remove `scroll-behavior: smooth` from `html` in `app/src/styles.css:40` (affects every page and in-page anchors, so it is broader), or keep the heading `focus()` and the `nearest` alignment while making the step-mount scroll instant (`behavior: "instant"`) in the six effects named in §2.1. Neither is performed here. Either change would need the existing smoke and unit checks re-run.
- N-3: after `Edit answers`, move focus to the first question group or its legend. No state or reducer change is implied.

Neither proposal changes the situation answers, any reducer, or a contract.

## 3. Comparison statuses: missing versus invalid versus available versus insufficient

All BUILT cases use the adequate-all-Yes situation, the inquiry completed with synthetic text, and no model chosen (so the generic new-phone evidence applies). Raw card text was captured per case. The table keeps the distinguishing lines.

| Case | Input | What the page showed | Plain meaning to map |
| --- | --- | --- | --- |
| C1 | Nothing selected, no number of years | Pending note "No horizon yet. Nothing has been filled in for you." No results. | Required input missing |
| C2 | Five pathways, number of years empty | Same note. No results. | Required input missing |
| C3 | Number of years `nope` | Note "This horizon cannot be used. It was not replaced with zero or a three-year default." The field is `aria-invalid`. No results. | Required input invalid |
| C4 | Number of years `0` | Same note as C3. | Required input invalid |
| C5 | Years `4`, keep and new, remaining service empty | Results shown. Keep: "No forward-looking keep total is shown. How long this phone can keep providing adequate service was not supplied." New: "More information is needed before a new phone can be compared." plus "How long the current phone can still provide adequate service was not supplied. It was not replaced with a default." The production and distribution brackets are still shown as "Generic fallback. This bracket is not an average and does not finish the comparison." | One required fact missing. Component evidence (generic bracket) available. Whole comparison not complete. |
| C6 | Remaining service `abc` | Keep: "…The remaining-service value was not accepted, and it was not replaced with another number." Field `aria-invalid`. New: "The remaining-service value was not accepted. It was not replaced with zero or another number." | One required fact present but invalid |
| C7 | Remaining service `0` | Same lines as C6 (rejected as invalid, not as zero). | Present but invalid |
| C8 | Remaining service marked "Not sure" | "…The expected remaining service is not sure, and it was not replaced with zero or a default." No `aria-invalid`. | Explicit unknown |
| C9 | Years 4, remaining 2.5, used 2, refurbished 3 (valid fixture) | Keep: remaining service 2.5 years, no forward-looking keep total. New: generic production 25–70 and distribution 2–4 kg CO2e as brackets. Used: "A complete service sequence is required. The next event was not supplied and was not invented." and "Service still uncovered on the shared horizon is 2 years." Refurbished: service 3 years, "Equivalent service over the shared horizon is not established.", direct refurbishment burden unknown with no generic footprint. | Valid inputs. No card is a completed comparable total. |
| C10 | Years 4, used empty, refurbished `abc` | Used: "Expected adequate service for this candidate was not supplied." Refurbished: "The expected service for this candidate cannot be used. It was not replaced with zero or a default." | Per-candidate missing and invalid |
| C11 | C9 plus battery repair with post-repair service 3 | Repair: "More information is needed before repair can be compared." "A complete service sequence is required. The next event was not supplied and was not invented." plus the provisional battery range "0.3–0.7 kg CO2e (GWP100). Provisional generic range." | Valid facts. Sequence still required. |
| C12 | Repair only, no repair facts | "More information is needed before repair can be compared." The kind of repair and post-repair service "were not supplied." "Those facts were not guessed, and no repair total is shown." | Required facts missing |
| C13 | Used service 5 and refurbished service 1, years 4 | Both: "Equivalent service over the shared horizon is not established." Used with 5 years and no gap: capability line "This can be described, but not fully measured, with the facts given." | Covered or short service alone does not establish equivalent service |

### 3.1 Status → requirement → authority

| Plain status line on the page | Relates to | Code authority (SOURCE) | Test or contract authority |
| --- | --- | --- | --- |
| "No horizon yet…" / "This horizon cannot be used…" | The one required common period. Missing versus invalid. | `comparison-ux.mjs` `parseExplicitHorizon` (positive decimal literal only; `0`, `1e2`, `3 years`, negatives, `Infinity` are null), `COMPARISON_HORIZON_MISSING`, `COMPARISON_HORIZON_INVALID`, `describeComparison` pending-note branch | `smartphone-comparison-ux.test.mjs` "refuses a missing or unusable horizon and never substitutes zero or three years" |
| "…was not supplied" / "…was not accepted" / "…is not sure" (keep, new) | Remaining service without repair. Three distinct states: absent, rejected or invalid, explicit Not sure. | `comparison-ux.mjs` `remainingPresentationStatus`, `keepRemainingLines`, `newRemainingLines`; evaluator `input-decision.mjs` `evaluateAdequacyAndUnknownState` (`appendMissingField` for a new phone with unknown service) | `smartphone-primary-pathway-facts.test.mjs` (the "was not supplied" and "was not replaced or accepted" cases); `USER_INPUT_MODEL_V0.md` ("Unknown remaining service has no three-year fallback.") |
| "More information is needed…" on New | Available only when remaining service is not accepted or when the evaluator reports `insufficient_information`. | `presentCard` (`new` branch) | same as above |
| "…complete service sequence is required. The next event was not supplied…" | Genuinely insufficient: a repair or used candidate is shorter than the common period and the next event is unknown. The interface has no control to supply the next event. | `secondary-pathway.mjs` `hasIncompleteServiceSequence`; `input-decision.mjs` `applyServiceSequence`; `presentCard` repair branch and `secondaryServiceLines` | `USER_INPUT_MODEL_V0.md` ("insufficient rather than truncated"); `smartphone-primary-pathway-facts.test.mjs` and `smartphone-secondary-service-facts.test.mjs` assert the lines and assert `smartphone-comparison.tsx` does not mention `foreseeable_next_event` |
| "Equivalent service over the shared horizon is not established." | Equivalent service is not established by service years alone. | `secondaryServiceLines` | `smartphone-secondary-service-facts.test.mjs` (covered and short cases) |
| Production, distribution, and repair brackets | Component evidence available. Caption says it "does not finish the comparison". | `qualifiedRange`, `newClimateValues`, `repairClimateValues` | `EMPIRICAL_SMARTPHONE_V0.md` ("Unknown service, events, parameters and burdens remain unknown or insufficient; they never become zero.") |

### 3.2 Observations (BUILT and SOURCE)

- The page uses "More information is needed" for two different situations: (a) a fact the person can type (remaining service, repair kind, candidate service); (b) a missing "next event" for which the interface offers no field. Both are accepted and tested. The wording does not distinguish them.
- On New (C5 to C8, C11) the first line and the capability line both read "More information is needed" next to a displayed production bracket.
- The statement "The same horizon is used for every selected pathway: N." is shown even when a card says the comparison is not complete.
- "1 years" (C13) is printed for a refurbished service of 1.
- The generic-new card does not carry its own "Sources and limits" disclosure. The model-specific card does. For generic evidence the sources are in the lifecycle guide production disclosure and in the Impact page disclosures.
- A displayed bracket was never presented as a total, and no unknown was plotted or shown as zero in these cases.

None of this contradicts a contract or test found in this task.

## 4. Public "horizon" inventory and ordinary-language candidates

Internal names (`common_service_horizon_years`, `horizonRaw`, `H_primary_years`, element ids such as `comparison-horizon`) are not changed by any candidate. The meaning to preserve is the same common adequate-service comparison period for every selected pathway. It is not a lifetime prediction for any phone. Raw input validity stays as it is, and equivalent-service accounting stays as it is.

### 4.1 Rendered strings (SOURCE, cross-checked BUILT)

Built occurrence counts of "horizon" in `main` text: 4 on the empty comparison page, 8 with five pathways and no number, 12 with a valid fixture and all five pathways, 0 on Impact. The accessible name of the field is also the label.

| Location (file:line) | Current text | Role |
| --- | --- | --- |
| `comparison-ux.mjs:29` `COMPARISON_OPENING` | Enter one shared horizon in years for the alternatives you compare. | Opening |
| `comparison-ux.mjs:62` `horizonLabel` | Common adequate-service horizon in years | Field label and accessible name |
| `comparison-ux.mjs:40-41` | The same horizon is needed to compare adequate service honestly. | Helper |
| `comparison-ux.mjs:43-44` | No horizon yet. Nothing has been filled in for you. | Missing |
| `comparison-ux.mjs:46-47` | This horizon cannot be used. It was not replaced with zero or a three-year default. | Invalid |
| `comparison-ux.mjs:156, 167, 178, 184` | "…is not the shared horizon…" (remaining, post-repair, used, refurbished helpers) | Helper disclaimers |
| `comparison-ux.mjs:1239` | Service still uncovered on the shared horizon is N years. | Used candidate |
| `comparison-ux.mjs:1247` | Equivalent service over the shared horizon is not established. | Secondary candidates |
| `comparison-ux.mjs:1252` | Expected adequate service was not copied from the shared horizon. | Secondary candidates |
| `comparison-ux.mjs:1658` | The same horizon is used for every selected pathway: N. | Results header |
| `comparison-ux.mjs:945, 947, 1012, 1019, 1023` | "…not the horizon entered here", "…outside the horizon entered here", "…not added to this horizon", "…not applied to this horizon" | Model-specific source references |
| `comparison-ux.mjs:1364` (internal flag `not_substituted_into_user_horizon`) | not public text | Internal |

Comments and identifiers containing "horizon" elsewhere (`input-decision.mjs`, `secondary-pathway.mjs`, the `set_horizon` action names) are internal.

Also found: `framework.ts` uses "horizontal" and is unrelated.

### 4.2 Candidate replacements (proposal, not accepted)

| Current | Candidate |
| --- | --- |
| Common adequate-service horizon in years | How many years of phone use would you like to compare? |
| Enter one shared horizon in years for the alternatives you compare. | Enter one number of years to compare the alternatives over. |
| The same horizon is needed to compare adequate service honestly. | Every alternative you select is compared over this same number of years of adequate phone service. It is a period you choose for comparison. It is not a prediction of how long any phone will last. |
| No horizon yet. Nothing has been filled in for you. | No number of years yet. Nothing has been filled in for you. |
| This horizon cannot be used. It was not replaced with zero or a three-year default. | This number of years cannot be used. Enter a number above zero in digits. It was not replaced with zero or a default. |
| …is not the shared horizon… | …is not the number of years you chose to compare… |
| Service still uncovered on the shared horizon is N years. | This candidate's expected service leaves N years of the compared period uncovered. |
| Equivalent service over the shared horizon is not established. | Equivalent service over the compared period is not established. |
| Expected adequate service was not copied from the shared horizon. | Expected adequate service for this candidate was entered separately. It was not copied from the number of years you chose to compare. |
| The same horizon is used for every selected pathway: N. | Every selected alternative is compared over the same N years. (N stays as typed, for example `2.50`.) |
| …not the horizon entered here / not added to this horizon / not applied to this horizon | …not the number of years you chose to compare / not added to the compared period / not applied to the compared period |

Cautions for acceptance:

- The word "adequate" carries the accepted meaning (safe, required functions, support adequacy). Whether the ordinary-language label should keep it is a Research and HQ choice. It is kept in the helper above.
- The candidate invalid-number line says "digits" and "above zero", matching `parseExplicitHorizon`. It gives no example number, because an example number can be copied as a default.
- The current helper reads as a justification ("to compare … honestly"). The candidate helper states what the number is and what it is not.
- Tests that encode the current wording and would need a bounded update in any later slice: `smartphone-comparison-ux.test.mjs` (the exact results-header string, about line 251), `smartphone-model-evidence.test.mjs` (regexes `not added to this horizon` and `outside the horizon`, about lines 372 and 473), `smartphone-secondary-service-facts.test.mjs` (regexes for `shared horizon`, about lines 91, 258, 267, 289), and `e2e-local-preview-smoke.mjs` (the "same horizon is used" text, about line 355).

## 5. Smallest accepted-meaning presentation map (proposal, prose only)

Principle: reorder and fold what the page already says. No quantity, qualification, or source is removed. No new value, graph, score, total, ranking, or recommendation is added.

Current reading load (BUILT, `main` innerText, closed disclosures not counted): comparison with no pathway selected 658 words (mostly the lifecycle guide above the form), comparison with four pathways and one fact set 1371 to 1395 words, Impact 858, reflection 234, otherness 235, choice 269.

| Layer | What is shown by default | Where existing qualifications stay reachable |
| --- | --- | --- |
| 1. Primary status (one plain line per card) | One of the existing accepted capability statements, in ordinary words: a quantified range is available; this can be described but not fully measured with the facts given; more information is needed; unknown. Or the existing missing, invalid, or not-sure line about the required input. The remaining-service and common-period input state comes first. | The status line is an existing string. It is not recomputed. |
| 2. Two or three key facts | Only facts the person entered or the card already states: expected service years (remaining, post-repair, or candidate); whether the evidence is generic or model-specific; each bracket with its unit and its existing caption ("bracket, not an average, does not finish the comparison"). For the second-life cards, the covered-years versus compared-years statement. | Nothing is removed from the card. |
| 3. Optional limits (collapsed under one summary) | The existing boundary lines: earlier manufacture left out, end of life and recycling not given amounts, no market displacement amount, no refurbishment process established, shipping not given an amount, "not copied from…". | All stay verbatim in the collapsed block. They are not deleted. |
| 4. Complete inspectable sources and method | The existing "Sources and limits" disclosure for model-specific cards. The existing lifecycle guide production disclosure and the Impact disclosures for generic evidence. | Closed but present. |

Visual: a small visual is legitimate only where quantities share a unit and boundary, for example expected service years against the compared number of years for one candidate (two bars from entered values). It is not legitimate for production or distribution brackets across pathways with different scopes, and never for an unknown, a partial sum presented as a whole, a normalized environmental score, or a recommendation. A prose or static mapping is enough for now.

Gap noted: the generic-new card has no disclosure of its own that names its source. A later accepted mapping would need to say where a reader finds it from that card.

## 6. Completion inventory (current final-choice view and in-memory state)

Reuses the limits in `handoffs/cursor/HQ-CURSOR-2026-10-16-053-pdf-feasibility.md` (#166). The PDF investigation is not repeated.

### 6.1 What the final-choice view shows today (BUILT, with synthetic answers entered at every step)

The built view shows, in order: the six-stage list; "Provisional inquiry choice" and its label; "Pathways inspected in comparison" with the selected labels; "Protect Four and otherness inquiry" with "The otherness question was shown." and the person's otherness response and follow-up, exactly as typed; the seven unranked options; the adequacy note; the boundary note; and, only after a selection, "This is your present choice. It is not a recommendation from PSI." with "You can choose a different option or clear this one." plus "Clear this choice" and "Back…".

Not shown at the choice step (absent from the rendered text of that walk): the six inquiry answers, the provisional-choice shift, the situation answers and status, the comparison number of years and service facts, the system-participation answers, any evidence line, or any source. The anticipated old-phone fate was not entered in that walk. By source it is also not passed to the final-choice view (`smartphone-situation.tsx` lines 106 to 113 name the inputs).

### 6.2 Covered versus missing, and what needs explicit acceptance

| Item | Parent in-memory state (SOURCE) | At choice today | States to keep distinct | Needs explicit product or domain acceptance |
| --- | --- | --- | --- | --- |
| Final choice | `finalChoice.selection` | Shown; acknowledgment line only after a selection | none selected; one of seven; cleared | Whether an acknowledgment exists when nothing is selected |
| Otherness response and follow-up | `otherness.response`, `.followUp` | Shown only when the otherness question was activated | not activated (not "absent"); activated and blank; activated with text | None for the text. The existing "not activated" wording must travel with it. |
| Provisional inquiry choice | `inquiry.provisionalSelection` | Label shown | not recorded; recorded | Whether the shift is also recapped |
| Inspected pathways | `comparisonView.pathways` | Labels shown | none; some | None |
| APQ1–6 answers | `inquiry.rawAnswers` | Not shown | literal text; the literal "I’m not sure"; blank | Whether to recap all six, a subset, or none |
| Situation answers | `state.answers` | Not shown | Yes; No; "Not sure"; unanswered cannot reach choice | Whether to recap |
| Comparison inputs (years, services, models) | `comparison.*Raw` | Not shown | typed text as typed; Not sure; absent; invalid | Whether any fact is recapped, and with what unknown wording |
| Anticipated old-phone fate | comparison state | Not shown | not answered; I’m not sure; one of seven. Carry the existing hypothetical wording. | Whether to include it |
| QSP1–3 answers | `participation` | Not shown | text; skipped; never opened; stale (cleared on binding change) | Whether skipped versus never-opened wording is shown |
| Evidence and sources | derived `describe*` output | Not shown | not established is never zero | Whether a recap repeats evidence denial lines |

Invalidation rules (SOURCE, `smartphone-situation.tsx` roughly lines 115 to 266, and the `*StateAfter*Action` helpers) mean any upstream edit clears downstream state and returns the step. A recap built at the choice step therefore always reflects current bindings, and a cleared stage cannot be recovered.

### 6.3 Minimal map for a future client-only completion slice (proposal, not accepted)

- Build only from the current `describe*` display fields and raw strings at a user gesture. No new store, no export, no analytics, no account, no persistence, and no counter. #157 PDF stays deferred.
- Raw answers are shown literally (including spacing and "I’m not sure"). Nothing is trimmed, summarized, labelled with a motive, or scored.
- Each item carries its state in one of five forms: data, empty, skipped, stale (cleared) or not current, current. An unanswered item is shown as unanswered, never as "No". Not sure is shown as Not sure.
- No generated summary, no claim about what the person viewed, no personality or virtue label, no grade.
- The acknowledgment line and the recap heading are new public copy and need explicit acceptance.

## 7. Provenance sentences and Principles label (observation only for the separate AP proposal)

Exact strings rendered (BUILT, `p` elements, not inside a `details`):

- System-participation page: "These questions are a project interpretation. They are a project-authored inquiry, separate from the empirical evidence. They are not a direct statement from Acharya Prashant." (`system-participation-ux.mjs:84`)
- Otherness page: "Protect Four is a project interpretation. It is mixed with the empirical record. It is not a direct statement from Acharya Prashant." (`ap-otherness-ux.mjs:77`)
- The Otherness question text and follow-up were observed unchanged: "Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?" and "What makes you see it that way?" They are preserved here exactly as the positively received question. Nothing in this task rewrites a prompt, the provenance, or the Principles label.
- Stage-label variants for the same stage (SOURCE and BUILT): `situation-ux.mjs:123` "Protect My Four/otherness inquiry" on early pages and on the reflection page; "Protect Four and otherness inquiry" on the otherness and choice pages; the reflection continue button reads "Continue to Protect My Four".
- Principles: a header link "Principles", the page eyebrow "Principles", page title "What PSI promises you", and the second numbered scene heading "Ordinary choices repeat" (`public-constitution.mjs` `LBL-NAV-PRINCIPLES`, `LBL-EYEBROW`, `LBL-PAGE-TITLE`, `LBL-SCENE-2`). The English Constitution page is the canonical text. No German copy was touched.

## 8. Supplementary read-only look at the supplied reference Site (optional, limited)

Accessed 2026-10-17, `https://planetary-self-inquiry.aakashs9099.chatgpt.site/`, with a normal page load and no form entry. No code, text, or style was copied or imported. The Site was not changed. Its build or version is unknown, so these numbers are for that moment only.

| Item | Reference Site | Canonical `/smartphone` entry (this build) |
| --- | --- | --- |
| Background and text colour | `rgb(7, 16, 12)` and `rgb(234, 244, 236)` | `rgb(242, 238, 228)` and `rgb(22, 20, 16)` |
| Words on first load (`body` text) | about 2050 | 213 (one step) |
| Document height at 390 | 17905 px | 1529 px |
| Headings found | One long page; H2 headings include "Adequacy must be checked before options are ranked" and "Compare the same period of useful phone service." | One H1, "The phone you already have" |
| Controls | 15 inputs, 10 textareas, 16 `details`, no radios | 9 inputs (all radios), 2 buttons, no `details` |
| Horizontal overflow | None at 390 or 1280 | None at 390 or 1280 |

This is a visual and structural observation only. It is not a comparison of comprehension or usability, not an endorsement of any meaning or wording, and it does not establish that either is better. The measured background and text colours are consistent with the dark and cream descriptions in #180. The lime accent, the numbered four-step overview, and the grouped two-column fields were not re-derived here.

## 9. Kit inspection

`HQ-CURSOR-2026-10-17-058-human-review-kit.md` is participant-facing only. Self-check:

- Coverage against D-014 list: comparison alternatives versus final choice (Part 2 Q1, Part 6); generic versus exact-model evidence (Part 2 Q2); numbers, ranges, missing and invalid input, and the years field (Part 2 Q3 to Q4); lifecycle stages and visuals (Part 3 Q1); anticipated fate versus actual event (Part 3 Q2); aggregate e-waste versus this phone (Part 3 Q3); empirical versus philosophical, system participation, and Protect My Four (Part 4); step navigation, scroll, and Back (Part 1 Q3, Part 5); closure, final choice, and Principles (Part 6); optional German; optional fictional-phone second probe, kept separate from the natural path.
- No expected interpretations, no bracketed HQ notes, no quotation of reviewer criticism, no exam or scored task, no keep, repair, or replace measure of success.
- It states voluntariness, stopping, disagreement, uncertainty, no right purchase or score, the fictional option, and that personal details, religion, contact details, and recordings are not wanted. It states that it does not promise anything about what a browser or device keeps.
- It does not require a participant to reach any optional or conditional page. If a page does not appear, the observer records a coverage gap (§10), not a failure.
- Fictional phone details come from the accepted 054 fixture: it makes calls, the speaker crackles, the model is unknown, and the remaining adequate service is unknown.
- The kit uses the word "horizon" nowhere, and does not name the common-period concept for the participant.

## 10. Observer guidance and anonymous feedback template (not participant coaching)

### 10.1 Neutral observation guidance (for the person running a session, if one exists)

- Read the kit as written. Do not explain a screen, a number, or a status. Do not say what is expected.
- If a participant asks what something means, say: "What would you take it to mean?" Do not confirm or correct.
- Do not hint at the "right" step, a purchase, or the correct reading. Do not react to which option is chosen.
- Record observations as what was said or done. Mark your own reading separately.
- Stopping early, skipping, or saying "not sure" is a valid result. Record where and how, not why.
- If an optional or conditional page never appeared, record "not reached" as a coverage gap. Do not prompt the participant toward it.
- Do not record audio, video, or screen. Do not write down a name, contact, or identity.

### 10.2 Anonymous feedback template (one per returned review)

Private originals stay outside GitHub. Only a necessary anonymous paraphrase is public. No personal answers, no recording.

| Field | Entry |
| --- | --- |
| Participant code (for example `R-01`) |  |
| Date |  |
| Reviewed exact build, or `UNKNOWN` |  |
| Public URL reviewed |  |
| Device and browser |  |
| Language |  |
| Stages and parts reached |  |
| Completion state (finished, stopped early, first impression only) |  |
| Concrete observation (what was seen or said) |  |
| Participant suggestion (separate from HQ interpretation) |  |
| HQ interpretation (separate; left blank by the observer) |  |
| Coverage gaps (conditional or optional pages not reached) |  |
| Limits |  |
| Attribution status (anonymous; permission, if any) |  |
| Privacy | No name, contact, religious identity, raw private answers, correspondence, or recording in the public artifact |

## 11. Evidence retained

At most six INITIAL-1 screenshots beside the standard return in `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-058/`. All use a synthetic fixture.

| File | Shows |
| --- | --- |
| `INITIAL-1-390-inquiry-entry.png` | Landing after Continue to inquiry: stage rows and Question 1 visible, title above the viewport (§2.2 row 1) |
| `INITIAL-1-390-comparison-remaining-missing.png` | New-phone card with remaining service not supplied and generic brackets shown (§3, C5) |
| `INITIAL-1-390-comparison-before-continue.png` | Comparison page scrolled to the Continue control before row 11 |
| `INITIAL-1-390-impact-after-settled.png` | Impact heading focus after the animation settled (row 11) |
| `INITIAL-1-1280-impact-after-settled.png` | Same at 1280 |
| `INITIAL-1-390-final-choice.png` | Final-choice view with a selection (§6.1) |

## 12. Contradictions, discrepancies, and preserved gaps

- **Accepted-behavior contradiction:** none established. No contract or test found in this task was contradicted by a BUILT observation.
- **Candidates for HQ classification (not fixed here):** N-1 long animated scroll on step change; N-3 focus falls to `BODY` after situation "Edit answers"; the stage-label variants in §7.
- **Not evaluated:** real touch behavior, screen readers, zoom or text scaling, other browsers, German UI, repair kinds other than battery, exact-model comparison cards, and the keep-only branch.
- **Not asserted:** any human comprehension result, any representativeness, or the deployment version.
- The hosted app was not checked. The Site observation is read-only and may not match any other version.
- This report does not decide the Household Ledger, cooling, repair or replacement cost, or decision-counter questions. Those belong to the separate authorized tasks.

Self-merge: NO.
