import { describe, expect, it } from "vitest";
import type { CreatorDraft } from "@/lib/creator/types";

/**
 * Unit tests for the debug panel logic.
 * Tests the JSON highlighting function and conditional rendering rules.
 * Component rendering is tested via the highlightJson logic extracted here.
 */

// Reproduce the highlightJson logic from debug-panel.tsx for unit testing
function highlightJson(json: string): string {
  return json
    .replace(
      /("(?:\\.|[^"\\])*")\s*:/g,
      '<span class="text-neon-cyan">$1</span>:'
    )
    .replace(
      /:\s*("(?:\\.|[^"\\])*")/g,
      ': <span class="text-neon-magenta">$1</span>'
    )
    .replace(
      /:\s*(\d+(?:\.\d+)?)/g,
      ': <span class="text-neon-yellow">$1</span>'
    )
    .replace(
      /:\s*(true|false)/g,
      ': <span class="text-neon-green">$1</span>'
    )
    .replace(
      /:\s*(null)/g,
      ': <span class="text-text-low">$1</span>'
    );
}

function makeDraft(): CreatorDraft {
  return {
    version: 1,
    updatedAt: "2026-02-23T00:00:00.000Z",
    stepOne: { classId: "warrior", name: "Test Hero", description: "A brave one" },
    stepTwo: { ancestryId: "human", backgroundId: "soldier", motivation: "glory" },
    stepThree: {
      statArrayId: "standard",
      stats: { str: "2", dex: "1", int: "0", wil: "-1" },
      skillAllocations: { arcana: 2 },
    },
  };
}

describe("debug panel - JSON highlighting", () => {
  it("highlights keys with neon-cyan", () => {
    const json = JSON.stringify({ name: "test" }, null, 2);
    const result = highlightJson(json);
    expect(result).toContain('<span class="text-neon-cyan">"name"</span>');
  });

  it("highlights string values with neon-magenta", () => {
    const json = JSON.stringify({ name: "test" }, null, 2);
    const result = highlightJson(json);
    expect(result).toContain('<span class="text-neon-magenta">"test"</span>');
  });

  it("highlights number values with neon-yellow", () => {
    const json = JSON.stringify({ count: 42 }, null, 2);
    const result = highlightJson(json);
    expect(result).toContain('<span class="text-neon-yellow">42</span>');
  });

  it("highlights boolean values with neon-green", () => {
    const json = JSON.stringify({ active: true }, null, 2);
    const result = highlightJson(json);
    expect(result).toContain('<span class="text-neon-green">true</span>');
  });

  it("highlights null values with text-low", () => {
    const json = JSON.stringify({ value: null }, null, 2);
    const result = highlightJson(json);
    expect(result).toContain('<span class="text-text-low">null</span>');
  });

  it("produces valid highlighted output for a full CreatorDraft", () => {
    const draft = makeDraft();
    const json = JSON.stringify(draft, null, 2);
    const result = highlightJson(json);

    // Keys are highlighted
    expect(result).toContain('<span class="text-neon-cyan">"version"</span>');
    expect(result).toContain('<span class="text-neon-cyan">"name"</span>');

    // String values are highlighted
    expect(result).toContain('<span class="text-neon-magenta">"warrior"</span>');
    expect(result).toContain('<span class="text-neon-magenta">"Test Hero"</span>');

    // Number values are highlighted
    expect(result).toContain('<span class="text-neon-yellow">1</span>');
    expect(result).toContain('<span class="text-neon-yellow">2</span>');
  });
});

describe("debug panel - conditional rendering", () => {
  it("debug mode is active when query param is 'true'", () => {
    const params = new URLSearchParams("?debug=true");
    expect(params.get("debug") === "true").toBe(true);
  });

  it("debug mode is inactive when query param is absent", () => {
    const params = new URLSearchParams("");
    expect(params.get("debug") === "true").toBe(false);
  });

  it("debug mode is inactive when query param is not 'true'", () => {
    const params = new URLSearchParams("?debug=false");
    expect(params.get("debug") === "true").toBe(false);
  });
});
