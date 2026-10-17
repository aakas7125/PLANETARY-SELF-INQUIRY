# Cursor return — HQ-CURSOR-2026-10-17-064 INITIAL-1

- Task ID: HQ-CURSOR-2026-10-17-064
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/206
- PR: see branch `cursor/hq-cursor-2026-10-17-064-lifecycle-prototype` (PR title "[HQ-CURSOR-2026-10-17-064] Prototype connected lifecycle guide in isolation")
- Cycle: INITIAL-1 (new task; no prior head)
- Starting main SHA: e9d3227650ee033430aa31ee4c742101a7d7366d
- VALIDATED_IMPLEMENTATION_HEAD: 412e5857202c8c947c38ef0f0809acbf02416120
- EVIDENCE_RETURN_HEAD: the head of the branch after this file's commit (evidence-only; changes only handoffs/)
- Runtime note: the runtime may also push the same head to an alias branch `cursor/cursor-execution-protocol-2590`.

## Changed paths
- design-prototypes/HQ-CURSOR-2026-10-17-064/** (README.md, build.mjs, harness-server.mjs, verify-parity.mjs, render-probe.mjs, control.html, candidate.html, src/*). Built `dist/` is not committed.
- handoffs/cursor/HQ-CURSOR-2026-10-17-064-prototype-review.md
- handoffs/cursor-returns/HQ-CURSOR-2026-10-17-064/INITIAL-1.md and INITIAL-1-*.png (6 frames)
- handoffs/cursor-runs/HQ-CURSOR-2026-10-17-064/INITIAL-1.md
- No change to app/**, package.json, package-lock.json, contracts, sources.

## Toolchain and validation
- Node v22.14.0; system npm 10.9.9 cannot run `npm ci` here, so npm 11.19.0 (installed to a temp prefix) was used.
- `npm ci` in app/ with npm 11.19.0: exit 0. package-lock.json SHA-256 104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188 (unchanged); `git diff origin/main -- app package*` empty.
- Lifecycle baseline regression `node --test scripts/smartphone-lifecycle-presentation.test.mjs`: 6 tests, 6 pass, 0 fail.
- Prototype `node build.mjs`: exit 0. `node verify-parity.mjs`: PASS (180 text rows, 10 links, 147 exact lines, preview counts 0/0/0/0/3/5/1/0, stage order of 8 ids). `node render-probe.mjs`: exit 0 (390/1280/320/640 measurements, keyboard, anchor).
- Full app `npm test` / typecheck / build were NOT rerun: app tree is unchanged from accepted d48217e3efcc290bee8218b22c257ce9fa3cd0d2 (Issue permits reuse of accepted CI). Routine hosted app workflow state: not checked from the runtime; app paths do not change, so it may be absent.
- Measurements and the recommendation are in handoffs/cursor/HQ-CURSOR-2026-10-17-064-prototype-review.md.

## Omitted / limits
No native browser zoom, screen reader, WCAG or human comprehension testing. Harness has no sticky header, so #195 sticky-header scroll/focus behaviour was not re-tested; hash focus of the guide heading was checked. 640 px width is a proxy for 200% zoom.

## Preserved gaps / discrepancies
None found in the accepted guide data. Candidate is a separate component with copied panel markup (divergence risk, mitigated by parity script). Revise item recorded in the review.

Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
