---
name: proto-setup
description: Bootstrap proto in a repo. Use when the user wants to set up, install, initialize, or get started with proto/prototyping, or asks to "set up proto". Explores the project's real UI architecture, confirms with the user, then wires everything up so the proto-screens skill can author screens that look like the real app.
---

# Bootstrapping proto

Goal: get the repo from "proto is installed" to "an agent can author consistent
screens **that look like the real app**" — a populated `proto/manifest.json`, a
wired lint, the real theme rendering, and the `proto-screens` skill ready.

The whole job hinges on one decision: **what is the design system?** — i.e. what
vocabulary should screens compose from. Get this wrong and every screen looks
nothing like the product. So do not guess from dependency names. **Determine it
from evidence in the codebase.**

## The core principle

> The design system is **what the UI is actually built from**, not what's listed
> in `package.json`.

A repo can have `@some/ui-kit` in its dependencies and barely use it — the real
screens are built from a local `components/` library + Tailwind utilities. Or it
has five UI packages and a homegrown wrapper layer on top. Dependency names are a
hint, never the answer. **Measure usage. Read real screens. Then decide.**

## 1. Explore the UI architecture (don't shortcut this)

Spend real effort here. If the repo is large, dispatch an exploration subagent
with the explicit task below; otherwise do it inline.

**1a. Find the UI app root (monorepo-aware).** proto is app-root scoped. The app
root is the directory that owns the frontend's `package.json`, `node_modules`,
`tsconfig.json`, styling config, and `proto/`. In a monorepo that's usually a
subdir, not the repo root — look for the package that holds the actual app: a
`package.json` with `react`/`vue`/`svelte` + a bundler (`vite`/`next`/`webpack`)
and a `src/`. Common spots: `app/`, `apps/web/`, `packages/web/`, `frontend/`,
`client/`. Run `proto init` from this directory (or `proto --root <appRoot>
init`) — that plants the `proto/proto.json` marker. Afterwards every command
discovers the workspace by walking up to it, so you can run them from anywhere
inside the app.

**1b. Inventory every component source.** List the candidates:
- local component libraries: `src/components/`, `components/`, `components/ui/`,
  `components/common/`, a `design-system`/`ui` workspace package, barrels
  (`index.ts` re-exporting many components).
- UI packages in `dependencies`: MUI, Chakra, Ant, Mantine, react-bootstrap,
  shadcn (radix + cva + tailwind-merge), or an in-house published package.

**1c. Measure real usage — this is decisive.** For each candidate, count how
often it's actually imported across the app's screens/pages:
```bash
grep -rEo "from '@some/ui-kit'" src | wc -l
grep -rEo "from '\$?/?components/[^']*'" src | wc -l   # local components
```
A package imported a handful of times while local components are imported
everywhere → **the local components are the design system; the package is
vestigial** (often just an `Avatar` or an icon set). Rank candidates by usage,
not by being in `dependencies`.

**1d. Read real screens to confirm the building blocks.** Open 2–3 actual pages
(find the router/route config, then a list/table/dashboard page). See what they
literally compose — `<Table>`, `<Badge>`, `<Card>` from where? The imports at the
top of a real screen are ground truth for the vocabulary. If you can run the app,
look at a rendered screen too.

**1e. Identify the styling system + version.** This decides whether screens will
render in the real visual language:
- Tailwind? Which major — **v3** (a `tailwind.config.{js,cjs,ts}` with a JS
  theme/preset) or **v4** (CSS-first, `@theme` in CSS)? proto ships Tailwind v4.
  A v3 consumer theme must be bridged (see §4); v3-only plugins (e.g.
  `@tailwindcss/line-clamp`) crash under v4 and must be dropped.
- Sass/SCSS, CSS Modules, CSS-in-JS, or design tokens? Note the global
  stylesheet and any custom theme/preset file (computed colors, etc.).

**1f. Note the path aliases.** Read `tsconfig.json` `compilerOptions.paths`
(`@/`, `$/`, or custom) and `baseUrl`. Local-component vocabularies import via
these, and so do the components' own internal imports. proto ≥ 0.3.1 mirrors the
consumer's tsconfig `paths` as Vite aliases automatically, so they resolve in the
playground — but you still need to know them to write correct import paths. (On
older proto, a local DS whose components cross-import via a non-`@` alias won't
resolve — upgrade.)

**1g. Capture the visual ground truth — ASK the user.** Screens only end up
looking like the product if you can *see* the product. Reading code tells you the
vocabulary; it does not tell you that a status cell is a colored progress bar
rather than a plain pill. So ask:

> "Can I run the app to see the real screens, and is Playwright (or any
> screenshot tool) available? If so, how do I reach a representative screen —
> start command, URL/route, and any login? **If not — no Playwright, can't run
> the app — you can instead drop screenshots of the real screens (or mockups)
> into `proto/references/`; I'll match those.**"

If yes: run it, navigate to a representative screen (the one the prototype will
most resemble), and screenshot it with Playwright MCP **into `proto/.screenshots/`**
(git-ignored by `proto init` — keeps these throwaway diff aids out of commits).
This screenshot is the
bar proto-screens authors and judges against. **Record the exact access path**
(run command, route, auth) — you'll write it into `PROJECT.md` (§6) so the next
agent reproduces the same fidelity without re-discovering it.

**If the app can't be run, the fallback is `proto/references/`** (a committed dir
`proto init` scaffolds — *not* throwaway like `.screenshots/`). Ask the user to
drop screenshots of the real screens, mockups, or target vertical patterns there.
Treat whatever is in `references/` as the visual ground truth in place of a live
capture, and point `PROJECT.md`'s "Visual ground truth" section at it. Only if
*neither* a live app *nor* any reference image exists does fidelity fall back to
code-reading alone — say so plainly in `PROJECT.md`.

## 2. Classify

From the evidence, pick the vocabulary source:

- **Named UI library** (MUI/Chakra/Ant/Mantine/bootstrap, genuinely used
  everywhere) → entry is the package; scope big ones with `--include`.
- **Local / in-house design system** (a `components/` library that the screens
  actually compose — *with or without* a UI package also in deps) → entry is the
  local components. **This is the most common real-world case and the one easiest
  to get wrong.** See §4 for how to point the manifest at scattered local files.
- **shadcn/ui** → their copied components, e.g. `@/components/ui`.
- **Greenfield** (no real component layer, few/no screens) → scaffold a kit.

When a UI package *and* a dominant local layer both exist, the local layer wins —
the package is a detail (re-export the one or two bits actually used, see §4).

## 3. Confirm with the user — show your evidence

Don't just state a conclusion; show what you found so they can correct it:
- the import-usage counts (package vs local), and the chosen vocabulary source +
  exact **entry** screens will import from
- a sample real screen and the components it composes
- the styling system + version, and any bridge needed (e.g. "Tailwind v3 preset →
  proto-local v4 config")
- the working set for big libraries (`--include 'Button,Card,…'`)
- that proto will auto-install its tooling deps (`ts-morph`, `eslint`,
  `typescript-eslint`) on first use, and that you'll write/append config

Ask, then proceed.

## 4. Set up

Init from the app root found in §1a (it plants `proto/proto.json`); after that
every command discovers the workspace, so run them from anywhere in the app.

1. **Init** (if no `proto/` yet): `proto init --preset <tailwind|material|shadcn|plain>`.
   Plants `proto/proto.json` + `proto/styles.css`; it ships **no sample flow**,
   so `proto dev` opens on the **Catalogue** view (empty until the manifest is
   built — see §7), and a fresh workspace passes `proto verify` cleanly.
2. **Vocabulary:**
   - named library → `proto manifest --entry <pkg> [--include '<working set>']`
   - greenfield → `proto kit` then `proto manifest --entry @/components/kit`
   - **local / in-house DS** → the components are usually spread across many files
     with per-component barrels and no single root barrel. Create a **curated
     vocabulary barrel** that re-exports the pieces worth prototyping with, and
     point the manifest at it:
     ```ts
     // src/proto-vocab.ts — re-export the app's real presentational components
     export { default as Table } from '$/components/common/table'
     export { default as Badge } from '$/components/common/badge'
     export { Avatar } from '@some/ui-kit'   // fold in the one package bit used
     ```
     `proto manifest --entry '$/proto-vocab'` (use the repo's own alias).
     **Scope to components that render from props alone.** Components wired to a
     store/router/data-fetch (a `<Tab>` that needs a `<Router>`, a cell that reads
     Redux) crash standalone in the playground — leave them out, or the
     proto-screens skill will stub them. You don't have to guess which: the
     **Catalogue view** (`proto dev`, §7) renders every catalogued component and
     flags the ones that can't render standalone — use it to triage keep vs avoid.
   - **Non-visual runtime deps screens legitimately import** (a data/util package
     that isn't UI — not a type, which is exempt automatically) → add them to the
     lint's allowlist with `proto manifest … --ignore <pkg>` (comma-separated;
     persisted into `manifest.json`'s `ignore` and merged with the always-on
     defaults). Visual components must still come from the manifest.
3. **Styling bridge — make screens look real.** Point `proto/styles.css` at the
   project's real theme so screens render in the true visual language:
   - Tailwind v4 consumer → `@import 'tailwindcss'` + `@source '../src/**/*'`.
   - **Tailwind v3 consumer** → proto runs v4, so don't load the v3 config as-is
     (its plugins break). Write a proto-local `proto/tailwind.config.cjs` that
     **reuses the consumer's theme preset** (the colors/tokens the components
     depend on) but **omits v3-only plugins**, then in `styles.css`:
     ```css
     @import 'tailwindcss';
     @config './tailwind.config.cjs';
     @source '../src/**/*.{ts,tsx}';
     ```
   - Sass/token-based → point `styles.css` at (or `@import`) the global
     stylesheet so the same variables/resets apply.
   - **Playground prelude — deps that need a `global` shim or an init import.**
     A few libraries (notably `react-dates`, behind many `DatePicker`s) crash the
     Catalogue with `global is not defined`, or require a one-time side-effect
     import like `import 'react-dates/initialize'` before any screen mounts.
     proto already shims `global: {}`, but for the init import drop a
     **`proto/setup.{ts,js}`** — proto auto-runs it first (no config file) and
     **bundles it into the standalone `proto package` HTML**. Use this instead of
     dropping the component from the vocabulary:
     ```ts
     // proto/setup.ts
     import 'react-dates/initialize'
     globalThis.global ||= globalThis
     ```
     If the Catalogue (`proto dev`, §7) blanks on a component with a `global` /
     init error, this is the fix — then keep the component in the manifest.
4. **Dev deps:** manifest needs `ts-morph`, lint/verify need `eslint` +
   `typescript-eslint`. They're optional in proto's install and **auto-installed
   on first use** (PM inferred from the lockfile), so you normally don't run
   anything here. To pre-install or in an offline/locked environment:
   `npm i -D ts-morph eslint typescript-eslint` (or set `PROTO_NO_INSTALL=1` to
   disable auto-install).
5. **Lint config:** ensure the consumer's `eslint.config.js` includes
   `...proto({ allow: ['<entry>'] })` scoped to `proto/**/screens/**` (CI gate).
   `proto lint` already derives `allow` from the manifest; this is for their
   normal `eslint .`.
6. **Wire the agent:** `proto claude-init` (skills + explicit-root auto-lint hook
   + CLAUDE.md).
   (If you're running this, it's likely already done.)

## 5. Build the app shell — the frame every screen sits in

Real products aren't a sequence of bare screens; they're one persistent **chrome**
— sidebar, top bar, page container — with the content area swapping underneath. A
prototype that redraws (or omits) that chrome per screen reads as a lookalike and
forces every future screen to rebuild the frame. So build the shell **once**,
here, and have every proto-screen wrap its content in it.

The shell lives at **`proto/shell/Shell.tsx`** — a plain file, *no* `index.ts`
(an `index.ts` would make the dir a discovered flow). Screens import it by
relative path and wrap their body:
```tsx
import { Shell } from '../../shell/Shell'
export function Component() {
  return <Shell active="dashboard">{/* catalog components only */}</Shell>
}
```

**Build it in this order of preference:**

1. **From real components, state stubbed via props (best — no exception needed).**
   If the app's chrome is itself components (`<Sidebar>`, `<TopBar>`, a layout
   wrapper), compose them and defang their coupling exactly as for any other
   component (§4.2): pass the data they'd fetch, `interactive={false}`, a static
   active item instead of a live router. No codebase edits — you only stub state
   at the call site. This stays fully on-vocabulary.
2. **Mirror it with plain HTML/CSS (the one sanctioned exception to the rule).**
   When the chrome can't be assembled from props alone cheaply — it's welded to a
   router, a layout package, or app providers — don't fight it: **reproduce the
   frame** with simple markup + CSS matching the §1g screenshot (real spacing,
   colors, structure). This is the *only* place hand-styling is allowed.

**Why the exception is safe and bounded.** The consistency lint and the
`proto lint --file` guard only ever touch `proto/<flow>/screens/**` — proto's own
chrome is never linted (already true of proto's nav UI). `Shell.tsx` lives outside
any `screens/` dir, so it's exempt **by construction** — no rule is weakened.
Screens import it as a local `./` path, which `restrict-visual-imports` already
permits, and `no-raw-styling` fires only inside screen files. So **screens stay
100% on-vocabulary while inheriting hand-built chrome**, and the exception is
exactly one file. It must still typecheck (`proto verify` runs tsc project-wide) —
keep it valid TS, not throwaway.

Keep the shell **prop-driven** for the per-screen bits (active nav item, page
title, breadcrumb) so screens configure it without editing it. Render it in
`proto dev`, check against the §1g screenshot, then record what you built and
which path you took (components vs mirror) in `PROJECT.md` (§6).

## 6. Write `proto/PROJECT.md` — the project constitution

This is the most valuable artifact you produce. `proto/CONTRACT.md` is
auto-generated by `proto manifest` (generic lint rules) and gets overwritten —
do not put project knowledge there. `proto/PROJECT.md` is hand/agent-owned and
**not regenerated**: it captures everything you just learned so the next agent
authors high-fidelity screens on the first pass instead of rediscovering it.

Write it from your findings. Keep it concrete and specific to THIS repo — no
generic advice. Structure:

```markdown
# proto/PROJECT.md — authoring constitution for <project>

Owned by humans + agents. NOT regenerated (that's CONTRACT.md). Update when the
vocabulary, components, or app change.

## Vocabulary
- App root: `<path>` — where `proto/` lives (commands auto-discover it).
- Entry: `<e.g. $/proto-vocab>` — regenerate: `proto manifest --entry <entry>`
- Why this and not the obvious package: <evidence — usage counts; the real DS is
  the local `components/…`, the `<pkg>` in deps is vestigial (N imports)>

## Component render-map
| Component | Use | How |
|---|---|---|
| `Table` | ✅ prop-only | `data` + `columns` |
| `StatusCell` | ✅ via props | `disableTooltip`, `interactive={false}`, `showActionButton={false}` |
| `Tab` | ❌ avoid | renders a router `<NavLink>` → needs `<Router>`; use `<Badge>`/`<Button>` |
<one row per component the prototype needs; record the exact props that defang
any store/tooltip/router coupling, and what to use instead of the ones to avoid>

## Reuse the real renderers (don't approximate)
<map each cell/visual to the app's own renderer so screens match, e.g.>
- status → `StatusCell` (progress bar)   · plain text → `TextCell`
- owner → `StackedAvatars onlyAvatar`     · the real column code lives in `<path>`

## Shell
- File: `proto/shell/Shell.tsx` — wrap every screen: `<Shell active="…">…</Shell>`.
- Built from: <real components (which, how stubbed) | plain HTML/CSS mirror — the
  sanctioned lint exception, justified because the chrome is <router/provider>-bound>.
- Per-screen props: `active` (nav item), `title`, … — screens configure, never edit.

## Styling
- <e.g. Tailwind v3 preset bridged via proto/tailwind.config.cjs + @config; @source ../src.
  v3-only plugins (line-clamp) dropped>

## Mock data
- <where fixtures live, the real prop shapes to match, conventions>

## Visual ground truth — judge against this
- Run the app: `<command>`
- Real screen: `<URL/route>`  ·  Auth: `<how to log in / mock user>`
- The prototype should match this screen. Screenshot it and diff side by side.
- References: `proto/references/` holds <committed real-app screenshots / mockups —
  list what's there>. Use these too; they're the fallback ground truth.
- <if neither the app can be run nor any reference image exists, say so —
  fidelity is code-reading only>
```

Fill every section with real specifics; an empty or vague `PROJECT.md` is worse
than none. proto-screens reads this before authoring.

## 7. Confirm it worked — open the Catalogue

`proto dev` opens on the **Catalogue** view: every component in the manifest,
rendered **live under the real theme**, with its prop table and example. This is
the fastest, most honest confirmation that vocabulary + styling are wired — no
throwaway screen needed.

- `proto catalog` prints a non-empty catalog and `proto manifest` regenerates.
- Run `proto dev`, view the **Catalogue**, and screenshot it (Playwright MCP, save
  to `proto/.screenshots/` — git-ignored).
  Check the components **resolve and carry the real theme** (right colors,
  spacing, type). Correctly-styled cards = the styling bridge (§4.3) works;
  unstyled/colorless cards mean it isn't — fix before handing off.
- Cards flagged **"needs real props to preview"** are the store/router/data-coupled
  ones — fold that into the §6 render-map (mark ❌ avoid). The Catalogue does the
  §4.2 "verify each renders, drop the ones that don't" triage for you, visually.
  The auto-preview fills shape-correct placeholders (`[]` for array props, `{}`
  for objects, no-op functions for callbacks), so a component that takes
  `options`/`columns`/`onSelect` renders empty rather than throwing — **a flagged
  card now means a real dependency, not just a missing array/callback prop.**
- (Optional) for a multi-component layout check, author one throwaway probe
  screen, render it in `proto dev`, then delete it.
- Tell the user: setup done — the **proto-screens** skill now handles authoring.
  Suggest a first flow (`proto new <name>` or just describe screens to build).

## Hand-off

Setup ends where authoring begins. Do not author real screens here — that's
`proto-screens`. Leave the repo with a fresh manifest pointed at the *real*
vocabulary, the theme rendering, a wired lint, a built `proto/shell/Shell.tsx`
(§5) for screens to wrap into, a written `proto/PROJECT.md` constitution (the
highest-leverage hand-off — it's what lets the next agent hit the same fidelity),
and a clear next step.
