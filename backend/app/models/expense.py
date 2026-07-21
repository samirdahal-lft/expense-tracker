"""API models for the expense resource.

Amount is an integer number of whole Nepalese Rupees (NPR) — never a float
(CONSTITUTION). Category is constrained to the fixed seed set.
"""
from datetime import date as date_cls
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

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


class ExpenseOut(BaseModel):
    id: int
    amount: int
    category: Category
    date: str
    note: Optional[str] = None
    created_at: str
