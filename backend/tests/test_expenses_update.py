"""Correct a recorded expense — update by id (T-edit-bf02tp)."""
import pytest

from app.db import get_connection

ORIGINAL = {
    "amount": 1000,
    "category": "Food",
    "date": "2026-07-01",
    "note": "lunch",
    "created_at": "2026-07-01T10:00:00Z",
}


def _valid_body() -> dict:
    return {"amount": 2500, "category": "Transport", "date": "2026-07-05", "note": "taxi"}


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


@pytest.mark.parametrize(
    ("field", "bad_value"),
    [
        ("amount", 0),  # not a positive amount
        ("amount", -100),  # negative
        ("amount", 12.5),  # not a whole rupee
        ("category", "Groceries"),  # outside the fixed set
        ("date", "not-a-date"),  # malformed
        ("date", "2026-02-30"),  # well-formed but not a real calendar day
    ],
)
def test_update_refuses_what_create_refuses_and_changes_nothing(client, field, bad_value):
    # B-2: editing is not a validation bypass (AC-3, AC-4). Each bad value is refused
    # at the API, the offending field is named, and the stored expense is untouched.
    expense_id = _seed(**ORIGINAL)
    body = {**_valid_body(), field: bad_value}

    resp = client.put(f"/api/expenses/{expense_id}", json=body)

    assert resp.status_code == 422, f"{field}={bad_value!r} should be refused"
    named_fields = {loc for item in resp.json()["detail"] for loc in item["loc"]}
    assert field in named_fields, f"the error should name {field}: {resp.json()['detail']}"

    # the same body is refused at creation too — the two paths agree
    assert client.post("/api/expenses", json=body).status_code == 422

    # nothing moved
    listed = client.get("/api/expenses").json()
    assert len(listed) == 1
    assert listed[0] == {"id": expense_id, **ORIGINAL}


def test_update_unknown_id_is_not_found_and_changes_nothing(client):
    # B-3: an update against an id nobody holds is reported as not-found (AC-5).
    # It must not upsert: the store keeps exactly the one expense it had.
    expense_id = _seed(**ORIGINAL)

    resp = client.put("/api/expenses/99999", json=_valid_body())

    assert resp.status_code == 404
    listed = client.get("/api/expenses").json()
    assert len(listed) == 1  # nothing created to satisfy the unknown id
    assert listed[0] == {"id": expense_id, **ORIGINAL}  # and nothing touched
