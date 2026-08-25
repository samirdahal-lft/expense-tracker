---
approved_by: "Samir dahal"
approved_at: "2026-08-25"
approved_sha256: "7daaab19cfdca7e62a4b7547ad65c5efda37678b8005475f58c1c263bfdd57eb"
---
# Patch 0009 — Expense keyword search

**Severity:** minor
**Source:** product backlog — "List and filter expenses" is a stated capability in PRODUCT.md; keyword search against note/category is the missing filter dimension.

**Current behavior:** `GET /api/expenses` always returns all expenses with no text filtering. The frontend `ExpenseList` displays the full unfiltered list; there is no way to search for a specific note or category substring.

**Expected behavior:** A `q` query param on `GET /api/expenses` returns only expenses whose `note` or `category` contains the term (case-insensitive substring). The frontend exposes a search input above the expense list; typing a term fetches the filtered list and updates the display in real time (debounced to avoid flooding the API).

**Must NOT change:** existing `GET /api/expenses` response shape; behavior when `q` is absent (returns all expenses as before); create/update/delete flows; summary endpoint; category-filter behavior (not yet built, but the new repo function must compose cleanly with future date/category params).

## TSD S-0009.01 — Keyword search on expenses

| Aspect | Spec |
|--------|------|
| Interfaces | `GET /api/expenses?q=<term>` — `q` is an optional string query param (absent or empty string = no filter). Response is `list[ExpenseOut]` (unchanged shape). Frontend: `listExpenses(q?: string): Promise<Expense[]>` in `api/client.ts`; `useExpenses(searchTerm: string)` hook accepting a controlled search string. |
| Data / State | No schema change. SQLite `LIKE` on the `note` and `category` columns. Frontend: `searchTerm` state string owned by the parent (`App`), passed into `useExpenses`; the hook re-fetches when `searchTerm` changes (debounced 300 ms). |
| Behavior | Backend: `q` present and non-empty → `WHERE (LOWER(note) LIKE LOWER('%q%') OR LOWER(category) LIKE LOWER('%q%'))` (case-insensitive); absent/empty → no WHERE clause (full list). Frontend: a controlled `<input type="search">` above the list; input fires debounced fetch; while loading the previous list stays visible (no flicker). |
| Boundaries | SQLite (repository layer owns all SQL — CONSTITUTION). No external deps. |
| Tests | Backend unit: `list_expenses(q=...)` repository function returns matching rows and excludes non-matching; empty/absent q returns all. Frontend unit (Vitest): `listExpenses` called with correct query string; `useExpenses` re-fetches on `searchTerm` change. |

## Task T-expense-search-zppbv9 — Expense keyword search
**Slice:** full vertical — repository → service → router → API client → hook → search input UI
**Acceptance criteria:**
- [ ] AC-1 [behavior]: `GET /api/expenses?q=coffee` returns only expenses whose `note` or `category` contains "coffee" (case-insensitive); `GET /api/expenses` (no `q`) returns all expenses unchanged.
- [ ] AC-2 [behavior]: Frontend search input debounces calls to the API; typing into it updates the displayed list to show only matching expenses.
- [ ] AC-3 [invariant]: Existing `ExpenseOut` response shape is unchanged; create/update/delete flows are unaffected.
**Tests:** AC-1, AC-2, AC-3

## Execution Plan
> Approved BY the spec stamp: `lane start` copies this section verbatim into the worktree's
> exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last in this file.

**Approach:** extend the existing repo → service → router stack with an optional `q` param; update the typed API client and `useExpenses` hook signature; add a debounced search input to `App.tsx` above `ExpenseList`.
**Boundaries & mocks:** SQLite — real DB in backend tests (pytest fixtures); frontend tests mock `listExpenses` from `@/api/client`.
**Behaviors (TDD order):**
- B-1: Repository + service + router: `GET /api/expenses?q=<term>` filters by note/category substring (case-insensitive); absent/empty q returns all. Backend pytest tests prove it.
- B-2: Frontend: `listExpenses` accepts optional `q`; `useExpenses` re-fetches on `searchTerm` prop change; search input in `App.tsx` is debounced 300 ms. Vitest tests prove the hook refetches and the client passes the param.
**Open questions:** none
