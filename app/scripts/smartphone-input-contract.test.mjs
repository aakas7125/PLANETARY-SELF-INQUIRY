import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  UNKNOWN,
  USER_SITUATION_FACT,
  RESEARCH_EVIDENCE_PARAMETER,
  evaluateAdequacyAndUnknownState,
  isUnknown,
  resolveComparativeRankingPermission,
  resolveGenericEolBoundary,
  resolveGenericRecyclingCreditBoundary,
  resolveMissingInput,
  resolveQualitativePathwayClimateBoundary,
  resolveSunkManufacturingBoundary,
} from "../src/lib/smartphone/input-decision.mjs";

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
  "T15",
  "T16",
  "T17",
  "T18",
  "T19",
  "T20",
  "T21",
  "T22",
  "T23",
  "T24",
  "T25",
  "T26",
  "T27",
  "T28",
  "T29",
  "T30",
  "T31",
  "T32",
  "T33",
  "T34",
  "T35",
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
  "A-T15-NO-GENERIC-REFURB-FOOTPRINT",
  "A-T15-ADEME-NOT-DEFAULT",
  "A-T16-ADEME-OPAQUE",
  "A-T16-ADEME-2Y-LABEL",
  "A-T17-GENERIC-NEW-ALLOWED",
  "A-T18-MODEL-OVERRIDE-PRIORITY",
  "A-T19-REUSE-NOT-EWASTE",
  "A-T19-NO-1TO1-CREDIT",
  "A-T20-STORAGE-NOT-RECYCLING",
  "A-T21-EXACT-MASS",
  "A-T21-NO-GLOBAL-RATE",
  "A-T22-NO-GENERIC-MASS",
  "A-T23-TRADEIN-STAYS-UNKNOWN",
  "A-T24-EOL-NULL-NOT-ZERO",
  "A-T25-NO-UPSTREAM-DOUBLECOUNT",
  "A-T26-SUBSTITUTION-NOT-DISPLACEMENT",
  "A-T27-US-0POINT40-SCENARIO",
  "A-T27-NOT-GLOBAL",
  "A-T28-RANGE-PRESERVED",
  "A-T29-NO-SILENT-CLAMP",
  "A-T30-NO-GRID-DEFAULT",
  "A-T30-NO-EXPERT-QUESTION",
  "A-T31-IDENTITY-OPTIONAL-FOR-GENERIC",
  "A-T32-NO-GRADE-TO-LIFETIME",
  "A-T32-NO-GRADE-TO-FOOTPRINT",
  "A-T33-OPERATIONAL-NOT-ADEQUATE",
  "A-T34-PRIMARY-HORIZON-REMAINS-CURRENT-2Y",
  "A-T34-NO-EARLY-REPLACEMENT-AMORTIZATION",
  "A-T35-MISSING-CLASSES-DISTINCT",
  "A-T35-NO-SILENT-DEFAULT",
];
const coveredGlobalAssertionIds = [
  "A-GLOBAL-UNKNOWN-NOT-ZERO",
  "A-GLOBAL-UNKNOWN-NOT-FALSE",
  "A-GLOBAL-NO-SITUATIONAL-DEFAULT",
  "A-GLOBAL-RESEARCH-FALLBACK",
  "A-GLOBAL-NO-UNAPPROVED-FALLBACK",
  "A-GLOBAL-EQUAL-SERVICE",
  "A-GLOBAL-SUNK-MANUFACTURING",
  "A-GLOBAL-NO-GENERIC-EOL-ZERO",
  "A-GLOBAL-NO-GENERIC-RECYCLING-CREDIT",
  "A-GLOBAL-NO-UNIFIED-HARM-SCORE",
];
const coveredLogicAssertionIds = [
  "A-LOGIC-ADEQUACY-001",
  "A-LOGIC-ADEQUACY-002",
  "A-LOGIC-ADEQUACY-003",
  "A-LOGIC-LIFE-001",
  "A-LOGIC-LIFE-002",
  "A-LOGIC-REPAIR-001",
  "A-LOGIC-REPAIR-002",
];
const remainingLogicAssertionIds = [
  "A-LOGIC-REFURB-001",
  "A-LOGIC-REFURB-002",
  "A-LOGIC-FATE-001",
  "A-LOGIC-FATE-002",
  "A-LOGIC-MISSING-001",
  "A-LOGIC-MISSING-002",
  "A-LOGIC-MISSING-003",
  "A-LOGIC-EOL-001",
  "A-LOGIC-MATERIALS-001",
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
  "RC09_UNSUPPORTED_REFURB_FOOTPRINT",
  "RC10_OLD_DEVICE_FATE",
];
const cases = sourcePackage.cases.filter((candidate) => coveredCaseIds.includes(candidate.id));

function valueAt(object, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => value?.[key], object);
}

