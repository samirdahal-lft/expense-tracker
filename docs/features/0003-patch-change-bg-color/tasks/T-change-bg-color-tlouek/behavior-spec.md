# Behavior Spec — T-change-bg-color-tlouek: Update background CSS variable in light and dark themes
> Source: task card ACs + docs/features/0003-patch-change-bg-color/tasks/T-change-bg-color-tlouek/snapshot-TSD.md
> One test at a time. B-1 = tracer bullet. Never write B-N+1 before B-N is GREEN.
> Fill a behavior's Given/When/Then JUST BEFORE you `lane red` it — `lane red` checks
> only the behavior it's about to prove, so later B-N may stay stubs until their turn.
> B-N below seed from the card's drivable ACs (behavior / e2e) — a starting point, not
> final. One AC may be several behaviors (split it); the Critic may surface more (add
> them). B-numbering is the Coordinator's, not fixed by AC count. Invariant /
> non-functional ACs are not RED→GREEN cycles — any are listed in their own section.

## B-1 (tracer bullet): AC-1 [behavior]: `:root --background` equals `30 20% 97%` in `frontend/src/index.css`
- Given:
- When:
- Then:

## B-2: AC-2 [behavior]: `.dark --background` equals `220 13% 10%` in `frontend/src/index.css`
- Given:
- When:
- Then:

## Invariants & non-functional ACs (NOT RED→GREEN cycles)
> Not standalone behaviors to drive. An invariant usually holds as a property of a
> behavior above (state which) or is locked by a guard test recorded off-ledger with
> `lane red --regression`. Non-functional ACs are validated out-of-band (load test, etc.).
- AC-3 [invariant]: All other CSS custom properties in both `:root` and `.dark` blocks are unchanged — coverage:

