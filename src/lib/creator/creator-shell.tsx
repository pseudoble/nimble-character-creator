"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCreator } from "./context";
import { STEP_IDS } from "./constants";
import { DebugPanel } from "./debug-panel";
import type { StepDescriptor } from "./types";

const STEP_PATHS = [
  "/create/character-basics",
  "/create/ancestry-background",
  "/create/stats-skills",
];

const STEPS: StepDescriptor[] = [
  {
    id: STEP_IDS.CHARACTER_BASICS,
    label: "Character Basics",
    validate: () => ({ valid: false, errors: {} }), // validation now handled by context
  },
  {
    id: STEP_IDS.ANCESTRY_BACKGROUND,
    label: "Ancestry & Background",
    validate: () => ({ valid: false, errors: {} }),
  },
  {
    id: STEP_IDS.STATS_SKILLS,
    label: "Stats & Skills",
    validate: () => ({ valid: false, errors: {} }),
  },
];

export function CreatorShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <CreatorShellInner>{children}</CreatorShellInner>
    </Suspense>
  );
}

function CreatorShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDebug = searchParams.get("debug") === "true";
  const { draft, validation, validateStep, resetStep, setShowErrors } = useCreator();
  
  // Find current step index
  // Default to 0 if not found (or root /create)
  const currentStepIndex = STEP_PATHS.findIndex(path => pathname === path || pathname.startsWith(path));
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;
  const currentStepId = STEPS[activeIndex].id;

  // Check if current step is valid
  const isCurrentStepValid = validation[currentStepId]?.valid ?? false;

  const handleNext = () => {
    if (isCurrentStepValid) {
      setShowErrors(false);
      if (activeIndex < STEPS.length - 1) {
        router.push(STEP_PATHS[activeIndex + 1]);
      } else {
        // Finish action
        console.log("Wizard complete", draft);
      }
    } else {
      setShowErrors(true);
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setShowErrors(false);
      router.push(STEP_PATHS[activeIndex - 1]);
    }
  };

  if (!draft) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg border border-surface-3 bg-surface-1 p-6 shadow-lg">
        <nav aria-label="Creator steps" className="mb-6">
          <ol className="flex gap-4">
            {STEPS.map((step, i) => {
              const isActive = i === activeIndex;
              const isComplete = validation[step.id]?.valid;
              const isClickable = i < activeIndex || isComplete;
              const path = STEP_PATHS[i];
              
              const content = (
                <>
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
                </>
              );

              return (
                <li
                  key={step.id}
                  data-step={step.id}
                  data-active={isActive}
                  data-complete={isComplete}
                  aria-current={isActive ? "step" : undefined}
                  className="flex items-center gap-2"
                >
                   {isClickable ? (
                     <Link href={path} className="flex items-center gap-2 hover:opacity-80">
                       {content}
                     </Link>
                   ) : (
                     <div className="flex items-center gap-2 cursor-not-allowed opacity-50">
                       {content}
                     </div>
                   )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mb-4 text-xs text-text-low font-mono uppercase tracking-wider">
          Step {activeIndex + 1} of {STEPS.length}
          {isCurrentStepValid && " — Complete"}
        </div>

        <main className="mb-6">
          {children}
        </main>

        {isDebug && <DebugPanel draft={draft} />}

        <div className={`flex ${activeIndex > 0 ? "justify-between" : "justify-end"} gap-2 mt-6`}>
          {activeIndex > 0 && (
            <Button
              variant="secondary"
              onClick={handleBack}
              aria-label="Go back to previous step"
            >
              Back
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => resetStep(currentStepId)}
              aria-label="Reset current step"
            >
              Reset
            </Button>
            <Button
              onClick={handleNext}
              aria-label={activeIndex < STEPS.length - 1 ? "Continue to next step" : "Finish"}
            >
              {activeIndex < STEPS.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
