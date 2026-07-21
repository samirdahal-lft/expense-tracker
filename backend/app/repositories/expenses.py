"""Expense repository — the only place SQL touches the expenses table."""
from app.db import get_connection


def list_expenses() -> list[dict]:
    """Return all expenses, most recent first (by created_at, id as tiebreak)."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT id, amount, category, date, note, created_at "
            "FROM expenses ORDER BY created_at DESC, id DESC"
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def add_expense(
    amount: int, category: str, date: str, note: str | None, created_at: str
) -> dict:
    """Insert one expense and return the created row (including its new id)."""
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO expenses (amount, category, date, note, created_at) "
            "VALUES (?, ?, ?, ?, ?)",
            (amount, category, date, note, created_at),
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


def delete_expense(expense_id: int) -> int:
    """Delete the expense with this id. Returns the number of rows removed (0 if absent)."""
    conn = get_connection()
    try:
        cur = conn.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
        conn.commit()
        return cur.rowcount
    finally:
        conn.close()
