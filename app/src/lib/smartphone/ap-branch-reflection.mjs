/**
 * Deterministic AP presentation-branch selection and constrained reflection.
 *
 * Authority: contracts/AP_INTERACTION_V0.md §§5–6,
 * tests/ap-integrity/AP_V0_INVARIANTS.md (INV-AP-05–11, INV-AP-13),
 * provenance/source-packages/AP-V0-INTERACTION-0.2.0.md.
 *
 * This slice does not implement SOURCE_LENS, otherness, or empirical comparison.
 * Branch names are presentation states, not diagnoses.
 */

/** Local mirrors of accepted derivation statuses; avoid circular import. */
const DERIVATION_EXPLICIT = "explicit";
const DERIVATION_UNCLEAR = "unclear";

/** Approved Q6 choices; presentation order only — not a ranking. */
const DEFAULT_PROVISIONAL_CHOICES = Object.freeze([
  "keep_current",
  "repair_current",
  "consider_used_or_refurbished",
  "buy_new",
  "investigate_further",
  "unclear",
]);

export const BRANCH_PRECEDENCE = Object.freeze([
  "apparent_contradiction",
  "mixed",
  "insufficient_observation",
  "exposure_or_novelty",
  "visibility_or_identity",
  "concrete_need",
]);

export const REFLECTION_OPERATIONS = Object.freeze([
  "RESTATEMENT",
  "JUXTAPOSITION",
  "QUESTION",
  "OPEN_CHOICE",
]);

/** Operations authorized in this slice; SOURCE_LENS remains excluded. */
export const AUTHORIZED_REFLECTION_OPERATIONS = REFLECTION_OPERATIONS;

export const OPEN_CHOICE_PROMPT =
  "Having seen your answers together, what now seems appropriate?";

const EXPOSURE_CHRONOLOGY_VALUES = Object.freeze([
  "desire_appeared_after_exposure",
  "desire_intensified_after_exposure",
]);

const VISIBILITY_CHANGED_VALUES = Object.freeze([
  "somewhat_weaker",
  "substantially_weaker",
  "stronger",
]);

const NONPURCHASE_MIXED_SIGNAL_VALUES = Object.freeze([
  "nonpractical_element_stated",
  "mixed_stated",
]);

const ENTIRELY_FUNCTIONAL_VALUES = Object.freeze([
  "functional_change_only_stated",
  "no_change_beyond_function_stated",
]);

const OBSERVATION_FAMILIES = Object.freeze([
  "functional_limitation",
  "anticipated_change",
  "exposure_chronology",
  "visibility_response",
  "nonpurchase_difficulty",
]);

/**
 * @typedef {{
 *   observation_id: string,
 *   observation_type: string,
 *   value: string,
 *   supporting_answer_question_id: string,
 *   supporting_exact_span: string | null,
 *   derivation_status: string,
 * }} DerivedObservation
 */

/**
 * @typedef {{
 *   question_id: string,
 *   exact_user_answer: string,
 *   derived_observations: readonly DerivedObservation[],
 *   [key: string]: unknown,
 * }} ApAnswerRecord
 */

/**
 * @param {readonly ApAnswerRecord[]} answerRecords
 * @param {string} observationType
 * @returns {{ record: ApAnswerRecord, observation: DerivedObservation } | null}
 */
export function findObservation(answerRecords, observationType) {
  for (const record of answerRecords) {
    for (const observation of record.derived_observations) {
      if (observation.observation_type === observationType) {
        return { record, observation };
      }
    }
  }
  return null;
}

/**
 * @typedef {{ record: ApAnswerRecord, observation: DerivedObservation }} FoundObservation
 */

/**
 * @param {FoundObservation | null} found
 * @returns {FoundObservation | null}
 */
function asExplicit(found) {
  if (found === null) {
    return null;
  }
  const span = found.observation.supporting_exact_span;
  if (
    found.observation.derivation_status === DERIVATION_EXPLICIT &&
    typeof found.observation.value === "string" &&
    found.observation.value !== "unclear" &&
    typeof span === "string" &&
    span.length > 0 &&
    found.record.exact_user_answer.includes(span)
  ) {
    return found;
  }
  return null;
}

/**
 * @param {FoundObservation | null} found
 * @returns {boolean}
 */
function isUnclearFamily(found) {
  if (found === null) {
    return true;
  }
  return (
    found.observation.derivation_status === DERIVATION_UNCLEAR ||
    found.observation.value === "unclear"
  );
}

/**
 * @param {string | null | undefined} span
 * @returns {string}
 */
function renderSpan(span) {
  return typeof span === "string" ? span.trim() : "";
}

