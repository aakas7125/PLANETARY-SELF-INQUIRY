import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { createOthernessState, describeOtherness, reduceOtherness } from "../src/lib/smartphone/ap-otherness-ux.mjs";
import { createComparisonState, describeComparison, reduceComparison } from "../src/lib/smartphone/comparison-ux.mjs";
import {
  consequenceBindingKey,
  projectGenericNewClimateConsequence,
} from "../src/lib/smartphone/empirical-consequence.mjs";
import {
  SYSTEM_PARTICIPATION_ANCHOR,
} from "../src/lib/smartphone/system-participation-ux.mjs";
import {
  createImpactState,
  describeImpact,
  impactContextFromComparison,
  reduceImpact,
} from "../src/lib/smartphone/impact-pathways-ux.mjs";
import {
  LIFECYCLE_ADEME_REFERENCE_KG,
  LIFECYCLE_ADEME_REFERENCE_YEARS,
  LIFECYCLE_BANNER,
  LIFECYCLE_BATTERY_REPAIR_KG,
  LIFECYCLE_CHARGING_CENTRAL_KWH_PER_YEAR,
  LIFECYCLE_CHARGING_SENSITIVITY_KWH_PER_YEAR,
  LIFECYCLE_DISPLAY_REPAIR_KG,
  LIFECYCLE_DISTRIBUTION_KG,
  LIFECYCLE_PRODUCTION_KG,
  describeLifecycleGuide,
} from "../src/lib/smartphone/lifecycle-presentation.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;
const PROHIBITED_PUBLIC =
  /\b40\b|0\.568|0\.617|7\.431|7\.493|17\.840|85\.2|0\.475|unified harm|harm score|\bwinner\b|you should buy|average smartphone/i;

const FAIRPHONE_URL = "https://www.fairphone.com/wp-content/uploads/2024/09/Fairphone5_LCA_Report_2024.pdf";
const COMMISSION_URL =
  "https://energy-efficient-products.ec.europa.eu/product-list/smartphones-and-tablets_en";
const MONITOR_URL = "https://www.itu.int/pub/D-GEN-E_WASTE.01-2024";
const WHO_URL =
  "https://www.who.int/news-room/questions-and-answers/item/children-and-digital-dumpsites-e-waste-and-health";

function prose(guide) {
  const lines = [
    guide.sectionLabel,
    guide.summary,
    guide.roleNote,
    guide.banner,
    guide.inquiryBoundary,
    guide.production.heading,
    ...guide.production.lines,
    guide.production.disclosureSummary,
    ...guide.production.disclosureLines,
  ];
  for (const stage of guide.stages) {
    lines.push(
      stage.label,
      stage.generallyHeading,
      stage.generally,
      stage.thisPhoneHeading,
      ...stage.thisPhoneLines,
      stage.sourcesHeading,
      ...stage.sourceLines,
    );
    if (stage.widerContext) {
      lines.push(stage.widerContext.heading);
      for (const record of stage.widerContext.records) {
        lines.push(record.label, record.scopeLabel, record.fact, record.limit, record.linkLabel);
      }
    }
    if (stage.explore) {
      lines.push(stage.explore.heading, stage.explore.note);
      for (const link of stage.explore.links) lines.push(link.label, link.provenance);
    }
  }
  return lines;
}

describe("generic smartphone lifecycle presentation", () => {
  it("keeps eight stages in order with supplied general statements and this-phone limits", () => {
    const guide = describeLifecycleGuide();
    assert.deepEqual(
      guide.stages.map((stage) => stage.label),
      [
        "Raw materials",
        "Refining and processing",
        "Components",
        "Assembly",
        "Distribution and transport",
        "Use and repair",
        "Resale, refurbishment, and second life",
        "End of life",
      ],
    );
    assert.equal(
      guide.banner,
      "These stages show where smartphone impacts can arise. They are not additive shares of one phone’s footprint unless an accepted source explicitly provides compatible stage values.",
    );
    assert.equal(guide.banner, LIFECYCLE_BANNER);
    assert.equal(
      guide.stages[0].generally,
      "A new phone creates demand for processed materials. That supply can include primary and recycled feedstock.",
    );
    assert.equal(
      guide.stages[1].generally,
      "Raw-material extraction and processing sit inside the manufacturing boundary used by the accepted smartphone LCA evidence.",
    );
    assert.equal(
      guide.stages[2].generally,
      "Component and parts manufacture is part of the production footprint. We do not have a supported generic component-by-component split.",
    );
    assert.match(guide.stages[3].generally, /No separate generic assembly footprint/);
    assert.match(guide.stages[4].generally, /2–4 kg CO₂e/);
    assert.match(guide.stages[5].generally, /4 kWh\/year/);
    assert.match(guide.stages[5].generally, /2–8 kWh\/year/);
    assert.match(guide.stages[5].generally, /charging carbon stays unknown/);
    assert.match(guide.stages[6].generally, /Used and refurbished phones are different/);
    assert.match(guide.stages[6].generally, /not an avoided-new-phone credit/);
    assert.match(guide.stages[6].generally, /no approved generic acquisition footprint/);
    assert.match(guide.stages[7].generally, /not the fate of this phone/);

    for (const stage of guide.stages) {
      assert.equal(stage.generallyHeading, "What we know generally");
      assert.equal(stage.thisPhoneHeading, "What this tells us about your phone");
      assert.equal(stage.sourcesHeading, "Sources and limits");
      assert.notEqual(stage.generally, stage.thisPhoneLines.join(" "));
      assert.match(
        stage.thisPhoneLines.join(" "),
        /does not establish manufacturing, facility, feedstock, route, or handling details about your actual handset/,
      );
    }
    assert.equal(guide.stages[4].explore, null);
  });

  it("shows accepted generic records without stage arithmetic or carbonized charging", () => {
    const guide = describeLifecycleGuide();
    const production = guide.production.lines.join(" ");
    const productionLimits = guide.production.disclosureLines.join(" ");
    const distribution = guide.stages[4].sourceLines.join(" ");
    const use = guide.stages[5].sourceLines.join(" ");
    const secondLife = guide.stages[6].sourceLines.join(" ");
    const joined = prose(guide).join("\n");

    assert.deepEqual(LIFECYCLE_PRODUCTION_KG, [25, 70]);
    assert.deepEqual(LIFECYCLE_DISTRIBUTION_KG, [2, 4]);
    assert.equal(LIFECYCLE_CHARGING_CENTRAL_KWH_PER_YEAR, 4);
    assert.deepEqual(LIFECYCLE_CHARGING_SENSITIVITY_KWH_PER_YEAR, [2, 8]);
    assert.deepEqual(LIFECYCLE_BATTERY_REPAIR_KG, [0.3, 0.7]);
    assert.deepEqual(LIFECYCLE_DISPLAY_REPAIR_KG, [3, 8]);
    assert.equal(LIFECYCLE_ADEME_REFERENCE_KG, 7.61);
    assert.equal(LIFECYCLE_ADEME_REFERENCE_YEARS, 2);

    assert.match(production, /25–70 kg CO₂e\/device/);
    assert.match(production, /Approved V0 fallback/);
    assert.match(production, /Moderate/);
    assert.match(production, /heterogeneous LCA evidence bracket, not an average and not a distribution/);
    assert.match(production, /does not assign stage shares/);
    assert.match(production, /does not add the stages/);
    assert.match(productionLimits, /not fully comparable/);
    assert.match(distribution, /2–4 kg CO₂e\/device/);
    assert.match(distribution, /Approved V0 fallback/);
    assert.match(distribution, /Moderate/);
    assert.match(use, /4 kWh\/year/);
    assert.match(use, /2–8 kWh\/year/);
    assert.match(use, /energy, not carbon/);
    assert.match(use, /Charging carbon stays unknown/);
    assert.match(use, /0\.3–0\.7 kg CO₂e/);
    assert.match(use, /3–8 kg CO₂e/);
    assert.match(use, /Provisional generic range/);
    assert.match(use, /scenario bracket, not a confidence interval/);
    assert.match(
      secondLife,
      /7\.61 kg CO₂e is an approved source-specific reference for its explicit 2-year opaque scenario/,
    );
    assert.match(secondLife, /not a generic fallback/);
    assert.match(secondLife, /does not apply it to an arbitrary used or refurbished candidate/);
    assert.match(secondLife, /does not change comparison results/);
    assert.equal(joined.includes("27–74"), false);
    assert.equal(joined.includes("29–74"), false);
    assert.doesNotMatch(joined, /kWh\/year[^.\n]*kg CO₂e/);
    assert.equal(Object.hasOwn(guide, "total"), false);
    assert.equal(Object.hasOwn(guide.production, "totalKg"), false);
  });

  it("reuses only the four accepted optional explainers", () => {
    const guide = describeLifecycleGuide();
    const links = guide.stages.flatMap((stage) => stage.explore?.links ?? []);
    const hrefs = [...new Set(links.map((link) => link.href))];
    assert.deepEqual(hrefs.sort(), [COMMISSION_URL, FAIRPHONE_URL, MONITOR_URL, WHO_URL].sort());

    for (const index of [0, 1, 2, 3]) {
      assert.deepEqual(
        guide.stages[index].explore?.links.map((link) => link.href),
        [FAIRPHONE_URL],
      );
      assert.match(guide.stages[index].explore.links[0].provenance, /not generic authority/);
    }
    assert.deepEqual(
      guide.stages[5].explore?.links.map((link) => link.href),
      [COMMISSION_URL],
    );
    assert.match(guide.stages[5].explore.links[0].provenance, /not an LCA dataset/);
    assert.deepEqual(guide.stages[6].explore?.links.map((link) => link.href), [FAIRPHONE_URL]);
    assert.match(guide.stages[6].explore.links[0].provenance, /not generic refurbishment authority/);
    assert.deepEqual(
      guide.stages[7].explore?.links.map((link) => link.href),
      [MONITOR_URL, WHO_URL],
    );
    assert.match(guide.stages[7].explore.links[0].provenance, /not one phone’s fate or probability/);
    assert.match(guide.stages[7].explore.links[1].provenance, /not this phone’s fate/);
    assert.match(guide.stages[7].explore.note, /not automatically evidence/);
    assert.match(guide.stages[7].explore.note, /not numerical authority/);
  });

  it("keeps public prose free of internal tokens and personal consequence claims", () => {
    const guide = describeLifecycleGuide();
    for (const line of prose(guide)) {
      assert.equal(SNAKE_CASE_TOKEN.test(line), false, line);
    }
    const joined = prose(guide).join("\n");
    assert.doesNotMatch(joined, PROHIBITED_PUBLIC);
    assert.equal(joined.includes("independently_supported"), false);
    assert.equal(joined.includes("support_status"), false);
    assert.equal(joined.includes("gate_eligible"), false);
    assert.equal(guide.inquiryBoundary, "This guide does not by itself open another inquiry.");
    assert.match(guide.stages[0].thisPhoneLines.join(" "), /does not state a mine/);
    assert.match(guide.stages[7].thisPhoneLines.join(" "), /does not infer informal handling/);
    assert.equal(Object.hasOwn(guide, "extent"), false);
    assert.equal(Object.hasOwn(guide, "supportStatus"), false);
  });

  it("stays independent of comparison evaluation, impact conditions, and otherness", () => {
    const moduleSource = readApp("src/lib/smartphone/lifecycle-presentation.mjs");
    const componentSource = readApp("src/components/smartphone-lifecycle.tsx");
    const comparisonSource = readApp("src/components/smartphone-comparison.tsx");
    const impactSource = readApp("src/components/smartphone-impact.tsx");
    const comparisonLogic = readApp("src/lib/smartphone/comparison-ux.mjs");
    const impactLogic = readApp("src/lib/smartphone/impact-pathways-ux.mjs");
    const othernessLogic = readApp("src/lib/smartphone/ap-otherness-ux.mjs");

    assert.equal(moduleSource.includes("comparison-ux"), false);
    assert.equal(moduleSource.includes("impact-pathways"), false);
    assert.equal(moduleSource.includes("input-decision"), false);
    assert.equal(moduleSource.includes("secondary-pathway"), false);
    assert.equal(moduleSource.includes("ap-otherness"), false);
    assert.equal(moduleSource.includes("case_id"), false);
    assert.equal(comparisonLogic.includes("lifecycle-presentation"), false);
    assert.equal(impactLogic.includes("lifecycle-presentation"), false);
    assert.equal(othernessLogic.includes("lifecycle-presentation"), false);
    assert.equal(componentSource.includes("dispatch"), false);
    assert.equal(componentSource.includes("horizon"), false);
    assert.match(componentSource, /describeLifecycleGuide\(\)/);
    assert.doesNotMatch(componentSource, /<SmartphoneLifecycleGuide [^>]*>/);
    assert.match(componentSource, /guide\.stages\.map/);
    assert.match(componentSource, /guide\.production\.lines/);
    assert.match(componentSource, /<svg/);
    assert.equal(componentSource.includes("25–70"), false);
    assert.equal(componentSource.includes("2–4"), false);
    assert.equal(componentSource.includes("0.3–0.7"), false);
    assert.equal(componentSource.includes("3–8"), false);
    assert.equal(componentSource.includes("7.61"), false);
    assert.equal(componentSource.includes("old phone"), false);
    assert.equal(componentSource.includes("avoided"), false);

    const guideMountTag = "<SmartphoneLifecycleGuide headingId={GUIDE_TARGET_ID} />";
    const guideMounts = comparisonSource.split("<SmartphoneLifecycleGuide").length - 1;
    const guideMount = comparisonSource.indexOf(guideMountTag);
    const horizonMount = comparisonSource.indexOf('id="comparison-horizon"');
    const evaluatedMount = comparisonSource.indexOf("{view.evaluated ? (");
    const continueMount = comparisonSource.indexOf("IMPACT_CHROME.continueFromComparison");
    const guideNoteMount = comparisonSource.indexOf("{view.modelGuideNote ? (");
    assert.equal(guideMounts, 1);
    assert.ok(guideMount > 0);
    assert.ok(horizonMount > 0 && horizonMount < guideMount);
    assert.ok(evaluatedMount > horizonMount && evaluatedMount < guideMount);
    assert.ok(continueMount > evaluatedMount && continueMount < guideMount);
    assert.ok(guideMount < guideNoteMount);
    assert.equal(comparisonSource.split("{view.modelGuideNote ? (").length - 1, 1);

    const topLink = comparisonSource.indexOf("href={`#${GUIDE_TARGET_ID}`}");
    const backLink = comparisonSource.indexOf("href={`#${INPUTS_TARGET_ID}`}");
    const stageList = comparisonSource.indexOf('aria-label="Smartphone inquiry stages"');
    const inputsTarget = comparisonSource.indexOf("id={INPUTS_TARGET_ID}");
    const pathwayLegend = comparisonSource.indexOf("COMPARISON_CHROME.pathwayLegend");
    assert.ok(topLink > 0 && topLink < stageList);
    assert.ok(backLink > guideNoteMount);
    assert.ok(inputsTarget > 0 && inputsTarget < pathwayLegend && pathwayLegend < horizonMount);
    assert.match(comparisonSource, /GUIDE_LINK_LABEL = "Explore the phone lifecycle and sources"/);
    assert.match(comparisonSource, /INPUTS_LINK_LABEL = "Back to comparison inputs"/);
    assert.equal(comparisonSource.split("{GUIDE_LINK_LABEL}").length - 1, 1);
    assert.equal(comparisonSource.split("{INPUTS_LINK_LABEL}").length - 1, 1);
    assert.match(componentSource, /headingId/);

    const impactGuide = impactSource.indexOf("<SmartphoneLifecycleGuide />");
    const impactCards = impactSource.indexOf('aria-label="Impact and dependency pathways"');
    assert.ok(impactGuide > 0);
    assert.ok(impactGuide < impactCards);

    const answers = {
      safe_to_use: true,
      required_functions_met: true,
      security_support: true,
    };
    for (const horizonRaw of ["", " ", "0", "nope"]) {
      let state = reduceComparison(createComparisonState(), { type: "toggle", pathwayId: "new" });
      state = reduceComparison(state, { type: "set_horizon", text: horizonRaw });
      const view = describeComparison(state, {
        inquiryReviewComplete: true,
        situationAnswers: answers,
      });
      assert.equal(view.evaluated, false, horizonRaw);
      assert.equal(view.cards.length, 0, horizonRaw);
    }

    const ready = reduceComparison(
      reduceComparison(createComparisonState(), { type: "toggle", pathwayId: "new" }),
      { type: "set_horizon", text: "4" },
    );
    const evaluated = describeComparison(ready, {
      inquiryReviewComplete: true,
      situationAnswers: answers,
    });
    assert.equal(evaluated.evaluated, true);
    assert.equal(evaluated.cards.length, 1);

    const impact = describeImpact(reduceImpact(createImpactState(), { type: "open" }), {
      comparisonAvailable: true,
      comparisonEntered: true,
      comparisonEvaluated: true,
      comparisonCards: [],
    });
    assert.equal(impact.available, true);
    assert.equal(impact.manufacturingBasis, null);
    assert.equal(Object.hasOwn(impact, "lifecycle"), false);
    assert.equal(impact.domains.find((domain) => domain.id === "climate")?.emitted, false);

    const otherness = describeOtherness(reduceOtherness(createOthernessState(), { type: "open" }), {
      impactAvailable: true,
    });
    assert.equal(otherness.activated, false);
    assert.equal(Object.hasOwn(otherness, "lifecycle"), false);
  });

  it("shows accepted S7 wider context on end of life without a pathway or gate", () => {
    const guide = describeLifecycleGuide();
    const globalFact =
      "Globally, 62 billion kg of e-waste was generated in 2022. About 22.3% of that mass was documented as formally collected and recycled.";
    const globalLimit =
      "This covers all e-waste, not phones alone, and it is not the probability that your phone will be recycled. The undocumented share must not be labelled “landfill.”";
    const mixedFact =
      "Small IT and telecommunication equipment — a category that includes mobile phones alongside laptops, routers and other devices — generated 4.6 billion kg of e-waste globally in 2022. About 22% of that category was documented as collected and recycled.";
    const mixedLimit =
      "This is a mixed equipment category, not a smartphone-only rate and not an individual route probability.";
    const scope = "Global · 2022 · annual mass flow";
    const sourceLabel = "Institutional source: ITU/UNITAR, Global E-waste Monitor 2024";
    const globalHref =
      "https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-Waste-Monitor-2024.aspx";
    const mixedHref =
      "https://unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling";

    for (const stage of guide.stages) {
      if (stage.id === "end-of-life") {
        assert.equal(stage.widerContext?.id, "wider-context");
      } else {
        assert.equal(stage.widerContext, null, stage.id);
      }
    }

    const context = guide.stages[7].widerContext;
    assert.equal(context.heading, "Wider context");
    assert.deepEqual(context.provenance, {
      source: "S7",
      packageId: "R&E-V0-SMARTPHONE-0.3.0",
      research: "§8 Candidates 1–2",
    });
    assert.deepEqual(
      context.records.map((record) => record.id),
      ["global-e-waste", "small-it-telecommunication"],
    );
    assert.deepEqual(context.records[0], {
      id: "global-e-waste",
      label: "Global e-waste",
      scopeLabel: scope,
      fact: globalFact,
      limit: globalLimit,
      href: globalHref,
      linkLabel: sourceLabel,
    });
    assert.deepEqual(context.records[1], {
      id: "small-it-telecommunication",
      label: "Small IT and telecommunication equipment",
      scopeLabel: scope,
      fact: mixedFact,
      limit: mixedLimit,
      href: mixedHref,
      linkLabel: sourceLabel,
    });
    assert.equal(new URL(globalHref).protocol, "https:");
    assert.equal(new URL(mixedHref).protocol, "https:");

    const contextText = [context.heading, ...context.records.flatMap((record) => [record.fact, record.limit])].join("\n");
    assert.equal(contextText.includes("13.8"), false);
    assert.equal(contextText.includes("77.7"), false);
    assert.equal(contextText.includes("78%"), false);
    assert.equal(/Eurostat|phone count|avoided production|landfill rate/i.test(contextText), false);
    assert.match(guide.stages[7].generally, /not the fate of this phone/);
    assert.match(guide.stages[7].sourceLines.join(" "), /Source S7\. ITU\/UNITAR, Global E-waste Monitor 2024/);
    assert.deepEqual(guide.stages[7].explore.links.map((link) => link.href), [MONITOR_URL, WHO_URL]);

    const componentSource = readApp("src/components/smartphone-lifecycle.tsx");
    assert.match(componentSource, /stage\.widerContext/);
    assert.equal(componentSource.includes("62 billion"), false);
    assert.equal(componentSource.includes("22.3%"), false);
    assert.equal(componentSource.includes("4.6 billion"), false);
    assert.equal(componentSource.includes(globalHref), false);
    assert.equal(componentSource.includes("anticipated"), false);
    assert.equal(componentSource.includes("comparison-ux"), false);
    assert.equal(componentSource.includes("impact-pathways"), false);

    const answers = {
      safe_to_use: true,
      required_functions_met: true,
      security_support: true,
    };
    function comparisonFor(pathwayIds, { horizon = "4", fate = null } = {}) {
      let state = createComparisonState();
      for (const pathwayId of pathwayIds) {
        state = reduceComparison(state, { type: "toggle", pathwayId });
      }
      state = reduceComparison(state, { type: "set_horizon", text: horizon });
      if (fate != null) {
        state = reduceComparison(state, { type: "set_anticipated_old_phone_fate", fate });
      }
      return {
        state,
        view: describeComparison(state, {
          inquiryReviewComplete: true,
          situationAnswers: answers,
        }),
      };
    }
    function openedImpact(view) {
      return describeImpact(
        reduceImpact(createImpactState(), { type: "open" }),
        impactContextFromComparison(view, { comparisonEntered: true }),
      );
    }
    function othernessFor(impact) {
      const record = projectGenericNewClimateConsequence(impact);
      return describeOtherness(reduceOtherness(createOthernessState(), { type: "open" }), {
        impactAvailable: impact.available,
        displayedRecords: record ? [record] : [],
        requireFullResearchRecord: true,
        empiricalAnchor: record ? SYSTEM_PARTICIPATION_ANCHOR : null,
      });
    }
    function surface(view) {
      return view.cards.map((card) => ({
        id: card.id,
        values: card.values,
        publicLines: card.publicLines,
        capability: card.capability,
      }));
    }

    const incomplete = comparisonFor(["new"], { horizon: "" });
    assert.equal(incomplete.view.evaluated, false);
    assert.equal(incomplete.view.cards.length, 0);
    assert.equal(incomplete.state.currentOwnedModelId, null);
    assert.equal(incomplete.state.candidateNewModelId, null);
    assert.deepEqual(describeLifecycleGuide().stages[7].widerContext, context);
    const closedImpact = describeImpact(createImpactState(), impactContextFromComparison(incomplete.view, { comparisonEntered: false }));
    assert.equal(closedImpact.available, false);
    assert.equal(closedImpact.manufacturingBasis, null);
    assert.equal(closedImpact.domains.length, 0);

    const unanswered = comparisonFor(["new"]);
    const recycling = comparisonFor(["new"], { fate: "formal_recycling" });
    const unknownFate = comparisonFor(["new"], { fate: "unknown" });
    assert.equal(unanswered.state.anticipatedOldPhoneFate, null);
    assert.equal(recycling.state.anticipatedOldPhoneFate, "formal_recycling");
    assert.equal(unknownFate.state.anticipatedOldPhoneFate, "unknown");
    assert.deepEqual(surface(recycling.view), surface(unanswered.view));
    assert.deepEqual(surface(unknownFate.view), surface(unanswered.view));
    assert.deepEqual(recycling.view.evaluatorInputs, unanswered.view.evaluatorInputs);

    const unansweredImpact = openedImpact(unanswered.view);
    const recyclingImpact = openedImpact(recycling.view);
    const unknownImpact = openedImpact(unknownFate.view);
    assert.deepEqual(recyclingImpact.manufacturingBasis, unansweredImpact.manufacturingBasis);
    assert.deepEqual(unknownImpact.manufacturingBasis, unansweredImpact.manufacturingBasis);
    assert.deepEqual(unansweredImpact.manufacturingBasis.valueRange, [25, 70]);
    for (const impact of [unansweredImpact, recyclingImpact, unknownImpact]) {
      for (const id of ["ewaste-people", "ewaste-eco"]) {
        assert.equal(impact.domains.find((domain) => domain.id === id).emitted, false, id);
      }
    }
    const unansweredRecord = projectGenericNewClimateConsequence(unansweredImpact);
    const recyclingRecord = projectGenericNewClimateConsequence(recyclingImpact);
    assert.equal(consequenceBindingKey(recyclingRecord), consequenceBindingKey(unansweredRecord));
    assert.equal(consequenceBindingKey(projectGenericNewClimateConsequence(unknownImpact)), consequenceBindingKey(unansweredRecord));
    assert.equal(othernessFor(recyclingImpact).activated, othernessFor(unansweredImpact).activated);
    assert.equal(othernessFor(unknownImpact).activated, othernessFor(unansweredImpact).activated);
    assert.deepEqual(describeLifecycleGuide(), guide);

    const keepRepair = comparisonFor(["keep", "repair"]);
    assert.equal(keepRepair.view.evaluated, true);
    assert.equal(keepRepair.view.oldPhoneFate.visible, false);
    assert.equal(keepRepair.view.oldPhoneFate.annotation, null);
    const refused = comparisonFor(["keep", "repair"], { fate: "formal_recycling" });
    assert.equal(refused.state.anticipatedOldPhoneFate, null);
    const keepImpact = openedImpact(keepRepair.view);
    assert.equal(keepImpact.manufacturingBasis, null);
    assert.equal(projectGenericNewClimateConsequence(keepImpact), null);
    for (const id of ["ewaste-people", "ewaste-eco", "climate"]) {
      assert.equal(keepImpact.domains.find((domain) => domain.id === id).emitted, false, id);
    }
    assert.equal(othernessFor(keepImpact).activated, false);
    assert.equal(Object.hasOwn(keepImpact, "lifecycle"), false);
  });
});
