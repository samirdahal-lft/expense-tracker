# Screen generation contract

Read this before writing or editing any screen under `proto/<flow>/screens/`.
It is the rule set that keeps every screen consistent and exportable. The lint
(`@robusgauli/proto/eslint`) enforces most of it — treat a green lint as the
floor, not the goal.

## The vocabulary is closed

`proto/manifest.json` is the **complete** list of components you may use. It is
generated from the design system's real exports — import paths, props, literal
union values, and examples are all in there.

- **Use only components listed in `proto/manifest.json`.** Import them exactly
  as the manifest's `import` field shows.
- **Do not invent components.** If you need a button, use the manifest's button.
  Never hand-build one.
- **Use only prop values the manifest allows.** When a prop's type is a union
  (`'primary' | 'secondary' | 'ghost'`), pick one of those literals — never a
  value outside it.

> **Type-only imports are always fine.** `import type { ColumnDef } from
> '@tanstack/react-table'` (or any `import type` / `import { type X }`) is exempt
> from the import rule — types are erased at compile time and add no UI. Use them
> to type a component's props correctly instead of falling back to `any`.
>
> If you need a **runtime** non-visual dep (a data/util package, not UI), add it
> to `proto/manifest.json`'s `ignore` array — or `proto manifest --entry <…>
> --ignore <pkg>` (persisted across regeneration). Visual components still must
> come from the manifest.

## No hand-styling

Components carry the styling. Screens compose them; they never style.

- **No raw style utilities** — no `className="bg-… p-… text-[…] rounded-…"`,
  no `style={{ color, background, padding, margin, fontSize, … }}`.
- **Layout only** is allowed for arranging components (flex/grid/gap), and only
  if your kit lacks a layout primitive. Prefer the kit's layout component
  (e.g. `Stack`) when one exists.
- All color, spacing, radius, and typography come from components — never
  inline values.

## When something is missing

If the manifest has no component for what a screen needs:

1. **Do not** inline it or pull in another UI library.
2. Add the missing piece to the design system / kit **once**, in its own file.
3. Re-run `proto manifest` so the catalog (and every screen) can use it.

One new need → one kit addition → still one vocabulary.

## Navigation

Wire screens with proto's flow API, not styling:

```tsx
import { Link, useFlow } from '@robusgauli/proto'

<Link to="checkout"><Button>Continue →</Button></Link>   // hotspot
const { next, prev, goto } = useFlow()                    // programmatic
```

## Log drift as you go

A prototype intentionally departs from the real app — it fakes data, defangs
coupled components (`disableTooltip`, `interactive={false}`), stubs the chrome in
`Shell`, and skips loading/error/empty states. Each departure is a **drift** a
coding agent must close when wiring the mockup into the app.

Record every drift the moment you make it in `proto/<flow>/INTEGRATION.md` (copy
the structure from `proto/INTEGRATION.template.md`). This is *behavior* fidelity
— the complement to this contract's *component* fidelity. Logging live is
lossless; reconstructing drift at the end is not.

## Definition of done for a screen

- [ ] Every visual element is a component from `proto/manifest.json`.
- [ ] No raw `className` design utilities and no inline visual `style`.
- [ ] Prop values are within each prop's allowed type.
- [ ] `eslint` passes on the screen with the proto consistency preset.
- [ ] Every departure from the real app is logged in `proto/<flow>/INTEGRATION.md`.
