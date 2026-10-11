import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  EXPLICIT_UNCERTAINTY_ANSWER,
  INQUIRY_BOUNDARY,
  INQUIRY_CHOICE_NOTE,
  PROVISIONAL_CHOICE_LABELS,
  SHIFT_LABELS,
  buildInquiryDomainSession,
  canEnterInquiry,
  createInquiryState,
  describeInquiry,
  inquiryStateAfterSituationAction,
  isExplicitShift,
  isRawAnswerPresent,
  reduceInquiry,
} from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import {
  PROVISIONAL_CHOICES,
  SELF_REPORTED_SHIFT_VALUES,
  assessInquiryAutonomy,
  findProhibitedMotiveScores,
  getApInquirySequence,
  getProvisionalChoices,
} from "../src/lib/smartphone/ap-inquiry.mjs";
import {
  describeSituation,
  reduceSituation,
} from "../src/lib/smartphone/situation-ux.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");

const QUESTION_TEXT = Object.freeze({
  APQ1_FUNCTION:
    "What would the new phone let you do that your current phone cannot do adequately?",
  APQ2_EXPECTATION:
    "Imagine you already have the new phone. Besides what it can technically do, what do you expect to be different for you?",
  APQ3_ORIGIN:
    "When did you first begin seriously wanting this phone or an upgrade? What were you seeing, hearing or comparing around that time? Was the desire already this strong before that?",
  APQ4_VISIBILITY:
    "Would wanting this phone change if nobody else ever knew which phone you owned? Why or why not?",
  APQ5_NONPURCHASE:
    "Imagine deciding today to keep your current phone for another year. What, if anything, feels difficult about that?",
  APQ6_RESEE:
    "Reading your own answers together, does anything about the desire look different now? What seems appropriate now?",
});

const QUESTION_IDS = Object.freeze(Object.keys(QUESTION_TEXT));

function answerAll(state, texts) {
  let next = state;
  QUESTION_IDS.forEach((questionId, index) => {
    const view = describeInquiry(next);
    assert.equal(view.mode, "question");
    assert.equal(view.question?.questionId, questionId);
    next = reduceInquiry(next, {
      type: "set_raw",
      questionId,
      text: texts[index],
    });
    next = reduceInquiry(next, { type: "continue" });
  });
  return next;
}

