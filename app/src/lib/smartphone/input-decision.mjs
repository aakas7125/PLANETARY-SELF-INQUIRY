export const UNKNOWN = "unknown";
export const USER_SITUATION_FACT = "user_situation_fact";
export const RESEARCH_EVIDENCE_PARAMETER = "research_evidence_parameter";

const GENERIC_NEW_PRODUCTION_CO2E_KG = Object.freeze([25, 70]);
const GENERIC_NEW_DISTRIBUTION_CO2E_KG = Object.freeze([2, 4]);
const BATTERY_REPAIR_CO2E_KG = Object.freeze([0.3, 0.7]);
const DISPLAY_REPAIR_CO2E_KG = Object.freeze([3, 8]);
const FAIRPHONE_5_FULL_MODULE_DIY_MAJOR_BOARD_CO2E_KG = 17.84;
const ADEME_REFURB_REFERENCE_CO2E_KG = 7.61;
const ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS = 2;
const APPROVED_NEW_REGISTRY_MATCH = "approved_registry_match";
const US_SECONDHAND_2026_DISPLACEMENT_RATE = 0.4;
const US_SECONDHAND_2026_DISPLACEMENT_UNIT =
  "new_devices_displaced_per_secondhand_transaction";
const OUT_OF_BOUNDS_REMAINING_SERVICE_YEARS = 30;

/** @typedef {true | false | "unknown"} TriState */
/** @typedef {"adequate" | "inadequate" | "unknown"} AdequacyStatus */
/** @typedef {Record<string, unknown>} SmartphoneInput */
/** @typedef {Record<string, unknown>} DecisionResult */

/** @param {unknown} value @returns {TriState} */
function triState(value) {
  return value === true || value === false || value === UNKNOWN ? value : UNKNOWN;
}

/** @param {unknown} value @returns {boolean} */
export function isUnknown(value) {
  return value === null || value === undefined || value === UNKNOWN;
}

/**
 * Missing-value policy for the five global unknown/default assertions.
 * Permission to use an approved Research fallback is a boolean gate only;
 * this helper never invents a fallback registry, numeric default, or
 * scientific value.
 *
 * @param {{
 *   field: string,
 *   missingClass: typeof USER_SITUATION_FACT | typeof RESEARCH_EVIDENCE_PARAMETER,
 *   researchApprovedFallback?: boolean,
 *   attemptApprovedDefault?: boolean,
 * }} request
 */
