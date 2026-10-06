---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "a319193cc3b32901e16f72e701923582069d19240ed980e608c03329de39c692"
---
## Task T-expense-8ky00d — TC-09: Invalid date format is rejected
**Parent:** story S-0005.01 · feature 0005 (docs/features/0005-acceptance-expense/)
**Test case:** TC-09 in TEST-CASES.md · Covers S-0002.01 AC-4
**Acceptance criteria:**
- [ ] AC-1 [e2e]: Submitting the edit form with date="not-a-date" is rejected with an error message; the expense's date is unchanged.
- [ ] AC-2 [e2e]: Submitting with an out-of-range date (e.g. month=13 or month=0) is rejected; the expense's date is unchanged.
- [ ] AC-3 [invariant]: A direct API PATCH with a non-YYYY-MM-DD or non-calendar date returns a 4xx status.
**Tests:** acceptance
**Done =** Playwright test committed; passes on integration tip; verification report stamped.
