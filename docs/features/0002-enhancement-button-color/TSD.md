---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "45ae4f8e25b75acb3f68c9c53ff6132c116b5603c844c33c890bb38ef3f9999c"
---
# TSD 0002 — Make the Export CSV button golden
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-0002.nn — the 0002 prefix is what resolves this folder (docs/features/0002-*/),
> so the `## TSD S-0002.nn` header below must match the story ID exactly.

## Grounding decision
This story changes the presentation of one existing control and nothing else. No new module, no new
state, no request, no boundary: the export control already owns its own appearance, so the change is
confined to the presentation attributes of that one element. There is no backend surface, no wire
contract, and no data touched.

**Respec: purple → golden.** This TSD was approved specifying purple. The owner has since dropped
purple and asked for golden, so the shade analysis below is redone from scratch. Golden is not a
drop-in substitution — it **inverts the foreground rule**, which is the single most important thing
to read before re-approving.

**Contrast is the one hard constraint, and it decides the shade.** The button carries 14px
medium-weight text, which is "normal text" under WCAG, so foreground-on-fill must reach **4.5:1**.
Measured against the stock palette's warm yellows (plus two well-known "gold" hexes for reference),
this rules choices out rather than leaving them to taste:

| candidate fill | white foreground | near-black foreground |
|---|---|---|
| amber-300  `#fcd34d` | 1.44:1 ❌ | 13.80:1 ✅ |
| amber-400  `#fbbf24` | 1.67:1 ❌ | **11.92:1 ✅** |
| amber-500  `#f59e0b` | 2.15:1 ❌ | **9.26:1 ✅** |
| amber-600  `#d97706` | 3.19:1 ❌ | 6.24:1 ✅ |
| amber-700  `#b45309` | 5.02:1 ✅ | 3.96:1 ❌ |
| yellow-400 `#facc15` | 1.53:1 ❌ | 12.99:1 ✅ |
| yellow-500 `#eab308` | 1.92:1 ❌ | 10.37:1 ✅ |
| yellow-600 `#ca8a04` | 2.94:1 ❌ | 6.77:1 ✅ |
| yellow-700 `#a16207` | 4.92:1 ✅ | 4.04:1 ❌ |
| *goldenrod* `#daa520` | 2.24:1 ❌ | 8.89:1 ✅ |
| *metallic gold* `#d4af37` | 2.10:1 ❌ | 9.46:1 ✅ |

**What that table forces.** Every shade that actually reads as *gold* fails with white text — gold is
a light colour, so nothing that looks golden can carry white 14px text at AA. The only shades that
pass with white (amber-700, yellow-700) have darkened into bronze/olive and no longer satisfy the
PRD's AC-1 "reads as gold". So the spec below requires a **near-black foreground on a light golden
fill** — the exact opposite of the white-on-dark-fill rule the purple version specified. Anyone
carrying over the purple spec's foreground would ship an unreadable button.

**Correction carried forward from the purple pass.** The purple version I applied and rebuilt in the
browser used a lighter fill in dark mode (`dark:bg-purple-500`) with white text, which measures
3.96:1 and **fails AA** — I picked it by eye and did not check it. That mistake is why this document
measures instead of describing. Its conclusion still holds under golden: one shade set serves both
themes. The button sits on a card, not on the page background, and its own fill is what its text
contrasts against, so a per-theme fill buys nothing and previously cost accessibility.

**Assumptions, since the PRD's open questions came back unanswered.** (a) "Golden" means the stock
palette's warm yellow, not a bespoke brand gold and not a metallic/gradient treatment — no accent
colour is defined anywhere in the repo, and a gradient would be a new kind of thing on this surface.
(b) Gold stays light and the text goes dark, rather than darkening the fill to bronze to keep white
text — the PRD's AC-1 says it must read as gold, so the fill wins and the foreground yields.
(c) This stays a one-off on this control; the shared primary token is *not* redefined, so no other
button changes appearance and nothing else inherits a dark-on-light foreground. All three are
reversible. Say otherwise and this TSD needs one more pass before approval.

## TSD S-0002.01 — The export control reads as the panel's action  (PRD §S-0002.01)
| Aspect | Spec |
|--------|------|
| Interfaces | No change. The control keeps its existing role (button), its accessible name ("Export CSV"), its activation contract, and its props. Nothing is added to or removed from any module's public surface. |
| Data / State | None. No persisted state, no in-memory state, no new theme token, no stylesheet variable. The change is expressed entirely in the control's own presentation attributes. |
| Behavior | The control renders **filled**: a light golden background carrying a **near-black foreground** that reaches at least 4.5:1 against that fill, replacing the current outline treatment (a border with a transparent background). The foreground is dark **because** the fill is light — see Grounding; a light foreground on a golden fill is a defect, not a variant. Pointer hover moves the fill to a **deeper gold** that still reaches 4.5:1 against the same dark foreground, so hover feedback survives the loss of the outline button's hover background. Keyboard focus renders a **visible indicator distinct from the fill itself** — the outline button signalled focus through its border, so a filled button must supply its own, and the indicator must be perceivable against both the golden fill and the surrounding card. Exactly **one** shade set serves both light and dark theme (see Grounding). Activation, the CSV produced, the success message and the nothing-to-export message are all unchanged. |
| Access | Unchanged — the single owner, exactly as today. This story grants and removes no access. |
| Boundaries | None owned by this story. The export path's clock and browser-download boundary are 0001's and are untouched. Rendered colour is not a boundary that can be faked: what a shade *looks like* is only observable to a human eye on a real screen, which is why the verification below is split the way it is. |
| Tests | **unit:** the control renders a fill-and-foreground pair rather than the outline treatment, pairs the golden fill with a **dark** foreground (not a light one), declares a hover shade and a focus indicator, and does so with no theme-conditional fill — asserted on the rendered element, keeping the role/name queries 0001's tests rely on. A unit test can check *which* fill and foreground were declared; it cannot judge their contrast ratio, which is why the ratios are fixed here in the spec rather than computed at runtime. **integration:** 0001's existing suite for this control passes **unchanged** — same accessible role and name, same CSV text, same success and empty messages; that suite is the regression proof that appearance-only stayed appearance-only, and it must not be edited to accommodate this change. **smoke (human, required):** in the running app the owner confirms the button reads golden (gold, not brown or mustard), its label is comfortably readable on that fill, hover deepens it, tabbing to it shows a focus indicator, clicking still downloads the CSV — repeated with the theme toggled, since no automated check can judge how a colour looks. |

## Out of scope
- Redefining the shared primary/secondary tokens, or restyling the add-expense submit or the delete
  control. This story touches one element.
- Any change to what the export does, what the CSV contains, or what the status messages say.
- Introducing a colour-contrast linter or a visual-regression harness. Both would be reasonable
  follow-ups; neither is this story.
- A metallic-gold gradient, sheen or border treatment. "Golden" here is a flat fill from the stock
  palette; a gradient would be a new visual idiom on this surface and belongs in its own story.
