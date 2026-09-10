import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  JOURNEY_ACCEPTED_NOW,
  JOURNEY_PAGE_INTRO,
  JOURNEY_PAGE_TITLE,
  JOURNEY_SEPARATION_NOTICE,
  getJourneyMilestonesInOrder,
  type JourneyFlow,
  type JourneyLane,
  type JourneyMoment,
  type JourneySourceRef,
} from "@/lib/journey/journey-record";

export const Route = createFileRoute("/journey")({
  component: JourneyPage,
  head: () => ({
    meta: [
      { title: `${JOURNEY_PAGE_TITLE} · Protect Four` },
      {
        name: "description",
        content: JOURNEY_SEPARATION_NOTICE,
      },
    ],
  }),
});

function JourneyPage() {
  const moments = getJourneyMilestonesInOrder();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/92">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link
            to="/"
            className="font-display text-base tracking-tight text-foreground sm:text-lg"
          >
            Protect Four
          </Link>
          <nav aria-label="Journey page">
            <Link
              to="/"
              className="rounded-md px-2 py-2 text-sm text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Back to main experience
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Development history
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
          {JOURNEY_PAGE_TITLE}
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {JOURNEY_PAGE_INTRO}
        </p>

        <aside
          className="mt-8 border-l-4 border-clay bg-paper px-4 py-4 text-sm text-foreground sm:px-5"
          role="note"
          aria-label="Empirical separation notice"
        >
          <p className="font-medium text-clay">{JOURNEY_SEPARATION_NOTICE}</p>
        </aside>

        <ol className="mt-14 space-y-16 sm:space-y-20">
          {moments.map((moment) => (
            <li key={moment.id} id={moment.id} className="scroll-mt-20">
              <MomentHeader moment={moment} />
              <MomentVisual moment={moment} />
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {moment.summary}
              </p>
              <RecordDisclosure moment={moment} />
            </li>
          ))}
        </ol>

        <p className="mt-16 text-sm text-muted-foreground">
          <Link
            to="/"
            className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          >
            Return to the Protect Four main experience
          </Link>
        </p>
      </main>
    </div>
  );
}

function MomentHeader({ moment }: { moment: JourneyMoment }) {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-sm text-muted-foreground tabular-nums">
          {String(moment.order).padStart(2, "0")}
        </span>
        <h2 className="font-display text-2xl text-foreground sm:text-3xl">
          {moment.title}
        </h2>
      </div>
      <p className="mt-2 font-display text-xl leading-snug text-pine sm:text-2xl">
        {moment.lead}
      </p>
      {moment.reconstructionLabel ? (
        <p className="mt-2 text-xs italic text-muted-foreground">
          {moment.reconstructionLabel}
        </p>
      ) : null}
    </div>
  );
}

function MomentVisual({ moment }: { moment: JourneyMoment }) {
  switch (moment.visualKind) {
    case "open-space":
      return <OpenSpaceVisual />;
    case "pressure-transform":
      return <PressureTransformVisual />;
    case "experience-flows":
      return <ExperienceFlowsVisual flows={moment.flows ?? []} />;
    case "concrete-slice":
      return <ConcreteSliceVisual />;
    case "long-phone":
      return <LongPhoneVisual />;
    case "authority-lanes":
      return <AuthorityLanesVisual lanes={moment.lanes ?? []} />;
    case "grok-panel":
      return <GrokPanelVisual />;
    case "authority-split":
      return <AuthoritySplitVisual />;
    case "secondary-corrections":
      return (
        <SecondaryCorrectionsVisual items={moment.correctionItems ?? []} />
      );
    case "you-are-here":
      return (
        <YouAreHereVisual
          layers={moment.layers ?? []}
          governance={moment.governanceChain ?? []}
          nextPlanned={moment.nextPlanned ?? []}
        />
      );
    default:
      return null;
  }
}

function OpenSpaceVisual() {
  return (
    <figure
      className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-b from-paper via-background to-muted/40 px-6 py-12 text-center sm:px-10 sm:py-16"
      aria-label="Before code — open space"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--color-pine) 12%, transparent), transparent 42%), radial-gradient(circle at 80% 70%, color-mix(in oklab, var(--color-clay) 10%, transparent), transparent 40%)",
        }}
        aria-hidden
      />
      <p className="relative font-display text-3xl text-foreground sm:text-4xl">
        There was no code.
      </p>
      <p className="relative mx-auto mt-6 max-w-xl font-display text-lg leading-snug text-pine sm:text-xl">
        If you want to protect just four people, you have to protect the whole
        planet.
      </p>
      <p className="relative mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Owner-provided design formulation — not a proven conclusion
      </p>
    </figure>
  );
}

