---
approved_by: "Samir dahal"
approved_at: "2026-08-06"
approved_sha256: "c4ed7d076019966b71808fc8869661f73940ea2744a02e0cf7c97dbcd0a62c5b"
---
# PRD 0003 — Persistent app footer

> User stories + acceptance criteria + success metrics. Signed off by PM + SA + DS.
> Feature-scoped (LANE §8): one PRD per feature/milestone, under docs/features/0003-master-footer/.

**Source:** Briefing 0003 — the app has no footer; the owner has no quick at-a-glance total
without opening the category-summary panel.
**Parent:** (none — this is the master/umbrella iteration)

---

## Story S-0003.01 — A persistent footer bar surfaces the live expense count and grand total

As the owner I want a footer bar always visible at the bottom of the app so that I can
see my total expense count and running grand total at a glance without scrolling to the
summary panel.

**Acceptance criteria:** (tag each: `behavior` | `invariant` | `non-functional` | `e2e`)
> `behavior` = observable outcome through an interface. `invariant` = no public surface.
> `non-functional` = perf/accuracy/a11y. `e2e` = reachable by a real user through the running system.

- [ ] AC-1 [behavior] — The footer renders as a full-width bar below the main content area in
      both light and dark theme, using only semantic Tailwind tokens (`bg-card`,
      `text-muted-foreground`, `border-t`) — no hex literals, no hardcoded colours.
- [ ] AC-2 [behavior] — The footer left segment shows the live count of expense records, rendered
      as `"N expenses"` (e.g. `"12 expenses"`), derived from the length of the list that
      `useExpenses` already fetches — no new API call and no new DB query.
- [ ] AC-3 [behavior] — The footer centre segment shows the all-time grand total formatted by the
      existing `formatNpr()` helper (`frontend/src/lib/format.ts`) and labelled `"… total"`
      (e.g. `"Rs 12,500 total"`), derived from the `total` field that `useSummary` already fetches.
- [ ] AC-4 [behavior] — The footer right segment shows the static attribution text
      `"Expense Tracker"`.
- [ ] AC-5 [behavior] — After any add, edit, or delete the footer count and total update without a
      page reload, reflecting the same reload that `App.tsx` already triggers on both `useExpenses`
      and `useSummary` (lines 28-41).
- [ ] AC-6 [behavior] — While either data fetch is in the loading state, the corresponding
      footer segment shows `"--"` as a placeholder instead of a stale or blank value. When the
      fetch recovers, the real value replaces the placeholder without a page reload.
- [ ] AC-7 [behavior] — If either data fetch is in the error state, the corresponding footer
      segment shows `"--"`. The footer never shows a raw error message or crashes the page.
- [ ] AC-8 [non-functional] — The footer uses `position: sticky` at the bottom of a
      flex-column root layout so it sits below all content without removing itself from the
      document flow and without requiring padding on `<body>`. Content above the footer scrolls
      normally on short-viewport devices.
- [ ] AC-9 [non-functional] — The footer is marked up as a `<footer>` HTML landmark element,
      giving screen readers a named landmark without an explicit `aria-label`. The top border
      uses the semantic `border-t` token and provides a visual separator in both themes.
- [ ] AC-10 [invariant] — No new API endpoint is added and no new DB query is issued. Both
      figures (`expenses.length` and `summary.total`) are passed as props from `App.tsx` —
      the composition root that already owns both hook instances — so no second fetch runs.
- [ ] AC-11 [e2e] — In the running app (`docker compose up`, `http://localhost:8090`) the owner
      sees the footer at the bottom of the viewport with the correct count and grand total. Adding,
      editing, or deleting an expense immediately updates both footer values. Switching between
      light and dark theme does not leave any hardcoded colour visible in the footer.

**Success metric:** the owner opens the app and can read the total spend without scrolling to or
expanding the summary panel; the count and total stay accurate across add/edit/delete without a
page reload.

---

## Open questions (resolved from BRIEFING)

- **Fixed vs sticky:** `position: sticky` on a flex-column layout (AC-8). Avoids body-padding
  plumbing and keeps the footer in document flow.
- **Loading/error display:** `"--"` placeholder (AC-6, AC-7). Consistent with Convention 9:
  "every list surface renders loading, error, and empty states explicitly."
- **Attribution text:** `"Expense Tracker"` (AC-4). No version number for now; no open question.

## Open questions for the human
- None — all BRIEFING questions resolved above. Human review at this gate is the final check.
