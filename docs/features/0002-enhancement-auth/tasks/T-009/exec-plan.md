---
approved_by: "Samir dahal"
approved_at: "2026-07-24"
planned_behaviors: 7
approved_sha256: "b6e97603d746c720fedddbeb622ba9f83ebb653d39d9c4cdc496481ad789833d"
---
## Exec Plan — Task T-009
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- `POST /api/auth/login` (email + password) → on success establishes a session (signed httpOnly + SameSite=Lax cookie, reusing T-008's session signer) and returns the account; on failure a single generic invalid-credentials error. (AC-1, AC-2)
- `POST /api/auth/logout` → ends the session (clears the cookie) with no confirmation. (AC-3)
- Auth gate on every `/api/expenses*` and `/api/summary` route: unauthenticated → 401, never served stale/default data; the authenticated `user_id` is derived from the session server-side. (AC-4)
- `user_id` ownership on expenses: add the column, and scope every list/summary/create/delete to the authenticated user so no account sees or mutates another's rows. (AC-1 "own data", AC-5 invariant) — per amendment **A-0002-02** (BLUEPRINT / CONSTITUTION conv. 6).
- CSRF protection: a double-submit CSRF token (readable cookie issued alongside the session; echoed in a request header) required on cookie-authenticated state-changing (non-GET) routes — logout, expense create/delete; mismatch/absent → 403; GET reads exempt. (AC-6)

**Approach:** high-level only — NOT implementation prescription
- Reuse T-008's `app/session.py` signer (issue/verify) and `passlib` verifier (`verify_password`). Add `login`/`logout` to `app/routers/auth.py`; a shared helper establishes BOTH the session cookie and the CSRF cookie wherever a session begins (login AND register — so a freshly-registered user can also make authenticated mutations).
- Two FastAPI dependencies: `require_user` (reads+verifies the session cookie → `user_id`, else 401) and `require_csrf` (compares the `X-CSRF-Token` header to the CSRF cookie for non-GET authed routes, else 403). Apply them to the expense/summary router.
- `user_id` scoping: add `user_id` to the `expenses` schema in `app/db.py`; thread it through `repositories/expenses.py` (every query filters/insert-stamps `user_id`) and `services/expenses.py`; the router passes the `require_user` id. Layering stays `router → service → repository`.
- Generic login failure: the same 401 body for unknown-email and wrong-password (no distinguishing signal, timing-insensitive via the constant-time verify).
- Existing MVP expense tests (`test_expenses_*.py`, `test_summary.py`, `test_smoke.py`) currently call the routes unauthenticated and seed rows without an owner — they will be updated to the new authenticated, user-scoped contract via a shared **authenticated-client fixture** in the root `conftest.py` (registers+logs in a user, carries session + CSRF). These updates ride the GREEN commit of the behavior that changes the contract (B-3 gating / B-6 scoping).

**Boundaries & mocks:** (from TSD Boundaries) what's FAKED vs REAL. Each fake = an injected port.
- **Clock** (session expiry) — REAL; `max_age` on verify. Not separately faked (no expiry-boundary AC).
- **Secret** (session signer key) — injected via `SESSION_SECRET`; the autouse `_session_secret` fixture pins it. Fails closed when unset (from T-008).
- **CSRF token randomness** — REAL `secrets`; tests assert the *property* (a request whose header matches the issued cookie passes; a missing/mismatched one is rejected), never an exact token value.
- **SQLite file** — REAL, per-test temp DB via `temp_db`; owned by the repository layer.
- Boundaries non-empty ⇒ smoke AC that hits the real ones: **AC-7 (B-7)** runs the whole login→read-own→logout→rejected flow against the running app on real clock + secret + SQLite.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 … ; include the `e2e` behavior
- **B-1** (tracer) — `POST /api/auth/login` with valid credentials → 200, sets session + CSRF cookies; `GET /api/auth/me` with them returns that account. (AC-1 session)
- **B-2** — login with an unknown email OR a wrong password → identical generic 401 (no signal which was wrong); no session cookie. (AC-2)
- **B-3** — `GET/POST /api/expenses`, `DELETE /api/expenses/{id}`, `GET /api/summary` with no/invalid session → 401 (never stale/default data). (AC-4)
- **B-4** — an authenticated non-GET request without a valid CSRF token → 403; the same request with the matching token → succeeds (demonstrated via logout). (AC-6)
- **B-5** — `POST /api/auth/logout` (with CSRF) clears the session; a subsequent `/api/auth/me` and `/api/expenses` → 401. (AC-3)
- **B-6** — expenses are user-scoped: account A creates an expense; A's list/summary include it, account B's (separate session) never do; delete is likewise owner-scoped. (AC-1 own-data, AC-5 isolation invariant)
- **B-7** (e2e) — register → login → create an expense → GET shows only own → logout → a protected request is rejected. (AC-7)

**PR will contain:**
- `app/routers/auth.py` (login, logout, shared session+CSRF cookie helper), a new `app/dependencies.py` (or `app/auth_deps.py`) with `require_user`/`require_csrf`, `users`/session reuse; `user_id` in `app/db.py` expenses schema; `repositories/expenses.py` + `services/expenses.py` + `routers/expenses.py` scoped by `user_id`.
- New tests (`test_auth_login*.py`, `test_auth_logout.py`, `test_expenses_auth_gate.py`, `test_expenses_isolation.py`, `test_csrf.py`, e2e); updated existing expense tests + an authenticated-client fixture in `conftest.py`.
- TSD Data/State amended (A-0002-02); no `requirements.txt` change (T-008 already added passlib/itsdangerous).

**Open questions / ambiguities:** (MUST be resolved before execution)
- RESOLVED (human, at planning): TSD Data/State said "no new persistent schema" but the same story's isolation ACs require per-user expenses — decision: add `user_id` to expenses in T-009 and scope all queries; TSD corrected via amendment **A-0002-02**. The frozen snapshot-TSD still carries the old wording, so the Critic will flag the schema addition as a divergence — it is expected and dismissed with reference to A-0002-02.
- Pre-auth expense rows: disposable (already resolved) → `user_id` added with no backfill; the dev DB is reset.

**Path:** R (rich)
**Escalation signals hit (≥2 → R):** security (auth gate, session, CSRF, cross-account isolation) · blast-radius (auth + expenses features + all existing expense tests) · amendment (A-0002-02)
**If overriding R→L:** n/a (running as R)
- [ ] Refactor pass done (on green; tests unchanged) — before PR
