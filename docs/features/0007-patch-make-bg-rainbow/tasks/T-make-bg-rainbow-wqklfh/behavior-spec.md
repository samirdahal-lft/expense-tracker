# Behavior Spec — T-make-bg-rainbow-wqklfh: Animated rainbow background
> Source: task card ACs + docs/features/0007-patch-make-bg-rainbow/tasks/T-make-bg-rainbow-wqklfh/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: The root `<div>` in `App.tsx` applies an animated rainbow gradient background visible in the rendered output
- Given: the App component is rendered
- When: the root container element is inspected
- Then: it carries the `rainbow-bg` CSS class that applies an animated rainbow gradient background

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-2 [invariant]: All existing App snapshot/render tests still pass — no layout or functionality regression — coverage:

