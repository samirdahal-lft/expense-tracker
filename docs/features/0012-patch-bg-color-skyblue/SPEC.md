---
approved_by: "Samir dahal"
approved_at: "2026-08-25"
approved_sha256: "26757c2ac5cf0e0dfa4d69614224ad44b3c7badd734fa637916760b286037727"
---
# Patch 0012 — Default background colour: sky blue

**Severity:** minor
**Source:** user request — change the platform's default background from animated rainbow to solid sky blue

**Current behavior:** The app root div carries a `rainbow-bg` CSS class that applies an animated multi-colour gradient, overriding the `--background` CSS custom property entirely. The static `--background` token (`30 20% 97%`) is never visible.
**Expected behavior:** The platform background is a solid sky-blue colour (`200 100% 70%` in HSL) both in light mode and dark mode (same hue, slightly muted for dark). No animation runs. The `rainbow-bg` class and its `@keyframes rainbow-shift` rule are removed.
**Must NOT change:** Tailwind card/section backgrounds (`bg-card`), foreground text colours, the `ThemeToggle` functionality, existing component layout, or any backend behaviour.

## TSD S-0012.01 — Sky-blue default background

| Aspect | Spec |
|--------|------|
| Interfaces | `frontend/src/index.css` — CSS custom property `--background` in `:root` and `.dark`; `frontend/src/App.tsx` — root `<div>` className |
| Data / State | No runtime state change — purely a styling constant |
| Behavior | On page load the full-page background renders as solid sky blue (`hsl(200, 100%, 70%)` light; `hsl(200, 60%, 25%)` dark). No animation plays. Removing the browser's prefers-color-scheme or toggling via `ThemeToggle` switches to the dark-mode variant. |
| Boundaries | None — no external deps faked in tests |
| Tests | Vitest + @testing-library/react: assert the root `<div>` in `App` does NOT have `rainbow-bg` class; assert it has `bg-background` class; assert `:root` CSS custom property `--background` resolves to the sky-blue value via `getComputedStyle` (or via a snapshot of `index.css` content). |

## Task T-bg-color-skyblue-3hkota — Replace rainbow background with solid sky blue

**Slice:** end-to-end: CSS variable update + class removal + test coverage
**Acceptance criteria:**
- [ ] AC-1 [behavior]: Root `<div>` in `App` no longer carries the `rainbow-bg` class
- [ ] AC-2 [behavior]: `--background` CSS custom property in `:root` is set to `200 100% 70%` (sky blue HSL)
- [ ] AC-3 [behavior]: `.dark` variant sets `--background` to `200 60% 25%` (muted sky blue)
- [ ] AC-4 [invariant]: `rainbow-bg` class and `@keyframes rainbow-shift` are removed from `index.css`
- [ ] AC-5 [non-functional]: No animation runs on the background in any theme
**Tests:** AC-1, AC-2, AC-4

## Execution Plan

**Approach:** Update the `--background` CSS custom property for both `:root` and `.dark` in `index.css` to sky-blue HSL values; remove the `.rainbow-bg` rule and its `@keyframes` block from `index.css`; remove the `rainbow-bg` class from the root `<div>` in `App.tsx`.
**Boundaries & mocks:** none — pure CSS/JSX change, no API or backend involved
**Behaviors (TDD order):**
- B-1: Test asserts root `<div>` lacks `rainbow-bg` class (fails while class is present) → remove `rainbow-bg` from `App.tsx` → test passes
- B-2: Test asserts `index.css` does not contain the string `rainbow-bg` or `rainbow-shift` (fails while rules exist) → delete those rules from `index.css` and update `--background` to sky-blue → test passes
**Open questions:** none
