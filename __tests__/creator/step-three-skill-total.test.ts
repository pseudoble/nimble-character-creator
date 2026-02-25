import { describe, expect, it } from "vitest";
import { MIN_SKILL_POINTS_PER_SKILL } from "@/lib/creator/constants";
import {
  MAX_SKILL_TOTAL_BONUS,
  STARTING_SKILL_POINTS,
} from "@/lib/constants";

/**
 * Tests for the skill total column logic used in stats-skills-form.tsx.
 * These test the computation and tooltip format without requiring DOM rendering.
 */

function parseNumericStat(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatSignedValue(value: number): string {
  return value >= 0 ? `+${value}` : String(value);
}

function computeSkillTotal(statValue: string, allocatedPoints: number, flatMod = 0): number {
  return parseNumericStat(statValue) + allocatedPoints + flatMod;
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

  it("includes flat trait modifier in total", () => {
    expect(computeSkillTotal("2", 1, 1)).toBe(4);
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
 * Tests for the skill point pool and soft-cap capping logic used in stats-skills-form.tsx.
 * Mirrors the effectiveMax and onChange clamping behavior.
 */

function computeSoftCapHeadroom(statBonus: number, flatMod: number): number {
  return Math.max(0, MAX_SKILL_TOTAL_BONUS - statBonus - flatMod);
}

function computeEffectiveMax(allocatedPoints: number, remainingSkillPoints: number, softCapHeadroom: number): number {
  return Math.min(softCapHeadroom, allocatedPoints + remainingSkillPoints);
}

function clampSkillValue(parsed: number, effectiveMax: number): number {
  return Number.isFinite(parsed)
    ? Math.min(Math.max(parsed, MIN_SKILL_POINTS_PER_SKILL), effectiveMax)
    : MIN_SKILL_POINTS_PER_SKILL;
}

describe("Skill point pool and soft-cap capping", () => {
  it("caps input max to remaining pool when pool is smaller than soft-cap headroom", () => {
    // stat=0, no trait mod → headroom=12. 3 points used elsewhere, 1 remaining
    const headroom = computeSoftCapHeadroom(0, 0);
    const max = computeEffectiveMax(0, 1, headroom);
    expect(max).toBe(1);
  });

  it("caps input max to soft-cap headroom when pool has plenty remaining", () => {
    // stat=2, no trait mod → headroom=10. pool has 4 remaining (all available)
    const headroom = computeSoftCapHeadroom(2, 0);
    const max = computeEffectiveMax(0, STARTING_SKILL_POINTS, headroom);
    expect(max).toBe(STARTING_SKILL_POINTS); // 4 < 10
  });

  it("allows current allocation to be kept even when pool is exhausted", () => {
    const headroom = computeSoftCapHeadroom(0, 0);
    const max = computeEffectiveMax(2, 0, headroom);
    expect(max).toBe(2);
  });

  it("prevents increasing a skill when no points remain", () => {
    const headroom = computeSoftCapHeadroom(0, 0);
    const effectiveMax = computeEffectiveMax(1, 0, headroom);
    expect(clampSkillValue(2, effectiveMax)).toBe(1);
  });

  it("allows increasing a skill when points remain", () => {
    const headroom = computeSoftCapHeadroom(0, 0);
    const effectiveMax = computeEffectiveMax(1, 2, headroom);
    expect(clampSkillValue(3, effectiveMax)).toBe(3);
  });

  it("clamps to 0 for non-finite input", () => {
    expect(clampSkillValue(NaN, 4)).toBe(MIN_SKILL_POINTS_PER_SKILL);
  });

  it("soft-cap headroom reduces effective max when trait modifier is large", () => {
    // stat=2, trait mod=2 → headroom = 12 - 2 - 2 = 8
    const headroom = computeSoftCapHeadroom(2, 2);
    expect(headroom).toBe(8);
    const max = computeEffectiveMax(0, STARTING_SKILL_POINTS, headroom);
    expect(max).toBe(STARTING_SKILL_POINTS); // 4 < 8
  });

  it("soft-cap headroom can be zero when stat + trait already reaches cap", () => {
    // stat=10, trait mod=2 → headroom = 0
    const headroom = computeSoftCapHeadroom(10, 2);
    expect(headroom).toBe(0);
    const max = computeEffectiveMax(0, STARTING_SKILL_POINTS, headroom);
    expect(max).toBe(0);
  });

  it("soft-cap headroom is bounded to 0 (never negative)", () => {
    const headroom = computeSoftCapHeadroom(15, 0);
    expect(headroom).toBe(0);
  });
});
