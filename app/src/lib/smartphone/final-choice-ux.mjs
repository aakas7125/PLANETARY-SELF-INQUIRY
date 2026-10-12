import { PROVISIONAL_CHOICES } from "./ap-inquiry.mjs";
import { PROVISIONAL_CHOICE_LABELS } from "./ap-inquiry-ux.mjs";
import { OTHERNESS_CHROME } from "./ap-otherness-ux.mjs";
import { COMPARISON_PATHWAYS } from "./comparison-ux.mjs";
import { IMPACT_CHROME } from "./impact-pathways-ux.mjs";
import { SMARTPHONE_JOURNEY_STAGES } from "./situation-ux.mjs";

/**
 * Presentation and state for the final user choice.
 *
 * Provisional Q6 selections, inspected comparison pathways, and this
 * selection stay distinct. Nothing here ranks, recommends, or fills a
 * missing fact. Otherness nonactivation does not close the stage.
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
  "reset",
]);

const PROVISIONAL_IDS = new Set(PROVISIONAL_CHOICES);

/**
 * Final options in fixed presentation order. The order is not a ranking.
 * Pathway ids are the comparison identities. The last two are accepted AP
 * choice ids and are not comparison pathways.
 *
 * @type {readonly { id: FinalChoiceId, label: string }[]}
 */
export const FINAL_CHOICE_OPTIONS = Object.freeze([
  Object.freeze({ id: "keep", label: pathwayLabel("keep") }),
  Object.freeze({ id: "repair", label: pathwayLabel("repair") }),
  Object.freeze({ id: "used_secondhand", label: pathwayLabel("used_secondhand") }),
  Object.freeze({ id: "refurbished", label: pathwayLabel("refurbished") }),
  Object.freeze({ id: "new", label: pathwayLabel("new") }),
  Object.freeze({
    id: "investigate_further",
    label: provisionalLabel("investigate_further"),
  }),
  Object.freeze({ id: "unclear", label: provisionalLabel("unclear") }),
]);

const FINAL_CHOICE_IDS = new Set(FINAL_CHOICE_OPTIONS.map((option) => option.id));

/**
 * @typedef {"keep" | "repair" | "used_secondhand" | "refurbished" | "new" | "investigate_further" | "unclear"} FinalChoiceId
 */

/**
 * @typedef {{ opened: boolean, selection: FinalChoiceId | null }} FinalChoiceState
 */

/**
 * @param {string} text
 * @returns {string}
 */
function publicLine(text) {
  if (typeof text !== "string" || text.length === 0 || SNAKE_CASE_TOKEN.test(text)) {
    throw new Error("Public final-choice line is missing or contains an internal token");
  }
  return text;
}

/**
 * @param {string} id
 * @returns {string}
 */
function pathwayLabel(id) {
  const pathway = COMPARISON_PATHWAYS.find((item) => item.id === id);
  if (!pathway) throw new Error("Missing comparison pathway label");
  return publicLine(pathway.label);
}

/**
 * @param {string} id
 * @returns {string}
 */
function provisionalLabel(id) {
  const label = Object.prototype.hasOwnProperty.call(PROVISIONAL_CHOICE_LABELS, id)
    ? PROVISIONAL_CHOICE_LABELS[id]
    : undefined;
  if (typeof label !== "string") throw new Error("Missing provisional choice label");
  return publicLine(label);
}

export const FINAL_CHOICE_OPENING = publicLine(
  "This step records the choice you make now. Nothing earlier in the journey selects it for you.",
);

export const FINAL_CHOICE_CLOSED_NOTE = publicLine(
  "User choice opens only after the Protect Four and otherness inquiry has been entered.",
);

export const FINAL_CHOICE_ORDER_NOTE = publicLine(
  "These options are shown in a fixed order. That order is not a ranking. No option is selected for you.",
);

export const FINAL_CHOICE_ORDINARY_NOTE = publicLine(
  "Buying a new phone is an ordinary choice, not a failed inquiry. Unclear is a valid choice.",
);

export const FINAL_CHOICE_BOUNDARY = publicLine(
  "Nothing here scores a motive, diagnoses you, or recommends what to choose. The choice stays yours.",
);

