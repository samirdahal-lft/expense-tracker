---
approved_by: "Samir dahal"
approved_at: "2026-07-24"
approved_sha256: "4fdad494d59f7cfe46b9ad912025c66ae8af159c73c54a9d14444a22ff170fd4"
---
# TSD 0002 — Account registration and login
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-0002.nn — the 0002 prefix is what resolves this folder (docs/features/0002-*/),
> so the `## TSD S-0002.nn` header below must match the story ID exactly.

## Resolved from PRD open questions
- **Session mechanism:** httpOnly signed session cookie (per BLUEPRINT.md — the backend is the
  sole issuer/verifier and the only place `user_id` is derived from it). Not a client-readable
  token.
- **CSRF protection:** the session cookie is set `SameSite` (at least `Lax`) so it is not sent
  on cross-site navigations by default. State-changing requests (any non-GET — login, logout,
  register, and all expense create/delete routes) additionally require a CSRF check: the backend
  rejects a state-changing request that carries the session cookie but fails the CSRF check.
  Whether that check is a submitted token echoing a paired value or an equivalent same-origin
  guarantee is an implementation choice — the contract is only that cookie-authenticated,
  state-changing requests are not accepted on cross-site forgery. Safe (GET) reads do not
  require the CSRF check.
- **Pre-auth dev data:** disposable. No `user_id` backfill/migration is provided; the existing
  single-file dev database is reset when the account layer lands. (Recorded here so it is not
  reopened downstream.)

## TSD S-0002.01 — Register  (PRD §S-0002.01)
| Aspect | Spec |
|--------|------|
| Interfaces | A registration endpoint accepting name, email, password, and password confirmation. On success: creates one account, establishes an authenticated session (sets the session cookie), and returns the created account's public identity (never the password/hash). Rejections return a structured error distinguishing: duplicate email, one or more validation failures. Frontend exposes a Register screen (name, email, password, confirm) that consumes this endpoint via the typed client and lands the user on the authenticated app on success. |
| Data / State | A user record per account: unique identifier, name, email (unique across all accounts, used as the login handle), and a password verifier derived via a one-way, salted transformation — never the plaintext. Session state associates a live session with exactly one `user_id`. Expense-owning tables already carry `user_id` (BLUEPRINT.md); registration creates the account those rows will later scope to. |
| Behavior | Given a name, a not-yet-registered email, and a password ≥ 8 chars matching its confirmation → the account is created, a session is started, and the caller is authenticated as the new user. Given an email already in use → rejected identifying the email is taken; no account and no session created. Given any empty required field, a confirmation mismatch, or a password shorter than 8 chars → rejected before creation, naming the offending validation; no account and no session created. The stored verifier is never equal to, and cannot be reversed to, the submitted password, and the plaintext never appears in logs or responses. |
| Access | Public (unauthenticated) — this is how an account first comes into existence. An already-authenticated caller does not need it. |
| Boundaries | The clock (session issued-at / expiry) and the randomness/secret used to salt the password verifier and sign the session cookie — injected, not hard-coded; faked in unit/integration. The SQLite file is owned by the repository layer (not an external dep). |
| Tests | unit: validation rules (empty field, confirmation mismatch, length < 8) reject before any persistence; the password verifier is one-way (verify-true for the right password, false otherwise) and the plaintext is absent from the stored record. integration: register flow through router→service→repository creates exactly one account, enforces email uniqueness (second identical email rejected, still one row), and issues a session cookie scoped to the new `user_id`. smoke: against the running stack, a real Register submission lands on the authenticated app with a working session and no manual setup. |

## TSD S-0002.02 — Login and logout  (PRD §S-0002.02)
| Aspect | Spec |
|--------|------|
| Interfaces | A login endpoint accepting email + password; on success establishes an authenticated session (sets the session cookie) and identifies the account; on failure returns a single generic invalid-credentials error. A logout endpoint that ends the current session (clears/invalidates the cookie) with no confirmation step. All existing `/api/expenses*` and `/api/summary` routes require a valid session and derive `user_id` from it. Frontend exposes a Login screen and a logout affordance; unauthenticated state renders Login/Register, authenticated state renders the real app. |
| Data / State | Reads the user record (email → account, verifier check). Session state associates a live session with exactly one `user_id`; logout terminates that association. Expense-owning rows gain a `user_id` owner (BLUEPRINT: every user-owned row carries `user_id`); every expense/summary query is scoped to the authenticated user's id. Pre-auth expense rows are disposable (resolved in "Resolved from PRD open questions"), so no backfill is required. (Amended — see AMENDMENTS.md A-0002-02.) |
| Behavior | Given valid matching credentials for an existing account → a session starts and subsequent requests return that account's own data. Given an unknown email OR a wrong password → rejected with one generic error that does not reveal which was wrong; no session. The session persists across a page reload until logout or expiry; any request to an expense/summary route without a valid session is rejected as unauthenticated (never served stale/default data). Logout ends the session immediately with no confirmation; a subsequent expense/summary request is rejected as unauthenticated. Under any interleaving of login/logout across two accounts, a session only ever reads or mutates its own account's rows — no route, query, or aggregate returns another user's data. |
| Access | Login and logout are reachable by any caller (login: unauthenticated; logout: the holder of a session). Every expense/summary route is authenticated-only. Being state-changing, login/logout are also subject to the CSRF check (see Resolved from PRD open questions). |
| Boundaries | The clock (session expiry, "persists across reload until expiry"); the secret used to sign/verify the session cookie and the verifier comparison — injected, faked in unit/integration. SQLite owned by the repository layer. |
| Tests | unit: credential check returns the same generic failure for unknown-email and wrong-password (no distinguishing signal); logout invalidates the session token. integration: login→authenticated request returns only the caller's rows; an expense/summary request with no/invalid session is rejected; cross-account isolation — account A's session never returns account B's rows across a login/logout/login sequence; logout followed by a protected request is rejected; a cookie-authenticated state-changing request that fails the CSRF check is rejected, while the same request with a valid CSRF check succeeds. smoke: against the running stack, a real user logs in, sees their own prior expenses, logs out, and is returned to the Login/Register screen with protected routes no longer served. |
