"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CreatorDraft, StepDescriptor, StepValidationResult } from "./types";
import { STEP_IDS } from "./constants";
import { validateStepOne, getValidClassIds } from "./step-one-validation";
import { validateStepTwo, getValidAncestryIds, getValidBackgroundIds } from "./step-two-validation";
import { loadDraft, saveDraft, createEmptyDraft } from "./draft-persistence";
import { StepOneForm } from "./step-one-form";
import { StepTwoForm } from "./step-two-form";
import { Button } from "@/components/ui/button";

const DEBOUNCE_MS = 400;

const STEPS: StepDescriptor[] = [
  {
    id: STEP_IDS.CHARACTER_BASICS,
    label: "Character Basics",
    validate: (draft) => validateStepOne(draft),
  },
  {
    id: STEP_IDS.ANCESTRY_BACKGROUND,
    label: "Ancestry & Background",
    validate: (draft) => validateStepTwo(draft),
  },
];

export function CreatorWizard() {
  const [draft, setDraft] = useState<CreatorDraft | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validation, setValidation] = useState<StepValidationResult>({ valid: false, errors: {} });
  const [showErrors, setShowErrors] = useState(false);
  const lastSavedRef = useRef<string>("");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const restored = loadDraft();
    setDraft(restored);
    const result = STEPS[0].validate(restored);
    setValidation(result);
    lastSavedRef.current = JSON.stringify({ stepOne: restored.stepOne, stepTwo: restored.stepTwo });
  }, []);

  // Debounced persistence
  useEffect(() => {
    if (!draft) return;
    const current = JSON.stringify({ stepOne: draft.stepOne, stepTwo: draft.stepTwo });
    if (current === lastSavedRef.current) return;
    const timer = setTimeout(() => {
      saveDraft(draft);
      lastSavedRef.current = current;
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft]);

  const updateStepOne = useCallback((updates: Partial<CreatorDraft["stepOne"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        stepOne: { ...prev.stepOne, ...updates },
      };
      const result = STEPS[currentStepIndex].validate(next);
      setValidation(result);
      return next;
    });
  }, [currentStepIndex]);

  const updateStepTwo = useCallback((updates: Partial<CreatorDraft["stepTwo"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        stepTwo: { ...prev.stepTwo, ...updates },
      };
      const result = STEPS[currentStepIndex].validate(next);
      setValidation(result);
      return next;
    });
  }, [currentStepIndex]);

  const handleAdvance = useCallback(() => {
    if (!draft) return;
    const result = STEPS[currentStepIndex].validate(draft);
    setValidation(result);
    if (!result.valid) {
      setShowErrors(true);
      return;
    }
    if (currentStepIndex < STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setShowErrors(false);
      // Validate the next step immediately
      const nextResult = STEPS[nextIndex].validate(draft);
      setValidation(nextResult);
    }
  }, [draft, currentStepIndex]);

  if (!draft) return null;

  const currentStep = STEPS[currentStepIndex];
  const classIds = getValidClassIds();
  const ancestryIds = getValidAncestryIds();
  const backgroundIds = getValidBackgroundIds();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg border border-surface-3 bg-surface-1 p-6 shadow-lg">
        <nav aria-label="Creator steps" className="mb-6">
          <ol className="flex gap-4">
            {STEPS.map((step, i) => {
              const isActive = i === currentStepIndex;
              const isComplete = i < currentStepIndex || (i === currentStepIndex && validation.valid);
              return (
                <li
                  key={step.id}
                  data-step={step.id}
                  data-active={isActive}
                  data-complete={isComplete}
                  aria-current={isActive ? "step" : undefined}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-mono ${
                      isComplete
                        ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                        : isActive
                          ? "border-neon-cyan text-neon-cyan glow-cyan"
                          : "border-surface-3 text-text-low"
                    }`}
                  >
                    {isComplete ? "\u2713" : i + 1}
                  </span>
                  <span
                    className={`text-sm font-mono uppercase tracking-wider ${
                      isActive
                        ? "text-neon-cyan"
                        : isComplete
                          ? "text-text-med"
                          : "text-text-low"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mb-4 text-xs text-text-low font-mono uppercase tracking-wider">
          Step {currentStepIndex + 1} of {STEPS.length}
          {validation.valid && " — Complete"}
        </div>

        <main className="mb-6">
          {currentStep.id === STEP_IDS.CHARACTER_BASICS && (
            <StepOneForm
              data={draft.stepOne}
              classIds={classIds}
              validation={showErrors ? validation : { valid: validation.valid, errors: {} }}
              onChange={updateStepOne}
            />
          )}
          {currentStep.id === STEP_IDS.ANCESTRY_BACKGROUND && (
            <StepTwoForm
              data={draft.stepTwo}
              ancestryIds={ancestryIds}
              backgroundIds={backgroundIds}
              validation={showErrors ? validation : { valid: validation.valid, errors: {} }}
              onChange={updateStepTwo}
            />
          )}
        </main>

        <div className="flex justify-end">
          <Button
            onClick={handleAdvance}
            disabled={!validation.valid && currentStepIndex === STEPS.length - 1}
            aria-label="Continue to next step"
          >
            {currentStepIndex < STEPS.length - 1 ? "Next" : "Finish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
