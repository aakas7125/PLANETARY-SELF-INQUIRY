Task ID: HQ-CURSOR-2026-10-15-049
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/153
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/154
Cycle: INITIAL-1
Starting main SHA: 819b6ce382da29ea95b0869b487d6d1ef083a089
Issue-named ancestor: 8521b81e73fa6e8c5214697e886d370c09d011b0
VALIDATED_IMPLEMENTATION_HEAD: fad071b81d08825c31c0b64c3dae4aba4f7c025b
EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact, the INITIAL-1 screenshots, and the same cycle's run lease (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)
Branch: cursor/hq-cursor-2026-10-15-049-smartphone-model-evidence

Authorized scope implemented:
Optional current-phone and candidate-new identity on the comparison screen. The only exact matches are Fairphone 5 (MS-CLIMATE-FAIRPHONE5-S2-V0), Samsung Galaxy S25 EUR (MS-CLIMATE-GALAXY-S25-EUR-S3-V0), and Apple iPhone 16 128 GB (MS-CLIMATE-IPHONE16-128GB-S4-V0), plus explicit generic smartphone evidence. No model is preselected. An exact candidate replaces production and the source transport, distribution, or transportation phase on both replacement.new and decision.new. Points stay points, approximations stay approximate, and the iPhone end-of-life value stays below 0.56. Whole-life, use, and end-of-life values are reference text only. Current-phone production is historical and creates no credit. Unknown, unmatched, and the synthetic approved_registry_match marker do not become those records. The generic lifecycle guide is unchanged and is not rewritten as a model history. Repair sub-records are stored and are not applied from identity. The generic-new climate basis clears for an exact candidate and returns only from a current generic evaluation. Model edits clear otherness and final choice. Inquiry answers are not rewritten.

Changed implementation files:
- app/src/lib/smartphone/model-evidence.mjs
- app/src/lib/smartphone/input-decision.mjs
- app/src/lib/smartphone/comparison-ux.mjs
- app/src/lib/smartphone/ap-otherness-ux.mjs
- app/src/lib/smartphone/final-choice-ux.mjs
- app/src/components/smartphone-comparison.tsx
- app/scripts/smartphone-model-evidence.test.mjs

Validation toolchain:
- Node v22.14.0
- npm 11.19.0
- TypeScript 5.9.3
- Install: corepack npm 11.19.0 ci --ignore-scripts, exit 0
- Lockfile SHA-256 104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188 unchanged
- npm test exit 0: scripts 605 pass / 0 fail; TypeScript 50 pass / 0 fail
- npm run lint exit 0
- npm run typecheck exit 0
- npm run build exit 0

Rendered evidence:
Built profile at http://127.0.0.1:8081/smartphone, viewports 390×844 and 1280×800. No model preselected. Generic new alternative showed 25–70 and 2–4. Samsung Galaxy S25 EUR showed about 40.22 and about 2.38, with the unknown use period kept unknown. Fairphone 5 current-phone history showed 32.70 outside the candidate card. Deselecting the candidate restored 25–70. Horizon 4 and remaining service 2.50 stayed. The first inquiry answer stayed exact. Overflow 0. No page errors. Screenshots: INITIAL-1-390-generic.png, INITIAL-1-390-exact.png, INITIAL-1-1280-generic.png, INITIAL-1-1280-exact.png.

Preserved gaps:
Fairphone repair sub-records are not selectable in this slice. Source use and end-of-life values are not mapped into the user horizon. No grid factor, avoided-production credit, or model-specific climate projection was added. The eight-stage guide remains generic.

Discrepancies:
The Issue named starting main 8521b81e73fa6e8c5214697e886d370c09d011b0. Execution started at current origin/main 819b6ce382da29ea95b0869b487d6d1ef083a089, which contains that merge. No native Issue-write or PR-body update was used. The PR may remain draft. Durable Issue status was not changed.

ROUTINE_CI: PENDING
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
