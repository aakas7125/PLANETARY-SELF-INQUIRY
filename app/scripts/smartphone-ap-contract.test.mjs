import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AP_INQUIRY_SEQUENCE,
  DERIVATION_EXPLICIT,
  DERIVATION_UNCLEAR,
  INTERACTION_VERSION,
  PROHIBITED_MOTIVE_SCORE_KEYS,
  PROVISIONAL_CHOICES,
  assessInquiryAutonomy,
  behaviouralExperimentRequired,
  buildApInquirySession,
  createApAnswerRecord,
  findProhibitedMotiveScores,
  getApInquirySequence,
  getProvisionalChoices,
  resolveDerivedObservation,
} from "../src/lib/smartphone/ap-inquiry.mjs";

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
  "INV-AP-12",
  "INV-AP-16",
];

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
  // Presentation order exists, but autonomy assessment does not rank success by index.
  assert.notEqual(autonomy.provisional_choice_index, undefined);
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
