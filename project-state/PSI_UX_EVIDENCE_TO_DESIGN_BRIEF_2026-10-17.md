# PSI UX Evidence-to-Design Brief — 2026-10-17

HQ reconciliation under the Owner's current bounded UX-research direction. This is a source-to-design decision record, not a new empirical/AP source package or an application implementation. No permanent workstream.

## Baseline and limits

Reviewed accepted main `a24f2c4a5aec1f0d5209d4c19bc027a74f357120`: Constitution/Owner control/control plane; empirical/AP/regression contracts; current comparison, lifecycle, situation, inquiry, choice, entry bridge, navigation, public Principles and Ledger source; accepted #182/#184 baseline audit and participant kit; #146 presentation map; D-014–D-016 and #180/#181. The latest app merge #193 and post-merge CI passed. Current main adds coordination only. No authorized executor was active at intake; historic PR #1 is not an execution task.

SOURCE means inspected current repository code. BUILT below means the accepted #182 synthetic build observations, not a new HQ browser run or real-user finding. That audit predates the #190 period-copy and #189 Ledger amendments; current source confirms those amendments. FEEDBACK means #180's anonymous preliminary observations, with build/device/full completion unknown. Reviewer C #181 has not used the site. No fresh participants, deployment-SHA match, performance measurements, full accessibility conformance audit or comprehension improvement is claimed.

The supplied Markdown is now read. Original preserved at [Owner visual reference](../provenance/visual-references/OWNER-2026-10-17-smartphone-lifecycle.md), SHA-256 `7b3cc52f9648ad104adc0784245dad97041a937db90dec6bd12ed5d1941c304c`. It identifies https://youtu.be/5Q5-OYEAN1c. Owner subsequently supplied a 51-page image-only PDF, `slide-00-42.pdf`, SHA-256 `7d5023ebb8ab5b1a7ebff447c592819cf784ec79591d738357b8bef1e5e3060a`. HQ rendered all pages, inspected six contact sheets, and examined pages 2/30/40/43/46/50 at readable size. This verifies static visual observations below, not timing, narration or animation quality. PDF page numbers are not video timestamps. Original PDF stays with the Owner-supplied attachment; copyrighted frames are not republished as repository/app assets. README and separate PNGs remain unprovided. This is distinct from the earlier Tech Junkies ownership-psychology source and the separate ChatGPT Site reference.

## Bounded evidence selection

Accessed 2026-10-17. These sources are UX/method authority only, never smartphone lifecycle evidence or AP authority. Recommendations below are HQ inferences to test in PSI, not effects established in PSI.

