---
approved_by: "Samir dahal"
approved_at: "2026-08-25"
approved_sha256: "9af9a8208bc2b0d7e93e90a8a1f2b3aaf743c2d1f2f947f75a3d030b84774491"
---
# Patch 0010 — Show total expenses stat tile on dashboard

**Severity:** minor
**Source:** user request — dashboard lacks a prominent "total spent to date" figure

**Current behavior:** The grand total is buried at the bottom of the "Spending by category" list, invisible in the empty state and small relative to the page.
**Expected behavior:** A prominent stat tile showing the all-time total NPR spent is displayed in the dashboard header area, always visible (including empty state).
**Must NOT change:** Per-category breakdown, donut chart, expense list, add/edit/delete flows, API contract, backend code.

## TSD S-0010.01 — Total expenses stat tile

| Aspect | Spec |
|--------|------|
| Interfaces | New `TotalExpenseStat` React component in `frontend/src/features/summary/TotalExpenseStat.tsx`. Props: `total: number \| null`, `loading: boolean`, `error: string \| null`. Rendered in `App.tsx` above the category summary section, consuming `summary.total` from the existing `useSummary` hook (no new API call). |
| Data / State | Reads `summary.total` (integer whole NPR) already fetched by `useSummary`. No new state. |
| Behavior | - When loading: shows a skeleton/placeholder text "Loading…" inside the tile. - When error: shows "—" with muted styling. - When `total === 0` (no expenses): shows "NPR 0" (tile always visible). - When `total > 0`: shows the formatted total using `formatNpr` (e.g. "NPR 12,500"). The tile is always rendered in the dashboard header area, regardless of expense count. |
| Boundaries | `getSummary()` API call — already faked via `vi.mock` in existing tests. |
| Tests | Vitest + React Testing Library unit tests for `TotalExpenseStat` covering: loading state, error state, zero total, non-zero total. Tests live at `frontend/src/features/summary/TotalExpenseStat.test.tsx`. |

## Task T-show-total-expenses-d789bk — Add TotalExpenseStat tile to dashboard
**Slice:** full vertical — new component + App.tsx wiring + tests
**Acceptance criteria:**
- [ ] AC-1 [behavior]: `TotalExpenseStat` renders "Loading…" when `loading=true`
- [ ] AC-2 [behavior]: `TotalExpenseStat` renders "—" (muted) when `error` is set
- [ ] AC-3 [behavior]: `TotalExpenseStat` renders `formatNpr(0)` when `total=0`
- [ ] AC-4 [behavior]: `TotalExpenseStat` renders `formatNpr(total)` for a positive total
- [ ] AC-5 [behavior]: The tile appears in the dashboard header area in `App.tsx`, consuming `summary.total` from `useSummary`
**Tests:** AC-1, AC-2, AC-3, AC-4 (unit); AC-5 verified by App.test.tsx smoke or visual inspection

## Execution Plan
**Approach:** Add a small presentational `TotalExpenseStat` component; wire it into the existing `App.tsx` header using the already-loaded `summary` from `useSummary`. No new hooks, no new API calls.
**Boundaries & mocks:** none — component is pure props-driven; no API boundary in component tests.
**Behaviors (TDD order):**
- B-1: `TotalExpenseStat` loading state — test renders loading text; impl renders "Loading…"
- B-2: `TotalExpenseStat` error state — test renders "—"; impl handles error prop
- B-3: `TotalExpenseStat` zero total — test renders `formatNpr(0)`; impl handles 0
- B-4: `TotalExpenseStat` positive total — test renders `formatNpr(12500)`; impl formats correctly
- B-5: Wire into `App.tsx` header — component visible in dashboard above category summary
**Open questions:** none
