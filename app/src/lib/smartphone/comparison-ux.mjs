import { UNKNOWN, evaluateAdequacyAndUnknownState } from "./input-decision.mjs";
import { evaluateSecondaryPathwayCase } from "./secondary-pathway.mjs";
import { describeInquiry } from "./ap-inquiry-ux.mjs";
import {
  SMARTPHONE_JOURNEY_STAGES,
  buildAdequacyInput,
  isCompleteExplicit,
} from "./situation-ux.mjs";

/**
 * Presentation for the canonical smartphone comparison-entry step.
 *
 * Domain results come only from the accepted input and secondary evaluators.
 * This module does not copy their numerical constants, invent repair or model
 * facts, or rank pathways.
 */

const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;
const HORIZON_LITERAL = /^(?:\d+)(?:\.\d+)?$/;

export const COMPARISON_OPENING =
  "Enter one shared horizon in years for the alternatives you compare.";

export const COMPARISON_BOUNDARY =
  "This comparison does not tell you what to buy, and it does not rank the pathways.";

export const COMPARISON_SELECTION_NOTE =
  "Select the possibilities you want to compare side by side. Selecting more than one does not mean you intend to do all of them. The actual decision is recorded later, at the user choice stage. No pathway is preselected. Choosing one does not mean it is adequate, available, preferable, or supported by complete evidence. A choice from the inquiry does not select these pathways.";

export const COMPARISON_ORDER_NOTE =
  "Selected pathways are shown in a fixed order. That order is not a ranking.";

export const COMPARISON_HORIZON_HELPER =
  "The same horizon is needed to compare adequate service honestly.";

export const COMPARISON_HORIZON_MISSING =
  "No horizon yet. Nothing has been filled in for you.";

export const COMPARISON_HORIZON_INVALID =
  "This horizon cannot be used. It was not replaced with zero or a three-year default.";

export const COMPARISON_NEED_PATHWAY =
  "Choose at least one pathway before anything is evaluated.";

export const COMPARISON_LATER_NOTE =
  "Impact and dependency pathways stay later. They are not shown here.";

export const COMPARISON_CHROME = Object.freeze({
  eyebrow: "Phone inquiry",
  title: "Empirical comparison",
  continueFromInquiry: "Continue to empirical comparison",
  back: "Back to inquiry",
  reset: "Reset comparison",
  pathwayLegend: "Which alternatives do you want to compare?",
  horizonLabel: "Common adequate-service horizon in years",
  resultHeading: "What can be said so far",
});

/**
 * Ordinary labels for the accepted empirical pathways.
 * Ids are evaluator inputs or presentation keys. They are not AP Q6 values.
 *
 * @type {readonly { id: "keep" | "repair" | "used_secondhand" | "refurbished" | "new", label: string }[]}
 */
export const COMPARISON_PATHWAYS = Object.freeze([
  Object.freeze({ id: "keep", label: "Keep the current phone" }),
  Object.freeze({ id: "repair", label: "Repair the current phone" }),
  Object.freeze({ id: "used_secondhand", label: "Buy a used/second-hand phone" }),
  Object.freeze({ id: "refurbished", label: "Buy a refurbished phone" }),
  Object.freeze({ id: "new", label: "Buy a new phone" }),
]);

export const REMAINING_SERVICE_LABEL =
  "How many years is the current phone expected to remain adequate without repair?";

export const REMAINING_SERVICE_HELPER =
  "This is the current phone without a repair. It is not the shared horizon, and nothing is filled in for you.";

export const REPAIR_CATEGORY_LEGEND = "What kind of repair is this?";

export const REPAIR_CATEGORY_HELPER =
  "No kind is preselected. Another kind of repair, or not sure, stays that choice.";

export const POST_REPAIR_SERVICE_LABEL =
  "How many years of adequate service are expected after this repair?";

export const POST_REPAIR_SERVICE_HELPER =
  "This is not the shared horizon and not the current phone without a repair. Not sure stays unknown.";

export const FACT_NOT_SURE_LABEL = "Not sure";

export const FACT_NOT_SURE_NOTE =
  "Not sure is the answer being used. Typed years stay as typed and are not turned into zero.";

export const USED_SERVICE_LABEL =
  "How many years of adequate service are expected for this used or second-hand candidate?";

export const USED_SERVICE_HELPER =
  "This is only this used or second-hand candidate. It is not the shared horizon, and it is not the refurbished candidate. Nothing is filled in for you.";

export const REFURBISHED_SERVICE_LABEL =
  "How many years of adequate service are expected for this refurbished candidate?";

export const REFURBISHED_SERVICE_HELPER =
  "This is only this refurbished candidate. It is not the shared horizon, and it is not the used or second-hand candidate. Nothing is filled in for you.";

/**
 * Ordinary labels for repair facts. Only battery, display, and major-board
 * are accepted evaluator repair types. The other two choices stay unmapped.
 *
 * @type {readonly { id: RepairFactCategoryId, label: string }[]}
 */
export const REPAIR_FACT_CATEGORIES = Object.freeze([
  Object.freeze({ id: "battery", label: "Battery repair" }),
  Object.freeze({ id: "display", label: "Display repair" }),
  Object.freeze({ id: "major_board", label: "Major-board repair" }),
  Object.freeze({ id: "another", label: "Another kind of repair" }),
  Object.freeze({ id: "not_sure", label: "Not sure" }),
]);

