---
approved_by: "samir dahal"
approved_at: "2026-07-21"
planned_behaviors: 0
approved_sha256: "21520186a075f37386ce50a29ddd5c7942c3dd9790350d6c14bfeba1761dc945"
---
## Exec Plan — Task T-007
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- **AC-1 (one-command run)** — `docker-compose.yml` at the repo root with two services: `backend` (built from `backend/Dockerfile`, running FastAPI/uvicorn) and `frontend` (built from `frontend/Dockerfile`, serving the production Vite build). `docker compose up` brings up both; the frontend proxies `/api` to the backend so the running app is reachable in a browser and fully usable (add/list/delete).
- **AC-2 (persistent volume)** — the backend container's SQLite file lives on a **named Docker volume**, mounted at the directory the app's `EXPENSE_DB_PATH` points to. Data recorded before `docker compose down` is present after `docker compose up` again. The DB file is never baked into the image (fresh image, empty volume = fresh DB; existing volume = existing data) and never committed to git (already gitignored).

**Approach:** high-level only — NOT implementation prescription
- **Backend image**: Python slim base, install pinned `requirements.txt`, copy `app/`, run `uvicorn app.main:app` bound to `0.0.0.0`. `EXPENSE_DB_PATH` set to a path under a mounted volume directory (e.g. `/data/expenses.db`).
- **Frontend image**: multi-stage — build the Vite app (`npm ci && npm run build`), then serve the static `dist/` output via a lightweight web server, proxying `/api/*` to the `backend` service (compose network service name) so the SPA's existing relative `/api` calls work unchanged in containers.
- **Compose file**: two services, one named volume (`db-data`) mounted into the backend container; frontend depends_on backend; expose a host port for the frontend (and optionally the backend, for debugging).
- No code changes to application logic — this task is packaging/deployment only.

**Boundaries & mocks:** none faked — this task's entire point is exercising the REAL container runtime and REAL Docker volume persistence. No unit/integration tests apply (see Tests: N/A on the card).

**Behaviors (TDD order):** N/A — `Tests: N/A — integration` (per the approved card). No RED→GREEN ledger.

**PR will contain:**
- `backend/Dockerfile`, `frontend/Dockerfile`, root `docker-compose.yml`, a root `.dockerignore` (and per-app `.dockerignore` if useful), any minimal frontend serving config (e.g. an nginx config for the `/api` proxy).
- A short **smoke procedure** (recorded here, executed and its result recorded in the verification report — not an automated test):
  1. `docker compose up -d --build` from a clean state (no prior volume).
  2. Confirm the frontend is reachable in a browser at its published port.
  3. Add an expense through the UI; confirm it appears in the list and the summary.
  4. `docker compose down` (without `-v`, so the named volume survives).
  5. `docker compose up -d` again; confirm the previously added expense is still present (volume persistence).
  6. Delete an expense through the UI to confirm the full CRUD path works end-to-end in containers.
  7. `docker compose down -v` to clean up (remove the volume) once verified.

**Open questions / ambiguities:** (MUST be resolved before execution)
- None. Two services + one named DB volume, no baked-in DB file, matches the ratified BLUEPRINT Deployment Topology.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** none (ambiguities 0 · blast-radius low · no security-sensitive change · no amendments · no prior-fail · no self-flag)
**If overriding R→L:** n/a
- [ ] Refactor pass done (on green; tests unchanged) — before PR — n/a for an N/A task; ensure the compose file / Dockerfiles are clean before PR.
