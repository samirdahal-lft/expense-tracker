"""Expense service — business/domain logic for expenses."""
from datetime import datetime, timezone

from app.models.expense import CATEGORIES, ExpenseCreate, ExpenseUpdate
from app.repositories import expenses as repo


def list_expenses() -> list[dict]:
    return repo.list_expenses()


def create_expense(data: ExpenseCreate) -> dict:
    """Create an expense, stamping a server-side UTC created_at."""
    created_at = datetime.now(timezone.utc).isoformat()
    return repo.add_expense(
        amount=data.amount,
        category=data.category,
        date=data.date,
        note=data.note,
        created_at=created_at,
    )


def update_expense(expense_id: int, data: ExpenseUpdate) -> dict | None:
    """Replace an expense's editable fields. No clock: created_at is never restamped."""
    return repo.update_expense(
        expense_id=expense_id,
        amount=data.amount,
        category=data.category,
        date=data.date,
        note=data.note,
    )


def delete_expense(expense_id: int) -> bool:
    """Delete an expense. Returns True if a row was removed, False if the id was absent."""
    return repo.delete_expense(expense_id) > 0


def get_summary() -> dict:
    """Spend by category over all expenses. Every fixed category is present (0 if none);
    per-category totals sum to the grand total."""
    totals = repo.category_totals()
    by_category = [{"category": c, "total": totals.get(c, 0)} for c in CATEGORIES]
    return {"total": sum(item["total"] for item in by_category), "by_category": by_category}
