"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useCreator } from "./context";
import { STEP_IDS } from "./constants";
import { CharacterSheetPreview } from "@/lib/sheet/character-sheet-preview";
import { CharacterBasicsForm } from "./character-basics-form";
import { AncestryBackgroundForm } from "./ancestry-background-form";
import { StatsSkillsForm } from "./stats-skills-form";
import { LanguagesEquipmentForm } from "./languages-equipment-form";
import { getValidClassIds } from "./character-basics-validation";
import { getValidAncestryIds, getValidBackgroundIds } from "./ancestry-background-validation";
import { getValidStatArrayIds, getValidSkillIds } from "./stats-skills-validation";

const STEP_ORDER = [
  STEP_IDS.CHARACTER_BASICS,
  STEP_IDS.STATS_SKILLS,
  STEP_IDS.ANCESTRY_BACKGROUND,
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
      const { classId, name } = draft.characterBasics;
      if (!classId && !name) return null;
      const parts: string[] = [];
      if (classId) parts.push(classId.charAt(0).toUpperCase() + classId.slice(1));
      if (name) parts.push(name);
      return parts.join(" · ");
    }
    case STEP_IDS.ANCESTRY_BACKGROUND: {
      const { ancestryId, backgroundId } = draft.ancestryBackground;
      if (!ancestryId && !backgroundId) return null;
      const parts: string[] = [];
      if (ancestryId) parts.push(ancestryId.charAt(0).toUpperCase() + ancestryId.slice(1));
      if (backgroundId) parts.push(backgroundId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));
      return parts.join(" · ");
    }
    case STEP_IDS.STATS_SKILLS: {
      const { stats } = draft.statsSkills;
      const hasStats = stats.str || stats.dex || stats.int || stats.wil;
      if (!hasStats) return null;
      return `STR ${stats.str || "–"} DEX ${stats.dex || "–"} INT ${stats.int || "–"} WIL ${stats.wil || "–"}`;
    }
    case STEP_IDS.LANGUAGES_EQUIPMENT: {
      const { equipmentChoice } = draft.languagesEquipment;
      if (!equipmentChoice) return null;
      return equipmentChoice === "gear" ? "Starting Gear" : "Starting Gold";
    }
    default:
      return null;
  }
}

interface AccordionSectionProps {
  stepId: string;
  isExpanded: boolean;
  isComplete: boolean;
  isTouched: boolean;
  validationErrors: Record<string, string>;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({
  stepId,
  isExpanded,
  isComplete,
  isTouched,
  validationErrors,
  onToggle,
  children,
}: AccordionSectionProps) {
  const summary = useStepSummary(stepId);
  const label = STEP_LABELS[stepId];
  const needsAttention = isTouched && !isComplete;
  const errorMessages = Object.values(validationErrors);
  const headerTone = isExpanded
    ? "bg-neon-cyan/12 hover:bg-neon-cyan/16"
    : "hover:bg-surface-2/40";

  return (
    <div
      data-step={stepId}
      data-expanded={isExpanded}
      data-complete={isComplete}
      data-needs-attention={needsAttention}
      className={isExpanded ? "bg-surface-2/40" : undefined}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`accordion-panel-${stepId}`}
        className={`flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-left transition-colors ${headerTone}`}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            isExpanded || isComplete
              ? "bg-neon-cyan"
              : needsAttention
              ? "bg-amber-500"
              : "bg-surface-3"
          }`}
        />
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm font-mono uppercase tracking-wider ${
              isExpanded
                ? "text-neon-cyan font-semibold"
                : isComplete
                ? "text-text-med"
                : needsAttention
                ? "text-amber-500"
                : "text-text-low"
            }`}
          >
            {label}
          </span>
          {!isExpanded && summary && (
            <div className="text-xs text-text-med truncate mt-0.5">{summary}</div>
          )}
        </div>
        {needsAttention && !isExpanded && errorMessages.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-amber-500 text-sm" aria-label="Needs attention">
                  ⚠
                </span>
              </TooltipTrigger>
              <TooltipContent side="left">
                <ul className="list-disc pl-3 space-y-0.5">
                  {errorMessages.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <span
          className={`transition-transform ${isExpanded ? "rotate-180 text-neon-cyan" : "text-text-low"}`}
        >
          ▾
        </span>
      </button>

      {isExpanded && (
        <div
          id={`accordion-panel-${stepId}`}
          role="region"
          className="bg-surface-2/40 px-4 pb-4"
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
    updateCharacterBasics,
    updateAncestryBackground,
    updateStatsSkills,
    updateLanguagesEquipment,
    validation,
    showErrors,
  } = useCreator();

  if (!draft) return null;

  switch (stepId) {
    case STEP_IDS.CHARACTER_BASICS: {
      const v = validation[stepId] || { valid: false, errors: {} };
      return (
        <CharacterBasicsForm
          data={draft.characterBasics}
          classIds={getValidClassIds()}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateCharacterBasics}
        />
      );
    }
    case STEP_IDS.ANCESTRY_BACKGROUND: {
      const v = validation[stepId] || { valid: false, errors: {} };
      return (
        <AncestryBackgroundForm
          data={draft.ancestryBackground}
          ancestryIds={getValidAncestryIds()}
          backgroundIds={getValidBackgroundIds()}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateAncestryBackground}
        />
      );
    }
    case STEP_IDS.STATS_SKILLS: {
      const v = validation[stepId] || { valid: false, errors: {} };
      return (
        <StatsSkillsForm
          data={draft.statsSkills}
          ancestryBackground={draft.ancestryBackground}
          statArrayIds={getValidStatArrayIds()}
          skillIds={getValidSkillIds()}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateStatsSkills}
        />
      );
    }
    case STEP_IDS.LANGUAGES_EQUIPMENT: {
      const v = validation[stepId] || { valid: false, errors: {} };
      const intStat = Number.parseInt(draft.statsSkills.stats.int, 10) || 0;
      return (
        <LanguagesEquipmentForm
          data={draft.languagesEquipment}
          classId={draft.characterBasics.classId}
          ancestryId={draft.ancestryBackground.ancestryId}
          backgroundId={draft.ancestryBackground.backgroundId}
          intStat={intStat}
          validation={showErrors ? v : { valid: v.valid, errors: {} }}
          onChange={updateLanguagesEquipment}
        />
      );
    }
    default:
      return null;
  }
}

