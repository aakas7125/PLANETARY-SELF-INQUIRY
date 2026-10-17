# HQ-CURSOR-2026-10-17-061 INITIAL-1 return

- Task ID: HQ-CURSOR-2026-10-17-061
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/194
- PR: the single linked PR for this branch (see PR description)
- Cycle: INITIAL-1
- Branch: cursor/hq-cursor-2026-10-17-061-comparison-first
- Starting main SHA: 42fd87c28bfe9b56d2158bccc58fce4a0b7fbb8a (Issue named 1b1af15ac718b365a74fd9ac932ac95b73ece804 at publication; `git diff` between them is `project-state/TASK_QUEUE.md` only)
- VALIDATED_IMPLEMENTATION_HEAD: 6ab4a1034093ce9b853eb55d2751adf517e6b24a
- EVIDENCE_RETURN_HEAD: the commit that adds this file, the frames, and updates the lease (changes only `handoffs/`)
- Self-merge: NO
- Executor result: VERIFIED_FOR_HQ_REVIEW

## Implementation (D-017 / R1 only)

Changed implementation files:
- `app/src/components/smartphone-comparison.tsx`
- `app/src/components/smartphone-lifecycle.tsx` (one optional `headingId` prop; see reason below)

Changed test file:
- `app/scripts/smartphone-lifecycle-presentation.test.mjs` (only the comparison guide-before-form / guide-before-results assertions replaced)

What changed on the comparison page:
- The single shared `<SmartphoneLifecycleGuide headingId=... />` and the existing `view.modelGuideNote` paragraph now mount after the form and after the `view.evaluated` results conditional (after its existing Continue control), outside that conditional. Always rendered: empty, invalid, valid, keep-only.
- One native anchor "Explore the phone lifecycle and sources" directly after the opening paragraph, before the stage list, to `#comparison-lifecycle-guide`.
- One native return anchor "Back to comparison inputs" at the end of the guide block to `#comparison-inputs`, which is the `legend` of the alternatives fieldset (`tabIndex={-1}`, `scroll-mt-32`, visible `focus-visible` ring).
- No new state, routing, accordion, summary, or text other than the two labels. Impact guide mount (`<SmartphoneLifecycleGuide />`, before the pathway cards) and its assertion are unchanged. All guide, card, note and stage-disclosure text is unchanged.

Reason for the `headingId` prop on the guide component: a wrapper element around the guide is taller than the viewport; as a `tabIndex={-1}` target it produced unstable scroll/focus positions in an earlier iteration (target above the header, middle of the guide visible) and a ring around the whole guide. The existing `h2` heading is the only short, meaningful focus target and is inside the component, which a wrapper cannot reach. The prop is optional; without it the heading renders exactly as before (no id, no tabIndex, same classes), so Impact output is unchanged. With it the heading gets `id`, `tabIndex={-1}`, `scroll-mt-32`, and a visible focus ring. No refactor, no data or text change.

Test assertions replaced (comparison order only): old `guideMount < horizonMount` and `guideMount < evaluatedMount` are replaced by: exactly one guide mount; form (comparison-period input) before guide; evaluated results conditional and its Continue control before guide; model-guide note after the guide and singular; top link before the stage list; inputs target before the pathway legend; return link after the note; exact two labels each used once; `headingId` present on the component. All semantic fixtures/assertions, Impact order, shared-guide/no-input coupling and generic-access cases are preserved. Nothing skipped, deleted or weakened.

## Validation toolchain (final implementation head 6ab4a1034093ce9b853eb55d2751adf517e6b24a)

