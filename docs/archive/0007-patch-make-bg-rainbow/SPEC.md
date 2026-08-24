---
approved_by: "Samir dahal"
approved_at: "2026-08-24"
approved_sha256: "935728d6fa9fc67ec95fc9c0e64140b8ddea3a51925ec4c5d5eb5876bea50ad6"
---
# Patch 0007 — Rainbow background

> A `patch` iteration — the TWO-STAMP ceremony for small, known-scope work (a bug fix, a
> tweak, one behavior, one PR). This ONE document is the ticket + TSD + task card + exec
> plan: your single `lane approve` stamp covers all of it (stamp 1 of 2; stamp 2 is the
> verification report at the end). The TDD ledger, Critic snapshot, and verify replay are
> unchanged — a patch removes redundant signatures, never proof.
> Too big for a patch? More than one story, more than ~3 behaviors, or more than one task
> → use `lane new fix` / `lane new enhancement` instead (agents: CALL THIS OUT when
> drafting; the human decides at the stamp).

**Severity:** minor
**Source:** user request — cosmetic enhancement

**Current behavior:** The page background is a flat neutral color (`--background` CSS variable, rendered via `bg-background` Tailwind class on the root `<div>` in `App.tsx`).
**Expected behavior:** The page background cycles through a smooth animated rainbow gradient (hue rotation across the full spectrum), visible behind the page content at all times in both light and dark modes.
**Must NOT change:** All existing UI layout, typography, card/component styling, dark-mode toggle, expense CRUD functionality, and API contracts remain unchanged.

## TSD S-0007.01 — Animated rainbow background

> Behavior + contracts ONLY — never the library/method/pattern. The Critic anchors to THIS
> section (snapshot frozen at `lane start`), exactly as it would to a TSD.md section.

| Aspect | Spec |
|--------|------|
| Interfaces | `App.tsx` root `<div>` className — `bg-background` replaced/augmented with a Tailwind-compatible rainbow gradient class or inline style; `index.css` gains the `@keyframes` animation |
| Data / State | None — purely presentational |
| Behavior | The full-viewport root element displays a continuously animating rainbow gradient background that cycles through the full hue spectrum (red → orange → yellow → green → blue → violet → red) on a smooth loop of ≈ 6 seconds |
| Boundaries | None — no external deps |
| Tests | Vitest + React Testing Library: assert the root `<div>` carries the expected rainbow class/style that encodes the gradient; assert the `@keyframes` animation name is present in the CSS |

## Task T-make-bg-rainbow-wqklfh — Animated rainbow background
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:**
- [ ] AC-1 [behavior]: The root `<div>` in `App.tsx` applies an animated rainbow gradient background visible in the rendered output
- [ ] AC-2 [invariant]: All existing App snapshot/render tests still pass — no layout or functionality regression
**Tests:** AC-1, AC-2 ← ordered; first = tracer bullet

## Execution Plan
> Approved BY the spec stamp: `lane start` copies this section verbatim into the worktree's
> exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last in this file.

**Approach:** Add a `rainbow-bg` CSS animation keyframe in `index.css` that rotates through hue angles using a `linear-gradient`, then apply the resulting utility class to the root `<div>` in `App.tsx` by replacing `bg-background` with a custom Tailwind class or adding a CSS class alongside it.
**Boundaries & mocks:** None — purely frontend CSS/TSX, no API calls.
**Behaviors (TDD order):**
- B-1: Root `<div>` carries rainbow gradient styling — write a failing test that asserts the rainbow class/animation is present on the root element, then add the CSS keyframe in `index.css` and apply the class in `App.tsx` to make it pass.
**Open questions:** none
