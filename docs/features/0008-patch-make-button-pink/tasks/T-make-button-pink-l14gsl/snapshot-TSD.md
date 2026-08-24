## TSD S-0008.01 — Primary button color changed to pink

| Aspect | Spec |
|--------|------|
| Interfaces | `--primary` and `--ring` CSS custom properties in `frontend/src/index.css` |
| Data / State | No runtime state; CSS-only change |
| Behavior | After the change, any element using `bg-primary` / `text-primary` / `ring-primary` (i.e., all primary buttons) renders with a pink hue (~330° HSL) in both `:root` (light) and `.dark` themes. Foreground text on pink buttons remains legible (white). |
| Boundaries | None |
| Tests | JSDOM computed-style test: assert `--primary` CSS variable value resolves to the pink HSL string in both `:root` and `.dark` |
