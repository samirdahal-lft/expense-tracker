"""B-1: GET /api/summary aggregates spend by category (whole NPR)."""
from app.db import get_connection


def _seed(amount, category, date="2026-07-01", note=None, created_at="2026-07-01T10:00:00Z"):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO expenses (amount, category, date, note, created_at) "
            "VALUES (?, ?, ?, ?, ?)",
            (amount, category, date, note, created_at),
        )
        conn.commit()
    finally:
        conn.close()


def test_summary_totals_and_all_categories_present(client):
    _seed(1000, "Food")
    _seed(500, "Food")
    _seed(2500, "Transport")

    resp = client.get("/api/summary")

    assert resp.status_code == 200
    body = resp.json()
    assert body["total"] == 4000
    by_cat = {row["category"]: row["total"] for row in body["by_category"]}
    # every fixed category present, zero when no expenses
    assert by_cat == {"Food": 1500, "Transport": 2500, "Bills": 0, "Other": 0}
    # per-category totals reconcile to the grand total
    assert sum(by_cat.values()) == body["total"]


def test_summary_empty_store_is_all_zero(client):
    resp = client.get("/api/summary")

    assert resp.status_code == 200
    body = resp.json()
    assert body["total"] == 0
    by_cat = {row["category"]: row["total"] for row in body["by_category"]}
    assert by_cat == {"Food": 0, "Transport": 0, "Bills": 0, "Other": 0}
