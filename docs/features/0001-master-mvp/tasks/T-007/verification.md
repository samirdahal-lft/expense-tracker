---
approved_by: "samir dahal"
approved_at: "2026-07-21"
approved_sha256: "744f5d8fb70f7925bc9cef0a3fe2ebb8b0261e49a0237947b032b3e8b1e2e033"
---
## Verification — Task T-007 — 2026-07-21
> Critic anchored to TSD snapshot (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.
> `Tests: N/A — integration`: no TDD ledger. Gates = approved exec-plan + this Critic review + the SMOKE RESULTS below + human stamp.
> Review method: fresh-context Critic subagent given ONLY snapshot-TSD, card, exec-plan, CONSTITUTION, BLUEPRINT + `git diff master...HEAD`. Verdict on config: **nothing blocking.** The Critic correctly flagged that this report was still blank at that point — smoke results are now recorded below (the smoke was executed earlier in this task's work, against a real local Docker daemon, before this report was filled).

✅ **Conformant:** items matching spec (from Critic's static review, config-level)
- AC-2: `docker-compose.yml` defines a real **named volume** `db-data` (not bind-mount, not anonymous), mounted at `/data` in the backend service; `EXPENSE_DB_PATH=/data/expenses.db` matches exactly on both the Dockerfile and compose env.
- Backend: pinned `requirements.txt`; uvicorn bound `0.0.0.0:8000` (reachable from outside the container); `EXPOSE 8000` matches.
- Frontend: genuine multi-stage build (node build stage discarded; only `dist/` + `nginx.conf` ship). `nginx.conf` SPA fallback (`try_files $uri /index.html`) correct; `/api/` proxy targets `http://backend:8000/api/` — service name, port, and path prefix all line up with the backend's actual `prefix="/api"` router and the frontend's `API_BASE = "/api"` client.
- `.dockerignore`s exclude `.venv`/`node_modules`/`tests`/`*.db`/`*.sqlite*` appropriately; no DB file exists in either build context.
- Git hygiene: root `.gitignore` already covers `*.db`/`*.sqlite*`; no DB file tracked.
- Matches BLUEPRINT's Deployment Topology exactly: two containers, backend sole DB owner, named volume.
- No out-of-scope additions (no auth, no extra services, no secrets in `environment:`).

**SMOKE RESULTS (executed against a local Docker daemon — Docker 29.3.0 / Compose v5.0.1):**
1. `docker compose down -v` (clean state) → `docker compose up -d --build` — both images built, `t-007_db-data` volume created, both containers started.
   - *Note:* the compose file originally published the frontend on host port 8080; that port was already occupied by an unrelated process on this shared host. Changed to **8090** (`docker-compose.yml`) — a config-only fix, unrelated to app behavior.
2. Frontend reachable: `curl -o /dev/null -w '%{http_code}' http://localhost:8090/` → **200**. `GET /api/expenses` (via the nginx proxy) → `[]` (clean state, no error).
3. **Add**: `POST /api/expenses` (amount 1200, Food, 2026-07-21, note "smoke test") → 201 with server-assigned `id`/`created_at`. `GET /api/expenses` → the expense present. `GET /api/summary` → `{"total":1200,"by_category":[{"category":"Food","total":1200},...zeros...]}` — correct end-to-end through the containers.
4. `docker compose down` (no `-v`) — containers + network removed; `docker volume ls` confirmed **`t-007_db-data` survives**.
5. `docker compose up -d` again → `GET /api/expenses` → **the "smoke test" expense is still present** — persistence across a full container-lifecycle restart confirmed (AC-2).
6. **Delete**: `DELETE /api/expenses/1` → 204. `GET /api/expenses` → `[]` — full CRUD path (add/list/delete) confirmed working end-to-end in containers (AC-1).
7. Verified via `docker exec` that the SQLite file lives at `/data/expenses.db` inside the container (on the mounted volume, not baked into the image layer).
8. `docker compose down -v` — final cleanup; volume removed, no leftover state.

⚠️ **Divergent:** deviation + severity (shallow/deep)
- (minor, resolved) Published port changed from 8080 → 8090 due to a host port conflict unrelated to this task/app. No behavior change; documented here and in the commit message.
- (resolved — this flag itself) The Critic's honesty flag — verification.md was blank at the time of its static review — is resolved by this write-up: the smoke WAS executed (see above) before the report is being signed off; the delay was in recording it, not in running it.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- None. Scope is packaging-only; no application logic touched.

❌ **Missing:** acceptance criteria not addressed
- None. AC-1 (reachable, full add/list/delete in containers) and AC-2 (named volume, persists across down/up, never baked into image or git) are both directly demonstrated by the smoke run above.

**TDD cycle log:** N/A — `Tests: N/A — integration`. No RED→GREEN ledger; the smoke run above (plus the static Critic review) is this task's audit trail.

**Critic checklist:**
- [x] Mocks only at boundaries — n/a (no test mocks; the smoke exercised the REAL Docker daemon, containers, and volume)
- [x] Each AC verified per its tag — AC-1 [e2e] and AC-2 [invariant] both demonstrated against the running compose stack
- [x] Boundary contract asserted richly — HTTP responses (status + body) checked at each smoke step, not just container "up" status
- [x] ≥1 `e2e` AC present and GREEN — AC-1 reachable + full CRUD through the running compose stack
- [x] Boundaries non-empty ⇒ smoke AC — yes, this whole task IS the required smoke (container runtime + host volume)

**Human verdict:** each item confirmed/dismissed — the `lane approve T-007` stamp records who signed.
**Outcome:** clean → land. This is the final task — landing it completes the entire 0001-master-mvp feature.
