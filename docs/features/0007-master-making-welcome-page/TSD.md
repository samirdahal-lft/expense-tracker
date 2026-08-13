---
approved_by: "Samir dahal"
approved_at: "2026-08-13"
approved_sha256: "63a46d544493d62e1c7dad648f98a0938f7166c9395049e963a1daa8ce6af44f"
---
# TSD 0007 — Welcome page for Expense Tracker

## TSD S-0007.01 — Welcome page with entry CTA  (PRD §S-0007.01)
| Aspect | Spec |
|--------|------|
| Interfaces | `main.tsx` renders a root shell component that holds `view` state (`"welcome" | "tracker"`). `WelcomePage` component accepts one prop: `onStart: () => void`. `App` component gains one optional prop: `onHome?: () => void` (called when the user navigates back). |
| Data / State | Root shell: `view: "welcome" | "tracker"`, initial value `"welcome"`, held in React state (session-scoped, not persisted). Switching view does not unmount `App` — `App` stays mounted to preserve loaded expense data. |
| Behavior | On initial render, `view === "welcome"`: `WelcomePage` is visible, `App` is hidden (CSS display or conditional render). `WelcomePage` displays the app name "Expense Tracker", a short tagline, and a "Get Started" button. Clicking "Get Started" sets `view = "tracker"`: `WelcomePage` is hidden, `App` becomes visible. No network call is triggered by the view switch. |
| Access | End-user click on "Get Started" button |
| Boundaries | None |
| Tests | Integration (Vitest + RTL): assert `WelcomePage` renders on mount; assert "Get Started" button present; assert clicking it calls `onStart`; assert app name and tagline text are present. |

## TSD S-0007.02 — Return to welcome via header link  (PRD §S-0007.02)
| Aspect | Spec |
|--------|------|
| Interfaces | `App` uses the `onHome?: () => void` prop. When defined, a "Home" button is rendered in the header (alongside the existing `ThemeToggle`). Clicking it calls `onHome()`. |
| Data / State | Root shell sets `view = "welcome"` when `onHome` is called. `App` remains mounted — `useExpenses` / `useSummary` hook state is preserved across the view switch. |
| Behavior | When `view === "tracker"` and user clicks "Home": `view` becomes `"welcome"`, `WelcomePage` is shown, `App` is hidden. When user clicks "Get Started" again: `view` becomes `"tracker"`, `App` re-appears with previously loaded data still present (no re-fetch triggered by the view switch alone). |
| Access | End-user click on "Home" button in the tracker header |
| Boundaries | None |
| Tests | Integration (Vitest + RTL): render root shell; click "Get Started" to enter tracker; assert "Home" button present in header; click "Home"; assert welcome screen visible again; click "Get Started"; assert tracker visible and expense data hooks not re-initialised (mock reload not called again). |
