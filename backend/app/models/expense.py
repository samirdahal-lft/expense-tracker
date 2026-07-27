"""API models for the expense resource.

Amount is an integer number of whole Nepalese Rupees (NPR) — never a float
(CONSTITUTION). Category is constrained to the fixed seed set.
"""
from datetime import date as date_cls
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

CATEGORIES: tuple[str, ...] = ("Food", "Transport", "Bills", "Other")
Category = Literal["Food", "Transport", "Bills", "Other"]


class ExpenseCreate(BaseModel):
    amount: int = Field(gt=0)  # positive integer whole NPR
    category: Category  # must be one of the fixed set
    date: str
    note: Optional[str] = None

    @field_validator("date")
    @classmethod
    def _valid_iso_date(cls, v: str) -> str:
        try:
            date_cls.fromisoformat(v)
        except ValueError as exc:
            raise ValueError("date must be a valid calendar date in YYYY-MM-DD format") from exc
        return v


class ExpenseUpdate(ExpenseCreate):
    """Full replacement of an existing expense's four editable fields.

    Derives from ExpenseCreate rather than restating its fields, so the rules an
    edit must satisfy are the SAME OBJECT as the rules a creation must satisfy —
    editing cannot become a validation bypass, and the two cannot drift apart.

    `id` and `created_at` are server-owned and are deliberately absent here — no
    request body can carry them, so no request can alter them.
    """


class ExpenseOut(BaseModel):
    id: int
    amount: int
    category: Category
    date: str
    note: Optional[str] = None
    created_at: str


class CategoryTotal(BaseModel):
    category: Category
    total: int


class Summary(BaseModel):
    total: int
    by_category: list[CategoryTotal]
