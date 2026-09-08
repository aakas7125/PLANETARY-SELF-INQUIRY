import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { evaluateAdequacyAndUnknownState } from "../src/lib/smartphone/input-decision.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryDirectory = resolve(scriptDirectory, "../..");
const sourcePackage = JSON.parse(
  readFileSync(
    join(
      repositoryDirectory,
      "provenance/source-packages/R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json",
    ),
    "utf8",
  ),
);
const coveredCaseIds = [
  "T01",
  "T02",
  "T03",
  "T04",
  "T05",
  "T06",
  "T07",
  "T08",
  "T09",
  "T10",
  "T11",
  "T12",
  "T13",
  "T14",
];
const coveredAssertionIds = [
  "A-T01-HORIZON-2Y",
  "A-T01-GENERIC-NEW-RANGES",
  "A-T01-NO-3Y-DEFAULT",
  "A-T02-HORIZON-REMAINS-UNKNOWN",
  "A-T02-NO-3Y-FALLBACK",
  "A-T03-AGE-NOT-ADEQUACY",
  "A-T03-NO-OBSOLESCENCE-INFERENCE",
  "A-T04-UNSAFE-REMOVES-KEEP",
  "A-T05-FUNCTIONAL-INadequacy",
  "A-T06-SUPPORT-END-NOT-AUTO-REPLACE",
  "A-T06-SUPPORT-IS-ADEQUACY-INPUT",
  "A-T07-SUPPORT-UNKNOWN-STAYS-UNKNOWN",
  "A-T08-BATTERY-RANGE",
  "A-T08-POST-REPAIR-SERVICE-KNOWN",
  "A-T09-NO-SERVICE-EXTENSION-DEFAULT",
  "A-T10-DISPLAY-RANGE",
  "A-T11-MAJOR-BOARD-NO-GENERIC",
  "A-T11-MAJOR-BOARD-UNKNOWN-NOT-ZERO",
  "A-T12-FP5-MODEL-OVERRIDE",
  "A-T13-SEQUENCE-NOT-TRUNCATED",
  "A-T13-NEXT-ACQUISITION-INCLUDED",
  "A-T14-NO-INVENTED-NEXT-EVENT",
];
const coveredReleaseGroups = [
  "RC01_ADEQUATE_KEEP_GENERIC_NEW",
  "RC02_UNKNOWN_REMAINING_LIFE",
  "RC03_UNSAFE_KEEP_REMOVAL",
  "RC04_SECURITY_SUPPORT_NO_AUTO_REPLACE",
  "RC05_BATTERY_REPAIR_KNOWN_EXTENSION",
  "RC06_BATTERY_REPAIR_UNKNOWN_EXTENSION",
  "RC07_MAJOR_BOARD_UNKNOWN_IMPACT",
  "RC08_REPAIR_REPLACEMENT_SEQUENCE",
];
const cases = sourcePackage.cases.filter((candidate) => coveredCaseIds.includes(candidate.id));

function valueAt(object, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => value?.[key], object);
}

test("T01–T14 coverage remains pinned to the immutable source cases", () => {
  assert.deepEqual(cases.map(({ id }) => id), coveredCaseIds);
  assert.deepEqual(
    cases.flatMap(({ assertionIds }) => assertionIds),
    coveredAssertionIds,
  );
  assert.deepEqual(
    sourcePackage.releaseCriticalChecklist
      .filter(({ id }) => coveredReleaseGroups.includes(id))
      .map(({ id }) => id),
    coveredReleaseGroups,
  );
});

for (const sourceCase of cases) {
  test(`${sourceCase.id}: enforces its expected contract outputs`, () => {
    const result = evaluateAdequacyAndUnknownState(sourceCase.inputs);

    for (const [path, expected] of Object.entries(sourceCase.expected)) {
      assert.deepEqual(valueAt(result, path), expected, `${sourceCase.id} ${path}`);
    }
  });
}

test("T02 and T03 never infer a three-year horizon or obsolescence from age", () => {
  const t02 = cases.find(({ id }) => id === "T02");
  const t03 = cases.find(({ id }) => id === "T03");
  assert.ok(t02 && t03);

  const unknownHorizon = evaluateAdequacyAndUnknownState(t02.inputs);
  assert.equal(unknownHorizon.H_primary_years, null);
  assert.notEqual(unknownHorizon.H_primary_years, 3);

  const young = evaluateAdequacyAndUnknownState({
    ...t03.inputs,
    "current_device.total_service_age_years": 1,
  });
  const old = evaluateAdequacyAndUnknownState({
    ...t03.inputs,
    "current_device.total_service_age_years": 99,
  });
  assert.deepEqual(old, young);
  assert.equal("obsolete" in old, false);
});

