import { useEffect, useRef } from "react";
import { SmartphoneLifecycleGuide } from "@/components/smartphone-lifecycle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMPARISON_CHROME,
  createComparisonState,
  describeComparison,
  reduceComparison,
} from "@/lib/smartphone/comparison-ux.mjs";
import { IMPACT_CHROME } from "@/lib/smartphone/impact-pathways-ux.mjs";

type ComparisonState = ReturnType<typeof createComparisonState>;
type ComparisonAction = Parameters<typeof reduceComparison>[1];
type ComparisonView = ReturnType<typeof describeComparison>;

function SourcesAndLimits({
  disclosure,
}: {
  disclosure: {
    heading: string;
    lines: string[];
  } | null;
}) {
  if (!disclosure) return null;
  return (
    <section aria-label={disclosure.heading} className="mt-3 space-y-2 rounded-lg bg-background px-3 py-3">
      <h4 className="text-sm font-medium text-foreground">{disclosure.heading}</h4>
      {disclosure.lines.map((line) => (
        <p key={line} className="break-words text-sm leading-relaxed text-foreground">
          {line}
        </p>
      ))}
    </section>
  );
}

type ComparisonCardView = ComparisonView["cards"][number];

function ComparisonCard({ card }: { card: ComparisonCardView }) {
  const valueLines = new Set<string>();
  for (const value of card.values as { line?: unknown }[]) {
    if (typeof value.line === "string") valueLines.add(value.line);
  }
  return (
    <article
      aria-label={card.label}
      className="min-w-0 rounded-2xl border-l-4 border-pine bg-paper px-4 py-4"
    >
      <h3 className="break-words border-b border-border pb-3 font-display text-xl text-foreground">
        {card.label}
      </h3>
      <div className="mt-4 max-w-prose space-y-3">
        {card.publicLines.map((line, index) => (
          <p
            key={line}
            className={cn(
              "break-words text-base leading-relaxed text-foreground",
              index === 0 && "font-medium",
              valueLines.has(line) && "rounded-md border-l-2 border-border bg-background px-3 py-2",
            )}
          >
            {line}
          </p>
        ))}
        <SourcesAndLimits disclosure={card.sourcesAndLimits} />
      </div>
    </article>
  );
}

const GUIDE_TARGET_ID = "comparison-lifecycle-guide";
const INPUTS_TARGET_ID = "comparison-inputs";
const GUIDE_LINK_LABEL = "Explore the phone lifecycle and sources";
const INPUTS_LINK_LABEL = "Back to comparison inputs";

