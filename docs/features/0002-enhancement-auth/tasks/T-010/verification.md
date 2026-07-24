---
approved_by: "Samir dahal"
approved_at: "2026-07-24"
approved_sha256: "7627042ddea6d366ce88a31f1e6bc17791316d5ebfd885164b72d2c9f3a48ca3"
---
## Verification — Task T-010 — 2026-07-24
> Critic anchored to TSD (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.
> Reviewed by an independent Critic subagent given ONLY snapshot-TSD.md (S-0002.01) + the diff (git diff auth...HEAD), not the build reasoning. Path L (frontend, presentational + thin client; security lives server-side in T-008/T-009).

✅ **Conformant:** items matching spec
- AC-1 [behavior] — valid submission calls `register()` and, on success, `onAuthenticated` → `App` shows the dashboard (`RegisterForm.tsx`, `App.tsx` gate; B-2 backfill + B-5 e2e).
- AC-2 [behavior] — client validation returns before the network call for empty field / password < 8 / mismatch; B-1 (`RegisterForm.test.tsx`) asserts `fetch` is never called and no transition. Messages correct.
- AC-3 [behavior] — `register()` surfaces the real server `detail` (409 "already exists" / 422 msg) via `errorDetail()`; the error shows, `onAuthenticated` is not called, the form stays (B-3).
- AC-4 [non-functional] — `submitting` disables + relabels the submit button; a ghost "Sign in" link calls `onSwitchToLogin` (B-4).
- AC-5 [e2e] — `AuthGate.test.tsx`: `/auth/me` 401 → Register shown → fill → register 201 → dashboard ("no expenses yet"), Register gone. (See the acknowledged note below on jsdom vs real-stack.)
- Client call correctness — POSTs name/email/password/confirm_password to `/api/auth/register`; cookies ride via same-origin relative path; correctly attaches NO CSRF header (register is unauthenticated). `getCurrentUser()` maps 401 → null.
- Auth gate — `Dashboard` (session-gated `useExpenses`/`useSummary`) mounts ONLY when authenticated, so gated API calls never fire logged-out; `user` is `AuthUser|null` (no `[]`-truthiness bug); no Register flash while bootstrapping.
- Existing-test migration preserved (not gutted): `App.test.tsx`, `ExpenseList.test.tsx` (loading), `ThemeToggle.test.tsx` keep their original assertions; only an `/auth/me` stub + await-for-dashboard plumbing was added for the new bootstrap.

⚠️ **Divergent:** deviation + severity (shallow/deep)
- None blocking. (Minor: `register`/`getCurrentUser` use raw `fetch` instead of `apiFetch` — deliberate, because `apiFetch` throws a generic message and would drop the server `detail` AC-3 needs.)

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- None.

❌ **Missing:** acceptance criteria not addressed
- None. **Acknowledged interpretation (human to confirm):** the AC-5 `[e2e]` runs at the jsdom app level with `fetch` stubbed, not against a real running stack as the TSD "Tests: smoke" clause literally reads. This is a deliberate, documented boundary call (exec-plan): the frontend unit runner has no real backend; the true full-stack smoke is manual / lands with T-011. Consistent with how the MVP frontend tests operate. If the acceptance authority requires a literal running-stack smoke per `[e2e]`, that is deferred.

**TDD cycle log:** (ledger cycles B-1 validation, B-2 App gate; RegisterForm success/error/loading committed off-ledger via `--backfill`)
| Behavior | RED ✅ | GREEN ✅ | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|--------|---------|--------------------------|----------------------|----------------------|
| B-1: RegisterForm client validation | ✅ | ✅ | ✅ | ✅ (rendered UI) | ✅ (fetch stub) |
| B-2: App auth gate (unauth→Register→dashboard) | ✅ | ✅ | ✅ | ✅ (rendered UI) | ✅ (fetch stub) |
| (backfill) register success→transition | — | — | ✅ | ✅ | ✅ |
| (backfill) server-error surfacing | — | — | ✅ | ✅ | ✅ |
| (backfill) loading state + Sign in link | — | — | ✅ | ✅ | ✅ |

**Critic checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Mocks only at boundaries — fetch stubbed at the network boundary; no internal-collaborator asserts
- [x] Each AC verified per its tag (behavior→rendered UI · non-functional→loading/link)
- [x] Boundary contract asserted richly (register body shape, endpoint, error detail), not bare "was called"
- [x] ≥1 `e2e` AC present and GREEN (reachable through the running app) — AC-5 (jsdom app level; see acknowledged note)
- [x] Boundaries non-empty ⇒ a smoke AC exists — AC-5 app-level flow against the stubbed API (real full-stack smoke deferred, noted)

**Human verdict:** each item confirmed/dismissed — the lane approve stamp records who signed
**Outcome:** clean → merge (Critic verdict CLEAN; one acknowledged interpretation on e2e scope; suite GREEN 16 frontend + backend unaffected)
