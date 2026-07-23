# Product — Expense Tracker

> Absolute truth of the current product. Update when the product meaningfully changes.
> Human-maintained — `lane fold` does not write to this file.
> Greenfield draft: describes the intended MVP for a project with no code yet. Review and ratify.

## What it is
A personal expense tracker: a small web app for people to record what they spend, categorize
it, and see where their money goes. Runs against a single SQLite file; each registered user's
data is private to them.

## Who uses it
Multiple registered users, each managing their own finances independently. An account
(signup/login) is required; a user only ever sees and modifies their own data — there is no
sharing, roles, or cross-account visibility.

## What it does
- Register an account and log in / log out.
- Record an expense: amount, category, date, and an optional note.
- Edit and delete existing expenses.
- List and filter expenses (by date range and category).
- Manage a set of categories (e.g. Groceries, Rent, Transport).
- Show simple summaries: total spend and spend broken down by category over a period.

## What it doesn't do
- No sharing, roles, or cross-account visibility — accounts are fully isolated from each other.
- No income tracking, budgets/limits, recurring transactions, or bank/API imports (out of MVP scope).
- No multi-currency handling — a single currency is assumed.
- No native mobile app — web only.
- No cloud sync or hosted deployment in scope; local single-file storage only.
