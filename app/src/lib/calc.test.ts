import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { computeHousehold, defaultHousehold, dietOptions, type HouseholdInput } from "./calc.ts";
import { getPlace, places } from "./places.ts";

const SUSPENDED_RESULT_KEYS = ["earths", "budgetHours", "lifetimeSharePct"];
const SUSPENDED_EXPORTS = [
  "FAIR_SHARE_T",
  "REMAINING_BUDGET_GT",
  "WORLD_EMISSIONS_GT",
  "WORLD_POPULATION",
];

function homeSlice(input: HouseholdInput) {
  const slice = computeHousehold(input).slices.find((s) => s.id === "home");
  assert.ok(slice, "Home energy slice present");
  return slice;
}

function sumOfSlices(input: HouseholdInput) {
  return computeHousehold(input).slices.reduce((acc, s) => acc + s.t, 0);
}

function withSuppliedExtraField(input: HouseholdInput, key: string, value: number) {
  return { ...input, [key]: value } as HouseholdInput;
}

describe("Ledger home energy is the entered electricity times the existing grid factor", () => {
  it("equals entered kWh times the selected place grid factor for every place and several entries", () => {
    for (const place of places) {
      for (const homeKwh of [500, 3500, 12000]) {
        const input: HouseholdInput = { ...defaultHousehold, placeId: place.id, homeKwh };
        assert.equal(homeSlice(input).t, (homeKwh * place.gridG) / 1_000_000);
      }
    }
  });

  it("stays reactive to entered electricity, place, and other existing inputs", () => {
    const base = computeHousehold(defaultHousehold);
    const moreElectricity = computeHousehold({ ...defaultHousehold, homeKwh: 7000 });
    const gridG = getPlace(defaultHousehold.placeId).gridG;
    const expectedDelta = ((7000 - defaultHousehold.homeKwh) * gridG) / 1_000_000;
    assert.ok(Math.abs(moreElectricity.totalT - base.totalT - expectedDelta) < 1e-9);

    const otherPlace = places.find((p) => p.gridG !== gridG);
    assert.ok(otherPlace, "a place with a different grid factor exists");
    assert.notEqual(
      homeSlice({ ...defaultHousehold, placeId: otherPlace.id }).t,
      homeSlice(defaultHousehold).t,
    );

    for (const diet of dietOptions) {
      if (diet === defaultHousehold.diet) continue;
      assert.notEqual(computeHousehold({ ...defaultHousehold, diet }).totalT, base.totalT);
    }
  });

  it("totals are exactly the sum of the displayed slices with no separate add-on", () => {
    for (const homeKwh of [500, 3500, 12000]) {
      const input = { ...defaultHousehold, homeKwh };
      const result = computeHousehold(input);
      assert.ok(Math.abs(result.totalT - sumOfSlices(input)) < 1e-9);
      assert.equal(result.perPersonT, result.totalT / 4);
    }
  });
});

describe("Ledger suspended cooling add-on and unsupported metrics are excluded", () => {
  it("default input has no cooling field", () => {
    assert.equal("cooling" in defaultHousehold, false);
  });

  it("a stale supplied cooling value does not change any result and is not turned into zero or another amount", () => {
    const base = computeHousehold(defaultHousehold);
    for (const cooling of [0, 5, 6, 10]) {
      const result = computeHousehold(withSuppliedExtraField(defaultHousehold, "cooling", cooling));
      assert.deepEqual(result, base);
    }
  });

  it("result no longer carries budget-time, Earths, or lifetime-share quantities", () => {
    const result = computeHousehold(defaultHousehold) as unknown as Record<string, unknown>;
    for (const key of SUSPENDED_RESULT_KEYS) {
      assert.equal(key in result, false, key);
    }
  });

  it("no longer exports the fair-share, remaining-budget, or world-emission constants", async () => {
    const calc = (await import("./calc.ts")) as Record<string, unknown>;
    for (const name of SUSPENDED_EXPORTS) {
      assert.equal(name in calc, false, name);
    }
  });

  it("the cooling narrative trigger is gone for every input and other triggers remain", () => {
    const cooling = "Cooling the room returns heat to the street the four still walk. What is the indoor climate for?";
    for (const c of [0, 6, 10]) {
      const lines = computeHousehold(withSuppliedExtraField(defaultHousehold, "cooling", c)).seeing;
      assert.equal(
        lines.some((line) => line.startsWith(cooling)),
        false,
      );
    }
    const flying = computeHousehold({ ...defaultHousehold, flightsLhe: 2 }).seeing;
    assert.ok(flying.some((line) => line.startsWith("Flying is among")));
    const goods = computeHousehold({ ...defaultHousehold, goods: 7 }).seeing;
    assert.ok(goods.some((line) => line.startsWith("Parcels are a large line")));
  });

  it("retains the Home energy slice and its non-cooling-trigger prose", () => {
    const slice = homeSlice(defaultHousehold);
    assert.equal(slice.label, "Home energy");
    assert.ok(slice.inquiry.length > 0 && slice.lens.length > 0 && slice.notice.length > 0);
  });
});

describe("Ledger public presentation", () => {
  const calculator = readFileSync(new URL("../components/calculator-section.tsx", import.meta.url), "utf8");
  const orbs = readFileSync(new URL("../components/four-orbs.tsx", import.meta.url), "utf8");
  const publicSources = [calculator, orbs];

  it("omits the budget-time, Earths, fair-share, and cooling-control public labels", () => {
    for (const source of publicSources) {
      for (const stale of [
        "Budget used",
        "Earths required",
        "Fair share",
        "FAIR_SHARE_T",
        "Manufactured cool",
        "Cooling intensity",
        "budgetHours",
        "earths",
        "lifetimeSharePct",
        "state.cooling",
      ]) {
        assert.equal(source.includes(stale), false, stale);
      }
    }
  });

  it("shows the single general qualification and no suspension or history notice", () => {
    const qualification = "This is an illustrative household estimate, not a complete audited footprint.";
    assert.equal(calculator.split(qualification).length - 1, 1);
    assert.match(calculator, /id="ledger-qualification"/);
    for (const forbidden of [
      "suspended",
      "reviewed",
      "removed",
      "no longer",
      "separate cooling",
      "while its calculation",
    ]) {
      assert.equal(calculator.toLowerCase().includes(forbidden), false, forbidden);
    }
  });

  it("the orbs graphic no longer encodes a fair-share pressure", () => {
    assert.equal(/result|pressure/.test(orbs), false);
  });
});
