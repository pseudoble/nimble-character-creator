import type {
  Bonus,
  Breakdown,
  CharacterConstants,
  DerivedValueKey,
  Ancestry,
  ClassDef,
  Background,
} from "./types";

/** Evaluate a bonus value (number or function) against CharacterConstants. */
export function resolveBonus(
  bonus: Bonus,
  ctx: CharacterConstants
): { label: string; value: number } {
  const value =
    typeof bonus.value === "function" ? bonus.value(ctx) : bonus.value;
  return { label: bonus.label, value };
}

/** Gather all Bonus objects targeting a given DerivedValueKey from all content sources. */
export function collectBonuses(
  target: DerivedValueKey,
  sources: { bonuses: Bonus[] }[]
): Bonus[] {
  const result: Bonus[] = [];
  for (const source of sources) {
    for (const bonus of source.bonuses) {
      if (bonus.target === target) {
        result.push(bonus);
      }
    }
  }
  return result;
}

function buildBreakdown(
  baseEntries: Array<{ label: string; value: number }>,
  bonuses: Bonus[],
  ctx: CharacterConstants
): Breakdown {
  const entries = [...baseEntries];
  for (const bonus of bonuses) {
    entries.push(resolveBonus(bonus, ctx));
  }
  const total = entries.reduce((sum, e) => sum + e.value, 0);
  return { total, entries };
}

export interface ContentSources {
  ancestry: Ancestry | null;
  classDef: ClassDef | null;
  background: Background | null;
  boons?: Array<{ bonuses: Bonus[] }>;
  equipment?: Array<{ bonuses: Bonus[] }>;
}

/** All content sources flattened into bonus-bearing objects for collectBonuses. */
function allBonusSources(sources: ContentSources): { bonuses: Bonus[] }[] {
  const result: { bonuses: Bonus[] }[] = [];
  if (sources.ancestry) result.push(sources.ancestry);
  if (sources.background) result.push(sources.background);
  if (sources.classDef) result.push({ bonuses: sources.classDef.derivations });
  if (sources.boons) result.push(...sources.boons);
  if (sources.equipment) result.push(...sources.equipment);
  return result;
}

/**
 * Resolve all derived character values from constants + content sources.
 * Pure function: identical inputs produce identical outputs.
 *
 * Pass 1: First-order values (depend only on character constants)
 * Pass 2: Second-order values (depend on first-order results)
 */
export function resolve(
  ctx: CharacterConstants,
  sources: ContentSources
): Record<DerivedValueKey, Breakdown> {
  const all = allBonusSources(sources);
  const result = {} as Record<DerivedValueKey, Breakdown>;

  // === Pass 1: First-order derived values ===

  // Speed: base 6 + bonuses
  result.speed = buildBreakdown(
    [{ label: "Base", value: 6 }],
    collectBonuses("speed", all),
    ctx
  );

  // Armor: bonuses only (base armor comes from equipment, which is a bonus source)
  result.armor = buildBreakdown(
    [],
    collectBonuses("armor", all),
    ctx
  );

  // Max HP: class startingHp as base + bonuses
  result.maxHp = buildBreakdown(
    sources.classDef
      ? [{ label: "Base", value: sources.classDef.startingHp }]
      : [],
    collectBonuses("maxHp", all),
    ctx
  );

  // Max Wounds: base 6 + bonuses
  result.maxWounds = buildBreakdown(
    [{ label: "Base", value: 6 }],
    collectBonuses("maxWounds", all),
    ctx
  );

  // Max Hit Dice: level + bonuses
  result.maxHitDice = buildBreakdown(
    [{ label: "Level", value: ctx.level }],
    collectBonuses("maxHitDice", all),
    ctx
  );

  // Hit Die Size: class hitDie as base + bonuses (bonuses increment the die)
  result.hitDieSize = buildBreakdown(
    sources.classDef
      ? [{ label: "Base", value: hitDieToNumber(sources.classDef.hitDie) }]
      : [],
    collectBonuses("hitDieSize", all),
    ctx
  );

  // Initiative: DEX + bonuses
  result.initiative = buildBreakdown(
    [{ label: "DEX", value: ctx.dex }],
    collectBonuses("initiative", all),
    ctx
  );

  // Inventory Slots: 10 + STR + bonuses
  result.inventorySlots = buildBreakdown(
    [
      { label: "Base", value: 10 },
      { label: "STR", value: ctx.str },
    ],
    collectBonuses("inventorySlots", all),
    ctx
  );

  // Mana Max: bonuses only (class derivation provides the formula)
  result.manaMax = buildBreakdown(
    [],
    collectBonuses("manaMax", all),
    ctx
  );

  // Hero Effect DC: bonuses only
  result.heroEffectDc = buildBreakdown(
    [],
    collectBonuses("heroEffectDc", all),
    ctx
  );

  // Skills: stat + allocated (from bonuses) + other bonuses
  const skillKeys = [
    "arcana",
    "examination",
    "finesse",
    "influence",
    "insight",
    "lore",
    "might",
    "naturecraft",
    "perception",
    "stealth",
  ] as const;

  for (const skillId of skillKeys) {
    result[skillId] = buildBreakdown(
      [],
      collectBonuses(skillId, all),
      ctx
    );
  }

  // === Pass 2: Second-order derived values ===

  // Defend damage reduction: depends on armor total
  result.defendDamageReduction = buildBreakdown(
    [{ label: "Armor", value: result.armor.total }],
    collectBonuses("defendDamageReduction", all),
    ctx
  );

  // Death threshold: depends on maxWounds total
  result.deathThreshold = buildBreakdown(
    [{ label: "Max Wounds", value: result.maxWounds.total }],
    collectBonuses("deathThreshold", all),
    ctx
  );

  return result;
}

/** Convert hit die string to numeric value for breakdown math. */
function hitDieToNumber(die: string): number {
  const match = die.match(/^d(\d+)$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}
