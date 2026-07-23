---
approved_by: "samir dahal"
approved_at: "2026-07-23"
approved_sha256: "48f8298570dd7ded032f85a2971096885fcfc026b2251852ddc3cceb9b97c99e"
---
## Task T-010 — Frontend: Register screen wired to the register endpoint
**Parent:** story S-0002.01 · feature 0002-enhancement-auth (docs/features/0002-enhancement-auth/ — its PRD + TSD)
**Slice:** a complete observable behavior end-to-end + tests (full vertical — a disconnected layer = smell)
**Layer:** frontend React SPA. Consumes the backend register endpoint (T-008) via the typed client; productionizes proto/auth Register.tsx (see frontend/proto/auth/INTEGRATION.md DRIFT-01/02/03/05).
**Depends on:** T-008 (register endpoint).
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`; behavior ACs = observable outcome through an interface — NO "calls X / saves to table Y / uses lib Z")
- [ ] AC-1 [behavior]: submitting the Register form with a name, email, and matching password ≥ 8 chars sends the registration and, on success, transitions the app to the authenticated view.
- [ ] AC-2 [behavior]: client-side validation blocks submission and shows a message when a required field is empty, the confirmation doesn't match, or the password is shorter than 8 chars.
- [ ] AC-3 [behavior]: a server rejection (e.g. duplicate email) is surfaced as an error message on the form; the form stays on screen and the app does not transition.
- [ ] AC-4 [non-functional]: while the request is in flight the submit control is disabled/indicates progress, and the Register screen links to the Login screen for existing users.
- [ ] AC-5 [e2e]: a real user opens the app, fills the Register screen, and lands on their own empty authenticated dashboard with no manual setup.
**End-to-end AC:** AC-5 [e2e] — reachable through the running app (green component/unit ≠ reachable)
**Tests:** AC-2, AC-1, AC-3, AC-4, AC-5  ← ordered; first = tracer bullet
**Test scope:** tests/T-010/   ← documentation: where this task's OWN tests live. Scope is NOT configured — red/green scope to the changed test files and `verify` derives it from the RED commits (ADR-0002); `review` runs the FULL suite. This line is a human pointer only.
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
