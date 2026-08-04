# Behavior Spec — T-export-csv-o4fjlf: Export expenses to CSV from the expenses screen
> Source: task card ACs + docs/features/0001-enhancement-export-csv/tasks/T-export-csv-o4fjlf/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

> **Renumbering note (honest ledger accounting).** The exec plan listed eight behaviors
> B-1..B-8. AC-4 (empty list → header row only) turned out to be already satisfied by B-1's
> minimal implementation — mapping over an empty array cannot do otherwise — so `lane red`
> correctly refused it as a RED and it was committed **off-ledger** with `lane red --backfill`.
> It therefore consumes no RED→GREEN cycle. The remaining app-level behaviors shift down one:
> plan B-5→B-4, B-6→B-5, B-7→B-6, B-8→B-7. The AC coverage is unchanged.
>
> **Correction (written after the work finished).** This note first estimated 7 ledger cycles. The
> real count is 4 test-first cycles for the planned work (`planned_behaviors: 4`) plus 2
> review-driven cycles (B-5, B-6 below) — plan B-5..B-8 collapsed the same way AC-4 did, because
> B-4's GREEN already contained them. See the Off-ledger section for the honest tally and cause.

## B-1 (tracer bullet): AC-1 [behavior]: Serializing a list of expenses yields CSV text with the header row
- Given: two expenses in display order (newest first) — `{id:2, amount:2500, category:"Transport", date:"2026-07-02", note:"taxi"}` then `{id:1, amount:1000, category:"Food", date:"2026-07-01", note:"lunch"}`.
- When: the list is serialized to CSV text.
- Then: the text is exactly `date,category,amount,note\r\n2026-07-02,Transport,2500,taxi\r\n2026-07-01,Food,1000,lunch\r\n` — header first, one row per expense in the order given, three CRLF-terminated lines including the last.

## B-2: AC-2 [behavior]: Each field is canonical — date as `YYYY-MM-DD`, category verbatim, amount
- Given: one expense with `amount: 2500`, `category: "Bills"`, `date: "2026-07-03"` and **no** note, and a second with `amount: 7`, `note: ""`.
- When: the list is serialized to CSV text.
- Then: the first data row is `2026-07-03,Bills,2500,` — the amount appears as the bare integer `2500` (not `Rs 2,500`, not `2500.0`, not `2,500`), the date verbatim as `YYYY-MM-DD`, the category verbatim, and the absent note as an empty final field (never the text `undefined` or `null`); the second row ends `,7,` likewise.

## B-3: AC-3 [behavior]: A note containing a comma, a double quote, or a line break is wrapped in
- Given: three expenses whose notes are, respectively, `lunch, with tea` (comma), `he said "hi"` (double quote), and `line one\nline two` (line break).
- When: the list is serialized to CSV text.
- Then: each of those note fields is wrapped in double quotes with embedded quotes doubled — `"lunch, with tea"`, `"he said ""hi"""`, `"line one\nline two"` — while the date, category and amount fields of the same rows stay unquoted; splitting the text on row terminators outside quotes still yields four columns per row, and each note parses back byte-identical to what was given.

## B-4 (plan B-5): AC-5 [behavior]: In the app with expenses loaded, activating the export control produces
- Given: the app rendered with the API stubbed to return the two expenses from B-1, the system date fixed to 2026-08-04, and a recording download port injected in place of the real one.
- When: the user activates the export control on the expenses screen.
- Then: the port received exactly one file, named `expenses-2026-08-04.csv`, whose text equals the serializer's output for that list; and a success confirmation naming the export is visible to the user.

## B-5 (review-driven, Critic flag 1): AC-5 [behavior] — the status message stays faithful to the export that produced it
- Given: the app rendered with two expenses loaded and an export already performed, so the success message names two expenses; then the user deletes one row, so the loaded list shrinks to one while the old success message is still on screen.
- When: the rendered status message is read after the list has changed.
- Then: it still describes the export that actually happened (two expenses) — it does not silently rewrite itself to describe a state no export produced. A status message reports a past action, so it is captured at export time, not recomputed from live data.

## B-6 (review-driven, Critic flag 4): AC-3 [behavior] — the quoting rule applies to every field, not just the note
- Given: an expense whose category and date are values carrying a comma and a double quote (data the serializer must not trust to be comma-free just because today's UI cannot produce it).
- When: the list is serialized to CSV text.
- Then: each such field is quoted per RFC 4180 exactly as a note would be, so the row keeps its four columns; a field needing no quoting is still left unquoted.

## Off-ledger (back-filled, no RED→GREEN cycle)
> Final tally: **4 test-first cycles** (B-1..B-4, `planned_behaviors: 4`) and **4 back-filled
> behaviors** below. Cause, stated plainly: B-4 was the first behavior needing the whole vertical
> (control + status region + download helper), and the smallest implementation that turned B-4
> green already contained the empty-list branch, the single-status-message state, and the blob
> details. Everything after it therefore passed on arrival and `lane red` rightly refused to
> record a RED. A stricter B-4 could have exported unconditionally and left the empty branch to
> its own cycle — worth doing next time a UI behavior lands.
- AC-4 [behavior] (plan B-4): serializing an empty list yields the header row alone. Already true
  from B-1's implementation, so it could not fail first; its test
  (`frontend/src/lib/csv.test.ts`, "B-4: expensesToCsv on an empty list") is committed via
  `lane red --backfill` — audited, but counted apart from the test-first proof.
- AC-6 [behavior] (spec B-5): empty list → no file, nothing-to-export message. Built as part of
  B-4's GREEN; test back-filled (`ExportCsv.test.tsx`, "B-5: exporting with nothing recorded").
- AC-7 [behavior] (spec B-6): repeat activation replaces the status message. Structural in the
  single `Status` state introduced by B-4's GREEN; test back-filled ("B-6: repeated exports").
- AC-10 wiring [e2e] (spec B-7): `text/csv` blob with a UTF-8 BOM, object URL revoked. Built in
  `downloadCsv` during B-4's GREEN; test back-filled ("B-7: the real download seam"). The human
  smoke step for AC-10 is unchanged and still outstanding.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-8 [invariant]: Export is read-only — no write request is issued, and the rendered — coverage: asserted as a property of B-4 and B-6 (the app-level tests assert the stubbed network saw no POST/PUT/DELETE after export, and that the rendered expense rows and category totals are identical before and after). Structurally guaranteed too: the export path imports nothing from `api/client.ts`.
- AC-9 [non-functional]: The control carries an accessible name stating the action and is — coverage: asserted as a property of B-4 and B-5 — the control is located by accessible role and name (so an unnamed or non-button control fails), and the message is read from a `role="status"` live region, which is what makes it available to assistive technology rather than colour-only. Keyboard reachability follows from it being a real `<button>` in normal tab order (no `tabindex`, no `div` handler).
