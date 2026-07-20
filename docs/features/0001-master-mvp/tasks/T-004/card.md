---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "48806e87af968b4acc50ccb16338d048e624122623cf8a0749f43291484afd24"
---
## Task T-004 — Delete an expense
**Parent:** story S-0001.03 · feature 0001-master-mvp (docs/features/0001-master-mvp-*/ — its PRD + TSD)
**Slice:** full vertical delete path — delete endpoint through to a per-row delete control that updates the running app.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`)
- [ ] AC-1 [behavior]: Deleting an existing expense by id removes it; a subsequent list no longer includes it.
- [ ] AC-2 [invariant]: Deleting an unknown id is reported as not-found and changes nothing.
- [ ] AC-3 [e2e]: Through the running app, a per-row delete control removes the expense from the list without a manual page reload.
**End-to-end AC:** AC-3 [e2e] — reachable through the running app.
**Tests:** AC-1, AC-2, AC-3  ← ordered; AC-1 = tracer bullet (delete removes the row)
**Test scope:** backend/tests/ (delete existing + unknown-id not-found) · frontend `*.test.tsx` (row delete updates list)
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
