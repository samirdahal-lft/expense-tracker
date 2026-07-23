---
approved_by: "samir dahal"
approved_at: "2026-07-23"
approved_sha256: "d535efe7988958f4b0543d1715732dcc55af82c13f4d2f85031611723e7bdbec"
---
# Mini PRD 0002 — Account registration and login
> An `enhancement` iteration (LANE §8) — a small, scoped improvement on top of what already
> ships. Lighter than a full feature PRD: usually one story, no full success-metrics apparatus.
> Paired with TSD.md in this folder. If it grows past a couple of stories, it's a `feature` —
> create one instead.

**Parent:** 0001 (MVP) — PRODUCT.md already assumes multiple registered users each private to
their own data; this enhancement delivers the account layer the MVP shipped without.
**Source:** roadmap milestone — first post-MVP enhancement, chosen explicitly over other
deferred MVP scope (edit, filtering, category management). Today the app is single-user with
no auth at all: anyone with access to the deployment sees and edits the same data, so multiple
people can't share one deployment without exposing each other's expenses.

---

## Story S-0002.01 — Register
As a new user I want to create an account with my name, email, and password so that I get a
private space for my own expenses.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — submitting the registration form with a name, a unique email, and a
      password (with matching confirmation) creates a new account and starts an authenticated
      session for it.
- [ ] AC-2 [behavior] — submitting a registration with an email already in use is rejected with
      an error identifying the email is taken; no account or session is created.
- [ ] AC-3 [behavior] — submitting a registration with an empty required field, a password
      confirmation that doesn't match, or a password shorter than 8 characters, is rejected
      before any account is created.
- [ ] AC-4 [invariant] — a password is never stored or logged in plain text.
- [ ] AC-5 [e2e] — a real user opens the app, fills out the Register screen, and lands on their
      own (empty) dashboard with a live session, without any manual setup step.

**Success metric:** a new visitor can go from no account to viewing their own empty dashboard
in one flow, with no shared or leaked data from any other account.

---

## Story S-0002.02 — Login and logout
As a returning user I want to log in with my email and password, and log out when I'm done, so
that I can get back to my own expenses and end my session when I no longer want it active.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — submitting valid, matching credentials for an existing account starts
      an authenticated session and returns that account's own data on subsequent requests.
- [ ] AC-2 [behavior] — submitting an unknown email or a wrong password is rejected with a
      generic invalid-credentials error that does not reveal which of the two was wrong.
- [ ] AC-3 [invariant] — two different accounts' sessions never see or act on each other's
      expenses, under any sequence of login/logout across accounts.
- [ ] AC-4 [non-functional] — an authenticated session persists across a page reload until the
      user logs out or the session expires; unauthenticated requests to any expense/summary
      route are always rejected, never served with stale or default data.
- [ ] AC-5 [behavior] — triggering logout ends the current session immediately, with no
      confirmation step; a subsequent request to any expense/summary route is rejected as
      unauthenticated.
- [ ] AC-6 [e2e] — a real user with an existing account opens the app, logs in via the Login
      screen, sees their own previously recorded expenses, then logs out and is returned to
      the Login/Register screen.

**Success metric:** a returning user reaches their own data through login every time, can end
their session with logout, and no unauthenticated or cross-account request ever succeeds.

---

## Out of scope for this enhancement
- Logout confirmation UX, password reset, and email verification.
- Any change to the real dashboard (`App.tsx`) beyond gating it behind an authenticated session.
- Migrating or backfilling any pre-auth dev data — treated as an open question for the TSD.
- Password-strength rules beyond non-empty, confirmation match, and the 8-character minimum
  (no complexity/character-class requirements, breach checks, or strength meter).

## Open questions (carried into TSD)
- Session mechanism: httpOnly signed cookie vs. JWT (BLUEPRINT.md already assumes an httpOnly
  signed cookie — confirm at TSD time).
- Whether existing pre-auth dev data needs a `user_id` migration or is disposable.
