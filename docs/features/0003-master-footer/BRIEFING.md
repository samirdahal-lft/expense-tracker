---
approved_by: "Samir dahal"
approved_at: "2026-08-10"
approved_sha256: "64659e1398f66b8d11d8e6f4f513741da9ffbb9ca7d8440542da541e377023bd"
---
# Briefing 0003 — Persistent app footer

> Scratch pad — flesh the idea out before committing to a PRD.
> ★ Gate: stakeholder (PM / SA / client) approves before any PRD work begins.
> Approve by running `lane approve` — lane writes the stamp after your y/N confirm.
> Do NOT edit the frontmatter fields by hand; a hand-typed stamp does not count.

## Why
The app has a header (theme toggle, app name) but no footer. There is nowhere for
persistent, low-hierarchy content that belongs on every view but shouldn't compete
with the expense list or summary — things like a running grand total, a record count,
and minimal attribution. Scrolling past the last expense currently drops off a bare
white/dark edge; a footer closes that visual gap and gives the owner a quick at-a-
glance total without hunting through the category summary panel.

## Hypothesis
We add a sticky footer bar at the bottom of the viewport that shows: the total number
of expenses on record, the all-time grand total in NPR (reusing the same value the
category-summary already computes), and an app-name attribution line. The footer is
always visible, never scrolls away, costs no new API endpoints, and respects the
light/dark theme via the same semantic Tailwind tokens used throughout the app.

## Mocks / references
- Existing grand-total source: `frontend/src/features/summary/CategorySummary.tsx`
  (rendered today as part of the donut-chart panel — the footer would surface the same
  figure without duplicating the fetch).
- Theme tokens live in `frontend/src/index.css`; the footer must use semantic tokens
  (`bg-card`, `text-muted-foreground`, `border`) not hex literals.
- No Figma mock — a thin single-row bar (height ~40–48 px) with three segments:
  left: "N expenses", centre: "Rs X,XXX total", right: "Expense Tracker".

## Scope hints
**Probably in:**
- A sticky/fixed footer bar rendered in `App.tsx` below the main content area.
- Expense count: read from the existing `useExpenses` data (length of the list) — no
  new endpoint.
- Grand total: read from the existing `useSummary` data (`summary.total`) — no new
  endpoint.
- Light/dark theme compliance via semantic Tailwind tokens.
- Footer updates live when the list or summary refreshes (add/edit/delete already
  triggers both hooks to reload via `App.tsx:28-41`).

**Probably out:**
- A new API endpoint or a new DB query — all needed figures are already fetched.
- Per-category breakdown, charts, or sparklines in the footer.
- Navigation links (this is a single-panel SPA with no routes).
- A collapsible or interactive footer — it is display-only.
- Any change to the category-summary panel or the donut chart.

## Open questions
- Should the footer be `position: fixed` (always visible even while scrolling) or
  `sticky` on a flex-column layout? Fixed removes it from flow and may require body
  padding; sticky is simpler but disappears on very short content. Decide before PRD.
- When data is still loading (`loading: true`) or an error has occurred, what does the
  footer show? Placeholder dashes? Skeleton? Nothing? Decide before TSD.
- Is "Expense Tracker" the right attribution text, or does the owner want something
  else (version number, tagline)?

## Approval
Run `lane approve` — lane stamps the frontmatter (name, date, content hash) after you confirm.
Editing this file after approval invalidates the stamp and reopens the gate.

sasas

sasa

asas
