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
- Given: an empty store.
- When: a client POSTs `{ amount: 1200, category: "Food", date: "2026-07-05", note: "groceries" }` to `/api/expenses`.
- Then: the response is 201 with the created expense — a server-assigned integer `id`, a `created_at` timestamp, and `amount: 1200`, `category: "Food"`, `date: "2026-07-05"`, `note: "groceries"`; a subsequent list includes exactly that expense.

## B-2: AC-2 [invariant, driven]: Invalid input is rejected with a 422 and nothing is created.
- Given: an empty store.
- When: a client POSTs a body with a non-positive amount (`0` / `-5`), a non-integer amount (`12.5`), or a category outside the fixed set (`"Groceries"`).
- Then: each returns a 422 validation error, and a subsequent list is still empty (nothing persisted).

## B-3: AC-4 [e2e]: Through the running app, filling and submitting the add-expense form makes the new expense appear in the list without a manual page reload.
- Given: the app is rendered with an empty list; the API client is stubbed so a create succeeds and the next list read returns the new expense.
- When: the user fills amount, category, and date in the add form and submits.
- Then: without any navigation/reload, the new expense appears in the list (amount shown as NPR, with its category and date).

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: rejection of bad amount/category — driven directly by **B-2**.
- AC-3 [invariant]: amount is a positive integer whole NPR — held as a property of **B-1** (valid integer round-trips unchanged) and **B-2** (non-integer/non-positive amounts rejected).

