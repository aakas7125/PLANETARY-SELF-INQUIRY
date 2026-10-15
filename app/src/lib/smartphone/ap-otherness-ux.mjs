import {
  EXTENT_BEYOND_IMMEDIATE_CIRCLE,
  EXTENT_IMMEDIATE_CIRCLE_ONLY,
  OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT,
  OTHERNESS_QUESTION_TEXT,
  OTHERNESS_REASON,
  PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS,
  SUPPORT_STATUS_MISSING,
  SUPPORT_STATUS_SUPPORTED,
  SUPPORT_STATUS_UNKNOWN,
  SUPPORT_STATUS_UNSUPPORTED,
  buildOthernessInquiry,
} from "./ap-otherness.mjs";
import { IMPACT_CHROME } from "./impact-pathways-ux.mjs";
import { SMARTPHONE_JOURNEY_STAGES } from "./situation-ux.mjs";

/**
 * Presentation for the post-evidence Protect Four / otherness inquiry.
 *
 * buildOthernessInquiry() is the only activation authority. This module
 * copies an explicit consequence reference, or reads gate fields that a
 * displayed impact record already carries. It does not infer extent from a
 * domain, a pathway, prose, source metadata, or the general water card.
 */

const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

const SUPPORT_STATUSES = new Set([
  SUPPORT_STATUS_SUPPORTED,
  SUPPORT_STATUS_UNKNOWN,
  SUPPORT_STATUS_MISSING,
  SUPPORT_STATUS_UNSUPPORTED,
]);

const INQUIRY_CLEAR_ACTIONS = new Set([
  "set_raw",
  "mark_not_sure",
  "set_choice",
  "set_shift",
  "edit_question",
  "reset",
  "back",
]);

const COMPARISON_CLEAR_ACTIONS = new Set([
  "toggle",
  "set_horizon",
  "set_remaining_service",
  "mark_remaining_not_sure",
  "set_repair_category",
  "set_post_repair_service",
  "mark_post_repair_not_sure",
  "set_used_service",
  "mark_used_not_sure",
  "set_refurbished_service",
  "mark_refurbished_not_sure",
  "set_current_owned_model",
  "set_candidate_new_model",
  "reset",
]);

export const OTHERNESS_OPENING =
  "This step comes after the impact and dependency pathways. The question appears only when a displayed consequence establishes effects beyond you and the people closest to you.";

export const OTHERNESS_CLOSED_NOTE =
  "Protect Four and otherness inquiry opens only after impact and dependency pathways are entered.";

export const OTHERNESS_UNAVAILABLE_NOTE =
  "This inquiry is not open. Nothing displayed establishes that effects of this choice extend beyond you and the people closest to you. That is not a finding that those effects are absent, and it is not a finding that they stay with you and the people closest to you.";

export const OTHERNESS_IMMEDIATE_NOTE =
  "This inquiry is not open. What was displayed stays with you and the people closest to you, so this question does not apply.";

export const OTHERNESS_CLASSIFICATION =
  "Protect Four is a project interpretation. It is mixed with the empirical record. It is not a direct statement from Acharya Prashant.";

export const OTHERNESS_BOUNDARY =
  "Nothing here ranks your words, diagnoses a motive, or tells you what to buy. The final choice remains ahead.";

export const OTHERNESS_RESPONSE_HELPER =
  "What you write stays as you wrote it. It is not scored.";

export const OTHERNESS_CHROME = Object.freeze({
  eyebrow: "Phone inquiry",
  title: "Protect Four and otherness inquiry",
  continueFromImpact: "Continue to Protect Four and otherness inquiry",
  back: "Back to impact and dependency pathways",
  responseLabel: "Your response",
  followUpLabel: "Your follow-up, if you want to add one",
  disclosureSummary: "Support and provenance",
});

/**
 * @param {string} text
 * @returns {string}
 */
