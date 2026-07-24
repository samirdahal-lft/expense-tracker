"""B-6 (e2e/smoke): full login → read-own → logout → rejected flow against the app.

A composition of the individually-driven behaviors, run end-to-end through the
running app on the real clock + secret + SQLite (committed off-ledger as a smoke
guard — no new behavior beyond B-1..B-5).
"""
from fastapi.testclient import TestClient

from app.main import create_app
from app.session import CSRF_COOKIE_NAME, CSRF_HEADER_NAME


def _csrf(client):
    client.headers[CSRF_HEADER_NAME] = client.cookies.get(CSRF_COOKIE_NAME)


def test_login_read_own_logout_flow(temp_db):
    client = TestClient(create_app())

    # a registered account with one prior expense of its own
    reg = client.post(
        "/api/auth/register",
        json={"name": "Ada", "email": "ada@example.com", "password": "hunter2pw", "confirm_password": "hunter2pw"},
    )
    assert reg.status_code == 201
    _csrf(client)
    assert client.post(
        "/api/expenses", json={"amount": 1500, "category": "Food", "date": "2026-07-01"}
    ).status_code == 201

    # returning user: log out, then log back in
    assert client.post("/api/auth/logout").status_code == 200
    login = client.post("/api/auth/login", json={"email": "ada@example.com", "password": "hunter2pw"})
    assert login.status_code == 200
    _csrf(client)

    # sees exactly their own prior expense
    listed = client.get("/api/expenses").json()
    assert [e["amount"] for e in listed] == [1500]

    # logout → protected request rejected
    assert client.post("/api/auth/logout").status_code == 200
    assert client.get("/api/expenses").status_code == 401
