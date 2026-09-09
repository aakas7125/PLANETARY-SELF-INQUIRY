import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  JOURNEY_ACCEPTED_NOW,
  JOURNEY_ARCHITECTURE_LAYERS,
  JOURNEY_GOVERNANCE_CHAIN,
  JOURNEY_MILESTONES,
  JOURNEY_NEXT_PLANNED,
  JOURNEY_PAGE_INTRO,
  JOURNEY_PAGE_TITLE,
  JOURNEY_RECONSTRUCTION_LABEL,
  JOURNEY_SEPARATION_NOTICE,
  getJourneyMilestoneIds,
  getJourneyMilestonesInOrder,
  type JourneyEvidenceClass,
  type JourneyStatus,
} from "./journey-record.ts";

const EXPECTED_IDS = [
  "before-code-protect-four",
  "idea-under-pressure",
  "experience-before-software",
  "smartphone-first-slice",
  "first-long-prototype",
  "workstreams-split",
  "grok-visual-milestone",
  "persuasive-vs-epistemic",
  "engineering-self-correction",
  "current-system-you-are-here",
] as const;

const ALLOWED_STATUSES = new Set<JourneyStatus>([
  "owner historical recollection",
  "reconstructed design discussion",
  "design record",
  "historical reference",
  "candidate",
  "accepted governance",
  "accepted correction",
  "current accepted architecture",
]);

const ALLOWED_EVIDENCE = new Set<JourneyEvidenceClass>([
  "OWNER HISTORICAL RECOLLECTION",
  "REPOSITORY-VERIFIED RECORD",
  "EMPIRICAL EVIDENCE",
  "AP SOURCE MATERIAL",
]);