function publicLine(text) {
  if (typeof text !== "string" || text.length === 0 || SNAKE_CASE_TOKEN.test(text)) {
    throw new Error("Public otherness line is missing or contains an internal token");
  }
  for (const prohibited of PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS) {
    if (text.includes(prohibited)) {
      throw new Error("Public otherness line contains a prohibited Protect Four rendering");
    }
  }
  return text;
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isExtent(value) {
  return value === EXTENT_BEYOND_IMMEDIATE_CIRCLE || value === EXTENT_IMMEDIATE_CIRCLE_ONLY;
}

/**
 * Extent is read only from an explicit extent field already on the record
 * or on its empirical pathway. Statements, limits, and domain names are not extent.
 *
 * @param {Record<string, unknown>} record
 * @returns {string | undefined}
 */
function explicitExtent(record) {
  if (isExtent(record.extent)) return record.extent;
  if (isPlainObject(record.pathway) && isExtent(record.pathway.extent)) return record.pathway.extent;
  return undefined;
}

/**
 * @param {Record<string, unknown>} record
 * @returns {boolean}
 */
function isPresentedImpactDomain(record) {
  return (
    typeof record.id === "string" &&
    typeof record.heading === "string" &&
    typeof record.emitted === "boolean" &&
    Array.isArray(record.lines)
  );
}

/**
 * @param {Record<string, unknown>} record
 * @returns {string | undefined}
 */
function consequenceId(record) {
  if (typeof record.consequence_ref_id === "string" && record.consequence_ref_id.length > 0) {
    return record.consequence_ref_id;
  }
  if (
    typeof record.claimId === "string" &&
    record.claimId.length > 0 &&
    typeof record.claimVersion === "string" &&
    record.claimVersion.length > 0
  ) {
    return `${record.claimId}@${record.claimVersion}`;
  }
  return undefined;
}

/**
 * @param {Record<string, unknown>} record
 * @returns {Record<string, unknown> | undefined}
 */
function fromPresentedImpactDomain(record) {
  if (record.emitted !== true) return undefined;
  const extent = explicitExtent(record);
  if (!isExtent(extent)) return undefined;
  if (typeof record.independently_supported !== "boolean") return undefined;
  if (typeof record.support_status !== "string" || !SUPPORT_STATUSES.has(record.support_status)) {
    return undefined;
  }
  const consequenceRefId = consequenceId(record);
  if (!consequenceRefId) return undefined;
  return {
    consequence_ref_id: consequenceRefId,
    displayed: true,
    independently_supported: record.independently_supported,
    support_status: record.support_status,
    extent,
  };
}

/**
 * @param {unknown} record
 * @returns {unknown}
 */
function translateDisplayedRecord(record) {
  if (!isPlainObject(record)) return record;
  if (Object.prototype.hasOwnProperty.call(record, "consequence_ref_id")) return record;
  if (!isPresentedImpactDomain(record)) return undefined;
  return fromPresentedImpactDomain(record);
}

/**
 * Translate displayed empirical records into the consequence-reference list
 * consumed by buildOthernessInquiry(). Non-array input is left unchanged so
 * the gate can reject it. Records that are not explicit references and do
 * not already carry every gate field are omitted rather than completed.
 *
 * @param {unknown} records
 * @returns {unknown}
 */
export function displayedConsequenceReferences(records) {
  if (!Array.isArray(records)) return records;
  /** @type {unknown[]} */
  const refs = [];
  for (const record of records) {
    const translated = translateDisplayedRecord(record);
    if (translated !== undefined) refs.push(translated);
  }
  return refs;
}

/**
 * @typedef {{ opened: boolean, response: string, followUp: string }} OthernessState
 */

/** @returns {OthernessState} */
export function createOthernessState() {
  return { opened: false, response: "", followUp: "" };
}

/**
 * @param {OthernessState | null | undefined} state
 * @returns {OthernessState}
 */
function usableState(state) {
  if (!state || (state.opened !== true && state.opened !== false)) return createOthernessState();
  if (typeof state.response !== "string" || typeof state.followUp !== "string") {
    return createOthernessState();
  }
  return state;
}

/**
 * @param {OthernessState} state
 * @param {{ type?: string, text?: unknown }} action
 * @returns {OthernessState}
 */
export function reduceOtherness(state, action) {
  const current = usableState(state);
  if (action?.type === "open") {
    return { opened: true, response: current.response, followUp: current.followUp };
  }
  if (action?.type === "clear") return createOthernessState();
  if (current.opened !== true) return current;
  if (action?.type === "set_response" && typeof action.text === "string") {
    return { opened: true, response: action.text, followUp: current.followUp };
  }
  if (action?.type === "set_follow_up" && typeof action.text === "string") {
    return { opened: true, response: current.response, followUp: action.text };
  }
  return current;
}

/**
 * @param {string} actionType
 * @param {OthernessState} state
 * @returns {OthernessState}
 */
export function othernessStateAfterSituationAction(actionType, state) {
  if (actionType === "edit" || actionType === "reset") return createOthernessState();
  return state;
}

/**
 * @param {string} actionType
 * @param {OthernessState} state
 * @returns {OthernessState}
 */
export function othernessStateAfterInquiryAction(actionType, state) {
  if (INQUIRY_CLEAR_ACTIONS.has(actionType)) return createOthernessState();
  return state;
}

/**
 * @param {string} actionType
 * @param {OthernessState} state
 * @returns {OthernessState}
 */
export function othernessStateAfterComparisonAction(actionType, state) {
  if (COMPARISON_CLEAR_ACTIONS.has(actionType)) return createOthernessState();
  return state;
}

/**
 * @param {string} actionType
 * @param {OthernessState} state
 * @returns {OthernessState}
 */
export function othernessStateAfterImpactAction(actionType, state) {
  if (actionType === "clear") return createOthernessState();
  return state;
}

/**
 * Returning to impact keeps the post-evidence response.
 *
 * @param {OthernessState} state
 * @returns {OthernessState}
 */
export function othernessStateAfterReturnToImpact(state) {
  return state;
}

/**
 * @param {{ impactAvailable?: boolean }} [context]
 * @returns {boolean}
 */
export function canEnterOtherness(context = {}) {
  return context.impactAvailable === true;
}

/**
 * @param {boolean} open
 */
function presentStages(open) {
  return SMARTPHONE_JOURNEY_STAGES.map((stage) => {
    if (!open) {
      return {
        id: stage.id,
        label: stage.id === "protect-four-otherness" ? publicLine(OTHERNESS_CHROME.title) : stage.label,
        availability: "pending",
        note: "Pending. Not part of this step.",
      };
    }
    if (stage.id === "situation") {
      return { id: stage.id, label: stage.label, availability: "recorded", note: "Situation recorded." };
    }
    if (stage.id === "inquiry") {
      return { id: stage.id, label: stage.label, availability: "recorded", note: "Inquiry recorded." };
    }
    if (stage.id === "empirical-comparison") {
      return {
        id: stage.id,
        label: stage.label,
        availability: "recorded",
        note: "Empirical comparison recorded.",
      };
    }
    if (stage.id === "impact-dependency") {
      return {
        id: stage.id,
        label: IMPACT_CHROME.title,
        availability: "recorded",
        note: "Impact and dependency pathways recorded.",
      };
    }
    if (stage.id === "protect-four-otherness") {
      return {
        id: stage.id,
        label: publicLine(OTHERNESS_CHROME.title),
        availability: "current",
        note: "Current stage",
      };
    }
    return {
      id: stage.id,
      label: stage.label,
      availability: "pending",
      note: "Pending. Not part of this step.",
    };
  });
}

/**
 * @param {Record<string, unknown>} payload
 */
function disclosureFromPayload(payload) {
  const claims = Array.isArray(payload.claims) ? payload.claims : [];
  const corpusVersion = payload.corpus_version;
  if (typeof corpusVersion !== "string") {
    throw new Error("Activated otherness payload is missing its corpus pin");
  }
  return {
    summary: publicLine(OTHERNESS_CHROME.disclosureSummary),
    corpusLine: publicLine(`Corpus ${corpusVersion}.`),
    claims: claims.map((claim) => {
      const record = /** @type {Record<string, unknown>} */ (claim);
      const links = Array.isArray(record.official_source_links) ? record.official_source_links : [];
      return {
        claimLine: publicLine(`Claim ${String(record.claim_id)}, version ${String(record.claim_version)}.`),
        paraphrase: publicLine(String(record.approved_paraphrase)),
        links: links.map((link) => {
          const source = /** @type {Record<string, unknown>} */ (link);
          return {
            title: publicLine(String(source.title)),
            href: typeof source.url === "string" ? source.url : "",
          };
        }),
      };
    }),
  };
}

/**
 * @param {OthernessState} state
 * @param {{
 *   impactAvailable?: boolean,
 *   displayedRecords?: unknown,
 *   apOnlyClaims?: unknown,
 *   apAttributionAsEmpiricalSupport?: unknown,
 * }} [context]
 */
export function describeOtherness(state, context = {}) {
  const current = usableState(state);
  const open = current.opened === true && canEnterOtherness(context);
  const stages = presentStages(open);
  if (!open) {
    return {
      available: false,
      activated: false,
      opening: publicLine(OTHERNESS_OPENING),
      closedNote: publicLine(OTHERNESS_CLOSED_NOTE),
      unavailableNote: null,
      question: null,
      followUpPrompt: null,
      classificationLine: null,
      response: "",
      followUpResponse: "",
      responseHelper: null,
      boundary: null,
      stages,
      disclosure: null,
      inspection: null,
    };
  }

  /** @type {Record<string, unknown>} */
  const gateInput = {
    displayed_consequences: displayedConsequenceReferences(context.displayedRecords),
  };
  if (Object.prototype.hasOwnProperty.call(context, "apOnlyClaims")) {
    gateInput.ap_only_claims = context.apOnlyClaims;
  }
  if (context.apAttributionAsEmpiricalSupport === true) {
    gateInput.ap_attribution_as_empirical_support = true;
  }
  const built = buildOthernessInquiry(gateInput);
  const activated = built.activated === true;

  if (!activated) {
    const unavailable =
      built.reason_code === OTHERNESS_REASON.IMMEDIATE_CIRCLE_ONLY
        ? OTHERNESS_IMMEDIATE_NOTE
        : OTHERNESS_UNAVAILABLE_NOTE;
    return {
      available: true,
      activated: false,
      opening: publicLine(OTHERNESS_OPENING),
      closedNote: null,
      unavailableNote: publicLine(unavailable),
      question: null,
      followUpPrompt: null,
      classificationLine: null,
      response: "",
      followUpResponse: "",
      responseHelper: null,
      boundary: publicLine(OTHERNESS_BOUNDARY),
      stages,
      disclosure: null,
      inspection: {
        reasonCode: built.reason_code,
        qualifyingConsequenceRefs: built.qualifying_consequence_refs,
        publicPayload: built.public_payload,
        historicalReflectionRecord: built.historical_reflection_record,
        supportClaimRefs: built.post_evidence_support_claim_refs,
        finalUserChoiceOpen: built.final_user_choice_open,
        compulsoryAntiPurchase: built.compulsory_anti_purchase,
        scoresMotiveOrDiagnosis: built.scores_motive_or_diagnosis,
        protectMyFourIsDirectAp: built.protect_my_four_is_direct_ap,
      },
    };
  }

  const payload = /** @type {{
    inquiry_question?: string,
    optional_follow_up?: string,
    support_text_internal?: unknown,
    substantial_ap_framework_prose?: unknown,
    claims?: unknown,
    corpus_version?: unknown,
  } | null} */ (built.public_payload);
  const inquiry = /** @type {{
    exact_question_text?: string,
    optional_follow_up_text?: string,
  } | null} */ (built.inquiry);
  if (
    !payload ||
    !inquiry ||
    payload.inquiry_question !== inquiry.exact_question_text ||
    payload.inquiry_question !== OTHERNESS_QUESTION_TEXT ||
    payload.optional_follow_up !== inquiry.optional_follow_up_text ||
    payload.optional_follow_up !== OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT ||
    built.protect_my_four_is_direct_ap !== false ||
    built.attribution_status !== "project_interpretation" ||
    built.evidence_domain !== "mixed" ||
    payload.support_text_internal !== null ||
    payload.substantial_ap_framework_prose !== null
  ) {
    throw new Error("Activated otherness presentation does not match the accepted gate");
  }

  return {
    available: true,
    activated: true,
    opening: publicLine(OTHERNESS_OPENING),
    closedNote: null,
    unavailableNote: null,
    question: payload.inquiry_question,
    followUpPrompt: payload.optional_follow_up,
    classificationLine: publicLine(OTHERNESS_CLASSIFICATION),
    response: current.response,
    followUpResponse: current.followUp,
    responseHelper: publicLine(OTHERNESS_RESPONSE_HELPER),
    boundary: publicLine(OTHERNESS_BOUNDARY),
    stages,
    disclosure: disclosureFromPayload(/** @type {Record<string, unknown>} */ (payload)),
    inspection: {
      reasonCode: built.reason_code,
      qualifyingConsequenceRefs: built.qualifying_consequence_refs,
      publicPayload: payload,
      historicalReflectionRecord: built.historical_reflection_record,
      supportClaimRefs: built.post_evidence_support_claim_refs,
      finalUserChoiceOpen: built.final_user_choice_open,
      compulsoryAntiPurchase: built.compulsory_anti_purchase,
      scoresMotiveOrDiagnosis: built.scores_motive_or_diagnosis,
      protectMyFourIsDirectAp: built.protect_my_four_is_direct_ap,
    },
  };
}
