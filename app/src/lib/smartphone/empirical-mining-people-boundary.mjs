/**
 * Pure deterministic empirical mining-people pathway authority boundary.
 *
 * Authority (read-only; this module does not create or revise claims):
 * - contracts/EMPIRICAL_SMARTPHONE_V0.md
 * - evidence/CLAIM_REGISTRY.json (`SP-PATH-MINING-PEOPLE-001`)
 * - evidence/SOURCE_REGISTRY.json (`S10`)
 * - provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md (package provenance)
 *
 * Emits only the accepted qualitative pathway for `SP-PATH-MINING-PEOPLE-001`
 * when the complete boundary passes. Reuses exact-authority discipline from
 * the accepted climate and mining-ecosystem slices without generalizing beyond
 * these records.
 */

import {
  authorityRecordsExactEqual,
  parseEmpiricalClaimRef,
} from "./empirical-climate-boundary.mjs";

/** Accepted package provenance pin for the mining-people pathway claim. */
export const PACKAGE_PROVENANCE = "R&E-V0-SMARTPHONE-0.3.0";

/**
 * Accepted claim version identity = registry `package_commit`.
 * No silent normalization or substitution.
 */
export const MINING_PEOPLE_CLAIM_PACKAGE_COMMIT =
  "024a95392d2e1555a3c9b598fdc291bd341c3d6b";

export const MINING_PEOPLE_CLAIM_ID = "SP-PATH-MINING-PEOPLE-001";

export const ATTRIBUTION_CONDITIONAL_PATHWAY = "conditional_pathway";

export const PATHWAY_KIND_QUALITATIVE_CONDITIONAL =
  "qualitative_conditional_pathway";

/**
 * Pathway IDs kept pending by HQ for later empirical slices.
 * None remain. E-waste-people, e-waste-eco, and water are covered by their
 * own boundary modules.
 * @type {readonly string[]}
 */
