---
approved_by: "samir dahal"
approved_at: "2026-07-20"
approved_sha256: "0e005054d5a7912bfdc0df8b6d6adc21e1a3fb1c16e353cdf0e2d58adc29c58f"
---
# Briefing 0001 — Expense Tracker MVP
> Scratch pad — flesh the idea out before committing to a PRD.
> ★ Gate: stakeholder (PM / SA / client) approves before any PRD work begins.
> Approve by running `lane approve` — lane writes the stamp after your y/N confirm.
> Do NOT edit the frontmatter fields by hand; a hand-typed stamp does not count.

## Why
One person wants a simple, private way to record and understand their spending without
signing up for a hosted finance app or handing over bank credentials. Existing tools are
either heavyweight, multi-user, or cloud-only. This MVP is the smallest thing that lets a
single user log expenses locally and immediately see where their money goes.

## Hypothesis
We can deliver a genuinely useful expense tracker as a local single-user web app: a
React + Vite frontend talking to a FastAPI backend over JSON, persisting to one SQLite file.
The MVP is the smallest thing that answers *"what did I spend, and on what?"* — add an
expense, see the list, delete a mistake, and read a per-category total. No accounts, no
category management, no filtering, no imports.

## Mocks / references
<!-- Figma links, wireframes, prior art, anything that helps visualize the idea. -->
- No formal mocks yet. Reference UX: a single-page app with (1) an "add expense" form,
  (2) an expense list (each row deletable), and (3) a summary panel with per-category totals.
- Prior art for feel: YNAB / Spendee "transactions" view, minus the accounts and budgets.

### Look & feel (design intent)
The MVP should look modern and premium, not plain. Target qualities:
- Clean **single page**, generous spacing, and a considered type scale.
- A single **accent color**, applied consistently (primary actions, chart, highlights).
- **Light and dark mode**, with a toggle; both fully styled.
- **Rounded cards with subtle shadows** as the primary surface.
- The category summary shown as a **donut chart** (with the per-category totals).
- Deliberate **empty states** (no expenses yet) and **loading states** (data in flight).

**Intended UI stack:** React 18 + Vite + TypeScript (per CONSTITUTION), plus **Tailwind CSS**
for styling and **shadcn/ui** for the component primitives; a charting lib (e.g. Recharts) for
the donut. Tailwind + shadcn/ui extend the CONSTITUTION's frontend stack (which names React +
Vite but no styling system) — a human should ratify this into `docs/context/CONSTITUTION.md`
(or an ADR) during PRD/TSD work.

## Scope hints
**In (the core):**
- Add an expense: amount, category, date, optional note.
- List expenses.
- Delete an expense.
- Summary: total spend broken down by category.
- Category is a fixed seed list — **Food, Transport, Bills, Other** — chosen at add time.
- Money stored as integer minor units (cents); single currency assumed.
- Polished single-page UI: accent color, light/dark mode, rounded cards with subtle
  shadows, donut chart for the summary, considered spacing/typography, empty + loading states.
- **Dockerized**: a single `docker compose up` brings up frontend + backend + SQLite. The
  SQLite file lives on a named volume so data persists across container restarts.

**Out (deferred to later enhancements):**
- Edit an expense.
- Filter expenses by date range or category.
- CSV import/export.
- Category management (create / rename / delete categories).
- Authentication / multi-user / sharing / roles.
- Budgets, limits, recurring transactions, income tracking, bank/API imports, receipts.
- Multi-currency, cloud sync, hosted deployment, native mobile.

## Open questions
<!-- Must be resolved before PRD. Delete each line when answered. -->
- Resolved: **no auth** — trusted local machine, single user.
- Resolved: **CSV deferred** — not in MVP.
- Resolved: **fixed seed categories** — Food, Transport, Bills, Other; no category management in MVP.

## Approval
Run `lane approve` — lane stamps the frontmatter (name, date, content hash) after you confirm.
Editing this file after approval invalidates the stamp and reopens the gate.
