/**
 * Curated development-history record for the Journey page.
 *
 * Authority: HQ Issue #76 / Vision Manager Issue #68.
 * This is orientation/transparency material only — not empirical evidence,
 * AP teaching, product certification, or a complete archive.
 */

export type JourneyStatus =
  | "design record"
  | "historical reference"
  | "candidate"
  | "accepted governance"
  | "accepted correction"
  | "current accepted architecture";

export type JourneySourceRef = {
  label: string;
  path: string;
};

export type JourneyMilestone = {
  id: string;
  order: number;
  title: string;
  summary: string;
  status: JourneyStatus;
  sources: JourneySourceRef[];
};

export const JOURNEY_SEPARATION_NOTICE =
  "This page documents how the project developed. It is not evidence for environmental claims.";

export const JOURNEY_PAGE_TITLE = "How Planetary Self-Inquiry developed";

export const JOURNEY_PAGE_INTRO =
  "A compact, repository-backed development history — from pre-code framing through prototypes, governance, epistemic corrections, and the present layered architecture. It orients readers; it does not certify products or validate environmental conclusions.";

export const JOURNEY_MILESTONES: readonly JourneyMilestone[] = [
  {
    id: "discussion-before-code",
    order: 1,
    title: "Discussion before code",
    summary:
      "Owner-led framing began with the still-working-smartphone question and a design journey inventory before implementation. Repository records treat this as design formation and a pending design-source check — not as a scientific finding or recovered flowchart transcript.",
    status: "design record",
    sources: [
      {
        label: "Research handoff scope (still-working smartphone)",
        path: "provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md",
      },
      {
        label: "User journey inventory (pending V17 design-source verification)",
        path: "design/USER_JOURNEY_V0.md",
      },
    ],
  },
  {
    id: "early-prototypes-and-candidates",
    order: 2,
    title: "Early prototypes and candidates",
    summary:
      "V17 is recorded as the owner-accepted, owner-only frozen smartphone reference baseline, while this checkout has not independently verified exact V17 source identity. The Antigravity repository was audited as candidate material only (not an accepted V17 baseline). A separate Grok/substitute application candidate was assessed and not imported while tests failed.",
    status: "historical reference",
    sources: [
      {
        label: "Accepted baseline and V17 verification caveats",
        path: "PROJECT_STATE.md",
      },
      {
        label: "Decisions D-001 / D-003 (V17 reference; candidates stay candidates)",
        path: "project-state/DECISIONS.md",
      },
      {
        label: "Antigravity integration audit",
        path: "project-state/ANTIGRAVITY_INTEGRATION_AUDIT.md",
      },
      {
        label: "Antigravity candidate identity",
        path: "provenance/ANTIGRAVITY_CANDIDATE.md",
      },
      {
        label: "Governed application receiving state (Issue #17)",
        path: "handoffs/GOVERNED_APPLICATION_BASELINE_RECEIVING_STATE_2026-09-06.md",
      },
    ],
  },
  {
    id: "workstreams-and-governance",
    order: 3,
    title: "Workstreams and governance",
    summary:
      "Accepted governance separates Research & Evidence, AP Framework & Corpus, Project HQ, and coding executors. Science, AP material, and Project Interpretation remain distinct. GitHub Issues coordinate bounded work; HQ independently accepts and merges; executors do not self-merge.",
    status: "accepted governance",
    sources: [
      {
        label: "Project constitution (category separation)",
        path: "PROJECT_CONSTITUTION.md",
      },
      {
        label: "Universal Issue control plane",
        path: "project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md",
      },
      {
        label: "Local Codex / Cursor publication protocol",
        path: "project-state/LOCAL_CODEX_TASK_PUBLICATION_PROTOCOL.md",
      },
      {
        label: "Owner control (HQ merge authority)",
        path: "OWNER_CONTROL.md",
      },
    ],
  },
  {
    id: "epistemic-corrections",
    order: 4,
    title: "Epistemic corrections",
    summary:
      "Process corrections recorded in the repository include: recover originals rather than reconstructing from summaries; preserve provenance qualifications where byte identity is unresolved; refuse unvalidated application import; investigate failing fixtures and environment limits before bounded import; remove case-ID-dependent production behavior; and keep unknown values from becoming zero. These are engineering and governance lessons, not moral triumphs or scientific claims.",
    status: "accepted correction",
    sources: [
      {
        label: "Recovery manifest (no summary reconstruction)",
        path: "provenance/source-packages/RECOVERY_MANIFEST_2026-09-05.md",
      },
      {
        label: "Research library recovery handoff",
        path: "handoffs/RESEARCH_LIBRARY_RECOVERY_2026-09-05.md",
      },
      {
        label: "Refuse unvalidated import (Issue #17 receiving state)",
        path: "handoffs/GOVERNED_APPLICATION_BASELINE_RECEIVING_STATE_2026-09-06.md",
      },
      {
        label: "Grok OG fixture recovery",
        path: "handoffs/GROK_OG_FIXTURE_RECOVERY_2026-09-07.md",
      },
      {
        label: "Unknown must not become zero (constitution)",
        path: "PROJECT_CONSTITUTION.md",
      },
      {
        label: "Empirical contract unknown boundary",
        path: "contracts/EMPIRICAL_SMARTPHONE_V0.md",
      },
    ],
  },
  {
    id: "current-architecture",
    order: 5,
    title: "Current architecture",
    summary:
      "The present layered shape is: immutable source packages → accepted contracts → deterministic evaluators and tests → React/TanStack application. GitHub Issues coordinate bounded work; HQ independently accepts and merges. The secondary executable suite (SEC-01–SEC-12, case assertions, and A-SEC-GLOBAL-01–08) is complete. AP inquiry and empirical claim-boundary executable suites remain outstanding.",
    status: "current accepted architecture",
    sources: [
      {
        label: "Immutable source-package rules",
        path: "provenance/source-packages/README.md",
      },
      {
        label: "Executable test mapping (suite status)",
        path: "contracts/EXECUTABLE_TEST_MAPPING_V0.md",
      },
      {
        label: "Universal Issue control plane",
        path: "project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md",
      },
    ],
  },
] as const;

export const JOURNEY_ARCHITECTURE_LAYERS = [
  "Immutable source packages",
  "Accepted contracts",
  "Deterministic evaluators and tests",
  "React / TanStack application",
] as const;

export function getJourneyMilestonesInOrder(): JourneyMilestone[] {
  return [...JOURNEY_MILESTONES].sort((a, b) => a.order - b.order);
}

export function getJourneyMilestoneIds(): string[] {
  return getJourneyMilestonesInOrder().map((m) => m.id);
}
