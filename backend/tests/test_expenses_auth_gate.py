"""B-3: every /api/expenses* and /api/summary route requires a valid session.

Unauthenticated requests are rejected as 401 and never served expense data or a
default/empty payload.
"""
import pytest


@pytest.mark.parametrize(
    "method,path,kwargs",
    [
        ("get", "/api/expenses", {}),
        ("post", "/api/expenses", {"json": {"amount": 100, "category": "Food", "date": "2026-07-01"}}),
        ("delete", "/api/expenses/1", {}),
        ("get", "/api/summary", {}),
    ],
    ids=["list", "create", "delete", "summary"],
)
def test_expense_routes_reject_unauthenticated(client, method, path, kwargs):
    resp = getattr(client, method)(path, **kwargs)

    assert resp.status_code == 401
    # the body is an error, not a list/summary/default payload
    body = resp.json()
    assert not isinstance(body, list)
    assert "by_category" not in body
