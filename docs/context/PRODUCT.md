# Product — Expense Tracker

> Absolute truth of the current product. Update when the product meaningfully changes.
> Human-maintained — `lane fold` does not write to this file.

## What it is
A single-page web app for recording personal spending in Nepalese Rupees (NPR) and seeing where
the money went. One person enters expenses — amount, category, date, an optional note — and the
app shows the running list plus a per-category breakdown. It is single-tenant: there are no
accounts, and anyone who can reach the app sees and edits the same data (no identity concept
exists anywhere in `backend/app/` or `frontend/src/`).

## Who uses it
One individual tracking their own day-to-day spending, self-hosting the app (`docker compose
up` publishes the UI on port 8090 — `docker-compose.yml`). There is exactly one role: **the
owner**, who can do everything. No sign-in, roles, permissions, or per-user data partitioning
exist — every request is unauthenticated and operates on the single shared expense store.

## What it does

Domain vocabulary:
- **Expense** — one spend record: `amount`, `category`, `date`, optional `note`, plus the
  server-owned `id` and `created_at` (`backend/app/models/expense.py`).
- **Amount** — a positive **integer** number of **whole NPR**. Never a float, never sub-rupee.
  Displayed as `Rs 2,500` (Indian digit grouping — `frontend/src/lib/format.ts`).
- **Category** — a fixed, closed set: **Food, Transport, Bills, Other**. Users cannot add
  categories (`backend/app/models/expense.py:11-12`, `frontend/src/api/client.ts:7`).
- **Date** — the calendar day the money was spent, `YYYY-MM-DD`, supplied by the user. Distinct
  from `created_at`, the server's UTC record-time stamp.
- **Summary** — total spend plus a total per category, over **all** expenses ever recorded.

Capabilities today:
1. **Add an expense** — amount (must be > 0), a category from the fixed set, a date, an optional
   note. `created_at` is stamped server-side in UTC; the client cannot set it
   (`backend/app/services/expenses.py:12-21`).
2. **See all expenses** — a flat list, most recent first (`created_at DESC, id DESC`), with
   deliberate loading, error, and empty states (`backend/app/repositories/expenses.py:5-15`,
   `frontend/src/features/expenses/ExpenseList.tsx`).
3. **Correct an expense** — edit amount, category, date, note. It is a **full replacement**, not
   a partial patch: saving with the note blank clears the stored note. `id` and `created_at` are
   never rewritten, and an edit satisfies exactly the same validation rules as a creation
   (`backend/app/models/expense.py:31-40`, `frontend/src/features/expenses/EditExpenseForm.tsx`).
4. **Delete an expense** — removed immediately and permanently: no confirmation step, no undo
   (`frontend/src/features/expenses/ExpenseList.tsx`, `backend/app/routers/expenses.py:33-36`).
5. **Spend by category** — a donut chart plus a per-category total list and a grand total. All
   four categories are always listed (showing `Rs 0` when unused) and the per-category totals
   always sum to the grand total; only non-zero slices are drawn
   (`backend/app/services/expenses.py:40-45`, `frontend/src/features/summary/CategorySummary.tsx`).
6. **Light / dark theme** — a toggle in the header; the choice persists across reloads via
   `localStorage`, defaulting to light (`frontend/src/hooks/useTheme.ts`).

Add, edit, and delete each refresh both the list and the summary without a page reload
(`frontend/src/App.tsx:28-41`).

## What it doesn't do
Confirmed absent from the codebase — treat each as out of scope until a PRD says otherwise:
- **No accounts, login, sessions, or multi-user separation.** No authentication or authorization
  anywhere; the API is open to anything that can reach it.
- **No income, budgets, limits, or alerts** — spending is recorded, never compared to a target.
- **No currency other than NPR**, no exchange rates, no decimals/paisa.
- **No user-defined categories**, tags, or sub-categories.
- **No date-range filtering, search, sort controls, or pagination** — the list is always every
  expense newest-first, and the summary is always all-time.
- **No recurring expenses, receipts/attachments, or import/export (CSV, bank sync).**
- **No trend or time-series reporting** — the only breakdown is by category.
- **No soft delete, undo, audit log, or edit history.**
- **No native mobile app** — one responsive web page.

Open product question for the human: `.env` defines `SESSION_SECRET`, but no code reads it (grep
finds no reference in `backend/app/` or `frontend/src/`). Either sessions were planned and
dropped or it is dead configuration — please confirm, since it is the repo's only hint that
authentication was ever intended.
