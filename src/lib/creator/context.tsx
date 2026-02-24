"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import type { CreatorDraft, StepValidationResult } from "./types";
import { createEmptyDraft, loadDraft, saveDraft } from "./draft-persistence";
import { validateCharacterBasics } from "./character-basics-validation";
import { validateAncestryBackground } from "./ancestry-background-validation";
import { validateStatsSkills } from "./stats-skills-validation";
import { validateLanguagesEquipment } from "./languages-equipment-validation";
import { STEP_IDS } from "./constants";

interface CreatorContextType {
  draft: CreatorDraft | null;
  setDraft: React.Dispatch<React.SetStateAction<CreatorDraft | null>>;
  validation: Record<string, StepValidationResult>;
  validateStep: (stepId: string) => StepValidationResult;
  updateCharacterBasics: (updates: Partial<CreatorDraft["characterBasics"]>) => void;
  updateAncestryBackground: (updates: Partial<CreatorDraft["ancestryBackground"]>) => void;
  updateStatsSkills: (updates: Partial<CreatorDraft["statsSkills"]>) => void;
  updateLanguagesEquipment: (updates: Partial<CreatorDraft["languagesEquipment"]>) => void;
  resetStep: (stepId: string) => void;
  resetAll: () => void;
  touchedSteps: Set<string>;
  markTouched: (stepId: string) => void;
  showErrors: boolean;
  setShowErrors: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatorContext = createContext<CreatorContextType | null>(null);

const DEBOUNCE_MS = 400;

export function CreatorProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CreatorDraft | null>(null);
  const [validation, setValidation] = useState<Record<string, StepValidationResult>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [touchedSteps, setTouchedSteps] = useState<Set<string>>(new Set());
  const lastSavedRef = useRef<string>("");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const restored = loadDraft();
    setDraft(restored);
    // Validate all steps initially
    setValidation({
      [STEP_IDS.CHARACTER_BASICS]: validateCharacterBasics(restored),
      [STEP_IDS.ANCESTRY_BACKGROUND]: validateAncestryBackground(restored),
      [STEP_IDS.STATS_SKILLS]: validateStatsSkills(restored),
      [STEP_IDS.LANGUAGES_EQUIPMENT]: validateLanguagesEquipment(restored),
    });
    lastSavedRef.current = JSON.stringify({
      characterBasics: restored.characterBasics,
      ancestryBackground: restored.ancestryBackground,
      statsSkills: restored.statsSkills,
      languagesEquipment: restored.languagesEquipment,
    });
  }, []);

  // Debounced persistence
  useEffect(() => {
    if (!draft) return;
    const current = JSON.stringify({
      characterBasics: draft.characterBasics,
      ancestryBackground: draft.ancestryBackground,
      statsSkills: draft.statsSkills,
      languagesEquipment: draft.languagesEquipment,
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
        result = validateCharacterBasics(draft);
        break;
      case STEP_IDS.ANCESTRY_BACKGROUND:
        result = validateAncestryBackground(draft);
        break;
      case STEP_IDS.STATS_SKILLS:
        result = validateStatsSkills(draft);
        break;
      case STEP_IDS.LANGUAGES_EQUIPMENT:
        result = validateLanguagesEquipment(draft);
        break;
    }

    setValidation(prev => ({ ...prev, [stepId]: result }));
    return result;
  }, [draft]);

  const updateCharacterBasics = useCallback((updates: Partial<CreatorDraft["characterBasics"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        characterBasics: { ...prev.characterBasics, ...updates },
      };
      const result = validateCharacterBasics(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.CHARACTER_BASICS]: result }));
      return next;
    });
  }, []);

  const updateAncestryBackground = useCallback((updates: Partial<CreatorDraft["ancestryBackground"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        ancestryBackground: { ...prev.ancestryBackground, ...updates },
      };
      const abResult = validateAncestryBackground(next);
      const ssResult = validateStatsSkills(next);
      setValidation((prevVal) => ({
        ...prevVal,
        [STEP_IDS.ANCESTRY_BACKGROUND]: abResult,
        [STEP_IDS.STATS_SKILLS]: ssResult,
      }));
      return next;
    });
  }, []);

  const updateStatsSkills = useCallback((updates: Partial<CreatorDraft["statsSkills"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const statArrayChanged = updates.statArrayId !== undefined && updates.statArrayId !== prev.statsSkills.statArrayId;
      const merged = statArrayChanged
        ? { ...prev.statsSkills, ...updates, stats: { str: "", dex: "", int: "", wil: "" } }
        : { ...prev.statsSkills, ...updates };

      // Trim language selections when INT is lowered
      const prevInt = Number.parseInt(prev.statsSkills.stats.int, 10) || 0;
      const newInt = Number.parseInt(merged.stats.int, 10) || 0;
      let languagesEquipment = prev.languagesEquipment;
      if (newInt < prevInt && prev.languagesEquipment.selectedLanguages.length > 0) {
        const maxLanguages = Math.max(0, newInt);
        languagesEquipment = {
          ...prev.languagesEquipment,
          selectedLanguages: prev.languagesEquipment.selectedLanguages.slice(0, maxLanguages),
        };
      }

      const next: CreatorDraft = {
        ...prev,
        statsSkills: merged,
        languagesEquipment,
      };
      const result = validateStatsSkills(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.STATS_SKILLS]: result }));
      return next;
    });
  }, []);

  const updateLanguagesEquipment = useCallback((updates: Partial<CreatorDraft["languagesEquipment"]>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next: CreatorDraft = {
        ...prev,
        languagesEquipment: { ...prev.languagesEquipment, ...updates },
      };
      const result = validateLanguagesEquipment(next);
      setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.LANGUAGES_EQUIPMENT]: result }));
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
          next = { ...prev, characterBasics: empty.characterBasics };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.CHARACTER_BASICS]: validateCharacterBasics(next) }));
          break;
        case STEP_IDS.ANCESTRY_BACKGROUND:
          next = { ...prev, ancestryBackground: empty.ancestryBackground };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.ANCESTRY_BACKGROUND]: validateAncestryBackground(next) }));
          break;
        case STEP_IDS.STATS_SKILLS:
          next = { ...prev, statsSkills: empty.statsSkills };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.STATS_SKILLS]: validateStatsSkills(next) }));
          break;
        case STEP_IDS.LANGUAGES_EQUIPMENT:
          next = { ...prev, languagesEquipment: empty.languagesEquipment };
          setValidation((prevVal) => ({ ...prevVal, [STEP_IDS.LANGUAGES_EQUIPMENT]: validateLanguagesEquipment(next) }));
          break;
        default:
          return prev;
      }
      return next;
    });
    setShowErrors(false);
  }, []);

  const markTouched = useCallback((stepId: string) => {
    setTouchedSteps((prev) => {
      if (prev.has(stepId)) return prev;
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    const empty = createEmptyDraft();
    setDraft(empty);
    setValidation({
      [STEP_IDS.CHARACTER_BASICS]: validateCharacterBasics(empty),
      [STEP_IDS.ANCESTRY_BACKGROUND]: validateAncestryBackground(empty),
      [STEP_IDS.STATS_SKILLS]: validateStatsSkills(empty),
      [STEP_IDS.LANGUAGES_EQUIPMENT]: validateLanguagesEquipment(empty),
    });
    setTouchedSteps(new Set());
    setShowErrors(false);
  }, []);

  return (
    <CreatorContext.Provider value={{
      draft,
      setDraft,
      validation,
      validateStep,
      updateCharacterBasics,
      updateAncestryBackground,
      updateStatsSkills,
      updateLanguagesEquipment,
      resetStep,
      resetAll,
      touchedSteps,
      markTouched,
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
