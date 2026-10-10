/**
 * Evidence-gated post-comparison otherness inquiry (INV-AP-17–19).
 *
 * Authority: contracts/AP_INTERACTION_V0.md §§9–15,
 * tests/ap-integrity/AP_V0_INVARIANTS.md (INV-AP-17–19),
 * provenance/source-packages/AP-V0-INTERACTION-0.2.0.md §10,
 * provenance/source-packages/AP-CORPUS-V0.3.0.md §§2, 4, 5, 10, 11.
 *
 * Consumes only explicit qualifying consequence references supplied by the
 * caller. Does not invent empirical evidence, start the empirical suite, or
 * build UI. Historical Source Lens pinning lives in ap-source-lens.mjs.
 */

import {
  CONTEXT_POST_EVIDENCE,
  CORPUS_VERSION,
  INTERACTION_VERSION,
  POST_EVIDENCE_SOURCE_LENS_ALLOWLIST,
  buildPostEvidenceSourceLensRecords,
  createLicensingSafeSourceLensPublicFields,
} from "./ap-source-lens.mjs";

export { CORPUS_VERSION, INTERACTION_VERSION };

/** Exact approved otherness inquiry wording (AP_INTERACTION_V0 §10). */
export const OTHERNESS_QUESTION_TEXT =
  "Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?";

export const OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT =
  "What makes you see it that way?";

export const ATTRIBUTION_PROJECT_INTERPRETATION = "project_interpretation";
export const EVIDENCE_DOMAIN_MIXED = "mixed";

/** Explicit support statuses the gate recognizes without inventing meaning. */
export const SUPPORT_STATUS_SUPPORTED = "supported";
export const SUPPORT_STATUS_UNKNOWN = "unknown";
export const SUPPORT_STATUS_MISSING = "missing";
export const SUPPORT_STATUS_UNSUPPORTED = "unsupported";

/** Explicit extent values; only beyond_immediate_circle can qualify. */
export const EXTENT_BEYOND_IMMEDIATE_CIRCLE = "beyond_immediate_circle";
export const EXTENT_IMMEDIATE_CIRCLE_ONLY = "immediate_circle_only";

/** Deterministic non-activation / denial reason codes. */
export const OTHERNESS_REASON = Object.freeze({
  NO_CONSEQUENCE_INPUT: "no_consequence_input",
  MALFORMED_CONSEQUENCE_INPUT: "malformed_consequence_input",
  NO_DISPLAYED_CONSEQUENCE: "no_displayed_consequence",
  SUPPORT_UNKNOWN_OR_MISSING: "support_unknown_or_missing",
  SUPPORT_NOT_INDEPENDENT: "support_not_independent",
  IMMEDIATE_CIRCLE_ONLY: "immediate_circle_only",
  AP_ONLY_INPUT_NOT_EMPIRICAL: "ap_only_input_not_empirical",
  NO_QUALIFYING_CONSEQUENCE: "no_qualifying_consequence",
});

/**
 * Phrases that must never appear as Direct AP attribution for Protect My Four.
 * Exact prohibited renders from AP_INTERACTION_V0 §10.
 */
export const PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS = Object.freeze([
  "AP says protecting your family requires protecting the whole planet.",
  "If you really love your four people, you must protect everyone.",
]);

/** @param {unknown} value @returns {value is string} */
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/**
 * @typedef {{
 *   consequence_ref_id: string,
 *   displayed: boolean,
 *   independently_supported: boolean,
 *   support_status: string,
 *   extent: string,
 * }} DisplayedConsequenceReference
 */

/**
 * Smallest internal explicit consequence-reference contract for this gate.
 * Not empirical authority — Research & Evidence owns consequence truth later.
 *
 * Required shape when present:
 * {
 *   consequence_ref_id: string,
 *   displayed: boolean,                 // must be explicitly true
 *   independently_supported: boolean,   // must be explicitly true
 *   support_status: "supported" | "unknown" | "missing" | "unsupported",
 *   extent: "beyond_immediate_circle" | "immediate_circle_only"
 * }
 *
 * @param {unknown} value
 * @returns {{ ok: true, ref: DisplayedConsequenceReference } | { ok: false, reason_code: string }}
 */
