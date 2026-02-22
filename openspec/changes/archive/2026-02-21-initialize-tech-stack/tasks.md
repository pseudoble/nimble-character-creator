## 1. Scaffold baseline web app

- [x] 1.1 Create the baseline Next.js + React + TypeScript project structure for NimbleAi
- [x] 1.2 Add baseline app entry files and Next.js configuration required to run locally
- [x] 1.3 Add `package.json` scripts for `dev`, `build`, `start`, and `test`

## 2. Align dependencies and TypeScript configuration

- [x] 2.1 Add core runtime dependencies (`next`, `react`, `react-dom`) and TypeScript toolchain dependencies
- [x] 2.2 Configure strict TypeScript settings and no-emit workflow in `tsconfig.json`
- [x] 2.3 Configure `@/*` path alias mapping and ensure source imports use the alias convention

## 3. Implement test harness

- [x] 3.1 Add Vitest and project test configuration compatible with TypeScript modules
- [x] 3.2 Add at least one baseline passing test proving the harness executes successfully
- [x] 3.3 Verify `npm test` returns success when tests pass
- [x] 3.4 Verify the test command returns non-zero for a failing assertion

## 4. Implement LLM provider runtime configuration

- [x] 4.1 Create a typed runtime config module for provider selection and provider settings
- [x] 4.2 Implement default-provider behavior when provider environment variables are unset
- [x] 4.3 Implement explicit provider override behavior from environment variables
- [x] 4.4 Implement fail-fast validation for missing required provider values

## 5. Document and validate baseline stack

- [x] 5.1 Document setup, run, build, and test workflows in project documentation
- [x] 5.2 Document required and optional provider environment variables with an example local configuration
- [x] 5.3 Run `npm run build` and `npm test` to validate the initialized stack end-to-end
