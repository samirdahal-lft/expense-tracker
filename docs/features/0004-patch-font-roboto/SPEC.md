---
approved_by: "Samir dahal"
approved_at: "2026-08-20"
approved_sha256: "22695c188c4e8779854b1560b12aa03bf181bac0a89ec39caacbf4d759c916ce"
---
# Patch 0004 — Switch app font to Roboto

**Severity:** minor
**Source:** user request — visual/branding preference

**Current behavior:** The app uses the browser/OS default sans-serif font; no custom font is declared in the Tailwind config or index.css.
**Expected behavior:** All UI text uses the Roboto font (loaded from Google Fonts), applied globally via Tailwind's `fontFamily` config as the default sans-serif.
**Must NOT change:** Tailwind theme token names, shadcn/ui component markup, color tokens, all backend code, all existing tests.

## TSD S-0004.01 — Global Roboto font via Tailwind

| Aspect | Spec |
|--------|------|
| Interfaces | `tailwind.config.ts` → `theme.extend.fontFamily.sans`; `index.css` → Google Fonts `@import` |
| Data / State | None |
| Behavior | Every element that inherits Tailwind's `font-sans` (the default) renders in Roboto; fallback chain: `Roboto, ui-sans-serif, system-ui, sans-serif` |
| Boundaries | Google Fonts CDN (external) — not faked in tests |
| Tests | Vitest + jsdom: assert `tailwind.config.ts` exports `fontFamily.sans` that starts with `'Roboto'`; assert `index.css` contains the Google Fonts `@import` for Roboto |

## Task T-font-roboto-5e9716 — Switch app font to Roboto

**Slice:** font configured globally + tests prove both config entries
**Acceptance criteria:**
- [ ] AC-1 [behavior]: `tailwind.config.ts` `theme.extend.fontFamily.sans` array starts with `'Roboto'`
- [ ] AC-2 [behavior]: `index.css` contains a Google Fonts `@import` URL for Roboto
**Tests:** AC-1, AC-2

## Execution Plan

**Approach:** Add Google Fonts `@import` to `index.css` and extend `tailwind.config.ts` with `fontFamily.sans = ['Roboto', ...]`; no component edits needed.
**Boundaries & mocks:** None — tests inspect the config file text and CSS file text directly; no network call needed.
**Behaviors (TDD order):**
- B-1: Tailwind config exports Roboto as the first sans-serif font
- B-2: index.css imports Roboto from Google Fonts
**Open questions:** none