export function CreatorShell({ children }: { children?: React.ReactNode }) {
  const { draft, validation, resetStep, resetAll, touchedSteps, markTouched, setShowErrors } = useCreator();
  const router = useRouter();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Determine initial expanded step on mount: first step whose validation fails
  useEffect(() => {
    if (!draft) return;
    const firstInvalid = STEP_ORDER.find((id) => !validation[id]?.valid);
    setExpandedStep(firstInvalid ?? STEP_ORDER[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!draft]);

  const handleToggle = useCallback((stepId: string) => {
    setShowErrors(false);
    // Mark the step we're leaving as touched (outside updater to avoid cross-component setState during render)
    if (expandedStep && expandedStep !== stepId) {
      markTouched(expandedStep);
    }
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  }, [setShowErrors, markTouched, expandedStep]);

  const handleNext = useCallback((stepId: string) => {
    markTouched(stepId);
    setShowErrors(false);
    const currentIndex = STEP_ORDER.indexOf(stepId as typeof STEP_ORDER[number]);
    if (currentIndex < STEP_ORDER.length - 1) {
      setExpandedStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [markTouched, setShowErrors]);

  const handleStepReset = useCallback((stepId: string) => {
    resetStep(stepId);
  }, [resetStep]);

  const handleFinish = useCallback(() => {
    setShowErrors(true);
    const allValid = STEP_ORDER.every((id) => validation[id]?.valid);
    if (allValid) {
      router.push("/sheet");
    }
  }, [validation, setShowErrors, router]);

  const handleResetAll = useCallback(() => {
    resetAll();
    setExpandedStep(STEP_ORDER[0]);
  }, [resetAll]);

  if (!draft) return null;

  return (
    <div className="flex min-h-screen items-stretch justify-center px-4">
      <div className="flex w-full max-w-7xl flex-col gap-6 py-4 lg:min-h-screen lg:flex-row lg:items-stretch lg:py-0">
        {/* Left panel: Accordion sidebar */}
        <div className="w-full lg:w-2/5 lg:min-h-screen lg:self-stretch">
          <div className="flex h-full flex-col rounded-r-lg border-l-2 border-l-neon-cyan/30 bg-surface-1">
            <div className="flex-1">
              {STEP_ORDER.map((stepId, i) => {
                const isExpanded = expandedStep === stepId;
                const isComplete = validation[stepId]?.valid ?? false;
                const isLastStep = i === STEP_ORDER.length - 1;
                const errors = validation[stepId]?.errors ?? {};

                return (
                  <div
                    key={stepId}
                    className={i === 0 ? undefined : "border-t border-surface-3"}
                  >
                    <AccordionSection
                      stepId={stepId}
                      isExpanded={isExpanded}
                      isComplete={isComplete}
                      isTouched={touchedSteps.has(stepId)}
                      validationErrors={errors}
                      onToggle={() => handleToggle(stepId)}
                    >
                      <StepFormContent stepId={stepId} />
                      <div className="mt-4 flex justify-between">
                        <Button
                          variant="ghost"
                          onClick={() => handleStepReset(stepId)}
                          aria-label={`Reset ${STEP_LABELS[stepId]}`}
                        >
                          Reset
                        </Button>
                        <Button
                          variant="default"
                          onClick={isLastStep ? handleFinish : () => handleNext(stepId)}
                          aria-label={isLastStep ? "Finish" : "Next step"}
                        >
                          {isLastStep ? "Finish" : "Next"}
                        </Button>
                      </div>
                    </AccordionSection>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-surface-3 px-4 py-3">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={handleResetAll}
                  aria-label="Reset all steps"
                >
                  Reset All
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: Draft preview */}
        <div className="w-full lg:w-3/5">
          <CharacterSheetPreview />
        </div>
      </div>
    </div>
  );
}
