# HQ-CURSOR-2026-10-17-064 — R3 connected lifecycle prototype review

Recommendation (CORRECTION-1, supersedes INITIAL-1 numbers and rail description): **ACCEPT AS PROTOTYPE**; the INITIAL-1 revise item (rail continuing through stages 5-8) is now implemented. Remaining caveats are listed below. Production adoption is a separate later HQ/Owner decision; nothing here is promoted into the app.

Prototype and reproduction commands: `design-prototypes/HQ-CURSOR-2026-10-17-064/` (README). Frames: `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-064/CORRECTION-1-*.png` (revised candidate and 320 control) and unchanged control frames `INITIAL-1-control-390-...` / `INITIAL-1-control-1280-...`.

## What was built
- Control: the real accepted `SmartphoneLifecycleGuide`, rendered unmodified. Candidate: separate component fed by the same `describeLifecycleGuide()` call; same per-stage disclosure markup; only layout changes.
- Candidate layout: always one column in reading order 1–8; thin vertical rail with a node per stage; stages 1–4 bracketed by a thicker rail segment with an `aria-hidden` label reusing the existing string "Generic new production". The production article and its Sources disclosure stay above, unchanged. Native `details`/`summary` remain the only controls. No arrows, no scaled encodings, no new copy.

## CORRECTION-1 changes (layout only; strings, DOM order, native details/summary, focus unchanged)
1. Narrow header: the fixed "Show stage"/"Hide stage" text moved from a right-hand column into the label column beneath the stage title, so the title uses the full width left of the icon. At 320 px "Components" now renders on one line (frame `CORRECTION-1-candidate-320-grayscale-components-open.png`; the control, which keeps the toggle text at the right, is in `CORRECTION-1-control-320-grayscale-components-open.png`). The probe now asserts that no single-word stage label wraps onto a second line at 390/1280/320/640 in the candidate.
2. Rail: connecting line runs only through stages 1-4 and ends at the stage 4 node. Stages 5-8 have an unconnected decorative node each and no bracket. One neutral bracket (fixed thickness, no area/size meaning) with the existing "Generic new production" label stays on 1-4. Probe asserts line/bracket presence is exactly [1,1,1,1,0,0,0,0] and every stage keeps a node.
3. Probe: added assertions (candidate overflow and clipped-element counts must not exceed control in every measured state/viewport; zero page/console errors; no mid-word label split; vertical as well as horizontal focus visibility after waiting 400 ms for scroll to settle, in addition to ring/order/Enter/Space).
4. Frames: revised 320 candidate plus 320 control; 390 and 1280 candidate with production article, the "Generic new production" scope and group bracket visible above stages 1-3; 390 candidate showing stage 4 end of group and stages 5-7 unconnected.

## Measured (rendered Chrome, harness only; this run, final implementation)
Parity (`verify-parity.mjs`, collapsed and all-open): 180 text rows with visibility, 10 links, heading outline, per-stage SVG glyph paths and 8 stage ids/order identical between control and candidate; 147 exact guide lines asserted; collapsed previews 0/0/0/0/3/5/1/0 in both. Production 25-70 kg CO2e appears only as the whole-production line; 2-4 kg CO2e distribution, 4 (2-8) kWh/year charging, 7.61 / 2-year ADEME reference and global context are in the same stages as in control.

Page height, closed / Components open / all open (control -> candidate, px; delta):
- 390: 2515->2788 (+273) / 3415->3734 (+319) / 10087->10903 (+816)
- 1280: 1836->2230 (+394) / 2593->2903 (+310) / 7441->7712 (+271)
- 320: 2909->3208 (+299) / 3923->4382 (+459) / 11708->13368 (+1660)
- 640 (width proxy for 200% of 1280): 1927->2298 (+371) / 2684->2971 (+287) / 7555->7917 (+362)
Closed-guide length is therefore +11% (390), +21% (1280), +10% (320) vs control; larger than INITIAL-1 (+195/+250) because the toggle text now takes its own line under each title and the always-single-column layout remains. This is measured in the harness only.

Zero horizontal overflow and zero elements outside the viewport in all 24 measured states (control equal); zero console/page errors. Keyboard at 390 (both variants): Tab visits production disclosure then stages 1-8 in order, Shift+Tab reverses, Enter opens/Space closes; every stop had a computed focus ring and stayed inside the viewport both horizontally and vertically after scrolling settled. Hash navigation to the guide heading focused it in both. No sticky header in the harness, so #195 sticky-header behavior was not re-tested.

## What the rail communicates, and what stays ambiguous (design hypothesis, not measured)
- Communicates: one reading order of 8 items; stages 1-4 share one production boundary (consistent with the existing production sentence), shape- and label-based so it survives grayscale. Stages 5-8 are visibly outside the bracket and not joined by a line.
- Still ambiguous: nodes in a vertical column still imply reading order; the bracket could still be read as importance despite the "not additive shares" banner; the bracket label is aria-hidden so assistive technology gets no group information (not tested with a screen reader). The loose line-end after stage 4 may look like an unexplained break; not tested with people.
- Scanning: more scrolling in the closed state (see page lengths) in exchange for predictable single-column order and no mid-word header splits at 320.

## Remaining limits
No native browser zoom, screen reader, WCAG, sticky-header or human comprehension testing. Production adoption is a separate later HQ/Owner decision; no production code changes were made. Control guide baseline gaps are untouched.
