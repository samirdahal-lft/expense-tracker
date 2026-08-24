## TSD S-0007.01 — Animated rainbow background

> Behavior + contracts ONLY — never the library/method/pattern. The Critic anchors to THIS
> section (snapshot frozen at `lane start`), exactly as it would to a TSD.md section.

| Aspect | Spec |
|--------|------|
| Interfaces | `App.tsx` root `<div>` className — `bg-background` replaced/augmented with a Tailwind-compatible rainbow gradient class or inline style; `index.css` gains the `@keyframes` animation |
| Data / State | None — purely presentational |
| Behavior | The full-viewport root element displays a continuously animating rainbow gradient background that cycles through the full hue spectrum (red → orange → yellow → green → blue → violet → red) on a smooth loop of ≈ 6 seconds |
| Boundaries | None — no external deps |
| Tests | Vitest + React Testing Library: assert the root `<div>` carries the expected rainbow class/style that encodes the gradient; assert the `@keyframes` animation name is present in the CSS |
