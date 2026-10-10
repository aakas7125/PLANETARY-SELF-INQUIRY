import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AUTHORIZED_REFLECTION_OPERATIONS,
} from "../src/lib/smartphone/ap-branch-reflection.mjs";
import {
  assessInquiryAutonomy,
  buildApInquirySession,
} from "../src/lib/smartphone/ap-inquiry.mjs";
import {
  CONTEXT_INITIAL_INQUIRY,
  INITIAL_INQUIRY_SOURCE_LENS_ALLOWLIST,
  SOURCE_LENS_CLAIM_REGISTRY,
  SOURCE_LENS_REASON,
  isInitialInquirySourceLensAllowed,
  parseClaimRef,
  resolveSourceLensAuthority,
} from "../src/lib/smartphone/ap-source-lens.mjs";

const ALLOWED_INITIAL_INQUIRY_REFS = [
  "APF-SEE-001@1.2",
  "APF-CON-001@1.1",
  "APF-APP-001@1.1",
  "APF-DES-001@1.1",
  "APF-FEAR-001@1.1",
  "MOB-CON-001@1.1",
];

/** Minimal session inputs that yield a concrete_need reflection path. */
function concreteNeedAnswers() {
  return {
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot tether reliably.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot tether reliably",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Only faster downloads.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "Only faster downloads",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "Desire predated exposure.",
      proposed_observation: {
        proposed_value: "desire_predated_exposure",
        supporting_exact_span: "Desire predated exposure",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer: "Unchanged if private.",
      proposed_observation: {
        proposed_value: "unchanged",
        supporting_exact_span: "Unchanged if private",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "Practical only.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "Practical only",
      },
    },
  };
}

test("INV-AP-14: initial-inquiry allowlist is exactly the six authorized versioned claims", () => {
  assert.deepEqual(
    [...INITIAL_INQUIRY_SOURCE_LENS_ALLOWLIST],
    ALLOWED_INITIAL_INQUIRY_REFS,
  );
  for (const claimRef of ALLOWED_INITIAL_INQUIRY_REFS) {
    assert.equal(isInitialInquirySourceLensAllowed(claimRef), true);
  }
  assert.equal(isInitialInquirySourceLensAllowed("APF-INC-001@1.1"), false);
  assert.equal(isInitialInquirySourceLensAllowed("AP-OTH-001@1.1"), false);
  assert.equal(isInitialInquirySourceLensAllowed("AP-PLAN-001@1.1"), false);
  assert.equal(isInitialInquirySourceLensAllowed("APF-SEE-001@1.1"), false);
  assert.equal(isInitialInquirySourceLensAllowed("APF-SEE-001"), false);
});

test("INV-AP-14: each authorized initial-inquiry claim passes with inspectable AP authority", () => {
  for (const claimRef of ALLOWED_INITIAL_INQUIRY_REFS) {
    const { claim_id, claim_version } = parseClaimRef(claimRef);
    const byParts = resolveSourceLensAuthority({
      claim_id,
      claim_version,
      context: CONTEXT_INITIAL_INQUIRY,
    });
    const byRef = resolveSourceLensAuthority({
      claim_ref: claimRef,
      context: CONTEXT_INITIAL_INQUIRY,
    });

    for (const decision of [byParts, byRef]) {
      assert.equal(decision.authorized, true);
      assert.equal(decision.reason_code, null);
      assert.equal(decision.claim_id, claim_id);
      assert.equal(decision.claim_version, claim_version);
      assert.equal(decision.claim_ref, claimRef);
      assert.equal(decision.eligibility, "initial_inquiry");
      assert.equal(decision.external_reference_authority, "versioned_ap_claim");
      assert.equal(decision.external_reference_authority_ref, claimRef);
      assert.equal(decision.ai_is_external_reference_authority, false);
      assert.equal(decision.generator_is_external_reference_authority, false);
      assert.equal(decision.source_lens_content, null);
      assert.equal(decision.source_lens_emitted, false);
    }
  }
});