export const FINAL_CHOICE_ADEQUACY_NOTE = publicLine(
  "Choosing an option does not mean it is adequate, available, preferable, fully quantified, or supported by complete evidence. It does not mean the option prevents or causes a specific later outcome.",
);

export const FINAL_CHOICE_COMPLETION = publicLine(
  "This is your present choice. It is not a recommendation from PSI.",
);

export const FINAL_CHOICE_CHANGE_NOTE = publicLine(
  "You can choose a different option or clear this one.",
);

export const FINAL_CHOICE_PROVISIONAL_HEADING = publicLine("Provisional inquiry choice");

export const FINAL_CHOICE_PROVISIONAL_NOTE = publicLine(
  "This was recorded earlier in the inquiry. It stays provisional and does not select an option here.",
);

export const FINAL_CHOICE_PROVISIONAL_ABSENT = publicLine(
  "No provisional inquiry choice was recorded.",
);

export const FINAL_CHOICE_INSPECTED_HEADING = publicLine("Pathways inspected in comparison");

export const FINAL_CHOICE_INSPECTED_NOTE = publicLine(
  "These pathways were inspected. Inspecting them does not select or rank an option here.",
);

export const FINAL_CHOICE_INSPECTED_ABSENT = publicLine("No comparison pathway was inspected.");

export const FINAL_CHOICE_INSPECTED_UNKNOWN = publicLine(
  "Which pathways were inspected is not available here.",
);

export const FINAL_CHOICE_OTHERNESS_HEADING = publicLine("Protect Four and otherness inquiry");

export const FINAL_CHOICE_OTHERNESS_SHOWN = publicLine("The otherness question was shown.");

export const FINAL_CHOICE_OTHERNESS_NOT_ESTABLISHED = publicLine(
  "The otherness question was not established from what was displayed. That is not a finding that effects are absent, and it is not a finding that they stay with you and the people closest to you.",
);

export const FINAL_CHOICE_OTHERNESS_UNKNOWN = publicLine(
  "Whether the otherness question was established is not available here.",
);

export const FINAL_CHOICE_RESPONSE_HEADING = publicLine("Your otherness response");

export const FINAL_CHOICE_FOLLOW_UP_HEADING = publicLine("Your otherness follow-up");

export const FINAL_CHOICE_CHROME = Object.freeze({
  eyebrow: "Phone inquiry",
  title: publicLine("User choice"),
  continueFromOtherness: publicLine("Continue to user choice"),
  back: publicLine("Back to Protect Four and otherness inquiry"),
  legend: publicLine("Your choice"),
  reset: publicLine("Clear this choice"),
});

/** @returns {FinalChoiceState} */
export function createFinalChoiceState() {
  return { opened: false, selection: null };
}

/**
 * @param {unknown} value
 * @returns {value is FinalChoiceId}
 */
export function isFinalChoiceId(value) {
  return typeof value === "string" && FINAL_CHOICE_IDS.has(value);
}

/**
 * @param {FinalChoiceState | null | undefined} state
 * @returns {FinalChoiceState}
 */
function usableState(state) {
  if (!state || (state.opened !== true && state.opened !== false)) return createFinalChoiceState();
  if (state.selection !== null && !isFinalChoiceId(state.selection)) return createFinalChoiceState();
  return state;
}

/**
 * @param {FinalChoiceState} state
 * @param {{ type?: string, value?: unknown }} action
 * @returns {FinalChoiceState}
 */
export function reduceFinalChoice(state, action) {
  const current = usableState(state);
  if (action?.type === "clear") return createFinalChoiceState();
  if (action?.type === "open") {
    return { opened: true, selection: current.selection };
  }
  if (current.opened !== true) return current;
  if (action?.type === "reset") {
    return { opened: true, selection: null };
  }
  if (action?.type === "set_choice" && isFinalChoiceId(action.value)) {
    return { opened: true, selection: action.value };
  }
  return current;
}

/**
 * @param {string} actionType
 * @param {FinalChoiceState} state
 * @returns {FinalChoiceState}
 */