test("T01–T35 coverage remains pinned to the immutable source cases", () => {
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

test("T15–T16 keep arbitrary refurbished qualitative and ADEME opaque/source-specific", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const arbitrary = evaluateAdequacyAndUnknownState(byId.T15.inputs);
  const ademe = evaluateAdequacyAndUnknownState(byId.T16.inputs);

  assert.equal(arbitrary.replacement.refurbished.direct_climate_CO2e_kg, null);
  assert.equal(arbitrary.result_capability, "qualitative_only");
  assert.notEqual(arbitrary.replacement.refurbished.direct_climate_CO2e_kg, 7.61);
  assert.equal(arbitrary.reference_scenario, undefined);
  assert.equal(arbitrary.replacement.refurbished.percent_reduction_from_new, undefined);

  assert.equal(ademe.reference_scenario.climate_CO2e_kg, 7.61);
  assert.equal(ademe.reference_scenario.assumed_second_life_years, 2);
  assert.equal(ademe.reference_scenario.decomposable, false);
  assert.equal(ademe.reference_scenario.status, "OPAQUE_SOURCE_SPECIFIC_REFERENCE");
  assert.equal(ademe.reference_scenario.charging_CO2e_kg, undefined);
  assert.equal(ademe.reference_scenario.transport_CO2e_kg, undefined);
  assert.equal(ademe.reference_scenario.production_CO2e_kg, undefined);
});

test("T17–T18 label generic new fallback and do not fabricate model-specific values", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const genericNew = evaluateAdequacyAndUnknownState(byId.T17.inputs);
  const registryMatch = evaluateAdequacyAndUnknownState(byId.T18.inputs);

  assert.deepEqual(genericNew.replacement.new.production_CO2e_kg, [25, 70]);
  assert.deepEqual(genericNew.replacement.new.distribution_CO2e_kg, [2, 4]);
  assert.equal(genericNew.replacement.new.provenance_scope, "generic_fallback");
  assert.equal(genericNew.replacement.new.model, undefined);
  assert.notEqual(genericNew.replacement.new.production_CO2e_kg, 40);

  assert.equal(registryMatch.generic_range_used_as_primary, false);
  assert.equal(registryMatch.replacement.new.primary_climate_source, "model_specific");
  assert.equal(registryMatch.replacement.new.production_CO2e_kg, undefined);
  assert.equal(registryMatch.replacement.new.climate_CO2e_kg, undefined);
  assert.notDeepEqual(registryMatch.replacement.new.production_CO2e_kg, [25, 70]);
});

test("T19–T23 preserve fate, mass, unknown, and no 1:1 displacement credit", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const reuse = evaluateAdequacyAndUnknownState(byId.T19.inputs);
  const stored = evaluateAdequacyAndUnknownState(byId.T20.inputs);
  const exactMass = evaluateAdequacyAndUnknownState(byId.T21.inputs);
  const unknownMass = evaluateAdequacyAndUnknownState(byId.T22.inputs);
  const tradeIn = evaluateAdequacyAndUnknownState(byId.T23.inputs);

  assert.equal(reuse.old_device_fate.immediate_e_waste, false);
  assert.equal(reuse.old_device_fate.market_displacement_credit, null);

  assert.equal(stored.old_device_fate.status, "dormant_or_retired");
  assert.equal(stored.old_device_fate.immediate_e_waste, false);
  assert.notEqual(stored.old_device_fate.status, "formally_recycled");
  assert.notEqual(stored.old_device_fate.status, "environmentally_recovered");

  assert.equal(exactMass.old_device_fate.discarded_mass_g, 195);
  assert.equal(exactMass.old_device_fate.immediate_e_waste, true);
  assert.equal(exactMass.individual_formal_recycling_probability_applied, false);
  assert.notEqual(exactMass.individual_formal_recycling_probability_applied, 0.223);

  assert.equal(unknownMass.old_device_fate.discarded_mass_g, null);
  assert.notEqual(unknownMass.old_device_fate.discarded_mass_g, 180);
  assert.notEqual(unknownMass.old_device_fate.discarded_mass_g, 200);

  assert.equal(tradeIn.old_device_fate.immediate_e_waste, "unknown");
  assert.equal(tradeIn.old_device_fate.next_use, "unknown");
  assert.equal(tradeIn.old_device_fate.market_displacement_credit, null);
  assert.notEqual(tradeIn.old_device_fate.next_use, "reuse");
  assert.notEqual(tradeIn.old_device_fate.next_use, "formal_recycling");
});

