import { describe, expect, it } from "vitest";
import {
  STEP_THREE_MAX_SKILL_POINTS_PER_SKILL,
  STEP_THREE_MIN_SKILL_POINTS_PER_SKILL,
  STEP_THREE_REQUIRED_SKILL_POINTS,
} from "@/lib/creator/constants";

/**
 * Tests for the skill total column logic used in step-three-form.tsx.
 * These test the computation and tooltip format without requiring DOM rendering.
 */

function parseNumericStat(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatSignedValue(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function computeSkillTotal(statValue: string, allocatedPoints: number): number {
  return parseNumericStat(statValue) + allocatedPoints;
}

function formatSkillTooltip(
  statLabel: string,
  statValue: string,
  allocatedPoints: number,
): string {
  const statBonus = parseNumericStat(statValue);
  const total = statBonus + allocatedPoints;
  return `${statLabel} ${formatSignedValue(statBonus)} + Points ${allocatedPoints} = ${formatSignedValue(total)}`;
}

describe("Skill total column computation", () => {
  it("computes total as stat bonus + allocated points", () => {
    expect(computeSkillTotal("2", 1)).toBe(3);
  });

  it("treats empty stat value as 0", () => {
    expect(computeSkillTotal("", 2)).toBe(2);
  });

  it("handles negative stat values", () => {
    expect(computeSkillTotal("-1", 3)).toBe(2);
  });

  it("handles zero allocated points", () => {
    expect(computeSkillTotal("2", 0)).toBe(2);
  });

  it("updates when stat value changes", () => {
    const before = computeSkillTotal("0", 2);
    const after = computeSkillTotal("2", 2);
    expect(before).toBe(2);
    expect(after).toBe(4);
  });
});

describe("Skill total tooltip format", () => {
  it("formats tooltip with positive stat and points", () => {
    expect(formatSkillTooltip("INT", "2", 1)).toBe("INT +2 + Points 1 = +3");
  });

  it("formats tooltip with zero stat", () => {
    expect(formatSkillTooltip("DEX", "0", 2)).toBe("DEX +0 + Points 2 = +2");
  });

  it("formats tooltip with negative stat", () => {
    expect(formatSkillTooltip("WIL", "-1", 3)).toBe("WIL -1 + Points 3 = +2");
  });

  it("formats tooltip with zero points", () => {
    expect(formatSkillTooltip("STR", "2", 0)).toBe("STR +2 + Points 0 = +2");
  });

  it("formats tooltip with empty stat as zero", () => {
    expect(formatSkillTooltip("INT", "", 1)).toBe("INT +0 + Points 1 = +1");
  });
});

/**
 * Tests for the skill point pool capping logic used in step-three-form.tsx.
 * Mirrors the effectiveMax and onChange clamping behavior.
 */

function computeEffectiveMax(allocatedPoints: number, remainingSkillPoints: number): number {
  return Math.min(STEP_THREE_MAX_SKILL_POINTS_PER_SKILL, allocatedPoints + remainingSkillPoints);
}

function clampSkillValue(parsed: number, effectiveMax: number): number {
  return Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, STEP_THREE_MIN_SKILL_POINTS_PER_SKILL), effectiveMax)
    : STEP_THREE_MIN_SKILL_POINTS_PER_SKILL;
}

describe("Skill point pool capping", () => {
  it("caps input max to remaining pool when pool is smaller than per-skill max", () => {
    // 3 points already used elsewhere, 1 remaining, this skill has 0
    const max = computeEffectiveMax(0, 1);
    expect(max).toBe(1);
  });

  it("caps input max to per-skill max when pool has plenty remaining", () => {
    // 0 points used, 4 remaining, this skill has 0
    const max = computeEffectiveMax(0, STEP_THREE_REQUIRED_SKILL_POINTS);
    expect(max).toBe(STEP_THREE_MAX_SKILL_POINTS_PER_SKILL);
  });

  it("allows current allocation to be kept even when pool is exhausted", () => {
    // This skill has 2 allocated, 0 remaining (all 4 used across skills)
    const max = computeEffectiveMax(2, 0);
    expect(max).toBe(2);
  });

  it("prevents increasing a skill when no points remain", () => {
    const effectiveMax = computeEffectiveMax(1, 0);
    // User tries to set to 2, but only 1 is allowed
    expect(clampSkillValue(2, effectiveMax)).toBe(1);
  });

  it("allows increasing a skill when points remain", () => {
    const effectiveMax = computeEffectiveMax(1, 2);
    expect(clampSkillValue(3, effectiveMax)).toBe(3);
  });

  it("clamps to 0 for non-finite input", () => {
    expect(clampSkillValue(NaN, 4)).toBe(STEP_THREE_MIN_SKILL_POINTS_PER_SKILL);
  });
});
