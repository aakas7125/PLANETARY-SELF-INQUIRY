import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  JOURNEY_ARCHITECTURE_LAYERS,
  JOURNEY_MILESTONES,
  JOURNEY_PAGE_INTRO,
  JOURNEY_PAGE_TITLE,
  JOURNEY_SEPARATION_NOTICE,
  getJourneyMilestoneIds,
  getJourneyMilestonesInOrder,
  type JourneyStatus,
} from "./journey-record.ts";

const EXPECTED_IDS = [
  "discussion-before-code",
  "early-prototypes-and-candidates",
  "workstreams-and-governance",
  "epistemic-corrections",
  "current-architecture",
] as const;

const ALLOWED_STATUSES = new Set<JourneyStatus>([
  "design record",
  "historical reference",
  "candidate",
  "accepted governance",
  "accepted correction",
  "current accepted architecture",
]);

describe("journey-record curated development history", () => {
  it("keeps five milestones in the authorized order with stable ids", () => {
    const ordered = getJourneyMilestonesInOrder();
    assert.equal(ordered.length, 5);
    assert.deepEqual(
      ordered.map((m) => m.order),
      [1, 2, 3, 4, 5],
    );
    assert.deepEqual(getJourneyMilestoneIds(), [...EXPECTED_IDS]);
    assert.deepEqual(
      JOURNEY_MILESTONES.map((m) => m.id),
      [...EXPECTED_IDS],
    );
  });

  it("labels every milestone with an allowed provenance status and repository sources", () => {
    for (const milestone of getJourneyMilestonesInOrder()) {
      assert.ok(
        ALLOWED_STATUSES.has(milestone.status),
        `${milestone.id} has unexpected status ${milestone.status}`,
      );
      assert.ok(milestone.title.length > 0);
      assert.ok(milestone.summary.length > 40);
      assert.ok(milestone.sources.length >= 1);
      for (const source of milestone.sources) {
        assert.ok(source.label.length > 0);
        assert.ok(
          source.path.includes("/") || source.path.endsWith(".md"),
          `${milestone.id} source path looks invalid: ${source.path}`,
        );
        assert.doesNotMatch(
          source.path,
          /^https?:\/\//,
          "Journey sources must be repository paths, not external URLs",
        );
      }
    }

    assert.equal(
      getJourneyMilestonesInOrder()[0]?.status,
      "design record",
    );
    assert.equal(
      getJourneyMilestonesInOrder()[1]?.status,
      "historical reference",
    );
    assert.equal(
      getJourneyMilestonesInOrder()[2]?.status,
      "accepted governance",
    );
    assert.equal(
      getJourneyMilestonesInOrder()[3]?.status,
      "accepted correction",
    );
    assert.equal(
      getJourneyMilestonesInOrder()[4]?.status,
      "current accepted architecture",
    );
  });

  it("carries the empirical-separation notice and does not claim environmental results", () => {
    assert.equal(
      JOURNEY_SEPARATION_NOTICE,
      "This page documents how the project developed. It is not evidence for environmental claims.",
    );
    assert.match(JOURNEY_PAGE_TITLE, /developed/i);
    assert.match(JOURNEY_PAGE_INTRO, /orient/i);

    const corpus = [
      JOURNEY_SEPARATION_NOTICE,
      JOURNEY_PAGE_TITLE,
      JOURNEY_PAGE_INTRO,
      ...JOURNEY_MILESTONES.map((m) => `${m.title}\n${m.summary}`),
      ...JOURNEY_ARCHITECTURE_LAYERS,
    ].join("\n");

    assert.doesNotMatch(corpus, /\bCO2e?\b/i);
    assert.doesNotMatch(corpus, /\bkg\s*CO2/i);
    assert.doesNotMatch(corpus, /life-?cycle assessment/i);
    assert.doesNotMatch(corpus, /scientifically (proven|validated)/i);
    assert.doesNotMatch(corpus, /recommended (purchase|replacement)/i);
    assert.match(corpus, /not evidence for environmental claims/i);
    assert.match(corpus, /secondary executable suite \(SEC-01–SEC-12/i);
    assert.match(corpus, /AP inquiry and empirical claim-boundary executable suites remain outstanding/i);
  });

  it("states current architecture layers without inventing suite completion beyond the mapping", () => {
    assert.deepEqual(
      [...JOURNEY_ARCHITECTURE_LAYERS],
      [
        "Immutable source packages",
        "Accepted contracts",
        "Deterministic evaluators and tests",
        "React / TanStack application",
      ],
    );

    const architecture = getJourneyMilestonesInOrder().find(
      (m) => m.id === "current-architecture",
    );
    assert.ok(architecture);
    assert.match(architecture.summary, /immutable source packages/i);
    assert.match(architecture.summary, /accepted contracts/i);
    assert.match(architecture.summary, /React\/TanStack/i);
    assert.doesNotMatch(
      architecture.summary,
      /AP inquiry .*complete/i,
    );
    assert.doesNotMatch(
      architecture.summary,
      /empirical .*suite is complete/i,
    );
  });
});
