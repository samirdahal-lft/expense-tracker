---
approved_by: "Samir dahal"
approved_at: "2026-08-05"
approved_sha256: "6b4193a0eac0e646f354b47b0f5b9610f9a5e61549a4d367b8880dcb19a48dd1"
---
# TSD 0002 — Make the Export CSV button red
> Behavior + contracts ONLY. Never name the library/method/pattern (over-spec = defeats spec-first).
> One section per PRD story. Critic anchors to this as the external executable spec.
> Story IDs are S-0002.nn — the 0002 prefix is what resolves this folder (docs/features/0002-*/),
> so the `## TSD S-0002.nn` header below must match the story ID exactly.

## Grounding decision
This story changes the presentation of one existing control and nothing else. No new module, no new
state, no request, no boundary: the export control already owns its own appearance, so the change is
confined to the presentation attributes of that one element. There is no backend surface, no wire
contract, and no data touched.

**Respec: purple → golden → pink → red.** This TSD was approved as purple, then respecced to golden,
to pink, and now to red. The shade analysis is redone from measurement each time rather than
translated, because each hue family behaves differently: purple forced white text, gold forced dark
text, pink permitted either — and **red forces white text again**, for the opposite reason to purple.
No code has been written under any colour, so this costs spec passes only.

**Red is the first colour that collides with an existing meaning in this app.** Every earlier
candidate was a free hue. Red is not: `--destructive: 0 72% 51%` (light) / `0 63% 51%` (dark) is
already defined and in use — it carries the delete control's hover colour and every form error
message. Measured, the light-theme destructive token is `#dc2828`, which is `red-600` (`#dc2626`) to
within a rounding step. So a `red-600` export fill would be *the same colour* as the app's destructive
signal, on the same panel, on a control that deletes nothing. This does not make red unbuildable and
the owner has ratified red; it makes **one shade unavailable and the rest a semantic trade-off**. The
constraint this section adds, and the reason it appears in the table below: the export fill must be a
red the eye separates from `--destructive`, and the destructive token itself is not touched.

**Contrast is the hard constraint; here it decides.** The button carries 14px medium-weight text,
which is "normal text" under WCAG, so foreground-on-fill must reach **4.5:1**. Measured against the
stock palette (rose included, since a "red" request is often meant loosely; near-black is `#0a0a0a`,
the same reference the pink pass used):

| candidate fill | white foreground | near-black foreground |
|---|---|---|
| red-300 `#fca5a5` | 1.90:1 ❌ | 10.43:1 ✅ |
| red-400 `#f87171` | 2.77:1 ❌ | 7.16:1 ✅ |
| red-500 `#ef4444` | 3.76:1 ❌ | **5.26:1 ✅** |
| red-600 `#dc2626` | **4.83:1 ✅** | 4.10:1 ❌ |
| red-700 `#b91c1c` | **6.47:1 ✅** | 3.06:1 ❌ |
| red-800 `#991b1b` | **8.31:1 ✅** | 2.38:1 ❌ |
| red-900 `#7f1d1d` | 10.02:1 ✅ | 1.98:1 ❌ |
| rose-600 `#e11d48` | 4.70:1 ✅ | 4.21:1 ❌ |
| rose-700 `#be123c` | 6.29:1 ✅ | 3.15:1 ❌ |

**What that table allows, and the choice made.** The crossover sits between 500 and 600, and **no
shade takes both** — so fill and foreground are specified as a pair below, never independently. Three
candidates survive AA and the destructive-collision constraint together:

- **deep red — chosen:** `red-700` fill with a **white** label (**6.47:1**), hover to `red-800`
  (**8.31:1** with the same label). It reads unmistakably red rather than salmon or maroon, both ends
  clear AA with a wide margin (any later nudge of a step or two stays legal), and it is visibly deeper
  than `--destructive`, so the export is not wearing the delete colour. Note this inverts the pink
  pass: there the chosen pair was a light fill with a near-black label; in red that combination does
  not exist above 4.5:1 on any shade that still reads red.
- **`red-600` — rejected on semantics, not contrast:** it clears AA at 4.83:1 with white, and is the
  most straightforwardly "red" answer. It is rejected because it *is* `--destructive` (`#dc2626` vs
  `#dc2828`): it would make a read-only export visually identical to the app's delete-and-error
  signal. Contrast is not what disqualifies it.
- **`red-500` with a near-black label — rejected, but viable:** 5.26:1 passes, and it is distinct from
  the destructive token. Rejected because dark text on a fully saturated bright red reads as a warning
  label rather than a button, and 5.26:1 is the thinner margin of the two survivors.

**One measurement recorded against the choice, honestly.** Against the dark theme's card
(`222 40% 12%` = `#121a2b`), a `red-700` fill separates from its surroundings by only **2.69:1** —
below the 3:1 that WCAG 1.4.11 asks of a component boundary. It is not a violation here, because the
button is identified by its own visible label rather than by its edge, and the label's 6.47:1 is what
AA requires. It is a real cost of the deep shade, it is why the human smoke check below is repeated
with the theme toggled, and the lighter alternatives that would fix it (`red-500`/`red-600`) are the
two rejected above. This is a trade-off, not an oversight.

