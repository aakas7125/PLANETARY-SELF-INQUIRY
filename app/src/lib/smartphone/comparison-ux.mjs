import { evaluateAdequacyAndUnknownState } from "./input-decision.mjs";
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
  "Choose the pathways you want to inspect, and one shared horizon in years.";

export const COMPARISON_BOUNDARY =
  "This comparison does not tell you what to buy, and it does not rank the pathways.";

export const COMPARISON_SELECTION_NOTE =
  "No pathway is preselected. Choosing one does not mean it is adequate, available, preferable, or supported by complete evidence. A choice from the inquiry does not select these pathways.";

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
  pathwayLegend: "Pathways to inspect",
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
 * @typedef {{
 *   selectedIds: ComparisonPathwayId[],
 *   horizonRaw: string,
 * }} ComparisonState
 */

/**
 * @typedef {{ type: "toggle", pathwayId: string }
 *   | { type: "set_horizon", text: string }
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

/** @returns {ComparisonState} */
export function createComparisonState() {
  return {
    selectedIds: [],
    horizonRaw: "",
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
      return { selectedIds: selected, horizonRaw: state.horizonRaw };
    }
    case "set_horizon": {
      if (typeof action.text !== "string") return state;
      return { selectedIds: [...state.selectedIds], horizonRaw: action.text };
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
 * @param {ComparisonPathwayId} pathwayId
 * @param {Parameters<typeof buildAdequacyInput>[0]} answers
 * @param {number} horizonYears
 */
export function buildPathwayEvaluatorInput(pathwayId, answers, horizonYears) {
  if (pathwayId === "used_secondhand" || pathwayId === "refurbished") {
    return {
      comparison: { common_service_horizon_years: horizonYears },
      replacement: { pathway_user_selection: pathwayId },
    };
  }

  const base = {
    ...buildAdequacyInput(answers),
    common_service_horizon_years: horizonYears,
  };
  if (pathwayId === "new") {
    return {
      ...base,
      "replacement.type": "new",
    };
  }
  return base;
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
 * @param {ComparisonPathwayId} pathwayId
 * @param {string} label
 * @param {Record<string, unknown>} decision
 */
function presentCard(pathwayId, label, decision) {
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
    lines.push(
      "No forward-looking keep total is shown. How long this phone can keep providing adequate service was not supplied.",
    );
    if (namedCapability) lines.push(namedCapability);
    lines.push(...inputBoundaryLines(decision));
  } else if (pathwayId === "repair") {
    lines.push("More information is needed before repair can be compared.");
    lines.push("The kind of repair was not supplied.");
    lines.push("How long adequate service would last after a repair was not supplied.");
    lines.push("Those facts were not guessed, and no repair total is shown.");
    const repairValues = repairClimateValues(decision);
    values.push(...repairValues);
    for (const value of repairValues) lines.push(value.line);
    if (namedCapability && capability !== "insufficient_information") lines.push(namedCapability);
    lines.push(...inputBoundaryLines(decision));
  } else if (pathwayId === "new") {
    lines.push("More information is needed before a new phone can be compared.");
    const missing = Array.isArray(decision.missing_required_fields)
      ? decision.missing_required_fields
      : [];
    const missingRemaining = missing.some((entry) =>
      entry === "remaining_service.without_repair" ||
      (entry &&
        typeof entry === "object" &&
        /** @type {Record<string, unknown>} */ (entry).field === "remaining_service.without_repair"),
    );
    if (missingRemaining) {
      lines.push(
        "How long the current phone can still provide adequate service was not supplied. It was not replaced with a default.",
      );
    }
    lines.push("No specific new-phone model was supplied.");
    if (namedCapability) lines.push(namedCapability);
    const climate = newClimateValues(decision);
    values.push(...climate);
    for (const value of climate) lines.push(value.line);
    lines.push(...inputBoundaryLines(decision));
  } else if (pathwayId === "used_secondhand") {
    lines.push("This is a used or second-hand phone. It is not treated as a refurbished phone.");
    if (namedCapability) lines.push(namedCapability);
    lines.push(
      "Expected adequate service, shipping, and preparation were not supplied. They were not given an amount.",
    );
    lines.push("No refurbishment process is established.");
    lines.push(
      "Expected adequate service was not copied from the shared horizon.",
    );
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
    lines.push("Expected adequate service was not supplied and was not copied from the shared horizon.");
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

  /** @type {ReturnType<typeof buildPathwayEvaluatorInput>[]} */
  const evaluatorInputs = [];
  /** @type {ReturnType<typeof presentCard>[]} */
  const cards = [];

  if (canEvaluate && answers) {
    for (const pathway of selected) {
      const input = buildPathwayEvaluatorInput(pathway.id, answers, horizonYears);
      evaluatorInputs.push(input);
      cards.push(
        presentCard(
          pathway.id,
          pathway.label,
          /** @type {Record<string, unknown>} */ (evaluatePathway(pathway.id, input)),
        ),
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
