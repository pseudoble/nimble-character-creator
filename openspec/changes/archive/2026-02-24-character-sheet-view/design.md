## Context

The creator wizard uses a two-column layout: accordion form on the left, and a `DebugPanel` on the right that dumps raw `CreatorDraft` JSON. The draft stores raw IDs (e.g., `classId: "berserker"`, `ancestryId: "human"`) and stat values as strings. Displaying a proper character sheet requires resolving IDs to rich data (names, traits, equipment) and computing derived values (final skill scores, HP, initiative, speed, armor, max wounds, inventory slots, max hit dice).

Ancestry and background traits in Nimble are a closed set with well-defined mechanical effects. Rather than parsing natural language descriptions at runtime, we codify all numeric modifiers as structured data at development time.

## Goals / Non-Goals

**Goals:**
- Replace the debug panel with a live character sheet preview that progressively reveals sections as the creator form is filled out
- Compute and display all derived character values accurately per Nimble rules
- Add a full-page character sheet view at `/sheet` that the "Finish" button redirects to
- Codify ancestry and background trait modifiers as structured TypeScript data

**Non-Goals:**
- Character persistence beyond the existing localStorage draft (no database, no character library)
- Print-friendly or PDF export of the character sheet
- Editable fields on the character sheet (it's read-only, derived from the draft)
- Subclass selection or level-up features
- Keeping the debug panel accessible (fully replaced)

## Decisions

### 1. Modifier data structure

Ancestry and background modifiers are defined as a TypeScript map keyed by ID, colocated with core data in `src/lib/core-data/`. Each entry encodes flat numeric bonuses and conditional effects:

```typescript
interface TraitModifiers {
  speed?: number;
  armor?: number;
  maxWounds?: number;
  maxHitDice?: number;
  initiative?: number;
  skills?: Record<string, number> | { all: number };
  hitDieIncrement?: boolean; // Oozeling: d6→d8→d10→d12→d20
  conditionals?: Array<{
    field: string;       // which sheet field this affects
    description: string; // tooltip text
  }>;
}
```

**Why over extending the JSON data files**: Keeps the core data JSON as a clean representation of the game rules. Modifier effects are a separate concern — a mapping layer between game data and sheet computation. This also avoids changing the Zod schemas that validate the JSON.

### 2. Derived value computation as pure functions

A new module `src/lib/sheet/derived-values.ts` (or similar) exports pure functions that take the `CreatorDraft` plus resolved core data and return a flat `SheetData` object with all computed values. This keeps computation testable and decoupled from React rendering.

```typescript
interface SheetData {
  // Identity
  name: string;
  className: string;
  ancestryName: string;
  backgroundName: string;
  motivation: string;
  size: string;

  // Stats (raw values, no base/modifier split)
  stats: { str: number; dex: number; int: number; wil: number };
  saves: { advantaged: string; disadvantaged: string };

  // Vitals
  hp: number;
  hitDieSize: string;
  hitDiceCount: number;
  initiative: number;
  initiativeQualifier?: string; // e.g., "Advantage" for Elf
  speed: number;
  armor: number;
  maxWounds: number;
  inventorySlots: number;

  // Skills
  skills: Array<{
    id: string;
    name: string;
    stat: string;
    allocatedPoints: number;
    total: number;
    conditional?: { description: string };
  }>;

  // Ancestry trait
  ancestryTrait: { name: string; description: string };

  // Background
  background: { name: string; description: string };

  // Equipment (resolved from class starting gear)
  equipment: {
    weapons: Array<{ name: string; damage: string; properties: string[] }>;
    armor: Array<{ name: string; armorValue: string }>;
    shields: Array<{ name: string; armorValue: string }>;
    supplies: Array<{ name: string }>;
  } | null; // null when "gold" chosen

  // Gold
  gold: number | null; // 50 when "gold" chosen, null otherwise

  // Languages
  languages: string[];

  // Conditionals for vitals (tooltip data)
  conditionals: Array<{ field: string; description: string }>;
}
```

### 3. Single shared sheet component, two render contexts

One `CharacterSheet` component renders the sheet layout. It accepts `SheetData` and a `variant` prop (`"preview"` | `"full"`). The preview variant hides sections where data is incomplete (null/empty checks). The full variant assumes all data is present (only reachable after validation passes).

**Why not two separate components**: The layout and styling are identical. A single component avoids duplication. The only behavioral difference is section visibility, handled by the variant prop.

### 4. Sheet section visibility in preview mode

Each section checks whether its required source data is present:

| Section | Visible when |
|---------|-------------|
| Header (name/class/ancestry/bg) | At least name or classId is set |
| Stats + Saves | Any stat value is non-empty |
| Vitals | classId is set (HP, hit die come from class) |
| Skills | Stats are set (skills derive from stats) |
| Ancestry Trait | ancestryId is set |
| Background | backgroundId is set |
| Equipment | equipmentChoice is "gear" and classId is set |
| Gold | equipmentChoice is "gold" |
| Languages | At least one language is known |

### 5. Finish button flow

The last accordion step's "Finish" button:
1. Sets `showErrors(true)` to reveal any remaining validation issues
2. Checks that all four steps are valid
3. If valid, navigates to `/sheet` via Next.js `useRouter().push("/sheet")`
4. The `/sheet` page reads the draft from localStorage (same persistence layer), computes `SheetData`, and renders the full sheet

### 6. `/sheet` page data source

The sheet page reads the `CreatorDraft` from localStorage using the existing `draft-persistence.ts` module. If no valid draft exists, it redirects back to `/create`. This keeps things simple — no new persistence mechanism needed.

**Why not pass data through router state or context**: The draft is already in localStorage. Reading it directly means the sheet page works on refresh and direct navigation. Router state would be lost on refresh.

## Risks / Trade-offs

- **Stale draft on `/sheet`**: If a user bookmarks `/sheet` and returns later after clearing localStorage, they'll get redirected to `/create`. This is acceptable for now — proper character persistence is a future concern.
- **Modifier data maintenance**: Adding new ancestries or backgrounds requires updating the modifier map. Mitigated by keeping the modifier map close to the core data files and documenting the pattern.
- **Armor computation complexity**: Equipment armor values are strings like `"3+DEX"` or `"6+DEX (max 2)"`. These need parsing to compute a final armor number. This is a small, bounded set of formats — a simple parser handles it.
