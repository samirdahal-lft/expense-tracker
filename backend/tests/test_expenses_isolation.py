"""B-5: expenses are owned per-user; no account sees or mutates another's rows.

Covers AC-1 (a session returns its own data) and AC-5 (cross-account isolation).
"""

_PAYLOAD = {"amount": 1500, "category": "Food", "date": "2026-07-01", "note": "lunch"}


def test_expenses_are_scoped_per_user(make_auth_client):
    a = make_auth_client(email="a@example.com", name="A")
    b = make_auth_client(email="b@example.com", name="B")

    created = a.post("/api/expenses", json=_PAYLOAD)
    assert created.status_code == 201
    a_expense_id = created.json()["id"]

    # A sees its own expense; B sees none
    assert [e["id"] for e in a.get("/api/expenses").json()] == [a_expense_id]
    assert b.get("/api/expenses").json() == []

    # summaries are scoped to the caller
    assert a.get("/api/summary").json()["total"] == 1500
    assert b.get("/api/summary").json()["total"] == 0

    # B cannot delete A's expense; A's row survives
    assert b.delete(f"/api/expenses/{a_expense_id}").status_code == 404
    assert [e["id"] for e in a.get("/api/expenses").json()] == [a_expense_id]
