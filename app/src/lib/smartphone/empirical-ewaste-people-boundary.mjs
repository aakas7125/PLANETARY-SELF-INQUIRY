/**
 * Pure deterministic empirical e-waste-people pathway authority boundary.
 *
 * Authority (read-only; this module does not create or revise claims):
 * - contracts/EMPIRICAL_SMARTPHONE_V0.md
 * - evidence/CLAIM_REGISTRY.json (`SP-PATH-EWASTE-PEOPLE-001`)
 * - evidence/SOURCE_REGISTRY.json (`S11`)
 * - provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md (package provenance)
 *
 * Emits only the accepted conditional pathway for `SP-PATH-EWASTE-PEOPLE-001`
 * when the complete boundary passes. Reuses exact-authority discipline from
 * the accepted climate, mining-ecosystem, and mining-people slices without
 * generalizing beyond this record.
 */

import {
  authorityRecordsExactEqual,
  parseEmpiricalClaimRef,
} from "./empirical-climate-boundary.mjs";

/** Accepted package provenance pin for the e-waste-people pathway claim. */
export const PACKAGE_PROVENANCE = "R&E-V0-SMARTPHONE-0.3.0";

/**
 * Accepted claim version identity = registry `package_commit`.
 * No silent normalization or substitution.
 */
export const EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT =
  "024a95392d2e1555a3c9b598fdc291bd341c3d6b";

export const EWASTE_PEOPLE_CLAIM_ID = "SP-PATH-EWASTE-PEOPLE-001";

export const ATTRIBUTION_CONDITIONAL_PATHWAY = "conditional_pathway";

export const PATHWAY_KIND_QUALITATIVE_CONDITIONAL =
  "qualitative_conditional_pathway";

/**
 * Contract old-device fate values. None of these establishes unsafe or
 * informal handling.
 */
export const NON_ESTABLISHING_OLD_DEVICE_FATES = Object.freeze([
  "continue_use",
  "sell_or_gift_for_reuse",
  "trade_in_unknown_next_use",
  "store_in_drawer",
  "formal_recycling",
  "discard_general_waste",
  "unknown",
]);

/**
 * Same-record fates that affirm the device is not in unsafe or informal
 * e-waste processing. Source package: `continue_use` and
 * `sell_or_gift_for_reuse` set `e_waste_now = 0`; `store_in_drawer` sets
 * `e_waste_now = false`. `formal_recycling` is a distinct formal route and
 * is not this pathway. An explicit unsafe/informal-handling flag must not
 * override these values.
 */
export const CONTRADICTORY_OLD_DEVICE_FATES = Object.freeze([
  "continue_use",
  "sell_or_gift_for_reuse",
  "store_in_drawer",
  "formal_recycling",
]);

/**
 * Uncertain same-record fates. Source package: trade-in next use remains
 * uncertain (`e_waste_now = unknown`); general discard may show a conditional
 * pathway but must not be assigned an informal destination or probability
 * without route evidence; unknown fate must not be assumed into recycling,
 * dumping, reuse, or storage. These values do not establish the condition
 * and are never copied into the pathway as a route.
 */
export const UNCERTAIN_OLD_DEVICE_FATES = Object.freeze([
  "trade_in_unknown_next_use",
  "discard_general_waste",
  "unknown",
]);

/**
 * Pathway IDs kept pending by HQ for later empirical slices.
 * `SP-PATH-EWASTE-ECO-001` is covered by the e-waste-ecosystem boundary module.
 */
