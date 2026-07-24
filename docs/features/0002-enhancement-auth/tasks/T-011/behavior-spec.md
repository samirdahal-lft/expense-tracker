# Behavior Spec — T-011: Frontend: Login/logout UI + auth-state gate in App
> Source: task card ACs + docs/features/0002-enhancement-auth/tasks/T-011/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: submitting the Login form with valid credentials transitions the app from the unauthenticated view (Login/Register) to the authenticated dashboard.
- Given: the app is loaded and the user is unauthenticated (no session cookie)
- When: the user enters valid email + password in the Login form and submits
- Then: the login API call succeeds, the session is established, and the app transitions to the authenticated dashboard view

## B-2: AC-2 [behavior]: a failed login surfaces the generic invalid-credentials error on the form; the app stays on the Login screen.
- Given: the app is on the Login screen, unauthenticated
- When: the user submits credentials the backend rejects (login API returns a failure with a generic invalid-credentials message)
- Then: the generic error message is shown on the Login form and the app stays on the Login screen (does not transition to the dashboard)

## B-3: AC-3 [behavior]: triggering logout from the authenticated view returns the app to the Login/Register screen with no confirmation step.
- Given: the app is authenticated and showing the dashboard
- When: the user triggers the logout affordance (Sign out)
- Then: the session ends immediately with no confirmation prompt and the app returns to the unauthenticated Login/Register screen

## B-4: AC-5 [e2e]: a real user with an existing account logs in via the Login screen, sees their own prior expenses, logs out, and is returned to the Login/Register screen.
- Given: an existing account with prior expenses; the app is loaded and unauthenticated
- When: the user logs in via the Login screen, views the dashboard, then triggers logout
- Then: after login the dashboard shows that account's own prior expenses; after logout the app returns to the Login/Register screen
- Note: the true smoke test runs against the running stack (backend T-009 + frontend) and is validated out-of-band per the exec-plan Boundaries. The automated test here drives the full login→see-expenses→logout→return sequence at the component level with a stubbed backend.

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-4 [non-functional]: on load the app shows the authenticated dashboard when a valid session exists and the Login/Register screen otherwise (session survives a page reload); the Login screen links to Register. — coverage: guard test tests/T-011/SessionOnLoad.test.tsx — on mount useAuth bootstraps via /auth/me: a live session renders the dashboard (survives reload), no session renders Register (whose header links to the Login/sign-in switch). Also exercised as the entry state of B-1 (unauthenticated load) and B-3 (authenticated load).

