import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { getApInquirySequence } from "../src/lib/smartphone/ap-inquiry.mjs";
import { createInquiryState, reduceInquiry } from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import {
  buildPathwayEvaluatorInput,
  comparisonStateAfterInquiryAction,
  comparisonStateAfterSituationAction,
  createComparisonState,
  describeComparison,
  parseExplicitServiceYears,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import { evaluateSecondaryPathwayCase } from "../src/lib/smartphone/secondary-pathway.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;
const PROHIBITED_RESULT =
  /7\.61|0\.475|\b40\b|unified harm|harm score|\bwinner\b|recommend|generic refurbished footprint is [0-9]|avoided production|\bscore\b/i;

const ADEQUATE = {
  safe_to_use: true,
  required_functions_met: true,
  security_support: true,
};

function withPathways(pathwayIds, horizonRaw = "4") {
  let state = createComparisonState();
  for (const pathwayId of pathwayIds) {
    state = reduceComparison(state, { type: "toggle", pathwayId });
  }
  if (horizonRaw != null) state = reduceComparison(state, { type: "set_horizon", text: horizonRaw });
  return state;
}

function present(state, answers = ADEQUATE) {
  return describeComparison(state, {
    inquiryReviewComplete: true,
    situationAnswers: answers,
  });
}

function publicCorpus(view) {
  return [
    view.opening,
    view.boundary,
    view.pendingNote,
    view.horizonStatement,
    view.usedServiceField.label,
    view.usedServiceField.helper,
    view.usedServiceField.notSureLabel,
    view.usedServiceField.notSureControl,
    view.usedServiceField.notSureNote,
    view.refurbishedServiceField.label,
    view.refurbishedServiceField.helper,
    view.refurbishedServiceField.notSureLabel,
    view.refurbishedServiceField.notSureControl,
    view.refurbishedServiceField.notSureNote,
    ...view.cards.flatMap((card) => [card.label, ...card.publicLines]),
  ]
    .filter((line) => line != null)
    .join("\n");
}

describe("smartphone secondary candidate service facts", () => {
  it("does not preselect or default either candidate service value", () => {
    const fresh = present(createComparisonState());
    assert.equal(fresh.usedServiceField.visible, false);
    assert.equal(fresh.refurbishedServiceField.visible, false);
    assert.equal(fresh.usedServiceField.raw, "");
    assert.equal(fresh.usedServiceField.notSure, false);
    assert.equal(fresh.usedServiceField.parsedYears, null);
    assert.equal(fresh.refurbishedServiceField.raw, "");
    assert.equal(fresh.refurbishedServiceField.notSure, false);
    assert.equal(fresh.refurbishedServiceField.parsedYears, null);

    const selected = present(withPathways(["used_secondhand", "refurbished"], "4"));
    assert.equal(selected.usedServiceField.visible, true);
    assert.equal(selected.refurbishedServiceField.visible, true);
    assert.equal(selected.usedServiceField.parsedYears, null);
    assert.equal(selected.refurbishedServiceField.parsedYears, null);
    assert.equal(Object.hasOwn(selected.evaluatorInputs[0].replacement, "expected_adequate_service"), false);
    assert.equal(Object.hasOwn(selected.evaluatorInputs[1].replacement, "expected_adequate_service"), false);
    assert.equal(Object.hasOwn(selected.evaluatorInputs[0].replacement, "pathway"), false);
    assert.equal(Object.hasOwn(selected.evaluatorInputs[1].replacement, "pathway"), false);
    assert.match(publicCorpus(selected), /used or second-hand candidate was not supplied|for this candidate was not supplied/);
    assert.match(publicCorpus(selected), /Expected adequate service is not assumed from the comparison period/);
  });

  it("keeps raw candidate text separate from the parsed evaluator value", () => {
    let state = withPathways(["used_secondhand"], "4");
    state = reduceComparison(state, { type: "set_used_service", text: " 1.50 " });
    const view = present(state);
    assert.equal(state.usedServiceRaw, " 1.50 ");
    assert.equal(view.usedServiceField.raw, " 1.50 ");
    assert.equal(view.usedServiceField.parsedYears, 1.5);
    assert.equal(view.horizonRaw, "4");
    assert.notEqual(view.usedServiceField.parsedYears, view.horizonYears);
    assert.equal(view.evaluatorInputs[0].replacement.expected_adequate_service.expected_years, 1.5);
    assert.match(publicCorpus(view), /Expected adequate service for this candidate is 1\.5 years/);
    assert.doesNotMatch(publicCorpus(view), /is 4 years(?! for every alternative)/);
    assert.match(publicCorpus(view), /The selected comparison period is 4 years for every alternative\./);
  });

  it("maps each candidate only to its accepted service structure and does not copy the horizon", () => {
    let state = withPathways(["used_secondhand", "refurbished"], "2.50");
    state = reduceComparison(state, { type: "set_used_service", text: "1.5" });
    state = reduceComparison(state, { type: "set_refurbished_service", text: "3" });
    const view = present(state);
    const [used, refurbished] = view.evaluatorInputs;

    assert.equal(used.comparison.common_service_horizon_years, 2.5);
    assert.equal(refurbished.comparison.common_service_horizon_years, 2.5);
    assert.deepEqual(used.replacement, {
      pathway_user_selection: "used_secondhand",
      pathway: "used_secondhand",
      expected_adequate_service: { expected_years: 1.5 },
    });
    assert.deepEqual(refurbished.replacement, {
      pathway_user_selection: "refurbished",
      pathway: "refurbished",
      expected_adequate_service: { expected_years: 3 },
    });
    assert.equal(Object.hasOwn(used, "case_id"), false);
    assert.equal(Object.hasOwn(refurbished, "case_id"), false);
    assert.equal(Object.hasOwn(used, "next_event_after_secondary_failure"), false);
    assert.equal(Object.hasOwn(refurbished, "next_event_after_secondary_failure"), false);
    assert.equal(Object.hasOwn(used.replacement, "transfer"), false);
    assert.equal(Object.hasOwn(refurbished.replacement, "source_specific_reference"), false);
    assert.notEqual(
      used.replacement.expected_adequate_service.expected_years,
      refurbished.replacement.expected_adequate_service.expected_years,
    );
    assert.notEqual(used.replacement.expected_adequate_service.expected_years, 2.5);
    assert.notEqual(refurbished.replacement.expected_adequate_service.expected_years, 2.5);
    assert.equal(state.horizonRaw, "2.50");
    assert.equal(state.usedServiceRaw, "1.5");
    assert.equal(state.refurbishedServiceRaw, "3");

    const directUsed = buildPathwayEvaluatorInput("used_secondhand", ADEQUATE, 2.5, {
      usedService: 1.5,
      refurbishedService: 3,
    });
    assert.equal(directUsed.replacement.expected_adequate_service.expected_years, 1.5);
    assert.equal(Object.hasOwn(directUsed.replacement, "source_specific_reference"), false);
    const directRefurbished = buildPathwayEvaluatorInput("refurbished", ADEQUATE, 2.5, {
      usedService: 1.5,
      refurbishedService: 3,
    });
    assert.equal(directRefurbished.replacement.expected_adequate_service.expected_years, 3);
    assert.notEqual(
      directUsed.replacement.pathway_user_selection,
      directRefurbished.replacement.pathway_user_selection,
    );
  });

  it("does not copy one candidate service into the other", () => {
    let state = withPathways(["used_secondhand", "refurbished"], "4");
    state = reduceComparison(state, { type: "set_used_service", text: "2" });
    assert.equal(state.refurbishedServiceRaw, "");
    state = reduceComparison(state, { type: "set_refurbished_service", text: "5" });
    assert.equal(state.usedServiceRaw, "2");
    const view = present(state);
    assert.equal(view.evaluatorInputs[0].replacement.expected_adequate_service.expected_years, 2);
    assert.equal(view.evaluatorInputs[1].replacement.expected_adequate_service.expected_years, 5);
    state = reduceComparison(state, { type: "set_used_service", text: "2.25" });
    assert.equal(state.refurbishedServiceRaw, "5");
    assert.equal(present(state).evaluatorInputs[1].replacement.expected_adequate_service.expected_years, 5);
  });

  it("keeps empty, invalid, and not-sure candidate service unknown and never zero", () => {
    assert.equal(parseExplicitServiceYears(""), null);
    assert.equal(parseExplicitServiceYears("0"), null);
    assert.equal(parseExplicitServiceYears("0.0"), null);
    assert.equal(parseExplicitServiceYears("-1"), null);
    assert.equal(parseExplicitServiceYears("abc"), null);

    for (const raw of ["", "0", "no", "1e2"]) {
      let state = withPathways(["used_secondhand", "refurbished"], "4");
      if (raw !== "") {
        state = reduceComparison(state, { type: "set_used_service", text: raw });
        state = reduceComparison(state, { type: "set_refurbished_service", text: raw });
      }
      const view = present(state);
      for (const input of view.evaluatorInputs) {
        const value = input.replacement.expected_adequate_service?.expected_years;
        assert.notEqual(value, 0);
        assert.notEqual(value, 2);
        assert.notEqual(value, 3);
        assert.notEqual(value, 4);
        if (raw === "") assert.equal(value, undefined);
        else assert.equal(value, "unknown");
      }
      const spoken = publicCorpus(view);
      if (raw === "") assert.match(spoken, /was not supplied/);
      else assert.match(spoken, /cannot be used/);
      assert.doesNotMatch(spoken, /is 0 years/);
    }

    let unsure = withPathways(["used_secondhand", "refurbished"], "4");
    unsure = reduceComparison(unsure, { type: "set_used_service", text: "2" });
    unsure = reduceComparison(unsure, { type: "mark_used_not_sure" });
    unsure = reduceComparison(unsure, { type: "mark_refurbished_not_sure" });
    const unsureView = present(unsure);
    assert.equal(unsure.usedServiceRaw, "2");
    assert.equal(unsure.refurbishedServiceRaw, "");
    assert.equal(unsureView.usedServiceField.parsedYears, "unknown");
    assert.equal(unsureView.refurbishedServiceField.parsedYears, "unknown");
    assert.equal(unsureView.evaluatorInputs[0].replacement.expected_adequate_service.expected_years, "unknown");
    assert.equal(unsureView.evaluatorInputs[1].replacement.expected_adequate_service.expected_years, "unknown");
    assert.notEqual(unsureView.evaluatorInputs[0].replacement.expected_adequate_service.expected_years, 2);
    assert.equal(unsureView.cards[0].decision.used_service_life, undefined);
    assert.notEqual(unsureView.cards[0].decision.direct_secondary_CO2e, 0);
    assert.equal(unsureView.cards[1].decision.refurb_direct_CO2e.value, null);
    assert.match(publicCorpus(unsureView), /is not sure/i);
    assert.doesNotMatch(publicCorpus(unsureView), /is 0 years/);
  });

  it("keeps used and refurbished distinct when service is supplied", () => {
    let state = withPathways(["used_secondhand", "refurbished"], "4");
    state = reduceComparison(state, { type: "set_used_service", text: "2" });
    state = reduceComparison(state, { type: "set_refurbished_service", text: "2" });
    const view = present(state);
    const [usedInput, refurbishedInput] = view.evaluatorInputs;
    const used = evaluateSecondaryPathwayCase(usedInput);
    const refurbished = evaluateSecondaryPathwayCase(refurbishedInput);
    assert.equal(used.secondary_pathway, "used_secondhand");
    assert.equal(refurbished.secondary_pathway, "refurbished");
    assert.notEqual(used.secondary_pathway, refurbished.secondary_pathway);
    assert.equal(view.cards[0].secondaryPathway, "used_secondhand");
    assert.equal(view.cards[1].secondaryPathway, "refurbished");
    assert.match(publicCorpus(view), /not treated as a refurbished phone/);
    assert.match(publicCorpus(view), /not the same pathway as a used/);
    assert.equal(used.direct_secondary_CO2e, null);
    assert.equal(refurbished.refurb_direct_CO2e.value, null);
    assert.equal(refurbished.refurb_direct_CO2e.status, "UNKNOWN_NO_FALLBACK");
    assert.notEqual(refurbished.ADEME_7_61_applied, true);
    assert.equal(Object.hasOwn(refurbished, "refurb_direct_reference_CO2e"), false);
  });

  it("leaves shorter used service incomplete and does not invent the next event", () => {
    let state = withPathways(["used_secondhand"], "4");
    state = reduceComparison(state, { type: "set_used_service", text: "1.5" });
    const view = present(state);
    const decision = view.cards[0].decision;
    assert.equal(decision.service_sequence_required, true);
    assert.equal(decision.covered_service_years, 1.5);
    assert.equal(decision.uncovered_service_years, 2.5);
    assert.equal(decision.result_capability, "insufficient_information");
    assert.equal(Object.hasOwn(decision, "next_event"), false);
    assert.equal(Object.hasOwn(view.evaluatorInputs[0], "next_event_after_secondary_failure"), false);
    assert.notEqual(decision.equivalent_service_established, true);
    assert.match(publicCorpus(view), /complete service sequence is required/);
    assert.match(publicCorpus(view), /next event was not supplied and was not invented/);
    assert.match(publicCorpus(view), /Service still uncovered in the comparison period is 2\.5 years/);
    assert.doesNotMatch(publicCorpus(view), /buy new|next event is /i);

    const covered = present(reduceComparison(state, { type: "set_horizon", text: "1.5" }));
    assert.equal(state.usedServiceRaw, "1.5");
    assert.equal(covered.usedServiceField.raw, "1.5");
    assert.equal(covered.horizonYears, 1.5);
    assert.equal(covered.cards[0].decision.service_sequence_required, undefined);
    assert.notEqual(covered.cards[0].decision.equivalent_service_established, true);
    assert.match(publicCorpus(covered), /Equivalent service over the comparison period is not established/);
    assert.doesNotMatch(publicCorpus(covered), /complete service sequence is required/);
  });

  it("does not invent a refurbished sequence, footprint, credit, or winner from candidate service", () => {
    let state = withPathways(["refurbished"], "4");
    state = reduceComparison(state, { type: "set_refurbished_service", text: "2" });
    const short = present(state);
    const decision = short.cards[0].decision;
    assert.equal(decision.service_sequence_required, undefined);
    assert.equal(Object.hasOwn(decision, "next_event"), false);
    assert.equal(Object.hasOwn(decision, "covered_service_years"), false);
    assert.notEqual(decision.equivalent_service_established, true);
    assert.equal(decision.result_capability, "qualitative_only");
    assert.equal(decision.refurb_direct_CO2e.value, null);
    assert.notEqual(decision.refurb_direct_CO2e.value, 0);
    assert.notEqual(decision.refurb_direct_CO2e.value, 7.61);
    assert.equal(decision.market_displacement_credit, null);
    assert.equal(decision.numeric_winner, undefined);
    assert.equal(short.cards[0].values.length, 0);
    assert.equal(short.rankingPermitted, false);
    assert.match(publicCorpus(short), /Expected adequate service for this candidate is 2 years/);
    assert.match(publicCorpus(short), /Equivalent service over the comparison period is not established/);
    assert.match(publicCorpus(short), /No generic refurbished footprint is used/);
    assert.doesNotMatch(publicCorpus(short), /complete service sequence is required/);
    assert.doesNotMatch(publicCorpus(short), PROHIBITED_RESULT);

    const exactTwo = present(
      reduceComparison(reduceComparison(state, { type: "set_horizon", text: "2" }), {
        type: "set_refurbished_service",
        text: "2",
      }),
    );
    assert.notEqual(exactTwo.cards[0].decision.refurb_direct_CO2e?.value, 7.61);
    assert.equal(Object.hasOwn(exactTwo.cards[0].decision, "refurb_direct_reference_CO2e"), false);
    assert.equal(exactTwo.cards[0].decision.generic_default, undefined);
  });

  it("clears only the deselected candidate and clears both after an upstream edit", () => {
    let state = withPathways(["keep", "repair", "used_secondhand", "refurbished"], "4");
    state = reduceComparison(state, { type: "set_remaining_service", text: "2" });
    state = reduceComparison(state, { type: "set_repair_category", categoryId: "battery" });
    state = reduceComparison(state, { type: "set_post_repair_service", text: "1" });
    state = reduceComparison(state, { type: "set_used_service", text: "1.5" });
    state = reduceComparison(state, { type: "set_refurbished_service", text: "3" });

    const withoutUsed = reduceComparison(state, { type: "toggle", pathwayId: "used_secondhand" });
    assert.equal(withoutUsed.usedServiceRaw, "");
    assert.equal(withoutUsed.usedServiceNotSure, false);
    assert.equal(withoutUsed.refurbishedServiceRaw, "3");
    assert.equal(withoutUsed.remainingServiceRaw, "2");
    assert.equal(withoutUsed.postRepairServiceRaw, "1");
    assert.equal(withoutUsed.repairCategoryId, "battery");
    const usedCleared = present(withoutUsed);
    assert.equal(usedCleared.usedServiceField.visible, false);
    const refurbishedInput = usedCleared.evaluatorInputs.find(
      (input) => input.replacement?.pathway_user_selection === "refurbished",
    );
    assert.equal(refurbishedInput.replacement.expected_adequate_service.expected_years, 3);
    assert.equal(
      usedCleared.evaluatorInputs.some((input) => input.replacement?.pathway_user_selection === "used_secondhand"),
      false,
    );

    const withoutRefurbished = reduceComparison(state, { type: "toggle", pathwayId: "refurbished" });
    assert.equal(withoutRefurbished.refurbishedServiceRaw, "");
    assert.equal(withoutRefurbished.refurbishedServiceNotSure, false);
    assert.equal(withoutRefurbished.usedServiceRaw, "1.5");
    assert.equal(withoutRefurbished.remainingServiceRaw, "2");
    const refurbishedCleared = present(withoutRefurbished);
    assert.equal(refurbishedCleared.refurbishedServiceField.visible, false);
    const usedInput = refurbishedCleared.evaluatorInputs.find(
      (input) => input.replacement?.pathway_user_selection === "used_secondhand",
    );
    assert.equal(usedInput.replacement.expected_adequate_service.expected_years, 1.5);

    const horizonOnly = reduceComparison(state, { type: "set_horizon", text: "6" });
    assert.equal(horizonOnly.horizonRaw, "6");
    assert.equal(horizonOnly.usedServiceRaw, "1.5");
    assert.equal(horizonOnly.refurbishedServiceRaw, "3");
    assert.equal(horizonOnly.remainingServiceRaw, "2");
    assert.equal(horizonOnly.postRepairServiceRaw, "1");
    const reevaluated = present(horizonOnly);
    const reevaluatedUsed = reevaluated.evaluatorInputs.find(
      (input) => input.replacement?.pathway_user_selection === "used_secondhand",
    );
    assert.equal(reevaluatedUsed.comparison.common_service_horizon_years, 6);
    assert.equal(reevaluatedUsed.replacement.expected_adequate_service.expected_years, 1.5);
    assert.equal(reevaluatedUsed.replacement.expected_adequate_service.expected_years !== 6, true);

    assert.deepEqual(comparisonStateAfterSituationAction("edit", state), createComparisonState());
    assert.deepEqual(comparisonStateAfterInquiryAction("back", state), createComparisonState());
    assert.deepEqual(reduceComparison(state, { type: "reset" }), createComparisonState());

    const ignored = reduceComparison(withPathways(["keep"], "4"), { type: "set_used_service", text: "9" });
    assert.equal(ignored.usedServiceRaw, "");
  });

  it("leaves current-phone and repair facts intact and keeps public text free of internal tokens", () => {
    let state = withPathways(["keep", "repair", "new", "used_secondhand", "refurbished"], "4");
    state = reduceComparison(state, { type: "set_remaining_service", text: "2.5" });
    state = reduceComparison(state, { type: "set_repair_category", categoryId: "display" });
    state = reduceComparison(state, { type: "set_post_repair_service", text: "0.5" });
    state = reduceComparison(state, { type: "set_used_service", text: "1.5" });
    state = reduceComparison(state, { type: "set_refurbished_service", text: "3" });
    const view = present(state);
    const [keep, repair, used, refurbished, next] = view.evaluatorInputs;
    assert.equal(keep["remaining_service.without_repair.expected_years"], 2.5);
    assert.equal(repair["repair.type"], "display");
    assert.equal(repair["repair.expected_adequate_service_after_repair.expected_years"], 0.5);
    assert.equal(next["remaining_service.without_repair.expected_years"], 2.5);
    assert.equal(used.replacement.expected_adequate_service.expected_years, 1.5);
    assert.equal(refurbished.replacement.expected_adequate_service.expected_years, 3);
    assert.equal(Object.hasOwn(keep, "replacement"), false);
    assert.equal(view.cards[1].decision.service_sequence_required, true);
    assert.match(view.cards[1].publicLines.join("\n"), /complete service sequence is required/);

    const corpus = publicCorpus(view);
    assert.doesNotMatch(corpus, SNAKE_CASE_TOKEN);
    assert.doesNotMatch(corpus, PROHIBITED_RESULT);
    assert.equal(corpus.includes("7.61"), false);
    assert.equal(view.cards[2].rankingPermitted, false);
    assert.equal(view.cards[3].rankingPermitted, false);
    assert.notEqual(view.cards[2].decision.definitive_comparative_ranking_permitted, true);
    assert.notEqual(view.cards[3].decision.definitive_comparative_ranking_permitted, true);

    const component = readApp("src/components/smartphone-comparison.tsx");
    assert.match(component, /used-candidate-service/);
    assert.match(component, /refurbished-candidate-service/);
    assert.match(component, /set_used_service/);
    assert.match(component, /set_refurbished_service/);
    assert.doesNotMatch(component, /defaultValue|defaultChecked/);
    assert.equal(component.includes("case_id"), false);
    assert.equal(readApp("src/lib/smartphone/secondary-pathway.mjs").includes("usedServiceRaw"), false);
  });

  it("does not let an inquiry answer fill a candidate service fact", () => {
    let inquiry = createInquiryState();
    for (const question of getApInquirySequence()) {
      inquiry = reduceInquiry(inquiry, {
        type: "set_raw",
        questionId: question.question_id,
        text: "2.50",
      });
      inquiry = reduceInquiry(inquiry, { type: "continue" });
    }
    inquiry = reduceInquiry(inquiry, { type: "set_choice", value: "consider_used_or_refurbished" });
    const view = present(createComparisonState());
    assert.equal(view.usedServiceField.parsedYears, null);
    assert.equal(view.refurbishedServiceField.parsedYears, null);
    assert.equal(view.cards.length, 0);
    assert.equal(inquiry.provisionalSelection, "consider_used_or_refurbished");
  });
});
