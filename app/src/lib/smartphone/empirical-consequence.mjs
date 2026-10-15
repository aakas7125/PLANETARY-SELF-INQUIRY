import {
  CLIMATE_CLAIM_ID,
  CLIMATE_CLAIM_PACKAGE_COMMIT,
} from "./empirical-climate-boundary.mjs";

/**
 * Research-owned consequence projection for the accepted generic-new
 * manufacturing climate subset.
 *
 * Authority: project-state/DECISIONS.md D-005 and Research Table C §12.
 * The full record is produced only from an impact view whose manufacturing
 * basis and displayed climate claim already passed the existing producer.
 * This module does not resolve pathways, edit source packages, or read
 * AP answers.
 */

export const GENERIC_NEW_CLIMATE_CONSEQUENCE_REF_ID =
  "SP-PATH-CLIMATE-001@024a95392d2e1555a3c9b598fdc291bd341c3d6b::replacement.new::production_CO2e_kg::generic_fallback";

export const GENERIC_NEW_CLIMATE_SOURCE_IDS = Object.freeze(["S1", "S8", "S9"]);

export const GENERIC_NEW_CLIMATE_ATTRIBUTION_LIMITS = Object.freeze([
  "pressure_to_outcome_only",
  "no_named_person_species_place_or_event_attribution",
  "no_victims_or_deaths_caused_or_avoided",
  "no_exact_individual_human_or_ecological_damage",
  "no_unified_environmental_safety_protect_four_or_moral_score",
  "conditional_pathway_is_not_causal_proof",
]);

const BASIS_KEYS = Object.freeze([
  "pathwayId",
  "scenarioRef",
  "field",
  "valueRange",
  "unit",
  "provenanceScope",
  "acceptedFallbackStatus",
  "contractRef",
  "claimId",
  "claimVersion",
  "prospective",
]);

const CONDITION_KEYS = Object.freeze(["key", "status", "basis_ref", "basis_kind"]);

/**
 * @typedef {Readonly<{
 *   consequence_ref_id: string,
 *   claim_id: string,
 *   claim_version: string,
 *   consequence_category: "climate",
 *   scenario_status: "modelled_alternative",
 *   actual_purchase_established: false,
 *   actual_harm_event_established: false,
 *   case_specificity: "condition_established_for_modelled_alternative",
 *   condition: Readonly<{
 *     key: "scenario_produces_ghg_emissions",
 *     status: "established",
 *     basis_ref: "replacement.new.production_CO2e_kg",
 *     basis_kind: "accepted_generic_new_manufacturing_fallback",
 *   }>,
 *   displayed: true,
 *   independently_supported: true,
 *   support_status: "supported",
 *   extent: "beyond_immediate_circle",
 *   extent_semantics: "conditional_global_pathway_scope",
 *   gate_eligible: true,
 *   source_ids: readonly string[],
 *   attribution_limits: readonly string[],
 *   manufacturingBasis: Readonly<{
 *     pathwayId: "new",
 *     scenarioRef: "replacement.new",
 *     field: "production_CO2e_kg",
 *     valueRange: readonly [number, number],
 *     unit: "kg CO2e",
 *     provenanceScope: "generic_fallback",
 *     acceptedFallbackStatus: "APPROVED_V0_FALLBACK",
 *     contractRef: "EMPIRICAL_SMARTPHONE_V0",
 *     claimId: string,
 *     claimVersion: string,
 *     prospective: true,
 *   }>,
 * }>} EmpiricalConsequenceRecord
 */

const RECORD_KEYS = Object.freeze([
  "consequence_ref_id",
  "claim_id",
  "claim_version",
  "consequence_category",
  "scenario_status",
  "actual_purchase_established",
  "actual_harm_event_established",
  "case_specificity",
  "condition",
  "displayed",
  "independently_supported",
  "support_status",
  "extent",
  "extent_semantics",
  "gate_eligible",
  "source_ids",
  "attribution_limits",
  "manufacturingBasis",
]);

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {Record<string, unknown>} value
 * @param {readonly string[]} keys
 * @returns {boolean}
 */
function hasExactKeys(value, keys) {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => actual.includes(key));
}