- Node v22.14.0, npm 11.19.0 (temp prefix to match the CI pin; system npm 10.9.9 cannot run `npm ci` on this lock), TypeScript 5.9.3.
- Install: `npm ci --ignore-scripts` from `app/` after removing `node_modules`: exit 0.
- Lockfile integrity: `app/package-lock.json` SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`, identical before and after; `git status` shows no lockfile change; no dependency change.
- `npm test`: scripts suite 629 tests, 629 pass, 0 fail; TypeScript suite 62 tests, 62 pass, 0 fail; exit 0. Targeted `smartphone-lifecycle-presentation.test.mjs`: 6/6 pass.
- `npm run lint`: exit 0.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- `node scripts/public-beta-profile-graph.mjs`: `result: clear` (18 prohibited patterns).
- Built public profile (`HOST=127.0.0.1 PORT=8081 node scripts/start-public-profile.mjs`): `scripts/e2e-local-preview-smoke.mjs` exit 0, ok at 390 and 1280, no external host, prohibited request or request failure.
- Routine pinned GitHub CI owns the authoritative full run: ROUTINE_CI PENDING at return.

## Same-fixture comparison against starting main (built output, Chrome via Playwright)

Starting-main build (worktree of 42fd87c, same toolchain) and candidate build were driven through the same journey at 390x844 and 1280x800 for five states: empty (no pathway, no period), invalid period (`nope` with Buy a new phone), generic new with remaining service missing (period `4`), exact model (Fairphone 5 chosen as owned phone, period `4`), keep-only (period `4`, remaining service not sure). For all 10 viewport/state pairs:
- Guide section text (visible text of the guide `section`): identical to starting main.
- Comparison results section text (`Comparison results`, where present): identical; where absent, absent in both.
- Form text: identical.
- Model-guide note: identical text (present in the exact-model state only) and present in the candidate after the guide.
- DOM order: starting main had the guide before the form; the candidate has form, then results (when present), then guide in all states. Position is the only difference. Exactly one guide per page; exactly one `#comparison-lifecycle-guide` and one `#comparison-inputs`; the guide is present in empty, invalid, valid and keep-only states.
- Horizontal overflow 0; page, console and HTTP errors none.
- All card publicLines/sourcesAndLimits/pending/model/period/service/fate text therefore remains verbatim and equally present; generic/model-specific, bracket-not-average, incomplete-service and unknown lines stay beside the cards. No new summary, total, ranking or default.

## Keyboard / mouse checks (built output; sticky header bottom 113 px at 390 and 320, 65 px at 640 and 1280)

Widths 320, 390, 640 (a 200%-zoom equivalent of 1280) and 1280, generic new + period `4` state:
- First Tab from the focused page heading reaches "Explore the phone lifecycle and sources".
- Enter (and mouse click) goes to `#comparison-lifecycle-guide`: active element is the guide `h2`, `:focus-visible` true for keyboard, top at 128 px, below the sticky header, at all four widths (scroll settled).
- Tab from that heading reaches the first guide disclosure ("Sources and limits"); Shift+Tab goes to the existing Continue/Reset controls in reverse order.
- "Back to comparison inputs": Enter and mouse click go to `#comparison-inputs`; active element is the alternatives `legend`, top at 128 px, below the header. Tab from there reaches the first pathway checkbox; Shift+Tab from the first checkbox reaches the new top link.
- Raw period value `4`, selected pathway and result card unchanged after both anchors; "Continue to impact and dependency pathways" still works. Native hash navigation updates `location.hash` only; no custom routing or state. Overflow 0 at all four widths.
- Frames (5 synthetic, no marketing art): `INITIAL-1-390-comparison-top-order.png`, `INITIAL-1-1280-comparison-top-order.png`, `INITIAL-1-390-results-guide-boundary.png`, `INITIAL-1-390-keyboard-guide-target.png`, `INITIAL-1-1280-keyboard-guide-target.png`.

## Preserved gaps and discrepancies

- No human-comprehension, discoverability, deployment-identity or fewer-scrolls-is-success claim. Whether people find the lifecycle link unaided remains an Owner-arranged human check.
- Pre-existing, not changed here: the sticky header is translucent and 113 px tall at 390, and Chrome does not scroll for it. When Shift+Tab moves to an already-visible control (for example Continue) it can sit partly under the header (observed top 52 px). The new targets use `scroll-mt-32` and are not affected. No global focus/scroll redesign was made.
- Native hash anchors add a history entry per click, so browser Back after an anchor returns to the previous hash position of the same page; no state is lost in the page.
- A first iteration used a tall focusable wrapper; it was replaced by the heading target before the validated head (see reason above). Earlier probe results from that iteration are not used.
- Durable Issue status was not written by Cursor (no native Issue-write action). HQ reconciles #194.
- No lifecycle data, view-model, evaluator, state, accepted content, contract, fixture, lockfile or dependency change. No R1b, graph, ranking, new text, storage or deployment action.
- Cursor does not self-merge; HQ reviews independently.
