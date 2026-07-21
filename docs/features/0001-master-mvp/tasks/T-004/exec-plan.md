---
approved_by: "samir dahal"
approved_at: "2026-07-21"
planned_behaviors: 3
approved_sha256: "6727e7c90601c7566daa911849e5c6484b721c2f46b3d06ed51f472a97b2d9e1"
---
## Exec Plan — Task T-004
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- **AC-1 (delete)** — `DELETE /api/expenses/{id}` that removes the matching row and returns a no-content success; a subsequent list omits it.
- **AC-2 (not-found)** — deleting an unknown id returns a 404 and changes nothing.
- **AC-3 (e2e delete)** — a per-row delete control in the running app removes the expense from the list (and it stays gone) without a manual reload.

**Approach:** high-level only — NOT implementation prescription
- Backend layered router→service→repository; only the repository issues SQL. Reuse the T-002/T-003 `expenses` store.
- **TDD ordering keeps not-found test-first:** B-1 implements delete minimally (issue the delete, return success); B-2 then drives the not-found path (detect no row affected → 404). Avoids a "passes at RED" cycle.
- Frontend: `deleteExpense(id)` in the typed client; a delete control on each `ExpenseList` row that, on success, triggers the existing `useExpenses` reload so the row disappears without navigation.

**Boundaries & mocks:** (from TSD Boundaries)
- Backend: **SQLite store REAL** in integration (temp DB via `EXPENSE_DB_PATH`); seed rows by direct SQL, delete via the endpoint, assert via a list read.
- Frontend: **HTTP API FAKED** (stub `fetch`) — a stateful stub where DELETE removes from the in-memory store and the follow-up GET reflects it, proving the row disappears without reload.
- Satisfiable in unit/integration; containerized real-boundary run is the T-007 smoke.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 (includes the e2e)
- **B-1** (tracer): `DELETE /api/expenses/{id}` for an existing id → success; the expense is gone from a subsequent list. [backend integration]
- **B-2**: `DELETE /api/expenses/{id}` for an unknown id → 404, and the store is unchanged. [backend integration]
- **B-3** (e2e): in the running app, clicking a row's delete control removes that expense from the list without a reload. [frontend integration]

**PR will contain:**
- Backend: repository `delete_expense` (reports whether a row was removed), service `delete_expense` (404 on miss), `DELETE /api/expenses/{id}` router, backend tests.
- Frontend: `deleteExpense` client method, a per-row delete control in `ExpenseList` (reload on success), component test.

**Open questions / ambiguities:** (MUST be resolved before execution)
- None. Success = no-content; miss = not-found; both fixed by the ratified TSD.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** none (ambiguities 0 · blast-radius low · no security · no amendments · no prior-fail · no self-flag)
**If overriding R→L:** n/a
- [ ] Refactor pass done (on green; tests unchanged) — before PR
