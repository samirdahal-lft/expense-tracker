---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "7c99ff92bf5d19715022ff7f746ca751dfb3cd9c3b017e828c21a4ecfb68a531"
---
## Task T-expense-vules8 — TC-07: Invalid amount types rejected with a message (UI and API)
**Parent:** story S-0005.01 · feature 0005 (docs/features/0005-acceptance-expense/)
**Test case:** TC-07 in TEST-CASES.md · Covers S-0002.01 AC-3
**Acceptance criteria:**
- [ ] AC-1 [e2e]: Submitting the edit form with amount=0 shows a rejection message naming the problem; the stored expense is unchanged.
- [ ] AC-2 [e2e]: Submitting with a negative amount (e.g. -50) shows a rejection message; the stored expense is unchanged.
- [ ] AC-3 [e2e]: Submitting with a fractional amount (e.g. 12.50) shows a rejection message; the stored expense is unchanged.
- [ ] AC-4 [e2e]: Submitting with a non-numeric amount (e.g. "abc") shows a rejection message; the stored expense is unchanged.
- [ ] AC-5 [invariant]: A direct API PATCH with each of the above invalid amounts returns a 4xx status (rejection is not UI-only).
**Tests:** acceptance
**Done =** Playwright test committed; passes on integration tip; verification report stamped.
