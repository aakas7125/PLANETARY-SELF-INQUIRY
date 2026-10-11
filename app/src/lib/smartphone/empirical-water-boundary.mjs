/**
 * Pure deterministic empirical smartphone-production water-use pathway boundary.
 *
 * Authority (read-only; this module does not create or revise claims):
 * - contracts/EMPIRICAL_SMARTPHONE_V0.md
 * - evidence/CLAIM_REGISTRY.json (`SP-PATH-WATER-001`)
 * - evidence/SOURCE_REGISTRY.json (`S1`, `S2`)
 * - provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md (package provenance)
 *
 * Emits only the accepted qualitative pathway for `SP-PATH-WATER-001` when
 * the complete claim/source authority passes. The accepted registries do not
 * contain a model-specific water-indicator record, so quantitative output
 * cannot be authorized by caller fields. Reuses exact-authority and
 * malformed-source-map discipline without generalizing earlier slices.
 */

import {
  authorityRecordsExactEqual,
  parseEmpiricalClaimRef,
} from "./empirical-climate-boundary.mjs";

/** Accepted package provenance pin for the water pathway claim. */
export const PACKAGE_PROVENANCE = "R&E-V0-SMARTPHONE-0.3.0";

/**
 * Accepted claim version identity = registry `package_commit`.
 * No silent normalization or substitution.
 */
export const WATER_CLAIM_PACKAGE_COMMIT =
  "024a95392d2e1555a3c9b598fdc291bd341c3d6b";

export const WATER_CLAIM_ID = "SP-PATH-WATER-001";

export const ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE =
  "not_attributable_to_specific_device";

/** Qualitative water-use pathway. Quantitative output is a separate gate. */
export const PATHWAY_KIND_QUALITATIVE = "qualitative_pathway";

/**
 * No empirical pathway ID remains pending. Earlier pathway IDs are covered
 * by their own boundary modules and are not emitted here.
 * @type {readonly string[]}
 */
export const PENDING_EMPIRICAL_PATHWAY_IDS = Object.freeze([]);

/**
 * Indicator labels that must not be conflated or converted into one another.
 * Naming one of them is not a repository water-indicator record.
 */
export const NON_CONFLATABLE_WATER_INDICATOR_LABELS = Object.freeze([
  "withdrawal",
  "consumption",
  "scarcity",
  "deprivation",
  "stress",
  "use",
  "drinking_water",
]);

/**
 * Frozen accepted claim record — exact field values from
 * evidence/CLAIM_REGISTRY.json. Field order follows the accepted empirical
 * exact-authority copies; the registry file itself is not rewritten.
 *
 * @type {Readonly<{
 *   claim_id: string,
 *   package_commit: string,
 *   package_provenance: string,
 *   statement: string,
 *   evidence_domain: ReadonlyArray<string>,
 *   confidence: string,
 *   attribution_status: string,
 *   evidence_scope: ReadonlyArray<string>,
 *   status: string,
 *   conditions: ReadonlyArray<string>,
 *   source_ids: ReadonlyArray<string>,
 * }>}
 */
export const ACCEPTED_WATER_CLAIM = Object.freeze({
  claim_id: WATER_CLAIM_ID,
  package_commit: WATER_CLAIM_PACKAGE_COMMIT,
  package_provenance: PACKAGE_PROVENANCE,
  statement:
    "Smartphone production can require substantial water use; local consequences depend on geography and indicator.",
  evidence_domain: Object.freeze(["water", "ecosystems", "human_health"]),
  confidence: "high_for_water_use_low_to_moderate_for_arbitrary_phone_consequence",
  attribution_status: ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE,
  evidence_scope: Object.freeze(["model_specific", "product_class"]),
  status: "QUALITATIVE",
  conditions: Object.freeze([
    "model-specific indicator required for quantitative output",
  ]),
  source_ids: Object.freeze(["S1", "S2"]),
});

/**
 * Frozen accepted source records for S1 and S2 from evidence/SOURCE_REGISTRY.json.
 * Each metadata limit is preserved exactly. Neither record is a water-indicator
 * value, unit, boundary, method, or model-specific quantitative measurement.
 * @type {Readonly<Record<string, Readonly<{
 *   source_id: string,
 *   package_commit: string,
 *   package_provenance: string,
 *   citation: string,
 *   scope: string,
 *   metadata_limit: string,
 * }>>>}
 */
