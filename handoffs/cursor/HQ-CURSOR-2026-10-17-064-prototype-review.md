# HQ-CURSOR-2026-10-17-064 — R3 connected lifecycle prototype review

Recommendation: **ACCEPT AS PROTOTYPE, with one revise item** (below). Production adoption is a separate later HQ/Owner decision; nothing here is promoted into the app.

Prototype and reproduction commands: `design-prototypes/HQ-CURSOR-2026-10-17-064/` (README). Frames: `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-064/INITIAL-1-*.png`.

## What was built
- Control: the real accepted `SmartphoneLifecycleGuide`, rendered unmodified. Candidate: separate component fed by the same `describeLifecycleGuide()` call; same per-stage disclosure markup; only layout changes.
- Candidate layout: always one column in reading order 1–8; thin vertical rail with a node per stage; stages 1–4 bracketed by a thicker rail segment with an `aria-hidden` label reusing the existing string "Generic new production". The production article and its Sources disclosure stay above, unchanged. Native `details`/`summary` remain the only controls. No arrows, no scaled encodings, no new copy.

## Measured (rendered Chrome, harness only)
Parity (`verify-parity.mjs`, collapsed and all-open): 180 text rows with visibility, 10 links (href/label/aria-label/rel), heading outline, per-stage SVG glyph paths and 8 stage ids/order identical between control and candidate. 147 exact guide lines asserted present. Collapsed previews visible 0/0/0/0/3/5/1/0 in both. Production 25–70 kg CO₂e appears only as the whole-production line (stages 1–4 carry no own figure); 2–4 kg CO₂e distribution, 4 (2–8) kWh/year charging, 7.61 / 2-year ADEME reference and "Global · 2022 · annual mass flow" context are present in the same stages.

Page height, closed / one stage open (Components) / all open (control → candidate, px):
- 390: 2515→2710 (+195) / 3415→3656 (+241) / 10087→10825 (+738)
- 1280: 1836→2086 (+250) / 2593→2759 (+166) / 7441→7568 (+127)
- 320: 2909→3196 (+287) / 3923→4370 (+447) / 11708→13332 (+1624)
- 640 (width proxy for 200% of 1280): 1927→2154 (+227) / 2684→2827 (+143) / 7555→7773 (+218)

Zero horizontal overflow and zero elements outside the viewport in all 24 measured states; zero console/page errors. Keyboard at 390 (both variants): Tab visits the production disclosure then stages 1–8 in order; Shift+Tab reverses; Enter opens and Space closes the native disclosure; every stop had a computed focus ring and stayed inside the viewport. Hash navigation to the guide heading focused it (tabindex -1) in both. The harness has no sticky header, so #195 scroll-margin/sticky-focus behaviour was NOT re-tested here.

## What the rail communicates, and what stays ambiguous (design hypothesis, not measured)
- Communicates: one reading order, 8 items; stages 1–4 belong to the same production boundary (supported by the existing production sentence), and the grouping is shape- and label-based, so it survives grayscale (frame `candidate-320-grayscale-...`).
- Still ambiguous: a continuous line can read as "a phone travels this path". The line runs through stages 5–8 as well, so resale/second life and end of life could look expected or sequential for every handset. The bracket label is aria-hidden, so assistive technology gets no group information (the list itself is unchanged). The thicker bracket could be read as a larger or more important share of impact despite the existing banner that stages are not additive shares. Not tested with people.
- Scanning: always-single-column makes the closed guide 8–14% taller (390: +195 px, 1280: +250 px) but removes the two-column reflow where an opened stage jumps to full width; row order is more predictable. Trade-off: more scrolling on desktop.

## Revise item before any production patch
Consider ending the rail line after stage 4 and starting stages 5–8 with unconnected nodes, or dashing the line after the production group, to reduce the "every phone follows this path" reading. This changes only visual treatment; it was not prototyped to avoid scope drift.

## Known baseline gaps preserved, not repaired
The control guide is unchanged, so any existing baseline gaps in it remain; none were repaired. The human comprehension question remains unverified. No native zoom, screen-reader, WCAG or comprehension claim is made.
