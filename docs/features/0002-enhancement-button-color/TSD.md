---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "fb6f261876f9ca90974dea6bc714c79583dea4645076ddba1067628d174e8342"
---
# TSD 0002 — Make the Export CSV button purple
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-0002.nn — the 0002 prefix is what resolves this folder (docs/features/0002-*/),
> so the `## TSD S-0002.nn` header below must match the story ID exactly.

## Grounding decision
This story changes the presentation of one existing control and nothing else. No new module, no new
state, no request, no boundary: the export control already owns its own appearance, so the change is
confined to the presentation attributes of that one element. There is no backend surface, no wire
contract, and no data touched.

**Contrast is the one hard constraint, and it decides the shade.** The button carries 14px
medium-weight text, which is "normal text" under WCAG, so foreground-on-fill must reach **4.5:1**.
Measured against the stock palette this rules choices out rather than leaving them to taste:

| candidate fill | white foreground | near-black foreground |
|---|---|---|
| purple-400 | 2.64:1 ❌ | 7.53:1 ✅ |
| purple-500 | **3.96:1 ❌** | 5.03:1 ✅ |
| purple-600 | 5.38:1 ✅ | 3.70:1 ❌ |
| purple-700 | 6.98:1 ✅ | 2.85:1 ❌ |

**Correction to what was already shown.** The version I applied and rebuilt in the browser earlier
used a lighter fill in dark mode (`dark:bg-purple-500`) with white text. That measures **3.96:1 and
fails AA** — I picked it by eye for looks and did not check it. The spec below therefore drops the
dark-mode variant and uses one shade in both themes. The button sits on a card, not on the page
background, and its own fill is what its text contrasts against, so a per-theme shade buys nothing
here and cost accessibility.

**Assumptions, since the PRD's open questions came back unanswered.** (a) The purple is the stock
palette's purple, not a bespoke brand colour — no accent colour is defined anywhere in the repo.
(b) This stays a one-off on this control; the shared primary token is *not* redefined, so no other
button changes appearance. Both are reversible and neither is load-bearing. Say otherwise and this
TSD needs one more pass before approval.

## TSD S-0002.01 — The export control reads as the panel's action  (PRD §S-0002.01)
| Aspect | Spec |
|--------|------|
| Interfaces | No change. The control keeps its existing role (button), its accessible name ("Export CSV"), its activation contract, and its props. Nothing is added to or removed from any module's public surface. |
| Data / State | None. No persisted state, no in-memory state, no new theme token, no stylesheet variable. The change is expressed entirely in the control's own presentation attributes. |
| Behavior | The control renders **filled**: a saturated purple background with a foreground that reaches at least 4.5:1 against it, replacing the current outline treatment (a border with a transparent background). Pointer hover moves the fill to a **darker** purple that still reaches 4.5:1, so hover feedback survives the loss of the outline button's hover background. Keyboard focus renders a **visible indicator distinct from the fill itself** — the outline button signalled focus through its border, so a filled button must supply its own. Exactly **one** shade set serves both light and dark theme (see Grounding). Activation, the CSV produced, the success message and the nothing-to-export message are all unchanged. |
| Access | Unchanged — the single owner, exactly as today. This story grants and removes no access. |
| Boundaries | None owned by this story. The export path's clock and browser-download boundary are 0001's and are untouched. Rendered colour is not a boundary that can be faked: what a shade *looks like* is only observable to a human eye on a real screen, which is why the verification below is split the way it is. |
| Tests | **unit:** the control renders a fill-and-foreground pair rather than the outline treatment, declares a hover shade and a focus indicator, and does so with no theme-conditional fill — asserted on the rendered element, keeping the role/name queries 0001's tests rely on. **integration:** 0001's existing suite for this control passes **unchanged** — same accessible role and name, same CSV text, same success and empty messages; that suite is the regression proof that appearance-only stayed appearance-only, and it must not be edited to accommodate this change. **smoke (human, required):** in the running app the owner confirms the button reads purple, hover darkens it, tabbing to it shows a focus indicator, clicking still downloads the CSV — repeated with the theme toggled, since no automated check can judge how a colour looks. |

## Out of scope
- Redefining the shared primary/secondary tokens, or restyling the add-expense submit or the delete
  control. This story touches one element.
- Any change to what the export does, what the CSV contains, or what the status messages say.
- Introducing a colour-contrast linter or a visual-regression harness. Both would be reasonable
  follow-ups; neither is this story.
