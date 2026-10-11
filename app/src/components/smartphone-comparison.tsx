import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMPARISON_CHROME,
  createComparisonState,
  describeComparison,
  reduceComparison,
} from "@/lib/smartphone/comparison-ux.mjs";

type ComparisonState = ReturnType<typeof createComparisonState>;
type ComparisonAction = Parameters<typeof reduceComparison>[1];
type ComparisonView = ReturnType<typeof describeComparison>;

const choiceClass = (selected: boolean) =>
  cn(
    "flex min-h-11 min-w-0 cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-paper",
    selected ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background",
  );

export function SmartphoneComparison({
  state,
  dispatch,
  view,
  onBackToInquiry,
}: {
  state: ComparisonState;
  dispatch: (action: ComparisonAction) => void;
  view: ComparisonView;
  onBackToInquiry: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl min-w-0 px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {COMPARISON_CHROME.eyebrow}
      </p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 scroll-mt-32 font-display text-3xl leading-tight text-foreground outline-none sm:text-4xl"
      >
        {COMPARISON_CHROME.title}
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

      <form
        className="mt-8 min-w-0 space-y-4"
        autoComplete="off"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset className="min-w-0">
          <legend className="font-display text-lg text-foreground">
            {COMPARISON_CHROME.pathwayLegend}
          </legend>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{view.selectionNote}</p>
          <div className="mt-3 space-y-2">
            {view.pathways.map((pathway) => (
              <label key={pathway.label} className={choiceClass(pathway.selected)}>
                <input
                  type="checkbox"
                  name="comparison-pathway"
                  value={pathway.label}
                  checked={pathway.selected}
                  onChange={() => dispatch({ type: "toggle", pathwayId: pathway.id })}
                  className="mt-0.5 size-4 shrink-0 accent-pine"
                />
                <span className="min-w-0 break-words">{pathway.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
          <label className="block min-w-0" htmlFor="comparison-horizon">
            <span className="font-display text-lg text-foreground">
              {COMPARISON_CHROME.horizonLabel}
            </span>
            <input
              id="comparison-horizon"
              inputMode="decimal"
              autoComplete="off"
              value={state.horizonRaw}
              onChange={(event) => dispatch({ type: "set_horizon", text: event.target.value })}
              aria-invalid={state.horizonRaw.trim().length > 0 && view.horizonYears == null}
              className="mt-3 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </label>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{view.horizonHelper}</p>
        </div>

        {view.remainingServiceField.visible ? (
          <div className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
            <label className="block min-w-0" htmlFor="remaining-service">
              <span className="font-display text-lg text-foreground">
                {view.remainingServiceField.label}
              </span>
              <input
                id="remaining-service"
                inputMode="decimal"
                autoComplete="off"
                value={state.remainingServiceRaw}
                onChange={(event) =>
                  dispatch({ type: "set_remaining_service", text: event.target.value })
                }
                aria-describedby="remaining-service-helper"
                aria-invalid={
                  state.remainingServiceRaw.trim().length > 0 &&
                  state.remainingServiceNotSure !== true &&
                  typeof view.remainingServiceField.parsedYears !== "number"
                }
                className="mt-3 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
            <p id="remaining-service-helper" className="mt-2 text-sm leading-relaxed text-foreground">
              {view.remainingServiceField.helper}
            </p>
            {view.remainingServiceField.notSureNote ? (
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {view.remainingServiceField.notSureNote}
              </p>
            ) : null}
            <div className="mt-3">
              <Button
                type="button"
                variant={state.remainingServiceNotSure ? "secondary" : "outline"}
                aria-pressed={state.remainingServiceNotSure}
                aria-label={view.remainingServiceField.notSureControl}
                className="h-auto min-h-11 whitespace-normal text-left"
                onClick={() => dispatch({ type: "mark_remaining_not_sure" })}
              >
                {view.remainingServiceField.notSureLabel}
              </Button>
            </div>
          </div>
        ) : null}

        {view.repairField.visible ? (
          <fieldset className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
            <legend id="repair-category-legend" className="font-display text-lg text-foreground">
              {view.repairField.legend}
            </legend>
            <p id="repair-category-helper" className="mt-2 text-sm leading-relaxed text-foreground">
              {view.repairField.helper}
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="group"
              aria-labelledby="repair-category-legend"
              aria-describedby="repair-category-helper"
            >
              {view.repairField.categories.map((category) => (
                <Button
                  key={category.label}
                  type="button"
                  variant={category.selected ? "secondary" : "outline"}
                  aria-pressed={category.selected}
                  className="h-auto min-h-11 whitespace-normal px-3 text-left"
                  onClick={() => dispatch({ type: "set_repair_category", categoryId: category.id })}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            <label className="mt-4 block min-w-0" htmlFor="post-repair-service">
              <span className="font-display text-lg text-foreground">{view.repairField.serviceLabel}</span>
              <input
                id="post-repair-service"
                inputMode="decimal"
                autoComplete="off"
                value={state.postRepairServiceRaw}
                onChange={(event) =>
                  dispatch({ type: "set_post_repair_service", text: event.target.value })
                }
                aria-describedby="post-repair-service-helper"
                aria-invalid={
                  state.postRepairServiceRaw.trim().length > 0 &&
                  state.postRepairServiceNotSure !== true &&
                  typeof view.repairField.parsedServiceYears !== "number"
                }
                className="mt-3 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
            <p id="post-repair-service-helper" className="mt-2 text-sm leading-relaxed text-foreground">
              {view.repairField.serviceHelper}
            </p>
            {view.repairField.notSureNote ? (
              <p className="mt-2 text-sm leading-relaxed text-foreground">{view.repairField.notSureNote}</p>
            ) : null}
            <div className="mt-3">
              <Button
                type="button"
                variant={state.postRepairServiceNotSure ? "secondary" : "outline"}
                aria-pressed={state.postRepairServiceNotSure}
                aria-label={view.repairField.notSureControl}
                className="h-auto min-h-11 whitespace-normal text-left"
                onClick={() => dispatch({ type: "mark_post_repair_not_sure" })}
              >
                {view.repairField.notSureLabel}
              </Button>
            </div>
          </fieldset>
        ) : null}

        {view.pendingNote ? (
          <p className="text-sm leading-relaxed text-foreground">{view.pendingNote}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onBackToInquiry}>
            {COMPARISON_CHROME.back}
          </Button>
          <Button type="button" variant="outline" onClick={() => dispatch({ type: "reset" })}>
            {COMPARISON_CHROME.reset}
          </Button>
        </div>
      </form>

      {view.evaluated ? (
        <section aria-live="polite" aria-label="Comparison results" className="mt-8 min-w-0">
          <h2 className="font-display text-2xl text-foreground">{COMPARISON_CHROME.resultHeading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{view.orderNote}</p>
          {view.horizonStatement ? (
            <p className="mt-2 break-words text-sm leading-relaxed text-foreground">
              {view.horizonStatement}
            </p>
          ) : null}
          <div className="mt-4 space-y-3">
            {view.cards.map((card) => (
              <article
                key={card.label}
                aria-label={card.label}
                className="min-w-0 rounded-2xl border-l-4 border-pine bg-paper px-4 py-4"
              >
                <h3 className="break-words font-display text-xl text-foreground">{card.label}</h3>
                <div className="mt-2 space-y-2">
                  {card.publicLines.map((line) => (
                    <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground">{view.boundary}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{view.laterNote}</p>
        </section>
      ) : null}
    </main>
  );
}
