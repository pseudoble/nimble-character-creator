"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCreator } from "./context";
import { STEP_IDS } from "./constants";
import { DebugPanel } from "./debug-panel";
import { StepOneForm } from "./step-one-form";
import { StepTwoForm } from "./step-two-form";
import { StepThreeForm } from "./step-three-form";
import { StepFourForm } from "./step-four-form";
import { getValidClassIds } from "./step-one-validation";
import { getValidAncestryIds, getValidBackgroundIds } from "./step-two-validation";
import { getValidStatArrayIds, getValidSkillIds } from "./step-three-validation";

const STEP_ORDER = [
  STEP_IDS.CHARACTER_BASICS,
  STEP_IDS.ANCESTRY_BACKGROUND,
  STEP_IDS.STATS_SKILLS,
  STEP_IDS.LANGUAGES_EQUIPMENT,
] as const;

const STEP_LABELS: Record<string, string> = {
  [STEP_IDS.CHARACTER_BASICS]: "Character Basics",
  [STEP_IDS.ANCESTRY_BACKGROUND]: "Ancestry & Background",
  [STEP_IDS.STATS_SKILLS]: "Stats & Skills",
  [STEP_IDS.LANGUAGES_EQUIPMENT]: "Languages & Equipment",
};

function useStepSummary(stepId: string): string | null {
  const { draft } = useCreator();
  if (!draft) return null;

  switch (stepId) {
    case STEP_IDS.CHARACTER_BASICS: {
      const { classId, name } = draft.stepOne;
      if (!classId && !name) return null;
      const parts: string[] = [];
      if (classId) parts.push(classId.charAt(0).toUpperCase() + classId.slice(1));
      if (name) parts.push(name);
      return parts.join(" · ");
    }
    case STEP_IDS.ANCESTRY_BACKGROUND: {
      const { ancestryId, backgroundId } = draft.stepTwo;
      if (!ancestryId && !backgroundId) return null;
      const parts: string[] = [];
      if (ancestryId) parts.push(ancestryId.charAt(0).toUpperCase() + ancestryId.slice(1));
      if (backgroundId) parts.push(backgroundId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
      return parts.join(" · ");
    }
    case STEP_IDS.STATS_SKILLS: {
      const { stats } = draft.stepThree;
      const hasStats = stats.str || stats.dex || stats.int || stats.wil;
      if (!hasStats) return null;
      return `STR ${stats.str || "–"} DEX ${stats.dex || "–"} INT ${stats.int || "–"} WIL ${stats.wil || "–"}`;
    }
    case STEP_IDS.LANGUAGES_EQUIPMENT: {
      const { equipmentChoice } = draft.stepFour;
      if (!equipmentChoice) return null;
      return equipmentChoice === "gear" ? "Starting Gear" : "Starting Gold";
    }
    default:
      return null;
  }
}

interface AccordionSectionProps {
  stepId: string;
  stepIndex: number;
  isExpanded: boolean;
  isLocked: boolean;
  isComplete: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({
  stepId,
  stepIndex,
  isExpanded,
  isLocked,
  isComplete,
  onToggle,
  children,
}: AccordionSectionProps) {
  const summary = useStepSummary(stepId);
  const label = STEP_LABELS[stepId];

  return (
    <div
      data-step={stepId}
      data-expanded={isExpanded}
      data-locked={isLocked}
      data-complete={isComplete}
      className={`rounded-lg border ${
        isExpanded
          ? "border-neon-cyan/40 bg-surface-1"
          : isLocked
          ? "border-surface-3/50 bg-surface-1/50 opacity-60"
          : "border-surface-3 bg-surface-1"
      }`}
    >
      <button
        type="button"
        onClick={isLocked ? undefined : onToggle}
        disabled={isLocked}
        aria-expanded={isExpanded}
        aria-controls={`accordion-panel-${stepId}`}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
          isLocked ? "cursor-not-allowed" : "cursor-pointer hover:bg-surface-2/50"
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-mono ${
            isComplete
              ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
              : isExpanded
              ? "border-neon-cyan text-neon-cyan glow-cyan"
              : "border-surface-3 text-text-low"
          }`}
        >
          {isComplete ? "\u2713" : stepIndex + 1}
        </span>
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm font-mono uppercase tracking-wider ${
              isExpanded
                ? "text-neon-cyan"
                : isComplete
                ? "text-text-med"
                : "text-text-low"
            }`}
          >
            {label}
          </span>
          {!isExpanded && summary && (
            <div className="text-xs text-text-med truncate mt-0.5">{summary}</div>
          )}
        </div>
        <span
          className={`text-text-low transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {isExpanded && (
        <div
          id={`accordion-panel-${stepId}`}
          role="region"
          className="px-4 pb-4"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function StepFormContent({ stepId }: { stepId: string }) {
  const {
    draft,
    updateStepOne,
    updateStepTwo,
    updateStepThree,
    updateStepFour,
    validation,
    showErrors,
  } = useCreator();

  if (!draft) return null;

  switch (stepId) {
    case STEP_IDS.CHARACTER_BASICS: {
      const v = validation[stepId] || { valid: false, errors: {} };
      return (
        <StepOneForm
          data={draft.stepOne}
          classIds={getValidClassIds()}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateStepOne}
        />
      );
    }
    case STEP_IDS.ANCESTRY_BACKGROUND: {
      const v = validation[stepId] || { valid: false, errors: {} };
      return (
        <StepTwoForm
          data={draft.stepTwo}
          ancestryIds={getValidAncestryIds()}
          backgroundIds={getValidBackgroundIds()}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateStepTwo}
        />
      );
    }
    case STEP_IDS.STATS_SKILLS: {
      const v = validation[stepId] || { valid: false, errors: {} };
      return (
        <StepThreeForm
          data={draft.stepThree}
          statArrayIds={getValidStatArrayIds()}
          skillIds={getValidSkillIds()}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateStepThree}
        />
      );
    }
    case STEP_IDS.LANGUAGES_EQUIPMENT: {
      const v = validation[stepId] || { valid: false, errors: {} };
      const intStat = Number.parseInt(draft.stepThree.stats.int, 10) || 0;
      return (
        <StepFourForm
          data={draft.stepFour}
          classId={draft.stepOne.classId}
          ancestryId={draft.stepTwo.ancestryId}
          intStat={intStat}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateStepFour}
        />
      );
    }
    default:
      return null;
  }
}

export function CreatorShell({ children }: { children?: React.ReactNode }) {
  const { draft, validation, resetStep, setShowErrors } = useCreator();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const prevValidationRef = useRef<Record<string, boolean>>({});
  const userClickedRef = useRef(false);

  // Determine initial expanded step on mount: first step whose validation fails
  useEffect(() => {
    if (!draft) return;
    const firstInvalid = STEP_ORDER.find((id) => !validation[id]?.valid);
    setExpandedStep(firstInvalid ?? STEP_ORDER[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!draft]);

  // Auto-advance: when current step becomes valid, collapse and expand next incomplete step
  useEffect(() => {
    if (!draft || !expandedStep || userClickedRef.current) {
      userClickedRef.current = false;
      return;
    }

    const prevValid = prevValidationRef.current[expandedStep];
    const nowValid = validation[expandedStep]?.valid ?? false;

    // Store current validation state for next comparison
    const newPrevValidation: Record<string, boolean> = {};
    for (const id of STEP_ORDER) {
      newPrevValidation[id] = validation[id]?.valid ?? false;
    }
    prevValidationRef.current = newPrevValidation;

    // Auto-advance only when step transitions from invalid to valid
    if (!prevValid && nowValid) {
      const currentIndex = STEP_ORDER.indexOf(expandedStep as typeof STEP_ORDER[number]);
      for (let i = currentIndex + 1; i < STEP_ORDER.length; i++) {
        if (!validation[STEP_ORDER[i]]?.valid) {
          setShowErrors(false);
          setExpandedStep(STEP_ORDER[i]);
          return;
        }
      }
    }
  }, [draft, validation, expandedStep, setShowErrors]);

  const handleToggle = useCallback((stepId: string) => {
    userClickedRef.current = true;
    setShowErrors(false);
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  }, [setShowErrors]);

  const handleReset = useCallback(() => {
    if (expandedStep) {
      resetStep(expandedStep);
    }
  }, [expandedStep, resetStep]);

  const isStepLocked = useCallback(
    (stepIndex: number): boolean => {
      for (let i = 0; i < stepIndex; i++) {
        if (!validation[STEP_ORDER[i]]?.valid) return true;
      }
      return false;
    },
    [validation],
  );

  if (!draft) return null;

  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      <div className="flex w-full max-w-6xl gap-6 flex-col lg:flex-row">
        {/* Left panel: Accordion sidebar */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="space-y-2">
            {STEP_ORDER.map((stepId, i) => (
              <AccordionSection
                key={stepId}
                stepId={stepId}
                stepIndex={i}
                isExpanded={expandedStep === stepId}
                isLocked={isStepLocked(i)}
                isComplete={validation[stepId]?.valid ?? false}
                onToggle={() => handleToggle(stepId)}
              >
                <StepFormContent stepId={stepId} />
              </AccordionSection>
            ))}
          </div>

          {expandedStep && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={handleReset}
                aria-label="Reset current step"
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Right panel: Draft preview */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <DebugPanel draft={draft} />
        </div>
      </div>
    </div>
  );
}