export function parseDisplayedConsequenceReference(value) {
  if (value === null || value === undefined) {
    return {
      ok: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
    };
  }
  if (typeof value !== "object" || Array.isArray(value)) {
    return {
      ok: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
    };
  }

  const ref = /** @type {Record<string, unknown>} */ (value);
  if (!isNonEmptyString(ref.consequence_ref_id)) {
    return {
      ok: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
    };
  }

  // Booleans must be explicit — truthy objects/strings do not count.
  if (typeof ref.displayed !== "boolean") {
    return {
      ok: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
    };
  }
  if (typeof ref.independently_supported !== "boolean") {
    return {
      ok: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
    };
  }
  if (
    ref.support_status !== SUPPORT_STATUS_SUPPORTED &&
    ref.support_status !== SUPPORT_STATUS_UNKNOWN &&
    ref.support_status !== SUPPORT_STATUS_MISSING &&
    ref.support_status !== SUPPORT_STATUS_UNSUPPORTED
  ) {
    return {
      ok: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
    };
  }
  if (
    ref.extent !== EXTENT_BEYOND_IMMEDIATE_CIRCLE &&
    ref.extent !== EXTENT_IMMEDIATE_CIRCLE_ONLY
  ) {
    return {
      ok: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
    };
  }

  return {
    ok: true,
    ref: Object.freeze({
      consequence_ref_id: ref.consequence_ref_id,
      displayed: ref.displayed,
      independently_supported: ref.independently_supported,
      support_status: ref.support_status,
      extent: ref.extent,
    }),
  };
}

/**
 * @param {DisplayedConsequenceReference} ref
 * @returns {string | null} denial reason when this single ref does not qualify
 */
function singleRefDenialReason(ref) {
  if (ref.displayed !== true) {
    return OTHERNESS_REASON.NO_DISPLAYED_CONSEQUENCE;
  }
  if (
    ref.support_status === SUPPORT_STATUS_UNKNOWN ||
    ref.support_status === SUPPORT_STATUS_MISSING
  ) {
    return OTHERNESS_REASON.SUPPORT_UNKNOWN_OR_MISSING;
  }
  if (ref.support_status !== SUPPORT_STATUS_SUPPORTED) {
    return OTHERNESS_REASON.SUPPORT_NOT_INDEPENDENT;
  }
  if (ref.independently_supported !== true) {
    return OTHERNESS_REASON.SUPPORT_NOT_INDEPENDENT;
  }
  if (ref.extent === EXTENT_IMMEDIATE_CIRCLE_ONLY) {
    return OTHERNESS_REASON.IMMEDIATE_CIRCLE_ONLY;
  }
  if (ref.extent !== EXTENT_BEYOND_IMMEDIATE_CIRCLE) {
    return OTHERNESS_REASON.NO_QUALIFYING_CONSEQUENCE;
  }
  return null;
}

/**
 * @param {{
 *   activated: boolean,
 *   reason_code: string | null,
 *   qualifying_consequence_refs: readonly object[],
 *   inquiry: object | null,
 *   public_payload: object | null,
 *   source_lens_records: readonly object[],
 *   historical_reflection_record: object | null,
 * }} fields
 */
