/**
 * Pure deterministic Source Lens authority gate / resolver and historical pin.
 *
 * Authority: contracts/AP_INTERACTION_V0.md §§9, 14,
 * tests/ap-integrity/AP_V0_INVARIANTS.md (INV-AP-14, INV-AP-15, INV-AP-20),
 * provenance/source-packages/AP-V0-INTERACTION-0.2.0.md,
 * provenance/source-packages/AP-CORPUS-V0.3.0.md §§4, 5, 7–12.
 *
 * Initial-inquiry authority gating (INV-AP-14/15) is unchanged.
 * Post-evidence context authorizes only AP-OTH-001@1.1 and AP-PLAN-001@1.1.
 * Historical Source Lens / reflection records pin claim_id, claim_version,
 * and corpus_version immutably (INV-AP-20). This module does not activate
 * otherness inquiry wording (see ap-otherness.mjs) and does not insert
 * SOURCE_LENS into the six-question reflection path.
 */

export const CORPUS_VERSION = "AP-CORPUS-V0.3.0";
export const INTERACTION_VERSION = "AP-V0-INTERACTION-0.2.0";

export const CONTEXT_INITIAL_INQUIRY = "initial_inquiry";
export const CONTEXT_POST_EVIDENCE = "post_evidence";

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

/** Exact versioned refs authorized for post-evidence Source Lens only. */
export const POST_EVIDENCE_SOURCE_LENS_ALLOWLIST = Object.freeze(
  Object.entries(SOURCE_LENS_CLAIM_REGISTRY)
    .filter(([, entry]) => entry.eligibility === ELIGIBILITY_POST_EVIDENCE_ONLY)
    .map(([claimId, entry]) => `${claimId}@${entry.claim_version}`),
);

/**
 * Frozen licensing-safe public display fields for post-evidence claims.
 * Narrow approved paraphrases + official links + provenance labels only.
 * Internal support text and substantial Framework prose are excluded.
 */
export const POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY = Object.freeze({
  "AP-OTH-001@1.1": Object.freeze({
    claim_id: "AP-OTH-001",
    claim_version: "1.1",
    corpus_version: CORPUS_VERSION,
    approved_paraphrase:
      "AP links otherness to drawing a boundary around oneself such that what lies beyond it is treated as separate from one’s own interests, and develops this separation in relation to violence.",
    official_source_links: Object.freeze([
      Object.freeze({
        title: "When Peace Looks Like War",
        url: "https://acharyaprashant.org/en/articles/peace-looks-like-war-1_ddeebcc",
        source_class: "P3",
      }),
    ]),
    provenance_labels: Object.freeze([
      "approved_claim",
      "P3_official_transcript_support",
      "exact_primary_video_lineage_unresolved",
      "ai_generated_page_summary_excluded_from_claim_support",
      "post_evidence_only",
    ]),
    external_reference_authority: "versioned_ap_claim",
  }),
  "AP-PLAN-001@1.1": Object.freeze({
    claim_id: "AP-PLAN-001",
    claim_version: "1.1",
    corpus_version: CORPUS_VERSION,
    approved_paraphrase:
      "AP explicitly questions the assumed opposition between one’s own interests and those treated as “others,” including other people, endangered species, ecosystems and river systems.",
    official_source_links: Object.freeze([
      Object.freeze({
        title:
          "Desire vs Duty: How to choose? || Acharya Prashant, BITS Pilani, Dubai Tour (2025)",
        url: "https://www.youtube.com/watch?v=ZVEwREWFOW4",
        source_class: "P2",
      }),
      Object.freeze({
        title: "Duty vs Desire: How to Choose or Balance?",
        url: "https://acharyaprashant.org/en/articles/how-to-choose-balance-1_f174f53",
        source_class: "P3",
      }),
    ]),
    provenance_labels: Object.freeze([
      "approved_high_provenance",
      "P2_verified_official_recording",
      "P3_official_transcript_support",
      "post_evidence_only",
    ]),
    external_reference_authority: "versioned_ap_claim",
  }),
});

