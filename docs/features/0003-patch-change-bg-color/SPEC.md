---
approved_by: "Samir dahal"
approved_at: "2026-08-20"
approved_sha256: "e9c1aa2df526c52c36a7d2c468e3f499939812974f8612a39c11f3650de5aa3b"
---
# Patch 0003 — Change app background color

**Severity:** minor
**Source:** UI improvement request — freshen the app's visual identity

**Current behavior:** The light-mode app background is `210 40% 98%` (near-white cool blue-tint) and the dark-mode background is `222 47% 8%` (very dark navy). These are the default shadcn/ui palette values.
**Expected behavior:** Light-mode background changes to a warm neutral `30 20% 97%` (warm off-white) and dark-mode background changes to `220 13% 10%` (soft dark neutral), giving the app a warmer, less sterile feel.
**Must NOT change:** All other CSS custom properties (foreground, card, primary, secondary, muted, accent, destructive, border, input, ring, radius) remain untouched. The `bg-background` Tailwind utility class continues to map to `--background` — no class names change.

## TSD S-0003.01 — Background color CSS variable update

| Aspect | Spec |
|--------|------|
| Interfaces | `frontend/src/index.css` — `:root { --background }` (light) and `.dark { --background }` (dark) CSS custom properties |
| Data / State | No runtime state; CSS variable change is static |
| Behavior | Light mode: `--background` resolves to HSL `30 20% 97%`. Dark mode: `--background` resolves to HSL `220 13% 10%`. All pages/components using `bg-background` or `hsl(var(--background))` reflect the new color automatically. |
| Boundaries | None — pure CSS, no external deps |
| Tests | Snapshot/value test: read `index.css`, assert the new HSL values appear for `--background` in both `:root` and `.dark` blocks |

## Task T-change-bg-color-tlouek — Update background CSS variable in light and dark themes

**Slice:** Full vertical — CSS change + a test that asserts the new values are present
**Acceptance criteria:**
- [ ] AC-1 [behavior]: `:root --background` equals `30 20% 97%` in `frontend/src/index.css`
- [ ] AC-2 [behavior]: `.dark --background` equals `220 13% 10%` in `frontend/src/index.css`
- [ ] AC-3 [invariant]: All other CSS custom properties in both `:root` and `.dark` blocks are unchanged
**Tests:** AC-1, AC-2, AC-3

## Execution Plan

**Approach:** Edit the two `--background` values in `frontend/src/index.css`. Write a test that reads the file and asserts the exact HSL strings for both light and dark modes.
**Boundaries & mocks:** None — the test reads the real file on disk.
**Behaviors (TDD order):**
- B-1: Test asserts `--background: 30 20% 97%` in `:root` and `--background: 220 13% 10%` in `.dark` — fails before the edit; passes after updating `index.css`.
**Open questions:** none
