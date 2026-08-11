---
approved_by: "Samir dahal"
approved_at: "2026-08-11"
approved_sha256: "8197d07a2086d7f58c3119fb24aeea0c44eb53c25c398bb0732199d201bd74b5"
---
# Patch 0004 — Switch app font to Roboto

**Severity:** minor
**Source:** user request — design preference

**Current behavior:** The app renders with the browser's default system font stack; no font family is declared in `index.html`, `index.css`, or `tailwind.config.ts`.
**Expected behavior:** The entire app renders in Roboto (400 and 700 weights) loaded from Google Fonts. The font applies to all text including headings, labels, buttons, and inputs.
**Must NOT change:** Colors, layout, spacing, component behaviour, API contracts, theme toggle, money formatting, or any existing Tailwind token values.

## TSD S-0004.01 — Roboto font applied site-wide

| Aspect | Spec |
|--------|------|
| Interfaces | `frontend/index.html` (link tag added to `<head>`); `frontend/src/index.css` (font-family set on `body` inside `@layer base`) |
| Data / State | none |
| Behavior | Every text node in the app uses Roboto at all viewport sizes and in both light and dark themes. The Google Fonts stylesheet is the sole source of truth for the typeface; no local font file is bundled. |
| Boundaries | Google Fonts CDN — not faked in tests (CSS-only change; jsdom cannot evaluate applied font faces) |
| Tests | Tests: N/A — styling: font-family is a CSS-only change applied through a `<link>` tag and `@layer base` rule; jsdom does not process external stylesheets or render fonts, making the declared font face untestable through the Vitest/jsdom stack |

## Task T-font-sm3asg — Apply Roboto font via Google Fonts
**Slice:** a complete observable behavior end-to-end + tests (full vertical)
**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
- [ ] AC-1 [behavior]: `frontend/index.html` `<head>` contains a `<link>` that loads Roboto (weights 400 and 700) from fonts.googleapis.com, and `frontend/src/index.css` sets `font-family: 'Roboto', sans-serif` on `body` inside `@layer base`.
**Tests:** N/A — styling: CSS-only change; jsdom cannot verify loaded font faces or applied external stylesheets

## Execution Plan

**Approach:** Two-file CSS/HTML-only edit — add a Google Fonts preconnect + stylesheet link to `index.html`; declare `font-family: 'Roboto', sans-serif` on `body` in `index.css`. No TypeScript, no component, no Tailwind config change needed.
**Boundaries & mocks:** none
**Behaviors (TDD order):**
- B-1: Add Google Fonts `<link>` to `frontend/index.html` and `font-family` declaration to `frontend/src/index.css`; visually confirm Roboto renders in the running app.
**Open questions:** none
