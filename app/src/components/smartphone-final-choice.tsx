import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FINAL_CHOICE_CHROME, describeFinalChoice } from "@/lib/smartphone/final-choice-ux.mjs";

type FinalChoiceView = ReturnType<typeof describeFinalChoice>;

const choiceClass = (selected: boolean) =>
  cn(
    "flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-paper",
    selected ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background",
  );

export function SmartphoneFinalChoice({
  view,
  onBackToOtherness,
  onSelect,
  onReset,
}: {
  view: FinalChoiceView;
  onBackToOtherness: () => void;
  onSelect: (value: string) => void;
  onReset: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {FINAL_CHOICE_CHROME.eyebrow}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 scroll-mt-32 font-display text-3xl leading-tight text-foreground outline-none sm:text-4xl"
      >
        {FINAL_CHOICE_CHROME.title}
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
        <section aria-label="User choice" className="mt-8 min-w-0">
          {view.provisional ? (
            <div className="min-w-0">
              <h2 className="font-display text-xl text-foreground">{view.provisional.heading}</h2>
              {view.provisional.label ? (
                <p className="mt-2 break-words text-sm text-foreground">{view.provisional.label}</p>
              ) : (
                <p className="mt-2 break-words text-sm text-foreground">{view.provisional.absentNote}</p>
              )}
              <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.provisional.note}</p>
            </div>
          ) : null}

          {view.inspected ? (
            <div className="mt-6 min-w-0">
              <h2 className="font-display text-xl text-foreground">{view.inspected.heading}</h2>
              {view.inspected.labels.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {view.inspected.labels.map((label) => (
                    <li key={label} className="break-words text-sm text-foreground">
                      {label}
                    </li>
                  ))}
                </ul>
              ) : null}
              {view.inspected.absentNote ? (
                <p className="mt-2 break-words text-sm text-foreground">{view.inspected.absentNote}</p>
              ) : null}
              {view.inspected.unknownNote ? (
                <p className="mt-2 break-words text-sm text-foreground">{view.inspected.unknownNote}</p>
              ) : null}
              {view.inspected.note ? (
                <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.inspected.note}</p>
              ) : null}
            </div>
          ) : null}

          {view.otherness ? (
            <div className="mt-6 min-w-0">
              <h2 className="font-display text-xl text-foreground">{view.otherness.heading}</h2>
              <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.otherness.note}</p>
              {view.otherness.response !== null ? (
                <div className="mt-3 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">{view.otherness.responseHeading}</h3>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
                    {view.otherness.response}
                  </p>
                </div>
              ) : null}
              {view.otherness.followUp !== null ? (
                <div className="mt-3 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">{view.otherness.followUpHeading}</h3>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
                    {view.otherness.followUp}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <form
            className="mt-6 min-w-0"
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <fieldset className="min-w-0">
              <legend className="font-display text-lg text-foreground">{FINAL_CHOICE_CHROME.legend}</legend>
              <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.orderNote}</p>
              <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.ordinaryNote}</p>
              <div className="mt-3 space-y-2">
                {view.options.map((option) => (
                  <label key={option.id} className={choiceClass(option.selected)}>
                    <input
                      type="radio"
                      name="present-choice"
                      value={option.id}
                      checked={option.selected}
                      onChange={() => onSelect(option.id)}
                      className="size-4 shrink-0 accent-pine"
                    />
                    <span className="min-w-0 break-words">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </form>

          <p className="mt-4 break-words text-sm leading-relaxed text-foreground">{view.adequacyNote}</p>
          <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.boundary}</p>

          {view.completion ? (
            <div aria-live="polite" className="mt-4 min-w-0 rounded-2xl bg-paper px-4 py-4">
              <p className="break-words text-sm leading-relaxed text-foreground">{view.completion}</p>
              <p className="mt-2 break-words text-sm leading-relaxed text-foreground">{view.changeNote}</p>
            </div>
          ) : null}

          <div className="mt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              {FINAL_CHOICE_CHROME.reset}
            </Button>
          </div>
        </section>
      ) : (
        <p className="mt-8 text-sm leading-relaxed text-foreground">{view.closedNote}</p>
      )}

      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-11 whitespace-normal px-4 py-2 text-center"
          onClick={onBackToOtherness}
        >
          {FINAL_CHOICE_CHROME.back}
        </Button>
      </div>
    </main>
  );
}
