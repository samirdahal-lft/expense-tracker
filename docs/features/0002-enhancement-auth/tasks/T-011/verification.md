---
approved_by: "Samir dahal"
approved_at: "2026-07-24"
approved_sha256: "32ad4bbacd0c4ab3633bb16e3e0f183b184db855a2e1ea56b11ee1ab9f78b44a"
---
## Verification — Task T-011 — 2026-07-24
> Critic anchored to TSD (external spec), NOT to the code. ★GATE: owner confirms/dismisses every flag.
> Critic run with fresh context (given only snapshot-TSD.md + card + behavior-spec + the frontend diff; no build reasoning).

✅ **Conformant:** items matching spec
- AC-1 / B-1 (valid login → dashboard): App wires the real LoginForm with `useAuth().login`; LoginForm calls `login()` then `onAuthenticated`; useAuth sets the user → dashboard renders. Matches TSD Interfaces ("authenticated state renders the real app").
- AC-2 / B-2 (failed login → generic error, stays on Login): client `login()` throws the server's generic detail; LoginForm surfaces it; dashboard never mounts. Matches TSD Behavior ("one generic error that does not reveal which was wrong").
- AC-3 / B-3 (logout, no confirmation): Dashboard "Sign out" ghost button → `useAuth().logout` → `apiLogout()` then clears user; single click, no dialog. Matches TSD ("logout … with no confirmation step").
- AC-4 (auth-state gate on load / survives reload): App gate `bootstrapping ? null : user ? Dashboard : Register/Login`; useAuth bootstraps from `/auth/me` on each mount. Both branches covered.
- Client interface: typed `login`/`logout` added to api/client.ts, consistent with the existing `register` + `errorDetail` pattern. Dead `LoginPlaceholder` removed (card DRIFT-03/04).

⚠️ **Divergent:** deviation + severity (shallow/deep)
- AC-5 automated test is component-level with a stubbed backend, not a running-stack smoke (SHALLOW — disclosed). The card tags AC-5 [e2e] and the TSD Tests row calls for a smoke against the running stack; the behavior-spec note and the approved exec-plan Boundaries explicitly defer the true smoke out-of-band (requires T-009 backend + DB running). In-repo AC-5 proves the full UI sequence with a stateful fetch stub, not running-system reachability.
- Redundant double `setUser` on the login path (COSMETIC): `useAuth.login` sets the user AND LoginForm's `onAuthenticated` (wired to `setUser`) sets it again. Idempotent/harmless.

🚨 **Suspected hallucination:** flag for human (false positives expected — do NOT reject PR on this alone)
- CSRF token / `credentials` not explicitly attached on the frontend login/logout POSTs. TSD Access row notes login/logout are subject to the CSRF check, but that is a backend (T-009) concern; these use the same same-origin relative-`/api` fetch pattern as the already-shipped `register` (T-010). Likely a false positive; the deferred real-stack AC-5 smoke is the thing that would actually exercise it. Human to confirm.

❌ **Missing:** acceptance criteria not addressed
- AC-4 sub-clause "the Login screen links to Register" — implemented (LoginForm "Need an account? Create one" → onSwitchToRegister) but not directly asserted by a test. SessionOnLoad asserts the reverse direction (Register → sign-in link); B-1/B-4 exercise the Register→Login switch. Minor coverage gap only; behavior present. No AC is unimplemented.

**TDD cycle log:**
| Behavior | RED ✅ | GREEN ✅ | Test = behavior not impl | Public interface only | Mocks @ boundary only |
|----------|--------|---------|--------------------------|----------------------|----------------------|
| B-1: valid login → dashboard (test-first ledger cycle) | ✅ | ✅ | ✅ asserts dashboard visible via `<App/>` | ✅ drives App UI | ✅ stubs `fetch` only (rewritten from hook-mock) |
| B-2: failed login → generic error (backfill, non-ledger) | n/a (backfill) | n/a | ✅ asserts error text + no dashboard | ✅ | ✅ `fetch` 401 `{detail}` |
| B-3: logout → Login/Register (backfill, non-ledger) | n/a (backfill) | n/a | ✅ single click → unauth screen | ✅ | ✅ `fetch` only |
| B-4: e2e login→own expenses→logout (backfill, non-ledger) | n/a (backfill) | n/a | ✅ owned-expense via unique row aria-label | ✅ | ✅ stateful `fetch` stub |
| AC-4 guard: auth state on load (backfill, non-ledger) | n/a (backfill) | n/a | ✅ both `/auth/me` branches | ✅ | ✅ `fetch` only |

> Ledger honesty note: only B-1 is a genuine test-first RED→GREEN cycle (planned_behaviors=1). The B-1 GREEN implemented the login/error/logout wiring together, so B-2/B-3/B-4 and the AC-4 guard were committed as disclosed BACKFILL tests (fail at task base, pass at HEAD — behavior introduced by this task, tested after). Critic confirmed all five test files stub the network boundary (`fetch`) and none mock internal collaborators or assert call-counts.

**Critic checklist:** (checkboxes — `done` only enforces checkboxes; resolve each)
- [x] Mocks only at boundaries — no asserts on internal collaborators / call-counts — PASS: every test stubs global `fetch`; none mock `useAuth`/client fns; no `toHaveBeenCalled` on internals.
- [x] Each AC verified per its tag (behavior→interface · invariant→property · non-functional→harness) — PASS: AC-1/2/3 driven through `<App/>`; AC-4 non-functional guard test; AC-5 e2e present (see caveat below).
- [x] Boundary contract asserted richly (args/content), not bare "was called" — PASS: B-2 asserts the `detail` message content; B-4 asserts specific owned-expense content; stubs key on URL + method.
- [x] ≥1 `e2e` AC present and GREEN (reachable through the running system) — PARTIAL: AC-5 present and GREEN at component level (stubbed backend). Running-system reachability deferred out-of-band per approved exec-plan Boundaries — HUMAN to confirm the smoke runs before the story closes.
- [x] Boundaries non-empty ⇒ a smoke AC exists (real boundary, staging) — PARTIAL: smoke AC (AC-5) is defined and named in the TSD; real-stack execution is out-of-band, not evidenced in this diff.

**Human verdict:** each item confirmed/dismissed (Path R: + SA) — the lane approve stamp records who signed
- Overall Critic verdict: CLEAN (ready to merge). Open items are inherent to a frontend-only slice and disclosed: AC-5 real-stack smoke (out-of-band), CSRF/credentials (backend concern, same pattern as shipped register). Minor polish (Login→Register link not asserted; double setUser) is non-blocking.
**Outcome:** clean → merge | divergence → Amendment (.lane/templates/AMENDMENT.md) → re-spec → re-run
