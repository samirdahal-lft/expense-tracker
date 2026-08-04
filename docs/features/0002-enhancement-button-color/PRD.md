---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "bd9fe5f18096ecb6c0dc3aeebe97927915413283a36a8427658ec5c22d0f70cf"
---
# Mini PRD 0002 — Make the Export CSV button pink
> An `enhancement` iteration (LANE §8) — a small, scoped improvement on top of what already
> ships. Lighter than a full feature PRD: usually one story, no full success-metrics apparatus.
> Paired with TSD.md in this folder. If it grows past a couple of stories, it's a `feature` —
> create one instead.

**Parent:** 0001 (enhancement — export expenses to CSV). This restyles the control that feature
introduced; it adds no behavior to it.
**Source:** real-usage feedback — the owner asked for the export control to be coloured after seeing
it ship as a plain outline button. Purple was tried first, then golden; both were dropped. The
colour is **pink**.

> **Scope honesty.** This is a single-property visual change to one control. It is written up
> because the work is going through LANE, not because it carries product risk. If you would rather
> not spend a PRD/TSD cycle on a colour, `lane abandon 0002-enhancement-button-color` and take the
> one-line change directly — that is a legitimate call for cosmetics, and this document is not
> load-bearing for anything else.

> **Prior work disclosure.** A purple version of this change was already applied once in the main
> checkout before this feature existed, then reverted so no code precedes plan approval (ADR-0010).
> Nothing from it is reapplied — the only thing it left behind is the measured evidence in the TSD
> that a fill's contrast has to be checked rather than eyeballed.

> **Respec note (second one).** This document has now been reworded twice: approved as **purple**,
> respecced to **golden**, and respecced again to **pink** at the owner's request. Each rewording
> invalidates the approval hash and reopens the PRD and TSD gates. No code has been written under any
> of the three colours, so nothing is wasted beyond spec passes — but the shade decision below is
> genuinely different this time, and it is the one thing worth reading before re-approving.

> **A cheaper path, offered once.** Three respecs at the spec gate is a signal that the colour is
> being chosen by looking, not by specifying — which is a reasonable way to choose a colour. If you
> would rather iterate in the browser, say so and I will put the pink on directly in the running app
> so you can see it, and we settle the spec afterwards (or `lane abandon` this feature and treat it
> as a one-line change). Otherwise this continues through the pipeline as written, which is fine too.

---

## Story S-0002.01 — The export control reads as the primary action on the expenses panel
As the owner I want the Export CSV button filled in pink rather than drawn as a plain outline so
that it is visibly the action on the expenses panel and not mistaken for a border or a label.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — The export control renders as a filled pink button: a pink background with
      foreground text chosen for contrast against it, not the outline treatment
      (`border-input` + transparent background) it ships with today. "Pink" means it reads as pink to
      the eye, not as red, magenta or maroon — pink's darker shades cross that line.
- [ ] AC-2 [behavior] — The button has a distinct pink hover state, so hovering still gives feedback
      now that the outline button's `hover:bg-secondary` no longer applies.
- [ ] AC-3 [invariant] — Keyboard focus stays visible. The outline button conveyed focus through
      its border; a filled button must carry its own visible focus indicator, so AC-9 of 0001
      (the control is keyboard-reachable and its state perceivable) does not regress.
- [ ] AC-4 [invariant] — Export behavior is untouched: the same accessible role and name, the same
      CSV output, the same success and nothing-to-export messages. This story changes appearance
      only, and 0001's test suite must pass unchanged — tests locate the control by role and name,
      never by class, and that must stay true.
- [ ] AC-5 [non-functional] — The pink fill is legible in both light and dark theme, and its label
      meets WCAG AA for normal text (4.5:1) against the fill. Pink admits two valid answers — a light
      pink with dark text, or a deep pink with white text — and the fill and foreground must be
      chosen **as a pair**. The app persists a light/dark preference, so a shade checked against only
      one background is not sufficient.
- [ ] AC-6 [non-functional] — No new dependency and no new design token. Tailwind's stock `pink`
      palette is available because `tailwind.config.ts` only `extend`s `colors`, so this needs
      neither a CSS variable nor a change to the shadcn HSL token set.
- [ ] AC-7 [e2e] — In the running app (`docker compose up`, `http://localhost:8090`), the owner sees
      a pink Export CSV button on the expenses panel, hovering changes its shade, tabbing to it
      shows a focus indicator, and clicking it still exports.

**Success metric:** the owner looks at the expenses panel in both themes and confirms the export
control reads as pink and as the panel's action, with 0001's suite still green.

---

## Open questions for the human
- **Soft pink or hot pink?** This is a real choice, unlike gold — both pass AA, and the TSD picks one
  so the work is not blocked:
  - **soft pink** (`pink-400` fill, near-black label, `pink-500` on hover) — unmistakably pink, wide
    contrast margins (7.5:1), reads friendly. **This is what the TSD specifies.**
  - **hot pink** (`pink-600` fill, white label, `pink-700` on hover) — bolder and closer in weight to
    the app's other filled buttons, but it only clears AA by a hair (4.60:1) and starts drifting
    toward magenta.
  Say which you want at the approve gate; switching is a one-line change to the TSD's Behavior row.
- **Should this become the app's primary-button style rather than a one-off?** Today the only other
  filled buttons are the form's submit and the destructive delete. A pink that exists on exactly one
  control is a style fork; promoting it to the `primary` token would be a larger, deliberate change
  and is explicitly *not* in this PRD's scope. Note the delete control is already red — a hot pink
  next to it risks reading as a second destructive action, which is an argument for the soft pink.
