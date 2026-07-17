# Product — Expense Tracker

> Absolute truth of the current product. Update when the product meaningfully changes.
> Human-maintained — `lane fold` does not write to this file.
> Greenfield draft: describes the intended MVP for a project with no code yet. Review and ratify.

## What it is
A single-user personal expense tracker: a small web app for one person to record what they
spend, categorize it, and see where their money goes. Runs locally against a single SQLite file.

## Who uses it
One individual managing their own finances. No multi-tenant accounts, no sharing, no roles —
the person running the app is the only user and sees all of their own data.

## What it does
- Record an expense: amount, category, date, and an optional note.
- Edit and delete existing expenses.
- List and filter expenses (by date range and category).
- Manage a set of categories (e.g. Groceries, Rent, Transport).
- Show simple summaries: total spend and spend broken down by category over a period.

## What it doesn't do
- No multi-user accounts, authentication providers, sharing, or permissions/roles.
- No income tracking, budgets/limits, recurring transactions, or bank/API imports (out of MVP scope).
- No multi-currency handling — a single currency is assumed.
- No native mobile app — web only.
- No cloud sync or hosted deployment in scope; local single-file storage only.
