import { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SmartphoneComparison } from "@/components/smartphone-comparison";
import { SmartphoneFinalChoice } from "@/components/smartphone-final-choice";
import { SmartphoneImpact } from "@/components/smartphone-impact";
import { SmartphoneInquiry } from "@/components/smartphone-inquiry";
import { SmartphoneOtherness } from "@/components/smartphone-otherness";
import { SmartphoneSystemParticipation } from "@/components/smartphone-system-participation";
import { cn } from "@/lib/utils";
import {
  INQUIRY_CHROME,
  canEnterInquiry,
  createInquiryState,
  inquiryStateAfterSituationAction,
  reduceInquiry,
} from "@/lib/smartphone/ap-inquiry-ux.mjs";
import {
  canEnterComparison,
  comparisonStateAfterInquiryAction,
  comparisonStateAfterSituationAction,
  createComparisonState,
  describeComparison,
  reduceComparison,
} from "@/lib/smartphone/comparison-ux.mjs";
import {
  canEnterOtherness,
  createOthernessState,
  describeOtherness,
  othernessStateAfterComparisonAction,
  othernessStateAfterInquiryAction,
  othernessStateAfterSituationAction,
  reduceOtherness,
} from "@/lib/smartphone/ap-otherness-ux.mjs";
import {
  canEnterFinalChoice,
  createFinalChoiceState,
  describeFinalChoice,
  finalChoiceStateAfterComparisonAction,
  finalChoiceStateAfterInquiryAction,
  finalChoiceStateAfterOthernessAction,
  finalChoiceStateAfterParticipationAction,
  finalChoiceStateAfterSituationAction,
  reduceFinalChoice,
} from "@/lib/smartphone/final-choice-ux.mjs";
import { projectGenericNewClimateConsequence, consequenceBindingKey } from "@/lib/smartphone/empirical-consequence.mjs";
import {
  SYSTEM_PARTICIPATION_ANCHOR,
  createSystemParticipationState,
  describeSystemParticipation,
  participationStateAfterComparisonAction,
  participationStateAfterInquiryAction,
  participationStateAfterSituationAction,
  reduceSystemParticipation,
} from "@/lib/smartphone/system-participation-ux.mjs";
import {
  canEnterImpact,
  createImpactState,
  describeImpact,
  impactContextFromComparison,
  impactStateAfterComparisonAction,
  impactStateAfterInquiryAction,
  impactStateAfterSituationAction,
  reduceImpact,
} from "@/lib/smartphone/impact-pathways-ux.mjs";
import {
  SITUATION_CHROME,
  createSituationState,
  describeSituation,
  reduceSituation,
} from "@/lib/smartphone/situation-ux.mjs";

