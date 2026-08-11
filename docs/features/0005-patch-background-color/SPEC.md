---
approved_by: "Samir dahal"
approved_at: "2026-08-11"
approved_sha256: "ca130eace0e53d5d72e28c301b3851647bc48e45f5ca5ceea4239befc40f2dd2"
---
# Patch 0005 — Change app background color to golden

**Severity:** minor
**Source:** user request — design preference

**Current behavior:** The app background is a near-white cool blue (`--background: 210 40% 98%` in light mode, `222 47% 8%` in dark mode). All surfaces inherit this neutral tone.
**Expected behavior:** The app background uses a golden/warm-amber hue in light mode (`--background: 45 80% 85%` — a soft warm gold) and a deep golden-brown in dark mode (`--background: 40 40% 10%`). All surfaces that derive from `bg-background` update automatically via the existing Tailwind token.
**Must NOT change:** Layout, spacing, font, primary/secondary/muted/destructive token values, component logic, API contracts, or theme toggle behaviour. Card, border, and foreground tokens stay unchanged.

## TSD S-0005.01 — Golden background via CSS variable

| Aspect | Spec |
|--------|------|
| Interfaces | `frontend/src/index.css` — `--background` HSL value in `:root` (light) and `.dark` |
| Data / State | none |
| Behavior | Opening the app in either light or dark theme shows a golden/warm-amber background. All components that use `bg-background` or the `background` Tailwind token reflect the new colour without any per-component change. |
| Boundaries | none |
| Tests | Tests: N/A — styling: CSS variable change; jsdom does not apply external stylesheets or render computed colours, making the golden background untestable through the Vitest/jsdom stack |

## Task T-background-color-4g84va — Apply golden background CSS variable
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior]: `frontend/src/index.css` `:root` has `--background: 45 80% 85%` and `.dark` has `--background: 40 40% 10%`; the running app shows a warm golden background in both themes.
**Tests:** N/A — styling: CSS variable change; jsdom cannot verify computed background colours

## Execution Plan

**Approach:** Single-file CSS edit — update the `--background` HSL value in `:root` and `.dark` inside `frontend/src/index.css`. No component, TypeScript, or Tailwind config change required; the token propagates automatically.
**Boundaries & mocks:** none
**Behaviors (TDD order):**
- B-1: Update `--background` in `frontend/src/index.css` (`:root` → `45 80% 85%`; `.dark` → `40 40% 10%`); visually confirm the golden background in the running app under both themes.
**Open questions:** none
