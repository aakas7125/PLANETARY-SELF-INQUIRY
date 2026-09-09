/**
 * Secondary-pathway evaluator for used/second-hand versus refurbished cases.
 *
 * Authority: R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0,
 * R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0, contracts/SECONDARY_PATHWAYS_V0.md.
 *
 * Separate from the input-package evaluator so secondary package boundaries stay explicit.
 *
 * This slice implements SEC-01–SEC-11. SEC-12 is intentionally absent.
 */

export const UNKNOWN = "unknown";
export const ACCOUNTING_MODE = "DIRECT_CUTOFF_PROSPECTIVE";
export const PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF = "PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF";
export const NOT_EVIDENCED = "NOT_EVIDENCED";
export const UNKNOWN_NO_FALLBACK = "UNKNOWN_NO_FALLBACK";
export const PROVISIONAL_GENERIC_RANGE = "PROVISIONAL_GENERIC_RANGE";
export const APPROVED_SOURCE_SPECIFIC = "APPROVED_SOURCE_SPECIFIC";

/** Accepted battery intervention fallback from used/refurb pathways (kg CO2e). */
const BATTERY_REPLACEMENT_CO2E_KG = Object.freeze([0.3, 0.7]);
const ADEME_REFURB_SMARTPHONE_REFERENCE = "ADEME_REFURB_SMARTPHONE_REFERENCE";
const ADEME_REFURB_REFERENCE_CO2E_KG = 7.61;
const ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS = 2;

/** @typedef {"used_secondhand" | "refurbished" | "unknown"} SecondaryPathway */
/** @typedef {Record<string, unknown>} SecondaryReplacement */
/** @typedef {Record<string, unknown>} SecondaryPathwayResult */
/** @typedef {Record<string, unknown>} SecondaryPathwayCase */

/** @param {unknown} value @returns {boolean} */
export function isUnknown(value) {
  return value === null || value === undefined || value === UNKNOWN;
}

/**
 * @param {unknown} evidence
 * @returns {boolean}
 */
function hasDocumentedStructuredRefurbishment(evidence) {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    return false;
  }
  const record = /** @type {Record<string, unknown>} */ (evidence);
  if (record.refurbishment_program !== true) {
    return false;
  }
  const components = Array.isArray(record.component_replacement)
    ? record.component_replacement
    : [];
  const repairs = Array.isArray(record.repair_processes) ? record.repair_processes : [];
  return (
    record.inspection_testing === true ||
    record.cleaning === true ||
    components.length > 0 ||
    repairs.length > 0
  );
}

/**
 * @param {SecondaryReplacement} replacement
 * @returns {SecondaryPathway}
 */
function classifyPathway(replacement) {
  const evidence = replacement.process_evidence;
  if (hasDocumentedStructuredRefurbishment(evidence)) {
    return "refurbished";
  }

  const selection = replacement.pathway_user_selection;
  if (selection === "refurbished" || selection === "used_secondhand") {
    return selection;
  }

  if (replacement.listing_label === "used") {
    return "used_secondhand";
  }

  return UNKNOWN;
}

/**
 * @param {SecondaryReplacement} replacement
 * @returns {boolean}
 */
function processEvidenceAbsent(replacement) {
  return (
    replacement.documented_process === null ||
    replacement.process_evidence_id === null ||
    (replacement.documented_process === undefined &&
      replacement.process_evidence === undefined &&
      replacement.process_evidence_id === undefined)
  );
}

/**
 * @param {SecondaryReplacement} replacement
 * @param {SecondaryPathway} pathway
 * @returns {{ status: string } | "unknown" | undefined}
 */
function resolveRefurbishmentProcess(replacement, pathway) {
  if (hasDocumentedStructuredRefurbishment(replacement.process_evidence)) {
    return { status: "DOCUMENTED" };
  }

  const evidence = replacement.process_evidence;
  if (evidence && typeof evidence === "object" && !Array.isArray(evidence)) {
    const record = /** @type {Record<string, unknown>} */ (evidence);
    if (record.refurbishment_program === false && record.inspection_testing === false) {
      return { status: NOT_EVIDENCED };
    }
  }

  if (
    pathway === "used_secondhand" &&
    (replacement.seller_type === "commercial_reseller" ||
      replacement.listing_label === "used" ||
      processEvidenceAbsent(replacement))
  ) {
    return UNKNOWN;
  }

  if (pathway === "refurbished" && !hasDocumentedStructuredRefurbishment(evidence)) {
    return UNKNOWN;
  }

  return undefined;
}

