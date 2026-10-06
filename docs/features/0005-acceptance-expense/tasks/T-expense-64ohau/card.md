---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "75fa219fd48a53a0c37621ead5e7a6283a89158428dc3ba5c2529d8c8e9ddba3"
---
## Task T-expense-64ohau — TC-03: Saving valid changes persists them and survives a page reload
**Parent:** story S-0005.01 · feature 0005 (docs/features/0005-acceptance-expense/)
**Test case:** TC-03 in TEST-CASES.md · Covers S-0002.01 AC-2
**Acceptance criteria:**
- [ ] AC-1 [e2e]: After saving a valid edit (changed amount and category), the updated values appear in the expense list immediately.
- [ ] AC-2 [e2e]: After a full page reload, the same expense still shows the updated values.
- [ ] AC-3 [invariant]: Fields the user did not touch (note, date) retain their original values after the save.
**Tests:** acceptance
**Done =** Playwright test committed; passes on integration tip; verification report stamped.