test("T24–T27 keep EOL null, materials explanatory, and displacement non-global", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const eol = evaluateAdequacyAndUnknownState(byId.T24.inputs);
  const materials = evaluateAdequacyAndUnknownState(byId.T25.inputs);
  const substitution = evaluateAdequacyAndUnknownState(byId.T26.inputs);
  const usScenario = evaluateAdequacyAndUnknownState(byId.T27.inputs);
  const germanyScenario = evaluateAdequacyAndUnknownState({
    ...byId.T27.inputs,
    market: "DE",
  });
  const globalDefault = evaluateAdequacyAndUnknownState({
    consequential_mode: true,
    market: "global",
  });

  assert.equal(eol.generic_EOL_CO2e_kg, null);
  assert.equal(eol.generic_EOL_status, "EXCLUDED_UNQUANTIFIED");
  assert.notEqual(eol.generic_EOL_CO2e_kg, 0);
  assert.equal(eol.generic_recycling_credit, null);

  assert.equal(materials.material_cards_numerical_climate_addition, 0);
  assert.equal(materials.material_cards_role, "explanatory_only");
  assert.equal(materials.material_cards_cobalt_mining_CO2e_kg, undefined);

  assert.equal(substitution.market_displacement_credit, null);
  assert.equal(substitution.purchase_counterfactual, "buy_new");
  assert.notEqual(substitution.market_displacement_credit, 1);

  assert.equal(usScenario.market_displacement_rate, 0.4);
  assert.equal(
    usScenario.market_displacement_unit,
    "new_devices_displaced_per_secondhand_transaction",
  );
  assert.equal(usScenario.scenario_scope, "US_market_specific");
  assert.equal(usScenario.primary_attributional_score_modified, false);
  assert.equal(germanyScenario.market_displacement_rate, undefined);
  assert.equal(globalDefault.market_displacement_rate, undefined);
});

test("T28–T31 preserve remaining-life range, reject 30 without clamping, and skip grid defaults", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const range = evaluateAdequacyAndUnknownState(byId.T28.inputs);
  const outOfBounds = evaluateAdequacyAndUnknownState(byId.T29.inputs);
  const gridUnknown = evaluateAdequacyAndUnknownState(byId.T30.inputs);
  const missingIdentity = evaluateAdequacyAndUnknownState(byId.T31.inputs);

  assert.deepEqual(range.remaining_service.range_years, [1, 3]);
  assert.equal(range.remaining_service.expected_years, null);
  assert.equal(range.scenario_uncertainty_preserved, true);
  assert.notEqual(range.remaining_service.expected_years, 2);
  assert.notEqual(range.H_primary_years, 2);

  assert.equal(outOfBounds.validation_status, "error");
  assert.equal(outOfBounds.accepted_value, null);
  assert.notEqual(outOfBounds.accepted_value, 15);
  assert.notEqual(outOfBounds.H_primary_years, 15);
  assert.notEqual(outOfBounds.H_primary_years, 30);

  assert.equal(gridUnknown.charging_carbon_CO2e_kg, null);
  assert.equal(gridUnknown.charging_carbon_status, "unknown_or_omitted");
  assert.equal(gridUnknown.user_expert_parameter_required, false);
  assert.equal(gridUnknown.system_context?.grid_carbon_intensity_kgCO2e_per_kWh, undefined);

  assert.equal(missingIdentity.comparison_blocked_by_missing_identity, false);
  assert.deepEqual(missingIdentity.new.production_CO2e_kg, [25, 70]);
  assert.equal(missingIdentity.result_capability, "range_quantitative");
});

test("T32–T35 keep grade descriptive, operational non-adequate, and missing classes distinct", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const grade = evaluateAdequacyAndUnknownState(byId.T32.inputs);
  const operational = evaluateAdequacyAndUnknownState(byId.T33.inputs);
  const earlyReplacement = evaluateAdequacyAndUnknownState(byId.T34.inputs);
  const missingClasses = evaluateAdequacyAndUnknownState(byId.T35.inputs);

  assert.equal(grade.condition_descriptor_role, "descriptive_only");
  assert.equal(grade.inferred_remaining_life_years, null);
  assert.equal(grade.inferred_climate_CO2e_kg, null);
  assert.notEqual(grade.inferred_remaining_life_years, 3);

  assert.equal(operational.derived.adequacy_gate.adequacy_status, "inadequate");
  assert.equal(operational.phone_operational_equals_adequate, false);
  assert.equal(operational.keep_as_is.provides_equivalent_service, false);

  assert.equal(earlyReplacement.H_primary_years, 2);
  assert.equal(earlyReplacement.new_phone_8y_lifetime_used_to_amortize_primary_decision, false);
  assert.equal(earlyReplacement.new?.production_CO2e_kg_per_year, undefined);

  assert.deepEqual(missingClasses.missing_required_fields, [
    {
      field: "remaining_service.without_repair",
      missingClass: "user_situation_fact",
    },
    {
      field: "repair.model_specific_climate_CO2e_kg",
      missingClass: "research_evidence_parameter",
    },
  ]);
  assert.equal(missingClasses.result_capability, "insufficient_information");
  assert.notEqual(
    missingClasses.missing_required_fields[0].missingClass,
    missingClasses.missing_required_fields[1].missingClass,
  );
  assert.equal(missingClasses["remaining_service.without_repair.expected_years"], undefined);
  assert.equal(missingClasses.repair?.climate_CO2e_kg, null);
});

