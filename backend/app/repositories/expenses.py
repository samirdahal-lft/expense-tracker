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
