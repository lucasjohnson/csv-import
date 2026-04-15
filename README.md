# CSV Import — Design Document

## Architecture Overview

### How I structured the solution

The app has one problem to solve. How to import an CSV and guide the user through correcting errors. To do this I settled on creating an import wizard, which lives under `Modal/` with its own components, hooks, utils, and styles. Validation logic (`lib/validate/`) is separated from the UI so it could be tested in the future independently, rather than buried in the component it is used.

```
app/
├── components/
│   ├── Modal/
│   │   ├── Modal.tsx                   # Import dialog + wizard orchestration
│   │   ├── hooks/useImportWizard.ts    # Centralized wizard state
│   │   ├── components/
│   │   │   ├── StepDuplicateRows/      # Step 0: row-level deduplication
│   │   │   ├── StepDuplicateEmails/    # Step 1: email deduplication
│   │   │   ├── StepInvalidFields/      # Step 2: format validation
│   │   │   ├── StepSummary/            # Step 3: confirm import
│   │   │   └── EditableCell/           # Inline cell editor
│   │   └── utils/                      # File validation, helpers, and error messages
│   └── DataTable/                      # Post-import table with search/sort
├── lib/
│   ├── schema.ts                       # Zod validation schema
│   ├── validate/                       # Pure validation functions
│   ├── formatters/                     # Display formatting (net worth)
│   └── sort/                           # Sort utilities for table
└── page.tsx                            # Root: holds imported rows state
```

### Key design decisions

**Centralized `useImportWizard` hook:** the entire wizard lifecycle (parsing, validation, step progression, edits, deletion) lives in one hook. This avoids prop-drilling and simplifies state management.

**`RowState` data model:** each row tracks `original`, `current`, and `errors`. This enables undo, and direct cell-to-error mapping without mutating source data.

**Zod schema-first validation:** I chose Zod over custom validation functions because it's what I'd use in production, and it let me tie error messages directly to schema validation to be displayed in the UI.

### Performance optimizations

**`Set` for email lookups:** existing emails are stored in a `Set` rather than an array. A `Set` checks if an email already exists efficiently, whereas an array scans through every entry.

**Ref-based callbacks:** the step-check function is stored in a ref so effects always see the latest version without re-running when it changes.

---

## Architecture Decision Record (ADR)

### Decision 1: Stepped wizard vs. single-view error table

**Alternatives:** A single table showing all errors at once (overwhelming), or a two-step fix-then-confirm flow (mixes unrelated problems together).

**Choice:** A 4-step wizard (duplicate rows → duplicate emails → format errors → summary). One problem category at a time. The trade-off is navigation overhead, but the reduction in complexity is worth it.

### Decision 2: Immutable RowState with schema-driven validation

**Alternatives:** Mutating rows in place (loses undo and before/after), or manual if/else validation (doesn't scale, couples validation to UI).

**Choice:** `{ original, current, errors }` per row allows the user to reset the field, and fix the field with the visual feedback indicators that display the error while it is present.

---

## UX Decisions

### Managing Complexity

**Progressive disclosure:** each step only shows rows with that specific problem. And only allows the user to edit the invalid cells. A 1,000-row CSV with 3 duplicates shows a 3-row table, not a 1,000-row table with 3 highlights. Users only ever see what needs their attention.

**Tab indexing:** allows user to quickly tab trough editable fields.

**Info panels:** describes what fixes each step in plain language.

### Validation

Errors are **inline at the cell level** displayed as red dot with an error message tooltip. Revalidation on each keystroke shows the user as soon as the issue has been resolved. The a green dot is shown when the field is valid. No separate error panels, no toasts. Feedback lives where the data is.

### User guidance

- **Auto-selection:** duplicates are pre-selected for deletion (keeps first). Sensible defaults, user can override.
- **Edit-in-place:** fix values directly in the cell. User can reset the data if they wish.
- **Summary safety net:** final count before any data is imported.

---

## Assumptions

- CSV files include headers that match the expected field names (Name, Email, Phone Number, Net Worth)
- Users work through one import at a time with no concurrent imports

---

## Trade-offs

### What I simplified

- No column mapping: CSV must match expected schema
- No persistence: in-memory only, no backend database
- No batch operations: no "fix all similar errors" action
- Limited to 4 field types with simple validation

### What I would improve with more time

- **Core gaps:** as mentioned in **What I simplified** above.
- **Virtual scrolling:** for better scroll performance, paired with `useMemo` on filtered/sorted rows to avoid unnecessary re-renders.
- **Static CSS over CSS-in-JS:** replace MUI `sx` props and Emotion with CSS Modules to eliminate runtime style computation.
- **Auto-remove duplicates:** strip duplicates on parse and show a dismissible banner rather than requiring manual review.
- **Testing:** unit tests for validation logic and integration tests for the wizard flow.

### What I would research if I had more time

- **Web worker for parsing/validation:** offload PapaParse and Zod validation to a worker thread so large files don't block the UI. This wouldn't speed up processing, but it would keep the UI responsive during parsing.
- **Persistent state:** save progress server-side so users can resume interrupted imports.
