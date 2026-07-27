---
approved_by: "Samir dahal"
approved_at: "2026-07-27"
approved_sha256: "fbeab04d54f3a3a0cf40542ed6bdc57fbf7ca568b19c57e977505b080228d77d"
---
# TSD 0002 — Edit an expense
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-0002.nn — the 0002 prefix is what resolves this folder (docs/features/0002-*/),
> so the `## TSD S-0002.nn` header below must match the story ID exactly.

## Inherited contracts
The Expense resource, money-as-integer-NPR, the fixed category set, the error convention, and
the single JSON API prefix are all defined in TSD 0001 §Shared contracts and are unchanged by
this enhancement. This story adds one mutation to an existing resource; it introduces no new
resource, no new field, and no new category.

## Resolved from PRD open questions
- **Summary refresh (Q1)** — the per-category summary updates in the same interaction as the
  list. An edit that changes amount or category is arithmetically a change to the summary;
  leaving it stale would contradict TSD 0001 §S-0001.04, which already requires the summary to
  track add/delete without a manual reload.
- **Form placement (Q2)** — deliberately unspecified. The contract is an edit affordance per
  listed expense that opens a form seeded with that expense's values; inline-vs-modal is an
  implementation choice for the execution plan, not a spec obligation.
- **Note removal (Q3)** — the note is a full-replacement field like the others: submitting it
  empty clears any existing note. There is no "omit to preserve" semantics.

---

## TSD S-0002.01 — Correct a recorded expense  (PRD §S-0002.01)
| Aspect | Spec |
|--------|------|
| Interfaces | An update-expense-by-id endpoint. Request body carries the full editable set — `{ amount:int>0, category:enum, date:YYYY-MM-DD, note?:string }` — the same shape the create endpoint accepts; it is a full replacement of those four fields, not a partial patch. On success returns the complete updated Expense resource (including unchanged `id` and `created_at`) with a success status. Invalid input returns a client-error status naming the offending field(s). An unknown id returns a not-found status. The frontend reaches this through the existing typed API-client module; components consume it via hooks (CONSTITUTION §4). |
| Data / State | Updates the four editable columns of exactly one existing row in the expenses store, matched by `id`. `id` and `created_at` are server-owned and immutable — no code path may alter them. No row is inserted or removed; no other row is touched. |
| Behavior | Opening edit on a listed expense presents a form pre-filled with that expense's current amount, category, date, and note (absent note → empty field). Submitting valid values persists them and the change survives a reload; the expense keeps its identity and original `created_at`. An amount that is zero, negative, or non-integer is refused with a message naming the problem, and the stored row is left unchanged — the refusal holds at the API, not only in the browser. A category outside the fixed set and a malformed or non-calendar date are refused on the same terms as at creation: editing is not a validation bypass. Submitting an empty note clears the stored note. Dismissing the form without submitting mutates nothing. After a successful save the list shows the new values and the per-category summary re-reflects them, both without a manual page reload. |
| Access | The single local user (no authentication). |
| Boundaries | Persistent store (read-modify-write of one row). No clock dependency — `created_at` is preserved, never restamped. The frontend depends on the HTTP API as its data source. |
| Tests | unit: validation boundary values on update (amount 0, negative, non-integer; unknown category; malformed date) each reject and mutate nothing; unknown id maps to not-found; the frontend form seeds every field from the supplied expense, and cancel emits no request. integration: update an existing id → a subsequent list returns exactly the submitted values with `id` and `created_at` unchanged and the row count unchanged; a rejected update leaves the stored row unchanged; an update that moves an amount between categories reconciles in the summary endpoint. smoke: edit a row in the running app against the real store — list and summary both reflect the change without a reload. |
