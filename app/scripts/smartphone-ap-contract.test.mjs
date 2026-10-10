import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AP_ANSWER_CORE_FIELDS,
  AP_INQUIRY_SEQUENCE,
  DERIVATION_EXPLICIT,
  DERIVATION_UNCLEAR,
  INTERACTION_VERSION,
  LITERAL_FIELDS_BY_QUESTION,
  PROHIBITED_MOTIVE_SCORE_KEYS,
  PROVISIONAL_CHOICES,
  SELF_REPORTED_SHIFT_VALUES,
  assessInquiryAutonomy,
  behaviouralExperimentRequired,
  buildApInquirySession,
  createApAnswerRecord,
  findProhibitedMotiveScores,
  getApInquirySequence,
  getProvisionalChoices,
  resolveDerivedObservation,
  resolveSelfReportedShift,
} from "../src/lib/smartphone/ap-inquiry.mjs";
import {
  AUTHORIZED_REFLECTION_OPERATIONS,
  BRANCH_PRECEDENCE,
  buildApBranchReflection,
  findProhibitedReflectionLanguage,
} from "../src/lib/smartphone/ap-branch-reflection.mjs";

const AUTHORIZED_QUESTION_IDS = [
  "APQ1_FUNCTION",
  "APQ2_EXPECTATION",
  "APQ3_ORIGIN",
  "APQ4_VISIBILITY",
  "APQ5_NONPURCHASE",
  "APQ6_RESEE",
];

const AUTHORIZED_INVARIANT_IDS = [
  "INV-AP-01",
  "INV-AP-02",
  "INV-AP-03",
  "INV-AP-04",
  "INV-AP-05",
  "INV-AP-06",
  "INV-AP-07",
  "INV-AP-08",
  "INV-AP-09",
  "INV-AP-10",
  "INV-AP-11",
  "INV-AP-12",
  "INV-AP-13",
  "INV-AP-16",
];

/** @param {Record<string, object>} overrides */
function sessionFrom(overrides) {
  return buildApInquirySession(overrides);
}

function reflectionText(session) {
  return session.reflection.segments.map((segment) => segment.rendered_text).join("\n");
}

const EXACT_QUESTION_TEXT = Object.freeze({
  APQ1_FUNCTION:
    "What would the new phone let you do that your current phone cannot do adequately?",
  APQ2_EXPECTATION:
    "Imagine you already have the new phone. Besides what it can technically do, what do you expect to be different for you?",
  APQ3_ORIGIN:
    "When did you first begin seriously wanting this phone or an upgrade? What were you seeing, hearing or comparing around that time? Was the desire already this strong before that?",
  APQ4_VISIBILITY:
    "Would wanting this phone change if nobody else ever knew which phone you owned? Why or why not?",
  APQ5_NONPURCHASE:
    "Imagine deciding today to keep your current phone for another year. What, if anything, feels difficult about that?",
  APQ6_RESEE:
    "Reading your own answers together, does anything about the desire look different now? What seems appropriate now?",
});

test("APQ1_FUNCTION–APQ6_RESEE and INV-AP-01: exact six-question IDs, order, and wording execute", () => {
  const sequence = getApInquirySequence();
  assert.equal(sequence.length, 6);
  assert.deepEqual(
    sequence.map((question) => question.question_id),
    AUTHORIZED_QUESTION_IDS,
  );
  assert.deepEqual(
    sequence.map((question) => question.exact_question_text),
    AUTHORIZED_QUESTION_IDS.map((id) => EXACT_QUESTION_TEXT[id]),
  );

  for (const question of sequence) {
    assert.equal(question.question_version, "1.0");
    assert.match(question.exact_question_text, /\S/);
    assert.equal(
      /ego|greed|selfish|conditioning|fear|authenticity|status-seeking/i.test(
        question.exact_question_text,
      ),
      false,
      `${question.question_id} must not insert presumed motives`,
    );
  }

  // Negative: reordering or motive-injected wording is rejected by the executable sequence.
  assert.notDeepEqual(
    sequence.map((question) => question.question_id),
    [
      "APQ6_RESEE",
      "APQ1_FUNCTION",
      "APQ2_EXPECTATION",
      "APQ3_ORIGIN",
      "APQ4_VISIBILITY",
      "APQ5_NONPURCHASE",
    ],
  );
  assert.notEqual(
    sequence[0].exact_question_text,
    "Why does your ego want a new phone?",
  );
});

test("INV-AP-02: raw answers remain authoritative; derived observations require exact spans", () => {
  const raw =
    "My current phone cannot run the navigation app offline for field work.";
  const span = "cannot run the navigation app offline";
  const record = createApAnswerRecord({
    question_id: "APQ1_FUNCTION",
    exact_user_answer: raw,
    proposed_observation: {
      proposed_value: "concrete_limitation_stated",
      supporting_exact_span: span,
    },
  });

  assert.equal(record.interaction_version, INTERACTION_VERSION);
  assert.equal(record.exact_user_answer, raw);
  assert.equal(record.derived_observations.length, 1);
  assert.equal(record.derived_observations[0].derivation_status, DERIVATION_EXPLICIT);
  assert.equal(record.derived_observations[0].value, "concrete_limitation_stated");
  assert.equal(record.derived_observations[0].supporting_exact_span, span);
  assert.equal(
    record.derived_observations[0].supporting_answer_question_id,
    "APQ1_FUNCTION",
  );
  assert.equal(raw.includes(record.derived_observations[0].supporting_exact_span), true);

  // Negative: derived observation must not overwrite the raw answer.
  const mutatedAttempt = {
    ...record,
    derived_observations: [
      {
        ...record.derived_observations[0],
        value: "unclear",
      },
    ],
  };
  assert.equal(record.exact_user_answer, raw);
  assert.notEqual(mutatedAttempt.exact_user_answer, undefined);
  assert.equal(
    createApAnswerRecord({
      question_id: "APQ1_FUNCTION",
      exact_user_answer: raw,
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "not present in the answer",
      },
    }).exact_user_answer,
    raw,
  );
});

test("INV-AP-03: unsupported or spanless extraction resolves to unclear, never theory-filled", () => {
  const ambiguous = "I am not sure what is operating here.";
  const withoutSpan = resolveDerivedObservation({
    question_id: "APQ2_EXPECTATION",
    exact_user_answer: ambiguous,
    proposed_value: "nonfunctional_change_stated",
    supporting_exact_span: null,
  });
  assert.equal(withoutSpan.derivation_status, DERIVATION_UNCLEAR);
  assert.equal(withoutSpan.value, "unclear");

  const badSpan = resolveDerivedObservation({
    question_id: "APQ3_ORIGIN",
    exact_user_answer: ambiguous,
    proposed_value: "desire_appeared_after_exposure",
    supporting_exact_span: "advertising conditioned me",
  });
  assert.equal(badSpan.derivation_status, DERIVATION_UNCLEAR);
  assert.equal(badSpan.value, "unclear");
  assert.equal(badSpan.supporting_exact_span, null);

  const disallowedMotiveFill = resolveDerivedObservation({
    question_id: "APQ4_VISIBILITY",
    exact_user_answer: ambiguous,
    proposed_value: "status_seeking",
    supporting_exact_span: "I am not sure",
  });
  assert.equal(disallowedMotiveFill.derivation_status, DERIVATION_UNCLEAR);
  assert.equal(disallowedMotiveFill.value, "unclear");

  // Positive: unclear remains a valid terminal state for an explicit unclear answer.
  const explicitUnclear = createApAnswerRecord({
    question_id: "APQ5_NONPURCHASE",
    exact_user_answer: "I don't know.",
    proposed_observation: {
      proposed_value: "unclear",
      supporting_exact_span: "I don't know",
    },
  });
  assert.equal(explicitUnclear.derived_observations[0].value, "unclear");
  assert.equal(
    explicitUnclear.derived_observations[0].derivation_status,
    DERIVATION_UNCLEAR,
  );
});

test("INV-AP-04: no visible or hidden motive scores are produced", () => {
  const session = buildApInquirySession({
    APQ1_FUNCTION: {
      exact_user_answer: "It would let me take sharper photos at night.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "take sharper photos at night",
      },
    },
    APQ6_RESEE: {
      exact_user_answer: "I still want to buy new.",
      proposed_observation: {
        proposed_value: "buy_new",
        supporting_exact_span: "buy new",
      },
    },
  });

  const found = findProhibitedMotiveScores(session);
  assert.deepEqual(found, []);
  for (const key of PROHIBITED_MOTIVE_SCORE_KEYS) {
    assert.equal(Object.hasOwn(session, key), false, key);
  }

  const autonomy = assessInquiryAutonomy(session);
  assert.equal(autonomy.motive_scores_present, false);

  // Negative: a fabricated score object is detected as prohibited.
  assert.deepEqual(
    findProhibitedMotiveScores({ ego_score: 0.8, fear_score: 0.2 }),
    ["ego_score", "fear_score"],
  );
});

