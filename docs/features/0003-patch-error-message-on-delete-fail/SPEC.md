---
approved_by: "Samir dahal"
approved_at: "2026-08-20"
approved_sha256: "356eb45d3dc92a15fa21043cffe384063d3d7ed6a0ea06b03a80536c63fb7bbb"
---
# Patch 0003 — Show error message when expense deletion fails

**Severity:** minor
**Source:** code review — `handleDelete` in `App.tsx` has no error handling

**Current behavior:** When `deleteExpense(id)` throws (network error, 4xx/5xx from the API),
the error is silently swallowed. `refreshAll()` never runs, the item stays in the list,
and the user sees no feedback at all — they don't know the deletion failed.

**Expected behavior:** When deletion fails, an inline error banner appears below the expense
list heading (e.g. "Couldn't delete expense. Please try again."). The list is unchanged
(item stays). The banner disappears when any subsequent deletion succeeds or when a new
delete attempt is made.

**Must NOT change:** Successful deletion still removes the item and refreshes both the list
and the summary without a page reload. No layout, styling, or behavior changes to the happy path.

## TSD S-0003.01 — Delete error feedback

| Aspect | Spec |
|--------|------|
| Interfaces | `App.handleDelete` — catches errors thrown by `deleteExpense`; sets local error state. `ExpenseList` — accepts an optional `deleteError: string \| null` prop and renders it when non-null. |
| Data / State | New `string \| null` state in `App` (e.g. `deleteError`), initialised to `null`, set on failure, cleared to `null` on the next delete attempt. |
| Behavior | On delete failure: `deleteError` is set to a user-readable string; the list is NOT refreshed; the banner renders. On delete success: `deleteError` is cleared, list and summary refresh as before. |
| Boundaries | `deleteExpense` (the API client call) — faked in tests via `vi.stubGlobal("fetch", …)` exactly as the existing delete test does. |
| Tests | Unit: `App` — stub `fetch` to return `{ ok: false, status: 500 }` on DELETE; click Delete; assert the error banner appears and the item is still in the list. Regression: existing B-3 test (`DeleteExpense.test.tsx`) must stay green. |

## Task T-error-message-on-delete-fail-rcrr7s — Delete error feedback

**Slice:** full vertical — state change in `App`, prop thread to `ExpenseList`, rendered banner + tests
**Acceptance criteria:**
- [ ] AC-1 [behavior]: clicking Delete when the API returns a non-2xx response shows an inline error message visible in the document
- [ ] AC-2 [invariant]: clicking Delete when the API returns a non-2xx response does NOT remove the item from the list
- [ ] AC-3 [invariant]: the existing B-3 happy-path delete test continues to pass unchanged
**Tests:** AC-1, AC-2  ← tracer bullet first; AC-3 is a regression guard (existing test)

## Execution Plan

**Approach:** Catch the error thrown by `deleteExpense` inside `handleDelete` in `App.tsx`,
set a `deleteError` state string. Pass `deleteError` as a new optional prop to `ExpenseList`
and render a `<p>` banner when it is non-null. Clear the state at the start of each delete
attempt.

**Boundaries & mocks:** `fetch` global stubbed via `vi.stubGlobal` — same pattern as existing
`DeleteExpense.test.tsx`. No real network calls in tests.

**Behaviors (TDD order):**
- B-1: failing test asserts error banner appears and item stays when DELETE returns 500; then implement catch + state + prop + banner

**Open questions:** none
