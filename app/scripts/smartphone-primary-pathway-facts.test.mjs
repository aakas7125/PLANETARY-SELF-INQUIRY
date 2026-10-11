import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { getApInquirySequence, getProvisionalChoices } from "../src/lib/smartphone/ap-inquiry.mjs";
import { createInquiryState, reduceInquiry } from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import {
  REPAIR_FACT_CATEGORIES,
  buildPathwayEvaluatorInput,
  comparisonStateAfterInquiryAction,
  comparisonStateAfterSituationAction,
  createComparisonState,
  describeComparison,
  parseExplicitServiceYears,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import { evaluateAdequacyAndUnknownState } from "../src/lib/smartphone/input-decision.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;
const PROHIBITED_RESULT =
  /7\.61|0\.475|\b40\b|17\.84|unified harm|harm score|\bwinner\b|recommend|avoided production/i;

const ADEQUATE = {
  safe_to_use: true,
  required_functions_met: true,
  security_support: true,
};

function completedInquiry(choice = null) {
  let state = createInquiryState();
  for (const question of getApInquirySequence()) {
    state = reduceInquiry(state, {
      type: "set_raw",
      questionId: question.question_id,
      text: "A real answer.",
    });
    state = reduceInquiry(state, { type: "continue" });
  }
  if (choice) state = reduceInquiry(state, { type: "set_choice", value: choice });
  return state;
}

function withPathways(pathwayIds, horizonRaw = "4") {
  let state = createComparisonState();
  for (const pathwayId of pathwayIds) {
    state = reduceComparison(state, { type: "toggle", pathwayId });
  }
  if (horizonRaw != null) state = reduceComparison(state, { type: "set_horizon", text: horizonRaw });
  return state;
}

function present(state, answers = ADEQUATE, choice = null) {
  return describeComparison(state, {
    inquiryReviewComplete: true,
    situationAnswers: answers,
    inquiryChoice: choice,
  });
}

function publicCorpus(view) {
  return [
    view.opening,
    view.boundary,
    view.pendingNote,
    view.horizonStatement,
    view.remainingServiceField.label,
    view.remainingServiceField.helper,
    view.remainingServiceField.notSureLabel,
    view.remainingServiceField.notSureControl,
    view.remainingServiceField.notSureNote,
    view.repairField.legend,
    view.repairField.helper,
    view.repairField.serviceLabel,
    view.repairField.serviceHelper,
    view.repairField.notSureLabel,
    view.repairField.notSureControl,
    view.repairField.notSureNote,
    ...view.repairField.categories.map((category) => category.label),
    ...view.cards.flatMap((card) => [card.label, ...card.publicLines]),
  ]
    .filter((line) => line != null)
    .join("\n");
}

describe("smartphone primary pathway facts", () => {
  it("does not preselect or default a current-phone or repair fact", () => {
    const fresh = present(createComparisonState());
    assert.equal(fresh.remainingServiceField.visible, false);
    assert.equal(fresh.repairField.visible, false);
    assert.equal(fresh.remainingServiceField.raw, "");
    assert.equal(fresh.remainingServiceField.notSure, false);
    assert.equal(fresh.remainingServiceField.parsedYears, null);
    assert.equal(fresh.repairField.serviceRaw, "");
    assert.equal(fresh.repairField.serviceNotSure, false);
    assert.equal(fresh.repairField.parsedServiceYears, null);
    assert.equal(
      fresh.repairField.categories.every((category) => category.selected === false),
      true,
    );

    const selected = present(withPathways(["keep", "repair", "new"]));
    assert.equal(selected.remainingServiceField.visible, true);
    assert.equal(selected.repairField.visible, true);
    assert.equal(selected.remainingServiceField.parsedYears, null);
    assert.equal(selected.repairField.categories.some((category) => category.selected), false);
    assert.equal(selected.evaluatorInputs[0]["remaining_service.without_repair.expected_years"], undefined);
    assert.equal(selected.evaluatorInputs[1]["repair.type"], undefined);
    assert.equal(
      selected.evaluatorInputs[1]["repair.expected_adequate_service_after_repair.expected_years"],
      undefined,
    );
    assert.equal(selected.cards[0].publicLines.join(" ").includes("was not supplied"), true);
    assert.match(selected.cards[1].publicLines.join("\n"), /kind of repair was not supplied/);
  });

  it("keeps raw service text separate from the parsed evaluator value", () => {
    let state = withPathways(["keep", "new"], "4");
    state = reduceComparison(state, { type: "set_remaining_service", text: " 2.50 " });
    const view = present(state);
    assert.equal(state.remainingServiceRaw, " 2.50 ");
    assert.equal(view.remainingServiceField.raw, " 2.50 ");
    assert.equal(view.remainingServiceField.parsedYears, 2.5);
    assert.equal(view.horizonRaw, "4");
    assert.equal(view.horizonYears, 4);
    assert.notEqual(view.remainingServiceField.parsedYears, view.horizonYears);
    for (const input of view.evaluatorInputs) {
      assert.equal(input.common_service_horizon_years, 4);
      assert.equal(input["remaining_service.without_repair.expected_years"], 2.5);
    }
    assert.match(publicCorpus(view), /Expected remaining adequate service without repair is 2\.5 years/);
    assert.doesNotMatch(publicCorpus(view), /is 4 years/);
  });

  it("does not copy the shared horizon into remaining service or post-repair service", () => {
    const state = withPathways(["keep", "repair", "new"], "2.50");
    const view = present(state);
    assert.equal(view.horizonRaw, "2.50");
    assert.equal(state.remainingServiceRaw, "");
    assert.equal(state.postRepairServiceRaw, "");
    const [keep, repair, next] = view.evaluatorInputs;
    assert.equal(keep.common_service_horizon_years, 2.5);
    assert.equal(repair.common_service_horizon_years, 2.5);
    assert.equal(next.common_service_horizon_years, 2.5);
    assert.equal(Object.hasOwn(keep, "remaining_service.without_repair.expected_years"), false);
    assert.equal(Object.hasOwn(repair, "remaining_service.without_repair.expected_years"), false);
    assert.equal(Object.hasOwn(next, "remaining_service.without_repair.expected_years"), false);
    assert.equal(Object.hasOwn(repair, "repair.expected_adequate_service_after_repair.expected_years"), false);
    assert.equal(parseExplicitServiceYears("2.50"), 2.5);
    assert.equal(parseExplicitServiceYears(state.horizonRaw), 2.5);
    assert.notEqual(state.remainingServiceRaw, state.horizonRaw);
  });

  it("keeps invalid, missing, and not-sure service unknown and never zero", () => {
    assert.equal(parseExplicitServiceYears(""), null);
    assert.equal(parseExplicitServiceYears("0"), null);
    assert.equal(parseExplicitServiceYears("0.0"), null);
    assert.equal(parseExplicitServiceYears("-1"), null);
    assert.equal(parseExplicitServiceYears("abc"), null);
    assert.equal(parseExplicitServiceYears("1e2"), null);

    for (const raw of ["", "0", "no", "1e2"]) {
      let state = withPathways(["keep", "new"], "4");
      if (raw !== "") state = reduceComparison(state, { type: "set_remaining_service", text: raw });
      const view = present(state);
      for (const input of view.evaluatorInputs) {
        const value = input["remaining_service.without_repair.expected_years"];
        assert.notEqual(value, 0);
        assert.notEqual(value, 3);
        if (raw === "") assert.equal(value, undefined);
        else assert.equal(value, "unknown");
      }
      const decision = evaluateAdequacyAndUnknownState(view.evaluatorInputs[0]);
      assert.notEqual(decision.H_primary_years, 0);
      const spoken = view.cards[0].publicLines.join(" ");
      if (raw === "") assert.match(spoken, /was not supplied/);
      else assert.match(spoken, /was not replaced|was not accepted/);
    }

    let unsure = withPathways(["new"], "4");
    unsure = reduceComparison(unsure, { type: "set_remaining_service", text: "2" });
    unsure = reduceComparison(unsure, { type: "mark_remaining_not_sure" });
    const unsureView = present(unsure);
    assert.equal(unsure.remainingServiceRaw, "2");
    assert.equal(unsureView.remainingServiceField.parsedYears, "unknown");
    assert.equal(unsureView.evaluatorInputs[0]["remaining_service.without_repair.expected_years"], "unknown");
    assert.notEqual(unsureView.evaluatorInputs[0]["remaining_service.without_repair.expected_years"], 0);
    assert.notEqual(unsureView.evaluatorInputs[0]["remaining_service.without_repair.expected_years"], 2);
    assert.match(publicCorpus(unsureView), /not sure/i);
    assert.equal(unsureView.cards[0].capability, "insufficient_information");

    let rejected = withPathways(["keep"], "4");
    rejected = reduceComparison(rejected, { type: "set_remaining_service", text: "30" });
    const rejectedView = present(rejected);
    assert.equal(rejected.remainingServiceRaw, "30");
    assert.equal(rejectedView.evaluatorInputs[0]["remaining_service.without_repair.expected_years"], 30);
    assert.equal(rejectedView.cards[0].decision.validation_status, "error");
    assert.equal(rejectedView.cards[0].decision.accepted_value, null);
    assert.equal(rejectedView.cards[0].decision.H_primary_years, null);
    assert.match(publicCorpus(rejectedView), /was not accepted/);
    assert.doesNotMatch(publicCorpus(rejectedView), /is 30 years/);
    assert.doesNotMatch(publicCorpus(rejectedView), /15 years/);
  });

  it("maps repair categories only onto accepted evaluator types", () => {
    const accepted = ["battery", "display", "major_board"];
    for (const categoryId of accepted) {
      let state = withPathways(["repair"], "4");
      state = reduceComparison(state, { type: "set_repair_category", categoryId });
      const view = present(state);
      assert.equal(view.evaluatorInputs[0]["repair.type"], categoryId);
      assert.equal(view.repairField.categories.find((category) => category.id === categoryId)?.selected, true);
    }

    for (const categoryId of ["another", "not_sure"]) {
      let state = withPathways(["repair"], "4");
      state = reduceComparison(state, { type: "set_repair_category", categoryId });
      const view = present(state);
      assert.equal(Object.hasOwn(view.evaluatorInputs[0], "repair.type"), false);
      assert.equal(view.cards[0].values.length, 0);
      assert.equal(view.cards[0].decision.repair, undefined);
    }

    const ignored = reduceComparison(withPathways(["keep"], "4"), {
      type: "set_repair_category",
      categoryId: "battery",
    });
    assert.equal(ignored.repairCategoryId, null);
    assert.equal(present(ignored).repairField.visible, false);
  });

  it("shows battery and display ranges only as qualified evaluator output", () => {
    for (const categoryId of ["battery", "display"]) {
      let state = withPathways(["repair"], "4");
      state = reduceComparison(state, { type: "set_repair_category", categoryId });
      state = reduceComparison(state, { type: "set_post_repair_service", text: "4" });
      const view = present(state);
      const decision = evaluateAdequacyAndUnknownState(view.evaluatorInputs[0]);
      const shown = view.cards[0].values[0];
      assert.equal(decision.result_capability, "range_quantitative");
      assert.ok(Array.isArray(decision.repair.climate_CO2e_kg));
      assert.deepEqual(shown.exactValue, decision.repair.climate_CO2e_kg);
      assert.equal(shown.unit, "kg CO2e");
      assert.equal(shown.scope, decision.repair.climate_status);
      assert.equal(shown.scope, "PROVISIONAL_GENERIC_RANGE");
      assert.match(shown.line, /kg CO2e \(GWP100\)/);
      assert.match(shown.line, /Provisional generic range/);
      assert.match(shown.line, /not an average/);
      assert.equal(view.cards[0].publicLines.includes(shown.line), true);
    }

    const adapter = readApp("src/lib/smartphone/comparison-ux.mjs");
    const component = readApp("src/components/smartphone-comparison.tsx");
    assert.equal(adapter.includes("0.3"), false);
    assert.equal(adapter.includes("0.7"), false);
    assert.equal(adapter.includes("17.84"), false);
    assert.equal(component.includes("0.3"), false);
    assert.equal(component.includes("17.84"), false);
    assert.equal(component.includes('type="radio"'), false);
  });

  it("leaves generic major-board impact null and unsupported", () => {
    let state = withPathways(["repair"], "4");
    state = reduceComparison(state, { type: "set_repair_category", categoryId: "major_board" });
    state = reduceComparison(state, { type: "set_post_repair_service", text: "4" });
    const view = present(state);
    const repair = view.cards[0].decision.repair;
    assert.equal(view.evaluatorInputs[0]["repair.type"], "major_board");
    assert.equal(view.evaluatorInputs[0]["current_device.manufacturer"], undefined);
    assert.equal(view.evaluatorInputs[0]["current_device.model"], undefined);
    assert.equal(view.evaluatorInputs[0]["repair.repair_mode"], undefined);
    assert.equal(repair.climate_CO2e_kg, null);
    assert.equal(repair.impact_status, "unsupported");
    assert.equal(view.cards[0].values.length, 0);
    assert.equal(view.cards[0].capability, "insufficient_information");
    assert.match(publicCorpus(view), /No supported repair impact is available/);
    assert.doesNotMatch(publicCorpus(view), /17\.84|0\.3/);
    assert.match(publicCorpus(view), /No generic amount is used/);
  });

  it("does not give another or unknown repair a supported range", () => {
    for (const categoryId of ["another", "not_sure"]) {
      let state = withPathways(["repair"], "4");
      state = reduceComparison(state, { type: "set_repair_category", categoryId });
      state = reduceComparison(state, { type: "set_post_repair_service", text: "4" });
      const view = present(state);
      assert.equal(view.evaluatorInputs[0]["repair.type"], undefined);
      assert.equal(view.cards[0].values.length, 0);
      assert.equal(view.cards[0].decision.repair, undefined);
      const corpus = publicCorpus(view);
      assert.doesNotMatch(corpus, /0\.3|3–8|Provisional generic range/);
      if (categoryId === "not_sure") assert.match(corpus, /kind of repair is not sure/);
      if (categoryId === "another") assert.match(corpus, /No other repair range was substituted/);
    }
  });

  it("keeps missing post-repair service insufficient", () => {
    let state = withPathways(["repair"], "4");
    state = reduceComparison(state, { type: "set_repair_category", categoryId: "battery" });
    const view = present(state);
    const decision = view.cards[0].decision;
    assert.equal(
      view.evaluatorInputs[0]["repair.expected_adequate_service_after_repair.expected_years"],
      undefined,
    );
    assert.equal(decision.result_capability, "insufficient_information");
    assert.ok(decision.missing_required_fields.includes("repair.expected_adequate_service_after_repair"));
    assert.match(publicCorpus(view), /after a repair was not supplied/);
    assert.notEqual(
      view.evaluatorInputs[0]["repair.expected_adequate_service_after_repair.expected_years"],
      0,
    );

    let unsure = reduceComparison(state, { type: "mark_post_repair_not_sure" });
    const unsureView = present(unsure);
    assert.equal(
      unsureView.evaluatorInputs[0]["repair.expected_adequate_service_after_repair.expected_years"],
      "unknown",
    );
    assert.equal(unsureView.cards[0].capability, "insufficient_information");
    assert.match(publicCorpus(unsureView), /is not sure/);
  });

  it("requires a complete service sequence when repair service is shorter than the horizon and does not invent the next event", () => {
    let state = withPathways(["repair"], "3");
    state = reduceComparison(state, { type: "set_repair_category", categoryId: "battery" });
    state = reduceComparison(state, { type: "set_post_repair_service", text: "0.5" });
    const view = present(state);
    const decision = view.cards[0].decision;
    assert.equal(view.evaluatorInputs[0].common_service_horizon_years, 3);
    assert.equal(view.evaluatorInputs[0]["repair.expected_adequate_service_after_repair.expected_years"], 0.5);
    assert.equal(Object.hasOwn(view.evaluatorInputs[0], "foreseeable_next_event"), false);
    assert.equal(Object.hasOwn(view.evaluatorInputs[0], "foreseeable_next_event_time_years"), false);
    assert.equal(decision.service_sequence_required, true);
    assert.ok(decision.missing_required_fields.includes("foreseeable_next_event"));
    assert.equal(decision.service_sequence, undefined);
    assert.equal(decision.result_capability, "insufficient_information");
    assert.match(publicCorpus(view), /complete service sequence is required/);
    assert.match(publicCorpus(view), /next event was not supplied and was not invented/);
    assert.equal(readApp("src/components/smartphone-comparison.tsx").includes("foreseeable_next_event"), false);

    const covered = present(
      reduceComparison(state, { type: "set_horizon", text: "0.5" }),
    );
    assert.equal(covered.horizonRaw, "0.5");
    assert.equal(state.postRepairServiceRaw, "0.5");
    assert.equal(covered.repairField.serviceRaw, "0.5");
    assert.equal(covered.cards[0].decision.service_sequence_required, undefined);
    assert.doesNotMatch(publicCorpus(covered), /complete service sequence is required/);
  });

  it("clears stale facts when a pathway is deselected or an earlier stage changes", () => {
    let state = withPathways(["keep", "new", "repair"], "4");
    state = reduceComparison(state, { type: "set_remaining_service", text: "2" });
    state = reduceComparison(state, { type: "set_repair_category", categoryId: "display" });
    state = reduceComparison(state, { type: "set_post_repair_service", text: "1.5" });

    const withoutKeep = reduceComparison(state, { type: "toggle", pathwayId: "keep" });
    assert.equal(withoutKeep.remainingServiceRaw, "2");
    assert.equal(withoutKeep.repairCategoryId, "display");

    const withoutPrimary = reduceComparison(withoutKeep, { type: "toggle", pathwayId: "new" });
    assert.equal(withoutPrimary.remainingServiceRaw, "");
    assert.equal(withoutPrimary.remainingServiceNotSure, false);
    assert.equal(withoutPrimary.repairCategoryId, "display");
    assert.equal(withoutPrimary.postRepairServiceRaw, "1.5");
    const repairOnly = present(withoutPrimary);
    assert.equal(repairOnly.remainingServiceField.visible, false);
    assert.equal(Object.hasOwn(repairOnly.evaluatorInputs[0], "remaining_service.without_repair.expected_years"), false);
    assert.equal(repairOnly.evaluatorInputs[0]["repair.type"], "display");

    const withoutRepair = reduceComparison(state, { type: "toggle", pathwayId: "repair" });
    assert.equal(withoutRepair.repairCategoryId, null);
    assert.equal(withoutRepair.postRepairServiceRaw, "");
    assert.equal(withoutRepair.postRepairServiceNotSure, false);
    assert.equal(withoutRepair.remainingServiceRaw, "2");
    const primary = present(withoutRepair);
    assert.equal(primary.repairField.visible, false);
    for (const input of primary.evaluatorInputs) {
      assert.equal(Object.hasOwn(input, "repair.type"), false);
      assert.equal(input["remaining_service.without_repair.expected_years"], 2);
    }

    assert.deepEqual(comparisonStateAfterSituationAction("edit", state), createComparisonState());
    assert.deepEqual(comparisonStateAfterInquiryAction("set_raw", state), createComparisonState());
    assert.deepEqual(reduceComparison(state, { type: "reset" }), createComparisonState());

    const horizonOnly = reduceComparison(state, { type: "set_horizon", text: "6" });
    assert.equal(horizonOnly.horizonRaw, "6");
    assert.equal(horizonOnly.remainingServiceRaw, "2");
    assert.equal(horizonOnly.postRepairServiceRaw, "1.5");
    assert.equal(horizonOnly.repairCategoryId, "display");
  });

  it("leaves used and refurbished distinct and does not attach primary facts", () => {
    let state = withPathways(["keep", "used_secondhand", "refurbished", "repair"], "4");
    state = reduceComparison(state, { type: "set_remaining_service", text: "2" });
    state = reduceComparison(state, { type: "set_repair_category", categoryId: "battery" });
    state = reduceComparison(state, { type: "set_post_repair_service", text: "2" });
    const view = present(state);
    const [keep, repair, used, refurbished] = view.evaluatorInputs;
    assert.equal(keep["remaining_service.without_repair.expected_years"], 2);
    assert.equal(repair["repair.type"], "battery");
    assert.equal(used.replacement.pathway_user_selection, "used_secondhand");
    assert.equal(refurbished.replacement.pathway_user_selection, "refurbished");
    assert.equal(Object.hasOwn(used, "remaining_service.without_repair.expected_years"), false);
    assert.equal(Object.hasOwn(refurbished, "repair.type"), false);
    assert.equal(Object.hasOwn(used.replacement, "expected_adequate_service"), false);
    assert.equal(Object.hasOwn(refurbished.replacement, "expected_adequate_service"), false);
    assert.notEqual(used.replacement.pathway_user_selection, refurbished.replacement.pathway_user_selection);
    assert.match(publicCorpus(view), /not treated as a refurbished phone/);
    assert.match(publicCorpus(view), /not the same pathway as a used/);
    assert.equal(view.cards[2].values.length, 0);
    assert.equal(view.cards[3].decision.refurb_direct_CO2e.value, null);
  });

  it("keeps an AP choice from supplying empirical facts", () => {
    for (const choice of getProvisionalChoices()) {
      const inquiry = completedInquiry(choice);
      assert.equal(inquiry.provisionalSelection, choice);
      const view = present(createComparisonState(), ADEQUATE, choice);
      assert.equal(view.pathways.every((pathway) => pathway.selected === false), true);
      assert.equal(view.remainingServiceField.parsedYears, null);
      assert.equal(view.repairField.categories.some((category) => category.selected), false);
      assert.equal(view.cards.length, 0);
    }

    const direct = buildPathwayEvaluatorInput("keep", ADEQUATE, 4, {
      remainingService: 2,
      repairCategoryId: "battery",
      postRepairService: 1,
    });
    assert.equal(direct["remaining_service.without_repair.expected_years"], 2);
    assert.equal(direct["repair.type"], undefined);
    assert.equal(direct.common_service_horizon_years, 4);

    const repairOnly = buildPathwayEvaluatorInput("repair", ADEQUATE, 4, {
      remainingService: 2,
      repairCategoryId: "display",
      postRepairService: 1,
    });
    assert.equal(repairOnly["repair.type"], "display");
    assert.equal(repairOnly["repair.expected_adequate_service_after_repair.expected_years"], 1);
    assert.equal(Object.hasOwn(repairOnly, "remaining_service.without_repair.expected_years"), false);

    const corpus = publicCorpus(present(withPathways(["keep", "repair", "new", "used_secondhand", "refurbished"], "4")));
    assert.doesNotMatch(corpus, SNAKE_CASE_TOKEN);
    assert.doesNotMatch(corpus, PROHIBITED_RESULT);
    assert.equal(REPAIR_FACT_CATEGORIES.map((category) => category.label).join(" ").includes("_"), false);
  });
});