test("A-GLOBAL-UNKNOWN-NOT-ZERO keeps unknown distinct from numeric zero", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const unknownHorizon = evaluateAdequacyAndUnknownState(byId.T02.inputs);
  const majorBoard = evaluateAdequacyAndUnknownState(byId.T11.inputs);
  const eol = evaluateAdequacyAndUnknownState(byId.T24.inputs);
  const missingClasses = evaluateAdequacyAndUnknownState(byId.T35.inputs);
  const resolvedUnknown = resolveMissingInput({
    field: "remaining_service.without_repair",
    missingClass: USER_SITUATION_FACT,
  });

  assert.notEqual(UNKNOWN, 0);
  assert.equal(isUnknown(UNKNOWN), true);
  assert.equal(isUnknown(0), false);
  assert.equal(isUnknown(unknownHorizon.H_primary_years), true);
  assert.notEqual(unknownHorizon.H_primary_years, 0);
  assert.equal(isUnknown(majorBoard.repair.climate_CO2e_kg), true);
  assert.notEqual(majorBoard.repair.climate_CO2e_kg, 0);
  assert.equal(isUnknown(eol.generic_EOL_CO2e_kg), true);
  assert.notEqual(eol.generic_EOL_CO2e_kg, 0);
  assert.equal(isUnknown(missingClasses.repair?.climate_CO2e_kg), true);
  assert.notEqual(missingClasses.repair?.climate_CO2e_kg, 0);
  assert.equal(resolvedUnknown.value, UNKNOWN);
  assert.notEqual(resolvedUnknown.value, 0);
});

test("A-GLOBAL-UNKNOWN-NOT-FALSE keeps unknown distinct from boolean false", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const unknownAdequacy = evaluateAdequacyAndUnknownState(byId.T03.inputs);
  const supportUnknown = evaluateAdequacyAndUnknownState(byId.T07.inputs);
  const tradeIn = evaluateAdequacyAndUnknownState(byId.T23.inputs);
  const resolvedUnknown = resolveMissingInput({
    field: "remaining_service.without_repair",
    missingClass: USER_SITUATION_FACT,
  });

  assert.notEqual(UNKNOWN, false);
  assert.equal(isUnknown(false), false);
  assert.equal(unknownAdequacy.derived.adequacy_gate.adequacy_status, UNKNOWN);
  assert.notEqual(unknownAdequacy.derived.adequacy_gate.adequacy_status, false);
  assert.equal(unknownAdequacy.derived.adequacy_gate.feasible_keep_as_is, UNKNOWN);
  assert.notEqual(unknownAdequacy.derived.adequacy_gate.feasible_keep_as_is, false);
  assert.equal(unknownAdequacy.keep_as_is.feasible, UNKNOWN);
  assert.notEqual(unknownAdequacy.keep_as_is.feasible, false);
  assert.equal(supportUnknown.derived.adequacy_gate.adequacy_status, UNKNOWN);
  assert.notEqual(supportUnknown.derived.adequacy_gate.adequacy_status, false);
  assert.equal(tradeIn.old_device_fate.immediate_e_waste, UNKNOWN);
  assert.notEqual(tradeIn.old_device_fate.immediate_e_waste, false);
  assert.equal(resolvedUnknown.value, UNKNOWN);
  assert.notEqual(resolvedUnknown.value, false);
});

test("A-GLOBAL-NO-SITUATIONAL-DEFAULT never resolves a missing user fact through approved_default", () => {
  const t35 = cases.find(({ id }) => id === "T35");
  assert.ok(t35);
  const missingClasses = evaluateAdequacyAndUnknownState(t35.inputs);
  const resolved = resolveMissingInput({
    field: "remaining_service.without_repair",
    missingClass: USER_SITUATION_FACT,
    researchApprovedFallback: true,
    attemptApprovedDefault: true,
  });

  assert.equal(resolved.missingClass, USER_SITUATION_FACT);
  assert.equal(resolved.approvedDefaultPermitted, false);
  assert.equal(resolved.usedApprovedDefault, false);
  assert.equal(resolved.value, UNKNOWN);
  assert.notEqual(resolved.value, 0);
  assert.notEqual(resolved.value, false);
  assert.equal(typeof resolved.value === "number", false);
  assert.deepEqual(missingClasses.missing_required_fields[0], {
    field: "remaining_service.without_repair",
    missingClass: USER_SITUATION_FACT,
  });
  assert.equal(missingClasses["remaining_service.without_repair.expected_years"], undefined);
  assert.notEqual(missingClasses.H_primary_years, 3);
  assert.equal(isUnknown(missingClasses.H_primary_years), true);
});

