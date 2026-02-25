import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StatsSkillsForm } from "@/lib/creator/stats-skills-form";
import type { StatsSkillsData, StepValidationResult } from "@/lib/creator/types";

const baseValidation: StepValidationResult = { valid: true, errors: {} };

function renderForm(data: StatsSkillsData): string {
  return renderToStaticMarkup(
    <StatsSkillsForm
      data={data}
      ancestryBackground={{ ancestryId: "elf", backgroundId: "fearless", motivation: "" }}
      statArrayIds={["standard", "balanced", "min-max"]}
      skillIds={["arcana", "stealth"]}
      validation={baseValidation}
      onChange={() => {}}
    />,
  );
}

describe("StatsSkillsForm stat-array gating", () => {
  it("hides Assign Stats until a valid stat array is selected", () => {
    const markup = renderForm({
      statArrayId: "",
      stats: { str: "", dex: "", int: "", wil: "" },
      skillAllocations: { arcana: 2, stealth: 2 },
    });

    expect(markup).not.toContain("Assign Stats");
    expect(markup).not.toContain('id="stat-str"');
    expect(markup).not.toContain('id="stat-dex"');
    expect(markup).not.toContain('id="stat-int"');
    expect(markup).not.toContain('id="stat-wil"');
  });

  it("shows Assign Stats after selecting a valid stat array", () => {
    const markup = renderForm({
      statArrayId: "standard",
      stats: { str: "", dex: "", int: "", wil: "" },
      skillAllocations: { arcana: 2, stealth: 2 },
    });

    expect(markup).toContain("Assign Stats");
    expect(markup).toContain('id="stat-str"');
    expect(markup).toContain('id="stat-dex"');
    expect(markup).toContain('id="stat-int"');
    expect(markup).toContain('id="stat-wil"');
  });

  it("disables the placeholder option after a valid stat array is selected", () => {
    const withSelection = renderForm({
      statArrayId: "standard",
      stats: { str: "", dex: "", int: "", wil: "" },
      skillAllocations: { arcana: 2, stealth: 2 },
    });

    const withoutSelection = renderForm({
      statArrayId: "",
      stats: { str: "", dex: "", int: "", wil: "" },
      skillAllocations: { arcana: 2, stealth: 2 },
    });

    expect(withSelection).toMatch(
      /<option value="" disabled="">Select a stat array\.\.\.<\/option>/,
    );
    expect(withoutSelection).toContain(
      "<option value=\"\" selected=\"\">Select a stat array...</option>",
    );
  });
});
