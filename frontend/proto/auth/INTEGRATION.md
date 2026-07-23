---
flow: auth
target_route: /login, /register (new — app has no routing yet, single-page)
target_dir: frontend/src/features/auth (does not exist yet)
design_system: local vocab barrel (frontend/src/proto-vocab.ts)
status: prototype
---

# Integrate "auth" into the app

## 0. Product intent — what this is & why (PRD seed)

- **What we're building**: account registration and login for the expense
  tracker, so each person's expenses are private to their own account.
- **Problem it solves**: today the app is single-user with no auth at all —
  anyone with access to the machine/deployment sees and edits the same data.
  Multiple people can't use the same deployment without seeing each other's
  expenses.
- **Who it's for**: anyone who wants to run this expense tracker for
  themselves (or share one deployment across a household/team) without
  exposing everyone's spending to everyone else.
- **Why now / trigger**: the MVP (add/list/delete/summary/theme/Docker) is
  done and landed; this is the first post-MVP enhancement, chosen explicitly
  over other deferred MVP scope (edit, filtering, category management).
- **Core user journey**: Register (name, email, password, confirm) → land on
  the dashboard, OR Login (email, password) → land on the dashboard. Either
  screen links to the other for the opposite case.
- **What success looks like**: a new user can create an account and reach
  their (empty) dashboard; a returning user can log back in and see their own
  data; two different accounts never see each other's expenses.
- **Scope boundaries**: this flow only prototypes the account
  creation/sign-in screens and where they land — it does NOT implement real
  auth (no backend, no password hashing, no session), does not prototype
  logout confirmation, password reset, or email verification, and does not
  recreate the real dashboard (Dashboard.tsx here is an intentional
  placeholder — see DRIFT-04).
- **Open product questions**: session mechanism (httpOnly cookie vs JWT —
  leaning cookie, see the plan doc), whether existing pre-auth dev data needs
  a migration or is treated as disposable, exact password strength rules (not
  prototyped here — Register only checks "fields non-empty" + "passwords
  match").

## 1. Screen → app map

| screen | proto path | real route | replaces / extends | status |
|--------|-----------|-----------|--------------------|--------|
| Login | proto/auth/screens/Login.tsx | new — `frontend/src/features/auth/LoginForm.tsx` | — (new) | new |
| Register | proto/auth/screens/Register.tsx | new — `frontend/src/features/auth/RegisterForm.tsx` | — (new) | new |
| Dashboard | proto/auth/screens/Dashboard.tsx | existing `frontend/src/App.tsx` | placeholder for the real `App` | variant |

## 2. Drift ledger

### DRIFT-01 · shell · BLOCKER
- **screen**: all
- **mockup does**: wraps every body in `proto/shell/Shell.tsx` (copied from the
  real `App.tsx` outer frame: `min-h-screen bg-background` + `container
  max-w-5xl py-10`)
- **real app**: `frontend/src/App.tsx`'s own JSX currently IS that frame — there
  is no separate layout component to swap in
- **productionize**: drop the `Shell` import; when Login/Register become real
  components, either reuse `App.tsx`'s existing outer `<div>` markup directly,
  or (cleaner) extract that markup into a real shared layout component once,
  matching what `Shell.tsx` already mirrors

### DRIFT-02 · data · BEHAVIOR
- **screen**: Login.tsx, Register.tsx
- **mockup does**: local `useState` only; submit just validates non-empty
  (Login) / non-empty + password-match (Register), then `goto('dashboard')` —
  no network call
- **real app**: needs `POST /api/auth/login` and `POST /api/auth/register`
  (per the plan: httpOnly signed-cookie session, `passlib[bcrypt]` hashing) —
  these endpoints don't exist yet
- **productionize**: replace the mock validation + `goto` with real
  `createExpense`-style typed-client calls (`login()`/`register()` in
  `api/client.ts`), a loading state while the request is in flight, and
  surface real server error messages (duplicate email, wrong password) through
  the same `ErrorText`-equivalent in the real app

### DRIFT-03 · navigation · BEHAVIOR
- **screen**: all
- **mockup does**: `useFlow().goto(...)` between the three proto screen ids
- **real app**: this is a single-page app with no router — "navigation" will
  actually be conditional rendering in `App.tsx` (unauthenticated → Login/
  Register; authenticated → the real dashboard), driven by an `useAuth()`
  session hook, not a route change
- **productionize**: replace `goto()` calls with the auth-state gate in
  `App.tsx` described in the plan (T-011)

### DRIFT-04 · missing-state · BEHAVIOR
- **screen**: Dashboard.tsx
- **mockup does**: a placeholder Card with static text, no real expense
  list/summary/theme-toggle
- **real app**: the real dashboard (`App.tsx`) is fully built already
  (add form, category summary donut, expense list, theme toggle) — this
  screen intentionally does NOT recreate it, per the brief (out of scope for
  this auth prototype)
- **productionize**: this screen is not meant to be productionized directly —
  once auth is wired, the REAL `App.tsx` becomes the destination after
  login/register, not this placeholder

### DRIFT-05 · component-defang · COSMETIC
- **screen**: Login.tsx, Register.tsx
- **mockup does**: the secondary "create an account" / "sign in instead"
  actions are rendered as a `Button variant="ghost"` (full-width, button-shaped)
  because the vocab has no plain inline text-link component
- **real app**: a subtler inline text link is more conventional for this
  secondary action than a full ghost button
- **productionize**: consider adding a lightweight `TextLink` component to the
  real design system (and `proto-vocab.ts`) if this distinction matters
  visually; not blocking — the ghost button is a legitimate existing vocab
  primitive (same one `ThemeToggle` uses) and remains fully functional either way

## 3. Migration steps (ordered)

1. Swap `Shell` → `App.tsx`'s real outer frame (or a shared layout extracted
   from it) once Login/Register become real components.
2. Replace proto flow nav (`goto`) with the `App.tsx` auth-state conditional
   (unauthenticated → Login/Register; authenticated → real dashboard).
3. Wire `login`/`register` API calls (T-008 backend) in place of the mock
   validation.
4. Add the loading state the prototype skipped (disable submit + spinner/label
   change while the request is in flight, matching `AddExpenseForm.tsx`'s
   `submitting` pattern).
5. Delete `Dashboard.tsx` (proto) — the real `App.tsx` is the actual
   destination; nothing to re-fang there.

## 4. Gotchas

- `.proto-ui` CSS scoping is proto-only — screen styling comes entirely from
  `@/proto-vocab` components, which carry the real app's own Tailwind classes,
  so there's nothing proto-specific to strip.
- No mocked context providers were needed — all three screens are pure/
  presentational plus local `useState`.

## 5. Open questions for the integrating engineer

- Session mechanism (httpOnly cookie vs JWT) — see the auth plan doc; not
  decided at the TSD yet.
- Whether pre-auth dev data needs a migration (`user_id` backfill) or is
  disposable — flagged as an open TSD question in the plan.
- Whether the ghost-button secondary link (DRIFT-05) should become a real
  `TextLink` vocab component before other auth-adjacent screens are built.
