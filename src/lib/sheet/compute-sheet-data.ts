import { CHARACTER_LEVEL, MAX_SKILL_TOTAL_BONUS } from "@/lib/constants";
import type { CreatorDraft } from "@/lib/creator/types";
import {
  ancestryModifiers,
  backgroundModifiers,
  getFlatSkillModifier,
  type TraitModifiers,
} from "@/lib/core-data/trait-modifiers";
import ancestries from "@/lib/core-data/data/ancestries.json";
import backgrounds from "@/lib/core-data/data/backgrounds.json";
import classes from "@/lib/core-data/data/classes.json";
import skills from "@/lib/core-data/data/skills.json";
import startingGear from "@/lib/core-data/data/starting-gear.json";
import languages from "@/lib/core-data/data/languages.json";

export interface SheetData {
  name: string;
  className: string;
  ancestryName: string;
  backgroundName: string;
  motivation: string;
  size: string;

  stats: { str: number; dex: number; int: number; wil: number };
  saves: { advantaged: string; disadvantaged: string };

  hp: number;
  hitDieSize: string;
  hitDiceCount: number;
  initiative: number;
  initiativeQualifier?: string;
  speed: number;
  armor: number;
  maxWounds: number;
  inventorySlots: number;

  skills: Array<{
    id: string;
    name: string;
    stat: string;
    allocatedPoints: number;
    total: number;
    conditional?: { description: string; type?: "advantage" | "disadvantage" };
  }>;

  ancestryTrait: { name: string; description: string };
  background: { name: string; description: string };

  equipment: {
    weapons: Array<{ name: string; damage: string; properties: string[] }>;
    armor: Array<{ name: string; armorValue: string }>;
    shields: Array<{ name: string; armorValue: string }>;
    supplies: Array<{ name: string }>;
  } | null;

  gold: number | null;

  languages: string[];

  keyStats: string[];

  conditionals: Array<{ field: string; description: string; type?: "advantage" | "disadvantage" }>;
}

const HIT_DIE_ORDER = ["d6", "d8", "d10", "d12", "d20"];

export function parseStat(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? 0 : n;
}

