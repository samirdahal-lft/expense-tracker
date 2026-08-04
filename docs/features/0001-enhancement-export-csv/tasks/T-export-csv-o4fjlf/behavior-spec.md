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

## B-4: AC-4 [behavior]: Serializing an empty list yields the header row alone — the serializer
- Given: an empty expense list.
- When: the list is serialized to CSV text.
- Then: the result is exactly `date,category,amount,note\r\n` — the header row and nothing else. The serializer does not throw and does not decide whether an export should happen.

## B-5: AC-5 [behavior]: In the app with expenses loaded, activating the export control produces
- Given: the app rendered with the API stubbed to return the two expenses from B-1, the system date fixed to 2026-08-04, and a recording download port injected in place of the real one.
- When: the user activates the export control on the expenses screen.
- Then: the port received exactly one file, named `expenses-2026-08-04.csv`, whose text equals the serializer's output for that list; and a success confirmation naming the export is visible to the user.

## B-6: AC-6 [behavior]: In the app with an empty list, activating the export control produces no
- Given: the app rendered with the API stubbed to return an empty expense list, and a recording download port injected.
- When: the user activates the export control.
- Then: the port received nothing — no file was produced — and the user sees a message stating there is nothing to export, with no success confirmation present anywhere on the screen.

## B-7: AC-7 [behavior]: Activating export twice replaces the status message rather than stacking
- Given: the app rendered with one expense loaded, a recording download port injected, and the export control already activated once so a success message is showing.
- When: the user activates the export control a second time.
- Then: exactly one status message is present (the newest one replaced the previous — messages do not accumulate), and a nothing-to-export message is never shown alongside a success message.

## B-8: AC-10 [e2e]: In the running app (`docker compose up`), the owner clicks Export CSV on the
- Given: the app rendered with one expense loaded and **no** download port injected — the component's real download helper is in force — with only jsdom's absent `URL.createObjectURL`/`URL.revokeObjectURL` stubbed to observe the browser API.
- When: the user activates the export control on the expenses screen.
- Then: the real path ran end to end from the rendered app: a `text/csv` blob carrying the UTF-8 byte-order mark plus the serialized text was turned into an object URL, offered to the browser under the name `expenses-<today>.csv`, and the object URL was released afterwards; the page did not navigate or reload.
- Note: this proves the wiring through the real seam. The genuinely-real download — a file arriving in a browser's downloads and opening in a spreadsheet with four columns and a comma-containing note intact — is the human smoke step for AC-10, recorded in verification.md. jsdom cannot perform a real download.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-8 [invariant]: Export is read-only — no write request is issued, and the rendered — coverage: asserted as a property of B-5 and B-7 (the app-level tests assert the stubbed network saw no POST/PUT/DELETE after export, and that the rendered expense rows and category totals are identical before and after). Structurally guaranteed too: the export path imports nothing from `api/client.ts`.
- AC-9 [non-functional]: The control carries an accessible name stating the action and is — coverage: asserted as a property of B-5 and B-6 — the control is located by accessible role and name (so an unnamed or non-button control fails), and the message is read from a `role="status"` live region, which is what makes it available to assistive technology rather than colour-only. Keyboard reachability follows from it being a real `<button>` in normal tab order (no `tabindex`, no `div` handler).
