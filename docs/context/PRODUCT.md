# Product — Expense Tracker

> Absolute truth of the current product. Update when the product meaningfully changes.
> Human-maintained — `lane fold` does not write to this file.

## What it is
A single-user personal expense tracker: a web app for recording day-to-day spending in
Nepalese Rupees (NPR) and seeing where the money goes, broken down by category
(confirmed: `frontend/src/App.tsx`, `backend/app/models/expense.py`).

## Who uses it
One individual tracking their own personal spending — there is no login, no user
model, and no per-user data separation anywhere in the backend or frontend
(inferred: no auth/user table/session code exists in `backend/app/` or
`frontend/src/`). It runs as a small self-hosted app (docker-compose brings up a
backend + frontend pair), not a multi-tenant hosted service.

## What it does
- Record an expense: amount (whole NPR, positive integer — never a float), category,
  date, and an optional note (confirmed: `backend/app/models/expense.py`,
  `frontend/src/features/expenses/AddExpenseForm.tsx`).
- Categorize spending into a fixed set: Food, Transport, Bills, Other (confirmed:
  `CATEGORIES` in `backend/app/models/expense.py` and `frontend/src/api/client.ts`).
- List all recorded expenses, most recent first (confirmed:
  `backend/app/repositories/expenses.py: list_expenses`).
- Edit an expense: full replacement of amount/category/date/note; `id` and
  `created_at` are server-owned and can never be altered by a request (confirmed:
  `backend/app/models/expense.py: ExpenseUpdate`, `routers/expenses.py`).
  Editing an expense's category or amount is reflected in the summary immediately
  (confirmed: `frontend/src/App.tsx: handleSaveEdit`).
- Delete an expense (confirmed: `DELETE /api/expenses/{id}`).
- View a spend summary: total spend and a per-category breakdown, rendered as a donut
  chart with totals listed alongside; every fixed category is always present in the
  summary (zero if unused), and per-category totals sum to the grand total (confirmed:
  `backend/app/services/expenses.py: get_summary`,
  `frontend/src/features/summary/CategorySummary.tsx`).
- Toggle light/dark theme; the choice persists across reloads via localStorage
  (confirmed: `frontend/src/hooks/useTheme.ts`).

## What it doesn't do
- No user accounts, authentication, or authorization — anyone with network access to
  the app has full read/write access to all data (inferred: absence of any auth code).
- No multi-currency support — amounts are always whole NPR (confirmed: model comments
  in `backend/app/models/expense.py`).
- No budgets, recurring expenses, receipts/attachments, or multi-user
  sharing/collaboration — none of these appear anywhere in the models, services, or
  frontend (inferred: absence of any such code).
- No reporting beyond the single category-summary view (no date-range filtering,
  export, or historical trend charts) (inferred: only one summary endpoint exists).
- No mobile app — web-only, served behind nginx (confirmed: `frontend/nginx.conf`,
  `docker-compose.yml`).

## Open questions (human to answer)
- Is single-user-no-auth an intentional, permanent scope decision, or a placeholder
  pending a future auth milestone? `docs/ROADMAP.md` has only a placeholder first
  milestone row, so this isn't yet decided in writing.
