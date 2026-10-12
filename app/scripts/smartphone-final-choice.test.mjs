import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { PROVISIONAL_CHOICE_LABELS } from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import { COMPARISON_PATHWAYS } from "../src/lib/smartphone/comparison-ux.mjs";
import { createComparisonState, describeComparison } from "../src/lib/smartphone/comparison-ux.mjs";
import { createInquiryState, describeInquiry } from "../src/lib/smartphone/ap-inquiry-ux.mjs";
import { createImpactState, describeImpact } from "../src/lib/smartphone/impact-pathways-ux.mjs";
import { createOthernessState, describeOtherness } from "../src/lib/smartphone/ap-otherness-ux.mjs";
import { createSituationState, describeSituation } from "../src/lib/smartphone/situation-ux.mjs";
import {
  FINAL_CHOICE_ADEQUACY_NOTE,
  FINAL_CHOICE_BOUNDARY,
  FINAL_CHOICE_CHROME,
  FINAL_CHOICE_CLOSED_NOTE,
  FINAL_CHOICE_COMPLETION,
  FINAL_CHOICE_OPTIONS,
  FINAL_CHOICE_ORDER_NOTE,
  FINAL_CHOICE_ORDINARY_NOTE,
  FINAL_CHOICE_OTHERNESS_NOT_ESTABLISHED,
  FINAL_CHOICE_OTHERNESS_SHOWN,
  FINAL_CHOICE_PROVISIONAL_ABSENT,
  FINAL_CHOICE_PROVISIONAL_NOTE,
  canEnterFinalChoice,
  createFinalChoiceState,
  describeFinalChoice,
  finalChoiceStateAfterComparisonAction,
  finalChoiceStateAfterImpactAction,
  finalChoiceStateAfterInquiryAction,
  finalChoiceStateAfterOthernessAction,
  finalChoiceStateAfterReturnToOtherness,
  finalChoiceStateAfterSituationAction,
  reduceFinalChoice,
} from "../src/lib/smartphone/final-choice-ux.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");
const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

const OPTION_IDS = [
  "keep",
  "repair",
  "used_secondhand",
  "refurbished",
  "new",
  "investigate_further",
  "unclear",
];

const PROHIBITED_KEYS = [
  "motive",
  "inconsistency",
  "improvement",
  "failure",
  "moral",
  "score",
  "rank",
  "ranking",
  "recommendation",
  "winner",
  "diagnosis",
  "emphasized",
  "preselected",
];

function opened() {
  return reduceFinalChoice(createFinalChoiceState(), { type: "open" });
}

function entered(overrides = {}) {
  return {
    othernessEntered: true,
    othernessActivated: false,
    provisionalChoice: null,
    inspectedPathways: COMPARISON_PATHWAYS.map((pathway) => ({
      id: pathway.id,
      label: pathway.label,
      selected: false,
    })),
    ...overrides,
  };
}

function publicLines(view) {
  return [
    view.opening,
    view.closedNote,
    view.orderNote,
    view.ordinaryNote,
    view.boundary,
    view.adequacyNote,
    view.completion,
    view.changeNote,
    ...view.stages.flatMap((stage) => [stage.label, stage.note]),
    ...(view.provisional
      ? [view.provisional.heading, view.provisional.label, view.provisional.absentNote, view.provisional.note]
      : []),
    ...(view.inspected
      ? [
          view.inspected.heading,
          ...view.inspected.labels,
          view.inspected.absentNote,
          view.inspected.unknownNote,
          view.inspected.note,
        ]
      : []),
    ...(view.otherness
      ? [view.otherness.heading, view.otherness.note, view.otherness.responseHeading, view.otherness.followUpHeading]
      : []),
    ...view.options.map((option) => option.label),
    ...Object.values(FINAL_CHOICE_CHROME),
  ].filter((line) => typeof line === "string");
}

function keysOf(value, found = []) {
  if (Array.isArray(value)) {
    for (const item of value) keysOf(item, found);
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      found.push(key);
      keysOf(child, found);
    }
  }
  return found;
}

