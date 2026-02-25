"use client";

import { useMemo } from "react";
import { useCreator } from "@/lib/creator/context";
import { computeSheetData } from "./compute-sheet-data";
import { CharacterSheet } from "./character-sheet";
import { useCharacterSheet } from "@/engine/use-character-sheet";
import { createEmptyDraft } from "@/lib/creator/draft-persistence";

export function CharacterSheetPreview() {
  const { draft } = useCreator();
  const fallbackDraft = useMemo(() => createEmptyDraft(), []);
  const breakdowns = useCharacterSheet(draft ?? fallbackDraft);

  const sheetData = useMemo(() => {
    if (!draft) return null;
    return computeSheetData(draft, { resolvedBreakdowns: breakdowns });
  }, [draft, breakdowns]);

  if (!sheetData) return null;

  return <CharacterSheet data={sheetData} variant="preview" />;
}
