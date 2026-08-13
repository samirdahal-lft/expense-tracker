---
approved_by: "Samir dahal"
approved_at: "2026-08-13"
approved_sha256: "e0f3233647907f6b493daa7a2fcf816e7622f6ac1f17e166e354997042efd9e4"
---
# Patch 0008 — Delete confirmation for expenses

**Severity:** minor
**Source:** review feedback — PRODUCT.md explicitly records "no confirmation step, no undo" as the current behaviour; this patch adds the missing safeguard

**Current behavior:** Clicking the "Delete" button on any expense row in `ExpenseList` immediately calls `onDelete(id)`, which fires the `DELETE /api/expenses/{id}` request with no confirmation. The record is permanently gone with a single accidental click.
**Expected behavior:** Clicking "Delete" opens an inline confirmation step showing the expense's category and amount. The deletion proceeds only if the user explicitly confirms. Cancelling dismisses the prompt and leaves the record intact.
**Must NOT change:** edit flow, loading/error/empty states in `ExpenseList`, the `onDelete` callback signature received by `App.tsx`, backend DELETE endpoint, list ordering and display, the accessible `aria-label` pattern on buttons (Constitution §8), Tailwind semantic token usage (Constitution §7)

## TSD S-0008.01 — Delete confirmation dialog in ExpenseList

| Aspect | Spec |
|--------|------|
| Interfaces | `ExpenseList` component (`frontend/src/features/expenses/ExpenseList.tsx`) — no prop-signature change; `onDelete: (id: number) => void` stays identical from `App.tsx`'s perspective. Internally, a `pendingDeleteId: number \| null` state guards the confirmation step. |
| Data / State | `pendingDeleteId: number \| null` — local to `ExpenseList`. `null` = no dialog open. Set to the expense's `id` on Delete click; cleared on Cancel or after confirmed delete. |
| Behavior | (1) User clicks Delete on expense row → `pendingDeleteId` set to that expense's `id`; `onDelete` NOT called yet. (2) Confirmation UI shown, identifying the expense (category + formatted amount). (3a) User confirms → `onDelete(pendingDeleteId)` called; `pendingDeleteId` reset to `null`. (3b) User cancels → `pendingDeleteId` reset to `null`; no deletion. |
| Boundaries | Pure frontend change. No new API endpoints, no backend changes. |
| Tests | Frontend Vitest + Testing Library: render `App`, stub `fetch` (GET expenses returns one record; DELETE returns 200). Assert: (a) clicking Delete does NOT immediately call fetch with DELETE; (b) a confirmation element appears; (c) clicking Cancel hides it and no DELETE request is made; (d) clicking Confirm triggers `DELETE /api/expenses/{id}` and the list reloads. |

## Task T-delete-confirmation-expenses-mho8i4 — Delete confirmation dialog
**Slice:** full vertical — UI state + rendering + interaction + tests
**Acceptance criteria:**
- [ ] AC-1 [behavior]: clicking "Delete" on an expense row does not immediately delete; it shows a confirmation prompt identifying the expense
- [ ] AC-2 [behavior]: clicking "Cancel" (or equivalent) in the prompt dismisses it and makes no DELETE request
- [ ] AC-3 [behavior]: clicking "Confirm" (or equivalent) calls the delete and the row is removed from the list
- [ ] AC-4 [invariant]: only one confirmation prompt is visible at a time (opening a second row's delete while one is pending replaces the pending state)
- [ ] AC-5 [non-functional]: confirmation and cancel controls carry accessible names; Tailwind semantic tokens used throughout (no hardcoded colors)
**Tests:** AC-1, AC-2, AC-3 (AC-4 and AC-5 verified by Critic)

## Execution Plan
> Approved BY the spec stamp: `lane start` copies this section verbatim into the worktree's
> exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last in this file.

**Approach:** add `pendingDeleteId: number | null` local state to `ExpenseList`. On Delete click, set it instead of calling `onDelete`. Render a confirmation prompt (inline or overlay, styled with Tailwind semantic tokens) when `pendingDeleteId !== null`, identifying the expense. Confirm calls `onDelete` then clears state; Cancel clears state only.
**Boundaries & mocks:** fetch stubbed in frontend tests via `vi.stubGlobal` (existing pattern — `frontend/src/test/setup.ts`); no backend changes.
**Behaviors (TDD order):**
- B-1: clicking Delete shows a confirmation prompt and does NOT fire `onDelete` immediately; clicking Cancel dismisses the prompt without deleting
- B-2: clicking Confirm in the prompt calls `onDelete` with the correct id and reloads the list
**Open questions:** none