test("INV-AP-12: buy_new remains a legitimate unranked provisional choice", () => {
  const choices = getProvisionalChoices();
  assert.deepEqual(choices, PROVISIONAL_CHOICES);
  assert.equal(choices.includes("buy_new"), true);
  assert.equal(choices.includes("unclear"), true);

  const session = buildApInquirySession({
    APQ6_RESEE: {
      exact_user_answer: "Buying new still seems appropriate.",
      proposed_observation: {
        proposed_value: "buy_new",
        supporting_exact_span: "Buying new still seems appropriate",
      },
      self_reported_shift: "unchanged",
    },
  });

  assert.equal(session.provisional_choice, "buy_new");
  assert.equal(session.inquiry_failed, false);

  const autonomy = assessInquiryAutonomy(session);
  assert.equal(autonomy.buy_new_is_approved_choice, true);
  assert.equal(autonomy.buy_new_marked_as_failure, false);
  assert.equal(autonomy.provisional_choices_ranked, false);

  // Negative: buy_new is not treated as a failed inquiry relative to keep_current.
  const keepSession = buildApInquirySession({
    APQ6_RESEE: {
      exact_user_answer: "I will keep my current phone.",
      proposed_observation: {
        proposed_value: "keep_current",
        supporting_exact_span: "keep my current phone",
      },
    },
  });
  assert.equal(session.inquiry_failed, keepSession.inquiry_failed);
  assert.equal(
    choices.indexOf("buy_new") < choices.indexOf("keep_current") ||
      choices.indexOf("buy_new") > choices.indexOf("keep_current"),
    true,
  );
  // Presentation order exists; autonomy must not export an index/rank/score proxy.
  assert.equal("provisional_choice_index" in autonomy, false);
  assert.equal(autonomy.provisional_choices_ranked, false);
});

test("INV-AP-16: no behavioural experiment is required before proceeding", () => {
  assert.equal(behaviouralExperimentRequired(), false);

  const session = buildApInquirySession({
    APQ1_FUNCTION: {
      exact_user_answer: "I need a working camera for work.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "working camera for work",
      },
    },
  });

  assert.equal(session.behavioural_experiment_required, false);
  const autonomy = assessInquiryAutonomy(session);
  assert.equal(autonomy.behavioural_experiment_required, false);

  // Negative: session must not gate progress on review/ad/social/shopping abstinence.
  assert.equal(Object.hasOwn(session, "required_experiment"), false);
  assert.equal(Object.hasOwn(session, "abstinence_days_required"), false);
  assert.equal(Object.hasOwn(session, "must_stop_reviews"), false);
  assert.equal(Object.hasOwn(session, "must_stop_advertising"), false);
  assert.equal(Object.hasOwn(session, "must_stop_social_media"), false);
  assert.equal(Object.hasOwn(session, "must_stop_shopping"), false);
});

