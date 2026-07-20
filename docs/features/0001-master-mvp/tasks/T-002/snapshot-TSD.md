## TSD S-0001.02 — List expenses  (PRD §S-0001.02)
| Aspect | Spec |
|--------|------|
| Interfaces | `GET` list-expenses endpoint returning an ordered collection of Expense resources, **most recent first** (by `created_at`). Empty store returns an empty collection with a success status (not an error). |
| Data / State | Reads the expenses store; no mutation. |
| Behavior | Returns every recorded expense with all fields, newest first. Frontend renders the collection as a readable list (amount as NPR whole rupees, category, date, note). While the request is in flight the UI shows a **loading state**; when the collection is empty the UI shows a deliberate **empty state** (not a blank screen). |
| Access | The single local user. |
| Boundaries | Persistent store (read). Frontend depends on the HTTP API as its data source. |
| Tests | unit: ordering (newest-first) and empty-collection mapping; frontend rendering of loading / empty / populated states. integration: seeded store returns rows in the correct order and shape. smoke: list renders in the running app after seeding. |

---
