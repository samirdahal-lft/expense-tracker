# Behavior Spec — T-edit-bf02tp: Correct a recorded expense (edit amount, category, date, note)
> Source: task card ACs + docs/features/0002-enhancement-edit/tasks/T-edit-bf02tp/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: Submitting valid new values for an existing expense persists them — a subsequent read of the expense returns exactly the submitted amount, category, date, and note.
- Given:
- When:
- Then:

## B-2: AC-5 [behavior]: Updating an unknown expense id is reported as not-found and mutates nothing.
- Given:
- When:
- Then:

## B-3: AC-6 [behavior]: Opening edit on a listed expense presents a form pre-filled with that expense's current amount, category, date, and note; an absent note presents as an empty field.
- Given:
- When:
- Then:

## B-4: AC-7 [behavior]: Submitting the form empties the note when the note field is submitted empty — the note is a replaced field, not a preserved one.
- Given:
- When:
- Then:

## B-5: AC-8 [behavior]: Dismissing the edit form without submitting mutates nothing and issues no update request.
- Given:
- When:
- Then:

## B-6: AC-9 [e2e]: In the running app, a user viewing the expense list opens an entry, changes its amount and category, saves, and sees the updated row and the re-reflected per-category summary without reloading the page.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: The expense keeps its identity across an update — its `id` and its original `created_at` are unchanged, and no expense is added or removed. — coverage:
- AC-3 [invariant]: An amount that is zero, negative, or non-integer is refused with a client error naming the offending field, and the stored expense is left unchanged. The refusal holds at the API, not only in the browser. — coverage:
- AC-4 [invariant]: A category outside the fixed set, and a malformed or non-calendar date, are refused on the same terms as at creation — editing is not a validation bypass. — coverage:

