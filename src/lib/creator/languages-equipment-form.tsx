"use client";

import Image from "next/image";
import type { LanguagesEquipmentData, StepValidationResult } from "./types";
import classes from "@/lib/core-data/data/classes.json";
import startingGear from "@/lib/core-data/data/starting-gear.json";
import allLanguages from "@/lib/core-data/data/languages.json";
import ancestries from "@/lib/core-data/data/ancestries.json";
import { backgroundModifiers } from "@/lib/core-data/trait-modifiers";

interface StartingGearItem {
  id: string;
  name: string;
  category: string;
  damage?: string;
  properties?: string[];
  armor?: string;
}

interface AncestryLanguage {
  id: string;
  displayName?: string;
}

interface LanguagesEquipmentFormProps {
  data: LanguagesEquipmentData;
  classId: string;
  ancestryId: string;
  backgroundId: string;
  intStat: number;
  validation: StepValidationResult;
  onChange: (updates: Partial<LanguagesEquipmentData>) => void;
}

function getAncestryLanguageInfo(ancestryId: string): { id: string; displayName: string } | null {
  const ancestry = ancestries.find((a) => a.id === ancestryId);
  if (!ancestry || !ancestry.ancestryLanguage) return null;
  const lang = ancestry.ancestryLanguage as AncestryLanguage;
  const langData = allLanguages.find((l) => l.id === lang.id);
  const displayName = lang.displayName || langData?.name || lang.id;
  return { id: lang.id, displayName };
}

function getKnownLanguages(ancestryId: string, backgroundId: string, intStat: number): { name: string; source: string }[] {
  const known: { name: string; source: string }[] = [{ name: "Common", source: "all heroes" }];
  if (intStat >= 0) {
    const ancestryLang = getAncestryLanguageInfo(ancestryId);
    if (ancestryLang) {
      known.push({ name: ancestryLang.displayName, source: "ancestry" });
    }
  }
  const bgMods = backgroundModifiers[backgroundId];
  if (bgMods?.languages) {
    for (const langId of bgMods.languages) {
      const langData = allLanguages.find((l) => l.id === langId);
      if (langData && !known.some((k) => k.name === langData.name)) {
        known.push({ name: langData.name, source: "background" });
      }
    }
  }
  return known;
}

function getSelectableLanguages(ancestryId: string, backgroundId: string, intStat: number): typeof allLanguages {
  const knownIds = new Set<string>(["common"]);
  if (intStat >= 0) {
    const ancestryLang = getAncestryLanguageInfo(ancestryId);
    if (ancestryLang) knownIds.add(ancestryLang.id);
  }
  const bgMods = backgroundModifiers[backgroundId];
  if (bgMods?.languages) {
    for (const langId of bgMods.languages) {
      knownIds.add(langId);
    }
  }
  return allLanguages.filter((l) => !knownIds.has(l.id));
}

const CATEGORY_ORDER = ["weapon", "armor", "shield", "supplies"];
const CATEGORY_LABELS: Record<string, string> = {
  weapon: "WEAPONS",
  armor: "ARMOR",
  shield: "SHIELDS",
  supplies: "SUPPLIES",
};

function getClassGear(classId: string): StartingGearItem[] {
  const cls = classes.find((c) => c.id === classId);
  if (!cls) return [];
  const gearMap = new Map(startingGear.map((g) => [g.id, g as StartingGearItem]));
  return cls.startingGearIds.map((id) => gearMap.get(id)).filter(Boolean) as StartingGearItem[];
}

function groupByCategory(items: StartingGearItem[]): [string, StartingGearItem[]][] {
  const groups = new Map<string, StartingGearItem[]>();
  for (const item of items) {
    const list = groups.get(item.category) || [];
    list.push(item);
    groups.set(item.category, list);
  }
  return CATEGORY_ORDER
    .filter((cat) => groups.has(cat))
    .map((cat) => [cat, groups.get(cat)!]);
}

