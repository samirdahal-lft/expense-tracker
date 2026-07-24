# Behavior Spec — T-009: Backend: login/logout + session-gated expense routes
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-009/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 — login with valid credentials starts an authenticated session.
- Given: a registered account (`ada@example.com` / `hunter2pw`).
- When: `POST /api/auth/login` with those credentials, then `GET /api/auth/me` reusing the response cookies.
- Then: login → 200 and sets a session cookie (httpOnly, SameSite=Lax) plus a readable CSRF cookie; `/api/auth/me` → 200 returning that account (id, name, email).

## B-2: AC-2 — unknown email or wrong password → one generic error, no session.
- Given: a registered account `ada@example.com`. (parametrized: unknown email `nobody@example.com`; correct email + wrong password.)
- When: `POST /api/auth/login` with the bad credentials.
- Then: 401 with a single generic invalid-credentials message that is byte-for-byte identical between the two cases (no signal which was wrong); no session cookie set.

## B-3: AC-4 — expense/summary routes reject unauthenticated requests.
- Given: no session (fresh client). (parametrized over `GET /api/expenses`, `POST /api/expenses`, `DELETE /api/expenses/1`, `GET /api/summary`.)
- When: the route is called with no/invalid session cookie.
- Then: 401 unauthenticated; no expense data or default/empty payload is returned (the body is an error, not a list/summary).

## B-4: AC-6 — CSRF check on cookie-authenticated state-changing requests.
- Given: an authenticated session (logged-in client with session + CSRF cookies).
- When: a non-GET authenticated request (`POST /api/auth/logout`) is made (a) without the `X-CSRF-Token` header / with a wrong token, and (b) with the header matching the CSRF cookie.
- Then: (a) → 403 rejected; (b) → succeeds (2xx). A GET read with no CSRF token is unaffected.

## B-5: AC-3 — logout ends the session immediately, no confirmation.
- Given: an authenticated session.
- When: `POST /api/auth/logout` (with a valid CSRF token) is called, then `GET /api/auth/me` and `GET /api/expenses` are retried with the post-logout cookies.
- Then: logout → 2xx and clears the session cookie with no confirmation step; the subsequent `/api/auth/me` and `/api/expenses` → 401.

## B-6: AC-1 (own data) + AC-5 — expenses are user-scoped; no cross-account leakage.
- Given: two registered+logged-in accounts A and B (separate clients/sessions).
- When: A creates an expense (authenticated, with CSRF); then A and B each `GET /api/expenses` and `GET /api/summary`, and B attempts `DELETE` of A's expense id.
- Then: A's list/summary include A's expense; B's list is empty and B's summary totals are 0 (never A's rows); B's delete of A's id → not found/forbidden and does not remove A's row.

## B-7 (e2e): AC-7 — full login → read-own → logout → rejected flow.
- Given: a running app (TestClient), a registered account with one prior expense of its own.
- When: the account logs in via `POST /api/auth/login`, `GET /api/expenses`, then `POST /api/auth/logout`, then retries `GET /api/expenses`.
- Then: after login the list shows exactly that account's own expense(s); after logout the protected request → 401. Exercises real clock + secret + SQLite through the running app.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-4 [non-functional]: any expense/summary request without a valid session is rejected, never served stale or default data; a valid session remains usable until logout or expiry. — coverage: driven as **B-3** (unauth → 401 across all four routes, body is an error not a default payload); the "usable until logout" half holds as a property of **B-1/B-6** (authed requests succeed) and **B-5** (usable until logout, then rejected).
- AC-5 [invariant]: across any interleaving of login/logout between two accounts, a session only ever reads or mutates its own account's rows — no route or aggregate returns another user's data. — coverage: property of **B-6** (two-account read/summary/delete isolation). May add an off-ledger `lane red --regression` guard asserting the repository layer never returns another user's row given a `user_id` filter, if the interface test leaves a gap.
