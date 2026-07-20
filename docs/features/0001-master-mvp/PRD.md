---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "8b23e78423d38baa1e508a900dd728b517ccf6ce3d44379fac15e7849518f8ba"
---
# PRD 0001 — Expense Tracker MVP
> User stories + acceptance criteria + success metrics. Signed off by PM + SA + DS.
> Feature-scoped (LANE §8): one PRD per feature/milestone, under docs/features/0001-master-mvp/.

**Source:** Briefing 0001 (approved 2026-07-20)   ← why this feature exists (audit chain, §4; trace ↑ to BRIEFING.md)
**Parent:** (none — this master iteration IS the umbrella)

## Overview
A single-user, local expense tracker. One person records what they spend, sees the list,
deletes mistakes, and reads a per-category breakdown of their spending. A React + Vite SPA
talks to a FastAPI backend over HTTP/JSON; the backend owns a single SQLite file. The whole
stack comes up with one `docker compose up`. The UI is deliberately polished: premium, clean,
themed for light and dark.

**In scope:** add / list / delete an expense; per-category summary; fixed seed categories;
polished themed single-page UI; Dockerized deployment.
**Out of scope (deferred):** edit an expense; filtering; CSV import/export; category
management; auth / multi-user; budgets, recurring, income, imports; multi-currency; cloud sync.

## Domain rules (apply to all stories)
- **Categories** are a fixed seed list: **Food, Transport, Bills, Other**. Not user-managed.
- **Money** is captured, stored, and returned as **whole Nepalese Rupees (NPR)** — an
  **integer number of rupees**; never floats and no paisa/sub-rupee precision. The currency is
  fixed app-wide, not stored per-row. (This keeps money as an exact integer, satisfying the
  CONSTITUTION's "no floats for currency" hard rule; it restates that rule's *minor-unit*
  wording from cents to whole rupees — a human should ratify this into `CONSTITUTION.md` or an
  ADR at TSD time.)
- **Currency display** — the UI formats amounts as NPR whole rupees (e.g. `Rs 1,250` / `रू 1,250`),
  single currency throughout; no currency selection or conversion.
- **Date** of an expense is a calendar date; timestamps persist as ISO-8601 UTC (CONSTITUTION §5).
- **No authentication** — a single trusted local user; every request sees the one dataset.

---

## Story S-0001.01 — Add an expense
As the user I want to record an expense with an amount, category, date, and optional note
so that my spending is captured.

**Acceptance criteria:**
- [ ] AC-1 [behavior] — Submitting amount + category (from the fixed list) + date, with an
  optional note, creates an expense and returns it with a server-assigned id.
- [ ] AC-2 [invariant] — A rejected amount (non-positive, non-integer) or a category outside
  the fixed seed list is refused with a validation error; no expense is created.
- [ ] AC-3 [invariant] — The stored/returned amount is a positive integer number of whole NPR.
- [ ] AC-4 [e2e] — Through the running UI, filling the add-expense form and submitting makes
  the new expense appear in the list without a manual page reload.

**Success metric:** A user can add an expense in one screen and see it reflected immediately.

---

## Story S-0001.02 — List expenses
As the user I want to see all my recorded expenses so that I can review what I've spent.

**Acceptance criteria:**
- [ ] AC-1 [behavior] — The API returns all expenses, most recent first, each with id, amount
  (whole NPR), category, date, and note.
- [ ] AC-2 [behavior] — With no expenses recorded, the API returns an empty collection (not an error).
- [ ] AC-3 [e2e] — Through the running UI, existing expenses are shown in a readable list with
  amount, category, date, and note.
- [ ] AC-4 [non-functional] — When no expenses exist, the UI shows a deliberate **empty state**
  (not a blank screen); while data is loading, it shows a **loading state**.

**Success metric:** The user always sees an unambiguous view — data, empty, or loading.

---

## Story S-0001.03 — Delete an expense
As the user I want to delete an expense so that I can remove mistakes.

**Acceptance criteria:**
- [ ] AC-1 [behavior] — Deleting an existing expense by id removes it; a subsequent list no
  longer includes it.
- [ ] AC-2 [invariant] — Deleting a non-existent id is reported as not-found and changes nothing.
- [ ] AC-3 [e2e] — Through the running UI, a per-row delete control removes the expense from the
  list and updates the category summary without a manual reload.

**Success metric:** The user can correct the record by removing an entry in one action.

---

## Story S-0001.04 — Per-category summary
As the user I want to see my spending broken down by category so that I understand where my
money goes.

**Acceptance criteria:**
- [ ] AC-1 [behavior] — The API returns total spend and a per-category total (in whole NPR)
  across all expenses.
- [ ] AC-2 [invariant] — Per-category totals sum to the reported grand total; a category with no
  expenses contributes zero (and is not misreported as missing data).
- [ ] AC-3 [e2e] — Through the running UI, the summary is shown as a **donut chart** with the
  per-category totals alongside, and it reflects adds/deletes without a manual reload.
- [ ] AC-4 [non-functional] — With no expenses, the summary shows a deliberate empty state rather
  than an empty or broken chart.

**Success metric:** At a glance the user can tell which categories dominate their spending.

---

## Story S-0001.05 — Premium, themed UI
As the user I want the app to look modern and polished so that it's pleasant to use daily.

**Acceptance criteria:**
- [ ] AC-1 [non-functional] — Single-page layout using rounded cards with subtle shadows, a
  single consistent accent color, and considered spacing/typography.
- [ ] AC-2 [behavior] — A visible control toggles **light and dark mode**; both are fully styled
  (surfaces, text, accent, and chart adapt), and the choice persists across reloads.
- [ ] AC-3 [non-functional] — Built on the ratified frontend stack: React + Vite + TypeScript,
  Tailwind CSS, and shadcn/ui component primitives.
- [ ] AC-4 [e2e] — Through the running app, the user can switch theme and every surface —
  including the donut chart — renders correctly in both modes.

**Success metric:** The app reads as premium, not plain, in both light and dark mode.

---

## Story S-0001.06 — One-command Dockerized run
As the operator I want the whole stack to start with one command so that setup is trivial and
data survives restarts.

**Acceptance criteria:**
- [ ] AC-1 [e2e] — `docker compose up` starts frontend + backend + SQLite and the app is
  reachable in a browser; the user can add, list, and delete expenses end-to-end.
- [ ] AC-2 [invariant] — The SQLite database is stored on a named volume so recorded expenses
  persist across `docker compose down` / `up` (the DB file is never baked into an image or
  committed to git — CONSTITUTION hard rule).

**Success metric:** A fresh clone runs with one command, and data persists across restarts.

---

## Open questions for spec (TSD) work
_All resolved — folded into the context docs (pending human ratification of those edits):_
- Resolved: **Tailwind + shadcn/ui + Recharts** ratified into `docs/context/CONSTITUTION.md`
  (Stack + styling hard rule).
- Resolved: **container topology + SQLite named volume** ratified into
  `docs/context/BLUEPRINT.md` (Deployment Topology section).
- Resolved: currency is **NPR (Nepalese Rupee)**, amounts are **whole rupees** stored as
  integers (no paisa) — `CONSTITUTION.md` Convention #2 + no-floats hard rule reworded.
