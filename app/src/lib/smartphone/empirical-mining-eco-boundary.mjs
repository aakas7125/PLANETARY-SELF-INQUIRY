/**
 * Pure deterministic empirical mining-ecosystem pathway authority boundary.
 *
 * Authority (read-only; this module does not create or revise claims):
 * - contracts/EMPIRICAL_SMARTPHONE_V0.md
 * - evidence/CLAIM_REGISTRY.json (`SP-PATH-MINING-ECO-001`)
 * - evidence/SOURCE_REGISTRY.json (`S10`)
 * - provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md (package provenance)
 *
 * Emits only the accepted qualitative pathway for `SP-PATH-MINING-ECO-001`
 * when the complete boundary passes. Reuses exact-authority discipline from
 * the accepted climate slice without generalizing beyond these records.
 */

import {
  authorityRecordsExactEqual,
  parseEmpiricalClaimRef,
} from "./empirical-climate-boundary.mjs";

/** Accepted package provenance pin for the mining-ecosystem pathway claim. */
export const PACKAGE_PROVENANCE = "R&E-V0-SMARTPHONE-0.3.0";

/**
 * Accepted claim version identity = registry `package_commit`.
 * No silent normalization or substitution.
 */
export const MINING_ECO_CLAIM_PACKAGE_COMMIT =
  "024a95392d2e1555a3c9b598fdc291bd341c3d6b";

export const MINING_ECO_CLAIM_ID = "SP-PATH-MINING-ECO-001";

export const ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE =
  "not_attributable_to_specific_device";

export const PATHWAY_KIND_QUALITATIVE_CONDITIONAL =
  "qualitative_conditional_pathway";

/**
 * Pathway IDs kept pending by HQ for later empirical slices.
 * `SP-PATH-MINING-PEOPLE-001` is covered by the mining-people boundary module.
 * `SP-PATH-EWASTE-PEOPLE-001` is covered by the e-waste-people boundary module.
 */
export const PENDING_EMPIRICAL_PATHWAY_IDS = Object.freeze([
  "SP-PATH-EWASTE-ECO-001",
  "SP-PATH-WATER-001",
]);

/**
 * Frozen accepted claim record — exact fields from evidence/CLAIM_REGISTRY.json.
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
export const ACCEPTED_MINING_ECO_CLAIM = Object.freeze({
  claim_id: MINING_ECO_CLAIM_ID,
  package_commit: MINING_ECO_CLAIM_PACKAGE_COMMIT,
  package_provenance: PACKAGE_PROVENANCE,
  statement:
    "Metal extraction and processing can cause land, water and biodiversity impacts.",
  evidence_domain: Object.freeze(["materials", "water", "ecosystems"]),
  confidence: "high",
  attribution_status: ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE,
  evidence_scope: Object.freeze(["systematic_review"]),
  status: "APPROVED_QUALITATIVE",
  conditions: Object.freeze([
    "relevant primary metal extraction occurs",
    "magnitude/location depend on mine, ore, processing and ecosystem",
  ]),
  source_ids: Object.freeze(["S10"]),
});

/**
 * Frozen accepted source record for S10 from evidence/SOURCE_REGISTRY.json.
 * @type {Readonly<Record<string, Readonly<{
 *   source_id: string,
 *   package_commit: string,
 *   package_provenance: string,
 *   citation: string,
 *   scope: string,
 *   metadata_limit: string,
 * }>>>}
 */
