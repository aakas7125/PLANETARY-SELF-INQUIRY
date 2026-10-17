# HQ-CURSOR-2026-10-17-066 CORRECTION-1 return

Task ID: HQ-CURSOR-2026-10-17-066
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/213
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/215
Branch: cursor/hq-cursor-2026-10-17-066-goods-suspension
Cycle: CORRECTION-1
Starting main SHA: ac7e27a7a87ad46ccfff46caf0f6f95e1ff102a6
Prior reviewed head: 2e08d4f7c00f382e45ed12743ffefc631a688691
VALIDATED_IMPLEMENTATION_HEAD: 83978dec60fe3ba53e855441d89762e55d997725
EVIDENCE_RETURN_HEAD: this evidence-only commit (parent is the CORRECTION-1 CURSOR_WORKING lease d95ed211ec02d0159bceea12aaf39b5fb5f81d73)
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

Durable Issue status was not written. No native Issue-write action is available. HQ owns Issue reconciliation.

The task branch was not rebased. Current `origin/main` at intake is `ac7e27a7a87ad46ccfff46caf0f6f95e1ff102a6` (HQ routing commits only). The implementation merge-base remains `15d518cd9a6b2485e44367edd4cac5577c061f1c`.

## Model reverify

Runtime identity: `originalModelName` `grok-4.7`. No effort suffix is exposed. No switch and no spending change. Same default identity as the reviewed INITIAL-1 run.

## Scope of this cycle

Evidence only. `git diff 83978dec60fe3ba53e855441d89762e55d997725 -- app` is empty. No source, test, package, or lockfile edit. No chart or animation change.

Changed evidence files:

- `handoffs/cursor-runs/HQ-CURSOR-2026-10-17-066/CORRECTION-1.md`
- `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-066/CORRECTION-1.md`
- `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-066/CORRECTION-1-320-results.png`
- `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-066/CORRECTION-1-1280-results.png`
- `handoffs/cursor-returns/HQ-CURSOR-2026-10-17-066/CORRECTION-1-320-during-animation.png`

## Settling method

Built profile from the unchanged app tree, served at `127.0.0.1:8081`. Headless Chrome. `prefers-reduced-motion: reduce` was false.

The installed Recharts `Pie` (dependency unchanged) defaults are `isAnimationActive` unless SSR, `animationBegin` 400, `animationDuration` 1500. The component does not override them. Each sector interpolates from sweep 0 to its final sweep. The legend is not animated.

Probe, not committed: poll `.recharts-pie-sector path` `getTotalLength()` about every 50ms from navigation. Settled means five paths, every length greater than 90, and the same lengths for four consecutive samples. That lock is geometry, not a fixed sleep.

Observed at 320×900:

- sectors absent at 51ms, 268ms, and 475ms
- first sectors at 684ms, lengths 47.13, 44.72, 44.58, 45.05, 45.86
- lengths increase at each later sample
- lengths lock at 2155ms and remain identical at 2365ms: 320.35, 107.48, 94.79, 136.61, 208.33

Observed at 1280×800 with the same lock values:

- first sectors at 714ms, lengths 49.24, 45.20, 44.96, 45.76, 47.11
- lock by 2187ms, still identical at 2399ms

A separate 320 capture at about 769ms, while lengths were 45.41, 44.32, 44.26, 44.47, 44.84, is `CORRECTION-1-320-during-animation.png`. It shows one tiny wedge and the full five-item legend. That is the same condition as the INITIAL-1 320 and 1280 result frames. Those frames were taken during the opening animation. They are not the settled chart.

## Settled SVG geometry

Each settled path is a donut sector with outer radius 64 and inner radius 42, from the `A 64` and `A 42` commands. Two radial edges contribute `2 * (64 - 42) = 44` to the path length. Sweep degrees are `(length - 44) / (64 + 42) * (180 / π)`.

| order | legend | length | sweep | fill | legend dot |
| --- | --- | ---: | ---: | --- | --- |
| 1 | Food 7.40 t | 320.35 | 149.32° | rgb(45, 74, 60) | rgb(45, 74, 60) |
| 2 | Flights 1.70 t | 107.48 | 34.31° | rgb(45, 74, 60) | rgb(45, 74, 60) |
| 3 | Road 1.36 t | 94.79 | 27.46° | rgb(140, 74, 50) | rgb(140, 74, 50) |
| 4 | Home energy 2.48 t | 136.61 | 50.06° | rgb(184, 92, 56) | rgb(184, 92, 56) |
| 5 | Shared systems 4.40 t | 208.33 | 88.82° | rgb(212, 206, 192) | rgb(212, 206, 192) |

Sweep sum 349.97°. The pie `paddingAngle` is 2, so five gaps add 10°. Together that is a complete ring. The same lengths and fills were measured at both widths. Early lengths near 44–49 are the radial edges plus a few degrees, which is the tiny wedge.

Food and Flights share rgb(45, 74, 60) because existing tokens `--color-pine` and `--color-primary` are both `#2d4a3c`. Each sector fill matches its own legend dot. No Goods slice is present.

First settled Food path at 320, center about (124, 80):

`M 188,80 A 64,64,0, 0,0, 68.932,47.388 L 87.862,58.599 A 42,42,0, 0,1, 166,80 Z`

The outer arc large-arc flag is 0, so that sector is under 180°, consistent with 149.32°.

## Default card checks

Card text at the settled head:

- qualifier once, exact approved sentence
- Household `17.3 t`
- Each of the four `4.34 t`
- legend Food 7.40 t, Flights 1.70 t, Road 1.36 t, Home energy 2.48 t, Shared systems 4.40 t
- no “Goods” string and no parcels line
- horizontal overflow 0 at 320×900 and at 1280×800
- no console errors and no page errors

`CORRECTION-1-320-results.png` is the settled card, 288×911. `CORRECTION-1-1280-results.png` is the settled card, 442×770, captured at viewport 1280×1000 after the lengths had locked. The results card is `lg:sticky`, 769px tall, so a short viewport clips its legend. The page’s smooth scroll was set to `auto` only inside that browser session so the card could be placed below the 65px header. Path lengths after that scroll were still 320.35, 107.48, 94.79, 136.61, 208.33. No application source was changed.

INITIAL-1 `390-reset` and `390-ev-end` already show complete rings. They were not rerun.

## Reused validation

App tree of prior reviewed head `2e08d4f7c00f382e45ed12743ffefc631a688691` matches validated implementation head `83978dec60fe3ba53e855441d89762e55d997725`.

Reused exact-head routine CI, passed: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/actions/runs/39069704089/job/117504580044

Reused HQ review 5560318130 source checks: calc tests 17/17 and 24 before/after comparisons true. Not rerun.

This cycle built only to render the artifact:

- Node `v22.14.0`
- npm `11.19.0` from `/tmp/npm11`
- `npm ci --ignore-scripts` in `app/` → exit 0
- Lock SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188` unchanged
- `npm run build` → exit 0
- `npm test`, `npm run lint`, and `npm run typecheck` were not rerun

## Preserved gaps

- Goods impacts stay unquantified. Exclusion is not a zero.
- `landM2` remains diet-only and is not a displayed complete-household-land claim.
- Diet, flights, road, home, services, grid, and water factors were not newly audited.
- Human comprehension is not claimed.
- Food and Flights share an existing color token. That was not changed.

## Discrepancies

None. The tiny wedge is the in-progress Recharts sector animation. The settled chart is a complete five-sector donut.

ROUTINE_CI: PASSED
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
