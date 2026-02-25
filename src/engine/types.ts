export type StatKey = "str" | "dex" | "int" | "wil";

export type DerivedValueKey =
  | "armor"
  | "speed"
  | "maxHp"
  | "maxWounds"
  | "maxHitDice"
  | "hitDieSize"
  | "initiative"
  | "inventorySlots"
  | "manaMax"
  | "heroEffectDc"
  | "defendDamageReduction"
  | "deathThreshold"
  // Skill keys
  | "arcana"
  | "examination"
  | "finesse"
  | "influence"
  | "insight"
  | "lore"
  | "might"
  | "naturecraft"
  | "perception"
  | "stealth";

export interface CharacterConstants {
  str: number;
  dex: number;
  int: number;
  wil: number;
  level: number;
  classId: string;
  keyStats: [StatKey, StatKey];
}

export interface Bonus {
  target: DerivedValueKey;
  label: string;
  value: number | ((ctx: CharacterConstants) => number);
}

export interface Breakdown {
  total: number;
  entries: Array<{ label: string; value: number }>;
}

export interface Ancestry {
  id: string;
  name: string;
  bonuses: Bonus[];
  traits: Array<{
    field: string;
    description: string;
    type?: "advantage" | "disadvantage";
  }>;
}

export interface ClassDef {
  id: string;
  name: string;
  keyStats: [StatKey, StatKey];
  hitDie: string;
  startingHp: number;
  saveProfile: { advantaged: StatKey; disadvantaged: StatKey };
  proficiencies: { weapons: string[]; armor: string[] };
  derivations: Bonus[];
}

export interface Background {
  id: string;
  name: string;
  bonuses: Bonus[];
  languages?: string[];
}
