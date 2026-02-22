## Context

NimbleAi currently has app/runtime scaffolding, but no canonical, validated core creator dataset for classes, ancestries, backgrounds, stat arrays, skills, and starting gear. The proposal requires a normalized JSON source of truth, schema validation, loader utilities, and integrity tests so creator features consume deterministic data instead of ad hoc structures.

This change is cross-cutting because it introduces:
- New domain data contracts
- Runtime parsing/validation behavior
- Test enforcement for data correctness
- Contributor workflow for data updates

## Goals / Non-Goals

**Goals:**
- Define a normalized JSON model for the six core creator domains.
- Provide explicit schemas that validate data shape and required constraints.
- Expose typed loader APIs that parse and validate core data before use.
- Add automated integrity tests for schema conformance and cross-entity consistency.
- Document where data lives and how to safely add or modify entries.

**Non-Goals:**
- Implement full character-creation UI flow in this change.
- Introduce non-core domains (spells, monsters, advanced optional content).
- Replace all existing app content with normalized data in one step.
- Build external ingestion tooling for OCR or source-document extraction.

## Decisions

1. Canonical data is stored as normalized JSON files, one file per domain.
Rationale: Domain-separated JSON keeps updates isolated, diff-friendly, and reviewable.
Alternative considered: one monolithic JSON document. Rejected due to high merge friction and poor maintainability.

2. Use stable string IDs and reference-by-ID across datasets.
Rationale: Referential integrity checks and loader joins are simpler and deterministic.
Alternative considered: nesting full referenced objects. Rejected because it duplicates data and risks drift.

3. Define schemas in code using Zod and validate on load.
Rationale: Zod already exists in the stack, gives runtime validation plus inferred TypeScript types from one source.
Alternative considered: JSON Schema + separate validator dependency. Rejected to avoid extra tooling divergence.

4. Build domain loaders plus a composed core-data loader.
Rationale: Consumers can load only needed domains or one validated aggregate, while keeping implementation modular.
Alternative considered: direct JSON imports in feature code. Rejected because it bypasses validation and central error handling.

5. Add integrity tests beyond schema shape checks.
Rationale: Many data defects are relational (missing IDs, dangling references, duplicate keys), so tests must assert cross-file invariants.
Alternative considered: schema-only tests. Rejected because schema validity alone does not guarantee usable creator data.

6. Fail fast on invalid core data during initialization paths that require this dataset.
Rationale: Early failure prevents silent bad character-generation behavior.
Alternative considered: permissive runtime fallback. Rejected because hidden data corruption is harder to detect and debug.

## Risks / Trade-offs

- [Schema strictness blocks quick data edits] -> Provide clear validation errors and contributor docs for expected formats.
- [Cross-reference rules evolve as creator logic expands] -> Centralize integrity rules in test helpers so constraints are easy to extend.
- [Large JSON files become hard to manage over time] -> Keep per-domain segmentation and optionally split by subdomain in follow-up work.
- [Runtime load cost from repeated validation] -> Cache validated loader output and validate once per process where appropriate.

## Migration Plan

1. Create core-data directory layout and initial normalized JSON files for the six domains.
2. Define Zod schemas and shared primitive/schema helpers.
3. Implement loaders that read JSON, validate against schemas, and return typed data.
4. Implement aggregate loader that resolves/validates cross-domain relationships.
5. Add integrity tests:
   - schema conformance
   - unique ID constraints
   - referential integrity across domains
   - required domain invariants
6. Document file layout and data update workflow.
7. Integrate loaders at one safe consumption point to verify end-to-end behavior.

Rollback strategy:
- Revert added core-data files/modules/tests in a single commit.
- Restore previous data consumption path (if any) without data migration, since this is additive.

## Open Questions

- Should canonical data include only core rules now, or also Creator’s Kit extensions in this same dataset version?
- Which cross-domain links are mandatory in v1 (for example, background->skills, class->starting gear, ancestry->stat modifiers)?
- Do we want explicit dataset version metadata now (for future rulebook revisions), or defer to a later change?
