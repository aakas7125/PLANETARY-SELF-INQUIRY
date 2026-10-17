# Cursor return — HQ-CURSOR-2026-10-17-065 / INITIAL-1

Task ID: HQ-CURSOR-2026-10-17-065
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/212
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/214
Cycle: INITIAL-1
Branch: cursor/hq-cursor-2026-10-17-065-electric-distance-copy
Starting main SHA: 648171df7387b1e340db0851f90bb71ee112cc11
VALIDATED_IMPLEMENTATION_HEAD: 99a56638e84ddef235962d679466577b0a427630
EVIDENCE_RETURN_HEAD: the commit that adds this return. Its parent is the validated implementation head. This commit changes only the lease, this return, and INITIAL-1 screenshots.
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

Durable Issue status was not written. No native Issue-write action is available.

Runtime model identity: `originalModelName` `grok-4.7`. No Claude, High, xHigh, or Low marker was present. The selected model was not changed.

## Scope implemented

Visible label: Household road kilometres travelled by electric vehicle (%)
Instruction, associated once with the focusable thumb: Of your household’s road travel entered above for one year, what percentage is travelled in an electric vehicle? 0% means none of those kilometres; 100% means all of them.
The apostrophe in household’s is U+2019.
Grid context kept verbatim after the instruction: An electric kilometre still carries the local grid. Quieter is not the same as disconnected.
Accessible name on the thumb matches the visible label. `aria-valuetext` is not set, so the range value stays the number and percent is not announced a second time on the value.
Household road travel, km/year, evShare 0–100 step 5 default 0, setField, reset, calculator inputs, and the goods control were not changed.

Rendered inspection of the unchanged shared slider showed every thumb `aria-label` null, including the electric control, while the root still carried “Electric vehicle share”. An optional `thumbProps` pass-through was added and used only by this control. The thumb class and every other slider’s props stay as they were.

## Changed implementation files

- app/src/components/calculator-section.tsx
- app/src/components/ui/slider.tsx
- app/src/lib/calc.test.ts

## Validation

Toolchain: Node v22.14.0, npm 11.19.0, TypeScript 5.9.3.
Install: `npm ci --ignore-scripts` in `app/` → exit 0.
Lock SHA-256: 104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188 unchanged.
`npm test` → exit 0. Script tests 629 pass / 0 fail. TypeScript tests 65 pass / 0 fail.
`npm run lint` → exit 0.
`npm run typecheck` → exit 0.
`npm run build` → exit 0.

Producer check on the unchanged calculator, Delhi and London, carKm 0 and 8000, electric share 0, 50, and 100: complete results deep-equal a second call, raw inputs are unchanged, zero kilometres are identical across the three shares, and non-road slices stay equal when only the share changes. Delhi road/total match the recorded probe (0 km total 18.034999999999997; 8000 km at 0/50/100 is road 1.36/1.1912/1.0224 and total 19.394999999999996/19.2262/19.0574). Reset raw input remains carKm 8000 and evShare 0.

Built profile at 127.0.0.1:8081, headless Chrome. At 320, 390, and 1280 the thumb role is slider, name is the visible label, described-by count is 1, description is the instruction, value text is absent, value/min/max are 0/0/100, and horizontal overflow is 0. Label, instruction, and context report no inner clipping. ArrowRight moves 0 to 5. End is 100. Home is 0. ArrowLeft from 100 is 95. Reset returns the displayed share to 0% and the household total to 19.4 t with Road 1.36 t. At 100% Delhi the display is 19.1 t and Road 1.02 t. London at 100% and 8000 km is 16.6 t and Road 0.30 t. London at 0 km stays 16.3 t and Road 0.00 t. Goods remains “Goods, fashion, devices” at 5 / 10. No page or console errors.

Screenshots: INITIAL-1-320-focus.png, INITIAL-1-390-focus.png, INITIAL-1-1280-focus.png, INITIAL-1-390-end.png, INITIAL-1-390-step.png.

## Preserved gaps

Other ledger thumbs stay unnamed. This cycle does not migrate them.
Human comprehension of the new wording is not claimed.
No new public source-validity claim. Goods suspension is not part of this cycle.
Routine CI was not waited on.

## Discrepancies

None in the authorized wording, association, or recorded numeric outputs.
