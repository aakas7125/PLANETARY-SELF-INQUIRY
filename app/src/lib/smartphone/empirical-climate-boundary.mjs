/**
 * Pure deterministic empirical climate-pathway authority boundary.
 *
 * Authority (read-only; this module does not create or revise claims):
 * - contracts/EMPIRICAL_SMARTPHONE_V0.md
 * - evidence/CLAIM_REGISTRY.json (`SP-PATH-CLIMATE-001`)
 * - evidence/SOURCE_REGISTRY.json (`S1`, `S8`, `S9`)
 * - provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md (package provenance)
 *
 * Emits only the accepted conditional pressure-to-outcome pathway for
 * `SP-PATH-CLIMATE-001` when the complete boundary passes. All other
 * SP-PATH-* IDs remain non-emitting in this slice.
 */

/** Accepted package provenance pin for the climate pathway claim. */
export const PACKAGE_PROVENANCE = "R&E-V0-SMARTPHONE-0.3.0";

/**
 * Accepted claim version identity = registry `package_commit`.
 * No silent normalization or substitution.
 */
export const CLIMATE_CLAIM_PACKAGE_COMMIT =
  "024a95392d2e1555a3c9b598fdc291bd341c3d6b";

export const CLIMATE_CLAIM_ID = "SP-PATH-CLIMATE-001";

/** Climate indicator convention retained from the accepted empirical contract. */
export const CLIMATE_UNIT = "kg CO2e";
export const CLIMATE_METRIC = "GWP100";

export const ATTRIBUTION_PRESSURE_TO_OUTCOME = "pressure_to_outcome";
export const PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME =
  "conditional_pressure_to_outcome_pathway";

/**
 * Pathway IDs kept pending by HQ for later empirical slices.
 * None remain. Mining-eco, mining-people, e-waste-people, e-waste-eco, and
 * water are covered by their own boundary modules.
 * @type {readonly string[]}
 */
export const PENDING_EMPIRICAL_PATHWAY_IDS = Object.freeze([]);

/**
 * Frozen accepted claim record — exact fields from evidence/CLAIM_REGISTRY.json.
 * Do not invent bibliographic or quantitative fields beyond this authority.
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
export const ACCEPTED_CLIMATE_CLAIM = Object.freeze({
  claim_id: CLIMATE_CLAIM_ID,
  package_commit: CLIMATE_CLAIM_PACKAGE_COMMIT,
  package_provenance: PACKAGE_PROVENANCE,
  statement:
    "Manufacturing-related smartphone GHG emissions contribute incrementally to climate change; climate change increases risks to people and ecosystems.",
  evidence_domain: Object.freeze(["climate", "human_health", "ecosystems"]),
  confidence: "high",
  attribution_status: ATTRIBUTION_PRESSURE_TO_OUTCOME,
  evidence_scope: Object.freeze(["product_class", "global_assessment"]),
  status: "APPROVED",
  conditions: Object.freeze([
    "scenario produces GHG emissions",
    "no individual victim or ecosystem attribution",
  ]),
  source_ids: Object.freeze(["S1", "S8", "S9"]),
});

/**
 * Frozen accepted source records for S1/S8/S9 from evidence/SOURCE_REGISTRY.json.
 * @type {Readonly<Record<string, Readonly<{
 *   source_id: string,
 *   package_commit: string,
 *   package_provenance: string,
 *   citation: string,
 *   scope: string,
 *   metadata_limit: string,
 * }>>>}
 */
