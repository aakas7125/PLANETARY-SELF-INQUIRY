import { UNKNOWN, evaluateAdequacyAndUnknownState } from "./input-decision.mjs";

/**
 * Presentation and state for the canonical smartphone situation step.
 * Adequacy is not decided here. Explicit answers are passed to
 * `evaluateAdequacyAndUnknownState`, and the screen shows that result.
 */

/** @typedef {true | false | "unknown"} SituationValue */
/** @typedef {SituationValue | null} SituationAnswer */
/** @typedef {"safe_to_use" | "required_functions_met" | "security_support"} SituationFieldId */

/**
 * @typedef {{
 *   safe_to_use: SituationAnswer,
 *   required_functions_met: SituationAnswer,
 *   security_support: SituationAnswer,
 * }} SituationAnswers
 */

/**
 * @typedef {{ answers: SituationAnswers, submitted: boolean }} SituationState
 */

/**
 * @typedef {{ type: "select", field: SituationFieldId, value: SituationValue }
 *   | { type: "submit" }
 *   | { type: "edit" }
 *   | { type: "reset" }} SituationAction
 */

/**
 * @typedef {{
 *   id: SituationFieldId,
 *   inputKey: "adequacy.safe_to_use" | "adequacy.required_functions_met" | "security_support.adequate_for_required_use",
 *   question: string,
 *   helper: string,
 * }} SituationQuestion
 */

export const SITUATION_OPENING =
  "PSI starts with the phone you already have. It does not assume replacement.";

export const SITUATION_BOUNDARY =
  "This is a situation gate, not a purchase recommendation.";

export const SITUATION_PENDING_NOTE =
  "No status yet. Answer all three questions. Not sure is a real answer. Nothing is filled in for you.";

export const SITUATION_READY_NOTE =
  "All three answers are ready. Submit to see the situation status. Nothing has been decided yet.";

export const SITUATION_CHROME = Object.freeze({
  eyebrow: "Phone inquiry",
  title: "The phone you already have",
  submit: "See situation status",
  edit: "Edit answers",
  reset: "Reset",
  resultHeading: "Situation status",
});

/** @type {readonly SituationQuestion[]} */
export const SITUATION_QUESTIONS = Object.freeze([
  Object.freeze({
    id: "safe_to_use",
    inputKey: "adequacy.safe_to_use",
    question: "Is your current phone safe to keep using?",
    helper:
      "This is your own sense of whether it is safe to keep using. Age does not decide it, and it is not a technical safety test.",
  }),
  Object.freeze({
    id: "required_functions_met",
    inputKey: "adequacy.required_functions_met",
    question: "Does it adequately perform the functions you actually need?",
    helper:
      "Answer for the functions you actually need. A phone that merely turns on is not automatically adequate.",
  }),
  Object.freeze({
    id: "security_support",
    inputKey: "security_support.adequate_for_required_use",
    question:
      "Is its software and security support adequate for the way you need to use it?",
    helper:
      "Whether support is enough for how you use the phone. You do not need update dates, patch levels, or other expert settings.",
  }),
]);

/** @type {readonly { label: "Yes" | "No" | "Not sure", value: SituationValue }[]} */
export const SITUATION_CHOICES = Object.freeze([
  Object.freeze({ label: "Yes", value: true }),
  Object.freeze({ label: "No", value: false }),
  Object.freeze({ label: "Not sure", value: UNKNOWN }),
]);

/** @type {readonly { id: string, label: string, availability: "current" | "next" | "later", note: string }[]} */
export const SMARTPHONE_JOURNEY_STAGES = Object.freeze([
  Object.freeze({
    id: "situation",
    label: "Situation",
    availability: "current",
    note: "Current stage",
  }),
  Object.freeze({
    id: "inquiry",
    label: "Inquiry",
    availability: "next",
    note: "Next stage. Not part of this step.",
  }),
  Object.freeze({
    id: "empirical-comparison",
    label: "Empirical comparison",
    availability: "later",
    note: "Not yet part of this step.",
  }),
  Object.freeze({
    id: "impact-dependency",
    label: "Impact/dependency pathways",
    availability: "later",
    note: "Not yet part of this step.",
  }),
  Object.freeze({
    id: "protect-four-otherness",
    label: "Protect My Four/otherness inquiry",
    availability: "later",
    note: "Not yet part of this step.",
  }),
  Object.freeze({
    id: "user-choice",
    label: "User choice",
    availability: "later",
    note: "Not yet part of this step.",
  }),
]);

const FIELD_IDS = SITUATION_QUESTIONS.map((question) => question.id);

/**
 * @param {unknown} value
 * @returns {value is SituationValue}
 */
export function isExplicitSituationValue(value) {
  return value === true || value === false || value === UNKNOWN;
}

/**
 * @param {unknown} value
 * @returns {value is SituationFieldId}
 */
export function isSituationFieldId(value) {
  return FIELD_IDS.some((id) => id === value);
}

/** @returns {SituationState} */
export function createSituationState() {
  return {
    answers: {
      safe_to_use: null,
      required_functions_met: null,
      security_support: null,
    },
    submitted: false,
  };
}

/**
 * @param {SituationAnswers} answers
 * @returns {boolean}
 */
export function isCompleteExplicit(answers) {
  return FIELD_IDS.every((id) => isExplicitSituationValue(answers[id]));
}

/**
 * Copies only the three accepted adequacy facts. Extra properties on the
 * answer record — age, whether the phone turns on, case ids, labels — are
 * not forwarded.
 *
 * @param {SituationAnswers} answers
 * @returns {{
 *   "adequacy.safe_to_use": SituationAnswer,
 *   "adequacy.required_functions_met": SituationAnswer,
 *   "security_support.adequate_for_required_use": SituationAnswer,
 * }}
 */
export function buildAdequacyInput(answers) {
  return {
    "adequacy.safe_to_use": answers.safe_to_use,
    "adequacy.required_functions_met": answers.required_functions_met,
    "security_support.adequate_for_required_use": answers.security_support,
  };
}

/**
 * @param {Record<string, unknown>} decision
 * @returns {{
 *   adequacyStatus: "adequate" | "inadequate" | "unknown",
 *   keepAsIsFeasible: true | false | "unknown",
 * } | null}
 */
function readEvaluatorGate(decision) {
  const derived = decision.derived;
  if (!derived || typeof derived !== "object") return null;
  const gate = /** @type {Record<string, unknown>} */ (derived).adequacy_gate;
  if (!gate || typeof gate !== "object") return null;
  const adequacyStatus = /** @type {Record<string, unknown>} */ (gate).adequacy_status;
  const keep = decision.keep_as_is;
  if (!keep || typeof keep !== "object") return null;
  const keepAsIsFeasible = /** @type {Record<string, unknown>} */ (keep).feasible;
  if (
    adequacyStatus !== "adequate" &&
    adequacyStatus !== "inadequate" &&
    adequacyStatus !== UNKNOWN
  ) {
    return null;
  }
  if (
    keepAsIsFeasible !== true &&
    keepAsIsFeasible !== false &&
    keepAsIsFeasible !== UNKNOWN
  ) {
    return null;
  }
  return {
    adequacyStatus:
      adequacyStatus === "adequate" || adequacyStatus === "inadequate"
        ? adequacyStatus
        : UNKNOWN,
    keepAsIsFeasible:
      keepAsIsFeasible === true || keepAsIsFeasible === false ? keepAsIsFeasible : UNKNOWN,
  };
}

/**
 * @param {SituationAnswers} answers
 * @returns {{
 *   adequacyStatus: "adequate" | "inadequate" | "unknown",
 *   keepAsIsFeasible: true | false | "unknown",
 *   input: ReturnType<typeof buildAdequacyInput>,
 * } | null}
 */
export function evaluateExplicitSituation(answers) {
  if (!isCompleteExplicit(answers)) return null;
  const input = buildAdequacyInput(answers);
  const decision = evaluateAdequacyAndUnknownState(input);
  const gate = readEvaluatorGate(decision);
  if (!gate) return null;
  return { ...gate, input };
}

/**
 * @param {SituationValue} value
 * @returns {"Yes" | "No" | "Not sure"}
 */
function answerWord(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Not sure";
}

/**
 * @param {"adequate" | "inadequate" | "unknown"} status
 * @returns {string}
 */
function ordinaryStatus(status) {
  if (status === "adequate") return "Adequate";
  if (status === "inadequate") return "Inadequate";
  return "Unclear / unknown";
}

/**
 * @param {true | false | "unknown"} feasible
 * @returns {string}
 */
function keepAsIsSentence(feasible) {
  if (feasible === false) {
    return "Keep-as-is is not currently feasible under the supplied facts. That does not mean replacement is required. Repair, support investigation, or further inquiry remain open.";
  }
  if (feasible === true) {
    return "Under the supplied facts, keep-as-is is feasible.";
  }
  return "Under the supplied facts, whether keep-as-is is feasible is unknown.";
}

/**
 * @param {SituationState} state
 * @param {SituationAction} action
 * @returns {SituationState}
 */
export function reduceSituation(state, action) {
  switch (action.type) {
    case "select": {
      if (!isSituationFieldId(action.field) || !isExplicitSituationValue(action.value)) {
        return state;
      }
      return {
        answers: {
          safe_to_use: state.answers.safe_to_use,
          required_functions_met: state.answers.required_functions_met,
          security_support: state.answers.security_support,
          [action.field]: action.value,
        },
        submitted: false,
      };
    }
    case "submit": {
      if (!isCompleteExplicit(state.answers)) {
        return { answers: { ...state.answers }, submitted: false };
      }
      return { answers: { ...state.answers }, submitted: true };
    }
    case "edit":
      return {
        answers: {
          safe_to_use: state.answers.safe_to_use,
          required_functions_met: state.answers.required_functions_met,
          security_support: state.answers.security_support,
        },
        submitted: false,
      };
    case "reset":
      return createSituationState();
    default:
      return state;
  }
}

/**
 * @param {SituationState} state
 */
/**
 * @param {NonNullable<ReturnType<typeof evaluateExplicitSituation>>} evaluation
 * @param {SituationAnswers} answers
 */
function presentResult(evaluation, answers) {
  /** @type {{ question: string, answer: "Yes" | "No" | "Not sure" }[]} */
  const facts = [];
  for (const question of SITUATION_QUESTIONS) {
    const value = answers[question.id];
    if (!isExplicitSituationValue(value)) return null;
    facts.push({ question: question.question, answer: answerWord(value) });
  }
  return {
    ordinaryStatus: ordinaryStatus(evaluation.adequacyStatus),
    canonicalStatus: evaluation.adequacyStatus,
    facts,
    producedBy: "These supplied facts produced the status.",
    keepAsIs: keepAsIsSentence(evaluation.keepAsIsFeasible),
    boundary: SITUATION_BOUNDARY,
  };
}

/**
 * @param {SituationState} state
 */
export function describeSituation(state) {
  const evaluation = state.submitted ? evaluateExplicitSituation(state.answers) : null;
  const result = evaluation ? presentResult(evaluation, state.answers) : null;

  return {
    opening: SITUATION_OPENING,
    stages: SMARTPHONE_JOURNEY_STAGES.map((stage) => ({
      id: stage.id,
      label: stage.label,
      availability: stage.availability,
      note: stage.note,
    })),
    questions: SITUATION_QUESTIONS.map((question) => ({
      id: question.id,
      inputKey: question.inputKey,
      question: question.question,
      helper: question.helper,
      choices: SITUATION_CHOICES.map((choice) => ({
        label: choice.label,
        value: choice.value,
        checked: state.answers[question.id] === choice.value,
      })),
    })),
    canSubmit: isCompleteExplicit(state.answers),
    pendingNote: state.submitted
      ? null
      : isCompleteExplicit(state.answers)
        ? SITUATION_READY_NOTE
        : SITUATION_PENDING_NOTE,
    result,
    editAvailable: state.submitted,
  };
}
