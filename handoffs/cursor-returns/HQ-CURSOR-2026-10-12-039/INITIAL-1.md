# Cursor return — HQ-CURSOR-2026-10-12-039 / INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated implementation head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-12-039`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/120
- PR: recorded in the Cursor executor return after the pull request is opened
- Branch: `cursor/hq-cursor-2026-10-12-039-integrate-smartphone-protect-four-site`
- Dispatch / cycle: `HQ-CURSOR-2026-10-12-039 / INITIAL-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/120#issuecomment-6118501249

## SHAs

- Starting `origin/main` SHA: `174e17a34ee9c2b562e3111d0b3af2bb8f7babe7`
- Prior reviewed head: not applicable (initial implementation)
- VALIDATED_IMPLEMENTATION_HEAD: `455810ede5cebea5c687b72a6880e3325126138a`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Authorized scope implemented

The Protect Four homepage now has one compact section after the framework and before the papers. It links to the existing `/smartphone` route. The shared navigation still names that route “Phone inquiry” and still links back to `/#top`.

The section says the experience is an inquiry through situation, reflection, comparison, conditional pathways, otherness, and the user’s own final choice. It says the inquiry does not recommend a purchase, does not prove the Protect Four proposition, and is not a complete life-cycle assessment.

No smartphone state, evaluator, AP module, empirical module, contract, registry, source package, or final-choice identity was changed. Journey was not rewritten. No ranking, recommendation, score, causal attribution, persistence, account, analytics, payment, vendor link, or network service was added.

## Changed implementation files

- `app/src/components/phone-inquiry-bridge.tsx`
- `app/src/routes/index.tsx`
- `app/scripts/phone-inquiry-bridge.test.mjs`

`app/src/components/site-nav.tsx`, `app/src/routes/smartphone.tsx`, `app/src/routes/journey.tsx`, `app/src/routeTree.gen.ts`, accepted smartphone semantic modules, dependencies, and the lockfile were not modified.

## Validation toolchain

- Node: `v22.14.0`
- npm: `11.19.0`
- TypeScript: `5.9.3` (`npm ls typescript --depth=0`)
- Install: `npm ci --ignore-scripts` → exit 0
- Lockfile SHA-256: `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188` (unchanged; no tracked lockfile diff)
- `npm test` → exit 0
  - scripts: 573 pass / 0 fail / 0 todo
  - TypeScript tests: 50 pass / 0 fail / 0 todo
- `npm run typecheck` → exit 0
- `npm run build` → exit 0

## Browser / accessibility

Checked against the local dev server with reduced motion, at 390×844 and 1280×800.

- The homepage bridge is visible at both widths. Copy matches the inquiry and non-recommendation boundary.
- One `main`. The page `h1` remains the Protect Four proposition. The bridge heading is an `h2`.
- The call to action’s accessible name is “Begin the phone inquiry” and its href is `/smartphone`.
- Tab from the last framework link lands on that call to action at both widths. Enter opens `/smartphone`.
- Focus shows a visible ring (`box-shadow` not `none`).
- Horizontal overflow is 0 on `/`, `/smartphone`, and `/journey` at both widths.
- `/smartphone` renders the existing situation stage, with later stages through User choice still marked not yet part of this step. “Phone inquiry” is `aria-current="page"`. The Protect Four mark still links to `/#top`.
- `/journey` still renders its existing heading.
- Reduced motion stays in force: the call to action’s computed animation is `none`, and its computed transition duration is `1e-05s` (the global `0.01ms` reduced-motion override).
- A first cold 390 load logged a Vite `504 Outdated Optimize Dep` and a failed dynamic import of the TanStack Start client entry. Reload and the later 390 and 1280 passes had no console or page errors. The pages had already rendered on the cold load.

## Preserved gaps

- No end-to-end walk of every smartphone stage. That remains the later QA task.
- No persistence, account, analytics, hosting, or public-beta work.
- Durable Issue status was not written. This runtime has no native Issue-write action.

## Discrepancies

- The first cold 390 dev-server load produced a transient Vite optimizer 504. It did not recur on reload or on the 1280 pass.

## Result

- Self-merge: NO
- Executor result: `VERIFIED_FOR_HQ_REVIEW`
