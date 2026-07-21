"""B-1: POST /api/expenses creates an expense and returns it with a server-assigned id."""


def test_create_expense_returns_created_with_server_fields(client):
    payload = {
        "amount": 1200,
        "category": "Food",
        "date": "2026-07-05",
        "note": "groceries",
    }

    resp = client.post("/api/expenses", json=payload)

    assert resp.status_code == 201
    body = resp.json()
    assert isinstance(body["id"], int)
    assert body["created_at"]  # server-assigned, non-empty
    assert body["amount"] == 1200
    assert body["category"] == "Food"
    assert body["date"] == "2026-07-05"
    assert body["note"] == "groceries"

    # persisted: a subsequent list includes exactly this expense
    listed = client.get("/api/expenses").json()
    assert len(listed) == 1
    assert listed[0]["id"] == body["id"]
    assert listed[0]["amount"] == 1200
