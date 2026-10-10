/**
 * Pure deterministic Source Lens authority gate / resolver.
 *
 * Authority: contracts/AP_INTERACTION_V0.md §9,
 * tests/ap-integrity/AP_V0_INVARIANTS.md (INV-AP-14, INV-AP-15),
 * provenance/source-packages/AP-V0-INTERACTION-0.2.0.md,
 * provenance/source-packages/AP-CORPUS-V0.3.0.md §5.
 *
 * This module decides whether a versioned AP claim may be treated as
 * Source Lens external-reference authority for a given context.
 * It does NOT emit SOURCE_LENS into reflections, reproduce AP text,
 * pin historical provenance (INV-AP-20), or activate otherness.
 */

export const CORPUS_VERSION = "AP-CORPUS-V0.3.0";
export const INTERACTION_VERSION = "AP-V0-INTERACTION-0.2.0";

export const CONTEXT_INITIAL_INQUIRY = "initial_inquiry";

/** Eligibility classes from the accepted V0 allowlist. */
export const ELIGIBILITY_INITIAL_INQUIRY = "initial_inquiry";
export const ELIGIBILITY_BACKGROUND_ONLY = "background_only";
export const ELIGIBILITY_POST_EVIDENCE_ONLY = "post_evidence_only";

/**
 * Frozen V0 claim registry for Source Lens authority gating.
 * Keys are claim_id; values hold the single accepted version and eligibility.
 * No silent version normalization or substitution is permitted.
 *
 * @type {Readonly<Record<string, Readonly<{
 *   claim_version: string,
 *   eligibility: string,
 * }>>>}
 */
export const SOURCE_LENS_CLAIM_REGISTRY = Object.freeze({
  "APF-SEE-001": Object.freeze({
    claim_version: "1.2",
    eligibility: ELIGIBILITY_INITIAL_INQUIRY,
  }),
  "APF-CON-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_INITIAL_INQUIRY,
  }),
  "APF-APP-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_INITIAL_INQUIRY,
  }),
  "APF-DES-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_INITIAL_INQUIRY,
  }),
  "APF-FEAR-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_INITIAL_INQUIRY,
  }),
  "MOB-CON-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_INITIAL_INQUIRY,
  }),
  "APF-INC-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_BACKGROUND_ONLY,
  }),
  "AP-OTH-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_POST_EVIDENCE_ONLY,
  }),
  "AP-PLAN-001": Object.freeze({
    claim_version: "1.1",
    eligibility: ELIGIBILITY_POST_EVIDENCE_ONLY,
  }),
});

/** Exact versioned refs authorized for initial-inquiry Source Lens gating. */
export const INITIAL_INQUIRY_SOURCE_LENS_ALLOWLIST = Object.freeze(
  Object.entries(SOURCE_LENS_CLAIM_REGISTRY)
    .filter(([, entry]) => entry.eligibility === ELIGIBILITY_INITIAL_INQUIRY)
    .map(([claimId, entry]) => `${claimId}@${entry.claim_version}`),
);

/** Deterministic denial reason codes. */
export const SOURCE_LENS_REASON = Object.freeze({
  UNKNOWN_CLAIM: "unknown_claim",
  MISSING_VERSION: "missing_version",
  WRONG_VERSION: "wrong_version",
  BACKGROUND_ONLY_NOT_INITIAL_INQUIRY: "background_only_not_initial_inquiry",
  POST_EVIDENCE_ONLY_NOT_INITIAL_INQUIRY:
    "post_evidence_only_not_initial_inquiry",
  UNVERSIONED_FREE_TEXT_NOT_AUTHORITY: "unversioned_free_text_not_authority",
  AI_NOT_EXTERNAL_REFERENCE_AUTHORITY: "ai_not_external_reference_authority",
  CONTEXT_NOT_SUPPORTED: "context_not_supported",
});

/** @param {unknown} value @returns {value is string} */
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/**
 * Parse `CLAIM_ID@version` without normalizing versions or inventing parts.
 * @param {unknown} claimRef
 * @returns {{ claim_id: string | null, claim_version: string | null }}
 */
export function parseClaimRef(claimRef) {
  if (!isNonEmptyString(claimRef)) {
    return { claim_id: null, claim_version: null };
  }
  const at = claimRef.lastIndexOf("@");
  if (at <= 0 || at === claimRef.length - 1) {
    // Unversioned token or malformed ref — do not invent a version.
    return { claim_id: claimRef, claim_version: null };
  }
  return {
    claim_id: claimRef.slice(0, at),
    claim_version: claimRef.slice(at + 1),
  };
}

/**
 * @param {{
 *   authorized: boolean,
 *   reason_code: string | null,
 *   context: string,
 *   claim_id: string | null,
 *   claim_version: string | null,
 *   claim_ref: string | null,
 *   eligibility: string | null,
 *   external_reference_authority: string | null,
 *   external_reference_authority_ref: string | null,
 * }} fields
 */
function freezeDecision(fields) {
  return Object.freeze({
    authorized: fields.authorized,
    reason_code: fields.reason_code,
    context: fields.context,
    claim_id: fields.claim_id,
    claim_version: fields.claim_version,
    claim_ref: fields.claim_ref,
    eligibility: fields.eligibility,
    // Inspectable authority identity: versioned AP claim or null when denied.
    external_reference_authority: fields.external_reference_authority,
    external_reference_authority_ref: fields.external_reference_authority_ref,
    // INV-AP-15: AI/generator never becomes or persists as that authority.
    ai_is_external_reference_authority: false,
    generator_is_external_reference_authority: false,
    // Non-emission: this resolver never produces lens content.
    source_lens_content: null,
    source_lens_emitted: false,
    corpus_version: CORPUS_VERSION,
    interaction_version: INTERACTION_VERSION,
  });
}

