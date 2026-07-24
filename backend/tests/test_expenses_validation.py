"""B-2: POST /api/expenses rejects invalid input with 422 and persists nothing."""
import pytest


@pytest.mark.parametrize(
    "bad_payload",
    [
        {"amount": 0, "category": "Food", "date": "2026-07-05"},          # non-positive
        {"amount": -5, "category": "Food", "date": "2026-07-05"},         # negative
        {"amount": 12.5, "category": "Food", "date": "2026-07-05"},       # non-integer
        {"amount": 100, "category": "Groceries", "date": "2026-07-05"},   # unknown category
        {"amount": 100, "category": "Food", "date": "not-a-date"},        # malformed date
    ],
    ids=["zero", "negative", "non-integer", "unknown-category", "bad-date"],
)
def test_create_rejects_invalid_input(auth_client, bad_payload):
    resp = auth_client.post("/api/expenses", json=bad_payload)

    assert resp.status_code == 422
    # nothing persisted
    assert auth_client.get("/api/expenses").json() == []
