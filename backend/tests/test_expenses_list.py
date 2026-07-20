"""B-1: GET /api/expenses returns all expenses, most recent first, with all fields."""
from app.db import get_connection


def _seed(amount, category, date, note, created_at):
    conn = get_connection()
    conn.execute(
        "INSERT INTO expenses (amount, category, date, note, created_at) "
        "VALUES (?, ?, ?, ?, ?)",
        (amount, category, date, note, created_at),
    )
    conn.commit()
    conn.close()


def test_list_returns_expenses_newest_first_with_all_fields(client):
    _seed(1000, "Food", "2026-07-01", "lunch", "2026-07-01T10:00:00Z")
    _seed(2500, "Transport", "2026-07-02", "taxi", "2026-07-02T09:00:00Z")

    resp = client.get("/api/expenses")

    assert resp.status_code == 200
    data = resp.json()
    # newest created_at first
    assert [e["category"] for e in data] == ["Transport", "Food"]
    first = data[0]
    assert first["amount"] == 2500  # integer whole NPR
    assert first["date"] == "2026-07-02"
    assert first["note"] == "taxi"
    assert set(first) >= {"id", "amount", "category", "date", "note", "created_at"}
