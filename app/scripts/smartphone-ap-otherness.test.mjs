import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ATTRIBUTION_PROJECT_INTERPRETATION,
  EVIDENCE_DOMAIN_MIXED,
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
  parseDisplayedConsequenceReference,
} from "../src/lib/smartphone/ap-otherness.mjs";
import {
  CONTEXT_INITIAL_INQUIRY,
  CONTEXT_POST_EVIDENCE,
  CORPUS_VERSION,
  INITIAL_INQUIRY_SOURCE_LENS_ALLOWLIST,
  POST_EVIDENCE_SOURCE_LENS_ALLOWLIST,
  SOURCE_LENS_REASON,
  buildPostEvidenceSourceLensRecords,
  createPinnedHistoricalSourceLensRecord,
  isInitialInquirySourceLensAllowed,
  isPostEvidenceSourceLensAllowed,
  resolveSourceLensAuthority,
} from "../src/lib/smartphone/ap-source-lens.mjs";

/** One explicit qualifying displayed consequence reference. */
function qualifyingConsequence(overrides = {}) {
  return {
    consequence_ref_id: "emp-consequence-beyond-circle-001",
    displayed: true,
    independently_supported: true,
    support_status: SUPPORT_STATUS_SUPPORTED,
    extent: EXTENT_BEYOND_IMMEDIATE_CIRCLE,
    ...overrides,
  };
}

test("INV-AP-17: activates only for an explicit qualifying displayed consequence", () => {
  const consequence = qualifyingConsequence();
  const result = buildOthernessInquiry({
    displayed_consequences: [consequence],
  });

  assert.equal(result.activated, true);
  assert.equal(result.reason_code, null);
  assert.equal(result.qualifying_consequence_refs.length, 1);
  assert.equal(
    result.qualifying_consequence_refs[0].consequence_ref_id,
    "emp-consequence-beyond-circle-001",
  );
  assert.deepEqual(result.inquiry.effects_refer_to_consequence_refs, [
    "emp-consequence-beyond-circle-001",
  ]);
  // Inspectable reference preserved — empirical meaning not rewritten.
  assert.equal(result.qualifying_consequence_refs[0].displayed, true);
  assert.equal(
    result.qualifying_consequence_refs[0].independently_supported,
    true,
  );
  assert.equal(
    result.qualifying_consequence_refs[0].support_status,
    SUPPORT_STATUS_SUPPORTED,
  );
  assert.equal(
    result.qualifying_consequence_refs[0].extent,
    EXTENT_BEYOND_IMMEDIATE_CIRCLE,
  );
});

test("INV-AP-17: exact approved question and optional follow-up when activated", () => {
  const result = buildOthernessInquiry({
    displayed_consequences: [qualifyingConsequence()],
  });
  assert.equal(result.activated, true);
  assert.equal(result.inquiry.exact_question_text, OTHERNESS_QUESTION_TEXT);
  assert.equal(
    result.inquiry.optional_follow_up_text,
    OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT,
  );
  assert.equal(
    result.public_payload.inquiry_question,
    "Some effects of this choice extend beyond you and the people closest to you. Do you see those affected interests as separate from what you care about, or connected to it?",
  );
  assert.equal(
    result.public_payload.optional_follow_up,
    "What makes you see it that way?",
  );
  assert.equal(result.final_user_choice_open, true);
  assert.equal(result.compulsory_anti_purchase, false);
  assert.equal(result.scores_motive_or_diagnosis, false);
});

test("INV-AP-17: no consequence input does not activate", () => {
  const missing = buildOthernessInquiry({});
  assert.equal(missing.activated, false);
  assert.equal(missing.reason_code, OTHERNESS_REASON.NO_CONSEQUENCE_INPUT);
  assert.equal(missing.inquiry, null);

  const empty = buildOthernessInquiry({ displayed_consequences: [] });
  assert.equal(empty.activated, false);
  assert.equal(empty.reason_code, OTHERNESS_REASON.NO_CONSEQUENCE_INPUT);
});

