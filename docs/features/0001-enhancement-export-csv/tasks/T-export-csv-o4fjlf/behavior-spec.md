# Behavior Spec — T-export-csv-o4fjlf: Export expenses to CSV from the expenses screen
> Source: task card ACs + docs/features/0001-enhancement-export-csv/tasks/T-export-csv-o4fjlf/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: Serializing a list of expenses yields CSV text with the header row
- Given:
- When:
- Then:

## B-2: AC-2 [behavior]: Each field is canonical — date as `YYYY-MM-DD`, category verbatim, amount
- Given:
- When:
- Then:

## B-3: AC-3 [behavior]: A note containing a comma, a double quote, or a line break is wrapped in
- Given:
- When:
- Then:

## B-4: AC-4 [behavior]: Serializing an empty list yields the header row alone — the serializer
- Given:
- When:
- Then:

## B-5: AC-5 [behavior]: In the app with expenses loaded, activating the export control produces
- Given:
- When:
- Then:

## B-6: AC-6 [behavior]: In the app with an empty list, activating the export control produces no
- Given:
- When:
- Then:

## B-7: AC-7 [behavior]: Activating export twice replaces the status message rather than stacking
- Given:
- When:
- Then:

## B-8: AC-10 [e2e]: In the running app (`docker compose up`), the owner clicks Export CSV on the
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-8 [invariant]: Export is read-only — no write request is issued, and the rendered — coverage:
- AC-9 [non-functional]: The control carries an accessible name stating the action and is — coverage:

