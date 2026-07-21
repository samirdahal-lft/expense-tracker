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
- Given: a store seeded with expenses across some (not all) categories — e.g. Food 1000 + Food 500, Transport 2500 (Bills/Other none).
- When: a client sends `GET /api/summary`.
- Then: the response is 200 with `total` = 4000 and `by_category` containing all four fixed categories — Food 1500, Transport 2500, Bills 0, Other 0 — and the per-category totals sum to `total`. And: against an empty store the summary is all-zero (`total` 0, every category 0).

## B-2: AC-3 [e2e]: Through the running app, the summary renders as a donut chart with per-category totals alongside, reflecting adds/deletes without a manual reload.
- Given: the app is rendered with the summary endpoint returning known per-category totals (and separately, an empty summary).
- When: the summary finishes loading.
- Then: the per-category totals are shown as readable amounts (NPR) alongside a donut chart region; when there are no expenses, a deliberate empty state is shown instead of a broken/empty chart.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: totals reconcile to the grand total; empty store → all-zero — asserted as part of **B-1**.
- AC-4 [non-functional]: empty-state (no broken chart) when there are no expenses — asserted as part of **B-2**.