/**
 * @param {FoundObservation | null} found
 * @param {string} value
 * @returns {boolean}
 */
function explicitValueIs(found, value) {
  const explicit = asExplicit(found);
  return explicit !== null && explicit.observation.value === value;
}

/**
 * @param {FoundObservation | null} found
 * @param {readonly string[]} values
 * @returns {boolean}
 */
function explicitValueIn(found, values) {
  const explicit = asExplicit(found);
  return explicit !== null && values.includes(explicit.observation.value);
}

/**
 * Compute all presentation-branch flags from accepted explicit observations
 * before selecting a primary branch.
 *
 * Exposure/novelty uses only accepted exposure_chronology enum values.
 * Free-text novelty inference is not performed in this slice.
 *
 * @param {{ answer_records: readonly ApAnswerRecord[] }} session
 */
export function computeBranchFlags(session) {
  const records = session.answer_records ?? [];
  const functional = findObservation(records, "functional_limitation");
  const anticipated = findObservation(records, "anticipated_change");
  const exposure = findObservation(records, "exposure_chronology");
  const visibility = findObservation(records, "visibility_response");
  const nonpurchase = findObservation(records, "nonpurchase_difficulty");

  const concreteLimitation = explicitValueIs(
    functional,
    "concrete_limitation_stated",
  );

  const nonfunctionalChange = explicitValueIs(
    anticipated,
    "nonfunctional_change_stated",
  );

  const exposureChronologySignal = explicitValueIn(
    exposure,
    EXPOSURE_CHRONOLOGY_VALUES,
  );

  const visibilityChangedSignal = explicitValueIn(
    visibility,
    VISIBILITY_CHANGED_VALUES,
  );

  const nonpurchaseMixedSignal = explicitValueIn(
    nonpurchase,
    NONPURCHASE_MIXED_SIGNAL_VALUES,
  );

  const entirelyFunctionalClaim = explicitValueIn(
    anticipated,
    ENTIRELY_FUNCTIONAL_VALUES,
  );

  const substantiallyWeakerVisibility = explicitValueIs(
    visibility,
    "substantially_weaker",
  );

  // Answer-level conflict (INV-AP-09), not ordinary coexistence (mixed).
  const apparentContradiction =
    entirelyFunctionalClaim && substantiallyWeakerVisibility;

  const mixedSignal =
    nonfunctionalChange ||
    exposureChronologySignal ||
    visibilityChangedSignal ||
    nonpurchaseMixedSignal;

  const mixed = concreteLimitation && mixedSignal;

  const unclearFamilyCount = [
    functional,
    anticipated,
    exposure,
    visibility,
    nonpurchase,
  ].filter((found) => isUnclearFamily(found)).length;

  const hasAnySubstantiveExplicit =
    concreteLimitation ||
    nonfunctionalChange ||
    exposureChronologySignal ||
    visibilityChangedSignal ||
    asExplicit(nonpurchase) !== null ||
    apparentContradiction;

  const insufficientObservation =
    unclearFamilyCount >= 3 || !hasAnySubstantiveExplicit;

  // Branch triggers for exposure/visibility require mixed = false.
  const exposureOrNovelty = exposureChronologySignal && !mixed;
  const visibilityOrIdentity = visibilityChangedSignal && !mixed;

  const concreteNeed =
    concreteLimitation &&
    !mixed &&
    !apparentContradiction &&
    !insufficientObservation &&
    !exposureChronologySignal &&
    !visibilityChangedSignal &&
    !nonfunctionalChange &&
    !nonpurchaseMixedSignal;

  /** @type {Record<string, boolean>} */
  const flags = Object.freeze({
    apparent_contradiction: apparentContradiction,
    mixed,
    insufficient_observation: insufficientObservation,
    exposure_or_novelty: exposureOrNovelty,
    visibility_or_identity: visibilityOrIdentity,
    concrete_need: concreteNeed,
  });

  const retainedForJuxtaposition = [];
  if (mixed) {
    if (exposureChronologySignal && exposure) {
      retainedForJuxtaposition.push({
        observation_type: "exposure_chronology",
        value: exposure.observation.value,
        supporting_exact_span: exposure.observation.supporting_exact_span,
        supporting_answer_question_id:
          exposure.observation.supporting_answer_question_id,
      });
    }
    if (visibilityChangedSignal && visibility) {
      retainedForJuxtaposition.push({
        observation_type: "visibility_response",
        value: visibility.observation.value,
        supporting_exact_span: visibility.observation.supporting_exact_span,
        supporting_answer_question_id:
          visibility.observation.supporting_answer_question_id,
      });
    }
    if (nonfunctionalChange && anticipated) {
      retainedForJuxtaposition.push({
        observation_type: "anticipated_change",
        value: anticipated.observation.value,
        supporting_exact_span: anticipated.observation.supporting_exact_span,
        supporting_answer_question_id:
          anticipated.observation.supporting_answer_question_id,
      });
    }
    if (nonpurchaseMixedSignal && nonpurchase) {
      retainedForJuxtaposition.push({
        observation_type: "nonpurchase_difficulty",
        value: nonpurchase.observation.value,
        supporting_exact_span: nonpurchase.observation.supporting_exact_span,
        supporting_answer_question_id:
          nonpurchase.observation.supporting_answer_question_id,
      });
    }
  }

  return Object.freeze({
    flags,
    observation_snapshot: Object.freeze({
      functional_limitation: functional?.observation.value ?? "unclear",
      anticipated_change: anticipated?.observation.value ?? "unclear",
      exposure_chronology: exposure?.observation.value ?? "unclear",
      visibility_response: visibility?.observation.value ?? "unclear",
      nonpurchase_difficulty: nonpurchase?.observation.value ?? "unclear",
      unclear_family_count: unclearFamilyCount,
    }),
    retained_for_juxtaposition: Object.freeze(retainedForJuxtaposition),
    observations: Object.freeze({
      functional,
      anticipated,
      exposure,
      visibility,
      nonpurchase,
    }),
  });
}