/**
 * @param {unknown} value
 * @param {readonly string[]} expected
 * @returns {boolean}
 */
function sameStringList(value, expected) {
  return (
    Array.isArray(value) &&
    value.length === expected.length &&
    value.every((item, index) => item === expected[index])
  );
}

/**
 * @param {unknown} basis
 * @returns {boolean}
 */
export function isAcceptedGenericNewManufacturingBasis(basis) {
  if (!isPlainObject(basis) || !hasExactKeys(basis, BASIS_KEYS)) return false;
  const range = basis.valueRange;
  return (
    basis.pathwayId === "new" &&
    basis.scenarioRef === "replacement.new" &&
    basis.field === "production_CO2e_kg" &&
    Array.isArray(range) &&
    range.length === 2 &&
    range[0] === 25 &&
    range[1] === 70 &&
    basis.unit === "kg CO2e" &&
    basis.provenanceScope === "generic_fallback" &&
    basis.acceptedFallbackStatus === "APPROVED_V0_FALLBACK" &&
    basis.contractRef === "EMPIRICAL_SMARTPHONE_V0" &&
    basis.claimId === CLIMATE_CLAIM_ID &&
    basis.claimVersion === CLIMATE_CLAIM_PACKAGE_COMMIT &&
    basis.prospective === true
  );
}

/**
 * @param {Record<string, unknown>} basis
 */
function freezeBasis(basis) {
  const range = /** @type {readonly unknown[]} */ (basis.valueRange);
  return Object.freeze({
    pathwayId: "new",
    scenarioRef: "replacement.new",
    field: "production_CO2e_kg",
    valueRange: Object.freeze([range[0], range[1]]),
    unit: "kg CO2e",
    provenanceScope: "generic_fallback",
    acceptedFallbackStatus: "APPROVED_V0_FALLBACK",
    contractRef: "EMPIRICAL_SMARTPHONE_V0",
    claimId: CLIMATE_CLAIM_ID,
    claimVersion: CLIMATE_CLAIM_PACKAGE_COMMIT,
    prospective: true,
  });
}

/**
 * @param {unknown} value
 * @returns {value is EmpiricalConsequenceRecord}
 */
export function isCompleteEmpiricalConsequenceRecord(value) {
  if (!isPlainObject(value) || !hasExactKeys(value, RECORD_KEYS)) return false;
  if (!isPlainObject(value.condition) || !hasExactKeys(value.condition, CONDITION_KEYS)) return false;
  if (!isAcceptedGenericNewManufacturingBasis(value.manufacturingBasis)) return false;
  return (
    value.consequence_ref_id === GENERIC_NEW_CLIMATE_CONSEQUENCE_REF_ID &&
    value.claim_id === CLIMATE_CLAIM_ID &&
    value.claim_version === CLIMATE_CLAIM_PACKAGE_COMMIT &&
    value.consequence_category === "climate" &&
    value.scenario_status === "modelled_alternative" &&
    value.actual_purchase_established === false &&
    value.actual_harm_event_established === false &&
    value.case_specificity === "condition_established_for_modelled_alternative" &&
    value.condition.key === "scenario_produces_ghg_emissions" &&
    value.condition.status === "established" &&
    value.condition.basis_ref === "replacement.new.production_CO2e_kg" &&
    value.condition.basis_kind === "accepted_generic_new_manufacturing_fallback" &&
    value.displayed === true &&
    value.independently_supported === true &&
    value.support_status === "supported" &&
    value.extent === "beyond_immediate_circle" &&
    value.extent_semantics === "conditional_global_pathway_scope" &&
    value.gate_eligible === true &&
    sameStringList(value.source_ids, GENERIC_NEW_CLIMATE_SOURCE_IDS) &&
    sameStringList(value.attribution_limits, GENERIC_NEW_CLIMATE_ATTRIBUTION_LIMITS)
  );
}

/**
 * Material identity of a complete record. The static consequence reference
 * is not sufficient: basis, version, sources, limits, and provenance travel
 * with it. Incomplete records have no binding.
 *
 * @param {unknown} record
 * @returns {string | null}
 */
