# HQ-CURSOR-2026-10-17-058 CORRECTION-1

Task ID: HQ-CURSOR-2026-10-17-058
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/182
Cycle: CORRECTION-1
Starting main SHA: 63f4edd0b47b1772cf0f12c1275400b9d2abddac (current `origin/main` when the cycle started; branch base remains `00f68fe41092280cc9e4044023b47de897354873`)
Prior reviewed head SHA: 34ad249763363dcac85ea1b93b55e4f3a47c5002 (HQ review 5555836241)
VALIDATED_IMPLEMENTATION_HEAD: b0d85656675611f25668d47c1623a5ecfd88e070
EVIDENCE_RETURN_HEAD: the commit that adds this return and updates the lease (return and lease files only)
Branch: cursor/hq-cursor-2026-10-17-058-human-review-kit
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/184
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

Durable Issue status was not written. No native Issue-write action or PR body/comment action is available. This file is the transport return.

## Substantive changes (two Markdown files only)

- `handoffs/cursor/HQ-CURSOR-2026-10-17-058-baseline-audit.md`
- `handoffs/cursor/HQ-CURSOR-2026-10-17-058-human-review-kit.md`

Metadata: `handoffs/cursor-runs/HQ-CURSOR-2026-10-17-058/CORRECTION-1.md` (lease), this return.

## C1: invalidation map

Before (audit §6.2): "Invalidation rules ... mean any upstream edit clears downstream state and returns the step."

After: that sentence is removed. §6.2 now states that invalidation is action-specific and gives a table keyed to the actual source, with the actions that clear and the ones that do not:

- `smartphone-situation.tsx`: `onSituation` 115 to 148, `onInquiry` 150 to 196, `onComparison` 198 to 220, `onParticipation` 222 to 234, `onOtherness` 242 to 249, binding effect 260 to 266.
- Situation `edit` / `reset` (all `*StateAfterSituationAction` helpers): clears everything downstream.
- `INQUIRY_CLEAR_ACTIONS` (`set_raw`, `mark_not_sure`, `set_choice`, `set_shift`, `edit_question`, `reset`, `back`): clears comparison, impact, otherness, participation, final choice.
- `COMPARISON_CLEAR_ACTIONS` (14 material actions in `ap-otherness-ux.mjs`, `system-participation-ux.mjs`, `final-choice-ux.mjs`): clears otherness, participation, final choice. Impact is cleared only by comparison `reset` (`impactStateAfterComparisonAction`).
- `set_anticipated_old_phone_fate` / `clear_anticipated_old_phone_fate`: in no clear list; current raw QSP, otherness, binding, and final choice are preserved. Test anchor: `app/scripts/smartphone-old-phone-fate.test.mjs` lines 319 to 340.
- Participation `clear` / `set_qsp1..3` and otherness `clear` / `set_response` / `set_follow_up` clear the final choice only; `open`, `skip`, `continue` do not.
- Binding-key mismatch effect: clears participation, otherness, final choice.

Current versus historical state: the audit now says a recap can read only the current `opened`, `skipped`, raw text, `binding_key`, otherness, final choice, and fate. A cleared record equals the empty initial record and is indistinguishable from never opened. No history of earlier answers, skips, views, or staleness exists, and a future recap must not infer one. The QSP table row, the fate row, and the §6.3 bullet that listed "stale (cleared)" were aligned. §6.3 remains "proposal, not accepted".

Search of both documents for derivative blanket wording (`clears`, `drops`, `any edit`, `upstream`, `stale`, `recover`, `viewed`): no other blanket assertion remained.

## C2: participant copy, before and after

1. Part 2 Q3 first pass.
   - Before: "...what do you think that number is for? Try leaving it empty, then typing something that is not a number. What did the page tell you each time?"
   - After: "...what do you think that number is for? Did the page say anything about it, and if so, what?"
   - The empty and non-number manipulation moved to the separately optional second pass as new step 4: "If you are willing, try the number-of-years place in two other ways: first leave it empty, then type something that is not a number. Say what you see each time." No expected interpretation is supplied.
2. Intro skip.
   - Before: "You may skip a screen, say you disagree, or say you are not sure."
   - After: "You may skip any question or activity in this walkthrough, stop at any point, say you disagree, or say you are not sure. ... The website itself may not have a skip button on every screen, and you do not need to complete a screen in order to stop."
3. Intro testing line.
   - Before: "You are not being tested. Nobody is checking whether you understood. ..."
   - After: "This looks at how clear the website is. It does not look at your ability, and it does not look at what you would prefer to buy. You are not being scored or graded. If something is unclear, that tells us about the website, not about you."

Preserved: no score or right choice, no names, private answers, recordings, or contact, voluntary stopping, optional fictional-phone facts, optional German. No mandatory reading or answers added, no app question changed, no intended meaning coached.

The audit §9 coverage line and a new self-check bullet were aligned to the kit (years input in the natural path versus optional second pass; skip wording).

## Unchanged-tree and evidence check

- `git diff --name-only 34ad249..b0d85656675611f25668d47c1623a5ecfd88e070` lists only the two Markdown files.
- `git diff 00f68fe HEAD --name-only` outside `handoffs/`: empty. No app, source, contract, registry, corpus, package, lock, or dependency change.
- INITIAL-1 return and the six INITIAL-1 PNGs are unchanged (no diff in `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-058/INITIAL-1*`). No new screenshot.

## Validation and CI

Docs-only correction: no install, test, lint, typecheck, or build was required or run. Zero application CI is expected and is not a blocker. No hosted checks.

## Discrepancies and limits

- Branch base is still `00f68fe`; current `origin/main` is 63f4edd0b47b1772cf0f12c1275400b9d2abddac. The branch was not rebased or merged, to keep reviewed content stable. The source anchors cited in C1 are read from this branch's `app/` tree, which equals the starting accepted app.
- No human feedback or comprehension claim. N-1/N-2/N-4 remain reproduced heuristic observations and N-3 an accessibility candidate, unchanged from INITIAL-1.

Self-merge: NO.
