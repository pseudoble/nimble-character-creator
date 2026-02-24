"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadDraft } from "@/lib/creator/draft-persistence";
import { computeSheetData, type SheetData } from "@/lib/sheet/compute-sheet-data";
import { CharacterSheet } from "@/lib/sheet/character-sheet";
import type { CreatorDraft } from "@/lib/creator/types";

function isCompleteDraft(draft: CreatorDraft): boolean {
  return !!(
    draft.stepOne.classId &&
    draft.stepOne.name &&
    draft.stepTwo.ancestryId &&
    draft.stepTwo.backgroundId &&
    draft.stepThree.statArrayId &&
    draft.stepThree.stats.str &&
    draft.stepThree.stats.dex &&
    draft.stepThree.stats.int &&
    draft.stepThree.stats.wil &&
    draft.stepFour.equipmentChoice
  );
}

export default function SheetPage() {
  const router = useRouter();
  const [sheetData, setSheetData] = useState<SheetData | null>(null);

  useEffect(() => {
    try {
      const draft = loadDraft();
      if (!isCompleteDraft(draft)) {
        router.replace("/create");
        return;
      }
      setSheetData(computeSheetData(draft));
    } catch {
      router.replace("/create");
    }
  }, [router]);

  if (!sheetData) return null;

  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      <div className="w-full max-w-2xl">
        <CharacterSheet data={sheetData} variant="full" />
      </div>
    </div>
  );
}