export const ACCEPTED_MINING_ECO_SOURCES = Object.freeze({
  S10: Object.freeze({
    source_id: "S10",
    package_commit: MINING_ECO_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation: "Giljum et al., Nature Reviews Earth & Environment, 2025.",
    scope: "Global metal-mining land/water/biodiversity pathways.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
});

/** Deterministic denial / non-emission reason codes. */
export const MINING_ECO_PATHWAY_REASON = Object.freeze({
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
  CONDITION_NOT_SATISFIED: "condition_not_satisfied",
  DEVICE_MINE_ATTRIBUTION_PROHIBITED: "device_mine_attribution_prohibited",
  NAMED_TARGET_ATTRIBUTION_PROHIBITED: "named_target_attribution_prohibited",
  BIODIVERSITY_QUANTITY_PROHIBITED: "biodiversity_quantity_prohibited",
  FIXED_PRIMARY_ORE_MASS_PROHIBITED: "fixed_primary_ore_mass_prohibited",
  EXACT_INDIVIDUAL_DAMAGE_PROHIBITED: "exact_individual_damage_prohibited",
  UNIFIED_SCORE_PROHIBITED: "unified_score_prohibited",
  UNSUPPORTED_CAUSAL_PROOF_WORDING: "unsupported_causal_proof_wording",
  UNKNOWN_COERCION_PROHIBITED: "unknown_coercion_prohibited",
  CASE_METADATA_NOT_PRODUCTION_AUTHORITY:
    "case_metadata_not_production_authority",
  UNSUPPORTED_REQUESTED_OUTPUT: "unsupported_requested_output",
  AUTHORITY_RECORD_CONFLICT: "authority_record_conflict",
  QUANTITATIVE_OUTPUT_PROHIBITED: "quantitative_output_prohibited",
});

/** @param {unknown} value @returns {value is string} */
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/** @param {unknown} value @returns {value is ReadonlyArray<unknown>} */
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Validate that a claim-shaped record has the metadata required to emit.
 *
 * @param {unknown} record
 * @returns {{ ok: true } | { ok: false, reason_code: string }}
 */
export function validateMiningEcoClaimAuthorityRecord(record) {
  if (record === null || record === undefined || typeof record !== "object") {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  const r = /** @type {Record<string, unknown>} */ (record);

  if (!isNonEmptyString(r.claim_id)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.package_commit) || !isNonEmptyString(r.package_provenance)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.statement) || !isNonEmptyString(r.status)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.confidence)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyArray(r.evidence_domain) || !isNonEmptyArray(r.evidence_scope)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
    };
  }
  if (!isNonEmptyString(r.attribution_status)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
    };
  }
  if (!isNonEmptyArray(r.conditions)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
    };
  }
  if (!isNonEmptyArray(r.source_ids)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }
  for (const sourceId of r.source_ids) {
    if (!isNonEmptyString(sourceId)) {
      return {
        ok: false,
        reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }
  return { ok: true };
}

/**
 * Validate source records required by the mining-ecosystem claim.
 * Structure must be complete, source_ids must match the accepted ordered set,
 * every map entry must be an accepted mining-eco source with exact field equality,
 * and extra/substituted sources fail closed.
 *
 * @param {ReadonlyArray<string>} sourceIds
 * @param {Readonly<Record<string, unknown>>} sourceMap
 * @returns {{ ok: true, sources: ReadonlyArray<Readonly<Record<string, unknown>>> } | { ok: false, reason_code: string }}
 */
export function validateMiningEcoSourceRecords(sourceIds, sourceMap) {
  if (!authorityRecordsExactEqual(sourceIds, ACCEPTED_MINING_ECO_CLAIM.source_ids)) {
    return {
      ok: false,
      reason_code: MINING_ECO_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    };
  }

  const mapKeys = Object.keys(sourceMap);
  for (const key of mapKeys) {
    if (!Object.prototype.hasOwnProperty.call(ACCEPTED_MINING_ECO_SOURCES, key)) {
      return {
        ok: false,
        reason_code: MINING_ECO_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
  }
  for (const sourceId of ACCEPTED_MINING_ECO_CLAIM.source_ids) {
    if (!Object.prototype.hasOwnProperty.call(sourceMap, sourceId)) {
      return {
        ok: false,
        reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }

  /** @type {Array<Readonly<Record<string, unknown>>>} */
  const sources = [];
  for (const sourceId of sourceIds) {
    const source = sourceMap[sourceId];
    if (!source || typeof source !== "object") {
      return {
        ok: false,
        reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
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
        reason_code: MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
    if (s.source_id !== sourceId) {
      return {
        ok: false,
        reason_code: MINING_ECO_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
    const accepted = ACCEPTED_MINING_ECO_SOURCES[sourceId];
    if (!authorityRecordsExactEqual(s, accepted)) {
      return {
        ok: false,
        reason_code: MINING_ECO_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
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
    // Inspectable non-emission markers — never coerce unknowns to zero/false.
    quantitative_value: fields.pathway?.quantitative_value ?? null,
    biodiversity_area: null,
    species_loss_quantity: null,
    primary_ore_mass: null,
    material_mass: null,
    location: null,
    probability: null,
    unified_score: null,
    exact_individual_damage: null,
    named_target_attribution: null,
    device_mine_attribution: null,
  });
}

/**
 * Resolve the SP-PATH-MINING-ECO-001 qualitative conditional pathway.
 *
 * Domain inputs only: claim identity/version, requested output kind, condition
 * satisfaction, and explicit prohibited-request markers. Production behavior
 * does not depend on case/test identifiers as authority.
 *
 * @param {{
 *   claim_id?: string | null,
 *   claim_version?: string | null,
 *   package_commit?: string | null,
 *   claim_ref?: string | null,
 *   requested_output?: string | null,
 *   relevant_primary_metal_extraction_occurs?: boolean | null,
 *   named_species?: string | null,
 *   named_ecosystem?: string | null,
 *   named_place?: string | null,
 *   named_community?: string | null,
 *   named_event?: string | null,
 *   request_device_to_mine_attribution?: boolean,
 *   request_mine_to_phone_attribution?: boolean,
 *   request_device_to_ecosystem_attribution?: boolean,
 *   request_biodiversity_quantity?: boolean,
 *   request_species_loss_quantity?: boolean,
 *   request_fixed_primary_ore_mass?: boolean,
 *   request_fixed_material_mass?: boolean,
 *   request_exact_individual_damage?: boolean,
 *   request_unified_score?: boolean,
 *   request_causal_proof?: boolean,
 *   request_numerical_burden?: boolean,
 *   request_location?: boolean,
 *   request_probability?: boolean,
 *   coerce_unknown_to_zero?: boolean,
 *   coerce_unknown_to_false?: boolean,
 *   case_id?: string | null,
 *   assertion_id?: string | null,
 *   use_case_id_as_claim_authority?: boolean,
 *   authority_claim_record?: unknown,
 *   authority_source_map?: Readonly<Record<string, unknown>>,
 * }} [input]
 */
export function resolveMiningEcoPathwayBoundary(input = {}) {
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

  // Case/test metadata is never production empirical authority.
  if (input.use_case_id_as_claim_authority === true) {
    return deny(MINING_ECO_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }
  if (
    !claimId &&
    (isNonEmptyString(input.case_id) || isNonEmptyString(input.assertion_id))
  ) {
    return deny(MINING_ECO_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }

  if (claimIdConflict || claimVersionConflict) {
    return deny(MINING_ECO_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION);
  }

  if (!claimId) {
    return deny(MINING_ECO_PATHWAY_REASON.MISSING_CLAIM_IDENTITY);
  }

  if (typeof claimId !== "string" || !/^SP-PATH-[A-Z0-9-]+$/.test(claimId)) {
    return deny(MINING_ECO_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY);
  }

  if (!claimVersion) {
    return deny(MINING_ECO_PATHWAY_REASON.MISSING_CLAIM_VERSION);
  }

  if (PENDING_EMPIRICAL_PATHWAY_IDS.includes(claimId)) {
    return deny(MINING_ECO_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE);
  }

  if (claimId !== MINING_ECO_CLAIM_ID) {
    return deny(MINING_ECO_PATHWAY_REASON.UNKNOWN_CLAIM);
  }

  if (claimVersion !== MINING_ECO_CLAIM_PACKAGE_COMMIT) {
    return deny(MINING_ECO_PATHWAY_REASON.WRONG_CLAIM_VERSION);
  }

  // Explicit prohibited request categories fail closed before emission.
  if (
    input.request_device_to_mine_attribution === true ||
    input.request_mine_to_phone_attribution === true ||
    input.request_device_to_ecosystem_attribution === true
  ) {
    return deny(MINING_ECO_PATHWAY_REASON.DEVICE_MINE_ATTRIBUTION_PROHIBITED);
  }

  if (
    isNonEmptyString(input.named_species) ||
    isNonEmptyString(input.named_ecosystem) ||
    isNonEmptyString(input.named_place) ||
    isNonEmptyString(input.named_community) ||
    isNonEmptyString(input.named_event)
  ) {
    return deny(MINING_ECO_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED);
  }

  if (
    input.request_biodiversity_quantity === true ||
    input.request_species_loss_quantity === true
  ) {
    return deny(MINING_ECO_PATHWAY_REASON.BIODIVERSITY_QUANTITY_PROHIBITED);
  }

  if (
    input.request_fixed_primary_ore_mass === true ||
    input.request_fixed_material_mass === true
  ) {
    return deny(MINING_ECO_PATHWAY_REASON.FIXED_PRIMARY_ORE_MASS_PROHIBITED);
  }

  if (input.request_exact_individual_damage === true) {
    return deny(MINING_ECO_PATHWAY_REASON.EXACT_INDIVIDUAL_DAMAGE_PROHIBITED);
  }

  if (input.request_unified_score === true) {
    return deny(MINING_ECO_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED);
  }

  if (input.request_causal_proof === true) {
    return deny(MINING_ECO_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING);
  }

  if (
    input.request_numerical_burden === true ||
    input.request_location === true ||
    input.request_probability === true
  ) {
    return deny(MINING_ECO_PATHWAY_REASON.QUANTITATIVE_OUTPUT_PROHIBITED);
  }

  if (
    input.coerce_unknown_to_zero === true ||
    input.coerce_unknown_to_false === true
  ) {
    return deny(MINING_ECO_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED);
  }

  const requestedOutput = isNonEmptyString(input.requested_output)
    ? input.requested_output
    : PATHWAY_KIND_QUALITATIVE_CONDITIONAL;

  if (requestedOutput !== PATHWAY_KIND_QUALITATIVE_CONDITIONAL) {
    return deny(MINING_ECO_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT);
  }

  const claimRecord =
    input.authority_claim_record === undefined
      ? ACCEPTED_MINING_ECO_CLAIM
      : input.authority_claim_record;

  const claimValidation = validateMiningEcoClaimAuthorityRecord(claimRecord);
  if (!claimValidation.ok) {
    return deny(claimValidation.reason_code);
  }

  // Production authority must be exactly the frozen registry-backed claim record.
  if (!authorityRecordsExactEqual(claimRecord, ACCEPTED_MINING_ECO_CLAIM)) {
    return deny(MINING_ECO_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT);
  }

  const sourceMap =
    input.authority_source_map === undefined
      ? ACCEPTED_MINING_ECO_SOURCES
      : input.authority_source_map;

  const sourceValidation = validateMiningEcoSourceRecords(
    ACCEPTED_MINING_ECO_CLAIM.source_ids,
    sourceMap,
  );
  if (!sourceValidation.ok) {
    return deny(sourceValidation.reason_code);
  }

  // Condition: relevant primary metal extraction must be explicitly established.
  // Unknown stays unknown — never coerce missing/false to approved emission.
  if (input.relevant_primary_metal_extraction_occurs !== true) {
    return deny(MINING_ECO_PATHWAY_REASON.CONDITION_NOT_SATISFIED);
  }

  const pathway = Object.freeze({
    pathway_kind: PATHWAY_KIND_QUALITATIVE_CONDITIONAL,
    claim_id: MINING_ECO_CLAIM_ID,
    claim_version: MINING_ECO_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${MINING_ECO_CLAIM_ID}@${MINING_ECO_CLAIM_PACKAGE_COMMIT}`,
    package_provenance: PACKAGE_PROVENANCE,
    package_commit: MINING_ECO_CLAIM_PACKAGE_COMMIT,
    statement: ACCEPTED_MINING_ECO_CLAIM.statement,
    evidence_domain: Object.freeze([...ACCEPTED_MINING_ECO_CLAIM.evidence_domain]),
    evidence_scope: Object.freeze([...ACCEPTED_MINING_ECO_CLAIM.evidence_scope]),
    confidence: ACCEPTED_MINING_ECO_CLAIM.confidence,
    attribution_status: ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE,
    attribution_limits: Object.freeze([
      "not_attributable_to_specific_device",
      "no_device_to_mine_mine_to_phone_or_device_to_ecosystem_attribution",
      "no_named_species_ecosystem_place_community_or_event_attribution_to_one_phone",
      "no_biodiversity_area_or_species_loss_quantities",
      "no_fixed_primary_ore_or_material_mass_for_arbitrary_phone",
      "no_exact_individual_ecological_or_human_damage",
      "no_unified_environmental_safety_protect_four_or_moral_score",
      "no_numerical_burden_damage_score_probability_or_location",
      "qualitative_pathway_is_not_causal_proof",
    ]),
    conditions: Object.freeze([...ACCEPTED_MINING_ECO_CLAIM.conditions]),
    status: ACCEPTED_MINING_ECO_CLAIM.status,
    // Qualitative pathway — preserve absence; do not invent zero/false/location.
    quantitative_value: null,
    value_range: null,
    unit: null,
    metric: null,
    biodiversity_area: null,
    species_loss_quantity: null,
    primary_ore_mass: null,
    material_mass: null,
    location: null,
    probability: null,
    model_specific_or_fallback_status: null,
    major_assumptions: Object.freeze([...ACCEPTED_MINING_ECO_CLAIM.conditions]),
    source_ids: Object.freeze([...ACCEPTED_MINING_ECO_CLAIM.source_ids]),
    sources: sourceValidation.sources,
  });

  return freezeDecision({
    emitted: true,
    reason_code: null,
    claim_id: MINING_ECO_CLAIM_ID,
    claim_version: MINING_ECO_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${MINING_ECO_CLAIM_ID}@${MINING_ECO_CLAIM_PACKAGE_COMMIT}`,
    pathway,
  });
}
