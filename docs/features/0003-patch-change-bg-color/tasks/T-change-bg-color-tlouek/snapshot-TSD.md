## TSD S-0003.01 — Background color CSS variable update

| Aspect | Spec |
|--------|------|
| Interfaces | `frontend/src/index.css` — `:root { --background }` (light) and `.dark { --background }` (dark) CSS custom properties |
| Data / State | No runtime state; CSS variable change is static |
| Behavior | Light mode: `--background` resolves to HSL `30 20% 97%`. Dark mode: `--background` resolves to HSL `220 13% 10%`. All pages/components using `bg-background` or `hsl(var(--background))` reflect the new color automatically. |
| Boundaries | None — pure CSS, no external deps |
| Tests | Snapshot/value test: read `index.css`, assert the new HSL values appear for `--background` in both `:root` and `.dark` blocks |