/**
 * Select the primary presentation branch by accepted precedence.
 * Lower-priority supported observations do not replace the primary branch.
 *
 * @param {ReturnType<typeof computeBranchFlags>} computed
 */
export function selectPrimaryBranch(computed) {
  for (const branch of BRANCH_PRECEDENCE) {
    if (computed.flags[branch]) {
      return branch;
    }
  }
  return "insufficient_observation";
}

/**
 * @param {string} operation
 * @param {string} renderedText
 * @param {"user_answer" | "project_interpretation"} basisType
 * @param {readonly { question_id: string, supporting_exact_span: string | null }[]} basisIds
 */
function segment(operation, renderedText, basisType, basisIds) {
  return Object.freeze({
    operation,
    rendered_text: renderedText,
    basis_type: basisType,
    basis_ids: Object.freeze(basisIds.map((id) => Object.freeze({ ...id }))),
  });
}

/**
 * @param {{ record: ApAnswerRecord, observation: DerivedObservation }} found
 */
function basisFrom(found) {
  return {
    question_id: found.observation.supporting_answer_question_id,
    supporting_exact_span: found.observation.supporting_exact_span,
  };
}

/**
 * Build constrained reflection for the selected primary branch.
 * Authorized operations: RESTATEMENT, optional JUXTAPOSITION, QUESTION,
 * final OPEN_CHOICE. SOURCE_LENS is not emitted in this slice.
 *
 * @param {{ answer_records: readonly ApAnswerRecord[], provisional_choices?: readonly string[] }} session
 * @param {ReturnType<typeof computeBranchFlags>} computed
 * @param {string} primaryBranch
 */
