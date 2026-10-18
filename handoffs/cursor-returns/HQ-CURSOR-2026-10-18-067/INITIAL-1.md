# Cursor return — HQ-CURSOR-2026-10-18-067 / INITIAL-1

Task ID: HQ-CURSOR-2026-10-18-067
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/216
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/217
Cycle: INITIAL-1
Branch: cursor/hq-cursor-2026-10-18-067-ledger-slider-names
Starting main SHA: 03566886f56e008ace6417baf8c44dbf10d8ca95
VALIDATED_IMPLEMENTATION_HEAD: 08146a66e84675e3b4ba80f13329de9e122bcdaf
EVIDENCE_RETURN_HEAD: the commit that adds this return. Its parent is the validated implementation head. This commit changes only the lease, this return, and INITIAL-1 screenshots.
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

Durable Issue status was not written. No native Issue-write action is available.

Runtime model identity: `originalModelName` `grok-4.7`. No Claude, High, xHigh, or Low marker was present. The selected model was not changed.

Post-merge CI for accepted PR #215 was success: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/actions/runs/39098868474 on `28fd9dc2cec5d39d1040bc2f7685b1fbcefbcd12`. No 067 branch, PR, lease, or return existed before this cycle's lease.

## Scope implemented

Focusable thumbs, using the existing `thumbProps` pass-through:

- Flights name: Long-haul-equivalent flights per year. Existing helper associated once by `ledger-flights-helper` on that thumb. Helper text is unchanged, including the current 1.7 t context. That association is not a certification of the coefficient.
- Road name: Household road travel (kilometres per year).
- Home name: Home electricity (kilowatt-hours per year).

The old root-only names Flights, Car kilometres, and Home electricity are not on these controls. `aria-valuetext` is not set. Visible labels, helpers, values, order, and layout are unchanged. The electric-vehicle thumb name, instruction, and context are unchanged. The goods control remains absent.

## Changed implementation files

- app/src/components/calculator-section.tsx
- app/src/lib/calc.test.ts

`app/src/components/ui/slider.tsx` was not edited. `calc.ts`, `household.ts`, and `places.ts` are byte-identical to starting main.

The existing electric-road presentation case still runs. Two assertions inside it now record the authorized removal of the road root name and the four `thumbProps` uses. The prior 17 Ledger cases were not skipped. One new presentation case checks the three names, the single flight-helper association, the bounds, and the continued absence of the goods control.

## Validation

Toolchain: Node v22.14.0, npm 11.19.0, TypeScript 5.9.3.
Install: `npm ci --ignore-scripts` in `app/` → exit 0.
Lock SHA-256: 104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188 unchanged.
`npm test` → exit 0. Script tests 629 pass / 0 fail. TypeScript tests 68 pass / 0 fail. Ledger cases 18 pass / 0 fail, including the prior 17.
`npm run lint` → exit 0.
`npm run typecheck` → exit 0.
`npm run build` → exit 0.

Built profiles: baseline `origin/main` at 127.0.0.1:8082 and this implementation at 127.0.0.1:8081. Headless Chrome. Chrome accessibility tree, not a screen-reader or WCAG certification.

Baseline at 320, 390, and 1280: the flights, road, and home thumbs were focusable sliders with empty accessible names. Their non-focusable roots carried Flights, Car kilometres, and Home electricity. The electric thumb name and instruction were already present. Values were flights 1 (0–12), road 8000 (0–40000), electric 0 (0–100), home 3500 (500–12000). `valuetext` was empty.

Candidate at the same widths: thumb names are the three strings above plus the unchanged electric name. The flight description is the existing helper, and `ledger-flights-helper` matches one element. Road and home have no description. Roots of these four sliders have no accessible name. `aria-valuetext` remains unset. Ledger visible text is identical to baseline at 320, 390, and 1280. Horizontal overflow is 0 at each width. No page or console errors.

Keyboard on the candidate at 390: Tab order is flights, road, electric, home. Shift+Tab reverses that order. ArrowRight / End / Home / ArrowLeft: flights 1→2→12→0→0→1; road 8000→8500→40000→0→0; home 3500→3600→12000→500→500; electric 0→5→100→0→0. Focused thumbs report a 2px ring in computed box-shadow. Reset restores 1, 8000, 3500, and 0 and keeps the names and the flight and electric descriptions.

Calculator and store bytes match starting main. `computeHousehold` default and one contrast (London, flights 12, road 0 km, electric share 100, home 12000 kWh) deep-equal the baseline module. Default total is 17.345. Contrast total is 34.72, with slices diet 7.4, flights 20.4, road 0, home 2.52, services 4.4. The built contrast display reads Household 34.7 t, each of the four 8.68 t, Food 7.40 t, Flights 20.4 t, Road 0.00 t, Home energy 2.52 t, Shared systems 4.40 t, with visible inputs 12, 0 km/yr, 100%, and 12,000 kWh/yr.

Screenshots: INITIAL-1-320-flights-focus.png, INITIAL-1-390-road-focus.png, INITIAL-1-1280-home-focus.png, INITIAL-1-1280-home-focus-ring.png, INITIAL-1-390-ev-focus.png. Captured after layout settle and after scrolling the focused thumb into view.

## Preserved gaps

No screen-reader output and no WCAG conformance claim.
The flight helper association does not certify the 1.7 coefficient.
Goods remains excluded. No new helper, instruction, calculator input, or slider mechanic.
Routine CI was not waited on.

## Discrepancies

None in the authorized names, helper text, electric control, goods exclusion, or recorded numeric outputs.