export const PENDING_EMPIRICAL_PATHWAY_IDS = Object.freeze([
  "SP-PATH-WATER-001",
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
export const ACCEPTED_EWASTE_PEOPLE_CLAIM = Object.freeze({
  claim_id: EWASTE_PEOPLE_CLAIM_ID,
  package_commit: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
  package_provenance: PACKAGE_PROVENANCE,
  statement:
    "Unsafe or informal e-waste processing can expose people to hazardous substances and adverse health outcomes.",
  evidence_domain: Object.freeze(["waste", "human_health"]),
  confidence: "high",
  attribution_status: ATTRIBUTION_CONDITIONAL_PATHWAY,
  evidence_scope: Object.freeze(["authoritative_assessment"]),
  status: "APPROVED",
  conditions: Object.freeze(["unsafe or informal handling occurs"]),
  source_ids: Object.freeze(["S11"]),
});

/**
 * Frozen accepted source record for S11 from evidence/SOURCE_REGISTRY.json.
 * @type {Readonly<Record<string, Readonly<{
 *   source_id: string,
 *   package_commit: string,
 *   package_provenance: string,
 *   citation: string,
 *   scope: string,
 *   metadata_limit: string,
 * }>>>}
 */
export const ACCEPTED_EWASTE_PEOPLE_SOURCES = Object.freeze({
  S11: Object.freeze({
    source_id: "S11",
    package_commit: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation:
      "WHO, Children and Digital Dumpsites, 2021 plus updated e-waste health material.",
    scope: "Unsafe e-waste exposure and health pathway.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
});

/** Deterministic denial / non-emission reason codes. */
export const EWASTE_PEOPLE_PATHWAY_REASON = Object.freeze({
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
  INFERRED_UNSAFE_OR_INFORMAL_HANDLING_PROHIBITED:
    "inferred_unsafe_or_informal_handling_prohibited",
  FATE_OR_CONTEXT_DOES_NOT_ESTABLISH_UNSAFE_OR_INFORMAL_HANDLING:
    "fate_or_context_does_not_establish_unsafe_or_informal_handling",
  CONTRADICTORY_OLD_DEVICE_FATE: "contradictory_old_device_fate",
  NAMED_TARGET_ATTRIBUTION_PROHIBITED: "named_target_attribution_prohibited",
  DEVICE_PERSON_OR_COMMUNITY_ATTRIBUTION_PROHIBITED:
    "device_person_or_community_attribution_prohibited",
  ILLNESS_INJURY_DEATH_OR_VICTIM_COUNTS_PROHIBITED:
    "illness_injury_death_or_victim_counts_prohibited",
  EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED:
    "exposure_dose_risk_or_probability_prohibited",
  GLOBAL_COLLECTION_RATE_AS_INDIVIDUAL_ROUTE_PROHIBITED:
    "global_collection_rate_as_individual_route_prohibited",
  EXACT_INDIVIDUAL_OR_COMMUNITY_DAMAGE_PROHIBITED:
    "exact_individual_or_community_damage_prohibited",
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
export function validateEwastePeopleClaimAuthorityRecord(record) {
  if (record === null || record === undefined || typeof record !== "object") {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  const r = /** @type {Record<string, unknown>} */ (record);

  if (!isNonEmptyString(r.claim_id)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.package_commit) || !isNonEmptyString(r.package_provenance)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.statement) || !isNonEmptyString(r.status)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.confidence)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyArray(r.evidence_domain) || !isNonEmptyArray(r.evidence_scope)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
    };
  }
  if (!isNonEmptyString(r.attribution_status)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
    };
  }
  if (!isNonEmptyArray(r.conditions)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
    };
  }
  if (!isNonEmptyArray(r.source_ids)) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }
  for (const sourceId of r.source_ids) {
    if (!isNonEmptyString(sourceId)) {
      return {
        ok: false,
        reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }
  return { ok: true };
}

/**
 * Validate source records required by the e-waste-people claim.
 * Structure must be complete, source_ids must match the accepted ordered set,
 * every map entry must be the accepted S11 source with exact field equality,
 * and extra/substituted sources fail closed.
 *
 * @param {ReadonlyArray<string>} sourceIds
 * @param {unknown} sourceMap
 * @returns {{ ok: true, sources: ReadonlyArray<Readonly<Record<string, unknown>>> } | { ok: false, reason_code: string }}
 */
export function validateEwastePeopleSourceRecords(sourceIds, sourceMap) {
  if (
    !authorityRecordsExactEqual(sourceIds, ACCEPTED_EWASTE_PEOPLE_CLAIM.source_ids)
  ) {
    return {
      ok: false,
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
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
      reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }

  const recordMap = /** @type {Readonly<Record<string, unknown>>} */ (sourceMap);

  const mapKeys = Object.keys(recordMap);
  for (const key of mapKeys) {
    if (!Object.prototype.hasOwnProperty.call(ACCEPTED_EWASTE_PEOPLE_SOURCES, key)) {
      return {
        ok: false,
        reason_code: EWASTE_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
  }
  for (const sourceId of ACCEPTED_EWASTE_PEOPLE_CLAIM.source_ids) {
    if (!Object.prototype.hasOwnProperty.call(recordMap, sourceId)) {
      return {
        ok: false,
        reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
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
        reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
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
        reason_code: EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
    if (s.source_id !== sourceId) {
      return {
        ok: false,
        reason_code: EWASTE_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
    const accepted = ACCEPTED_EWASTE_PEOPLE_SOURCES[sourceId];
    if (!authorityRecordsExactEqual(s, accepted)) {
      return {
        ok: false,
        reason_code: EWASTE_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
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
    burden: null,
    risk: null,
    illness_count: null,
    injury_count: null,
    death_count: null,
    victim_count: null,
    location: null,
    probability: null,
    collection_rate: null,
    unified_score: null,
    exact_individual_damage: null,
    exact_community_damage: null,
    named_target_attribution: null,
    device_person_attribution: null,
  });
}

/**
 * @param {unknown} fate
 * @param {readonly string[]} fates
 * @returns {boolean}
 */
function isListedFate(fate, fates) {
  return isNonEmptyString(fate) && fates.includes(fate);
}

/**
 * @param {unknown} fate
 * @returns {boolean}
 */
function isNonEstablishingFate(fate) {
  return isListedFate(fate, NON_ESTABLISHING_OLD_DEVICE_FATES);
}

/**
 * @param {unknown} fate
 * @returns {boolean}
 */
function isContradictoryOldDeviceFate(fate) {
  return isListedFate(fate, CONTRADICTORY_OLD_DEVICE_FATES);
}

/**
 * Resolve the SP-PATH-EWASTE-PEOPLE-001 qualitative conditional pathway.
 *
 * Domain inputs only. Production behavior does not depend on case/test
 * identifiers as authority. Unsafe or informal handling emits only when that
 * condition is explicitly established. Fate, disposal, and global collection-
 * rate context do not establish it. Affirmative non-processing fates
 * contradict emission for the same device record. Uncertain fates are not
 * turned into a processing route.
 *
 * @param {{
 *   claim_id?: string | null,
 *   claim_version?: string | null,
 *   package_commit?: string | null,
 *   claim_ref?: string | null,
 *   requested_output?: string | null,
 *   unsafe_or_informal_handling_established?: boolean | null,
 *   unsafe_or_informal_handling_inferred?: boolean,
 *   old_device_fate?: string | null,
 *   global_ewaste_collection_rate_context?: boolean | number | null,
 *   named_person?: string | null,
 *   named_child?: string | null,
 *   named_worker?: string | null,
 *   named_community?: string | null,
 *   named_place?: string | null,
 *   named_site?: string | null,
 *   named_event?: string | null,
 *   request_one_device_to_person_exposure?: boolean,
 *   request_one_device_to_community_exposure?: boolean,
 *   request_one_device_health_outcome?: boolean,
 *   request_illness_count?: boolean,
 *   request_injury_count?: boolean,
 *   request_death_count?: boolean,
 *   request_victim_count?: boolean,
 *   request_illness_injury_death_or_victim_counts?: boolean,
 *   request_exposure?: boolean,
 *   request_dose?: boolean,
 *   request_risk?: boolean,
 *   request_probability?: boolean,
 *   request_global_collection_rate_as_individual_route?: boolean,
 *   request_global_collection_rate_as_probability?: boolean,
 *   request_exact_individual_damage?: boolean,
 *   request_exact_community_damage?: boolean,
 *   request_unified_score?: boolean,
 *   request_unified_environmental_score?: boolean,
 *   request_unified_safety_score?: boolean,
 *   request_protect_four_score?: boolean,
 *   request_unified_moral_score?: boolean,
 *   request_causal_proof?: boolean,
 *   request_numerical_burden?: boolean,
 *   request_location?: boolean,
 *   request_quantitative_output?: boolean,
 *   coerce_unknown_to_zero?: boolean,
 *   coerce_unknown_to_false?: boolean,
 *   case_id?: string | null,
 *   assertion_id?: string | null,
 *   use_case_id_as_claim_authority?: boolean,
 *   authority_claim_record?: unknown,
 *   authority_source_map?: unknown,
 * }} [input]
 */
export function resolveEwastePeoplePathwayBoundary(input = {}) {
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
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }
  if (
    !claimId &&
    (isNonEmptyString(input.case_id) || isNonEmptyString(input.assertion_id))
  ) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }

  if (claimIdConflict || claimVersionConflict) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION);
  }

  if (!claimId) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_IDENTITY);
  }

  if (typeof claimId !== "string" || !/^SP-PATH-[A-Z0-9-]+$/.test(claimId)) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY);
  }

  if (!claimVersion) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_VERSION);
  }

  if (PENDING_EMPIRICAL_PATHWAY_IDS.includes(claimId)) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE);
  }

  if (claimId !== EWASTE_PEOPLE_CLAIM_ID) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.UNKNOWN_CLAIM);
  }

  if (claimVersion !== EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.WRONG_CLAIM_VERSION);
  }

  if (
    input.request_one_device_to_person_exposure === true ||
    input.request_one_device_to_community_exposure === true ||
    input.request_one_device_health_outcome === true
  ) {
    return deny(
      EWASTE_PEOPLE_PATHWAY_REASON.DEVICE_PERSON_OR_COMMUNITY_ATTRIBUTION_PROHIBITED,
    );
  }

  if (
    isNonEmptyString(input.named_person) ||
    isNonEmptyString(input.named_child) ||
    isNonEmptyString(input.named_worker) ||
    isNonEmptyString(input.named_community) ||
    isNonEmptyString(input.named_place) ||
    isNonEmptyString(input.named_site) ||
    isNonEmptyString(input.named_event)
  ) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED);
  }

  if (
    input.request_illness_count === true ||
    input.request_injury_count === true ||
    input.request_death_count === true ||
    input.request_victim_count === true ||
    input.request_illness_injury_death_or_victim_counts === true
  ) {
    return deny(
      EWASTE_PEOPLE_PATHWAY_REASON.ILLNESS_INJURY_DEATH_OR_VICTIM_COUNTS_PROHIBITED,
    );
  }

  if (
    input.request_exposure === true ||
    input.request_dose === true ||
    input.request_risk === true ||
    input.request_probability === true
  ) {
    return deny(
      EWASTE_PEOPLE_PATHWAY_REASON.EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED,
    );
  }

  if (
    input.request_global_collection_rate_as_individual_route === true ||
    input.request_global_collection_rate_as_probability === true ||
    typeof input.global_ewaste_collection_rate_context === "number"
  ) {
    return deny(
      EWASTE_PEOPLE_PATHWAY_REASON.GLOBAL_COLLECTION_RATE_AS_INDIVIDUAL_ROUTE_PROHIBITED,
    );
  }

  if (
    input.request_exact_individual_damage === true ||
    input.request_exact_community_damage === true
  ) {
    return deny(
      EWASTE_PEOPLE_PATHWAY_REASON.EXACT_INDIVIDUAL_OR_COMMUNITY_DAMAGE_PROHIBITED,
    );
  }

  if (
    input.request_unified_score === true ||
    input.request_unified_environmental_score === true ||
    input.request_unified_safety_score === true ||
    input.request_protect_four_score === true ||
    input.request_unified_moral_score === true
  ) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED);
  }

  if (input.request_causal_proof === true) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING);
  }

  if (
    input.request_numerical_burden === true ||
    input.request_location === true ||
    input.request_quantitative_output === true
  ) {
    return deny(
      EWASTE_PEOPLE_PATHWAY_REASON.QUANTITATIVE_OR_LOCATION_OUTPUT_PROHIBITED,
    );
  }

  if (
    input.coerce_unknown_to_zero === true ||
    input.coerce_unknown_to_false === true
  ) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED);
  }

  const requestedOutput = isNonEmptyString(input.requested_output)
    ? input.requested_output
    : PATHWAY_KIND_QUALITATIVE_CONDITIONAL;

  if (requestedOutput !== PATHWAY_KIND_QUALITATIVE_CONDITIONAL) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT);
  }

  const claimRecord =
    input.authority_claim_record === undefined
      ? ACCEPTED_EWASTE_PEOPLE_CLAIM
      : input.authority_claim_record;

  const claimValidation = validateEwastePeopleClaimAuthorityRecord(claimRecord);
  if (!claimValidation.ok) {
    return deny(claimValidation.reason_code);
  }

  // Production authority must be exactly the frozen registry-backed claim record.
  // Array order is significant. Object key order is not a second authority.
  if (!authorityRecordsExactEqual(claimRecord, ACCEPTED_EWASTE_PEOPLE_CLAIM)) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT);
  }

  const sourceMap =
    input.authority_source_map === undefined
      ? ACCEPTED_EWASTE_PEOPLE_SOURCES
      : input.authority_source_map;

  const sourceValidation = validateEwastePeopleSourceRecords(
    ACCEPTED_EWASTE_PEOPLE_CLAIM.source_ids,
    sourceMap,
  );
  if (!sourceValidation.ok) {
    return deny(sourceValidation.reason_code);
  }

  // Explicit inference is not establishment, even alongside a true flag.
  if (input.unsafe_or_informal_handling_inferred === true) {
    return deny(
      EWASTE_PEOPLE_PATHWAY_REASON.INFERRED_UNSAFE_OR_INFORMAL_HANDLING_PROHIBITED,
    );
  }

  const fateOrContextSupplied =
    isNonEstablishingFate(input.old_device_fate) ||
    isNonEmptyString(input.old_device_fate) ||
    input.global_ewaste_collection_rate_context === true;

  // Missing, false, and unknown stay non-emitting. A supplied fate or global
  // collection-rate context does not fill that gap.
  if (input.unsafe_or_informal_handling_established !== true) {
    if (fateOrContextSupplied) {
      return deny(
        EWASTE_PEOPLE_PATHWAY_REASON.FATE_OR_CONTEXT_DOES_NOT_ESTABLISH_UNSAFE_OR_INFORMAL_HANDLING,
      );
    }
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.CONDITION_NOT_SATISFIED);
  }

  // Fail closed: an explicit handling flag must not override a same-record
  // fate that affirmatively means this device is not in unsafe or informal
  // e-waste processing.
  if (isContradictoryOldDeviceFate(input.old_device_fate)) {
    return deny(EWASTE_PEOPLE_PATHWAY_REASON.CONTRADICTORY_OLD_DEVICE_FATE);
  }

  // Uncertain fates stay unresolved. Emission below, when authority otherwise
  // passes, is the accepted conditional pathway only. The fate is not copied
  // as a route, destination, or probability.

  const pathway = Object.freeze({
    pathway_kind: PATHWAY_KIND_QUALITATIVE_CONDITIONAL,
    claim_id: EWASTE_PEOPLE_CLAIM_ID,
    claim_version: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${EWASTE_PEOPLE_CLAIM_ID}@${EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    package_provenance: PACKAGE_PROVENANCE,
    package_commit: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
    statement: ACCEPTED_EWASTE_PEOPLE_CLAIM.statement,
    evidence_domain: Object.freeze([
      ...ACCEPTED_EWASTE_PEOPLE_CLAIM.evidence_domain,
    ]),
    evidence_scope: Object.freeze([
      ...ACCEPTED_EWASTE_PEOPLE_CLAIM.evidence_scope,
    ]),
    confidence: ACCEPTED_EWASTE_PEOPLE_CLAIM.confidence,
    attribution_status: ATTRIBUTION_CONDITIONAL_PATHWAY,
    attribution_limits: Object.freeze([
      "conditional_pathway",
      "authoritative_assessment_scope_preserved",
      "no_exposure_or_health_outcome_attributed_to_one_phone",
      "no_named_person_child_worker_community_place_site_or_event_attribution",
      "no_illness_injury_death_or_victim_counts",
      "no_exact_exposure_dose_risk_or_probability",
      "no_global_collection_rate_as_individual_route_or_probability",
      "no_exact_individual_or_community_damage",
      "no_unified_environmental_safety_protect_four_or_moral_score",
      "no_numerical_burden_score_probability_or_location",
      "fate_or_disposal_context_does_not_establish_unsafe_or_informal_handling",
      "qualitative_pathway_is_not_causal_proof",
    ]),
    conditions: Object.freeze([...ACCEPTED_EWASTE_PEOPLE_CLAIM.conditions]),
    status: ACCEPTED_EWASTE_PEOPLE_CLAIM.status,
    // Qualitative conditional pathway — preserve absence.
    quantitative_value: null,
    value_range: null,
    unit: null,
    metric: null,
    exposure: null,
    dose: null,
    burden: null,
    risk: null,
    illness_count: null,
    injury_count: null,
    death_count: null,
    victim_count: null,
    location: null,
    probability: null,
    collection_rate: null,
    model_specific_or_fallback_status: null,
    major_assumptions: Object.freeze([...ACCEPTED_EWASTE_PEOPLE_CLAIM.conditions]),
    source_ids: Object.freeze([...ACCEPTED_EWASTE_PEOPLE_CLAIM.source_ids]),
    sources: sourceValidation.sources,
  });

  return freezeDecision({
    emitted: true,
    reason_code: null,
    claim_id: EWASTE_PEOPLE_CLAIM_ID,
    claim_version: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${EWASTE_PEOPLE_CLAIM_ID}@${EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    pathway,
  });
}
