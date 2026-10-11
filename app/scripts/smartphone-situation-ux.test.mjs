import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { evaluateAdequacyAndUnknownState } from "../src/lib/smartphone/input-decision.mjs";
import {
  SITUATION_BOUNDARY,
  SITUATION_CHOICES,
  SITUATION_CHROME,
  SITUATION_QUESTIONS,
  SMARTPHONE_JOURNEY_STAGES,
  buildAdequacyInput,
  createSituationState,
  describeSituation,
  evaluateExplicitSituation,
  isExplicitSituationValue,
  reduceSituation,
} from "../src/lib/smartphone/situation-ux.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");

const FIELD_IDS = ["safe_to_use", "required_functions_met", "security_support"];
const TRI_STATES = [true, false, "unknown"];

function answersFrom(values) {
  return {
    safe_to_use: values[0],
    required_functions_met: values[1],
    security_support: values[2],
  };
}

function directGate(answers) {
  const decision = evaluateAdequacyAndUnknownState(buildAdequacyInput(answers));
  return {
    adequacyStatus: decision.derived.adequacy_gate.adequacy_status,
    keepAsIsFeasible: decision.keep_as_is.feasible,
  };
}

function submitAnswers(values) {
  let state = createSituationState();
  FIELD_IDS.forEach((field, index) => {
    state = reduceSituation(state, { type: "select", field, value: values[index] });
  });
  return reduceSituation(state, { type: "submit" });
}

function visibleResultText(result) {
  return [
    result.ordinaryStatus,
    result.producedBy,
    ...result.facts.flatMap((fact) => [fact.question, fact.answer]),
    result.keepAsIs,
  ].join("\n");
}

const RECOMMENDATION_OR_RANKING =
  /\brecommend|\brank|buy new|do not buy|don't buy|\bwinner\b|best option|best choice|you should|must replace|purchase/i;

