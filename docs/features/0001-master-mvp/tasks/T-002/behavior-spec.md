# Behavior Spec — T-002: List expenses
> Source: task card ACs + docs/features/0001-master-mvp/tasks/T-002/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: The list endpoint returns all expenses, most recent first, each with id, amount (whole NPR), category, date, note.
- Given: a store seeded with two expenses whose `created_at` timestamps differ (an earlier one and a later one).
- When: a client sends `GET /api/expenses`.
- Then: the response is 200 with a JSON array of both expenses, the later-`created_at` one first, and each item carries `id`, `amount` (integer NPR), `category`, `date`, `note`.

## B-2: AC-2 [behavior]: With no expenses recorded, the endpoint returns an empty collection with a success status (not an error).
- Given: an empty store (table exists, no rows).
- When: a client sends `GET /api/expenses`.
- Then: the response is 200 with an empty JSON array `[]` (not a 404, 500, or error body).

## B-3: AC-4 [e2e]: Through the running app, recorded expenses render as a readable list showing amount (as NPR), category, date, and note.
- Given: the app is rendered with the API client returning two expenses.
- When: the list finishes loading.
- Then: both expenses appear as readable rows showing the amount formatted as NPR (e.g. `Rs 1,250`), the category, the date, and the note.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-3 [non-functional]: While the list request is in flight the UI shows a loading state; when the collection is empty it shows a deliberate empty state (not a blank screen). — coverage: proven inside B-3's frontend test file — two extra render cases assert (a) a loading indicator while the API promise is pending and (b) a deliberate empty-state message when the client resolves to `[]`.

