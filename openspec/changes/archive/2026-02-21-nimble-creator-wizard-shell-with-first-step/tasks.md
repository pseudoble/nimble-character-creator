## 1. Establish creator wizard module structure

- [x] 1.1 Create `/create` route entry point under `src/app/create` with a client-side wizard shell component
- [x] 1.2 Add typed creator draft models and step registry types for Step 1 and future-step extensibility
- [x] 1.3 Add a shared creator draft constant set (storage key, schema version, step IDs)

## 2. Implement `/create` shell, navigation, and progress UI

- [x] 2.1 Build the wizard shell layout with step navigation and active-step content region
- [x] 2.2 Implement step-progress UI that reflects current step and completion state
- [x] 2.3 Implement step-advance action wiring in the shell using validation-gated transitions

## 3. Implement Step 1 character basics experience

- [x] 3.1 Build Step 1 UI fields for class selection, character name, and character description
- [x] 3.2 Wire class selector options to existing core-data class records rather than hard-coded options
- [x] 3.3 Add Step 1 validation schema and validation result mapping for field-level feedback
- [x] 3.4 Prevent Step 1 completion/advance when class, name, or description constraints fail

## 4. Add draft persistence and restoration

- [x] 4.1 Implement localStorage draft save/load utilities with defensive parse and version checks
- [x] 4.2 Hydrate wizard state from persisted draft on `/create` load with fallback to clean state
- [x] 4.3 Persist Step 1 edits to draft storage with debounced writes and no-op handling for unchanged state
- [x] 4.4 Revalidate restored draft values against current validation rules and class IDs before marking Step 1 complete

## 5. Add automated test coverage

- [x] 5.1 Add unit tests for Step 1 validation success/failure cases (missing class, blank name, overlong description)
- [x] 5.2 Add unit tests for draft persistence utilities, including malformed payload and version-mismatch handling
- [x] 5.3 Add wizard behavior tests that assert forward navigation is blocked when Step 1 is invalid
- [x] 5.4 Add wizard behavior tests that assert progress and navigation update when Step 1 becomes valid
