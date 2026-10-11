# Cursor return — HQ-CURSOR-2026-10-11-032 / CORRECTION-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change beyond the already-validated implementation head.

## Identity

- Task ID: `HQ-CURSOR-2026-10-11-032`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/106
- PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/107
- Branch: `cursor/hq-cursor-2026-10-11-032-smartphone-ap-inquiry-ux`
- Dispatch / cycle: `HQ-CURSOR-2026-10-11-032 / CORRECTION-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/106#issuecomment-6107408053
- HQ review: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/107#pullrequestreview-5482683974

## SHAs

- Starting `origin/main` SHA: `44ab10023198f6708f768413caf076a90fddb81e`
- Prior reviewed head: `746bec04aa449dcdbbc5ba6ffaa5dfc10f66bf76`
- Prior validated implementation head: `3088ae0f67cc0d251cde8d8e1bffd12c3ffe46a3`
- VALIDATED_IMPLEMENTATION_HEAD: `978e91c6a9c9cd6a8c3c7d9cc54281795c3d3582`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Bounded correction

Canonical provisional-choice and shift values stay on the inquiry record, the radio `value` attributes, and the domain builder input. Visitor-facing labels and the choice note no longer show snake_case enum tokens.

Choice labels:

- `keep_current` → Keep the current phone
- `repair_current` → Repair the current phone
- `consider_used_or_refurbished` → Consider a used or refurbished phone
- `buy_new` → Buy a new phone
- `investigate_further` → Investigate further
- `unclear` → Unclear

Shift labels:

- `changed` → Changed
- `unchanged` → Unchanged
- `uncertain` → Uncertain
- `unclear` → Unclear

Choice note: “These choices are shown in presentation order. That order is not a ranking. Buying a new phone is an ordinary choice, not a failed inquiry.”

`buy_new` remains an unranked, non-failure choice. Used and refurbished stay together in one label and are not collapsed into an empirical pathway. Shift values stay distinct, including `uncertain` and `unclear`.

## Changed implementation files

- `app/src/lib/smartphone/ap-inquiry-ux.mjs`
- `app/scripts/smartphone-ap-inquiry-ux.test.mjs`

`app/src/components/smartphone-inquiry.tsx` already rendered `choice.label` and `shift.label`, so it was not edited.

## Validation toolchain

- Node: `v22.14.0`
- npm: `11.19.0` (`node /tmp/npm-11/node_modules/npm/bin/npm-cli.js`)
- TypeScript: `5.9.3`
- Working directory: `app/`
- Validated tree: `978e91c6a9c9cd6a8c3c7d9cc54281795c3d3582`

### Commands and exit codes

| Command | Exit code |
| --- | --- |
| `npm ci --ignore-scripts` | `0` |
| `npm test` | `0` |
| `npm run typecheck` | `0` |
| `npm run build` | `0` |

### Test totals

- Scripts suite (`node --test "scripts/**/*.test.mjs"`): 514 pass / 0 fail / 0 todo
- TypeScript suite: 50 pass / 0 fail / 0 todo

### Lockfile integrity

- `app/package-lock.json` SHA-256: `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`
- Unchanged before/after `npm ci --ignore-scripts`
- Tracked lockfile diff: none

## Browser checks

Local Chrome via Playwright, keyboard activation, dev server `http://127.0.0.1:8080`. Viewports 390×844 and 1280×800. Checked on the same implementation tree as `978e91c6a9c9cd6a8c3c7d9cc54281795c3d3582`.

- Q6 and review show the six ordinary choice labels and four ordinary shift labels. Visible main text contains no snake_case enum token at either width.
- Radio values remain the canonical enums. ArrowDown reaches `buy_new` and `unchanged`. The review shows the selected labels “Buy a new phone” and “Unchanged”.
- One question heading is on screen at Q6. Blank Continue stays disabled. The raw answer `  night photos  ` survives Back and appears unchanged in the review, including the explicit “I’m not sure” answer.
- Horizontal overflow: `documentElement.scrollWidth` matched `clientWidth` (390/390 and 1280/1280) on Q6 and review.
- The sticky navigation bar does not intersect the “Buy a new phone” label. No console errors.
- `/` and `/journey` still load.

## Preserved gaps

- Provisional button selections stay on the inquiry record. They are not copied into `exact_user_answer` and are not given an invented supporting span, so `session.provisional_choice` stays `unclear`.
- A missing shift and an explicit `unclear` shift both become the builder’s `self_reported_shift` of `unclear`. The inquiry record keeps them distinct.
- No reflection or Source Lens display. No persistence. No empirical comparison or later steps.
- Canonical enum values remain in control `value` attributes and are not rendered as text.
- Durable Issue status was not written. No native Issue-write action is available. PR #107 remained the existing draft PR.

## Discrepancies

None.

## Self-merge

NO

## Executor result

`VERIFIED_FOR_HQ_REVIEW`