describe("smartphone AP inquiry UX", () => {
  it("takes APQ1–APQ6 order and wording from the accepted sequence", () => {
    const sequence = getApInquirySequence();
    assert.deepEqual(
      sequence.map((question) => question.question_id),
      QUESTION_IDS,
    );
    for (const question of sequence) {
      assert.equal(question.exact_question_text, QUESTION_TEXT[question.question_id]);
    }

    let state = createInquiryState();
    for (let index = 0; index < sequence.length; index += 1) {
      const view = describeInquiry(state);
      assert.equal(view.review, null);
      assert.equal(view.question?.exactQuestionText, sequence[index].exact_question_text);
      assert.equal(view.progressLabel, `Question ${index + 1} of 6`);
      state = reduceInquiry(state, {
        type: "set_raw",
        questionId: sequence[index].question_id,
        text: `answer ${index}`,
      });
      state = reduceInquiry(state, { type: "continue" });
    }

    const adapter = readApp("src/lib/smartphone/ap-inquiry-ux.mjs");
    const component = readApp("src/components/smartphone-inquiry.tsx");
    for (const text of Object.values(QUESTION_TEXT)) {
      assert.equal(adapter.includes(text), false);
      assert.equal(component.includes(text), false);
    }
  });

  it("shows one question at a time and keeps raw answers byte-for-byte across Back and Continue", () => {
    const texts = QUESTION_IDS.map((id, index) => `  ${id} raw ${index}  `);
    let state = createInquiryState();
    assert.equal(describeInquiry(state).canContinue, false);
    state = reduceInquiry(state, {
      type: "set_raw",
      questionId: "APQ1_FUNCTION",
      text: "   ",
    });
    assert.equal(isRawAnswerPresent("   "), false);
    assert.equal(describeInquiry(state).canContinue, false);
    const stuck = reduceInquiry(state, { type: "continue" });
    assert.equal(stuck.activeIndex, 0);
    assert.equal(stuck.rawAnswers.APQ1_FUNCTION, "   ");

    state = answerAll(createInquiryState(), texts);
    assert.equal(state.phase, "review");
    const review = describeInquiry(state);
    assert.equal(review.question, null);
    assert.equal(review.review?.length, 6);
    review.review?.forEach((answer, index) => {
      assert.equal(answer.exactAnswer, texts[index]);
      assert.equal(answer.exactQuestionText, QUESTION_TEXT[answer.questionId]);
    });

    state = reduceInquiry(state, { type: "back" });
    assert.equal(state.phase, "question");
    assert.equal(state.activeIndex, 5);
    assert.equal(state.rawAnswers.APQ6_RESEE, texts[5]);
    state = reduceInquiry(state, { type: "back" });
    assert.equal(state.activeIndex, 4);
    assert.equal(state.rawAnswers.APQ5_NONPURCHASE, texts[4]);
    assert.equal(describeInquiry(state).question?.exactAnswer, texts[4]);
  });

  it("lets explicit uncertainty continue and refuses to trim, paraphrase, or overwrite raw text", () => {
    let state = reduceInquiry(createInquiryState(), {
      type: "mark_not_sure",
      questionId: "APQ1_FUNCTION",
    });
    assert.equal(state.rawAnswers.APQ1_FUNCTION, EXPLICIT_UNCERTAINTY_ANSWER);
    assert.equal(EXPLICIT_UNCERTAINTY_ANSWER, "I\u2019m not sure");
    assert.notEqual(state.rawAnswers.APQ1_FUNCTION, false);
    assert.notEqual(state.rawAnswers.APQ1_FUNCTION, 0);
    assert.equal(describeInquiry(state).canContinue, true);
    state = reduceInquiry(state, { type: "continue" });
    assert.equal(state.activeIndex, 1);
    assert.equal(state.rawAnswers.APQ1_FUNCTION, EXPLICIT_UNCERTAINTY_ANSWER);

    const padded = "  still the same words  ";
    state = reduceInquiry(state, {
      type: "set_raw",
      questionId: "APQ2_EXPECTATION",
      text: padded,
    });
    state = reduceInquiry(state, {
      type: "set_choice",
      value: "buy_new",
    });
    state = reduceInquiry(state, {
      type: "set_shift",
      value: "changed",
    });
    assert.equal(state.rawAnswers.APQ2_EXPECTATION, padded);
    assert.equal(state.rawAnswers.APQ2_EXPECTATION.includes("buy_new"), false);
    assert.equal(state.rawAnswers.APQ2_EXPECTATION.includes("changed"), false);

    const session = buildInquiryDomainSession(state);
    assert.equal(session.answer_records[1].exact_user_answer, padded);
    assert.equal(session.answer_records[0].exact_user_answer, EXPLICIT_UNCERTAINTY_ANSWER);
  });

  it("leaves unsupported derived observations unclear", () => {
    const texts = [
      "It would let me take sharper photos at night.",
      "I expect to feel more confident.",
      "I saw an advertisement and then wanted it.",
      "I would want it less if nobody knew.",
      "Keeping it feels difficult in a way I cannot name.",
      "I still want a new phone.",
    ];
    const state = answerAll(createInquiryState(), texts);
    const selected = reduceInquiry(state, { type: "set_choice", value: "buy_new" });
    const view = describeInquiry(selected);
    assert.equal(view.domain.observationsUnclear, true);
    assert.equal(view.domain.provisionalChoice, "unclear");
    assert.equal(view.provisionalSelection, "buy_new");
    const session = buildInquiryDomainSession(selected, {
      adequacyStatus: "adequate",
      age: 3,
      label: "Yes",
      case_id: "APQ-CASE",
      question_id: "APQ1_FUNCTION",
    });
    assert.equal(session.provisional_choice, "unclear");
    for (const record of session.answer_records) {
      assert.equal(record.derived_observations.length, 1);
      assert.equal(record.derived_observations[0].value, "unclear");
      assert.equal(record.derived_observations[0].derivation_status, "unclear");
      assert.equal(record.exact_user_answer, texts[QUESTION_IDS.indexOf(record.question_id)]);
    }
    assert.deepEqual(
      buildInquiryDomainSession(selected),
      session,
    );
  });

  it("shows every Q6 choice equally, unranked, with buy_new not a failure", () => {
    let state = answerAll(
      createInquiryState(),
      QUESTION_IDS.map(() => "noted"),
    );
    state = reduceInquiry(state, { type: "edit_question", questionId: "APQ6_RESEE" });
    state = reduceInquiry(state, { type: "set_choice", value: "buy_new" });
    const view = describeInquiry(state);
    assert.equal(view.showStructuredChoices, true);
    assert.deepEqual(
      view.choices.map((choice) => choice.value),
      [...PROVISIONAL_CHOICES],
    );
    assert.deepEqual(getProvisionalChoices(), PROVISIONAL_CHOICES);
    const buy = view.choices.find((choice) => choice.value === "buy_new");
    const keep = view.choices.find((choice) => choice.value === "keep_current");
    assert.ok(buy);
    assert.ok(keep);
    assert.deepEqual(Object.keys(buy), Object.keys(keep));
    assert.equal(buy.selected, true);
    assert.equal(keep.selected, false);
    assert.equal("rank" in buy, false);
    assert.equal("failure" in buy, false);
    assert.equal("score" in buy, false);
    assert.equal(view.domain.inquiryFailed, false);
    assert.match(INQUIRY_CHOICE_NOTE, /not a ranking/);
    assert.match(INQUIRY_CHOICE_NOTE, /Buying a new phone is an ordinary choice/);
    assert.doesNotMatch(INQUIRY_CHOICE_NOTE, /[a-z0-9]+_[a-z0-9_]+/);
    const autonomy = assessInquiryAutonomy(buildInquiryDomainSession(state));
    assert.equal(autonomy.buy_new_is_approved_choice, true);
    assert.equal(autonomy.buy_new_marked_as_failure, false);
    assert.equal(autonomy.provisional_choices_ranked, false);
    assert.equal(view.domain.motiveScoresPresent, false);
    assert.deepEqual(findProhibitedMotiveScores(buildInquiryDomainSession(state)), []);
  });

  it("keeps canonical Q6 values while visitor labels and copy hide internal tokens", () => {
    const snakeCaseToken = /[a-z0-9]+_[a-z0-9_]+/;
    assert.deepEqual(Object.keys(PROVISIONAL_CHOICE_LABELS), [...PROVISIONAL_CHOICES]);
    assert.deepEqual(Object.keys(SHIFT_LABELS), [...SELF_REPORTED_SHIFT_VALUES]);

    let state = reduceInquiry(createInquiryState(), {
      type: "edit_question",
      questionId: "APQ6_RESEE",
    });
    state = reduceInquiry(state, {
      type: "set_choice",
      value: "consider_used_or_refurbished",
    });
    state = reduceInquiry(state, { type: "set_shift", value: "unchanged" });
    const view = describeInquiry(state);

    assert.deepEqual(
      view.choices.map((choice) => choice.value),
      [...getProvisionalChoices()],
    );
    assert.deepEqual(
      view.shifts.map((shift) => shift.value),
      [...SELF_REPORTED_SHIFT_VALUES],
    );
    assert.equal(view.provisionalSelection, "consider_used_or_refurbished");
    assert.equal(view.shiftSelection, "unchanged");
    assert.equal(buildInquiryDomainSession(state).self_reported_shift, "unchanged");

    const selectedChoice = view.choices.find((choice) => choice.selected);
    const selectedShift = view.shifts.find((shift) => shift.selected);
    assert.equal(selectedChoice?.value, "consider_used_or_refurbished");
    assert.equal(selectedChoice?.label, "Consider a used or refurbished phone");
    assert.equal(selectedShift?.value, "unchanged");
    assert.equal(selectedShift?.label, "Unchanged");

    const buy = view.choices.find((choice) => choice.value === "buy_new");
    assert.equal(buy?.label, "Buy a new phone");
    assert.equal(buy?.selected, false);
    assert.equal(view.domain.inquiryFailed, false);

    const visible = [
      view.opening,
      view.boundary,
      view.laterNote,
      view.choiceNote,
      view.shiftNote,
      view.answerHelper,
      view.progressLabel,
      ...view.choices.map((choice) => choice.label),
      ...view.shifts.map((shift) => shift.label),
      ...view.stages.flatMap((stage) => [stage.label, stage.note]),
      ...Object.values(PROVISIONAL_CHOICE_LABELS),
      ...Object.values(SHIFT_LABELS),
    ].join("\n");
    assert.doesNotMatch(visible, snakeCaseToken);
    for (const choice of view.choices) {
      assert.notEqual(choice.label, choice.value);
      assert.equal(choice.label.includes("_"), false);
    }
    for (const shift of view.shifts) {
      assert.notEqual(shift.label, shift.value);
      assert.equal(shift.label.includes("_"), false);
    }

    const component = readApp("src/components/smartphone-inquiry.tsx");
    assert.match(component, /\{choice\.label\}/);
    assert.match(component, /\{shift\.label\}/);
    assert.doesNotMatch(component, />\{choice\.value\}<|>\{shift\.value\}</);
  });

  it("accepts only explicit canonical shift values", () => {
    let state = createInquiryState();
    const rejected = reduceInquiry(state, { type: "set_shift", value: "mostly_changed" });
    assert.equal(rejected, state);
    assert.equal(isExplicitShift("mostly_changed"), false);
    assert.equal(isExplicitShift(null), false);
    assert.equal(describeInquiry(state).shiftExplicit, false);
    assert.equal(describeInquiry(state).domain.selfReportedShift, "unclear");

    for (const shift of SELF_REPORTED_SHIFT_VALUES) {
      state = reduceInquiry(createInquiryState(), { type: "set_shift", value: shift });
      assert.equal(state.shiftSelection, shift);
      assert.equal(describeInquiry(state).shiftExplicit, true);
      assert.equal(buildInquiryDomainSession(state).self_reported_shift, shift);
    }

    const unclearChoice = reduceInquiry(createInquiryState(), {
      type: "set_shift",
      value: "unclear",
    });
    const omitted = createInquiryState();
    assert.equal(unclearChoice.shiftSelection, "unclear");
    assert.equal(omitted.shiftSelection, null);
    assert.equal(buildInquiryDomainSession(unclearChoice).self_reported_shift, "unclear");
    assert.equal(buildInquiryDomainSession(omitted).self_reported_shift, "unclear");
    assert.equal(describeInquiry(unclearChoice).shiftExplicit, true);
    assert.equal(describeInquiry(omitted).shiftExplicit, false);
  });

  it("does not let situation status, metadata, or UI labels become AP authority", () => {
    const state = reduceInquiry(createInquiryState(), {
      type: "set_raw",
      questionId: "APQ1_FUNCTION",
      text: "The camera fails at night.",
    });
    const contexts = [
      { adequacyStatus: "adequate", label: "Yes", age: 2, case_id: "T01" },
      { adequacyStatus: "inadequate", label: "No", age: 9, case_id: "T02" },
      { adequacyStatus: "unknown", label: "Not sure", age: 0, case_id: "T03" },
    ];
    const baseline = buildInquiryDomainSession(state);
    for (const context of contexts) {
      assert.deepEqual(buildInquiryDomainSession(state, context), baseline);
    }
    assert.equal(baseline.answer_records[0].exact_user_answer, "The camera fails at night.");
    const serialized = JSON.stringify(baseline);
    assert.equal(serialized.includes("T01"), false);
    assert.equal(serialized.includes("T02"), false);
    assert.equal(serialized.includes("adequacyStatus"), false);
    assert.equal(serialized.includes("case_id"), false);
  });

  it("returns edit and reset to an honest record without fabricating values", () => {
    let state = answerAll(
      createInquiryState(),
      QUESTION_IDS.map((id) => `kept ${id}`),
    );
    state = reduceInquiry(state, { type: "set_choice", value: "repair_current" });
    state = reduceInquiry(state, { type: "set_shift", value: "unchanged" });
    const edited = reduceInquiry(state, { type: "edit_question", questionId: "APQ3_ORIGIN" });
    assert.equal(edited.phase, "question");
    assert.equal(edited.rawAnswers.APQ3_ORIGIN, "kept APQ3_ORIGIN");
    assert.equal(edited.provisionalSelection, "repair_current");
    assert.equal(edited.shiftSelection, "unchanged");
    assert.equal(describeInquiry(edited).review, null);

    const cleared = reduceInquiry(edited, {
      type: "set_raw",
      questionId: "APQ3_ORIGIN",
      text: "",
    });
    assert.equal(cleared.rawAnswers.APQ3_ORIGIN, "");
    assert.equal(describeInquiry(cleared).canContinue, false);
    assert.notEqual(cleared.rawAnswers.APQ3_ORIGIN, "kept APQ3_ORIGIN");

    const reset = reduceInquiry(state, { type: "reset" });
    assert.deepEqual(reset, createInquiryState());
    assert.equal(reset.provisionalSelection, null);
    assert.equal(reset.shiftSelection, null);
    for (const value of Object.values(reset.rawAnswers)) {
      assert.equal(value, "");
    }
  });

  it("does not show a motive score, diagnosis, recommendation, or behavioural experiment", () => {
    const state = answerAll(
      createInquiryState(),
      QUESTION_IDS.map(() => EXPLICIT_UNCERTAINTY_ANSWER),
    );
    const view = describeInquiry(state);
    assert.equal(view.boundary, INQUIRY_BOUNDARY);
    assert.equal(view.domain.inquiryFailed, false);
    assert.equal(view.domain.behaviouralExperimentRequired, false);
    assert.equal(view.domain.experimentRequiredByHelper, false);
    assert.equal(view.domain.motiveScoresPresent, false);
    const visible = [
      view.opening,
      view.boundary,
      view.laterNote,
      view.choiceNote,
      view.shiftNote,
      view.answerHelper,
      view.progressLabel,
      ...view.stages.flatMap((stage) => [stage.label, stage.note]),
    ].join("\n");
    assert.doesNotMatch(visible, /ego_score|motive score|recommend|winner|best choice|abstain|social media|experiment/i);
    assert.match(view.boundary, /does not diagnose motives/);
    assert.match(view.boundary, /decide what you should buy/);
    assert.match(view.laterNote, /still ahead/);

    const component = readApp("src/components/smartphone-inquiry.tsx");
    assert.match(component, /disabled=\{!view\.canContinue\}/);
    assert.match(component, /if \(!view\.canContinue\) return;/);
    assert.doesNotMatch(component, /trim\(/);
    assert.doesNotMatch(component, /defaultChecked/);
    assert.doesNotMatch(component, /ego_score|presentation_branch|Source Lens|apparent_contradiction/);
    assert.doesNotMatch(component, /view\.domain/);
    assert.match(component, /checked=\{choice\.selected\}/);
    assert.match(component, /checked=\{shift\.selected\}/);
  });

  it("continues from every situation result and drops inquiry when situation is edited or reset", () => {
    assert.equal(canEnterInquiry(null), false);
    assert.equal(canEnterInquiry(undefined), false);
    const combinations = [
      [true, true, true],
      [false, true, true],
      ["unknown", true, true],
    ];
    for (const values of combinations) {
      let situation = { answers: { safe_to_use: null, required_functions_met: null, security_support: null }, submitted: false };
      const fields = ["safe_to_use", "required_functions_met", "security_support"];
      for (let index = 0; index < fields.length; index += 1) {
        situation = reduceSituation(situation, {
          type: "select",
          field: fields[index],
          value: values[index],
        });
      }
      situation = reduceSituation(situation, { type: "submit" });
      const described = describeSituation(situation);
      assert.ok(described.result);
      assert.equal(canEnterInquiry(described.result), true);
      assert.equal(described.result.canonicalStatus === "adequate" || described.result.canonicalStatus === "inadequate" || described.result.canonicalStatus === "unknown", true);
    }

    const filled = answerAll(
      createInquiryState(),
      QUESTION_IDS.map((id) => id),
    );
    assert.equal(inquiryStateAfterSituationAction("submit", filled), filled);
    assert.equal(inquiryStateAfterSituationAction("select", filled), filled);
    assert.deepEqual(inquiryStateAfterSituationAction("edit", filled), createInquiryState());
    assert.deepEqual(inquiryStateAfterSituationAction("reset", filled), createInquiryState());

    const situationComponent = readApp("src/components/smartphone-situation.tsx");
    assert.match(situationComponent, /canEnterInquiry\(view\.result\)/);
    assert.match(situationComponent, /inquiryStateAfterSituationAction/);
    assert.match(situationComponent, /disabled=\{!view\.canSubmit\}/);
    assert.match(situationComponent, /if \(!view\.canSubmit\) return;/);
    assert.doesNotMatch(
      situationComponent,
      /adequacyStatus|canonicalStatus|ordinaryStatus ===/,
    );
  });

  it("keeps later stages pending and leaves home and journey routes intact", () => {
    const view = describeInquiry(createInquiryState());
    assert.equal(view.stages.find((stage) => stage.id === "inquiry")?.availability, "current");
    assert.equal(
      view.stages
        .filter((stage) => stage.id !== "situation" && stage.id !== "inquiry")
        .every((stage) => stage.availability === "later"),
      true,
    );
    assert.match(view.laterNote, /does not finish the phone journey/);

    const route = readApp("src/routes/smartphone.tsx");
    const home = readApp("src/routes/index.tsx");
    const journey = readApp("src/routes/journey.tsx");
    assert.match(route, /SmartphoneSituation/);
    assert.match(route, /createFileRoute\("\/smartphone"\)/);
    assert.doesNotMatch(home, /smartphone-inquiry|smartphone-situation/);
    assert.doesNotMatch(journey, /smartphone-inquiry|smartphone-situation/);
    assert.match(home, /createFileRoute\("\/"\)/);
    assert.match(journey, /createFileRoute\("\/journey"\)/);
  });
});
