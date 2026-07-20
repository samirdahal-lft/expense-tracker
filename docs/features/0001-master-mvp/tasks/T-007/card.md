---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "ab3de6e802394e3c3171b4447606bb93ecf0a50c12973699c4d58fd1c31591ea"
---
## Task T-007 — One-command Dockerized run
**Parent:** story S-0001.06 · feature 0001-master-mvp (docs/features/0001-master-mvp-*/ — its PRD + TSD)
**Slice:** deployment integration — compose brings up frontend + backend + SQLite; data persists on a named volume across restarts.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`)
- [ ] AC-1 [e2e]: `docker compose up` from a clean state starts frontend + backend and the app is reachable in a browser; a user can add, list, and delete expenses end-to-end.
- [ ] AC-2 [invariant]: The SQLite DB file lives on a named volume — data recorded before `docker compose down` is present after a subsequent `up`; the DB file is never baked into an image or committed to git.
**End-to-end AC:** AC-1 [e2e] — reachable through the running compose stack.
**Tests:** N/A — integration: the acceptance check is a docker-compose smoke (up → add expense → down → up → confirm persistence) requiring a Docker daemon and full container lifecycle; it is not a hermetic pytest/vitest unit that could replay in a fresh worktree. Smoke procedure documented in the exec-plan; human verifies at review.
**Test scope:** n/a — no ledger; audit trail is the approved plan + stamped verification report + the recorded smoke run.
**Done =** reviewable PR: `docker compose up` runs the whole stack, volume-backed data persists across restarts. One PR per task (default).
