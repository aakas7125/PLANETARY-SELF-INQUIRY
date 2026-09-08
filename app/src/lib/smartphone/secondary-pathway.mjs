/**
 * Secondary-pathway evaluator for used/second-hand versus refurbished cases.
 *
 * Authority: R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0,
 * R&E-V0-SMARTPHONE-USED-REFURB-PATHWAYS-1.0.0, contracts/SECONDARY_PATHWAYS_V0.md.
 *
 * Separate from the input-package evaluator so secondary package boundaries stay explicit.
 */

export const UNKNOWN = "unknown";
export const ACCOUNTING_MODE = "DIRECT_CUTOFF_PROSPECTIVE";
export const PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF = "PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF";
export const NOT_EVIDENCED = "NOT_EVIDENCED";
export const UNKNOWN_NO_FALLBACK = "UNKNOWN_NO_FALLBACK";
export const PROVISIONAL_GENERIC_RANGE = "PROVISIONAL_GENERIC_RANGE";

/** Accepted battery intervention fallback from used/refurb pathways (kg CO2e). */
const BATTERY_REPLACEMENT_CO2E_KG = Object.freeze([0.3, 0.7]);

/** ADEME source-specific reference value — never a generic refurbished fallback. */
const ADEME_REFURB_REFERENCE_CO2E_KG = 7.61;

/** @typedef {"used_secondhand" | "refurbished" | "unknown"} SecondaryPathway */
/** @typedef {Record<string, unknown>} SecondaryReplacement */
/** @typedef {Record<string, unknown>} SecondaryPathwayResult */

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
    if (
      record.refurbishment_program === false &&
      record.inspection_testing === false
    ) {
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
  if (
    batteryRecord.model_specific_impact === null ||
    batteryRecord.model_specific_impact === undefined
  ) {
    return {
      value: [...BATTERY_REPLACEMENT_CO2E_KG],
      status: PROVISIONAL_GENERIC_RANGE,
    };
  }
  if (typeof batteryRecord.model_specific_impact === "number") {
    return {
      value: [batteryRecord.model_specific_impact, batteryRecord.model_specific_impact],
      status: "APPROVED_MODEL_SPECIFIC",
    };
  }
  return { value: null, status: UNKNOWN_NO_FALLBACK };
}

/**
 * ADEME 7.61 applies only when an explicit source-specific reference is selected.
 * Marketplace grade and refurbished label never select it.
 *
 * @param {SecondaryReplacement} replacement
 * @returns {boolean}
 */
function resolveAdemeApplied(replacement) {
  const selected = replacement.source_specific_reference_selected;
  if (selected === null || selected === undefined || selected === UNKNOWN) {
    return false;
  }
  if (selected === "ADEME_REFURB_REFERENCE" || selected === ADEME_REFURB_REFERENCE_CO2E_KG) {
    return true;
  }
  return false;
}

/**
 * Marketplace condition grade must not select an LCA or numerical footprint.
 *
 * @param {SecondaryReplacement} replacement
 * @returns {boolean}
 */
function marketplaceGradeSelectsLca(replacement) {
  return false;
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
      avoided_production_credit: false,
    },
    market_displacement_credit: null,
    ADEME_7_61_applied: ademeApplied,
    marketplace_grade_selected_lca: marketplaceGradeSelectsLca(replacement),
  };

  if (refurbishmentProcess !== undefined) {
    result.refurbishment_process = refurbishmentProcess;
  }

  if (processUncertainty) {
    result.process_uncertainty = true;
  }

  const transfer = replacement.transfer;
  if (transfer && typeof transfer === "object") {
    const quantified =
      "quantified_CO2e" in transfer ? transfer.quantified_CO2e : UNKNOWN;
    result.transfer_CO2e = {
      value: typeof quantified === "number" ? quantified : null,
      status:
        typeof quantified === "number" ? "APPROVED" : UNKNOWN_NO_FALLBACK,
    };
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

  // Commercial seller or listing metadata never fabricate preparation processes.
  if (
    pathway === "used_secondhand" &&
    (replacement.seller_type === "commercial_reseller" ||
      replacement.listing_label === "used")
  ) {
    result.fabricated_preparation_processes = false;
  }

  return Object.freeze(result);
}

export const SECONDARY_PATHWAY_CONSTANTS = Object.freeze({
  BATTERY_REPLACEMENT_CO2E_KG,
  ADEME_REFURB_REFERENCE_CO2E_KG,
});
