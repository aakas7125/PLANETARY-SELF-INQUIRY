# Cursor return — HQ-CURSOR-2026-10-17-064 CORRECTION-1 (RETRY-1)

- Task ID: HQ-CURSOR-2026-10-17-064
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/206
- PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/207 (reused; branch and alias cursor/cursor-execution-protocol-2590 pushed at common head)
- Cycle: CORRECTION-1, recovery RETRY-1 (HQ review 5559599988). No INITIAL-1 replay.
- Starting main SHA (origin/main at claim): 79616dbea40c0c2f83364de0c1a84871ea26d6e8
- Prior reviewed head: 6c7e8458b1b8be4288c8bdea032d578d01bd4daf
- VALIDATED_IMPLEMENTATION_HEAD: 2c01b730aa89a9bcccd36adf1d285340b923b31f (code last changed in aefea3269cb245033b8a034872137eb25f64202f; 2c01b730aa89a9bcccd36adf1d285340b923b31f only edits README prose, validated tree otherwise identical)
- EVIDENCE_RETURN_HEAD: branch head after this evidence-only commit (handoffs/ only)

## Changed implementation files
- design-prototypes/HQ-CURSOR-2026-10-17-064/src/CandidateGuide.tsx
- design-prototypes/HQ-CURSOR-2026-10-17-064/render-probe.mjs
- design-prototypes/HQ-CURSOR-2026-10-17-064/README.md
Evidence: handoffs/cursor/HQ-CURSOR-2026-10-17-064-prototype-review.md (updated), CORRECTION-1-*.png (5 frames), lease CORRECTION-1.md. No change to app/**, package files, lock, contracts, sources.

## Findings addressed
1. 320 label split: Show/Hide stage text moved under the title; "Components" renders on one line; probe asserts no single-word label wraps (candidate, all viewports).
2. Rail ends at stage 4; stages 5-8 unconnected decorative nodes; one neutral bracket on 1-4; probe asserts line/bracket flags [1,1,1,1,0,0,0,0].
3. Probe asserts overflow/clipping (candidate <= control), zero page/console errors, vertical and horizontal focus visibility after settling.
4. Frames: 320 candidate+control, 390/1280 production-context, 390 stages 5-7 unconnected.

## Toolchain and validation (final implementation)
- Node v22.14.0; npm 11.19.0 (temp prefix; system npm 10.9.9 cannot run npm ci here). TypeScript not separately run (no app change; vite build of prototype succeeded).
- `npm ci` in app/: exit 0. package-lock.json SHA-256 104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188 (unchanged); no diff in app/ or package files vs origin/main.
- `node build.mjs`: exit 0. `node verify-parity.mjs`: PASS (180 text rows, 10 links, 147 exact lines, previews 0/0/0/0/3/5/1/0, 8 stage ids in order).
- `node render-probe.mjs --frames ...`: exit 0 with the new assertions (overflow 0 / clipped 0 in all 24 states, zero errors, no broken labels, rail structure, keyboard order/Enter/Space/focus ring/in-viewport X and Y, anchor focus).
- Lifecycle regression `node --test scripts/smartphone-lifecycle-presentation.test.mjs`: 6 tests, 6 pass, 0 fail.
- Full app test/typecheck/build NOT rerun: app tree unchanged (Issue permits). Routine hosted CI state not inspected by the runtime; likely absent for these paths.

## Measured page length (control -> candidate, closed): 390 +273px, 1280 +394px, 320 +299px, 640 +371px. Details in the review report.

## Omitted / limits
No native zoom, screen reader, WCAG, sticky-header (#195) or human comprehension testing.

## Preserved gaps / discrepancies
None in guide data. Candidate remains a separate component (divergence risk mitigated by parity script). Page length grew versus INITIAL-1 (reported).

Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
