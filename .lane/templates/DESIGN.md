---
approved_by: ""
approved_at: ""
---
# Design <FEAT> — <title>
> The technical design for the document this kind places before it, in behaviour + contract terms — never the library, method
> or pattern. One `## TSD S-<FEAT>.nn` section per group of behaviours; each task card names ONE
> of them as its story and the Critic anchors to that section, frozen at `lane start`. The
> `<FEAT>` prefix resolves this folder, so the header must match the story id exactly.

## Approach
<two or three sentences: the shape of the change and where it sits in the codebase>

## TSD S-<FEAT>.01 — <title>
| Aspect | Spec |
|--------|------|
| Interfaces | <contracts touched — endpoint, CLI flag, function/SDK signature, event> |
| Data / State | <state it touches — empty if none> |
| Behavior | <the observable behaviour after the change> |
| Boundaries | <external deps we DON'T own, faked in tests — empty if none> |
| Tests | <what proves it — unit / integration / smoke> |

## Tasks
<one line per task you expect: what it delivers, which S-<FEAT>.nn it proves, `Tests:` mode if not red-green>
-