test("INV-AP-17: unknown or missing support does not activate", () => {
  const unknown = buildOthernessInquiry({
    displayed_consequences: [
      qualifyingConsequence({ support_status: SUPPORT_STATUS_UNKNOWN }),
    ],
  });
  assert.equal(unknown.activated, false);
  assert.equal(
    unknown.reason_code,
    OTHERNESS_REASON.SUPPORT_UNKNOWN_OR_MISSING,
  );

  const missing = buildOthernessInquiry({
    displayed_consequences: [
      qualifyingConsequence({ support_status: SUPPORT_STATUS_MISSING }),
    ],
  });
  assert.equal(missing.activated, false);
  assert.equal(
    missing.reason_code,
    OTHERNESS_REASON.SUPPORT_UNKNOWN_OR_MISSING,
  );
});

test("INV-AP-17: unsupported or non-independent support does not activate", () => {
  const unsupported = buildOthernessInquiry({
    displayed_consequences: [
      qualifyingConsequence({ support_status: SUPPORT_STATUS_UNSUPPORTED }),
    ],
  });
  assert.equal(unsupported.activated, false);
  assert.equal(
    unsupported.reason_code,
    OTHERNESS_REASON.SUPPORT_NOT_INDEPENDENT,
  );

  const notIndependent = buildOthernessInquiry({
    displayed_consequences: [
      qualifyingConsequence({ independently_supported: false }),
    ],
  });
  assert.equal(notIndependent.activated, false);
  assert.equal(
    notIndependent.reason_code,
    OTHERNESS_REASON.SUPPORT_NOT_INDEPENDENT,
  );
});

test("INV-AP-17: immediate-circle-only consequences do not activate", () => {
  const result = buildOthernessInquiry({
    displayed_consequences: [
      qualifyingConsequence({ extent: EXTENT_IMMEDIATE_CIRCLE_ONLY }),
    ],
  });
  assert.equal(result.activated, false);
  assert.equal(result.reason_code, OTHERNESS_REASON.IMMEDIATE_CIRCLE_ONLY);
  assert.equal(result.inquiry, null);
});

test("INV-AP-17: not-displayed consequences do not activate", () => {
  const result = buildOthernessInquiry({
    displayed_consequences: [qualifyingConsequence({ displayed: false })],
  });
  assert.equal(result.activated, false);
  assert.equal(result.reason_code, OTHERNESS_REASON.NO_DISPLAYED_CONSEQUENCE);
});

test("INV-AP-17: AP-only inputs cannot substitute for empirical support", () => {
  const apOnly = buildOthernessInquiry({
    ap_only_claims: ["AP-OTH-001@1.1", "AP-PLAN-001@1.1"],
    ap_attribution_as_empirical_support: true,
  });
  assert.equal(apOnly.activated, false);
  assert.equal(
    apOnly.reason_code,
    OTHERNESS_REASON.AP_ONLY_INPUT_NOT_EMPIRICAL,
  );
  assert.equal(apOnly.inquiry, null);

  // AP claims alongside a non-qualifying/empty empirical list still fail.
  const apWithEmpty = buildOthernessInquiry({
    displayed_consequences: [],
    ap_only_claims: ["AP-OTH-001@1.1"],
  });
  assert.equal(apWithEmpty.activated, false);
  assert.equal(
    apWithEmpty.reason_code,
    OTHERNESS_REASON.AP_ONLY_INPUT_NOT_EMPIRICAL,
  );
});

test("INV-AP-17: malformed consequence inputs do not activate", () => {
  const notArray = buildOthernessInquiry({
    displayed_consequences: { consequence_ref_id: "x" },
  });
  assert.equal(notArray.activated, false);
  assert.equal(
    notArray.reason_code,
    OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
  );

  const truthyObjectSupport = buildOthernessInquiry({
    displayed_consequences: [
      {
        consequence_ref_id: "bad-1",
        displayed: "yes",
        independently_supported: { ok: true },
        support_status: SUPPORT_STATUS_SUPPORTED,
        extent: EXTENT_BEYOND_IMMEDIATE_CIRCLE,
      },
    ],
  });
  assert.equal(truthyObjectSupport.activated, false);
  assert.equal(
    truthyObjectSupport.reason_code,
    OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
  );

  const missingFields = parseDisplayedConsequenceReference({
    consequence_ref_id: "only-id",
  });
  assert.equal(missingFields.ok, false);
  assert.equal(
    missingFields.reason_code,
    OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
  );
});

