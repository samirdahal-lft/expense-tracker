"""Expense HTTP routes. Thin — validation/serialization via Pydantic, logic in the service.

Every route requires an authenticated session; the owning ``user_id`` is derived
from that session (never trusted from the client) and scopes all data access.
"""
from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import require_csrf, require_user
from app.models.expense import ExpenseCreate, ExpenseOut, Summary
from app.services import expenses as service

router = APIRouter(prefix="/api", tags=["expenses"])


@router.get("/expenses", response_model=list[ExpenseOut])
def list_expenses(user_id: int = Depends(require_user)) -> list[dict]:
    return service.list_expenses(user_id)


@router.get("/summary", response_model=Summary)
def get_summary(user_id: int = Depends(require_user)) -> dict:
    return service.get_summary(user_id)


@router.post(
    "/expenses",
    response_model=ExpenseOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_csrf)],
)
def create_expense(payload: ExpenseCreate, user_id: int = Depends(require_user)) -> dict:
    return service.create_expense(payload, user_id)


@router.delete(
    "/expenses/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_csrf)],
)
def delete_expense(expense_id: int, user_id: int = Depends(require_user)) -> None:
    if not service.delete_expense(expense_id, user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
