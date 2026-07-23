---
approved_by: "samir dahal"
approved_at: "2026-07-23"
approved_sha256: "188287bb24fac5807f77ac4fc2b9af8f590e4b730c862bbedc9648e701f81345"
---
## Task T-011 — Frontend: Login/logout UI + auth-state gate in App
**Parent:** story S-0002.02 · feature 0002-enhancement-auth (docs/features/0002-enhancement-auth/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
**Layer:** frontend React SPA. Consumes the backend login/logout endpoints (T-009) via the typed client; productionizes proto/auth Login.tsx and replaces the proto flow nav with the App auth-state conditional (see frontend/proto/auth/INTEGRATION.md DRIFT-03/04).
**Depends on:** T-009 (login/logout endpoints), T-010 (shared auth view/client scaffolding for the unauthenticated screens).
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: submitting the Login form with valid credentials transitions the app from the unauthenticated view (Login/Register) to the authenticated dashboard.
- [ ] AC-2 [behavior]: a failed login surfaces the generic invalid-credentials error on the form; the app stays on the Login screen.
- [ ] AC-3 [behavior]: triggering logout from the authenticated view returns the app to the Login/Register screen with no confirmation step.
- [ ] AC-4 [non-functional]: on load the app shows the authenticated dashboard when a valid session exists and the Login/Register screen otherwise (session survives a page reload); the Login screen links to Register.
- [ ] AC-5 [e2e]: a real user with an existing account logs in via the Login screen, sees their own prior expenses, logs out, and is returned to the Login/Register screen.
**End-to-end AC:** AC-5 [e2e] — reachable through the running app (green component/unit ≠ reachable)
**Tests:** AC-1, AC-2, AC-3, AC-4, AC-5  ← ordered; first = tracer bullet
**Test scope:** tests/T-011/   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
