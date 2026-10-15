import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { getApInquirySequence, getProvisionalChoices } from "../src/lib/smartphone/ap-inquiry.mjs";
import {
  createInquiryState,
  describeInquiry,
  reduceInquiry,
} from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import {
  COMPARISON_CHROME,
  COMPARISON_PATHWAYS,
  buildPathwayEvaluatorInput,
  canEnterComparison,
  comparisonStateAfterInquiryAction,
  comparisonStateAfterSituationAction,
  createComparisonState,
  describeComparison,
  isComparisonPathwayId,
  parseExplicitHorizon,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import {
  createFinalChoiceState,
  finalChoiceStateAfterComparisonAction,
} from "../src/lib/smartphone/final-choice-ux.mjs";
import { evaluateAdequacyAndUnknownState } from "../src/lib/smartphone/input-decision.mjs";
import { evaluateSecondaryPathwayCase } from "../src/lib/smartphone/secondary-pathway.mjs";
import {
  createSituationState,
  describeSituation,
  reduceSituation,
} from "../src/lib/smartphone/situation-ux.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;
const PROHIBITED_RESULT =
  /7\.61|0\.475|\b40\b|unified harm|harm score|\bwinner\b|recommend|generic refurbished footprint is [0-9]|avoided production/i;

const ADEQUATE = {
  safe_to_use: true,
  required_functions_met: true,
  security_support: true,
};
const INADEQUATE = {
  safe_to_use: false,
  required_functions_met: true,
  security_support: "unknown",
};
const UNKNOWN_SITUATION = {
  safe_to_use: "unknown",
  required_functions_met: "unknown",
  security_support: "unknown",
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

function readyComparison(pathwayIds, horizonRaw, answers = ADEQUATE, inquiry = completedInquiry()) {
  let state = createComparisonState();
  for (const pathwayId of pathwayIds) {
    state = reduceComparison(state, { type: "toggle", pathwayId });
  }
  if (horizonRaw != null) {
    state = reduceComparison(state, { type: "set_horizon", text: horizonRaw });
  }
  return describeComparison(state, {
    inquiryReviewComplete: canEnterComparison(inquiry),
    situationAnswers: answers,
  });
}

function publicCorpus(view) {
  return [
    view.opening,
    view.boundary,
    view.selectionNote,
    view.orderNote,
    view.horizonHelper,
    view.laterNote,
    view.pendingNote,
    view.horizonStatement,
    ...view.pathways.map((pathway) => pathway.label),
    ...view.stages.flatMap((stage) => [stage.label, stage.note]),
    ...view.cards.flatMap((card) => [card.label, ...card.publicLines]),
  ]
    .filter((line) => line != null)
    .join("\n");
}

describe("smartphone comparison entry", () => {
  it("opens only after a completed inquiry review and starts with nothing selected", () => {
    const partial = reduceInquiry(createInquiryState(), {
      type: "set_raw",
      questionId: "APQ1_FUNCTION",
      text: "The battery fades.",
    });
    assert.equal(canEnterComparison(partial), false);
    assert.equal(canEnterComparison(createInquiryState()), false);
    assert.equal(describeInquiry(partial).mode, "question");

    const review = completedInquiry();
    assert.equal(canEnterComparison(review), true);
    assert.equal(describeInquiry(review).reviewComplete, true);

    const hidden = describeComparison(createComparisonState(), {
      inquiryReviewComplete: false,
      situationAnswers: ADEQUATE,
    });
    assert.equal(hidden.available, false);
    assert.equal(hidden.evaluated, false);
    assert.equal(hidden.cards.length, 0);
    assert.equal(hidden.evaluatorInputs.length, 0);

    const fresh = describeComparison(createComparisonState(), {
      inquiryReviewComplete: true,
      situationAnswers: ADEQUATE,
    });
    assert.equal(fresh.available, true);
    assert.equal(fresh.evaluated, false);
    assert.equal(fresh.horizonYears, null);
    assert.equal(fresh.horizonRaw, "");
    assert.equal(fresh.pathways.every((pathway) => pathway.selected === false), true);
    assert.deepEqual(
      fresh.pathways.map((pathway) => pathway.label),
      [
        "Keep the current phone",
        "Repair the current phone",
        "Buy a used/second-hand phone",
        "Buy a refurbished phone",
        "Buy a new phone",
      ],
    );
    assert.equal(fresh.stages.find((stage) => stage.id === "situation")?.availability, "recorded");
    assert.equal(fresh.stages.find((stage) => stage.id === "inquiry")?.availability, "recorded");
    assert.equal(
      fresh.stages.find((stage) => stage.id === "empirical-comparison")?.availability,
      "current",
    );
    assert.equal(
      fresh.stages
        .filter((stage) => stage.availability === "pending")
        .map((stage) => stage.id)
        .join(","),
      "impact-dependency,protect-four-otherness,user-choice",
    );
  });

  it("explains that checkboxes compare alternatives and does not record a final decision", () => {
    const view = readyComparison(["used_secondhand", "refurbished"], "2.50");
    const component = readApp("src/components/smartphone-comparison.tsx");

    assert.equal(
      COMPARISON_CHROME.pathwayLegend,
      "Which alternatives do you want to compare?",
    );
    assert.match(component, /COMPARISON_CHROME\.pathwayLegend/);
    assert.match(component, /view\.selectionNote/);
    assert.match(component, /type="checkbox"/);
    assert.doesNotMatch(component, /type="radio"/);
    assert.match(
      view.selectionNote,
      /Select the possibilities you want to compare side by side\. Selecting more than one does not mean you intend to do all of them\./,
    );
    assert.match(view.selectionNote, /The actual decision is recorded later, at the user choice stage\./);
    assert.match(view.selectionNote, /No pathway is preselected/);
    assert.match(
      view.selectionNote,
      /does not mean it is adequate, available, preferable, or supported by complete evidence/,
    );
    assert.match(view.selectionNote, /A choice from the inquiry does not select these pathways/);
    assert.match(view.boundary, /does not rank the pathways/);
    assert.equal(view.opening.includes("Pathways to inspect"), false);

    const used = view.pathways.find((pathway) => pathway.id === "used_secondhand");
    const refurbished = view.pathways.find((pathway) => pathway.id === "refurbished");
    assert.equal(used?.selected, true);
    assert.equal(refurbished?.selected, true);
    assert.notEqual(used?.label, refurbished?.label);
    assert.equal(view.horizonRaw, "2.50");
    assert.equal(view.horizonYears, 2.5);
    assert.deepEqual(
      view.cards.map((card) => card.id),
      ["used_secondhand", "refurbished"],
    );
    assert.equal(view.evaluatorInputs[0].replacement.pathway_user_selection, "used_secondhand");
    assert.equal(view.evaluatorInputs[1].replacement.pathway_user_selection, "refurbished");
    assert.equal(view.evaluatorInputs[0].comparison.common_service_horizon_years, 2.5);
    assert.equal(view.evaluatorInputs[1].comparison.common_service_horizon_years, 2.5);
    assert.notEqual(
      view.evaluatorInputs[0].replacement.pathway_user_selection,
      view.evaluatorInputs[1].replacement.pathway_user_selection,
    );

    const untouched = createFinalChoiceState();
    const afterToggle = finalChoiceStateAfterComparisonAction("toggle", untouched);
    assert.equal(afterToggle.selection, null);
    assert.equal(afterToggle.opened, false);
    assert.deepEqual(afterToggle, untouched);
    assert.equal(view.rankingPermitted, false);
  });

  it("does not let an AP Q6 choice preselect or rank an empirical pathway", () => {
    for (const choice of getProvisionalChoices()) {
      const inquiry = completedInquiry(choice);
      assert.equal(canEnterComparison(inquiry), true);
      const view = describeComparison(createComparisonState(), {
        inquiryReviewComplete: true,
        situationAnswers: ADEQUATE,
      });
      assert.equal(view.pathways.every((pathway) => pathway.selected === false), true);
      assert.equal(view.cards.length, 0);
      assert.equal(view.rankingPermitted, false);
    }

    let selected = reduceComparison(createComparisonState(), { type: "toggle", pathwayId: "new" });
    selected = reduceComparison(selected, { type: "set_horizon", text: "4" });
    const cleared = comparisonStateAfterInquiryAction("set_choice", selected);
    assert.deepEqual(cleared, createComparisonState());
    assert.equal(cleared.selectedIds.includes("new"), false);
    assert.notEqual(cleared.horizonRaw, "3");
  });

  it("maps pathway ids to accepted evaluator inputs and keeps ordinary labels", () => {
    const view = readyComparison(
      ["new", "keep", "used_secondhand", "refurbished", "repair"],
      "2.50",
    );
    assert.deepEqual(
      view.cards.map((card) => card.id),
      ["keep", "repair", "used_secondhand", "refurbished", "new"],
    );
    assert.equal(view.horizonRaw, "2.50");
    assert.equal(view.horizonYears, 2.5);
    assert.equal(
      view.horizonStatement,
      "The same horizon is used for every selected pathway: 2.50.",
    );

    const [keep, repair, used, refurbished, next] = view.evaluatorInputs;
    assert.equal(keep.common_service_horizon_years, 2.5);
    assert.equal(repair.common_service_horizon_years, 2.5);
    assert.equal(used.comparison.common_service_horizon_years, 2.5);
    assert.equal(refurbished.comparison.common_service_horizon_years, 2.5);
    assert.equal(next.common_service_horizon_years, 2.5);
    assert.equal(keep["replacement.type"], undefined);
    assert.equal(repair["repair.type"], undefined);
    assert.equal(repair["repair.expected_adequate_service_after_repair.expected_years"], undefined);
    assert.equal(next["replacement.type"], "new");
    assert.equal(next["replacement.new.model"], undefined);
    assert.equal(next["remaining_service.without_repair.expected_years"], undefined);
    assert.equal(used.replacement.pathway_user_selection, "used_secondhand");
    assert.equal(refurbished.replacement.pathway_user_selection, "refurbished");
    assert.equal(Object.hasOwn(used.replacement, "expected_adequate_service"), false);
    assert.equal(Object.hasOwn(refurbished.replacement, "expected_adequate_service"), false);
    assert.notEqual(used.replacement.pathway_user_selection, refurbished.replacement.pathway_user_selection);

    assert.deepEqual(
      evaluateSecondaryPathwayCase(used).secondary_pathway,
      "used_secondhand",
    );
    assert.deepEqual(
      evaluateSecondaryPathwayCase(refurbished).secondary_pathway,
      "refurbished",
    );
    assert.equal(view.cards[2].secondaryPathway, "used_secondhand");
    assert.equal(view.cards[3].secondaryPathway, "refurbished");

    const visible = publicCorpus(view);
    assert.doesNotMatch(visible, SNAKE_CASE_TOKEN);
    for (const pathway of view.pathways) {
      assert.equal(pathway.label.includes("_"), false);
      assert.notEqual(pathway.label, pathway.id);
    }
    assert.equal(COMPARISON_CHROME.continueFromInquiry.includes("_"), false);
  });

  it("refuses a missing or unusable horizon and never substitutes zero or three years", () => {
    assert.equal(parseExplicitHorizon(""), null);
    assert.equal(parseExplicitHorizon("   "), null);
    assert.equal(parseExplicitHorizon("0"), null);
    assert.equal(parseExplicitHorizon("0.0"), null);
    assert.equal(parseExplicitHorizon("-1"), null);
    assert.equal(parseExplicitHorizon("3 years"), null);
    assert.equal(parseExplicitHorizon("abc"), null);
    assert.equal(parseExplicitHorizon("Infinity"), null);
    assert.equal(parseExplicitHorizon("NaN"), null);
    assert.equal(parseExplicitHorizon("1e2"), null);
    assert.equal(parseExplicitHorizon(3), null);
    assert.equal(parseExplicitHorizon(null), null);
    assert.equal(parseExplicitHorizon("2.50"), 2.5);
    assert.equal(parseExplicitHorizon(" 4 "), 4);

    for (const raw of ["", "0", "-2", "no", "1e2"]) {
      const view = readyComparison(["keep", "new", "refurbished"], raw);
      assert.equal(view.evaluated, false);
      assert.equal(view.cards.length, 0);
      assert.equal(view.evaluatorInputs.length, 0);
      assert.equal(view.horizonYears, null);
      assert.notEqual(view.horizonYears, 0);
      assert.notEqual(view.horizonYears, 3);
      assert.equal(view.horizonRaw, raw);
    }

    const untouched = reduceComparison(createComparisonState(), {
      type: "set_horizon",
      text: " 4 ",
    });
    assert.equal(untouched.horizonRaw, " 4 ");
    assert.equal(isComparisonPathwayId("buy_new"), false);
    assert.equal(isComparisonPathwayId("keep_current"), false);
  });

  it("applies one explicit horizon and keeps unknown inputs unknown", () => {
    for (const answers of [ADEQUATE, INADEQUATE, UNKNOWN_SITUATION]) {
      const view = readyComparison(
        ["keep", "repair", "used_secondhand", "refurbished", "new"],
        "4",
        answers,
      );
      assert.equal(view.evaluated, true);
      assert.equal(view.rankingPermitted, false);
      for (const input of view.evaluatorInputs) {
        const horizon = input.common_service_horizon_years ?? input.comparison.common_service_horizon_years;
        assert.equal(horizon, 4);
      }
      for (const card of view.cards) {
        assert.equal(card.rankingPermitted, false);
        assert.equal(card.unifiedHarmScore, null);
        assert.notEqual(card.avoidedManufactureCredit, 0);
        assert.notEqual(card.marketDisplacementCredit, 0);
        for (const value of card.values) {
          assert.equal(typeof value.unit, "string");
          assert.equal(value.unit.length > 0, true);
          assert.equal(typeof value.scope, "string");
          assert.equal(value.scope.length > 0, true);
          assert.match(value.line, /kg CO2e/);
        }
      }
      const corpus = publicCorpus(view);
      assert.doesNotMatch(corpus, SNAKE_CASE_TOKEN);
      assert.doesNotMatch(corpus, PROHIBITED_RESULT);
      assert.equal(corpus.includes("7.61"), false);
      assert.equal(corpus.includes("0.475"), false);
    }

    const adequate = readyComparison(["new"], "4", ADEQUATE);
    const decision = evaluateAdequacyAndUnknownState(adequate.evaluatorInputs[0]);
    const production = decision.replacement.new.production_CO2e_kg;
    const shown = adequate.cards[0].values.find((value) => value.name === "Production");
    assert.ok(production);
    assert.deepEqual(shown.exactValue, production);
    assert.equal(shown.scope, "generic_fallback");
    assert.match(shown.line, /Generic fallback/);
    assert.match(shown.line, /not an average/);
    assert.equal(adequate.cards[0].capability, "insufficient_information");
    assert.equal(decision.definitive_comparative_ranking_permitted, false);
    assert.equal(
      adequate.cards[0].publicLines.some((line) => line.includes("keep-as-is is feasible")),
      false,
    );

    const repair = readyComparison(["repair"], "4", ADEQUATE);
    assert.equal(repair.cards[0].values.length, 0);
    assert.match(publicCorpus(repair), /kind of repair was not supplied/);
    assert.equal(Object.hasOwn(repair.evaluatorInputs[0], "repair.type"), false);

    const used = readyComparison(["used_secondhand"], "4", INADEQUATE);
    const refurbished = readyComparison(["refurbished"], "4", INADEQUATE);
    assert.equal(used.cards[0].capability, "qualitative_only");
    assert.equal(refurbished.cards[0].capability, "qualitative_only");
    assert.match(publicCorpus(used), /not treated as a refurbished phone/);
    assert.match(publicCorpus(refurbished), /not the same pathway as a used/);
    assert.match(publicCorpus(refurbished), /No generic refurbished footprint is used/);
    assert.equal(used.cards[0].decision.direct_secondary_CO2e, null);
    assert.equal(refurbished.cards[0].decision.refurb_direct_CO2e.value, null);
    assert.equal(refurbished.cards[0].decision.refurb_direct_CO2e.status, "UNKNOWN_NO_FALLBACK");
  });

  it("clears comparison when an earlier stage is edited or reset", () => {
    let comparison = reduceComparison(createComparisonState(), {
      type: "toggle",
      pathwayId: "refurbished",
    });
    comparison = reduceComparison(comparison, { type: "set_horizon", text: "5" });
    assert.equal(comparisonStateAfterSituationAction("submit", comparison), comparison);
    assert.equal(comparisonStateAfterSituationAction("select", comparison), comparison);
    assert.deepEqual(comparisonStateAfterSituationAction("edit", comparison), createComparisonState());
    assert.deepEqual(comparisonStateAfterSituationAction("reset", comparison), createComparisonState());

    for (const actionType of [
      "set_raw",
      "mark_not_sure",
      "set_choice",
      "set_shift",
      "edit_question",
      "reset",
      "back",
    ]) {
      assert.deepEqual(
        comparisonStateAfterInquiryAction(actionType, comparison),
        createComparisonState(),
      );
    }
    assert.equal(comparisonStateAfterInquiryAction("continue", comparison), comparison);

    const situationComponent = readApp("src/components/smartphone-situation.tsx");
    const inquiryComponent = readApp("src/components/smartphone-inquiry.tsx");
    assert.match(situationComponent, /comparisonStateAfterSituationAction/);
    assert.match(situationComponent, /comparisonStateAfterInquiryAction/);
    assert.match(situationComponent, /canEnterComparison\(inquiry\)/);
    assert.match(inquiryComponent, /view\.reviewComplete && onContinueToComparison/);
    assert.match(inquiryComponent, /COMPARISON_CHROME\.continueFromInquiry/);
    assert.doesNotMatch(situationComponent, /adequacyStatus|canonicalStatus|ordinaryStatus ===/);
    assert.doesNotMatch(inquiryComponent, /trim\(/);
  });

  it("keeps home, journey, situation, and inquiry routes intact", () => {
    const route = readApp("src/routes/smartphone.tsx");
    const home = readApp("src/routes/index.tsx");
    const journey = readApp("src/routes/journey.tsx");
    const situationComponent = readApp("src/components/smartphone-situation.tsx");
    const comparisonComponent = readApp("src/components/smartphone-comparison.tsx");
    assert.match(route, /SmartphoneSituation/);
    assert.match(route, /createFileRoute\("\/smartphone"\)/);
    assert.doesNotMatch(home, /smartphone-comparison|smartphone-inquiry|smartphone-situation/);
    assert.doesNotMatch(journey, /smartphone-comparison|smartphone-inquiry|smartphone-situation/);
    assert.match(situationComponent, /disabled=\{!view\.canSubmit\}/);
    assert.match(situationComponent, /canEnterInquiry\(view\.result\)/);
    assert.match(comparisonComponent, /type="checkbox"/);
    assert.doesNotMatch(comparisonComponent, /type="radio"/);
    assert.doesNotMatch(comparisonComponent, /defaultValue|defaultChecked/);
    assert.doesNotMatch(comparisonComponent, />\{pathway\.id\}<|>\{card\.id\}</);
    assert.match(comparisonComponent, /\{pathway\.label\}/);
    assert.match(comparisonComponent, /\{line\}/);
    assert.equal(comparisonComponent.includes("provisionalSelection"), false);
    assert.equal(comparisonComponent.includes("buy_new"), false);

    const situation = describeSituation(createSituationState());
    assert.equal(situation.result, null);
    assert.equal(situation.canSubmit, false);
    const submitted = reduceSituation(
      reduceSituation(createSituationState(), {
        type: "select",
        field: "safe_to_use",
        value: "unknown",
      }),
      { type: "submit" },
    );
    assert.equal(submitted.submitted, false);

    const direct = buildPathwayEvaluatorInput("keep", ADEQUATE, 4);
    assert.equal(direct["adequacy.safe_to_use"], true);
    assert.equal(direct.common_service_horizon_years, 4);
    assert.equal(COMPARISON_PATHWAYS.length, 5);
  });
});
