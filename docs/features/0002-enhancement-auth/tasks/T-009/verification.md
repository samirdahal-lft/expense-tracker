---
approved_by: "Samir dahal"
approved_at: "2026-07-24"
approved_sha256: "0825e99ca0777d53ed820eb7b6024aadc4490e701426472e89ac3b4cd53b7fc3"
---
## Verification — Task T-009 — 2026-07-24
> Critic anchored to TSD (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.
> Reviewed by an independent Critic subagent given ONLY snapshot-TSD.md + AMENDMENTS.md A-0002-02 + the diff (git diff auth...HEAD), not the build reasoning. Path R (security + blast-radius + amendment).

✅ **Conformant:** items matching spec
- AC-1 [behavior] — `POST /api/auth/login` (valid creds) → 200, establishes session (httpOnly+SameSite) + readable CSRF cookie, returns the account (no hash leak via `UserOut`); a subsequent request returns that account's own data (`test_auth_login.py`, `test_expenses_isolation.py`).
- AC-2 [behavior] — unknown email OR wrong password → one identical generic 401, no session; timing equalized by a dummy bcrypt verify on the user-absent path (`services/auth.py::authenticate`, `test_auth_login_failure.py`).
- AC-3 [behavior] — `POST /api/auth/logout` clears both cookies, no confirmation, 200; subsequent `/me` and `/expenses` → 401 (`test_auth_logout.py`).
- AC-4 [non-functional] — all four expense/summary routes gated by `require_user`; `user_id` derived server-side from the signed cookie (never client-supplied); unauthenticated → 401 with an error body, not a default payload (`test_expenses_auth_gate.py`).
- AC-5 [invariant] — isolation enforced at the repository layer on every path: list, `category_totals` (filtered before GROUP BY), owner-stamped create, and owner-scoped delete (`WHERE id=? AND user_id=?`). Two-account test: B sees none of A's rows, B's summary totals 0, B's delete of A's id → 404 and A's row survives (`test_expenses_isolation.py`).
- AC-6 [behavior] — double-submit CSRF (`require_csrf`): constant-time `hmac.compare_digest`; auth-checked-before-CSRF (unauth → 401 not 403, via `require_csrf` depending on `require_user`); GET reads exempt; CSRF cookie readable, session cookie httpOnly. Applied to POST/DELETE expenses + logout (`test_csrf.py`).
- AC-7 [e2e] — register → create → logout → login → list-own → logout → 401, against the running app on real SQLite (`test_auth_e2e_flow.py`, off-ledger smoke).
- Existing MVP expense tests migrated to the authenticated, user-scoped contract via a `conftest.py` fixture (not weakened); full suite green (37 backend + 11 frontend).

⚠️ **Divergent:** deviation + severity (shallow/deep)
- [x] (SANCTIONED, not a defect) — the code adds a `user_id` column to `expenses` and scopes all queries, which the frozen snapshot-TSD's Data/State line ("no new persistent schema") appears to forbid. This is the amendment **A-0002-02** (human-approved): the same story's Interfaces/Behavior/Tests (AC-5 isolation) are impossible without per-user expenses, and BLUEPRINT/CONSTITUTION conv. 6 mandate it. The frozen snapshot retains the old wording by design (anchored at task start); the live TSD is corrected. Critic briefed on the amendment and confirmed the change is done correctly.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- None.

❌ **Missing:** acceptance criteria not addressed
- None. Non-blocking notes (Critic): login/register are NOT CSRF-checked — correct and consistent with AC-6's "cookie-authenticated" scope (no session cookie exists pre-auth); the CSRF token is a plain random double-submit (standard given SameSite=Lax, no spec requirement for a session-bound token).

**TDD cycle log:** (ledger cycles B-1..B-5 test-first; AC-2 generic-failure + AC-7 e2e committed off-ledger via `--backfill`)
| Behavior | RED ✅ | GREEN ✅ | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|--------|---------|--------------------------|----------------------|----------------------|
| B-1: login → session + CSRF cookies | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| B-2: expense/summary gated (401 unauth) | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| B-3: CSRF on authed non-GET | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| B-4: logout ends session | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| B-5: expenses user-scoped + isolation | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| (guard) AC-2 generic login failure | — | — | ✅ | ✅ | ✅ |
| (smoke) AC-7 e2e login→logout flow | — | — | ✅ | ✅ | ✅ |

**Critic checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Mocks only at boundaries — no asserts on internal collaborators / call-counts
- [x] Each AC verified per its tag (behavior→interface · invariant→property · non-functional→harness)
- [x] Boundary contract asserted richly (args/content), not bare "was called"
- [x] ≥1 `e2e` AC present and GREEN (reachable through the running system) — AC-7
- [x] Boundaries non-empty ⇒ a smoke AC exists (real boundary, staging) — AC-7 / e2e on real clock+secret+SQLite

**Human verdict:** each item confirmed/dismissed (Path R: + SA) — the lane approve stamp records who signed
**Outcome:** clean → merge (Critic verdict CLEAN; the one divergence is the sanctioned A-0002-02 schema change; suite GREEN 37 backend + 11 frontend)