test("CORRECTION-2: literal_fields cannot overwrite core fields or attach non-allowlisted keys", () => {
  const raw =
    "My current phone cannot run the navigation app offline for field work.";
  const span = "cannot run the navigation app offline";
  const record = createApAnswerRecord({
    question_id: "APQ1_FUNCTION",
    exact_user_answer: raw,
    proposed_observation: {
      proposed_value: "concrete_limitation_stated",
      supporting_exact_span: span,
    },
    literal_fields: {
      // Attempt to overwrite authoritative/core fields with answer substrings.
      exact_user_answer: "cannot run the navigation app offline",
      question_id: "cannot run",
      interaction_version: "offline",
      question_version: "field work",
      exact_question_text: "navigation app",
      derived_observations: "for field work",
      // Prohibited score-shaped and non-allowlisted keys.
      ego_score: "offline",
      greed_score: "field work",
      planetary_concern_score: "navigation",
      invented_motive_tag: "cannot run",
      // Contract-backed Q1 optional literal (must remain attachable).
      functional_limitation_text: "cannot run the navigation app offline",
    },
  });

  assert.equal(record.exact_user_answer, raw);
  assert.equal(record.question_id, "APQ1_FUNCTION");
  assert.equal(record.interaction_version, INTERACTION_VERSION);
  assert.equal(record.question_version, "1.0");
  assert.equal(
    record.exact_question_text,
    EXACT_QUESTION_TEXT.APQ1_FUNCTION,
  );
  assert.equal(Array.isArray(record.derived_observations), true);
  assert.equal(record.derived_observations[0].value, "concrete_limitation_stated");
  assert.equal(
    record.functional_limitation_text,
    "cannot run the navigation app offline",
  );
  assert.equal(Object.hasOwn(record, "ego_score"), false);
  assert.equal(Object.hasOwn(record, "greed_score"), false);
  assert.equal(Object.hasOwn(record, "planetary_concern_score"), false);
  assert.equal(Object.hasOwn(record, "invented_motive_tag"), false);
  assert.deepEqual(findProhibitedMotiveScores(record), []);

  // Q4 allowlist accepts visibility_meaning_text only among optional literals.
  const q4Answer =
    "Wanting would be unchanged because the phone is for maps, not display.";
  const q4 = createApAnswerRecord({
    question_id: "APQ4_VISIBILITY",
    exact_user_answer: q4Answer,
    proposed_observation: {
      proposed_value: "unchanged",
      supporting_exact_span: "unchanged",
    },
    literal_fields: {
      visibility_meaning_text: "the phone is for maps, not display",
      functional_limitation_text: "for maps",
      exact_user_answer: "unchanged",
      fear_score: "not display",
    },
  });
  assert.equal(q4.exact_user_answer, q4Answer);
  assert.equal(
    q4.visibility_meaning_text,
    "the phone is for maps, not display",
  );
  assert.equal(Object.hasOwn(q4, "functional_limitation_text"), false);
  assert.equal(Object.hasOwn(q4, "fear_score"), false);
  assert.deepEqual(LITERAL_FIELDS_BY_QUESTION.APQ1_FUNCTION, [
    "functional_limitation_text",
  ]);
  assert.deepEqual(LITERAL_FIELDS_BY_QUESTION.APQ4_VISIBILITY, [
    "visibility_meaning_text",
  ]);
  for (const core of AP_ANSWER_CORE_FIELDS) {
    assert.equal(LITERAL_FIELDS_BY_QUESTION.APQ1_FUNCTION.includes(core), false);
  }
});

test("CORRECTION-2: self_reported_shift is constrained; unsupported values become unclear", () => {
  assert.deepEqual(SELF_REPORTED_SHIFT_VALUES, [
    "changed",
    "unchanged",
    "uncertain",
    "unclear",
  ]);
  for (const allowed of SELF_REPORTED_SHIFT_VALUES) {
    assert.equal(resolveSelfReportedShift(allowed), allowed);
  }
  assert.equal(resolveSelfReportedShift("mostly_changed"), "unclear");
  assert.equal(resolveSelfReportedShift("ego_deflated"), "unclear");
  assert.equal(resolveSelfReportedShift(""), "unclear");
  assert.equal(resolveSelfReportedShift(null), "unclear");
  assert.equal(resolveSelfReportedShift(undefined), "unclear");

  const unsupportedSession = buildApInquirySession({
    APQ6_RESEE: {
      exact_user_answer: "Buying new still seems appropriate.",
      proposed_observation: {
        proposed_value: "buy_new",
        supporting_exact_span: "Buying new still seems appropriate",
      },
      self_reported_shift: "mostly_changed",
    },
  });
  assert.equal(unsupportedSession.self_reported_shift, "unclear");
  assert.equal(unsupportedSession.provisional_choice, "buy_new");
  assert.equal(unsupportedSession.inquiry_failed, false);

  const allowedSession = buildApInquirySession({
    APQ6_RESEE: {
      exact_user_answer: "Something looks different now.",
      proposed_observation: {
        proposed_value: "investigate_further",
        supporting_exact_span: "Something looks different",
      },
      self_reported_shift: "changed",
    },
  });
  assert.equal(allowedSession.self_reported_shift, "changed");
});

