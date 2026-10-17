# HQ-CURSOR-2026-10-17-062 CORRECTION-1 return (verification-only)

- Task ID: HQ-CURSOR-2026-10-17-062
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/196
- PR: #197 (https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/197); branches cursor/hq-cursor-2026-10-17-062-stacked-evidence-cards and runtime alias cursor/cursor-execution-protocol-9093 (same head)
- Cycle: CORRECTION-1 (HQ review 5558072259)
- Starting main SHA: 91b94ac6021a97b5cceeec65cb4cbf4cb07961c0
- Prior reviewed head: 86b063b00a430175374e3ce0db87d41991b13a20
- VALIDATED_IMPLEMENTATION_HEAD: 86b063b00a430175374e3ce0db87d41991b13a20 (app unchanged; app tree f782b075f889fe860bdf76163d8aef6c2d63eca2 identical at 86b063b and at the lease commit that was built and tested)
- EVIDENCE_RETURN_HEAD: the commit adding this file and PNGs (handoffs/ only)
- Changed implementation files this cycle: none. No app, test, package or lockfile change.
- Exact-head routine CI: run 39037267749 on 86b063b completed success (reused; no replay).
- Self-merge: NO
- Executor result: VERIFIED_FOR_HQ_REVIEW

## Method
Built candidate (npm ci --ignore-scripts, npm run build; Node v22.14.0, npm 11.19.0) served with scripts/start-public-profile.mjs on 127.0.0.1:8081. Baseline = built origin/main (91b94ac; app changes since #195 are none other than R1b) on 8082. Headless Chrome via Playwright, real UI walked from /smartphone, keyboard only for the checked actions (Tab, Shift+Tab, Enter via page.keyboard). G1 and I1 states from the HQ mapping at 390x844 and 1280x800; M1 for source content. Sticky header = `header` element (position sticky); "under header" means focused element top < header bottom.

## Keyboard (G1 and I1, 390 and 1280; all four identical except where noted)
| Action | Expected existing behaviour | Observed |
|---|---|---|
| Tab from h1 | first stop is "Explore the phone lifecycle and sources" link | yes, visible, not under header |
| Enter on that link | native hash jump to guide h2 `#comparison-lifecycle-guide` (tabindex -1), focus moves there | active element = that h2, top 128 (header bottom 113 at 390, 65 at 1280), visible, not obscured |
| Tab to "Back to comparison inputs", Enter | jump to `#comparison-inputs` legend, focused | legend focused, top 128, visible; horizon `4` kept; remaining service `4` (G1) / empty (I1) kept; pathway still checked |
| Tab from horizon to Continue | candidate buttons, remaining-service input and Not sure, fate input, Back to inquiry, Reset comparison, Continue | 14 stops, all in viewport and not under header; 0 stops on card article/p/h3 (no tab stops added to cards) |
| Shift+Tab x4 from Continue | reverse order | Reset, Back to inquiry, fate input, then "Not sure about remaining service without repair" |
| Enter on Continue | existing navigation to "Impact and dependency pathways", h1 focused | yes |
| Enter on impact "Back to comparison" | return to comparison h1, state kept | h1 focused; horizon and remaining service preserved |
| Enter on "Back to inquiry" | existing navigation to Inquiry | yes ("Inquiry", focus on "Your answers" h2) |
| Enter on "Reset comparison" (M1 run, 390) | intended clearing | horizon "", no pathway checked, no results section; focus stays on Reset; baseline identical |

Known limitation, unchanged by R1b: at 390 only, Shift+Tab onto "Not sure about remaining service without repair" scrolls it to top=94, under the 113px sticky header (G1 and I1). Baseline (origin/main) shows the identical top=94 result for I1 at 390. It is in the unchanged form, not the cards. At 1280 it is not obscured (top 145 vs header 65). Not repaired here.

## Source content and links
M1 result card: "Sources and limits" h4 is visible, not inside `details`, 8 source paragraphs; 0 links, 0 buttons, 0 tabindex elements and 0 `details` inside result cards on both baseline and candidate. No source links exist to test; none invented.

## 200% zoom equivalent and 320 reflow
Mechanism: not a browser-zoom UI test. Emulation: a 1280x800 window at 200% zoom = CSS viewport 640x400 with devicePixelRatio 2; a 640-wide window at 200% = CSS 320x400, dpr 2; plus plain 320x700 dpr 1.
| CSS viewport | candidate vs baseline (G1, I1, M1) |
|---|---|
| 640x400 dpr2 | doc horizontal overflow 0 in both; no clipped paragraphs, no card child overflow, no line clamp; all card paragraphs wrap; I1 missing-service lines then Production/Distribution insets with qualifiers intact (frame) |
| 320x400 dpr2 and 320x700 dpr1 | doc overflow 33px in both baseline and candidate for every scenario; card child overflow 0 and clipped paragraphs 0 in both; no page/console errors |
The 33px overflow is attributable to one unchanged element: the "Continue to impact and dependency pathways" button (outside the cards; only element extending past the viewport in the scan). Same on baseline. Retained as a pre-existing limitation; global repair is outside R1b.

## Frames (this directory)
- CORRECTION-1-after-390-I1-unobscured.png: I1 card heading, missing-information statements, Production/Distribution insets below header.
- CORRECTION-1-after-zoom200-I1.png: I1 at the 200% equivalent (CSS 640x400, dpr2).
- CORRECTION-1-after-320-I1.png: I1 at 320.
- CORRECTION-1-kb-I1-390-continue-focus.png: keyboard focus on Continue at 390.

## Preserved gaps / discrepancies
- 33px whole-page overflow at 320 (Continue button), baseline identical.
- Sticky-header reverse-focus obscuring at 390 on the "Not sure" button, baseline identical.
- No screen-reader audit, comprehension study or whole-site WCAG claim. No browser-native zoom UI test.
- No discrepancy from INITIAL-1 results; no R1b-caused regression found.