/**
 * @param {SecondaryReplacement} replacement
 * @param {SecondaryPathway} pathway
 * @returns {boolean}
 */
function resolveProcessUncertainty(replacement, pathway) {
  if (pathway !== "used_secondhand") {
    return false;
  }
  if (replacement.seller_type === "commercial_reseller") {
    return true;
  }
  if (replacement.listing_label === "used" && processEvidenceAbsent(replacement)) {
    return true;
  }
  return false;
}

/**
 * Battery intervention fallback for documented replacement with null model-specific impact.
 * Numeric / model-specific approval paths are out of scope for SEC-01–SEC-04.
 *
 * @param {SecondaryReplacement} replacement
 * @returns {{ value: number[] | null, status: string | null }}
 */
function resolveBatteryReplacement(replacement) {
  const evidence = replacement.process_evidence;
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    return { value: null, status: null };
  }
  const record = /** @type {Record<string, unknown>} */ (evidence);
  const components = Array.isArray(record.component_replacement)
    ? record.component_replacement
    : [];
  const battery = components.find(
    /** @param {unknown} entry */
    (entry) =>
      Boolean(entry) &&
      typeof entry === "object" &&
      /** @type {Record<string, unknown>} */ (entry).type === "battery",
  );
  if (!battery || typeof battery !== "object") {
    return { value: null, status: null };
  }
  const batteryRecord = /** @type {Record<string, unknown>} */ (battery);
  // SEC-02 authorizes only the exact null-input provisional generic range.
  // Absent/undefined or other values must not silently acquire the fallback.
  if (batteryRecord.model_specific_impact === null) {
    return {
      value: [...BATTERY_REPLACEMENT_CO2E_KG],
      status: PROVISIONAL_GENERIC_RANGE,
    };
  }
  return { value: null, status: null };
}

/**
 * SEC-04 and SEC-08 prove that explicit null source-specific selections do not
 * apply ADEME. Absent, malformed, or non-null unimplemented selections must not
 * be coerced to false.
 *
 * @param {SecondaryReplacement} replacement
 * @returns {false | undefined}
 */
function resolveAdemeApplied(replacement) {
  if (
    (Object.hasOwn(replacement, "source_specific_reference_selected") &&
      replacement.source_specific_reference_selected === null) ||
    (Object.hasOwn(replacement, "source_specific_reference") &&
      replacement.source_specific_reference === null)
  ) {
    return false;
  }
  return undefined;
}

/**
 * Resolve only the exact two-year ADEME source-specific reference scenario.
 * Pathway, service horizon, model, seller, or grade cannot select this value.
 *
 * @param {SecondaryReplacement} replacement
 * @param {SecondaryPathway} pathway
 * @returns {{
 *   value: number,
 *   unit: string,
 *   status: string,
 *   source_id: string,
 * } | undefined}
 */
function resolveAdemeReference(replacement, pathway) {
  const reference = replacement.source_specific_reference;
  const service = replacement.expected_adequate_service;
  if (
    pathway !== "refurbished" ||
    !isRecord(reference) ||
    !isRecord(service) ||
    reference.source_id !== ADEME_REFURB_SMARTPHONE_REFERENCE ||
    reference.explicitly_selected !== true ||
    service.expected_years !== ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS
  ) {
    return undefined;
  }

  return {
    value: ADEME_REFURB_REFERENCE_CO2E_KG,
    unit: "kgCO2e",
    status: APPROVED_SOURCE_SPECIFIC,
    source_id: ADEME_REFURB_SMARTPHONE_REFERENCE,
  };
}

/**
 * Evaluate a secondary-pathway replacement package.
 *
 * @param {SecondaryReplacement} replacement
 * @returns {SecondaryPathwayResult}
 */