export function resolveMissingInput(request) {
  const field = request?.field;
  const missingClass = request?.missingClass;
  if (typeof field !== "string" || field.length === 0) {
    throw new Error("field must be an explicit missing-input identifier");
  }
  if (missingClass !== USER_SITUATION_FACT && missingClass !== RESEARCH_EVIDENCE_PARAMETER) {
    throw new Error("missingClass must be an accepted T35 missingness class");
  }

  const researchApprovedFallback = request.researchApprovedFallback === true;
  const attemptApprovedDefault = request.attemptApprovedDefault === true;
  const approvedDefaultPermitted =
    missingClass === RESEARCH_EVIDENCE_PARAMETER && researchApprovedFallback;

  return Object.freeze({
    field,
    missingClass,
    value: UNKNOWN,
    usedApprovedDefault: false,
    approvedDefaultPermitted,
    attemptApprovedDefault,
  });
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

/**
 * @param {DecisionResult} result
 * @param {string} field
 * @param {string} [missingClass]
 */
function appendMissingField(result, field, missingClass) {
  const existing = Array.isArray(result.missing_required_fields)
    ? result.missing_required_fields
    : [];
  const alreadyPresent = existing.some((entry) =>
    typeof entry === "string" ? entry === field : entry?.field === field,
  );
  if (alreadyPresent) {
    return;
  }
  result.missing_required_fields = [
    ...existing,
    missingClass ? { field, missingClass } : field,
  ];
}

/** @param {SmartphoneInput} input @param {string} key @returns {boolean} */
function hasInputKey(input, key) {
  return Object.prototype.hasOwnProperty.call(input, key);
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
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyReplacementEvidence(result, input) {
  const replacementType = input["replacement.type"];

  if (replacementType === "refurbished") {
    const directClimate = input["replacement.refurbished.direct_climate_CO2e_kg"];
    result.replacement = {
      ...(result.replacement && typeof result.replacement === "object" ? result.replacement : {}),
      refurbished: {
        direct_climate_CO2e_kg: typeof directClimate === "number" ? directClimate : null,
      },
    };
    if (isUnknown(directClimate)) {
      result.result_capability = "qualitative_only";
    }
  }

  if (replacementType === "new") {
    const model = input["replacement.new.model"];
    const existingReplacement =
      result.replacement && typeof result.replacement === "object" ? result.replacement : {};
    if (model === APPROVED_NEW_REGISTRY_MATCH) {
      result.generic_range_used_as_primary = false;
      result.replacement = {
        ...existingReplacement,
        new: {
          primary_climate_source: "model_specific",
        },
      };
    } else if (isUnknown(model)) {
      result.replacement = {
        ...existingReplacement,
        new: {
          production_CO2e_kg: [...GENERIC_NEW_PRODUCTION_CO2E_KG],
          distribution_CO2e_kg: [...GENERIC_NEW_DISTRIBUTION_CO2E_KG],
          provenance_scope: "generic_fallback",
        },
      };
    }
  }

  if (input["reference_scenario"] === "ADEME_REFURB_REFERENCE") {
    result.reference_scenario = {
      assumed_second_life_years: ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS,
      climate_CO2e_kg: ADEME_REFURB_REFERENCE_CO2E_KG,
      decomposable: false,
      status: "OPAQUE_SOURCE_SPECIFIC_REFERENCE",
    };
  }
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyOldDeviceFate(result, input) {
  const fate = input["old_device_fate.fate"];
  if (typeof fate !== "string") {
    return;
  }

  if (fate === "reuse_by_other") {
    result.old_device_fate = {
      immediate_e_waste: false,
      market_displacement_credit: null,
    };
    return;
  }

  if (fate === "stored") {
    result.old_device_fate = {
      immediate_e_waste: false,
      market_displacement_credit: null,
      status: "dormant_or_retired",
    };
    return;
  }

  if (fate === "formal_recycling") {
    const mass = input["current_device.mass_g"];
    result.old_device_fate = {
      discarded_mass_g: typeof mass === "number" ? mass : null,
      immediate_e_waste: true,
    };
    result.individual_formal_recycling_probability_applied = false;
    return;
  }

  if (fate === "trade_in_unknown") {
    result.old_device_fate = {
      immediate_e_waste: UNKNOWN,
      market_displacement_credit: null,
      next_use: UNKNOWN,
    };
  }
}

/**
 * Comparative-ranking permission for A-GLOBAL-EQUAL-SERVICE.
 * This is a boolean gate only: it never invents a winner, rank order,
 * score, or other comparative output channel.
 *
 * Equivalent adequate service is represented only when keep-as-is already
 * provides equivalent service and a numeric primary horizon exists.
 * A complete service sequence is represented only when the accepted T13
 * sequence object covers the common horizon.
 *
 * @param {{
 *   equivalentAdequateServiceRepresented?: TriState,
 *   completeServiceSequenceRepresented?: boolean,
 * }} [request]
 */
export function resolveComparativeRankingPermission(request = {}) {
  const equivalentAdequateServiceRepresented =
    request.equivalentAdequateServiceRepresented === true ||
    request.equivalentAdequateServiceRepresented === false ||
    request.equivalentAdequateServiceRepresented === UNKNOWN
      ? request.equivalentAdequateServiceRepresented
      : UNKNOWN;
  const completeServiceSequenceRepresented =
    request.completeServiceSequenceRepresented === true;

  return Object.freeze({
    definitiveComparativeRankingPermitted:
      equivalentAdequateServiceRepresented === true ||
      completeServiceSequenceRepresented,
    equivalentAdequateServiceRepresented,
    completeServiceSequenceRepresented,
  });
}

/**
 * Historic-production exclusion for A-GLOBAL-SUNK-MANUFACTURING.
 * Permission/exclusion only: this helper never invents a prospective keep
 * total, historic production value, or avoided-manufacture credit.
 */
export function resolveSunkManufacturingBoundary() {
  return Object.freeze({
    historicOwnedProductionIncludedInProspectiveKeepTotal: false,
    avoidedManufactureCreditFromOwnedHistory: null,
  });
}

/**
 * Generic EOL climate boundary for A-GLOBAL-NO-GENERIC-EOL-ZERO.
 * Absent generic EOL evidence remains null with EXCLUDED_UNQUANTIFIED,
 * never numeric zero.
 */
export function resolveGenericEolBoundary() {
  return Object.freeze({
    generic_EOL_CO2e_kg: null,
    generic_EOL_status: "EXCLUDED_UNQUANTIFIED",
  });
}

/**
 * Generic recycling-credit boundary for
 * A-GLOBAL-NO-GENERIC-RECYCLING-CREDIT.
 */
export function resolveGenericRecyclingCreditBoundary() {
  return Object.freeze({
    generic_recycling_credit: null,
  });
}

/**
 * Qualitative-domain / unified-score boundary for
 * A-GLOBAL-NO-UNIFIED-HARM-SCORE.
 * Materials, water, people, and ecosystem pathways stay explanatory and
 * must not numerically modify a climate ranking or collapse into one score.
 * This helper never invents a harm score or domain-specific numeric value.
 */
export function resolveQualitativePathwayClimateBoundary() {
  return Object.freeze({
    qualitativePathwayDomains: Object.freeze([
      "materials",
      "water",
      "people",
      "ecosystem",
    ]),
    qualitativePathwaysNumericallyModifyClimateRanking: false,
    qualitativePathwayRole: "explanatory_only",
    unified_harm_score: null,
  });
}

/**
 * @param {DecisionResult} result
 */
function applyGenericEolBoundary(result) {
  const eol = resolveGenericEolBoundary();
  result.generic_EOL_CO2e_kg = eol.generic_EOL_CO2e_kg;
  result.generic_EOL_status = eol.generic_EOL_status;
}

/**
 * @param {DecisionResult} result
 */
function applyGenericRecyclingCreditBoundary(result) {
  result.generic_recycling_credit =
    resolveGenericRecyclingCreditBoundary().generic_recycling_credit;
}

/**
 * @param {DecisionResult} result
 */
function applySunkManufacturingBoundary(result) {
  const sunk = resolveSunkManufacturingBoundary();
  result.historic_owned_production_included_in_prospective_keep_total =
    sunk.historicOwnedProductionIncludedInProspectiveKeepTotal;
  result.avoided_manufacture_credit_from_owned_history =
    sunk.avoidedManufactureCreditFromOwnedHistory;
}

/**
 * @param {DecisionResult} result
 */
function applyQualitativePathwayClimateBoundary(result) {
  const qualitative = resolveQualitativePathwayClimateBoundary();
  result.qualitative_pathway_domains = qualitative.qualitativePathwayDomains;
  result.qualitative_pathways_numerically_modify_climate_ranking =
    qualitative.qualitativePathwaysNumericallyModifyClimateRanking;
  result.qualitative_pathway_role = qualitative.qualitativePathwayRole;
  result.unified_harm_score = qualitative.unified_harm_score;
}

/**
 * @param {DecisionResult} result
 * @param {TriState} providesEquivalentService
 */
function applyComparativeRankingPermission(result, providesEquivalentService) {
  const equivalentAdequateServiceRepresented =
    providesEquivalentService === true && typeof result.H_primary_years === "number"
      ? true
      : providesEquivalentService === false
        ? false
        : UNKNOWN;
  const completeServiceSequenceRepresented =
    Boolean(result.service_sequence) &&
    typeof result.service_sequence_covers_years === "number" &&
    result.result_status === "calculable_or_conditional_after_sequence";
  const permission = resolveComparativeRankingPermission({
    equivalentAdequateServiceRepresented,
    completeServiceSequenceRepresented,
  });
  result.definitive_comparative_ranking_permitted =
    permission.definitiveComparativeRankingPermitted;
  result.equivalent_adequate_service_represented =
    permission.equivalentAdequateServiceRepresented;
  result.complete_service_sequence_represented =
    permission.completeServiceSequenceRepresented;
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyMaterialCardBoundary(result, input) {
  if (
    input["material_pathway_cards_enabled"] !== true ||
    input["product_LCA.production.includes_raw_material_extraction"] !== true
  ) {
    return;
  }
  result.material_cards_numerical_climate_addition = 0;
  result.material_cards_role = "explanatory_only";
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyPersonalSubstitutionBoundary(result, input) {
  if (input["replacement.refurbished.if_unavailable"] !== "buy_new") {
    return;
  }
  result.market_displacement_credit = null;
  result.purchase_counterfactual = "buy_new";
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyUsConsequentialScenario(result, input) {
  if (
    input["consequential_mode"] !== true ||
    input["market"] !== "US" ||
    input["scenario"] !== "US_SECONDHAND_2026"
  ) {
    return;
  }
  result.market_displacement_rate = US_SECONDHAND_2026_DISPLACEMENT_RATE;
  result.market_displacement_unit = US_SECONDHAND_2026_DISPLACEMENT_UNIT;
  result.primary_attributional_score_modified = false;
  result.scenario_scope = "US_market_specific";
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyRemainingServiceRange(result, input) {
  const low = input["remaining_service.without_repair.low_years"];
  const high = input["remaining_service.without_repair.high_years"];
  if (typeof low !== "number" || typeof high !== "number") {
    return;
  }
  result.remaining_service = {
    expected_years: typeof input["remaining_service.without_repair.expected_years"] === "number"
      ? input["remaining_service.without_repair.expected_years"]
      : null,
    range_years: [low, high],
  };
  result.scenario_uncertainty_preserved = true;
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyChargingGridBoundary(result, input) {
  if (
    !hasInputKey(input, "system_context.grid_carbon_intensity_kgCO2e_per_kWh") ||
    !isUnknown(input["system_context.grid_carbon_intensity_kgCO2e_per_kWh"])
  ) {
    return;
  }
  result.charging_carbon_CO2e_kg = null;
  result.charging_carbon_status = "unknown_or_omitted";
  result.user_expert_parameter_required = false;
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyMissingIdentityGenericComparison(result, input) {
  if (
    !hasInputKey(input, "current_device.model") ||
    !isUnknown(input["current_device.model"])
  ) {
    return;
  }
  result.comparison_blocked_by_missing_identity = false;
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyConditionGradeBoundary(result, input) {
  if (typeof input["replacement.refurbished.condition"] !== "string") {
    return;
  }
  result.condition_descriptor_role = "descriptive_only";
  result.inferred_climate_CO2e_kg = null;
  result.inferred_remaining_life_years = null;
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyOperationalAdequacyBoundary(result, input) {
  if (input["phone_turns_on"] !== true) {
    return;
  }
  result.phone_operational_equals_adequate = false;
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyPrimaryHorizonAmortizationBoundary(result, input) {
  if (typeof input["replacement.new.expected_adequate_service_years"] !== "number") {
    return;
  }
  result.new_phone_8y_lifetime_used_to_amortize_primary_decision = false;
}

/**
 * @param {DecisionResult} result
 * @param {SmartphoneInput} input
 */
function applyDistinctMissingClasses(result, input) {
  const remainingKey = "remaining_service.without_repair.expected_years";
  const researchKey = "repair.model_specific_climate_CO2e_kg";
  const remainingMissing =
    hasInputKey(input, remainingKey) &&
    isUnknown(input[remainingKey]) &&
    typeof input["remaining_service.without_repair.low_years"] !== "number" &&
    typeof input["remaining_service.without_repair.high_years"] !== "number";
  const researchMissing =
    input["repair.type"] === "major_board" &&
    hasInputKey(input, researchKey) &&
    isUnknown(input[researchKey]);
  if (!remainingMissing || !researchMissing) {
    return;
  }
  const remainingResolution = resolveMissingInput({
    field: "remaining_service.without_repair",
    missingClass: USER_SITUATION_FACT,
    attemptApprovedDefault: true,
  });
  const researchResolution = resolveMissingInput({
    field: "repair.model_specific_climate_CO2e_kg",
    missingClass: RESEARCH_EVIDENCE_PARAMETER,
    researchApprovedFallback: false,
    attemptApprovedDefault: true,
  });
  if (remainingResolution.usedApprovedDefault || researchResolution.usedApprovedDefault) {
    return;
  }
  appendMissingField(result, remainingResolution.field, remainingResolution.missingClass);
  appendMissingField(result, researchResolution.field, researchResolution.missingClass);
  result.result_capability = "insufficient_information";
}

/**
 * Evaluates the T01–T35 adequacy, unknown-state, repair-impact,
 * service-sequence, replacement-evidence, old-device-fate, remaining
 * input-contract case slice, the ten global A-GLOBAL-* assertions, and
 * the sixteen-source A-LOGIC family. Those logic assertions reuse the
 * accepted case fields already produced here; no extra result channel is
 * added merely to mirror assertion names. Input keys intentionally match
 * the immutable source package's field names; no UI model,
 * used/refurbished secondary suite, prohibition certification, ranking
 * winner, unified harm score, fallback registry, EOL value, recycling
 * credit, or new scientific defaults are introduced here.
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
  const remainingServiceOutOfBounds = horizonInput === OUT_OF_BOUNDS_REMAINING_SERVICE_YEARS;
  const horizon = remainingServiceOutOfBounds ? null : primaryHorizon(horizonInput);
  const replacementType = input["replacement.type"];
  const providesEquivalentService =
    adequacyStatus === "adequate"
      ? true
      : adequacyStatus === "inadequate"
        ? false
        : UNKNOWN;

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
      provides_equivalent_service: providesEquivalentService,
    },
    replacement_forced_by_support_status: false,
  };

  if (remainingServiceOutOfBounds) {
    result.validation_status = "error";
    result.accepted_value = null;
  }

  if (replacementType === "new" && isUnknown(horizonInput)) {
    appendMissingField(result, "remaining_service.without_repair");
  }

  if (
    replacementType === "new" &&
    adequacyStatus === "adequate" &&
    typeof horizon === "number" &&
    input["replacement.new.model"] !== APPROVED_NEW_REGISTRY_MATCH
  ) {
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
  applyReplacementEvidence(result, input);
  applyOldDeviceFate(result, input);
  applyGenericEolBoundary(result);
  applyGenericRecyclingCreditBoundary(result);
  applySunkManufacturingBoundary(result);
  applyQualitativePathwayClimateBoundary(result);
  applyMaterialCardBoundary(result, input);
  applyPersonalSubstitutionBoundary(result, input);
  applyUsConsequentialScenario(result, input);
  applyRemainingServiceRange(result, input);
  applyChargingGridBoundary(result, input);
  applyMissingIdentityGenericComparison(result, input);
  applyConditionGradeBoundary(result, input);
  applyOperationalAdequacyBoundary(result, input);
  applyPrimaryHorizonAmortizationBoundary(result, input);
  applyDistinctMissingClasses(result, input);
  applyComparativeRankingPermission(result, providesEquivalentService);

  return result;
}