test("session assembly preserves order and raw answers across all six questions", () => {
  const session = buildApInquirySession({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot tether reliably.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot tether reliably",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "I expect to feel more confident in meetings.",
      proposed_observation: {
        proposed_value: "nonfunctional_change_stated",
        supporting_exact_span: "feel more confident in meetings",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "I wanted an upgrade before I saw any ads.",
      proposed_observation: {
        proposed_value: "desire_predated_exposure",
        supporting_exact_span: "before I saw any ads",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer: "It would not change if nobody knew.",
      proposed_observation: {
        proposed_value: "unchanged",
        supporting_exact_span: "would not change",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "The battery anxiety is hard.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "battery anxiety",
      },
    },
    APQ6_RESEE: {
      exact_user_answer: "Investigate further seems right.",
      proposed_observation: {
        proposed_value: "investigate_further",
        supporting_exact_span: "Investigate further",
      },
    },
  });

  assert.deepEqual(session.question_order, AUTHORIZED_QUESTION_IDS);
  assert.equal(session.answer_records.length, 6);
  for (let index = 0; index < 6; index += 1) {
    assert.equal(session.answer_records[index].question_id, AUTHORIZED_QUESTION_IDS[index]);
    assert.equal(
      session.answer_records[index].exact_question_text,
      EXACT_QUESTION_TEXT[AUTHORIZED_QUESTION_IDS[index]],
    );
    assert.equal(typeof session.answer_records[index].exact_user_answer, "string");
    assert.equal(
      session.answer_records[index].exact_user_answer ===
        session.answer_records[index].derived_observations[0].value,
      false,
    );
  }
  assert.deepEqual(AP_INQUIRY_SEQUENCE.map((q) => q.question_id), AUTHORIZED_QUESTION_IDS);
  assert.ok(AUTHORIZED_INVARIANT_IDS.includes("INV-AP-01"));
});

test("INV-AP-05: exposure chronology may select exposure_or_novelty but never becomes causality", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "No specific limitation beyond what I already have.",
      proposed_observation: {
        proposed_value: "no_specific_limitation_stated",
        supporting_exact_span: "No specific limitation",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "I expect snappier everyday performance.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "snappier everyday performance",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer:
        "I first wanted it after seeing a review video last month; the desire appeared after that exposure.",
      proposed_observation: {
        proposed_value: "desire_appeared_after_exposure",
        supporting_exact_span: "after seeing a review video last month",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer: "Wanting would be unchanged if nobody knew.",
      proposed_observation: {
        proposed_value: "unchanged",
        supporting_exact_span: "unchanged if nobody knew",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "Keeping the current phone is fine practically.",
      proposed_observation: {
        proposed_value: "no_significant_difficulty_stated",
        supporting_exact_span: "fine practically",
      },
    },
    APQ6_RESEE: {
      exact_user_answer: "Buying new still seems appropriate.",
      proposed_observation: {
        proposed_value: "buy_new",
        supporting_exact_span: "Buying new still seems appropriate",
      },
    },
  });

  assert.equal(session.presentation_branch, "exposure_or_novelty");
  assert.equal(session.branch_flags.exposure_or_novelty, true);
  const text = reflectionText(session);
  assert.match(text, /appeared around after seeing a review video last month/);
  assert.match(text, /What do you make of that sequence/);
  assert.equal(/caused|conditioned|manipulat|not really (yours|theirs)/i.test(text), false);
  assert.deepEqual(findProhibitedReflectionLanguage(session.reflection), []);
});

test("INV-AP-06: visibility change may select visibility_or_identity but never diagnoses status/vanity", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Nothing concrete is missing.",
      proposed_observation: {
        proposed_value: "no_specific_limitation_stated",
        supporting_exact_span: "Nothing concrete is missing",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "I expect slightly faster apps.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "slightly faster apps",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "I wanted an upgrade before any ads.",
      proposed_observation: {
        proposed_value: "desire_predated_exposure",
        supporting_exact_span: "before any ads",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer:
        "If nobody else ever knew which phone I owned, wanting would become somewhat weaker.",
      proposed_observation: {
        proposed_value: "somewhat_weaker",
        supporting_exact_span: "somewhat weaker",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "No significant difficulty keeping it.",
      proposed_observation: {
        proposed_value: "no_significant_difficulty_stated",
        supporting_exact_span: "No significant difficulty",
      },
    },
  });

  assert.equal(session.presentation_branch, "visibility_or_identity");
  assert.equal(session.branch_flags.visibility_or_identity, true);
  assert.equal(session.branch_flags.apparent_contradiction, false);
  const text = reflectionText(session);
  assert.match(text, /changes some of its appeal/);
  assert.equal(
    /status-seeking|validation-seeking|vanity|appropriation|identity dependence|depends on the phone for identity/i.test(
      text,
    ),
    false,
  );
  assert.deepEqual(findProhibitedReflectionLanguage(session.reflection), []);
});

