---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "45ae4f8e25b75acb3f68c9c53ff6132c116b5603c844c33c890bb38ef3f9999c"
---
# TSD 0002 — Make the Export CSV button pink
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-0002.nn — the 0002 prefix is what resolves this folder (docs/features/0002-*/),
> so the `## TSD S-0002.nn` header below must match the story ID exactly.

## Grounding decision
This story changes the presentation of one existing control and nothing else. No new module, no new
state, no request, no boundary: the export control already owns its own appearance, so the change is
confined to the presentation attributes of that one element. There is no backend surface, no wire
contract, and no data touched.

**Respec: purple → golden → pink.** This TSD was approved as purple, respecced to golden, and is now
respecced to pink. The shade analysis is redone from measurement each time rather than translated,
because each hue family behaves differently: purple forced white text, gold forced dark text, and
**pink genuinely permits either** — so pink is the first of the three where the shade is a decision
rather than a constraint. No code has been written under any colour, so this costs spec passes only.

**Contrast is the hard constraint; here it narrows rather than decides.** The button carries 14px
medium-weight text, which is "normal text" under WCAG, so foreground-on-fill must reach **4.5:1**.
Measured against the stock palette (fuchsia and rose included, since "pink" is often meant loosely):

| candidate fill | white foreground | near-black foreground |
|---|---|---|
| pink-300 `#f9a8d4` | 1.81:1 ❌ | 10.92:1 ✅ |
| pink-400 `#f472b6` | 2.65:1 ❌ | **7.48:1 ✅** |
| pink-500 `#ec4899` | 3.53:1 ❌ | **5.61:1 ✅** |
| pink-600 `#db2777` | **4.60:1 ✅ (thin)** | 4.31:1 ❌ |
| pink-700 `#be185d` | 6.04:1 ✅ | 3.28:1 ❌ |
| pink-800 `#9d174d` | 7.88:1 ✅ | 2.51:1 ❌ |
| fuchsia-500 `#d946ef` | 3.46:1 ❌ | 5.73:1 ✅ |
| fuchsia-600 `#c026d3` | 4.71:1 ✅ | 4.20:1 ❌ |
| rose-500 `#f43f5e` | 3.67:1 ❌ | 5.39:1 ✅ |
| rose-600 `#e11d48` | 4.70:1 ✅ | 4.21:1 ❌ |

**What that table allows, and the choice made.** Two coherent pairs pass AA:

- **soft pink — chosen:** `pink-400` fill with a near-black label (**7.48:1**), hover to `pink-500`
  (**5.61:1** with the same label). Both ends clear AA with margin, and 400/500 are unambiguously
  pink to the eye.
- **hot pink — rejected, but viable:** `pink-600` fill with a white label, hover to `pink-700`. It
  clears AA at **4.60:1**, which is a 0.10 margin — close enough that any later nudge to the shade
  silently breaks it. It also reads closer to magenta, and the app's delete control is already red, so
  a heavy hot pink beside it invites reading the export as a second destructive action.

Note the mirror of the gold pass: there, the *middle* shades needed dark text and only the browned-out
ends took white. In pink, the crossover sits between 500 and 600, and **no shade takes both** — so
fill and foreground are specified as a pair below, never independently.

**Correction carried forward from the purple pass.** The purple version I applied and rebuilt in the
browser used a lighter fill in dark mode (`dark:bg-purple-500`) with white text, which measures
3.96:1 and **fails AA** — I picked it by eye and did not check it. That mistake is why this document
measures instead of describing. Its conclusion still holds under pink: one shade set serves both
themes. The button sits on a card, not on the page background, and its own fill is what its text
contrasts against, so a per-theme fill buys nothing and previously cost accessibility.

**Assumptions, since the PRD's open questions came back unanswered.** (a) "Pink" means the stock
`pink` palette — not fuchsia, not rose, and not a bespoke brand pink; no accent colour is defined
anywhere in the repo. (b) Soft pink over hot pink, for the contrast-margin and delete-adjacency
reasons above; this is the one assumption most likely to be wrong about intent, and reversing it is a
one-line change to the Behavior row. (c) This stays a one-off on this control; the shared primary
token is *not* redefined, so no other button changes appearance. All three are reversible. Say
otherwise and this TSD needs one more pass before approval.

## TSD S-0002.01 — The export control reads as the panel's action  (PRD §S-0002.01)
| Aspect | Spec |
|--------|------|
| Interfaces | No change. The control keeps its existing role (button), its accessible name ("Export CSV"), its activation contract, and its props. Nothing is added to or removed from any module's public surface. |
| Data / State | None. No persisted state, no in-memory state, no new theme token, no stylesheet variable. The change is expressed entirely in the control's own presentation attributes. |
| Behavior | The control renders **filled**: a **soft pink** background carrying a **near-black** label that reaches at least 4.5:1 against that fill, replacing the current outline treatment (a border with a transparent background). Fill and foreground are one decision, not two — no pink shade in the palette accepts both a white and a dark label at AA (see Grounding), so pairing this fill with a light label is a defect, not a variant. Pointer hover moves the fill **one step deeper** in the same pink, still ≥4.5:1 against the same dark label, so hover feedback survives the loss of the outline button's hover background. Keyboard focus renders a **visible indicator distinct from the fill itself** — the outline button signalled focus through its border, so a filled button must supply its own, and the indicator must be perceivable against both the pink fill and the surrounding card. Exactly **one** shade set serves both light and dark theme (see Grounding). Activation, the CSV produced, the success message and the nothing-to-export message are all unchanged. |
| Access | Unchanged — the single owner, exactly as today. This story grants and removes no access. |
| Boundaries | None owned by this story. The export path's clock and browser-download boundary are 0001's and are untouched. Rendered colour is not a boundary that can be faked: what a shade *looks like* is only observable to a human eye on a real screen, which is why the verification below is split the way it is. |
| Tests | **unit:** the control renders a fill-and-foreground pair rather than the outline treatment, pairs the pink fill with a **dark** label (not a light one), declares a deeper hover shade and a focus indicator, and does so with no theme-conditional fill — asserted on the rendered element, keeping the role/name queries 0001's tests rely on. A unit test can check *which* fill and foreground were declared; it cannot judge their contrast ratio, which is why the ratios are fixed here in the spec by measurement rather than computed at runtime. **integration:** 0001's existing suite for this control passes **unchanged** — same accessible role and name, same CSV text, same success and empty messages; that suite is the regression proof that appearance-only stayed appearance-only, and it must not be edited to accommodate this change. **smoke (human, required):** in the running app the owner confirms the button reads pink (pink, not red or magenta), its label is comfortably readable on that fill, hover deepens it, tabbing to it shows a focus indicator, clicking still downloads the CSV — repeated with the theme toggled, since no automated check can judge how a colour looks. |

## Out of scope
- Redefining the shared primary/secondary tokens, or restyling the add-expense submit or the delete
  control. This story touches one element.
- Any change to what the export does, what the CSV contains, or what the status messages say.
- Introducing a colour-contrast linter or a visual-regression harness. Both would be reasonable
  follow-ups; neither is this story.
- A gradient, sheen or border treatment. "Pink" here is a flat fill from the stock palette; a
  gradient would be a new visual idiom on this surface and belongs in its own story.
- Restyling the delete control to resolve the pink/red adjacency noted in the Grounding section. If
  the two read as confusingly similar in the smoke check, that is its own card.
