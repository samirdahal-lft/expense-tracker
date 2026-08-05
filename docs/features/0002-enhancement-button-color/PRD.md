---
approved_by: "Samir dahal"
approved_at: "2026-08-05"
approved_sha256: "de3565ba3f83cd607debb44be1c5bac58f6907326e667bcddf3514eab9cd6028"
---
# Mini PRD 0002 — Make the Export CSV button red
> An `enhancement` iteration (LANE §8) — a small, scoped improvement on top of what already
> ships. Lighter than a full feature PRD: usually one story, no full success-metrics apparatus.
> Paired with TSD.md in this folder. If it grows past a couple of stories, it's a `feature` —
> create one instead.

**Parent:** 0001 (enhancement — export expenses to CSV). This restyles the control that feature
introduced; it adds no behavior to it.
**Source:** real-usage feedback — the owner asked for the export control to be coloured after seeing
it ship as a plain outline button. Purple was tried first, then golden, then pink; all three were
dropped. The colour is **red**.

> **Scope honesty.** This is a single-property visual change to one control. It is written up
> because the work is going through LANE, not because it carries product risk. If you would rather
> not spend a PRD/TSD cycle on a colour, `lane abandon 0002-enhancement-button-color` and take the
> one-line change directly — that is a legitimate call for cosmetics, and this document is not
> load-bearing for anything else.

> **Prior work disclosure.** A purple version of this change was already applied once in the main
> checkout before this feature existed, then reverted so no code precedes plan approval (ADR-0010).
> Nothing from it is reapplied — the only thing it left behind is the measured evidence in the TSD
> that a fill's contrast has to be checked rather than eyeballed.

> **Respec note (third one).** This document has now been reworded three times: approved as
> **purple**, respecced to **golden**, then to **pink**, and now to **red** at the owner's request.
> Each rewording invalidates the approval hash and reopens the PRD and TSD gates. No code has been
> written under any of the four colours, so nothing is wasted beyond spec passes — but red raises one
> thing the earlier colours did not, and it is the one thing worth reading before re-approving: **red
> already means something in this app.** See the AC-8 note below.

> **A cheaper path, offered twice.** Four respecs at the spec gate is a signal that the colour is
> being chosen by looking, not by specifying — which is a reasonable way to choose a colour. The
> browser-first option was offered at the pink pass and declined; the owner chose to continue through
> the pipeline, and this document follows that decision. It stays on the table: `lane abandon
> 0002-enhancement-button-color` and a one-line change is still a legitimate call for cosmetics.

---

## Story S-0002.01 — The export control reads as the primary action on the expenses panel
As the owner I want the Export CSV button filled in red rather than drawn as a plain outline so
that it is visibly the action on the expenses panel and not mistaken for a border or a label.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — The export control renders as a filled red button: a red background with
      foreground text chosen for contrast against it, not the outline treatment
      (`border-input` + transparent background) it ships with today. "Red" means it reads as red to
      the eye, not as pink, salmon or brown — red's lightest shades drift to salmon and its darkest
      to maroon, and both cross that line.
- [ ] AC-2 [behavior] — The button has a distinct red hover state, so hovering still gives feedback
      now that the outline button's `hover:bg-secondary` no longer applies.
- [ ] AC-3 [invariant] — Keyboard focus stays visible. The outline button conveyed focus through
      its border; a filled button must carry its own visible focus indicator, so AC-9 of 0001
      (the control is keyboard-reachable and its state perceivable) does not regress.
- [ ] AC-4 [invariant] — Export behavior is untouched: the same accessible role and name, the same
      CSV output, the same success and nothing-to-export messages. This story changes appearance
      only, and 0001's test suite must pass unchanged — tests locate the control by role and name,
      never by class, and that must stay true.
- [ ] AC-5 [non-functional] — The red fill is legible in both light and dark theme, and its label
      meets WCAG AA for normal text (4.5:1) against the fill. Red does **not** admit two answers the
      way pink did: the shades that read as genuine red carry a white label, and the shades that take
      a dark label read as salmon. Fill and foreground are therefore chosen **as a pair**, and the
      pair is fixed by measurement in the TSD. The app persists a light/dark preference, so a shade
      checked against only one background is not sufficient.
- [ ] AC-6 [non-functional] — No new dependency and no new design token. Tailwind's stock `red`
      palette is available because `tailwind.config.ts` only `extend`s `colors`, so this needs
      neither a CSS variable nor a change to the shadcn HSL token set.
- [ ] AC-7 [e2e] — In the running app (`docker compose up`, `http://localhost:8090`), the owner sees
      a red Export CSV button on the expenses panel, hovering changes its shade, tabbing to it
      shows a focus indicator, and clicking it still exports.
- [ ] AC-8 [invariant] — The export fill is **visibly distinct from the app's destructive red**, and
      the `--destructive` token is not redefined or reused. Red is already this app's error-and-delete
      signal (`--destructive: 0 72% 51%` — effectively `red-600` — carries the delete control's hover
      colour and every form error message). A red export button therefore makes red mean two things
      on one panel; the export fill must at least not be *the same red*, so the destructive signal
      keeps a colour of its own.

**Success metric:** the owner looks at the expenses panel in both themes and confirms the export
control reads as red and as the panel's action — and that a red export button beside red error text
and a red-on-hover delete control still reads as safe to click — with 0001's suite still green.

---

## Open questions for the human
- **Is the red/destructive collision acceptable?** This is the one substantive question red raises,
  and it was put to the owner before this respec was written: the answer was to proceed with red, and
  the shade choice was delegated to measurement. So this is recorded, not blocking. The residual risk
  is that the export — a read-only action that changes nothing — wears the colour this app otherwise
  uses for deletion and errors. The TSD mitigates it as far as a single control can (a deeper red than
  `--destructive`, so the two are not the same colour) but cannot remove it: the mitigation is
  *distinguishable*, not *unambiguous*. If the smoke check reads wrong, the honest fixes are a
  non-red fill or restyling the delete control, and both are their own story.
- **Which red?** Not offered as a choice this time — the owner asked for the shade to be picked by
  measurement, and the TSD does that from the stock `red` palette. Unlike pink, red does not present
  two viable pairings: see the TSD table. Overriding it is still a one-line change to the TSD's
  Behavior row.
- **Should this become the app's primary-button style rather than a one-off?** Today the only other
  filled button is the form's submit (the delete control is a text button that turns red on hover). A
  red that exists on exactly one control is a style fork; promoting it to the `primary` token would be
  a larger, deliberate change and is explicitly *not* in this PRD's scope. Note that promoting *red*
  specifically would collide with `--destructive` app-wide, not just on this panel — which is an
  argument for keeping it a one-off.

<!-- samir dahal -->

## Story S-0002.02 — The export control reads as the primary action on the expenses panel
<!-- sam -->
<!-- #dahal -->

<!-- mony -->