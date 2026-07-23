---
approved_by: "samir dahal"
approved_at: "2026-07-23"
approved_sha256: "3beb27e599736162db376d7bba95a0b05310b6cb4c912c9a82d00c630cb48baa"
---
## Task T-008 — Backend: register endpoint (account creation + session)
**Parent:** story S-0002.01 · feature 0002-enhancement-auth (docs/features/0002-enhancement-auth/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
**Layer:** backend FastAPI (router→service→repository), reachable over the HTTP API. Frontend Register screen is T-010.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: a registration request with a name, a not-yet-registered email, and a password ≥ 8 chars matching its confirmation creates one account and returns it authenticated with a live session (session cookie set); the response never carries the password or its verifier.
- [ ] AC-2 [behavior]: a registration request with an email already in use is rejected identifying the email is taken; no account and no session are created.
- [ ] AC-3 [behavior]: a registration request with an empty required field, a confirmation mismatch, or a password shorter than 8 chars is rejected before creation, naming the offending validation; no account and no session are created.
- [ ] AC-4 [invariant]: the submitted password never appears in stored state, responses, or logs — the stored verifier cannot be reversed to it.
- [ ] AC-5 [e2e]: against the running API, a registration request for a fresh email returns an authenticated session usable on a subsequent request.
**End-to-end AC:** AC-5 [e2e] — reachable through the running API (green unit ≠ reachable)
**Tests:** AC-1, AC-3, AC-2, AC-4, AC-5  ← ordered; first = tracer bullet
**Test scope:** tests/T-008/   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
