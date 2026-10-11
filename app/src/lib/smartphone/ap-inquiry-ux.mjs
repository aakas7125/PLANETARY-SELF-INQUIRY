import {
  behaviouralExperimentRequired,
  buildApInquirySession,
  findProhibitedMotiveScores,
  getApInquirySequence,
  getProvisionalChoices,
  SELF_REPORTED_SHIFT_VALUES,
} from "./ap-inquiry.mjs";
import { SMARTPHONE_JOURNEY_STAGES } from "./situation-ux.mjs";

/**
 * Presentation and state for the canonical smartphone AP inquiry.
 * Question wording, order, shift constraint, and derived observations come
 * from the accepted AP builders. This module does not restate the questions
 * or invent observation spans.
 */

/** Exact explicit-uncertainty answer. Stored and shown as this string. */
export const EXPLICIT_UNCERTAINTY_ANSWER = "I\u2019m not sure";

export const INQUIRY_OPENING = "Six questions, one at a time.";

export const INQUIRY_BOUNDARY =
  "This inquiry does not diagnose motives or decide what you should buy.";

export const INQUIRY_LATER_NOTE =
  "Empirical comparison and later steps are still ahead. This inquiry does not finish the phone journey.";

export const INQUIRY_INCOMPLETE_NOTE =
  "An answer is missing. Nothing has been filled in for you.";

export const INQUIRY_CHOICE_NOTE =
  "These choices are shown in presentation order. That order is not a ranking. Buying a new phone is an ordinary choice, not a failed inquiry.";

export const INQUIRY_SHIFT_NOTE =
  "Optional. Only a choice you make here is recorded.";

export const INQUIRY_ANSWER_HELPER =
  "A blank answer cannot continue. I\u2019m not sure counts as your answer. It is not turned into no or zero.";

/**
 * Visitor-facing labels for the accepted provisional choices.
 * Keys remain the canonical enum values used by state and the domain builder.
 */
export const PROVISIONAL_CHOICE_LABELS = Object.freeze({
  keep_current: "Keep the current phone",
  repair_current: "Repair the current phone",
  consider_used_or_refurbished: "Consider a used or refurbished phone",
  buy_new: "Buy a new phone",
  investigate_further: "Investigate further",
  unclear: "Unclear",
});

/**
 * Visitor-facing labels for the accepted self-reported shift values.
 * Keys remain the canonical enum values.
 */
export const SHIFT_LABELS = Object.freeze({
  changed: "Changed",
  unchanged: "Unchanged",
  uncertain: "Uncertain",
  unclear: "Unclear",
});

const INTERNAL_ENUM_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

/**
 * @param {Readonly<Record<string, string>>} labels
 * @param {string} value
 * @returns {string}
 */
function ordinaryLabel(labels, value) {
  const label = Object.prototype.hasOwnProperty.call(labels, value) ? labels[value] : undefined;
  if (typeof label !== "string" || label.trim().length === 0 || INTERNAL_ENUM_TOKEN.test(label)) {
    throw new Error("Missing ordinary-language label");
  }
  return label;
}

export const INQUIRY_CHROME = Object.freeze({
  eyebrow: "Phone inquiry",
  title: "Inquiry",
  continueFromSituation: "Continue to inquiry",
  back: "Back",
  continue: "Continue",
  notSure: EXPLICIT_UNCERTAINTY_ANSWER,
  answerLabel: "Your answer",
  choiceLegend: "Choice",
  shiftLegend: "Whether it looks different",
  reviewHeading: "Your answers",
  reset: "Reset",
  laterHeading: "Still ahead",
});

/**
 * @typedef {{
 *   activeIndex: number,
 *   phase: "question" | "review",
 *   rawAnswers: Record<string, string>,
 *   provisionalSelection: string | null,
 *   shiftSelection: string | null,
 * }} InquiryState
 */

/**
 * @typedef {{ type: "set_raw", questionId: string, text: string }
 *   | { type: "mark_not_sure", questionId: string }
 *   | { type: "set_choice", value: string }
 *   | { type: "set_shift", value: string }
 *   | { type: "back" }
 *   | { type: "continue" }
 *   | { type: "edit_question", questionId: string }
 *   | { type: "reset" }} InquiryAction
 */

/**
 * @param {readonly string[]} list
 * @param {unknown} value
 * @returns {value is string}
 */
