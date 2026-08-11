---
approved_by: "Samir dahal"
approved_at: "2026-08-11"
approved_sha256: "eb04ae2d5e5bf8b19876894fd3646e0b64d8cea1b6d4d36cb04f027b217c2d8d"
---
# Patch 0005 — Change app background color to golden

**Severity:** minor
**Source:** design request — user preference for warmer golden background tone

**Current behavior:** The app background uses a cool blue-tinted neutral: `--background: 210 40% 98%` (light) and `222 47% 8%` (dark), giving the app a cold, bluish feel.
**Expected behavior:** The app background uses a warm golden hue: `--background: 43 80% 90%` (light) and `43 35% 14%` (dark). Both light and dark modes reflect the golden tone.
**Must NOT change:** All other CSS custom properties (primary, secondary, card, border, ring, foreground, etc.) remain untouched. Theme toggle behavior is unaffected. No other component styles change.

## TSD S-0005.01 — Golden background CSS variable

| Aspect | Spec |
|--------|------|
| Interfaces | `--background` CSS custom property in `frontend/src/index.css`, `:root` (light mode) and `.dark` (dark mode) selectors |
| Data / State | No runtime state — pure CSS variable change |
| Behavior | In light mode, `document.documentElement` resolves `--background` to an HSL value in the golden range (hue 40–50, saturation ≥ 70%, lightness ≥ 85%). In dark mode, `--background` resolves to an HSL value in the golden range (hue 40–50, saturation ≥ 30%, lightness ≤ 20%). |
| Boundaries | None — no external deps |
| Tests | Parse `index.css` and assert the `--background` values in `:root` and `.dark` match the expected golden HSL strings |

## Task T-background-color-up7t1m — Update --background to golden
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:**
- [ ] AC-1 [behavior]: `--background` in `:root` is `43 80% 90%` (golden light mode)
- [ ] AC-2 [behavior]: `--background` in `.dark` is `43 35% 14%` (golden dark mode)
**Tests:** AC-1, AC-2

## Execution Plan
> Approved BY the spec stamp: `lane start` copies this section verbatim into the worktree's
> exec-plan.md and carries your stamp onto it — no separate plan gate. Keep it last in this file.

**Approach:** Edit the two `--background` HSL values in `frontend/src/index.css` — one in `:root`, one in `.dark`. No component or config changes needed.
**Boundaries & mocks:** None — test parses the CSS file directly; no browser or bundler needed.
**Behaviors (TDD order):**
- B-1: Test reads `index.css`, asserts `--background` under `:root` equals `43 80% 90%`, and `--background` under `.dark` equals `43 35% 14%`. Test fails (current values differ). Then update the two values in `index.css` to make it pass.
**Open questions:** none
