import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { getApInquirySequence } from "../src/lib/smartphone/ap-inquiry.mjs";
import {
  createInquiryState,
  reduceInquiry,
} from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import {
  createOthernessState,
  othernessStateAfterComparisonAction,
  reduceOtherness,
} from "../src/lib/smartphone/ap-otherness-ux.mjs";
import {
  buildPathwayEvaluatorInput,
  canEnterComparison,
  comparisonStateAfterInquiryAction,
  comparisonStateAfterSituationAction,
  createComparisonState,
  describeComparison,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import { describeLifecycleGuide } from "../src/lib/smartphone/lifecycle-presentation.mjs";
import {
  createFinalChoiceState,
  finalChoiceStateAfterComparisonAction,
  reduceFinalChoice,
} from "../src/lib/smartphone/final-choice-ux.mjs";
import {
  createImpactState,
  describeImpact,
  impactContextFromComparison,
  impactStateAfterComparisonAction,
  reduceImpact,
} from "../src/lib/smartphone/impact-pathways-ux.mjs";
import { evaluateAdequacyAndUnknownState } from "../src/lib/smartphone/input-decision.mjs";
import {
  APPROVED_SMARTPHONE_MODEL_RECORDS,
  FAIRPHONE_5_REPAIR_SUBRECORDS,
  GENERIC_SMARTPHONE_MODEL_ID,
  resolveApprovedModelRecord,
} from "../src/lib/smartphone/model-evidence.mjs";
import { evaluateSecondaryPathwayCase } from "../src/lib/smartphone/secondary-pathway.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;
const PACKAGE_COMMIT = "024a95392d2e1555a3c9b598fdc291bd341c3d6b";

const ADEQUATE = {
  safe_to_use: true,
  required_functions_met: true,
  security_support: true,
};

function completedInquiry() {
  let state = createInquiryState();
  for (const question of getApInquirySequence()) {
    state = reduceInquiry(state, {
      type: "set_raw",
      questionId: question.question_id,
      text: `Answer ${question.question_id}`,
    });
    state = reduceInquiry(state, { type: "continue" });
  }
  return state;
}

function comparisonWith(pathwayIds, horizonRaw, mutate) {
  let state = createComparisonState();
  for (const pathwayId of pathwayIds) {
    state = reduceComparison(state, { type: "toggle", pathwayId });
  }
  state = reduceComparison(state, { type: "set_horizon", text: horizonRaw });
  if (mutate) state = mutate(state);
  return describeComparison(state, {
    inquiryReviewComplete: canEnterComparison(completedInquiry()),
    situationAnswers: ADEQUATE,
  });
}

function recordByLabel(label) {
  const record = APPROVED_SMARTPHONE_MODEL_RECORDS.find((item) => item.public_label === label);
  assert.ok(record);
  return record;
}

function newDecision(model) {
  return evaluateAdequacyAndUnknownState({
    "adequacy.safe_to_use": true,
    "adequacy.required_functions_met": true,
    "security_support.adequate_for_required_use": true,
    "remaining_service.without_repair.expected_years": 2.5,
    common_service_horizon_years: 4,
    "replacement.type": "new",
    "replacement.new.model": model,
    "replacement.new.production_CO2e_kg": 999,
  });
}

describe("controlled smartphone model evidence", () => {
  it("transcribes the three records and Fairphone repair sub-records exactly", () => {
    assert.equal(APPROVED_SMARTPHONE_MODEL_RECORDS.length, 3);
    const fairphone = recordByLabel("Fairphone 5");
    const samsung = recordByLabel("Samsung Galaxy S25 EUR");
    const iphone = recordByLabel("Apple iPhone 16 128 GB");

    assert.equal(fairphone.record_id, "MS-CLIMATE-FAIRPHONE5-S2-V0");
    assert.equal(fairphone.source_id, "S2");
    assert.equal(fairphone.source_year, 2024);
    assert.equal(fairphone.source_provenance, "Fraunhofer IZM LCA, commissioned by Fairphone B.V.");
    assert.equal(fairphone.total.display, "42.10");
    assert.equal(fairphone.production.display, "32.70");
    assert.equal(fairphone.production.kind, "source_reported_point");
    assert.equal(fairphone.distribution.display, "2.81");
    assert.equal(fairphone.distribution.phase_label, "transport");
    assert.equal(fairphone.use_phase.display, "6.59");
    assert.equal(fairphone.source_use_period_years, 3);
    assert.equal(fairphone.eol.display, "0.041");
    assert.equal(fairphone.eol.kind, "source_reported_point");
    assert.equal(fairphone.derived_values, false);
    assert.equal(fairphone.water_indicator_record, null);
    assert.equal(fairphone.package_commit, PACKAGE_COMMIT);
    assert.equal(fairphone.confidence, undefined);

    assert.equal(samsung.record_id, "MS-CLIMATE-GALAXY-S25-EUR-S3-V0");
    assert.equal(samsung.source_use_period_known, false);
    assert.equal(samsung.source_use_period_years, null);
    assert.equal(samsung.total.display, "45.7");
    assert.equal(samsung.total.kind, "source_reported_point");
    assert.equal(samsung.production.display, "40.22");
    assert.equal(samsung.production.kind, "approximate_derived_point");
    assert.equal(samsung.distribution.display, "2.38");
    assert.equal(samsung.distribution.phase_label, "distribution");
    assert.equal(samsung.use_phase.display, "2.97");
    assert.equal(samsung.eol.display, "0.14");
    assert.equal(samsung.rounding_uncertainty, true);
    assert.equal(samsung.confidence, undefined);
    assert.equal(samsung.region, "EUR");

    assert.equal(iphone.record_id, "MS-CLIMATE-IPHONE16-128GB-S4-V0");
    assert.equal(iphone.configuration.includes("128 GB only"), true);
    assert.equal(iphone.production.display, "44.8");
    assert.equal(iphone.distribution.display, "1.68");
    assert.equal(iphone.distribution.phase_label, "transportation");
    assert.equal(iphone.use_phase.display, "10.08");
    assert.equal(iphone.source_use_period_years, 3);
    assert.equal(iphone.eol.kind, "upper_bound");
    assert.equal(iphone.eol.comparator, "<");
    assert.equal(iphone.eol.display, "<0.56");
    assert.equal(iphone.eol.magnitude_kg, null);
    assert.equal(iphone.eol.bound_kg, 0.56);
    assert.notEqual(iphone.eol.magnitude_kg, 0.56);

    assert.deepEqual(
      FAIRPHONE_5_REPAIR_SUBRECORDS.map((item) => [item.field, item.display]),
      [
        ["repair.battery.diy", "0.568"],
        ["repair.battery.repair_center", "0.617"],
        ["repair.display.diy", "7.431"],
        ["repair.display.repair_center", "7.493"],
        ["repair.primary_pcba.full_module_diy", "17.840"],
        ["repair.primary_pcba.full_module_repair_center", "17.909"],
        ["repair.primary_pcba.board_level_part_repair_center", "6.959"],
      ],
    );
    for (const item of FAIRPHONE_5_REPAIR_SUBRECORDS) {
      assert.equal(item.source_id, "S2");
      assert.equal(item.status, "APPROVED_MODEL_SPECIFIC");
    }
  });

  it("resolves only exact ids and labels, and keeps the synthetic marker unreal", () => {
    const fairphone = recordByLabel("Fairphone 5");
    assert.equal(resolveApprovedModelRecord(fairphone.record_id), fairphone);
    assert.equal(resolveApprovedModelRecord(fairphone.public_label), fairphone);
    for (const alias of [
      "approved_registry_match",
      "Galaxy S25",
      "Samsung Galaxy S25",
      "iPhone 16",
      "iPhone 16 128GB",
      "iPhone 16 Plus",
      "iPhone 16 256 GB",
      "fairphone 5",
      "Fairphone",
    ]) {
      assert.equal(resolveApprovedModelRecord(alias), null);
    }

    const synthetic = newDecision("approved_registry_match");
    assert.equal(synthetic.generic_range_used_as_primary, false);
    assert.equal(synthetic.replacement.new.primary_climate_source, "model_specific");
    assert.equal(synthetic.replacement.new.production_CO2e_kg, undefined);
    assert.equal(synthetic.replacement.new.record_id, undefined);
    assert.notEqual(synthetic.replacement.new.production_CO2e_kg, 999);

    const injected = newDecision("not-a-real-phone");
    assert.deepEqual(injected.replacement.new.production_CO2e_kg, [25, 70]);
    assert.deepEqual(injected.replacement.new.distribution_CO2e_kg, [2, 4]);
    assert.equal(injected.replacement.new.provenance_scope, "generic_fallback");
    assert.equal(injected.replacement.new.record_id, undefined);
    assert.deepEqual(injected.new.production_CO2e_kg, [25, 70]);
    assert.notEqual(injected.replacement.new.production_CO2e_kg, 999);
  });

  it("uses the candidate record on both new channels and leaves reference phases out of the horizon", () => {
    const fairphone = recordByLabel("Fairphone 5");
    const exact = newDecision(fairphone.record_id);
    assert.equal(exact.replacement.new.production_CO2e_kg, fairphone.production.magnitude_kg);
    assert.equal(exact.replacement.new.distribution_CO2e_kg, fairphone.distribution.magnitude_kg);
    assert.equal(exact.replacement.new.distribution_phase_label, "transport");
    assert.equal(exact.replacement.new.provenance_scope, "model_specific");
    assert.equal(exact.new.production_CO2e_kg, exact.replacement.new.production_CO2e_kg);
    assert.equal(exact.new.distribution_CO2e_kg, exact.replacement.new.distribution_CO2e_kg);
    assert.equal(exact.new.distribution_phase_label, "transport");
    assert.notDeepEqual(exact.replacement.new.production_CO2e_kg, [25, 70]);
    assert.equal(exact.H_primary_years, 2.5);
    assert.notEqual(exact.H_primary_years, 3);
    assert.equal(exact.replacement.new.production_CO2e_kg, 32.7);
    assert.notEqual(exact.replacement.new.production_CO2e_kg, fairphone.total.magnitude_kg);
    assert.equal(exact.replacement.new.source_model_reference.not_substituted_into_user_horizon, true);
    assert.equal(exact.replacement.new.source_model_reference.use_magnitude_kg, 6.59);
    assert.equal(exact.charging_carbon_CO2e_kg, undefined);
    assert.notEqual(exact.charging_carbon_CO2e_kg, 6.59);
    assert.equal(exact.derived.adequacy_gate.adequacy_status, "adequate");

    const incomplete = evaluateAdequacyAndUnknownState({
      "adequacy.safe_to_use": true,
      "adequacy.required_functions_met": true,
      "security_support.adequate_for_required_use": true,
      "replacement.type": "new",
      "replacement.new.model": fairphone.public_label,
    });
    assert.equal(incomplete.replacement.new.production_display, "32.70");
    assert.equal(incomplete.new, undefined);
    assert.equal(incomplete.result_capability, "insufficient_information");
    assert.notDeepEqual(incomplete.replacement.new.production_CO2e_kg, [25, 70]);

    const samsung = newDecision("Samsung Galaxy S25 EUR");
    assert.equal(samsung.replacement.new.production_display, "40.22");
    assert.equal(samsung.replacement.new.production_value_kind, "approximate_derived_point");
    assert.equal(samsung.new.source_model_reference.use_period_known, false);
    assert.equal(samsung.new.source_model_reference.use_period_years, null);
    assert.notEqual(samsung.H_primary_years, 3);

    const iphone = newDecision("Apple iPhone 16 128 GB");
    assert.equal(iphone.replacement.new.distribution_phase_label, "transportation");
    assert.equal(iphone.new.source_model_reference.eol_comparator, "<");
    assert.equal(iphone.new.source_model_reference.eol_magnitude_kg, null);
    assert.equal(iphone.new.production_value_kind, "approximate_derived_point");
  });

  it("keeps current-phone production historical and does not apply repair sub-records from identity", () => {
    const fairphone = recordByLabel("Fairphone 5");
    const owned = evaluateAdequacyAndUnknownState({
      "adequacy.safe_to_use": true,
      "adequacy.required_functions_met": true,
      "security_support.adequate_for_required_use": true,
      "remaining_service.without_repair.expected_years": 4,
      "current_device.model_record_id": fairphone.record_id,
      "current_device.model": fairphone.public_label,
      "repair.type": "battery",
      "repair.expected_adequate_service_after_repair.expected_years": 4,
    });
    assert.equal(owned.current_owned_source_model.role, "historical_source_model_reference");
    assert.equal(owned.current_owned_source_model.included_in_prospective_keep_or_repair, false);
    assert.equal(owned.current_owned_source_model.avoided_production_credit, null);
    assert.equal(owned.current_owned_source_model.production_display, "32.70");
    assert.equal(owned.historic_owned_production_included_in_prospective_keep_total, false);
    assert.equal(owned.avoided_manufacture_credit_from_owned_history, null);
    assert.deepEqual(owned.repair.climate_CO2e_kg, [0.3, 0.7]);
    assert.notEqual(owned.repair.climate_CO2e_kg, 0.568);

    const board = evaluateAdequacyAndUnknownState({
      "current_device.manufacturer": "Fairphone",
      "current_device.model": "Fairphone 5",
      "repair.type": "major_board",
    });
    assert.equal(board.repair.climate_CO2e_kg, null);
    assert.equal(board.repair.impact_status, "unsupported");
    assert.notEqual(board.repair.climate_CO2e_kg, 17.84);
  });

  it("drives comparison from the candidate choice and preserves generic, exact, and cleared routes", () => {
    const fairphone = recordByLabel("Fairphone 5");
    const samsung = recordByLabel("Samsung Galaxy S25 EUR");
    const iphone = recordByLabel("Apple iPhone 16 128 GB");
    const inquiry = completedInquiry();
    const inquiryBefore = JSON.stringify(inquiry);

    let state = createComparisonState();
    state = reduceComparison(state, { type: "toggle", pathwayId: "new" });
    state = reduceComparison(state, { type: "toggle", pathwayId: "used_secondhand" });
    state = reduceComparison(state, { type: "set_horizon", text: "4" });
    state = reduceComparison(state, { type: "set_remaining_service", text: "2.50" });
    const present = () =>
      describeComparison(state, {
        inquiryReviewComplete: true,
        situationAnswers: ADEQUATE,
      });

    const generic = present();
    const genericCard = generic.cards.find((card) => card.id === "new");
    assert.equal(generic.currentOwnedField.choices.some((choice) => choice.selected), false);
    assert.equal(generic.candidateNewField.choices.some((choice) => choice.selected), false);
    assert.deepEqual(genericCard.decision.replacement.new.production_CO2e_kg, [25, 70]);
    assert.match(genericCard.publicLines.join("\n"), /No specific new-phone model was supplied/);
    assert.equal(generic.modelGuideNote, null);
    assert.equal(describeLifecycleGuide().roleNote.includes("generic"), true);

    state = reduceComparison(state, { type: "set_candidate_new_model", modelId: GENERIC_SMARTPHONE_MODEL_ID });
    const explicitGeneric = present();
    assert.match(
      explicitGeneric.cards.find((card) => card.id === "new").publicLines.join("\n"),
      /generic smartphone evidence/,
    );
    assert.match(explicitGeneric.modelGuideNote, /generic smartphone evidence/);
    assert.deepEqual(
      explicitGeneric.cards.find((card) => card.id === "new").decision.replacement.new.production_CO2e_kg,
      [25, 70],
    );

    state = reduceComparison(state, { type: "set_candidate_new_model", modelId: fairphone.record_id });
    state = reduceComparison(state, { type: "set_current_owned_model", modelId: iphone.record_id });
    const exact = present();
    const exactCard = exact.cards.find((card) => card.id === "new");
    const production = exactCard.values.find((value) => value.name === "Production");
    const transport = exactCard.values.find((value) => value.name === "Transport");
    assert.equal(production.display, "32.70");
    assert.equal(production.valueKind, "source_reported_point");
    assert.equal(production.scope, "model_specific");
    assert.doesNotMatch(production.line, /–/);
    assert.match(production.line, /not a measurement of this physical handset/);
    assert.equal(transport.display, "2.81");
    assert.equal(exactCard.decision.new.production_CO2e_kg, 32.7);
    assert.equal(exactCard.decision.replacement.new.production_CO2e_kg, 32.7);
    assert.match(exactCard.publicLines.join("\n"), /Source whole-life reference: 42\.10/);
    assert.match(exactCard.publicLines.join("\n"), /not added to this horizon/);
    assert.match(exactCard.publicLines.join("\n"), /not expected service/);
    assert.equal(exactCard.values.some((value) => /whole-life|use-phase|end-of-life/i.test(value.name)), false);
    assert.equal(exact.currentOwnedHistory.label, iphone.public_label);
    assert.match(exact.currentOwnedHistory.lines.join("\n"), /below 0\.56/);
    assert.match(exact.currentOwnedHistory.lines.join("\n"), /not an exact amount/);
    assert.match(exact.currentOwnedHistory.lines.join("\n"), /does not offset a new phone/);
    assert.match(exact.modelGuideNote, /stays generic education/);
    assert.equal(exact.cards.find((card) => card.id === "used_secondhand").values.length, 0);
    assert.equal(
      exact.evaluatorInputs.find((input) => input.replacement?.pathway_user_selection === "used_secondhand")
        .replacement.production_CO2e_kg,
      undefined,
    );
    assert.doesNotMatch(
      [...exactCard.publicLines, ...exact.currentOwnedHistory.lines, exact.modelGuideNote].join("\n"),
      SNAKE_CASE_TOKEN,
    );
    assert.equal(JSON.stringify(inquiry), inquiryBefore);

    const genericBasis = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
      ...impactContextFromComparison(generic, { comparisonEntered: true }),
    });
    assert.equal(genericBasis.manufacturingBasis.provenanceScope, "generic_fallback");
    assert.equal(genericBasis.domains.find((domain) => domain.id === "climate").emitted, true);

    const exactBasis = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
      ...impactContextFromComparison(exact, { comparisonEntered: true }),
    });
    assert.equal(exactBasis.manufacturingBasis, null);
    assert.equal(exactBasis.domains.find((domain) => domain.id === "climate").emitted, false);
    assert.equal(
      exactBasis.domains.find((domain) => domain.id === "climate").reasonCode,
      "condition_not_satisfied",
    );

    state = reduceComparison(state, { type: "set_candidate_new_model", modelId: samsung.record_id });
    const switched = present();
    const switchedProduction = switched.cards.find((card) => card.id === "new").values.find((value) => value.name === "Production");
    assert.equal(switchedProduction.display, "40.22");
    assert.equal(switchedProduction.valueKind, "approximate_derived_point");
    assert.match(switchedProduction.line, /about 40\.22/);
    assert.match(switched.cards.find((card) => card.id === "new").publicLines.join("\n"), /does not state how many years/);
    const switchedBasis = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
      ...impactContextFromComparison(switched, { comparisonEntered: true }),
    });
    assert.equal(switchedBasis.manufacturingBasis, null);

    state = reduceComparison(state, { type: "set_candidate_new_model", modelId: samsung.record_id });
    const cleared = present();
    assert.equal(cleared.candidateNewField.choices.some((choice) => choice.selected), false);
    assert.deepEqual(
      cleared.cards.find((card) => card.id === "new").decision.replacement.new.production_CO2e_kg,
      [25, 70],
    );
    const restored = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
      ...impactContextFromComparison(cleared, { comparisonEntered: true }),
    });
    assert.equal(restored.manufacturingBasis.provenanceScope, "generic_fallback");
    assert.equal(restored.domains.find((domain) => domain.id === "climate").emitted, true);
    assert.equal(restored.domains.find((domain) => domain.id === "mining-eco").emitted, false);

    const selectedBefore = state.selectedIds.join(",");
    state = reduceComparison(state, { type: "set_current_owned_model", modelId: fairphone.record_id });
    assert.equal(state.selectedIds.join(","), selectedBefore);
    const ownedView = present();
    assert.equal(ownedView.cards.find((card) => card.id === "new").decision.derived.adequacy_gate.adequacy_status, "adequate");
    assert.match(ownedView.currentOwnedHistory.lines.join("\n"), /32\.70/);
    assert.equal(
      ownedView.cards.find((card) => card.id === "new").values.some((value) => value.display === "32.70"),
      false,
    );
  });

  it("clears stale downstream answers on a model edit and does not rewrite inquiry answers", () => {
    let otherness = reduceOtherness(createOthernessState(), { type: "open" });
    otherness = reduceOtherness(otherness, { type: "set_response", text: "Exact raw words." });
    assert.equal(othernessStateAfterComparisonAction("set_current_owned_model", otherness).response, "");

    let choice = reduceFinalChoice(createFinalChoiceState(), { type: "open" });
    choice = reduceFinalChoice(choice, { type: "set_choice", value: "new" });
    assert.equal(finalChoiceStateAfterComparisonAction("set_candidate_new_model", choice).selection, null);

    const openedImpact = reduceImpact(createImpactState(), { type: "open" });
    assert.equal(impactStateAfterComparisonAction("set_candidate_new_model", openedImpact), openedImpact);
    assert.equal(impactStateAfterComparisonAction("reset", openedImpact).opened, false);

    let comparison = reduceComparison(createComparisonState(), { type: "toggle", pathwayId: "new" });
    comparison = reduceComparison(comparison, { type: "set_candidate_new_model", modelId: "MS-CLIMATE-FAIRPHONE5-S2-V0" });
    comparison = reduceComparison(comparison, { type: "set_current_owned_model", modelId: "MS-CLIMATE-IPHONE16-128GB-S4-V0" });
    assert.deepEqual(comparisonStateAfterInquiryAction("back", comparison), createComparisonState());
    assert.deepEqual(comparisonStateAfterSituationAction("edit", comparison), createComparisonState());
    assert.equal(reduceComparison(comparison, { type: "reset" }).candidateNewModelId, null);

    const repairOnly = comparisonWith(["repair"], "4", (current) =>
      reduceComparison(
        reduceComparison(current, { type: "set_repair_category", categoryId: "major_board" }),
        { type: "set_current_owned_model", modelId: "MS-CLIMATE-FAIRPHONE5-S2-V0" },
      ),
    );
    assert.equal(repairOnly.evaluatorInputs[0]["repair.repair_mode"], undefined);
    assert.equal(repairOnly.cards[0].decision.repair.climate_CO2e_kg, null);
    assert.equal(repairOnly.cards[0].decision.current_owned_source_model.production_display, "32.70");

    const usedInput = buildPathwayEvaluatorInput("used_secondhand", ADEQUATE, 4, {
      usedService: 2,
      currentOwnedModelId: "MS-CLIMATE-FAIRPHONE5-S2-V0",
      candidateNewModelId: "MS-CLIMATE-GALAXY-S25-EUR-S3-V0",
    });
    const used = evaluateSecondaryPathwayCase(usedInput);
    assert.equal(used.replacement?.production_CO2e_kg, undefined);
    assert.notEqual(used.original_manufacturing?.enters_direct_acquisition_total, true);

    const situation = readFileSync(join(appRoot, "src/components/smartphone-situation.tsx"), "utf8");
    const onComparison = situation.slice(situation.indexOf("function onComparison"), situation.indexOf("function onOtherness"));
    assert.equal(onComparison.includes("dispatchInquiry"), false);
  });
});
