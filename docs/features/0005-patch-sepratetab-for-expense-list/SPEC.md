---
approved_by: "Samir dahal"
approved_at: "2026-08-12"
approved_sha256: "382185e8058c8c1c62c901573d890420d475f9c78e866b5f49daac29b253394e"
---
# Patch 0005 — Separate tab for expense list

> A `patch` iteration — the TWO-STAMP ceremony for small, known-scope work (a bug fix, a
> tweak, one behavior, one PR). This ONE document is the ticket + TSD + task card + exec
> plan: your single `lane approve` stamp covers all of it (stamp 1 of 2; stamp 2 is the
> verification report at the end). The TDD ledger, Critic snapshot, and verify replay are
> unchanged — a patch removes redundant signatures, never proof.
> Too big for a patch? More than one story, more than ~3 behaviors, or more than one task
> → use `lane new fix` / `lane new enhancement` instead (agents: CALL THIS OUT when
> drafting; the human decides at the stamp).

**Severity:** minor
**Source:** UX improvement request — expense list and category summary are stacked on the same page with no separation; harder to focus on one at a time

**Current behavior:** `App.tsx` renders `CategorySummary` and `ExpenseList` stacked vertically on the same page. Both are always visible at once with no way to switch between them.
**Expected behavior:** The main content area below the add-form is replaced with a two-tab panel: a "Summary" tab (renders `CategorySummary`) and an "Expenses" tab (renders `ExpenseList` + `ExportCsvButton`). "Expenses" is the default active tab. Switching tabs is instant (no network call).
**Must NOT change:** Add expense form stays above tabs. Edit expense form appears above tabs when active. Theme toggle, header, and all existing data-fetching/refresh logic remain untouched. No existing props or hook contracts change.



## TSD S-0005.02 — Tab panel replacing stacked summary + list

| Aspect | Spec |
|--------|------|
| Interfaces | `App` component (no prop changes). New tab panel renders inside `App` in place of the current side-by-side `CategorySummary` + `ExpenseList` divs. |
| Data / State | One new local state in `App`: `activeTab: "expenses" \| "summary"`, default `"expenses"`. No server state added. |
| Behavior | Renders two tab buttons labeled "Expenses" and "Summary". Active tab button is visually distinguished (e.g. underline or background). Clicking "Summary" shows `CategorySummary`; clicking "Expenses" shows `ExpenseList` + `ExportCsvButton`. Only the active tab's content is in the DOM (conditional render). |
| Boundaries | None — no external deps beyond what App already imports |

## TSD S-0005.01 — Tab panel replacing stacked summary + list

| Aspect | Spec |
|--------|------|
| Interfaces | `App` component (no prop changes). New tab panel renders inside `App` in place of the current side-by-side `CategorySummary` + `ExpenseList` divs. |
| Data / State | One new local state in `App`: `activeTab: "expenses" \| "summary"`, default `"expenses"`. No server state added. |
| Behavior | Renders two tab buttons labeled "Expenses" and "Summary". Active tab button is visually distinguished (e.g. underline or background). Clicking "Summary" shows `CategorySummary`; clicking "Expenses" shows `ExpenseList` + `ExportCsvButton`. Only the active tab's content is in the DOM (conditional render). |
| Boundaries | None — no external deps beyond what App already imports |
| Tests | Render `App` with MSW/vi mocks (matching existing test patterns). Assert: (a) both tab buttons are present, (b) "Expenses" content visible by default, (c) clicking "Summary" tab shows summary content and hides expense list, (d) clicking "Expenses" tab restores expense list. |
## TSD S-0005.01 — Tab panel replacing stacked summary + list