export function SmartphoneSituation() {
  const [state, dispatchSituation] = useReducer(reduceSituation, createSituationState());
  const [inquiry, dispatchInquiry] = useReducer(reduceInquiry, createInquiryState());
  const [comparison, dispatchComparison] = useReducer(reduceComparison, createComparisonState());
  const [impact, dispatchImpact] = useReducer(reduceImpact, createImpactState());
  const [otherness, dispatchOtherness] = useReducer(reduceOtherness, createOthernessState());
  const [participation, dispatchParticipation] = useReducer(
    reduceSystemParticipation,
    createSystemParticipationState(),
  );
  const [finalChoice, dispatchFinalChoice] = useReducer(reduceFinalChoice, createFinalChoiceState());
  const [comparisonEntered, setComparisonEntered] = useState(false);
  const [step, setStep] = useState<
    "situation" | "inquiry" | "comparison" | "impact" | "participation" | "otherness" | "choice"
  >("situation");
  const view = describeSituation(state);
  const resultRef = useRef<HTMLElement>(null);
  const comparisonView = describeComparison(comparison, {
    inquiryReviewComplete: canEnterComparison(inquiry),
    situationAnswers: state.submitted ? state.answers : null,
  });
  const impactView = describeImpact(
    impact,
    impactContextFromComparison(comparisonView, { comparisonEntered }),
  );
  const climateConsequence = projectGenericNewClimateConsequence(impactView);
  const climateBindingKey = consequenceBindingKey(climateConsequence);
  const participationView = describeSystemParticipation(participation, { record: climateConsequence });
  const othernessView = describeOtherness(otherness, {
    impactAvailable: impactView.available,
    displayedRecords: climateConsequence ? [climateConsequence] : [],
    requireFullResearchRecord: true,
    empiricalAnchor: climateConsequence ? SYSTEM_PARTICIPATION_ANCHOR : null,
  });
  const finalChoiceView = describeFinalChoice(finalChoice, {
    othernessEntered: othernessView.available,
    othernessActivated: othernessView.activated,
    othernessResponse: otherness.response,
    othernessFollowUp: otherness.followUp,
    provisionalChoice: inquiry.provisionalSelection,
    inspectedPathways: comparisonView.pathways,
  });

  function onSituation(action: Parameters<typeof dispatchSituation>[0]) {
    const nextInquiry = inquiryStateAfterSituationAction(action.type, inquiry);
    if (nextInquiry !== inquiry) {
      dispatchInquiry({ type: "reset" });
      setStep("situation");
    }
    const nextComparison = comparisonStateAfterSituationAction(action.type, comparison);
    if (nextComparison !== comparison) {
      dispatchComparison({ type: "reset" });
      setStep("situation");
    }
    const nextImpact = impactStateAfterSituationAction(action.type, impact);
    if (nextImpact !== impact) {
      dispatchImpact({ type: "clear" });
      setComparisonEntered(false);
      setStep("situation");
    }
    const nextOtherness = othernessStateAfterSituationAction(action.type, otherness);
    if (nextOtherness !== otherness) {
      dispatchOtherness({ type: "clear" });
      setStep("situation");
    }
    const nextParticipation = participationStateAfterSituationAction(action.type, participation);
    if (nextParticipation !== participation) {
      dispatchParticipation({ type: "clear" });
      setStep("situation");
    }
    const nextFinalChoice = finalChoiceStateAfterSituationAction(action.type, finalChoice);
    if (nextFinalChoice !== finalChoice) {
      dispatchFinalChoice({ type: "clear" });
      setStep("situation");
    }
    dispatchSituation(action);
  }

  function onInquiry(action: Parameters<typeof dispatchInquiry>[0]) {
    const nextComparison = comparisonStateAfterInquiryAction(action.type, comparison);
    if (nextComparison !== comparison) {
      dispatchComparison({ type: "reset" });
      if (step === "comparison" || step === "impact" || step === "otherness") setStep("inquiry");
    }
    const nextImpact = impactStateAfterInquiryAction(action.type, impact);
    if (nextImpact !== impact) {
      dispatchImpact({ type: "clear" });
      setComparisonEntered(false);
      if (step === "comparison" || step === "impact" || step === "otherness") setStep("inquiry");
    }
    const nextOtherness = othernessStateAfterInquiryAction(action.type, otherness);
    if (nextOtherness !== otherness) {
      dispatchOtherness({ type: "clear" });
      if (
        step === "comparison" ||
        step === "impact" ||
        step === "participation" ||
        step === "otherness" ||
        step === "choice"
      ) {
        setStep("inquiry");
      }
    }
    const nextParticipation = participationStateAfterInquiryAction(action.type, participation);
    if (nextParticipation !== participation) {
      dispatchParticipation({ type: "clear" });
      if (
        step === "comparison" ||
        step === "impact" ||
        step === "participation" ||
        step === "otherness" ||
        step === "choice"
      ) {
        setStep("inquiry");
      }
    }
    const nextFinalChoice = finalChoiceStateAfterInquiryAction(action.type, finalChoice);
    if (nextFinalChoice !== finalChoice) {
      dispatchFinalChoice({ type: "clear" });
      if (step === "comparison" || step === "impact" || step === "otherness" || step === "choice") {
        setStep("inquiry");
      }
    }
    dispatchInquiry(action);
  }

  function onComparison(action: Parameters<typeof dispatchComparison>[0]) {
    const nextImpact = impactStateAfterComparisonAction(action.type, impact);
    if (nextImpact !== impact) {
      dispatchImpact({ type: "clear" });
      if (step === "impact" || step === "otherness" || step === "choice") setStep("comparison");
    }
    const nextOtherness = othernessStateAfterComparisonAction(action.type, otherness);
    if (nextOtherness !== otherness) {
      dispatchOtherness({ type: "clear" });
      if (step === "participation" || step === "otherness" || step === "choice") setStep("comparison");
    }
    const nextParticipation = participationStateAfterComparisonAction(action.type, participation);
    if (nextParticipation !== participation) {
      dispatchParticipation({ type: "clear" });
      if (step === "participation" || step === "otherness" || step === "choice") setStep("comparison");
    }
    const nextFinalChoice = finalChoiceStateAfterComparisonAction(action.type, finalChoice);
    if (nextFinalChoice !== finalChoice) {
      dispatchFinalChoice({ type: "clear" });
      if (step === "choice") setStep("comparison");
    }
    dispatchComparison(action);
  }

  function onParticipation(action: {
    type: "open" | "skip" | "continue" | "set_qsp1" | "set_qsp2" | "set_qsp3" | "clear";
    text?: string;
    bindingKey?: string | null;
    refs?: string[];
  }) {
    const nextFinalChoice = finalChoiceStateAfterParticipationAction(action.type, finalChoice);
    if (nextFinalChoice !== finalChoice) {
      dispatchFinalChoice({ type: "clear" });
      if (step === "choice") setStep("participation");
    }
    dispatchParticipation(action);
  }

  function openOtherness() {
    if (!canEnterOtherness({ impactAvailable: impactView.available })) return;
    dispatchOtherness({ type: "open" });
    setStep("otherness");
  }

  function onOtherness(action: { type: "set_response" | "set_follow_up" | "clear"; text?: string }) {
    const nextFinalChoice = finalChoiceStateAfterOthernessAction(action.type, finalChoice);
    if (nextFinalChoice !== finalChoice) {
      dispatchFinalChoice({ type: "clear" });
      if (step === "choice") setStep("otherness");
    }
    dispatchOtherness(action);
  }

  function returnToImpact() {
    setStep("impact");
  }

  useEffect(() => {
    if (step !== "situation" || !state.submitted) return;
    resultRef.current?.scrollIntoView({ block: "nearest" });
  }, [state.submitted, step]);

  useEffect(() => {
    if (participation.binding_key === null || participation.binding_key === climateBindingKey) return;
    dispatchParticipation({ type: "clear" });
    dispatchOtherness({ type: "clear" });
    dispatchFinalChoice({ type: "clear" });
    if (step === "participation" || step === "otherness" || step === "choice") setStep("impact");
  }, [climateBindingKey, participation.binding_key, step]);

  if (step === "choice") {
    return (
      <SmartphoneFinalChoice
        view={finalChoiceView}
        onBackToOtherness={() => setStep("otherness")}
        onSelect={(value) => dispatchFinalChoice({ type: "set_choice", value })}
        onReset={() => dispatchFinalChoice({ type: "reset" })}
      />
    );
  }

  if (step === "participation") {
    const bindingKey = participationView.binding_key;
    const refs = climateConsequence ? [climateConsequence.consequence_ref_id] : [];
    return (
      <SmartphoneSystemParticipation
        view={participationView}
        onBackToEvidence={() => setStep("impact")}
        onAnswer={(id, text) => {
          if (id === "qsp1") onParticipation({ type: "set_qsp1", text });
          else if (id === "qsp2") onParticipation({ type: "set_qsp2", text });
          else onParticipation({ type: "set_qsp3", text });
        }}
        onSkip={() => {
          if (!bindingKey) return;
          onParticipation({ type: "skip", bindingKey, refs });
          openOtherness();
        }}
        onContinueToOtherness={() => {
          if (!bindingKey) return;
          onParticipation({ type: "continue" });
          openOtherness();
        }}
      />
    );
  }

  if (step === "otherness") {
    return (
      <SmartphoneOtherness
        view={othernessView}
        onBackToImpact={returnToImpact}
        onResponse={(text) => onOtherness({ type: "set_response", text })}
        onFollowUp={(text) => onOtherness({ type: "set_follow_up", text })}
        onContinueToFinalChoice={() => {
          if (!canEnterFinalChoice({ othernessEntered: othernessView.available })) return;
          dispatchFinalChoice({ type: "open" });
          setStep("choice");
        }}
      />
    );
  }

  if (step === "impact") {
    return (
      <SmartphoneImpact
        view={impactView}
        onBackToComparison={() => setStep("comparison")}
        onContinueToOtherness={openOtherness}
        systemParticipation={
          climateConsequence
            ? { anchor: SYSTEM_PARTICIPATION_ANCHOR }
            : null
        }
        onReflect={() => {
          if (!climateConsequence || !participationView.binding_key) return;
          onParticipation({
            type: "open",
            bindingKey: participationView.binding_key,
            refs: [climateConsequence.consequence_ref_id],
          });
          setStep("participation");
        }}
        onSkipReflection={() => {
          if (!climateConsequence || !participationView.binding_key) return;
          onParticipation({
            type: "skip",
            bindingKey: participationView.binding_key,
            refs: [climateConsequence.consequence_ref_id],
          });
          openOtherness();
        }}
      />
    );
  }

  if (step === "comparison") {
    return (
      <SmartphoneComparison
        state={comparison}
        dispatch={onComparison}
        view={comparisonView}
        onBackToInquiry={() => setStep("inquiry")}
        onContinueToImpact={() => {
          if (
            !canEnterImpact({
              comparisonAvailable: comparisonView.available,
              comparisonEntered: true,
              comparisonEvaluated: comparisonView.evaluated,
            })
          ) {
            return;
          }
          setComparisonEntered(true);
          dispatchImpact({ type: "open" });
          setStep("impact");
        }}
      />
    );
  }

  if (step === "inquiry") {
    return (
      <SmartphoneInquiry
        state={inquiry}
        dispatch={onInquiry}
        onBackToSituation={() => setStep("situation")}
        onContinueToComparison={() => {
          if (!canEnterComparison(inquiry)) return;
          setComparisonEntered(true);
          setStep("comparison");
        }}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {SITUATION_CHROME.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
        {SITUATION_CHROME.title}
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
                <span className="block text-sm text-muted-foreground">{stage.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <form
        className="mt-8 space-y-4"
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          if (!view.canSubmit) return;
          onSituation({ type: "submit" });
        }}
        onFocus={(event) => {
          if (!(event.target instanceof HTMLElement)) return;
          const target = event.target.closest("label, button");
          (target instanceof HTMLElement ? target : event.target).scrollIntoView({
            block: "nearest",
          });
        }}
      >
        {view.questions.map((question) => {
          const helperId = `${question.id}-helper`;
          return (
            <fieldset
              key={question.id}
              aria-describedby={helperId}
              className="min-w-0 scroll-mt-32 rounded-2xl bg-paper p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]"
            >
              <legend className="px-0.5 font-display text-lg leading-snug text-foreground">
                {question.question}
              </legend>
              <p id={helperId} className="mt-2 text-sm leading-relaxed text-foreground">
                {question.helper}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {question.choices.map((choice) => {
                  const choiceId =
                    choice.value === true ? "yes" : choice.value === false ? "no" : "unknown";
                  return (
                    <label
                      key={choiceId}
                      className={cn(
                        "flex min-h-11 min-w-0 scroll-mt-32 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-1.5 py-2 text-center text-sm text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-paper",
                        choice.checked
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-background",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={choiceId}
                        checked={choice.checked}
                        onChange={() =>
                          onSituation({ type: "select", field: question.id, value: choice.value })
                        }
                        className="size-4 shrink-0 accent-pine"
                      />
                      <span>{choice.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        {view.pendingNote ? (
          <p className="text-sm leading-relaxed text-foreground">{view.pendingNote}</p>
        ) : null}

        <div className="flex scroll-mt-32 flex-wrap gap-2">
          <Button type="submit" className="scroll-mt-32" disabled={!view.canSubmit}>
            {SITUATION_CHROME.submit}
          </Button>
          {view.editAvailable ? (
            <Button
              type="button"
              variant="outline"
              className="scroll-mt-32"
              onClick={() => onSituation({ type: "edit" })}
            >
              {SITUATION_CHROME.edit}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="scroll-mt-32"
            onClick={() => onSituation({ type: "reset" })}
          >
            {SITUATION_CHROME.reset}
          </Button>
        </div>
      </form>

      {view.result ? (
        <section
          aria-live="polite"
          aria-label="Situation status"
          ref={resultRef}
          className="mt-8 scroll-mt-32 rounded-2xl border-l-4 border-pine bg-paper px-4 py-4"
        >
          <h2 className="font-display text-2xl text-foreground">{SITUATION_CHROME.resultHeading}</h2>
          <p className="mt-2 font-display text-xl text-pine">{view.result.ordinaryStatus}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{view.result.producedBy}</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
            {view.result.facts.map((fact) => (
              <li key={fact.question}>
                <span>{fact.question}</span>{" "}
                <span className="font-medium">{fact.answer}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{view.result.keepAsIs}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{view.result.boundary}</p>
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => {
                if (!canEnterInquiry(view.result)) return;
                setStep("inquiry");
              }}
            >
              {INQUIRY_CHROME.continueFromSituation}
            </Button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
