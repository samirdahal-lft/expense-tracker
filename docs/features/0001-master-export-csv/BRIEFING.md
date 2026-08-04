---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "6c1b71e8fa5c72da6e1c22916ee7f0eb4139333f803a6bfd4d70cd3c8001fba9"
---
# Briefing 0001 — Export expenses to CSV

> Scratch pad — flesh the idea out before committing to a PRD.
> ★ Gate: stakeholder (PM / SA / client) approves before any PRD work begins.
> Approve by running `lane approve` — lane writes the stamp after your y/N confirm.
> Do NOT edit the frontmatter fields by hand; a hand-typed stamp does not count.

## Why
The tracker currently has no way to get expense data out of the app — expenses only
ever live inside the SQLite store and the in-app list/summary view. Users who want to
back up their data, reconcile it against a bank statement, or analyze it in a
spreadsheet have no path to do so today (confirmed: no export endpoint anywhere in
`backend/app/routers/`). A one-click CSV export is the smallest way to close that gap.

## Hypothesis
Add an "Export CSV" button to the expense list view. Clicking it asks the backend for
all current expenses and downloads them as a CSV file. If there are no expenses to
export, the user sees a failure/error message instead of a downloaded file. If the
export succeeds, the user sees a success message confirming the download.

## Mocks / references
- No visual mock provided — a single button aft-prdnear the expense list (e.g. next to the
  "Expenses" heading in `frontend/src/App.tsx`) that triggers the download and shows a
  transient status message (success or failure).

## Scope hints
**Probably in:**
- A backend endpoint that serializes all expenses to CSV (columns: id, amount,
  category, date, note, created_at — mirroring `ExpenseOut`).
- A frontend "Export CSV" button that calls it and triggers a file download in the
  browser.
- Empty-state handling: zero expenses → a failure/error message, no file downloaded.
- Non-empty state: successful download → a success message.

**Probably out:**
- Filtering/date-range export (export is always "all expenses" for v1).
- Export formats other than CSV (e.g. PDF, Excel).
- Import/round-trip (re-uploading a CSV to restore data).
- Any auth/permission check on the export (the app has none today — see PRODUCT.md).

## Open questions
- What exact CSV column order/header names, and what date/number formatting (e.g. does
  `amount` stay a raw integer, does `date` stay `YYYY-MM-DD`)?
- What counts as "no expenses" for the failure path — always the full table being
  empty, or could this also mean a future filtered/empty result set?
- Where and how long should the success/failure message be shown (toast, inline banner,
  auto-dismiss timing)?
- What should the downloaded filename be (static `expenses.csv`, or timestamped)?

## Approval
Run `lane approve` — lane stamps the frontmatter (name, date, content hash) after you confirm.
Editing this file after approval invalidates the stamp and reopens the gate.

## Approval
Run `lane approve` — lane stamps the frontmatter (name, date, content hash) after you confirm.
Editing this file after approval invalidates the stamp and reopens the gate.
