---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "847661a7c27bd1cf851b6ae81a24746eeae634f2c298785400882662d245cad7"
---
## Task T-002 — List expenses
**Parent:** story S-0001.02 · feature 0001-master-mvp (docs/features/0001-master-mvp-*/ — its PRD + TSD)
**Slice:** full vertical read path — list endpoint through to a rendered, state-aware list in the running app.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`)
- [ ] AC-1 [behavior]: The list endpoint returns all expenses, most recent first, each with id, amount (whole NPR), category, date, note.
- [ ] AC-2 [behavior]: With no expenses recorded, the endpoint returns an empty collection with a success status (not an error).
- [ ] AC-3 [non-functional]: While the list request is in flight the UI shows a loading state; when the collection is empty it shows a deliberate empty state (not a blank screen).
- [ ] AC-4 [e2e]: Through the running app, recorded expenses render as a readable list showing amount (as NPR), category, date, and note.
**End-to-end AC:** AC-4 [e2e] — reachable through the running app.
**Tests:** AC-1, AC-2, AC-3, AC-4  ← ordered; AC-1 = tracer bullet (endpoint returns ordered collection)
**Test scope:** backend/tests/ (list ordering, empty-collection) · frontend `*.test.tsx` (loading/empty/populated rendering)
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
