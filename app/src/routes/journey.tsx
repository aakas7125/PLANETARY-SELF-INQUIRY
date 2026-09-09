import { createFileRoute, Link } from "@tanstack/react-router";
import {
  JOURNEY_ARCHITECTURE_LAYERS,
  JOURNEY_PAGE_INTRO,
  JOURNEY_PAGE_TITLE,
  JOURNEY_SEPARATION_NOTICE,
  getJourneyMilestonesInOrder,
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
  const milestones = getJourneyMilestonesInOrder();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/92">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
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

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
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
          className="mt-8 rounded-xl border border-clay/35 bg-paper px-4 py-4 text-sm text-foreground sm:px-5"
          role="note"
          aria-label="Empirical separation notice"
        >
          <p className="font-medium text-clay">{JOURNEY_SEPARATION_NOTICE}</p>
        </aside>

        <ol className="mt-12 space-y-8 border-l border-border pl-6 sm:pl-8">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="relative">
              <span
                className="absolute -left-[1.9rem] top-1.5 size-2.5 rounded-full bg-pine sm:-left-[2.4rem]"
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                  <span className="mr-2 text-muted-foreground">{milestone.order}.</span>
                  {milestone.title}
                </h2>
                <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {milestone.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {milestone.summary}
              </p>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Repository record
                </p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {milestone.sources.map((source) => (
                    <li key={`${milestone.id}-${source.path}`}>
                      <span className="text-foreground">{source.label}</span>
                      <span className="text-muted-foreground"> — </span>
                      <code className="break-all text-xs text-pine">{source.path}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-14 border-t border-border pt-10" aria-labelledby="architecture-heading">
          <h2 id="architecture-heading" className="font-display text-2xl text-foreground sm:text-3xl">
            Current architecture
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            The accepted layered shape today, as recorded in provenance and executable mapping.
            Suite completeness remains as stated in the mapping: secondary complete; AP and
            empirical executable suites outstanding.
          </p>
          <ol className="mt-6 space-y-3">
            {JOURNEY_ARCHITECTURE_LAYERS.map((layer, index) => (
              <li
                key={layer}
                className="flex gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm sm:text-base"
              >
                <span className="font-display text-muted-foreground">{index + 1}</span>
                <span>{layer}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-12 text-sm text-muted-foreground">
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