const PATHWAY_IDS = COMPARISON_PATHWAYS.map((pathway) => pathway.id);

const CAPABILITY_LABELS = Object.freeze({
  quantitative: "A quantified result is available",
  range_quantitative: "A quantified range is available",
  partial_quantitative: "Only part of this burden is quantified",
  qualitative_only: "This can be described, but not fully measured, with the facts given",
  insufficient_information: "More information is needed",
  conditional: "This depends on conditions that are not settled here",
  unknown: "Unknown",
});

const SCOPE_LABELS = Object.freeze({
  generic_fallback: "Generic fallback",
  model_specific: "Specific to the stated model",
  PROVISIONAL_GENERIC_RANGE: "Provisional generic range",
  APPROVED_SOURCE_SPECIFIC: "Source-specific reference",
  UNKNOWN_NO_FALLBACK: "Unknown, and no stand-in value is used",
  EXCLUDED_UNQUANTIFIED: "Excluded and not quantified",
});

/**
 * @typedef {"keep" | "repair" | "used_secondhand" | "refurbished" | "new"} ComparisonPathwayId
 */

/**
 * @typedef {"battery" | "display" | "major_board" | "another" | "not_sure"} RepairFactCategoryId
 */

/**
 * @typedef {number | "unknown" | null} ExplicitServiceValue
 */

/**
 * @typedef {"absent" | "not_sure" | "invalid" | "accepted" | "rejected"} ServiceFactStatus
 */

/**
 * @typedef {{
 *   selectedIds: ComparisonPathwayId[],
 *   horizonRaw: string,
 *   remainingServiceRaw: string,
 *   remainingServiceNotSure: boolean,
 *   repairCategoryId: RepairFactCategoryId | null,
 *   postRepairServiceRaw: string,
 *   postRepairServiceNotSure: boolean,
 *   usedServiceRaw: string,
 *   usedServiceNotSure: boolean,
 *   refurbishedServiceRaw: string,
 *   refurbishedServiceNotSure: boolean,
 * }} ComparisonState
 */

/**
 * @typedef {{
 *   remainingService?: ExplicitServiceValue,
 *   repairCategoryId?: RepairFactCategoryId | null,
 *   postRepairService?: ExplicitServiceValue,
 *   usedService?: ExplicitServiceValue,
 *   refurbishedService?: ExplicitServiceValue,
 * } | null} ComparisonFactInput
 */

/**
 * @typedef {{ type: "toggle", pathwayId: string }
 *   | { type: "set_horizon", text: string }
 *   | { type: "set_remaining_service", text: string }
 *   | { type: "mark_remaining_not_sure" }
 *   | { type: "set_repair_category", categoryId: string }
 *   | { type: "set_post_repair_service", text: string }
 *   | { type: "mark_post_repair_not_sure" }
 *   | { type: "set_used_service", text: string }
 *   | { type: "mark_used_not_sure" }
 *   | { type: "set_refurbished_service", text: string }
 *   | { type: "mark_refurbished_not_sure" }
 *   | { type: "reset" }} ComparisonAction
 */

/**
 * @param {string} text
 * @returns {string}
 */
function publicLine(text) {
  if (SNAKE_CASE_TOKEN.test(text)) {
    throw new Error("Public comparison line contains an internal token");
  }
  return text;
}

/**
 * @param {unknown} value
 * @returns {value is ComparisonPathwayId}
 */
export function isComparisonPathwayId(value) {
  return typeof value === "string" && PATHWAY_IDS.some((id) => id === value);
}

/**
 * @param {unknown} value
 * @returns {value is RepairFactCategoryId}
 */
export function isRepairFactCategoryId(value) {
  return REPAIR_FACT_CATEGORIES.some((category) => category.id === value);
}

/**
 * @param {ComparisonState} state
 * @returns {boolean}
 */
function remainingServiceActive(state) {
  return state.selectedIds.includes("keep") || state.selectedIds.includes("new");
}

/**
 * @param {ComparisonState} state
 * @returns {boolean}
 */
function repairFactsActive(state) {
  return state.selectedIds.includes("repair");
}

/**
 * @param {ComparisonState} state
 * @returns {boolean}
 */
function usedServiceActive(state) {
  return state.selectedIds.includes("used_secondhand");
}

/**
 * @param {ComparisonState} state
 * @returns {boolean}
 */
function refurbishedServiceActive(state) {
  return state.selectedIds.includes("refurbished");
}

/**
 * @param {ComparisonState} state
 * @param {ComparisonPathwayId[]} selectedIds
 * @returns {ComparisonState}
 */
function stateForSelection(state, selectedIds) {
  const next = {
    ...state,
    selectedIds: [...selectedIds],
  };
  if (!remainingServiceActive(next)) {
    next.remainingServiceRaw = "";
    next.remainingServiceNotSure = false;
  }
  if (!repairFactsActive(next)) {
    next.repairCategoryId = null;
    next.postRepairServiceRaw = "";
    next.postRepairServiceNotSure = false;
  }
  if (!usedServiceActive(next)) {
    next.usedServiceRaw = "";
    next.usedServiceNotSure = false;
  }
  if (!refurbishedServiceActive(next)) {
    next.refurbishedServiceRaw = "";
    next.refurbishedServiceNotSure = false;
  }
  return next;
}

/**
 * Finite positive decimal only. Empty, zero, and unusable text stay null.
 * Nothing here substitutes zero or the provisional three-year horizon.
 *
 * @param {unknown} raw
 * @returns {number | null}
 */
