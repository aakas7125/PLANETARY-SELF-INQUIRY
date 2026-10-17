import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  SYSTEM_PARTICIPATION_CHROME,
  describeSystemParticipation,
} from "@/lib/smartphone/system-participation-ux.mjs";

type ParticipationView = ReturnType<typeof describeSystemParticipation>;

export function SmartphoneSystemParticipation({
  view,
  onBackToEvidence,
  onAnswer,
  onContinueToOtherness,
  onSkip,
}: {
  view: ParticipationView;
  onBackToEvidence: () => void;
  onAnswer: (id: string, text: string) => void;
  onContinueToOtherness?: () => void;
  onSkip?: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {SYSTEM_PARTICIPATION_CHROME.eyebrow}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 scroll-mt-32 font-display text-3xl leading-tight text-foreground outline-none sm:text-4xl"
      >
        {SYSTEM_PARTICIPATION_CHROME.title}
      </h1>

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
        <section aria-label="Relationship with the wider system" className="mt-8 min-w-0">
          <p className="break-words text-sm leading-relaxed text-foreground">{view.classification}</p>
          <p className="mt-3 break-words text-sm leading-relaxed text-foreground">{view.anchor}</p>
          <div className="mt-6 space-y-4">
            {view.questions.map((question) => (
              <label key={question.id} className="block min-w-0" htmlFor={question.id}>
                <span className="break-words text-sm font-medium leading-relaxed text-foreground">
                  {question.prompt}
                </span>
                <textarea
                  id={question.id}
                  value={question.value}
                  onChange={(event) => onAnswer(question.id, event.target.value)}
                  aria-describedby="system-participation-guidance"
                  className="mt-2 min-h-28 w-full min-w-0 whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
              </label>
            ))}
          </div>
          <p id="system-participation-guidance" className="mt-3 break-words text-sm leading-relaxed text-foreground">
            {view.guidance}
          </p>
          {view.disclosure ? (
            <details className="mt-4 min-w-0">
              <summary className="cursor-pointer rounded-md text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
                {view.disclosure.summary}
              </summary>
              <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.disclosure.body}</p>
            </details>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-2">
            {onContinueToOtherness ? (
              <Button
                type="button"
                className="h-auto min-h-11 whitespace-normal px-4 py-2 text-center"
                onClick={onContinueToOtherness}
              >
                {SYSTEM_PARTICIPATION_CHROME.continue}
              </Button>
            ) : null}
            {onSkip ? (
              <Button
                type="button"
                variant="outline"
                className="h-auto min-h-11 whitespace-normal px-4 py-2 text-center"
                onClick={onSkip}
              >
                {SYSTEM_PARTICIPATION_CHROME.skip}
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mt-6">
        <Button type="button" variant="outline" onClick={onBackToEvidence}>
          {SYSTEM_PARTICIPATION_CHROME.back}
        </Button>
      </div>
    </main>
  );
}