export function consequenceBindingKey(record) {
  if (!isCompleteEmpiricalConsequenceRecord(record)) return null;
  const basis = record.manufacturingBasis;
  const range = basis.valueRange;
  return JSON.stringify({
    consequence_ref_id: record.consequence_ref_id,
    claim_id: record.claim_id,
    claim_version: record.claim_version,
    source_ids: record.source_ids,
    attribution_limits: record.attribution_limits,
    condition: record.condition,
    scenario_status: record.scenario_status,
    case_specificity: record.case_specificity,
    actual_purchase_established: record.actual_purchase_established,
    actual_harm_event_established: record.actual_harm_event_established,
    displayed: record.displayed,
    independently_supported: record.independently_supported,
    support_status: record.support_status,
    extent: record.extent,
    extent_semantics: record.extent_semantics,
    gate_eligible: record.gate_eligible,
    manufacturingBasis: {
      pathwayId: basis.pathwayId,
      scenarioRef: basis.scenarioRef,
      field: basis.field,
      valueRange: [range[0], range[1]],
      unit: basis.unit,
      provenanceScope: basis.provenanceScope,
      acceptedFallbackStatus: basis.acceptedFallbackStatus,
      contractRef: basis.contractRef,
      claimId: basis.claimId,
      claimVersion: basis.claimVersion,
      prospective: basis.prospective,
    },
  });
}

/**
 * @param {Record<string, unknown>} basis
 */
function fullRecord(basis) {
  return Object.freeze({
    consequence_ref_id: GENERIC_NEW_CLIMATE_CONSEQUENCE_REF_ID,
    claim_id: CLIMATE_CLAIM_ID,
    claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
    consequence_category: "climate",
    scenario_status: "modelled_alternative",
    actual_purchase_established: false,
    actual_harm_event_established: false,
    case_specificity: "condition_established_for_modelled_alternative",
    condition: Object.freeze({
      key: "scenario_produces_ghg_emissions",
      status: "established",
      basis_ref: "replacement.new.production_CO2e_kg",
      basis_kind: "accepted_generic_new_manufacturing_fallback",
    }),
    displayed: true,
    independently_supported: true,
    support_status: "supported",
    extent: "beyond_immediate_circle",
    extent_semantics: "conditional_global_pathway_scope",
    gate_eligible: true,
    source_ids: GENERIC_NEW_CLIMATE_SOURCE_IDS,
    attribution_limits: GENERIC_NEW_CLIMATE_ATTRIBUTION_LIMITS,
    manufacturingBasis: freezeBasis(basis),
  });
}

/**
 * Project the full §12 record from the current impact view.
 * Missing, conflicting, undisplayed, or non-generic bases return null.
 * Labels, quantities alone, and other domains are not read as authority.
 *
 * @param {unknown} impactView
 * @returns {ReturnType<typeof fullRecord> | null}
 */
export function projectGenericNewClimateConsequence(impactView) {
  if (!isPlainObject(impactView) || impactView.available !== true) return null;
  if (!isAcceptedGenericNewManufacturingBasis(impactView.manufacturingBasis)) return null;
  if (!Array.isArray(impactView.domains)) return null;
  const climate = impactView.domains.filter(
    (domain) => isPlainObject(domain) && domain.id === "climate" && domain.emitted === true,
  );
  if (climate.length !== 1) return null;
  const displayed = climate[0];
  if (!isAcceptedGenericNewManufacturingBasis(displayed.manufacturingBasis)) return null;
  if (
    displayed.claimId !== CLIMATE_CLAIM_ID ||
    displayed.claimVersion !== CLIMATE_CLAIM_PACKAGE_COMMIT ||
    !Array.isArray(displayed.lines) ||
    displayed.lines.length === 0 ||
    !sameStringList(displayed.attributionLimits, GENERIC_NEW_CLIMATE_ATTRIBUTION_LIMITS)
  ) {
    return null;
  }
  const disclosure = displayed.disclosure;
  if (!isPlainObject(disclosure) || !sameStringList(disclosure.sourceIds, GENERIC_NEW_CLIMATE_SOURCE_IDS)) {
    return null;
  }
  const record = fullRecord(/** @type {Record<string, unknown>} */ (impactView.manufacturingBasis));
  if (!isCompleteEmpiricalConsequenceRecord(record)) return null;
  return record;
}
