"use client";

import { useMemo } from "react";
import type { CreatorDraft } from "@/lib/creator/types";
import { CHARACTER_LEVEL } from "@/lib/constants";
import { parseStat } from "@/lib/sheet/compute-sheet-data";
import { resolve, type ContentSources } from "./resolve";
import { ancestries } from "./content/ancestries";
import { backgrounds } from "./content/backgrounds";
import { classDefs } from "./content/classes";
import type {
  Bonus,
  Breakdown,
  CharacterConstants,
  DerivedValueKey,
  StatKey,
} from "./types";
import classes from "@/lib/core-data/data/classes.json";
import startingGear from "@/lib/core-data/data/starting-gear.json";

function parseArmorString(armorStr: string, dex: number): number {
  const shieldMatch = armorStr.match(/^\+(\d+)$/);
  if (shieldMatch) return Number.parseInt(shieldMatch[1], 10);

  const maxMatch = armorStr.match(/^(\d+)\+DEX\s*\(max\s+(\d+)\)$/i);
  if (maxMatch) {
    const base = Number.parseInt(maxMatch[1], 10);
    const max = Number.parseInt(maxMatch[2], 10);
    return base + Math.min(dex, max);
  }

  const basicMatch = armorStr.match(/^(\d+)\+DEX$/i);
  if (basicMatch) {
    return Number.parseInt(basicMatch[1], 10) + dex;
  }

  return 0;
}

export function useCharacterSheet(
  draft: CreatorDraft
): Record<DerivedValueKey, Breakdown> {
  const stats = useMemo(
    () => ({
      str: parseStat(draft.statsSkills.stats.str),
      dex: parseStat(draft.statsSkills.stats.dex),
      int: parseStat(draft.statsSkills.stats.int),
      wil: parseStat(draft.statsSkills.stats.wil),
    }),
    [
      draft.statsSkills.stats.str,
      draft.statsSkills.stats.dex,
      draft.statsSkills.stats.int,
      draft.statsSkills.stats.wil,
    ]
  );

  const classId = draft.characterBasics.classId;
  const ancestryId = draft.ancestryBackground.ancestryId;
  const backgroundId = draft.ancestryBackground.backgroundId;

  const classDef = classDefs[classId] ?? null;
  const cls = classes.find((entry) => entry.id === classId);

  const equipmentBonuses = useMemo((): Bonus[] => {
    if (draft.languagesEquipment.equipmentChoice !== "gear" || !cls) {
      return [];
    }

    const bonuses: Bonus[] = [];
    for (const gearId of cls.startingGearIds) {
      const item = startingGear.find((entry) => entry.id === gearId);
      if (!item) continue;
      if (
        (item.category === "armor" || item.category === "shield") &&
        "armor" in item &&
        typeof item.armor === "string"
      ) {
        bonuses.push({
          target: "armor",
          label: item.name,
          value: parseArmorString(item.armor, stats.dex),
        });
      }
    }

    return bonuses;
  }, [draft.languagesEquipment.equipmentChoice, cls, stats.dex]);

  const ctx: CharacterConstants = useMemo(
    () => ({
      ...stats,
      level: CHARACTER_LEVEL,
      classId,
      keyStats: (classDef?.keyStats ?? ["str", "dex"]) as [StatKey, StatKey],
    }),
    [stats, classId, classDef]
  );

  const sources: ContentSources = useMemo(
    () => ({
      ancestry: ancestries[ancestryId] ?? null,
      classDef,
      background: backgrounds[backgroundId] ?? null,
      boons: [],
      equipment:
        equipmentBonuses.length > 0
          ? [{ bonuses: equipmentBonuses }]
          : [],
    }),
    [ancestryId, classDef, backgroundId, equipmentBonuses]
  );

  return useMemo(() => resolve(ctx, sources), [ctx, sources]);
}
