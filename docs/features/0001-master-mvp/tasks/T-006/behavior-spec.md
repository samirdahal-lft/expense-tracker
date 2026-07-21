# Behavior Spec — T-006: Premium, themed UI
> Source: task card ACs + docs/features/0001-master-mvp/tasks/T-006/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: A visible control toggles light/dark mode; the chosen mode persists across a page reload.
- Given: the app rendered in its default (light) mode — the document root has no `dark` class.
- When: the user clicks the theme toggle.
- Then: the document root gains the `dark` class and the choice is stored; and a fresh mount (simulating a reload) reads the stored choice and applies `dark` without another click.

## B-2: AC-3 [e2e]: Through the running app, switching theme restyles every surface — background, text, accent, and the donut chart — correctly in both modes.
- Given: the running app in light mode with a summary/donut region rendered.
- When: the user toggles to dark and then back to light.
- Then: the document root's `dark` class is added then removed accordingly, and the summary/donut region remains rendered and correct in both modes (theme is applied app-wide, not just the toggle).

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [non-functional]: rounded cards + subtle shadows + one accent + considered type/spacing — visual polish, verified by human review (both light and dark), not a unit assertion.

