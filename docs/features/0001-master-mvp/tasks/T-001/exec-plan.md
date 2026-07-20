---
approved_by: "samir dahal"
approved_at: "2026-07-20"
planned_behaviors: 0
approved_sha256: "af9cefb9e2c5d316321595014ebc546148af0c9c80ec55f2232954cb626a25ac"
---
## Exec Plan — Task T-001
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- **AC-1 (backend skeleton)** — `backend/` FastAPI app: `app/main.py` (app factory + a trivial health route), `app/db.py` (SQLite connection bootstrap; DB path read from an env var so it's overridable in tests/containers), empty layered packages `app/routers/ app/services/ app/repositories/ app/models/`, `requirements.txt` (fastapi, uvicorn, pydantic, pytest, httpx), and pytest config so the suite collects. One sanity test (`tests/test_smoke.py`) that imports the app — proves the runner executes; not a product test.
- **AC-2 (frontend skeleton)** — `frontend/` React 18 + Vite + TS app: `package.json` + Vite/TS config, Tailwind CSS wired (config + directives), shadcn/ui initialized (`components.json`, `src/lib/utils.ts`), Recharts installed, `src/api/client.ts` typed API-client stub, `src/main.tsx` + `src/App.tsx` shell, Vitest + Testing Library configured. One sanity test (`src/App.test.tsx`) renders the shell — proves the runner executes.
- **AC-3 (.gitignore)** — extend `.gitignore` to exclude the SQLite DB file(s), `.env`, `.venv/`, `node_modules/`, and build output (`dist/`).
- **Toolchain re-enable** — uncomment the `runner.*` matrix in `.lane/lane.config` (disabled on master for the greenfield claim) so the landed base carries the working pytest/vitest runners for T-002+.

**Approach:** high-level only — NOT implementation prescription
- Minimal but genuinely runnable skeletons: both apps boot and both test runners execute a sanity test. No product behavior — the expense schema, endpoints, and UI belong to the feature tasks (T-002+).
- Keep the backend layering directories present (router→service→repository) so feature tasks slot in without re-shaping structure.
- DB path is injectable (env var) from the start, so later hermetic tests and the Docker volume both work without code changes.

**Boundaries & mocks:** (from TSD Boundaries) what's FAKED vs REAL.
- None. A scaffold has no behavior and no external dependency to fake. The SQLite path is parameterized (env) but not exercised. No smoke AC — boundaries are empty for this task (the compose/persistence smoke is T-007).

**Behaviors (TDD order):** B-1 first (tracer bullet) …
- N/A — `Tests: N/A — scaffolding`. No RED→GREEN ledger (`planned_behaviors: 0`). Sanity tests exist only to prove the runners execute; they assert the toolchain, not the product. Audit trail = this approved plan + `lane review` + the human-stamped verification report.

**PR will contain:**
- `backend/` runnable FastAPI skeleton + pytest config + sanity test.
- `frontend/` runnable Vite/React/TS app with Tailwind + shadcn/ui + Recharts + Vitest + sanity test.
- Extended `.gitignore`.
- Re-enabled `runner.*` matrix in `.lane/lane.config`.

**Open questions / ambiguities:** (MUST be resolved before execution)
- None. Stack, money rule, and container topology are all ratified in the context docs.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** none (ambiguities 0 · blast-radius low · no security · no amendments · no prior-fail · no self-flag)
**If overriding R→L:** n/a
- [ ] Refactor pass done (on green; tests unchanged) — before PR
