import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  createOthernessState,
  describeOtherness,
  reduceOtherness,
} from "../src/lib/smartphone/ap-otherness-ux.mjs";
import {
  buildPathwayEvaluatorInput,
  comparisonStateAfterInquiryAction,
  comparisonStateAfterSituationAction,
  createComparisonState,
  describeComparison,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import {
  CLIMATE_CLAIM_ID,
  CLIMATE_CLAIM_PACKAGE_COMMIT,
  resolveClimatePathwayBoundary,
} from "../src/lib/smartphone/empirical-climate-boundary.mjs";
import { evaluateAdequacyAndUnknownState } from "../src/lib/smartphone/input-decision.mjs";
import {
  GENERIC_NEW_MANUFACTURING_NOTE,
  IMPACT_LIMIT_LINE,
  createImpactState,
  describeImpact,
  impactContextFromComparison,
  impactStateAfterComparisonAction,
  impactStateAfterInquiryAction,
  impactStateAfterSituationAction,
  reduceImpact,
} from "../src/lib/smartphone/impact-pathways-ux.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const situationComponent = readFileSync(
  join(appRoot, "src/components/smartphone-situation.tsx"),
  "utf8",
);

const ADEQUATE = {
  safe_to_use: true,
  required_functions_met: true,
  security_support: true,
};

function comparisonWith(pathwayIds, horizonRaw, answers = ADEQUATE, extras = (current) => current) {
  let state = createComparisonState();
  for (const pathwayId of pathwayIds) {
    state = reduceComparison(state, { type: "toggle", pathwayId });
  }
  state = reduceComparison(state, { type: "set_horizon", text: horizonRaw });
  state = extras(state);
  return {
    state,
    view: describeComparison(state, {
      inquiryReviewComplete: true,
      situationAnswers: answers,
    }),
  };
}

function openedImpact(comparisonView, comparisonEntered = true) {
  const impact = reduceImpact(createImpactState(), { type: "open" });
  return describeImpact(
    impact,
    impactContextFromComparison(comparisonView, { comparisonEntered }),
  );
}

function domain(view, id) {
  return view.domains.find((entry) => entry.id === id);
}

