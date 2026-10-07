---
approved_by: ""
approved_at: ""
---
# Test Cases 0005 — <title>
> One `## TSD S-0005.nn — TC-nn` section per test case, each with its OWN story id
> (S-0005.01, S-0005.02, … — never repeated; `lane approve` refuses a shared id). Each
> section becomes ONE task, and the Critic reviews the test against that section, frozen at
> `lane start`. The `0005` prefix resolves this folder. Black-box only: every expected result is
> observable through the UI or the public API — never through the code's internals.

## TSD S-0005.01 — TC-01: <title>
| Field | Value |
|-------|-------|
| Covers | <source story + AC, e.g. S-0003.01 AC-2> |
| Priority | <P1 / P2 / P3> |
| Automation | <playwright / manual> |
| Preconditions / Test data | <state the test sets up for itself> |
| Steps (Given / When / Then) | <Given … / When … / Then …> |
| Expected result | <observable through the UI or API only> |
