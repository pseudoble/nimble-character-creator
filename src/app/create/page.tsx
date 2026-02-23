"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreator } from "@/lib/creator/context";
import { STEP_IDS } from "@/lib/creator/constants";

export default function CreateEntryPage() {
  const { draft, validation } = useCreator();
  const router = useRouter();

  useEffect(() => {
    if (!draft) return;

    // Redirect to the first incomplete step
    if (!validation[STEP_IDS.CHARACTER_BASICS]?.valid) {
      router.replace("/create/character-basics");
      return;
    }

    if (!validation[STEP_IDS.ANCESTRY_BACKGROUND]?.valid) {
      router.replace("/create/ancestry-background");
      return;
    }

    // Default to Step 3 if previous steps are valid
    router.replace("/create/stats-skills");
  }, [draft, validation, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-text-low font-mono animate-pulse">Loading...</div>
    </div>
  );
}