describe("neutral smartphone final user choice", () => {
  it("stays closed until the otherness stage has been entered, then opens for either gate result", () => {
    assert.equal(canEnterFinalChoice({}), false);
    assert.equal(canEnterFinalChoice({ othernessEntered: false }), false);
    assert.equal(canEnterFinalChoice({ othernessEntered: false, othernessActivated: true }), false);
    assert.equal(canEnterFinalChoice({ othernessEntered: true, othernessActivated: false }), true);
    assert.equal(canEnterFinalChoice({ othernessEntered: true, othernessActivated: true }), true);

    const closed = describeFinalChoice(opened(), entered({ othernessEntered: false, othernessActivated: true }));
    assert.equal(closed.available, false);
    assert.equal(closed.closedNote, FINAL_CHOICE_CLOSED_NOTE);
    assert.equal(closed.options.length, 0);
    assert.equal(closed.selection, null);
    assert.equal(closed.stages.every((stage) => stage.availability === "pending"), true);

    for (const activated of [false, true]) {
      const view = describeFinalChoice(opened(), entered({ othernessActivated: activated }));
      assert.equal(view.available, true);
      assert.equal(view.closedNote, null);
      assert.equal(view.stages.find((stage) => stage.id === "situation")?.availability, "recorded");
      assert.equal(view.stages.find((stage) => stage.id === "inquiry")?.availability, "recorded");
      assert.equal(view.stages.find((stage) => stage.id === "empirical-comparison")?.availability, "recorded");
      assert.equal(view.stages.find((stage) => stage.id === "impact-dependency")?.availability, "recorded");
      assert.equal(
        view.stages.find((stage) => stage.id === "protect-four-otherness")?.availability,
        "recorded",
      );
      assert.equal(view.stages.find((stage) => stage.id === "user-choice")?.availability, "current");
      assert.equal(view.stages.find((stage) => stage.id === "user-choice")?.label, "User choice");
      assert.equal(view.options.length, 7);
    }
  });

  it("shows the seven ordinary options once, unselected, with used and refurbished kept apart", () => {
    const view = describeFinalChoice(opened(), entered());
    assert.deepEqual(
      view.options.map((option) => option.id),
      OPTION_IDS,
    );
    assert.deepEqual(
      view.options.map((option) => option.label),
      [
        COMPARISON_PATHWAYS[0].label,
        COMPARISON_PATHWAYS[1].label,
        COMPARISON_PATHWAYS[2].label,
        COMPARISON_PATHWAYS[3].label,
        COMPARISON_PATHWAYS[4].label,
        PROVISIONAL_CHOICE_LABELS.investigate_further,
        PROVISIONAL_CHOICE_LABELS.unclear,
      ],
    );
    assert.equal(view.options[2].label === view.options[3].label, false);
    assert.equal(view.options.every((option) => option.selected === false), true);
    assert.equal(view.selection, null);
    assert.equal(view.orderNote, FINAL_CHOICE_ORDER_NOTE);
    assert.match(view.orderNote, /not a ranking/);
    assert.equal(view.ordinaryNote, FINAL_CHOICE_ORDINARY_NOTE);
    assert.equal(FINAL_CHOICE_OPTIONS.length, 7);
  });

  it("keeps the provisional Q6 choice visible and out of the final selection", () => {
    const provisionalIds = [
      "keep_current",
      "repair_current",
      "consider_used_or_refurbished",
      "buy_new",
      "investigate_further",
      "unclear",
    ];
    for (const provisionalChoice of provisionalIds) {
      const view = describeFinalChoice(opened(), entered({ provisionalChoice }));
      assert.equal(view.provisional.label, PROVISIONAL_CHOICE_LABELS[provisionalChoice]);
      assert.equal(view.provisional.absentNote, null);
      assert.equal(view.provisional.note, FINAL_CHOICE_PROVISIONAL_NOTE);
      assert.equal(view.selection, null);
      assert.equal(view.options.every((option) => option.selected === false), true);
    }

    const used = describeFinalChoice(
      opened(),
      entered({ provisionalChoice: "consider_used_or_refurbished" }),
    );
    assert.equal(used.options.find((option) => option.id === "used_secondhand").selected, false);
    assert.equal(used.options.find((option) => option.id === "refurbished").selected, false);
    assert.match(used.provisional.label, /used or refurbished/);

    const absent = describeFinalChoice(opened(), entered({ provisionalChoice: null }));
    assert.equal(absent.provisional.label, null);
    assert.equal(absent.provisional.absentNote, FINAL_CHOICE_PROVISIONAL_ABSENT);

    const rejected = reduceFinalChoice(opened(), {
      type: "set_choice",
      value: "consider_used_or_refurbished",
    });
    assert.equal(rejected.selection, null);
    assert.equal(reduceFinalChoice(opened(), { type: "set_choice", value: "buy_new" }).selection, null);
    assert.equal(reduceFinalChoice(opened(), { type: "set_choice", value: "keep_current" }).selection, null);
  });

  it("treats inspected pathways as review context and does not select or rank from them", () => {
    const inspected = describeFinalChoice(
      opened(),
      entered({
        inspectedPathways: COMPARISON_PATHWAYS.map((pathway) => ({
          id: pathway.id,
          label: pathway.label,
          selected: pathway.id === "new" || pathway.id === "used_secondhand",
        })),
      }),
    );
    assert.deepEqual(inspected.inspected.labels, [
      COMPARISON_PATHWAYS.find((pathway) => pathway.id === "used_secondhand").label,
      COMPARISON_PATHWAYS.find((pathway) => pathway.id === "new").label,
    ]);
    assert.match(inspected.inspected.note, /does not select or rank/);
    assert.equal(inspected.options.every((option) => option.selected === false), true);

    const none = describeFinalChoice(opened(), entered());
    assert.deepEqual(none.inspected.labels, []);
    assert.match(none.inspected.absentNote, /No comparison pathway was inspected/);

    const unknown = describeFinalChoice(opened(), entered({ inspectedPathways: undefined }));
    assert.equal(unknown.inspected.status, "unknown");
    assert.deepEqual(unknown.inspected.labels, []);
    assert.match(unknown.inspected.unknownNote, /not available/);
    assert.equal(unknown.inspected.absentNote, null);
  });

  it("records new, investigate further, and unclear exactly, without a verdict", () => {
    let state = opened();
    for (const value of ["new", "investigate_further", "unclear", "keep", "repair", "used_secondhand", "refurbished"]) {
      state = reduceFinalChoice(state, { type: "set_choice", value });
      const view = describeFinalChoice(state, entered({ provisionalChoice: "buy_new" }));
      assert.equal(view.selection, value);
      assert.deepEqual(
        view.options.filter((option) => option.selected).map((option) => option.id),
        [value],
      );
      assert.equal(view.completion, FINAL_CHOICE_COMPLETION);
      assert.match(view.completion, /your present choice/);
      assert.match(view.completion, /not a recommendation/);
      assert.equal(view.boundary, FINAL_CHOICE_BOUNDARY);
      assert.equal(view.adequacyNote, FINAL_CHOICE_ADEQUACY_NOTE);
      assert.equal(Object.keys(state).sort().join(","), "opened,selection");
      for (const key of keysOf(view)) {
        assert.equal(PROHIBITED_KEYS.includes(key), false, key);
      }
    }

    const beforeOpen = reduceFinalChoice(createFinalChoiceState(), { type: "set_choice", value: "new" });
    assert.equal(beforeOpen.selection, null);
    const cleared = reduceFinalChoice(state, { type: "reset" });
    assert.equal(cleared.opened, true);
    assert.equal(cleared.selection, null);
    assert.equal(describeFinalChoice(cleared, entered()).completion, null);
  });

  it("describes a non-activated otherness gate without blocking choice or turning the gap into absence", () => {
    const hidden = describeFinalChoice(
      opened(),
      entered({
        othernessActivated: false,
        othernessResponse: "  kept raw  ",
        othernessFollowUp: "  kept follow-up  ",
      }),
    );
    assert.equal(hidden.available, true);
    assert.equal(hidden.options.length, 7);
    assert.equal(hidden.otherness.note, FINAL_CHOICE_OTHERNESS_NOT_ESTABLISHED);
    assert.equal(hidden.otherness.note.includes("false"), false);
    assert.equal(hidden.otherness.note.includes("zero"), false);
    assert.match(hidden.otherness.note, /not a finding that effects are absent/);
    assert.match(hidden.otherness.note, /not a finding that they stay with you/);
    assert.equal(hidden.otherness.response, null);
    assert.equal(hidden.otherness.followUp, null);

    const unknown = describeFinalChoice(opened(), entered({ othernessActivated: undefined }));
    assert.match(unknown.otherness.note, /not available/);
    assert.equal(unknown.otherness.response, null);
  });

  it("shows the raw otherness response only after the accepted gate activated and the user entered it", () => {
    const exact = describeFinalChoice(
      opened(),
      entered({
        othernessActivated: true,
        othernessResponse: "  separate from it ",
        othernessFollowUp: "  because I wrote it ",
      }),
    );
    assert.equal(exact.otherness.note, FINAL_CHOICE_OTHERNESS_SHOWN);
    assert.equal(exact.otherness.response, "  separate from it ");
    assert.equal(exact.otherness.followUp, "  because I wrote it ");

    const blank = describeFinalChoice(
      opened(),
      entered({ othernessActivated: true, othernessResponse: "", othernessFollowUp: "" }),
    );
    assert.equal(blank.otherness.response, null);
    assert.equal(blank.otherness.followUp, null);

    const lines = publicLines(exact).join("\n");
    assert.equal(SNAKE_CASE_TOKEN.test(lines), false);
    assert.equal(lines.includes("false"), false);
    assert.equal(lines.includes("Deep down"), false);
    assert.equal(lines.includes("you should"), false);
  });

  it("preserves a choice when going back and clears it after upstream edits", () => {
    let state = reduceFinalChoice(opened(), { type: "set_choice", value: "unclear" });
    assert.equal(finalChoiceStateAfterReturnToOtherness(state), state);
    assert.equal(finalChoiceStateAfterOthernessAction("open", state), state);
    assert.equal(finalChoiceStateAfterSituationAction("select", state), state);
    assert.equal(finalChoiceStateAfterSituationAction("submit", state), state);
    assert.equal(finalChoiceStateAfterInquiryAction("continue", state), state);
    assert.equal(finalChoiceStateAfterImpactAction("open", state), state);

    assert.deepEqual(finalChoiceStateAfterSituationAction("edit", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterSituationAction("reset", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterInquiryAction("set_choice", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterInquiryAction("set_raw", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterInquiryAction("back", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterComparisonAction("toggle", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterComparisonAction("reset", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterImpactAction("clear", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterOthernessAction("set_response", state), createFinalChoiceState());
    assert.deepEqual(finalChoiceStateAfterOthernessAction("set_follow_up", state), createFinalChoiceState());
    const alreadyClear = createFinalChoiceState();
    assert.equal(finalChoiceStateAfterOthernessAction("set_response", alreadyClear), alreadyClear);

    const situation = describeSituation(createSituationState());
    assert.equal(situation.result, null);
    const inquiry = describeInquiry(createInquiryState());
    assert.equal(inquiry.stages.find((stage) => stage.id === "inquiry")?.availability, "current");
    const comparison = describeComparison(createComparisonState(), { inquiryReviewComplete: false });
    assert.equal(comparison.available, false);
    const impact = describeImpact(createImpactState(), {});
    assert.equal(impact.available, false);
    const otherness = describeOtherness(createOthernessState(), { impactAvailable: false });
    assert.equal(otherness.available, false);
  });

  it("keeps the rendered flow free of internal tokens and leaves home and journey untouched", () => {
    const adapter = readApp("src/lib/smartphone/final-choice-ux.mjs");
    const component = readApp("src/components/smartphone-final-choice.tsx");
    const otherness = readApp("src/components/smartphone-otherness.tsx");
    const situation = readApp("src/components/smartphone-situation.tsx");
    const route = readApp("src/routes/smartphone.tsx");
    const home = readApp("src/routes/index.tsx");
    const journey = readApp("src/routes/journey.tsx");

    assert.match(component, /<fieldset/);
    assert.match(component, /<legend/);
    assert.match(component, /type="radio"/);
    assert.match(component, /has-\[:focus-visible\]:ring-2/);
    assert.match(component, /aria-label="Smartphone inquiry stages"/);
    assert.match(component, /aria-current/);
    assert.match(component, /aria-live="polite"/);
    assert.equal(component.includes("http"), false);
    assert.equal(component.includes("fetch("), false);
    assert.equal(component.includes("localStorage"), false);
    assert.equal(component.includes("analytics"), false);
    assert.doesNotMatch(component, /option\.id ===|buy_new|consider_used_or_refurbished|keep_current/);
    assert.equal(otherness.includes("user-choice"), false);
    assert.match(otherness, /FINAL_CHOICE_CHROME\.continueFromOtherness/);
    assert.match(situation, /canEnterFinalChoice/);
    assert.match(situation, /finalChoiceStateAfterSituationAction/);
    assert.match(situation, /finalChoiceStateAfterInquiryAction/);
    assert.match(situation, /finalChoiceStateAfterComparisonAction/);
    assert.match(situation, /finalChoiceStateAfterOthernessAction/);
    assert.match(situation, /onBackToOtherness=\{\(\) => setStep\("otherness"\)\}/);
    assert.match(situation, /function returnToImpact\(\) \{\s*setStep\("impact"\);\s*\}/);
    assert.match(route, /final choice that belongs to you/);
    assert.doesNotMatch(home, /final-choice-ux|smartphone-final-choice/);
    assert.doesNotMatch(journey, /final-choice-ux|smartphone-final-choice/);
    assert.equal(SNAKE_CASE_TOKEN.test(publicLines(describeFinalChoice(opened(), entered())).join("\n")), false);
    assert.equal(adapter.includes("case_id"), false);
  });
});
