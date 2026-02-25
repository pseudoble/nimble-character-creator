"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { SheetData } from "./compute-sheet-data";

const STAT_LABELS: Record<string, string> = {
  str: "STR",
  dex: "DEX",
  int: "INT",
  wil: "WIL",
};

function formatModifier(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

function SaveIndicator({ type }: { type: "advantaged" | "disadvantaged" }) {
  return (
    <span
      className={`text-[10px] leading-none ${
        type === "advantaged" ? "text-neon-cyan" : "text-neon-amber"
      }`}
      title={type === "advantaged" ? "Advantaged save" : "Disadvantaged save"}
    >
      {type === "advantaged" ? "▲" : "▼"}
    </span>
  );
}

function ConditionalIcon({ description, type }: { description: string; type?: "advantage" | "disadvantage" }) {
  if (type === "advantage" || type === "disadvantage") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={`text-[10px] leading-none cursor-help ${
                type === "advantage" ? "text-neon-cyan" : "text-neon-amber"
              }`}
            >
              {type === "advantage" ? "▲" : "▼"}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <span className="max-w-48 block">{description}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-neon-magenta/40 text-[10px] text-neon-magenta cursor-help">
            ?
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <span className="max-w-48 block">{description}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-low mb-2">
      {children}
    </h3>
  );
}

