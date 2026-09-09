/**
 * Curated Journey development-history record.
 *
 * Authority: HQ Issue #76 (correction OWNER-VISUAL-REVIEW-1) / Vision Manager #68.
 * Orientation/transparency only — not empirical evidence, AP teaching,
 * product certification, or a complete archive.
 */

export type JourneyStatus =
  | "owner historical recollection"
  | "reconstructed design discussion"
  | "design record"
  | "historical reference"
  | "candidate"
  | "accepted governance"
  | "accepted correction"
  | "current accepted architecture";

/** Public classification labels required by Issue #76. */
export type JourneyEvidenceClass =
  | "OWNER HISTORICAL RECOLLECTION"
  | "REPOSITORY-VERIFIED RECORD"
  | "EMPIRICAL EVIDENCE"
  | "AP SOURCE MATERIAL";

export type JourneySourceRef = {
  label: string;
  path: string;
  evidenceClass: JourneyEvidenceClass;
};

export type JourneyVisualKind =
  | "open-space"
  | "pressure-transform"
  | "experience-flows"
  | "concrete-slice"
  | "long-phone"
  | "authority-lanes"
  | "grok-panel"
  | "authority-split"
  | "secondary-corrections"
  | "you-are-here";

export type JourneyFlowNode = {
  id: string;
  label: string;
};

export type JourneyFlow = {
  id: string;
  title: string;
  nodes: JourneyFlowNode[];
  rejected?: boolean;
  note?: string;
};

export type JourneyLane = {
  id: string;
  label: string;
  kind: "empirical" | "model" | "ap" | "interpretation" | "governance" | "executor";
};

export type JourneyMoment = {
  id: string;
  order: number;
  title: string;
  /** Short scannable lead — the visual beat, not a paragraph dump. */
  lead: string;
  summary: string;
  status: JourneyStatus;
  evidenceClass: JourneyEvidenceClass;
  visualKind: JourneyVisualKind;
  /** Required on reconstructed diagrams / prototype frames. */
  reconstructionLabel?: string;
  flows?: JourneyFlow[];
  lanes?: JourneyLane[];
  layers?: readonly string[];
  governanceChain?: readonly string[];
  nextPlanned?: readonly string[];
  correctionItems?: readonly string[];
  sources: JourneySourceRef[];
};

export const JOURNEY_SEPARATION_NOTICE =
  "This page documents how the project developed. It is not evidence for environmental claims.";

export const JOURNEY_PAGE_TITLE = "How Planetary Self-Inquiry assembled itself";

export const JOURNEY_PAGE_INTRO =
  "A compact visual development history — how an early Protect Four intuition met scientific defensibility, how experience architecture preceded software, and how authority lanes and corrections shaped the present system. It orients readers; it does not certify products or validate environmental conclusions.";

export const JOURNEY_RECONSTRUCTION_LABEL =
  "Reconstructed from early design discussions";

export const JOURNEY_ARCHITECTURE_LAYERS = [
  "Immutable source packages",
  "Accepted contracts",
  "Deterministic evaluators and tests",
  "React / TanStack application",
] as const;

export const JOURNEY_GOVERNANCE_CHAIN = [
  "GitHub Issues",
  "HQ",
  "Bounded executor",
  "PR",
  "Independent review / acceptance",
] as const;

export const JOURNEY_NEXT_PLANNED = [
  "AP executable suite",
  "Empirical-boundary suite",
  "Canonical smartphone UX",
  "Reusable activity / evidence schema",
  "Broader V0 activities",
  "Public-beta readiness",
] as const;

export const JOURNEY_ACCEPTED_NOW =
  "Secondary executable suite complete (SEC-01–SEC-12, case assertions, A-SEC-GLOBAL-01–08). AP inquiry and empirical claim-boundary executable suites remain outstanding (requires_smartphone_implementation).";

const ISSUE_76: JourneySourceRef = {
  label: "Owner historical design record (Issue #76)",
  path: "https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/76",
  evidenceClass: "OWNER HISTORICAL RECOLLECTION",
};

export const JOURNEY_MILESTONES: readonly JourneyMoment[] = [
  {
    id: "before-code-protect-four",
    order: 1,
    title: "Before code",
    lead: "There was no code.",
    summary:
      "Owner-provided early design formulation: “If you want to protect just four people, you have to protect the whole planet.” This is a design recollection, not a proven scientific conclusion and not a recovered original flowchart.",
    status: "owner historical recollection",
    evidenceClass: "OWNER HISTORICAL RECOLLECTION",
    visualKind: "open-space",
    reconstructionLabel: JOURNEY_RECONSTRUCTION_LABEL,
    sources: [
      ISSUE_76,
      {
        label: "User journey inventory (pending V17 design-source verification)",
        path: "design/USER_JOURNEY_V0.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
    ],
  },
  {
    id: "idea-under-pressure",
    order: 2,
    title: "Idea under pressure",
    lead: "Can that actually be scientifically defended?",
    summary:
      "A compelling idea met a scientific boundary. Empirical inquiry can investigate dependencies, environmental pathways, ecological and human-system dependencies, risks, and uncertainty — it cannot simply establish the stronger philosophical conclusion. PSI must not bend evidence to preserve an attractive conclusion. The surviving project-development inquiry was approximately: “Can the people I call ‘mine’ actually be protected independently of the ecological and human systems I call ‘other’?” This is a development correction, not a scientific result.",
    status: "owner historical recollection",
    evidenceClass: "OWNER HISTORICAL RECOLLECTION",
    visualKind: "pressure-transform",
    reconstructionLabel: JOURNEY_RECONSTRUCTION_LABEL,
    sources: [
      ISSUE_76,
      {
        label: "Project constitution (category separation)",
        path: "PROJECT_CONSTITUTION.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
    ],
  },
  {
    id: "experience-before-software",
    order: 3,
    title: "Experience architecture before software",
    lead: "Connected thinking before code structure.",
    summary:
      "Early experience thinking (reconstructed) moved from ordinary situations through calculation, evidence, and AP self-inquiry toward Protect My Four — then refined toward inquiry-first comparison, dependency pathways, otherness inquiry, and user choice. An unsupported individualized causal chain (my phone → this specific environmental event → this specific harm to this person) is visibly rejected. Clean planning diagrams are reconstructed planning records, not the literal linear sequence actually executed.",
    status: "reconstructed design discussion",
    evidenceClass: "OWNER HISTORICAL RECOLLECTION",
    visualKind: "experience-flows",
    reconstructionLabel: JOURNEY_RECONSTRUCTION_LABEL,
    flows: [
      {
        id: "early-experience",
        title: "Early experience sketch",
        nodes: [
          { id: "e1", label: "User situation / ordinary action" },
          { id: "e2", label: "Environmental calculation" },
          { id: "e3", label: "Evidence" },
          { id: "e4", label: "AP self-inquiry" },
          { id: "e5", label: "Protect My Four" },
        ],
      },
      {
        id: "refined-experience",
        title: "Refined experience sketch",
        nodes: [
          { id: "r1", label: "Situation" },
          { id: "r2", label: "Inquiry" },
          { id: "r3", label: "Empirical comparison" },
          { id: "r4", label: "Impact / dependency pathways" },
          { id: "r5", label: "Protect My Four / otherness inquiry" },
          { id: "r6", label: "User choice" },
        ],
      },
      {
        id: "rejected-causal",
        title: "Rejected implication",
        rejected: true,
        note: "Unsupported individualized causal chain — not accepted product logic.",
        nodes: [
          { id: "x1", label: "My phone / activity" },
          { id: "x2", label: "This specific environmental event" },
          { id: "x3", label: "This specific harm to this person" },
        ],
      },
      {
        id: "dependency-shift",
        title: "Shifted dependency inquiry",
        nodes: [
          { id: "d1", label: "People I call mine" },
          { id: "d2", label: "Needs" },
          { id: "d3", label: "Systems" },
          { id: "d4", label: "Ecological + human dependencies" },
          { id: "d5", label: "How far does other extend?" },
        ],
      },
      {
        id: "planning-sketch",
        title: "Reconstructed planning (not literal execution order)",
        note: "Clean plan contrasted with later revision and authority separation.",
        nodes: [
          { id: "p1", label: "Constitution" },
          { id: "p2", label: "Empirical + AP contracts" },
          { id: "p3", label: "UX design" },
          { id: "p4", label: "User situation" },
          { id: "p5", label: "AP inquiry" },
          { id: "p6", label: "Empirical evidence" },
          { id: "p7", label: "Inspectable sources" },
          { id: "p8", label: "Planetary / My Four pathways" },
          { id: "p9", label: "Neutral choice" },
          { id: "p10", label: "QA / regression" },
        ],
      },
    ],
    sources: [
      ISSUE_76,
      {
        label: "User journey inventory",
        path: "design/USER_JOURNEY_V0.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Research handoff scope (still-working smartphone)",
        path: "provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
    ],
  },
  {
    id: "smartphone-first-slice",
    order: 4,
    title: "Smartphone as first concrete slice",
    lead: "A still-working phone became the first buildable cut.",
    summary:
      "The still-working-smartphone problem became the first concrete implementation slice. Substantial smartphone experience work existed long before the later Grok visual prototype. Those milestones are not collapsed here; no invented historical reason is added beyond owner recollection and repository records.",
    status: "design record",
    evidenceClass: "REPOSITORY-VERIFIED RECORD",
    visualKind: "concrete-slice",
    sources: [
      {
        label: "Research handoff scope (still-working smartphone)",
        path: "provenance/source-packages/R&E-V0-SMARTPHONE-0.3.0.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Empirical smartphone contract",
        path: "contracts/EMPIRICAL_SMARTPHONE_V0.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      ISSUE_76,
    ],
  },
  {
    id: "first-long-prototype",
    order: 5,
    title: "First smartphone prototype: rich but long",
    lead: "The logic was becoming rich. The experience was becoming too long.",
    summary:
      "Owner recollection of an early smartphone experience: long, wordy, and structurally interesting without sufficient pull for ordinary users. The phone/browser frame below is a visual reconstruction — never an original screenshot.",
    status: "owner historical recollection",
    evidenceClass: "OWNER HISTORICAL RECOLLECTION",
    visualKind: "long-phone",
    reconstructionLabel: JOURNEY_RECONSTRUCTION_LABEL,
    sources: [
      ISSUE_76,
      {
        label: "UX status notes (length / engagement feedback)",
        path: "PROJECT_STATE.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
    ],
  },
  {
    id: "workstreams-split",
    order: 6,
    title: "Workstreams split because claims need different authority",
    lead: "Organization separates claim types — it does not validate them.",
    summary:
      "Approximate early organization: Project HQ → V0 build / Research-Evidence / AP Corpus; V0 build included environmental/empirical and Protect My Four/experience work. Names evolved. Current conceptual structure: Owner → Vision/Direction → HQ → Research & Evidence / AP Framework & Corpus / executors (Cursor/Codex) → integrated PSI. Empirical/science, model/calculator assumptions, AP/philosophical material, and project interpretation remain distinct. Organization itself validates no claim.",
    status: "accepted governance",
    evidenceClass: "REPOSITORY-VERIFIED RECORD",
    visualKind: "authority-lanes",
    lanes: [
      {
        id: "empirical",
        label: "Empirical / science",
        kind: "empirical",
      },
      {
        id: "model",
        label: "Model / calculator assumptions",
        kind: "model",
      },
      {
        id: "ap",
        label: "AP / philosophical material",
        kind: "ap",
      },
      {
        id: "interpretation",
        label: "Project interpretation / inquiry",
        kind: "interpretation",
      },
      {
        id: "hq",
        label: "Owner → Vision → HQ",
        kind: "governance",
      },
      {
        id: "executors",
        label: "Executors (Cursor / Codex)",
        kind: "executor",
      },
    ],
    sources: [
      {
        label: "Project constitution (category separation)",
        path: "PROJECT_CONSTITUTION.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Universal Issue control plane",
        path: "project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Local Codex / Cursor publication protocol",
        path: "project-state/LOCAL_CODEX_TASK_PUBLICATION_PROTOCOL.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Owner control (HQ merge authority)",
        path: "OWNER_CONTROL.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      ISSUE_76,
    ],
  },
  {
    id: "grok-visual-milestone",
    order: 7,
    title: "Later Grok visual / narrative milestone",
    lead: "After the long first prototype — hierarchy, pacing, and pull.",
    summary:
      "Positioned after the first long smartphone prototype and intervening evolution. Owner recollection: a more engaging prototype conveyed hierarchy, scrolling narrative, cards, graphs, sliders, source/paper visibility, and pacing — enough that the owner wanted to continue through the whole page (paraphrased recollection, not an unverified exact quotation). Enduring target: Grok-style narrative pull with PSI epistemic integrity intact.",
    status: "owner historical recollection",
    evidenceClass: "OWNER HISTORICAL RECOLLECTION",
    visualKind: "grok-panel",
    reconstructionLabel: JOURNEY_RECONSTRUCTION_LABEL,
    sources: [ISSUE_76],
  },
  {
    id: "persuasive-vs-epistemic",
    order: 8,
    title: "Persuasive presentation ≠ epistemic authority",
    lead: "One authoritative box must split.",
    summary:
      "A correction moment: an overly unified authoritative presentation splits into Evidence/Science, Model/Assumptions, and Interpretation/Inquiry, with AP keeping distinct source authority. Owner recollection includes Safety/Protect Four–style scores, overly confident numerical interpretation, evidence/model conflation, and provisional values presented too confidently. Exact removed metrics are not invented here. The lesson must not recreate persuasive false numerical authority.",
    status: "owner historical recollection",
    evidenceClass: "OWNER HISTORICAL RECOLLECTION",
    visualKind: "authority-split",
    reconstructionLabel: JOURNEY_RECONSTRUCTION_LABEL,
    sources: [
      ISSUE_76,
      {
        label: "Project constitution (no fabricated unified score)",
        path: "PROJECT_CONSTITUTION.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
    ],
  },
  {
    id: "engineering-self-correction",
    order: 9,
    title: "Engineering self-correction",
    lead: "Secondary moments — useful, not triumphant.",
    summary:
      "Repository-backed lessons kept as expandable technical records: recover originals rather than reconstruct source packages from summaries; preserve provenance qualifications; refuse unvalidated imports; investigate fixture/environment discrepancies; UNKNOWN ≠ 0; test metadata such as case_id must not control production semantics; tests/contracts cannot create authority absent from domain inputs. Antigravity leaves the main public narrative and remains only in optional technical provenance. These are engineering and governance lessons — not moral triumphs or scientific claims.",
    status: "accepted correction",
    evidenceClass: "REPOSITORY-VERIFIED RECORD",
    visualKind: "secondary-corrections",
    correctionItems: [
      "Recover originals rather than reconstruct source packages from summaries",
      "Preserve provenance qualifications where byte identity is unresolved",
      "Refuse unvalidated application import",
      "Investigate fixture / environment discrepancies before bounded import",
      "UNKNOWN ≠ 0",
      "case_id and test metadata must not control production semantics",
      "Tests/contracts cannot create authority absent from domain inputs",
    ],
    sources: [
      {
        label: "Recovery manifest (no summary reconstruction)",
        path: "provenance/source-packages/RECOVERY_MANIFEST_2026-09-05.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Research library recovery handoff",
        path: "handoffs/RESEARCH_LIBRARY_RECOVERY_2026-09-05.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Refuse unvalidated import (Issue #17 receiving state)",
        path: "handoffs/GOVERNED_APPLICATION_BASELINE_RECEIVING_STATE_2026-09-06.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Grok OG fixture recovery",
        path: "handoffs/GROK_OG_FIXTURE_RECOVERY_2026-09-07.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Unknown must not become zero (constitution)",
        path: "PROJECT_CONSTITUTION.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Empirical contract unknown boundary",
        path: "contracts/EMPIRICAL_SMARTPHONE_V0.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Optional technical provenance — Antigravity audit",
        path: "project-state/ANTIGRAVITY_INTEGRATION_AUDIT.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Optional technical provenance — Antigravity candidate",
        path: "provenance/ANTIGRAVITY_CANDIDATE.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
    ],
  },
  {
    id: "current-system-you-are-here",
    order: 10,
    title: "Current system — YOU ARE HERE",
    lead: "Accepted layers now; planned work still ahead.",
    summary:
      "Present layered shape: immutable source packages → accepted contracts → deterministic evaluators → executable tests → React/TanStack UI. Separately: GitHub Issues → HQ → bounded executor → PR → independent review/acceptance. Secondary executable suite is complete. Next planned (not claimed complete): AP executable suite → empirical-boundary suite → canonical smartphone UX → reusable activity/evidence schema → broader V0 activities → public-beta readiness.",
    status: "current accepted architecture",
    evidenceClass: "REPOSITORY-VERIFIED RECORD",
    visualKind: "you-are-here",
    layers: JOURNEY_ARCHITECTURE_LAYERS,
    governanceChain: JOURNEY_GOVERNANCE_CHAIN,
    nextPlanned: JOURNEY_NEXT_PLANNED,
    sources: [
      {
        label: "Immutable source-package rules",
        path: "provenance/source-packages/README.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Executable test mapping (suite status)",
        path: "contracts/EXECUTABLE_TEST_MAPPING_V0.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
      {
        label: "Universal Issue control plane",
        path: "project-state/UNIVERSAL_ISSUE_CONTROL_PLANE.md",
        evidenceClass: "REPOSITORY-VERIFIED RECORD",
      },
    ],
  },
] as const;

export function getJourneyMilestonesInOrder(): JourneyMoment[] {
  return [...JOURNEY_MILESTONES].sort((a, b) => a.order - b.order);
}

export function getJourneyMilestoneIds(): string[] {
  return getJourneyMilestonesInOrder().map((m) => m.id);
}
