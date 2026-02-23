"use client";

import type { StepThreeData, StepValidationResult } from "./types";
import {
  STEP_THREE_MAX_SKILL_POINTS_PER_SKILL,
  STEP_THREE_MIN_SKILL_POINTS_PER_SKILL,
  STEP_THREE_REQUIRED_SKILL_POINTS,
} from "./constants";
import { getRemainingStatValueCounts } from "./step-three-validation";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import statArrays from "@/lib/core-data/data/stat-arrays.json";
import skills from "@/lib/core-data/data/skills.json";

const STAT_FIELDS = [
  { key: "str", label: "STR" },
  { key: "dex", label: "DEX" },
  { key: "int", label: "INT" },
  { key: "wil", label: "WIL" },
] as const;

interface StepThreeFormProps {
  data: StepThreeData;
  statArrayIds: string[];
  skillIds: string[];
  validation: StepValidationResult;
  onChange: (updates: Partial<StepThreeData>) => void;
}

function parseNumericStat(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatSignedValue(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

export function StepThreeForm({
  data,
  statArrayIds,
  skillIds,
  validation,
  onChange,
}: StepThreeFormProps) {
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
  const remainingSkillPoints = STEP_THREE_REQUIRED_SKILL_POINTS - totalAllocated;

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
          <option value="">Select a stat array...</option>
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

      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-text-med">Assign Stats</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {STAT_FIELDS.map((field) => {
            const remainingCounts = selectedStatArray
              ? getRemainingStatValueCounts(selectedStatArray.values, data.stats, field.key)
              : {};
            const selectedValue = Number.parseInt(data.stats[field.key], 10);
            const fieldError = validation.errors[`stats.${field.key}`];

            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`stat-${field.key}`}>{field.label}</Label>
                <Select
                  id={`stat-${field.key}`}
                  value={data.stats[field.key]}
                  disabled={!selectedStatArray}
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
                  <option value="">{selectedStatArray ? `Assign ${field.label}...` : "Select array first..."}</option>
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
        <div className="grid gap-3 sm:grid-cols-2">
          {skillIds.map((skillId) => {
            const skill = skills.find((entry) => entry.id === skillId);
            if (!skill) return null;
            const fieldError = validation.errors[`skillAllocations.${skillId}`];
            const allocatedPoints = data.skillAllocations[skillId] ?? 0;
            const statKey = skill.stat as keyof StepThreeData["stats"];
            const statBonus = parseNumericStat(data.stats[statKey] ?? "");
            const liveSkillTotal = statBonus + allocatedPoints;
            const maxAllowedByTotal = Math.max(
              STEP_THREE_MIN_SKILL_POINTS_PER_SKILL,
              STEP_THREE_REQUIRED_SKILL_POINTS - (totalAllocated - allocatedPoints),
            );
            const maxAllowedForSkill = Math.min(
              STEP_THREE_MAX_SKILL_POINTS_PER_SKILL,
              maxAllowedByTotal,
            );

            return (
              <div key={skillId} className="space-y-2">
                <Label htmlFor={`skill-${skillId}`}>
                  {skill.name} ({skill.stat.toUpperCase()})
                </Label>
                <p className="text-xs text-text-low">{skill.description}</p>
                <p className="text-xs font-mono text-text-med">
                  Total: {formatSignedValue(liveSkillTotal)} (
                  {skill.stat.toUpperCase()} {formatSignedValue(statBonus)} + Points {allocatedPoints})
                </p>
                <Input
                  id={`skill-${skillId}`}
                  type="number"
                  min={STEP_THREE_MIN_SKILL_POINTS_PER_SKILL}
                  max={maxAllowedForSkill}
                  step={1}
                  value={String(allocatedPoints)}
                  onChange={(e) => {
                    const parsed = Number.parseInt(e.target.value, 10);
                    const nextValue = Number.isFinite(parsed)
                      ? Math.min(
                          Math.max(parsed, STEP_THREE_MIN_SKILL_POINTS_PER_SKILL),
                          maxAllowedForSkill,
                        )
                      : 0;
                    onChange({
                      skillAllocations: {
                        ...data.skillAllocations,
                        [skillId]: nextValue,
                      },
                    });
                  }}
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? `skill-${skillId}-error` : undefined}
                />
                {fieldError && (
                  <p id={`skill-${skillId}-error`} role="alert" className="text-xs text-neon-amber">
                    {fieldError}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
