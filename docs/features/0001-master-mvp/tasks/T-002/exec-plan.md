---
approved_by: "samir dahal"
approved_at: "2026-07-20"
planned_behaviors: 3
approved_sha256: "444c675da045571eee96f92c1af44f40c96825c80b884928f50063f91a8c416b"
---
## Exec Plan — Task T-002
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- **AC-1 (list endpoint, ordered)** — backend read path: create the `expenses` schema (init-if-not-exists, called at startup + in tests), a repository `list_expenses()` returning rows newest-first, a service passthrough, and `GET /api/expenses` returning each expense (id, amount, category, date, note, created_at) via a Pydantic response model.
- **AC-2 (empty collection)** — same endpoint returns `[]` with a 200 when the store is empty (not a 404/500).
- **AC-4 (e2e list render)** — frontend: `listExpenses()` in the typed API client, a `useExpenses()` hook exposing loading/data, an `ExpenseList` component rendering rows (amount formatted as NPR, category, date, note), mounted in `App`.
- **AC-3 (loading + empty states, non-functional)** — the list view shows a loading state while the request is pending and a deliberate empty state when the collection is empty.

**Approach:** high-level only — NOT implementation prescription
- Backend stays layered router→service→repository (CONSTITUTION); only the repository touches SQL. Schema init lives with the DB bootstrap so every task shares one table definition.
- Amount is an integer whole NPR end to end; the frontend formats it for display (e.g. `Rs 1,250`) but never stores/computes floats.
- Frontend reaches the backend only through the typed API client; components consume the hook (no raw fetch in components).
- Tests seed rows by direct SQL against a temp DB (via `EXPENSE_DB_PATH`) — the write-from-API path is T-003, not needed here.

**Boundaries & mocks:** (from TSD Boundaries)
- Backend: the **SQLite store is REAL** in integration tests, pointed at a temp file via `EXPENSE_DB_PATH` (hermetic — no shared state). No clock needed (tests seed explicit `created_at`).
- Frontend: the **HTTP API is FAKED** in component tests (stub the API client / `fetch`) so loading/empty/populated render paths are exercised deterministically.
- Boundaries are satisfiable in unit/integration; the real end-to-end through containers is the T-007 compose smoke (not this task).

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 (includes the e2e)
- **B-1** (tracer): `GET /api/expenses` returns seeded expenses newest-first with all fields. [backend integration]
- **B-2**: empty store → `GET /api/expenses` returns `[]` with 200. [backend integration]
- **B-3** (e2e): the running app renders seeded expenses as a readable list; while loading it shows a loading state and with none it shows an empty state (covers AC-3). [frontend integration render]

**PR will contain:**
- Backend: `expenses` schema init, repository `list_expenses`, service, `GET /api/expenses` router + Pydantic response model, backend tests.
- Frontend: `listExpenses` client method, `useExpenses` hook, `ExpenseList` + loading/empty states wired into `App`, component tests.

**Open questions / ambiguities:** (MUST be resolved before execution)
- None. Ordering key = `created_at` desc; fields + money rule fixed by the ratified TSD/CONSTITUTION.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** none (ambiguities 0 · blast-radius low · no security · no amendments · no prior-fail · no self-flag)
**If overriding R→L:** n/a
- [ ] Refactor pass done (on green; tests unchanged) — before PR
