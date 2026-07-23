---
approved_by: "samir dahal"
approved_at: "2026-07-23"
approved_sha256: "4263b7e87deac4c9ffc8cc3221d4598dfa4cd64cb758a085919fd16093715d92"
---
## Task T-009 — Backend: login/logout + session-gated expense routes
**Parent:** story S-0002.02 · feature 0002-enhancement-auth (docs/features/0002-enhancement-auth/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
**Layer:** backend FastAPI (router→service→repository), reachable over the HTTP API. Frontend Login/logout UI + auth gate is T-011.
**Depends on:** T-008 (accounts must exist to authenticate against).
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: a login request with valid matching credentials for an existing account starts an authenticated session; a subsequent request returns that account's own data.
- [ ] AC-2 [behavior]: a login request with an unknown email or a wrong password is rejected with one generic invalid-credentials error that does not reveal which was wrong; no session is created.
- [ ] AC-3 [behavior]: a logout request ends the current session immediately with no confirmation; a subsequent request to any expense/summary route is rejected as unauthenticated.
- [ ] AC-4 [non-functional]: any expense/summary request without a valid session is rejected, never served stale or default data; a valid session remains usable until logout or expiry.
- [ ] AC-5 [invariant]: across any interleaving of login/logout between two accounts, a session only ever reads or mutates its own account's rows — no route or aggregate returns another user's data.
- [ ] AC-6 [behavior]: a cookie-authenticated state-changing (non-GET) request that fails the CSRF check is rejected; the same request with a valid CSRF check succeeds.
- [ ] AC-7 [e2e]: against the running API, a login returns a session that reads that account's own expenses, and logout then makes a protected request fail as unauthenticated.
**End-to-end AC:** AC-7 [e2e] — reachable through the running API (green unit ≠ reachable)
**Tests:** AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7  ← ordered; first = tracer bullet
**Test scope:** tests/T-009/   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