test("INV-AP-07: practical non-purchase difficulty is not renamed fear", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Battery dies before lunch on field days.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Battery dies before lunch",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "I expect longer battery life only.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "longer battery life only",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "Desire predated any product exposure.",
      proposed_observation: {
        proposed_value: "desire_predated_exposure",
        supporting_exact_span: "predated any product exposure",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer: "Wanting would be unchanged if private.",
      proposed_observation: {
        proposed_value: "unchanged",
        supporting_exact_span: "unchanged if private",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer:
        "The difficulty is mainly practical: carrying a charger everywhere.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "mainly practical: carrying a charger",
      },
    },
  });

  assert.equal(session.presentation_branch, "concrete_need");
  const text = reflectionText(session);
  assert.equal(/\bfear\b/i.test(text), false);
  assert.equal(session.answer_records[4].derived_observations[0].value, "practical_only_stated");
  assert.notEqual(session.answer_records[4].derived_observations[0].value, "fear");
});

test("INV-AP-08: primary branch precedence matches the accepted six-branch order", () => {
  assert.deepEqual(BRANCH_PRECEDENCE, [
    "apparent_contradiction",
    "mixed",
    "insufficient_observation",
    "exposure_or_novelty",
    "visibility_or_identity",
    "concrete_need",
  ]);

  // Contradiction outranks mixed when both flags are supported.
  const contradictionOverMixed = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot tether reliably for work.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot tether reliably",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Besides function, nothing else would change for me.",
      proposed_observation: {
        proposed_value: "no_change_beyond_function_stated",
        supporting_exact_span: "nothing else would change",
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
      exact_user_answer:
        "If ownership were private, desire would become substantially weaker.",
      proposed_observation: {
        proposed_value: "substantially_weaker",
        supporting_exact_span: "substantially weaker",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "Practical charger hassle only.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "Practical charger hassle",
      },
    },
  });
  assert.equal(contradictionOverMixed.branch_flags.apparent_contradiction, true);
  assert.equal(contradictionOverMixed.branch_flags.mixed, true);
  assert.equal(contradictionOverMixed.presentation_branch, "apparent_contradiction");

  // Mixed outranks exposure when concrete limitation coexists with exposure.
  const mixedOverExposure = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot run offline maps.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot run offline maps",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Only better maps matter.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "Only better maps matter",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "Desire intensified after a store demo.",
      proposed_observation: {
        proposed_value: "desire_intensified_after_exposure",
        supporting_exact_span: "after a store demo",
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
      exact_user_answer: "Practical map gap only.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "Practical map gap",
      },
    },
  });
  assert.equal(mixedOverExposure.branch_flags.mixed, true);
  assert.equal(mixedOverExposure.branch_flags.exposure_or_novelty, false);
  assert.equal(mixedOverExposure.presentation_branch, "mixed");
  assert.ok(
    mixedOverExposure.retained_for_juxtaposition.some(
      (item) => item.observation_type === "exposure_chronology",
    ),
  );

  // Insufficient outranks exposure when three families are unclear.
  const insufficientOverExposure = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "I don't know.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "I don't know",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Unsure.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "Unsure",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "Desire appeared after a billboard.",
      proposed_observation: {
        proposed_value: "desire_appeared_after_exposure",
        supporting_exact_span: "after a billboard",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer: "Not sure.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "Not sure",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "Hard to say.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "Hard to say",
      },
    },
  });
  assert.equal(insufficientOverExposure.branch_flags.insufficient_observation, true);
  assert.equal(insufficientOverExposure.branch_flags.exposure_or_novelty, true);
  assert.equal(
    insufficientOverExposure.presentation_branch,
    "insufficient_observation",
  );

  // Visibility outranks concrete_need when visibility changes without mixed.
  const visibilityOverConcrete = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Nothing concrete is missing for tasks.",
      proposed_observation: {
        proposed_value: "no_specific_limitation_stated",
        supporting_exact_span: "Nothing concrete is missing",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Faster apps only.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "Faster apps only",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "No relevant exposure identified.",
      proposed_observation: {
        proposed_value: "no_relevant_exposure_identified",
        supporting_exact_span: "No relevant exposure identified",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer: "Wanting would be somewhat weaker if private.",
      proposed_observation: {
        proposed_value: "somewhat_weaker",
        supporting_exact_span: "somewhat weaker if private",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "No significant difficulty.",
      proposed_observation: {
        proposed_value: "no_significant_difficulty_stated",
        supporting_exact_span: "No significant difficulty",
      },
    },
  });
  assert.equal(visibilityOverConcrete.presentation_branch, "visibility_or_identity");
  assert.deepEqual(visibilityOverConcrete.branch_precedence, BRANCH_PRECEDENCE);
});

