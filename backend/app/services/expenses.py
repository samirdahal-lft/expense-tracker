"""Expense service — business/domain logic for expenses. All operations are
scoped to the authenticated user's id."""
from datetime import datetime, timezone

from app.models.expense import CATEGORIES, ExpenseCreate
from app.repositories import expenses as repo


def list_expenses(user_id: int) -> list[dict]:
    return repo.list_expenses(user_id)


def create_expense(data: ExpenseCreate, user_id: int) -> dict:
    """Create an expense owned by user_id, stamping a server-side UTC created_at."""
    created_at = datetime.now(timezone.utc).isoformat()
    return repo.add_expense(
        user_id=user_id,
        amount=data.amount,
        category=data.category,
        date=data.date,
        note=data.note,
        created_at=created_at,
    )


def delete_expense(expense_id: int, user_id: int) -> bool:
    """Delete the user's expense. Returns True if a row was removed, False if absent/not owned."""
    return repo.delete_expense(expense_id, user_id) > 0


def get_summary(user_id: int) -> dict:
    """Spend by category over the user's expenses. Every fixed category is present (0 if none);
    per-category totals sum to the grand total."""
    totals = repo.category_totals(user_id)
    by_category = [{"category": c, "total": totals.get(c, 0)} for c in CATEGORIES]
    return {"total": sum(item["total"] for item in by_category), "by_category": by_category}