export function parseExplicitHorizon(raw) {
  if (typeof raw !== "string") return null;
  const literal = raw.trim();
  if (!HORIZON_LITERAL.test(literal)) return null;
  const value = Number(literal);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

/**
 * Finite positive decimal for an explicit service-year fact.
 * This does not read the shared horizon. Empty, zero, and unusable text stay null.
 *
 * @param {unknown} raw
 * @returns {number | null}
 */
export function parseExplicitServiceYears(raw) {
  return parseExplicitHorizon(typeof raw === "string" ? raw : "");
}

/**
 * @param {unknown} raw
 * @param {unknown} notSure
 * @returns {ExplicitServiceValue}
 */
function explicitServiceValue(raw, notSure) {
  if (notSure === true) return UNKNOWN;
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const parsed = parseExplicitServiceYears(raw);
  return parsed == null ? UNKNOWN : parsed;
}

/**
 * @param {unknown} raw
 * @param {unknown} notSure
 * @returns {ServiceFactStatus}
 */
function textServiceStatus(raw, notSure) {
  if (notSure === true) return "not_sure";
  if (typeof raw !== "string" || raw.trim() === "") return "absent";
  if (parseExplicitServiceYears(raw) == null) return "invalid";
  return "accepted";
}

/**
 * @param {ComparisonState} state
 * @param {Record<string, unknown>} decision
 * @returns {ServiceFactStatus}
 */
function remainingPresentationStatus(state, decision) {
  const status = textServiceStatus(state.remainingServiceRaw, state.remainingServiceNotSure);
  if (status === "accepted" && decision.validation_status === "error" && decision.accepted_value == null) {
    return "rejected";
  }
  return status;
}

/**
 * @param {RepairFactCategoryId | null | undefined} categoryId
 * @returns {"battery" | "display" | "major_board" | null}
 */
function acceptedRepairType(categoryId) {
  if (categoryId === "battery" || categoryId === "display" || categoryId === "major_board") {
    return categoryId;
  }
  return null;
}

/** @returns {ComparisonState} */
export function createComparisonState() {
  return {
    selectedIds: [],
    horizonRaw: "",
    remainingServiceRaw: "",
    remainingServiceNotSure: false,
    repairCategoryId: null,
    postRepairServiceRaw: "",
    postRepairServiceNotSure: false,
    usedServiceRaw: "",
    usedServiceNotSure: false,
    refurbishedServiceRaw: "",
    refurbishedServiceNotSure: false,
  };
}

/**
 * @param {ComparisonState} state
 * @param {ComparisonAction} action
 * @returns {ComparisonState}
 */
export function reduceComparison(state, action) {
  switch (action.type) {
    case "toggle": {
      if (!isComparisonPathwayId(action.pathwayId)) return state;
      const selected = state.selectedIds.includes(action.pathwayId)
        ? state.selectedIds.filter((id) => id !== action.pathwayId)
        : [...state.selectedIds, action.pathwayId];
      return stateForSelection(state, selected);
    }
    case "set_horizon": {
      if (typeof action.text !== "string") return state;
      return { ...state, selectedIds: [...state.selectedIds], horizonRaw: action.text };
    }
    case "set_remaining_service": {
      if (!remainingServiceActive(state) || typeof action.text !== "string") return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        remainingServiceRaw: action.text,
        remainingServiceNotSure: false,
      };
    }
    case "mark_remaining_not_sure": {
      if (!remainingServiceActive(state)) return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        remainingServiceNotSure: state.remainingServiceNotSure !== true,
      };
    }
    case "set_repair_category": {
      if (!repairFactsActive(state) || !isRepairFactCategoryId(action.categoryId)) return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        repairCategoryId: state.repairCategoryId === action.categoryId ? null : action.categoryId,
      };
    }
    case "set_post_repair_service": {
      if (!repairFactsActive(state) || typeof action.text !== "string") return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        postRepairServiceRaw: action.text,
        postRepairServiceNotSure: false,
      };
    }
    case "mark_post_repair_not_sure": {
      if (!repairFactsActive(state)) return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        postRepairServiceNotSure: state.postRepairServiceNotSure !== true,
      };
    }
    case "set_used_service": {
      if (!usedServiceActive(state) || typeof action.text !== "string") return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        usedServiceRaw: action.text,
        usedServiceNotSure: false,
      };
    }
    case "mark_used_not_sure": {
      if (!usedServiceActive(state)) return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        usedServiceNotSure: state.usedServiceNotSure !== true,
      };
    }
    case "set_refurbished_service": {
      if (!refurbishedServiceActive(state) || typeof action.text !== "string") return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        refurbishedServiceRaw: action.text,
        refurbishedServiceNotSure: false,
      };
    }
    case "mark_refurbished_not_sure": {
      if (!refurbishedServiceActive(state)) return state;
      return {
        ...state,
        selectedIds: [...state.selectedIds],
        refurbishedServiceNotSure: state.refurbishedServiceNotSure !== true,
      };
    }
    case "reset":
      return createComparisonState();
    default:
      return state;
  }
}

/**
 * Comparison is available only from a completed inquiry review.
 * The provisional Q6 choice is ignored.
 *
 * @param {unknown} inquiryState
 * @returns {boolean}
 */
