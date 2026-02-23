"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreator } from "./context";
import { STEP_IDS } from "./constants";

const STEP_ORDER = [
  STEP_IDS.CHARACTER_BASICS,
  STEP_IDS.ANCESTRY_BACKGROUND,
  STEP_IDS.STATS_SKILLS,
  STEP_IDS.EQUIPMENT_MONEY,
];

const STEP_PATHS: Record<string, string> = {
  [STEP_IDS.CHARACTER_BASICS]: "/create/character-basics",
  [STEP_IDS.ANCESTRY_BACKGROUND]: "/create/ancestry-background",
  [STEP_IDS.STATS_SKILLS]: "/create/stats-skills",
  [STEP_IDS.EQUIPMENT_MONEY]: "/create/equipment-money",
};

interface StepGuardProps {
  stepId: string;
  children: React.ReactNode;
}

export function StepGuard({ stepId, children }: StepGuardProps) {
  const { draft, validation } = useCreator();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!draft) return; // Wait for draft to load

    const targetIndex = (STEP_ORDER as readonly string[]).indexOf(stepId);
    
    // Check all previous steps
    for (let i = 0; i < targetIndex; i++) {
      const prevStepId = STEP_ORDER[i];
      // We need to know if previous steps are valid.
      // The context loads validation on mount.
      // But if we just loaded the page, validation might be fresh.
      const isValid = validation[prevStepId]?.valid;
      
      if (!isValid) {
        // Redirect to the first invalid step
        router.replace(STEP_PATHS[prevStepId]);
        return;
      }
    }

    setIsChecked(true);
  }, [draft, validation, stepId, router]);

  if (!draft || !isChecked) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-text-low font-mono animate-pulse">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
