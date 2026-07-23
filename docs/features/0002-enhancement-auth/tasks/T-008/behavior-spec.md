# Behavior Spec — T-008: Backend: register endpoint (account creation + session)
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-008/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: a registration request with a name, a not-yet-registered email, and a password ≥ 8 chars matching its confirmation creates one account and returns it authenticated with a live session (session cookie set); the response never carries the password or its verifier.
- Given: a fresh store with no account for `ada@example.com`.
- When: `POST /api/auth/register` is called with `{name: "Ada", email: "ada@example.com", password: "hunter2pw", confirm_password: "hunter2pw"}`.
- Then: the response is 201; its body carries `id` (int), `name` and `email` matching the input, and contains NO `password`, `confirm_password`, `password_hash`, or verifier field; a session cookie is set on the response (Set-Cookie, httpOnly, SameSite).

## B-2: AC-2 [behavior]: a registration request with an email already in use is rejected identifying the email is taken; no account and no session are created.
- Given: an account for `ada@example.com` already exists (created via a first register call).
- When: `POST /api/auth/register` is called again with the same email (any valid name/password).
- Then: the response is a rejection identifying the email as already taken (e.g. 409 with an email-taken error); no second account exists for that email; the response sets no session cookie.

## B-3: AC-3 [behavior]: a registration request with an empty required field, a confirmation mismatch, or a password shorter than 8 chars is rejected before creation, naming the offending validation; no account and no session are created.
- Given: a fresh store. (parametrized over: empty name; empty email; empty password; confirm mismatch `"hunter2pw"` vs `"hunter2px"`; short password `"short7!"` = 7 chars.)
- When: `POST /api/auth/register` is called with that invalid payload.
- Then: the response is a validation rejection (4xx) whose body names the offending field/rule; no account is created (a subsequent lookup / count for the email is zero); the response sets no session cookie.

## B-4: AC-5 [e2e]: against the running API, a registration request for a fresh email returns an authenticated session usable on a subsequent request.
- Given: a fresh store and a running app (TestClient), a successful `POST /api/auth/register` that returned a session cookie.
- When: `GET /api/auth/me` is called (a) reusing that session cookie, (b) with no cookie, and (c) with a tampered/invalid cookie.
- Then: (a) returns 200 with the same account's public identity (id, name, email); (b) and (c) are rejected as unauthenticated (401), never returning an account.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-4 [invariant]: the submitted password never appears in stored state, responses, or logs — the stored verifier cannot be reversed to it. — coverage: partly a property of **B-1** (the 201 response body omits any password/verifier field). Additionally locked by a guard on the stored row: after a register, the persisted `users` record contains no field equal to the plaintext password, the stored verifier verifies true for the correct password and false for a wrong one, and two accounts with the same password have different stored verifiers (per-user salt). Committed with `lane red --regression` if it asserts existing/derived state, else folded into the B-1 test.

