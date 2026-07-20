---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "83efaba6e9c285730e4c1a6cf2a6e84caac37d9a91b1b53a737e1b6fcd187a2b"
---
## Task T-005 — Per-category summary
**Parent:** story S-0001.04 · feature 0001-master-mvp (docs/features/0001-master-mvp-*/ — its PRD + TSD)
**Slice:** full vertical summary path — aggregation endpoint through to a donut chart with per-category totals in the running app.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`)
- [ ] AC-1 [behavior]: The summary endpoint returns total spend and a per-category total (in whole NPR) over all expenses, with every category in the fixed set present (zero when it has no expenses).
- [ ] AC-2 [invariant]: Per-category totals sum exactly to the reported grand total; an empty store yields an all-zero summary.
- [ ] AC-3 [e2e]: Through the running app, the summary renders as a donut chart with per-category totals alongside, reflecting adds/deletes without a manual reload.
- [ ] AC-4 [non-functional]: With no expenses, the summary shows a deliberate empty state rather than a broken/empty chart.
**End-to-end AC:** AC-3 [e2e] — reachable through the running app.
**Tests:** AC-1, AC-2, AC-4, AC-3  ← ordered; AC-1 = tracer bullet (aggregation returns all categories)
**Test scope:** backend/tests/ (aggregation math, reconciliation, empty store) · frontend `*.test.tsx` (donut + totals + empty state)
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