export const PENDING_EMPIRICAL_PATHWAY_IDS = Object.freeze([]);

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
export const ACCEPTED_MINING_PEOPLE_CLAIM = Object.freeze({
  claim_id: MINING_PEOPLE_CLAIM_ID,
  package_commit: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
  package_provenance: PACKAGE_PROVENANCE,
  statement:
    "Mining and processing can expose workers and communities to environmental and occupational hazards.",
  evidence_domain: Object.freeze(["materials", "human_health"]),
  confidence: "moderate",
  attribution_status: ATTRIBUTION_CONDITIONAL_PATHWAY,
  evidence_scope: Object.freeze(["systematic_review", "site_specific"]),
  status: "QUALITATIVE",
  conditions: Object.freeze(["relevant supply-chain geography/process"]),
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
export const ACCEPTED_MINING_PEOPLE_SOURCES = Object.freeze({
  S10: Object.freeze({
    source_id: "S10",
    package_commit: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation: "Giljum et al., Nature Reviews Earth & Environment, 2025.",
    scope: "Global metal-mining land/water/biodiversity pathways.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
});

/** Deterministic denial / non-emission reason codes. */
export const MINING_PEOPLE_PATHWAY_REASON = Object.freeze({
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
  GENERIC_INFERRED_GEOGRAPHY_PROCESS_PROHIBITED:
    "generic_inferred_geography_process_prohibited",
  DEVICE_WORKER_ATTRIBUTION_PROHIBITED: "device_worker_attribution_prohibited",
  NAMED_TARGET_ATTRIBUTION_PROHIBITED: "named_target_attribution_prohibited",
  ILLNESS_INJURY_OR_DEATH_COUNTS_PROHIBITED:
    "illness_injury_or_death_counts_prohibited",
  EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED:
    "exposure_dose_risk_or_probability_prohibited",
  EXACT_INDIVIDUAL_OR_COMMUNITY_DAMAGE_PROHIBITED:
    "exact_individual_or_community_damage_prohibited",
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
export function validateMiningPeopleClaimAuthorityRecord(record) {
  if (record === null || record === undefined || typeof record !== "object") {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  const r = /** @type {Record<string, unknown>} */ (record);

  if (!isNonEmptyString(r.claim_id)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.package_commit) || !isNonEmptyString(r.package_provenance)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.statement) || !isNonEmptyString(r.status)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.confidence)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyArray(r.evidence_domain) || !isNonEmptyArray(r.evidence_scope)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
    };
  }
  if (!isNonEmptyString(r.attribution_status)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
    };
  }
  if (!isNonEmptyArray(r.conditions)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
    };
  }
  if (!isNonEmptyArray(r.source_ids)) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }
  for (const sourceId of r.source_ids) {
    if (!isNonEmptyString(sourceId)) {
      return {
        ok: false,
        reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }
  return { ok: true };
}

/**
 * Validate source records required by the mining-people claim.
 * Structure must be complete, source_ids must match the accepted ordered set,
 * every map entry must be an accepted mining-people source with exact field equality,
 * and extra/substituted sources fail closed.
 *
 * @param {ReadonlyArray<string>} sourceIds
 * @param {unknown} sourceMap
 * @returns {{ ok: true, sources: ReadonlyArray<Readonly<Record<string, unknown>>> } | { ok: false, reason_code: string }}
 */
export function validateMiningPeopleSourceRecords(sourceIds, sourceMap) {
  if (
    !authorityRecordsExactEqual(sourceIds, ACCEPTED_MINING_PEOPLE_CLAIM.source_ids)
  ) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    };
  }

  // Fail closed for malformed source authority before Object.keys.
  // null, arrays, and other non-plain-object maps are not accepted records.
  if (
    sourceMap === null ||
    sourceMap === undefined ||
    typeof sourceMap !== "object" ||
    Array.isArray(sourceMap)
  ) {
    return {
      ok: false,
      reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }

  const recordMap = /** @type {Readonly<Record<string, unknown>>} */ (sourceMap);

  const mapKeys = Object.keys(recordMap);
  for (const key of mapKeys) {
    if (!Object.prototype.hasOwnProperty.call(ACCEPTED_MINING_PEOPLE_SOURCES, key)) {
      return {
        ok: false,
        reason_code: MINING_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
  }
  for (const sourceId of ACCEPTED_MINING_PEOPLE_CLAIM.source_ids) {
    if (!Object.prototype.hasOwnProperty.call(recordMap, sourceId)) {
      return {
        ok: false,
        reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }

  /** @type {Array<Readonly<Record<string, unknown>>>} */
  const sources = [];
  for (const sourceId of sourceIds) {
    const source = recordMap[sourceId];
    if (!source || typeof source !== "object") {
      return {
        ok: false,
        reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
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
        reason_code: MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
    if (s.source_id !== sourceId) {
      return {
        ok: false,
        reason_code: MINING_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
    const accepted = ACCEPTED_MINING_PEOPLE_SOURCES[sourceId];
    if (!authorityRecordsExactEqual(s, accepted)) {
      return {
        ok: false,
        reason_code: MINING_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
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
    exposure: null,
    dose: null,
    risk: null,
    illness_count: null,
    injury_count: null,
    death_count: null,
    location: null,
    probability: null,
    unified_score: null,
    exact_individual_damage: null,
    exact_community_damage: null,
    named_target_attribution: null,
    device_worker_attribution: null,
  });
}

/**
 * Resolve the SP-PATH-MINING-PEOPLE-001 qualitative conditional pathway.
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
 *   relevant_supply_chain_geography_process_established?: boolean | null,
 *   supply_chain_geography_process_generic_inferred?: boolean,
 *   named_worker?: string | null,
 *   named_community?: string | null,
 *   named_person?: string | null,
 *   named_place?: string | null,
 *   named_site?: string | null,
 *   named_event?: string | null,
 *   request_device_to_worker_attribution?: boolean,
 *   request_device_to_community_attribution?: boolean,
 *   request_worker_community_outcome_to_one_phone?: boolean,
 *   request_illness_injury_or_death_counts?: boolean,
 *   request_exposure?: boolean,
 *   request_dose?: boolean,
 *   request_risk?: boolean,
 *   request_probability?: boolean,
 *   request_exact_individual_damage?: boolean,
 *   request_exact_community_damage?: boolean,
 *   request_unified_score?: boolean,
 *   request_causal_proof?: boolean,
 *   request_numerical_burden?: boolean,
 *   request_location?: boolean,
 *   coerce_unknown_to_zero?: boolean,
 *   coerce_unknown_to_false?: boolean,
 *   case_id?: string | null,
 *   assertion_id?: string | null,
 *   use_case_id_as_claim_authority?: boolean,
 *   authority_claim_record?: unknown,
 *   authority_source_map?: Readonly<Record<string, unknown>>,
 * }} [input]
 */
export function resolveMiningPeoplePathwayBoundary(input = {}) {
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
    return deny(MINING_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }
  if (
    !claimId &&
    (isNonEmptyString(input.case_id) || isNonEmptyString(input.assertion_id))
  ) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }

  if (claimIdConflict || claimVersionConflict) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION);
  }

  if (!claimId) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_IDENTITY);
  }

  if (typeof claimId !== "string" || !/^SP-PATH-[A-Z0-9-]+$/.test(claimId)) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY);
  }

  if (!claimVersion) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_VERSION);
  }

  if (PENDING_EMPIRICAL_PATHWAY_IDS.includes(claimId)) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE);
  }

  if (claimId !== MINING_PEOPLE_CLAIM_ID) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.UNKNOWN_CLAIM);
  }

  if (claimVersion !== MINING_PEOPLE_CLAIM_PACKAGE_COMMIT) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.WRONG_CLAIM_VERSION);
  }

  // Explicit prohibited request categories fail closed before emission.
  if (
    input.request_device_to_worker_attribution === true ||
    input.request_device_to_community_attribution === true ||
    input.request_worker_community_outcome_to_one_phone === true
  ) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.DEVICE_WORKER_ATTRIBUTION_PROHIBITED);
  }

  if (
    isNonEmptyString(input.named_worker) ||
    isNonEmptyString(input.named_community) ||
    isNonEmptyString(input.named_person) ||
    isNonEmptyString(input.named_place) ||
    isNonEmptyString(input.named_site) ||
    isNonEmptyString(input.named_event)
  ) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED);
  }

  if (input.request_illness_injury_or_death_counts === true) {
    return deny(
      MINING_PEOPLE_PATHWAY_REASON.ILLNESS_INJURY_OR_DEATH_COUNTS_PROHIBITED,
    );
  }

  if (
    input.request_exposure === true ||
    input.request_dose === true ||
    input.request_risk === true ||
    input.request_probability === true
  ) {
    return deny(
      MINING_PEOPLE_PATHWAY_REASON.EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED,
    );
  }

  if (
    input.request_exact_individual_damage === true ||
    input.request_exact_community_damage === true
  ) {
    return deny(
      MINING_PEOPLE_PATHWAY_REASON.EXACT_INDIVIDUAL_OR_COMMUNITY_DAMAGE_PROHIBITED,
    );
  }

  if (input.request_unified_score === true) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED);
  }

  if (input.request_causal_proof === true) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING);
  }

  if (
    input.request_numerical_burden === true ||
    input.request_location === true
  ) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.QUANTITATIVE_OUTPUT_PROHIBITED);
  }

  if (
    input.coerce_unknown_to_zero === true ||
    input.coerce_unknown_to_false === true
  ) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED);
  }

  if (input.supply_chain_geography_process_generic_inferred === true) {
    return deny(
      MINING_PEOPLE_PATHWAY_REASON.GENERIC_INFERRED_GEOGRAPHY_PROCESS_PROHIBITED,
    );
  }

  const requestedOutput = isNonEmptyString(input.requested_output)
    ? input.requested_output
    : PATHWAY_KIND_QUALITATIVE_CONDITIONAL;

  if (requestedOutput !== PATHWAY_KIND_QUALITATIVE_CONDITIONAL) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT);
  }

  const claimRecord =
    input.authority_claim_record === undefined
      ? ACCEPTED_MINING_PEOPLE_CLAIM
      : input.authority_claim_record;

  const claimValidation = validateMiningPeopleClaimAuthorityRecord(claimRecord);
  if (!claimValidation.ok) {
    return deny(claimValidation.reason_code);
  }

  // Production authority must be exactly the frozen registry-backed claim record.
  if (!authorityRecordsExactEqual(claimRecord, ACCEPTED_MINING_PEOPLE_CLAIM)) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT);
  }

  const sourceMap =
    input.authority_source_map === undefined
      ? ACCEPTED_MINING_PEOPLE_SOURCES
      : input.authority_source_map;

  const sourceValidation = validateMiningPeopleSourceRecords(
    ACCEPTED_MINING_PEOPLE_CLAIM.source_ids,
    sourceMap,
  );
  if (!sourceValidation.ok) {
    return deny(sourceValidation.reason_code);
  }

  // Condition: relevant supply-chain geography/process must be explicitly established.
  // Unknown stays unknown — never coerce missing/false/generic-inferred to emission.
  if (input.relevant_supply_chain_geography_process_established !== true) {
    return deny(MINING_PEOPLE_PATHWAY_REASON.CONDITION_NOT_SATISFIED);
  }

  const pathway = Object.freeze({
    pathway_kind: PATHWAY_KIND_QUALITATIVE_CONDITIONAL,
    claim_id: MINING_PEOPLE_CLAIM_ID,
    claim_version: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${MINING_PEOPLE_CLAIM_ID}@${MINING_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    package_provenance: PACKAGE_PROVENANCE,
    package_commit: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
    statement: ACCEPTED_MINING_PEOPLE_CLAIM.statement,
    evidence_domain: Object.freeze([
      ...ACCEPTED_MINING_PEOPLE_CLAIM.evidence_domain,
    ]),
    evidence_scope: Object.freeze([...ACCEPTED_MINING_PEOPLE_CLAIM.evidence_scope]),
    confidence: ACCEPTED_MINING_PEOPLE_CLAIM.confidence,
    attribution_status: ATTRIBUTION_CONDITIONAL_PATHWAY,
    attribution_limits: Object.freeze([
      "conditional_pathway",
      "site_specific_scope_preserved",
      "no_worker_or_community_outcome_attributed_to_one_phone",
      "no_named_worker_community_person_place_site_or_event_attribution_to_one_phone",
      "no_illness_injury_or_death_counts",
      "no_exact_exposure_dose_risk_or_probability",
      "no_exact_individual_or_community_damage",
      "no_unified_environmental_safety_protect_four_or_moral_score",
      "no_numerical_burden_damage_score_probability_or_location",
      "qualitative_pathway_is_not_causal_proof",
    ]),
    conditions: Object.freeze([...ACCEPTED_MINING_PEOPLE_CLAIM.conditions]),
    status: ACCEPTED_MINING_PEOPLE_CLAIM.status,
    // Qualitative pathway — preserve absence; do not invent zero/false/location.
    quantitative_value: null,
    value_range: null,
    unit: null,
    metric: null,
    exposure: null,
    dose: null,
    risk: null,
    illness_count: null,
    injury_count: null,
    death_count: null,
    location: null,
    probability: null,
    model_specific_or_fallback_status: null,
    major_assumptions: Object.freeze([...ACCEPTED_MINING_PEOPLE_CLAIM.conditions]),
    source_ids: Object.freeze([...ACCEPTED_MINING_PEOPLE_CLAIM.source_ids]),
    sources: sourceValidation.sources,
  });

  return freezeDecision({
    emitted: true,
    reason_code: null,
    claim_id: MINING_PEOPLE_CLAIM_ID,
    claim_version: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${MINING_PEOPLE_CLAIM_ID}@${MINING_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    pathway,
  });
}
