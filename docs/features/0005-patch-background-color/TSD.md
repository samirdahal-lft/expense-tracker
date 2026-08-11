## TSD S-0005.01 — <title>
> Behavior + contracts ONLY — never the library/method/pattern. The Critic anchors to THIS
> section (snapshot frozen at `lane start`), exactly as it would to a TSD.md section.

| Aspect | Spec |
|--------|------|
| Interfaces | <contracts touched — endpoint, CLI flag, function/SDK signature> |
| Data / State | <state it touches — empty if none> |
| Behavior | <the observable behavior after the patch> |
| Boundaries | <external deps we DON'T own, faked in tests — empty if none> |
| Tests | <unit/integration — what proves the fix> |
