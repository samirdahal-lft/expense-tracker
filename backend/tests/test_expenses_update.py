"""Correct a recorded expense — update by id (T-edit-bf02tp)."""
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


def test_update_persists_new_values_and_keeps_identity(client):
    # B-1: a valid update persists exactly the submitted values (AC-1) and the
    # expense keeps its id and original created_at, with none added or removed (AC-2).
    created_at = "2026-07-01T10:00:00Z"
    expense_id = _seed(1000, "Food", "2026-07-01", "lunch", created_at)

    resp = client.put(
        f"/api/expenses/{expense_id}",
        json={"amount": 2500, "category": "Transport", "date": "2026-07-05", "note": "taxi"},
    )

    assert resp.status_code == 200
    assert resp.json() == {
        "id": expense_id,
        "amount": 2500,
        "category": "Transport",
        "date": "2026-07-05",
        "note": "taxi",
        "created_at": created_at,
    }

    # the change is what a subsequent read returns — not just what the write echoed back
    listed = client.get("/api/expenses").json()
    assert len(listed) == 1  # none added, none removed
    assert listed[0] == {
        "id": expense_id,
        "amount": 2500,
        "category": "Transport",
        "date": "2026-07-05",
        "note": "taxi",
        "created_at": created_at,  # server-owned, never restamped
    }
