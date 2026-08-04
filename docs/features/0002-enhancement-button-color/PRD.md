---
approved_by: "Samir dahal"
approved_at: "2026-08-04"
approved_sha256: "6f3d6fad1d9263985ba123ab7b982caf0bed19ace7fdfce3dc3dc082a6460188"
---
# Mini PRD 0002 — Make the Export CSV button golden
> An `enhancement` iteration (LANE §8) — a small, scoped improvement on top of what already
> ships. Lighter than a full feature PRD: usually one story, no full success-metrics apparatus.
> Paired with TSD.md in this folder. If it grows past a couple of stories, it's a `feature` —
> create one instead.

**Parent:** 0001 (enhancement — export expenses to CSV). This restyles the control that feature
introduced; it adds no behavior to it.
**Source:** real-usage feedback — the owner asked for the export control to be coloured after seeing
it ship as a plain outline button. Purple was tried first and dropped; the colour is **golden**.

> **Scope honesty.** This is a single-property visual change to one control. It is written up
> because the work is going through LANE, not because it carries product risk. If you would rather
> not spend a PRD/TSD cycle on a colour, `lane abandon 0002-enhancement-button-color` and take the
> one-line change directly — that is a legitimate call for cosmetics, and this document is not
> load-bearing for anything else.

> **Prior work disclosure.** A purple version of this change was already applied once in the main
> checkout before this feature existed, then reverted so no code precedes plan approval (ADR-0010).
> That purple has since been dropped at the owner's request, so nothing from it is reapplied — the
> only thing it left behind is the measured evidence in the TSD that a fill's contrast has to be
> checked rather than eyeballed.

> **Respec note.** This document was approved describing a **purple** button. The owner then said
> they no longer want purple and asked for **golden**. Both this PRD and the TSD have been reworded
> accordingly, which invalidates their approval hashes and reopens both gates for a fresh read. The
> change is not cosmetic to the spec: golden inverts the foreground rule (see TSD), so re-reading
> AC-1 and AC-5 matters.

---

## Story S-0002.01 — The export control reads as the primary action on the expenses panel
As the owner I want the Export CSV button filled in golden rather than drawn as a plain outline so
that it is visibly the action on the expenses panel and not mistaken for a border or a label.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — The export control renders as a filled golden button: a golden background
      with foreground text chosen for contrast against it, not the outline treatment
      (`border-input` + transparent background) it ships with today. "Golden" means it reads as gold
      to the eye — a light, warm yellow fill, not a dark brown-yellow that merely sits in the same
      hue family.
- [ ] AC-2 [behavior] — The button has a distinct golden hover state, so hovering still gives
      feedback now that the outline button's `hover:bg-secondary` no longer applies.
- [ ] AC-3 [invariant] — Keyboard focus stays visible. The outline button conveyed focus through
      its border; a filled button must carry its own visible focus indicator, so AC-9 of 0001
      (the control is keyboard-reachable and its state perceivable) does not regress.
- [ ] AC-4 [invariant] — Export behavior is untouched: the same accessible role and name, the same
      CSV output, the same success and nothing-to-export messages. This story changes appearance
      only, and 0001's test suite must pass unchanged — tests locate the control by role and name,
      never by class, and that must stay true.
- [ ] AC-5 [non-functional] — The golden fill is legible in both light and dark theme, and its text
      meets WCAG AA for normal text (4.5:1) against the fill. This is the criterion golden makes
      sharp: a gold fill is light, so **white text on it fails** — the foreground must be dark. The
      app persists a light/dark preference, so a shade checked against only one background is not
      sufficient.
- [ ] AC-6 [non-functional] — No new dependency and no new design token. Tailwind's stock warm-yellow
      palette is available because `tailwind.config.ts` only `extend`s `colors`, so this needs
      neither a CSS variable nor a change to the shadcn HSL token set.
- [ ] AC-7 [e2e] — In the running app (`docker compose up`, `http://localhost:8090`), the owner sees
      a golden Export CSV button on the expenses panel, hovering changes its shade, tabbing to it
      shows a focus indicator, and clicking it still exports.

**Success metric:** the owner looks at the expenses panel in both themes and confirms the export
control reads as golden and as the panel's action, with 0001's suite still green.

---

## Open questions for the human
- **How dark may the gold go before it stops being gold?** The constraint runs the opposite way from
  purple: the shades that read most clearly as gold need *dark* text, and the shades that take white
  text have gone brown. The TSD picks a light gold with near-black text; if you would rather have
  white text, the fill has to darken to roughly a bronze and AC-1's "reads as gold" is what gives.
- **Should this become the app's primary-button style rather than a one-off?** Today the only other
  filled buttons are the form's submit and the destructive delete. A gold that exists on exactly
  one control is a style fork; promoting it to the `primary` token would be a larger, deliberate
  change and is explicitly *not* in this PRD's scope. It matters more for gold than it did for
  purple, because a gold `primary` would force dark foreground text app-wide.
