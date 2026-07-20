---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "b8b7c6f50ed10b6bcc65344c13a388921ac3b81bf53fe250dd0ab176c0d0acb8"
---
## Task T-001 — Project scaffold & toolchain
**Parent:** story S-0001.06 · feature 0001-master-mvp (docs/features/0001-master-mvp-*/ — its PRD + TSD)
**Slice:** foundational scaffold — stands up both harnesses so later feature tasks can red-green. No product behavior of its own.
**Acceptance criteria:** (scaffolding task — deliverables, not behavioral ACs)
- [ ] AC-1 [non-functional]: `backend/` holds a runnable FastAPI app skeleton (router→service→repository layering, `app/db.py` SQLite connection bootstrap) with `pytest` installed and collecting.
- [ ] AC-2 [non-functional]: `frontend/` holds a runnable React 18 + Vite + TypeScript app with Tailwind CSS + shadcn/ui + Recharts wired, a typed API-client module stub, and `vitest` runnable.
- [ ] AC-3 [invariant]: `.gitignore` excludes the SQLite DB file, `.env`, `.venv/`, and `node_modules/` (CONSTITUTION hard rule — data/secrets/deps out of git).
**End-to-end AC:** N/A — no user-reachable behavior; enables the tasks that have it.
**Tests:** N/A — scaffolding: stands up the toolchain both runners replay against; a test here asserts the tools, not the product.
**Test scope:** n/a — no ledger; audit trail is the approved plan + stamped verification report.
**Done =** reviewable PR: both apps boot, both runners run, deps ignored by git. Landed first so T-002+ fork from a base carrying the runner. One PR per task.