function ItemDetail({ item }: { item: StartingGearItem }) {
  if (item.category === "weapon") {
    return (
      <div>
        <div className="font-mono text-sm text-text-high">{item.name}</div>
        <div className="text-xs text-text-med">
          {item.damage}
          {item.properties && item.properties.length > 0 && (
            <span className="text-text-low"> · {item.properties.join(", ")}</span>
          )}
        </div>
      </div>
    );
  }

  if (item.category === "armor" || item.category === "shield") {
    return (
      <div>
        <div className="font-mono text-sm text-text-high">{item.name}</div>
        <div className="text-xs text-text-med">
          Armor {item.armor}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="font-mono text-sm text-text-high">{item.name}</div>
    </div>
  );
}

export function LanguagesEquipmentForm({ data, classId, ancestryId, backgroundId, intStat, validation, onChange }: LanguagesEquipmentFormProps) {
  const gear = getClassGear(classId);
  const grouped = groupByCategory(gear);
  const selected = data.equipmentChoice;
  const knownLanguages = getKnownLanguages(ancestryId, backgroundId, intStat);
  const selectableLanguages = getSelectableLanguages(ancestryId, backgroundId, intStat);
  const bonusPicks = Math.max(0, intStat);

  const cardBase = "flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all";
  const cardSelected = "border-neon-cyan bg-neon-cyan/5 glow-cyan";
  const cardUnselected = "border-surface-3 bg-surface-1 hover:border-surface-3/80";

  const toggleLanguage = (langId: string) => {
    const current = data.selectedLanguages;
    if (current.includes(langId)) {
      onChange({ selectedLanguages: current.filter((id) => id !== langId) });
    } else if (current.length < bonusPicks) {
      onChange({ selectedLanguages: [...current, langId] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Language Section */}
      <section>
        <h2 className="mb-3 text-sm font-mono uppercase tracking-wider text-text-high">
          Languages
        </h2>
        <p className="mb-4 text-sm text-text-med">
          All heroes speak Common. Each point of INT grants one additional language known.
        </p>

        <div className="mb-4">
          <div className="mb-2 text-xs font-mono uppercase tracking-widest text-text-low">
            Known Languages
          </div>
          <div className="flex flex-wrap gap-2">
            {knownLanguages.map((lang) => (
              <span
                key={lang.name}
                className="inline-flex items-center gap-1.5 rounded border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1 text-sm font-mono text-neon-cyan"
              >
                {lang.name}
                <span className="text-[10px] text-text-low">({lang.source})</span>
              </span>
            ))}
          </div>
        </div>

        {bonusPicks > 0 ? (
          <div>
            <div className="mb-2 text-xs font-mono uppercase tracking-widest text-text-low">
              Choose {bonusPicks} additional language{bonusPicks > 1 ? "s" : ""} (INT {intStat > 0 ? "+" : ""}{intStat})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectableLanguages.map((lang) => {
                const isSelected = data.selectedLanguages.includes(lang.id);
                const isDisabled = !isSelected && data.selectedLanguages.length >= bonusPicks;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => toggleLanguage(lang.id)}
                    disabled={isDisabled}
                    className={`rounded border px-3 py-1 text-sm font-mono transition-all ${
                      isSelected
                        ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                        : isDisabled
                        ? "border-surface-3 text-text-low opacity-40 cursor-not-allowed"
                        : "border-surface-3 text-text-med hover:border-neon-cyan/50 hover:text-text-high"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>
            {validation.errors.languages && (
              <p role="alert" className="mt-2 text-xs text-neon-amber">
                {validation.errors.languages}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-text-low italic">
            Your INT is too low to pick additional languages.
          </p>
        )}
      </section>

      {/* Equipment Section */}
      <section>
        <h2 className="mb-3 text-sm font-mono uppercase tracking-wider text-text-high">
          Equipment
        </h2>
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {/* Starting Gear Card */}
          <button
            type="button"
            className={`${cardBase} ${selected === "gear" ? cardSelected : cardUnselected} text-left`}
            onClick={() => onChange({ equipmentChoice: "gear" })}
            aria-pressed={selected === "gear"}
          >
            <div className="mb-3 text-xs font-mono uppercase tracking-wider text-text-low">
              Starting Gear
            </div>
            <div className="space-y-3">
              {grouped.map(([category, items]) => (
                <div key={category}>
                  <div className="mb-1 text-[10px] font-mono uppercase tracking-widest text-text-low">
                    {CATEGORY_LABELS[category]}
                  </div>
                  <div className="space-y-1">
                    {items.map((item, i) => (
                      <ItemDetail key={`${item.id}-${i}`} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </button>

          {/* -OR- Separator */}
          <div className="flex items-center justify-center md:flex-col">
            <div className="h-px w-8 bg-surface-3 md:h-8 md:w-px" />
            <span className="mx-3 md:mx-0 md:my-3 text-xs font-mono uppercase tracking-wider text-text-low">
              or
            </span>
            <div className="h-px w-8 bg-surface-3 md:h-8 md:w-px" />
          </div>

          {/* Starting Gold Card */}
          <button
            type="button"
            className={`${cardBase} ${selected === "gold" ? cardSelected : cardUnselected} text-center flex flex-col items-center justify-center`}
            onClick={() => onChange({ equipmentChoice: "gold" })}
            aria-pressed={selected === "gold"}
          >
            <Image
              src="/gold-pile.png"
              alt="A pile of gold coins"
              width={200}
              height={140}
              className="mb-4"
            />
            <div className="text-2xl font-mono font-bold text-neon-amber">
              50 gp
            </div>
          </button>
        </div>

        {validation.errors.equipmentChoice && (
          <p role="alert" className="mt-2 text-xs text-neon-amber">
            {validation.errors.equipmentChoice}
          </p>
        )}
      </section>
    </div>
  );
}
