import { IMPACT_CHROME } from "./impact-pathways-ux.mjs";
import {
  consequenceBindingKey,
  isCompleteEmpiricalConsequenceRecord,
} from "./empirical-consequence.mjs";
import { SMARTPHONE_JOURNEY_STAGES } from "./situation-ux.mjs";

/**
 * Optional raw-text system-participation reflection.
 *
 * Authority: AP handoff HQ-AP-2026-10-15-002 §§2–12 and D-005.
 * Questions are project-authored inquiry. They do not create empirical
 * support, rank a phone, or diagnose the answer.
 */

const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

const INQUIRY_CLEAR_ACTIONS = new Set([
  "set_raw",
  "mark_not_sure",
  "set_choice",
  "set_shift",
  "edit_question",
  "reset",
  "back",
]);

const COMPARISON_CLEAR_ACTIONS = new Set([
  "toggle",
  "set_horizon",
  "set_remaining_service",
  "mark_remaining_not_sure",
  "set_repair_category",
  "set_post_repair_service",
  "mark_post_repair_not_sure",
  "set_used_service",
  "mark_used_not_sure",
  "set_refurbished_service",
  "mark_refurbished_not_sure",
  "set_current_owned_model",
  "set_candidate_new_model",
  "reset",
]);

/**
 * @param {string} text
 * @returns {string}
 */
function publicLine(text) {
  if (typeof text !== "string" || text.length === 0 || SNAKE_CASE_TOKEN.test(text)) {
    throw new Error("Public system-participation line is missing or contains an internal token");
  }
  if (text.includes("Acharya Prashant says")) {
    throw new Error("Public system-participation line uses direct AP attribution");
  }
  return text;
}

export const SYSTEM_PARTICIPATION_OPENING = publicLine(
  "One more question about your relationship with the wider system behind this choice.",
);

export const SYSTEM_PARTICIPATION_ANCHOR = publicLine(
  "The evidence shown here describes a supported prospective pathway that extends beyond you and the people closest to you. It does not show that you bought anything, that a specific harm already happened, or that one phone caused an outcome for a particular person or place.",
);

export const SYSTEM_PARTICIPATION_QSP1 = publicLine(
  "Looking at that pathway, what relationship, if any, do you think you already have with the wider system involved?",
);

export const SYSTEM_PARTICIPATION_QSP2 = publicLine(
  "Would that relationship look different to you if a consequence of this kind reached you, or someone you call “mine”? Why or why not?",
);

export const SYSTEM_PARTICIPATION_QSP3 = publicLine(
  "Given what you see now, is there any action you think is available to you beyond the immediate phone decision?",
);

export const SYSTEM_PARTICIPATION_GUIDANCE = publicLine(
  "You can also say that you are not sure, that you do not see a meaningful relationship, or that you do not see any meaningful action available to you.",
);

export const SYSTEM_PARTICIPATION_CLASSIFICATION = publicLine(
  "These questions are a project interpretation. They are a project-authored inquiry, separate from the empirical evidence. They are not a direct statement from Acharya Prashant.",
);

export const SYSTEM_PARTICIPATION_CHROME = Object.freeze({
  eyebrow: publicLine("Phone inquiry"),
  title: SYSTEM_PARTICIPATION_OPENING,
  reflect: publicLine("Reflect on your relationship with the wider system"),
  skip: publicLine("Skip this reflection"),
  continue: publicLine("Continue to Protect My Four"),
  back: publicLine("Back to evidence"),
  disclosureSummary: publicLine("Why this question appears"),
  disclosure: publicLine(
    "This reflection appears only because the evidence layer supplied a qualifying supported pathway extending beyond your immediate circle. The evidence and this philosophical reflection are separate: the evidence does not determine what you should think or choose.",
  ),
});

/**
 * @typedef {{
 *   opened: boolean,
 *   skipped: boolean,
 *   trigger_consequence_refs: string[],
 *   qsp1_raw: string,
 *   qsp2_raw: string,
 *   qsp3_raw: string,
 *   binding_key: string | null,
 * }} SystemParticipationState
 */

/** @returns {SystemParticipationState} */
export function createSystemParticipationState() {
  return {
    opened: false,
    skipped: false,
    trigger_consequence_refs: [],
    qsp1_raw: "",
    qsp2_raw: "",
    qsp3_raw: "",
    binding_key: null,
  };
}

/**
 * @param {unknown} value
 * @returns {value is SystemParticipationState}
 */
function isUsableState(value) {
  if (!value || typeof value !== "object") return false;
  const state = /** @type {Record<string, unknown>} */ (value);
  return (
    (state.opened === true || state.opened === false) &&
    (state.skipped === true || state.skipped === false) &&
    Array.isArray(state.trigger_consequence_refs) &&
    state.trigger_consequence_refs.every((ref) => typeof ref === "string") &&
    typeof state.qsp1_raw === "string" &&
    typeof state.qsp2_raw === "string" &&
    typeof state.qsp3_raw === "string" &&
    (state.binding_key === null || typeof state.binding_key === "string")
  );
}

/**
 * @param {SystemParticipationState | null | undefined} state
 * @returns {SystemParticipationState}
 */
function usableState(state) {
  if (!isUsableState(state)) return createSystemParticipationState();
  return {
    opened: state.opened,
    skipped: state.skipped,
    trigger_consequence_refs: [...state.trigger_consequence_refs],
    qsp1_raw: state.qsp1_raw,
    qsp2_raw: state.qsp2_raw,
    qsp3_raw: state.qsp3_raw,
    binding_key: state.binding_key,
  };
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function stringRefs(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

/**
 * @param {SystemParticipationState} current
 * @param {string | null} bindingKey
 * @param {string[]} refs
 * @param {boolean} skipped
 * @returns {SystemParticipationState}
 */
function bind(current, bindingKey, refs, skipped) {
  const keep = bindingKey !== null && current.binding_key === bindingKey;
  return {
    opened: true,
    skipped,
    trigger_consequence_refs: refs,
    qsp1_raw: keep ? current.qsp1_raw : "",
    qsp2_raw: keep ? current.qsp2_raw : "",
    qsp3_raw: keep ? current.qsp3_raw : "",
    binding_key: bindingKey,
  };
}

/**
 * @param {SystemParticipationState | null | undefined} state
 * @param {{ type?: string, text?: unknown, bindingKey?: unknown, refs?: unknown }} action
 * @returns {SystemParticipationState}
 */
export function reduceSystemParticipation(state, action) {
  const current = usableState(state);
  if (action?.type === "clear") return createSystemParticipationState();
  if (action?.type === "open" || action?.type === "skip") {
    const bindingKey = typeof action.bindingKey === "string" ? action.bindingKey : null;
    return bind(current, bindingKey, stringRefs(action.refs), action.type === "skip");
  }
  if (current.opened !== true) return current;
  if (action?.type === "set_qsp1" && typeof action.text === "string") {
    return { ...current, qsp1_raw: action.text };
  }
  if (action?.type === "set_qsp2" && typeof action.text === "string") {
    return { ...current, qsp2_raw: action.text };
  }
  if (action?.type === "set_qsp3" && typeof action.text === "string") {
    return { ...current, qsp3_raw: action.text };
  }
  if (action?.type === "continue") {
    return { ...current, skipped: false };
  }
  return current;
}

/**
 * @param {string} actionType
 * @param {SystemParticipationState} state
 * @returns {SystemParticipationState}
 */
export function participationStateAfterSituationAction(actionType, state) {
  if (actionType === "edit" || actionType === "reset") return createSystemParticipationState();
  return state;
}

/**
 * @param {string} actionType
 * @param {SystemParticipationState} state
 * @returns {SystemParticipationState}
 */
export function participationStateAfterInquiryAction(actionType, state) {
  if (INQUIRY_CLEAR_ACTIONS.has(actionType)) return createSystemParticipationState();
  return state;
}

/**
 * @param {string} actionType
 * @param {SystemParticipationState} state
 * @returns {SystemParticipationState}
 */
export function participationStateAfterComparisonAction(actionType, state) {
  if (COMPARISON_CLEAR_ACTIONS.has(actionType)) return createSystemParticipationState();
  return state;
}

/**
 * @param {string} actionType
 * @param {SystemParticipationState} state
 * @returns {SystemParticipationState}
 */
export function participationStateAfterImpactAction(actionType, state) {
  if (actionType === "clear") return createSystemParticipationState();
  return state;
}

/**
 * @param {boolean} open
 */
function presentStages(open) {
  return SMARTPHONE_JOURNEY_STAGES.map((stage) => {
    if (!open) {
      return {
        id: stage.id,
        label: stage.label,
        availability: "pending",
        note: publicLine("Pending. Not part of this step."),
      };
    }
    if (stage.id === "situation" || stage.id === "inquiry" || stage.id === "empirical-comparison") {
      return {
        id: stage.id,
        label: stage.label,
        availability: "recorded",
        note: publicLine("Recorded."),
      };
    }
    if (stage.id === "impact-dependency") {
      return {
        id: stage.id,
        label: IMPACT_CHROME.title,
        availability: "recorded",
        note: publicLine("Evidence recorded. This reflection is optional."),
      };
    }
    return {
      id: stage.id,
      label: stage.label,
      availability: "pending",
      note: publicLine("Pending. Not part of this step."),
    };
  });
}

/**
 * @param {SystemParticipationState | null | undefined} state
 * @param {{ record?: unknown }} [context]
 */
export function describeSystemParticipation(state, context = {}) {
  const current = usableState(state);
  const record = isCompleteEmpiricalConsequenceRecord(context.record) ? context.record : null;
  const key = consequenceBindingKey(record);
  const bound = record !== null && current.binding_key === key;
  const stale = current.binding_key !== null && current.binding_key !== key;
  const stages = presentStages(record !== null);
  if (!record) {
    return {
      available: false,
      opened: false,
      skipped: false,
      stale,
      trigger_consequence_refs: [],
      qsp1_raw: "",
      qsp2_raw: "",
      qsp3_raw: "",
      binding_key: null,
      opening: SYSTEM_PARTICIPATION_OPENING,
      anchor: null,
      classification: null,
      guidance: null,
      questions: [],
      disclosure: null,
      stages,
      record: null,
    };
  }

  return {
    available: true,
    opened: bound && current.opened === true,
    skipped: bound && current.skipped === true,
    stale,
    trigger_consequence_refs: bound ? [...current.trigger_consequence_refs] : [],
    qsp1_raw: bound ? current.qsp1_raw : "",
    qsp2_raw: bound ? current.qsp2_raw : "",
    qsp3_raw: bound ? current.qsp3_raw : "",
    binding_key: key,
    opening: SYSTEM_PARTICIPATION_OPENING,
    anchor: SYSTEM_PARTICIPATION_ANCHOR,
    classification: SYSTEM_PARTICIPATION_CLASSIFICATION,
    guidance: SYSTEM_PARTICIPATION_GUIDANCE,
    questions: [
      { id: "qsp1", prompt: SYSTEM_PARTICIPATION_QSP1, value: bound ? current.qsp1_raw : "" },
      { id: "qsp2", prompt: SYSTEM_PARTICIPATION_QSP2, value: bound ? current.qsp2_raw : "" },
      { id: "qsp3", prompt: SYSTEM_PARTICIPATION_QSP3, value: bound ? current.qsp3_raw : "" },
    ],
    disclosure: {
      summary: SYSTEM_PARTICIPATION_CHROME.disclosureSummary,
      body: SYSTEM_PARTICIPATION_CHROME.disclosure,
    },
    stages,
    record,
  };
}
