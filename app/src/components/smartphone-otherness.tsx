import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { OTHERNESS_CHROME, describeOtherness } from "@/lib/smartphone/ap-otherness-ux.mjs";
import { FINAL_CHOICE_CHROME } from "@/lib/smartphone/final-choice-ux.mjs";

type OthernessView = ReturnType<typeof describeOtherness>;

export function SmartphoneOtherness({
  view,
  onBackToImpact,
  onResponse,
  onFollowUp,
  onContinueToFinalChoice,
}: {
  view: OthernessView;
  onBackToImpact: () => void;
  onResponse: (text: string) => void;
  onFollowUp: (text: string) => void;
  onContinueToFinalChoice?: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {OTHERNESS_CHROME.eyebrow}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 scroll-mt-32 font-display text-3xl leading-tight text-foreground outline-none sm:text-4xl"
      >
        {OTHERNESS_CHROME.title}
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

      {view.available ? (
        <section aria-label="Protect Four and otherness inquiry" className="mt-8 min-w-0">
          {view.activated && view.question ? (
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-foreground">{view.classificationLine}</p>
              <h2 className="mt-4 break-words font-display text-2xl leading-snug text-foreground">
                {view.question}
              </h2>
              {view.followUpPrompt ? (
                <p className="mt-3 break-words text-sm leading-relaxed text-foreground">
                  {view.followUpPrompt}
                </p>
              ) : null}
              <label className="mt-4 block min-w-0" htmlFor="otherness-response">
                <span className="text-sm font-medium text-foreground">{OTHERNESS_CHROME.responseLabel}</span>
                <textarea
                  id="otherness-response"
                  value={view.response}
                  onChange={(event) => onResponse(event.target.value)}
                  aria-describedby="otherness-response-helper"
                  className="mt-2 min-h-28 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
              </label>
              <p id="otherness-response-helper" className="mt-2 text-sm leading-relaxed text-foreground">
                {view.responseHelper}
              </p>
              <label className="mt-4 block min-w-0" htmlFor="otherness-follow-up">
                <span className="text-sm font-medium text-foreground">{OTHERNESS_CHROME.followUpLabel}</span>
                <textarea
                  id="otherness-follow-up"
                  value={view.followUpResponse}
                  onChange={(event) => onFollowUp(event.target.value)}
                  className="mt-2 min-h-24 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
              </label>
              {view.disclosure ? (
                <details className="mt-4 min-w-0">
                  <summary className="cursor-pointer rounded-md text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                    {view.disclosure.summary}
                  </summary>
                  <div className="mt-2 space-y-3">
                    <p className="break-words text-sm leading-relaxed text-foreground">
                      {view.disclosure.corpusLine}
                    </p>
                    {view.disclosure.claims.map((claim) => (
                      <div key={claim.claimLine} className="min-w-0 space-y-2">
                        <p className="break-words text-sm leading-relaxed text-foreground">{claim.claimLine}</p>
                        <p className="break-words text-sm leading-relaxed text-foreground">{claim.paraphrase}</p>
                        <ul className="space-y-1">
                          {claim.links.map((link) => (
                            <li key={link.href}>
                              <a
                                href={link.href}
                                className="break-words text-sm text-foreground underline decoration-border underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                              >
                                {link.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          ) : (
            <p className="break-words text-sm leading-relaxed text-foreground">{view.unavailableNote}</p>
          )}
          <p className="mt-4 break-words text-sm leading-relaxed text-foreground">{view.boundary}</p>
          {onContinueToFinalChoice ? (
            <div className="mt-6">
              <Button
                type="button"
                className="h-auto min-h-11 whitespace-normal px-4 py-2 text-center"
                onClick={onContinueToFinalChoice}
              >
                {FINAL_CHOICE_CHROME.continueFromOtherness}
              </Button>
            </div>
          ) : null}
        </section>
      ) : (
        <p className="mt-8 text-sm leading-relaxed text-foreground">{view.closedNote}</p>
      )}

      <div className="mt-6">
        <Button type="button" variant="outline" onClick={onBackToImpact}>
          {OTHERNESS_CHROME.back}
        </Button>
      </div>
    </main>
  );
}
