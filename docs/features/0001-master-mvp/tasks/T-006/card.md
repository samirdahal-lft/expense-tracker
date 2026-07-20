---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "9cb658bf5df2a2ec7db728d4f298a75348cfe8413694a171e57b87b4b260dce4"
---
## Task T-006 — Premium, themed UI
**Parent:** story S-0001.05 · feature 0001-master-mvp (docs/features/0001-master-mvp-*/ — its PRD + TSD)
**Slice:** full vertical theming path — a theme toggle whose choice persists and restyles every surface (incl. the donut chart) in the running app, over a polished single-page layout.
**Acceptance criteria:** (tag each `behavior`/`invariant`/`non-functional`/`e2e`)
- [ ] AC-1 [behavior]: A visible control toggles light/dark mode; the chosen mode persists across a page reload.
- [ ] AC-2 [non-functional]: Single-page layout uses rounded card surfaces with subtle shadows, one consistent accent color, and a considered type/spacing scale.
- [ ] AC-3 [e2e]: Through the running app, switching theme restyles every surface — background, text, accent, and the donut chart — correctly in both modes.
**End-to-end AC:** AC-3 [e2e] — reachable through the running app.
**Tests:** AC-1, AC-3  ← ordered; AC-1 = tracer bullet (toggle flips + persists). AC-2 is visual polish — verified by review, not a unit assertion.
**Test scope:** frontend `*.test.tsx` (toggle flips mode + persists across reload; chart colors resolve in both modes)
**Done =** reviewable PR, all tests pass, links to chain. One PR per task (default).
