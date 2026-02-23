"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import type { CreatorDraft, StepValidationResult } from "./types";
import { createEmptyDraft, loadDraft, saveDraft } from "./draft-persistence";
import { validateStepOne } from "./step-one-validation";
import { validateStepTwo } from "./step-two-validation";
import { validateStepThree } from "./step-three-validation";
import { validateStepFour } from "./step-four-validation";
import { STEP_IDS } from "./constants";

interface CreatorContextType {
  draft: CreatorDraft | null;
  setDraft: React.Dispatch<React.SetStateAction<CreatorDraft | null>>;
  validation: Record<string, StepValidationResult>;
  validateStep: (stepId: string) => StepValidationResult;
  updateStepOne: (updates: Partial<CreatorDraft["stepOne"]>) => void;
  updateStepTwo: (updates: Partial<CreatorDraft["stepTwo"]>) => void;
  updateStepThree: (updates: Partial<CreatorDraft["stepThree"]>) => void;
  updateStepFour: (updates: Partial<CreatorDraft["stepFour"]>) => void;
  resetStep: (stepId: string) => void;
  showErrors: boolean;
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatorContext = createContext<CreatorContextType | null>(null);

const DEBOUNCE_MS = 400;

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CreatorDraft | null>(null);
  const [validation, setValidation] = useState<Record<string, StepValidationResult>>({});
  const [showErrors, setShowErrors] = useState(false);
  const lastSavedRef = useRef<string>("");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const restored = loadDraft();
    setDraft(restored);
    // Validate all steps initially
    setValidation({
      [STEP_IDS.CHARACTER_BASICS]: validateStepOne(restored),
      [STEP_IDS.ANCESTRY_BACKGROUND]: validateStepTwo(restored),
      [STEP_IDS.STATS_SKILLS]: validateStepThree(restored),
      [STEP_IDS.EQUIPMENT_MONEY]: validateStepFour(restored),
    });
    lastSavedRef.current = JSON.stringify({
      stepOne: restored.stepOne,
      stepTwo: restored.stepTwo,
      stepThree: restored.stepThree,
      stepFour: restored.stepFour,
    });
  }, []);

  // Debounced persistence
  useEffect(() => {
    if (!draft) return;
    const current = JSON.stringify({
      stepOne: draft.stepOne,
      stepTwo: draft.stepTwo,
      stepThree: draft.stepThree,
      stepFour: draft.stepFour,
    });
    if (current === lastSavedRef.current) return;
    const timer = setTimeout(() => {
      saveDraft(draft);
      lastSavedRef.current = current;
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft]);

  const validateStep = useCallback((stepId: string): StepValidationResult => {
    if (!draft) return { valid: false, errors: {} };
    let result: StepValidationResult = { valid: false, errors: {} };

    switch (stepId) {
      case STEP_IDS.CHARACTER_BASICS:
        result = validateStepOne(draft);
        break;
      case STEP_IDS.ANCESTRY_BACKGROUND:
        result = validateStepTwo(draft);
        break;
      case STEP_IDS.STATS_SKILLS:
        result = validateStepThree(draft);
        break;
      case STEP_IDS.EQUIPMENT_MONEY:
        result = validateStepFour(draft);
        break;
    }

    setValidation(prev => ({ ...prev, [stepId]: result }));
    return result;
  }, [draft]);

  const updateStepOne = useCallback((updates: Partial<CreatorDraft["stepOne"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        stepOne: { ...prev.stepOne, ...updates },
      };
      const result = validateStepOne(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.CHARACTER_BASICS]: result }));
      return next;
    });
  }, []);

  const updateStepTwo = useCallback((updates: Partial<CreatorDraft["stepTwo"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        stepTwo: { ...prev.stepTwo, ...updates },
      };
      const result = validateStepTwo(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.ANCESTRY_BACKGROUND]: result }));
      return next;
    });
  }, []);

  const updateStepThree = useCallback((updates: Partial<CreatorDraft["stepThree"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const statArrayChanged = updates.statArrayId !== undefined && updates.statArrayId !== prev.stepThree.statArrayId;
      const merged = statArrayChanged
        ? { ...prev.stepThree, ...updates, stats: { str: "", dex: "", int: "", wil: "" } }
        : { ...prev.stepThree, ...updates };
      const next: CreatorDraft = {
        ...prev,
        stepThree: merged,
      };
      const result = validateStepThree(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.STATS_SKILLS]: result }));
      return next;
    });
  }, []);

  const updateStepFour = useCallback((updates: Partial<CreatorDraft["stepFour"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        stepFour: { ...prev.stepFour, ...updates },
      };
      const result = validateStepFour(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.EQUIPMENT_MONEY]: result }));
      return next;
    });
  }, []);

  const resetStep = useCallback((stepId: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const empty = createEmptyDraft();
      let next: CreatorDraft;
      switch (stepId) {
        case STEP_IDS.CHARACTER_BASICS:
          next = { ...prev, stepOne: empty.stepOne };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.CHARACTER_BASICS]: validateStepOne(next) }));
          break;
        case STEP_IDS.ANCESTRY_BACKGROUND:
          next = { ...prev, stepTwo: empty.stepTwo };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.ANCESTRY_BACKGROUND]: validateStepTwo(next) }));
          break;
        case STEP_IDS.STATS_SKILLS:
          next = { ...prev, stepThree: empty.stepThree };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.STATS_SKILLS]: validateStepThree(next) }));
          break;
        case STEP_IDS.EQUIPMENT_MONEY:
          next = { ...prev, stepFour: empty.stepFour };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.EQUIPMENT_MONEY]: validateStepFour(next) }));
          break;
        default:
          return prev;
      }
      return next;
    });
    setShowErrors(false);
  }, []);

  return (
    <CreatorContext.Provider value={{
      draft,
      setDraft,
      validation,
      validateStep,
      updateStepOne,
      updateStepTwo,
      updateStepThree,
      updateStepFour,
      resetStep,
      showErrors,
      setShowErrors
    }}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error("useCreator must be used within a CreatorProvider");
  }
  return context;
}