function freezeResult(fields) {
  return Object.freeze({
    activated: fields.activated,
    reason_code: fields.reason_code,
    context: CONTEXT_POST_EVIDENCE,
    interaction_version: INTERACTION_VERSION,
    corpus_version: CORPUS_VERSION,
    qualifying_consequence_refs: Object.freeze([
      ...fields.qualifying_consequence_refs,
    ]),
    inquiry: fields.inquiry,
    public_payload: fields.public_payload,
    source_lens_records: Object.freeze([...fields.source_lens_records]),
    historical_reflection_record: fields.historical_reflection_record,
    // Classification is always Project Interpretation / mixed when activated;
    // retained as null when not activated so absence is inspectable.
    attribution_status: fields.activated
      ? ATTRIBUTION_PROJECT_INTERPRETATION
      : null,
    evidence_domain: fields.activated ? EVIDENCE_DOMAIN_MIXED : null,
    protect_my_four_classification: fields.activated
      ? ATTRIBUTION_PROJECT_INTERPRETATION
      : null,
    protect_my_four_is_direct_ap: false,
    post_evidence_support_claim_refs: Object.freeze([
      ...POST_EVIDENCE_SOURCE_LENS_ALLOWLIST,
    ]),
    final_user_choice_open: true,
    compulsory_anti_purchase: false,
    scores_motive_or_diagnosis: false,
  });
}

/**
 * Build the post-evidence otherness inquiry only when at least one explicit
 * qualifying displayed empirical consequence reference is present.
 *
 * Domain inputs only — production behavior does not depend on case/test IDs.
 *
 * @param {{
 *   displayed_consequences?: unknown,
 *   ap_only_claims?: unknown,
 *   ap_attribution_as_empirical_support?: unknown,
 * }} [input]
 */