test("A-GLOBAL-RESEARCH-FALLBACK permits an approved Research fallback without inventing a value", () => {
  const resolved = resolveMissingInput({
    field: "repair.model_specific_climate_CO2e_kg",
    missingClass: RESEARCH_EVIDENCE_PARAMETER,
    researchApprovedFallback: true,
    attemptApprovedDefault: true,
  });

  assert.equal(resolved.missingClass, RESEARCH_EVIDENCE_PARAMETER);
  assert.equal(resolved.approvedDefaultPermitted, true);
  assert.equal(resolved.usedApprovedDefault, false);
  assert.equal(resolved.value, UNKNOWN);
  assert.equal(typeof resolved.value === "number", false);
  assert.equal("fallbackValue" in resolved, false);
  assert.equal("approvedDefault" in resolved, false);
  assert.notEqual(resolved.value, 0);
  assert.notEqual(resolved.value, false);
});

test("A-GLOBAL-NO-UNAPPROVED-FALLBACK leaves an unapproved Research parameter null/unknown", () => {
  const t35 = cases.find(({ id }) => id === "T35");
  assert.ok(t35);
  const missingClasses = evaluateAdequacyAndUnknownState(t35.inputs);
  const resolved = resolveMissingInput({
    field: "repair.model_specific_climate_CO2e_kg",
    missingClass: RESEARCH_EVIDENCE_PARAMETER,
    researchApprovedFallback: false,
    attemptApprovedDefault: true,
  });

  assert.equal(resolved.missingClass, RESEARCH_EVIDENCE_PARAMETER);
  assert.equal(resolved.approvedDefaultPermitted, false);
  assert.equal(resolved.usedApprovedDefault, false);
  assert.equal(isUnknown(resolved.value), true);
  assert.notEqual(resolved.value, 0);
  assert.notEqual(resolved.value, false);
  assert.deepEqual(missingClasses.missing_required_fields[1], {
    field: "repair.model_specific_climate_CO2e_kg",
    missingClass: RESEARCH_EVIDENCE_PARAMETER,
  });
  assert.equal(isUnknown(missingClasses.repair?.climate_CO2e_kg), true);
  assert.notEqual(missingClasses.repair?.climate_CO2e_kg, 0);
  assert.equal(missingClasses.result_capability, "insufficient_information");
});

test("A-GLOBAL-EQUAL-SERVICE permits comparison only for equivalent service or a complete sequence", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const equivalentService = evaluateAdequacyAndUnknownState(byId.T01.inputs);
  const completeSequence = evaluateAdequacyAndUnknownState(byId.T13.inputs);
  const functionalGap = evaluateAdequacyAndUnknownState(byId.T05.inputs);
  const incompleteSequence = evaluateAdequacyAndUnknownState(byId.T14.inputs);
  const operationalOnly = evaluateAdequacyAndUnknownState(byId.T33.inputs);
  const permittedByService = resolveComparativeRankingPermission({
    equivalentAdequateServiceRepresented: true,
    completeServiceSequenceRepresented: false,
  });
  const permittedBySequence = resolveComparativeRankingPermission({
    equivalentAdequateServiceRepresented: UNKNOWN,
    completeServiceSequenceRepresented: true,
  });
  const blocked = resolveComparativeRankingPermission({
    equivalentAdequateServiceRepresented: false,
    completeServiceSequenceRepresented: false,
  });

  assert.equal(equivalentService.keep_as_is.provides_equivalent_service, true);
  assert.equal(equivalentService.equivalent_adequate_service_represented, true);
  assert.equal(equivalentService.complete_service_sequence_represented, false);
  assert.equal(equivalentService.definitive_comparative_ranking_permitted, true);
  assert.equal("winner" in equivalentService, false);
  assert.equal("comparative_ranking" in equivalentService, false);
  assert.equal(equivalentService.comparative_score, undefined);

  assert.equal(completeSequence.service_sequence_required, true);
  assert.equal(completeSequence.complete_service_sequence_represented, true);
  assert.equal(completeSequence.definitive_comparative_ranking_permitted, true);
  assert.equal("winner" in completeSequence, false);
  assert.equal(completeSequence.result_status, "calculable_or_conditional_after_sequence");

  assert.equal(functionalGap.keep_as_is.provides_equivalent_service, false);
  assert.equal(functionalGap.equivalent_adequate_service_represented, false);
  assert.equal(functionalGap.definitive_comparative_ranking_permitted, false);

  assert.equal(incompleteSequence.service_sequence_required, true);
  assert.equal(incompleteSequence.complete_service_sequence_represented, false);
  assert.equal(incompleteSequence.definitive_comparative_ranking_permitted, false);
  assert.equal(incompleteSequence.result_capability, "insufficient_information");

  assert.equal(operationalOnly.phone_operational_equals_adequate, false);
  assert.equal(operationalOnly.keep_as_is.provides_equivalent_service, false);
  assert.equal(operationalOnly.definitive_comparative_ranking_permitted, false);

  assert.equal(permittedByService.definitiveComparativeRankingPermitted, true);
  assert.equal(permittedBySequence.definitiveComparativeRankingPermitted, true);
  assert.equal(blocked.definitiveComparativeRankingPermitted, false);
  assert.equal("winner" in permittedByService, false);
  assert.equal("ranking" in permittedByService, false);
  assert.equal("score" in permittedByService, false);
});