export function evaluateSecondaryPathway(replacement = {}) {
  const pathway = classifyPathway(replacement);
  const battery = resolveBatteryReplacement(replacement);
  const ademeApplied = resolveAdemeApplied(replacement);
  const ademeReference = resolveAdemeReference(replacement, pathway);
  const processUncertainty = resolveProcessUncertainty(replacement, pathway);
  const refurbishmentProcess = resolveRefurbishmentProcess(replacement, pathway);

  /** @type {SecondaryPathwayResult} */
  const result = {
    accounting_mode: ACCOUNTING_MODE,
    secondary_pathway: pathway,
    original_manufacturing: {
      status: PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF,
      enters_direct_acquisition_total: false,
    },
    market_displacement_credit: null,
  };

  // Emit ADEME_7_61_applied only for an explicit-null selection proof.
  if (ademeApplied !== undefined) {
    result.ADEME_7_61_applied = ademeApplied;
  }

  if (refurbishmentProcess !== undefined) {
    result.refurbishment_process = refurbishmentProcess;
  }

  if (processUncertainty) {
    result.process_uncertainty = true;
  }

  const transfer = replacement.transfer;
  if (transfer && typeof transfer === "object" && "quantified_CO2e" in transfer) {
    const quantified = transfer.quantified_CO2e;
    // This slice authorizes only SEC-01's explicit null/unknown transfer.
    // Numeric or other off-slice values must not gain APPROVED status here.
    if (quantified === null || quantified === UNKNOWN) {
      result.transfer_CO2e = {
        value: null,
        status: UNKNOWN_NO_FALLBACK,
      };
    }
  }

  if (pathway === "refurbished") {
    if (ademeReference !== undefined) {
      result.refurb_direct_reference_CO2e = ademeReference;
      result.reference_second_life_years =
        ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS;
      result.decomposable = false;
      result.generic_default = false;
      result.result_capability = "quantitative";
    } else {
      if (battery.value !== null) {
        result.battery_replacement_CO2e = battery.value;
        result.battery_replacement_CO2e_status = battery.status;
      }

      const evidence = replacement.process_evidence;
      if (hasDocumentedStructuredRefurbishment(evidence)) {
        // Documented processes without supported burdens stay null/unknown, never zero.
        result.inspection_testing_CO2e = null;
        result.cleaning_CO2e = null;
        result.refurb_total_direct_CO2e = null;
        result.result_capability =
          battery.value !== null ? "partial_quantitative" : "qualitative_only";
      } else {
        result.refurb_direct_CO2e = {
          value: null,
          status: UNKNOWN_NO_FALLBACK,
        };
        result.direct_secondary_CO2e = null;
        result.result_capability = "qualitative_only";
      }
    }
  } else if (pathway === "used_secondhand") {
    result.direct_secondary_CO2e = null;
    result.result_capability = "qualitative_only";
  } else {
    result.direct_secondary_CO2e = null;
    result.result_capability = "insufficient_information";
  }

  return Object.freeze(result);
}

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {Record<string, unknown>} value
 * @param {string[]} keys
 * @returns {boolean}
 */
