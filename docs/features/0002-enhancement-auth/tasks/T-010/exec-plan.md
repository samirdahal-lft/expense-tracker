---
approved_by: "Samir dahal"
approved_at: "2026-07-24"
planned_behaviors: 5
approved_sha256: "82c1d091a47ab9c9132ea3209e9784ee7579276210e43f9d8feed31fa981807b"
---
## Exec Plan — Task T-010
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- A `RegisterForm` component (productionizing `proto/auth/screens/Register.tsx`) with name/email/password/confirm fields that, on valid input, calls the real register endpoint and on success transitions the app to the authenticated dashboard. (AC-1)
- Client-side validation that blocks submission and shows a message for an empty required field, a password/confirmation mismatch, or a password shorter than 8 chars — before any request. (AC-2)
- Server-rejection handling: a duplicate-email (or other server) error is surfaced on the form; the form stays and the app does not transition. (AC-3)
- A loading state (submit disabled + label change while in flight) and a link from Register to the sign-in (Login) screen. (AC-4)
- An auth-state gate in `App`: unauthenticated → the Register screen; authenticated → the existing dashboard; session presence is bootstrapped on load via the current-user endpoint. (AC-5, e2e)

**Approach:** high-level only — NOT implementation prescription
- Add `register()` and `getCurrentUser()` to `src/api/client.ts` (typed, using the existing `apiFetch` style) — register POSTs name/email/password/confirm and returns the account; on a non-OK response it throws an error carrying the server's message so the form can show duplicate-email etc. `getCurrentUser()` resolves to the account or null (401 = not logged in). Cookies ride automatically (same-origin fetch); register is unauthenticated so no CSRF header is needed (per T-009 the CSRF check only guards already-authenticated requests).
- A `useAuth` hook (`src/hooks/useAuth.ts`) holding `user` + a `bootstrapping` flag; on mount it calls `getCurrentUser()`. Exposes `user`, `bootstrapping`, and `register()` (sets `user` on success). Login/logout are added by T-011 — this hook is the shared seam.
- `App` renders: while bootstrapping, nothing/placeholder; if no `user`, the unauthenticated view (Register by default, with a "Sign in" link switching a local `mode` to login — the real Login screen is T-011, so login mode shows a minimal placeholder here); if `user`, the existing dashboard unchanged.
- Drop the proto `Shell` and `useFlow` (INTEGRATION.md DRIFT-01/03); reuse `App`'s existing outer frame; keep the `@/proto-vocab` components (Card/Button/TextInput/PageHeader/ErrorText) — they carry the real app's Tailwind classes. The ghost-button "Sign in" link is a legitimate vocab primitive (DRIFT-05).

**Boundaries & mocks:** (from TSD Boundaries) what's FAKED vs REAL. Each fake = an injected port.
- **Backend HTTP API** — the external boundary. In Vitest component/integration tests it is FAKED by stubbing `fetch` (`vi.stubGlobal`, matching the existing `App.test.tsx` pattern): register 201 / 409 / and the current-user 200|401. No real network in jsdom.
- No clock/randomness/filesystem boundaries in the frontend.
- Boundaries non-empty ⇒ the e2e/smoke that hits the real one: the AC-5 behavior (B-5) exercises the whole App gate + register flow against a stubbed API at the app level (jsdom "running app"). A true full-stack smoke (real backend via Docker) is out of scope for the frontend unit runner and is covered manually / by the T-011 integration once login lands.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2, B-3 … ; include the `e2e` behavior
- **B-1** (tracer) — `RegisterForm` client validation: empty required field, confirmation mismatch, or password < 8 chars blocks submission and shows a message; no register request is made. (AC-2)
- **B-2** — a valid submission calls `register()` and, on success, invokes the authenticated transition (the form reports success / sets the user). (AC-1)
- **B-3** — a server rejection (e.g. duplicate email → 409) is surfaced as an error on the form; no transition occurs. (AC-3)
- **B-4** — while the request is in flight the submit control is disabled/relabeled; the screen renders a "Sign in" link to the Login screen. (AC-4)
- **B-5** (e2e) — starting unauthenticated (current-user → 401), `App` shows the Register screen; filling and submitting it (register → 201) lands the user on the dashboard. (AC-5)

**PR will contain:**
- `src/api/client.ts` (+`register`, `getCurrentUser`, `AuthUser` type), `src/hooks/useAuth.ts`, `src/features/auth/RegisterForm.tsx`, an unauthenticated-view wiring + auth gate in `src/App.tsx` (with a minimal Login placeholder for T-011 to replace).
- Tests: `src/features/auth/RegisterForm.test.tsx` (B-1..B-4) and an `App`-level auth-gate test (B-5), stubbing `fetch`.
- No backend change (T-008 already ships the endpoints).

**Open questions / ambiguities:** (MUST be resolved before execution)
- T-010/T-011 boundary: the auth-state gate in `App` and the `useAuth` seam are introduced here (needed for AC-1/AC-5's "transition to authenticated view"); T-011 extends them with the real Login screen, the Register↔Login toggle target, and logout. T-010 ships a minimal Login placeholder behind the "Sign in" link so AC-4's link is real without pre-building T-011.

**Path:** L (lean)
**Escalation signals hit (≥2 → R):** none decisive — single frontend feature, no security/amemdment/prior-fail. (Auth-adjacent, but the security-bearing logic lives server-side in T-008/T-009; this is presentational + a thin client.) Running Path L.
- [ ] Refactor pass done (on green; tests unchanged) — before PR