test("A-GLOBAL-SUNK-MANUFACTURING excludes historic owned production from the keep total", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const keepDecision = evaluateAdequacyAndUnknownState(byId.T01.inputs);
  const reuse = evaluateAdequacyAndUnknownState(byId.T19.inputs);
  const sunk = resolveSunkManufacturingBoundary();

  assert.equal(sunk.historicOwnedProductionIncludedInProspectiveKeepTotal, false);
  assert.equal(sunk.avoidedManufactureCreditFromOwnedHistory, null);
  assert.equal("prospectiveKeepTotal_CO2e_kg" in sunk, false);
  assert.equal("historicProduction_CO2e_kg" in sunk, false);

  assert.equal(
    keepDecision.historic_owned_production_included_in_prospective_keep_total,
    false,
  );
  assert.equal(keepDecision.avoided_manufacture_credit_from_owned_history, null);
  assert.notEqual(keepDecision.avoided_manufacture_credit_from_owned_history, 1);
  assert.notDeepEqual(
    keepDecision.avoided_manufacture_credit_from_owned_history,
    keepDecision.new?.production_CO2e_kg,
  );
  assert.equal(keepDecision.keep_as_is.historic_production_CO2e_kg, undefined);
  assert.equal(keepDecision.keep_as_is.avoided_manufacture_credit, undefined);
  assert.equal("winner" in keepDecision, false);

  assert.equal(reuse.old_device_fate.market_displacement_credit, null);
  assert.equal(reuse.avoided_manufacture_credit_from_owned_history, null);
});

test("A-GLOBAL-NO-GENERIC-EOL-ZERO keeps absent generic EOL null, never zero", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const eol = evaluateAdequacyAndUnknownState(byId.T24.inputs);
  const keepDecision = evaluateAdequacyAndUnknownState(byId.T01.inputs);
  const resolved = resolveGenericEolBoundary();

  assert.equal(resolved.generic_EOL_CO2e_kg, null);
  assert.equal(resolved.generic_EOL_status, "EXCLUDED_UNQUANTIFIED");
  assert.notEqual(resolved.generic_EOL_CO2e_kg, 0);
  assert.equal(isUnknown(resolved.generic_EOL_CO2e_kg), true);

  assert.equal(eol.generic_EOL_CO2e_kg, null);
  assert.equal(eol.generic_EOL_status, "EXCLUDED_UNQUANTIFIED");
  assert.notEqual(eol.generic_EOL_CO2e_kg, 0);
  assert.equal(isUnknown(eol.generic_EOL_CO2e_kg), true);

  assert.equal(keepDecision.generic_EOL_CO2e_kg, null);
  assert.equal(keepDecision.generic_EOL_status, "EXCLUDED_UNQUANTIFIED");
  assert.notEqual(keepDecision.generic_EOL_CO2e_kg, 0);
});

test("A-GLOBAL-NO-GENERIC-RECYCLING-CREDIT keeps generic recycling credit null", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const eol = evaluateAdequacyAndUnknownState(byId.T24.inputs);
  const exactMass = evaluateAdequacyAndUnknownState(byId.T21.inputs);
  const reuse = evaluateAdequacyAndUnknownState(byId.T19.inputs);
  const resolved = resolveGenericRecyclingCreditBoundary();

  assert.equal(resolved.generic_recycling_credit, null);
  assert.notEqual(resolved.generic_recycling_credit, 0);

  assert.equal(eol.generic_recycling_credit, null);
  assert.notEqual(eol.generic_recycling_credit, 0);
  assert.equal(exactMass.generic_recycling_credit, null);
  assert.equal(exactMass.individual_formal_recycling_probability_applied, false);
  assert.equal(reuse.generic_recycling_credit, null);
  assert.equal(reuse.old_device_fate.market_displacement_credit, null);
});

test("A-GLOBAL-NO-UNIFIED-HARM-SCORE keeps qualitative domains non-numeric to climate ranking", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const materials = evaluateAdequacyAndUnknownState(byId.T25.inputs);
  const keepDecision = evaluateAdequacyAndUnknownState(byId.T01.inputs);
  const qualitative = resolveQualitativePathwayClimateBoundary();
  const climateAfterQualitativeCards = evaluateAdequacyAndUnknownState({
    ...byId.T01.inputs,
    material_pathway_cards_enabled: true,
    "product_LCA.production.includes_raw_material_extraction": true,
    water_pathway_cards_enabled: true,
    people_pathway_cards_enabled: true,
    ecosystem_pathway_cards_enabled: true,
  });

  assert.deepEqual(qualitative.qualitativePathwayDomains, [
    "materials",
    "water",
    "people",
    "ecosystem",
  ]);
  assert.equal(qualitative.qualitativePathwaysNumericallyModifyClimateRanking, false);
  assert.equal(qualitative.qualitativePathwayRole, "explanatory_only");
  assert.equal(qualitative.unified_harm_score, null);
  assert.notEqual(qualitative.unified_harm_score, 0);
  assert.equal("materialsScore" in qualitative, false);
  assert.equal("waterScore" in qualitative, false);
  assert.equal("peopleScore" in qualitative, false);
  assert.equal("ecosystemScore" in qualitative, false);

  assert.equal(materials.material_cards_numerical_climate_addition, 0);
  assert.equal(materials.material_cards_role, "explanatory_only");
  assert.equal(materials.qualitative_pathways_numerically_modify_climate_ranking, false);
  assert.equal(materials.qualitative_pathway_role, "explanatory_only");
  assert.equal(materials.unified_harm_score, null);
  assert.equal(materials.material_cards_cobalt_mining_CO2e_kg, undefined);

  assert.deepEqual(keepDecision.new.production_CO2e_kg, [25, 70]);
  assert.deepEqual(climateAfterQualitativeCards.new.production_CO2e_kg, [25, 70]);
  assert.deepEqual(
    climateAfterQualitativeCards.new.distribution_CO2e_kg,
    keepDecision.new.distribution_CO2e_kg,
  );
  assert.equal(
    climateAfterQualitativeCards.qualitative_pathways_numerically_modify_climate_ranking,
    false,
  );
  assert.equal(climateAfterQualitativeCards.unified_harm_score, null);
  assert.equal(climateAfterQualitativeCards.material_cards_numerical_climate_addition, 0);
  assert.equal("winner" in climateAfterQualitativeCards, false);
});

test("covered global assertion IDs remain the ten executed A-GLOBAL identifiers", () => {
  const sourceGlobalIds = sourcePackage.globalAssertions.map(({ id }) => id);
  assert.deepEqual(coveredGlobalAssertionIds, sourceGlobalIds);
  assert.deepEqual(
    sourceGlobalIds.filter((id) => !coveredGlobalAssertionIds.includes(id)),
    [],
  );
});

test("A-LOGIC-ADEQUACY-001 makes keep-as-is infeasible when the phone is unsafe", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const unsafe = evaluateAdequacyAndUnknownState(byId.T04.inputs);

  assert.equal(byId.T04.inputs["adequacy.safe_to_use"], false);
  assert.equal(unsafe.derived.adequacy_gate.adequacy_status, "inadequate");
  assert.equal(unsafe.derived.adequacy_gate.feasible_keep_as_is, false);
  assert.equal(unsafe.keep_as_is.feasible, false);
  assert.notEqual(unsafe.derived.adequacy_gate.feasible_keep_as_is, true);
  assert.notEqual(unsafe.keep_as_is.feasible, UNKNOWN);
});

test("A-LOGIC-ADEQUACY-002 marks adequacy inadequate when required functions are unmet", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const functionsMissing = evaluateAdequacyAndUnknownState(byId.T05.inputs);

  assert.equal(byId.T05.inputs["adequacy.required_functions_met"], false);
  assert.equal(functionsMissing.derived.adequacy_gate.adequacy_status, "inadequate");
  assert.notEqual(functionsMissing.derived.adequacy_gate.adequacy_status, "adequate");
  assert.notEqual(functionsMissing.derived.adequacy_gate.adequacy_status, UNKNOWN);
  assert.equal(functionsMissing.keep_as_is.provides_equivalent_service, false);
});

test("A-LOGIC-ADEQUACY-003 does not force replacement when ended support remains adequate", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const supportEnded = evaluateAdequacyAndUnknownState(byId.T06.inputs);

  assert.equal(byId.T06.inputs["security_support.status"], "ended");
  assert.equal(byId.T06.inputs["security_support.adequate_for_required_use"], true);
  assert.equal(supportEnded.derived.adequacy_gate.adequacy_status, "adequate");
  assert.equal(supportEnded.replacement_forced_by_support_status, false);
  assert.notEqual(supportEnded.replacement_forced_by_support_status, true);
  assert.equal("recommendation" in supportEnded, false);
  assert.equal(supportEnded.replacement_forced, undefined);
});

test("A-LOGIC-LIFE-001 keeps H_primary null when an adequate phone has null remaining life", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const unknownHorizon = evaluateAdequacyAndUnknownState(byId.T02.inputs);

  assert.equal(unknownHorizon.derived.adequacy_gate.adequacy_status, "adequate");
  assert.equal(byId.T02.inputs["remaining_service.without_repair.expected_years"], null);
  assert.equal(unknownHorizon.H_primary_years, null);
  assert.notEqual(unknownHorizon.H_primary_years, 0);
  assert.notEqual(unknownHorizon.H_primary_years, 3);
  assert.equal(isUnknown(unknownHorizon.H_primary_years), true);
});

test("A-LOGIC-LIFE-002 never derives remaining life from device age", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const unknownHorizon = evaluateAdequacyAndUnknownState(byId.T02.inputs);
  const agedUnknownHorizon = evaluateAdequacyAndUnknownState({
    ...byId.T02.inputs,
    "current_device.total_service_age_years": 6,
  });
  const olderUnknownHorizon = evaluateAdequacyAndUnknownState({
    ...byId.T02.inputs,
    "current_device.total_service_age_years": 99,
  });
  const youngUnknownAdequacy = evaluateAdequacyAndUnknownState({
    ...byId.T03.inputs,
    "current_device.total_service_age_years": 1,
  });
  const oldUnknownAdequacy = evaluateAdequacyAndUnknownState({
    ...byId.T03.inputs,
    "current_device.total_service_age_years": 99,
  });

  assert.equal(unknownHorizon.H_primary_years, null);
  assert.equal(agedUnknownHorizon.H_primary_years, null);
  assert.equal(olderUnknownHorizon.H_primary_years, null);
  assert.deepEqual(agedUnknownHorizon, olderUnknownHorizon);
  assert.notEqual(agedUnknownHorizon.H_primary_years, 6);
  assert.notEqual(olderUnknownHorizon.H_primary_years, 99);
  assert.equal(agedUnknownHorizon.remaining_life, undefined);
  assert.equal(agedUnknownHorizon.inferred_remaining_life_years, undefined);
  assert.deepEqual(oldUnknownAdequacy, youngUnknownAdequacy);
  assert.equal(oldUnknownAdequacy.H_primary_years, youngUnknownAdequacy.H_primary_years);
  assert.equal("obsolete" in oldUnknownAdequacy, false);
  assert.notEqual(oldUnknownAdequacy.H_primary_years, 0);
});

test("A-LOGIC-REPAIR-001 keeps major-board climate null without model-specific impact", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const majorBoard = evaluateAdequacyAndUnknownState(byId.T11.inputs);

  assert.equal(byId.T11.inputs["repair.type"], "major_board");
  assert.equal(byId.T11.inputs["repair.model_specific_climate_CO2e_kg"], null);
  assert.equal(majorBoard.repair.climate_CO2e_kg, null);
  assert.equal(majorBoard.repair.impact_status, "unsupported");
  assert.notEqual(majorBoard.repair.climate_CO2e_kg, 0);
  assert.notDeepEqual(majorBoard.repair.climate_CO2e_kg, [0.3, 0.7]);
  assert.notDeepEqual(majorBoard.repair.climate_CO2e_kg, [3, 8]);
  assert.notEqual(majorBoard.repair.climate_CO2e_kg, 17.84);
  assert.equal(majorBoard.result_capability, "insufficient_information");
});

test("A-LOGIC-REPAIR-002 requires a service sequence for short repair service", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const knownNext = evaluateAdequacyAndUnknownState(byId.T13.inputs);
  const unknownNext = evaluateAdequacyAndUnknownState(byId.T14.inputs);

  assert.ok(
    byId.T13.inputs["repair.expected_adequate_service_after_repair.expected_years"] <
      byId.T13.inputs.common_service_horizon_years,
  );
  assert.equal(knownNext.service_sequence_required, true);
  assert.equal(knownNext.service_sequence_covers_years, 3);
  assert.deepEqual(knownNext.service_sequence.events, [
    { event_type: "repair", time_years: 0 },
    { event_type: "buy_new", time_years: 0.5 },
  ]);
  assert.equal(knownNext.result_status, "calculable_or_conditional_after_sequence");

  assert.ok(
    byId.T14.inputs["repair.expected_adequate_service_after_repair.expected_years"] <
      byId.T14.inputs.common_service_horizon_years,
  );
  assert.equal(unknownNext.service_sequence_required, true);
  assert.equal(unknownNext.result_capability, "insufficient_information");
  assert.deepEqual(unknownNext.missing_required_fields, ["foreseeable_next_event"]);
  assert.equal(unknownNext.service_sequence, undefined);
  assert.notEqual(unknownNext.foreseeable_next_event, "buy_new");
  assert.notEqual(unknownNext.result_status, "calculable_or_conditional_after_sequence");
});

test("covered logic assertion IDs remain the seven executed core A-LOGIC identifiers", () => {
  const sourceLogicIds = sourcePackage.logicAssertions.map(({ id }) => id);
  assert.deepEqual(
    sourceLogicIds.filter((id) => coveredLogicAssertionIds.includes(id)),
    coveredLogicAssertionIds,
  );
  assert.deepEqual(
    sourceLogicIds.filter((id) => !coveredLogicAssertionIds.includes(id)),
    remainingLogicAssertionIds,
  );
});
