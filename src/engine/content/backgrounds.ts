import type { Background } from "../types";

export const backgrounds: Record<string, Background> = {
  "academy-dropout": {
    id: "academy-dropout",
    name: "Academy Dropout",
    bonuses: [],
  },
  acrobat: {
    id: "acrobat",
    name: "Acrobat",
    bonuses: [],
  },
  "accidental-acrobat": {
    id: "accidental-acrobat",
    name: "Accidental Acrobat",
    bonuses: [],
  },
  "at-home-underground": {
    id: "at-home-underground",
    name: "At Home Underground",
    bonuses: [],
  },
  "back-out-of-retirement": {
    id: "back-out-of-retirement",
    name: "Back Out of Retirement",
    bonuses: [{ target: "maxWounds", label: "Back Out of Retirement", value: -1 }],
  },
  bumblewise: {
    id: "bumblewise",
    name: "Bumblewise",
    bonuses: [],
  },
  "devoted-protector": {
    id: "devoted-protector",
    name: "Devoted Protector",
    bonuses: [],
  },
  fearless: {
    id: "fearless",
    name: "Fearless",
    bonuses: [
      { target: "armor", label: "Fearless", value: -1 },
      { target: "initiative", label: "Fearless", value: 1 },
    ],
  },
  "fey-touched": {
    id: "fey-touched",
    name: "Fey-Touched",
    bonuses: [],
  },
  "former-con-artist": {
    id: "former-con-artist",
    name: "Former Con Artist",
    bonuses: [],
  },
  "haunted-past": {
    id: "haunted-past",
    name: "Haunted Past",
    bonuses: [],
  },
  "history-buff": {
    id: "history-buff",
    name: "History Buff",
    bonuses: [],
  },
  "home-at-sea": {
    id: "home-at-sea",
    name: "Home at Sea",
    bonuses: [],
  },
  "made-a-bad-choice": {
    id: "made-a-bad-choice",
    name: "Made a Bad Choice",
    bonuses: [],
  },
  "raised-by-goblins": {
    id: "raised-by-goblins",
    name: "Raised by Goblins",
    bonuses: [],
    languages: ["goblin"],
  },
  "secretly-undead": {
    id: "secretly-undead",
    name: "Secretly Undead",
    bonuses: [],
  },
  "so-dumb-im-smart-sometimes": {
    id: "so-dumb-im-smart-sometimes",
    name: "So Dumb I'm Smart Sometimes",
    bonuses: [],
  },
  survivalist: {
    id: "survivalist",
    name: "Survivalist",
    bonuses: [{ target: "maxHitDice", label: "Survivalist", value: 1 }],
  },
  "taste-for-the-finer-things": {
    id: "taste-for-the-finer-things",
    name: "Taste for the Finer Things",
    bonuses: [],
  },
  "tradesman-artisan": {
    id: "tradesman-artisan",
    name: "Tradesman / Artisan",
    bonuses: [],
  },
  "what-ive-been-around": {
    id: "what-ive-been-around",
    name: "What, I've Been Around",
    bonuses: [],
  },
  "wild-one": {
    id: "wild-one",
    name: "Wild One",
    bonuses: [{ target: "naturecraft", label: "Wild One", value: 1 }],
  },
  "wily-underdog": {
    id: "wily-underdog",
    name: "Wily Underdog",
    bonuses: [],
  },
};