test("INV-AP-17: prose or case_id cannot invent empirical support", () => {
  const prose = buildOthernessInquiry({
    displayed_consequences: [
      {
        consequence_ref_id: "prose-only",
        displayed: true,
        independently_supported: true,
        support_status: SUPPORT_STATUS_SUPPORTED,
        extent: EXTENT_BEYOND_IMMEDIATE_CIRCLE,
        // Extra prose must not be treated as authority; gate uses explicit fields.
        narrative:
          "Obviously this harms distant workers so otherness should open.",
        case_id: "INV-AP-17-FORCE-OPEN",
      },
    ],
  });
  // Explicit fields still qualify — case_id/prose are ignored, not used to invent.
  assert.equal(prose.activated, true);
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      prose.qualifying_consequence_refs[0],
      "case_id",
    ),
    false,
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      prose.qualifying_consequence_refs[0],
      "narrative",
    ),
    false,
  );

  // Without explicit support flags, prose alone fails.
  const proseOnly = buildOthernessInquiry({
    displayed_consequences: [
      {
        narrative: "Distant harm exists.",
        case_id: "FORCE",
      },
    ],
  });
  assert.equal(proseOnly.activated, false);
  assert.equal(
    proseOnly.reason_code,
    OTHERNESS_REASON.MALFORMED_CONSEQUENCE_INPUT,
  );
});

test("INV-AP-18: classification is Project Interpretation / mixed, never Direct AP", () => {
  const result = buildOthernessInquiry({
    displayed_consequences: [qualifyingConsequence()],
  });
  assert.equal(result.activated, true);
  assert.equal(
    result.attribution_status,
    ATTRIBUTION_PROJECT_INTERPRETATION,
  );
  assert.equal(result.evidence_domain, EVIDENCE_DOMAIN_MIXED);
  assert.equal(
    result.protect_my_four_classification,
    ATTRIBUTION_PROJECT_INTERPRETATION,
  );
  assert.equal(result.protect_my_four_is_direct_ap, false);
  assert.equal(
    result.inquiry.attribution_status,
    "project_interpretation",
  );
  assert.equal(result.inquiry.evidence_domain, "mixed");
  assert.notEqual(result.attribution_status, "direct_ap");
  assert.notEqual(result.protect_my_four_classification, "direct_ap");

  const serialized = JSON.stringify(result);
  for (const prohibited of PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS) {
    assert.equal(serialized.includes(prohibited), false);
  }
  assert.equal(
    serialized.includes(
      "AP says protecting your family requires protecting the whole planet.",
    ),
    false,
  );
  assert.equal(
    serialized.includes(
      "If you really love your four people, you must protect everyone.",
    ),
    false,
  );
});

test("INV-AP-19: public payload is licensing-safe and excludes internal support text", () => {
  const result = buildOthernessInquiry({
    displayed_consequences: [qualifyingConsequence()],
  });
  assert.equal(result.activated, true);
  const payload = result.public_payload;
  assert.equal(payload.inquiry_question, OTHERNESS_QUESTION_TEXT);
  assert.equal(payload.optional_follow_up, OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT);
  assert.deepEqual(payload.claim_refs, ["AP-OTH-001@1.1", "AP-PLAN-001@1.1"]);
  assert.equal(payload.corpus_version, CORPUS_VERSION);
  assert.equal(payload.support_text_internal, null);
  assert.equal(payload.substantial_ap_framework_prose, null);
  assert.equal(payload.ai_page_summary_as_support, false);

  for (const claim of payload.claims) {
    assert.ok(typeof claim.approved_paraphrase === "string");
    assert.ok(claim.approved_paraphrase.length > 0);
    assert.ok(Array.isArray(claim.official_source_links));
    assert.ok(claim.official_source_links.length > 0);
    assert.ok(Array.isArray(claim.provenance_labels));
    assert.equal(claim.external_reference_authority, "versioned_ap_claim");
    assert.equal(
      Object.prototype.hasOwnProperty.call(claim, "support_text_internal"),
      false,
    );
  }

  const serialized = JSON.stringify(payload);
  assert.equal(serialized.includes("support_text_internal\":\""), false);
  // Must not dump substantial Framework lexicon dumps.
  assert.equal(serialized.includes("Change = Seeing + Intent"), false);
});

test("INV-AP-19/14 boundary: post-evidence allowlist is exactly OTH+PLAN; initial inquiry unchanged", () => {
  assert.deepEqual([...POST_EVIDENCE_SOURCE_LENS_ALLOWLIST], [
    "AP-OTH-001@1.1",
    "AP-PLAN-001@1.1",
  ]);
  assert.equal(isPostEvidenceSourceLensAllowed("AP-OTH-001@1.1"), true);
  assert.equal(isPostEvidenceSourceLensAllowed("AP-PLAN-001@1.1"), true);
  assert.equal(isPostEvidenceSourceLensAllowed("APF-SEE-001@1.2"), false);
  assert.equal(isPostEvidenceSourceLensAllowed("AP-OTH-001@1.0"), false);

  // Initial-inquiry allowlist and denials for post-evidence claims remain.
  assert.deepEqual([...INITIAL_INQUIRY_SOURCE_LENS_ALLOWLIST], [
    "APF-SEE-001@1.2",
    "APF-CON-001@1.1",
    "APF-APP-001@1.1",
    "APF-DES-001@1.1",
    "APF-FEAR-001@1.1",
    "MOB-CON-001@1.1",
  ]);
  assert.equal(isInitialInquirySourceLensAllowed("AP-OTH-001@1.1"), false);
  assert.equal(isInitialInquirySourceLensAllowed("AP-PLAN-001@1.1"), false);

  for (const claimRef of ["AP-OTH-001@1.1", "AP-PLAN-001@1.1"]) {
    const initial = resolveSourceLensAuthority({
      claim_ref: claimRef,
      context: CONTEXT_INITIAL_INQUIRY,
    });
    assert.equal(initial.authorized, false);
    assert.equal(
      initial.reason_code,
      SOURCE_LENS_REASON.POST_EVIDENCE_ONLY_NOT_INITIAL_INQUIRY,
    );

    const post = resolveSourceLensAuthority({
      claim_ref: claimRef,
      context: CONTEXT_POST_EVIDENCE,
    });
    assert.equal(post.authorized, true);
    assert.equal(post.eligibility, "post_evidence_only");
    assert.equal(post.external_reference_authority, "versioned_ap_claim");
    assert.equal(post.ai_is_external_reference_authority, false);
  }

  const initialClaimInPost = resolveSourceLensAuthority({
    claim_ref: "APF-SEE-001@1.2",
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(initialClaimInPost.authorized, false);
  assert.equal(
    initialClaimInPost.reason_code,
    SOURCE_LENS_REASON.INITIAL_INQUIRY_ONLY_NOT_POST_EVIDENCE,
  );
});

test("INV-AP-20: every emitted Source Lens/history record pins claim_id, claim_version, corpus_version", () => {
  const result = buildOthernessInquiry({
    displayed_consequences: [qualifyingConsequence()],
  });
  assert.equal(result.activated, true);
  assert.equal(result.source_lens_records.length, 2);

  for (const record of result.source_lens_records) {
    assert.ok(typeof record.claim_id === "string" && record.claim_id.length > 0);
    assert.ok(
      typeof record.claim_version === "string" && record.claim_version.length > 0,
    );
    assert.equal(record.corpus_version, "AP-CORPUS-V0.3.0");
    assert.equal(record.external_reference_authority, "versioned_ap_claim");
    assert.equal(record.ai_is_external_reference_authority, false);
    assert.equal(record.support_text_internal, null);
  }

  const hist = result.historical_reflection_record;
  assert.equal(hist.corpus_version, CORPUS_VERSION);
  assert.equal(hist.claim_pins.length, 2);
  for (const pin of hist.claim_pins) {
    assert.ok(pin.claim_id);
    assert.ok(pin.claim_version);
    assert.equal(pin.corpus_version, CORPUS_VERSION);
  }

  const oth = result.source_lens_records.find((r) => r.claim_id === "AP-OTH-001");
  assert.ok(oth);
  assert.equal(oth.claim_version, "1.1");
  assert.ok(
    oth.provenance_labels.includes("P3_official_transcript_support"),
  );
  assert.ok(
    oth.provenance_labels.includes("exact_primary_video_lineage_unresolved"),
  );
  assert.ok(
    oth.provenance_labels.includes(
      "ai_generated_page_summary_excluded_from_claim_support",
    ),
  );
  assert.ok(oth.provenance_labels.includes("post_evidence_only"));
});

test("INV-AP-20: incomplete, conflicting, or substituted pins are rejected", () => {
  const incompleteClaimVersion = createPinnedHistoricalSourceLensRecord({
    claim_id: "AP-OTH-001",
    corpus_version: CORPUS_VERSION,
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(incompleteClaimVersion.accepted, false);
  assert.equal(
    incompleteClaimVersion.reason_code,
    SOURCE_LENS_REASON.MISSING_VERSION,
  );
  assert.equal(incompleteClaimVersion.record, null);

  const omittedCorpus = createPinnedHistoricalSourceLensRecord({
    claim_ref: "AP-OTH-001@1.1",
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(omittedCorpus.accepted, false);
  assert.equal(
    omittedCorpus.reason_code,
    SOURCE_LENS_REASON.INCOMPLETE_PROVENANCE_PIN,
  );
  assert.equal(omittedCorpus.record, null);

  const nullCorpus = createPinnedHistoricalSourceLensRecord({
    claim_ref: "AP-OTH-001@1.1",
    corpus_version: null,
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(nullCorpus.accepted, false);
  assert.equal(
    nullCorpus.reason_code,
    SOURCE_LENS_REASON.INCOMPLETE_PROVENANCE_PIN,
  );

  const emptyCorpus = createPinnedHistoricalSourceLensRecord({
    claim_ref: "AP-OTH-001@1.1",
    corpus_version: "",
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(emptyCorpus.accepted, false);
  assert.equal(
    emptyCorpus.reason_code,
    SOURCE_LENS_REASON.INCOMPLETE_PROVENANCE_PIN,
  );

  const wrongVersion = createPinnedHistoricalSourceLensRecord({
    claim_ref: "AP-OTH-001@1.0",
    corpus_version: CORPUS_VERSION,
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(wrongVersion.accepted, false);
  assert.equal(wrongVersion.reason_code, SOURCE_LENS_REASON.WRONG_VERSION);

  const conflictingCorpus = createPinnedHistoricalSourceLensRecord({
    claim_ref: "AP-OTH-001@1.1",
    corpus_version: "AP-CORPUS-V9.9.9",
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(conflictingCorpus.accepted, false);
  assert.equal(
    conflictingCorpus.reason_code,
    SOURCE_LENS_REASON.CONFLICTING_CORPUS_PIN,
  );

  const substitutedInitial = createPinnedHistoricalSourceLensRecord({
    claim_ref: "APF-SEE-001@1.2",
    corpus_version: CORPUS_VERSION,
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(substitutedInitial.accepted, false);
  assert.equal(
    substitutedInitial.reason_code,
    SOURCE_LENS_REASON.INITIAL_INQUIRY_ONLY_NOT_POST_EVIDENCE,
  );
});

test("INV-AP-20: post-evidence Source Lens/history emission requires validated qualifying consequence refs", () => {
  const absent = buildPostEvidenceSourceLensRecords({});
  assert.equal(absent.accepted, false);
  assert.equal(
    absent.reason_code,
    SOURCE_LENS_REASON.MISSING_QUALIFYING_CONSEQUENCE_REFS,
  );
  assert.equal(absent.source_lens_records.length, 0);
  assert.equal(absent.historical_reflection_record, null);

  const empty = buildPostEvidenceSourceLensRecords({
    qualifying_consequence_refs: [],
  });
  assert.equal(empty.accepted, false);
  assert.equal(
    empty.reason_code,
    SOURCE_LENS_REASON.EMPTY_QUALIFYING_CONSEQUENCE_REFS,
  );
  assert.equal(empty.source_lens_records.length, 0);
  assert.equal(empty.historical_reflection_record, null);

  const malformed = buildPostEvidenceSourceLensRecords({
    qualifying_consequence_refs: [
      { consequence_ref_id: "emp-malformed", displayed: "yes" },
      null,
      "not-an-object",
    ],
  });
  assert.equal(malformed.accepted, false);
  assert.equal(
    malformed.reason_code,
    SOURCE_LENS_REASON.MALFORMED_QUALIFYING_CONSEQUENCE_REFS,
  );
  assert.equal(malformed.source_lens_records.length, 0);
  assert.equal(malformed.historical_reflection_record, null);

  const nonqualifying = buildPostEvidenceSourceLensRecords({
    qualifying_consequence_refs: [
      qualifyingConsequence({
        displayed: false,
      }),
      qualifyingConsequence({
        independently_supported: false,
        support_status: SUPPORT_STATUS_UNSUPPORTED,
      }),
      qualifyingConsequence({
        extent: EXTENT_IMMEDIATE_CIRCLE_ONLY,
      }),
      qualifyingConsequence({
        support_status: SUPPORT_STATUS_UNKNOWN,
      }),
    ],
  });
  assert.equal(nonqualifying.accepted, false);
  assert.equal(
    nonqualifying.reason_code,
    SOURCE_LENS_REASON.NONQUALIFYING_CONSEQUENCE_REFS,
  );
  assert.equal(nonqualifying.source_lens_records.length, 0);
  assert.equal(nonqualifying.historical_reflection_record, null);

  const qualifying = buildPostEvidenceSourceLensRecords({
    qualifying_consequence_refs: [qualifyingConsequence()],
  });
  assert.equal(qualifying.accepted, true);
  assert.equal(qualifying.reason_code, null);
  assert.equal(qualifying.source_lens_records.length, 2);
  assert.ok(qualifying.historical_reflection_record);
  assert.deepEqual(
    qualifying.historical_reflection_record.qualifying_consequence_ref_ids,
    ["emp-consequence-beyond-circle-001"],
  );
});

test("INV-AP-20: historical records are immutable against later object mutation", () => {
  const mutableInput = qualifyingConsequence();
  const result = buildOthernessInquiry({
    displayed_consequences: [mutableInput],
  });
  assert.equal(result.activated, true);

  const record = result.source_lens_records[0];
  const pinnedClaimId = record.claim_id;
  const pinnedVersion = record.claim_version;
  const pinnedCorpus = record.corpus_version;
  const pinnedParaphrase = record.approved_paraphrase;
  const pinnedLabels = [...record.provenance_labels];

  // Attempt to mutate the frozen record and the original input.
  assert.throws(() => {
    record.claim_id = "APF-SEE-001";
  }, TypeError);
  assert.throws(() => {
    record.claim_version = "9.9";
  }, TypeError);
  assert.throws(() => {
    record.corpus_version = "AP-CORPUS-V9.9.9";
  }, TypeError);
  assert.throws(() => {
    record.provenance_labels.push("invented_upgrade");
  }, TypeError);

  mutableInput.consequence_ref_id = "mutated-after-build";
  mutableInput.support_status = SUPPORT_STATUS_UNKNOWN;

  assert.equal(record.claim_id, pinnedClaimId);
  assert.equal(record.claim_version, pinnedVersion);
  assert.equal(record.corpus_version, pinnedCorpus);
  assert.equal(record.approved_paraphrase, pinnedParaphrase);
  assert.deepEqual([...record.provenance_labels], pinnedLabels);
  assert.equal(
    result.qualifying_consequence_refs[0].consequence_ref_id,
    "emp-consequence-beyond-circle-001",
  );
  assert.equal(
    result.historical_reflection_record.claim_pins[0].corpus_version,
    CORPUS_VERSION,
  );

  // Re-pinning with a later conflicting corpus cannot rewrite the old record.
  const later = createPinnedHistoricalSourceLensRecord({
    claim_ref: `${record.claim_id}@${record.claim_version}`,
    corpus_version: "AP-CORPUS-V0.4.0",
    context: CONTEXT_POST_EVIDENCE,
  });
  assert.equal(later.accepted, false);
  assert.equal(record.corpus_version, "AP-CORPUS-V0.3.0");
});
