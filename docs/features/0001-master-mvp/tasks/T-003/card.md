---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "299043c3a244c7ad7d2aa3cb3bfe02bfbbe17bea9d7e06029ac54faa32d1bd38"
---
## Task T-003 — Add an expense
**Parent:** story S-0001.01 · feature 0001-master-mvp (docs/features/0001-master-mvp-*/ — its PRD + TSD)
**Slice:** full vertical write path — create endpoint with validation through to an add form that reflects the new expense live.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`)
- [ ] AC-1 [behavior]: Submitting amount + category (from the fixed set) + date, with an optional note, creates an expense and returns it with a server-assigned id.
- [ ] AC-2 [invariant]: A non-positive or non-integer amount, or a category outside the fixed set, is rejected with a validation error and nothing is created.
- [ ] AC-3 [invariant]: The stored and returned amount is a positive integer number of whole NPR.
- [ ] AC-4 [e2e]: Through the running app, filling and submitting the add-expense form makes the new expense appear in the list without a manual page reload.
**End-to-end AC:** AC-4 [e2e] — reachable through the running app.
**Tests:** AC-1, AC-2, AC-3, AC-4  ← ordered; AC-1 = tracer bullet (valid create round-trips)
**Test scope:** backend/tests/ (create + validation boundaries) · frontend `*.test.tsx` (form submit → list append)
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
