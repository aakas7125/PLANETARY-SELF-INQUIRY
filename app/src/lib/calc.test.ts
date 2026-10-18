import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  computeHousehold,
  defaultHousehold,
  dietFootprint,
  dietOptions,
  type HouseholdInput,
} from "./calc.ts";
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
    const parcels =
      "Parcels are a large line in this ledger. What are they doing in the life of the four?";
    for (const goods of [0, 7, 10]) {
      const lines = computeHousehold(withSuppliedExtraField(defaultHousehold, "goods", goods)).seeing;
      assert.equal(
        lines.some((line) => line.startsWith(parcels)),
        false,
      );
    }
  });

  it("retains the Home energy slice and its non-cooling-trigger prose", () => {
    const slice = homeSlice(defaultHousehold);
    assert.equal(slice.label, "Home energy");
    assert.ok(slice.inquiry.length > 0 && slice.lens.length > 0 && slice.notice.length > 0);
  });
});

describe("Ledger uncalibrated goods input is excluded", () => {
  // Former index term and totals are the pre-removal code expectations for the
  // current default inputs. They are not validated footprints.
  const formerGoodsTerm: Record<number, number> = {
    0: 0.35,
    3: 1.37,
    5: 2.05,
    6: 2.39,
    7: 2.73,
    10: 3.75,
  };
  const formerTotal: Record<number, number> = {
    0: 17.695,
    3: 18.715,
    5: 19.395,
    6: 19.735,
    7: 20.075,
    10: 21.095,
  };

  it("drops the goods field, slice, and index, and keeps one goods-independent result", () => {
    assert.equal("goods" in defaultHousehold, false);
    const calcSource = readFileSync(new URL("./calc.ts", import.meta.url), "utf8");
    assert.equal(calcSource.includes("input.goods"), false);
    assert.equal(calcSource.includes("0.35 + (input.goods / 10) * 3.4"), false);
    assert.equal(calcSource.includes('id: "goods"'), false);

    const base = computeHousehold(defaultHousehold);
    assert.equal(
      base.slices.some((slice) => slice.id === "goods" || slice.label === "Goods"),
      false,
    );
    assert.ok(Math.abs(base.totalT - sumOfSlices(defaultHousehold)) < 1e-9);
    assert.equal(base.perPersonT, base.totalT / 4);
    assert.ok(Math.abs(base.totalT - 17.345) < 1e-9);
    assert.ok(Math.abs(base.perPersonT - 4.33625) < 1e-9);
    assert.equal(base.landM2, 9600);

    for (const goods of [0, 3, 5, 6, 7, 10]) {
      const result = computeHousehold(withSuppliedExtraField(defaultHousehold, "goods", goods));
      assert.deepEqual(result, base);
      assert.ok(Math.abs(formerTotal[goods] - formerGoodsTerm[goods] - base.totalT) < 1e-9);
      assert.ok(Math.abs(base.totalT - (formerTotal[5] - formerGoodsTerm[5])) < 1e-9);
    }
  });

  it("keeps diet-only land and remaining component movement independent of a goods index", () => {
    for (const diet of dietOptions) {
      for (const goods of [0, 3, 5, 6, 7, 10]) {
        const result = computeHousehold(
          withSuppliedExtraField({ ...defaultHousehold, diet }, "goods", goods),
        );
        assert.equal(result.landM2, dietFootprint[diet].land * 4);
        assert.equal(
          result.seeing.some((line) => line.startsWith("Parcels are a large line")),
          false,
        );
      }
    }

    const contrasts: HouseholdInput[] = [
      { ...defaultHousehold, diet: "vegan", flightsLhe: 0, carKm: 0, evShare: 0, homeKwh: 500 },
      { ...defaultHousehold, diet: "high-meat", flightsLhe: 4, carKm: 8000, evShare: 100, homeKwh: 12000 },
      { ...defaultHousehold, placeId: "london", carKm: 8000, evShare: 50 },
    ];
    for (const input of contrasts) {
      const result = computeHousehold(input);
      const supplied = computeHousehold(withSuppliedExtraField(input, "goods", 10));
      assert.deepEqual(supplied, result);
      assert.equal(result.slices.some((slice) => slice.id === "goods"), false);
      assert.ok(Math.abs(result.totalT - result.slices.reduce((acc, slice) => acc + slice.t, 0)) < 1e-9);
      assert.notEqual(result.totalT, computeHousehold(defaultHousehold).totalT);
    }
  });
});