/**
 * Resolve Source Lens external-reference authority for a request.
 *
 * Domain inputs only: claim identity/version, inquiry context, and whether
 * the caller attempted to designate AI/free text as authority.
 * Production behavior does not depend on case/test identifiers.
 *
 * @param {{
 *   claim_id?: string | null,
 *   claim_version?: string | null,
 *   claim_ref?: string | null,
 *   context?: string,
 *   designate_ai_as_external_reference_authority?: boolean,
 *   designate_generator_as_external_reference_authority?: boolean,
 *   designate_ai_as_teacher?: boolean,
 *   designate_ai_as_text?: boolean,
 *   designate_ai_as_tradition?: boolean,
 *   free_text_authority?: string | null,
 * }} [input]
 */
export function resolveSourceLensAuthority(input = {}) {
  const context = isNonEmptyString(input.context)
    ? input.context
    : CONTEXT_INITIAL_INQUIRY;

  const aiDesignated =
    input.designate_ai_as_external_reference_authority === true ||
    input.designate_generator_as_external_reference_authority === true ||
    input.designate_ai_as_teacher === true ||
    input.designate_ai_as_text === true ||
    input.designate_ai_as_tradition === true;

  let claimId = isNonEmptyString(input.claim_id) ? input.claim_id : null;
  let claimVersion = isNonEmptyString(input.claim_version)
    ? input.claim_version
    : null;

  if ((!claimId || !claimVersion) && isNonEmptyString(input.claim_ref)) {
    const parsed = parseClaimRef(input.claim_ref);
    if (!claimId) {
      claimId = parsed.claim_id;
    }
    if (!claimVersion) {
      claimVersion = parsed.claim_version;
    }
  }

  const freeText = isNonEmptyString(input.free_text_authority)
    ? input.free_text_authority
    : null;

  /** @param {string} reasonCode */
  const deny = (reasonCode) =>
    freezeDecision({
      authorized: false,
      reason_code: reasonCode,
      context,
      claim_id: claimId,
      claim_version: claimVersion,
      claim_ref: claimId && claimVersion ? `${claimId}@${claimVersion}` : null,
      eligibility: null,
      external_reference_authority: null,
      external_reference_authority_ref: null,
    });

  // INV-AP-15: AI/generator cannot be designated as external-reference authority.
  if (aiDesignated) {
    return deny(SOURCE_LENS_REASON.AI_NOT_EXTERNAL_REFERENCE_AUTHORITY);
  }

  // Unversioned free text is never AP external-reference authority.
  if (freeText && !claimId) {
    return deny(SOURCE_LENS_REASON.UNVERSIONED_FREE_TEXT_NOT_AUTHORITY);
  }

  if (!claimId) {
    return deny(SOURCE_LENS_REASON.UNKNOWN_CLAIM);
  }

  if (!claimVersion) {
    // Free-text-with-id-but-no-version is still unversioned authority attempt.
    if (freeText) {
      return deny(SOURCE_LENS_REASON.UNVERSIONED_FREE_TEXT_NOT_AUTHORITY);
    }
    return deny(SOURCE_LENS_REASON.MISSING_VERSION);
  }

  if (context !== CONTEXT_INITIAL_INQUIRY) {
    // This slice only authorizes the initial-inquiry gate; do not infer
    // eligibility for other contexts.
    return deny(SOURCE_LENS_REASON.CONTEXT_NOT_SUPPORTED);
  }

  const registryEntry = SOURCE_LENS_CLAIM_REGISTRY[claimId];
  if (!registryEntry) {
    return deny(SOURCE_LENS_REASON.UNKNOWN_CLAIM);
  }

  if (claimVersion !== registryEntry.claim_version) {
    // Never upgrade/downgrade to the accepted version.
    return deny(SOURCE_LENS_REASON.WRONG_VERSION);
  }

  if (registryEntry.eligibility === ELIGIBILITY_BACKGROUND_ONLY) {
    return deny(SOURCE_LENS_REASON.BACKGROUND_ONLY_NOT_INITIAL_INQUIRY);
  }

  if (registryEntry.eligibility === ELIGIBILITY_POST_EVIDENCE_ONLY) {
    return deny(SOURCE_LENS_REASON.POST_EVIDENCE_ONLY_NOT_INITIAL_INQUIRY);
  }

  if (registryEntry.eligibility !== ELIGIBILITY_INITIAL_INQUIRY) {
    return deny(SOURCE_LENS_REASON.UNKNOWN_CLAIM);
  }

  // Free text alongside a valid versioned claim does not become authority;
  // the versioned claim remains the only external-reference authority.
  const claimRef = `${claimId}@${claimVersion}`;
  return freezeDecision({
    authorized: true,
    reason_code: null,
    context,
    claim_id: claimId,
    claim_version: claimVersion,
    claim_ref: claimRef,
    eligibility: ELIGIBILITY_INITIAL_INQUIRY,
    external_reference_authority: "versioned_ap_claim",
    external_reference_authority_ref: claimRef,
  });
}

/**
 * Convenience: whether a versioned claim ref is on the initial-inquiry allowlist.
 * Exact match only — no version normalization.
 * @param {unknown} claimRef
 * @returns {boolean}
 */
export function isInitialInquirySourceLensAllowed(claimRef) {
  if (!isNonEmptyString(claimRef)) {
    return false;
  }
  return INITIAL_INQUIRY_SOURCE_LENS_ALLOWLIST.includes(claimRef);
}
