/**
 * AP inquiry executable foundation for the six-question sequence,
 * raw-answer / unclear / autonomy safety layer, deterministic presentation
 * branches, and constrained reflection.
 *
 * Authority: contracts/AP_INTERACTION_V0.md,
 * tests/ap-integrity/AP_V0_INVARIANTS.md,
 * provenance/source-packages/AP-V0-INTERACTION-0.2.0.md.
 *
 * Covered: APQ1–APQ6 and INV-AP-01–04, 05–11, 12, 13, 16.
 * Source Lens, otherness, and empirical-boundary remain out of scope.
 */

import { buildApBranchReflection } from "./ap-branch-reflection.mjs";

export const INTERACTION_VERSION = "AP-V0-INTERACTION-0.2.0";

export const DERIVATION_EXPLICIT = "explicit";
export const DERIVATION_UNCLEAR = "unclear";

/** Prohibited motive-score field names (visible or hidden). */
export const PROHIBITED_MOTIVE_SCORE_KEYS = Object.freeze([
  "ego_score",
  "greed_score",
  "selfishness_score",
  "conditioning_score",
  "fear_score",
  "authenticity_score",
  "planetary_concern_score",
]);

/** Approved Q6 provisional choices; order is presentation only, not ranking. */
export const PROVISIONAL_CHOICES = Object.freeze([
  "keep_current",
  "repair_current",
  "consider_used_or_refurbished",
  "buy_new",
  "investigate_further",
  "unclear",
]);

/** Accepted Q6 self_reported_shift values from AP_INTERACTION_V0. */
export const SELF_REPORTED_SHIFT_VALUES = Object.freeze([
  "changed",
  "unchanged",
  "uncertain",
  "unclear",
]);

/**
 * Core/schema fields on ap_answer_record. Never writable via literal_fields.
 * Authority: contracts/AP_INTERACTION_V0.md §3.
 */
export const AP_ANSWER_CORE_FIELDS = Object.freeze([
  "interaction_version",
  "question_id",
  "question_version",
  "exact_question_text",
  "exact_user_answer",
  "derived_observations",
]);

/**
 * Question-specific optional literal fields authorized by AP_INTERACTION_V0.
 * Enum observations travel through derived_observations, not literal_fields.
 *
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const LITERAL_FIELDS_BY_QUESTION = Object.freeze({
  APQ1_FUNCTION: Object.freeze(["functional_limitation_text"]),
  APQ2_EXPECTATION: Object.freeze(/** @type {string[]} */ ([])),
  APQ3_ORIGIN: Object.freeze(/** @type {string[]} */ ([])),
  APQ4_VISIBILITY: Object.freeze(["visibility_meaning_text"]),
  APQ5_NONPURCHASE: Object.freeze(/** @type {string[]} */ ([])),
  APQ6_RESEE: Object.freeze(/** @type {string[]} */ ([])),
});

const QUESTION_VERSION = "1.0";

/**
 * Exact accepted V0 wording and order from AP_INTERACTION_V0.
 * Do not normalize, shorten, or insert presumed motives.
 */
export const AP_INQUIRY_SEQUENCE = Object.freeze([
  Object.freeze({
    question_id: "APQ1_FUNCTION",
    question_version: QUESTION_VERSION,
    exact_question_text:
      "What would the new phone let you do that your current phone cannot do adequately?",
    observation_type: "functional_limitation",
    allowed_values: Object.freeze([
      "concrete_limitation_stated",
      "no_specific_limitation_stated",
      "unclear",
    ]),
  }),
  Object.freeze({
    question_id: "APQ2_EXPECTATION",
    question_version: QUESTION_VERSION,
    exact_question_text:
      "Imagine you already have the new phone. Besides what it can technically do, what do you expect to be different for you?",
    observation_type: "anticipated_change",
    allowed_values: Object.freeze([
      "nonfunctional_change_stated",
      "functional_change_only_stated",
      "no_change_beyond_function_stated",
      "unclear",
    ]),
  }),
  Object.freeze({
    question_id: "APQ3_ORIGIN",
    question_version: QUESTION_VERSION,
    exact_question_text:
      "When did you first begin seriously wanting this phone or an upgrade? What were you seeing, hearing or comparing around that time? Was the desire already this strong before that?",
    observation_type: "exposure_chronology",
    allowed_values: Object.freeze([
      "desire_predated_exposure",
      "desire_appeared_after_exposure",
      "desire_intensified_after_exposure",
      "exposure_helped_select_product",
      "no_relevant_exposure_identified",
      "unclear",
    ]),
  }),
  Object.freeze({
    question_id: "APQ4_VISIBILITY",
    question_version: QUESTION_VERSION,
    exact_question_text:
      "Would wanting this phone change if nobody else ever knew which phone you owned? Why or why not?",
    observation_type: "visibility_response",
    allowed_values: Object.freeze([
      "unchanged",
      "somewhat_weaker",
      "substantially_weaker",
      "stronger",
      "unclear",
    ]),
  }),
  Object.freeze({
    question_id: "APQ5_NONPURCHASE",
    question_version: QUESTION_VERSION,
    exact_question_text:
      "Imagine deciding today to keep your current phone for another year. What, if anything, feels difficult about that?",
    observation_type: "nonpurchase_difficulty",
    allowed_values: Object.freeze([
      "practical_only_stated",
      "nonpractical_element_stated",
      "mixed_stated",
      "no_significant_difficulty_stated",
      "unclear",
    ]),
  }),
  Object.freeze({
    question_id: "APQ6_RESEE",
    question_version: QUESTION_VERSION,
    exact_question_text:
      "Reading your own answers together, does anything about the desire look different now? What seems appropriate now?",
    observation_type: "provisional_choice",
    allowed_values: PROVISIONAL_CHOICES,
  }),
]);

/** @typedef {{
 *   question_id: string,
 *   question_version: string,
 *   exact_question_text: string,
 *   observation_type: string,
 *   allowed_values: readonly string[],
 * }} ApQuestion */

/** @type {Map<string, ApQuestion>} */
const QUESTION_BY_ID = new Map(
  AP_INQUIRY_SEQUENCE.map((question) => [question.question_id, question]),
);

/** @param {unknown} value @returns {value is string} */
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/**
 * @param {string} questionId
 * @returns {ApQuestion}
 */
export function getApQuestion(questionId) {
  const question = QUESTION_BY_ID.get(questionId);
  if (!question) {
    throw new Error(`Unknown AP question_id: ${questionId}`);
  }
  return question;
}

/** Exact six-question sequence in contract order. */
export function getApInquirySequence() {
  return AP_INQUIRY_SEQUENCE;
}

/** Approved Q6 choices; unranked — buy_new is not inquiry failure. */
export function getProvisionalChoices() {
  return PROVISIONAL_CHOICES;
}

/**
 * V0 never requires a behavioural experiment before proceeding.
 * @returns {boolean}
 */
export function behaviouralExperimentRequired() {
  return false;
}

/**
 * @param {string} exactUserAnswer
 * @param {unknown} supportingExactSpan
 * @returns {boolean}
 */
function spanSupportedByAnswer(exactUserAnswer, supportingExactSpan) {
  if (!isNonEmptyString(supportingExactSpan)) {
    return false;
  }
  return exactUserAnswer.includes(supportingExactSpan);
}

/**
 * Resolve a derived observation without inventing motive or theory fill-in.
 * Explicit status requires an allowed enum value and an exact supporting span
 * that appears in the raw answer. Otherwise the observation is unclear.
 *
 * @param {{
 *   question_id: string,
 *   exact_user_answer: string,
 *   observation_type?: string,
 *   proposed_value?: string | null,
 *   supporting_exact_span?: string | null,
 *   observation_id?: string,
 * }} input
 */
export function resolveDerivedObservation(input) {
  const question = getApQuestion(input.question_id);
  const exactUserAnswer = isNonEmptyString(input.exact_user_answer)
    ? input.exact_user_answer
    : "";
  const observationType = isNonEmptyString(input.observation_type)
    ? input.observation_type
    : question.observation_type;
  const observationId =
    isNonEmptyString(input.observation_id)
      ? input.observation_id
      : `${question.question_id}:${observationType}`;

  const proposedValue = input.proposed_value;
  const supportingExactSpan = input.supporting_exact_span;
  const typeMatches = observationType === question.observation_type;
  const valueAllowed =
    isNonEmptyString(proposedValue) &&
    proposedValue !== "unclear" &&
    question.allowed_values.includes(proposedValue);
  const spanOk = spanSupportedByAnswer(exactUserAnswer, supportingExactSpan);

  if (typeMatches && valueAllowed && spanOk && isNonEmptyString(supportingExactSpan)) {
    return Object.freeze({
      observation_id: observationId,
      observation_type: observationType,
      value: proposedValue,
      supporting_answer_question_id: question.question_id,
      supporting_exact_span: supportingExactSpan,
      derivation_status: DERIVATION_EXPLICIT,
    });
  }

  return Object.freeze({
    observation_id: observationId,
    observation_type: observationType,
    value: "unclear",
    supporting_answer_question_id: question.question_id,
    supporting_exact_span:
      spanOk && isNonEmptyString(supportingExactSpan) ? supportingExactSpan : null,
    derivation_status: DERIVATION_UNCLEAR,
  });
}

/**
 * @typedef {{
 *   observation_id: string,
 *   observation_type: string,
 *   value: string,
 *   supporting_answer_question_id: string,
 *   supporting_exact_span: string | null,
 *   derivation_status: string,
 * }} DerivedObservation
 */

/**
 * @typedef {{
 *   interaction_version: string,
 *   question_id: string,
 *   question_version: string,
 *   exact_question_text: string,
 *   exact_user_answer: string,
 *   derived_observations: readonly DerivedObservation[],
 *   [key: string]: unknown,
 * }} ApAnswerRecord
 */

/**
 * Create an authoritative AP answer record. Derived observations never
 * overwrite the exact user answer.
 *
 * @param {{
 *   question_id: string,
 *   exact_user_answer: string,
 *   proposed_observation?: {
 *     observation_type?: string,
 *     proposed_value?: string | null,
 *     supporting_exact_span?: string | null,
 *     observation_id?: string,
 *   } | null,
 *   literal_fields?: Record<string, string>,
 * }} input
 * @returns {ApAnswerRecord}
 */
export function createApAnswerRecord(input) {
  const question = getApQuestion(input.question_id);
  if (typeof input.exact_user_answer !== "string") {
    throw new Error("exact_user_answer must be a string");
  }

  const exactUserAnswer = input.exact_user_answer;
  const proposed = input.proposed_observation ?? null;
  const derived = resolveDerivedObservation({
    question_id: question.question_id,
    exact_user_answer: exactUserAnswer,
    observation_type: proposed?.observation_type,
    proposed_value: proposed?.proposed_value,
    supporting_exact_span: proposed?.supporting_exact_span,
    observation_id: proposed?.observation_id,
  });

  /** @type {ApAnswerRecord} */
  const record = {
    interaction_version: INTERACTION_VERSION,
    question_id: question.question_id,
    question_version: question.question_version,
    exact_question_text: question.exact_question_text,
    exact_user_answer: exactUserAnswer,
    derived_observations: Object.freeze([derived]),
  };

  const allowedLiteralKeys =
    LITERAL_FIELDS_BY_QUESTION[question.question_id] ?? Object.freeze([]);

  if (input.literal_fields && typeof input.literal_fields === "object") {
    for (const [key, value] of Object.entries(input.literal_fields)) {
      if (AP_ANSWER_CORE_FIELDS.includes(key)) {
        continue;
      }
      if (!allowedLiteralKeys.includes(key)) {
        continue;
      }
      if (isNonEmptyString(value) && exactUserAnswer.includes(value)) {
        record[key] = value;
      }
    }
  }

  return Object.freeze(record);
}

/**
 * @typedef {"changed" | "unchanged" | "uncertain" | "unclear"} SelfReportedShift
 */

/**
 * Constrain Q6 self_reported_shift to the accepted enum.
 * Unsupported or missing values resolve to unclear without inference.
 *
 * @param {unknown} value
 * @returns {SelfReportedShift}
 */
export function resolveSelfReportedShift(value) {
  if (
    isNonEmptyString(value) &&
    /** @type {readonly string[]} */ (SELF_REPORTED_SHIFT_VALUES).includes(value)
  ) {
    return /** @type {SelfReportedShift} */ (value);
  }
  return "unclear";
}

/**
 * Build the six-question inquiry session from domain answers keyed by question_id.
 * Production behavior does not depend on case/test identifiers.
 *
 * @param {Record<string, {
 *   exact_user_answer: string,
 *   proposed_observation?: {
 *     observation_type?: string,
 *     proposed_value?: string | null,
 *     supporting_exact_span?: string | null,
 *     observation_id?: string,
 *   } | null,
 *   literal_fields?: Record<string, string>,
 *   self_reported_shift?: string,
 * }>} answersByQuestionId
 */
export function buildApInquirySession(answersByQuestionId = {}) {
  const answerRecords = AP_INQUIRY_SEQUENCE.map((question) => {
    const supplied = answersByQuestionId[question.question_id] ?? {
      exact_user_answer: "",
    };
    return createApAnswerRecord({
      question_id: question.question_id,
      exact_user_answer: supplied.exact_user_answer,
      proposed_observation: supplied.proposed_observation,
      literal_fields: supplied.literal_fields,
    });
  });

  const q6 = answersByQuestionId.APQ6_RESEE;
  const provisionalChoiceObservation = answerRecords[5].derived_observations[0];
  const provisionalChoice = provisionalChoiceObservation.value;
  const selfReportedShift = resolveSelfReportedShift(q6?.self_reported_shift);

  const frozenRecords = Object.freeze(answerRecords);
  const branchReflection = buildApBranchReflection({
    answer_records: frozenRecords,
    provisional_choices: PROVISIONAL_CHOICES,
  });

  return Object.freeze({
    interaction_version: INTERACTION_VERSION,
    question_order: Object.freeze(
      AP_INQUIRY_SEQUENCE.map((question) => question.question_id),
    ),
    questions: AP_INQUIRY_SEQUENCE,
    answer_records: frozenRecords,
    provisional_choices: PROVISIONAL_CHOICES,
    provisional_choice: provisionalChoice,
    self_reported_shift: selfReportedShift,
    // Provisional choices never mark inquiry failure, including buy_new.
    inquiry_failed: false,
    behavioural_experiment_required: behaviouralExperimentRequired(),
    // Deterministic presentation branch + constrained reflection (no Source Lens).
    presentation_branch: branchReflection.primary_branch,
    branch_flags: branchReflection.flags,
    branch_precedence: branchReflection.branch_precedence,
    retained_for_juxtaposition: branchReflection.retained_for_juxtaposition,
    reflection: branchReflection.reflection,
    // Autonomy / safety foundation: no motive scores are computed or attached.
  });
}

/**
 * Confirm a value tree does not carry prohibited motive scores.
 * @param {unknown} value
 * @param {string[]} [found]
 * @returns {string[]}
 */
export function findProhibitedMotiveScores(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) {
      findProhibitedMotiveScores(item, found);
    }
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (PROHIBITED_MOTIVE_SCORE_KEYS.includes(key)) {
        found.push(key);
      }
      findProhibitedMotiveScores(child, found);
    }
  }
  return found;
}

/**
 * Session-level autonomy checks for INV-AP-04, INV-AP-12, INV-AP-16.
 * @param {ReturnType<typeof buildApInquirySession>} session
 */
export function assessInquiryAutonomy(session) {
  const motiveScores = findProhibitedMotiveScores(session);
  const experimentRequired = Boolean(session.behavioural_experiment_required);
  const inquiryFailed = Boolean(session.inquiry_failed);
  return Object.freeze({
    behavioural_experiment_required: experimentRequired,
    motive_scores_present: motiveScores.length > 0,
    motive_score_keys_found: Object.freeze([...motiveScores]),
    buy_new_is_approved_choice: PROVISIONAL_CHOICES.includes("buy_new"),
    buy_new_marked_as_failure:
      session.provisional_choice === "buy_new" && inquiryFailed,
    provisional_choices_ranked: false,
  });
}
