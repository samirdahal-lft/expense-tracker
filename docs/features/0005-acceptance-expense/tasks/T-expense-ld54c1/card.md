---
approved_by: "Samir dahal"
approved_at: "2026-10-06"
approved_sha256: "8a57069352cf3e55e3ffb2d04e28293a80b91822f9388279e52daafdccd9f54f"
---
## Task T-expense-ld54c1 — TC-05: Cancelling the edit form leaves the expense unchanged
**Parent:** story S-0005.01 · feature 0005 (docs/features/0005-acceptance-expense/)
**Test case:** TC-05 in TEST-CASES.md · Covers S-0002.01 AC-5
**Acceptance criteria:**
- [ ] AC-1 [e2e]: After opening the edit form, changing a value, and dismissing without submitting, the expense list still shows the original values.
- [ ] AC-2 [e2e]: After a page reload following a cancelled edit, the expense still shows its original values.
**Tests:** acceptance
**Done =** Playwright test committed; passes on integration tip; verification report stamped.
