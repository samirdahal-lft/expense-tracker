---
approved_by: "Samir dahal"
approved_at: "2026-07-27"
approved_sha256: "6f0e2518249f1540cdac9588c045453194e248251f36d46e5b30f84824f19890"
---
# Mini PRD 0002 — Edit an expense
> An `enhancement` iteration (LANE §8) — a small, scoped improvement on top of what already
> ships. Lighter than a full feature PRD: usually one story, no full success-metrics apparatus.
> Paired with TSD.md in this folder. If it grows past a couple of stories, it's a `feature` —
> create one instead.

**Parent:** 0001-master-mvp — builds on the recorded-expense list (create, list, delete) shipped there.
**Source:** real-usage feedback   ← why this exists (audit chain, §4; trace ↑ to docs/ROADMAP.md)

A recorded expense is currently immutable: a typo in the amount, the wrong category, or a
mis-keyed date can only be fixed by deleting the row and re-entering it, which loses the
original `created_at` and makes correcting a mistake feel like destroying data. PRODUCT.md
already names "Edit and delete existing expenses" as in-scope product behavior; delete ships,
edit does not. This closes that gap.

---

## Scope

**In scope**
- Editing an existing expense's four user-owned fields: amount, category, date, note.
- One expense at a time, from the existing expense list.

**Out of scope**
- Bulk edit — no multi-select, no edit-many-at-once.
- Undo / revert of an edit.
- Edit history, audit trail, or "last modified" display.
- Delete — already ships; unchanged by this work.

---

## Story S-0002.01 — Correct a recorded expense
As the person tracking my spending I want to change an expense I already recorded so that a
typo or mis-categorization can be corrected without deleting and re-entering the record.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `e2e` = reachable by a real user through the running system.
- [ ] AC-1 [behavior] — Opening edit on an expense presents a form pre-filled with that
      expense's current amount, category, date, and note. No field starts blank or defaulted
      when the expense has a value for it; an absent note presents as empty.
- [ ] AC-2 [behavior] — Submitting the form with valid changes persists them, and the change
      survives a page reload. Fields the user did not touch keep their existing values, and
      the expense keeps its original identity and `created_at`.
- [ ] AC-3 [invariant] — An amount that is not a positive whole number of NPR is rejected:
      zero, negative, and non-integer (e.g. `12.50`) amounts are all refused with a message
      naming the problem, and the stored expense is left unchanged. Rejection holds at the API,
      not only in the browser.
- [ ] AC-4 [invariant] — Editing is not a validation bypass: category must be one of the
      existing fixed set (Food, Transport, Bills, Other) and date must be a valid calendar date
      in `YYYY-MM-DD`, exactly as when the expense was created.
- [ ] AC-5 [behavior] — Dismissing the form without submitting leaves the expense untouched.
- [ ] AC-6 [e2e] — Through the running app: a user viewing the expense list opens an entry,
      changes its amount and category, saves, and sees the updated values in the list without
      reloading the page.

**Success metric:** correcting a mistaken expense takes one edit-and-save round trip with no
deletion, and the corrected row shows its new values in the list immediately.

---

## Open questions for review
1. **Summary refresh.** The page also shows total spend and spend-by-category. Editing an
   amount or category changes both. AC-6 only requires the *list* to update live, per the
   stated scope — should the summary refresh in the same interaction, or is a stale summary
   until next reload acceptable? (Recommend: refresh it — a visibly wrong total on screen
   reads as a bug regardless of scope wording.)
2. **Where the form lives.** Inline row-expand vs. a modal dialog. Deliberately left to the
   TSD, but if you have a preference it belongs here.
3. **Note removal.** Should clearing the note field remove an existing note, or is an empty
   submission treated as "leave the note alone"? (Recommend: clearing removes it — anything
   else makes a note permanent once written.)
