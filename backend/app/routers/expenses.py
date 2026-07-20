"""Expense HTTP routes. Thin — validation/serialization via Pydantic, logic in the service."""
from fastapi import APIRouter

from app.models.expense import ExpenseOut
from app.services import expenses as service

router = APIRouter(prefix="/api", tags=["expenses"])


@router.get("/expenses", response_model=list[ExpenseOut])
def list_expenses() -> list[dict]:
    return service.list_expenses()