// Accepted 065 producer totals still include the former default goods term.
// Road slices are unchanged. Current totals differ only by that excluded term.
const FORMER_DEFAULT_GOODS_T = 0.35 + (5 / 10) * 3.4;
const EV_DISTANCE_BASELINE: Record<string, { road: number; total: number }> = {
  "delhi:0:0": { road: 0, total: 18.034999999999997 },
  "delhi:0:50": { road: 0, total: 18.034999999999997 },
  "delhi:0:100": { road: 0, total: 18.034999999999997 },
  "delhi:8000:0": { road: 1.36, total: 19.394999999999996 },
  "delhi:8000:50": { road: 1.1912, total: 19.2262 },
  "delhi:8000:100": { road: 1.0224, total: 19.0574 },
  "london:0:0": { road: 0, total: 16.284999999999997 },
  "london:0:50": { road: 0, total: 16.284999999999997 },
  "london:0:100": { road: 0, total: 16.284999999999997 },
  "london:8000:0": { road: 1.36, total: 17.644999999999996 },
  "london:8000:50": { road: 0.8312, total: 17.1162 },
  "london:8000:100": { road: 0.3024, total: 16.587400000000002 },
};

function distanceFixture(placeId: string, carKm: number, evShare: number): HouseholdInput {
  return {
    ...defaultHousehold,
    names: [...defaultHousehold.names],
    placeId,
    carKm,
    evShare,
  };
}

function cloneHouseholdInput(input: HouseholdInput): HouseholdInput {
  return { ...input, names: [...input.names] };
}

