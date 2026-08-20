## TSD S-0004.01 — Global Roboto font via Tailwind

| Aspect | Spec |
|--------|------|
| Interfaces | `tailwind.config.ts` → `theme.extend.fontFamily.sans`; `index.css` → Google Fonts `@import` |
| Data / State | None |
| Behavior | Every element that inherits Tailwind's `font-sans` (the default) renders in Roboto; fallback chain: `Roboto, ui-sans-serif, system-ui, sans-serif` |
| Boundaries | Google Fonts CDN (external) — not faked in tests |
| Tests | Vitest + jsdom: assert `tailwind.config.ts` exports `fontFamily.sans` that starts with `'Roboto'`; assert `index.css` contains the Google Fonts `@import` for Roboto |