function SkillDots({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < count ? "bg-neon-cyan" : "bg-surface-3"
          }`}
        />
      ))}
    </span>
  );
}

interface CharacterSheetProps {
  data: SheetData;
  variant: "preview" | "full";
  onRoll?: (label: string, modifier: number) => void;
}

export function CharacterSheet({ data, variant, onRoll }: CharacterSheetProps) {
  const show = variant === "full" ? alwaysShow : previewVisibility(data);

  return (
    <div className="space-y-4">
      {/* Header */}
      {show.header && (
        <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
          {data.name && (
            <h2 className="text-lg font-mono text-text-high">{data.name}</h2>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-text-med mt-1">
            {data.className && <span>{data.className}</span>}
            {data.ancestryName && (
              <>
                <span className="text-text-low">·</span>
                <span>{data.ancestryName}</span>
              </>
            )}
            {data.backgroundName && (
              <>
                <span className="text-text-low">·</span>
                <span>{data.backgroundName}</span>
              </>
            )}
          </div>
          {data.motivation && (
            <p className="text-xs text-text-low mt-1 italic">
              {data.motivation}
            </p>
          )}
        </div>
      )}

      {/* Stats & Saves */}
      {show.stats && (
        <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
          <SectionHeading>Stats</SectionHeading>
          <div className="grid grid-cols-4 gap-2">
            {(["str", "dex", "int", "wil"] as const).map((stat) => {
              const isAdv = data.saves.advantaged === stat;
              const isDis = data.saves.disadvantaged === stat;
              return (
                <div
                  key={stat}
                  className="flex flex-col items-center rounded border border-surface-3 bg-surface-2 py-2 px-1"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-text-low flex items-center gap-1">
                    {STAT_LABELS[stat]}
                    {data.keyStats.includes(stat) && <span>🔑</span>}
                    {isAdv && <SaveIndicator type="advantaged" />}
                    {isDis && <SaveIndicator type="disadvantaged" />}
                  </span>
                  {onRoll ? (
                    <button
                      type="button"
                      onClick={() => onRoll(`${STAT_LABELS[stat]} Check`, data.stats[stat])}
                      className="text-lg font-mono text-text-high cursor-pointer hover:text-neon-cyan transition-colors"
                    >
                      {formatModifier(data.stats[stat])}
                    </button>
                  ) : (
                    <span className="text-lg font-mono text-text-high">
                      {formatModifier(data.stats[stat])}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vitals */}
      {show.vitals && (
        <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
          <SectionHeading>Vitals</SectionHeading>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <VitalRow label="HP" value={String(data.hp)} />
            <VitalRow
              label="Hit Die"
              value={`${data.hitDieSize} ×${data.hitDiceCount}`}
            />
            <VitalRow
              label="Initiative"
              value={formatModifier(data.initiative)}
              conditionals={data.conditionals.filter(
                (c) => c.field === "initiative"
              )}
            />
            <VitalRow label="Speed" value={String(data.speed)} />
            <VitalRow
              label="Armor"
              value={String(data.armor)}
              conditionals={data.conditionals.filter(
                (c) => c.field === "armor"
              )}
            />
            <VitalRow label="Max Wounds" value={String(data.maxWounds)} />
            <VitalRow
              label="Inventory Slots"
              value={String(data.inventorySlots)}
            />
            <VitalRow label="Size" value={data.size} />
          </div>
        </div>
      )}

      {/* Two-column grid: Skills (left) + Info sections (right) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left column: Skills */}
        {show.skills && (
          <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
            <SectionHeading>Skills</SectionHeading>
            <div className="space-y-1">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="w-24 text-text-med truncate">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-text-low uppercase w-6">
                    {skill.stat}
                  </span>
                  <SkillDots count={skill.allocatedPoints} />
                  {onRoll ? (
                    <button
                      type="button"
                      onClick={() => onRoll(skill.name, skill.total)}
                      className="font-mono text-text-high ml-auto cursor-pointer hover:text-neon-cyan transition-colors"
                    >
                      {formatModifier(skill.total)}
                    </button>
                  ) : (
                    <span className="font-mono text-text-high ml-auto">
                      {formatModifier(skill.total)}
                    </span>
                  )}
                  {skill.conditional && (
                    <ConditionalIcon
                      description={skill.conditional.description}
                      type={skill.conditional.type}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right column: Ancestry Trait, Background, Equipment, Gold, Languages */}
        <div className="space-y-4">
          {show.ancestryTrait && (
            <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
              <SectionHeading>Ancestry Trait</SectionHeading>
              <p className="text-xs font-mono text-neon-cyan">
                {data.ancestryTrait.name}
              </p>
              <p className="text-xs text-text-med mt-1">
                {data.ancestryTrait.description}
              </p>
            </div>
          )}

          {show.background && (
            <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
              <SectionHeading>Background</SectionHeading>
              <p className="text-xs font-mono text-neon-cyan">
                {data.background.name}
              </p>
              <p className="text-xs text-text-med mt-1">
                {data.background.description}
              </p>
            </div>
          )}

          {show.equipment && data.equipment && (
            <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
              <SectionHeading>Equipment</SectionHeading>
              <div className="space-y-2">
                {data.equipment.weapons.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase text-text-low mb-1">
                      Weapons
                    </p>
                    {data.equipment.weapons.map((w, i) => (
                      <div key={i} className="text-xs text-text-med">
                        <span className="text-text-high">{w.name}</span>
                        <span className="text-text-low ml-2">{w.damage}</span>
                        {w.properties.length > 0 && (
                          <span className="text-text-low ml-2">
                            ({w.properties.join(", ")})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {data.equipment.armor.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase text-text-low mb-1">
                      Armor
                    </p>
                    {data.equipment.armor.map((a, i) => (
                      <div key={i} className="text-xs text-text-med">
                        <span className="text-text-high">{a.name}</span>
                        <span className="text-text-low ml-2">{a.armorValue}</span>
                      </div>
                    ))}
                  </div>
                )}
                {data.equipment.shields.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase text-text-low mb-1">
                      Shields
                    </p>
                    {data.equipment.shields.map((s, i) => (
                      <div key={i} className="text-xs text-text-med">
                        <span className="text-text-high">{s.name}</span>
                        <span className="text-text-low ml-2">{s.armorValue}</span>
                      </div>
                    ))}
                  </div>
                )}
                {data.equipment.supplies.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono uppercase text-text-low mb-1">
                      Supplies
                    </p>
                    {data.equipment.supplies.map((s, i) => (
                      <div key={i} className="text-xs text-text-high">
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {show.gold && data.gold !== null && (
            <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
              <SectionHeading>Gold</SectionHeading>
              <p className="text-sm font-mono text-neon-amber">{data.gold} gp</p>
            </div>
          )}

          {show.languages && (
            <div className="rounded-lg border border-surface-3 bg-surface-1 p-4">
              <SectionHeading>Languages</SectionHeading>
              <p className="text-xs text-text-med">
                {data.languages.join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VitalRow({
  label,
  value,
  qualifier,
  conditionals,
}: {
  label: string;
  value: string;
  qualifier?: string;
  conditionals?: Array<{ field: string; description: string; type?: "advantage" | "disadvantage" }>;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-low">{label}</span>
      <span className="font-mono text-text-high flex items-center gap-1">
        {value}
        {qualifier && (
          <span className="text-[10px] text-neon-cyan font-normal">
            ({qualifier})
          </span>
        )}
        {conditionals?.map((c, i) => (
          <ConditionalIcon key={i} description={c.description} type={c.type} />
        ))}
      </span>
    </div>
  );
}

// Visibility logic for preview mode
interface SectionVisibility {
  header: boolean;
  stats: boolean;
  vitals: boolean;
  skills: boolean;
  ancestryTrait: boolean;
  background: boolean;
  equipment: boolean;
  gold: boolean;
  languages: boolean;
}

const alwaysShow: SectionVisibility = {
  header: true,
  stats: true,
  vitals: true,
  skills: true,
  ancestryTrait: true,
  background: true,
  equipment: true,
  gold: true,
  languages: true,
};

function previewVisibility(data: SheetData): SectionVisibility {
  const hasStats =
    data.stats.str !== 0 ||
    data.stats.dex !== 0 ||
    data.stats.int !== 0 ||
    data.stats.wil !== 0;

  return {
    header: !!(data.name || data.className),
    stats: hasStats,
    vitals: !!data.className,
    skills: hasStats,
    ancestryTrait: !!data.ancestryTrait.name,
    background: !!data.background.name,
    equipment: data.equipment !== null,
    gold: data.gold !== null,
    languages: data.languages.length > 0,
  };
}
