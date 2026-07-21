"""Expense HTTP routes. Thin — validation/serialization via Pydantic, logic in the service."""
from fastapi import APIRouter, HTTPException, status

from app.models.expense import ExpenseCreate, ExpenseOut
from app.services import expenses as service

router = APIRouter(prefix="/api", tags=["expenses"])


@router.get("/expenses", response_model=list[ExpenseOut])
def list_expenses() -> list[dict]:
    return service.list_expenses()


@router.post("/expenses", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(payload: ExpenseCreate) -> dict:
    return service.create_expense(payload)


@router.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int) -> None:
    if not service.delete_expense(expense_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