export function buildOthernessInquiry(input = {}) {
  // AP claim lists / AP attribution never substitute for empirical support.
  const apOnlyPresent =
    (Array.isArray(input.ap_only_claims) && input.ap_only_claims.length > 0) ||
    input.ap_attribution_as_empirical_support === true;

  const rawList = input.displayed_consequences;

  if (rawList === undefined || rawList === null) {
    return freezeResult({
      activated: false,
      reason_code: apOnlyPresent
        ? OTHERNESS_REASON.AP_ONLY_INPUT_NOT_EMPIRICAL
        : OTHERNESS_REASON.NO_CONSEQUENCE_INPUT,
      qualifying_consequence_refs: [],
      inquiry: null,
      public_payload: null,
      source_lens_records: [],
      historical_reflection_record: null,
    });
  }

  if (!Array.isArray(rawList)) {
    return freezeResult({
      activated: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
      qualifying_consequence_refs: [],
      inquiry: null,
      public_payload: null,
      source_lens_records: [],
      historical_reflection_record: null,
    });
  }

  if (rawList.length === 0) {
    return freezeResult({
      activated: false,
      reason_code: apOnlyPresent
        ? OTHERNESS_REASON.AP_ONLY_INPUT_NOT_EMPIRICAL
        : OTHERNESS_REASON.NO_CONSEQUENCE_INPUT,
      qualifying_consequence_refs: [],
      inquiry: null,
      public_payload: null,
      source_lens_records: [],
      historical_reflection_record: null,
    });
  }

  /** @type {DisplayedConsequenceReference[]} */
  const parsedRefs = [];
  /** @type {string[]} */
  const denialReasons = [];

  for (const item of rawList) {
    const parsed = parseDisplayedConsequenceReference(item);
    if (!parsed.ok) {
      denialReasons.push(parsed.reason_code);
      continue;
    }
    parsedRefs.push(parsed.ref);
    const denial = singleRefDenialReason(parsed.ref);
    if (denial) {
      denialReasons.push(denial);
    }
  }

  if (parsedRefs.length === 0) {
    return freezeResult({
      activated: false,
      reason_code: OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
      qualifying_consequence_refs: [],
      inquiry: null,
      public_payload: null,
      source_lens_records: [],
      historical_reflection_record: null,
    });
  }

  const qualifying = parsedRefs.filter(
    (ref) => singleRefDenialReason(ref) === null,
  );

  if (qualifying.length === 0) {
    // Prefer the most specific shared denial among candidates.
    /** @type {string} */
    let reason = OTHERNESS_REASON.NO_QUALIFYING_CONSEQUENCE;
    if (denialReasons.every((r) => r === OTHERNESS_REASON.IMMEDIATE_CIRCLE_ONLY)) {
      reason = OTHERNESS_REASON.IMMEDIATE_CIRCLE_ONLY;
    } else if (
      denialReasons.every(
        (r) => r === OTHERNESS_REASON.SUPPORT_UNKNOWN_OR_MISSING,
      )
    ) {
      reason = OTHERNESS_REASON.SUPPORT_UNKNOWN_OR_MISSING;
    } else if (
      denialReasons.every((r) => r === OTHERNESS_REASON.NO_DISPLAYED_CONSEQUENCE)
    ) {
      reason = OTHERNESS_REASON.NO_DISPLAYED_CONSEQUENCE;
    } else if (
      denialReasons.every((r) => r === OTHERNESS_REASON.SUPPORT_NOT_INDEPENDENT)
    ) {
      reason = OTHERNESS_REASON.SUPPORT_NOT_INDEPENDENT;
    } else if (apOnlyPresent && qualifying.length === 0) {
      // Explicit AP-only attempt with non-qualifying or empty empirical refs.
      reason =
        denialReasons[0] ?? OTHERNESS_REASON.AP_ONLY_INPUT_NOT_EMPIRICAL;
    } else {
      reason = denialReasons[0] ?? OTHERNESS_REASON.NO_QUALIFYING_CONSEQUENCE;
    }

    return freezeResult({
      activated: false,
      reason_code: reason,
      qualifying_consequence_refs: [],
      inquiry: null,
      public_payload: null,
      source_lens_records: [],
      historical_reflection_record: null,
    });
  }

  const lensBundle = buildPostEvidenceSourceLensRecords({
    qualifying_consequence_refs: qualifying,
  });
  if (!lensBundle.accepted || !lensBundle.historical_reflection_record) {
    // Qualifying refs already passed the evidence gate; failure here is an
    // internal pin/emission defect, not a silent non-activation.
    throw new Error(
      `Post-evidence Source Lens emission failed after qualifying gate: ${lensBundle.reason_code}`,
    );
  }

  const inquiry = Object.freeze({
    exact_question_text: OTHERNESS_QUESTION_TEXT,
    optional_follow_up_text: OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT,
    attribution_status: ATTRIBUTION_PROJECT_INTERPRETATION,
    evidence_domain: EVIDENCE_DOMAIN_MIXED,
    protect_my_four_classification: ATTRIBUTION_PROJECT_INTERPRETATION,
    protect_my_four_is_direct_ap: false,
    basis_claim_refs: Object.freeze([...POST_EVIDENCE_SOURCE_LENS_ALLOWLIST]),
    // Effects refer only to the supplied empirical consequence refs.
    effects_refer_to_consequence_refs: Object.freeze(
      qualifying.map((ref) => ref.consequence_ref_id),
    ),
  });

  const publicPayload = Object.freeze({
    inquiry_question: OTHERNESS_QUESTION_TEXT,
    optional_follow_up: OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT,
    attribution_status: ATTRIBUTION_PROJECT_INTERPRETATION,
    evidence_domain: EVIDENCE_DOMAIN_MIXED,
    protect_my_four_classification: ATTRIBUTION_PROJECT_INTERPRETATION,
    ...createLicensingSafeSourceLensPublicFields(),
    // Explicit absences for licensing-safe boundary.
    support_text_internal: null,
    substantial_ap_framework_prose: null,
    ai_page_summary_as_support: false,
  });

  // Defensive check: prohibited Direct AP Protect My Four renders must not
  // appear anywhere in the activated public/inquiry surface.
  const serialized = JSON.stringify({ inquiry, publicPayload });
  for (const prohibited of PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS) {
    if (serialized.includes(prohibited)) {
      throw new Error(
        `Protect My Four Direct AP render leaked into otherness output: ${prohibited}`,
      );
    }
  }

  return freezeResult({
    activated: true,
    reason_code: null,
    qualifying_consequence_refs: qualifying,
    inquiry,
    public_payload: publicPayload,
    source_lens_records: lensBundle.source_lens_records,
    historical_reflection_record: lensBundle.historical_reflection_record,
  });
}
