"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadDraft } from "@/lib/creator/draft-persistence";
import { computeSheetData, type SheetData } from "@/lib/sheet/compute-sheet-data";
import { CharacterSheet } from "@/lib/sheet/character-sheet";
import type { CreatorDraft } from "@/lib/creator/types";

function isCompleteDraft(draft: CreatorDraft): boolean {
  return !!(
    draft.characterBasics.classId &&
    draft.characterBasics.name &&
    draft.ancestryBackground.ancestryId &&
    draft.ancestryBackground.backgroundId &&
    draft.statsSkills.statArrayId &&
    draft.statsSkills.stats.str &&
    draft.statsSkills.stats.dex &&
    draft.statsSkills.stats.int &&
    draft.statsSkills.stats.wil &&
    draft.languagesEquipment.equipmentChoice
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
