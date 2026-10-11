import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INQUIRY_CHROME,
  createInquiryState,
  describeInquiry,
  reduceInquiry,
} from "@/lib/smartphone/ap-inquiry-ux.mjs";

type InquiryState = ReturnType<typeof createInquiryState>;
type InquiryAction = Parameters<typeof reduceInquiry>[1];

const choiceClass = (selected: boolean) =>
  cn(
    "flex min-h-11 min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-paper",
    selected ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background",
  );

export function SmartphoneInquiry({
  state,
  dispatch,
  onBackToSituation,
}: {
  state: InquiryState;
  dispatch: (action: InquiryAction) => void;
  onBackToSituation: () => void;
}) {
  const view = describeInquiry(state);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "nearest" });
  }, [state.activeIndex, state.phase]);

  const question = view.question;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {INQUIRY_CHROME.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
        {INQUIRY_CHROME.title}
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

      {question ? (
        <form
          className="mt-8 min-w-0"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            if (!view.canContinue) return;
            dispatch({ type: "continue" });
          }}
        >
          {view.progressLabel ? (
            <p className="text-sm font-medium text-pine">{view.progressLabel}</p>
          ) : null}
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 scroll-mt-32 font-display text-2xl leading-snug text-foreground outline-none"
          >
            {question.exactQuestionText}
          </h2>
          <label className="mt-4 block min-w-0" htmlFor="inquiry-answer">
            <span className="text-sm font-medium text-foreground">{INQUIRY_CHROME.answerLabel}</span>
            <textarea
              id="inquiry-answer"
              value={question.exactAnswer}
              onChange={(event) =>
                dispatch({
                  type: "set_raw",
                  questionId: question.questionId,
                  text: event.target.value,
                })
              }
              aria-describedby="inquiry-answer-helper"
              className="mt-2 min-h-28 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </label>
          <p id="inquiry-answer-helper" className="mt-2 text-sm leading-relaxed text-foreground">
            {view.answerHelper}
          </p>
          <div className="mt-3">
            <Button
              type="button"
              variant={question.notSureSelected ? "secondary" : "outline"}
              onClick={() => dispatch({ type: "mark_not_sure", questionId: question.questionId })}
            >
              {INQUIRY_CHROME.notSure}
            </Button>
          </div>
          {view.showStructuredChoices ? (
            <StructuredAnswers view={view} dispatch={dispatch} />
          ) : null}
          <div className="mt-6 flex scroll-mt-32 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (view.atFirstQuestion) onBackToSituation();
                else dispatch({ type: "back" });
              }}
            >
              {INQUIRY_CHROME.back}
            </Button>
            <Button type="submit" disabled={!view.canContinue}>
              {INQUIRY_CHROME.continue}
            </Button>
            <Button type="button" variant="outline" onClick={() => dispatch({ type: "reset" })}>
              {INQUIRY_CHROME.reset}
            </Button>
          </div>
        </form>
      ) : null}

      {view.review ? (
        <section aria-label="Your answers" className="mt-8 min-w-0">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="scroll-mt-32 font-display text-2xl text-foreground outline-none"
          >
            {INQUIRY_CHROME.reviewHeading}
          </h2>
          {view.incompleteNote ? (
            <p className="mt-3 text-sm leading-relaxed text-foreground">{view.incompleteNote}</p>
          ) : null}
          <div className="mt-4 space-y-4">
            {view.review.map((answer) => (
              <label key={answer.questionId} className="block min-w-0">
                <span className="block break-words font-display text-lg leading-snug text-foreground">
                  {answer.exactQuestionText}
                </span>
                <textarea
                  value={answer.exactAnswer}
                  onChange={(event) =>
                    dispatch({
                      type: "set_raw",
                      questionId: answer.questionId,
                      text: event.target.value,
                    })
                  }
                  className="mt-2 min-h-24 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
              </label>
            ))}
          </div>
          {view.showStructuredChoices ? (
            <div className="mt-6">
              <StructuredAnswers view={view} dispatch={dispatch} />
            </div>
          ) : null}
          <p className="mt-6 text-sm leading-relaxed text-foreground">{view.boundary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => dispatch({ type: "back" })}>
              {INQUIRY_CHROME.back}
            </Button>
            <Button type="button" variant="outline" onClick={() => dispatch({ type: "reset" })}>
              {INQUIRY_CHROME.reset}
            </Button>
          </div>
          <section aria-label="Still ahead" className="mt-8 rounded-2xl bg-paper px-4 py-4">
            <h3 className="font-display text-xl text-foreground">{INQUIRY_CHROME.laterHeading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{view.laterNote}</p>
          </section>
        </section>
      ) : null}
    </main>
  );
}

function StructuredAnswers({
  view,
  dispatch,
}: {
  view: ReturnType<typeof describeInquiry>;
  dispatch: (action: InquiryAction) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <fieldset className="min-w-0">
        <legend className="font-display text-lg text-foreground">{INQUIRY_CHROME.choiceLegend}</legend>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{view.choiceNote}</p>
        <div className="mt-3 space-y-2">
          {view.choices.map((choice) => (
            <label key={choice.value} className={choiceClass(choice.selected)}>
              <input
                type="radio"
                name="q6-choice"
                value={choice.value}
                checked={choice.selected}
                onChange={() => dispatch({ type: "set_choice", value: choice.value })}
                className="size-4 shrink-0 accent-pine"
              />
              <span className="min-w-0 break-words">{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="min-w-0">
        <legend className="font-display text-lg text-foreground">{INQUIRY_CHROME.shiftLegend}</legend>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{view.shiftNote}</p>
        <div className="mt-3 space-y-2">
          {view.shifts.map((shift) => (
            <label key={shift.value} className={choiceClass(shift.selected)}>
              <input
                type="radio"
                name="q6-shift"
                value={shift.value}
                checked={shift.selected}
                onChange={() => dispatch({ type: "set_shift", value: shift.value })}
                className="size-4 shrink-0 accent-pine"
              />
              <span className="min-w-0 break-words">{shift.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
