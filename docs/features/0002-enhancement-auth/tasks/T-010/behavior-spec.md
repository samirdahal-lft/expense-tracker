# Behavior Spec — T-010: Frontend: Register screen wired to the register endpoint
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-010/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> B-N here are the LEDGER RED→GREEN cycles. Tests stub `fetch` (as App.test.tsx does).

## B-1 (tracer bullet): AC-2 — client-side validation blocks submission and shows a message.
- Given: the `RegisterForm` rendered; `fetch` stubbed and asserted NOT called. (cases: empty name; empty email; empty password; confirm mismatch; password of 7 chars.)
- When: the user fills the (in)valid fields and submits.
- Then: a validation message is shown, and no register request is sent (the stubbed `fetch` is never called); the app does not transition.

## B-2: AC-1 — a valid submission registers and transitions to the authenticated view.
- Given: `RegisterForm` with an `onAuthenticated` handler; `fetch` stubbed to resolve register → 201 with the created account.
- When: the user fills name + email + matching password ≥ 8 and submits.
- Then: `register()` is called once with those values, and on success the authenticated transition fires (`onAuthenticated` invoked with the account / the user is set).

## B-3: AC-3 — a server rejection is surfaced; no transition.
- Given: `RegisterForm`; `fetch` stubbed to resolve register → 409 with a "email already registered" detail.
- When: the user submits a valid-looking form.
- Then: the server's error message is shown on the form; the authenticated transition does NOT fire; the form remains visible.

## B-4: AC-4 — loading state + link to Login.
- Given: `RegisterForm`; `fetch` stubbed with a deferred (pending) register response.
- When: the user submits.
- Then: the submit control is disabled / relabeled while the request is pending; and a "Sign in" link/button to the Login screen is present and invokes the switch-to-login handler.

## B-5 (e2e): AC-5 — unauthenticated user registers and lands on the dashboard.
- Given: `App` rendered with `fetch` stubbed so the current-user check → 401 (not logged in), register → 201, and the dashboard's data loads (empty expenses/summary).
- When: the app finishes bootstrapping (shows Register), the user fills the Register form and submits.
- Then: the app transitions from the Register screen to the dashboard (its title / an empty-state marker appears); reachable through the running app with no manual setup.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger.
- AC-4 [non-functional] loading + Login link — driven as B-4 (both the in-flight disabled state and the presence/behavior of the Sign-in link).
