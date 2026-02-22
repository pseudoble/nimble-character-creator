## ADDED Requirements

### Requirement: Vitest is the project test runner
The project SHALL use Vitest as the automated test runner and wire `npm test` to execute the test suite.

#### Scenario: Test script executes Vitest
- **WHEN** a developer runs `npm test`
- **THEN** the command invokes Vitest and exits with a success or failure status based on test outcomes

#### Scenario: Test tooling is declared in dependencies
- **WHEN** a developer reviews `package.json`
- **THEN** the development dependency set includes Vitest and required type dependencies for TypeScript test execution

### Requirement: Baseline tests validate harness functionality
The project SHALL include at least one passing baseline test that confirms the test harness is operational in a clean checkout.

#### Scenario: Baseline test passes on clean setup
- **WHEN** a developer installs dependencies and runs `npm test` in a clean environment
- **THEN** at least one baseline test executes and passes

#### Scenario: Failing expectations fail the run
- **WHEN** any baseline or feature test has a failed assertion
- **THEN** `npm test` exits non-zero to signal failure in local development or automation

### Requirement: Test configuration supports project TypeScript conventions
The test harness SHALL run TypeScript tests without a separate transpile step and respect project module resolution conventions.

#### Scenario: TypeScript tests run directly
- **WHEN** tests are authored in `.ts` or `.tsx` files
- **THEN** the test runner executes them without requiring manual compilation

#### Scenario: Alias imports work in tests
- **WHEN** test code imports modules using the project alias convention
- **THEN** imports resolve successfully during test execution
