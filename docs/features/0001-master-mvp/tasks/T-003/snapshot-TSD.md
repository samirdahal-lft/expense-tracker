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
