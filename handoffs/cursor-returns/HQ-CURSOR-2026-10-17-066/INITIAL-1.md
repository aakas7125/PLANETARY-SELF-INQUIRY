# HQ-CURSOR-2026-10-17-066 INITIAL-1 return

Task ID: HQ-CURSOR-2026-10-17-066
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/213
Cycle: INITIAL-1
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/215
Branch: cursor/hq-cursor-2026-10-17-066-goods-suspension
Starting main SHA: 15d518cd9a6b2485e44367edd4cac5577c061f1c
VALIDATED_IMPLEMENTATION_HEAD: 83978dec60fe3ba53e855441d89762e55d997725
EVIDENCE_RETURN_HEAD: this evidence-only commit (parent is the validated implementation head)
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

Durable Issue status was not written. No native Issue-write action is available. HQ owns Issue reconciliation.

## Model reverify

Runtime identity: `originalModelName` `grok-4.7`. No effort suffix is exposed. No switch to High and no spending change was made. This is the same default identity used for accepted 065. Not treated as a mismatch.

## Authorized scope implemented

Owner-approved D-023 points 1–5 only:

1. Removed the public “Goods, fashion, devices” 0–10 control and the `goods` field from `HouseholdInput` / `defaultHousehold`. No spending, frequency, or substitute input.
2. Removed the uncalibrated `0.35 + (goods/10)*3.4` term and the Goods slice. Totals, per-person, pie, legend, and top-three recompute from the remaining slices. No zero Goods slice.
3. Removed `goods*40` and the `goods>=7` parcels narrative. `landM2` remains diet land × 4 only and is not shown as complete household land. No new AP text. Remaining inquiry, lens, and notice copy was not rewritten.
4. Replaced the single Ledger qualifier with exactly: “This illustrative estimate excludes goods impacts, which are unquantified; it is not a complete audited footprint.”
5. Remaining inputs, factors, EV copy/association, and prior budget/cooling exclusions stay. `app/src/store/household.ts` needed no edit because it already follows `HouseholdInput`.

Removing the model contribution is not evidence that actual goods impacts are zero.

## Changed implementation files

- `app/src/lib/calc.ts`
- `app/src/lib/calc.test.ts`
- `app/src/components/calculator-section.tsx`

Slice colors are keyed by remaining slice id so Food, Flights, Road, Home energy, and Shared systems keep their previous colors.

## Numeric result

Current default inputs, goods excluded:

- remaining components sum `17.345` t
- per person `4.33625` t
- diet-only `landM2` `9600`
- displayed with existing `formatT`: household `17.3 t`, each of the four `4.34 t`

Former default-input goods terms and totals, not validated footprints:

| former index | former goods term | former total |
| --- | --- | --- |
| 0 | 0.35 | 17.695 |
| 3 | 1.37 | 18.715 |
| 5 | 2.05 | 19.395 |
| 6 | 2.39 | 19.735 |
| 7 | 2.73 | 20.075 |
| 10 | 3.75 | 21.095 |

A supplied leftover `goods` value at each of those indexes does not change the result. Each former total minus its former term matches `17.345` within `1e-9`.

Accepted 065 road slices are unchanged. Those totals now differ from the recorded 065 totals only by the former default goods term `0.35 + (5/10)*3.4`, within `1e-12`. Direct subtraction of the decimal `2.05` is not bit-identical to those stored floats.

Delhi, electric share 100%, 8000 km: displayed household `17.0 t`, each `4.25 t`, Road `1.02 t`. Reset returns `17.3 t`, Road `1.36 t`, electric share `0%`.

## Toolchain

- Node `v22.14.0`
- npm `11.19.0` from `/tmp/npm11`
- TypeScript `5.9.3`
- Install: `npm ci --ignore-scripts` in `app/` → exit 0
- Lock SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188` unchanged
- `npm test` → exit 0 (scripts 629 pass / 0 fail; TypeScript tests 67 pass / 0 fail)
- `npm run lint` → exit 0
- `npm run typecheck` → exit 0
- `npm run build` → exit 0

## Rendered evidence

Built profile at `127.0.0.1:8081`, headless Chrome. At 320, 390, and 1280:

- goods control, “Goods, fashion, devices”, “Goods intensity”, Goods slice, and parcels line absent
- qualifier present once, full text, not clipped
- legend: Food 7.40 t, Flights 1.70 t, Road 1.36 t, Home energy 2.48 t, Shared systems 4.40 t
- top cards are Food, Shared systems, and Home energy
- horizontal overflow 0
- no page or console errors
- EV thumb name, one instruction, ArrowRight 0→5, End 100, Home 0, Reset returns 0

Frames: `INITIAL-1-320.png`, `INITIAL-1-390.png`, `INITIAL-1-1280.png`, `INITIAL-1-320-results.png`, `INITIAL-1-390-results.png`, `INITIAL-1-1280-results.png`, `INITIAL-1-390-ev-end.png`, `INITIAL-1-390-reset.png`.

Tall section captures can include the existing sticky site header over the section. Viewport result frames are the chart/qualifier check. Overflow measurement was 0.

## Preserved gaps

- Goods impacts stay unquantified. Exclusion is not a zero.
- `landM2` is diet-only and is not a displayed complete-household-land claim.
- Diet, flights, road, home, services, grid, and water factors were not newly audited.
- Human comprehension is not claimed.
- Routine CI was not yet evaluated at return.

## Discrepancies

None that change the authorized result. Display rounding is the existing `formatT` behavior.

ROUTINE_CI: PENDING
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
