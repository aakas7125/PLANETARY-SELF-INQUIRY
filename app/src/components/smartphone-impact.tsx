import { useEffect, useRef } from "react";
import { SmartphoneLifecycleGuide } from "@/components/smartphone-lifecycle";
import { Button } from "@/components/ui/button";
import { OTHERNESS_CHROME } from "@/lib/smartphone/ap-otherness-ux.mjs";
import { IMPACT_CHROME, describeImpact } from "@/lib/smartphone/impact-pathways-ux.mjs";
import { SYSTEM_PARTICIPATION_CHROME } from "@/lib/smartphone/system-participation-ux.mjs";

type ImpactView = ReturnType<typeof describeImpact>;

export function SmartphoneImpact({
  view,
  onBackToComparison,
  onContinueToOtherness,
  systemParticipation = null,
  onReflect,
  onSkipReflection,
}: {
  view: ImpactView;
  onBackToComparison: () => void;
  onContinueToOtherness?: () => void;
  systemParticipation?: { anchor: string } | null;
  onReflect?: () => void;
  onSkipReflection?: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {IMPACT_CHROME.eyebrow}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 scroll-mt-32 font-display text-3xl leading-tight text-foreground outline-none sm:text-4xl"
      >
        {IMPACT_CHROME.title}
      </h1>
      <p className="mt-3 max-w-xl text-base text-foreground">{view.opening}</p>

      <nav aria-label="Smartphone inquiry stages" className="mt-6">
        <ol className="space-y-2">
          {view.stages.map((stage, index) => (
            <li
              key={stage.id}
              aria-current={stage.availability === "current" ? "step" : undefined}
              className="flex min-w-0 gap-3 rounded-xl bg-paper px-3 py-2.5 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]"
            >
              <span className="font-display text-sm text-pine tabular-nums" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{stage.label}</span>
                <span className="block break-words text-sm text-muted-foreground">{stage.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <SmartphoneLifecycleGuide />

      {view.available ? (
        <section aria-label="Impact and dependency pathways" className="mt-8 min-w-0">
          <p className="text-sm leading-relaxed text-foreground">{view.selectionNote}</p>
          {view.inspectedLabels.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {view.inspectedLabels.map((label) => (
                <li key={label} className="break-words text-sm text-foreground">
                  {label}
                </li>
              ))}
            </ul>
          ) : null}
          {view.capabilityLines.length > 0 ? (
            <div className="mt-3 space-y-1">
              {view.capabilityLines.map((line) => (
                <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                  {line}
                </p>
              ))}
            </div>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-foreground">{view.rangeNote}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{view.unknownNote}</p>

          <div className="mt-6 space-y-3">
            {view.domains.map((domain) => (
              <article
                key={domain.heading}
                aria-label={domain.heading}
                className="min-w-0 rounded-2xl border-l-4 border-pine bg-paper px-4 py-4"
              >
                <h2 className="break-words font-display text-xl text-foreground">{domain.heading}</h2>
                <div className="mt-2 space-y-2">
                  {domain.lines.map((line) => (
                    <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                      {line}
                    </p>
                  ))}
                </div>
                {domain.disclosure ? (
                  <details className="mt-3 min-w-0">
                    <summary className="cursor-pointer rounded-md text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                      {domain.disclosure.summary}
                    </summary>
                    <div className="mt-2 space-y-2">
                      {domain.disclosure.lines.map((line) => (
                        <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </details>
                ) : null}
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground">{view.boundary}</p>
          {systemParticipation && onReflect && onSkipReflection ? (
            <div className="mt-4 space-y-3">
              <p className="break-words text-sm leading-relaxed text-foreground">{systemParticipation.anchor}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="h-auto min-h-11 whitespace-normal px-4 py-2 text-center"
                  onClick={onReflect}
                >
                  {SYSTEM_PARTICIPATION_CHROME.reflect}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-11 whitespace-normal px-4 py-2 text-center"
                  onClick={onSkipReflection}
                >
                  {SYSTEM_PARTICIPATION_CHROME.skip}
                </Button>
              </div>
            </div>
          ) : onContinueToOtherness ? (
            <div className="mt-4">
              <Button type="button" onClick={onContinueToOtherness}>
                {OTHERNESS_CHROME.continueFromImpact}
              </Button>
            </div>
          ) : null}
        </section>
      ) : (
        <p className="mt-8 text-sm leading-relaxed text-foreground">{view.closedNote}</p>
      )}

      <div className="mt-6">
        <Button type="button" variant="outline" onClick={onBackToComparison}>
          {IMPACT_CHROME.back}
        </Button>
      </div>
    </main>
  );
}