test("INV-AP-14: unknown claim IDs are deterministically denied", () => {
  const decision = resolveSourceLensAuthority({
    claim_id: "APF-UNKNOWN-999",
    claim_version: "1.0",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(decision.authorized, false);
  assert.equal(decision.reason_code, SOURCE_LENS_REASON.UNKNOWN_CLAIM);
  assert.equal(decision.external_reference_authority, null);
  assert.equal(decision.external_reference_authority_ref, null);
  assert.equal(decision.ai_is_external_reference_authority, false);
});

test("INV-AP-14: missing versions are deterministically denied", () => {
  const byIdOnly = resolveSourceLensAuthority({
    claim_id: "APF-SEE-001",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(byIdOnly.authorized, false);
  assert.equal(byIdOnly.reason_code, SOURCE_LENS_REASON.MISSING_VERSION);

  const byUnversionedRef = resolveSourceLensAuthority({
    claim_ref: "APF-SEE-001",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(byUnversionedRef.authorized, false);
  assert.equal(byUnversionedRef.reason_code, SOURCE_LENS_REASON.MISSING_VERSION);
});

test("INV-AP-14: wrong versions are denied without silent normalization", () => {
  const wrongSee = resolveSourceLensAuthority({
    claim_id: "APF-SEE-001",
    claim_version: "1.1",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(wrongSee.authorized, false);
  assert.equal(wrongSee.reason_code, SOURCE_LENS_REASON.WRONG_VERSION);
  assert.equal(wrongSee.claim_version, "1.1");
  assert.notEqual(wrongSee.claim_version, SOURCE_LENS_CLAIM_REGISTRY["APF-SEE-001"].claim_version);
  assert.equal(wrongSee.external_reference_authority_ref, null);

  const wrongCon = resolveSourceLensAuthority({
    claim_ref: "APF-CON-001@1.2",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(wrongCon.authorized, false);
  assert.equal(wrongCon.reason_code, SOURCE_LENS_REASON.WRONG_VERSION);
  assert.equal(wrongCon.claim_ref, "APF-CON-001@1.2");
});

test("INV-AP-14: background-only APF-INC-001@1.1 fails in initial inquiry", () => {
  const decision = resolveSourceLensAuthority({
    claim_ref: "APF-INC-001@1.1",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(decision.authorized, false);
  assert.equal(
    decision.reason_code,
    SOURCE_LENS_REASON.BACKGROUND_ONLY_NOT_INITIAL_INQUIRY,
  );
  assert.equal(decision.external_reference_authority, null);
});

test("INV-AP-14: post-evidence claims fail in initial inquiry", () => {
  for (const claimRef of ["AP-OTH-001@1.1", "AP-PLAN-001@1.1"]) {
    const decision = resolveSourceLensAuthority({
      claim_ref: claimRef,
      context: CONTEXT_INITIAL_INQUIRY,
    });
    assert.equal(decision.authorized, false);
    assert.equal(
      decision.reason_code,
      SOURCE_LENS_REASON.POST_EVIDENCE_ONLY_NOT_INITIAL_INQUIRY,
    );
    assert.equal(decision.external_reference_authority, null);
  }
});

test("INV-AP-14: unversioned free text cannot become authority", () => {
  const decision = resolveSourceLensAuthority({
    free_text_authority: "A teacher said phones are ego.",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(decision.authorized, false);
  assert.equal(
    decision.reason_code,
    SOURCE_LENS_REASON.UNVERSIONED_FREE_TEXT_NOT_AUTHORITY,
  );
  assert.equal(decision.external_reference_authority, null);
  assert.equal(decision.ai_is_external_reference_authority, false);
});

test("INV-AP-14: no silent claim substitution on denied requests", () => {
  const denied = resolveSourceLensAuthority({
    claim_ref: "APF-INC-001@1.1",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(denied.authorized, false);
  assert.equal(denied.claim_ref, "APF-INC-001@1.1");
  assert.notEqual(denied.external_reference_authority_ref, "APF-SEE-001@1.2");
  assert.equal(
    ALLOWED_INITIAL_INQUIRY_REFS.includes(denied.external_reference_authority_ref),
    false,
  );
});

test("INV-AP-15: AI/generator cannot be designated as external-reference authority", () => {
  const attempts = [
    { designate_ai_as_external_reference_authority: true },
    { designate_generator_as_external_reference_authority: true },
    { designate_ai_as_teacher: true },
    { designate_ai_as_text: true },
    { designate_ai_as_tradition: true },
  ];

  for (const attempt of attempts) {
    const decision = resolveSourceLensAuthority({
      claim_ref: "APF-SEE-001@1.2",
      context: CONTEXT_INITIAL_INQUIRY,
      ...attempt,
    });
    assert.equal(decision.authorized, false);
    assert.equal(
      decision.reason_code,
      SOURCE_LENS_REASON.AI_NOT_EXTERNAL_REFERENCE_AUTHORITY,
    );
    assert.equal(decision.ai_is_external_reference_authority, false);
    assert.equal(decision.generator_is_external_reference_authority, false);
    assert.equal(decision.external_reference_authority, null);
    assert.equal(decision.external_reference_authority_ref, null);
  }
});

test("INV-AP-15: allowed decision identifies versioned AP claim, not AI, as authority", () => {
  const decision = resolveSourceLensAuthority({
    claim_id: "MOB-CON-001",
    claim_version: "1.1",
    context: CONTEXT_INITIAL_INQUIRY,
  });
  assert.equal(decision.authorized, true);
  assert.equal(decision.external_reference_authority, "versioned_ap_claim");
  assert.equal(decision.external_reference_authority_ref, "MOB-CON-001@1.1");
  assert.equal(decision.ai_is_external_reference_authority, false);
  assert.equal(decision.generator_is_external_reference_authority, false);
  assert.equal(
    Object.prototype.hasOwnProperty.call(decision, "ai_is_external_reference_authority"),
    true,
  );
  assert.notEqual(decision.external_reference_authority, "ai");
  assert.notEqual(decision.external_reference_authority, "generator");
  assert.notEqual(decision.external_reference_authority, "reflection_engine");
});

test("non-emission: resolver does not insert SOURCE_LENS into current reflections", () => {
  const session = buildApInquirySession(concreteNeedAnswers());
  assert.equal(session.reflection.source_lens_emitted, false);
  assert.equal(session.reflection.operations.includes("SOURCE_LENS"), false);
  for (const operation of session.reflection.operations) {
    assert.equal(AUTHORIZED_REFLECTION_OPERATIONS.includes(operation), true);
  }

  // Resolver may be consulted independently; reflection remains non-emitting.
  const gate = resolveSourceLensAuthority({ claim_ref: "APF-SEE-001@1.2" });
  assert.equal(gate.authorized, true);
  assert.equal(gate.source_lens_emitted, false);
  assert.equal(gate.source_lens_content, null);
  assert.equal(session.reflection.source_lens_emitted, false);
  assert.equal(session.reflection.operations.includes("SOURCE_LENS"), false);

  const autonomy = assessInquiryAutonomy(session);
  assert.equal(autonomy.motive_scores_present, false);
});
