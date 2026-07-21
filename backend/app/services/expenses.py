"""Expense service — business/domain logic for expenses."""
from datetime import datetime, timezone

from app.models.expense import ExpenseCreate
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


def delete_expense(expense_id: int) -> None:
    repo.delete_expense(expense_id)