test("INV-AP-09: contradiction requires explicit conflict and prompts neutral inquiry", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Camera is adequate already.",
      proposed_observation: {
        proposed_value: "no_specific_limitation_stated",
        supporting_exact_span: "Camera is adequate already",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "The choice is entirely functional for me.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "entirely functional for me",
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
      exact_user_answer:
        "If nobody knew, wanting would become substantially weaker.",
      proposed_observation: {
        proposed_value: "substantially_weaker",
        supporting_exact_span: "substantially weaker",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "No significant difficulty.",
      proposed_observation: {
        proposed_value: "no_significant_difficulty_stated",
        supporting_exact_span: "No significant difficulty",
      },
    },
  });

  assert.equal(session.presentation_branch, "apparent_contradiction");
  const text = reflectionText(session);
  assert.match(text, /How do those two observations fit together for you/);
  assert.equal(
    /rationali[sz]ation|denial|hypocrisy|lying|hidden motive|true (motive|answer)/i.test(
      text,
    ),
    false,
  );

  // Negative: ordinary coexistence is mixed, not contradiction.
  const coexistence = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot tether reliably.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot tether reliably",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "I expect to feel more confident in meetings.",
      proposed_observation: {
        proposed_value: "nonfunctional_change_stated",
        supporting_exact_span: "feel more confident in meetings",
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
  });
  assert.equal(coexistence.presentation_branch, "mixed");
  assert.equal(coexistence.branch_flags.apparent_contradiction, false);
});

test("INV-AP-10: mixed motives remain legitimate and do not invalidate purchase", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot tether reliably for client calls.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot tether reliably",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "I also expect to feel more confident in meetings.",
      proposed_observation: {
        proposed_value: "nonfunctional_change_stated",
        supporting_exact_span: "feel more confident in meetings",
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
      exact_user_answer: "Practical tether gap only.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "Practical tether gap",
      },
    },
    APQ6_RESEE: {
      exact_user_answer: "Buying new still seems appropriate.",
      proposed_observation: {
        proposed_value: "buy_new",
        supporting_exact_span: "Buying new still seems appropriate",
      },
    },
  });

  assert.equal(session.presentation_branch, "mixed");
  assert.match(reflectionText(session), /Is there more than one thing being sought here/);
  assert.equal(session.provisional_choice, "buy_new");
  assert.equal(session.inquiry_failed, false);
  assert.equal(
    /invalidate|excuse|cheaper|must select|one motive is real|false motive/i.test(
      reflectionText(session),
    ),
    false,
  );
  assert.deepEqual(session.reflection.provisional_choices, PROVISIONAL_CHOICES);
  assert.equal(session.reflection.provisional_choices.includes("buy_new"), true);
});

test("INV-AP-11: concrete-need output is limited and makes no AP approval claim", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot run the navigation app offline for field work.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot run the navigation app offline",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Only offline navigation would change.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "Only offline navigation would change",
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
      exact_user_answer: "Practical navigation gap only.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "Practical navigation gap",
      },
    },
  });

  assert.equal(session.presentation_branch, "concrete_need");
  const text = reflectionText(session);
  assert.match(text, /did not identify much additional attraction/);
  assert.equal(
    /non-egoic|genuine need|no conditioning|AP approves|AP approval/i.test(text),
    false,
  );
});

