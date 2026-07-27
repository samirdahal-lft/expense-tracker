# Behavior Spec — T-edit-bf02tp: Correct a recorded expense (edit amount, category, date, note)
> Source: task card ACs + docs/features/0002-enhancement-edit/tasks/T-edit-bf02tp/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.
>
> Renumbered against the approved exec plan (7 on-ledger behaviors + 1 off-ledger back-fill). Two departures from the
> scaffold's seeding, both argued in the plan: AC-3 and AC-4 are driven as one cycle
> (B-2) because they are one property — validation parity with create — satisfied by one
> change; and AC-9 is driven as two (BF-1 store, B-7 UI) because a green component test
> alone does not make the behavior reachable.

## B-1 (tracer bullet): AC-1 [behavior] + AC-2 [invariant]: Submitting valid new values for an existing expense persists them — a subsequent read returns exactly the submitted amount, category, date and note — and the expense keeps its identity.
- Given: a store holding exactly one expense — 1000 NPR, Food, dated 2026-07-01, note "lunch",
  with a known server-stamped `created_at` — and no other expenses.
- When: that expense is updated by its own id with a full set of valid new values: 2500 NPR,
  Transport, dated 2026-07-05, note "taxi".
- Then: the call succeeds and returns the complete updated expense; a subsequent read of the
  store returns amount 2500, category Transport, date 2026-07-05 and note "taxi" for that
  expense; its `id` and its original `created_at` are byte-for-byte unchanged; and the store
  still holds exactly one expense — none added, none removed.

## B-2: AC-3 [invariant] + AC-4 [invariant]: The update endpoint refuses precisely what the create endpoint refuses, names the offending field, and leaves the stored expense unchanged.
- Given: a store holding one valid expense — 1000 NPR, Food, dated 2026-07-01, note "lunch".
- When: that expense is updated by its own id with a body that is invalid in exactly one field —
  in turn: amount 0; amount -100; amount 12.5 (a fractional number, not a whole rupee); category
  "Groceries" (outside the fixed set); date "not-a-date"; and date "2026-02-30" (well-formed but
  not a real calendar day).
- Then: every one of those is refused with a client-error status, and the error identifies the
  offending field by name — `amount`, `category` or `date` respectively. The refusal happens at
  the API itself, not in the browser. After each attempt the stored expense is byte-for-byte what
  it was: 1000 NPR, Food, 2026-07-01, "lunch". The same bodies are refused by the create endpoint,
  so editing is not a validation bypass.

## B-3: AC-5 [behavior]: Updating an unknown expense id is reported as not-found and mutates nothing.
- Given: a store holding exactly one expense — 1000 NPR, Food, dated 2026-07-01, note "lunch" —
  and an id that belongs to no expense.
- When: an otherwise entirely valid update is submitted against that unknown id.
- Then: the call is reported as not-found. Nothing is created to satisfy it — the store still
  holds exactly one expense — and the expense that does exist is unchanged in every field.

## BF-1 (off-ledger back-fill, consumed no behavior number; the test's inline comment reads "B-4 (backfill)" — written before this renumbering): AC-9 [e2e, store half]: An update that moves an amount from one category to another reconciles in the per-category summary, against the real store.
> **Off-ledger — recorded with `lane red --backfill`, not a test-first cycle.** The exec plan
> listed this as a RED→GREEN behavior; that was wrong, and this is the honest correction rather
> than a manufactured failure. The summary endpoint already existed at this task's base, and once
> B-1 made the update path write the row, reconciliation followed with no further code. The test
> was therefore verified to PASS before it was written down — there is no failing state to record.
> It is not a `--regression` guard either: a guard must pass at the task's BASE, and at base there
> was no update endpoint at all. So it is a backfill: real behavior this task introduces, tested
> after the fact, counted apart from the test-first proof. The TSD names this integration test
> explicitly, so it is kept rather than dropped.
- Given: a store holding two expenses — 1000 NPR under Food and 500 NPR under Transport — whose
  summary therefore reports Food 1000, Transport 500, and a grand total of 1500.
- When: the Food expense is updated to 400 NPR under Transport, moving its amount between
  categories in a single edit.
- Then: a subsequent read of the summary reports Food 0 and Transport 900, with a grand total of
  900. Every fixed category is still present, and the per-category totals still sum to the grand
  total. This is asserted against the real SQLite store through the real HTTP API — no stub.

## B-4: AC-6 [behavior]: Opening edit on a listed expense presents a form pre-filled with that expense's current amount, category, date, and note; an absent note presents as an empty field.
- Given: the app is showing its expense list, and that list holds an expense of 1000 NPR under
  Food, dated 2026-07-01, with the note "lunch" — and, separately, one with no note at all.
- When: the user opens edit on that listed row.
- Then: an edit form appears, distinct from the add-an-expense form, and every one of its four
  fields already holds that expense's current value — amount 1000, category Food, date
  2026-07-01, note "lunch" — so the user corrects a value rather than retyping the entry. For the
  expense that has no note, the note field is present and empty, not absent and not filled with a
  placeholder.

## B-5: AC-7 [behavior]: Submitting the form empties the note when the note field is submitted empty — the note is a replaced field, not a preserved one.
- Given:
- When:
- Then:

## B-6: AC-8 [behavior]: Dismissing the edit form without submitting mutates nothing and issues no update request.
- Given:
- When:
- Then:

## B-7: AC-9 [e2e, UI half]: In the running app, a user viewing the expense list opens an entry, changes its amount and category, saves, and sees the updated row and the re-reflected per-category summary without reloading the page.
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: The expense keeps its identity across an update — its `id` and its original `created_at` are unchanged, and no expense is added or removed. — coverage: **a property of B-1**, asserted in the same cycle: B-1's Then requires the original `id` and `created_at` to survive the update and the expense count to be unchanged. It is not a separate cycle because there is no way to observe it except through a successful update.
- AC-3 [invariant]: An amount that is zero, negative, or non-integer is refused with a client error naming the offending field, and the stored expense is left unchanged. The refusal holds at the API, not only in the browser. — coverage: **driven as B-2**, its own RED→GREEN cycle rather than an off-ledger guard. `lane red --regression` would be wrong here: a guard must pass at the task's base, and at base there is no update endpoint to refuse anything — this is new behavior this task introduces, so it earns a real test-first cycle. Asserted at the API, not in the browser.
- AC-4 [invariant]: A category outside the fixed set, and a malformed or non-calendar date, are refused on the same terms as at creation — editing is not a validation bypass. — coverage: **driven as B-2**, the same cycle as AC-3 and for the same reason. The two ACs are one property — the update path refuses exactly what the create path refuses — and one change satisfies both: the update model derives its rules from the create model instead of restating them, so the two cannot drift apart.
