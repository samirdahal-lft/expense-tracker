---
approved_by: "Samir dahal"
approved_at: "2026-08-03"
approved_sha256: "c95179b3d490d5abaecae75cb7a6aa28fb5ed9102298923d9812d8463e1d651e"
---
# Mini PRD 0001 — Export expenses to CSV
> An `enhancement` iteration (LANE §8) — a small, scoped improvement on top of what already
> ships. Lighter than a full feature PRD: usually one story, no full success-metrics apparatus.
> Paired with TSD.md in this folder. If it grows past a couple of stories, it's a `feature` —
> create one instead.

**Parent:** none — this builds on the shipped expense tracker described in `docs/context/PRODUCT.md`
**Source:** real-usage feedback   ← why this exists (audit chain, §4; trace ↑ to docs/ROADMAP.md)

---

## Story S-0001.01 — Export expenses to CSV

As the owner of my expense tracker I want to export my recorded expenses as a CSV file so that I
can open my spending in a spreadsheet and keep a copy outside the app.

**Scope note:** export is read-only and covers **all** expenses the app currently shows — there
is no filtering, date range, or column selection (consistent with `docs/context/PRODUCT.md`:
the list is always every expense, the summary always all-time).

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — With at least one expense recorded, activating **Export CSV** produces a
      CSV file download containing a header row followed by exactly one row per expense the app
      is showing, in the same order the list shows them (most recent first).
- [ ] AC-2 [behavior] — Each row carries the expense's date, category, amount, and note. The
      amount is a plain integer number of whole NPR — no `Rs` prefix and no thousands separator
      (`2500`, never `Rs 2,500`) — and the date is `YYYY-MM-DD`. An expense with no note yields
      an empty note field, not the text `undefined` or `null`.
- [ ] AC-3 [behavior] — A note containing a comma, a double quote, or a line break does not
      corrupt the file: the field is quoted and embedded quotes escaped, so a spreadsheet reads
      back exactly the note the user typed and the row keeps its column count.
- [ ] AC-4 [behavior] — With zero expenses recorded, no file is produced and the user is told
      there is **nothing to export**.
- [ ] AC-5 [behavior] — After a file is produced, the user sees a confirmation that the export
      succeeded. The confirmation appears only when a file was actually produced (never
      alongside the nothing-to-export message).
- [ ] AC-6 [invariant] — Exporting changes nothing: no expense is created, edited, or deleted,
      and the list and summary the user is looking at are unchanged afterwards.
- [ ] AC-7 [e2e] — In the running app, the owner can find the export control on the expenses
      screen without leaving the page, trigger it, and receive a `.csv` file whose name
      identifies it as this app's expenses (e.g. `expenses-<YYYY-MM-DD>.csv`).
- [ ] AC-8 [non-functional] — The export control is keyboard-reachable and carries an accessible
      name, and the nothing-to-export and success messages are announced to assistive technology
      rather than conveyed by colour alone (`docs/context/CONSTITUTION.md` convention 8).

**Success metric:** the owner can export their expenses and open the file in a spreadsheet with
every amount, date, category, and note intact — including notes containing commas — and is never
left guessing whether the export worked.

## Out of scope (this enhancement)

- Filtering, date ranges, or choosing which columns/categories to export.
- Any format other than CSV (no XLSX, PDF, or JSON export).
- Importing CSV back into the app.
- Exporting the category summary as its own file — only the expense rows.
- Scheduled, emailed, or server-stored exports.
