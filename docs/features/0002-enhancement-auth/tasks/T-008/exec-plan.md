---
approved_by: "samir dahal"
approved_at: "2026-07-23"
planned_behaviors: 4
approved_sha256: "6a0e6547b163fa82eb700d1052920de8fe4425dc32c2a52b2e16889e3d2cfd54"
---
## Exec Plan — Task T-008
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- A `users` table + a register endpoint `POST /api/auth/register` that creates one account and logs the caller in by setting a signed, httpOnly, SameSite session cookie. (AC-1)
- Email uniqueness enforced so a duplicate registration is rejected without creating a second account or a session. (AC-2)
- Request validation rejecting an empty required field, a password/confirmation mismatch, or a password shorter than 8 chars, before any account is created. (AC-3)
- One-way, salted password storage: only a non-reversible verifier is persisted; no endpoint response or log line carries the plaintext or the verifier. (AC-4, invariant)
- `GET /api/auth/me` returning the current account when a valid session cookie is present and rejecting as unauthenticated otherwise — the observable proof that a register response's session is usable on a later request. (AC-5, e2e)

**Approach:** high-level only — NOT implementation prescription
- Follow the existing `router → service → repository` layering and the env-injected seam style (`EXPENSE_DB_PATH`). Add a parallel slice: `models/user.py` (request/response models), `repositories/users.py` (only SQL for `users`), `services/auth.py` (register + credential/session logic), `routers/auth.py` (`/api/auth/*`), and a small `app/session.py` (cookie issue/verify).
- Password hashing and session signing use the **Python standard library only** — `hashlib.pbkdf2_hmac` with a per-user random salt from `secrets` for the verifier; `hmac` + `secrets` to sign a session token carrying the `user_id` and an expiry. No new dependency is added; `requirements.txt` stays as pinned.
- The session cookie is `httpOnly` and `SameSite=Lax`. That satisfies the SameSite half of the TSD CSRF contract for the cookie register issues; the CSRF **token** check on already-authenticated, state-changing routes (logout, expense create/delete) is T-009's scope — register carries no session cookie to forge.
- `users` table added to `app/db.py`'s idempotent schema (`init_db`), consistent with how `expenses` is created. Public identity returned = id, name, email — never the verifier.

**Boundaries & mocks:** (from TSD Boundaries) what's FAKED vs REAL. Each fake = an injected port.
- **Clock** (session issued-at / expiry) — REAL by default (`datetime.now(timezone.utc)`), exposed as an injectable seam so unit/integration tests can pin "now" and assert expiry behavior. Faked in tests.
- **Secret** used to sign the session cookie — injected via a `SESSION_SECRET` env var, mirroring the existing `EXPENSE_DB_PATH` pattern; the test fixture sets a fixed value so replay is deterministic. Faked in tests.
- **Randomness** (per-user salt) — REAL `secrets`; not injected. Tests assert the *property* (verify true for the right password, false otherwise; plaintext absent from the stored row), never an exact hash value.
- **SQLite file** — owned by the repository layer, not an external dep. Real, on the per-test temp DB via `temp_db`.
- Boundaries non-empty ⇒ smoke AC that hits the real ones: **AC-5 (B-4)** exercises the real clock + real secret + real SQLite through the running app (register → `/api/auth/me` with the issued cookie).

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 … ; include the `e2e` behavior
- **B-1** (tracer) — `POST /api/auth/register` with valid name, fresh email, and matching password ≥ 8 chars → 201, body carries the public identity (id, name, email) and NO password/verifier field, and a session cookie is set. (AC-1; also asserts the AC-4 property that the response omits the secret)
- **B-2** — registering an email already in use → rejected identifying the email is taken; still exactly one account for that email; no session cookie set. (AC-2)
- **B-3** — registering with an empty required field, a confirmation mismatch, or a password < 8 chars → rejected naming the offending validation, before any account exists; no session cookie set. (AC-3; parametrized over the three cases)
- **B-4** (e2e) — after a successful register, reusing the returned session cookie on `GET /api/auth/me` returns that account; without / with an invalid cookie it is rejected as unauthenticated. (AC-5)

**PR will contain:**
- `app/models/user.py`, `app/repositories/users.py`, `app/services/auth.py`, `app/routers/auth.py`, `app/session.py`; `users` schema in `app/db.py`; router registration in `app/main.py`.
- Tests under `tests/` (e.g. `test_auth_register_*.py`, `test_auth_me.py`) covering B-1…B-4 and the AC-4 stored-verifier property; a `session_secret`/clock fixture addition to the root `conftest.py`.
- No `requirements.txt` change (stdlib only).

**Open questions / ambiguities:** (MUST be resolved before execution)
- None blocking. Pre-auth expense rows keep no `user_id` yet — the TSD resolved pre-auth data as disposable, and expense/session gating is T-009; this task does not migrate or scope expense rows.

**Path:** R (rich)
**Escalation signals hit (≥2 → R):** security (password storage + session issuance) · blast-radius (new auth slice across models/repo/service/router/session + db + main)
**If overriding R→L:** n/a (running as R)
- [ ] Refactor pass done (on green; tests unchanged) — before PR