export function canEnterComparison(inquiryState) {
  const view = describeInquiry(
    /** @type {Parameters<typeof describeInquiry>[0]} */ (inquiryState),
  );
  return view.mode === "review" && view.reviewComplete === true;
}

/**
 * @param {string} actionType
 * @param {ComparisonState} comparison
 * @returns {ComparisonState}
 */
export function comparisonStateAfterSituationAction(actionType, comparison) {
  if (actionType === "edit" || actionType === "reset") return createComparisonState();
  return comparison;
}

/**
 * Editing or leaving the completed inquiry review drops comparison state.
 * Continuing into the review does not.
 *
 * @param {string} actionType
 * @param {ComparisonState} comparison
 * @returns {ComparisonState}
 */
export function comparisonStateAfterInquiryAction(actionType, comparison) {
  if (
    actionType === "set_raw" ||
    actionType === "mark_not_sure" ||
    actionType === "set_choice" ||
    actionType === "set_shift" ||
    actionType === "edit_question" ||
    actionType === "reset" ||
    actionType === "back"
  ) {
    return createComparisonState();
  }
  return comparison;
}

/**
 * @param {Record<string, unknown>} input
 * @param {ComparisonFactInput} facts
 */
function applyRemainingServiceFact(input, facts) {
  const value = facts?.remainingService;
  if (typeof value === "number" || value === UNKNOWN) {
    input["remaining_service.without_repair.expected_years"] = value;
  }
  return input;
}

/**
 * @param {Record<string, unknown>} input
 * @param {ComparisonFactInput} facts
 */
function applyRepairFacts(input, facts) {
  const repairType = acceptedRepairType(facts?.repairCategoryId);
  if (repairType) input["repair.type"] = repairType;
  const value = facts?.postRepairService;
  if (typeof value === "number" || value === UNKNOWN) {
    input["repair.expected_adequate_service_after_repair.expected_years"] = value;
  }
  return input;
}

/**
 * @param {ComparisonPathwayId} pathwayId
 * @param {Parameters<typeof buildAdequacyInput>[0]} answers
 * @param {number} horizonYears
 * @param {ComparisonFactInput} [facts]
 */
export function buildPathwayEvaluatorInput(pathwayId, answers, horizonYears, facts = null) {
  if (pathwayId === "used_secondhand" || pathwayId === "refurbished") {
    const value = pathwayId === "used_secondhand" ? facts?.usedService : facts?.refurbishedService;
    /** @type {Record<string, unknown>} */
    const replacement = { pathway_user_selection: pathwayId };
    // The composed evaluator reads replacement.pathway, not the selection
    // field, when deciding a used short-service sequence. Both hold the same
    // explicit selection. No other evidence is added.
    if (typeof value === "number" || value === UNKNOWN) {
      replacement.pathway = pathwayId;
      replacement.expected_adequate_service = { expected_years: value };
    }
    return {
      comparison: { common_service_horizon_years: horizonYears },
      replacement,
    };
  }

  const base = {
    ...buildAdequacyInput(answers),
    common_service_horizon_years: horizonYears,
  };
  if (pathwayId === "repair") return applyRepairFacts(base, facts);
  if (pathwayId === "new") {
    return applyRemainingServiceFact(
      {
        ...base,
        "replacement.type": "new",
      },
      facts,
    );
  }
  return applyRemainingServiceFact(base, facts);
}

/**
 * @param {ComparisonPathwayId} pathwayId
 * @param {ReturnType<typeof buildPathwayEvaluatorInput>} input
 */
function evaluatePathway(pathwayId, input) {
  if (pathwayId === "used_secondhand" || pathwayId === "refurbished") {
    return evaluateSecondaryPathwayCase(/** @type {Record<string, unknown>} */ (input));
  }
  return evaluateAdequacyAndUnknownState(/** @type {Record<string, unknown>} */ (input));
}

/**
 * @param {unknown} value
 * @returns {value is number[]}
 */
function isNumberRange(value) {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((part) => typeof part === "number" && Number.isFinite(part))
  );
}

/**
 * @param {string} name
 * @param {unknown} value
 * @param {unknown} scope
 * @returns {{ name: string, exactValue: number[], unit: string, scope: string, line: string } | null}
 */
function qualifiedRange(name, value, scope) {
  if (!isNumberRange(value) || typeof scope !== "string") return null;
  const scopeLabel = Object.prototype.hasOwnProperty.call(SCOPE_LABELS, scope)
    ? SCOPE_LABELS[/** @type {keyof typeof SCOPE_LABELS} */ (scope)]
    : null;
  if (!scopeLabel) return null;
  const line = publicLine(
    `${name}: ${value[0]}–${value[1]} kg CO2e (GWP100). ${scopeLabel}. This bracket is not an average and does not finish the comparison.`,
  );
  return {
    name,
    exactValue: [value[0], value[1]],
    unit: "kg CO2e",
    scope,
    line,
  };
}

/**
 * @param {Record<string, unknown>} decision
 */
function newClimateValues(decision) {
  const replacement = decision.replacement;
  const scoped =
    replacement && typeof replacement === "object"
      ? /** @type {Record<string, unknown>} */ (replacement).new
      : null;
  const source =
    scoped && typeof scoped === "object"
      ? /** @type {Record<string, unknown>} */ (scoped)
      : decision.new && typeof decision.new === "object"
        ? /** @type {Record<string, unknown>} */ (decision.new)
        : null;
  if (!source) return [];
  const scope =
    typeof source.provenance_scope === "string"
      ? source.provenance_scope
      : typeof source.climate_status === "string"
        ? source.climate_status
        : null;
  return [qualifiedRange("Production", source.production_CO2e_kg, scope), qualifiedRange("Distribution", source.distribution_CO2e_kg, scope)].filter(
    (entry) => entry != null,
  );
}

/**
 * @param {Record<string, unknown>} decision
 */
function repairClimateValues(decision) {
  const repair = decision.repair;
  if (!repair || typeof repair !== "object") return [];
  const record = /** @type {Record<string, unknown>} */ (repair);
  const scope =
    typeof record.climate_status === "string"
      ? record.climate_status
      : typeof record.impact_status === "string"
        ? record.impact_status
        : null;
  const value = qualifiedRange("Repair", record.climate_CO2e_kg, scope);
  return value ? [value] : [];
}

/**
 * @param {Record<string, unknown>} decision
 * @returns {string | null}
 */
function capabilityLabel(decision) {
  const capability = decision.result_capability;
  if (typeof capability !== "string") return null;
  if (!Object.prototype.hasOwnProperty.call(CAPABILITY_LABELS, capability)) return null;
  return CAPABILITY_LABELS[/** @type {keyof typeof CAPABILITY_LABELS} */ (capability)];
}

/**
 * @param {unknown} feasible
 * @returns {string}
 */
function keepFeasibilityLine(feasible) {
  if (feasible === true) return "Under the supplied facts, keep-as-is is feasible.";
  if (feasible === false) {
    return "Keep-as-is is not currently feasible under the supplied facts. That does not mean replacement is required.";
  }
  return "Under the supplied facts, whether keep-as-is is feasible is unknown.";
}

/**
 * @param {Record<string, unknown>} decision
 * @returns {string[]}
 */
function inputBoundaryLines(decision) {
  /** @type {string[]} */
  const lines = [];
  if (
    decision.historic_owned_production_included_in_prospective_keep_total === false &&
    decision.avoided_manufacture_credit_from_owned_history == null
  ) {
    lines.push(
      "Earlier manufacture of the phone you already have is left out of any forward-looking keep or repair total. That history does not offset a new phone.",
    );
  }
  if (decision.generic_EOL_CO2e_kg == null && decision.generic_recycling_credit == null) {
    lines.push("End of life and recycling are not given amounts.");
  }
  return lines;
}

/**
 * @param {Record<string, unknown>} decision
 * @returns {string[]}
 */
function secondaryBoundaryLines(decision) {
  /** @type {string[]} */
  const lines = [];
  const original = decision.original_manufacturing;
  if (original && typeof original === "object") {
    const record = /** @type {Record<string, unknown>} */ (original);
    if (record.enters_direct_acquisition_total === false) {
      lines.push(
        "Earlier manufacture sits outside this second-life total and does not offset a new phone.",
      );
    }
  }
  if (decision.market_displacement_credit == null) {
    lines.push("No market displacement amount is applied.");
  }
  return lines;
}

/**
 * @param {Record<string, unknown>} decision
 * @param {string} field
 * @returns {boolean}
 */
function hasMissingField(decision, field) {
  const missing = Array.isArray(decision.missing_required_fields)
    ? decision.missing_required_fields
    : [];
  return missing.some(
    (entry) =>
      entry === field ||
      (entry &&
        typeof entry === "object" &&
        /** @type {Record<string, unknown>} */ (entry).field === field),
  );
}

/**
 * @param {ServiceFactStatus} status
 * @param {Record<string, unknown>} decision
 * @returns {string[]}
 */
function keepRemainingLines(status, decision) {
  if (status === "not_sure") {
    return [
      "No forward-looking keep total is shown. The expected remaining service is not sure, and it was not replaced with zero or a default.",
    ];
  }
  if (
    status === "invalid" ||
    status === "rejected" ||
    (status === "accepted" && typeof decision.H_primary_years !== "number")
  ) {
    return [
      "No forward-looking keep total is shown. The remaining-service value was not accepted, and it was not replaced with another number.",
    ];
  }
  if (status === "accepted" && typeof decision.H_primary_years === "number") {
    return [
      "No forward-looking keep total is shown.",
      `Expected remaining adequate service without repair is ${decision.H_primary_years} years.`,
    ];
  }
  return [
    "No forward-looking keep total is shown. How long this phone can keep providing adequate service was not supplied.",
  ];
}

/**
 * @param {ServiceFactStatus} status
 * @param {Record<string, unknown>} decision
 * @returns {string[]}
 */
function newRemainingLines(status, decision) {
  if (status === "not_sure") {
    return ["The expected remaining service is not sure. It was not replaced with zero or a default."];
  }
  if (status === "invalid" || status === "rejected" || (status === "accepted" && typeof decision.H_primary_years !== "number")) {
    return ["The remaining-service value was not accepted. It was not replaced with zero or another number."];
  }
  if (status === "accepted" && typeof decision.H_primary_years === "number") {
    return [`Expected remaining adequate service without repair is ${decision.H_primary_years} years.`];
  }
  if (hasMissingField(decision, "remaining_service.without_repair")) {
    return [
      "How long the current phone can still provide adequate service was not supplied. It was not replaced with a default.",
    ];
  }
  return [];
}

