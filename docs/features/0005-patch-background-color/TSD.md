> Lane-generated — extracted from SPEC.md at approval. View only; edit the TSD section in SPEC.md, not here.

## TSD S-0005.01 — Golden background CSS variable
> Behavior + contracts ONLY — never the library/method/pattern. The Critic anchors to THIS
> section (snapshot frozen at `lane start`), exactly as it would to a TSD.md section.

| Aspect | Spec |
|--------|------|
| Interfaces | `--background` CSS custom property in `frontend/src/index.css`, inside `:root` (light) and `.dark` selectors |
| Data / State | No runtime state — pure static CSS variable change |
| Behavior | Light mode: `--background` resolves to `43 80% 90%` (golden hue, high lightness). Dark mode: `--background` resolves to `43 35% 14%` (golden hue, low lightness). All other variables unchanged. |
| Boundaries | None — no external deps |
| Tests | Read `frontend/src/index.css`; assert `--background` under `:root` equals `43 80% 90%` and under `.dark` equals `43 35% 14%` |
