---
approved_by: "samir dahal"
approved_at: "2026-07-23"
approved_sha256: "382f0c24d1d0c268fce36812e188989f059b5d07f24a42e9b3ad72fe8b7a4f2f"
---
## Verification — Task T-008 — 2026-07-23
> Critic anchored to TSD (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.
> Reviewed by an independent Critic subagent given ONLY snapshot-TSD.md + the diff (git diff auth...HEAD), not the build reasoning. Path R (security + blast-radius).

✅ **Conformant:** items matching spec
- AC-1 [behavior] — `POST /api/auth/register` (valid input) → 201 with public identity (id, name, email), no password/verifier leaked (structurally stripped by `response_model=UserOut`), and an httpOnly + SameSite=Lax session cookie set. Verified through the real HTTP interface (`tests/test_auth_register.py`).
- AC-2 [behavior] — duplicate email → 409 naming the email as taken, no session cookie; and a dedicated guard asserts exactly one account survives (`tests/test_auth_register_duplicate.py`, `tests/test_auth_register_one_row.py`).
- AC-3 [behavior] — empty field / confirmation mismatch / password < 8 → 422 with naming detail, no session cookie, and proven non-consumption (a valid follow-up register still succeeds) across all five cases (`tests/test_auth_register_validation.py`).
- AC-4 [invariant] — password verifier is bcrypt via `passlib` (CONSTITUTION-mandated), per-hash salt; asserted one-way + salted (two hashes of the same password differ) + plaintext-absent from both the response and the persisted row (`tests/test_auth_password_hashing.py`); no code path logs the password.
- AC-5 [e2e] — register → reuse the issued cookie on `GET /api/auth/me` returns the same account; no cookie / tampered cookie → 401. Exercises the real ASGI app, real clock, real SQLite (`tests/test_auth_me.py`).
- Session signing — `itsdangerous` signed, timestamped token (CONSTITUTION-mandated); signature + age (`max_age`) verified on load, any BadSignature/SignatureExpired → None (no forgery). Boundaries (clock via `max_age`, secret) injected via the `SESSION_SECRET` env seam; no internal collaborators mocked.

⚠️ **Divergent:** deviation + severity (shallow/deep)
- [x] (RESOLVED) shallow — `session.py` originally fell back to a hard-coded `_DEV_SECRET` when `SESSION_SECRET` was unset, contradicting the TSD Boundaries "injected, not hard-coded" (a known-default signing key = forgeable sessions in prod). Fixed: `_secret()` now fails closed (raises) when the env var is absent; covered by ledger behavior B-5 (`tests/test_auth_session_secret.py`), which also confirms the absent-cookie path still returns None without touching the secret.
- [x] (RESOLVED) shallow — AC-2's "still exactly one account" persistence invariant was unasserted at first review. Fixed: `tests/test_auth_register_one_row.py` asserts a single surviving row after a rejected duplicate.
- [x] (RESOLVED) shallow — CONSTITUTION grounding miss (human review): the implementation used stdlib `pbkdf2_hmac` + hand-rolled `hmac`, but CONSTITUTION mandates `passlib[bcrypt]` + `itsdangerous`. Fixed: swapped to bcrypt (passlib) and itsdangerous, added pinned deps to `requirements.txt`; behavior/ACs/tests unchanged. Logged as append-only amendment A-0002-01; exec-plan corrected and re-approved.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- None. `GET /api/auth/me` is not itself an AC but is the exec-plan-justified observable proof for AC-5, not scope creep.

❌ **Missing:** acceptance criteria not addressed
- None. (Out of scope by design and confirmed with the Critic: the CSRF *token* check on authenticated state-changing routes is T-009, not this task; the register-issued cookie's SameSite requirement IS met here.)

**TDD cycle log:**
| Behavior | RED ✅ | GREEN ✅ | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|--------|---------|--------------------------|----------------------|----------------------|
| B-1: register success + session cookie | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| B-2: duplicate email rejected | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| B-3: input validation (incl. min-8) | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ |
| B-4: e2e session authorizes /api/auth/me | ✅ | ✅ | ✅ | ✅ (HTTP) | ✅ (secret seam) |
| B-5: session signing fails closed w/o secret | ✅ | ✅ | ✅ | ✅ (session API) | ✅ |
| AC-2/AC-4 guards (off-ledger backfill) | — | — | ✅ | ✅ | ✅ |

**Critic checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Mocks only at boundaries — no asserts on internal collaborators / call-counts
- [x] Each AC verified per its tag (behavior→interface · invariant→property · non-functional→harness)
- [x] Boundary contract asserted richly (args/content), not bare "was called"
- [x] ≥1 `e2e` AC present and GREEN (reachable through the running system) — AC-5
- [x] Boundaries non-empty ⇒ a smoke AC exists (real boundary, staging) — AC-5/B-4 hits real clock + secret + SQLite

**Human verdict:** each item confirmed/dismissed (Path R: + SA) — the lane approve stamp records who signed
**Outcome:** clean → merge (all divergences resolved in-task, incl. CONSTITUTION conformance swap to `passlib[bcrypt]` + `itsdangerous` per amendment A-0002-01; re-review suite GREEN, 27 backend + 11 frontend)