function hasOnlyKeys(value, keys) {
  const actualKeys = Object.keys(value);
  return actualKeys.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

/**
 * Resolve only SEC-10's complete, source-specific direct refurbishment
 * evidence over its exact common service horizon. The source aggregate stays
 * opaque and attached to its accepted boundary.
 *
 * @param {SecondaryPathwayCase} input
 * @returns {SecondaryPathwayResult | undefined}
 */
function evaluateCompleteRefurbishmentEvidence(input) {
  const comparison = input.comparison;
  const replacement = input.replacement;
  if (!isRecord(comparison) || !isRecord(replacement)) {
    return undefined;
  }

  const service = replacement.expected_adequate_service;
  const evidence = replacement.applicable_refurbishment_evidence;
  if (!isRecord(service) || !isRecord(evidence)) {
    return undefined;
  }

  const matchesAuthorizedStructure =
    hasOnlyKeys(comparison, ["common_service_horizon_years"]) &&
    hasOnlyKeys(replacement, [
      "pathway",
      "expected_adequate_service",
      "applicable_refurbishment_evidence",
    ]) &&
    hasOnlyKeys(service, ["expected_years"]) &&
    hasOnlyKeys(evidence, [
      "process_boundary_complete_for_direct_V0",
      "aggregate_direct_CO2e",
      "source_id",
      "source_specific",
      "decomposable",
    ]) &&
    comparison.common_service_horizon_years === 3 &&
    replacement.pathway === "refurbished" &&
    service.expected_years === comparison.common_service_horizon_years &&
    evidence.process_boundary_complete_for_direct_V0 === true &&
    evidence.aggregate_direct_CO2e === ADEME_REFURB_REFERENCE_CO2E_KG &&
    evidence.source_id === ADEME_REFURB_SMARTPHONE_REFERENCE &&
    evidence.source_specific === true &&
    evidence.decomposable === false;

  if (!matchesAuthorizedStructure) {
    return undefined;
  }

  return {
    accounting_mode: ACCOUNTING_MODE,
    secondary_pathway: "refurbished",
    original_manufacturing: {
      status: PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF,
      enters_direct_acquisition_total: false,
    },
    market_displacement_credit: null,
    service_sequence_required: false,
    adequate_service_coverage_years: service.expected_years,
    refurb_direct_CO2e: {
      value: evidence.aggregate_direct_CO2e,
      unit: "kgCO2e",
      status: APPROVED_SOURCE_SPECIFIC,
      source_id: evidence.source_id,
      source_specific: true,
      process_boundary_complete_for_direct_V0: true,
      decomposable: false,
    },
    equivalent_service_established: true,
    result_capability: "quantitative",
  };
}

/**
 * Keep SEC-11 bounded to its accepted domain structure. In particular, numeric
 * or incomplete candidate burdens must not acquire a comparison result.
 *
 * @param {Record<string, unknown>} input
 * @returns {SecondaryPathwayResult | undefined}
 */
function evaluateUnquantifiedSecondaryComparison(input) {
  const used = input.used_candidate;
  const refurbished = input.refurbished_candidate;
  const comparison = input.comparison;

  if (!isRecord(used) || !isRecord(refurbished) || !isRecord(comparison)) {
    return undefined;
  }

  const usedService = used.expected_adequate_service;
  const refurbishedService = refurbished.expected_adequate_service;
  if (!isRecord(usedService) || !isRecord(refurbishedService)) {
    return undefined;
  }

  const horizon = comparison.common_service_horizon_years;
  const matchesAuthorizedStructure =
    hasOnlyKeys(used, [
      "pathway",
      "expected_adequate_service",
      "transfer_CO2e",
      "repair_CO2e",
    ]) &&
    hasOnlyKeys(usedService, ["expected_years"]) &&
    hasOnlyKeys(refurbished, [
      "pathway",
      "expected_adequate_service",
      "refurb_direct_CO2e",
    ]) &&
    hasOnlyKeys(refurbishedService, ["expected_years"]) &&
    hasOnlyKeys(comparison, ["common_service_horizon_years"]) &&
    horizon === 2 &&
    used.pathway === "used_secondhand" &&
    usedService.expected_years === horizon &&
    Object.hasOwn(used, "transfer_CO2e") &&
    used.transfer_CO2e === null &&
    Object.hasOwn(used, "repair_CO2e") &&
    used.repair_CO2e === null &&
    refurbished.pathway === "refurbished" &&
    refurbishedService.expected_years === horizon &&
    Object.hasOwn(refurbished, "refurb_direct_CO2e") &&
    refurbished.refurb_direct_CO2e === null;

  if (!matchesAuthorizedStructure) {
    return undefined;
  }

  return {
    accounting_mode: ACCOUNTING_MODE,
    used: {
      direct_CO2e: null,
      reuses_existing_device: true,
    },
    refurbished: {
      direct_CO2e: null,
      reuses_existing_device: true,
    },
    numeric_winner: null,
    result_capability: "qualitative_only",
  };
}

/**
 * Compose the exact top-level structures used by the implemented service and
 * transfer/comparison cases around the existing replacement evaluator. Cases
 * outside this bounded slice do not acquire pathway, numerical, or categorical
 * behavior.
 *
 * @param {SecondaryPathwayCase} input
 * @returns {SecondaryPathwayResult}
 */
export function evaluateSecondaryPathwayCase(input = {}) {
  const completeRefurbishmentResult = evaluateCompleteRefurbishmentEvidence(input);
  if (completeRefurbishmentResult !== undefined) {
    return Object.freeze(completeRefurbishmentResult);
  }

  const comparisonResult = evaluateUnquantifiedSecondaryComparison(input);
  if (comparisonResult !== undefined) {
    return Object.freeze(comparisonResult);
  }

  const replacement =
    input.replacement && typeof input.replacement === "object" && !Array.isArray(input.replacement)
      ? /** @type {SecondaryReplacement} */ (input.replacement)
      : {};
  const currentDevice =
    input.current_device &&
    typeof input.current_device === "object" &&
    !Array.isArray(input.current_device)
      ? /** @type {Record<string, unknown>} */ (input.current_device)
      : null;
  const comparison =
    input.comparison && typeof input.comparison === "object" && !Array.isArray(input.comparison)
      ? /** @type {Record<string, unknown>} */ (input.comparison)
      : null;
  const service =
    replacement.expected_adequate_service &&
    typeof replacement.expected_adequate_service === "object" &&
    !Array.isArray(replacement.expected_adequate_service)
      ? /** @type {Record<string, unknown>} */ (replacement.expected_adequate_service)
      : null;
  const transfer =
    replacement.transfer &&
    typeof replacement.transfer === "object" &&
    !Array.isArray(replacement.transfer)
      ? /** @type {Record<string, unknown>} */ (replacement.transfer)
      : null;
  const horizon = comparison?.common_service_horizon_years;
  const covered = service?.expected_years;
  const isUsedPathway = replacement.pathway === "used_secondhand";
  const hasFiniteHorizon = typeof horizon === "number" && Number.isFinite(horizon) && horizon >= 0;
  const hasFiniteCoveredService =
    typeof covered === "number" && Number.isFinite(covered) && covered >= 0;
  const allServiceValuesUnknown =
    service !== null &&
    ["low_years", "expected_years", "high_years"].every((field) => isUnknown(service[field]));
  const hasUnknownUsedService =
    isUsedPathway &&
    currentDevice?.adequacy_status === "inadequate" &&
    hasFiniteHorizon &&
    allServiceValuesUnknown;
  const hasUnknownParcelTransfer =
    isUsedPathway &&
    transfer?.required_for_transaction === true &&
    transfer.mode === "parcel_delivery" &&
    transfer.quantified_CO2e === null &&
    transfer.evidence_id === null &&
    Array.isArray(replacement.repairs) &&
    replacement.repairs.length === 0 &&
    hasFiniteCoveredService;
  const hasIncompleteServiceSequence =
    isUsedPathway && hasFiniteHorizon && hasFiniteCoveredService && covered < horizon;
  const sourceSpecificReference = replacement.source_specific_reference;
  const hasExplicitAdemeReference =
    replacement.pathway === "refurbished" &&
    isRecord(sourceSpecificReference) &&
    sourceSpecificReference.source_id === ADEME_REFURB_SMARTPHONE_REFERENCE &&
    sourceSpecificReference.explicitly_selected === true &&
    service?.expected_years === ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS;
  const hasExplicitlyAbsentRefurbishedReference =
    replacement.pathway === "refurbished" &&
    replacement.exact_model === "arbitrary_model" &&
    Object.hasOwn(replacement, "source_specific_reference") &&
    replacement.source_specific_reference === null &&
    Object.hasOwn(replacement, "model_specific_refurb_LCA") &&
    replacement.model_specific_refurb_LCA === null &&
    service?.expected_years === ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS;

  // `case_id` is provenance metadata. Only the implemented domain structures
  // opt into the accepted top-level `pathway` spelling and composed behavior.
  const normalizedReplacement =
    hasUnknownUsedService || hasUnknownParcelTransfer || hasIncompleteServiceSequence
      ? { ...replacement, pathway_user_selection: "used_secondhand" }
      : hasExplicitAdemeReference || hasExplicitlyAbsentRefurbishedReference
        ? { ...replacement, pathway_user_selection: "refurbished" }
        : replacement;
  const result = {
    ...evaluateSecondaryPathway(normalizedReplacement),
  };

  if (hasUnknownUsedService) {
    result.used_service_life = null;
    result.equivalent_service_established = false;
    result.missing_required_fields = ["replacement.expected_adequate_service"];
    result.result_capability = "insufficient_information";
  }

  if (hasUnknownParcelTransfer) {
    result.transfer_CO2e = {
      value: null,
      status: UNKNOWN_NO_FALLBACK,
    };
    result.used_direct_CO2e = { value: null };
    result.result_capability = "qualitative_only";
  }

  if (hasIncompleteServiceSequence) {
    result.service_sequence_required = true;
    result.covered_service_years = covered;
    result.uncovered_service_years = horizon - covered;
    if (
      Object.hasOwn(input, "next_event_after_secondary_failure") &&
      isUnknown(input.next_event_after_secondary_failure)
    ) {
      result.next_event = UNKNOWN;
    }
    result.result_capability = "insufficient_information";
  }

  return Object.freeze(result);
}

export const SECONDARY_PATHWAY_CONSTANTS = Object.freeze({
  BATTERY_REPLACEMENT_CO2E_KG,
  ADEME_REFURB_SMARTPHONE_REFERENCE,
  ADEME_REFURB_REFERENCE_CO2E_KG,
  ADEME_REFURB_REFERENCE_SECOND_LIFE_YEARS,
});
