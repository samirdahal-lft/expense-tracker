# Behavior Spec — T-005: Per-category summary
> Source: task card ACs + docs/features/0001-master-mvp/tasks/T-005/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: The summary endpoint returns total spend and a per-category total (in whole NPR) over all expenses, with every category in the fixed set present (zero when it has no expenses).
- Given:
- When:
- Then:

## B-2: AC-3 [e2e]: Through the running app, the summary renders as a donut chart with per-category totals alongside, reflecting adds/deletes without a manual reload.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: Per-category totals sum exactly to the reported grand total; an empty store yields an all-zero summary. — coverage:
- AC-4 [non-functional]: With no expenses, the summary shows a deliberate empty state rather than a broken/empty chart. — coverage:

