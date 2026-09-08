export const UNKNOWN = "unknown";

const GENERIC_NEW_PRODUCTION_CO2E_KG = Object.freeze([25, 70]);
const GENERIC_NEW_DISTRIBUTION_CO2E_KG = Object.freeze([2, 4]);
const BATTERY_REPAIR_CO2E_KG = Object.freeze([0.3, 0.7]);
const DISPLAY_REPAIR_CO2E_KG = Object.freeze([3, 8]);
const FAIRPHONE_5_FULL_MODULE_DIY_MAJOR_BOARD_CO2E_KG = 17.84;

/** @typedef {true | false | "unknown"} TriState */
/** @typedef {"adequate" | "inadequate" | "unknown"} AdequacyStatus */
/** @typedef {Record<string, unknown>} SmartphoneInput */
/** @typedef {Record<string, unknown>} DecisionResult */

/** @param {unknown} value @returns {TriState} */
function triState(value) {
  return value === true || value === false || value === UNKNOWN ? value : UNKNOWN;
}

/** @param {unknown} value @returns {boolean} */
function isUnknown(value) {
  return value === null || value === undefined || value === UNKNOWN;
}

/** @param {unknown} value @returns {number | "unknown" | null} */
function primaryHorizon(value) {
  return typeof value === "number" ? value : value === UNKNOWN ? UNKNOWN : null;
}

/**
 * @param {{ safeToUse: TriState, requiredFunctionsMet: TriState, supportAdequacy: TriState }} values
 * @returns {AdequacyStatus}
 */
function deriveAdequacy({ safeToUse, requiredFunctionsMet, supportAdequacy }) {
  if (safeToUse === false || requiredFunctionsMet === false || supportAdequacy === false) {
    return "inadequate";
  }
  if (
    safeToUse === UNKNOWN ||
    requiredFunctionsMet === UNKNOWN ||
    supportAdequacy === UNKNOWN
  ) {
    return UNKNOWN;
  }
  return "adequate";
}

/** @param {SmartphoneInput} input @returns {boolean} */
function isFairphone5FullModuleDiyMajorBoard(input) {
  return (
    input["current_device.manufacturer"] === "Fairphone" &&
    input["current_device.model"] === "Fairphone 5" &&
    input["repair.repair_mode"] === "full_module_DIY" &&
    input["repair.type"] === "major_board"
  );
}

/** @param {DecisionResult} result @param {string} field */
function appendMissingField(result, field) {
  const existing = Array.isArray(result.missing_required_fields)
    ? result.missing_required_fields
    : [];
  if (!existing.includes(field)) {
    result.missing_required_fields = [...existing, field];
  }
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyRepairImpact(result, input) {
  const repairType = input["repair.type"];
  const postRepairYears = input["repair.expected_adequate_service_after_repair.expected_years"];
  const postRepairKnown = typeof postRepairYears === "number";

  if (repairType === "battery" || repairType === "display") {
    result.repair = {
      climate_CO2e_kg: [
        ...(repairType === "battery" ? BATTERY_REPAIR_CO2E_KG : DISPLAY_REPAIR_CO2E_KG),
      ],
      climate_status: "PROVISIONAL_GENERIC_RANGE",
    };
    if (postRepairKnown) {
      result.result_capability = "range_quantitative";
    } else {
      appendMissingField(result, "repair.expected_adequate_service_after_repair");
      result.result_capability = "insufficient_information";
    }
    return;
  }

  if (repairType !== "major_board") {
    return;
  }

  if (isFairphone5FullModuleDiyMajorBoard(input)) {
    result.repair = {
      climate_CO2e_kg: FAIRPHONE_5_FULL_MODULE_DIY_MAJOR_BOARD_CO2E_KG,
      impact_status: "approved",
      provenance_scope: "model_specific",
    };
    return;
  }

  result.repair = {
    climate_CO2e_kg: null,
    impact_status: "unsupported",
  };
  result.result_capability = "insufficient_information";
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyServiceSequence(result, input) {
  const repairServiceYears = input["repair.expected_adequate_service_after_repair.expected_years"];
  const commonHorizonYears = input["common_service_horizon_years"];
  if (typeof repairServiceYears !== "number" || typeof commonHorizonYears !== "number") {
    return;
  }
  if (repairServiceYears >= commonHorizonYears) {
    return;
  }

  result.service_sequence_required = true;
  const nextEvent = input["foreseeable_next_event"];
  const nextEventTime = input["foreseeable_next_event_time_years"];
  if (isUnknown(nextEvent) || typeof nextEvent !== "string") {
    appendMissingField(result, "foreseeable_next_event");
    result.result_capability = "insufficient_information";
    return;
  }
  if (typeof nextEventTime !== "number") {
    appendMissingField(result, "foreseeable_next_event");
    result.result_capability = "insufficient_information";
    return;
  }

  result.service_sequence = {
    events: [
      { event_type: "repair", time_years: 0 },
      { event_type: nextEvent, time_years: nextEventTime },
    ],
  };
  result.service_sequence_covers_years = commonHorizonYears;
  result.result_status = "calculable_or_conditional_after_sequence";
  delete result.result_capability;
}

/**
 * Evaluates the T01–T14 adequacy, unknown-state, repair-impact, and
 * service-sequence contract slice. Input keys intentionally match the
 * immutable source package's field names; no UI model, replacement
 * recommendation, or later-case semantics are introduced here.
 *
 * @param {SmartphoneInput} input
 * @returns {DecisionResult}
 */
export function evaluateAdequacyAndUnknownState(input) {
  const safeToUse = triState(input["adequacy.safe_to_use"]);
  const requiredFunctionsMet = triState(input["adequacy.required_functions_met"]);
  const supportAdequacy = triState(input["security_support.adequate_for_required_use"]);
  const adequacyStatus = deriveAdequacy({
    safeToUse,
    requiredFunctionsMet,
    supportAdequacy,
  });
  const horizonInput = input["remaining_service.without_repair.expected_years"];
  const horizon = primaryHorizon(horizonInput);
  const replacementType = input["replacement.type"];

  /** @type {DecisionResult} */
  const result = {
    H_primary_years: horizon,
    derived: {
      adequacy_gate: {
        adequacy_status: adequacyStatus,
        feasible_keep_as_is:
          adequacyStatus === "adequate"
            ? true
            : adequacyStatus === "inadequate"
              ? false
              : UNKNOWN,
      },
    },
    keep_as_is: {
      feasible:
        adequacyStatus === "adequate"
          ? true
          : adequacyStatus === "inadequate"
            ? false
            : UNKNOWN,
      provides_equivalent_service:
        adequacyStatus === "adequate"
          ? true
          : adequacyStatus === "inadequate"
            ? false
            : UNKNOWN,
    },
    replacement_forced_by_support_status: false,
  };

  if (replacementType === "new" && isUnknown(horizonInput)) {
    appendMissingField(result, "remaining_service.without_repair");
  }

  if (replacementType === "new" && adequacyStatus === "adequate" && typeof horizon === "number") {
    result.new = {
      production_CO2e_kg: [...GENERIC_NEW_PRODUCTION_CO2E_KG],
      distribution_CO2e_kg: [...GENERIC_NEW_DISTRIBUTION_CO2E_KG],
    };
    result.result_capability = "range_quantitative";
  } else if (adequacyStatus === UNKNOWN || (replacementType === "new" && isUnknown(horizonInput))) {
    result.result_capability = "insufficient_information";
  }

  applyRepairImpact(result, input);
  applyServiceSequence(result, input);

  return result;
}
