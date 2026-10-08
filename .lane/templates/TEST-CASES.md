---
approved_by: ""
approved_at: ""
---
# Test Cases <FEAT> — <title>
> One `## TSD S-<FEAT>.nn — TC-nn` section per test case, each with its OWN story id
> (S-<FEAT>.01, S-<FEAT>.02, … — never repeated; `lane approve` refuses a shared id). Each
> section becomes ONE task, and the Critic reviews the test against that section, frozen at
> `lane start`. The `<FEAT>` prefix resolves this folder. Black-box only: every expected result is
> observable through the UI or the public API — never through the code's internals.

## TSD S-<FEAT>.01 — TC-01: <title>
| Field | Value |
|-------|-------|
| Covers | <source story + AC, e.g. S-0003.01 AC-2> |
| Priority | <P1 / P2 / P3> |
| Automation | <playwright / manual> |
| Preconditions / Test data | <state the test sets up for itself> |
| Steps (Given / When / Then) | <Given … / When … / Then … — each clause becomes one step of the exploration storyboard> |
| Expected result | <observable through the UI or API only> |