/**
 * @typedef {{
 *   remainingStatus: ServiceFactStatus,
 *   repairCategoryId: RepairFactCategoryId | null,
 *   postRepairStatus: ServiceFactStatus,
 *   usedStatus: ServiceFactStatus,
 *   usedYears: ExplicitServiceValue,
 *   refurbishedStatus: ServiceFactStatus,
 *   refurbishedYears: ExplicitServiceValue,
 * }} CardFactContext
 */

/**
 * Restate an explicit candidate-service fact and only the coverage the
 * secondary evaluator actually returned. A missing sequence is not invented.
 *
 * @param {ServiceFactStatus} status
 * @param {Record<string, unknown>} decision
 * @param {ExplicitServiceValue} explicitYears
 * @returns {string[]}
 */
function secondaryServiceLines(status, decision, explicitYears) {
  /** @type {string[]} */
  const lines = [];
  if (status === "not_sure") {
    lines.push(
      "Expected adequate service for this candidate is not sure. It was not replaced with zero or a default.",
    );
  } else if (status === "invalid" || status === "rejected") {
    lines.push(
      "The expected service for this candidate cannot be used. It was not replaced with zero or a default.",
    );
  } else if (status === "accepted") {
    const years =
      typeof decision.covered_service_years === "number" ? decision.covered_service_years : explicitYears;
    if (typeof years === "number") {
      lines.push(`Expected adequate service for this candidate is ${years} years.`);
    }
    if (decision.service_sequence_required === true) {
      lines.push(
        "A complete service sequence is required. The next event was not supplied and was not invented.",
      );
      if (typeof decision.uncovered_service_years === "number") {
        lines.push(`Service still uncovered on the shared horizon is ${decision.uncovered_service_years} years.`);
      }
    } else if (
      decision.equivalent_service_established === true &&
      typeof decision.adequate_service_coverage_years === "number"
    ) {
      lines.push(`Equivalent service is established for ${decision.adequate_service_coverage_years} years.`);
    } else {
      lines.push("Equivalent service over the shared horizon is not established.");
    }
  } else {
    lines.push("Expected adequate service for this candidate was not supplied.");
  }
  lines.push("Expected adequate service was not copied from the shared horizon.");
  return lines;
}

/**
 * @param {ComparisonPathwayId} pathwayId
 * @param {string} label
 * @param {Record<string, unknown>} decision
 * @param {CardFactContext} facts
 */
function presentCard(pathwayId, label, decision, facts) {
  /** @type {string[]} */
  const lines = [];
  /** @type {ReturnType<typeof qualifiedRange>[]} */
  const values = [];
  const capability = typeof decision.result_capability === "string" ? decision.result_capability : null;
  const namedCapability = capabilityLabel(decision);

  if (pathwayId === "keep") {
    const keep = decision.keep_as_is;
    const feasible =
      keep && typeof keep === "object"
        ? /** @type {Record<string, unknown>} */ (keep).feasible
        : null;
    lines.push(keepFeasibilityLine(feasible));
    lines.push(...keepRemainingLines(facts.remainingStatus, decision));
    if (namedCapability) lines.push(namedCapability);
    lines.push(...inputBoundaryLines(decision));
  } else if (pathwayId === "repair") {
    const repairValues = repairClimateValues(decision);
    const factsAbsent = facts.repairCategoryId == null && facts.postRepairStatus === "absent";
    if (factsAbsent) {
      lines.push("More information is needed before repair can be compared.");
      lines.push("The kind of repair was not supplied.");
      lines.push("How long adequate service would last after a repair was not supplied.");
      lines.push("Those facts were not guessed, and no repair total is shown.");
    } else {
      if (capability === "insufficient_information" || decision.service_sequence_required === true) {
        lines.push("More information is needed before repair can be compared.");
      }
      if (facts.repairCategoryId == null) {
        lines.push("The kind of repair was not supplied.");
      } else if (facts.repairCategoryId === "not_sure") {
        lines.push("The kind of repair is not sure. No repair range was selected in its place.");
      } else if (facts.repairCategoryId === "another") {
        lines.push(
          "This kind of repair does not have a supported impact range. No other repair range was substituted.",
        );
      } else if (repairValues.length === 0) {
        lines.push("No supported repair impact is available. No generic amount is used.");
      }
      if (facts.postRepairStatus === "absent") {
        lines.push("How long adequate service would last after a repair was not supplied.");
      } else if (facts.postRepairStatus === "not_sure") {
        lines.push(
          "How long adequate service would last after a repair is not sure. It was not replaced with a default.",
        );
      } else if (facts.postRepairStatus === "invalid") {
        lines.push(
          "The expected service after repair cannot be used. It was not replaced with zero or a default.",
        );
      }
      if (
        decision.service_sequence_required === true &&
        hasMissingField(decision, "foreseeable_next_event")
      ) {
        lines.push(
          "A complete service sequence is required. The next event was not supplied and was not invented.",
        );
      }
    }
    values.push(...repairValues);
    for (const value of repairValues) lines.push(value.line);
    if (namedCapability && capability !== "insufficient_information") lines.push(namedCapability);
    lines.push(...inputBoundaryLines(decision));
  } else if (pathwayId === "new") {
    if (facts.remainingStatus !== "accepted" || capability === "insufficient_information") {
      lines.push("More information is needed before a new phone can be compared.");
    }
    lines.push(...newRemainingLines(facts.remainingStatus, decision));
    lines.push("No specific new-phone model was supplied.");
    if (namedCapability) lines.push(namedCapability);
    const climate = newClimateValues(decision);
    values.push(...climate);
    for (const value of climate) lines.push(value.line);
    lines.push(...inputBoundaryLines(decision));
  } else if (pathwayId === "used_secondhand") {
    lines.push("This is a used or second-hand phone. It is not treated as a refurbished phone.");
    if (namedCapability) lines.push(namedCapability);
    lines.push(...secondaryServiceLines(facts.usedStatus, decision, facts.usedYears));
    lines.push("Shipping and preparation were not supplied. They were not given an amount.");
    lines.push("No refurbishment process is established.");
    lines.push(...secondaryBoundaryLines(decision));
  } else {
    lines.push(
      "This is a refurbished phone. It is not the same pathway as a used or second-hand phone.",
    );
    if (namedCapability) lines.push(namedCapability);
    const direct = decision.refurb_direct_CO2e;
    const directRecord =
      direct && typeof direct === "object" ? /** @type {Record<string, unknown>} */ (direct) : null;
    if (
      directRecord &&
      typeof directRecord.value === "number" &&
      typeof directRecord.unit === "string" &&
      typeof directRecord.status === "string" &&
      Object.prototype.hasOwnProperty.call(SCOPE_LABELS, directRecord.status)
    ) {
      const scopeLabel =
        SCOPE_LABELS[/** @type {keyof typeof SCOPE_LABELS} */ (directRecord.status)];
      const line = publicLine(
        `Refurbishment: ${directRecord.value} ${directRecord.unit}. ${scopeLabel}. This is a source-specific result, not a generic refurbished default, and it does not finish the comparison.`,
      );
      values.push({
        name: "Refurbishment",
        exactValue: [directRecord.value],
        unit: directRecord.unit,
        scope: directRecord.status,
        line,
      });
      lines.push(line);
    } else if (directRecord && directRecord.value == null) {
      lines.push(
        "The direct burden of refurbishment is unknown. No generic refurbished footprint is used.",
      );
    }
    lines.push(
      "No refurbishment process is established. A seller label was not supplied and would not by itself prove refurbishment.",
    );
    lines.push(...secondaryServiceLines(facts.refurbishedStatus, decision, facts.refurbishedYears));
    lines.push(...secondaryBoundaryLines(decision));
  }

  return {
    id: pathwayId,
    label,
    publicLines: lines.map(publicLine),
    values,
    capability,
    missingFields: Array.isArray(decision.missing_required_fields)
      ? decision.missing_required_fields
      : [],
    rankingPermitted: decision.definitive_comparative_ranking_permitted === true,
    unifiedHarmScore:
      "unified_harm_score" in decision ? decision.unified_harm_score : null,
    avoidedManufactureCredit:
      "avoided_manufacture_credit_from_owned_history" in decision
        ? decision.avoided_manufacture_credit_from_owned_history
        : null,
    marketDisplacementCredit:
      "market_displacement_credit" in decision ? decision.market_displacement_credit : null,
    secondaryPathway:
      typeof decision.secondary_pathway === "string" ? decision.secondary_pathway : null,
    decision,
  };
}

/**
 * @param {ComparisonState} state
 * @param {{
 *   inquiryReviewComplete?: boolean,
 *   situationAnswers?: Parameters<typeof buildAdequacyInput>[0] | null,
 * }} [context]
 */
export function describeComparison(state, context = {}) {
  const inquiryReady = context.inquiryReviewComplete === true;
  const answers = context.situationAnswers ?? null;
  const answersReady = answers != null && isCompleteExplicit(answers);
  const available = inquiryReady && answersReady;
  const horizonYears = parseExplicitHorizon(state.horizonRaw);
  const selected = COMPARISON_PATHWAYS.filter((pathway) => state.selectedIds.includes(pathway.id));
  const canEvaluate = available && horizonYears != null && selected.length > 0;
  /** @type {ComparisonFactInput} */
  const factPayload = {
    remainingService: explicitServiceValue(state.remainingServiceRaw, state.remainingServiceNotSure),
    repairCategoryId: state.repairCategoryId,
    postRepairService: explicitServiceValue(state.postRepairServiceRaw, state.postRepairServiceNotSure),
    usedService: explicitServiceValue(state.usedServiceRaw, state.usedServiceNotSure),
    refurbishedService: explicitServiceValue(state.refurbishedServiceRaw, state.refurbishedServiceNotSure),
  };

  /** @type {ReturnType<typeof buildPathwayEvaluatorInput>[]} */
  const evaluatorInputs = [];
  /** @type {ReturnType<typeof presentCard>[]} */
  const cards = [];

  if (canEvaluate && answers) {
    for (const pathway of selected) {
      const input = buildPathwayEvaluatorInput(pathway.id, answers, horizonYears, factPayload);
      const decision = /** @type {Record<string, unknown>} */ (evaluatePathway(pathway.id, input));
      evaluatorInputs.push(input);
      cards.push(
        presentCard(pathway.id, pathway.label, decision, {
          remainingStatus: remainingPresentationStatus(state, decision),
          repairCategoryId: state.repairCategoryId,
          postRepairStatus: textServiceStatus(state.postRepairServiceRaw, state.postRepairServiceNotSure),
          usedStatus: textServiceStatus(state.usedServiceRaw, state.usedServiceNotSure),
          usedYears: explicitServiceValue(state.usedServiceRaw, state.usedServiceNotSure),
          refurbishedStatus: textServiceStatus(state.refurbishedServiceRaw, state.refurbishedServiceNotSure),
          refurbishedYears: explicitServiceValue(state.refurbishedServiceRaw, state.refurbishedServiceNotSure),
        }),
      );
    }
  }

  let pendingNote = null;
  if (!available) {
    pendingNote = "Empirical comparison opens only after the inquiry review is complete.";
  } else if (state.horizonRaw.trim() === "") {
    pendingNote = COMPARISON_HORIZON_MISSING;
  } else if (horizonYears == null) {
    pendingNote = COMPARISON_HORIZON_INVALID;
  } else if (selected.length === 0) {
    pendingNote = COMPARISON_NEED_PATHWAY;
  }

  const horizonStatement =
    canEvaluate && horizonYears != null
      ? publicLine(
          `The same horizon is used for every selected pathway: ${state.horizonRaw}.`,
        )
      : null;

  return {
    available,
    opening: COMPARISON_OPENING,
    boundary: COMPARISON_BOUNDARY,
    selectionNote: COMPARISON_SELECTION_NOTE,
    orderNote: COMPARISON_ORDER_NOTE,
    horizonHelper: COMPARISON_HORIZON_HELPER,
    laterNote: COMPARISON_LATER_NOTE,
    pendingNote,
    horizonStatement,
    horizonRaw: state.horizonRaw,
    horizonYears,
    evaluated: canEvaluate,
    remainingServiceField: {
      visible: state.selectedIds.includes("keep") || state.selectedIds.includes("new"),
      label: publicLine(REMAINING_SERVICE_LABEL),
      helper: publicLine(REMAINING_SERVICE_HELPER),
      notSureLabel: publicLine(FACT_NOT_SURE_LABEL),
      notSureControl: publicLine("Not sure about remaining service without repair"),
      notSureNote: state.remainingServiceNotSure === true ? publicLine(FACT_NOT_SURE_NOTE) : null,
      raw: state.remainingServiceRaw,
      notSure: state.remainingServiceNotSure === true,
      parsedYears: explicitServiceValue(state.remainingServiceRaw, state.remainingServiceNotSure),
    },
    repairField: {
      visible: state.selectedIds.includes("repair"),
      legend: publicLine(REPAIR_CATEGORY_LEGEND),
      helper: publicLine(REPAIR_CATEGORY_HELPER),
      categories: REPAIR_FACT_CATEGORIES.map((category) => ({
        id: category.id,
        label: publicLine(category.label),
        selected: state.repairCategoryId === category.id,
      })),
      serviceLabel: publicLine(POST_REPAIR_SERVICE_LABEL),
      serviceHelper: publicLine(POST_REPAIR_SERVICE_HELPER),
      notSureLabel: publicLine(FACT_NOT_SURE_LABEL),
      notSureControl: publicLine("Not sure about service after repair"),
      notSureNote: state.postRepairServiceNotSure === true ? publicLine(FACT_NOT_SURE_NOTE) : null,
      serviceRaw: state.postRepairServiceRaw,
      serviceNotSure: state.postRepairServiceNotSure === true,
      parsedServiceYears: explicitServiceValue(state.postRepairServiceRaw, state.postRepairServiceNotSure),
    },
    usedServiceField: {
      visible: state.selectedIds.includes("used_secondhand"),
      label: publicLine(USED_SERVICE_LABEL),
      helper: publicLine(USED_SERVICE_HELPER),
      notSureLabel: publicLine(FACT_NOT_SURE_LABEL),
      notSureControl: publicLine("Not sure about service for the used or second-hand candidate"),
      notSureNote: state.usedServiceNotSure === true ? publicLine(FACT_NOT_SURE_NOTE) : null,
      raw: state.usedServiceRaw,
      notSure: state.usedServiceNotSure === true,
      parsedYears: explicitServiceValue(state.usedServiceRaw, state.usedServiceNotSure),
    },
    refurbishedServiceField: {
      visible: state.selectedIds.includes("refurbished"),
      label: publicLine(REFURBISHED_SERVICE_LABEL),
      helper: publicLine(REFURBISHED_SERVICE_HELPER),
      notSureLabel: publicLine(FACT_NOT_SURE_LABEL),
      notSureControl: publicLine("Not sure about service for the refurbished candidate"),
      notSureNote: state.refurbishedServiceNotSure === true ? publicLine(FACT_NOT_SURE_NOTE) : null,
      raw: state.refurbishedServiceRaw,
      notSure: state.refurbishedServiceNotSure === true,
      parsedYears: explicitServiceValue(state.refurbishedServiceRaw, state.refurbishedServiceNotSure),
    },
    pathways: COMPARISON_PATHWAYS.map((pathway) => ({
      id: pathway.id,
      label: pathway.label,
      selected: state.selectedIds.includes(pathway.id),
    })),
    stages: SMARTPHONE_JOURNEY_STAGES.map((stage) => {
      if (stage.id === "situation") {
        return {
          id: stage.id,
          label: stage.label,
          availability: "recorded",
          note: "Situation recorded.",
        };
      }
      if (stage.id === "inquiry") {
        return {
          id: stage.id,
          label: stage.label,
          availability: "recorded",
          note: "Inquiry recorded.",
        };
      }
      if (stage.id === "empirical-comparison") {
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
        availability: "pending",
        note: "Pending. Not part of this step.",
      };
    }),
    cards,
    evaluatorInputs,
    rankingPermitted: cards.some((card) => card.rankingPermitted),
  };
}
