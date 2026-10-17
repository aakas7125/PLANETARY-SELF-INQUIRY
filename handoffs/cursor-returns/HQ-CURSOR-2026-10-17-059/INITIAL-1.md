# Cursor return: HQ-CURSOR-2026-10-17-059 INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, or product semantics are defined here.

- Task ID: HQ-CURSOR-2026-10-17-059
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/189
- PR: opened for branch `cursor/hq-cursor-2026-10-17-059-ledger-suspension` targeting `main` (number reported by the automation result)
- Cycle: INITIAL-1 (new task, not a correction)
- Starting main SHA: `9c41d81fb3819d3cf09dec1bfc3638303ed889f9`
- Branch: `cursor/hq-cursor-2026-10-17-059-ledger-suspension`
- VALIDATED_IMPLEMENTATION_HEAD: `55007f7137c44580cc0a365b8d0076c2bc5c0532`
- EVIDENCE_RETURN_HEAD: the commit that adds this file and updates the lease (changes only `handoffs/`)

## Authority

Issue #189 gates verified: title prefix, `HQ-authorized for Cursor execution: YES`, `Current status: READY_FOR_CURSOR`, both approval fields NO, dependency #190/PR #191 merged at the starting main, explicit scope/acceptance/branch/PR. D-016 (`dd4955eaee7a9c28bd31413688f3e310220e8cde`) is present on starting main. No prior 059 branch, PR, lease, or return existed.

## Implemented scope (Issue points 1-5)

1. Removed the public "Budget used" Stat. No substitute metric.
2. Removed the public "Earths required" Stat and the "Fair share 2 t" hint and warn styling. Removed `FAIR_SHARE_T`, `REMAINING_BUDGET_GT`, `WORLD_EMISSIONS_GT`, `WORLD_POPULATION`, and the `earths`, `budgetHours`, `lifetimeSharePct` result fields (no remaining consumer). The `FourOrbs` graphic scaled ring/colour from `earths`, so it is now a fixed neutral graphic and takes no result prop; no replacement mapping or threshold was introduced. The per-person Stat hint is now "CO₂e / year, household total ÷ 4" (arithmetic of the existing `perPersonT`).
3. Removed the "Manufactured cool" 0-10 control, the `cooling` input field, and the additive `(cooling / 10) * 1.8`. The Home energy slice is exactly entered `homeKwh` × existing place grid factor. Nothing sets "actual cooling impact" to zero. Removed the `cooling >= 6` narrative trigger only; Home energy slice inquiry/lens/notice prose is unchanged.
4. All other inputs, factors, and the totals architecture are unchanged and are NOT newly audited.
5. Added one visible note in the Ledger summary panel (`#ledger-qualification`): "This is an illustrative household estimate, not a complete audited footprint."

Per D-016, no Home-electricity suspension explanation, removed-feature notice, or history/migration text was added anywhere. No new factor, scientific claim, time metric, events/year input, normative quota, or homepage redesign.

## Changed files (implementation head vs starting main)

- `app/src/lib/calc.ts`
- `app/src/components/calculator-section.tsx`
- `app/src/components/four-orbs.tsx`
- `app/src/lib/calc.test.ts` (new)
- `app/package.json` (adds `src/lib/calc.test.ts` to the existing TS test list; no dependency change)
- `handoffs/cursor-runs/HQ-CURSOR-2026-10-17-059/INITIAL-1.md`

`calc.ts` now imports `./places.ts` (explicit extension, as already used by other TS modules and allowed by `allowImportingTsExtensions`) so the calculator is testable under `node --experimental-strip-types`.

## Observed model-scope changes (old vs new `computeHousehold`, same inputs)

Derived by running the starting-main function against the new one; these are not new empirical authority.

| Case | Old total / person / Home t | New total / person / Home t |
| --- | --- | --- |
| default (Delhi, average diet, 3500 kWh) | 20.2950 / 5.0738 / 3.3850 | 19.3950 / 4.8487 / 2.4850 |
| Plant diet | 15.6950 / 3.9238 / 3.3850 | 14.7950 / 3.6987 / 2.4850 |
| 500 kWh | 18.1650 / 4.5412 / 1.2550 | 17.2650 / 4.3162 / 0.3550 |
| 12000 kWh | 26.3300 / 6.5825 / 9.4200 | 25.4300 / 6.3575 / 8.5200 |

(Old cooling default 5 contributed 0.9 t; new values drop it. The new Home value equals entered kWh × grid factor / 1e6.) Totals, per-person, Home energy, the chart, and the narrative ranking change only by removal of that add-on.

## Validation

Toolchain: Node v22.14.0, npm 11.19.0 (installed to a temp prefix because system npm 10.9.9 fails `npm ci` on this lock), TypeScript 5.9.3.

- Install: `npm ci` in `app/`, exit 0. `app/package-lock.json` unchanged versus starting main, SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`.
- `npm test`: exit 0. Script tests 629/629 pass; TS tests 62/62 pass (50 existing + 12 new in `src/lib/calc.test.ts`).
- `npm run lint`: exit 0.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0.
- Built public profile (`HOST=127.0.0.1 PORT=8081 node scripts/start-public-profile.mjs`), Chrome via Playwright at 390 and 1280 widths:
  - `scripts/e2e-local-preview-smoke.mjs`: exit 0.
  - Ledger probe: no "Budget used", "Earths required", "Fair share", "Manufactured cool", or "Cooling intensity" text; exactly one qualification note; remaining sliders are Flights, Car kilometres, Electric vehicle share, Home electricity, Goods intensity; horizontal overflow 0; keyboard change of the Home electricity slider updates the Household and per-person values; no page, console, or HTTP errors.
- New tests protect: Home = entered kWh × grid factor for every place; totals equal the sum of slices with no separate add-on; a stale supplied `cooling` value changes nothing (not coerced to zero or another amount); suspended result keys/constants absent; cooling narrative trigger gone while flights/goods triggers remain; no stale public labels and no suspension/history notice; single qualification; orbs no longer encode fair-share pressure.
- Routine CI: PENDING (hosted CI owns the pinned install/lock/test/lint/typecheck/build regression on the PR head).

## Preserved gaps / discrepancies

- Other Ledger factors (diet, flights, car, goods, services, grid) are not newly audited or certified; no collateral fix was attempted.
- The fixed 4-person divisor, "order-of-magnitude" intro copy, and Home energy AP prose are unchanged and were not reviewed here.
- Replacement metrics are deferred per D-016; none researched or specified.
- Native Issue-write actions were unavailable; the durable Issue status is not changed by Cursor. HQ owns Issue reconciliation.
- `app/.output/` (build output) is untracked and was not committed.

Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
