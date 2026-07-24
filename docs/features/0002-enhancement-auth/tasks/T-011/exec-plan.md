---
approved_by: ""
approved_at: ""
# planned_behaviors — machine-read count of RED→GREEN cycles (B-N). Leave empty to let
# lane infer from B-N labels below; SET it when an AC becomes a regression guard so
# `lane next` knows the remaining count (frontmatter edits need no re-approval).
planned_behaviors: ""
---
## Exec Plan — Task T-011
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- LoginForm.tsx: renders email/password fields, validates non-empty, calls login API, shows loading state + error surface, transitions to authenticated state on success (AC-1, AC-2)
- RegisterForm.tsx: renders name/email/password/confirm fields, validates matching passwords, calls register API, shows loading state, transitions to authenticated state on success
- useAuth() hook: manages session state (reads auth cookie, exposes isAuthenticated boolean, provides login/register/logout methods, persists across page reload)
- App.tsx auth gate: conditionally renders LoginScreen (unauthenticated) vs authenticated dashboard based on useAuth().isAuthenticated (AC-4)
- Logout affordance in authenticated view: button/link in App header that calls useAuth().logout(), clears session, returns to Login (AC-3)

**Approach:** high-level only — NOT implementation prescription
Productionize the proto screens (INTEGRATION.md DRIFT-01 to DRIFT-05 resolution): extract shared layout, replace mock validation with typed-client API calls (login/register from T-009 backend), wire session state through useAuth hook, add loading states matching AddExpenseForm pattern, conditionally render unauthenticated (Login/Register) vs authenticated (real App) views based on session presence. No new routing — single-page SPA, state-driven UI.

**Boundaries & mocks:** (from TSD Boundaries) what's FAKED (network/external services, clock, randomness, filesystem) vs REAL. Each fake = an injected port. Boundaries non-empty ⇒ name the smoke AC that hits the real one in a realistic environment.
- Real: login/register HTTP calls to backend endpoints (T-009), session cookie handling, expense queries scoped to authenticated user
- Faked: clock (for session expiry in unit tests), random values (covered by backend tests, not frontend) 
- Smoke AC-5: real login against running stack (requires backend from T-009 running)

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 … ; include the `e2e` behavior
- B-1: AC-1 [behavior] — valid login transition to dashboard
- B-2: AC-2 [behavior] — failed login error surface + stay on Login
- B-3: AC-3 [behavior] — logout return to Login/Register
- B-4: AC-5 [e2e] — real user login → see own expenses → logout → return to Login

**PR will contain:**
- frontend/src/features/auth/LoginForm.tsx
- frontend/src/features/auth/RegisterForm.tsx
- frontend/src/hooks/useAuth.ts (session state management hook)
- frontend/src/App.tsx (add auth-state conditional gate)
- frontend/src/api/client.ts (add login/register/logout typed API calls)
- tests/T-011/auth.test.tsx (unit: credential validation error surface, session persistence)
- tests/T-011/auth.integration.test.tsx (integration: auth state gate, cross-account isolation, logout)
- tests/T-011/auth.e2e.test.tsx (smoke: real user flow against running stack)

**Open questions / ambiguities:** (MUST be resolved before execution)
- None — TSD complete, backend (T-009) complete, proto code (INTEGRATION.md) provides clear migration path, spec-to-code mapping explicit in behavior-spec.md

**Path:** L (lean, default) | R (rich)
**Escalation signals hit (≥2 → R):** ambiguities≥3 · blast-radius≥3 · security · amendments≥2 · prior-fail · self-flag
- Ambiguities: 0 (TSD complete, integration guide clear)
- Blast radius: 1 (frontend auth only, no system changes, no DB schema changes)
- Security: inherited from backend (passlib bcrypt, httpOnly cookie, CSRF check) — frontend surfaces errors correctly but does not add new attack surface
- Amendments: 0
- Prior failures: 0
- Self-flags: 0
**Path selection: L (lean)** — clear spec, low risk, straightforward component composition + hook

**If overriding R→L:** risk acknowledged here + SA co-signs Verification.
- N/A — L is appropriate

- [ ] Refactor pass done (on green; tests unchanged) — before PR