export const ACCEPTED_CLIMATE_SOURCES = Object.freeze({
  S1: Object.freeze({
    source_id: "S1",
    package_commit: CLIMATE_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation:
      "Cordella, Alfieri & Sanfelix, 2021, Journal of Industrial Ecology / JRC-origin research.",
    scope:
      "Smartphone material-efficiency LCA; manufacturing, charging, repair/lifetime and 1:1 reuse scenarios.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
  S8: Object.freeze({
    source_id: "S8",
    package_commit: CLIMATE_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation: "IPCC AR6 WGI.",
    scope: "Cumulative CO2 to warming.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
  S9: Object.freeze({
    source_id: "S9",
    package_commit: CLIMATE_CLAIM_PACKAGE_COMMIT,
    package_provenance: PACKAGE_PROVENANCE,
    citation: "IPCC AR6 WGII.",
    scope: "Climate impacts on people/ecosystems and interdependence.",
    metadata_limit:
      "Only package-provided metadata recorded; no DOI, URL, author expansion or publication details inferred.",
  }),
});

/** Deterministic denial / non-emission reason codes. */
export const CLIMATE_PATHWAY_REASON = Object.freeze({
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
  NAMED_TARGET_ATTRIBUTION_PROHIBITED: "named_target_attribution_prohibited",
  VICTIMS_OR_DEATHS_PROHIBITED: "victims_or_deaths_prohibited",
  EXACT_INDIVIDUAL_DAMAGE_PROHIBITED: "exact_individual_damage_prohibited",
  UNIFIED_SCORE_PROHIBITED: "unified_score_prohibited",
  UNSUPPORTED_CAUSAL_PROOF_WORDING: "unsupported_causal_proof_wording",
  UNKNOWN_COERCION_PROHIBITED: "unknown_coercion_prohibited",
  CASE_METADATA_NOT_PRODUCTION_AUTHORITY:
    "case_metadata_not_production_authority",
  UNSUPPORTED_REQUESTED_OUTPUT: "unsupported_requested_output",
  AUTHORITY_RECORD_CONFLICT: "authority_record_conflict",
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
 * Exact structural equality for authority records (ordered arrays; no extra keys).
 * @param {unknown} left
 * @param {unknown} right
 */
export function authorityRecordsExactEqual(left, right) {
  if (left === right) {
    return true;
  }
  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) {
      return false;
    }
    if (left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; i += 1) {
      if (!authorityRecordsExactEqual(left[i], right[i])) {
        return false;
      }
    }
    return true;
  }
  if (
    left === null ||
    right === null ||
    typeof left !== "object" ||
    typeof right !== "object"
  ) {
    return false;
  }
  const leftKeys = Object.keys(/** @type {Record<string, unknown>} */ (left)).sort();
  const rightKeys = Object.keys(/** @type {Record<string, unknown>} */ (right)).sort();
  if (!authorityRecordsExactEqual(leftKeys, rightKeys)) {
    return false;
  }
  const leftRecord = /** @type {Record<string, unknown>} */ (left);
  const rightRecord = /** @type {Record<string, unknown>} */ (right);
  for (const key of leftKeys) {
    if (!authorityRecordsExactEqual(leftRecord[key], rightRecord[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Parse `CLAIM_ID@package_commit` without inventing parts.
 * @param {unknown} claimRef
 * @returns {{ claim_id: string | null, claim_version: string | null }}
 */
export function parseEmpiricalClaimRef(claimRef) {
  if (!isNonEmptyString(claimRef)) {
    return { claim_id: null, claim_version: null };
  }
  const at = claimRef.lastIndexOf("@");
  if (at <= 0 || at === claimRef.length - 1) {
    return { claim_id: claimRef, claim_version: null };
  }
  return {
    claim_id: claimRef.slice(0, at),
    claim_version: claimRef.slice(at + 1),
  };
}

/**
 * Validate that a claim-shaped record has the metadata required to emit.
 * Used for the accepted climate record and for injected incomplete-authority tests.
 *
 * @param {unknown} record
 * @returns {{ ok: true } | { ok: false, reason_code: string }}
 */
export function validateClimateClaimAuthorityRecord(record) {
  if (record === null || record === undefined || typeof record !== "object") {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  const r = /** @type {Record<string, unknown>} */ (record);

  if (!isNonEmptyString(r.claim_id)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.package_commit) || !isNonEmptyString(r.package_provenance)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.statement) || !isNonEmptyString(r.status)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyString(r.confidence)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
    };
  }
  if (!isNonEmptyArray(r.evidence_domain) || !isNonEmptyArray(r.evidence_scope)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
    };
  }
  if (!isNonEmptyString(r.attribution_status)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
    };
  }
  if (!isNonEmptyArray(r.conditions)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
    };
  }
  if (!isNonEmptyArray(r.source_ids)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
    };
  }
  for (const sourceId of r.source_ids) {
    if (!isNonEmptyString(sourceId)) {
      return {
        ok: false,
        reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
  }
  return { ok: true };
}

/**
 * Validate source records required by the climate claim.
 * Structure must be complete, source_ids must match the accepted ordered set,
 * every map entry must be an accepted climate source with exact field equality,
 * and extra/substituted sources fail closed.
 *
 * @param {ReadonlyArray<string>} sourceIds
 * @param {Readonly<Record<string, unknown>>} sourceMap
 * @returns {{ ok: true, sources: ReadonlyArray<Readonly<Record<string, unknown>>> } | { ok: false, reason_code: string }}
 */
export function validateClimateSourceRecords(sourceIds, sourceMap) {
  if (!authorityRecordsExactEqual(sourceIds, ACCEPTED_CLIMATE_CLAIM.source_ids)) {
    return {
      ok: false,
      reason_code: CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    };
  }

  const mapKeys = Object.keys(sourceMap);
  for (const key of mapKeys) {
    if (!Object.prototype.hasOwnProperty.call(ACCEPTED_CLIMATE_SOURCES, key)) {
      return {
        ok: false,
        reason_code: CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
  }
  for (const sourceId of ACCEPTED_CLIMATE_CLAIM.source_ids) {
    if (!Object.prototype.hasOwnProperty.call(sourceMap, sourceId)) {
      return {
        ok: false,
        reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
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
        reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
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
        reason_code: CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      };
    }
    if (s.source_id !== sourceId) {
      return {
        ok: false,
        reason_code: CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
      };
    }
    const accepted = ACCEPTED_CLIMATE_SOURCES[sourceId];
    if (!authorityRecordsExactEqual(s, accepted)) {
      return {
        ok: false,
        reason_code: CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
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
    unified_score: null,
    victims_caused: null,
    deaths_caused_or_avoided: null,
    exact_individual_damage: null,
    named_target_attribution: null,
  });
}

/**
 * Resolve the SP-PATH-CLIMATE-001 conditional pressure-to-outcome pathway.
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
 *   scenario_produces_ghg_emissions?: boolean | null,
 *   named_person?: string | null,
 *   named_species?: string | null,
 *   named_place?: string | null,
 *   named_event?: string | null,
 *   request_victims_or_deaths?: boolean,
 *   request_exact_individual_damage?: boolean,
 *   request_unified_score?: boolean,
 *   request_causal_proof?: boolean,
 *   coerce_unknown_to_zero?: boolean,
 *   coerce_unknown_to_false?: boolean,
 *   case_id?: string | null,
 *   assertion_id?: string | null,
 *   use_case_id_as_claim_authority?: boolean,
 *   authority_claim_record?: unknown,
 *   authority_source_map?: Readonly<Record<string, unknown>>,
 * }} [input]
 */
export function resolveClimatePathwayBoundary(input = {}) {
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
    return deny(CLIMATE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }
  if (
    !claimId &&
    (isNonEmptyString(input.case_id) || isNonEmptyString(input.assertion_id))
  ) {
    return deny(CLIMATE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY);
  }

  if (claimIdConflict || claimVersionConflict) {
    return deny(CLIMATE_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION);
  }

  if (!claimId) {
    return deny(CLIMATE_PATHWAY_REASON.MISSING_CLAIM_IDENTITY);
  }

  if (typeof claimId !== "string" || !/^SP-PATH-[A-Z0-9-]+$/.test(claimId)) {
    return deny(CLIMATE_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY);
  }

  if (!claimVersion) {
    return deny(CLIMATE_PATHWAY_REASON.MISSING_CLAIM_VERSION);
  }

  if (PENDING_EMPIRICAL_PATHWAY_IDS.includes(claimId)) {
    return deny(CLIMATE_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE);
  }

  if (claimId !== CLIMATE_CLAIM_ID) {
    return deny(CLIMATE_PATHWAY_REASON.UNKNOWN_CLAIM);
  }

  if (claimVersion !== CLIMATE_CLAIM_PACKAGE_COMMIT) {
    return deny(CLIMATE_PATHWAY_REASON.WRONG_CLAIM_VERSION);
  }

  // Explicit prohibited request categories fail closed before emission.
  if (
    isNonEmptyString(input.named_person) ||
    isNonEmptyString(input.named_species) ||
    isNonEmptyString(input.named_place) ||
    isNonEmptyString(input.named_event)
  ) {
    return deny(CLIMATE_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED);
  }

  if (input.request_victims_or_deaths === true) {
    return deny(CLIMATE_PATHWAY_REASON.VICTIMS_OR_DEATHS_PROHIBITED);
  }

  if (input.request_exact_individual_damage === true) {
    return deny(CLIMATE_PATHWAY_REASON.EXACT_INDIVIDUAL_DAMAGE_PROHIBITED);
  }

  if (input.request_unified_score === true) {
    return deny(CLIMATE_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED);
  }

  if (input.request_causal_proof === true) {
    return deny(CLIMATE_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING);
  }

  if (
    input.coerce_unknown_to_zero === true ||
    input.coerce_unknown_to_false === true
  ) {
    return deny(CLIMATE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED);
  }

  const requestedOutput = isNonEmptyString(input.requested_output)
    ? input.requested_output
    : PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME;

  if (requestedOutput !== PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME) {
    return deny(CLIMATE_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT);
  }

  const claimRecord =
    input.authority_claim_record === undefined
      ? ACCEPTED_CLIMATE_CLAIM
      : input.authority_claim_record;

  const claimValidation = validateClimateClaimAuthorityRecord(claimRecord);
  if (!claimValidation.ok) {
    return deny(claimValidation.reason_code);
  }

  // Production authority must be exactly the frozen registry-backed claim record.
  // Altered statement/domains/scopes/confidence/status/conditions/source set/pins fail closed.
  if (!authorityRecordsExactEqual(claimRecord, ACCEPTED_CLIMATE_CLAIM)) {
    return deny(CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT);
  }

  const sourceMap =
    input.authority_source_map === undefined
      ? ACCEPTED_CLIMATE_SOURCES
      : input.authority_source_map;

  const sourceValidation = validateClimateSourceRecords(
    ACCEPTED_CLIMATE_CLAIM.source_ids,
    sourceMap,
  );
  if (!sourceValidation.ok) {
    return deny(sourceValidation.reason_code);
  }

  // Condition: scenario must actually produce GHG emissions. Unknown stays unknown.
  if (input.scenario_produces_ghg_emissions !== true) {
    return deny(CLIMATE_PATHWAY_REASON.CONDITION_NOT_SATISFIED);
  }

  const pathway = Object.freeze({
    pathway_kind: PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME,
    claim_id: CLIMATE_CLAIM_ID,
    claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${CLIMATE_CLAIM_ID}@${CLIMATE_CLAIM_PACKAGE_COMMIT}`,
    package_provenance: PACKAGE_PROVENANCE,
    package_commit: CLIMATE_CLAIM_PACKAGE_COMMIT,
    statement: ACCEPTED_CLIMATE_CLAIM.statement,
    evidence_domain: Object.freeze([...ACCEPTED_CLIMATE_CLAIM.evidence_domain]),
    evidence_scope: Object.freeze([...ACCEPTED_CLIMATE_CLAIM.evidence_scope]),
    confidence: ACCEPTED_CLIMATE_CLAIM.confidence,
    attribution_status: ATTRIBUTION_PRESSURE_TO_OUTCOME,
    attribution_limits: Object.freeze([
      "pressure_to_outcome_only",
      "no_named_person_species_place_or_event_attribution",
      "no_victims_or_deaths_caused_or_avoided",
      "no_exact_individual_human_or_ecological_damage",
      "no_unified_environmental_safety_protect_four_or_moral_score",
      "conditional_pathway_is_not_causal_proof",
    ]),
    conditions: Object.freeze([...ACCEPTED_CLIMATE_CLAIM.conditions]),
    status: ACCEPTED_CLIMATE_CLAIM.status,
    // No quantitative value on this pathway record — preserve absence, do not invent zero.
    quantitative_value: null,
    value_range: null,
    unit: CLIMATE_UNIT,
    metric: CLIMATE_METRIC,
    model_specific_or_fallback_status: null,
    // Major assumptions surface = accepted claim conditions only (no invented prose).
    major_assumptions: Object.freeze([...ACCEPTED_CLIMATE_CLAIM.conditions]),
    source_ids: Object.freeze([...ACCEPTED_CLIMATE_CLAIM.source_ids]),
    sources: sourceValidation.sources,
  });

  return freezeDecision({
    emitted: true,
    reason_code: null,
    claim_id: CLIMATE_CLAIM_ID,
    claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
    claim_ref: `${CLIMATE_CLAIM_ID}@${CLIMATE_CLAIM_PACKAGE_COMMIT}`,
    pathway,
  });
}