| Aspect | Spec |
|--------|------|
| Interfaces | `App` component (no prop changes). New tab panel renders inside `App` in place of the current side-by-side `CategorySummary` + `ExpenseList` divs. |
| Data / State | One new local state in `App`: `activeTab: "expenses" \| "summary"`, default `"expenses"`. No server state added. |
| Behavior | Renders two tab buttons labeled "Expenses" and "Summary". Active tab button is visually distinguished (e.g. underline or background). Clicking "Summary" shows `CategorySummary`; clicking "Expenses" shows `ExpenseList` + `ExportCsvButton`. Only the active tab's content is in the DOM (conditional render). |
| Boundaries | None — no external deps beyond what App already imports |
| Tests | Render `App` with MSW/vi mocks (matching existing test patterns). Assert: (a) both tab buttons are present, (b) "Expenses" content visible by default, (c) clicking "Summary" tab shows summary content and hides expense list, (d) clicking "Expenses" tab restores expense list. |

## TSD S-0005.01 — Tab panel replacing stacked summary + list

| Aspect | Spec |
|--------|------|
| Interfaces | `App` component (no prop changes). New tab panel renders inside `App` in place of the current side-by-side `CategorySummary` + `ExpenseList` divs. |
| Data / State | One new local state in `App`: `activeTab: "expenses" \| "summary"`, default `"expenses"`. No server state added. |
| Behavior | Renders two tab buttons labeled "Expenses" and "Summary". Active tab button is visually distinguished (e.g. underline or background). Clicking "Summary" shows `CategorySummary`; clicking "Expenses" shows `ExpenseList` + `ExportCsvButton`. Only the active tab's content is in the DOM (conditional render). |
| Boundaries | None — no external deps beyond what App already imports |
| Tests | Render `App` with MSW/vi mocks (matching existing test patterns). Assert: (a) both tab buttons are present, (b) "Expenses" content visible by default, (c) clicking "Summary" tab shows summary content and hides expense list, (d) clicking "Expenses" tab restores expense list. |
## TSD S-0005.01 — Tab panel replacing stacked summary + list

| Aspect | Spec |
|--------|------|
| Interfaces | `App` component (no prop changes). New tab panel renders inside `App` in place of the current side-by-side `CategorySummary` + `ExpenseList` divs. |
| Data / State | One new local state in `App`: `activeTab: "expenses" \| "summary"`, default `"expenses"`. No server state added. |
| Behavior | Renders two tab buttons labeled "Expenses" and "Summary". Active tab button is visually distinguished (e.g. underline or background). Clicking "Summary" shows `CategorySummary`; clicking "Expenses" shows `ExpenseList` + `ExportCsvButton`. Only the active tab's content is in the DOM (conditional render). |
| Boundaries | None — no external deps beyond what App already imports |
| Tests | Render `App` with MSW/vi mocks (matching existing test patterns). Assert: (a) both tab buttons are present, (b) "Expenses" content visible by default, (c) clicking "Summary" tab shows summary content and hides expense list, (d) clicking "Expenses" tab restores expense list. |






## Task T-sepratetab-for-expense-list-vp1olq — Add Expenses/Summary tab panel to App
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior]: "Expenses" and "Summary" tab buttons render in `App`
- [ ] AC-2 [behavior]: "Expenses" tab is active by default; `ExpenseList` is visible, `CategorySummary` is not
- [ ] AC-3 [behavior]: clicking "Summary" tab makes `CategorySummary` visible and hides `ExpenseList`
- [ ] AC-4 [invariant]: add-form and edit-form sections remain outside/above the tab panel
**Tests:** AC-1, AC-2, AC-3, AC-4

## Execution Plan
> Approved BY the spec stamp: `lane start` copies this section verbatim into the worktree's
> exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last in this file.

**Approach:** Add `activeTab` state to `App`. Replace the current `CategorySummary` + `ExpenseList` layout with a tab panel: two buttons that toggle `activeTab`, and conditional rendering of the two content sections.
**Boundaries & mocks:** Tests mock the API (MSW or vi.fn) matching the existing `App.test.tsx` pattern — no new fakes introduced.
**Behaviors (TDD order):**
- B-1: Write failing tests for AC-1 through AC-4 (tab buttons present, correct default, tab switching). Commit RED. Implement `activeTab` state and tab panel in `App.tsx`. Commit GREEN.
**Open questions:** none