describe("Ledger electric road-distance share keeps the existing producer result", () => {
  it("deep-equals complete outputs and raw inputs for 0 and 8000 km at 0, 50, and 100 percent", () => {
    for (const placeId of ["delhi", "london"]) {
      for (const carKm of [0, 8000]) {
        const results = [];
        for (const evShare of [0, 50, 100]) {
          const input = distanceFixture(placeId, carKm, evShare);
          const raw = cloneHouseholdInput(input);
          const result = computeHousehold(input);
          assert.deepEqual(cloneHouseholdInput(input), raw);
          assert.deepEqual(computeHousehold(cloneHouseholdInput(raw)), result);
          const road = result.slices.find((s) => s.id === "car");
          assert.ok(road);
          const expected = EV_DISTANCE_BASELINE[`${placeId}:${carKm}:${evShare}`];
          assert.equal(road.t, expected.road);
          assert.ok(Math.abs(result.totalT - (expected.total - FORMER_DEFAULT_GOODS_T)) < 1e-12);
          assert.equal(result.perPersonT, result.totalT / 4);
          results.push(result);
        }
        if (carKm === 0) {
          assert.deepEqual(results[1], results[0]);
          assert.deepEqual(results[2], results[0]);
        } else {
          for (const later of [1, 2]) {
            assert.deepEqual(
              results[later].slices.filter((s) => s.id !== "car"),
              results[0].slices.filter((s) => s.id !== "car"),
            );
            assert.deepEqual(results[later].names, results[0].names);
            assert.deepEqual(results[later].place, results[0].place);
            assert.equal(results[later].landM2, results[0].landM2);
            assert.equal(results[later].waterM3, results[0].waterM3);
            assert.notEqual(
              results[later].slices.find((s) => s.id === "car")?.t,
              results[0].slices.find((s) => s.id === "car")?.t,
            );
          }
        }
      }
    }
  });

  it("reset raw input remains the existing default, including 8000 km and electric share 0", () => {
    assert.deepEqual(defaultHousehold, {
      names: ["You", "The one beside you", "A child", "A parent"],
      placeId: "delhi",
      diet: "average",
      flightsLhe: 1,
      carKm: 8000,
      evShare: 0,
      homeKwh: 3500,
    });
    const store = readFileSync(new URL("../store/household.ts", import.meta.url), "utf8");
    assert.match(store, /\[key\]: value/);
    assert.match(store, /reset: \(\) => set\(withResult\(defaultHousehold\)\)/);
    assert.deepEqual(
      computeHousehold(defaultHousehold),
      computeHousehold(distanceFixture("delhi", 8000, 0)),
    );
    assert.notDeepEqual(
      computeHousehold(distanceFixture("london", 0, 100)),
      computeHousehold(defaultHousehold),
    );
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
    const qualification =
      "This illustrative estimate excludes goods impacts, which are unquantified; it is not a complete audited footprint.";
    assert.equal(calculator.split(qualification).length - 1, 1);
    assert.equal(
      calculator.includes("This is an illustrative household estimate, not a complete audited footprint."),
      false,
    );
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

  it("names electric road distance and associates one instruction with that slider thumb", () => {
    const name = "Household road kilometres travelled by electric vehicle (%)";
    const instruction =
      "Of your household\u2019s road travel entered above for one year, what percentage is travelled in an electric vehicle? 0% means none of those kilometres; 100% means all of them.";
    const context =
      "An electric kilometre still carries the local grid. Quieter is not the same as disconnected.";
    const slider = readFileSync(new URL("../components/ui/slider.tsx", import.meta.url), "utf8");

    assert.equal(calculator.split(name).length - 1, 1);
    assert.equal(calculator.split("title={EV_ROAD_SHARE_NAME}").length - 1, 1);
    assert.equal(calculator.split('"aria-label": EV_ROAD_SHARE_NAME').length - 1, 1);
    assert.equal(calculator.split(instruction).length - 1, 1);
    assert.equal(calculator.split(context).length - 1, 1);
    assert.equal(calculator.includes("Share of those kilometres electric"), false);
    assert.equal(calculator.includes("Electric vehicle share"), false);
    assert.equal(calculator.includes("aria-valuetext"), false);
    assert.match(calculator, /id=\{EV_ROAD_SHARE_INSTRUCTION_ID\}/);
    assert.match(
      calculator,
      /thumbProps=\{\{[\s\S]*"aria-label": EV_ROAD_SHARE_NAME,[\s\S]*"aria-describedby": EV_ROAD_SHARE_INSTRUCTION_ID,/,
    );
    assert.match(calculator, /min=\{0\}[\s\S]{0,80}max=\{100\}[\s\S]{0,80}step=\{5\}[\s\S]{0,120}evShare/);
    assert.match(calculator, /title="Household road travel"/);
    assert.equal(calculator.includes('aria-label="Car kilometres"'), false);
    assert.equal(calculator.includes("Goods, fashion, devices"), false);
    assert.equal(calculator.includes("Goods intensity"), false);
    assert.equal(calculator.includes("state.goods"), false);
    assert.equal(calculator.split("thumbProps").length - 1, 4);
    assert.match(slider, /thumbProps\?:/);
    assert.match(slider, /<SliderPrimitive\.Thumb[\s\S]*\{\.\.\.thumbProps\}/);
    assert.equal(slider.split("thumbProps").length - 1, 3);
  });

  it("names the remaining three ledger thumbs and associates the existing flight helper once", () => {
    const flights = "Long-haul-equivalent flights per year";
    const road = "Household road travel (kilometres per year)";
    const home = "Home electricity (kilowatt-hours per year)";
    const helper =
      "One long-haul return \u2248 1.7 tCO\u2082e including warming from high-altitude effects.\n                  A Delhi\u2013London return is about one unit.";

    assert.equal(calculator.split(flights).length - 1, 1);
    assert.equal(calculator.split(road).length - 1, 1);
    assert.equal(calculator.split(home).length - 1, 1);
    assert.equal(calculator.split(helper).length - 1, 1);
    assert.match(calculator, /title="Long-haul-equivalent flights \/ year"/);
    assert.match(calculator, /title="Household road travel"/);
    assert.match(calculator, /title="Home electricity"/);
    assert.equal(calculator.includes('aria-label="Flights"'), false);
    assert.equal(calculator.includes('aria-label="Car kilometres"'), false);
    assert.equal(calculator.includes('aria-label="Home electricity"'), false);
    assert.equal(calculator.includes("Goods, fashion, devices"), false);
    assert.equal(calculator.includes("state.goods"), false);
    assert.match(
      calculator,
      /thumbProps=\{\{[\s\S]*"aria-label": FLIGHTS_THUMB_NAME,[\s\S]*"aria-describedby": FLIGHTS_HELPER_ID,/,
    );
    assert.match(calculator, /id=\{FLIGHTS_HELPER_ID\}/);
    assert.equal(calculator.split("FLIGHTS_HELPER_ID").length - 1, 3);
    assert.match(
      calculator,
      /min=\{0\}[\s\S]{0,40}max=\{12\}[\s\S]{0,40}step=\{1\}[\s\S]{0,220}FLIGHTS_THUMB_NAME/,
    );
    assert.match(
      calculator,
      /min=\{0\}[\s\S]{0,40}max=\{40000\}[\s\S]{0,40}step=\{500\}[\s\S]{0,180}"aria-label": ROAD_THUMB_NAME/,
    );
    assert.match(
      calculator,
      /min=\{500\}[\s\S]{0,40}max=\{12000\}[\s\S]{0,40}step=\{100\}[\s\S]{0,180}"aria-label": HOME_THUMB_NAME/,
    );
    assert.equal(calculator.split('"aria-describedby"').length - 1, 2);
  });
});
