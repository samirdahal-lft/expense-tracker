## TSD S-0005.06 — TC-06: Expense retains its original created_at after an edit
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-2 |
| Priority | P2 |
| Automation | playwright |
| Preconditions / Test data | A test expense created by the test; its creation timestamp is captured immediately after creation via the public API (GET /expenses or equivalent). |
| Steps (Given / When / Then) | Given the test expense exists with a known created_at / When the user edits the amount and saves / Then the expense's created_at returned by the API equals the value captured at creation |
| Expected result | The expense's created_at is unchanged after an edit. Observable via the public API response for that expense. |