function PressureTransformVisual() {
  const stages = [
    "Compelling idea",
    "Can that actually be scientifically defended?",
    "Scientific boundary",
    "Change the product, not the evidence",
  ];
  return (
    <figure
      className="rounded-lg border border-border bg-card/60 p-4 sm:p-6"
      aria-label="Idea under scientific pressure"
    >
      <ol className="grid gap-3 sm:grid-cols-4 sm:gap-2">
        {stages.map((stage, index) => (
          <li key={stage} className="relative flex flex-col">
            <div
              className={`flex min-h-[5.5rem] flex-1 items-center rounded-md border px-3 py-3 text-sm leading-snug ${
                index === 0
                  ? "border-pine/40 bg-accent text-accent-foreground"
                  : index === stages.length - 1
                    ? "border-clay/45 bg-paper text-foreground"
                    : "border-border bg-background text-muted-foreground"
              }`}
            >
              {stage}
            </div>
            {index < stages.length - 1 ? (
              <span
                className="my-1 hidden text-center text-pine sm:block"
                aria-hidden
              >
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-5 border-t border-border pt-4 text-sm text-foreground">
        Surviving inquiry (approximate):{" "}
        <span className="font-medium">
          Can the people I call “mine” actually be protected independently of
          the ecological and human systems I call “other”?
        </span>
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Project-development correction — not a scientific result. Empirical
        inquiry investigates dependencies, pathways, risks, and uncertainty; it
        does not establish the stronger philosophical conclusion.
      </p>
    </figure>
  );
}

function FlowStrip({ flow }: { flow: JourneyFlow }) {
  return (
    <div
      className={`rounded-md border p-3 ${
        flow.rejected
          ? "border-destructive/40 bg-destructive/5"
          : "border-border bg-background"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {flow.title}
      </p>
      <ol className="mt-3 flex flex-wrap items-stretch gap-2">
        {flow.nodes.map((node, index) => (
          <li key={node.id} className="flex max-w-full items-center gap-2">
            <span
              className={`inline-flex max-w-[11rem] rounded-sm border px-2 py-1.5 text-xs leading-snug sm:max-w-[13rem] ${
                flow.rejected
                  ? "border-destructive/50 text-destructive line-through decoration-destructive/70"
                  : "border-pine/30 bg-paper text-foreground"
              }`}
            >
              {node.label}
            </span>
            {index < flow.nodes.length - 1 ? (
              <span className="text-muted-foreground" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {flow.note ? (
        <p className="mt-2 text-xs text-muted-foreground">{flow.note}</p>
      ) : null}
      {flow.rejected ? (
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-destructive">
          Visibly rejected
        </p>
      ) : null}
    </div>
  );
}

function ExperienceFlowsVisual({ flows }: { flows: JourneyFlow[] }) {
  return (
    <figure
      className="space-y-3"
      aria-label="Reconstructed early experience architecture"
    >
      {flows.map((flow) => (
        <FlowStrip key={flow.id} flow={flow} />
      ))}
    </figure>
  );
}

function ConcreteSliceVisual() {
  return (
    <figure
      className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
      aria-label="Smartphone as first concrete slice"
    >
      <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
        Broad Protect Four intuition
      </div>
      <div className="flex items-center justify-center text-pine" aria-hidden>
        →
      </div>
      <div className="rounded-md border border-pine/40 bg-accent px-4 py-6 text-center">
        <p className="font-display text-lg text-foreground">
          Still-working smartphone
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          First concrete implementation slice
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Substantial experience existed long before the later Grok visual
          prototype
        </p>
      </div>
    </figure>
  );
}

function LongPhoneVisual() {
  const blocks = [
    "Situation framing…",
    "Environmental calculation block…",
    "Evidence paragraphs…",
    "AP self-inquiry prompts…",
    "Dependency pathways…",
    "Protect Four framing…",
    "More explanation…",
    "Still more structure…",
  ];
  return (
    <figure
      className="flex justify-center"
      aria-label="Reconstructed long first smartphone prototype"
    >
      <div className="w-full max-w-[18rem] rounded-[1.6rem] border-2 border-ink/80 bg-ink p-2 shadow-sm">
        <div className="overflow-hidden rounded-[1.2rem] bg-paper">
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-[0.65rem] text-muted-foreground">
            <span>browser</span>
            <span>scroll ↓</span>
          </div>
          <div className="flex max-h-80 flex-col px-3 py-3">
            <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
              {blocks.map((block, index) => (
                <div
                  key={block}
                  className="rounded-sm border border-border bg-card px-2 py-2 text-xs text-muted-foreground"
                  style={{ opacity: 1 - index * 0.07 }}
                >
                  {block}
                </div>
              ))}
            </div>
            <div className="mt-2 shrink-0 border-t border-dashed border-border pt-2 text-center text-[0.65rem] uppercase tracking-[0.14em] text-clay">
              Too long · too wordy · weak pull
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function laneTone(kind: JourneyLane["kind"]): string {
  switch (kind) {
    case "empirical":
      return "border-pine/45 bg-accent";
    case "model":
      return "border-border bg-card";
    case "ap":
      return "border-clay/40 bg-paper";
    case "interpretation":
      return "border-border bg-muted/50";
    case "governance":
      return "border-pine/50 bg-background";
    case "executor":
      return "border-border bg-background";
    default:
      return "border-border bg-card";
  }
}

function GraphStemNode({
  children,
  tone = "border-border bg-background",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <div
      className={`w-full max-w-[14rem] rounded-md border px-3 py-2 text-center text-xs leading-snug text-foreground sm:max-w-[16rem] sm:text-sm ${tone}`}
    >
      {children}
    </div>
  );
}

function BranchFanOut() {
  return (
    <svg
      viewBox="0 0 120 32"
      className="mx-auto h-8 w-full max-w-lg text-pine"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M60 0 V10 M60 10 L20 32 M60 10 L60 32 M60 10 L100 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BranchFanIn() {
  return (
    <svg
      viewBox="0 0 120 32"
      className="mx-auto h-8 w-full max-w-lg text-pine"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M20 0 L60 22 M60 0 L60 22 M100 0 L60 22 M60 22 V32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AuthorityLanesVisual({ lanes }: { lanes: JourneyLane[] }) {
  const claimLanes = lanes.filter((l) =>
    ["empirical", "model", "ap", "interpretation"].includes(l.kind),
  );
  return (
    <figure className="space-y-4" aria-label="Authority and workstream lanes">
      <div className="rounded-md border border-border bg-card/50 p-3 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Claim-type lanes (must stay distinct)
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {claimLanes.map((lane) => (
            <li
              key={lane.id}
              className={`rounded-md border px-2 py-2.5 text-[0.7rem] leading-snug sm:px-3 sm:py-3 sm:text-sm ${laneTone(lane.kind)}`}
            >
              {lane.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-md border border-border p-3 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Approximate organization (names evolved)
        </p>
        <p className="sr-only">
          Branching authority graph: Owner feeds Vision/Direction, then HQ.
          HQ branches in parallel to Research and Evidence, AP Framework and
          Corpus, and executors Cursor/Codex. Those parallel workstreams
          converge into integrated PSI. Organization itself validates no claim.
        </p>
        <div
          className="mt-3 flex flex-col items-center"
          aria-hidden
        >
          <GraphStemNode tone="border-pine/40 bg-paper">Owner</GraphStemNode>
          <span className="py-1 text-pine" aria-hidden>
            ↓
          </span>
          <GraphStemNode tone="border-pine/40 bg-paper">
            Vision / Direction
          </GraphStemNode>
          <span className="py-1 text-pine" aria-hidden>
            ↓
          </span>
          <GraphStemNode tone="border-pine/50 bg-accent">HQ</GraphStemNode>
          <BranchFanOut />
          <ul className="grid w-full grid-cols-3 gap-1.5 sm:gap-3">
            <li
              className={`rounded-md border px-1.5 py-2 text-center text-[0.62rem] leading-snug sm:px-3 sm:py-3 sm:text-xs ${laneTone("empirical")}`}
            >
              Research &amp; Evidence
            </li>
            <li
              className={`rounded-md border px-1.5 py-2 text-center text-[0.62rem] leading-snug sm:px-3 sm:py-3 sm:text-xs ${laneTone("ap")}`}
            >
              AP Framework &amp; Corpus
            </li>
            <li
              className={`rounded-md border px-1.5 py-2 text-center text-[0.62rem] leading-snug sm:px-3 sm:py-3 sm:text-xs ${laneTone("executor")}`}
            >
              Executors
              <span className="mt-0.5 block text-[0.55rem] text-muted-foreground sm:text-[0.65rem]">
                Cursor / Codex
              </span>
            </li>
          </ul>
          <BranchFanIn />
          <GraphStemNode tone="border-clay/40 bg-paper">
            Integrated PSI
          </GraphStemNode>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Organization itself validates no claim.
        </p>
      </div>
    </figure>
  );
}

function GrokPanelVisual() {
  return (
    <figure
      className="overflow-hidden rounded-lg border border-border bg-gradient-to-br from-paper via-card to-accent/40"
      aria-label="Reconstructed later Grok-style narrative panel"
    >
      <div className="border-b border-border px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Reconstructed prototype panel — hierarchy · pacing · source visibility
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          <div className="h-8 w-3/4 rounded-sm bg-pine/20" />
          <div className="h-3 w-full rounded-sm bg-border" />
          <div className="h-3 w-5/6 rounded-sm bg-border" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-md border border-border bg-background/80" />
            <div className="h-16 rounded-md border border-border bg-background/80" />
          </div>
          <div className="flex h-10 items-end gap-1 rounded-md border border-border bg-background/70 px-2 pb-2">
            {[40, 65, 35, 80, 55, 70].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-pine/35"
                style={{ height: `${h}%` }}
                aria-hidden
              />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-background/80 p-3">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
              Sources / papers
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="h-2 w-full rounded-sm bg-border" />
              <div className="h-2 w-4/5 rounded-sm bg-border" />
              <div className="h-2 w-3/5 rounded-sm bg-border" />
            </div>
          </div>
          <div className="rounded-md border border-border bg-background/80 p-3">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
              Slider / comparison
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-muted">
              <div className="h-1.5 w-2/3 rounded-full bg-pine/50" />
            </div>
          </div>
          <p className="text-xs italic text-muted-foreground">
            Owner recollection (paraphrased): enough narrative pull to want to
            continue through the whole page. Enduring target: that pull with PSI
            epistemic integrity.
          </p>
        </div>
      </div>
    </figure>
  );
}

function AuthoritySplitVisual() {
  const lanes = [
    {
      title: "Evidence / Science",
      note: "What sources actually support",
    },
    {
      title: "Model / Assumptions",
      note: "Ranges, uncertainty, accounting choices",
    },
    {
      title: "Interpretation / Inquiry",
      note: "AP keeps distinct source authority",
    },
  ] as const;

  return (
    <figure className="space-y-3" aria-label="Persuasive box splits into authority lanes">
      <div className="relative rounded-md border-2 border-destructive/35 bg-destructive/5 px-3 py-4 text-center sm:px-4 sm:py-5">
        <p className="font-display text-base text-destructive line-through decoration-destructive/60 sm:text-lg">
          One unified authoritative box
        </p>
        <p className="mt-2 text-[0.7rem] text-muted-foreground sm:text-xs">
          Overconfident scores · evidence/model conflation · provisional values
          presented too firmly — recalled failure mode, not reconstructed metrics
        </p>
      </div>
      <svg
        viewBox="0 0 120 28"
        className="mx-auto h-7 w-full max-w-lg text-pine"
        aria-hidden
        preserveAspectRatio="none"
      >
        <path
          d="M60 0 V8 M60 8 L20 28 M60 8 L60 28 M60 8 L100 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
      <p className="sr-only">
        The unified box splits in parallel into Evidence/Science, Model/Assumptions,
        and Interpretation/Inquiry.
      </p>
      <ul className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {lanes.map((item) => (
          <li
            key={item.title}
            className="rounded-md border border-pine/35 bg-paper px-1.5 py-3 text-center sm:px-3 sm:py-4"
          >
            <p className="font-display text-[0.7rem] leading-snug text-foreground sm:text-base">
              {item.title}
            </p>
            <p className="mt-1.5 text-[0.58rem] leading-snug text-muted-foreground sm:mt-2 sm:text-xs">
              {item.note}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">
        Visual lesson: do not recreate persuasive false numerical authority.
      </p>
    </figure>
  );
}

function SecondaryCorrectionsVisual({ items }: { items: readonly string[] }) {
  return (
    <figure
      className="rounded-md border border-border bg-card/40 p-4"
      aria-label="Engineering self-correction moments"
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Compact correction markers
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-sm border border-border bg-background px-2 py-2 text-[0.7rem] leading-snug text-foreground sm:px-3 sm:text-xs"
          >
            {item}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function YouAreHereVisual({
  layers,
  governance,
  nextPlanned,
}: {
  layers: readonly string[];
  governance: readonly string[];
  nextPlanned: readonly string[];
}) {
  return (
    <figure className="space-y-4" aria-label="Current system — you are here">
      <div className="rounded-md border-2 border-pine bg-accent/60 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-pine">
          YOU ARE HERE
        </p>
        <p className="mt-2 text-sm text-foreground">{JOURNEY_ACCEPTED_NOW}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Accepted system layers
          </p>
          <ol className="mt-3 space-y-2">
            {layers.map((layer, index) => (
              <li key={layer} className="flex gap-2 text-sm">
                <span className="text-muted-foreground tabular-nums">
                  {index + 1}.
                </span>
                <span>{layer}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-md border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Review / acceptance chain
          </p>
          <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {governance.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span className="rounded-sm border border-pine/30 bg-paper px-2 py-1">
                  {step}
                </span>
                {index < governance.length - 1 ? (
                  <span className="text-muted-foreground" aria-hidden>
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="rounded-md border border-dashed border-border p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Next planned (not claimed complete)
        </p>
        <ol className="mt-3 flex flex-wrap gap-2">
          {nextPlanned.map((item, index) => (
            <li
              key={item}
              className="rounded-sm border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground"
            >
              {index + 1}. {item}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

function sourceDisplay(source: JourneySourceRef): string {
  if (source.path.startsWith("http")) return source.path;
  return source.path;
}

function RecordDisclosure({ moment }: { moment: JourneyMoment }) {
  const count = moment.sources.length;
  const antigravityOnly =
    moment.id === "engineering-self-correction"
      ? moment.sources.filter((s) => /antigravity/i.test(s.path))
      : [];
  const primarySources =
    moment.id === "engineering-self-correction"
      ? moment.sources.filter((s) => !/antigravity/i.test(s.path))
      : moment.sources;

  return (
    <div className="mt-5 space-y-2">
      <details className="group rounded-md border border-border bg-card/30 open:bg-card/50">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-sm text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="underline decoration-border underline-offset-4 group-open:decoration-pine">
            Inspect the record
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            Classification &amp; sources ({count})
          </span>
        </summary>
        <div className="border-t border-border px-3 py-3">
          <dl className="mb-4 grid gap-2 text-xs sm:grid-cols-2">
            <div className="rounded-sm border border-border bg-background px-2 py-2">
              <dt className="uppercase tracking-[0.12em] text-muted-foreground">
                Evidence class
              </dt>
              <dd className="mt-1 text-foreground">{moment.evidenceClass}</dd>
            </div>
            <div className="rounded-sm border border-border bg-background px-2 py-2">
              <dt className="uppercase tracking-[0.12em] text-muted-foreground">
                Status
              </dt>
              <dd className="mt-1 text-foreground">{moment.status}</dd>
            </div>
          </dl>
          <ul className="space-y-2.5 text-sm">
            {primarySources.map((source) => (
              <li key={`${moment.id}-${source.path}`}>
                <p className="text-foreground">{source.label}</p>
                <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {source.evidenceClass}
                </p>
                <code className="mt-1 block break-all text-xs text-pine">
                  {sourceDisplay(source)}
                </code>
              </li>
            ))}
          </ul>
          {antigravityOnly.length > 0 ? (
            <details className="mt-4 rounded-sm border border-dashed border-border">
              <summary className="cursor-pointer px-2 py-2 text-xs text-muted-foreground">
                Optional technical provenance (Antigravity — not main narrative)
              </summary>
              <ul className="space-y-2 border-t border-border px-2 py-2 text-sm">
                {antigravityOnly.map((source) => (
                  <li key={source.path}>
                    <p className="text-foreground">{source.label}</p>
                    <code className="mt-1 block break-all text-xs text-pine">
                      {source.path}
                    </code>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </details>
    </div>
  );
}