export function parseArmorString(
  armorStr: string,
  dex: number
): number {
  // Formats: "+2", "2+DEX", "3+DEX", "6+DEX (max 2)"
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

export function incrementHitDie(die: string): string {
  const idx = HIT_DIE_ORDER.indexOf(die);
  if (idx === -1 || idx >= HIT_DIE_ORDER.length - 1) return die;
  return HIT_DIE_ORDER[idx + 1];
}


function getSkillConditional(
  skillId: string,
  ...modifierSets: TraitModifiers[]
): { description: string; type?: "advantage" | "disadvantage" } | undefined {
  for (const mods of modifierSets) {
    const match = mods.conditionals?.find((c) => c.field === skillId);
    if (match) return { description: match.description, type: match.type };
  }
  return undefined;
}

export function computeSheetData(draft: CreatorDraft): SheetData {
  const cls = classes.find((c) => c.id === draft.characterBasics.classId);
  const ancestry = ancestries.find((a) => a.id === draft.ancestryBackground.ancestryId);
  const bg = backgrounds.find((b) => b.id === draft.ancestryBackground.backgroundId);

  const stats = {
    str: parseStat(draft.statsSkills.stats.str),
    dex: parseStat(draft.statsSkills.stats.dex),
    int: parseStat(draft.statsSkills.stats.int),
    wil: parseStat(draft.statsSkills.stats.wil),
  };

  const ancMods = ancestryModifiers[draft.ancestryBackground.ancestryId] ?? {};
  const bgMods = backgroundModifiers[draft.ancestryBackground.backgroundId] ?? {};

  // Vitals
  const baseSpeed = 6;
  const speed = baseSpeed + (ancMods.speed ?? 0) + (bgMods.speed ?? 0);

  const baseMaxWounds = 6;
  const maxWounds =
    baseMaxWounds + (ancMods.maxWounds ?? 0) + (bgMods.maxWounds ?? 0);

  const baseInitiative = stats.dex;
  const initiative =
    baseInitiative + (ancMods.initiative ?? 0) + (bgMods.initiative ?? 0);

  const initiativeQualifier = ancMods.conditionals?.find(
    (c) => c.field === "initiative"
  )?.description;

  const inventorySlots = 10 + stats.str;

  // Hit die
  let hitDieSize = cls?.hitDie ?? "d6";
  if (ancMods.hitDieIncrement) {
    hitDieSize = incrementHitDie(hitDieSize);
  }

  const hitDiceCount =
    CHARACTER_LEVEL + (ancMods.maxHitDice ?? 0) + (bgMods.maxHitDice ?? 0);

  // HP
  const hp = cls?.startingHp ?? 0;

  // Armor from equipment
  let armorFromGear = 0;
  let shieldBonus = 0;
  if (draft.languagesEquipment.equipmentChoice === "gear" && cls) {
    const gearItems = cls.startingGearIds.map((id) =>
      startingGear.find((g) => g.id === id)
    );
    for (const item of gearItems) {
      if (!item) continue;
      if (
        item.category === "armor" &&
        "armor" in item &&
        typeof item.armor === "string"
      ) {
        armorFromGear = parseArmorString(item.armor, stats.dex);
      }
      if (
        item.category === "shield" &&
        "armor" in item &&
        typeof item.armor === "string"
      ) {
        shieldBonus += parseArmorString(item.armor, stats.dex);
      }
    }
  }

  const armor =
    armorFromGear +
    shieldBonus +
    (ancMods.armor ?? 0) +
    (bgMods.armor ?? 0);

  // Skills
  const computedSkills = skills.map((skill) => {
    const statVal = stats[skill.stat as keyof typeof stats] ?? 0;
    const allocated = draft.statsSkills.skillAllocations[skill.id] ?? 0;
    const bonus = getFlatSkillModifier(skill.id, ancMods, bgMods);
    const conditional = getSkillConditional(skill.id, ancMods, bgMods);

    return {
      id: skill.id,
      name: skill.name,
      stat: skill.stat,
      allocatedPoints: allocated,
      total: Math.min(statVal + allocated + bonus, MAX_SKILL_TOTAL_BONUS),
      conditional,
    };
  });

  // Equipment resolution
  let equipment: SheetData["equipment"] = null;
  if (draft.languagesEquipment.equipmentChoice === "gear" && cls) {
    const weapons: Array<{ name: string; damage: string; properties: string[] }> = [];
    const armorItems: Array<{ name: string; armorValue: string }> = [];
    const shields: Array<{ name: string; armorValue: string }> = [];
    const supplies: Array<{ name: string }> = [];

    for (const gearId of cls.startingGearIds) {
      const item = startingGear.find((g) => g.id === gearId);
      if (!item) continue;
      switch (item.category) {
        case "weapon":
          weapons.push({
            name: item.name,
            damage: "damage" in item ? (item.damage as string) : "",
            properties:
              "properties" in item ? (item.properties as string[]) : [],
          });
          break;
        case "armor":
          armorItems.push({
            name: item.name,
            armorValue: "armor" in item ? (item.armor as string) : "",
          });
          break;
        case "shield":
          shields.push({
            name: item.name,
            armorValue: "armor" in item ? (item.armor as string) : "",
          });
          break;
        case "supplies":
          supplies.push({ name: item.name });
          break;
      }
    }

    equipment = { weapons, armor: armorItems, shields, supplies };
  }

  // Gold
  const gold = draft.languagesEquipment.equipmentChoice === "gold" ? 50 : null;

  // Languages
  const langList: string[] = ["Common"];
  if (ancestry?.ancestryLanguage && stats.int >= 0) {
    const langData = languages.find(
      (l) => l.id === ancestry.ancestryLanguage!.id
    );
    const displayName =
      "displayName" in ancestry.ancestryLanguage
        ? (ancestry.ancestryLanguage as { id: string; displayName: string })
            .displayName
        : langData?.name;
    if (displayName && !langList.includes(displayName)) {
      langList.push(displayName);
    }
  }
  if (bgMods.languages) {
    for (const langId of bgMods.languages) {
      const langData = languages.find((l) => l.id === langId);
      if (langData && !langList.includes(langData.name)) {
        langList.push(langData.name);
      }
    }
  }
  for (const langId of draft.languagesEquipment.selectedLanguages) {
    const langData = languages.find((l) => l.id === langId);
    if (langData && !langList.includes(langData.name)) {
      langList.push(langData.name);
    }
  }

  // Conditionals for vitals
  const conditionals: Array<{ field: string; description: string }> = [];
  for (const mod of [ancMods, bgMods]) {
    if (mod.conditionals) {
      for (const c of mod.conditionals) {
        // Skip skill-level conditionals (handled per-skill), include vitals-level ones
        const isSkillField = skills.some((s) => s.id === c.field);
        if (!isSkillField) {
          conditionals.push(c);
        }
      }
    }
  }

  return {
    name: draft.characterBasics.name,
    className: cls?.name ?? "",
    ancestryName: ancestry?.name ?? "",
    backgroundName: bg?.name ?? "",
    motivation: draft.ancestryBackground.motivation,
    size: ancestry?.size ?? "",
    stats,
    saves: {
      advantaged: cls?.saves.advantaged ?? "",
      disadvantaged: cls?.saves.disadvantaged ?? "",
    },
    hp,
    hitDieSize,
    hitDiceCount,
    initiative,
    initiativeQualifier,
    speed,
    armor,
    maxWounds,
    inventorySlots,
    skills: computedSkills,
    ancestryTrait: {
      name: ancestry?.traitName ?? "",
      description: ancestry?.traitDescription ?? "",
    },
    background: {
      name: bg?.name ?? "",
      description: bg?.description ?? "",
    },
    equipment,
    gold,
    languages: langList,
    keyStats: cls?.keyStats ?? [],
    conditionals,
  };
}
