# Behavior Spec — T-003: Add an expense
> Source: task card ACs + docs/features/0001-master-mvp/tasks/T-003/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: Submitting amount + category (from the fixed set) + date, with an optional note, creates an expense and returns it with a server-assigned id.
- Given:
- When:
- Then:

## B-2: AC-4 [e2e]: Through the running app, filling and submitting the add-expense form makes the new expense appear in the list without a manual page reload.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: A non-positive or non-integer amount, or a category outside the fixed set, is rejected with a validation error and nothing is created. — coverage:
- AC-3 [invariant]: The stored and returned amount is a positive integer number of whole NPR. — coverage:

