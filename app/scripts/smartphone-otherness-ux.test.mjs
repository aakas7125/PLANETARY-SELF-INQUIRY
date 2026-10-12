import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT,
  OTHERNESS_QUESTION_TEXT,
  PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS,
  SUPPORT_STATUS_MISSING,
  SUPPORT_STATUS_SUPPORTED,
  SUPPORT_STATUS_UNKNOWN,
  SUPPORT_STATUS_UNSUPPORTED,
} from "../src/lib/smartphone/ap-otherness.mjs";
import {
  CORPUS_VERSION,
  POST_EVIDENCE_SOURCE_LENS_ALLOWLIST,
} from "../src/lib/smartphone/ap-source-lens.mjs";
import {
  OTHERNESS_BOUNDARY,
  OTHERNESS_CHROME,
  OTHERNESS_CLASSIFICATION,
  OTHERNESS_CLOSED_NOTE,
  OTHERNESS_IMMEDIATE_NOTE,
  OTHERNESS_RESPONSE_HELPER,
  OTHERNESS_UNAVAILABLE_NOTE,
  canEnterOtherness,
  createOthernessState,
  describeOtherness,
  displayedConsequenceReferences,
  othernessStateAfterComparisonAction,
  othernessStateAfterImpactAction,
  othernessStateAfterInquiryAction,
  othernessStateAfterReturnToImpact,
  othernessStateAfterSituationAction,
  reduceOtherness,
} from "../src/lib/smartphone/ap-otherness-ux.mjs";
import {
  canEnterImpact,
  createImpactState,
  describeImpact,
  reduceImpact,
} from "../src/lib/smartphone/impact-pathways-ux.mjs";
import { createSituationState, describeSituation, reduceSituation } from "../src/lib/smartphone/situation-ux.mjs";
import { createInquiryState, describeInquiry } from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import { createComparisonState, describeComparison } from "../src/lib/smartphone/comparison-ux.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

const READY = Object.freeze({
  comparisonAvailable: true,
  comparisonEntered: true,
  comparisonEvaluated: true,
});

const EMIT_OVERRIDES = Object.freeze({
  climate: { scenario_produces_ghg_emissions: true },
  "mining-eco": { relevant_primary_metal_extraction_occurs: true },
  "mining-people": { relevant_supply_chain_geography_process_established: true },
  "ewaste-people": { unsafe_or_informal_handling_established: true },
  "ewaste-eco": { unsound_site_handling_established: true },
});

function openedImpact() {
  return reduceImpact(createImpactState(), { type: "open" });
}

function openedOtherness() {
  return reduceOtherness(createOthernessState(), { type: "open" });
}

function qualifyingReference(overrides = {}) {
  return {
    consequence_ref_id: "displayed-consequence-beyond-circle",
    displayed: true,
    independently_supported: true,
    support_status: SUPPORT_STATUS_SUPPORTED,
    extent: "beyond_immediate_circle",
    ...overrides,
  };
}

function impactDomains(overrides) {
  return describeImpact(openedImpact(), { ...READY, resolverOverrides: overrides }).domains;
}

function publicLines(view) {
  return [
    view.opening,
    view.closedNote,
    view.unavailableNote,
    view.question,
    view.followUpPrompt,
    view.classificationLine,
    view.responseHelper,
    view.boundary,
    ...view.stages.flatMap((stage) => [stage.label, stage.note]),
    ...(view.disclosure
      ? [
          view.disclosure.summary,
          view.disclosure.corpusLine,
          ...view.disclosure.claims.flatMap((claim) => [
            claim.claimLine,
            claim.paraphrase,
            ...claim.links.map((link) => link.title),
          ]),
        ]
      : []),
  ].filter((line) => typeof line === "string");
}

describe("post-evidence Protect Four and otherness inquiry", () => {
  it("opens only after the impact stage is available and records the surrounding stages", () => {
    assert.equal(canEnterOtherness({}), false);
    assert.equal(canEnterOtherness({ impactAvailable: false }), false);
    assert.equal(canEnterImpact({ comparisonAvailable: true, comparisonEntered: true }), false);
    const impactClosed = describeImpact(createImpactState(), READY);
    assert.equal(impactClosed.available, false);
    assert.equal(canEnterOtherness({ impactAvailable: impactClosed.available }), false);

    const beforeImpact = describeOtherness(openedOtherness(), {
      impactAvailable: false,
      displayedRecords: [qualifyingReference()],
    });
    assert.equal(beforeImpact.available, false);
    assert.equal(beforeImpact.activated, false);
    assert.equal(beforeImpact.question, null);
    assert.equal(beforeImpact.closedNote, OTHERNESS_CLOSED_NOTE);
    assert.equal(beforeImpact.stages.every((stage) => stage.availability === "pending"), true);

    const beforeOpen = describeOtherness(createOthernessState(), {
      impactAvailable: true,
      displayedRecords: [qualifyingReference()],
    });
    assert.equal(beforeOpen.available, false);
    assert.equal(beforeOpen.activated, false);
    assert.equal(beforeOpen.question, null);

    const water = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: impactDomains(),
    });
    assert.equal(water.available, true);
    assert.equal(water.stages.find((stage) => stage.id === "situation")?.availability, "recorded");
    assert.equal(water.stages.find((stage) => stage.id === "inquiry")?.availability, "recorded");
    assert.equal(
      water.stages.find((stage) => stage.id === "empirical-comparison")?.availability,
      "recorded",
    );
    assert.equal(water.stages.find((stage) => stage.id === "impact-dependency")?.availability, "recorded");
    assert.equal(water.stages.find((stage) => stage.id === "impact-dependency")?.label, "Impact and dependency pathways");
    assert.equal(
      water.stages.find((stage) => stage.id === "protect-four-otherness")?.availability,
      "current",
    );
    assert.equal(
      water.stages.find((stage) => stage.id === "protect-four-otherness")?.label,
      OTHERNESS_CHROME.title,
    );
    assert.equal(water.stages.find((stage) => stage.id === "user-choice")?.availability, "pending");
    assert.equal(water.stages.find((stage) => stage.id === "user-choice")?.label, "User choice");
  });

  it("does not activate from the current water card, emitted pathways, or non-consequence inputs", () => {
    const current = impactDomains();
    const water = current.find((domain) => domain.id === "water");
    assert.equal(water.emitted, true);
    assert.match(water.lines.join("\n"), /geography and indicator/);
    assert.equal(current.filter((domain) => domain.id !== "water").every((domain) => domain.emitted === false), true);
    assert.deepEqual(displayedConsequenceReferences(current), []);

    const waterView = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: current,
    });
    assert.equal(waterView.activated, false);
    assert.equal(waterView.question, null);
    assert.equal(waterView.followUpPrompt, null);
    assert.equal(waterView.unavailableNote, OTHERNESS_UNAVAILABLE_NOTE);
    assert.equal(waterView.unavailableNote.includes("false"), false);
    assert.equal(waterView.disclosure, null);
    assert.equal(publicLines(waterView).join("\n").includes(waterView.inspection.reasonCode), false);

    const emitted = impactDomains(EMIT_OVERRIDES);
    assert.equal(emitted.every((domain) => domain.emitted === true), true);
    assert.deepEqual(displayedConsequenceReferences(emitted), []);
    const emittedView = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: emitted,
    });
    assert.equal(emittedView.activated, false);
    assert.equal(emittedView.unavailableNote, OTHERNESS_UNAVAILABLE_NOTE);

    const mixed = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: [
        ...current,
        { label: "Buy a new phone", capabilityLine: "A quantified range is available" },
        { claim_id: "AP-OTH-001", claim_version: "1.1" },
        "Some effects of this choice extend beyond you",
        {
          case_id: "CASE-OTH-9",
          assertion_id: "ASSERT-9",
          displayed: true,
          independently_supported: true,
          support_status: SUPPORT_STATUS_SUPPORTED,
          extent: "beyond_immediate_circle",
        },
        { displayed: {}, independently_supported: 1, support_status: "supported", extent: true },
        { ...water, extent: "beyond_immediate_circle" },
      ],
      apOnlyClaims: ["AP-OTH-001@1.1", "AP-PLAN-001@1.1"],
      apAttributionAsEmpiricalSupport: true,
    });
    assert.equal(mixed.activated, false);
    assert.equal(mixed.question, null);
    assert.equal(mixed.unavailableNote, OTHERNESS_UNAVAILABLE_NOTE);

    const unavailable = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: current.map((domain) => ({ ...domain, emitted: false })),
    });
    assert.equal(unavailable.activated, false);

    const malformed = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: [
        qualifyingReference({
          displayed: "yes",
          independently_supported: "yes",
        }),
      ],
    });
    assert.equal(malformed.activated, false);
    assert.equal(malformed.unavailableNote, OTHERNESS_UNAVAILABLE_NOTE);

    for (const supportStatus of [SUPPORT_STATUS_UNKNOWN, SUPPORT_STATUS_MISSING, SUPPORT_STATUS_UNSUPPORTED]) {
      const denied = describeOtherness(openedOtherness(), {
        impactAvailable: true,
        displayedRecords: [qualifyingReference({ support_status: supportStatus })],
      });
      assert.equal(denied.activated, false);
      assert.equal(denied.question, null);
    }

    const notIndependent = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: [qualifyingReference({ independently_supported: false })],
    });
    assert.equal(notIndependent.activated, false);

    const hidden = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: [qualifyingReference({ displayed: false })],
    });
    assert.equal(hidden.activated, false);

    const prose = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: "effects extend beyond the immediate circle",
    });
    assert.equal(prose.activated, false);
    assert.equal(prose.unavailableNote, OTHERNESS_UNAVAILABLE_NOTE);
  });

  it("keeps an explicit immediate-circle reference from activating or standing in for a missing gate", () => {
    const view = describeOtherness(openedOtherness(), {
      impactAvailable: true,
      displayedRecords: [qualifyingReference({ extent: "immediate_circle_only" })],
    });
    assert.equal(view.activated, false);
    assert.equal(view.question, null);
    assert.equal(view.unavailableNote, OTHERNESS_IMMEDIATE_NOTE);
    assert.equal(view.unavailableNote.includes("false"), false);
    assert.equal(publicLines(view).join("\n").includes("immediate_circle_only"), false);
  });

  it("activates only from an explicit qualifying reference and preserves the gate payload", () => {
    const withCaseId = qualifyingReference({ case_id: "CASE-OTH-1" });
    const withoutCaseId = qualifyingReference();
    assert.equal(
      describeOtherness(openedOtherness(), {
        impactAvailable: true,
        displayedRecords: [withCaseId],
      }).activated,
      describeOtherness(openedOtherness(), {
        impactAvailable: true,
        displayedRecords: [withoutCaseId],
      }).activated,
    );

    const explicitCard = {
      id: "displayed-record",
      heading: "Displayed record",
      emitted: true,
      lines: ["Shown."],
      claimId: "displayed-record",
      claimVersion: "1",
      independently_supported: true,
      support_status: SUPPORT_STATUS_SUPPORTED,
      extent: "beyond_immediate_circle",
    };
    const translated = displayedConsequenceReferences([explicitCard]);
    assert.equal(translated.length, 1);
    assert.equal(translated[0].consequence_ref_id, "displayed-record@1");
    assert.equal(translated[0].displayed, true);
    assert.equal(translated[0].independently_supported, true);
    assert.equal(translated[0].support_status, SUPPORT_STATUS_SUPPORTED);
    assert.equal(translated[0].extent, "beyond_immediate_circle");

    const missingSupport = displayedConsequenceReferences([
      {
        id: "displayed-record",
        heading: "Displayed record",
        emitted: true,
        lines: ["Shown."],
        claimId: "displayed-record",
        claimVersion: "1",
        disclosure: { claimId: "displayed-record", sourceIds: ["S1"] },
        extent: "beyond_immediate_circle",
      },
    ]);
    assert.deepEqual(missingSupport, []);

    let state = openedOtherness();
    state = reduceOtherness(state, { type: "set_response", text: "  separate from it " });
    state = reduceOtherness(state, { type: "set_follow_up", text: "  because I wrote it " });
    const view = describeOtherness(state, {
      impactAvailable: true,
      displayedRecords: [...impactDomains(), qualifyingReference()],
    });
    assert.equal(view.activated, true);
    assert.equal(view.question, OTHERNESS_QUESTION_TEXT);
    assert.equal(view.followUpPrompt, OTHERNESS_OPTIONAL_FOLLOW_UP_TEXT);
    assert.equal(view.classificationLine, OTHERNESS_CLASSIFICATION);
    assert.equal(view.response, "  separate from it ");
    assert.equal(view.followUpResponse, "  because I wrote it ");
    assert.equal(view.responseHelper, OTHERNESS_RESPONSE_HELPER);
    assert.equal(view.boundary, OTHERNESS_BOUNDARY);
    assert.equal(view.inspection.qualifyingConsequenceRefs.length, 1);
    assert.equal(
      view.inspection.qualifyingConsequenceRefs[0].consequence_ref_id,
      "displayed-consequence-beyond-circle",
    );
    assert.deepEqual([...view.inspection.supportClaimRefs], [...POST_EVIDENCE_SOURCE_LENS_ALLOWLIST]);
    assert.deepEqual(
      view.inspection.historicalReflectionRecord.claim_pins.map((pin) => pin.claim_ref),
      [...POST_EVIDENCE_SOURCE_LENS_ALLOWLIST],
    );
    for (const pin of view.inspection.historicalReflectionRecord.claim_pins) {
      assert.equal(pin.corpus_version, CORPUS_VERSION);
      assert.equal(typeof pin.claim_id, "string");
      assert.equal(typeof pin.claim_version, "string");
    }
    assert.equal(view.inspection.publicPayload.support_text_internal, null);
    assert.equal(view.inspection.publicPayload.substantial_ap_framework_prose, null);
    assert.equal(view.inspection.finalUserChoiceOpen, true);
    assert.equal(view.inspection.compulsoryAntiPurchase, false);
    assert.equal(view.inspection.scoresMotiveOrDiagnosis, false);
    assert.equal(view.inspection.protectMyFourIsDirectAp, false);
    assert.equal(view.disclosure.corpusLine, `Corpus ${CORPUS_VERSION}.`);
    assert.deepEqual(
      view.disclosure.claims.map((claim) => claim.claimLine),
      POST_EVIDENCE_SOURCE_LENS_ALLOWLIST.map((ref) => {
        const [claimId, claimVersion] = ref.split("@");
        return `Claim ${claimId}, version ${claimVersion}.`;
      }),
    );
    assert.equal(view.disclosure.claims.every((claim) => claim.links.length > 0), true);
    assert.equal("score" in view, false);
    assert.equal("ranking" in view, false);
    assert.equal("diagnosis" in view, false);
    assert.equal("recommendation" in view, false);

    const visible = publicLines(view).join("\n");
    for (const line of publicLines(view)) {
      assert.equal(SNAKE_CASE_TOKEN.test(line), false);
    }
    for (const prohibited of PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS) {
      assert.equal(visible.includes(prohibited), false);
    }
    assert.equal(visible.includes("support_text_internal"), false);
  });

  it("preserves upstream facts on return and clears stale inquiry state after upstream edits", () => {
    let state = reduceOtherness(openedOtherness(), { type: "set_response", text: "kept raw" });
    state = reduceOtherness(state, { type: "set_follow_up", text: "kept follow-up" });
    assert.equal(othernessStateAfterReturnToImpact(state), state);
    assert.equal(othernessStateAfterImpactAction("open", state), state);
    assert.equal(othernessStateAfterSituationAction("select", state), state);
    assert.equal(othernessStateAfterSituationAction("submit", state), state);

    assert.deepEqual(othernessStateAfterSituationAction("edit", state), createOthernessState());
    assert.deepEqual(othernessStateAfterSituationAction("reset", state), createOthernessState());
    assert.deepEqual(othernessStateAfterInquiryAction("set_raw", state), createOthernessState());
    assert.deepEqual(othernessStateAfterInquiryAction("back", state), createOthernessState());
    assert.deepEqual(othernessStateAfterComparisonAction("set_horizon", state), createOthernessState());
    assert.deepEqual(othernessStateAfterComparisonAction("reset", state), createOthernessState());
    assert.deepEqual(othernessStateAfterImpactAction("clear", state), createOthernessState());

    const closedResponse = reduceOtherness(createOthernessState(), {
      type: "set_response",
      text: "not stored",
    });
    assert.equal(closedResponse.response, "");

    const situation = describeSituation(reduceSituation(createSituationState(), { type: "reset" }));
    assert.equal(situation.result, null);
    const inquiry = describeInquiry(createInquiryState());
    assert.equal(inquiry.stages.find((stage) => stage.id === "inquiry")?.availability, "current");
    const comparison = describeComparison(createComparisonState(), { inquiryReviewComplete: false });
    assert.equal(comparison.evaluated, false);
    const impact = describeImpact(createImpactState(), {});
    assert.equal(impact.available, false);
  });

  it("keeps the rendered flow free of internal tokens and leaves home and journey untouched", () => {
    const adapter = readApp("src/lib/smartphone/ap-otherness-ux.mjs");
    const component = readApp("src/components/smartphone-otherness.tsx");
    const situation = readApp("src/components/smartphone-situation.tsx");
    const impact = readApp("src/components/smartphone-impact.tsx");
    const route = readApp("src/routes/smartphone.tsx");
    const home = readApp("src/routes/index.tsx");
    const journey = readApp("src/routes/journey.tsx");

    assert.doesNotMatch(adapter, /id === ["']water["']/);
    assert.doesNotMatch(adapter, /local_consequences_depend_on_geography/);
    assert.equal(component.includes("reasonCode"), false);
    assert.equal(component.includes("inspection"), false);
    assert.equal(component.includes("case_id"), false);
    assert.equal(component.includes("support_text_internal"), false);
    assert.equal(component.includes("user-choice"), false);
    assert.match(component, /<details/);
    assert.match(component, /<summary/);
    assert.match(component, /htmlFor="otherness-response"/);
    assert.match(situation, /othernessStateAfterSituationAction/);
    assert.match(situation, /othernessStateAfterInquiryAction/);
    assert.match(situation, /othernessStateAfterComparisonAction/);
    assert.match(situation, /canEnterOtherness/);
    assert.match(situation, /function returnToImpact\(\) \{\s*setStep\("impact"\);\s*\}/);
    assert.match(impact, /view\.available \? \(/);
    assert.match(impact, /onContinueToOtherness \? \(/);
    assert.match(impact, /OTHERNESS_CHROME\.continueFromImpact/);
    assert.doesNotMatch(home, /smartphone-otherness|ap-otherness-ux/);
    assert.doesNotMatch(journey, /smartphone-otherness|ap-otherness-ux/);
    assert.match(route, /SmartphoneSituation/);
    for (const prohibited of PROHIBITED_PROTECT_MY_FOUR_DIRECT_AP_RENDERS) {
      assert.equal(component.includes(prohibited), false);
      assert.equal(adapter.includes(prohibited), false);
    }
  });
});
