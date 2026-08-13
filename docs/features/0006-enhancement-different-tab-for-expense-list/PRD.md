---
approved_by: "Samir dahal"
approved_at: "2026-08-13"
approved_sha256: "8b3ef8b92074bd5cbc8bcf57bcf49a66b065e93e5cac34a69473d62619b1e82c"
---
# Mini PRD 0006 — Tab navigation for expense list and summary

> An `enhancement` iteration (LANE §8) — a small, scoped improvement on top of what already
> ships. Lighter than a full feature PRD: usually one story, no full success-metrics apparatus.
> Paired with TSD.md in this folder. If it grows past a couple of stories, it's a `feature` —
> create one instead.

**Parent:** 0003-master-footer (builds on the core app shell)
**Source:** real-usage feedback — expense list and category summary are stacked on the same page; users want to focus on one view at a time without scrolling

---

## Story S-0006.01 — Tab panel separating Expenses and Summary views
As a user I want to switch between an "Expenses" tab and a "Summary" tab so that I can focus on either my expense list or my category breakdown without both cluttering the screen.

**Acceptance criteria:**
- [ ] AC-1 [behavior] — Two tab buttons labeled "Expenses" and "Summary" are rendered below the add-expense form
- [ ] AC-2 [behavior] — "Expenses" tab is selected by default; the expense list and export button are visible; the category summary is not
- [ ] AC-3 [behavior] — Clicking "Summary" tab makes the category summary visible and hides the expense list and export button
- [ ] AC-4 [behavior] — Clicking "Expenses" tab from "Summary" restores the expense list and hides the summary
- [ ] AC-5 [invariant] — The add-expense form and edit-expense form always render above the tab panel, unaffected by tab state
- [ ] AC-6 [e2e] — A real user can add an expense, switch to "Summary", see the updated category total, then switch back to "Expenses" and see the new row

**Success metric:** No vertical scrolling required to reach either the expense list or the summary; both are one click away from each other
