---
approved_by: "samir dahal"
approved_at: "2026-07-21"
planned_behaviors: 2
approved_sha256: "d8057aec73415adb2ea1a50135f64bc57fe5d2cdc17c11ef84660f168c1e478c"
---
## Exec Plan — Task T-006
> Authored during planning, before any code. ★GATE: DEV/SA approve via `lane approve` BEFORE any code (lane writes the stamp). Resolve all ambiguities first.

**Will build:** (mapped to each AC)
- **AC-1 (toggle + persist)** — a visible theme toggle that switches light/dark; the choice is stored client-side and re-applied on the next load.
- **AC-2 (polish, non-functional)** — the single-page layout already uses rounded card surfaces with subtle shadows, one accent color (emerald, via the shadcn tokens), and a considered type/spacing scale; this task ensures both themes are fully styled and the layout reads as premium. Verified by review, not a unit assertion.
- **AC-3 (e2e restyle)** — in the running app, toggling switches theme and every surface — background, text, accent, and the donut region — reflects the mode.

**Approach:** high-level only — NOT implementation prescription
- A `useTheme` hook owns the mode: it applies/removes the `dark` class on the document root (Tailwind `darkMode: ["class"]` is already configured) and persists the choice to browser-local storage; on load it reads the stored choice (default light). No server state.
- A `ThemeToggle` control in the header (accessible label reflecting the action) flips the mode.
- Surfaces already consume the shadcn CSS-variable tokens (`bg-background`, `bg-card`, `text-foreground`, `border`, `primary`), and `index.css` already defines both `:root` and `.dark` token sets — so toggling the root class restyles everything, including the summary card that hosts the donut. The donut's category palette is vivid accent colors that read on both backgrounds.
- Keep the existing layout; add spacing/typography refinements only where they raise polish without changing behavior.

**Boundaries & mocks:** (from TSD Boundaries)
- **Browser-local persistence** for the theme preference is the only boundary — REAL in tests (jsdom localStorage). No network involved.

**Behaviors (TDD order):** B-1 first (tracer bullet), then B-2 (the e2e)
- **B-1** (tracer): clicking the toggle flips light↔dark (the document root's `dark` class) and the choice persists — a fresh mount reads the stored preference and applies it. [frontend integration]
- **B-2** (e2e): in the running app, the toggle switches the theme and the app reflects it in both modes — the root class changes and the summary/donut region still renders correctly after switching. [frontend integration]

**PR will contain:**
- Frontend: `useTheme` hook, `ThemeToggle` component, header wiring in `App`; any small polish to spacing/typography; component tests for toggle + persistence + e2e restyle.

**Open questions / ambiguities:** (MUST be resolved before execution)
- None. Accent = emerald (already in the tokens); default = light; persistence = browser-local. System-preference auto-detect is out of scope (a later nicety), not required by the AC.

**Path:** L (lean, default)
**Escalation signals hit (≥2 → R):** none (ambiguities 0 · blast-radius low · no security · no amendments · no prior-fail · no self-flag)
**If overriding R→L:** n/a
- [ ] Refactor pass done (on green; tests unchanged) — before PR
