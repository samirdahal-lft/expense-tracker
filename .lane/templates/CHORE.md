---
approved_by: ""
approved_at: ""
---
# Plan <FEAT> — <short title>
> The ONE document of this kind of work: the issue in the words it arrived in, what was
> explored in the code before planning, the plan, and what this work SKIPS. One `lane approve`
> stamp covers all of it — plan and skips together — and this kind's one task is created with
> it. This kind runs no TDD ledger and takes no review stamp: the task is plain commits, and
> `lane done` runs the suite when test_cmd is set. Outgrown one document? Say so when you hand
> the gate over; the human decides at the stamp, and the heavier work starts as its own feature.

**Issue:** <the request as it arrived — a link, a ticket id, or the sentence>
**Explored:** <the files, modules and call paths read before planning — what this plan stands on>
**Behavior:** <what is observably different when this is done — one line per behaviour>
**Must NOT change:** <what stays exactly as it is — empty if nothing is at risk>

## Execution Plan
> Approved BY this document's stamp: `lane start` copies this section verbatim into the
> worktree's exec-plan.md and carries your stamp onto it — no separate plan gate.

**Approach:** <how, at the level of files and changes — NOT prose about process>
**Steps:**
- <change 1 — file, what changes>

## Skipped
> Every ceremony this work does not do, and why. You sign these with the plan.
- product spec: <why the Issue line above is enough>
- technical spec: <why the Behavior line above is enough>
- tests: no ledger on this kind — <what catches a regression instead: the existing suite, or who reads the diff>
- review stamp: none on this kind — <what makes the diff safe to land without a Critic>
