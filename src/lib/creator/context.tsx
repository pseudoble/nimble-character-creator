"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import type { CreatorDraft, StepValidationResult } from "./types";
import { loadDraft, saveDraft } from "./draft-persistence";
import { validateStepOne } from "./step-one-validation";
import { validateStepTwo } from "./step-two-validation";
import { validateStepThree } from "./step-three-validation";
import { STEP_IDS } from "./constants";

interface CreatorContextType {
  draft: CreatorDraft | null;
  setDraft: React.Dispatch<React.SetStateAction<CreatorDraft | null>>;
  validation: Record<string, StepValidationResult>;
  validateStep: (stepId: string) => StepValidationResult;
  updateStepOne: (updates: Partial<CreatorDraft["stepOne"]>) => void;
  updateStepTwo: (updates: Partial<CreatorDraft["stepTwo"]>) => void;
  updateStepThree: (updates: Partial<CreatorDraft["stepThree"]>) => void;
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
    });
    lastSavedRef.current = JSON.stringify({
      stepOne: restored.stepOne,
      stepTwo: restored.stepTwo,
      stepThree: restored.stepThree,
    });
  }, []);

  // Debounced persistence
  useEffect(() => {
    if (!draft) return;
    const current = JSON.stringify({
      stepOne: draft.stepOne,
      stepTwo: draft.stepTwo,
      stepThree: draft.stepThree,
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
      const next: CreatorDraft = {
        ...prev,
        stepThree: { ...prev.stepThree, ...updates },
      };
      const result = validateStepThree(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.STATS_SKILLS]: result }));
      return next;
    });
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
