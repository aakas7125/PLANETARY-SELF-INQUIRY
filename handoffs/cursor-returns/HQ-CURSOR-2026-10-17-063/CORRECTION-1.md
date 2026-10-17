# Return: HQ-CURSOR-2026-10-17-063 CORRECTION-1
Task ID: HQ-CURSOR-2026-10-17-063
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/199
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/202 (reused; branch alias cursor/cursor-execution-protocol-05c1 pushed at the same head as the deterministic branch; no new PR)
Cycle: CORRECTION-1 (verification/regression completion)
Starting main (this cycle): d8a1c16002a1ca6d9bec588ed54f423ce656c39c
Prior reviewed head: ba5c6c805f46dd1da86ed33d72b56dec4233d569
Baseline for comparison: 478c05b1cbca05ab3f4ccd827e1e2431ec92ddfb (built in a separate worktree, port 8082)
VALIDATED_IMPLEMENTATION_HEAD: fbaa9c39fd64037c8b972916487827da4e35853f
EVIDENCE_RETURN_HEAD: see PR head (evidence-only: this file, CORRECTION-1 lease, CORRECTION-1-*.png)
Changed implementation files this cycle: app/scripts/r2-navigation-probe.mjs (new, not matched by npm test glob). The seven INITIAL-1 source edits are unchanged; no source defect was demonstrated.
Toolchain: Node v22.14.0, npm 11.19.0 (via temp prefix), install: npm ci exit 0, package-lock sha256 104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188 (unchanged), package.json unchanged
Validation at validated head: npm test 629/0 + 62/0 exit 0; typecheck exit 0; build exit 0; lint exit 0
Probe: PREVIEW_URL=http://127.0.0.1:8081 EXPECT=candidate node scripts/r2-navigation-probe.mjs  -> exit 0, 0 assertion failures, 0 page/console errors, 0 horizontal overflow in all 8 runs. Baseline run (EXPECT=baseline, :8082) records only.
Matrix: 390, 1280, 320, 640-wide (200%-equivalent, viewport emulation only, NOT browser-native zoom) x normal / prefers-reduced-motion.

## 1. Arrival (target, offset, settled time; baseline -> candidate, max per run)
- html scroll-behavior: smooth (normal) / auto (reduced) in both builds (global CSS untouched).
- Situation submit -> result and Back to situation (the only long travel): normal motion baseline 349-571 ms smooth travel (17-28 scroll samples) -> candidate 38-85 ms single jump (1 sample). Reduced motion: both ~40-98 ms single jump.
- Continue to inquiry (forward stage), AP next question, AP previous question: already ~0-55 ms in baseline at these viewports (page height shrinks on remount); candidate 0-57 ms. 640-wide normal motion baseline 270-285 ms -> candidate 39-45 ms.
- Same meaningful target in baseline and candidate: forward stage and AP questions land on the question/stage H2 (top 368 at 390; 341 at 1280; below sticky header bottom 113/65); comparison stage arrival lands on H1. No drift observed (final scroll positions equal).
- Ordinary user scroll unchanged (scrollTo to 1500 smooth: ~640 ms normal, ~14 ms reduced, both builds).
- #195 native anchors unchanged: explore -> #comparison-lifecycle-guide y=5576, return -> #comparison-inputs y=635, identical baseline/candidate (390).

## 2. Focus and helper
- Helper: comparison-horizon aria-describedby=comparison-horizon-helper, id count 1, accessibility-tree description equals the visible helper text; accessible name unchanged; helper text, value and aria-invalid (true for "abc") identical to baseline. Baseline had no description.
- Keyboard Enter on Edit answers: baseline focus BODY -> candidate focus on first situation legend (top 128, below header) at all viewports. Next Tab -> first radio of Q1 (top 271 at 390). Shift+Tab -> header nav link "Principles" (natural document order; header link itself is the sticky header, not occlusion).
- Mouse Edit: baseline BODY -> candidate first legend (below header). Ordinary radio change keeps focus on the radio (no focus stealing). Edit after a deeper journey (downstream Edit): focus on first legend.

## 3. State
Baseline and candidate snapshots (radios, text inputs, checkboxes, stage list, buttons, h1) are identical for: situation before edit, after keyboard Edit, after mouse Edit, comparison state, Back to inquiry, return to comparison, Reset comparison, and downstream Edit. Selections retained after Edit; Edit clears inquiry answer ("" ) and comparison horizon/pathway selections (action-specific invalidation) in both builds; Reset comparison clears as intended.

## 4. Frames (synthetic, 390/1280): CORRECTION-1-{390,1280}-after-edit-focus.png, CORRECTION-1-{390,1280}-stage-arrival-inquiry.png, CORRECTION-1-390-comparison-helper.png

## Preserved baseline gaps (unchanged, not regressions)
- 320 / 640-wide: Situation submit button arrival top is under the sticky header (belowHeader=false) identically in baseline and candidate.
- Back from inquiry Q1 to situation leaves focus on BODY in baseline and candidate (outside authorized R2 edits; Back button unmounts).
- Form onFocus scrollIntoView on ordinary Tab is intentionally unchanged.
- One baseline-only probe flake (click not registering during smooth scroll at 320/reduce) was baseline smooth/focus-state related; candidate had none.
Omitted: browser-native zoom, human comprehension / WCAG conformance claims, deployment. Full CI is owned by pinned routine CI.
Discrepancies: none.
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
