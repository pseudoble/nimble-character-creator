"use client";

import type { AncestryBackgroundData, StatsSkillsData, StepValidationResult } from "./types";
import { MIN_SKILL_POINTS_PER_SKILL } from "./constants";
import {
  MAX_SKILL_TOTAL_BONUS,
  STARTING_SKILL_POINTS,
} from "@/lib/constants";
import { getRemainingStatValueCounts } from "./stats-skills-validation";
import {
  ancestryModifiers,
  backgroundModifiers,
  getFlatSkillModifier,
} from "@/lib/core-data/trait-modifiers";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import statArrays from "@/lib/core-data/data/stat-arrays.json";
import skills from "@/lib/core-data/data/skills.json";

const STAT_FIELDS = [
  { key: "str", label: "STR", description: "Melee attacks, feats of strength, carrying capacity" },
  { key: "dex", label: "DEX", description: "Ranged attacks, reflexes, nimble movement" },
  { key: "int", label: "INT", description: "Knowledge, languages, arcane understanding" },
  { key: "wil", label: "WIL", description: "Willpower, perception, force of personality" },
] as const;

interface StatsSkillsFormProps {
  data: StatsSkillsData;
  ancestryBackground: AncestryBackgroundData;
  statArrayIds: string[];
  skillIds: string[];
  validation: StepValidationResult;
  onChange: (updates: Partial<StatsSkillsData>) => void;
}

function parseNumericStat(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatSignedValue(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

export function StatsSkillsForm({
  data,
  ancestryBackground,
  statArrayIds,
  skillIds,
  validation,
  onChange,
}: StatsSkillsFormProps) {
  const ancMods = ancestryModifiers[ancestryBackground.ancestryId] ?? {};
  const bgMods = backgroundModifiers[ancestryBackground.backgroundId] ?? {};
  const selectedStatArray = data.statArrayId
    ? statArrays.find((array) => array.id === data.statArrayId)
    : undefined;
  const statValueOptions = selectedStatArray
    ? Array.from(new Set(selectedStatArray.values))
    : [];
  const totalAllocated = skillIds.reduce(
    (sum, skillId) => sum + (data.skillAllocations[skillId] ?? 0),
    0,
  );
  const remainingSkillPoints = STARTING_SKILL_POINTS - totalAllocated;

  return (
    <div className="space-y-6">
      {(validation.errors.stats ||
        validation.errors.skillPointTotal ||
        validation.errors.skillAllocations) && (
        <div
          role="alert"
          className="rounded border border-neon-amber/50 bg-neon-amber/10 px-3 py-2 text-xs text-neon-amber"
        >
          {validation.errors.stats && <p>{validation.errors.stats}</p>}
          {validation.errors.skillPointTotal && <p>{validation.errors.skillPointTotal}</p>}
          {validation.errors.skillAllocations && <p>{validation.errors.skillAllocations}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="stat-array-select">Stat Array</Label>
        <Select
          id="stat-array-select"
          value={data.statArrayId}
          onChange={(e) => onChange({ statArrayId: e.target.value })}
          aria-invalid={!!validation.errors.statArrayId}
          aria-describedby={validation.errors.statArrayId ? "stat-array-error" : undefined}
        >
          <option value="" disabled={!!selectedStatArray}>
            Select a stat array...
          </option>
          {statArrayIds.map((id) => {
            const array = statArrays.find((entry) => entry.id === id);
            if (!array) return null;
            return (
              <option key={id} value={id}>
                {array.name} ({array.values.join(", ")})
              </option>
            );
          })}
        </Select>
        {validation.errors.statArrayId && (
          <p id="stat-array-error" role="alert" className="text-xs text-neon-amber">
            {validation.errors.statArrayId}
          </p>
        )}
      </div>

      {selectedStatArray && (
        <TooltipProvider>
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-med">Assign Stats</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {STAT_FIELDS.map((field) => {
                const remainingCounts = getRemainingStatValueCounts(
                  selectedStatArray.values,
                  data.stats,
                  field.key,
                );
                const selectedValue = Number.parseInt(data.stats[field.key], 10);
                const fieldError = validation.errors[`stats.${field.key}`];

                return (
                  <div key={field.key} className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Label htmlFor={`stat-${field.key}`}>{field.label}</Label>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">{field.description}</TooltipContent>
                    </Tooltip>
                    <Select
                      id={`stat-${field.key}`}
                      value={data.stats[field.key]}
                      onChange={(e) =>
                        onChange({
                          stats: {
                            ...data.stats,
                            [field.key]: e.target.value,
                          },
                        })
                      }
                      aria-invalid={!!fieldError}
                      aria-describedby={fieldError ? `stat-${field.key}-error` : undefined}
                    >
                      <option value="">{`Assign ${field.label}...`}</option>
                      {statValueOptions.map((value) => {
                        const available = remainingCounts[value] ?? 0;
                        const isCurrent = Number.isInteger(selectedValue) && selectedValue === value;
                        return (
                          <option
                            key={`${field.key}-${value}`}
                            value={String(value)}
                            disabled={available <= 0 && !isCurrent}
                          >
                            {value >= 0 ? `+${value}` : value}
                          </option>
                        );
                      })}
                    </Select>
                    {fieldError && (
                      <p id={`stat-${field.key}-error`} role="alert" className="text-xs text-neon-amber">
                        {fieldError}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-med">Skill Allocation</h3>
            <p
              className={`text-xs font-mono ${
                remainingSkillPoints === 0 ? "text-neon-cyan" : "text-neon-amber"
              }`}
            >
              Remaining: {remainingSkillPoints}
            </p>
          </div>
          <div className="hidden sm:grid sm:grid-cols-[minmax(0,1fr)_11rem_4rem] gap-3 px-3 pb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-low">Skill</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-low sm:justify-self-end">Assigned Points</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-low text-center">Total</span>
          </div>
          <div className="space-y-1">
            {skillIds.map((skillId) => {
              const skill = skills.find((entry) => entry.id === skillId);
              if (!skill) return null;
              const fieldError = validation.errors[`skillAllocations.${skillId}`];
              const allocatedPoints = data.skillAllocations[skillId] ?? 0;
              const statKey = skill.stat as keyof StatsSkillsData["stats"];
              const statBonus = parseNumericStat(data.stats[statKey] ?? "");
              const flatMod = getFlatSkillModifier(skillId, ancMods, bgMods);
              const liveSkillTotal = statBonus + allocatedPoints + flatMod;
              const softCapHeadroom = Math.max(0, MAX_SKILL_TOTAL_BONUS - statBonus - flatMod);

              return (
                <div key={skillId} className="rounded border border-surface-3 bg-surface-2/30 px-3 py-2">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem_4rem] sm:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                      <Label htmlFor={`skill-${skillId}`}>{skill.name}</Label>
                      <span className="rounded border border-neon-cyan/40 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neon-cyan">
                        {skill.stat.toUpperCase()}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-full text-text-low hover:text-text-med focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan"
                            aria-label={`Info about ${skill.name}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="h-3.5 w-3.5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {skill.description}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="sm:justify-self-end">
                      <Input
                        id={`skill-${skillId}`}
                        type="number"
                        min={MIN_SKILL_POINTS_PER_SKILL}
                        max={Math.min(softCapHeadroom, allocatedPoints + remainingSkillPoints)}
                        step={1}
                        value={String(allocatedPoints)}
                        onChange={(e) => {
                          const parsed = Number.parseInt(e.target.value, 10);
                          const effectiveMax = Math.min(
                            softCapHeadroom,
                            allocatedPoints + remainingSkillPoints,
                          );
                          const nextValue = Number.isFinite(parsed)
                            ? Math.min(
                                Math.max(parsed, MIN_SKILL_POINTS_PER_SKILL),
                                effectiveMax,
                              )
                            : MIN_SKILL_POINTS_PER_SKILL;
                          onChange({
                            skillAllocations: {
                              ...data.skillAllocations,
                              [skillId]: nextValue,
                            },
                          });
                        }}
                        aria-invalid={!!fieldError}
                        aria-describedby={fieldError ? `skill-${skillId}-error` : undefined}
                        className="sm:w-32"
                      />
                      {fieldError && (
                        <p id={`skill-${skillId}-error`} role="alert" className="text-xs text-neon-amber">
                          {fieldError}
                        </p>
                      )}
                    </div>

                    <div
                      className="flex items-center justify-center sm:self-center"
                      title={`${skill.stat.toUpperCase()} ${formatSignedValue(statBonus)} + Points ${allocatedPoints}${flatMod !== 0 ? ` + Trait ${formatSignedValue(flatMod)}` : ""} = ${formatSignedValue(liveSkillTotal)}`}
                    >
                      <span className="font-mono text-lg font-bold text-neon-cyan">
                        {formatSignedValue(liveSkillTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
