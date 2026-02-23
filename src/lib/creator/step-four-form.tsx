"use client";

import Image from "next/image";
import type { StepFourData, StepValidationResult } from "./types";
import classes from "@/lib/core-data/data/classes.json";
import startingGear from "@/lib/core-data/data/starting-gear.json";

interface StartingGearItem {
  id: string;
  name: string;
  category: string;
  damage?: string;
  properties?: string[];
  armor?: string;
}

interface StepFourFormProps {
  data: StepFourData;
  classId: string;
  validation: StepValidationResult;
  onChange: (updates: Partial<StepFourData>) => void;
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

export function StepFourForm({ data, classId, validation, onChange }: StepFourFormProps) {
  const gear = getClassGear(classId);
  const grouped = groupByCategory(gear);
  const selected = data.equipmentChoice;

  const cardBase = "flex-1 cursor-pointer rounded-lg border-2 p-4 transition-all";
  const cardSelected = "border-neon-cyan bg-neon-cyan/5 glow-cyan";
  const cardUnselected = "border-surface-3 bg-surface-1 hover:border-surface-3/80";

  return (
    <div className="space-y-4">
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
        <p role="alert" className="text-xs text-neon-amber">
          {validation.errors.equipmentChoice}
        </p>
      )}
    </div>
  );
}