function clearUnlessUnchanged(actionClears, state) {
  if (!actionClears) return state;
  if (state.opened === false && state.selection === null) return state;
  return createFinalChoiceState();
}

/**
 * @param {string} actionType
 * @param {FinalChoiceState} state
 * @returns {FinalChoiceState}
 */
export function finalChoiceStateAfterSituationAction(actionType, state) {
  return clearUnlessUnchanged(actionType === "edit" || actionType === "reset", state);
}

/**
 * @param {string} actionType
 * @param {FinalChoiceState} state
 * @returns {FinalChoiceState}
 */
export function finalChoiceStateAfterInquiryAction(actionType, state) {
  return clearUnlessUnchanged(INQUIRY_CLEAR_ACTIONS.has(actionType), state);
}

/**
 * @param {string} actionType
 * @param {FinalChoiceState} state
 * @returns {FinalChoiceState}
 */
export function finalChoiceStateAfterComparisonAction(actionType, state) {
  return clearUnlessUnchanged(COMPARISON_CLEAR_ACTIONS.has(actionType), state);
}

/**
 * @param {string} actionType
 * @param {FinalChoiceState} state
 * @returns {FinalChoiceState}
 */
export function finalChoiceStateAfterImpactAction(actionType, state) {
  return clearUnlessUnchanged(actionType === "clear", state);
}

/**
 * Editing the otherness response drops a stale final choice.
 * Opening that stage, or leaving it, does not.
 *
 * @param {string} actionType
 * @param {FinalChoiceState} state
 * @returns {FinalChoiceState}
 */
export function finalChoiceStateAfterOthernessAction(actionType, state) {
  return clearUnlessUnchanged(
    actionType === "clear" || actionType === "set_response" || actionType === "set_follow_up",
    state,
  );
}

/**
 * Going back to the otherness stage keeps the final choice.
 *
 * @param {FinalChoiceState} state
 * @returns {FinalChoiceState}
 */
export function finalChoiceStateAfterReturnToOtherness(state) {
  return state;
}

/**
 * @param {{ othernessEntered?: boolean }} [context]
 * @returns {boolean}
 */
export function canEnterFinalChoice(context = {}) {
  return context.othernessEntered === true;
}

/**
 * @param {boolean} open
 */
function presentStages(open) {
  return SMARTPHONE_JOURNEY_STAGES.map((stage) => {
    if (!open) {
      return {
        id: stage.id,
        label: stage.id === "user-choice" ? FINAL_CHOICE_CHROME.title : stage.label,
        availability: "pending",
        note: publicLine("Pending. Not part of this step."),
      };
    }
    if (stage.id === "situation") {
      return { id: stage.id, label: stage.label, availability: "recorded", note: publicLine("Situation recorded.") };
    }
    if (stage.id === "inquiry") {
      return { id: stage.id, label: stage.label, availability: "recorded", note: publicLine("Inquiry recorded.") };
    }
    if (stage.id === "empirical-comparison") {
      return {
        id: stage.id,
        label: stage.label,
        availability: "recorded",
        note: publicLine("Empirical comparison recorded."),
      };
    }
    if (stage.id === "impact-dependency") {
      return {
        id: stage.id,
        label: IMPACT_CHROME.title,
        availability: "recorded",
        note: publicLine("Impact and dependency pathways recorded."),
      };
    }
    if (stage.id === "protect-four-otherness") {
      return {
        id: stage.id,
        label: publicLine(OTHERNESS_CHROME.title),
        availability: "recorded",
        note: publicLine("Protect Four and otherness inquiry recorded."),
      };
    }
    return {
      id: stage.id,
      label: FINAL_CHOICE_CHROME.title,
      availability: "current",
      note: publicLine("Current stage"),
    };
  });
}

/**
 * @param {unknown} records
 * @returns {{ status: "unknown" } | { status: "known", labels: string[] }}
 */
function inspectedLabels(records) {
  if (!Array.isArray(records)) return { status: "unknown" };
  /** @type {string[]} */
  const labels = [];
  const seen = new Set();
  for (const pathway of COMPARISON_PATHWAYS) {
    const selected = records.some(
      (record) =>
        record !== null &&
        typeof record === "object" &&
        /** @type {{ id?: unknown, selected?: unknown }} */ (record).id === pathway.id &&
        /** @type {{ selected?: unknown }} */ (record).selected === true,
    );
    if (!selected || seen.has(pathway.id)) continue;
    seen.add(pathway.id);
    labels.push(pathwayLabel(pathway.id));
  }
  return { status: "known", labels };
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function enteredText(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  return value;
}

/**
 * @param {FinalChoiceState} state
 * @param {{
 *   othernessEntered?: boolean,
 *   othernessActivated?: boolean,
 *   othernessResponse?: unknown,
 *   othernessFollowUp?: unknown,
 *   provisionalChoice?: unknown,
 *   inspectedPathways?: unknown,
 * }} [context]
 */
export function describeFinalChoice(state, context = {}) {
  const current = usableState(state);
  const open = current.opened === true && canEnterFinalChoice(context);
  const stages = presentStages(open);
  if (!open) {
    return {
      available: false,
      opening: FINAL_CHOICE_OPENING,
      closedNote: FINAL_CHOICE_CLOSED_NOTE,
      orderNote: null,
      ordinaryNote: null,
      boundary: null,
      adequacyNote: null,
      stages,
      provisional: null,
      inspected: null,
      otherness: null,
      options: [],
      selection: null,
      completion: null,
      changeNote: null,
    };
  }

  const provisionalKnown =
    typeof context.provisionalChoice === "string" && PROVISIONAL_IDS.has(context.provisionalChoice);
  const inspected = inspectedLabels(context.inspectedPathways);
  const activated = context.othernessActivated;
  const othernessNote =
    activated === true
      ? FINAL_CHOICE_OTHERNESS_SHOWN
      : activated === false
        ? FINAL_CHOICE_OTHERNESS_NOT_ESTABLISHED
        : FINAL_CHOICE_OTHERNESS_UNKNOWN;
  const showResponse = activated === true;

  return {
    available: true,
    opening: FINAL_CHOICE_OPENING,
    closedNote: null,
    orderNote: FINAL_CHOICE_ORDER_NOTE,
    ordinaryNote: FINAL_CHOICE_ORDINARY_NOTE,
    boundary: FINAL_CHOICE_BOUNDARY,
    adequacyNote: FINAL_CHOICE_ADEQUACY_NOTE,
    stages,
    provisional: {
      heading: FINAL_CHOICE_PROVISIONAL_HEADING,
      label: provisionalKnown ? provisionalLabel(/** @type {string} */ (context.provisionalChoice)) : null,
      absentNote: provisionalKnown ? null : FINAL_CHOICE_PROVISIONAL_ABSENT,
      note: FINAL_CHOICE_PROVISIONAL_NOTE,
    },
    inspected: {
      heading: FINAL_CHOICE_INSPECTED_HEADING,
      status: inspected.status,
      labels: inspected.status === "known" ? inspected.labels : [],
      absentNote:
        inspected.status === "known" && inspected.labels.length === 0
          ? FINAL_CHOICE_INSPECTED_ABSENT
          : null,
      unknownNote: inspected.status === "unknown" ? FINAL_CHOICE_INSPECTED_UNKNOWN : null,
      note: inspected.status === "known" && inspected.labels.length > 0 ? FINAL_CHOICE_INSPECTED_NOTE : null,
    },
    otherness: {
      heading: FINAL_CHOICE_OTHERNESS_HEADING,
      note: othernessNote,
      responseHeading: FINAL_CHOICE_RESPONSE_HEADING,
      response: showResponse ? enteredText(context.othernessResponse) : null,
      followUpHeading: FINAL_CHOICE_FOLLOW_UP_HEADING,
      followUp: showResponse ? enteredText(context.othernessFollowUp) : null,
    },
    options: FINAL_CHOICE_OPTIONS.map((option) => ({
      id: option.id,
      label: option.label,
      selected: current.selection === option.id,
    })),
    selection: current.selection,
    completion: current.selection ? FINAL_CHOICE_COMPLETION : null,
    changeNote: current.selection ? FINAL_CHOICE_CHANGE_NOTE : null,
  };
}
