import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createOthernessState,
  describeOtherness,
  reduceOtherness,
} from "../src/lib/smartphone/ap-otherness-ux.mjs";
import {
  OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT,
  OTHERNESS_QUESTION_TEXT,
} from "../src/lib/smartphone/ap-otherness.mjs";
import {
  createComparisonState,
  describeComparison,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import {
  GENERIC_NEW_CLIMATE_ATTRIBUTION_LIMITS,
  GENERIC_NEW_CLIMATE_CONSEQUENCE_REF_ID,
  GENERIC_NEW_CLIMATE_SOURCE_IDS,
  consequenceBindingKey,
  isCompleteEmpiricalConsequenceRecord,
  projectGenericNewClimateConsequence,
} from "../src/lib/smartphone/empirical-consequence.mjs";
import {
  createFinalChoiceState,
  describeFinalChoice,
  finalChoiceStateAfterParticipationAction,
  reduceFinalChoice,
} from "../src/lib/smartphone/final-choice-ux.mjs";
import {
  createImpactState,
  describeImpact,
  impactContextFromComparison,
  reduceImpact,
} from "../src/lib/smartphone/impact-pathways-ux.mjs";
import {
  SYSTEM_PARTICIPATION_ANCHOR,
  SYSTEM_PARTICIPATION_CHROME,
  SYSTEM_PARTICIPATION_CLASSIFICATION,
  SYSTEM_PARTICIPATION_GUIDANCE,
  SYSTEM_PARTICIPATION_OPENING,
  SYSTEM_PARTICIPATION_QSP1,
  SYSTEM_PARTICIPATION_QSP2,
  SYSTEM_PARTICIPATION_QSP3,
  createSystemParticipationState,
  describeSystemParticipation,
  participationStateAfterComparisonAction,
  participationStateAfterInquiryAction,
  participationStateAfterSituationAction,
  reduceSystemParticipation,
} from "../src/lib/smartphone/system-participation-ux.mjs";

const ADEQUATE = {
  safe_to_use: true,
  required_functions_met: true,
  security_support: true,
};

const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

function comparisonWith(pathwayIds, horizonRaw, extras = (current) => current) {
  let state = createComparisonState();
  for (const pathwayId of pathwayIds) {
    state = reduceComparison(state, { type: "toggle", pathwayId });
  }
  if (horizonRaw != null) state = reduceComparison(state, { type: "set_horizon", text: horizonRaw });
  state = extras(state);
  return {
    state,
    view: describeComparison(state, {
      inquiryReviewComplete: true,
      situationAnswers: ADEQUATE,
    }),
  };
}

function impactFor(comparisonView) {
  return describeImpact(
    reduceImpact(createImpactState(), { type: "open" }),
    impactContextFromComparison(comparisonView, { comparisonEntered: true }),
  );
}

function projectFrom(pathwayIds, horizonRaw, extras) {
  const { view } = comparisonWith(pathwayIds, horizonRaw, extras);
  return { comparison: view, impact: impactFor(view), record: projectGenericNewClimateConsequence(impactFor(view)) };
}

describe("generic new climate consequence and system participation", () => {
  it("projects the full research record from displayed generic new climate evidence", () => {
    const { comparison, impact, record } = projectFrom(["new"], "4");
    assert.equal(comparison.rankingPermitted, false);
    assert.equal(comparison.cards[0].rankingPermitted, false);
    assert.equal(isCompleteEmpiricalConsequenceRecord(record), true);
    assert.equal(record.consequence_ref_id, GENERIC_NEW_CLIMATE_CONSEQUENCE_REF_ID);
    assert.equal(record.claim_id, "SP-PATH-CLIMATE-001");
    assert.equal(record.scenario_status, "modelled_alternative");
    assert.equal(record.actual_purchase_established, false);
    assert.equal(record.actual_harm_event_established, false);
    assert.equal(record.case_specificity, "condition_established_for_modelled_alternative");
    assert.equal(record.condition.key, "scenario_produces_ghg_emissions");
    assert.equal(record.condition.basis_kind, "accepted_generic_new_manufacturing_fallback");
    assert.equal(record.displayed, true);
    assert.equal(record.independently_supported, true);
    assert.equal(record.support_status, "supported");
    assert.equal(record.extent, "beyond_immediate_circle");
    assert.equal(record.extent_semantics, "conditional_global_pathway_scope");
    assert.equal(record.gate_eligible, true);
    assert.deepEqual([...record.source_ids], [...GENERIC_NEW_CLIMATE_SOURCE_IDS]);
    assert.deepEqual([...record.attribution_limits], [...GENERIC_NEW_CLIMATE_ATTRIBUTION_LIMITS]);
    assert.deepEqual([...record.manufacturingBasis.valueRange], [25, 70]);
    assert.equal(record.manufacturingBasis.provenanceScope, "generic_fallback");
    assert.equal(impact.manufacturingBasis.claimVersion, record.claim_version);
    const water = impact.domains.find((domain) => domain.id === "water");
    assert.equal(water.emitted, true);
    assert.equal(Object.hasOwn(water, "gate_eligible"), false);
    for (const id of ["mining-eco", "mining-people", "ewaste-people", "ewaste-eco"]) {
      assert.equal(impact.domains.find((domain) => domain.id === id).emitted, false);
    }
  });

  it("keeps the projection when service facts are incomplete and does not rank", () => {
    const { comparison, record } = projectFrom(["new"], "4");
    assert.equal(comparison.evaluated, true);
    assert.equal(comparison.cards[0].capability, "insufficient_information");
    assert.equal(record.gate_eligible, true);
    assert.equal(comparison.rankingPermitted, false);
  });

  it("fails closed for labels, bare numbers, synthetic markers, and incomplete authority", () => {
    const labelOnly = projectFrom(["keep"], "4");
    assert.equal(labelOnly.record, null);
    assert.equal(
      projectGenericNewClimateConsequence({
        available: true,
        manufacturingBasis: { valueRange: [25, 70] },
        domains: [{ id: "climate", emitted: true, lines: ["Manufacturing"] }],
      }),
      null,
    );
    const qualifying = projectFrom(["new"], "4").record;
    const synthetic = {
      ...qualifying,
      manufacturingBasis: {
        ...qualifying.manufacturingBasis,
        acceptedFallbackStatus: "approved_registry_match",
      },
    };
    assert.equal(isCompleteEmpiricalConsequenceRecord(synthetic), false);
    for (const [field, value] of [
      ["gate_eligible", false],
      ["gate_eligible", undefined],
      ["extent_semantics", "realized_harm"],
      ["extent", "immediate_circle_only"],
      ["independently_supported", false],
      ["support_status", "unknown"],
      ["displayed", false],
      ["actual_purchase_established", true],
      ["actual_harm_event_established", true],
      ["claim_version", "other"],
      ["source_ids", ["S1"]],
      ["attribution_limits", ["pressure_to_outcome_only"]],
    ]) {
      const tampered = { ...qualifying, [field]: value };
      assert.equal(isCompleteEmpiricalConsequenceRecord(tampered), false, field);
      const otherness = describeOtherness(reduceOtherness(createOthernessState(), { type: "open" }), {
        impactAvailable: true,
        displayedRecords: [tampered],
        requireFullResearchRecord: true,
        empiricalAnchor: SYSTEM_PARTICIPATION_ANCHOR,
      });
      assert.equal(otherness.activated, false, field);
      assert.equal(otherness.question, null, field);
    }
  });

  it("does not project distribution, repair, historical ownership, exact models, or water alone", () => {
    assert.equal(projectFrom(["repair"], "4", (state) =>
      reduceComparison(state, { type: "set_repair_category", categoryId: "battery" }),
    ).record, null);
    const historical = projectFrom(["keep"], "4", (state) =>
      reduceComparison(state, { type: "set_current_owned_model", modelId: "MS-CLIMATE-FAIRPHONE5-S2-V0" }),
    );
    assert.equal(historical.record, null);
    assert.equal(historical.comparison.currentOwnedHistory.lines.some((line) => line.includes("32.70")), true);
    const exact = projectFrom(["new"], "4", (state) =>
      reduceComparison(state, { type: "set_candidate_new_model", modelId: "MS-CLIMATE-GALAXY-S25-EUR-S3-V0" }),
    );
    assert.equal(exact.record, null);
    assert.equal(exact.impact.manufacturingBasis, null);
    const production = exact.comparison.cards[0].values.find((value) => value.name === "Production");
    assert.notEqual(production.scope, "generic_fallback");
    assert.equal(projectFrom(["used_secondhand"], "4").record, null);
    assert.equal(projectGenericNewClimateConsequence({ available: false, manufacturingBasis: null, domains: [] }), null);
  });

  it("removes the projection when the new alternative or horizon is no longer current", () => {
    let { state, view } = comparisonWith(["new"], "4");
    assert.notEqual(projectGenericNewClimateConsequence(impactFor(view)), null);
    state = reduceComparison(state, { type: "toggle", pathwayId: "new" });
    view = describeComparison(state, { inquiryReviewComplete: true, situationAnswers: ADEQUATE });
    assert.equal(projectGenericNewClimateConsequence(impactFor(view)), null);
    state = reduceComparison(state, { type: "toggle", pathwayId: "new" });
    state = reduceComparison(state, { type: "set_horizon", text: "" });
    view = describeComparison(state, { inquiryReviewComplete: true, situationAnswers: ADEQUATE });
    assert.equal(view.evaluated, false);
    assert.equal(impactFor(view).available, false);
    assert.equal(projectGenericNewClimateConsequence(impactFor(view)), null);
  });

  it("offers the optional reflection and the unchanged otherness gate only for the full record", () => {
    const record = projectFrom(["new"], "4").record;
    const opened = reduceSystemParticipation(createSystemParticipationState(), {
      type: "open",
      bindingKey: consequenceBindingKey(record),
      refs: [record.consequence_ref_id],
    });
    const reflection = describeSystemParticipation(opened, { record });
    assert.equal(reflection.available, true);
    assert.equal(reflection.opening, SYSTEM_PARTICIPATION_OPENING);
    assert.equal(reflection.anchor, SYSTEM_PARTICIPATION_ANCHOR);
    assert.deepEqual(
      reflection.questions.map((question) => question.prompt),
      [SYSTEM_PARTICIPATION_QSP1, SYSTEM_PARTICIPATION_QSP2, SYSTEM_PARTICIPATION_QSP3],
    );
    assert.equal(reflection.guidance, SYSTEM_PARTICIPATION_GUIDANCE);
    assert.equal(reflection.classification, SYSTEM_PARTICIPATION_CLASSIFICATION);
    assert.equal(reflection.disclosure.body, SYSTEM_PARTICIPATION_CHROME.disclosure);
    assert.equal(reflection.skipped, false);
    const minimal = {
      consequence_ref_id: record.consequence_ref_id,
      displayed: true,
      independently_supported: true,
      support_status: "supported",
      extent: "beyond_immediate_circle",
    };
    const blocked = describeOtherness(reduceOtherness(createOthernessState(), { type: "open" }), {
      impactAvailable: true,
      displayedRecords: [minimal],
      requireFullResearchRecord: true,
      empiricalAnchor: SYSTEM_PARTICIPATION_ANCHOR,
    });
    assert.equal(blocked.activated, false);
    const otherness = describeOtherness(reduceOtherness(createOthernessState(), { type: "open" }), {
      impactAvailable: true,
      displayedRecords: [record],
      requireFullResearchRecord: true,
      empiricalAnchor: SYSTEM_PARTICIPATION_ANCHOR,
    });
    assert.equal(otherness.activated, true);
    assert.equal(otherness.question, OTHERNESS_QUESTION_TEXT);
    assert.equal(otherness.followUpPrompt, OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT);
    assert.equal(otherness.empiricalAnchor, SYSTEM_PARTICIPATION_ANCHOR);
    assert.equal(otherness.empiricalConsequenceRecords[0], record);
    assert.equal(otherness.empiricalConsequenceRecords[0].gate_eligible, true);
    assert.equal(otherness.empiricalConsequenceRecords[0].extent_semantics, "conditional_global_pathway_scope");
    const choice = describeFinalChoice(createFinalChoiceState(), {
      othernessEntered: true,
      othernessActivated: true,
    });
    assert.equal(choice.selection, null);
    assert.equal(choice.options.every((option) => option.selected === false), true);
  });

  it("preserves literal answers, skip, and back without interpreting them or selecting a phone", () => {
    const record = projectFrom(["new"], "4").record;
    const bindingKey = consequenceBindingKey(record);
    let state = reduceSystemParticipation(createSystemParticipationState(), {
      type: "open",
      bindingKey,
      refs: [record.consequence_ref_id],
    });
    const raw = "  I do not see a relationship.\nI cannot do anything meaningful.  ";
    state = reduceSystemParticipation(state, { type: "set_qsp1", text: raw });
    state = reduceSystemParticipation(state, { type: "set_qsp2", text: "No." });
    state = reduceSystemParticipation(state, { type: "set_qsp3", text: "" });
    const partial = describeSystemParticipation(state, { record });
    assert.equal(partial.qsp1_raw, raw);
    assert.equal(partial.qsp2_raw, "No.");
    assert.equal(partial.qsp3_raw, "");
    assert.equal(JSON.stringify(partial).includes("selfish"), false);
    const skipped = reduceSystemParticipation(state, { type: "skip", bindingKey, refs: [record.consequence_ref_id] });
    const skipView = describeSystemParticipation(skipped, { record });
    assert.equal(skipView.skipped, true);
    assert.equal(skipView.qsp1_raw, raw);
    const afterSkip = projectFrom(["new"], "4").record;
    assert.equal(afterSkip.consequence_ref_id, record.consequence_ref_id);
    assert.equal(afterSkip.gate_eligible, true);
    const choice = describeFinalChoice(
      finalChoiceStateAfterParticipationAction("skip", reduceFinalChoice(createFinalChoiceState(), { type: "open" })),
      { othernessEntered: true, othernessActivated: true },
    );
    assert.equal(choice.selection, null);
    const returned = describeSystemParticipation(state, { record });
    assert.equal(returned.qsp1_raw, raw);
    assert.equal(returned.anchor.includes("specific harm already happened"), true);
    assert.equal(returned.anchor.includes("harm occurred"), false);
  });

  it("clears current answers on upstream change and does not restore them for the same reference", () => {
    const first = projectFrom(["new"], "4").record;
    const key = consequenceBindingKey(first);
    let state = reduceSystemParticipation(createSystemParticipationState(), {
      type: "open",
      bindingKey: key,
      refs: [first.consequence_ref_id],
    });
    state = reduceSystemParticipation(state, { type: "set_qsp1", text: "kept only while this evidence is current" });
    assert.deepEqual(participationStateAfterComparisonAction("set_horizon", state), createSystemParticipationState());
    assert.deepEqual(
      participationStateAfterComparisonAction("set_candidate_new_model", state),
      createSystemParticipationState(),
    );
    assert.deepEqual(participationStateAfterSituationAction("edit", state), createSystemParticipationState());
    assert.deepEqual(participationStateAfterSituationAction("reset", state), createSystemParticipationState());
    assert.deepEqual(participationStateAfterInquiryAction("back", state), createSystemParticipationState());
    const exact = projectFrom(["new"], "4", (current) =>
      reduceComparison(current, { type: "set_candidate_new_model", modelId: "MS-CLIMATE-GALAXY-S25-EUR-S3-V0" }),
    );
    assert.equal(exact.record, null);
    const hidden = describeSystemParticipation(state, { record: exact.record });
    assert.equal(hidden.available, false);
    assert.equal(hidden.qsp1_raw, "");
    const again = projectFrom(["new"], "4").record;
    assert.equal(again.consequence_ref_id, first.consequence_ref_id);
    const rebound = describeSystemParticipation(state, { record: again });
    assert.equal(rebound.stale, false);
    assert.equal(rebound.qsp1_raw, state.qsp1_raw);
    const cleared = participationStateAfterComparisonAction("set_candidate_new_model", state);
    const restored = describeSystemParticipation(cleared, { record: again });
    assert.equal(restored.qsp1_raw, "");
    assert.equal(restored.trigger_consequence_refs.length, 0);
    const shifted = {
      ...first,
      manufacturingBasis: { ...first.manufacturingBasis, unit: "t CO2e" },
    };
    assert.equal(shifted.consequence_ref_id, first.consequence_ref_id);
    assert.equal(isCompleteEmpiricalConsequenceRecord(shifted), false);
    assert.equal(consequenceBindingKey(shifted), null);
    const mismatched = describeSystemParticipation(state, { record: shifted });
    assert.equal(mismatched.qsp1_raw, "");
    assert.equal(mismatched.stale, true);
  });

  it("keeps public reflection copy free of internal tokens and direct attribution", () => {
    const record = projectFrom(["new"], "4").record;
    const view = describeSystemParticipation(
      reduceSystemParticipation(createSystemParticipationState(), {
        type: "open",
        bindingKey: consequenceBindingKey(record),
        refs: [record.consequence_ref_id],
      }),
      { record },
    );
    const publicText = [
      view.opening,
      view.anchor,
      view.classification,
      view.guidance,
      view.disclosure.summary,
      view.disclosure.body,
      ...view.questions.map((question) => question.prompt),
      ...view.stages.flatMap((stage) => [stage.label, stage.note]),
      SYSTEM_PARTICIPATION_CHROME.reflect,
      SYSTEM_PARTICIPATION_CHROME.skip,
      SYSTEM_PARTICIPATION_CHROME.continue,
      SYSTEM_PARTICIPATION_CHROME.back,
    ].join("\n");
    assert.equal(SNAKE_CASE_TOKEN.test(publicText), false);
    assert.equal(publicText.includes("Acharya Prashant says"), false);
    assert.equal(publicText.includes(SYSTEM_PARTICIPATION_QSP1), true);
    assert.equal(publicText.includes("harm you caused"), false);
  });
});