test("T04–T07 preserve infeasibility, stated function limits, and support unknowns", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const unsafe = evaluateAdequacyAndUnknownState(byId.T04.inputs);
  const functionsMissing = evaluateAdequacyAndUnknownState(byId.T05.inputs);
  const supportEnded = evaluateAdequacyAndUnknownState(byId.T06.inputs);
  const supportUnknown = evaluateAdequacyAndUnknownState(byId.T07.inputs);

  assert.equal(unsafe.keep_as_is.feasible, false);
  assert.equal(functionsMissing.keep_as_is.provides_equivalent_service, false);
  assert.equal(supportEnded.replacement_forced_by_support_status, false);
  assert.equal(supportUnknown.derived.adequacy_gate.adequacy_status, "unknown");
  assert.equal(supportUnknown.replacement_forced_by_support_status, false);
  assert.equal("recommendation" in supportUnknown, false);
});

test("T08–T10 preserve distinct provisional repair ranges and unknown post-repair service", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const batteryKnown = evaluateAdequacyAndUnknownState(byId.T08.inputs);
  const batteryUnknown = evaluateAdequacyAndUnknownState(byId.T09.inputs);
  const displayKnown = evaluateAdequacyAndUnknownState(byId.T10.inputs);

  assert.deepEqual(batteryKnown.repair.climate_CO2e_kg, [0.3, 0.7]);
  assert.equal(batteryKnown.repair.climate_status, "PROVISIONAL_GENERIC_RANGE");
  assert.notEqual(batteryKnown.repair.climate_CO2e_kg.length, 1);

  assert.deepEqual(batteryUnknown.repair.climate_CO2e_kg, [0.3, 0.7]);
  assert.equal(batteryUnknown.result_capability, "insufficient_information");
  assert.deepEqual(batteryUnknown.missing_required_fields, [
    "repair.expected_adequate_service_after_repair",
  ]);
  assert.equal(batteryUnknown.repair.expected_adequate_service_after_repair, undefined);
  assert.notEqual(batteryUnknown.H_primary_years, 2);

  assert.deepEqual(displayKnown.repair.climate_CO2e_kg, [3, 8]);
  assert.notDeepEqual(displayKnown.repair.climate_CO2e_kg, batteryKnown.repair.climate_CO2e_kg);
});

test("T11 keeps generic major-board impact unsupported and non-zero", () => {
  const t11 = cases.find(({ id }) => id === "T11");
  assert.ok(t11);
  const majorBoard = evaluateAdequacyAndUnknownState(t11.inputs);

  assert.equal(majorBoard.repair.climate_CO2e_kg, null);
  assert.notEqual(majorBoard.repair.climate_CO2e_kg, 0);
  assert.equal(majorBoard.repair.impact_status, "unsupported");
  assert.notDeepEqual(majorBoard.repair.climate_CO2e_kg, [0.3, 0.7]);
  assert.notDeepEqual(majorBoard.repair.climate_CO2e_kg, [3, 8]);
  assert.equal(majorBoard.result_capability, "insufficient_information");
});

test("T12 Fairphone 5 full-module DIY value does not leak to other models or modes", () => {
  const t12 = cases.find(({ id }) => id === "T12");
  assert.ok(t12);
  const fairphoneDiy = evaluateAdequacyAndUnknownState(t12.inputs);
  assert.equal(fairphoneDiy.repair.climate_CO2e_kg, 17.84);
  assert.equal(fairphoneDiy.repair.impact_status, "approved");
  assert.equal(fairphoneDiy.repair.provenance_scope, "model_specific");

  const otherModel = evaluateAdequacyAndUnknownState({
    ...t12.inputs,
    "current_device.manufacturer": "Samsung",
    "current_device.model": "Galaxy S25",
  });
  const otherMode = evaluateAdequacyAndUnknownState({
    ...t12.inputs,
    "repair.repair_mode": "repair_centre",
  });

  assert.equal(otherModel.repair.climate_CO2e_kg, null);
  assert.equal(otherModel.repair.impact_status, "unsupported");
  assert.notEqual(otherModel.repair.climate_CO2e_kg, 17.84);
  assert.equal(otherMode.repair.climate_CO2e_kg, null);
  assert.equal(otherMode.repair.impact_status, "unsupported");
  assert.notEqual(otherMode.repair.climate_CO2e_kg, 17.84);
});

test("T13–T14 require a complete horizon sequence and never invent the next event", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const knownNext = evaluateAdequacyAndUnknownState(byId.T13.inputs);
  const unknownNext = evaluateAdequacyAndUnknownState(byId.T14.inputs);

  assert.equal(knownNext.service_sequence_required, true);
  assert.equal(knownNext.service_sequence_covers_years, 3);
  assert.deepEqual(knownNext.service_sequence.events, [
    { event_type: "repair", time_years: 0 },
    { event_type: "buy_new", time_years: 0.5 },
  ]);
  assert.notEqual(knownNext.service_sequence.events.at(-1)?.time_years, undefined);
  assert.equal(knownNext.result_status, "calculable_or_conditional_after_sequence");

  assert.equal(unknownNext.service_sequence_required, true);
  assert.equal(unknownNext.result_capability, "insufficient_information");
  assert.deepEqual(unknownNext.missing_required_fields, ["foreseeable_next_event"]);
  assert.equal(unknownNext.service_sequence, undefined);
  assert.notEqual(unknownNext.foreseeable_next_event, "buy_new");
});
