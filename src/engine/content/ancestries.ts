import type { Ancestry } from "../types";

export const ancestries: Record<string, Ancestry> = {
  human: {
    id: "human",
    name: "Human",
    bonuses: [
      { target: "initiative", label: "Human", value: 1 },
      { target: "arcana", label: "Human", value: 1 },
      { target: "examination", label: "Human", value: 1 },
      { target: "finesse", label: "Human", value: 1 },
      { target: "influence", label: "Human", value: 1 },
      { target: "insight", label: "Human", value: 1 },
      { target: "lore", label: "Human", value: 1 },
      { target: "might", label: "Human", value: 1 },
      { target: "naturecraft", label: "Human", value: 1 },
      { target: "perception", label: "Human", value: 1 },
      { target: "stealth", label: "Human", value: 1 },
    ],
    traits: [],
  },
  elf: {
    id: "elf",
    name: "Elf",
    bonuses: [{ target: "speed", label: "Elf", value: 1 }],
    traits: [
      {
        field: "initiative",
        description: "Advantage on Initiative",
        type: "advantage",
      },
    ],
  },
  dwarf: {
    id: "dwarf",
    name: "Dwarf",
    bonuses: [
      { target: "speed", label: "Dwarf", value: -1 },
      { target: "maxWounds", label: "Dwarf", value: 1 },
      { target: "maxHitDice", label: "Dwarf", value: 2 },
    ],
    traits: [],
  },
  halfling: {
    id: "halfling",
    name: "Halfling",
    bonuses: [{ target: "stealth", label: "Halfling", value: 1 }],
    traits: [],
  },
  gnome: {
    id: "gnome",
    name: "Gnome",
    bonuses: [{ target: "speed", label: "Gnome", value: -1 }],
    traits: [],
  },
  bunbun: {
    id: "bunbun",
    name: "Bunbun",
    bonuses: [],
    traits: [],
  },
  dragonborn: {
    id: "dragonborn",
    name: "Dragonborn",
    bonuses: [{ target: "armor", label: "Dragonborn", value: 1 }],
    traits: [
      {
        field: "damage",
        description:
          "When you attack: deal additional LVL+KEY damage (ignoring armor) divided as you choose; recharges at Safe Rest or gaining a Wound",
      },
    ],
  },
  fiendkin: {
    id: "fiendkin",
    name: "Fiendkin",
    bonuses: [],
    traits: [
      {
        field: "saves",
        description: "1 of your neutral saves is advantaged instead",
      },
    ],
  },
  goblin: {
    id: "goblin",
    name: "Goblin",
    bonuses: [],
    traits: [],
  },
  kobold: {
    id: "kobold",
    name: "Kobold",
    bonuses: [],
    traits: [
      {
        field: "influence",
        description: "+3 to Influence vs friendly characters",
      },
    ],
  },
  orc: {
    id: "orc",
    name: "Orc",
    bonuses: [{ target: "might", label: "Orc Might", value: 1 }],
    traits: [],
  },
  birdfolk: {
    id: "birdfolk",
    name: "Birdfolk",
    bonuses: [],
    traits: [
      {
        field: "speed",
        description:
          "Fly Speed while wearing armor no heavier than Leather",
      },
      {
        field: "defense",
        description:
          "Crits against you are Vicious; forced movement moves you twice as far",
      },
    ],
  },
  celestial: {
    id: "celestial",
    name: "Celestial",
    bonuses: [],
    traits: [
      {
        field: "saves",
        description: "Your disadvantaged save is Neutral instead",
      },
    ],
  },
  changeling: {
    id: "changeling",
    name: "Changeling",
    bonuses: [],
    traits: [
      {
        field: "skills",
        description:
          "+2 shifting skill points; place into any 1 skill when taking new appearance (1/day)",
      },
    ],
  },
  crystalborn: {
    id: "crystalborn",
    name: "Crystalborn",
    bonuses: [],
    traits: [
      {
        field: "armor",
        description:
          "When you Defend, gain KEY armor and deal KEY damage back to attacker (1/encounter)",
      },
    ],
  },
  "dryad-shroomling": {
    id: "dryad-shroomling",
    name: "Dryad / Shroomling",
    bonuses: [],
    traits: [
      {
        field: "defense",
        description:
          "When an enemy causes you Wounds, all adjacent enemies are Dazed",
      },
    ],
  },
  "half-giant": {
    id: "half-giant",
    name: "Half-Giant",
    bonuses: [{ target: "might", label: "Half-Giant", value: 2 }],
    traits: [],
  },
  "minotaur-beastfolk": {
    id: "minotaur-beastfolk",
    name: "Minotaur / Beastfolk",
    bonuses: [],
    traits: [
      {
        field: "movement",
        description:
          "When you move 4+ spaces, push a creature in your path (1/turn)",
      },
    ],
  },
  "oozeling-construct": {
    id: "oozeling-construct",
    name: "Oozeling / Construct",
    bonuses: [{ target: "hitDieSize", label: "Oozeling/Construct", value: 2 }],
    traits: [],
  },
  planarbeing: {
    id: "planarbeing",
    name: "Planar Being",
    bonuses: [{ target: "maxWounds", label: "Planar Being", value: -2 }],
    traits: [
      {
        field: "defense",
        description:
          "When you Defend, gain 1 Wound to phase out and ignore damage",
      },
    ],
  },
  ratfolk: {
    id: "ratfolk",
    name: "Ratfolk",
    bonuses: [],
    traits: [
      {
        field: "armor",
        description: "+2 Armor if you moved on your last turn",
      },
    ],
  },
  stoatling: {
    id: "stoatling",
    name: "Stoatling",
    bonuses: [],
    traits: [
      {
        field: "damage",
        description:
          "Roll 1 additional d6 per size category larger when attacking single-target larger creature (they do same)",
      },
    ],
  },
  turtlefolk: {
    id: "turtlefolk",
    name: "Turtlefolk",
    bonuses: [
      { target: "speed", label: "Turtlefolk", value: -2 },
      { target: "armor", label: "Turtlefolk", value: 4 },
    ],
    traits: [],
  },
  wyrdling: {
    id: "wyrdling",
    name: "Wyrdling",
    bonuses: [],
    traits: [
      {
        field: "spells",
        description:
          "When you or willing ally within Reach 6 casts a tiered spell, allow Chaos Table roll (1/encounter)",
      },
    ],
  },
};
