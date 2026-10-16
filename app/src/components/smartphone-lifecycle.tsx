import { describeLifecycleGuide } from "@/lib/smartphone/lifecycle-presentation.mjs";

const summaryClass =
  "cursor-pointer rounded-md text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

const RECORD_LINE = /kg CO₂e|kWh\/year|Status:/;

type GuideStage = ReturnType<typeof describeLifecycleGuide>["stages"][number];

/**
 * Existing complete sentences that already carry a quantity or status.
 * This only chooses where those sentences sit while a stage is collapsed.
 */
function collapsedRecordLines(stage: GuideStage) {
  return [stage.generally, ...stage.sourceLines].filter((line) => RECORD_LINE.test(line));
}

function StageGlyph({ id }: { id: string }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: "h-10 w-10",
  };

  if (id === "raw-materials") {
    return (
      <svg {...common}>
        <path d="M24 8 32 20H16Z" />
        <path d="M14 22 22 34H6Z" />
        <path d="M34 22 42 34H26Z" />
      </svg>
    );
  }
  if (id === "refining-processing") {
    return (
      <svg {...common}>
        <path d="M16 10h16l-3 10H19Z" />
        <path d="M19 20h10v6c0 6-2 10-5 10s-5-4-5-10Z" />
        <path d="M18 40h12" />
      </svg>
    );
  }
  if (id === "components") {
    return (
      <svg {...common}>
        <rect x="14" y="14" width="20" height="20" rx="2" />
        <path d="M18 14v-4M24 14v-4M30 14v-4M18 34v4M24 34v4M30 34v4M14 18h-4M14 24h-4M14 30h-4M34 18h4M34 24h4M34 30h4" />
      </svg>
    );
  }
  if (id === "assembly") {
    return (
      <svg {...common}>
        <rect x="18" y="10" width="12" height="28" rx="2" />
        <path d="M8 16h6M8 24h6M8 32h6M34 16h6M34 24h6M34 32h6" />
      </svg>
    );
  }
  if (id === "distribution-transport") {
    return (
      <svg {...common}>
        <rect x="8" y="14" width="20" height="16" rx="1.5" />
        <path d="M8 20h20" />
        <path d="M32 22h8M36 18l4 4-4 4" />
      </svg>
    );
  }
  if (id === "use-repair") {
    return (
      <svg {...common}>
        <rect x="16" y="8" width="16" height="28" rx="2" />
        <path d="M22 32h4" />
        <path d="M30 28l8 8M34 26l6 6" />
      </svg>
    );
  }
  if (id === "resale-refurbishment-second-life") {
    return (
      <svg {...common}>
        <rect x="6" y="12" width="14" height="24" rx="2" />
        <rect x="28" y="12" width="14" height="24" rx="2" />
        <path d="M12 32h2M34 32h2" />
      </svg>
    );
  }
  if (id === "end-of-life") {
    return (
      <svg {...common}>
        <rect x="16" y="8" width="16" height="28" rx="2" strokeDasharray="3 2" />
        <path d="M22 32h4" />
        <path d="M10 40h28" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="24" cy="24" r="8" />
    </svg>
  );
}

export function SmartphoneLifecycleGuide() {
  const guide = describeLifecycleGuide();

  return (
    <section aria-label={guide.sectionLabel} className="mt-8 min-w-0 scroll-mt-32">
      <h2 className="break-words font-display text-2xl text-foreground sm:text-3xl">{guide.summary}</h2>
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

      <ol aria-label="Lifecycle stages" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {guide.stages.map((stage, index) => {
          const preview = collapsedRecordLines(stage);
          return (
            <li
              key={stage.id}
              className={`min-w-0 sm:[&:has(details[open])]:col-span-2 ${preview.length > 0 ? "sm:col-span-2" : ""}`}
            >
              <details className="group h-full min-w-0 rounded-2xl bg-paper shadow-[0_0_0_1px_rgba(22,20,16,0.08)] open:shadow-[0_0_0_2px_rgba(45,74,60,0.55)]">
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
                    </span>
                    <span className="shrink-0 text-xs font-medium text-pine group-open:hidden">Show stage</span>
                    <span className="hidden shrink-0 text-xs font-medium text-pine group-open:inline">Hide stage</span>
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
