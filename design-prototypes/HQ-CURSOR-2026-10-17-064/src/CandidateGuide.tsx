import { describeLifecycleGuide } from "@/lib/smartphone/lifecycle-presentation.mjs";
import { StageGlyph } from "./stage-glyph";

const summaryClass =
  "cursor-pointer rounded-md text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

const RECORD_LINE = /kg CO₂e|kWh\/year|Status:/;

type GuideStage = ReturnType<typeof describeLifecycleGuide>["stages"][number];

function collapsedRecordLines(stage: GuideStage) {
  return [stage.generally, ...stage.sourceLines].filter((line) => RECORD_LINE.test(line));
}

/** Stages 1-4 are the accepted production-boundary stages (guide order, indices 0-3). */
const PRODUCTION_STAGE_COUNT = 4;

/**
 * Prototype only. Same describeLifecycleGuide() output and same per-stage disclosure
 * content as the accepted guide; only layout differs (single reading rail, visual
 * grouping of stages 1-4, always one column).
 */
export function CandidateLifecycleGuide({ headingId }: { headingId?: string } = {}) {
  const guide = describeLifecycleGuide();

  return (
    <section aria-label={guide.sectionLabel} className="mt-8 min-w-0 scroll-mt-32">
      <h2
        id={headingId}
        tabIndex={headingId ? -1 : undefined}
        className={
          headingId
            ? "scroll-mt-32 break-words rounded-md font-display text-2xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:text-3xl"
            : "break-words font-display text-2xl text-foreground sm:text-3xl"
        }
      >
        {guide.summary}
      </h2>
      <p className="mt-3 break-words text-sm leading-relaxed text-foreground">{guide.roleNote}</p>
      <p className="mt-3 break-words text-sm leading-relaxed text-foreground">{guide.inquiryBoundary}</p>

      <article
        aria-label={guide.production.heading}
        className="mt-5 min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]"
      >
        <h3 className="break-words font-display text-xl text-foreground">{guide.production.heading}</h3>
        <p className="mt-3 break-words rounded-xl bg-accent px-3 py-3 text-sm leading-relaxed text-foreground">
          {guide.banner}
        </p>
        <p className="mt-4 break-words font-display text-2xl leading-tight text-foreground sm:text-3xl">
          {guide.production.lines[0]}
        </p>
        <div className="mt-3 space-y-2">
          {guide.production.lines.slice(1).map((line) => (
            <p key={line} className="break-words text-sm leading-relaxed text-foreground">
              {line}
            </p>
          ))}
        </div>
        <details className="mt-4 min-w-0">
          <summary className={summaryClass}>{guide.production.disclosureSummary}</summary>
          <div className="mt-2 space-y-2">
            {guide.production.disclosureLines.map((line) => (
              <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                {line}
              </p>
            ))}
          </div>
        </details>
      </article>

      <ol aria-label="Lifecycle stages" className="mt-5 flex min-w-0 flex-col" data-candidate-rail="">
        {guide.stages.map((stage, index) => {
          const preview = collapsedRecordLines(stage);
          const inProduction = index < PRODUCTION_STAGE_COUNT;
          const isFirst = index === 0;
          const isLastProduction = index === PRODUCTION_STAGE_COUNT - 1;
          return (
            <li
              key={stage.id}
              data-stage-id={stage.id}
              data-production-group={inProduction ? "" : undefined}
              className={`relative min-w-0 pl-9 ${index === guide.stages.length - 1 ? "" : "pb-3"} ${isLastProduction ? "pb-5" : ""}`}
            >
              {inProduction ? (
                <span
                  aria-hidden="true"
                  data-rail-line=""
                  className={`absolute left-[11px] w-0.5 bg-pine/60 ${isFirst ? "top-5" : "top-0"} ${isLastProduction ? "h-5" : "bottom-0"}`}
                />
              ) : null}
              <span
                aria-hidden="true"
                data-rail-node=""
                className="absolute left-[5px] top-5 h-3.5 w-3.5 rounded-full border-2 border-pine bg-paper"
              />
              {inProduction ? (
                <span
                  aria-hidden="true"
                  data-group-bracket=""
                  className={`absolute left-0 w-1.5 border-l-4 border-pine ${isFirst ? "top-0 rounded-tl-xl border-t-4" : "top-0"} ${isLastProduction ? "bottom-2 rounded-bl-xl border-b-4" : "bottom-0"}`}
                />
              ) : null}
              {isFirst ? (
                <span
                  aria-hidden="true"
                  data-group-label=""
                  className="mb-2 block break-words pl-2 font-display text-sm text-pine"
                >
                  {guide.production.heading}
                </span>
              ) : null}
              <details className="group min-w-0 rounded-2xl bg-paper shadow-[0_0_0_1px_rgba(22,20,16,0.08)] open:shadow-[0_0_0_2px_rgba(45,74,60,0.55)]">
                <summary
                  className={`${summaryClass} flex scroll-mt-32 list-none flex-col gap-3 p-3 [&::-webkit-details-marker]:hidden`}
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-pine">
                      <StageGlyph id={stage.id} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm text-pine tabular-nums" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-0.5 block break-words text-base text-foreground">{stage.label}</span>
                      <span className="mt-1 block text-xs font-medium text-pine group-open:hidden">Show stage</span>
                      <span className="mt-1 hidden text-xs font-medium text-pine group-open:block">Hide stage</span>
                    </span>
                  </span>
                  {preview.length > 0 ? (
                    <span className="space-y-2 group-open:hidden">
                      {preview.map((line) => (
                        <span key={line} className="block break-words text-sm leading-relaxed text-foreground">
                          {line}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </summary>
                <div id={`lifecycle-panel-${stage.id}`} className="space-y-3 px-3 pb-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{stage.generallyHeading}</h4>
                    <p className="mt-1 break-words text-sm leading-relaxed text-foreground">{stage.generally}</p>
                  </div>
                  <div className="rounded-xl bg-muted px-3 py-3">
                    <h4 className="text-sm font-medium text-foreground">{stage.thisPhoneHeading}</h4>
                    <div className="mt-1 space-y-2">
                      {stage.thisPhoneLines.map((line) => (
                        <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  {stage.widerContext ? (
                    <section
                      aria-labelledby={`lifecycle-${stage.widerContext.id}-heading`}
                      className="min-w-0 rounded-xl bg-muted px-3 py-3"
                    >
                      <h4
                        id={`lifecycle-${stage.widerContext.id}-heading`}
                        className="text-sm font-medium text-foreground"
                      >
                        {stage.widerContext.heading}
                      </h4>
                      <div className="mt-3 space-y-4">
                        {stage.widerContext.records.map((record) => (
                          <article key={record.id} aria-labelledby={`lifecycle-${record.id}-label`} className="min-w-0">
                            <h5 id={`lifecycle-${record.id}-label`} className="text-sm font-medium text-foreground">
                              {record.label}
                            </h5>
                            <p className="mt-1 break-words text-sm leading-relaxed text-foreground">{record.scopeLabel}</p>
                            <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{record.fact}</p>
                            <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{record.limit}</p>
                            <a
                              href={record.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${record.linkLabel}. ${record.label}`}
                              className="mt-2 inline-block max-w-full break-words text-sm font-medium text-foreground underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                            >
                              {record.linkLabel}
                            </a>
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{stage.sourcesHeading}</h4>
                    <div className="mt-1 space-y-2">
                      {stage.sourceLines.map((line) => (
                        <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  {stage.explore ? (
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{stage.explore.heading}</h4>
                      <p className="mt-1 break-words text-sm leading-relaxed text-foreground">{stage.explore.note}</p>
                      <ul className="mt-2 space-y-2">
                        {stage.explore.links.map((link) => (
                          <li key={link.href} className="min-w-0">
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-words text-sm font-medium text-foreground underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                            >
                              {link.label}
                            </a>
                            <p className="mt-1 break-words text-sm leading-relaxed text-foreground">{link.provenance}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
