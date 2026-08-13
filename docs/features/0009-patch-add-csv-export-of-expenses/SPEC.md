---
approved_by: "Samir dahal"
approved_at: "2026-08-13"
approved_sha256: "c1ebcf6bfe802a80d3807c0eadc6ec691b4da21b527e7d97e667e1b95edff431"
---
# Patch 0009 — Add CSV export of expenses
> A `patch` iteration — the TWO-STAMP ceremony for small, known-scope work (a bug fix, a
> tweak, one behavior, one PR). This ONE document is the ticket + TSD + task card + exec
> plan: your single `lane approve` stamp covers all of it (stamp 1 of 2; stamp 2 is the
> verification report at the end). The TDD ledger, Critic snapshot, and verify replay are
> unchanged — a patch removes redundant signatures, never proof.
> Too big for a patch? More than one story, more than ~3 behaviors, or more than one task
> → use `lane new fix` / `lane new enhancement` instead (agents: CALL THIS OUT when
> drafting; the human decides at the stamp).

**Severity:** minor
**Source:** user request — PRODUCT.md currently lists "no import/export (CSV, bank sync)" as absent; this patch adds CSV export

**Current behavior:** Users can view expenses in the UI but have no way to extract the data into a file. To get expenses into a spreadsheet they must copy rows manually.
**Expected behavior:** An "Export CSV" button appears next to the "Expenses" heading. Clicking it with a non-empty list immediately downloads a file named `expenses-YYYY-MM-DD.csv` (local calendar date) containing `date,category,amount,note` columns in display order (newest first). Clicking with an empty list shows a "nothing to export" message and produces no file. A status line below the button reports the outcome of the last export.
**Must NOT change:** The expense list, summary, add/edit/delete flows, the backend API, and the category set. Export is read-only — it issues no request and changes no expense.

## TSD S-0009.01 — Client-side CSV export

| Aspect | Spec |
|--------|------|
| Interfaces | New `ExportCsvButton` component rendered in `App.tsx` next to the "Expenses" heading, receiving `expenses: Expense[]` from the already-loaded list. Pure helpers in `frontend/src/lib/csv.ts`: `expensesToCsv(expenses): string` (serializer), `csvFileName(now: Date): string` (filename), `downloadCsv(filename, csvText): void` (browser boundary). No new backend endpoint — export is entirely client-side. |
| Data / State | No server state is touched. Local component state holds the last export outcome (`{ kind: "exported"; filename; count }` or `{ kind: "empty" }` or `null`) and is replaced on each click; messages never accumulate. |
| Behavior | Clicking "Export CSV" with expenses present: serializes the loaded list to RFC 4180 CSV (header row `date,category,amount,note`, CRLF-terminated rows, fields quoted where needed), prepends a UTF-8 BOM so spreadsheets read non-ASCII notes correctly, offers a `Blob` download via a temporary object URL, then immediately revokes the URL so repeated exports leak nothing. A status line (ARIA live region) reports `"Exported N expense(s) to expenses-YYYY-MM-DD.csv"`. Clicking with an empty list: produces no file; status line reads "Nothing to export — add an expense first." The status describes the export that happened — it does not update when the underlying list changes after the click. |
| Boundaries | `URL.createObjectURL` / `URL.revokeObjectURL` and `document.createElement("a")` are the browser download boundary. They are not called in tests; tests inject a `downloadCsv` prop instead (`ExportCsvButton` accepts an optional `downloadCsv?: (filename, csvText) => void`). |
| Tests | Unit (Vitest, `frontend/src/lib/csv.test.ts`): serializer row structure, field canonicalization (bare-integer amount, absent note as empty field), RFC 4180 quoting, empty-list header-only output. Integration (Vitest + Testing Library, `frontend/src/features/expenses/ExportCsv.test.tsx`): export from running app (renders `App`, stubs `fetch` and the download boundary, asserts filename + CSV text + status message), empty-list guard, repeated-export status replacement, BOM + MIME type on the real seam. |

## Task T-add-csv-export-of-expenses-h2kssp — Client-side CSV export
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior]: Clicking "Export CSV" with expenses present triggers a download named `expenses-YYYY-MM-DD.csv` using the local calendar date.
- [ ] AC-2 [behavior]: The downloaded file contains a header row (`date,category,amount,note`) followed by one CRLF-terminated row per expense in display order (newest first). Amount is a bare integer; an absent note is an empty field (never `undefined`).
- [ ] AC-3 [invariant]: Fields containing a comma, double quote, CR, or LF are wrapped in double quotes per RFC 4180; embedded double quotes are doubled. Fields that need no quoting are written as-is.
- [ ] AC-4 [behavior]: A status line below the button reports `"Exported N expense(s) to <filename>"` after a successful export. The message describes the export that happened — it does not change when the list is subsequently mutated.
- [ ] AC-5 [behavior]: Clicking "Export CSV" with an empty list produces no file and the status line reads "Nothing to export — add an expense first."
- [ ] AC-6 [invariant]: Export is read-only — clicking the button issues no HTTP request and changes nothing on screen beyond the status line.
- [ ] AC-7 [non-functional]: The downloaded blob carries the MIME type `text/csv` and is prepended with a UTF-8 BOM (bytes `EF BB BF`) so spreadsheets read non-ASCII notes correctly. The object URL is revoked immediately after the download is triggered so repeated exports do not leak memory.
- [ ] AC-8 [non-functional]: The control is a native `<button>` (no `tabindex` juggling), keyboard-reachable, and the status line is an ARIA live region (`role="status"`) so the outcome is announced without requiring the user to shift focus.
**Tests:** AC-1, AC-2, AC-3 (unit serializer); AC-1, AC-2, AC-4, AC-6 (integration B-4); AC-5 (integration B-5); AC-7 (integration B-7); AC-8 (integration guard)

## Execution Plan
> Approved BY the spec stamp: `lane start` copies this section verbatim into the worktree's
> exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last in this file.

**Approach:** Pure client-side serialization — no backend changes. Add a `csv.ts` helper module (serializer, filename builder, download boundary), wire an `ExportCsvButton` component that consumes the already-loaded `expenses` prop from `App.tsx`, and confirm behavior through unit tests on the serializer and integration tests on the running app.
**Boundaries & mocks:** `URL.createObjectURL` / `URL.revokeObjectURL` and the anchor `.click()` are stubbed in integration tests via `vi.stubGlobal` on `URL` and `vi.spyOn(HTMLAnchorElement.prototype, "click")`. The `downloadCsv` prop is injectable so unit tests on `ExportCsvButton` bypass the browser boundary entirely. Backend `fetch` is stubbed per the project convention (`vi.stubGlobal("fetch", ...)`).
**Behaviors (TDD order):**
- B-1: `expensesToCsv` emits the header row then one CRLF-terminated row per expense in given order, with amount as a bare integer and an absent note as an empty field.
- B-2: `expensesToCsv` quotes any field containing a comma, double quote, CR, or LF per RFC 4180; unquoted fields stay as-is.
- B-3: Clicking "Export CSV" in the running app with a non-empty list offers a file named for today and shows the success status message; clicking with an empty list produces no file and shows the "nothing to export" message.
**Open questions:** none
