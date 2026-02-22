# Core Creator Data

Normalized JSON datasets, Zod schemas, and typed loaders for Nimble character creation.

## File Organization

```
src/lib/core-data/
├── data/                    # Canonical JSON datasets
│   ├── ancestries.json      # 24 ancestries with size and traits
│   ├── backgrounds.json     # 23 backgrounds with descriptions
│   ├── classes.json         # 11 classes with stats, gear refs
│   ├── skills.json          # 10 skills linked to stats
│   ├── starting-gear.json   # Starting equipment items
│   └── stat-arrays.json     # Stat point allocations
├── schemas/                 # Zod schema definitions
│   ├── primitives.ts        # Shared types (StableId, Stat, etc.)
│   ├── [domain].ts          # Per-domain schema + dataset type
│   ├── validate.ts          # Validation wrapper + error formatting
│   └── index.ts
├── loaders/                 # Data loading utilities
│   ├── domain-loader.ts     # Per-domain loaders
│   ├── aggregate-loader.ts  # Combined loader (all domains)
│   └── index.ts
└── index.ts                 # Public API
```

## Naming Conventions

- **IDs**: Lowercase kebab-case (`academy-dropout`, `dryad-shroomling`)
- **Files**: Lowercase with hyphens (`starting-gear.json`)
- **Cross-domain references**: Use target domain's `id` field

## Adding or Updating Data

1. Edit the relevant JSON file in `data/`
2. Ensure records have unique `id` values (kebab-case)
3. Use ID references for cross-domain links (e.g. `startingGearIds` in classes)
4. Run `npx vitest run __tests__/core-data/` to validate
5. Fix any schema, uniqueness, or referential integrity errors

## Using the Loader API

```ts
import { loadCoreCreatorData } from "@/lib/core-data";

const data = loadCoreCreatorData();
// data.classes, data.ancestries, data.backgrounds, etc.

// Or load a single domain:
import { loadClasses } from "@/lib/core-data";
const classes = loadClasses();
```

Loaders throw on invalid or missing data. Catch errors at initialization boundaries.

## Common Validation Failures

| Error | Fix |
|-------|-----|
| `Must be a lowercase kebab-case identifier` | IDs must match `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `Array must contain at least 1 element(s)` | Dataset or required array field is empty |
| `references non-existent starting gear` | Add the missing item to `starting-gear.json` |
| `Expected 'str' | 'dex' | 'int' | 'wil'` | Stat value must be one of the four valid stats |
