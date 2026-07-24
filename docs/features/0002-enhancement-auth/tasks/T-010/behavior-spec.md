# Behavior Spec — T-010: Frontend: Register screen wired to the register endpoint
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-010/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: submitting the Register form with a name, email, and matching password ≥ 8 chars sends the registration and, on success, transitions the app to the authenticated view.
- Given:
- When:
- Then:

## B-2: AC-2 [behavior]: client-side validation blocks submission and shows a message when a required field is empty, the confirmation doesn't match, or the password is shorter than 8 chars.
- Given:
- When:
- Then:

## B-3: AC-3 [behavior]: a server rejection (e.g. duplicate email) is surfaced as an error message on the form; the form stays on screen and the app does not transition.
- Given:
- When:
- Then:

## B-4: AC-5 [e2e]: a real user opens the app, fills the Register screen, and lands on their own empty authenticated dashboard with no manual setup.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-4 [non-functional]: while the request is in flight the submit control is disabled/indicates progress, and the Register screen links to the Login screen for existing users. — coverage:

