# Behavior Spec — T-011: Frontend: Login/logout UI + auth-state gate in App
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-011/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: submitting the Login form with valid credentials transitions the app from the unauthenticated view (Login/Register) to the authenticated dashboard.
- Given:
- When:
- Then:

## B-2: AC-2 [behavior]: a failed login surfaces the generic invalid-credentials error on the form; the app stays on the Login screen.
- Given:
- When:
- Then:

## B-3: AC-3 [behavior]: triggering logout from the authenticated view returns the app to the Login/Register screen with no confirmation step.
- Given:
- When:
- Then:

## B-4: AC-5 [e2e]: a real user with an existing account logs in via the Login screen, sees their own prior expenses, logs out, and is returned to the Login/Register screen.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-4 [non-functional]: on load the app shows the authenticated dashboard when a valid session exists and the Login/Register screen otherwise (session survives a page reload); the Login screen links to Register. — coverage:

