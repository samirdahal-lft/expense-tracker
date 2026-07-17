---
approved_by: ""
approved_at: ""
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
The MVP is "record expenses, categorize them, filter them, and see per-category totals" —
enough to answer *"what did I spend, and on what?"* — with no accounts, budgets, or imports.

## Mocks / references
<!-- Figma links, wireframes, prior art, anything that helps visualize the idea. -->
- No formal mocks yet. Reference UX: a single-page app with (1) an "add expense" form,
  (2) a filterable expense list, and (3) a summary panel with per-category totals.
- Prior art for feel: YNAB / Spendee "transactions" view, minus the accounts and budgets.

## Scope hints
**Probably in:**
- Create / edit / delete an expense (amount, category, date, optional note).
- Manage categories (create, list; delete if unused).
- List + filter expenses by date range and category.
- Summary: total spend and spend-by-category over a selected period.
- Money stored as integer minor units (cents); single currency assumed.

**Probably out:**
- Authentication / multi-user / sharing / roles.
- Budgets, limits, recurring transactions, income tracking.
- Bank/API imports, CSV import/export, receipts/attachments.
- Multi-currency, cloud sync, hosted deployment, native mobile.

## Open questions
<!-- Must be resolved before PRD. Delete each line when answered. -->
- Single-user auth: none at all (trusted local machine), or one local passcode? (Leaning: none for MVP.)
- Is CSV export desirable enough to pull into MVP scope, or defer? (Leaning: defer.)
- Default seed categories on first run, or start empty and let the user create them?

## Approval
Run `lane approve` — lane stamps the frontmatter (name, date, content hash) after you confirm.
Editing this file after approval invalidates the stamp and reopens the gate.
