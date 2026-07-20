"""Expense service — business/domain logic for expenses (thin for the read path)."""
from app.repositories import expenses as repo


def list_expenses() -> list[dict]:
    return repo.list_expenses()
