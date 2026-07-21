"""Delete an expense (T-004)."""
from app.db import get_connection


def _seed(amount, category, date, note, created_at) -> int:
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO expenses (amount, category, date, note, created_at) "
            "VALUES (?, ?, ?, ?, ?)",
            (amount, category, date, note, created_at),
        )
        conn.commit()
        return int(cur.lastrowid)
    finally:
        conn.close()


def test_delete_existing_removes_it(client):
    # B-1: deleting an existing expense removes it from a subsequent list.
    expense_id = _seed(1000, "Food", "2026-07-01", "lunch", "2026-07-01T10:00:00Z")
    assert len(client.get("/api/expenses").json()) == 1

    resp = client.delete(f"/api/expenses/{expense_id}")

    assert resp.status_code == 204
    assert client.get("/api/expenses").json() == []
