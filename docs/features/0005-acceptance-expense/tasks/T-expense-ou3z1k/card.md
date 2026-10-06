---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "9be8b0c3654fba22ecae2dceed956e7c39a74ef6b5662e62fce64984fac182cf"
---
## Task T-expense-ou3z1k — TC-08: Invalid category is rejected
**Parent:** story S-0005.01 · feature 0005 (docs/features/0005-acceptance-expense/)
**Test case:** TC-08 in TEST-CASES.md · Covers S-0002.01 AC-4
**Acceptance criteria:**
- [ ] AC-1 [e2e]: Submitting the edit form with a category not in the fixed set (Food / Transport / Bills / Other) is rejected with an error message; the expense's category is unchanged.
- [ ] AC-2 [invariant]: A direct API PATCH with an invalid category value returns a 4xx status.
**Tests:** acceptance
**Done =** Playwright test committed; passes on integration tip; verification report stamped.