const navLinkClass =
  "inline-block max-w-full break-words rounded-sm text-sm font-medium text-foreground underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

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
  onContinueToImpact,
}: {
  state: ComparisonState;
  dispatch: (action: ComparisonAction) => void;
  view: ComparisonView;
  onBackToInquiry: () => void;
  onContinueToImpact: () => void;
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
      <p className="mt-3">
        <a href={`#${GUIDE_TARGET_ID}`} className={navLinkClass}>
          {GUIDE_LINK_LABEL}
        </a>
      </p>

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
          <legend
            id={INPUTS_TARGET_ID}
            tabIndex={-1}
            className="scroll-mt-32 rounded-md font-display text-lg text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
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

        <fieldset className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
          <legend className="font-display text-lg text-foreground">{view.currentOwnedField.legend}</legend>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{view.currentOwnedField.helper}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {view.currentOwnedField.choices.map((choice) => (
              <Button
                key={choice.label}
                type="button"
                variant={choice.selected ? "secondary" : "outline"}
                aria-pressed={choice.selected}
                className="h-auto min-h-11 whitespace-normal px-3 text-left"
                onClick={() => dispatch({ type: "set_current_owned_model", modelId: choice.id })}
              >
                {choice.label}
              </Button>
            ))}
          </div>
          {view.currentOwnedHistory ? (
            <div className="mt-3 space-y-2" aria-label="Current phone source-model history">
              {view.currentOwnedHistory.lines.map((line) => (
                <p key={line} className="break-words text-sm leading-relaxed text-foreground">
                  {line}
                </p>
              ))}
              <SourcesAndLimits disclosure={view.currentOwnedHistory.sourcesAndLimits} />
            </div>
          ) : null}
        </fieldset>

        {view.candidateNewField.visible ? (
          <fieldset className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
            <legend className="font-display text-lg text-foreground">{view.candidateNewField.legend}</legend>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{view.candidateNewField.helper}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {view.candidateNewField.choices.map((choice) => (
                <Button
                  key={choice.label}
                  type="button"
                  variant={choice.selected ? "secondary" : "outline"}
                  aria-pressed={choice.selected}
                  className="h-auto min-h-11 whitespace-normal px-3 text-left"
                  onClick={() => dispatch({ type: "set_candidate_new_model", modelId: choice.id })}
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          </fieldset>
        ) : null}

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

        {view.usedServiceField.visible ? (
          <div className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
            <label className="block min-w-0" htmlFor="used-candidate-service">
              <span className="font-display text-lg text-foreground">{view.usedServiceField.label}</span>
              <input
                id="used-candidate-service"
                inputMode="decimal"
                autoComplete="off"
                value={state.usedServiceRaw}
                onChange={(event) => dispatch({ type: "set_used_service", text: event.target.value })}
                aria-describedby="used-candidate-service-helper"
                aria-invalid={
                  state.usedServiceRaw.trim().length > 0 &&
                  state.usedServiceNotSure !== true &&
                  typeof view.usedServiceField.parsedYears !== "number"
                }
                className="mt-3 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
            <p id="used-candidate-service-helper" className="mt-2 text-sm leading-relaxed text-foreground">
              {view.usedServiceField.helper}
            </p>
            {view.usedServiceField.notSureNote ? (
              <p className="mt-2 text-sm leading-relaxed text-foreground">{view.usedServiceField.notSureNote}</p>
            ) : null}
            <div className="mt-3">
              <Button
                type="button"
                variant={state.usedServiceNotSure ? "secondary" : "outline"}
                aria-pressed={state.usedServiceNotSure}
                aria-label={view.usedServiceField.notSureControl}
                className="h-auto min-h-11 whitespace-normal text-left"
                onClick={() => dispatch({ type: "mark_used_not_sure" })}
              >
                {view.usedServiceField.notSureLabel}
              </Button>
            </div>
          </div>
        ) : null}

        {view.refurbishedServiceField.visible ? (
          <div className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
            <label className="block min-w-0" htmlFor="refurbished-candidate-service">
              <span className="font-display text-lg text-foreground">
                {view.refurbishedServiceField.label}
              </span>
              <input
                id="refurbished-candidate-service"
                inputMode="decimal"
                autoComplete="off"
                value={state.refurbishedServiceRaw}
                onChange={(event) =>
                  dispatch({ type: "set_refurbished_service", text: event.target.value })
                }
                aria-describedby="refurbished-candidate-service-helper"
                aria-invalid={
                  state.refurbishedServiceRaw.trim().length > 0 &&
                  state.refurbishedServiceNotSure !== true &&
                  typeof view.refurbishedServiceField.parsedYears !== "number"
                }
                className="mt-3 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </label>
            <p
              id="refurbished-candidate-service-helper"
              className="mt-2 text-sm leading-relaxed text-foreground"
            >
              {view.refurbishedServiceField.helper}
            </p>
            {view.refurbishedServiceField.notSureNote ? (
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {view.refurbishedServiceField.notSureNote}
              </p>
            ) : null}
            <div className="mt-3">
              <Button
                type="button"
                variant={state.refurbishedServiceNotSure ? "secondary" : "outline"}
                aria-pressed={state.refurbishedServiceNotSure}
                aria-label={view.refurbishedServiceField.notSureControl}
                className="h-auto min-h-11 whitespace-normal text-left"
                onClick={() => dispatch({ type: "mark_refurbished_not_sure" })}
              >
                {view.refurbishedServiceField.notSureLabel}
              </Button>
            </div>
          </div>
        ) : null}

        {view.oldPhoneFate.visible ? (
          <fieldset
            className="min-w-0 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]"
            data-content-id={view.oldPhoneFate.contentId}
          >
            <legend
              id="anticipated-old-phone-fate-legend"
              className="font-display text-lg text-foreground"
              data-content-id={view.oldPhoneFate.question.id}
            >
              {view.oldPhoneFate.question.text}
            </legend>
            <p
              id="anticipated-old-phone-fate-helper"
              className="mt-2 break-words text-sm leading-relaxed text-foreground"
              data-content-id={view.oldPhoneFate.helper.id}
            >
              {view.oldPhoneFate.helper.text}
            </p>
            <div
              className="mt-3 space-y-2"
              role="radiogroup"
              aria-labelledby="anticipated-old-phone-fate-legend"
              aria-describedby="anticipated-old-phone-fate-helper"
            >
              {view.oldPhoneFate.choices.map((choice) => (
                <label key={choice.label} className={choiceClass(choice.selected)}>
                  <input
                    type="radio"
                    name="anticipated-old-phone-fate"
                    value={choice.label}
                    checked={choice.selected}
                    data-content-id={choice.contentId}
                    onChange={() =>
                      dispatch({ type: "set_anticipated_old_phone_fate", fate: choice.id })
                    }
                    className="mt-0.5 size-4 shrink-0 accent-pine"
                  />
                  <span className="min-w-0 break-words">{choice.label}</span>
                </label>
              ))}
            </div>
            {view.oldPhoneFate.status ? (
              <p
                className="mt-3 break-words text-sm leading-relaxed text-foreground"
                data-content-id={view.oldPhoneFate.status.id}
              >
                {view.oldPhoneFate.status.text}
              </p>
            ) : null}
            {view.oldPhoneFate.limit ? (
              <p
                className="mt-2 break-words text-sm leading-relaxed text-foreground"
                data-content-id={view.oldPhoneFate.limit.id}
              >
                {view.oldPhoneFate.limit.text}
              </p>
            ) : null}
            {state.anticipatedOldPhoneFate != null ? (
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  data-content-id={view.oldPhoneFate.clearContentId}
                  className="h-auto min-h-11 whitespace-normal text-left"
                  onClick={() => dispatch({ type: "clear_anticipated_old_phone_fate" })}
                >
                  {view.oldPhoneFate.clearLabel}
                </Button>
              </div>
            ) : null}
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
              <ComparisonCard key={card.label} card={card} />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground">{view.boundary}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{view.laterNote}</p>
          <div className="mt-4">
            <Button type="button" onClick={onContinueToImpact}>
              {IMPACT_CHROME.continueFromComparison}
            </Button>
          </div>
        </section>
      ) : null}

      <SmartphoneLifecycleGuide headingId={GUIDE_TARGET_ID} />
      {view.modelGuideNote ? (
        <p className="mt-3 break-words text-sm leading-relaxed text-foreground">{view.modelGuideNote}</p>
      ) : null}
      <p className="mt-6">
        <a href={`#${INPUTS_TARGET_ID}`} className={navLinkClass}>
          {INPUTS_LINK_LABEL}
        </a>
      </p>
    </main>
  );
}