/** Deterministic denial reason codes. */
export const SOURCE_LENS_REASON = Object.freeze({
  UNKNOWN_CLAIM: "unknown_claim",
  MISSING_VERSION: "missing_version",
  WRONG_VERSION: "wrong_version",
  BACKGROUND_ONLY_NOT_INITIAL_INQUIRY: "background_only_not_initial_inquiry",
  POST_EVIDENCE_ONLY_NOT_INITIAL_INQUIRY:
    "post_evidence_only_not_initial_inquiry",
  INITIAL_INQUIRY_ONLY_NOT_POST_EVIDENCE:
    "initial_inquiry_only_not_post_evidence",
  BACKGROUND_ONLY_NOT_POST_EVIDENCE: "background_only_not_post_evidence",
  UNVERSIONED_FREE_TEXT_NOT_AUTHORITY: "unversioned_free_text_not_authority",
  CONFLICTING_CLAIM_REPRESENTATION: "conflicting_claim_representation",
  AI_NOT_EXTERNAL_REFERENCE_AUTHORITY: "ai_not_external_reference_authority",
  CONTEXT_NOT_SUPPORTED: "context_not_supported",
  INCOMPLETE_PROVENANCE_PIN: "incomplete_provenance_pin",
  CONFLICTING_CORPUS_PIN: "conflicting_corpus_pin",
  CLAIM_PIN_SUBSTITUTION_REJECTED: "claim_pin_substitution_rejected",
  MISSING_QUALIFYING_CONSEQUENCE_REFS: "missing_qualifying_consequence_refs",
  EMPTY_QUALIFYING_CONSEQUENCE_REFS: "empty_qualifying_consequence_refs",
  MALFORMED_QUALIFYING_CONSEQUENCE_REFS:
    "malformed_qualifying_consequence_refs",
  NONQUALIFYING_CONSEQUENCE_REFS: "nonqualifying_consequence_refs",
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

  const partsClaimId = isNonEmptyString(input.claim_id) ? input.claim_id : null;
  const partsClaimVersion = isNonEmptyString(input.claim_version)
    ? input.claim_version
    : null;
  const parsedFromRef = isNonEmptyString(input.claim_ref)
    ? parseClaimRef(input.claim_ref)
    : { claim_id: null, claim_version: null };

  // Conflicting claim_ref versus claim_id/claim_version must fail before any
  // silent choice of one representation. Matching duplicates may proceed.
  const claimIdConflict =
    partsClaimId !== null &&
    parsedFromRef.claim_id !== null &&
    partsClaimId !== parsedFromRef.claim_id;
  const claimVersionConflict =
    partsClaimVersion !== null &&
    parsedFromRef.claim_version !== null &&
    partsClaimVersion !== parsedFromRef.claim_version;

  const claimId = partsClaimId ?? parsedFromRef.claim_id;
  const claimVersion = partsClaimVersion ?? parsedFromRef.claim_version;

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

  // Any non-empty free-text authority attempt fails, including when an
  // otherwise valid versioned claim is also present.
  if (freeText) {
    return deny(SOURCE_LENS_REASON.UNVERSIONED_FREE_TEXT_NOT_AUTHORITY);
  }

  if (claimIdConflict || claimVersionConflict) {
    return deny(SOURCE_LENS_REASON.CONFLICTING_CLAIM_REPRESENTATION);
  }

  if (!claimId) {
    return deny(SOURCE_LENS_REASON.UNKNOWN_CLAIM);
  }

  if (!claimVersion) {
    return deny(SOURCE_LENS_REASON.MISSING_VERSION);
  }

  const registryEntry = SOURCE_LENS_CLAIM_REGISTRY[claimId];
  if (!registryEntry) {
    return deny(SOURCE_LENS_REASON.UNKNOWN_CLAIM);
  }

  if (claimVersion !== registryEntry.claim_version) {
    // Never upgrade/downgrade to the accepted version.
    return deny(SOURCE_LENS_REASON.WRONG_VERSION);
  }

  if (context === CONTEXT_INITIAL_INQUIRY) {
    if (registryEntry.eligibility === ELIGIBILITY_BACKGROUND_ONLY) {
      return deny(SOURCE_LENS_REASON.BACKGROUND_ONLY_NOT_INITIAL_INQUIRY);
    }

    if (registryEntry.eligibility === ELIGIBILITY_POST_EVIDENCE_ONLY) {
      return deny(SOURCE_LENS_REASON.POST_EVIDENCE_ONLY_NOT_INITIAL_INQUIRY);
    }

    if (registryEntry.eligibility !== ELIGIBILITY_INITIAL_INQUIRY) {
      return deny(SOURCE_LENS_REASON.UNKNOWN_CLAIM);
    }

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

  if (context === CONTEXT_POST_EVIDENCE) {
    if (registryEntry.eligibility === ELIGIBILITY_BACKGROUND_ONLY) {
      return deny(SOURCE_LENS_REASON.BACKGROUND_ONLY_NOT_POST_EVIDENCE);
    }

    if (registryEntry.eligibility === ELIGIBILITY_INITIAL_INQUIRY) {
      return deny(SOURCE_LENS_REASON.INITIAL_INQUIRY_ONLY_NOT_POST_EVIDENCE);
    }

    if (registryEntry.eligibility !== ELIGIBILITY_POST_EVIDENCE_ONLY) {
      return deny(SOURCE_LENS_REASON.UNKNOWN_CLAIM);
    }

    const claimRef = `${claimId}@${claimVersion}`;
    return freezeDecision({
      authorized: true,
      reason_code: null,
      context,
      claim_id: claimId,
      claim_version: claimVersion,
      claim_ref: claimRef,
      eligibility: ELIGIBILITY_POST_EVIDENCE_ONLY,
      external_reference_authority: "versioned_ap_claim",
      external_reference_authority_ref: claimRef,
    });
  }

  // Unknown contexts remain unsupported; do not infer eligibility.
  return deny(SOURCE_LENS_REASON.CONTEXT_NOT_SUPPORTED);
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

/**
 * Convenience: whether a versioned claim ref is on the post-evidence allowlist.
 * Exact match only — no version normalization.
 * @param {unknown} claimRef
 * @returns {boolean}
 */
export function isPostEvidenceSourceLensAllowed(claimRef) {
  if (!isNonEmptyString(claimRef)) {
    return false;
  }
  return POST_EVIDENCE_SOURCE_LENS_ALLOWLIST.includes(claimRef);
}

/**
 * @typedef {{
 *   claim_id: string,
 *   claim_version: string,
 *   corpus_version: string,
 *   claim_ref: string,
 *   context: string,
 *   external_reference_authority: string,
 *   external_reference_authority_ref: string,
 *   ai_is_external_reference_authority: boolean,
 *   generator_is_external_reference_authority: boolean,
 *   provenance_labels: readonly string[],
 *   official_source_links: readonly object[],
 *   approved_paraphrase: string | null,
 *   support_text_internal: null,
 * }} PinnedHistoricalSourceLensRecord
 */

/**
 * Create an immutable historical Source Lens / reflection provenance pin.
 * Rejects incomplete, conflicting, silently normalized, or substituted pins.
 *
 * Domain inputs only — production behavior does not depend on case/test IDs.
 *
 * @param {{
 *   claim_id?: string | null,
 *   claim_version?: string | null,
 *   claim_ref?: string | null,
 *   corpus_version?: string | null,
 *   context?: string,
 * }} [input]
 * @returns {{
 *   accepted: boolean,
 *   reason_code: string | null,
 *   record: PinnedHistoricalSourceLensRecord | null,
 * }}
 */
export function createPinnedHistoricalSourceLensRecord(input = {}) {
  const context = isNonEmptyString(input.context)
    ? input.context
    : CONTEXT_POST_EVIDENCE;

  const authority = resolveSourceLensAuthority({
    claim_id: input.claim_id,
    claim_version: input.claim_version,
    claim_ref: input.claim_ref,
    context,
  });

  if (!authority.authorized) {
    return Object.freeze({
      accepted: false,
      reason_code: authority.reason_code,
      record: null,
    });
  }

  const claimId = authority.claim_id;
  const claimVersion = authority.claim_version;
  const claimRef = authority.claim_ref;

  if (!claimId || !claimVersion || !claimRef) {
    return Object.freeze({
      accepted: false,
      reason_code: SOURCE_LENS_REASON.INCOMPLETE_PROVENANCE_PIN,
      record: null,
    });
  }

  // Caller must supply the exact corpus pin. Missing/null/empty is incomplete;
  // a different non-empty corpus is conflicting. Never silently default.
  if (
    input.corpus_version === undefined ||
    input.corpus_version === null ||
    input.corpus_version === ""
  ) {
    return Object.freeze({
      accepted: false,
      reason_code: SOURCE_LENS_REASON.INCOMPLETE_PROVENANCE_PIN,
      record: null,
    });
  }
  if (!isNonEmptyString(input.corpus_version)) {
    return Object.freeze({
      accepted: false,
      reason_code: SOURCE_LENS_REASON.INCOMPLETE_PROVENANCE_PIN,
      record: null,
    });
  }
  if (input.corpus_version !== CORPUS_VERSION) {
    return Object.freeze({
      accepted: false,
      reason_code: SOURCE_LENS_REASON.CONFLICTING_CORPUS_PIN,
      record: null,
    });
  }

  /** @type {typeof POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY[keyof typeof POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY] | undefined} */
  const display =
    claimRef in POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY
      ? POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY[
          /** @type {keyof typeof POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY} */ (claimRef)
        ]
      : undefined;
  if (context === CONTEXT_POST_EVIDENCE && !display) {
    // Post-evidence historical pins require the frozen public display package.
    return Object.freeze({
      accepted: false,
      reason_code: SOURCE_LENS_REASON.CLAIM_PIN_SUBSTITUTION_REJECTED,
      record: null,
    });
  }

  // Defensive copy: later mutation of input/display objects cannot rewrite
  // the philosophical basis of an already-recorded reflection.
  const provenanceLabels = Object.freeze([
    ...(display?.provenance_labels ??
      Object.freeze([`${authority.eligibility}_allowlist`])),
  ]);
  const officialSourceLinks = Object.freeze(
    (display?.official_source_links ?? []).map(
      (/** @type {{ title: string, url: string, source_class: string }} */ link) =>
        Object.freeze({
          title: link.title,
          url: link.url,
          source_class: link.source_class,
        }),
    ),
  );

  const record = Object.freeze({
    claim_id: claimId,
    claim_version: claimVersion,
    corpus_version: CORPUS_VERSION,
    claim_ref: claimRef,
    context,
    external_reference_authority: "versioned_ap_claim",
    external_reference_authority_ref: claimRef,
    ai_is_external_reference_authority: false,
    generator_is_external_reference_authority: false,
    provenance_labels: provenanceLabels,
    official_source_links: officialSourceLinks,
    approved_paraphrase: display?.approved_paraphrase ?? null,
    // Licensing-safe: never attach internal support text.
    support_text_internal: null,
  });

  return Object.freeze({
    accepted: true,
    reason_code: null,
    record,
  });
}

/**
 * Licensing-safe public fields for post-evidence Source Lens display.
 * Excludes internal support text and substantial AP Framework prose.
 */
export function createLicensingSafeSourceLensPublicFields() {
  const claims = POST_EVIDENCE_SOURCE_LENS_ALLOWLIST.map((claimRef) => {
    const display =
      POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY[
        /** @type {keyof typeof POST_EVIDENCE_CLAIM_PUBLIC_DISPLAY} */ (claimRef)
      ];
    return Object.freeze({
      claim_id: display.claim_id,
      claim_version: display.claim_version,
      claim_ref: claimRef,
      corpus_version: display.corpus_version,
      approved_paraphrase: display.approved_paraphrase,
      official_source_links: display.official_source_links,
      provenance_labels: display.provenance_labels,
      external_reference_authority: display.external_reference_authority,
    });
  });

  return Object.freeze({
    claim_refs: Object.freeze([...POST_EVIDENCE_SOURCE_LENS_ALLOWLIST]),
    corpus_version: CORPUS_VERSION,
    claims: Object.freeze(claims),
  });
}

/**
 * Whether a value is an already-parsed qualifying consequence reference.
 * Mirrors the post-evidence otherness gate without inventing empirical meaning:
 * displayed + independently supported + supported + beyond immediate circle.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
function isAlreadyParsedQualifyingConsequenceRef(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const ref = /** @type {Record<string, unknown>} */ (value);
  if (!isNonEmptyString(ref.consequence_ref_id)) {
    return false;
  }
  // Explicit booleans only — truthy objects/strings do not qualify.
  if (ref.displayed !== true) {
    return false;
  }
  if (ref.independently_supported !== true) {
    return false;
  }
  if (ref.support_status !== "supported") {
    return false;
  }
  if (ref.extent !== "beyond_immediate_circle") {
    return false;
  }
  return true;
}

/**
 * Emit immutable post-evidence Source Lens records + one historical reflection
 * pin bundle only after at least one validated qualifying consequence reference
 * is supplied. Empty, absent, malformed, or nonqualifying inputs emit nothing.
 *
 * @param {{
 *   qualifying_consequence_refs?: readonly unknown[],
 * }} [input]
 * @returns {{
 *   accepted: boolean,
 *   reason_code: string | null,
 *   source_lens_records: readonly PinnedHistoricalSourceLensRecord[],
 *   historical_reflection_record: object | null,
 * }}
 */
export function buildPostEvidenceSourceLensRecords(input = {}) {
  const deny = (/** @type {string} */ reasonCode) =>
    Object.freeze({
      accepted: false,
      reason_code: reasonCode,
      source_lens_records: Object.freeze(
        /** @type {PinnedHistoricalSourceLensRecord[]} */ ([]),
      ),
      historical_reflection_record: null,
    });

  const refs = input.qualifying_consequence_refs;
  if (refs === undefined || refs === null) {
    return deny(SOURCE_LENS_REASON.MISSING_QUALIFYING_CONSEQUENCE_REFS);
  }
  if (!Array.isArray(refs)) {
    return deny(SOURCE_LENS_REASON.MALFORMED_QUALIFYING_CONSEQUENCE_REFS);
  }
  if (refs.length === 0) {
    return deny(SOURCE_LENS_REASON.EMPTY_QUALIFYING_CONSEQUENCE_REFS);
  }

  /** @type {string[]} */
  const consequenceRefIds = [];
  let sawMalformed = false;
  let sawNonqualifying = false;

  for (const ref of refs) {
    if (
      ref === null ||
      ref === undefined ||
      typeof ref !== "object" ||
      Array.isArray(ref)
    ) {
      sawMalformed = true;
      continue;
    }
    const candidate = /** @type {Record<string, unknown>} */ (ref);
    if (!isNonEmptyString(candidate.consequence_ref_id)) {
      sawMalformed = true;
      continue;
    }
    if (
      typeof candidate.displayed !== "boolean" ||
      typeof candidate.independently_supported !== "boolean" ||
      typeof candidate.support_status !== "string" ||
      typeof candidate.extent !== "string"
    ) {
      // Truthy/non-boolean fields are malformed, not silently normalized.
      sawMalformed = true;
      continue;
    }
    if (!isAlreadyParsedQualifyingConsequenceRef(candidate)) {
      sawNonqualifying = true;
      continue;
    }
    consequenceRefIds.push(candidate.consequence_ref_id);
  }

  if (consequenceRefIds.length === 0) {
    if (sawMalformed) {
      return deny(SOURCE_LENS_REASON.MALFORMED_QUALIFYING_CONSEQUENCE_REFS);
    }
    if (sawNonqualifying) {
      return deny(SOURCE_LENS_REASON.NONQUALIFYING_CONSEQUENCE_REFS);
    }
    return deny(SOURCE_LENS_REASON.EMPTY_QUALIFYING_CONSEQUENCE_REFS);
  }

  /** @type {PinnedHistoricalSourceLensRecord[]} */
  const sourceLensRecords = [];

  for (const claimRef of POST_EVIDENCE_SOURCE_LENS_ALLOWLIST) {
    const pinned = createPinnedHistoricalSourceLensRecord({
      claim_ref: claimRef,
      corpus_version: CORPUS_VERSION,
      context: CONTEXT_POST_EVIDENCE,
    });
    if (!pinned.accepted || !pinned.record) {
      throw new Error(
        `Failed to pin required post-evidence Source Lens record for ${claimRef}: ${pinned.reason_code}`,
      );
    }
    sourceLensRecords.push(pinned.record);
  }

  const historicalReflectionRecord = Object.freeze({
    record_kind: "historical_otherness_reflection",
    attribution_status: "project_interpretation",
    evidence_domain: "mixed",
    corpus_version: CORPUS_VERSION,
    interaction_version: INTERACTION_VERSION,
    // Every supporting claim pin retained exactly as accepted at creation.
    claim_pins: Object.freeze(
      sourceLensRecords.map((record) =>
        Object.freeze({
          claim_id: record.claim_id,
          claim_version: record.claim_version,
          corpus_version: record.corpus_version,
          claim_ref: record.claim_ref,
        }),
      ),
    ),
    source_lens_records: Object.freeze([...sourceLensRecords]),
    qualifying_consequence_ref_ids: Object.freeze([...consequenceRefIds]),
  });

  return Object.freeze({
    accepted: true,
    reason_code: null,
    source_lens_records: Object.freeze([...sourceLensRecords]),
    historical_reflection_record: historicalReflectionRecord,
  });
}
