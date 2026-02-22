## Why

NimbleAi needs a consistent, production-viable project foundation so feature work can start immediately without repeated tooling decisions. Aligning with the proven `../DaggerheartAi` stack now reduces setup risk and lets both projects share development patterns.

## What Changes

- Scaffold NimbleAi with the same core web stack as `../DaggerheartAi`: Next.js, React, TypeScript, and Node/npm workflow.
- Establish the same baseline package scripts for local development, build, run, and test (`dev`, `build`, `start`, `test`).
- Add matching baseline developer tooling for type-safe development and automated tests with Vitest.
- Define environment-based LLM provider runtime configuration conventions compatible with the Daggerheart pattern.
- Document bootstrap and local run instructions for the initialized stack.

## Capabilities

### New Capabilities

- `web-app-foundation`: Project initializes with a Next.js + React + TypeScript application structure and matching baseline configuration.
- `testing-harness`: Project includes a working Vitest setup and `npm test` command for automated test execution.
- `llm-provider-runtime-config`: Project supports environment-driven LLM provider configuration with documented required/optional variables.

### Modified Capabilities

- None.

## Impact

- Creates foundational app and config files (for example `package.json`, `tsconfig.json`, Next.js config, app/source directories, and test config).
- Introduces/locks baseline runtime and dev dependencies for the selected stack.
- Establishes environment variable contract for LLM provider selection and execution settings.
- Sets the baseline that subsequent specs and implementation tasks will build on.
