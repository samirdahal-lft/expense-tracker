# Behavior Spec — T-004: Delete an expense
> Source: task card ACs + docs/features/0001-master-mvp/tasks/T-004/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: Deleting an existing expense by id removes it; a subsequent list no longer includes it.
- Given: a store seeded with one expense (with a known id).
- When: a client sends `DELETE /api/expenses/{id}` for that id.
- Then: the response is a no-content success (204), and a subsequent list no longer includes that expense.

## B-2: AC-2 [invariant, driven]: Deleting an unknown id is reported as not-found and changes nothing.
- Given: a store seeded with one expense.
- When: a client sends `DELETE /api/expenses/{unknown_id}` for an id that does not exist.
- Then: the response is 404, and a subsequent list still contains the original expense (nothing removed).

## B-3: AC-3 [e2e]: Through the running app, a per-row delete control removes the expense from the list without a manual page reload.
- Given: the app is rendered with one expense in the list; the API client is stubbed so the delete succeeds and the next list read omits it.
- When: the user clicks that row's delete control.
- Then: without any navigation/reload, the expense disappears from the list.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: not-found on unknown id — driven directly by **B-2**.

