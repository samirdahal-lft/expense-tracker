---
flow: <flow-id>
target_route: <where this screen lives in the real app, e.g. /app/checkout>
target_dir: <real app dir this maps to, e.g. src/features/checkout>
design_system: <preset or real DS the catalog came from>
status: prototype
---

# Integrate "<flow-id>" into the app

> This is the **drift ledger** for a prototype flow. Proto locks *component*
> fidelity (every screen composes only catalog components). What it cannot lock
> is *behavior* — a prototype deliberately fakes data, defangs coupled
> components, stubs the chrome, and skips edge states. Each such departure is a
> **drift**, recorded here the moment it's made.
>
> `PROJECT.md` says how to match the product. This doc says where the prototype
> departed from it and how a coding agent closes each gap when wiring the mockup
> into the real app.
>
> **Write entries live, while authoring** — not reconstructed at the end. The
> author knows the instant it defangs a prop or fakes a fixture; logging then is
> lossless. The reconcile pass at flow's end only catches what wasn't logged.

## 0. Product intent — what this is & why (PRD seed)

> Captured at the prototype's inception, while the thinking is fresh. Not a spec —
> enough context that this doc can later be fed to a PRD without re-deriving the
> "why". Keep it concrete; a sentence or two per item.

- **What we're building**: <the feature/flow in one line — what it lets a user do>
- **Problem it solves**: <the pain or gap today; why it's worth building>
- **Who it's for**: <the user / role / segment, and the job they're hired to do>
- **Why now / trigger**: <what prompted this — a request, a metric, a strategy bet>
- **Core user journey**: <the happy path in 1–3 steps, the spine this flow prototypes>
- **What success looks like**: <the outcome or signal that says this worked>
- **Scope boundaries**: <what this flow deliberately does NOT cover yet>
- **Open product questions**: <decisions still unmade — feed these to the PRD>

## 1. Screen → app map

| screen | proto path | real route | replaces / extends | status |
|--------|-----------|-----------|--------------------|--------|
| <Name> | proto/<flow>/screens/<Name>.tsx | <route> | <real component or —> | new \| variant \| replaces |

## 2. Drift ledger

One entry per departure. Keep the heading machine-parseable:
`### DRIFT-NN · <category> · <severity>`

- **category**: `shell` · `data` · `component-defang` · `navigation` ·
  `missing-state` · `setup-shim`
- **severity**: `BLOCKER` (won't function in app without it) ·
  `BEHAVIOR` (runs, but behaves differently than production) ·
  `COSMETIC` (visual only)

### DRIFT-01 · shell · BLOCKER
- **screen**: all
- **mockup does**: wraps every body in `proto/shell/Shell.tsx` (hand-styled chrome)
- **real app**: <the real layout/drawer component + its path>
- **productionize**: drop the `Shell` wrapper; mount the screen body inside the
  real layout

### DRIFT-02 · component-defang · BEHAVIOR
- **screen**: <Name>.tsx:<line>
- **mockup does**: `<StatusCell disableTooltip interactive={false} />`
- **real app**: tooltip + row interaction are live
- **productionize**: remove `disableTooltip` / `interactive={false}`; wire the
  handler the prop disabled

### DRIFT-03 · data · BLOCKER
- **screen**: <Name>.tsx
- **mockup does**: imports a fixture from `proto/<flow>/data.ts`
- **real source**: <endpoint / query hook / store selector> — shape matches the
  fixture
- **productionize**: replace the fixture import with the real source

<!-- add DRIFT-NN entries as you author -->

## 3. Migration steps (ordered)

1. Swap `Shell` → the real layout (the drawer / page frame).
2. Replace proto flow nav (`<Link>`, `useFlow().goto/next/prev`) with the real
   router's routes.
3. Wire each data source (see the `data` drifts + §2).
4. Re-fang every defanged component (see the `component-defang` drifts).
5. Add the states the prototype skipped: loading, error, empty, auth guards.

## 4. Gotchas

- `.proto-ui` CSS scoping is proto-only — it won't (and shouldn't) exist in the
  app. Screen styling comes from the catalog components, which carry their own.
- `proto/setup.ts` shims (e.g. `global`, `react-dates/initialize`) exist only so
  the playground can mount coupled deps. Don't port them blindly — the real app
  has its own setup.
- Any mocked context providers were faked to let a coupled component render
  standalone. The real providers differ; list them under a `setup-shim` drift.

## 5. Open questions for the integrating engineer

- <decisions the prototype punted on>