export function buildConstrainedReflection(session, computed, primaryBranch) {
  const { functional, anticipated, exposure, visibility, nonpurchase } =
    computed.observations;
  /** @type {ReturnType<typeof segment>[]} */
  const segments = [];

  const explicitFunctional = asExplicit(functional);
  const explicitAnticipated = asExplicit(anticipated);
  const explicitExposure = asExplicit(exposure);
  const explicitVisibility = asExplicit(visibility);
  const explicitNonpurchase = asExplicit(nonpurchase);

  if (
    primaryBranch === "apparent_contradiction" &&
    explicitAnticipated &&
    explicitVisibility
  ) {
    const x = renderSpan(explicitAnticipated.observation.supporting_exact_span);
    const y = renderSpan(explicitVisibility.observation.supporting_exact_span);
    segments.push(
      segment(
        "RESTATEMENT",
        `You said ${x}.`,
        "user_answer",
        [basisFrom(explicitAnticipated)],
      ),
    );
    segments.push(
      segment(
        "JUXTAPOSITION",
        `You described ${x}, and you also said ${y}.`,
        "user_answer",
        [basisFrom(explicitAnticipated), basisFrom(explicitVisibility)],
      ),
    );
    segments.push(
      segment(
        "QUESTION",
        "How do those two observations fit together for you?",
        "project_interpretation",
        [],
      ),
    );
  } else if (primaryBranch === "mixed" && explicitFunctional) {
    const practical = renderSpan(
      explicitFunctional.observation.supporting_exact_span,
    );
    const secondary =
      computed.retained_for_juxtaposition[0] ??
      nonfunctionalChangePick(
        explicitAnticipated,
        explicitExposure,
        explicitVisibility,
        explicitNonpurchase,
      );
    const secondarySpan =
      secondary && typeof secondary.supporting_exact_span === "string"
        ? renderSpan(secondary.supporting_exact_span)
        : null;
    segments.push(
      segment(
        "RESTATEMENT",
        `You said ${practical}.`,
        "user_answer",
        [basisFrom(explicitFunctional)],
      ),
    );
    if (secondary && secondarySpan) {
      segments.push(
        segment(
          "JUXTAPOSITION",
          `You described ${practical}. You also described ${secondarySpan}.`,
          "user_answer",
          [
            basisFrom(explicitFunctional),
            {
              question_id: secondary.supporting_answer_question_id,
              supporting_exact_span: secondary.supporting_exact_span,
            },
          ],
        ),
      );
    }
    segments.push(
      segment(
        "QUESTION",
        "Is there more than one thing being sought here?",
        "project_interpretation",
        [],
      ),
    );
  } else if (primaryBranch === "insufficient_observation") {
    segments.push(
      segment(
        "RESTATEMENT",
        "You weren’t sure what is operating here. That can remain unclear.",
        "project_interpretation",
        [],
      ),
    );
    segments.push(
      segment(
        "QUESTION",
        "Some of these questions do not yet have clear answers for you. You do not need to manufacture them. Reading what you do know, is there anything you want to look at again before deciding?",
        "project_interpretation",
        [],
      ),
    );
  } else if (primaryBranch === "exposure_or_novelty" && explicitExposure) {
    const chronologyVerb =
      explicitExposure.observation.value === "desire_intensified_after_exposure"
        ? "intensified"
        : "appeared";
    const exposureSpan = renderSpan(
      explicitExposure.observation.supporting_exact_span,
    );
    segments.push(
      segment(
        "RESTATEMENT",
        `You said the desire ${chronologyVerb} around ${exposureSpan}.`,
        "user_answer",
        [basisFrom(explicitExposure)],
      ),
    );
    if (explicitAnticipated) {
      const attraction = renderSpan(
        explicitAnticipated.observation.supporting_exact_span,
      );
      segments.push(
        segment(
          "JUXTAPOSITION",
          `You also described ${attraction}.`,
          "user_answer",
          [basisFrom(explicitAnticipated)],
        ),
      );
    }
    segments.push(
      segment(
        "QUESTION",
        "What do you make of that sequence?",
        "project_interpretation",
        [],
      ),
    );
  } else if (primaryBranch === "visibility_or_identity" && explicitVisibility) {
    const visibilitySpan = renderSpan(
      explicitVisibility.observation.supporting_exact_span,
    );
    segments.push(
      segment(
        "RESTATEMENT",
        `You said ${visibilitySpan}.`,
        "user_answer",
        [basisFrom(explicitVisibility)],
      ),
    );
    segments.push(
      segment(
        "QUESTION",
        "You noticed that whether other people know which phone you own changes some of its appeal. What does the phone represent to you beyond its functions?",
        "project_interpretation",
        [],
      ),
    );
  } else if (primaryBranch === "concrete_need" && explicitFunctional) {
    const limitation = renderSpan(
      explicitFunctional.observation.supporting_exact_span,
    );
    segments.push(
      segment(
        "RESTATEMENT",
        `You said ${limitation}.`,
        "user_answer",
        [basisFrom(explicitFunctional)],
      ),
    );
    segments.push(
      segment(
        "QUESTION",
        `You identified ${limitation} as something your current phone does not do adequately. In your other answers you did not identify much additional attraction around visibility, outside exposure, or non-functional change. Does replacing the device still seem appropriate for the limitation you described?`,
        "user_answer",
        [basisFrom(explicitFunctional)],
      ),
    );
  } else {
    // Safety: never invent motives when templates cannot be span-backed.
    segments.push(
      segment(
        "RESTATEMENT",
        "You weren’t sure what is operating here. That can remain unclear.",
        "project_interpretation",
        [],
      ),
    );
    segments.push(
      segment(
        "QUESTION",
        "Reading what you do know, is there anything you want to look at again before deciding?",
        "project_interpretation",
        [],
      ),
    );
  }

  const choices = session.provisional_choices ?? DEFAULT_PROVISIONAL_CHOICES;
  segments.push(
    segment(
      "OPEN_CHOICE",
      OPEN_CHOICE_PROMPT,
      "project_interpretation",
      [],
    ),
  );

  const operations = Object.freeze(segments.map((item) => item.operation));
  return Object.freeze({
    primary_branch: primaryBranch,
    operations,
    segments: Object.freeze(segments),
    open_choice_prompt: OPEN_CHOICE_PROMPT,
    provisional_choices: Object.freeze([...choices]),
    source_lens_emitted: false,
    empirical_comparison_blocked: false,
  });
}

