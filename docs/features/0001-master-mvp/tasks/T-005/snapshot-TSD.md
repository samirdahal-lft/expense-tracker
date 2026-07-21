## TSD S-0001.04 — Per-category summary  (PRD §S-0001.04)
| Aspect | Spec |
|--------|------|
| Interfaces | `GET` summary endpoint returning `{ total:int, by_category:[ { category:enum, total:int } ] }` over all expenses, in whole NPR. Every category in the fixed set is present (a category with no expenses reports `total: 0`). |
| Data / State | Aggregates the expenses store; no mutation. |
| Behavior | `total` equals the sum of all expense amounts; each `by_category.total` equals the sum for that category; the per-category totals sum to `total`. Frontend renders the breakdown as a **donut-style chart** with the per-category totals shown alongside, updating on add/delete without a manual reload. With no expenses the summary shows a deliberate empty state rather than a broken/empty chart. |
| Access | The single local user. |
| Boundaries | Persistent store (read/aggregate). |
| Tests | unit: aggregation math — totals reconcile to grand total; zero-expense categories report 0; empty store → all-zero summary. integration: seeded store yields correct per-category + grand totals. smoke: summary chart reflects live adds/deletes in the running app. |

---
