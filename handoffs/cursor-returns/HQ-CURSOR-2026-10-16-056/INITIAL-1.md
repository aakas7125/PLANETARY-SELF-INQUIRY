# HQ-CURSOR-2026-10-16-056 INITIAL-1

Task ID: HQ-CURSOR-2026-10-16-056
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/175
Cycle: INITIAL-1
Starting main SHA: a32b3627a99d13716543014da94c7f8fe1af75f6
Prior head SHA: none
VALIDATED_IMPLEMENTATION_HEAD: 803976bd2ca507896d8029a0b3c3778032b1819b
EVIDENCE_RETURN_HEAD: the commit that adds this return, the updated lease, and the INITIAL-1 screenshots
Branch: cursor/hq-cursor-2026-10-16-056-old-phone-fate
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/176
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

Durable Issue status was not written. No native Issue-write action is available. The PR body from the working lease was not updated.

## Scope implemented

One optional anticipated old-phone-fate question in empirical comparison. The adopted question, helper, seven public labels, unanswered / answered / explicit-unknown statuses, and limit text are the Research §3.2–3.3 strings. Canonical values stay internal. Unanswered is null. Explicit unknown stays `unknown`.

The question is shown once after the horizon and service facts, and before results, when new, refurbished, or used/second-hand is selected. It remains available when those facts are incomplete. Keep/repair-only hides it. One answer applies to the selected replacement set. Removing every replacement alternative keeps the raw answer in comparison memory and displays nothing; selecting a replacement again shows that answer. Comparison reset, and situation or inquiry actions that already reset comparison, clear it. Current-phone and candidate model changes keep the anticipated answer.

The answer is not passed to `buildPathwayEvaluatorInput`, `applyOldDeviceFate`, or the e-waste resolvers. Actual event, route, and time stay unknown. Establishment false means not established. Fate-only set and clear do not clear QSP, Otherness, or final choice. Existing comparison edits, including horizon and model changes, still clear that downstream state.

No contextual statistic, lifecycle-guide edit, new scientific sentence, resolver predicate, or lockfile change.

## Changed implementation files

- `app/src/lib/smartphone/comparison-ux.mjs`
- `app/src/components/smartphone-comparison.tsx`
- `app/scripts/smartphone-old-phone-fate.test.mjs`
- `app/scripts/smartphone-comparison-ux.test.mjs`
- `app/scripts/smartphone-primary-pathway-facts.test.mjs`

The comparison and primary-pathway assertions that rejected every radio in the comparison component now keep pathway inputs as checkboxes and allow the fate control to be one native radio group. Repair categories remain buttons.

## Validation

Toolchain: Node v22.14.0, npm 11.19.0 via corepack, TypeScript 5.9.3.

- `corepack npm@11.19.0 ci --ignore-scripts` exit 0
- lock SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188` unchanged
- `node --test scripts/smartphone-old-phone-fate.test.mjs scripts/smartphone-comparison-ux.test.mjs scripts/smartphone-primary-pathway-facts.test.mjs` exit 0 (27 pass / 0 fail)
- `node --test scripts/smartphone-input-contract.test.mjs` exit 0, including T19–T23, on this implementation before a comment-only JSDoc move
- `npm run typecheck` exit 0
- `npm run build` exit 0

Routine hosted CI owns the full pinned test, lint, typecheck, and build. On the validated implementation head it passed: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/actions/runs/38894116521
A later evidence-only commit can start another run. HQ rechecks that run if it is still going.

## Built profile

Server: built `.output` on 127.0.0.1:4177. Viewports 390×844 and 1280×800. Chrome headless.

Observed:

- Keep and repair only: fate field absent. Screenshot shows the repair facts, the missing-horizon note, and Reset, with no fate question.
- New selected and horizon empty: question, helper, seven labels, no selection, unanswered status, no limit, no result cards.
- ArrowDown from the first radio selected the second label. Focus stayed on a radio; the input outline was `auto`.
- Trade-in label wraps inside its control. Answered status, limit, and Clear answer are visible.
- Clear returns to unanswered and checks nothing. Explicit “I’m not sure” shows the explicit-unknown status, not the unanswered status.
- Used, refurbished, and new together keep one radio group and the same answer.
- Removing all three hides the field. Re-checking new shows the retained answer. Reset clears pathways and the question.
- Generic new, horizon 4, active-use answer: the result card does not repeat the fate label. Impact e-waste people and e-waste ecosystems stay “not established” and not filled in. Water remains conditional.
- QSP values `  raw QSP stays  `, `second literal`, and `third literal`, and Otherness `otherness raw stays`, remain after changing only the fate answer. Final seven options stay unselected.
- Changing the horizon to 5 clears those QSP and Otherness answers. Final options stay unselected.

Overflow 0 at the checked states. Page errors 0. Console errors 0. HTTP status >= 400: none. Requests to hosts other than 127.0.0.1: none.

Screenshots:

- `INITIAL-1-390-unanswered.png`
- `INITIAL-1-390-trade-in.png`
- `INITIAL-1-390-keep-repair-absent.png`
- `INITIAL-1-390-qsp-preserved.png`
- `INITIAL-1-1280-explicit-unknown.png`
- `INITIAL-1-1280-shared-answer.png`
- `INITIAL-1-1280-impact-ewaste-closed.png`
- `INITIAL-1-1280-choice-unselected.png`

The shared-answer frame is the single fate field, not the pathway checkboxes above it. The profile script had used, refurbished, and new selected when that field still showed one “I’m not sure” answer.

## Preserved gaps

No §8 contextual statistics. Eurostat Candidate 3 is not adopted here. The lifecycle guide is unchanged. Anticipated fate is not an e-waste resolver input. Legacy actual-route fixtures stay on their existing evaluator path. No German copy, PDF, homepage, Ledger, Constitution, hosting, or deployment change.

## Discrepancies

None in the authorized annotation behavior. The PR description can still say CURSOR_WORKING because this run cannot update the PR body. This return is the evidence channel.

Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