describe("smartphone situation UX", () => {
  it("starts with no answer preselected and no manufactured result", () => {
    const state = createSituationState();
    const view = describeSituation(state);
    assert.equal(state.submitted, false);
    assert.deepEqual(state.answers, {
      safe_to_use: null,
      required_functions_met: null,
      security_support: null,
    });
    assert.equal(view.result, null);
    assert.equal(view.canSubmit, false);
    for (const question of view.questions) {
      assert.equal(question.choices.length, 3);
      assert.deepEqual(
        question.choices.map((choice) => choice.label),
        ["Yes", "No", "Not sure"],
      );
      assert.equal(
        question.choices.some((choice) => choice.checked),
        false,
      );
    }
  });

  it("maps Not sure to canonical unknown and does not coerce it to false or zero", () => {
    const notSure = SITUATION_CHOICES.find((choice) => choice.label === "Not sure");
    assert.ok(notSure);
    assert.equal(notSure.value, "unknown");
    assert.notEqual(notSure.value, false);
    assert.notEqual(notSure.value, 0);
    assert.equal(isExplicitSituationValue("Not sure"), false);
    assert.equal(isExplicitSituationValue("Yes"), false);
    assert.equal(isExplicitSituationValue(0), false);
    assert.equal(isExplicitSituationValue(1), false);
    assert.equal(isExplicitSituationValue(null), false);

    const state = reduceSituation(createSituationState(), {
      type: "select",
      field: "safe_to_use",
      value: notSure.value,
    });
    assert.equal(state.answers.safe_to_use, "unknown");
    assert.notEqual(state.answers.safe_to_use, false);
    assert.notEqual(state.answers.safe_to_use, 0);
    assert.equal(describeSituation(state).result, null);
  });

  it("refuses labels, numbers, and partial answers instead of inventing a status", () => {
    assert.equal(
      evaluateExplicitSituation({
        safe_to_use: "Yes",
        required_functions_met: "No",
        security_support: "Not sure",
      }),
      null,
    );
    const partial = reduceSituation(createSituationState(), {
      type: "select",
      field: "security_support",
      value: "unknown",
    });
    const rejected = reduceSituation(partial, { type: "submit" });
    assert.equal(rejected.submitted, false);
    assert.equal(describeSituation(rejected).result, null);
    const ignoredLabel = reduceSituation(partial, {
      type: "select",
      field: "required_functions_met",
      value: "No",
    });
    assert.equal(ignoredLabel, partial);
  });

  it("passes every explicit combination through the canonical evaluator", () => {
    for (const safe of TRI_STATES) {
      for (const functionsMet of TRI_STATES) {
        for (const support of TRI_STATES) {
          const values = [safe, functionsMet, support];
          const answers = answersFrom(values);
          const evaluation = evaluateExplicitSituation(answers);
          const expected = directGate(answers);
          assert.ok(evaluation);
          assert.deepEqual(
            {
              adequacyStatus: evaluation.adequacyStatus,
              keepAsIsFeasible: evaluation.keepAsIsFeasible,
            },
            expected,
          );
          const submitted = submitAnswers(values);
          const view = describeSituation(submitted);
          assert.equal(view.result?.canonicalStatus, expected.adequacyStatus);
          if (expected.adequacyStatus === "adequate") {
            assert.equal(view.result?.ordinaryStatus, "Adequate");
            assert.equal(expected.keepAsIsFeasible, true);
          } else if (expected.adequacyStatus === "inadequate") {
            assert.equal(view.result?.ordinaryStatus, "Inadequate");
            assert.equal(expected.keepAsIsFeasible, false);
          } else {
            assert.equal(view.result?.ordinaryStatus, "Unclear / unknown");
            assert.equal(expected.adequacyStatus, "unknown");
            assert.equal(expected.keepAsIsFeasible, "unknown");
          }
        }
      }
    }
  });

  it("maps all true to adequate and each individual false to inadequate", () => {
    const allTrue = describeSituation(submitAnswers([true, true, true]));
    assert.equal(allTrue.result?.canonicalStatus, "adequate");

    for (const index of [0, 1, 2]) {
      const values = [true, true, true];
      values[index] = false;
      const view = describeSituation(submitAnswers(values));
      assert.equal(view.result?.canonicalStatus, "inadequate");
      assert.match(view.result?.keepAsIs ?? "", /not currently feasible/);
      assert.match(view.result?.keepAsIs ?? "", /does not mean replacement is required/);
    }
  });

  it("maps every unknown combination with no false to unknown", () => {
    const openValues = [true, "unknown"];
    let seen = 0;
    for (const safe of openValues) {
      for (const functionsMet of openValues) {
        for (const support of openValues) {
          if (safe === true && functionsMet === true && support === true) continue;
          seen += 1;
          const view = describeSituation(submitAnswers([safe, functionsMet, support]));
          assert.equal(view.result?.canonicalStatus, "unknown");
          assert.equal(view.result?.ordinaryStatus, "Unclear / unknown");
          assert.match(view.result?.keepAsIs ?? "", /feasible is unknown/);
        }
      }
    }
    assert.equal(seen, 7);
  });

  it("does not let age, power-on state, case ids, or UI labels become adequacy authority", () => {
    const answers = {
      safe_to_use: true,
      required_functions_met: false,
      security_support: "unknown",
      age: 2,
      phone_turns_on: true,
      case_id: "T01",
      label: "Yes",
      "adequacy.safe_to_use": false,
    };
    const input = buildAdequacyInput(answers);
    assert.deepEqual(Object.keys(input).sort(), [
      "adequacy.required_functions_met",
      "adequacy.safe_to_use",
      "security_support.adequate_for_required_use",
    ]);
    assert.equal(input["adequacy.safe_to_use"], true);
    assert.equal(input["adequacy.safe_to_use"] !== "Yes", true);
    assert.equal("phone_turns_on" in input, false);
    assert.equal("age" in input, false);
    assert.equal("case_id" in input, false);
    assert.equal("label" in input, false);

    const evaluation = evaluateExplicitSituation(answers);
    const expected = directGate({
      safe_to_use: true,
      required_functions_met: false,
      security_support: "unknown",
    });
    assert.equal(evaluation?.adequacyStatus, "inadequate");
    assert.deepEqual(
      {
        adequacyStatus: evaluation?.adequacyStatus,
        keepAsIsFeasible: evaluation?.keepAsIsFeasible,
      },
      expected,
    );

    const questionText = SITUATION_QUESTIONS.map((question) =>
      `${question.question} ${question.helper}`,
    ).join("\n");
    assert.equal(SITUATION_QUESTIONS.length, 3);
    assert.deepEqual(
      SITUATION_QUESTIONS.map((question) => question.inputKey),
      [
        "adequacy.safe_to_use",
        "adequacy.required_functions_met",
        "security_support.adequate_for_required_use",
      ],
    );
    assert.doesNotMatch(questionText, /case_id|case id/i);
    assert.equal(
      SITUATION_QUESTIONS.some((question) => /phone_turns_on|age_years/.test(question.inputKey)),
      false,
    );
  });

  it("keeps result copy free of recommendations, rankings, and scores", () => {
    for (const safe of TRI_STATES) {
      for (const functionsMet of TRI_STATES) {
        for (const support of TRI_STATES) {
          const view = describeSituation(submitAnswers([safe, functionsMet, support]));
          assert.ok(view.result);
          assert.equal(view.result.boundary, SITUATION_BOUNDARY);
          const body = visibleResultText(view.result);
          assert.doesNotMatch(body, RECOMMENDATION_OR_RANKING);
          assert.doesNotMatch(
            body,
            /climate|water|waste|ecosystem|moral score|people score|safety score|protect four score|\bCO2\b|\bkg\b/i,
          );
          assert.doesNotMatch(body, /used phone|refurbished|buy a new|winner/);
          assert.equal(view.result.producedBy, "These supplied facts produced the status.");
          assert.match(
            view.result.facts.map((fact) => `${fact.question} ${fact.answer}`).join("\n"),
            /Is your current phone safe to keep using\? (Yes|No|Not sure)/,
          );
          assert.match(
            view.result.facts.map((fact) => fact.question).join("\n"),
            /Does it adequately perform the functions you actually need\?/,
          );
          assert.match(
            view.result.facts.map((fact) => fact.question).join("\n"),
            /Is its software and security support adequate for the way you need to use it\?/,
          );
        }
      }
    }
    const chrome = Object.values(SITUATION_CHROME).join("\n");
    assert.doesNotMatch(chrome, RECOMMENDATION_OR_RANKING);
  });

  it("returns edit and reset to an unsubmitted state without fabricating answers", () => {
    const submitted = submitAnswers(["unknown", true, false]);
    assert.equal(submitted.submitted, true);
    assert.equal(describeSituation(submitted).result?.canonicalStatus, "inadequate");

    const edited = reduceSituation(submitted, { type: "edit" });
    assert.equal(edited.submitted, false);
    assert.deepEqual(edited.answers, submitted.answers);
    assert.equal(edited.answers.safe_to_use, "unknown");
    assert.notEqual(edited.answers.safe_to_use, false);
    assert.equal(describeSituation(edited).result, null);
    assert.equal(
      describeSituation(edited).questions[0].choices.find((choice) => choice.label === "Not sure")
        ?.checked,
      true,
    );

    const reset = reduceSituation(submitted, { type: "reset" });
    assert.deepEqual(reset, createSituationState());
    assert.equal(describeSituation(reset).result, null);
    for (const question of describeSituation(reset).questions) {
      assert.equal(
        question.choices.some((choice) => choice.checked),
        false,
      );
    }
  });

  it("names later journey stages without presenting them as available controls", () => {
    const view = describeSituation(createSituationState());
    assert.deepEqual(
      view.stages.map((stage) => [stage.label, stage.availability]),
      SMARTPHONE_JOURNEY_STAGES.map((stage) => [stage.label, stage.availability]),
    );
    assert.equal(view.stages[0].availability, "current");
    assert.equal(view.stages[1].label, "Inquiry");
    assert.equal(view.stages[1].availability, "next");
    assert.equal(
      view.stages.slice(2).every((stage) => stage.availability === "later"),
      true,
    );
  });

  it("wires the route and navigation without taking over home or journey", () => {
    const route = readApp("src/routes/smartphone.tsx");
    const nav = readApp("src/components/site-nav.tsx");
    const tree = readApp("src/routeTree.gen.ts");
    const home = readApp("src/routes/index.tsx");
    const journey = readApp("src/routes/journey.tsx");
    const component = readApp("src/components/smartphone-situation.tsx");
    const evaluator = readApp("src/lib/smartphone/input-decision.mjs");

    assert.match(route, /createFileRoute\("\/smartphone"\)/);
    assert.match(route, /SmartphoneSituation/);
    assert.match(nav, /href="\/smartphone"/);
    assert.match(nav, /Phone inquiry/);
    assert.match(nav, /href="\/journey"/);
    assert.match(nav, />\s*Journey\s*</);
    assert.match(tree, /\/smartphone/);
    assert.match(home, /createFileRoute\("\/"\)/);
    assert.match(home, /HeroSection/);
    assert.doesNotMatch(home, /smartphone-situation/);
    assert.match(journey, /createFileRoute\("\/journey"\)/);
    assert.doesNotMatch(journey, /smartphone-situation/);
    assert.match(component, /describeSituation/);
    assert.match(component, /checked=\{choice\.checked\}/);
    assert.doesNotMatch(component, /defaultChecked/);
    assert.doesNotMatch(component, /evaluateAdequacyAndUnknownState/);
    assert.match(evaluator, /export function evaluateAdequacyAndUnknownState/);
  });
});