export const ACCEPTED_WATER_SOURCES = Object.freeze({
  S1: Object.freeze({
    source_id: "S1",
    package_commit: WATER_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation:
      "Cordella, Alfieri & Sanfelix, 2021, Journal of Industrial Ecology / JRC-origin research.",
    scope:
      "Smartphone material-efficiency LCA; manufacturing, charging, repair/lifetime and 1:1 reuse scenarios.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
  S2: Object.freeze({
    source_id: "S2",
    package_commit: WATER_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation: "Sánchez, Baur & Eguren / Fraunhofer IZM, 2024, Fairphone 5 LCA.",
    scope:
      "Cradle-to-grave, ISO 14040/14044/14067, 3-year functional unit; commissioned by Fairphone B.V.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
});

/** Deterministic denial / non-emission reason codes. */
export const WATER_PATHWAY_REASON = Object.freeze({
  UNKNOWN_CLAIM: "unknown_claim",
  MISSING_CLAIM_IDENTITY: "missing_claim_identity",
  MISSING_CLAIM_VERSION: "missing_claim_version",
  WRONG_CLAIM_VERSION: "wrong_claim_version",
  CONFLICTING_CLAIM_REPRESENTATION: "conflicting_claim_representation",
  MALFORMED_CLAIM_IDENTITY: "malformed_claim_identity",
  PATHWAY_NOT_IN_AUTHORIZED_SLICE: "pathway_not_in_authorized_slice",
  MISSING_REQUIRED_CLAIM_METADATA: "missing_required_claim_metadata",
  MISSING_REQUIRED_SOURCE_METADATA: "missing_required_source_metadata",
  MISSING_REQUIRED_SCOPE: "missing_required_scope",
  MISSING_REQUIRED_CONDITIONS: "missing_required_conditions",
  MISSING_REQUIRED_ATTRIBUTION: "missing_required_attribution",
  NAMED_TARGET_ATTRIBUTION_PROHIBITED: "named_target_attribution_prohibited",
  SPECIFIC_DEVICE_ATTRIBUTION_PROHIBITED:
    "specific_device_attribution_prohibited",
  CALLER_SUPPLIED_AUTHORITY_PROHIBITED: "caller_supplied_authority_prohibited",
  GENERIC_LITRES_PER_PHONE_PROHIBITED: "generic_litres_per_phone_prohibited",
  DRINKING_WATER_DENIAL_PROHIBITED: "drinking_water_denial_prohibited",
  INDICATOR_CONFLATION_OR_CONVERSION_PROHIBITED:
    "indicator_conflation_or_conversion_prohibited",
  LOCAL_CONSEQUENCE_INFERENCE_PROHIBITED:
    "local_consequence_inference_prohibited",
  EXACT_INDIVIDUAL_HUMAN_OR_ECOLOGICAL_DAMAGE_PROHIBITED:
    "exact_individual_human_or_ecological_damage_prohibited",
  WATER_SCARCITY_OR_STRESS_OUTCOME_PROHIBITED:
    "water_scarcity_or_stress_outcome_prohibited",
  AFFECTED_POPULATION_PROHIBITED: "affected_population_prohibited",
  UNIFIED_SCORE_PROHIBITED: "unified_score_prohibited",
  UNSUPPORTED_CAUSAL_PROOF_WORDING: "unsupported_causal_proof_wording",
  UNKNOWN_COERCION_PROHIBITED: "unknown_coercion_prohibited",
  CASE_METADATA_NOT_PRODUCTION_AUTHORITY:
    "case_metadata_not_production_authority",
  UNSUPPORTED_REQUESTED_OUTPUT: "unsupported_requested_output",
  AUTHORITY_RECORD_CONFLICT: "authority_record_conflict",
  QUANTITATIVE_OR_LOCATION_OUTPUT_PROHIBITED:
    "quantitative_or_location_output_prohibited",
});

const GENERIC_LITRES_OUTPUTS = new Set([
  "generic_litres_per_phone",
  "litres_per_phone",
]);

const DRINKING_WATER_DENIAL_OUTPUTS = new Set([
  "litres_of_drinking_water_denied",
  "drinking_water_denied",
]);

const QUANTITATIVE_OR_LOCATION_OUTPUTS = new Set([
  "quantitative",
  "quantitative_output",
  "quantitative_water_indicator",
  "location",
  "probability",
]);

/** @param {unknown} value @returns {value is string} */
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/** @param {unknown} value @returns {value is ReadonlyArray<unknown>} */
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

/**
 * A present caller field is offered as authority. Null and omission stay
 * absent. Zero, false, and empty string are present and are not rewritten
 * into an accepted water measurement.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
function isCallerSupplied(value) {
  return value !== undefined && value !== null;
}

/**
 * Validate that a claim-shaped record has the metadata required to emit.
 *
 * @param {unknown} record
 * @returns {{ ok: true } | { ok: false, reason_code: string }}
 */
export function validateWaterClaimAuthorityRecord(record) {
  if (record === null || record === undefined || typeof record !== "object") {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  const r = /** @type {Record<string, unknown>} */ (record);

  if (!isNonEmptyString(r.claim_id)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.package_commit) || !isNonEmptyString(r.package_provenance)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.statement) || !isNonEmptyString(r.status)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.confidence)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyArray(r.evidence_domain) || !isNonEmptyArray(r.evidence_scope)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
    };
  }
  if (!isNonEmptyString(r.attribution_status)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
    };
  }
  if (!isNonEmptyArray(r.conditions)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
    };
  }
  if (!isNonEmptyArray(r.source_ids)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }
  for (const sourceId of r.source_ids) {
    if (!isNonEmptyString(sourceId)) {
      return {
        ok: false,
        reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }
  return { ok: true };
}

/**
 * Validate source records required by the water claim.
 * Structure must be complete, source_ids must match the accepted ordered set,
 * every map entry must be the accepted S1 or S2 source with exact field
 * equality, and extra/substituted sources fail closed. Non-object maps fail
 * closed before key enumeration.
 *
 * @param {ReadonlyArray<string>} sourceIds
 * @param {unknown} sourceMap
 * @returns {{ ok: true, sources: ReadonlyArray<Readonly<Record<string, unknown>>> } | { ok: false, reason_code: string }}
 */
export function validateWaterSourceRecords(sourceIds, sourceMap) {
  if (!authorityRecordsExactEqual(sourceIds, ACCEPTED_WATER_CLAIM.source_ids)) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    };
  }

  if (
    sourceMap === null ||
    sourceMap === undefined ||
    typeof sourceMap !== "object" ||
    Array.isArray(sourceMap)
  ) {
    return {
      ok: false,
      reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }

  const recordMap = /** @type {Readonly<Record<string, unknown>>} */ (sourceMap);

  const mapKeys = Object.keys(recordMap);
  for (const key of mapKeys) {
    if (!Object.prototype.hasOwnProperty.call(ACCEPTED_WATER_SOURCES, key)) {
      return {
        ok: false,
        reason_code: WATER_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
  }
  for (const sourceId of ACCEPTED_WATER_CLAIM.source_ids) {
    if (!Object.prototype.hasOwnProperty.call(recordMap, sourceId)) {
      return {
        ok: false,
        reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }

  /** @type {Array<Readonly<Record<string, unknown>>>} */
  const sources = [];
  for (const sourceId of sourceIds) {
    const source = recordMap[sourceId];
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return {
        ok: false,
        reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
    const s = /** @type {Record<string, unknown>} */ (source);
    if (
      !isNonEmptyString(s.source_id) ||
      !isNonEmptyString(s.package_commit) ||
      !isNonEmptyString(s.package_provenance) ||
      !isNonEmptyString(s.citation) ||
      !isNonEmptyString(s.scope) ||
      !isNonEmptyString(s.metadata_limit)
    ) {
      return {
        ok: false,
        reason_code: WATER_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
    if (s.source_id !== sourceId) {
      return {
        ok: false,
        reason_code: WATER_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
    const accepted = ACCEPTED_WATER_SOURCES[sourceId];
    if (!authorityRecordsExactEqual(s, accepted)) {
      return {
        ok: false,
        reason_code: WATER_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
    sources.push(accepted);
  }
  return { ok: true, sources: Object.freeze(sources) };
}

/**
 * @param {{
 *   emitted: boolean,
 *   reason_code: string | null,
 *   claim_id: string | null,
 *   claim_version: string | null,
 *   claim_ref: string | null,
 *   pathway: Readonly<Record<string, unknown>> | null,
 * }} fields
 */
function freezeDecision(fields) {
  return Object.freeze({
    emitted: fields.emitted,
    reason_code: fields.reason_code,
    claim_id: fields.claim_id,
    claim_version: fields.claim_version,
    claim_ref: fields.claim_ref,
    pathway: fields.pathway,
    quantitative_value: fields.pathway?.quantitative_value ?? null,
    value_range: null,
    unit: null,
    indicator: null,
    litres_per_phone: null,
    drinking_water_denied: null,
    location: null,
    geography: null,
    probability: null,
    affected_population: null,
    water_stress_outcome: null,
    water_scarcity_outcome: null,
    local_consequence: null,
    unified_score: null,
    exact_human_damage: null,
    exact_ecological_damage: null,
    named_target_attribution: null,
    specific_device_attribution: null,
  });
}

/**
 * Resolve the SP-PATH-WATER-001 qualitative pathway.
 *
 * Domain inputs only. Production behavior does not depend on case/test
 * identifiers as authority. Complete exact claim/source authority emits the
 * qualitative pathway only. The accepted registries contain no model-specific
 * water-indicator record, so value, range, indicator, unit, boundary, method,
 * model, geography, and caller citations cannot authorize a number or a place.
 *
 * @param {{
 *   claim_id?: string | null,
 *   claim_version?: string | null,
 *   package_commit?: string | null,
 *   claim_ref?: string | null,
 *   requested_output?: string | null,
 *   supplied_value?: unknown,
 *   supplied_value_range?: unknown,
 *   supplied_indicator?: unknown,
 *   supplied_unit?: unknown,
 *   supplied_boundary?: unknown,
 *   supplied_method?: unknown,
 *   supplied_model?: unknown,
 *   supplied_geography?: unknown,
 *   supplied_source_citation?: unknown,
 *   authority_indicator_record?: unknown,
 *   authority_quantitative_record?: unknown,
 *   request_generic_litres_per_phone?: boolean,
 *   request_litres_per_phone?: boolean,
 *   request_drinking_water_denied?: boolean,
 *   request_litres_of_drinking_water_denied?: boolean,
 *   request_indicator_conflation?: boolean,
 *   request_indicator_conversion?: boolean,
 *   convert_from?: string | null,
 *   convert_to?: string | null,
 *   request_local_consequence?: boolean,
 *   infer_local_consequence?: boolean,
 *   request_human_harm?: boolean,
 *   request_ecosystem_harm?: boolean,
 *   request_specific_device_attribution?: boolean,
 *   named_person?: string | null,
 *   named_community?: string | null,
 *   named_ecosystem?: string | null,
 *   named_species?: string | null,
 *   named_place?: string | null,
 *   named_watershed?: string | null,
 *   named_facility?: string | null,
 *   named_model_consequence?: string | null,
 *   named_event?: string | null,
 *   request_exact_individual_human_damage?: boolean,
 *   request_exact_individual_ecological_damage?: boolean,
 *   request_exact_individual_damage?: boolean,
 *   request_water_scarcity_outcome?: boolean,
 *   request_water_stress_outcome?: boolean,
 *   request_affected_population?: boolean,
 *   request_unified_score?: boolean,
 *   request_unified_environmental_score?: boolean,
 *   request_unified_safety_score?: boolean,
 *   request_protect_four_score?: boolean,
 *   request_unified_moral_score?: boolean,
 *   request_causal_proof?: boolean,
 *   request_quantitative_output?: boolean,
 *   request_location?: boolean,
 *   request_probability?: boolean,
 *   request_numerical_water?: boolean,
 *   coerce_unknown_to_zero?: boolean,
 *   coerce_unknown_to_false?: boolean,
 *   case_id?: string | null,
 *   assertion_id?: string | null,
 *   use_case_id_as_claim_authority?: boolean,
 *   authority_claim_record?: unknown,
 *   authority_source_map?: unknown,
 * }} [input]
 */
export function resolveWaterPathwayBoundary(input = {}) {
  const partsClaimId = isNonEmptyString(input.claim_id) ? input.claim_id : null;
  const partsVersion = isNonEmptyString(input.claim_version)
    ? input.claim_version
    : isNonEmptyString(input.package_commit)
      ? input.package_commit
      : null;
  const parsedFromRef = isNonEmptyString(input.claim_ref)
    ? parseEmpiricalClaimRef(input.claim_ref)
    : { claim_id: null, claim_version: null };

  const claimIdConflict =
    partsClaimId !== null &&
    parsedFromRef.claim_id !== null &&
    partsClaimId !== parsedFromRef.claim_id;
  const claimVersionConflict =
    partsVersion !== null &&
    parsedFromRef.claim_version !== null &&
    partsVersion !== parsedFromRef.claim_version;

  const claimId = partsClaimId ?? parsedFromRef.claim_id;
  const claimVersion = partsVersion ?? parsedFromRef.claim_version;

  /** @param {string} reasonCode */
  const deny = (reasonCode) =>
    freezeDecision({
      emitted: false,
      reason_code: reasonCode,
      claim_id: claimId,
      claim_version: claimVersion,
      claim_ref: claimId && claimVersion ? `${claimId}@${claimVersion}` : null,
      pathway: null,
    });

  if (input.use_case_id_as_claim_authority === true) {
    return deny(WATER_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }
  if (
    !claimId &&
    (isNonEmptyString(input.case_id) || isNonEmptyString(input.assertion_id))
  ) {
    return deny(WATER_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }

  if (claimIdConflict || claimVersionConflict) {
    return deny(WATER_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION);
  }

  if (!claimId) {
    return deny(WATER_PATHWAY_REASON.MISSING_CLAIM_IDENTITY);
  }

  if (typeof claimId !== "string" || !/^SP-PATH-[A-Z0-9-]+$/.test(claimId)) {
    return deny(WATER_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY);
  }

  if (!claimVersion) {
    return deny(WATER_PATHWAY_REASON.MISSING_CLAIM_VERSION);
  }

  if (PENDING_EMPIRICAL_PATHWAY_IDS.includes(claimId)) {
    return deny(WATER_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE);
  }

  if (claimId !== WATER_CLAIM_ID) {
    return deny(WATER_PATHWAY_REASON.UNKNOWN_CLAIM);
  }

  if (claimVersion !== WATER_CLAIM_PACKAGE_COMMIT) {
    return deny(WATER_PATHWAY_REASON.WRONG_CLAIM_VERSION);
  }

  if (input.request_specific_device_attribution === true) {
    return deny(WATER_PATHWAY_REASON.SPECIFIC_DEVICE_ATTRIBUTION_PROHIBITED);
  }

  if (
    isNonEmptyString(input.named_person) ||
    isNonEmptyString(input.named_community) ||
    isNonEmptyString(input.named_ecosystem) ||
    isNonEmptyString(input.named_species) ||
    isNonEmptyString(input.named_place) ||
    isNonEmptyString(input.named_watershed) ||
    isNonEmptyString(input.named_facility) ||
    isNonEmptyString(input.named_model_consequence) ||
    isNonEmptyString(input.named_event)
  ) {
    return deny(WATER_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED);
  }

  if (
    input.request_exact_individual_human_damage === true ||
    input.request_exact_individual_ecological_damage === true ||
    input.request_exact_individual_damage === true
  ) {
    return deny(
      WATER_PATHWAY_REASON.EXACT_INDIVIDUAL_HUMAN_OR_ECOLOGICAL_DAMAGE_PROHIBITED,
    );
  }

  if (
    input.request_water_scarcity_outcome === true ||
    input.request_water_stress_outcome === true
  ) {
    return deny(WATER_PATHWAY_REASON.WATER_SCARCITY_OR_STRESS_OUTCOME_PROHIBITED);
  }

  if (input.request_affected_population === true) {
    return deny(WATER_PATHWAY_REASON.AFFECTED_POPULATION_PROHIBITED);
  }

  if (
    input.request_local_consequence === true ||
    input.infer_local_consequence === true ||
    input.request_human_harm === true ||
    input.request_ecosystem_harm === true
  ) {
    return deny(WATER_PATHWAY_REASON.LOCAL_CONSEQUENCE_INFERENCE_PROHIBITED);
  }

  if (
    input.request_unified_score === true ||
    input.request_unified_environmental_score === true ||
    input.request_unified_safety_score === true ||
    input.request_protect_four_score === true ||
    input.request_unified_moral_score === true
  ) {
    return deny(WATER_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED);
  }

  if (input.request_causal_proof === true) {
    return deny(WATER_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING);
  }

  if (
    input.coerce_unknown_to_zero === true ||
    input.coerce_unknown_to_false === true
  ) {
    return deny(WATER_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED);
  }

  if (
    isCallerSupplied(input.supplied_value) ||
    isCallerSupplied(input.supplied_value_range) ||
    isCallerSupplied(input.supplied_indicator) ||
    isCallerSupplied(input.supplied_unit) ||
    isCallerSupplied(input.supplied_boundary) ||
    isCallerSupplied(input.supplied_method) ||
    isCallerSupplied(input.supplied_model) ||
    isCallerSupplied(input.supplied_geography) ||
    isCallerSupplied(input.supplied_source_citation) ||
    isCallerSupplied(input.authority_indicator_record) ||
    isCallerSupplied(input.authority_quantitative_record)
  ) {
    return deny(WATER_PATHWAY_REASON.CALLER_SUPPLIED_AUTHORITY_PROHIBITED);
  }

  if (
    input.request_generic_litres_per_phone === true ||
    input.request_litres_per_phone === true
  ) {
    return deny(WATER_PATHWAY_REASON.GENERIC_LITRES_PER_PHONE_PROHIBITED);
  }

  if (
    input.request_drinking_water_denied === true ||
    input.request_litres_of_drinking_water_denied === true
  ) {
    return deny(WATER_PATHWAY_REASON.DRINKING_WATER_DENIAL_PROHIBITED);
  }

  if (
    input.request_indicator_conflation === true ||
    input.request_indicator_conversion === true ||
    isNonEmptyString(input.convert_from) ||
    isNonEmptyString(input.convert_to)
  ) {
    return deny(
      WATER_PATHWAY_REASON.INDICATOR_CONFLATION_OR_CONVERSION_PROHIBITED,
    );
  }

  if (
    input.request_quantitative_output === true ||
    input.request_location === true ||
    input.request_probability === true ||
    input.request_numerical_water === true
  ) {
    return deny(WATER_PATHWAY_REASON.QUANTITATIVE_OR_LOCATION_OUTPUT_PROHIBITED);
  }

  const requestedOutput = isNonEmptyString(input.requested_output)
    ? input.requested_output
    : PATHWAY_KIND_QUALITATIVE;

  if (GENERIC_LITRES_OUTPUTS.has(requestedOutput)) {
    return deny(WATER_PATHWAY_REASON.GENERIC_LITRES_PER_PHONE_PROHIBITED);
  }
  if (DRINKING_WATER_DENIAL_OUTPUTS.has(requestedOutput)) {
    return deny(WATER_PATHWAY_REASON.DRINKING_WATER_DENIAL_PROHIBITED);
  }
  if (NON_CONFLATABLE_WATER_INDICATOR_LABELS.includes(requestedOutput)) {
    return deny(
      WATER_PATHWAY_REASON.INDICATOR_CONFLATION_OR_CONVERSION_PROHIBITED,
    );
  }
  if (QUANTITATIVE_OR_LOCATION_OUTPUTS.has(requestedOutput)) {
    return deny(WATER_PATHWAY_REASON.QUANTITATIVE_OR_LOCATION_OUTPUT_PROHIBITED);
  }
  if (requestedOutput !== PATHWAY_KIND_QUALITATIVE) {
    return deny(WATER_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT);
  }

  const claimRecord =
    input.authority_claim_record === undefined
      ? ACCEPTED_WATER_CLAIM
      : input.authority_claim_record;

  const claimValidation = validateWaterClaimAuthorityRecord(claimRecord);
  if (!claimValidation.ok) {
    return deny(claimValidation.reason_code);
  }

  // Production authority must be exactly the frozen registry-backed claim record.
  // Array order is significant. Object key order is not a second authority.
  if (!authorityRecordsExactEqual(claimRecord, ACCEPTED_WATER_CLAIM)) {
    return deny(WATER_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT);
  }

  const sourceMap =
    input.authority_source_map === undefined
      ? ACCEPTED_WATER_SOURCES
      : input.authority_source_map;

  const sourceValidation = validateWaterSourceRecords(
    ACCEPTED_WATER_CLAIM.source_ids,
    sourceMap,
  );
  if (!sourceValidation.ok) {
    return deny(sourceValidation.reason_code);
  }

  const pathway = Object.freeze({
    pathway_kind: PATHWAY_KIND_QUALITATIVE,
    claim_id: WATER_CLAIM_ID,
    claim_version: WATER_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${WATER_CLAIM_ID}@${WATER_CLAIM_PACKAGE_COMMIT}`,
    package_provenance: PACKAGE_PROVENANCE,
    package_commit: WATER_CLAIM_PACKAGE_COMMIT,
    statement: ACCEPTED_WATER_CLAIM.statement,
    evidence_domain: Object.freeze([...ACCEPTED_WATER_CLAIM.evidence_domain]),
    evidence_scope: Object.freeze([...ACCEPTED_WATER_CLAIM.evidence_scope]),
    confidence: ACCEPTED_WATER_CLAIM.confidence,
    attribution_status: ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE,
    attribution_limits: Object.freeze([
      "not_attributable_to_specific_device",
      "qualitative_status_preserved",
      "product_class_and_model_specific_scope_preserved",
      "confidence_qualification_preserved",
      "local_consequences_depend_on_geography_and_indicator",
      "no_inferred_local_consequence_harm_location_probability_or_affected_population",
      "no_quantitative_output_without_accepted_model_specific_water_indicator_record",
      "no_generic_litres_per_phone",
      "no_litres_of_drinking_water_denied",
      "no_conflation_or_conversion_among_withdrawal_consumption_scarcity_deprivation_stress_use_or_drinking_water",
      "no_named_person_community_ecosystem_species_place_watershed_facility_model_consequence_or_event_attributed_to_one_phone",
      "no_exact_individual_human_or_ecological_damage",
      "no_water_scarcity_or_stress_outcome",
      "no_unified_environmental_safety_protect_four_or_moral_score",
      "qualitative_pathway_is_not_causal_proof",
    ]),
    conditions: Object.freeze([...ACCEPTED_WATER_CLAIM.conditions]),
    status: ACCEPTED_WATER_CLAIM.status,
    quantitative_value: null,
    value_range: null,
    unit: null,
    indicator: null,
    boundary: null,
    method: null,
    model_identity: null,
    geography: null,
    location: null,
    probability: null,
    litres_per_phone: null,
    drinking_water_denied: null,
    withdrawal: null,
    consumption: null,
    scarcity: null,
    deprivation: null,
    stress: null,
    water_use_quantity: null,
    affected_population: null,
    water_stress_outcome: null,
    water_scarcity_outcome: null,
    local_consequence: null,
    model_specific_or_fallback_status: null,
    major_assumptions: Object.freeze([...ACCEPTED_WATER_CLAIM.conditions]),
    source_ids: Object.freeze([...ACCEPTED_WATER_CLAIM.source_ids]),
    sources: sourceValidation.sources,
  });

  return freezeDecision({
    emitted: true,
    reason_code: null,
    claim_id: WATER_CLAIM_ID,
    claim_version: WATER_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${WATER_CLAIM_ID}@${WATER_CLAIM_PACKAGE_COMMIT}`,
    pathway,
  });
}
