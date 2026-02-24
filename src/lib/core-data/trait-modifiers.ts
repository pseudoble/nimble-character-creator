/**
 * Structured modifier data for ancestry and background traits.
 * Encodes flat numeric bonuses and conditional effects for sheet computation.
 */

export interface TraitModifiers {
  speed?: number;
  armor?: number;
  maxWounds?: number;
  maxHitDice?: number;
  initiative?: number;
  skills?: Record<string, number> | { all: number };
  hitDieIncrement?: boolean;
  languages?: string[];
  conditionals?: Array<{
    field: string;
    description: string;
    type?: "advantage" | "disadvantage";
  }>;
}

export const ancestryModifiers: Record<string, TraitModifiers> = {
  human: { initiative: 1, skills: { all: 1 } },
  elf: {
    speed: 1,
    conditionals: [{ field: "initiative", description: "Advantage on Initiative", type: "advantage" }],
  },
  dwarf: { speed: -1, maxWounds: 1, maxHitDice: 2 },
  halfling: { skills: { stealth: 1 } },
  gnome: { speed: -1 },
  bunbun: {},
  dragonborn: {
    armor: 1,
    conditionals: [
      { field: "damage", description: "When you attack: deal additional LVL+KEY damage (ignoring armor) divided as you choose; recharges at Safe Rest or gaining a Wound" },
    ],
  },
  fiendkin: {
    conditionals: [
      { field: "saves", description: "1 of your neutral saves is advantaged instead" },
    ],
  },
  goblin: {},
  kobold: {
    conditionals: [
      { field: "influence", description: "+3 to Influence vs friendly characters" },
    ],
  },
  orc: { skills: { might: 2 } },
  birdfolk: {
    conditionals: [
      { field: "speed", description: "Fly Speed while wearing armor no heavier than Leather" },
      { field: "defense", description: "Crits against you are Vicious; forced movement moves you twice as far" },
    ],
  },
  celestial: {
    conditionals: [
      { field: "saves", description: "Your disadvantaged save is Neutral instead" },
    ],
  },
  changeling: {
    conditionals: [
      { field: "skills", description: "+2 shifting skill points; place into any 1 skill when taking new appearance (1/day)" },
    ],
  },
  crystalborn: {
    conditionals: [
      { field: "armor", description: "When you Defend, gain KEY armor and deal KEY damage back to attacker (1/encounter)" },
    ],
  },
  "dryad-shroomling": {
    conditionals: [
      { field: "defense", description: "When an enemy causes you Wounds, all adjacent enemies are Dazed" },
    ],
  },
  "half-giant": { skills: { might: 2 } },
  "minotaur-beastfolk": {
    conditionals: [
      { field: "movement", description: "When you move 4+ spaces, push a creature in your path (1/turn)" },
    ],
  },
  "oozeling-construct": { hitDieIncrement: true },
  planarbeing: {
    maxWounds: -2,
    conditionals: [
      { field: "defense", description: "When you Defend, gain 1 Wound to phase out and ignore damage" },
    ],
  },
  ratfolk: {
    conditionals: [
      { field: "armor", description: "+2 Armor if you moved on your last turn" },
    ],
  },
  stoatling: {
    conditionals: [
      { field: "damage", description: "Roll 1 additional d6 per size category larger when attacking single-target larger creature (they do same)" },
    ],
  },
  turtlefolk: { speed: -2, armor: 4 },
  wyrdling: {
    conditionals: [
      { field: "spells", description: "When you or willing ally within Reach 6 casts a tiered spell, allow Chaos Table roll (1/encounter)" },
    ],
  },
};

export const backgroundModifiers: Record<string, TraitModifiers> = {
  "academy-dropout": {},
  acrobat: {},
  "accidental-acrobat": {},
  "at-home-underground": {},
  "back-out-of-retirement": { maxWounds: -1 },
  bumblewise: {},
  "devoted-protector": {},
  fearless: { armor: -1, initiative: 1 },
  "fey-touched": {},
  "former-con-artist": {},
  "haunted-past": {},
  "history-buff": {},
  "home-at-sea": {},
  "made-a-bad-choice": {},
  "raised-by-goblins": { languages: ["goblin"] },
  "secretly-undead": {},
  "so-dumb-im-smart-sometimes": {},
  survivalist: { maxHitDice: 1 },
  "taste-for-the-finer-things": {},
  "tradesman-artisan": {},
  "what-ive-been-around": {},
  "wild-one": { skills: { naturecraft: 1 } },
  "wily-underdog": {},
};
