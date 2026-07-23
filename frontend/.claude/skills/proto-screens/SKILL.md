---
name: proto-screens
description: Author clickable prototype screens with proto. Use when asked to build, add, or iterate on a prototype, flow, screen, or mockup in a repo that has a proto/ directory. Composes screens from the design-system catalog and self-verifies with the consistency lint.
---

# Authoring proto screens

Prototype screens live under `proto/<flow>/screens/`. Every screen must compose
**only** components from the design-system catalog — never hand-styled markup,
never invented components. This is enforced; a hand-styled screen fails the lint
hook and you'll be asked to fix it.

**One exception: the shell.** proto-setup builds the app chrome once at
`proto/shell/Shell.tsx` (sidebar/top bar/page frame — see `proto/PROJECT.md`).
Wrap every screen's body in it so screens sit in the real frame:
```tsx
import { Shell } from '../../shell/Shell'
export function Component() {
  return <Shell active="dashboard">{/* catalog components only */}</Shell>
}
```
The shell may contain hand-styled markup — it lives outside `screens/`, so the
lint never touches it. Your screen body still must be catalog-only. If no shell
exists yet, run proto-setup (or build one there); don't hand-roll chrome inside a
screen.

## Command context

proto finds its workspace automatically by walking up to the nearest `proto/`,
so run commands from anywhere inside the app — no root to pass. `--file` paths
are relative to that app root, e.g. `proto/<flow>/screens/Home.tsx`. (Only pass
`--root <appRoot>` in the rare case discovery can't reach the workspace.)

## The loop

1. **Catalog is fresh.** If `proto/manifest.json` is missing or the design system
   changed, regenerate it:
   - greenfield: `proto kit` then `proto manifest --entry @/components/kit`
   - brownfield: `proto manifest --entry <their DS>` (scope big DSes with
     `--include 'Button,Card,TextField'`)

2. **Read the brief.** Read `proto/CONTRACT.md` — the rules you author under.
   Then read `proto/PROJECT.md` if it exists — the project constitution that
   proto-setup wrote: the real vocabulary (and why), the component render-map
   (which need props like `disableTooltip` to render, which to avoid), the
   cell/renderer reuse map, the styling notes, and **how to reach the real screen
   to judge against**. This is what lets you match the product instead of
   approximating it — follow it, and keep it current if you learn something new.
   **Look in `proto/references/`** too — committed real-app screenshots, mockups,
   and vertical patterns (dashboard/table/form…) the prototype should look like.
   These are durable inspiration (not the throwaway `.screenshots/`), and the
   primary visual ground truth whenever the live app can't be run. Open the
   relevant ones before authoring and match them.

3. **Pull only what you need.** Don't read the whole manifest into context. Use
   `proto catalog Button Card TextField` to print just those components' import
   paths, props (with allowed union values), and examples.

4. **Author screens.** Each `Screen.Component` wraps its body in the `Shell`
   (`proto/shell/Shell.tsx`) and composes catalog components inside it. Wire
   navigation with proto's flow API, not styling:
   ```tsx
   import { Link, useFlow } from '@robusgauli/proto'
   <Link to="next"><Button>Continue →</Button></Link>
   ```
   Define the flow (id, title, ordered screens) in `proto/<flow>/index.ts`.

   **Log drift as you create it.** A prototype deliberately departs from the
   real app — it stubs the chrome in `Shell`, fakes data in `data.ts`, defangs
   coupled components (`disableTooltip`, `interactive={false}`, a prop-only nav
   sibling), and skips loading/error/empty states. Each departure is a *drift* a
   coding agent must close when wiring the mockup into the app. **Record it the
   moment you make it**, in `proto/<flow>/INTEGRATION.md` — copy the structure
   from `proto/INTEGRATION.template.md` the first time a flow needs it, then
   append one `### DRIFT-NN · <category> · <severity>` entry per departure. Live
   logging is lossless; reconstructing drift at the end is not — you'll forget
   the defang you made twenty edits ago. This doc is *behavior* fidelity, the
   complement to `PROJECT.md`'s *component* fidelity.

   When you create the file, **fill §0 "Product intent" from the brief** — what
   you're building, the problem it solves, who it's for, the core journey. This
   is the prototype's inception; capture the "why" now, while it's fresh, so the
   doc can later seed a PRD. Don't take it literally or pad it — a sentence or
   two per item, concrete.

5. **Verify — do not skip.** While authoring,
   `proto lint --file proto/<flow>/screens/<Screen>.tsx` for a fast per-file
   check (the PostToolUse hook also runs this on every write). When
   the flow is done, run **`proto verify`** — the definition-of-done gate. It
   lints every screen, typechecks them (catches what the lint can't — an invalid
   prop value `variant="huge"` is a type error, since the catalog's allowed
   values come from the design system's types), **and gates the drift ledger:
   any flow with screens must have `proto/<flow>/INTEGRATION.md` with a filled §1
   Screen → app map.** A missing or still-template ledger fails verify. The
   PostToolUse hook also nudges you whenever a screen edit outpaces its ledger.
   Fix until it passes.

6. **See it + run the quality checklist.** `proto dev` runs the playground.
   To *read* a screen's state, prefer `browser_snapshot` (accessibility tree, no
   file written). Take a screenshot only when a visual diff is the point — and
   when you do, **write it to a scratch dir, never the repo root** (use your
   session scratchpad, or `proto/.screenshots/` which is git-ignored). Delete
   verification shots once the check is done; they are ephemeral, not artifacts.
   Check the screen against the intent **and the §"Quality checklist" below**,
   side by side with the visual ground truth — the §1g screenshot in
   `proto/PROJECT.md`, or the images in `proto/references/` when there's no live
   capture. Iterate until they match.

7. **Reconcile drift.** Before shipping, open the real screen via the access
   path in `proto/PROJECT.md` and diff it against the mockup. Confirm every
   departure is in `proto/<flow>/INTEGRATION.md` and add any you logged in your
   head but not on disk — a faked data source, a defanged prop, a skipped state,
   the `Shell` stub standing in for the real layout. This pass catches the drift
   live-logging missed; it is what lets a coding agent integrate the mockup
   without rediscovering every gap.

8. **Ship.** `proto package` → `dist/prototype.html`, one self-contained file.

## Quality checklist — judge before you call it done

`proto verify` is the **structural** gate (no raw styling, on-catalog imports,
valid prop values). It cannot see whether a screen *looks and behaves* right —
that's this checklist. It's a **soft gate**: not lint-enforced (most items live
inside the design-system components or need a render to judge), so you run it
yourself against the live screen + the real screenshot before declaring a flow
done. Most items should already pass *because* you composed real components —
treat a failure as a signal you approximated something instead of reusing it.

- **No emoji as icons.** Emoji standing in for an icon (🔍 ✅ ⚙️) reads as a
  placeholder. Use the app's real icon set (the one the catalog/components use).
  Emoji inside actual content (a chat message, a reaction) is fine.
- **Clickables look clickable.** Anything that navigates or acts shows
  `cursor: pointer` and a hover state. proto's `<Link>` and most catalog buttons
  handle this — if you hand-built a hotspot, give it the affordance.
- **Interactive states exist.** Hover, focus-visible, disabled, and (where it
  applies) selected/active. Inherited from real components; verify the shell and
  any custom bits have them too.
- **Contrast is legible.** Text over its background ≥ 4.5:1 (≥ 3:1 for large
  text). Watch text on images, on brand color, and in the hand-built shell.
- **Responsive at the target widths.** Check the screen at 375 / 768 / 1024 /
  1440 — no overflow, no clipped tables, no broken layout at the size the
  prototype will be shown at.
- **Motion is restrained + respects `prefers-reduced-motion`.** Transitions in
  the 150–300ms range; nothing that flashes or won't stop.
- **It matches the real screen.** The biggest gaps (a pill where the product has
  a progress bar) are the ones a screenshot diff makes obvious — close them.

## Multi-screen flows — fan out

For a flow of several screens, author them in parallel: spawn one subagent per
screen, each given **only** its `proto catalog <Names…>` slice and the rules
from `proto/CONTRACT.md` as its brief. Keeps each authoring context tight and
on-vocabulary. Then collect the screens, wire `proto/<flow>/index.ts`, and run
`proto verify` once as the gate over the whole flow.

## Composing a real (local) design system

When the catalog is the project's own components (not a packaged UI kit), this
is where a prototype goes from "same product" to "looks generic". Handle these
as you author, not after:

- **Reuse the real renderers — do NOT approximate them.** This is the single
  biggest fidelity lever. If the app renders a status cell as a colored progress
  bar, a row as a specific card, a chip a certain way, find that exact
  component/function (often a `cells.tsx`, `renderX`, or column helper next to
  the table) and use it with mock data. Approximating it with a generic catalog
  primitive — a `<Badge>` pill standing in for a real progress-bar `StatusCell` —
  is exactly what makes a screen read as a lookalike instead of the real thing.
  Mirror the app's own column/cell code; it's usually a few lines.
- **Don't abandon a component just because it looks coupled — try to defang it
  first.** A rich cell may *look* store/tooltip/router-bound, but often exposes
  props that turn the coupling off (`disableTooltip`, `interactive={false}`,
  `showActionButton={false}`, or just passing the data it would otherwise fetch).
  Read its props before giving up. Only when it genuinely can't render standalone
  (a nav `<Tab>` that hard-requires a `<Router>`, *"NavLink outside a Router"*)
  fall back to a prop-only sibling that gives the same look. Catch breakage early
  by rendering in `proto dev` (step 6) — don't wait for `proto package`.
  - **A `global is not defined` or "missing init" crash is NOT coupling — it's a
    setup gap.** Some deps (e.g. `react-dates` behind a `DatePicker`) need a
    one-time `import 'react-dates/initialize'` before mounting. Don't drop the
    component: add the init line to **`proto/setup.{ts,js}`** (proto runs it first
    and bundles it into the packaged HTML). See the proto-setup skill's playground
    prelude note.
- **Data-driven components need realistic mock data.** A `<Table>`/list that
  takes `columns` + `data`, a cell/card that takes a typed object — build a small
  typed fixture in `proto/<flow>/data.ts` shaped to the component's real props
  (read the type), and import it into the screens. Keep it shared so screens in a
  flow stay consistent.
  - **Type a prop with its real type, not `any`.** `import type` from a
    non-visual dep is allowed by the lint (e.g.
    `import type { ColumnDef } from '@tanstack/react-table'` to type a `<Table>`'s
    `columns`) — type imports are erased at compile time, so they're exempt. If
    you need a **runtime** non-visual dep, add it to `proto/manifest.json`'s
    `ignore` (or `proto manifest … --ignore <pkg>`); visual components still come
    from the catalog.
- **Judge against the real thing.** Use the access path in `proto/PROJECT.md`
  (run command, route, auth) to open the real screen, screenshot it into
  `proto/.screenshots/` (git-ignored — not committed), and put it
  beside yours. The gaps you can't see from code (a pill where there should be a
  progress bar) are obvious side by side. Close the biggest one first.

## When the catalog lacks something

Do **not** inline it or pull in another UI library. Add the component to the
design system / kit once, re-run `proto manifest`, then use it. One new need →
one catalog addition → still one vocabulary.
