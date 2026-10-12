import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createInquiryState, reduceInquiry } from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import { getApInquirySequence } from "../src/lib/smartphone/ap-inquiry.mjs";
import {
  CLIMATE_CLAIM_ID,
  CLIMATE_CLAIM_PACKAGE_COMMIT,
  resolveClimatePathwayBoundary,
} from "../src/lib/smartphone/empirical-climate-boundary.mjs";
import {
  EWASTE_ECO_CLAIM_ID,
  EWASTE_ECO_CLAIM_PACKAGE_COMMIT,
} from "../src/lib/smartphone/empirical-ewaste-eco-boundary.mjs";
import {
  EWASTE_PEOPLE_CLAIM_ID,
  EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
} from "../src/lib/smartphone/empirical-ewaste-people-boundary.mjs";
import {
  MINING_ECO_CLAIM_ID,
  MINING_ECO_CLAIM_PACKAGE_COMMIT,
} from "../src/lib/smartphone/empirical-mining-eco-boundary.mjs";
import {
  MINING_PEOPLE_CLAIM_ID,
  MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
} from "../src/lib/smartphone/empirical-mining-people-boundary.mjs";
import {
  WATER_CLAIM_ID,
  WATER_CLAIM_PACKAGE_COMMIT,
} from "../src/lib/smartphone/empirical-water-boundary.mjs";
import {
  canEnterComparison,
  createComparisonState,
  describeComparison,
  reduceComparison,
} from "../src/lib/smartphone/comparison-ux.mjs";
import {
  IMPACT_CHROME,
  IMPACT_LIMIT_LINE,
  canEnterImpact,
  createImpactState,
  describeImpact,
  impactStateAfterComparisonAction,
  impactStateAfterInquiryAction,
  impactStateAfterSituationAction,
  reduceImpact,
} from "../src/lib/smartphone/impact-pathways-ux.mjs";
import { createSituationState, reduceSituation } from "../src/lib/smartphone/situation-ux.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;
const REPO_TOKEN = /evidence\/|contracts\/|app\/src|\.mjs|\.json|github\.com|package_commit|reason_code|case_id/i;
const PROHIBITED_OUTPUT =
  /\bvictims?\b|\bdeaths?\b|species loss|ecosystem loss|litres denied|drinking water denied|hectares|unified score|\brecommend\b|\branking\b|displacement credit|avoided production|\b0\s*kg\b|\b0\s*years\b/i;

const READY = Object.freeze({
  comparisonAvailable: true,
  comparisonEntered: true,
  comparisonEvaluated: true,
});

const PINS = Object.freeze([
  ["climate", CLIMATE_CLAIM_ID, CLIMATE_CLAIM_PACKAGE_COMMIT],
  ["mining-eco", MINING_ECO_CLAIM_ID, MINING_ECO_CLAIM_PACKAGE_COMMIT],
  ["mining-people", MINING_PEOPLE_CLAIM_ID, MINING_PEOPLE_CLAIM_PACKAGE_COMMIT],
  ["ewaste-people", EWASTE_PEOPLE_CLAIM_ID, EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT],
  ["ewaste-eco", EWASTE_ECO_CLAIM_ID, EWASTE_ECO_CLAIM_PACKAGE_COMMIT],
  ["water", WATER_CLAIM_ID, WATER_CLAIM_PACKAGE_COMMIT],
]);

const EMIT_OVERRIDES = Object.freeze({
  climate: { scenario_produces_ghg_emissions: true },
  "mining-eco": { relevant_primary_metal_extraction_occurs: true },
  "mining-people": { relevant_supply_chain_geography_process_established: true },
  "ewaste-people": { unsafe_or_informal_handling_established: true },
  "ewaste-eco": { unsound_site_handling_established: true },
});

function opened() {
  return reduceImpact(createImpactState(), { type: "open" });
}

function publicCorpus(view) {
  return [
    view.opening,
    view.closedNote,
    view.selectionNote,
    view.rangeNote,
    view.unknownNote,
    view.boundary,
    ...view.inspectedLabels,
    ...view.capabilityLines,
    ...view.stages.flatMap((stage) => [stage.label, stage.note]),
    ...view.domains.flatMap((domain) => [
      domain.heading,
      ...domain.lines,
      ...(domain.disclosure ? [domain.disclosure.summary, ...domain.disclosure.lines] : []),
    ]),
  ]
    .filter((line) => typeof line === "string")
    .join("\n");
}

