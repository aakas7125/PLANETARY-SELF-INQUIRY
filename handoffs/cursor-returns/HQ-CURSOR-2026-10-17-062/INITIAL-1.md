# HQ-CURSOR-2026-10-17-062 INITIAL-1 return

- Task ID: HQ-CURSOR-2026-10-17-062
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/196
- PR: the single linked PR for branch cursor/hq-cursor-2026-10-17-062-stacked-evidence-cards
- Cycle: INITIAL-1
- Starting main SHA: 7e7d28dc4b02fd72823c6c14d52ab23768e30e8b
- VALIDATED_IMPLEMENTATION_HEAD: 0f06174ea70a3c985d3777d9300448ebec191848
- EVIDENCE_RETURN_HEAD: the commit adding this file, frames and lease update (handoffs/ only)
- Self-merge: NO
- Executor result: VERIFIED_FOR_HQ_REVIEW

## Changed implementation files
- app/src/components/smartphone-comparison.tsx only (local ComparisonCard render helper; result-card presentation only). No test, producer, evaluator, state, package, lockfile or shared SourcesAndLimits change.

## Presentation implemented
- Single column, same order; h3 label unchanged with neutral bottom border and whitespace separation.
- Body paragraphs: text-base, relaxed leading, max-w-prose. First paragraph of every card gets font-medium (same rule for all cards; no flag use).
- A paragraph exactly equal (Set membership) to an existing card.values[].line gets a neutral inset (border-l, background, padding) at prose scale. No parsing/index/keyword logic.
- SourcesAndLimits helper untouched, still visible after all body paragraphs; generic null source stays absent. Heading, order note, period statement, boundary, later note, Continue and #195 guide/links untouched.

## Validation (Node v22.14.0, npm 11.19.0 via /tmp prefix, locked)
- npm ci --ignore-scripts: exit 0; package-lock.json SHA-256 104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188 unchanged
- npm test: exit 0 (scripts 629 pass / 0 fail; TS 62 pass / 0 fail)
- npm run lint: exit 0; npm run typecheck: exit 0; npm run build: exit 0
- Baseline-versus-candidate: built baseline (7e7d28d) and candidate served locally and driven through the real UI (reduced motion) for G1, I1, M1 per the HQ mapping, at 390, 1280 and 320 widths. For each, card h3, ordered body paragraphs, source heading and source paragraphs are identical strings between baseline and candidate; every string is present in the HQ mapping file. Counts: G1 7 body/0 source; I1 8/0; M1 10/8 with "Sources and limits" visible. Generic cards have no source section. I1 missing-service statements precede numeric paragraphs. No tabindex introduced on cards. No page/console errors; no horizontal overflow at 390/1280.
- Producers (comparison-ux.mjs etc.) are unmodified, so values/decisions/evaluatorInputs/state are identical by construction; existing semantic tests pass unchanged.
- Frames: INITIAL-1-{before,after}-{390,1280}-{G1,I1} subset plus after M1 at 390/1280 in this directory.

## Preserved gaps / discrepancies
- Pre-existing: at 320 width the page has 33px horizontal overflow on both baseline and candidate (identical; not from the cards, not fixed here).
- Keyboard Tab/Enter, 200% zoom and screen-reader checks were not exhaustively performed beyond confirming cards add no focusable/tabindex elements and no focus-related code changed. No WCAG or comprehension claim.
- Routine CI: PENDING (owned by HQ).
