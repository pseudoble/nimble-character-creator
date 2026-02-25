import { CHARACTER_LEVEL, MAX_SKILL_TOTAL_BONUS } from "@/lib/constants";
import type { CreatorDraft } from "@/lib/creator/types";
import { resolve, type ContentSources } from "@/engine/resolve";
import { ancestries as ancestryContracts } from "@/engine/content/ancestries";
import { backgrounds as backgroundContracts } from "@/engine/content/backgrounds";
import { classDefs } from "@/engine/content/classes";
import type {
  Ancestry as EngineAncestry,
  Bonus,
  Breakdown,
  CharacterConstants,
  DerivedValueKey,
  StatKey,
} from "@/engine/types";
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

  breakdowns: Record<string, Breakdown>;
}

const HIT_DIE_ORDER = ["d6", "d8", "d10", "d12", "d20"];

interface ComputeSheetDataOptions {
  resolvedBreakdowns?: Record<DerivedValueKey, Breakdown>;
}

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
  ancestryContract: EngineAncestry | null,
): { description: string; type?: "advantage" | "disadvantage" } | undefined {
  if (ancestryContract) {
    const match = ancestryContract.traits.find((t) => t.field === skillId);
    if (match) return { description: match.description, type: match.type };
  }
  return undefined;
}

export function computeSheetData(
  draft: CreatorDraft,
  options?: ComputeSheetDataOptions,
): SheetData {
  const cls = classes.find((c) => c.id === draft.characterBasics.classId);
  const ancestry = ancestries.find((a) => a.id === draft.ancestryBackground.ancestryId);
  const bg = backgrounds.find((b) => b.id === draft.ancestryBackground.backgroundId);

  const stats = {
    str: parseStat(draft.statsSkills.stats.str),
    dex: parseStat(draft.statsSkills.stats.dex),
    int: parseStat(draft.statsSkills.stats.int),
    wil: parseStat(draft.statsSkills.stats.wil),
  };

  // Build engine context and sources
  const classId = draft.characterBasics.classId;
  const classDef = classDefs[classId] ?? null;
  const gearItems =
    draft.languagesEquipment.equipmentChoice === "gear" && cls
      ? cls.startingGearIds
          .map((id) => startingGear.find((g) => g.id === id))
          .filter((item): item is (typeof startingGear)[number] => Boolean(item))
      : [];

  const equipmentBonuses: Bonus[] = [];
  for (const item of gearItems) {
    if (
      (item.category === "armor" || item.category === "shield") &&
      "armor" in item &&
      typeof item.armor === "string"
    ) {
      equipmentBonuses.push({
        target: "armor",
        label: item.name,
        value: parseArmorString(item.armor, stats.dex),
      });
    }
  }

  const ctx: CharacterConstants = {
    ...stats,
    level: CHARACTER_LEVEL,
    classId,
    keyStats: (classDef?.keyStats ?? (cls?.keyStats as [StatKey, StatKey]) ?? ["str", "dex"]),
  };

  const sources: ContentSources = {
    ancestry: ancestryContracts[draft.ancestryBackground.ancestryId] ?? null,
    classDef,
    background: backgroundContracts[draft.ancestryBackground.backgroundId] ?? null,
    boons: [],
    equipment:
      equipmentBonuses.length > 0
        ? [{ bonuses: equipmentBonuses }]
        : [],
  };

  const engineResult = options?.resolvedBreakdowns ?? resolve(ctx, sources);

  // Use engine results for vitals
  const speed = engineResult.speed.total;
  const maxWounds = engineResult.maxWounds.total;
  const initiative = engineResult.initiative.total;
  const inventorySlots = engineResult.inventorySlots.total;
  const hitDiceCount = engineResult.maxHitDice.total;
  const hp = engineResult.maxHp.total;
  const armor = engineResult.armor.total;

  // Hit die size: engine stores as a number, convert back to string
  const hitDieSizeNum = engineResult.hitDieSize.total;
  const hitDieSize = hitDieSizeNum > 0 ? `d${hitDieSizeNum}` : (cls?.hitDie ?? "d6");

  const ancestryContract = ancestryContracts[draft.ancestryBackground.ancestryId] ?? null;
  const initiativeQualifier = ancestryContract?.traits.find(
    (t) => t.field === "initiative"
  )?.description;

  // Skills — engine provides ancestry/background/class bonuses; we add stat + allocated
  const skillStatMap: Record<string, StatKey> = {};
  for (const skill of skills) {
    skillStatMap[skill.id] = skill.stat as StatKey;
  }

  const computedSkills = skills.map((skill) => {
    const statVal = stats[skill.stat as keyof typeof stats] ?? 0;
    const allocated = draft.statsSkills.skillAllocations[skill.id] ?? 0;
    const skillId = skill.id as DerivedValueKey;
    const engineSkill = engineResult[skillId];

    // Build skill breakdown: stat + allocated + engine bonuses
    const skillEntries: Array<{ label: string; value: number }> = [
      { label: skill.stat.toUpperCase(), value: statVal },
    ];
    if (allocated > 0) {
      skillEntries.push({ label: "Allocated", value: allocated });
    }
    if (engineSkill) {
      skillEntries.push(...engineSkill.entries);
    }
    const rawTotal = skillEntries.reduce((sum, e) => sum + e.value, 0);
    const total = Math.min(rawTotal, MAX_SKILL_TOTAL_BONUS);

    const conditional = getSkillConditional(skill.id, ancestryContract);

    return {
      id: skill.id,
      name: skill.name,
      stat: skill.stat,
      allocatedPoints: allocated,
      total,
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

    for (const item of gearItems) {
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
  // Background languages from engine contract
  const bgContract = backgroundContracts[draft.ancestryBackground.backgroundId];
  if (bgContract?.languages) {
    for (const langId of bgContract.languages) {
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

  // Conditionals for vitals (from engine ancestry traits)
  const conditionals: Array<{ field: string; description: string; type?: "advantage" | "disadvantage" }> = [];
  if (ancestryContract) {
    for (const trait of ancestryContract.traits) {
      const isSkillField = skills.some((s) => s.id === trait.field);
      if (!isSkillField) {
        conditionals.push(trait);
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
    breakdowns: {
      ...engineResult,
      // Build skill breakdowns with stat + allocated + bonuses
      ...Object.fromEntries(
        computedSkills.map((skill) => {
          const statVal = stats[skill.stat as keyof typeof stats] ?? 0;
          const allocated = draft.statsSkills.skillAllocations[skill.id] ?? 0;
          const skillId = skill.id as DerivedValueKey;
          const engineSkill = engineResult[skillId];
          const entries: Array<{ label: string; value: number }> = [
            { label: skill.stat.toUpperCase(), value: statVal },
          ];
          if (allocated > 0) {
            entries.push({ label: "Allocated", value: allocated });
          }
          if (engineSkill) {
            entries.push(...engineSkill.entries);
          }
          return [
            skill.id,
            { total: skill.total, entries },
          ];
        })
      ),
    },
  };
}