/**
 * @param {FoundObservation | null} anticipated
 * @param {FoundObservation | null} exposure
 * @param {FoundObservation | null} visibility
 * @param {FoundObservation | null} nonpurchase
 * @returns {{ supporting_exact_span: string, supporting_answer_question_id: string } | null}
 */
function nonfunctionalChangePick(anticipated, exposure, visibility, nonpurchase) {
  if (
    anticipated &&
    anticipated.observation.value === "nonfunctional_change_stated" &&
    typeof anticipated.observation.supporting_exact_span === "string"
  ) {
    return {
      supporting_exact_span: anticipated.observation.supporting_exact_span,
      supporting_answer_question_id:
        anticipated.observation.supporting_answer_question_id,
    };
  }
  if (
    exposure &&
    EXPOSURE_CHRONOLOGY_VALUES.includes(exposure.observation.value) &&
    typeof exposure.observation.supporting_exact_span === "string"
  ) {
    return {
      supporting_exact_span: exposure.observation.supporting_exact_span,
      supporting_answer_question_id:
        exposure.observation.supporting_answer_question_id,
    };
  }
  if (
    visibility &&
    VISIBILITY_CHANGED_VALUES.includes(visibility.observation.value) &&
    typeof visibility.observation.supporting_exact_span === "string"
  ) {
    return {
      supporting_exact_span: visibility.observation.supporting_exact_span,
      supporting_answer_question_id:
        visibility.observation.supporting_answer_question_id,
    };
  }
  if (
    nonpurchase &&
    NONPURCHASE_MIXED_SIGNAL_VALUES.includes(nonpurchase.observation.value) &&
    typeof nonpurchase.observation.supporting_exact_span === "string"
  ) {
    return {
      supporting_exact_span: nonpurchase.observation.supporting_exact_span,
      supporting_answer_question_id:
        nonpurchase.observation.supporting_answer_question_id,
    };
  }
  return null;
}

/**
 * Full branch-selection + constrained-reflection result for a session.
 *
 * @param {{ answer_records: readonly ApAnswerRecord[], provisional_choices?: readonly string[] }} session
 */
export function buildApBranchReflection(session) {
  const computed = computeBranchFlags(session);
  const primaryBranch = selectPrimaryBranch(computed);
  const reflection = buildConstrainedReflection(
    session,
    computed,
    primaryBranch,
  );

  return Object.freeze({
    branch_precedence: BRANCH_PRECEDENCE,
    flags: computed.flags,
    primary_branch: primaryBranch,
    observation_snapshot: computed.observation_snapshot,
    retained_for_juxtaposition: computed.retained_for_juxtaposition,
    reflection,
    // Presentation states are not diagnoses or motive scores.
    branches_are_diagnoses: false,
    observation_families: OBSERVATION_FAMILIES,
  });
}

/**
 * Surface prohibited diagnostic/causal language if present in reflection text.
 * Used by autonomy checks and negative tests; does not alter generation.
 *
 * @param {ReturnType<typeof buildConstrainedReflection> | { segments?: readonly { rendered_text: string }[] }} reflection
 * @returns {string[]}
 */
export function findProhibitedReflectionLanguage(reflection) {
  const prohibited = [
    /\btherefore\b/i,
    /\bwhich proves\b/i,
    /\bdeep down\b/i,
    /\btrue motive\b/i,
    /\brationali[sz]ation\b/i,
    /\bdenial\b/i,
    /\bhypocrisy\b/i,
    /\blying\b/i,
    /\bstatus-seeking\b/i,
    /\bvalidation-seeking\b/i,
    /\bvanity\b/i,
    /\bconditioning\b/i,
    /\begoic\b/i,
    /\bnon-egoic\b/i,
    /\bgenuine need\b/i,
    /\bAP approves\b/i,
    /\bnot really (yours|theirs)\b/i,
    /\bmanipulat(?:ed|ion)\b/i,
    /\bcaused the desire\b/i,
    /\bhidden motive\b/i,
    /\bfear\b/i,
  ];
  const found = [];
  const texts = (reflection.segments ?? []).map((segment) => segment.rendered_text);
  for (const text of texts) {
    for (const pattern of prohibited) {
      if (pattern.test(text)) {
        found.push(pattern.source);
      }
    }
  }
  return found;
}