describe("journey-record curated visual development history", () => {
  it("keeps ten narrative moments in the authorized visual order with stable ids", () => {
    const ordered = getJourneyMilestonesInOrder();
    assert.equal(ordered.length, 10);
    assert.deepEqual(
      ordered.map((m) => m.order),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    );
    assert.deepEqual(getJourneyMilestoneIds(), [...EXPECTED_IDS]);
    assert.deepEqual(
      JOURNEY_MILESTONES.map((m) => m.id),
      [...EXPECTED_IDS],
    );
  });

  it("labels moments with allowed status/evidence classes and progressive-disclosure sources", () => {
    for (const moment of getJourneyMilestonesInOrder()) {
      assert.ok(
        ALLOWED_STATUSES.has(moment.status),
        `${moment.id} has unexpected status ${moment.status}`,
      );
      assert.ok(
        ALLOWED_EVIDENCE.has(moment.evidenceClass),
        `${moment.id} has unexpected evidence class ${moment.evidenceClass}`,
      );
      assert.ok(moment.title.length > 0);
      assert.ok(moment.lead.length > 0);
      assert.ok(moment.summary.length > 40);
      assert.ok(moment.sources.length >= 1);
      for (const source of moment.sources) {
        assert.ok(source.label.length > 0);
        assert.ok(ALLOWED_EVIDENCE.has(source.evidenceClass));
        assert.ok(source.path.length > 0);
        const isIssueLink = /^https:\/\/github\.com\/aakas7125\/PLANETARY-SELF-INQUIRY\/issues\/\d+$/.test(
          source.path,
        );
        const isRepoPath =
          source.path.includes("/") || source.path.endsWith(".md");
        assert.ok(
          isIssueLink || isRepoPath,
          `${moment.id} source path looks invalid: ${source.path}`,
        );
        if (!isIssueLink) {
          assert.doesNotMatch(
            source.path,
            /^https?:\/\//,
            "Non-issue Journey sources must be repository paths",
          );
        }
      }
    }

    assert.equal(
      getJourneyMilestonesInOrder()[0]?.evidenceClass,
      "OWNER HISTORICAL RECOLLECTION",
    );
    assert.equal(
      getJourneyMilestonesInOrder()[5]?.status,
      "accepted governance",
    );
    assert.equal(
      getJourneyMilestonesInOrder()[8]?.status,
      "accepted correction",
    );
    assert.equal(
      getJourneyMilestonesInOrder()[9]?.status,
      "current accepted architecture",
    );
  });

  it("marks reconstructed visuals and keeps Antigravity out of the main public narrative ids", () => {
    const reconstructed = getJourneyMilestonesInOrder().filter(
      (m) => m.reconstructionLabel,
    );
    assert.ok(reconstructed.length >= 4);
    for (const moment of reconstructed) {
      assert.equal(moment.reconstructionLabel, JOURNEY_RECONSTRUCTION_LABEL);
    }

    const publicTitles = getJourneyMilestonesInOrder()
      .map((m) => `${m.id}\n${m.title}\n${m.lead}`)
      .join("\n");
    assert.doesNotMatch(publicTitles, /antigravity/i);

    const corrections = getJourneyMilestonesInOrder().find(
      (m) => m.id === "engineering-self-correction",
    );
    assert.ok(corrections);
    assert.ok(
      corrections.sources.some((s) => /ANTIGRAVITY/i.test(s.path)),
      "Antigravity may remain only in expandable technical provenance sources",
    );
    assert.match(corrections.summary, /Antigravity leaves the main public narrative/i);
  });

  it("carries the empirical-separation notice and does not invent environmental authority", () => {
    assert.equal(
      JOURNEY_SEPARATION_NOTICE,
      "This page documents how the project developed. It is not evidence for environmental claims.",
    );
    assert.match(JOURNEY_PAGE_TITLE, /assembled/i);
    assert.match(JOURNEY_PAGE_INTRO, /orient/i);

    const experience = getJourneyMilestonesInOrder().find(
      (m) => m.id === "experience-before-software",
    );
    assert.ok(experience?.flows?.some((f) => f.rejected));
    assert.ok(
      experience?.flows?.some((f) => /Rejected implication/i.test(f.title)),
    );

    const corpus = [
      JOURNEY_SEPARATION_NOTICE,
      JOURNEY_PAGE_TITLE,
      JOURNEY_PAGE_INTRO,
      JOURNEY_ACCEPTED_NOW,
      ...JOURNEY_MILESTONES.map((m) => `${m.title}\n${m.lead}\n${m.summary}`),
      ...JOURNEY_ARCHITECTURE_LAYERS,
      ...JOURNEY_GOVERNANCE_CHAIN,
      ...JOURNEY_NEXT_PLANNED,
    ].join("\n");

    assert.doesNotMatch(corpus, /\bCO2e?\b/i);
    assert.doesNotMatch(corpus, /\bkg\s*CO2/i);
    assert.doesNotMatch(corpus, /life-?cycle assessment/i);
    assert.doesNotMatch(corpus, /scientifically (proven|validated)/i);
    assert.doesNotMatch(corpus, /recommended (purchase|replacement)/i);
    assert.match(corpus, /not evidence for environmental claims/i);
    assert.match(corpus, /Secondary executable suite complete/i);
    assert.match(corpus, /AP inquiry and empirical claim-boundary executable suites remain outstanding/i);
    assert.match(corpus, /There was no code/i);
    assert.match(corpus, /protect the whole planet/i);
    assert.match(corpus, /Persuasive presentation/i);
  });

  it("states current architecture and planned next work without claiming future completion", () => {
    assert.deepEqual(
      [...JOURNEY_ARCHITECTURE_LAYERS],
      [
        "Immutable source packages",
        "Accepted contracts",
        "Deterministic evaluators and tests",
        "React / TanStack application",
      ],
    );
    assert.ok(JOURNEY_NEXT_PLANNED.includes("AP executable suite"));
    assert.ok(JOURNEY_NEXT_PLANNED.includes("Public-beta readiness"));

    const here = getJourneyMilestonesInOrder().find(
      (m) => m.id === "current-system-you-are-here",
    );
    assert.ok(here);
    assert.match(here.summary, /immutable source packages/i);
    assert.match(here.summary, /accepted contracts/i);
    assert.match(here.summary, /React\/TanStack/i);
    assert.match(here.lead, /YOU ARE HERE|Accepted layers/i);
    assert.doesNotMatch(here.summary, /AP inquiry .*complete/i);
    assert.doesNotMatch(here.summary, /public beta (is|are) complete/i);
    assert.doesNotMatch(
      JOURNEY_ACCEPTED_NOW,
      /empirical claim-boundary executable suites? (is|are) complete/i,
    );
  });
});