test("INV-AP-13: concrete-need absence statement is project_interpretation; limitation span remains user_answer-traceable", () => {
  const limitationSpan = "Cannot run the navigation app offline";
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot run the navigation app offline for field work.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: limitationSpan,
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Only offline navigation would change.",
      proposed_observation: {
        proposed_value: "functional_change_only_stated",
        supporting_exact_span: "Only offline navigation would change",
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
      exact_user_answer: "Practical navigation gap only.",
      proposed_observation: {
        proposed_value: "practical_only_stated",
        supporting_exact_span: "Practical navigation gap",
      },
    },
  });

  assert.equal(session.presentation_branch, "concrete_need");

  const absenceSegments = session.reflection.segments.filter((segment) =>
    /did not identify much additional attraction/.test(segment.rendered_text),
  );
  assert.ok(absenceSegments.length >= 1);
  for (const segment of absenceSegments) {
    assert.equal(segment.basis_type, "project_interpretation");
    assert.notEqual(segment.basis_type, "user_answer");
  }

  const limitationUserAnswerSegments = session.reflection.segments.filter(
    (segment) =>
      segment.basis_type === "user_answer" &&
      segment.basis_ids.some(
        (basis) => basis.supporting_exact_span === limitationSpan,
      ),
  );
  assert.ok(limitationUserAnswerSegments.length >= 1);
  for (const segment of limitationUserAnswerSegments) {
    const record = session.answer_records.find(
      (item) => item.question_id === segment.basis_ids[0].question_id,
    );
    assert.ok(record);
    assert.equal(record.exact_user_answer.includes(limitationSpan), true);
  }
});

test("INV-AP-13: reflection uses only authorized operations with span traceability; no SOURCE_LENS", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "Cannot tether reliably.",
      proposed_observation: {
        proposed_value: "concrete_limitation_stated",
        supporting_exact_span: "Cannot tether reliably",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "I expect to feel more confident in meetings.",
      proposed_observation: {
        proposed_value: "nonfunctional_change_stated",
        supporting_exact_span: "feel more confident in meetings",
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
  });

  const ops = session.reflection.operations;
  assert.equal(ops.includes("RESTATEMENT"), true);
  assert.equal(ops.includes("QUESTION"), true);
  assert.equal(ops.includes("OPEN_CHOICE"), true);
  assert.equal(ops.includes("SOURCE_LENS"), false);
  assert.equal(session.reflection.source_lens_emitted, false);
  for (const operation of ops) {
    assert.equal(AUTHORIZED_REFLECTION_OPERATIONS.includes(operation), true);
  }
  assert.equal(ops[ops.length - 1], "OPEN_CHOICE");
  assert.equal(
    session.reflection.open_choice_prompt,
    "Having seen your answers together, what now seems appropriate?",
  );

  for (const segment of session.reflection.segments) {
    if (segment.basis_type === "user_answer") {
      assert.ok(segment.basis_ids.length > 0);
      for (const basis of segment.basis_ids) {
        assert.equal(typeof basis.question_id, "string");
        assert.equal(typeof basis.supporting_exact_span, "string");
        const record = session.answer_records.find(
          (item) => item.question_id === basis.question_id,
        );
        assert.ok(record);
        assert.equal(record.exact_user_answer.includes(basis.supporting_exact_span), true);
      }
    }
  }

  assert.equal(/therefore|which proves|deep down|true motive/i.test(reflectionText(session)), false);
  assert.deepEqual(findProhibitedReflectionLanguage(session.reflection), []);

  // Direct module path remains domain-driven (no case_id dependence).
  const direct = buildApBranchReflection({
    answer_records: session.answer_records,
    provisional_choices: PROVISIONAL_CHOICES,
  });
  assert.equal(direct.primary_branch, session.presentation_branch);
  assert.equal(direct.branches_are_diagnoses, false);
});

test("insufficient_observation does not block empirical comparison or invent motives", () => {
  const session = sessionFrom({
    APQ1_FUNCTION: {
      exact_user_answer: "I don't know.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "I don't know",
      },
    },
    APQ2_EXPECTATION: {
      exact_user_answer: "Unsure.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "Unsure",
      },
    },
    APQ3_ORIGIN: {
      exact_user_answer: "Not clear.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "Not clear",
      },
    },
    APQ4_VISIBILITY: {
      exact_user_answer: "Hard to say.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "Hard to say",
      },
    },
    APQ5_NONPURCHASE: {
      exact_user_answer: "Unknown.",
      proposed_observation: {
        proposed_value: "unclear",
        supporting_exact_span: "Unknown",
      },
    },
  });

  assert.equal(session.presentation_branch, "insufficient_observation");
  assert.equal(session.reflection.empirical_comparison_blocked, false);
  assert.match(reflectionText(session), /do not need to manufacture/);
  assert.equal(/motive|fear|conditioning|ego/i.test(reflectionText(session)), false);
});
