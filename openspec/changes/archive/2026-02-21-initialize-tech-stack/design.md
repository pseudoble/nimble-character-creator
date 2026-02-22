## Context

NimbleAi currently needs an initial project scaffold and development workflow. The proposal establishes three required capabilities: a Next.js/React/TypeScript app foundation, a working Vitest test harness, and environment-driven LLM provider configuration.

The reference implementation is `../DaggerheartAi`, which uses:
- Next.js 16.x + React 19.x
- TypeScript with strict checking and `@/*` path alias
- npm scripts: `dev`, `build`, `start`, `test`
- Vitest for tests
- env-driven provider selection (default provider with optional `codex_exec` settings)

Constraint: this change should establish a reusable baseline stack, not copy domain-specific product behavior.

## Goals / Non-Goals

**Goals:**
- Create a NimbleAi baseline web app using the same core technology stack as `../DaggerheartAi`.
- Standardize local developer workflows (run, build, test) with matching script names.
- Provide type-safe runtime configuration for LLM provider selection from environment variables.
- Keep the baseline minimal so future features can layer on without refactoring foundation files.

**Non-Goals:**
- Implement domain-specific product features, routes, or UI flows from DaggerheartAi.
- Introduce deployment infrastructure (CI/CD, containerization, hosting) in this change.
- Add unrelated tooling that is not part of the stack parity target (for example, adding new framework families).

## Decisions

1. Use Next.js + React + TypeScript as the app foundation.
Rationale: This matches the reference stack and provides an immediately productive SSR/CSR-capable web platform.
Alternative considered: Vite + React. Rejected because parity with the reference project would be reduced and future cross-project sharing would be harder.

2. Use npm and include standard scripts `dev`, `build`, `start`, and `test`.
Rationale: DaggerheartAi already uses npm and these script names, so developer behavior is consistent across projects.
Alternative considered: pnpm or bun. Rejected for now to avoid introducing package-manager divergence.

3. Mirror baseline TypeScript conventions from DaggerheartAi (`strict`, `moduleResolution: bundler`, `@/*` alias).
Rationale: Keeps import patterns, compiler behavior, and editor tooling aligned between repositories.
Alternative considered: custom tsconfig tuned for NimbleAi only. Deferred until concrete feature requirements justify divergence.

4. Use Vitest as the initial test harness and wire `npm test` to run it.
Rationale: Lightweight and already proven in the reference project; creates a fast feedback loop from day one.
Alternative considered: Jest. Rejected to avoid test-runner differences between projects.

5. Implement LLM provider configuration as environment-driven runtime settings with a typed config module.
Rationale: Provider selection and provider-specific settings must be swappable without code edits; typed parsing prevents invalid runtime states.
Alternative considered: hardcoded provider selection. Rejected because it prevents flexible local/dev/prod runtime behavior.

6. Keep domain-specific dependencies out of the baseline unless required by core startup capability.
Rationale: Some reference dependencies are feature-specific; baseline stack parity focuses on framework/tooling, not product-specific libraries.
Alternative considered: cloning all reference dependencies exactly. Rejected because it adds unnecessary maintenance overhead before features need them.

## Risks / Trade-offs

- [Version drift from reference stack over time] -> Capture initial versions now and revisit only through explicit dependency updates.
- [Overfitting to current reference conventions] -> Treat this as baseline parity; future feature-driven changes can update conventions intentionally.
- [Env config ambiguity without agreed defaults] -> Provide documented defaults and explicit required/optional variables in the README and config module.
- [Minimal scaffold may omit tooling needed later] -> Add incremental tooling only when tied to a specific capability or implementation task.

## Migration Plan

1. Scaffold the Next.js + TypeScript project structure and baseline configuration files.
2. Add and pin baseline dependencies/devDependencies and package scripts.
3. Add Vitest configuration and at least one passing smoke test.
4. Add typed environment configuration module for LLM provider selection and runtime options.
5. Document setup, env variables, and run/test/build workflows in project docs.
6. Validate with `npm test` and `npm run build`.

Rollback strategy:
- If initialization causes issues, remove newly added scaffold/config/test files and dependency declarations in a single revert commit.
- Because this is foundational and additive, rollback is low-risk and does not require data migration.

## Open Questions

- Should NimbleAi mirror the reference route structure immediately (for example, specific starter routes), or keep only a minimal landing route?
- Which provider should be the NimbleAi default at launch (`ollama`, `codex_exec`, or another)?
- Do we want linting/formatting setup in this same baseline change or in a follow-up change focused on code quality tooling?