describe("generic new production carried into climate impact", () => {
  it("uses the production comparison context and does not inject a resolver flag from the page", () => {
    assert.match(situationComponent, /impactContextFromComparison\(comparisonView/);
    assert.equal(situationComponent.includes("scenario_produces_ghg_emissions"), false);
    assert.equal(situationComponent.includes("resolverOverrides"), false);
  });

  it("emits climate from the current evaluated generic new-production record", () => {
    const { view: comparison } = comparisonWith(["new"], "4");
    const production = comparison.cards[0].values.find((value) => value.name === "Production");
    assert.deepEqual(production.exactValue, [25, 70]);
    assert.equal(production.scope, "generic_fallback");
    assert.equal(comparison.cards[0].capability, "insufficient_information");
    assert.equal(comparison.cards[0].rankingPermitted, false);
    assert.equal(comparison.rankingPermitted, false);

    const impact = openedImpact(comparison);
    const climate = domain(impact, "climate");
    const resolved = resolveClimatePathwayBoundary({
      claim_id: CLIMATE_CLAIM_ID,
      claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
      scenario_produces_ghg_emissions: true,
    });

    assert.equal(impact.manufacturingBasis.pathwayId, "new");
    assert.equal(impact.manufacturingBasis.scenarioRef, "replacement.new");
    assert.equal(impact.manufacturingBasis.field, "production_CO2e_kg");
    assert.deepEqual([...impact.manufacturingBasis.valueRange], [25, 70]);
    assert.equal(impact.manufacturingBasis.provenanceScope, "generic_fallback");
    assert.equal(impact.manufacturingBasis.acceptedFallbackStatus, "APPROVED_V0_FALLBACK");
    assert.equal(impact.manufacturingBasis.contractRef, "EMPIRICAL_SMARTPHONE_V0");
    assert.equal(impact.manufacturingBasis.claimId, CLIMATE_CLAIM_ID);
    assert.equal(impact.manufacturingBasis.claimVersion, CLIMATE_CLAIM_PACKAGE_COMMIT);
    assert.equal(impact.manufacturingBasis.prospective, true);
    assert.equal(climate.emitted, true);
    assert.equal(climate.claimId, CLIMATE_CLAIM_ID);
    assert.equal(climate.claimVersion, CLIMATE_CLAIM_PACKAGE_COMMIT);
    assert.equal(climate.lines[0], resolved.pathway.statement);
    assert.equal(climate.lines.includes(IMPACT_LIMIT_LINE), true);
    assert.equal(climate.lines.includes(GENERIC_NEW_MANUFACTURING_NOTE), true);
    assert.equal(climate.disclosure.lines.includes(GENERIC_NEW_MANUFACTURING_NOTE), true);
    assert.deepEqual([...climate.attributionLimits], [...resolved.pathway.attribution_limits]);
    assert.equal(climate.manufacturingBasis, impact.manufacturingBasis);
    assert.equal(climate.attributedToSelection, false);
    const climateText = climate.lines.join("\n");
    assert.equal(climateText.includes("25"), false);
    assert.equal(climateText.includes("70"), false);
    assert.doesNotMatch(climateText, /recommend|what to buy|you should|purchase this/i);
    assert.match(impact.boundary, /what to buy/);
    assert.equal(Object.hasOwn(climate, "independently_supported"), false);
    assert.equal(Object.hasOwn(climate, "support_status"), false);
    assert.equal(Object.hasOwn(climate, "extent"), false);
  });

  it("keeps generic production qualified when service facts leave comparison incomplete", () => {
    const { view } = comparisonWith(["new"], "4", ADEQUATE, (state) =>
      reduceComparison(state, { type: "mark_remaining_not_sure" }),
    );
    assert.equal(view.evaluated, true);
    assert.equal(view.cards[0].rankingPermitted, false);
    assert.equal(view.remainingServiceField.notSure, true);
    assert.equal(view.remainingServiceField.parsedYears, "unknown");
    assert.notEqual(view.remainingServiceField.parsedYears, 0);
    const impact = openedImpact(view);
    assert.equal(domain(impact, "climate").emitted, true);
    assert.equal(impact.manufacturingBasis.field, "production_CO2e_kg");
    assert.equal(view.cards[0].capability, "insufficient_information");
  });

  it("does not manufacture climate from a label, a number, or a caller boolean", () => {
    const labelled = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
      comparisonAvailable: true,
      comparisonEntered: true,
      comparisonEvaluated: true,
      inspectedPathways: [{ label: "Buy a new phone" }],
      scenario_produces_ghg_emissions: true,
    });
    assert.equal(domain(labelled, "climate").emitted, false);
    assert.equal(domain(labelled, "climate").reasonCode, "condition_not_satisfied");
    assert.equal(labelled.manufacturingBasis, null);

    const numberOnly = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
      comparisonAvailable: true,
      comparisonEntered: true,
      comparisonEvaluated: true,
      comparisonCards: [
        {
          id: "new",
          label: "Buy a new phone",
          values: [
            {
              name: "Production",
              exactValue: [25, 70],
              unit: "kg CO2e",
              scope: "generic_fallback",
            },
          ],
        },
      ],
    });
    assert.equal(domain(numberOnly, "climate").emitted, false);
    assert.equal(numberOnly.manufacturingBasis, null);

    const unevaluated = describeImpact(createImpactState(), impactContextFromComparison(
      comparisonWith(["new"], "4").view,
      { comparisonEntered: false },
    ));
    assert.equal(unevaluated.available, false);
    assert.equal(unevaluated.manufacturingBasis, null);
    assert.equal(unevaluated.domains.length, 0);
  });

  it("rejects absent, unknown, malformed, distribution-only, and synthetic production", () => {
    const { view } = comparisonWith(["new"], "4");
    const real = view.cards[0];

    function rejected(card) {
      const impact = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
        comparisonAvailable: true,
        comparisonEntered: true,
        comparisonEvaluated: true,
        comparisonCards: [card],
      });
      assert.equal(domain(impact, "climate").emitted, false);
      assert.equal(domain(impact, "climate").reasonCode, "condition_not_satisfied");
      assert.equal(impact.manufacturingBasis, null);
      assert.equal(domain(impact, "climate").lines.join("\n").includes("0"), false);
    }

    const absent = structuredClone(real);
    delete absent.decision.replacement.new.production_CO2e_kg;
    absent.values = absent.values.filter((value) => value.name !== "Production");
    rejected(absent);

    const unknown = structuredClone(real);
    unknown.decision.replacement.new.production_CO2e_kg = "unknown";
    unknown.values = unknown.values.map((value) =>
      value.name === "Production" ? { ...value, exactValue: "unknown" } : value,
    );
    rejected(unknown);

    const malformed = structuredClone(real);
    malformed.decision.replacement.new.production_CO2e_kg = [0, 70];
    malformed.values = malformed.values.map((value) =>
      value.name === "Production" ? { ...value, exactValue: [0, 70] } : value,
    );
    rejected(malformed);

    const distributionOnly = structuredClone(real);
    delete distributionOnly.decision.replacement.new.production_CO2e_kg;
    distributionOnly.values = distributionOnly.values.filter((value) => value.name === "Distribution");
    rejected(distributionOnly);

    const input = buildPathwayEvaluatorInput("new", ADEQUATE, 4, null);
    input["replacement.new.model"] = "approved_registry_match";
    const syntheticDecision = evaluateAdequacyAndUnknownState(input);
    rejected({
      ...real,
      decision: syntheticDecision,
      values: [
        {
          name: "Production",
          exactValue: [25, 70],
          unit: "kg CO2e",
          scope: "generic_fallback",
        },
      ],
    });
    assert.equal(syntheticDecision.replacement.new.primary_climate_source, "model_specific");
    assert.equal(Object.hasOwn(syntheticDecision.replacement.new, "production_CO2e_kg"), false);
  });

  it("does not treat repair, historic ownership, or a deselected new alternative as production", () => {
    const repair = comparisonWith(["repair"], "4", ADEQUATE, (state) => {
      let next = reduceComparison(state, { type: "set_repair_category", categoryId: "battery" });
      next = reduceComparison(next, { type: "set_post_repair_service", text: "4" });
      return next;
    }).view;
    assert.equal(repair.cards[0].values.some((value) => value.name === "Repair"), true);
    const repairImpact = openedImpact(repair);
    assert.equal(domain(repairImpact, "climate").emitted, false);
    assert.equal(repairImpact.manufacturingBasis, null);

    const keep = comparisonWith(["keep"], "4").view;
    assert.match(keep.cards[0].publicLines.join("\n"), /Earlier manufacture/);
    const keepImpact = openedImpact(keep);
    assert.equal(domain(keepImpact, "climate").emitted, false);
    assert.equal(keepImpact.manufacturingBasis, null);
    assert.notEqual(keep.cards[0].avoidedManufactureCredit, 0);

    let selected = comparisonWith(["new"], "4");
    assert.equal(openedImpact(selected.view).manufacturingBasis.field, "production_CO2e_kg");
    const alongside = comparisonWith(["keep", "new"], "4");
    const withNew = openedImpact(alongside.view);
    assert.equal(domain(withNew, "climate").emitted, true);
    const withoutNewState = reduceComparison(alongside.state, { type: "toggle", pathwayId: "new" });
    const withoutNewView = describeComparison(withoutNewState, {
      inquiryReviewComplete: true,
      situationAnswers: ADEQUATE,
    });
    const withoutNew = describeImpact(
      reduceImpact(createImpactState(), { type: "open" }),
      impactContextFromComparison(withoutNewView, { comparisonEntered: true }),
    );
    assert.equal(withoutNew.available, true);
    assert.equal(domain(withoutNew, "climate").emitted, false);
    assert.equal(withoutNew.manufacturingBasis, null);
    assert.equal(domain(withoutNew, "mining-eco").emitted, false);

    const removed = reduceComparison(selected.state, { type: "toggle", pathwayId: "new" });
    const removedView = describeComparison(removed, {
      inquiryReviewComplete: true,
      situationAnswers: ADEQUATE,
    });
    assert.equal(removedView.cards.some((card) => card.id === "new"), false);
    const stale = describeImpact(
      reduceImpact(createImpactState(), { type: "open" }),
      impactContextFromComparison(removedView, { comparisonEntered: true }),
    );
    assert.equal(stale.available, false);
    assert.equal(stale.manufacturingBasis, null);
    assert.equal(stale.domains.length, 0);
  });

  it("keeps mixed alternatives distinct and leaves mining, e-waste, and water unchanged", () => {
    const { view } = comparisonWith(["used_secondhand", "refurbished", "new"], "4");
    assert.deepEqual(
      view.cards.map((card) => card.id),
      ["used_secondhand", "refurbished", "new"],
    );
    assert.equal(view.rankingPermitted, false);
    assert.equal(view.cards.every((card) => card.rankingPermitted === false), true);
    const impact = openedImpact(view);
    assert.equal(domain(impact, "climate").emitted, true);
    for (const id of ["mining-eco", "mining-people", "ewaste-people", "ewaste-eco"]) {
      assert.equal(domain(impact, id).emitted, false);
      assert.equal(domain(impact, id).reasonCode, "condition_not_satisfied");
      assert.equal(domain(impact, id).disclosure, null);
    }
    const water = domain(impact, "water");
    assert.equal(water.emitted, true);
    assert.equal(Object.hasOwn(water, "independently_supported"), false);
    assert.equal(Object.hasOwn(water, "support_status"), false);
    assert.equal(Object.hasOwn(water, "extent"), false);
    const otherness = describeOtherness(reduceOtherness(createOthernessState(), { type: "open" }), {
      impactAvailable: impact.available,
      displayedRecords: impact.domains,
    });
    assert.equal(otherness.activated, false);
    assert.equal(otherness.question, null);
  });

  it("drops a stale climate basis and restores it only from the current evaluation", () => {
    let { state, view } = comparisonWith(["new"], "4");
    const opened = reduceImpact(createImpactState(), { type: "open" });
    assert.equal(
      describeImpact(opened, impactContextFromComparison(view, { comparisonEntered: true }))
        .manufacturingBasis.claimId,
      CLIMATE_CLAIM_ID,
    );

    state = reduceComparison(state, { type: "set_horizon", text: "" });
    view = describeComparison(state, {
      inquiryReviewComplete: true,
      situationAnswers: ADEQUATE,
    });
    assert.equal(view.evaluated, false);
    assert.equal(impactStateAfterComparisonAction("set_horizon", opened), opened);
    const clearedHorizon = describeImpact(
      opened,
      impactContextFromComparison(view, { comparisonEntered: true }),
    );
    assert.equal(clearedHorizon.available, false);
    assert.equal(clearedHorizon.manufacturingBasis, null);

    state = reduceComparison(state, { type: "set_horizon", text: "2.50" });
    view = describeComparison(state, {
      inquiryReviewComplete: true,
      situationAnswers: ADEQUATE,
    });
    const restored = describeImpact(
      opened,
      impactContextFromComparison(view, { comparisonEntered: true }),
    );
    assert.equal(domain(restored, "climate").emitted, true);
    assert.equal(restored.manufacturingBasis.claimVersion, CLIMATE_CLAIM_PACKAGE_COMMIT);
    assert.equal(view.horizonYears, 2.5);
    assert.notEqual(view.horizonYears, 3);

    const resetComparison = comparisonStateAfterSituationAction("edit", state);
    assert.deepEqual(resetComparison, createComparisonState());
    const resetImpact = impactStateAfterSituationAction("edit", opened);
    assert.equal(resetImpact.opened, false);
    const afterEdit = describeImpact(
      resetImpact,
      impactContextFromComparison(
        describeComparison(resetComparison, {
          inquiryReviewComplete: true,
          situationAnswers: ADEQUATE,
        }),
        { comparisonEntered: true },
      ),
    );
    assert.equal(afterEdit.manufacturingBasis, null);
    assert.equal(afterEdit.domains.length, 0);

    const inquiryCleared = comparisonStateAfterInquiryAction("back", state);
    assert.deepEqual(inquiryCleared, createComparisonState());
    assert.equal(impactStateAfterInquiryAction("back", opened).opened, false);
    assert.equal(impactStateAfterComparisonAction("reset", opened).opened, false);
  });
});
