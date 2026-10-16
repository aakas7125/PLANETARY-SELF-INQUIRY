import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createOthernessState,
  othernessStateAfterComparisonAction,
  reduceOtherness,
} from "../src/lib/smartphone/ap-otherness-ux.mjs";
import {
  ANTICIPATED_OLD_PHONE_FATES,
  OLD_PHONE_FATE_ANSWERED,
  OLD_PHONE_FATE_EXPLICIT_UNKNOWN,
  OLD_PHONE_FATE_HELPER,
  OLD_PHONE_FATE_LIMIT,
  OLD_PHONE_FATE_QUESTION,
  OLD_PHONE_FATE_UNANSWERED,
  buildPathwayEvaluatorInput,
  comparisonStateAfterInquiryAction,
  comparisonStateAfterSituationAction,
  createComparisonState,
  describeComparison,
  isAnticipatedOldPhoneFate,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import {
  consequenceBindingKey,
  projectGenericNewClimateConsequence,
} from "../src/lib/smartphone/empirical-consequence.mjs";
import {
  createFinalChoiceState,
  finalChoiceStateAfterComparisonAction,
  reduceFinalChoice,
} from "../src/lib/smartphone/final-choice-ux.mjs";
import {
  describeImpact,
  impactContextFromComparison,
  reduceImpact,
  createImpactState,
} from "../src/lib/smartphone/impact-pathways-ux.mjs";
import {
  createSystemParticipationState,
  describeSystemParticipation,
  participationStateAfterComparisonAction,
  reduceSystemParticipation,
} from "../src/lib/smartphone/system-participation-ux.mjs";

const ADEQUATE = {
  safe_to_use: true,
  required_functions_met: true,
  security_support: true,
};

const CANONICAL = ANTICIPATED_OLD_PHONE_FATES.map((fate) => fate.id);
const LEGACY = ["reuse_by_other", "stored", "trade_in_unknown"];
const FAIRPHONE = "MS-CLIMATE-FAIRPHONE5-S2-V0";
const GALAXY = "MS-CLIMATE-GALAXY-S25-EUR-S3-V0";

function present(state) {
  return describeComparison(state, {
    inquiryReviewComplete: true,
    situationAnswers: ADEQUATE,
  });
}

function select(pathwayIds, horizon = null) {
  let state = createComparisonState();
  for (const pathwayId of pathwayIds) {
    state = reduceComparison(state, { type: "toggle", pathwayId });
  }
  if (horizon != null) {
    state = reduceComparison(state, { type: "set_horizon", text: horizon });
  }
  return state;
}

function answer(state, fate) {
  return reduceComparison(state, { type: "set_anticipated_old_phone_fate", fate });
}

function impactFor(view) {
  return describeImpact(
    reduceImpact(createImpactState(), { type: "open" }),
    impactContextFromComparison(view, { comparisonEntered: true }),
  );
}

function cardSurface(view) {
  return view.cards.map((card) => ({
    id: card.id,
    label: card.label,
    publicLines: card.publicLines,
    values: card.values,
    capability: card.capability,
    missingFields: card.missingFields,
    rankingPermitted: card.rankingPermitted,
  }));
}

describe("anticipated old-phone fate", () => {
  it("uses the adopted question, helper, statuses, limit, and seven labels", () => {
    assert.equal(
      OLD_PHONE_FATE_QUESTION,
      "If you ended up getting another phone, what do you think would happen to your current phone next?",
    );
    assert.equal(
      OLD_PHONE_FATE_HELPER,
      "Optional and hypothetical. This does not mean you have decided to replace your phone. Choose what you currently expect. If it would depend on the option or you do not know, choose “I’m not sure.”",
    );
    assert.equal(OLD_PHONE_FATE_UNANSWERED, "No old-phone fate has been supplied. No route is assumed.");
    assert.equal(
      OLD_PHONE_FATE_ANSWERED,
      "This is what you currently expect in a hypothetical replacement scenario. It is not a verified event or downstream route.",
    );
    assert.equal(OLD_PHONE_FATE_EXPLICIT_UNKNOWN, "You’re not sure what would happen. No route is assumed.");
    assert.equal(
      OLD_PHONE_FATE_LIMIT,
      "This answer does not establish unsafe handling, a disposal site, a recycling probability, avoided production, or harm to a particular person or ecosystem.",
    );
    assert.deepEqual(CANONICAL, [
      "continue_use",
      "sell_or_gift_for_reuse",
      "trade_in_unknown_next_use",
      "store_in_drawer",
      "formal_recycling",
      "discard_general_waste",
      "unknown",
    ]);
    assert.deepEqual(
      ANTICIPATED_OLD_PHONE_FATES.map((fate) => fate.label),
      [
        "Keep it in active use (for example, as a backup)",
        "Sell it or give it to someone else to use",
        "Trade it in; I don’t know what happens after that",
        "Keep it stored or in a drawer",
        "Send it for formal e-waste recycling",
        "Throw it away with general household waste",
        "I’m not sure",
      ],
    );
  });

  it("starts unanswered, rejects invalid and legacy values, and keeps explicit unknown distinct", () => {
    const fresh = present(select(["new"]));
    assert.equal(fresh.oldPhoneFate.visible, true);
    assert.equal(fresh.oldPhoneFate.annotation.answer_status, "unanswered");
    assert.equal(fresh.oldPhoneFate.annotation.anticipated_fate, null);
    assert.equal(fresh.oldPhoneFate.annotation.evidence_class, null);
    assert.equal(fresh.oldPhoneFate.choices.every((choice) => choice.selected === false), true);
    assert.equal(fresh.oldPhoneFate.status.text, OLD_PHONE_FATE_UNANSWERED);
    assert.equal(fresh.oldPhoneFate.limit, null);
    assert.equal(createComparisonState().anticipatedOldPhoneFate, null);

    let state = select(["new"]);
    for (const fate of [...LEGACY, "", "formal", "discard", null, 0, false]) {
      const rejected = answer(state, fate);
      assert.equal(rejected, state, String(fate));
      assert.equal(isAnticipatedOldPhoneFate(fate), false);
    }

    for (const fate of CANONICAL) {
      const answered = answer(state, fate);
      const view = present(answered);
      assert.equal(answered.anticipatedOldPhoneFate, fate);
      assert.equal(view.oldPhoneFate.annotation.answer_status, "answered");
      assert.equal(view.oldPhoneFate.annotation.anticipated_fate, fate);
      assert.equal(view.oldPhoneFate.annotation.evidence_class, "user_anticipated_hypothetical");
      assert.equal(view.oldPhoneFate.annotation.applies_to, "replacement_scenario_set");
      assert.equal(view.oldPhoneFate.annotation.actual_event_established, false);
      assert.equal(view.oldPhoneFate.annotation.actual_route_established, false);
      assert.equal(view.oldPhoneFate.annotation.actual_event_status, "unknown");
      assert.equal(view.oldPhoneFate.annotation.actual_route_status, "unknown");
      assert.equal(view.oldPhoneFate.annotation.actual_event_time, null);
      assert.equal(Object.hasOwn(view.oldPhoneFate.annotation, "actual_event_occurred"), false);
      assert.equal(view.oldPhoneFate.choices.filter((choice) => choice.selected).length, 1);
      assert.equal(view.oldPhoneFate.choices.find((choice) => choice.selected).id, fate);
      assert.equal(
        view.oldPhoneFate.status.text,
        fate === "unknown" ? OLD_PHONE_FATE_EXPLICIT_UNKNOWN : OLD_PHONE_FATE_ANSWERED,
      );
      assert.equal(view.oldPhoneFate.limit.text, OLD_PHONE_FATE_LIMIT);
      assert.notEqual(view.oldPhoneFate.annotation.anticipated_fate, null);
    }

    const cleared = reduceComparison(answer(state, "unknown"), {
      type: "clear_anticipated_old_phone_fate",
    });
    assert.equal(cleared.anticipatedOldPhoneFate, null);
    assert.equal(present(cleared).oldPhoneFate.annotation.answer_status, "unanswered");
    assert.notEqual(present(answer(state, "unknown")).oldPhoneFate.status.text, OLD_PHONE_FATE_UNANSWERED);
  });

  it("shows one shared answer for replacement alternatives and hides it for keep or repair only", () => {
    const incomplete = present(select(["used_secondhand"], ""));
    assert.equal(incomplete.evaluated, false);
    assert.equal(incomplete.oldPhoneFate.visible, true);
    assert.equal(incomplete.cards.length, 0);

    const keepRepair = present(select(["keep", "repair"], "4"));
    assert.equal(keepRepair.oldPhoneFate.visible, false);
    assert.equal(keepRepair.oldPhoneFate.annotation, null);
    assert.equal(answer(select(["keep", "repair"], "4"), "store_in_drawer").anticipatedOldPhoneFate, null);

    let shared = answer(select(["used_secondhand", "refurbished", "new", "keep"], "4"), "sell_or_gift_for_reuse");
    const view = present(shared);
    assert.deepEqual(view.oldPhoneFate.replacementPathwayIds, ["used_secondhand", "refurbished", "new"]);
    assert.equal(view.oldPhoneFate.annotation.anticipated_fate, "sell_or_gift_for_reuse");
    assert.equal(Array.isArray(view.oldPhoneFate.annotation), false);
    const label = view.oldPhoneFate.annotation.public_label;
    for (const card of view.cards) {
      assert.equal(card.publicLines.includes(label), false, card.id);
      assert.equal(JSON.stringify(card.publicLines).includes("sell_or_gift_for_reuse"), false);
    }
    assert.equal(view.cards.find((card) => card.id === "keep").publicLines.includes(label), false);

    shared = reduceComparison(shared, { type: "toggle", pathwayId: "used_secondhand" });
    shared = reduceComparison(shared, { type: "toggle", pathwayId: "refurbished" });
    shared = reduceComparison(shared, { type: "toggle", pathwayId: "new" });
    const hidden = present(shared);
    assert.equal(shared.anticipatedOldPhoneFate, "sell_or_gift_for_reuse");
    assert.equal(hidden.oldPhoneFate.visible, false);
    assert.equal(hidden.oldPhoneFate.annotation, null);
    assert.equal(hidden.cards.some((card) => card.publicLines.includes(label)), false);

    const restored = present(reduceComparison(shared, { type: "toggle", pathwayId: "refurbished" }));
    assert.equal(restored.oldPhoneFate.visible, true);
    assert.equal(restored.oldPhoneFate.annotation.anticipated_fate, "sell_or_gift_for_reuse");
    assert.equal(restored.oldPhoneFate.choices.find((choice) => choice.selected).label, label);

    const edited = answer(select(["new"], "4"), "continue_use");
    const replaced = answer(edited, "formal_recycling");
    assert.equal(replaced.anticipatedOldPhoneFate, "formal_recycling");
    assert.notEqual(present(replaced).oldPhoneFate.status.text, present(edited).oldPhoneFate.annotation.public_label);
  });

  it("clears the answer on comparison reset and on upstream actions that already reset comparison", () => {
    const answered = answer(select(["new", "keep"], "4"), "discard_general_waste");
    assert.deepEqual(reduceComparison(answered, { type: "reset" }), createComparisonState());
    assert.deepEqual(comparisonStateAfterSituationAction("edit", answered), createComparisonState());
    assert.deepEqual(comparisonStateAfterSituationAction("reset", answered), createComparisonState());
    assert.deepEqual(comparisonStateAfterInquiryAction("back", answered), createComparisonState());
    assert.equal(comparisonStateAfterInquiryAction("continue", answered), answered);
    assert.equal(comparisonStateAfterSituationAction("submit", answered), answered);
  });

  it("retains the anticipated answer across model changes and leaves evaluator results unchanged", () => {
    let state = select(["new", "keep", "repair"], "4");
    state = reduceComparison(state, { type: "set_current_owned_model", modelId: FAIRPHONE });
    state = reduceComparison(state, { type: "set_candidate_new_model", modelId: GALAXY });
    state = reduceComparison(state, { type: "set_remaining_service", text: "2.50" });
    const before = present(state);
    assert.equal(before.evaluated, true);
    assert.notEqual(before.cards.find((card) => card.id === "new").capability, "insufficient_information");

    for (const fate of CANONICAL) {
      const answered = answer(state, fate);
      assert.equal(answered.anticipatedOldPhoneFate, fate);
      assert.equal(answered.currentOwnedModelId, FAIRPHONE);
      assert.equal(answered.candidateNewModelId, GALAXY);
      const after = present(answered);
      assert.deepEqual(after.evaluatorInputs, before.evaluatorInputs);
      assert.deepEqual(cardSurface(after), cardSurface(before));
      assert.equal(after.rankingPermitted, before.rankingPermitted);
      assert.equal(after.horizonYears, 4);
      for (const input of after.evaluatorInputs) {
        assert.equal(Object.hasOwn(input, "old_device_fate"), false);
        assert.equal(JSON.stringify(input).includes("discarded_mass"), false);
        if (fate !== "unknown") assert.equal(JSON.stringify(input).includes(fate), false);
      }
      const impact = impactFor(after);
      assert.deepEqual(
        impact.domains.map((domain) => ({ id: domain.id, emitted: domain.emitted, lines: domain.lines })),
        impactFor(before).domains.map((domain) => ({ id: domain.id, emitted: domain.emitted, lines: domain.lines })),
      );
      assert.equal(impact.manufacturingBasis, null);
      assert.equal(projectGenericNewClimateConsequence(impact), null);
      assert.equal(after.oldPhoneFate.annotation.actual_event_established, false);
      assert.equal(after.oldPhoneFate.annotation.actual_route_established, false);
    }

    const generic = select(["new"], "4");
    const genericBefore = present(generic);
    const genericAnswered = present(answer(generic, "formal_recycling"));
    assert.deepEqual(genericAnswered.evaluatorInputs, genericBefore.evaluatorInputs);
    assert.deepEqual(cardSurface(genericAnswered), cardSurface(genericBefore));
    assert.equal(genericAnswered.cards[0].capability, "insufficient_information");
    const genericImpact = impactFor(genericAnswered);
    assert.deepEqual(genericImpact.manufacturingBasis.valueRange, [25, 70]);
    assert.equal(projectGenericNewClimateConsequence(genericImpact).condition.basis_kind, "accepted_generic_new_manufacturing_fallback");
    assert.equal(
      consequenceBindingKey(projectGenericNewClimateConsequence(genericImpact)),
      consequenceBindingKey(projectGenericNewClimateConsequence(impactFor(genericBefore))),
    );
    for (const id of ["ewaste-people", "ewaste-eco"]) {
      assert.equal(genericImpact.domains.find((domain) => domain.id === id).emitted, false);
    }

    const direct = buildPathwayEvaluatorInput("new", ADEQUATE, 4, {
      currentOwnedModelId: FAIRPHONE,
      candidateNewModelId: GALAXY,
      remainingService: 2.5,
    });
    assert.equal(Object.hasOwn(direct, "old_device_fate"), false);
    assert.equal(direct["current_device.model_record_id"], FAIRPHONE);
  });

  it("preserves raw QSP, otherness, and final choice for fate-only edits and still clears them for material edits", () => {
    const { record } = (() => {
      const view = present(select(["new"], "4"));
      return { record: projectGenericNewClimateConsequence(impactFor(view)) };
    })();
    const key = consequenceBindingKey(record);
    let participation = reduceSystemParticipation(createSystemParticipationState(), {
      type: "open",
      bindingKey: key,
      refs: [record.consequence_ref_id],
    });
    participation = reduceSystemParticipation(participation, { type: "set_qsp1", text: "  raw QSP stays  " });
    participation = reduceSystemParticipation(participation, { type: "set_qsp2", text: "second literal" });
    participation = reduceSystemParticipation(participation, { type: "set_qsp3", text: "third literal" });
    assert.equal(participationStateAfterComparisonAction("set_anticipated_old_phone_fate", participation), participation);
    assert.equal(participationStateAfterComparisonAction("clear_anticipated_old_phone_fate", participation), participation);
    const described = describeSystemParticipation(participation, { record });
    assert.equal(described.qsp1_raw, "  raw QSP stays  ");
    assert.equal(described.qsp2_raw, "second literal");
    assert.equal(described.qsp3_raw, "third literal");
    assert.equal(described.binding_key, key);
    assert.equal(described.stale, false);
    const clearedParticipation = participationStateAfterComparisonAction("set_horizon", participation);
    assert.equal(clearedParticipation.qsp1_raw, "");
    assert.equal(clearedParticipation.binding_key, null);

    let otherness = reduceOtherness(createOthernessState(), { type: "open" });
    otherness = reduceOtherness(otherness, { type: "set_response", text: "otherness raw stays" });
    otherness = reduceOtherness(otherness, { type: "set_follow_up", text: "follow up raw" });
    assert.equal(othernessStateAfterComparisonAction("set_anticipated_old_phone_fate", otherness), otherness);
    assert.equal(othernessStateAfterComparisonAction("set_current_owned_model", otherness).response, "");

    let choice = reduceFinalChoice(createFinalChoiceState(), { type: "open" });
    choice = reduceFinalChoice(choice, { type: "set_choice", value: "new" });
    assert.equal(finalChoiceStateAfterComparisonAction("set_anticipated_old_phone_fate", choice).selection, "new");
    assert.equal(finalChoiceStateAfterComparisonAction("clear_anticipated_old_phone_fate", choice).selection, "new");
    assert.equal(finalChoiceStateAfterComparisonAction("set_candidate_new_model", choice).selection, null);
    assert.equal(choice.selection, "new");
  });
});