| ID / source | What is supported | Strength and transfer limit |
|---|---|---|
| U1 [NN/G, Progressive Disclosure (2006)](https://www.nngroup.com/articles/progressive-disclosure/) | Put primary tasks first; defer secondary complexity through obvious, accurately labelled access. The split must fit the user's task. | Professional design guidance, not a PSI trial or universal instruction to collapse content. Necessary uncertainty is primary information. |
| U2 [NN/G, Recognition and Recall (2024)](https://www.nngroup.com/articles/recognition-and-recall/) | Keep relevant context and labelled controls available rather than requiring memory. | Professional guidance grounded in memory concepts; does not authorize changing reflective questions into multiple choice, recording history or collecting profiles. |
| U3 [NN/G, How Users Read on the Web (1997)](https://www.nngroup.com/articles/how-users-read-on-the-web/) | Their same-content website comparisons favour concise, scannable, objective writing. | Old, narrow web study described by its authors; do not transfer improvement percentages, fixed word limits or reading-time laws to PSI. |
| U4 [Baymard, descriptions by highlights (2018)](https://baymard.com/research-articles/structure-descriptions-by-highlights) | Their commercial product-page observations favour meaningful clusters with headings and accompanying images. | Practitioner usability research; commercial exploration/favourability objectives differ from PSI comprehension. No conversion/engagement uplift prediction. |
| U5 [Baymard, images with descriptive text](https://baymard.com/research-articles/product-images-descriptive-text) | Label what an image explains; graphics alone can leave non-experts guessing. Text baked into desktop imagery can become unreadable on mobile. | Commercial product-page observations, not proof that icons, animation or a particular palette teach lifecycle concepts. Use responsive live text. |
| U6 [WAI, Clear and Understandable Content](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/) | Familiar words, short blocks, clear images, whitespace and explicit meaning aid access. | Supplemental cognitive-accessibility guidance, explicitly not required for WCAG conformance. No claim of a single best layout. |
| U7 [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Relevant testable criteria: text alternatives 1.1.1; relationships 1.3.1; colour 1.4.1; reflow 1.4.10; keyboard 2.1.1; focus order/visibility 2.4.3/2.4.7; headings 2.4.6; focus not entirely obscured 2.4.11; labels/instructions 3.3.2. | Normative technical standard. Passing a narrow check is not whole-site conformance; a reported discomfort is not automatically a criterion failure. |
| U8 [Google web.dev, Core Web Vitals thresholds, updated 2025](https://web.dev/articles/defining-core-web-vitals-thresholds) | LCP, INP and CLS address loading, interaction response and layout stability. Good field thresholds: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1, assessed at the 75th percentile. | Engineering targets, not comprehension measures. Lab/single-device results are not field distributions; scroll-animation duration is not INP. No telemetry authorized. |
| U9 [Stacey et al., Cochrane 2024, CD001431.pub6](https://www.cochrane.org/evidence/CD001431_patient-decision-aids-help-people-who-are-facing-decisions-about-health-treatment-or-screening) | Review of 209 randomized studies/107,698 adults: high-certainty evidence for improved knowledge, risk perceptions and active participation; moderate certainty for informed values-congruent health choices. | Search through March 2022; health treatment/screening, not smartphone choice or philosophy. Borrow evaluation dimensions, not effect sizes, clinical terminology or a claim that PSI is validated. |
| U10 [van der Bles et al., PNAS 2020, DOI 10.1073/pnas.1913678117](https://pubmed.ncbi.nlm.nih.gov/32205438/) | Five experiments examine uncertainty communication and trust; numerical ranges generally did not substantially reduce trust. | Targeted peer-reviewed communication evidence, not a comparison-card efficacy trial. Primary indexed abstract/search text inspected; repeated publisher/PMC full-body access hit cookie/captcha barriers after initial PDF retrieval. Detailed methods not independently appraised. Trust is not comprehension, and PSI modelling brackets are not confidence intervals. No graphic type is validated here. |

Stop rule: these ten sources cover the actual hierarchy, context, visual, accessibility, uncertainty and evaluation decisions below. No general “attention span” claims, open-ended literature survey or new psychology model is needed.

## Five recommendations, in priority order

Ordering uses observed friction, semantic consequence, probable benefit, evidence relevance and effort; it is a judgement, not a numeric score.

### R1 — Put the comparison task before lifecycle background

**Problem/evidence:** SOURCE: `smartphone-comparison.tsx` mounts the complete guide above the alternatives/form/results. BUILT #182 counted about 658 visible words with no alternative selected, largely the guide; its first Tab after comparison heading reached guide disclosures. Four-pathway fixture had 1,371–1,395 visible words, not a reading-time measurement. FEEDBACK B-01 reports text burden. U1/U3/U6 support clearer primary-task hierarchy; U4 supports meaningful grouping. No source proves this reorder will improve PSI understanding.

**Change/benefit:** First Tier-2 slice: move the same unconditional shared guide and its model-guide note below comparison results/Continue. Add a visible native link near the opening, “Explore the phone lifecycle and sources”, and a return link “Back to comparison inputs”. Preserve all guide text, statuses, sources, stage disclosures and generic access, including empty/invalid/keep-only cases. This removes background from the path to controls without hiding or rewriting result limitations.

**Risks/gates:** Moving the guide could reduce discovery; the top link and pilot must check that. Keep per-card missing/invalid/unknown/component-only/equivalent-service limits visible. No card condensation, totals, chart, rank, default or state/evaluator change. The existing test requiring guide-before-form is a presentation-order assertion; replace only those two order assertions with the new explicit order plus unconditional-access checks. Preserve every semantic case and the Impact guide order. Current accepted copy “comparison period” stays.

**Validation:** Built 390/1280: empty, invalid, generic new, exact-model and keep-only; keyboard links/focus under header, no overflow/errors; same card strings/numbers/states before/after. Human natural pass: can they find alternatives and the lifecycle guide unaided? Ask what the result established and what remains unknown before explaining anything. Fewer scrolls alone is not success. Effort small; probable benefit high; evidence moderate/indirect. **Selected now, independent HQ acceptance still required after execution.**

**Concrete page-order wireframe** (labels below name existing blocks, not new scientific copy):

| Position | Current source | Selected small slice |
|---|---|---|
| 1 | Title/opening/stage status rows | Same, plus clearly labelled lifecycle link |
| 2 | Full lifecycle guide and generic/model note | Alternatives and comparison-period/service/model/fate inputs |
| 3 | Alternatives and inputs | Pending message or existing result cards, all qualifications and Continue |
| 4 | Pending/results/Continue | Same full lifecycle guide and its note, always available; return-to-inputs link |

Later R1b proposal: separate a card's existing capability/status and key facts visually from method detail. Before collapsing any line, map every rendered statement to “essential beside number” versus “optional derivation”. Generic/model-specific, bracket-not-average, incomplete-service and unknown are essential. #182's blanket optional-limit layer is NOT adopted. A valid partial result must not look like a complete comparison. No implementation of R1b is authorized by this brief.

### R2 — Make transitions and input context predictable

**Problem/evidence:** SOURCE and BUILT #182: correct headings receive focus but long-step transitions animate up to roughly 1.1 s; “Edit answers” unmounts the focused button and leaves BODY active. Current period input has a visible helper without `aria-describedby`, unlike neighbouring service inputs. Those are different issues. U2 supports visible contextual help; U7 provides focus/relationship checks. Neither establishes that every page jump is wrong.

**Proposal/benefit:** A later narrow accessibility slice can link the existing period helper, choose a deliberate focus target after Edit, and test instant step arrival while preserving focus, Back semantics and reduced-motion support. Assess each independently; do not remove focus management, globally disable anchor navigation or turn stage-status rows into links. Benefit: less lost position and reliably available instructions.

**Risks/validation:** Screen-reader output, sticky header at narrow/zoomed widths, keyboard/Shift+Tab and Back/edit/reset require rendered checks. Distinguish focus loss from a documented WCAG failure before claiming one. Participant asks what happened after Continue/Back and whether location was expected; observer notes action and interruption without diagnosing ability. Low effort; potentially high accessibility benefit; current evidence source/synthetic, real assistive-technology coverage absent. **Candidate, not a second concurrent implementation task.**

### R3 — Demonstrate a connected lifecycle, keeping evidence scope visible

**Problem/evidence:** SOURCE: current eight numbered SVG stage disclosures are an ordered list/grid, not a connected process diagram; quantities are promoted by matching record text, not by a stage-share dataset. The whole-production banner is correctly separate. Whether people see a journey is untested. U4/U5/U6 support labelled visual clusters; the Owner reference suggests an overview (05:30), component map (01:07) and fate branches (06:34), as reported in the handoff.

**Proposal/benefit:** Test one original static, responsive connected overview using the same eight stage IDs/order and live labels; highlight the stage being explored without forcing linear completion. Put whole-production 25–70 kg CO₂e in one visibly spanning production bracket for the first four stages, never four allocations. Keep distribution 2–4 kg separate; charging is kWh/year, not a comparable carbon bar. Use the already accepted generic/this-phone-unknown/source structure within each stage. A second-life branch shows possibilities, not probabilities or guaranteed recycling.

**Risks/gates:** Arrows may imply an actual traced handset, inevitability, causality or credits. Label overview as generic; scope limits stay beside relevant numbers. No Sankey/stage-share pie, scaled harms, mine/victim scene, water/material quantities or percentages from the video. Novel component-to-material facts need Research authority; new reflection meanings need AP. No animation or special model is yet justified.

**Validation/wireframe:** Pilot an overview plus one open stage: “What connects these stages?” “What does this say about your phone?” “What does this number cover?” Exact current guide is control; proposed view is a later bounded prototype, not silently deployed. A design sketch has three visible layers: (1) eight connected stage labels; (2) selected stage with one illustration and existing main fact; (3) distinct “general evidence”, “your phone: unknowns”, “sources/further exploration” blocks. All text remains accessible without seeing arrows/colour. Medium effort, plausible benefit, PSI effectiveness unknown. **Design candidate only.**

### R4 — Clarify entry and shorten the path to a useful first action

**Problem/evidence:** SOURCE: homepage headline expresses Protect Four; primary hero link opens Ledger; phone inquiry has a later bridge and menu link. This can make first-time purpose and next action harder to infer, but no participant has established that failure. Principles already has six scenes and sources disclosure; Ledger now has one approved illustrative-estimate qualifier and no cooling-history notice. U1/U3/U6 support clear hierarchy and task-oriented headings.

**Proposal/benefit:** Test entry comprehension and phone-link findability before rewriting the homepage. If needed, make the existing phone entry more prominent using accepted bridge wording. Assess Principles scene headlines/navigation and Ledger label/readability separately; group existing facts with short labels and optional method, without adding metrics. This aims to make a few-minute visit useful.

**Risks/gates/validation:** Homepage promise/Protect My Four meaning and AP attribution cannot be casually rewritten. Principles English is canonical and German is a scoped pilot; changed semantic wording needs the existing AP/translation review. Ledger scientific validity is a separate domain and replacement metric remains deferred. Ask a first-time visitor what PSI offers, why they might use it and how they would begin; observe the attempted path, not click-through conversion. Medium probable benefit; uncertain severity; low-to-medium effort after evidence. **Pilot-first candidate, no homepage/Principles/Ledger implementation.**

### R5 — Support reflection and closure through recognition, not interpretation

**Problem/evidence:** SOURCE: Q6 already shows Q1–Q5 raw answers; do not duplicate that solved issue. Final choice already shows provisional choice, inspected pathways, conditional Otherness raw response and a current-choice acknowledgment, but not a full inquiry recap. Empirical→QSP→Otherness transitions retain protected prompts and gating; AP #183 offers unselected helper/provenance alternatives. U2 supports accessible context; U9 motivates knowledge/autonomy evaluation, not a clinical score. U10 gives no reason to conceal uncertainty to preserve trust.

**Proposal/benefit:** Test whether people can distinguish an empirical statement from optional inquiry, explain the question in their own words and identify who chooses. A later compact recap could expose authoritative current raw answers in optional sections; never infer motives or reconstruct erased viewing history. Use the existing completion-state inventory, not a new PDF investigation.

**Risks/gates/validation:** Exact APQ1–6/QSP/Otherness, disagreement/uncertainty/no-agency and final buy-new legitimacy stay. New helper/provenance copy must follow accepted AP review and explicit selection. Product selection of recap contents/states is not determined by this brief. Ask what they expected at the end, what was useful, and whether they felt free to choose any option or remain undecided. Do not evaluate whether a purchase changed. Medium effort/benefit, PSI-specific need still preliminary. **Candidate; no AP rewrite, recap, PDF or persistence authorized.**

## Video figures: source record only

The Markdown does not transcribe a bibliography, but subsequently supplied PDF page 50 does. It lists Ercan et al. (2016), DOI 10.2991/ict4s-16.2016.15; Joshi et al. (2021), DOI 10.1088/1755-1315/795/1/012028; Pamminger et al. (2021), DOI 10.1007/s11367-021-01869-2; and Guardian, Britannica, Wirefly and Infomineo pages. A legible reference list is not a figure-to-source mapping. These underlying works have not been newly inspected for the video's figures; reuse existing accepted source mappings before commissioning any follow-up. Candidate timestamps below come from the Markdown; static PDF confirmation is separate.

| Video claim in supplied Markdown | Reported location | Compatibility / disposition |
|---|---|---|
| 40% metals / 40% plastics / 20% ceramics and trace materials | Exact figure timestamp not specified; material captures 01:07/01:56/02:18 | Generic composition not adopted; no component proportions or material chart. Research only if a later approved diagram actually needs this fact. |
| IC 2.7–4.3 kg CO₂e/cm², about 3.5 central | IC capture 04:45 | Indicator, boundary, technology and allocation unknown; cannot add to whole-phone production. Excluded. |
| Display about 0.1 kWh/cm² including touch layer | Display capture 04:59 | Energy versus carbon, process boundary and area basis unresolved; excluded. |
| Replacement every 3 years; light/heavy lives 4/2 years | Use capture 06:02 | Not a user's adequate service or PSI default; excluded. |
| Manufacturing 85–95% of lifetime footprint | Summary capture 06:50 | Lifetime/use/grid/model dependence unverified; no generic percentage or pie. Excluded. |
| Average 63 kg CO₂ for 1 hour/day use | Usage-summary capture 07:00 | Time denominator/system boundary and CO₂ versus CO₂e unclear; do not infer network inclusion or annual basis. Excluded. |

### What the actual frames add

Three techniques worth testing with accepted content:
1. **Overview before detail:** PDF 30/36 places the phone and major stages in one composition. PSI can connect its existing eight stages with labelled progression; the source's four-node radial composition itself does not clearly encode order.
2. **Point to the thing being explained:** PDF 2 uses leader lines and component labels. Original responsive illustrations can locate an accepted concept; material/chemistry facts require their own accepted authority. Keep labels in live HTML, not small raster text.
3. **Parallel possibilities:** PDF 40 gives reuse/recycle/disposal separate labelled columns. PSI must retain its seven anticipated-fate categories, optionality and unknowns; three columns are inspiration, not a new fate model.

Do not copy: repeated large blank-phone decoration (many production pages), cursive explanatory text, tiny paragraph blocks, forced timed reveal, glowing emphasis as evidence strength or burning-Earth imagery (PDF 41–46). Static captured sequences suggest progressive text addition; motion/timing remain unreviewed. Numbers are mainly inline bullet text, not demonstrated quantitative charts. Palette consistency and section chips help grouping but do not prove comprehension. Underlying text/labels must remain available without colour or animation.

No new Research task is justified merely to validate numbers unnecessary for the selected layout. Reuse accepted figures and keep the source record for a specifically authorized future question.

## Human validation and engineering checks

Keep the Owner-arranged voluntary 10–15 minute modular walkthrough. Original feedback remains private; GitHub gets only necessary anonymous paraphrases. Record URL, exact build or UNKNOWN, device/browser/language, stages actually reached, voluntary stopping and any assistance. No names, contact/religion, personal raw answers, audio/video/screen recording, analytics/cookies/session history, decision-change statistics or storage changes.

Use short open prompts before explanation: purpose; comparison established/unknown; lifecycle/system relationship; what reflection asks; freedom of final choice. Do not show internal expected answers. Record each as “explained in own words”, “unclear”, “not reached” or “declined”, with anonymous observation and HQ interpretation in separate fields; no participant grade or aggregate success claim. Not reaching an optional/conditional stage is a coverage limit, not failure. Record findability and interruptions; duration is context, not a target. Different builds are not a controlled before/after study.

Refresh the existing participant kit only with neutral teach-back wording; add an internal observation supplement here, without rewriting #182's historical build evidence. Internal fields: concept/page actually seen; participant paraphrase without private content; assistance before explanation; concrete lost-place/error event; source/build limits; HQ classification; next proposed action.

Task-specific engineering: keyboard/focus and native disclosure behaviour, 320px/390px reflow and zoom as relevant, 1280px rendering, no page/console errors, preserved output/state invariants. Routine pinned CI owns app regression. LCP/INP/CLS may be locally diagnosed if a specific performance problem appears; no current numbers or “passes Core Web Vitals” claim. No monitoring or new performance/animation workstream.

## Disposition

Proceed with R1's layout-only slice under existing semantics and independent review. Refresh the neutral kit now under current Owner authority. R1b/R2–R5 remain prioritized candidates, not a blanket redesign authorization; later tasks need precise mapping and fresh intake. No fresh Research/AP task is needed for the selected DOM relocation. Real scientific/AP ambiguity routes to specialists, not Cursor invention. Default Grok 4.7 Medium with moderate reasoning is sufficient for the bounded relocation; no model-selection checkpoint or spending. Human observations remain an external dependency. Video reference receipt is complete; motion/underlying scientific-source validation is not.
