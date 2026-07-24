# Behavior Spec — T-009: Backend: login/logout + session-gated expense routes
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-009/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: a login request with valid matching credentials for an existing account starts an authenticated session; a subsequent request returns that account's own data.
- Given:
- When:
- Then:

## B-2: AC-2 [behavior]: a login request with an unknown email or a wrong password is rejected with one generic invalid-credentials error that does not reveal which was wrong; no session is created.
- Given:
- When:
- Then:

## B-3: AC-3 [behavior]: a logout request ends the current session immediately with no confirmation; a subsequent request to any expense/summary route is rejected as unauthenticated.
- Given:
- When:
- Then:

## B-4: AC-6 [behavior]: a cookie-authenticated state-changing (non-GET) request that fails the CSRF check is rejected; the same request with a valid CSRF check succeeds.
- Given:
- When:
- Then:

## B-5: AC-7 [e2e]: against the running API, a login returns a session that reads that account's own expenses, and logout then makes a protected request fail as unauthenticated.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-4 [non-functional]: any expense/summary request without a valid session is rejected, never served stale or default data; a valid session remains usable until logout or expiry. — coverage:
- AC-5 [invariant]: across any interleaving of login/logout between two accounts, a session only ever reads or mutates its own account's rows — no route or aggregate returns another user's data. — coverage:

