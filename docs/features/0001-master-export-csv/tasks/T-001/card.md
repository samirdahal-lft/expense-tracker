---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "6a041cbe3c5f0f0236fd898a9fca53e5fd26e6b22b32d5d42801e76522f4649d"
---
## Task T-001 — Export expenses to CSV (button + endpoint)
**Parent:** story S-0001.01 · feature 0001-master-export-csv (docs/features/0001-master-export-csv/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: Requesting the export with at least one stored expense returns a CSV document with exactly one row per stored expense (columns id, amount, category, date, note, created_at), amount as a whole integer, date as YYYY-MM-DD.
- [ ] AC-2 [behavior]: Requesting the export with zero stored expenses returns a failure response distinguishable from the success case (no CSV body).
- [ ] AC-3 [e2e]: On the running app, clicking "Export CSV" with at least one expense downloads a `.csv` file and shows an on-screen success message.
- [ ] AC-4 [e2e]: On the running app, clicking "Export CSV" with zero expenses downloads no file and shows an on-screen failure message.
**End-to-end AC:** AC-3, AC-4 [e2e] — reachable through the running app (required: green component/unit ≠ reachable)
**Tests:** AC-1, AC-2, AC-3, AC-4  ← ordered; first = tracer bullet
<!-- exception: Tests: N/A — reason: config | scaffolding | spike | refactor | tooling | integration -->
**Test scope:** tests/T-001/   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
<!-- approval: written by `lane approve` as frontmatter (approved_by/at/sha256) after a human confirms — never hand-edit -->
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
