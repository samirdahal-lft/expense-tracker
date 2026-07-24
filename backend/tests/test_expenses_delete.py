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


def test_delete_existing_removes_it(auth_client):
    # B-1: deleting an existing expense removes it from a subsequent list.
    expense_id = _seed(1000, "Food", "2026-07-01", "lunch", "2026-07-01T10:00:00Z")
    assert len(auth_client.get("/api/expenses").json()) == 1

    resp = auth_client.delete(f"/api/expenses/{expense_id}")

    assert resp.status_code == 204
    assert auth_client.get("/api/expenses").json() == []


def test_delete_unknown_id_is_not_found_and_changes_nothing(auth_client):
    # B-2: deleting an unknown id → 404, store unchanged.
    _seed(1000, "Food", "2026-07-01", "lunch", "2026-07-01T10:00:00Z")

    resp = auth_client.delete("/api/expenses/99999")

    assert resp.status_code == 404
    assert len(auth_client.get("/api/expenses").json()) == 1  # nothing removed
