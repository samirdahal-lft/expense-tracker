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
- Given:
- When:
- Then:

## B-2: AC-2 [behavior]: a registration request with an email already in use is rejected identifying the email is taken; no account and no session are created.
- Given:
- When:
- Then:

## B-3: AC-3 [behavior]: a registration request with an empty required field, a confirmation mismatch, or a password shorter than 8 chars is rejected before creation, naming the offending validation; no account and no session are created.
- Given:
- When:
- Then:

## B-4: AC-5 [e2e]: against the running API, a registration request for a fresh email returns an authenticated session usable on a subsequent request.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-4 [invariant]: the submitted password never appears in stored state, responses, or logs — the stored verifier cannot be reversed to it. — coverage:

