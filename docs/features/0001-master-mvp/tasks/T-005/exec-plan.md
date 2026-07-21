---
approved_by: "samir dahal"
approved_at: "2026-07-21"
planned_behaviors: 2
approved_sha256: "46a6e2e9698fd3fb3790e395365f9032ef95a4a6d212297b90984c5fa6ea08cd"
---
## Exec Plan — Task T-005
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- **AC-1 (summary endpoint)** — `GET /api/summary` returning `{ total, by_category: [{ category, total }] }` in whole NPR over all expenses, with every fixed category present (0 when it has none).
- **AC-2 (reconciliation / empty)** — per-category totals sum exactly to `total`; an empty store yields an all-zero summary (property of the aggregation, asserted in B-1).
- **AC-3 (e2e donut)** — the running app shows the summary as a donut chart with per-category totals alongside, reflecting adds/deletes without a manual reload.
- **AC-4 (empty state)** — with no expenses, the summary shows a deliberate empty state rather than a broken/empty chart.

**Approach:** high-level only — NOT implementation prescription
- Backend layered router→service→repository. The repository returns raw per-category sums; the service normalizes to the full fixed-category set (filling zeros) and computes the grand total — so the endpoint contract (all categories present, totals reconcile) is enforced in one place.
- Amounts are integer whole NPR throughout; sums are integer.
- Frontend: `getSummary()` in the typed client, a `useSummary()` hook (loading/data), and a `CategorySummary` component rendering a donut chart (Recharts) plus a textual per-category total list. It refreshes alongside the list — the add/delete flows already call a reload; the summary reads the same data source so it re-fetches on the same trigger.
- Testability: the donut is visual (Recharts). Tests assert the **textual per-category totals** and the **empty state**, and that the chart region is present (labelled container) — not Recharts' SVG internals (which don't lay out in jsdom).

**Boundaries & mocks:** (from TSD Boundaries)
- Backend: **SQLite store REAL** in integration (temp DB via `EXPENSE_DB_PATH`); seed rows, assert aggregation.
- Frontend: **HTTP API FAKED** (stub `fetch`) — summary endpoint returns known totals; assert the totals + empty state render.
- Satisfiable in unit/integration; the containerized real-boundary run is the T-007 smoke.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2 (the e2e)
- **B-1** (tracer): `GET /api/summary` over seeded expenses → correct grand total and per-category totals, every fixed category present (missing = 0), totals reconcile; empty store → all-zero. [backend integration]
- **B-2** (e2e): in the running app, the summary shows per-category totals + a donut chart region; with no expenses it shows the empty state. [frontend integration]

**PR will contain:**
- Backend: repository `category_totals`, service `get_summary` (normalize to fixed set + grand total), `GET /api/summary` router + response model, backend tests.
- Frontend: `getSummary` client method, `useSummary` hook, `CategorySummary` (donut + totals + empty state) wired into `App`, component test.

**Open questions / ambiguities:** (MUST be resolved before execution)
- None. Shape `{ total, by_category[] }`, all-categories-present, integer NPR, and empty-state behavior are fixed by the ratified TSD.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** none (ambiguities 0 · blast-radius low · no security · no amendments · no prior-fail · no self-flag)
**If overriding R→L:** n/a
- [ ] Refactor pass done (on green; tests unchanged) — before PR
