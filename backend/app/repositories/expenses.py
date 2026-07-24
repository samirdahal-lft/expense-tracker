"""Expense repository — the only place SQL touches the expenses table.

Every query is scoped to the owning ``user_id`` (CONSTITUTION convention 6:
no query returns rows across users).
"""
from app.db import get_connection


def list_expenses(user_id: int) -> list[dict]:
    """Return the user's expenses, most recent first (by created_at, id as tiebreak)."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT id, amount, category, date, note, created_at "
            "FROM expenses WHERE user_id = ? ORDER BY created_at DESC, id DESC",
            (user_id,),
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def add_expense(
    user_id: int, amount: int, category: str, date: str, note: str | None, created_at: str
) -> dict:
    """Insert one expense owned by user_id and return the created row (including its new id)."""
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO expenses (user_id, amount, category, date, note, created_at) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, amount, category, date, note, created_at),
        )
        conn.commit()
        row = conn.execute(
            "SELECT id, amount, category, date, note, created_at "
            "FROM expenses WHERE id = ?",
            (cur.lastrowid,),
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def delete_expense(expense_id: int, user_id: int) -> int:
    """Delete the user's expense with this id. Returns rows removed (0 if absent or not owned)."""
    conn = get_connection()
    try:
        cur = conn.execute(
            "DELETE FROM expenses WHERE id = ? AND user_id = ?", (expense_id, user_id)
        )
        conn.commit()
        return cur.rowcount
    finally:
        conn.close()


def category_totals(user_id: int) -> dict[str, int]:
    """Return summed amount per category for this user (categories with rows only)."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT category, SUM(amount) AS total FROM expenses "
            "WHERE user_id = ? GROUP BY category",
            (user_id,),
        ).fetchall()
        return {row["category"]: int(row["total"]) for row in rows}
    finally:
        conn.close()
