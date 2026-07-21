---
approved_by: "samir dahal"
approved_at: "2026-07-21"
planned_behaviors: 3
approved_sha256: "6a6248b8127e636a3a13a493ea814bfb2b112005d5154e3a516ff1779d0cec36"
---
## Exec Plan — Task T-003
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- **AC-1 (create)** — `POST /api/expenses` accepting `{ amount, category, date, note? }`, inserting via the repository with a server-assigned `id` and `created_at` (UTC now), returning the created expense with a 201.
- **AC-2 (validation)** — reject a non-positive or non-integer amount, and a category outside the fixed set, with a 422 and no row created (Pydantic constraints at the boundary).
- **AC-3 (integer NPR)** — stored + returned amount is a positive integer (property of AC-1's model + AC-2's rejection of non-integers).
- **AC-4 (e2e add)** — an add-expense form (amount, category select over the fixed set, date, optional note) that on submit creates the expense and makes it appear in the list without a manual reload.

**Approach:** high-level only — NOT implementation prescription
- Backend layered router→service→repository; the service owns `created_at` (clock) and delegates the insert; only the repository issues SQL. Reuse the `expenses` schema + connection from T-002.
- **TDD ordering keeps validation test-first:** B-1 implements create with MINIMAL validation (just enough for the valid case); B-2 then drives the real constraints (amount `> 0` integer, category in the fixed set, well-formed date). This avoids a "passes at RED" cycle.
- Frontend: `createExpense()` in the typed client, an `AddExpenseForm` component using shadcn/ui inputs + a fixed-category select; on success it triggers the existing `useExpenses` reload so the list refreshes without navigation.
- Amount stays an integer whole NPR across the boundary; the form submits an integer.

**Boundaries & mocks:** (from TSD Boundaries)
- Backend: **SQLite store REAL** in integration (temp DB via `EXPENSE_DB_PATH`); **clock** (`created_at`) is the service's `datetime.now(UTC)` — tests assert the field exists/round-trips, not an exact value.
- Frontend: **HTTP API FAKED** (stub `fetch`) in the component test — sequence GET (empty) → POST (created) → GET (with the new row) to prove the list updates without reload.
- Satisfiable in unit/integration; the containerized real-boundary run is the T-007 smoke.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 (includes the e2e)
- **B-1** (tracer): valid `POST /api/expenses` creates and returns the expense with server-assigned `id` (+ `created_at`), amount as integer. [backend integration]
- **B-2**: invalid input — amount `<= 0`, non-integer amount, or unknown category → 422, nothing persisted (covers AC-2; AC-3 non-integer rejection). [backend integration]
- **B-3** (e2e): in the running app, submitting the add form makes the new expense appear in the list without a reload. [frontend integration]

**PR will contain:**
- Backend: `ExpenseCreate` model, repository `add_expense`, service `create_expense` (sets `created_at`), `POST /api/expenses` router, backend tests.
- Frontend: `createExpense` client method, `AddExpenseForm` + wiring into `App` (reload on success), component test. Also refresh the T-002 scaffold `App.test.tsx` to stub `fetch` (clears the carried-over `act()` warning).

**Open questions / ambiguities:** (MUST be resolved before execution)
- None. Fields, fixed categories, integer-NPR rule, and date format (`YYYY-MM-DD`) are fixed by the ratified TSD/CONSTITUTION.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** none (ambiguities 0 · blast-radius low · no security · no amendments · no prior-fail · no self-flag)
**If overriding R→L:** n/a
- [ ] Refactor pass done (on green; tests unchanged) — before PR
