# Behavior Spec — T-009: Backend: login/logout + session-gated expense routes
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-009/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> B-N here are the LEDGER RED→GREEN cycles (they match lane's counter). Behaviors that
> could not be driven test-first (already satisfied by an earlier behavior's code) are
> recorded as off-ledger guards in the Guards section, NOT numbered B-N.

## B-1 (tracer bullet): AC-1 — login with valid credentials starts an authenticated session.
- Given: a registered account (`ada@example.com` / `hunter2pw`).
- When: `POST /api/auth/login` with those credentials, then `GET /api/auth/me` reusing the response cookies.
- Then: login → 200 and sets a session cookie (httpOnly, SameSite=Lax) plus a readable CSRF cookie; `/api/auth/me` → 200 returning that account (id, name, email).

## B-2: AC-4 — expense/summary routes reject unauthenticated requests.
- Given: no session (fresh client). (parametrized over `GET /api/expenses`, `POST /api/expenses`, `DELETE /api/expenses/1`, `GET /api/summary`.)
- When: the route is called with no/invalid session cookie.
- Then: 401 unauthenticated; no expense data or default/empty payload is returned (the body is an error, not a list/summary).

## B-3: AC-6 — CSRF check on cookie-authenticated state-changing requests.
- Given: an authenticated session (session + CSRF cookies).
- When: an authenticated non-GET request (`POST /api/expenses`) is made (a) with no `X-CSRF-Token` header, (b) with a wrong token, and (c) with the header matching the CSRF cookie; and a GET read is made with no token.
- Then: (a) and (b) → 403; (c) → 201 succeeds; the GET read → 200 (reads are exempt).

## B-4: AC-3 — logout ends the session immediately, no confirmation.
- Given: an authenticated session.
- When: `POST /api/auth/logout` (with a valid CSRF token) is called, then `GET /api/auth/me` and `GET /api/expenses` are retried with the post-logout cookies.
- Then: logout → 2xx and clears the session cookie with no confirmation step; the subsequent `/api/auth/me` and `/api/expenses` → 401.

## B-5: AC-1 (own data) + AC-5 — expenses are user-scoped; no cross-account leakage.
- Given: two registered+logged-in accounts A and B (separate clients/sessions).
- When: A creates an expense (authenticated, with CSRF); then A and B each `GET /api/expenses` and `GET /api/summary`, and B attempts `DELETE` of A's expense id.
- Then: A's list/summary include A's expense; B's list is empty and B's summary totals are 0 (never A's rows); B's delete of A's id → not found and does not remove A's row.

## B-6 (e2e): AC-7 — full login → read-own → logout → rejected flow.
- Given: a running app (TestClient), a registered account with one prior expense of its own.
- When: the account logs in via `POST /api/auth/login`, `GET /api/expenses`, then `POST /api/auth/logout`, then retries `GET /api/expenses`.
- Then: after login the list shows exactly that account's own expense(s); after logout the protected request → 401. Exercises real clock + secret + SQLite through the running app.

## Guards & invariants (off-ledger / not standalone RED→GREEN cycles)
> Behaviors coded as part of an earlier B-N (couldn't be driven test-first) are committed with
> `lane red --backfill`; invariants hold as properties of a behavior above.
- AC-2 [behavior] generic login failure — unknown email OR wrong password → one identical generic 401, no session cookie. Coded within B-1's login endpoint (the failure path is intrinsic); locked by an off-ledger backfill guard (`tests/test_auth_login_failure.py`).
- AC-4 [non-functional] — the "rejected when unauthenticated, never stale/default" half is driven as B-2; "usable until logout" holds as a property of B-1/B-5 (authed requests succeed) and B-4 (usable until logout, then rejected).
- AC-5 [invariant] cross-account isolation — property of B-5 (two-account read/summary/delete isolation). May add an off-ledger `lane red --regression` guard at the repository layer if the interface test leaves a gap.
