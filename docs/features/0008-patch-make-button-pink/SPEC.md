---
approved_by: "Samir dahal"
approved_at: "2026-08-24"
approved_sha256: "166db362fe46c77401e65e12f2329ad68d4f0614d0709dc7e9470e5b85cf8d22"
---
# Patch 0008 — Make all buttons pink

**Severity:** minor
**Source:** user request

**Current behavior:** All primary buttons display in green (HSL ~160° teal-green) in both light and dark themes.
**Expected behavior:** All primary buttons display in pink (HSL ~330° pink) in both light and dark themes.
**Must NOT change:** Button text readability (contrast ratio), dark-mode toggle behavior, all non-button UI elements, layout, and all existing functionality.

## TSD S-0008.01 — Primary button color changed to pink

| Aspect | Spec |
|--------|------|
| Interfaces | `--primary` and `--ring` CSS custom properties in `frontend/src/index.css` |
| Data / State | No runtime state; CSS-only change |
| Behavior | After the change, any element using `bg-primary` / `text-primary` / `ring-primary` (i.e., all primary buttons) renders with a pink hue (~330° HSL) in both `:root` (light) and `.dark` themes. Foreground text on pink buttons remains legible (white). |
| Boundaries | None |
| Tests | JSDOM computed-style test: assert `--primary` CSS variable value resolves to the pink HSL string in both `:root` and `.dark` |

## Task T-make-button-pink-l14gsl — Change --primary to pink in index.css
**Slice:** full vertical — CSS variable change + test that asserts the value is applied
**Acceptance criteria:**
- [ ] AC-1 [behavior]: `--primary` CSS variable in `:root` resolves to a pink hue (hue 330)
- [ ] AC-2 [behavior]: `--primary` CSS variable in `.dark` resolves to a pink hue (hue 330)
- [ ] AC-3 [invariant]: No other CSS variables are changed outside of `--primary` and `--ring`
**Tests:** AC-1, AC-2, AC-3

## Execution Plan

**Approach:** Update the two `--primary` (and `--ring`) entries in `frontend/src/index.css` from the current green hue to a pink hue. Write a JSDOM test that loads the stylesheet and asserts the CSS variable value.
**Boundaries & mocks:** None — pure CSS change, test reads computed style via JSDOM.
**Behaviors (TDD order):**
- B-1: Test asserts `--primary` in `:root` and `.dark` contains hue 330 (pink) — fails on green, passes after edit
**Open questions:** none
