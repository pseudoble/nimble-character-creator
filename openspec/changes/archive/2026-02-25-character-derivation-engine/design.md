## Context

The app currently has ancestry/background modifiers as flat data maps (`src/lib/ancestry-modifiers.ts`, `src/lib/background-modifiers.ts`) and ad-hoc derived value computation scattered across components and `src/lib/derived-values.ts`. This works for the current creator flow but doesn't scale to additional bonus sources (class features, boons, equipment effects) and doesn't produce auditable breakdowns.

The existing stack is Next.js 16 + React 19 + TypeScript + Vitest. No new dependencies are needed.

## Goals / Non-Goals

**Goals:**
- Unified engine that resolves all derived character values from constants + bonus sources
- Every resolved value returns a `Breakdown` with labeled entries for tooltip display
- Game content (classes, ancestries, backgrounds, boons, equipment) defined as TypeScript files satisfying typed interfaces
- Bonus values are `number | ((ctx: CharacterConstants) => number)` — flat when possible, functions when needed
- Simple two-pass resolution (first-order, then second-order derived values)
- Migrate existing ancestry/background modifier maps to the new contract shape

**Non-Goals:**
- Reactive/observable derivation graph — simple imperative resolution is sufficient
- Conditional or situational bonuses (raging, hunter's mark) — player handles these at the table
- Runtime validation of game content (Zod) — TypeScript compiler enforces contracts
- End-user extensibility — all content authored by developer in TypeScript
- Expression parser or mini-language for formulas

## Decisions

### 1. Bonus values as `number | ((ctx) => number)` union

**Decision**: Bonus sources use a union type rather than tagged formula variants or an expression language.

**Why**: The report contains ~8 distinct formula patterns. A union type handles all of them with zero abstraction overhead. Most bonuses are flat numbers; the few that need computation are simple functions. TypeScript infers and checks the types at compile time.

**Alternatives considered**:
- Tagged union of formula shapes (`{ type: "stat_times_n_plus_level", stat, n }`) — more ceremony, no real benefit when only the developer writes content
- Expression mini-language (`"(int * 3) + level"`) — requires a parser, runtime errors instead of compile-time, solves a problem we don't have (untrusted extensibility)

### 2. Breakdown as the universal return type

**Decision**: Every derived value resolves to `{ total: number, entries: { label: string, value: number }[] }`.

**Why**: Tooltip breakdowns are a must-have. Returning a Breakdown instead of a raw number means the UI can always show "Base 6 + Orc Might +1 = 7 Speed" without a second computation pass. The entries array preserves source attribution.

### 3. Two-pass resolution over topological sort

**Decision**: The engine runs two explicit passes rather than building a full dependency graph with topological sort.

**Why**: The derivation chain is at most 3 levels deep (constants → first-order → second-order). A full graph engine is overkill. Two passes are easy to understand, debug, and test. If chain depth grows later, upgrading to topological sort is straightforward.

### 4. Game content as TypeScript files, not JSON

**Decision**: Ancestries, classes, backgrounds, boons, and equipment are `.ts` files exporting objects that satisfy typed interfaces.

**Why**: Only the developer authors content. TypeScript gives compile-time shape checking. Functions can be embedded directly for computed bonuses. No runtime validation layer needed. The files read like data (plain objects with numbers) but support code when necessary.

### 5. Engine as pure functions, consumed via React hook

**Decision**: The derivation engine is pure functions (`resolve(constants, contentSources) → Record<DerivedValueKey, Breakdown>`). A `useCharacterSheet(draft)` hook wraps it for React consumption with memoization.

**Why**: Pure functions are trivially testable with Vitest. The hook provides the React integration point without coupling the engine to React. Memoization ensures re-renders only when inputs change.

## Risks / Trade-offs

- **Migration disruption**: Existing ancestry/background modifier maps must be reshaped to the new contract. → Mitigation: The new shape is a superset; migration is mechanical, not semantic.
- **Two-pass assumption**: If future game content introduces deeper derivation chains, two passes won't suffice. → Mitigation: The pass structure is isolated in `resolve.ts`; upgrading to topological sort is a localized change.
- **Function bonuses are opaque**: A `(ctx) => number` bonus can't be serialized or inspected like pure data. → Mitigation: Each bonus has a `label` field for attribution; the function body is only needed at compute time, not for display.
