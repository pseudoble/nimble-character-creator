"use client";

import { useMemo } from "react";
import { useCreator } from "@/lib/creator/context";
import { computeSheetData } from "./compute-sheet-data";
import { CharacterSheet } from "./character-sheet";

export function CharacterSheetPreview() {
  const { draft } = useCreator();

  const sheetData = useMemo(() => {
    if (!draft) return null;
    return computeSheetData(draft);
  }, [draft]);

  if (!sheetData) return null;

  return <CharacterSheet data={sheetData} variant="preview" />;
}
