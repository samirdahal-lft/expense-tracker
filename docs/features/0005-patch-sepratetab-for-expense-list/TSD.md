> Lane-generated — extracted from SPEC.md at approval. View only; edit the TSD section in SPEC.md, not here.

## TSD S-0005.01 — Tab panel replacing stacked summary + list

| Aspect | Spec |
|--------|------|
| Interfaces | `App` component (no prop changes). New tab panel renders inside `App` in place of the current side-by-side `CategorySummary` + `ExpenseList` divs. |
| Data / State | One new local state in `App`: `activeTab: "expenses" \| "summary"`, default `"expenses"`. No server state added. |
| Behavior | Renders two tab buttons labeled "Expenses" and "Summary". Active tab button is visually distinguished (e.g. underline or background). Clicking "Summary" shows `CategorySummary`; clicking "Expenses" shows `ExpenseList` + `ExportCsvButton`. Only the active tab's content is in the DOM (conditional render). |
| Boundaries | None — no external deps beyond what App already imports |
