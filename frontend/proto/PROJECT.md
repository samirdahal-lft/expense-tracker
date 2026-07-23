# proto/PROJECT.md — authoring constitution for Expense Tracker

Owned by humans + agents. NOT regenerated (that's CONTRACT.md). Update when the
vocabulary, components, or app change.

## Vocabulary
- App root: `frontend/` — where `proto/` lives (commands auto-discover it).
- Entry: `@/proto-vocab` — regenerate: `proto manifest --entry '@/proto-vocab'`
- Why this and not a package: the app has **no componentized design system** —
  no `components/ui/`, no shadcn CLI-generated files. Every screen (`AddExpenseForm.tsx`,
  `ExpenseList.tsx`, `App.tsx`, `ThemeToggle.tsx`) hand-applies Tailwind utility
  classes + CSS-variable tokens (`src/index.css`) inline. `src/proto-vocab.ts` is a
  **new** thin barrel (`src/components/proto-vocab/*.tsx`) that extracts those
  exact repeated patterns (card surface, primary/ghost button, labeled input,
  page header, inline error text) into named components, copied verbatim from
  the real files so the prototype is pixel-faithful. It is NOT yet wired into
  the shipped app — adopting it there would be a separate later decision.

## Component render-map
| Component | Use | How |
|---|---|---|
| `Card` | ✅ prop-only | `children` — rounded/border/shadow surface, matches every `App.tsx` section |
| `Button` | ✅ prop-only | `variant="primary"` (submit-style, from `AddExpenseForm.tsx`) or `variant="ghost"` (icon/secondary, from `ThemeToggle.tsx`) |
| `TextInput` | ✅ prop-only | `label` + standard input props — matches `AddExpenseForm.tsx`'s `inputClass` pattern |
| `PageHeader` | ✅ prop-only | `title` + optional `subtitle` — matches `App.tsx`'s header block |
| `ErrorText` | ✅ prop-only | `children` (string) — matches `AddExpenseForm.tsx`'s inline error paragraph |

All five are pure/presentational — no store, router, or data-fetch coupling.
Nothing needs to be avoided.

## Reuse the real renderers (don't approximate)
- Card surface → `Card` (`rounded-lg border bg-card p-6 shadow-sm text-card-foreground`,
  copied from `App.tsx`'s section wrappers).
- Primary action button → `Button variant="primary"` (`bg-primary ... text-primary-foreground`,
  copied from `AddExpenseForm.tsx`'s submit button).
- Secondary/icon button → `Button variant="ghost"` (`border border-border bg-card ...`,
  copied from `ThemeToggle.tsx`).
- Labeled field → `TextInput` (copied `inputClass` from `AddExpenseForm.tsx`).
- Page title block → `PageHeader` (copied from `App.tsx`'s `<header>`).
- Inline validation/API error → `ErrorText` (copied from `AddExpenseForm.tsx`).

## Shell
- File: `proto/shell/Shell.tsx` — wrap every screen: `<Shell>…</Shell>`.
- Built from: real markup, copied directly (not a stub) — `min-h-screen bg-background
  text-foreground` + `container max-w-5xl py-10`, exactly `App.tsx`'s outer frame.
- This app has **no persistent nav/sidebar** (it's a single dashboard page), so the
  shell is just the consistent background + container every screen (auth or
  authenticated) sits inside — there is no `active` nav-item prop to pass.

## Styling
- Real stack: **Tailwind v3** (`frontend/tailwind.config.ts`, JS theme) + CSS-variable
  tokens in `frontend/src/index.css` (HSL triplets, e.g. `--primary: 160 84% 39%`,
  consumed as `hsl(var(--primary))` by the v3 Tailwind config).
- proto runs Tailwind v4. Rather than a `@config` JS-preset bridge (the v3 config
  is just static color/radius mappings, no complex logic), `proto/styles.css` was
  rewritten to define the **same tokens directly as complete `hsl(...)` values**
  (e.g. `--primary: hsl(160 84% 39%);`) so v4's native `@theme inline` block can
  alias them 1:1 (`--color-primary: var(--primary);`). Both `:root` and `.dark`
  blocks are copied from `src/index.css` — accent color is the emerald green
  (`hsl(160 84% 39%)` light / `hsl(158 74% 46%)` dark), not the generic
  black-and-white shadcn default that was there before this setup pass.
- `@source '../src/**/*.{ts,tsx}'` included so any real-source Tailwind usage is
  still scanned if needed.
- Keep `src/index.css` and `proto/styles.css`'s token blocks in sync if the real
  palette ever changes (there's no single source of truth between them yet —
  flagged here so a future edit to one isn't forgotten in the other).

## Mock data
- No fixtures yet. Auth screens (Register/Login) should use local component state
  for form fields and a fake async delay + hardcoded error cases (e.g. "duplicate
  account", "invalid credentials") — there is no backend for auth yet; this
  prototype precedes the TSD/implementation entirely.

## Visual ground truth — judge against this
- **No live app and no reference screenshots were available in this session**
  (headless environment, no browser/Playwright tooling; `proto/references/` only
  had its scaffolded `README.md`). Fidelity here is **code-reading only**: every
  vocab component's classes were copied verbatim from the real `.tsx` files
  listed above, and the token values were copied verbatim from `src/index.css`.
  Before treating the prototype as final, a human should run `proto dev` locally
  (with a real browser) and eyeball it against the actual running app
  (`npm run dev` in `frontend/`) side by side.
- If real screenshots of a target auth UX (even from another product, for
  inspiration) become available, drop them in `proto/references/` and update
  this section.
