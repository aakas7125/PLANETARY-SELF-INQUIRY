/**
 * Secondary-pathway evaluator for used/second-hand versus refurbished cases.
 *
 * Authority: R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0,
 * R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0, contracts/SECONDARY_PATHWAYS_V0.md.
 *
 * Separate from the input-package evaluator so secondary package boundaries stay explicit.
 *
 * This slice implements SEC-01–SEC-06 and SEC-09 only. Positive ADEME
 * source-specific selection (SEC-07) and model-specific battery impact paths
 * are intentionally absent.
 */

export const UNKNOWN = "unknown";
export const ACCOUNTING_MODE = "DIRECT_CUTOFF_PROSPECTIVE";
export const PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF = "PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF";
export const NOT_EVIDENCED = "NOT_EVIDENCED";
export const UNKNOWN_NO_FALLBACK = "UNKNOWN_NO_FALLBACK";
export const PROVISIONAL_GENERIC_RANGE = "PROVISIONAL_GENERIC_RANGE";

/** Accepted battery intervention fallback from used/refurb pathways (kg CO2e). */
const BATTERY_REPLACEMENT_CO2E_KG = Object.freeze([0.3, 0.7]);
const IMPLEMENTED_COMPOSED_CASE_IDS = new Set(["SEC-05", "SEC-06", "SEC-09"]);

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
 * SEC-04 proves that an explicit null source-specific selection does not apply ADEME.
 * Emit false only for that exact null selection; absent or non-null unimplemented
 * selections must not be coerced to false. Positive ADEME selection is out of scope.
 *
 * @param {SecondaryReplacement} replacement
 * @returns {false | undefined}
 */
function resolveAdemeApplied(replacement) {
  if (
    Object.hasOwn(replacement, "source_specific_reference_selected") &&
    replacement.source_specific_reference_selected === null
  ) {
    return false;
  }
  return undefined;
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

  // Emit ADEME_7_61_applied only for SEC-04's explicit-null selection proof.
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
  } else if (pathway === "used_secondhand") {
    result.direct_secondary_CO2e = null;
    result.result_capability = "qualitative_only";
  } else {
    result.direct_secondary_CO2e = null;
    result.result_capability = "insufficient_information";
  }

  return Object.freeze(result);
}

/**
 * Compose the exact top-level structures used by the implemented service and
 * transfer cases around the existing replacement evaluator. Cases outside this
 * bounded slice do not acquire pathway, numerical, or categorical behavior.
 *
 * @param {SecondaryPathwayCase} input
 * @returns {SecondaryPathwayResult}
 */
export function evaluateSecondaryPathwayCase(input = {}) {
  const replacement =
    input.replacement && typeof input.replacement === "object" && !Array.isArray(input.replacement)
      ? /** @type {SecondaryReplacement} */ (input.replacement)
      : {};
  const caseId = typeof input.case_id === "string" ? input.case_id : undefined;

  if (!caseId || !IMPLEMENTED_COMPOSED_CASE_IDS.has(caseId)) {
    return evaluateSecondaryPathway(replacement);
  }

  const normalizedReplacement =
    replacement.pathway === "used_secondhand"
      ? { ...replacement, pathway_user_selection: "used_secondhand" }
      : replacement;
  const result = {
    ...evaluateSecondaryPathway(normalizedReplacement),
  };

  if (caseId === "SEC-05") {
    const service =
      replacement.expected_adequate_service &&
      typeof replacement.expected_adequate_service === "object" &&
      !Array.isArray(replacement.expected_adequate_service)
        ? /** @type {Record<string, unknown>} */ (replacement.expected_adequate_service)
        : {};
    const allServiceValuesUnknown = ["low_years", "expected_years", "high_years"].every((field) =>
      isUnknown(service[field]),
    );

    if (replacement.pathway === "used_secondhand" && allServiceValuesUnknown) {
      result.used_service_life = null;
      result.equivalent_service_established = false;
      result.missing_required_fields = ["replacement.expected_adequate_service"];
      result.result_capability = "insufficient_information";
    }
  }

  if (caseId === "SEC-06") {
    const transfer =
      replacement.transfer &&
      typeof replacement.transfer === "object" &&
      !Array.isArray(replacement.transfer)
        ? /** @type {Record<string, unknown>} */ (replacement.transfer)
        : {};

    if (
      replacement.pathway === "used_secondhand" &&
      transfer.required_for_transaction === true &&
      transfer.mode === "parcel_delivery" &&
      transfer.quantified_CO2e === null &&
      transfer.evidence_id === null
    ) {
      result.transfer_CO2e = {
        value: null,
        status: UNKNOWN_NO_FALLBACK,
      };
      result.used_direct_CO2e = { value: null };
      result.result_capability = "qualitative_only";
    }
  }

  if (caseId === "SEC-09") {
    const comparison =
      input.comparison && typeof input.comparison === "object" && !Array.isArray(input.comparison)
        ? /** @type {Record<string, unknown>} */ (input.comparison)
        : {};
    const service =
      replacement.expected_adequate_service &&
      typeof replacement.expected_adequate_service === "object" &&
      !Array.isArray(replacement.expected_adequate_service)
        ? /** @type {Record<string, unknown>} */ (replacement.expected_adequate_service)
        : {};
    const horizon = comparison.common_service_horizon_years;
    const covered = service.expected_years;

    if (
      replacement.pathway === "used_secondhand" &&
      typeof horizon === "number" &&
      Number.isFinite(horizon) &&
      typeof covered === "number" &&
      Number.isFinite(covered) &&
      covered >= 0 &&
      covered < horizon
    ) {
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
  }

  return Object.freeze(result);
}

export const SECONDARY_PATHWAY_CONSTANTS = Object.freeze({
  BATTERY_REPLACEMENT_CO2E_KG,
});
