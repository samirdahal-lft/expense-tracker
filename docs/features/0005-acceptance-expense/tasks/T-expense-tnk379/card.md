---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "d9f25c5e7aaa970323ee5d13e2c3fcc97d8c2301440582728a1a394d2425a9d5"
---
## Task T-expense-tnk379 — TC-14: Feb 29 on a non-leap year is rejected
**Parent:** story S-0005.01 · feature 0005 (docs/features/0005-acceptance-expense/)
**Test case:** TC-14 in TEST-CASES.md · Covers S-0002.01 AC-4 (boundary)
**Acceptance criteria:**
- [ ] AC-1 [e2e]: Submitting the edit form with date 2025-02-29 is rejected as an invalid calendar date, and the expense's date is unchanged.
- [ ] AC-2 [invariant]: A direct API PATCH with date 2025-02-29 returns a 4xx status.
**Tests:** acceptance
**Done =** Playwright test committed; passes on integration tip; verification report stamped.
