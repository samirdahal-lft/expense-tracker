---
approved_by: "Samir dahal"
approved_at: "2026-08-03"
approved_sha256: "02429c888af382e2d3dbe959265ebac774a26627829a62906b0dd4fb711059ea"
---
## Task T-export-csv-o4fjlf — Export expenses to CSV from the expenses screen
**Parent:** story S-0001.01 · feature 0001-enhancement-export-csv (docs/features/0001-enhancement-export-csv/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)

The whole story in one PR: the pure CSV serializer, the export action that decides
nothing-to-export vs. produce-a-file, and the control + status message on the expenses screen.
Frontend only — no backend change, no new endpoint (see the TSD's grounding decision).

**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: Serializing a list of expenses yields CSV text with the header row
      `date,category,amount,note` followed by exactly one row per expense in the order given;
      rows are terminated by CRLF, including the last.
- [ ] AC-2 [behavior]: Each field is canonical — date as `YYYY-MM-DD`, category verbatim, amount
      as a bare base-10 integer (`2500`, never `Rs 2,500` or `2500.0`), and an absent note as an
      empty field (never `undefined`/`null`).
- [ ] AC-3 [behavior]: A note containing a comma, a double quote, or a line break is wrapped in
      double quotes with embedded quotes doubled; a field needing no quoting stays unquoted. The
      row keeps its four columns and the note round-trips byte-identically.
- [ ] AC-4 [behavior]: Serializing an empty list yields the header row alone — the serializer
      never decides whether an export should happen.
- [ ] AC-5 [behavior]: In the app with expenses loaded, activating the export control produces
      exactly one file named `expenses-<today>.csv` whose content is the serialized text, and a
      success confirmation appears.
- [ ] AC-6 [behavior]: In the app with an empty list, activating the export control produces no
      file and shows a nothing-to-export message, with no success confirmation.
- [ ] AC-7 [behavior]: Activating export twice replaces the status message rather than stacking
      messages, and the two messages are never shown together.
- [ ] AC-8 [invariant]: Export is read-only — no write request is issued, and the rendered
      expense list and category summary are unchanged afterwards.
- [ ] AC-9 [non-functional]: The control carries an accessible name stating the action and is
      reachable in normal keyboard tab order; the status message is exposed to assistive
      technology as a status update, not by colour alone.
- [ ] AC-10 [e2e]: In the running app (`docker compose up`), the owner clicks Export CSV on the
      expenses screen and a real `expenses-<today>.csv` file arrives in the browser downloads and
      opens in a spreadsheet with four columns, a comma-containing note intact in one cell, and
      the amount as a plain number; with no expenses recorded, the message appears and nothing
      downloads. Manual — jsdom cannot perform a real download; recorded in the verification report.

**End-to-end AC:** AC-10 [e2e] — reachable through the running app (required: green component/unit ≠ reachable)
**Tests:** AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9  ← ordered; first = tracer bullet
<!-- exception: Tests: N/A — reason: config | scaffolding | spike | refactor | tooling | integration -->
**Test scope:** `frontend/src/lib/csv.test.ts` (serializer) + `frontend/src/features/expenses/ExportCsv.test.tsx` (app-level)   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
