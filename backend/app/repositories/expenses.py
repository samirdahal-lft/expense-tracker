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


def update_expense(
    expense_id: int, amount: int, category: str, date: str, note: str | None
) -> dict | None:
    """Replace the four editable columns of one expense; return the updated row.

    Returns None when no row carries this id. `id` and `created_at` are absent
    from the SET clause on purpose — they are server-owned and never rewritten.
    """
    conn = get_connection()
    try:
        cur = conn.execute(
            "UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? "
            "WHERE id = ?",
            (amount, category, date, note, expense_id),
        )
        conn.commit()
        if cur.rowcount == 0:
            return None
        row = conn.execute(
            "SELECT id, amount, category, date, note, created_at "
            "FROM expenses WHERE id = ?",
            (expense_id,),
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


def category_totals() -> dict[str, int]:
    """Return summed amount per category present in the store (categories with rows only)."""
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT category, SUM(amount) AS total FROM expenses GROUP BY category"
        ).fetchall()
        return {row["category"]: int(row["total"]) for row in rows}
    finally:
        conn.close()