**Correction carried forward from the purple pass.** The purple version I applied and rebuilt in the
browser used a lighter fill in dark mode (`dark:bg-purple-500`) with white text, which measures
3.96:1 and **fails AA** — I picked it by eye and did not check it. That mistake is why this document
measures instead of describing. Its conclusion still holds under red: one shade set serves both
themes. The button sits on a card, not on the page background, and its own fill is what its text
contrasts against, so a per-theme fill buys nothing and previously cost accessibility.

**Assumptions.** (a) "Red" means the stock `red` palette — not rose, not orange, and not a bespoke
brand red; no accent colour is defined anywhere in the repo. (b) The shade was picked by measurement
at the owner's explicit direction; `red-700`/`red-800` over the alternatives for the margin and
destructive-separation reasons above. This is the assumption most likely to be wrong about intent, and
reversing it is a one-line change to the Behavior row. (c) This stays a one-off on this control; the
shared primary token is *not* redefined and `--destructive` is *not* redefined or reused, so no other
element changes appearance. All three are reversible. Say otherwise and this TSD needs one more pass
before approval.

## TSD S-0002.01 — The export control reads as the panel's action  (PRD §S-0002.01)
| Aspect | Spec |
|--------|------|
| Interfaces | No change. The control keeps its existing role (button), its accessible name ("Export CSV"), its activation contract, and its props. Nothing is added to or removed from any module's public surface. |
| Data / State | None. No persisted state, no in-memory state, no new theme token, no stylesheet variable. The change is expressed entirely in the control's own presentation attributes. |
| Behavior | The control renders **filled**: a **deep red** background carrying a **white** label that reaches at least 4.5:1 against that fill, replacing the current outline treatment (a border with a transparent background). Fill and foreground are one decision, not two — no red shade in the palette accepts both a white and a dark label at AA (see Grounding), so pairing this fill with a dark label is a defect, not a variant. The fill is a red the eye separates from the app's **destructive** colour, which is not redefined or reused: red already signals deletion and error here, and a read-only export must not wear the identical shade (see Grounding). Pointer hover moves the fill **one step deeper** in the same red, still ≥4.5:1 against the same white label, so hover feedback survives the loss of the outline button's hover background. Keyboard focus renders a **visible indicator distinct from the fill itself** — the outline button signalled focus through its border, so a filled button must supply its own, and the indicator must be perceivable against both the red fill and the surrounding card. Exactly **one** shade set serves both light and dark theme (see Grounding). Activation, the CSV produced, the success message and the nothing-to-export message are all unchanged. |
| Access | Unchanged — the single owner, exactly as today. This story grants and removes no access. |
| Boundaries | None owned by this story. The export path's clock and browser-download boundary are 0001's and are untouched. Rendered colour is not a boundary that can be faked: what a shade *looks like* is only observable to a human eye on a real screen, which is why the verification below is split the way it is. |
| Tests | **unit:** the control renders a fill-and-foreground pair rather than the outline treatment, pairs the red fill with a **white** label (not a dark one), declares a deeper hover shade and a focus indicator, does so with no theme-conditional fill, and does **not** express its fill through the destructive token — asserted on the rendered element, keeping the role/name queries 0001's tests rely on. A unit test can check *which* fill and foreground were declared; it cannot judge their contrast ratio, which is why the ratios are fixed here in the spec by measurement rather than computed at runtime. Nor can it judge whether two reds *look* different — the token-reuse check is the mechanical half of that; the eye is the rest. **integration:** 0001's existing suite for this control passes **unchanged** — same accessible role and name, same CSV text, same success and empty messages; that suite is the regression proof that appearance-only stayed appearance-only, and it must not be edited to accommodate this change. **smoke (human, required):** in the running app the owner confirms the button reads red (red, not salmon or maroon), its label is comfortably readable on that fill, hover deepens it, tabbing to it shows a focus indicator, clicking still downloads the CSV — **and, with a delete control and a form error visible on the same screen, that the export still reads as safe to click rather than as a second destructive action** — repeated with the theme toggled, since no automated check can judge how a colour looks or what it connotes. |

## Out of scope
- Redefining the shared primary/secondary tokens or the `--destructive` token, or restyling the
  add-expense submit or the delete control. This story touches one element.
- Any change to what the export does, what the CSV contains, or what the status messages say.
- Introducing a colour-contrast linter or a visual-regression harness. Both would be reasonable
  follow-ups; neither is this story.
- A gradient, sheen or border treatment. "Red" here is a flat fill from the stock palette; a
  gradient would be a new visual idiom on this surface and belongs in its own story.
- Resolving the red/destructive collision noted in the Grounding section by changing anything *other*
  than this control — restyling the delete control, recolouring error text, or moving the destructive
  signal to another hue. If the smoke check finds the export reads as destructive, that is its own
  card, and it may conclude that red is the wrong colour for this control.

<!-- samir  -->