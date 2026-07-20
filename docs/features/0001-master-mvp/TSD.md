---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "b88d506b97235ce39d7b2aef38a1a3c11a77d5b1c6f15df6f13a52722ad7351b"
---
# TSD 0001 — Expense Tracker MVP
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.

## Shared contracts (apply to every story)
- **Expense resource** — fields: `id` (server-assigned, stable), `amount` (integer, whole NPR,
  `> 0`), `category` (one of the fixed set `Food | Transport | Bills | Other`), `date`
  (calendar date, `YYYY-MM-DD`), `note` (string, optional, may be empty/absent), `created_at`
  (ISO-8601 UTC timestamp, server-assigned).
- **Money** crosses every boundary as an integer number of whole NPR — never a float, no
  sub-rupee component.
- **Categories** are a fixed server-owned set; the client does not create or manage them.
- **Errors** — invalid input is rejected with a client-error status and a machine-readable body
  identifying the offending field; a missing resource is a not-found status. No auth layer.
- **API base path** — all endpoints live under a single JSON HTTP API prefix; requests and
  responses are validated/serialized at the boundary.

---

## TSD S-0001.01 — Add an expense  (PRD §S-0001.01)
| Aspect | Spec |
|--------|------|
| Interfaces | `POST` create-expense endpoint. Request body: `{ amount:int>0, category:enum, date:YYYY-MM-DD, note?:string }`. On success returns the created Expense resource (incl. `id`, `created_at`) with a created status. On invalid input returns a client-error status with the offending field(s). |
| Data / State | Inserts one row into the expenses store: `id`, `amount`, `category`, `date`, `note`, `created_at`. |
| Behavior | A valid submission persists a new expense and echoes it back with server-assigned `id` and `created_at`. Amount `≤ 0`, non-integer amount, a category outside the fixed set, or a malformed/missing date is rejected and nothing is persisted. |
| Access | The single local user (no authentication). |
| Boundaries | Persistent store (SQLite file); clock (for `created_at`). Both injected so they can be faked in unit/integration tests. |
| Tests | unit: amount/category/date validation (boundary values: 0, negative, non-integer, unknown category, bad date). integration: POST then read-back persists exactly the submitted fields + server-assigned id. smoke: create an expense against the running API backed by the real store. |

---

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

## TSD S-0001.03 — Delete an expense  (PRD §S-0001.03)
| Aspect | Spec |
|--------|------|
| Interfaces | `DELETE` expense-by-id endpoint. Deleting an existing id succeeds (success/no-content status); a subsequent list omits it. Deleting an unknown id returns a not-found status and mutates nothing. |
| Data / State | Removes the matching row from the expenses store; no cascade. |
| Behavior | A per-row delete removes the expense. In the UI the row disappears and the category summary re-reflects the change without a manual page reload. An unknown id is reported as not-found and leaves the store unchanged. |
| Access | The single local user. |
| Boundaries | Persistent store (delete). |
| Tests | unit: not-found path leaves state unchanged. integration: delete existing id → gone from a subsequent list; delete unknown id → not-found + count unchanged. smoke: delete a row in the running app; list and summary update. |

---

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

## TSD S-0001.05 — Premium, themed UI  (PRD §S-0001.05)
| Aspect | Spec |
|--------|------|
| Interfaces | A theme toggle control switching between **light** and **dark** mode. The chosen mode persists across reloads (stored client-side). Server state is consumed through a single typed API-client module; components consume it via hooks (no scattered raw fetches — CONSTITUTION §4). |
| Data / State | Client-persisted theme preference (browser-local). No server state. |
| Behavior | Single-page layout built from rounded card surfaces with subtle shadows, one consistent accent color, and a considered type/spacing scale. Toggling theme restyles every surface — background, text, accent, and the donut chart — and the choice survives a reload. |
| Access | The single local user. |
| Boundaries | Browser-local persistence for the theme preference. |
| Tests | unit/component: toggle flips mode and applies the corresponding styling tokens; preference is read back after a simulated reload; chart colors resolve in both modes. smoke: switch theme in the running app; all surfaces incl. chart render correctly in both modes. |

---

## TSD S-0001.06 — One-command Dockerized run  (PRD §S-0001.06)
| Aspect | Spec |
|--------|------|
| Interfaces | A single compose entrypoint (`docker compose up`) starts the frontend service, the backend service, and the backend's SQLite-backed store; the app is reachable in a browser. |
| Data / State | The SQLite database file resides on a **named volume**, decoupled from container lifecycle. Not baked into any image; never committed to git (CONSTITUTION hard rule). |
| Behavior | `docker compose up` from a fresh clone brings up frontend + backend and the user can add / list / delete expenses end-to-end. Data recorded before `docker compose down` is still present after a subsequent `up` (volume-persisted). |
| Access | The single local user / operator. |
| Boundaries | Container runtime; the host Docker volume (filesystem persistence). |
| Tests | smoke (critical path, required — boundary is non-empty): from a clean state, `docker compose up`, create an expense, `down` then `up`, and confirm the expense persists and the app is reachable. |
