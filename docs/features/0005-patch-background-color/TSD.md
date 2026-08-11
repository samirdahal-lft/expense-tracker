## TSD S-0005.01 — Golden background CSS variable

| Aspect | Spec |
|--------|------|
| Interfaces | `--background` CSS custom property in `frontend/src/index.css`, `:root` (light mode) and `.dark` (dark mode) selectors |
| Data / State | No runtime state — pure CSS variable change |
| Behavior | In light mode, `document.documentElement` resolves `--background` to an HSL value in the golden range (hue 40–50, saturation ≥ 70%, lightness ≥ 85%). In dark mode, `--background` resolves to an HSL value in the golden range (hue 40–50, saturation ≥ 30%, lightness ≤ 20%). |
| Boundaries | None — no external deps |
| Tests | Parse `index.css` and assert the `--background` values in `:root` and `.dark` match the expected golden HSL strings |
