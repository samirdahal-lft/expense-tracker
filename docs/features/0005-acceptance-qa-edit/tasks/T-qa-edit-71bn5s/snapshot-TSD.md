## TSD S-0005.01 — TC-01: Change amount and category, list updates without a reload
| Field | Value |
|-------|-------|
| Covers | S-0002.01 AC-6 |
| Priority | P1 |
| Automation | playwright |
| Preconditions / Test data | The test creates its own expense through the public API: amount 500, category Food, date 2026-09-10, note "tc01-lunch". |
| Steps (Given / When / Then) | Given the expense list is open and shows the "tc01-lunch" expense with amount 500 and category Food <br> When the user opens edit on that expense, changes the amount to 750 and the category to Transport, and saves <br> Then the "tc01-lunch" row in the list shows amount 750 and category Transport, and the page was not reloaded |
| Expected result | Right after saving, the row shows 750 and Transport. A marker set on the page before saving is still there afterwards, which proves no reload or navigation happened. |
