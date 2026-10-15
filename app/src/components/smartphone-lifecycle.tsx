import { describeLifecycleGuide } from "@/lib/smartphone/lifecycle-presentation.mjs";

const summaryClass =
  "cursor-pointer rounded-md text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function SmartphoneLifecycleGuide() {
  const guide = describeLifecycleGuide();

  return (
    <section aria-label={guide.sectionLabel} className="mt-8 min-w-0">
      <details className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
        <summary className={summaryClass}>{guide.summary}</summary>
        <div className="mt-3 space-y-3">
          <p className="break-words text-sm leading-relaxed text-foreground">{guide.roleNote}</p>
          <p className="break-words text-sm leading-relaxed text-foreground">{guide.banner}</p>
          <p className="break-words text-sm leading-relaxed text-foreground">{guide.inquiryBoundary}</p>

          <ol aria-label="Lifecycle stages" className="space-y-1">
            {guide.stages.map((stage, index) => (
              <li key={stage.id} className="flex min-w-0 gap-3 text-sm text-foreground">
                <span className="font-display text-pine tabular-nums" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 break-words">{stage.label}</span>
              </li>
            ))}
          </ol>

          <article aria-label={guide.production.heading} className="min-w-0">
            <h2 className="break-words font-display text-xl text-foreground">{guide.production.heading}</h2>
            <div className="mt-2 space-y-2">
              {guide.production.lines.map((line) => (
                <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                  {line}
                </p>
              ))}
            </div>
            <details className="mt-3 min-w-0">
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

          <div className="space-y-2">
            {guide.stages.map((stage) => (
              <details key={stage.id} className="min-w-0 rounded-xl bg-background px-3 py-2">
                <summary className={summaryClass}>{stage.label}</summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{stage.generallyHeading}</h3>
                    <p className="mt-1 break-words text-sm leading-relaxed text-foreground">{stage.generally}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{stage.thisPhoneHeading}</h3>
                    <div className="mt-1 space-y-2">
                      {stage.thisPhoneLines.map((line) => (
                        <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{stage.sourcesHeading}</h3>
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
                      <h3 className="text-sm font-medium text-foreground">{stage.explore.heading}</h3>
                      <p className="mt-1 break-words text-sm leading-relaxed text-foreground">{stage.explore.note}</p>
                      <ul className="mt-2 space-y-2">
                        {stage.explore.links.map((link) => (
                          <li key={link.href} className="min-w-0">
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-words text-sm font-medium text-foreground underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}