function domainById(view, id) {
  return view.domains.find((domain) => domain.id === id);
}

describe("smartphone impact and dependency pathways", () => {
  it("opens only after comparison is available, entered, and evaluated", () => {
    const closed = describeImpact(opened(), {});
    assert.equal(closed.available, false);
    assert.equal(closed.domains.length, 0);
    assert.equal(closed.stages.every((stage) => stage.availability !== "current"), true);
    assert.equal(canEnterImpact({ comparisonAvailable: true }), false);
    assert.equal(
      canEnterImpact({ comparisonAvailable: true, comparisonEntered: true }),
      false,
    );
    assert.equal(
      canEnterImpact({ comparisonAvailable: true, comparisonEvaluated: true }),
      false,
    );
    assert.equal(describeImpact(createImpactState(), READY).available, false);

    const view = describeImpact(opened(), READY);
    assert.equal(view.available, true);
    assert.equal(view.stages.find((stage) => stage.id === "situation")?.availability, "recorded");
    assert.equal(view.stages.find((stage) => stage.id === "inquiry")?.availability, "recorded");
    assert.equal(
      view.stages.find((stage) => stage.id === "empirical-comparison")?.availability,
      "recorded",
    );
    assert.equal(
      view.stages.find((stage) => stage.id === "impact-dependency")?.availability,
      "current",
    );
    assert.equal(
      view.stages.find((stage) => stage.id === "impact-dependency")?.label,
      "Impact and dependency pathways",
    );
    assert.equal(
      view.stages
        .filter((stage) => stage.availability === "pending")
        .map((stage) => stage.id)
        .join(","),
      "protect-four-otherness,user-choice",
    );
  });

  it("keeps six domains distinct and emits only resolver-authorized cards", () => {
    const view = describeImpact(opened(), {
      ...READY,
      inspectedPathways: [
        { label: "Buy a new phone", capabilityLine: "A quantified range is available" },
      ],
    });
    assert.deepEqual(
      view.domains.map((domain) => domain.heading),
      [
        "Climate",
        "Mining pressure and ecosystems",
        "Mining pressure and people",
        "E-waste and people",
        "E-waste and ecosystems",
        "Water",
      ],
    );
    assert.equal(new Set(view.domains.map((domain) => domain.id)).size, 6);

    for (const [id, claimId, claimVersion] of PINS) {
      const domain = domainById(view, id);
      assert.equal(domain.attributedToSelection, false);
      if (id === "water") {
        assert.equal(domain.emitted, true);
        assert.equal(domain.claimId, claimId);
        assert.equal(domain.claimVersion, claimVersion);
        assert.equal(domain.disclosure.claimId, claimId);
        assert.deepEqual(domain.disclosure.sourceIds, ["S1", "S2"]);
        assert.equal(domain.lines.some((line) => line.includes(claimVersion)), false);
        assert.match(domain.lines[1], /does not prove or avoid/);
      } else {
        assert.equal(domain.emitted, false);
        assert.equal(domain.reasonCode, "condition_not_satisfied");
        assert.equal(domain.disclosure, null);
        assert.match(domain.lines[0], /not established/);
        assert.equal(domain.lines.some((line) => line.includes(claimId)), false);
      }
    }

    const waterLines = domainById(view, "water").lines.join("\n");
    assert.equal(waterLines.includes("Buy a new phone"), false);
    assert.deepEqual(view.inspectedLabels, ["Buy a new phone"]);
    const internalCapability = describeImpact(opened(), {
      ...READY,
      inspectedPathways: [{ label: "Buy a new phone", capabilityLine: "range_quantitative" }],
    });
    assert.deepEqual(internalCapability.capabilityLines, []);
    assert.equal(internalCapability.available, true);
    assert.match(view.selectionNote, /does not prove or avoid/);
    assert.match(view.unknownNote, /unknown/);
    assert.match(view.unknownNote, /not treated as zero/);
    assert.doesNotMatch(publicCorpus(view), /\b0(?:\.\d+)?\b/);
  });

  it("pins every emitted card to the resolver claim and version", () => {
    const view = describeImpact(opened(), { ...READY, resolverOverrides: EMIT_OVERRIDES });
    assert.equal(view.domains.every((domain) => domain.emitted), true);
    for (const [id, claimId, claimVersion] of PINS) {
      const domain = domainById(view, id);
      assert.equal(domain.claimId, claimId);
      assert.equal(domain.claimVersion, claimVersion);
      assert.equal(domain.disclosure.claimId, claimId);
      assert.equal(domain.lines[0].length > 0, true);
      assert.equal(domain.lines.includes(IMPACT_LIMIT_LINE), true);
      assert.equal(domain.attributionLimits.length > 0, true);
      assert.equal(
        domain.disclosure.lines.filter((line) => line.startsWith("Condition:")).length,
        domain.conditions.length,
      );
      assert.equal(domain.attributedToSelection, false);
    }

    const climate = domainById(view, "climate");
    const resolved = resolveClimatePathwayBoundary({
      claim_id: CLIMATE_CLAIM_ID,
      claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
      scenario_produces_ghg_emissions: true,
    });
    assert.equal(climate.lines[0], resolved.pathway.statement);
    assert.deepEqual([...climate.attributionLimits], [...resolved.pathway.attribution_limits]);
    assert.deepEqual([...climate.conditions], [...resolved.pathway.conditions]);
  });

  it("does not emit incomplete, wrong, or conflicting authority", () => {
    const wrongVersion = describeImpact(opened(), {
      ...READY,
      resolverOverrides: {
        climate: {
          scenario_produces_ghg_emissions: true,
          claim_version: "not-the-accepted-version",
        },
        water: { claim_version: "not-the-accepted-version" },
      },
    });
    assert.equal(domainById(wrongVersion, "climate").emitted, false);
    assert.equal(domainById(wrongVersion, "water").emitted, false);
    assert.equal(domainById(wrongVersion, "climate").disclosure, null);
    assert.equal(
      domainById(wrongVersion, "climate").lines.join("\n").includes("Manufacturing-related"),
      false,
    );

    const incomplete = describeImpact(opened(), {
      ...READY,
      resolverOverrides: {
        climate: {
          scenario_produces_ghg_emissions: true,
          authority_claim_record: { claim_id: CLIMATE_CLAIM_ID },
        },
      },
    });
    assert.equal(domainById(incomplete, "climate").emitted, false);

    const conflict = describeImpact(opened(), {
      ...READY,
      resolverOverrides: {
        water: { claim_ref: `${CLIMATE_CLAIM_ID}@${WATER_CLAIM_PACKAGE_COMMIT}` },
      },
    });
    assert.equal(domainById(conflict, "water").emitted, false);
    assert.equal(domainById(conflict, "water").reasonCode, "conflicting_claim_representation");
  });

  it("does not let case or assertion metadata create a card", () => {
    const tagged = describeImpact(opened(), {
      ...READY,
      resolverOverrides: {
        climate: { case_id: "CASE-IMPACT-1", assertion_id: "ASSERT-1" },
        water: { case_id: "CASE-IMPACT-1", assertion_id: "ASSERT-1" },
      },
    });
    const plain = describeImpact(opened(), READY);
    assert.equal(domainById(tagged, "climate").emitted, domainById(plain, "climate").emitted);
    assert.equal(domainById(tagged, "water").emitted, domainById(plain, "water").emitted);
    assert.equal(domainById(tagged, "climate").emitted, false);
    assert.equal(publicCorpus(tagged).includes("CASE-IMPACT-1"), false);
    assert.equal(publicCorpus(tagged).includes("ASSERT-1"), false);

    const forced = describeImpact(opened(), {
      ...READY,
      resolverOverrides: {
        climate: {
          scenario_produces_ghg_emissions: true,
          case_id: "CASE-IMPACT-1",
          use_case_id_as_claim_authority: true,
        },
      },
    });
    assert.equal(domainById(forced, "climate").emitted, false);
    assert.equal(
      domainById(forced, "climate").reasonCode,
      "case_metadata_not_production_authority",
    );
  });

  it("keeps public text free of internal tokens and prohibited conclusions", () => {
    const view = describeImpact(opened(), {
      ...READY,
      inspectedPathways: [
        { label: "Keep the current phone", capabilityLine: "More information is needed" },
        { label: "Buy a new phone", capabilityLine: "A quantified range is available" },
      ],
      resolverOverrides: EMIT_OVERRIDES,
    });
    const corpus = publicCorpus(view);
    const beyondAcceptedConditions = corpus
      .split("\n")
      .filter((line) => !line.startsWith("Condition:"))
      .join("\n");
    assert.doesNotMatch(corpus, SNAKE_CASE_TOKEN);
    assert.doesNotMatch(corpus, REPO_TOKEN);
    assert.doesNotMatch(beyondAcceptedConditions, PROHIBITED_OUTPUT);
    for (const [, , claimVersion] of PINS) {
      assert.equal(corpus.includes(claimVersion), false);
    }
    assert.match(corpus, /Sources and limits/);
    assert.match(view.boundary, /Nothing here ranks/);
    assert.match(view.boundary, /what to buy/);
    assert.equal(view.domains.every((domain) => domain.attributedToSelection === false), true);
  });

  it("clears impact state when an upstream stage is edited or reset", () => {
    const openedState = opened();
    assert.equal(impactStateAfterSituationAction("select", openedState), openedState);
    assert.deepEqual(impactStateAfterSituationAction("edit", openedState), createImpactState());
    assert.deepEqual(impactStateAfterSituationAction("reset", openedState), createImpactState());
    assert.equal(impactStateAfterInquiryAction("continue", openedState), openedState);
    for (const actionType of [
      "set_raw",
      "mark_not_sure",
      "set_choice",
      "set_shift",
      "edit_question",
      "reset",
      "back",
    ]) {
      assert.deepEqual(impactStateAfterInquiryAction(actionType, openedState), createImpactState());
    }
    assert.equal(impactStateAfterComparisonAction("set_horizon", openedState), openedState);
    assert.deepEqual(impactStateAfterComparisonAction("reset", openedState), createImpactState());
    assert.equal(reduceImpact(openedState, { type: "clear" }).opened, false);
  });

  it("leaves situation, inquiry, comparison, home, and journey behavior intact", () => {
    const situation = describeImpact(createImpactState(), {});
    assert.equal(situation.available, false);

    let inquiry = createInquiryState();
    for (const question of getApInquirySequence()) {
      inquiry = reduceInquiry(inquiry, {
        type: "set_raw",
        questionId: question.question_id,
        text: "A recorded answer",
      });
      inquiry = reduceInquiry(inquiry, { type: "continue" });
    }
    assert.equal(canEnterComparison(inquiry), true);

    let comparison = reduceComparison(createComparisonState(), { type: "toggle", pathwayId: "new" });
    comparison = reduceComparison(comparison, { type: "set_horizon", text: "4" });
    const comparisonView = describeComparison(comparison, {
      inquiryReviewComplete: true,
      situationAnswers: {
        safe_to_use: true,
        required_functions_met: true,
        security_support: true,
      },
    });
    assert.equal(comparisonView.evaluated, true);
    assert.equal(comparisonView.cards.length, 1);
    assert.match(comparisonView.laterNote, /not shown here/);

    const situationState = reduceSituation(createSituationState(), { type: "reset" });
    assert.equal(situationState.submitted, false);

    const situationComponent = readApp("src/components/smartphone-situation.tsx");
    const comparisonComponent = readApp("src/components/smartphone-comparison.tsx");
    const impactComponent = readApp("src/components/smartphone-impact.tsx");
    const route = readApp("src/routes/smartphone.tsx");
    const home = readApp("src/routes/index.tsx");
    const journey = readApp("src/routes/journey.tsx");

    assert.match(situationComponent, /impactStateAfterSituationAction/);
    assert.match(situationComponent, /impactStateAfterInquiryAction/);
    assert.match(situationComponent, /impactStateAfterComparisonAction/);
    assert.match(situationComponent, /canEnterImpact/);
    assert.match(comparisonComponent, /IMPACT_CHROME\.continueFromComparison/);
    assert.match(impactComponent, /<details/);
    assert.match(impactComponent, /<summary/);
    assert.equal(impactComponent.includes("reasonCode"), false);
    assert.equal(impactComponent.includes("claimVersion"), false);
    assert.equal(impactComponent.includes("case_id"), false);
    assert.equal(comparisonComponent.includes("scenario_produces_ghg_emissions"), false);
    assert.equal(situationComponent.includes("scenario_produces_ghg_emissions"), false);
    assert.equal(impactComponent.includes("scenario_produces_ghg_emissions"), false);
    assert.match(route, /SmartphoneSituation/);
    assert.match(route, /createFileRoute\("\/smartphone"\)/);
    assert.doesNotMatch(home, /smartphone-impact|smartphone-comparison/);
    assert.doesNotMatch(journey, /smartphone-impact|smartphone-comparison/);
    assert.equal(IMPACT_CHROME.continueFromComparison, "Continue to impact and dependency pathways");
  });
});