function isListed(list, value) {
  return typeof value === "string" && list.includes(value);
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
export function isExplicitShift(value) {
  return isListed(SELF_REPORTED_SHIFT_VALUES, value);
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
export function isProvisionalSelection(value) {
  return isListed(getProvisionalChoices(), value);
}

/**
 * Whitespace may show that an answer is absent. It is never written back
 * onto the stored raw answer.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isRawAnswerPresent(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/** @returns {InquiryState} */
export function createInquiryState() {
  /** @type {Record<string, string>} */
  const rawAnswers = {};
  for (const question of getApInquirySequence()) {
    rawAnswers[question.question_id] = "";
  }
  return {
    activeIndex: 0,
    phase: "question",
    rawAnswers,
    provisionalSelection: null,
    shiftSelection: null,
  };
}

/**
 * @param {InquiryState} state
 * @param {string} questionId
 * @param {string} text
 * @returns {InquiryState}
 */
function withRawAnswer(state, questionId, text) {
  const known = getApInquirySequence().some((question) => question.question_id === questionId);
  if (!known || typeof text !== "string") return state;
  return {
    activeIndex: state.activeIndex,
    phase: state.phase,
    rawAnswers: { ...state.rawAnswers, [questionId]: text },
    provisionalSelection: state.provisionalSelection,
    shiftSelection: state.shiftSelection,
  };
}

/**
 * @param {InquiryState} state
 * @param {InquiryAction} action
 * @returns {InquiryState}
 */
export function reduceInquiry(state, action) {
  const sequence = getApInquirySequence();
  const lastIndex = sequence.length - 1;

  switch (action.type) {
    case "set_raw":
      return withRawAnswer(state, action.questionId, action.text);
    case "mark_not_sure":
      return withRawAnswer(state, action.questionId, EXPLICIT_UNCERTAINTY_ANSWER);
    case "set_choice": {
      if (!isProvisionalSelection(action.value)) return state;
      return {
        activeIndex: state.activeIndex,
        phase: state.phase,
        rawAnswers: { ...state.rawAnswers },
        provisionalSelection: action.value,
        shiftSelection: state.shiftSelection,
      };
    }
    case "set_shift": {
      if (!isExplicitShift(action.value)) return state;
      return {
        activeIndex: state.activeIndex,
        phase: state.phase,
        rawAnswers: { ...state.rawAnswers },
        provisionalSelection: state.provisionalSelection,
        shiftSelection: action.value,
      };
    }
    case "back": {
      if (state.phase === "review") {
        return {
          activeIndex: lastIndex,
          phase: "question",
          rawAnswers: { ...state.rawAnswers },
          provisionalSelection: state.provisionalSelection,
          shiftSelection: state.shiftSelection,
        };
      }
      if (state.activeIndex <= 0) return state;
      return {
        activeIndex: state.activeIndex - 1,
        phase: "question",
        rawAnswers: { ...state.rawAnswers },
        provisionalSelection: state.provisionalSelection,
        shiftSelection: state.shiftSelection,
      };
    }
    case "continue": {
      if (state.phase !== "question") return state;
      const current = sequence[state.activeIndex];
      if (!current) return state;
      if (!isRawAnswerPresent(state.rawAnswers[current.question_id])) return state;
      if (state.activeIndex >= lastIndex) {
        return {
          activeIndex: lastIndex,
          phase: "review",
          rawAnswers: { ...state.rawAnswers },
          provisionalSelection: state.provisionalSelection,
          shiftSelection: state.shiftSelection,
        };
      }
      return {
        activeIndex: state.activeIndex + 1,
        phase: "question",
        rawAnswers: { ...state.rawAnswers },
        provisionalSelection: state.provisionalSelection,
        shiftSelection: state.shiftSelection,
      };
    }
    case "edit_question": {
      const index = sequence.findIndex((question) => question.question_id === action.questionId);
      if (index < 0) return state;
      return {
        activeIndex: index,
        phase: "question",
        rawAnswers: { ...state.rawAnswers },
        provisionalSelection: state.provisionalSelection,
        shiftSelection: state.shiftSelection,
      };
    }
    case "reset":
      return createInquiryState();
    default:
      return state;
  }
}

/**
 * Any submitted situation result may enter inquiry. Adequacy is not a gate
 * and is not read here.
 *
 * @param {unknown} situationResult
 * @returns {boolean}
 */
export function canEnterInquiry(situationResult) {
  return situationResult != null;
}

/**
 * Editing or resetting Situation drops the inquiry record so a stale result
 * cannot remain attached to a flow that is no longer submitted.
 *
 * @param {string} actionType
 * @param {InquiryState} inquiry
 * @returns {InquiryState}
 */
export function inquiryStateAfterSituationAction(actionType, inquiry) {
  if (actionType === "edit" || actionType === "reset") return createInquiryState();
  return inquiry;
}

/**
 * Domain session from raw answers and an explicit shift only.
 *
 * Provisional button selections stay on the inquiry record. They are not
 * copied into exact_user_answer and are not given an invented supporting
 * span. The accepted builder therefore leaves that derived choice unclear.
 * Ignored context cannot become observation authority.
 *
 * @param {InquiryState} state
 * @param {unknown} [_ignoredContext]
 */
export function buildInquiryDomainSession(state, _ignoredContext) {
  /** @type {Record<string, { exact_user_answer: string, self_reported_shift?: string }>} */
  const answers = {};
  for (const question of getApInquirySequence()) {
    const raw = state.rawAnswers[question.question_id];
    const exact_user_answer = typeof raw === "string" ? raw : "";
    if (question.question_id === "APQ6_RESEE" && isExplicitShift(state.shiftSelection)) {
      answers[question.question_id] = {
        exact_user_answer,
        self_reported_shift: state.shiftSelection,
      };
    } else {
      answers[question.question_id] = { exact_user_answer };
    }
  }
  return buildApInquirySession(answers);
}

/**
 * @param {InquiryState} state
 */
export function describeInquiry(state) {
  const sequence = getApInquirySequence();
  const total = sequence.length;
  const activeIndex = state.activeIndex >= 0 && state.activeIndex < total ? state.activeIndex : 0;
  const active = sequence[activeIndex];
  const session = buildInquiryDomainSession(state);
  const observationsUnclear = session.answer_records.every((record) =>
    record.derived_observations.every(
      (observation) => observation.value === "unclear" && observation.derivation_status === "unclear",
    ),
  );
  const reviewAnswers = sequence.map((question) => ({
    questionId: question.question_id,
    exactQuestionText: question.exact_question_text,
    exactAnswer: state.rawAnswers[question.question_id] ?? "",
    present: isRawAnswerPresent(state.rawAnswers[question.question_id]),
  }));
  const reviewComplete = reviewAnswers.every((answer) => answer.present);
  const showStructured =
    state.phase === "review" || active?.question_id === "APQ6_RESEE";
  const choices = getProvisionalChoices().map((choice) => ({
    value: choice,
    label: ordinaryLabel(PROVISIONAL_CHOICE_LABELS, choice),
    selected: state.provisionalSelection === choice,
  }));
  const shifts = SELF_REPORTED_SHIFT_VALUES.map((shift) => ({
    value: shift,
    label: ordinaryLabel(SHIFT_LABELS, shift),
    selected: state.shiftSelection === shift,
  }));

  return {
    opening: INQUIRY_OPENING,
    boundary: INQUIRY_BOUNDARY,
    laterNote: INQUIRY_LATER_NOTE,
    incompleteNote: reviewComplete ? null : INQUIRY_INCOMPLETE_NOTE,
    choiceNote: INQUIRY_CHOICE_NOTE,
    shiftNote: INQUIRY_SHIFT_NOTE,
    answerHelper: INQUIRY_ANSWER_HELPER,
    stages: SMARTPHONE_JOURNEY_STAGES.map((stage) => {
      if (stage.id === "situation") {
        return {
          id: stage.id,
          label: stage.label,
          availability: "recorded",
          note: "Situation recorded. You can go back.",
        };
      }
      if (stage.id === "inquiry") {
        return {
          id: stage.id,
          label: stage.label,
          availability: "current",
          note: "Current stage",
        };
      }
      return {
        id: stage.id,
        label: stage.label,
        availability: "later",
        note: "Not yet part of this step.",
      };
    }),
    mode: state.phase,
    progressLabel:
      state.phase === "question" ? `Question ${activeIndex + 1} of ${total}` : null,
    question:
      state.phase === "question" && active
        ? {
            questionId: active.question_id,
            exactQuestionText: active.exact_question_text,
            exactAnswer: state.rawAnswers[active.question_id] ?? "",
            notSureSelected:
              state.rawAnswers[active.question_id] === EXPLICIT_UNCERTAINTY_ANSWER,
          }
        : null,
    canContinue:
      state.phase === "question" &&
      active != null &&
      isRawAnswerPresent(state.rawAnswers[active.question_id]),
    atFirstQuestion: state.phase === "question" && activeIndex === 0,
    showStructuredChoices: showStructured,
    choices,
    shifts,
    provisionalSelection: state.provisionalSelection,
    shiftSelection: state.shiftSelection,
    shiftExplicit: isExplicitShift(state.shiftSelection),
    review: state.phase === "review" ? reviewAnswers : null,
    reviewComplete: state.phase === "review" ? reviewComplete : false,
    domain: {
      inquiryFailed: session.inquiry_failed,
      behaviouralExperimentRequired: session.behavioural_experiment_required,
      observationsUnclear,
      provisionalChoice: session.provisional_choice,
      selfReportedShift: session.self_reported_shift,
      motiveScoresPresent: findProhibitedMotiveScores(session).length > 0,
      experimentRequiredByHelper: behaviouralExperimentRequired(),
    },
  };
}
