export const UNKNOWN = "unknown";

const GENERIC_NEW_PRODUCTION_CO2E_KG = Object.freeze([25, 70]);
const GENERIC_NEW_DISTRIBUTION_CO2E_KG = Object.freeze([2, 4]);

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

/**
 * Evaluates only the T01–T07 adequacy and unknown-state contract slice.
 * Input keys intentionally match the immutable source package's field names;
 * no UI model or replacement recommendation is introduced here.
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
    result.missing_required_fields = ["remaining_service.without_repair"];
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

  return result;
}
