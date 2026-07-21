"""API models for the expense resource.

Amount is an integer number of whole Nepalese Rupees (NPR) — never a float
(CONSTITUTION). Category is constrained to the fixed seed set.
"""
from typing import Literal, Optional

from pydantic import BaseModel

Category = Literal["Food", "Transport", "Bills", "Other"]


class ExpenseCreate(BaseModel):
    # Minimal validation here (B-1); the fixed-set/positive-integer/date constraints
    # are driven in by B-2.
    amount: int
    category: str
    date: str
    note: Optional[str] = None


class ExpenseOut(BaseModel):
    id: int
    amount: int
    category: Category
    date: str
    note: Optional[str] = None
    created_at: str
