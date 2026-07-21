---
approved_by: "samir dahal"
approved_at: "2026-07-21"
approved_sha256: "92c61b9ebb1128444610dc43b6cc59754b87fd47224706f3d015abce2ece22d6"
---
## Verification — Task T-004 — 2026-07-21
> Critic anchored to TSD snapshot (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.
> Review method: fresh-context Critic subagent given ONLY snapshot-TSD, card, behavior-spec, exec-plan, CONSTITUTION, BLUEPRINT + `git diff master...HEAD`. Full suite GREEN via lane runner (backend 11, frontend 6). Verdict: **nothing blocking.**

✅ **Conformant:** items matching spec
- AC-1 (B-1): `DELETE /api/expenses/{id}` for an existing id → 204 no-content; subsequent list omits it. Real DB round-trip (temp SQLite via `EXPENSE_DB_PATH`).
- AC-2 (B-2): unknown id → 404, store unchanged. Not-found decided on rows actually affected — repo returns `rowcount`, service returns `rowcount > 0`, router raises `HTTPException(404)` on false. Not a blind status.
- AC-3 (B-3): per-row delete control removes the row in the running app without a reload (App→ExpenseList→onDelete→`deleteExpense`→`fetch`→`useExpenses` reload); frontend test stubs only the network boundary.
- Layering: HTTP translation in router, domain result (bool "row removed") in service, SQL only in repository (parameterized `WHERE id = ?`; `expense_id: int` path param → non-int paths rejected, no injection surface).
- Typed client handles 204 correctly (`apiFetch` returns undefined, no `.json()`); per-row delete button is accessible (`aria-label="Delete {category} expense of {amount}"`).
- Hermeticity: backend per-test temp DB; frontend deterministic stateful stub with cleanup.

⚠️ **Divergent:** deviation + severity (shallow/deep)
- (not a defect — dismissed) The Critic reported pytest failing to collect due to FastAPI 0.115.6 vs pinned 0.111.0. This was the subagent invoking **system `pytest`**, not the runner. LANE's runner uses `.venv/bin/pytest`; confirmed the venv has fastapi 0.111.0 and all 11 backend tests pass. `lane review`/`lane green` ran the suite GREEN via the runner. No action.
- (minor, info) B-3 seeds a single expense, proving "row gone" via the empty-state. Adequate for the AC; a two-row case would be marginally stronger. Not required.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- None. No edit/bulk-delete/cascade/filtering/summary code crept in. The TSD's mention of the summary "re-reflecting" a delete is intentionally out of scope for T-004 (card AC-3 + B-3 scope the e2e to the list); the summary/donut is T-005.

❌ **Missing:** acceptance criteria not addressed
- None. AC-1/AC-2/AC-3 all implemented and green through their intended interfaces.

**TDD cycle log:**
| Behavior | RED | GREEN | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|-----|-------|--------------------------|-----------------------|-----------------------|
| B-1: delete existing → 204, gone | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ (real temp DB) |
| B-2: unknown id → 404, unchanged | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ (real temp DB) |
| B-3: per-row delete in app, no reload | ✅ | ✅ | ✅ | ✅ (App) | ✅ (only `fetch` stubbed) |

**Critic checklist:**
- [x] Mocks only at boundaries — backend real temp DB; frontend stubs only `fetch`
- [x] Each AC verified per its tag — behavior→HTTP/App; invariant (AC-2)→affected-rows decision
- [x] Boundary contract asserted richly — 204 + list-omits + 404 + count-unchanged, not bare status
- [x] ≥1 `e2e` AC present and GREEN — AC-3 through the running `App`
- [x] Boundaries non-empty ⇒ smoke AC — n/a here (unit/integration satisfy; containerized real-boundary smoke is T-007)

**Human verdict:** each item confirmed/dismissed — the `lane approve T-004` stamp records who signed.
**Outcome:** clean → land. T-005 (summary) remains the last feature slice before T-006 (theming) and T-007 (docker).
