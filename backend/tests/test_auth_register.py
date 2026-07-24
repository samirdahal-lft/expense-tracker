"""B-1: POST /api/auth/register creates an account and starts an authenticated session.

The response returns the account's public identity (id, name, email), never any
password/verifier material, and sets an httpOnly, SameSite session cookie.
"""


def test_register_creates_account_and_starts_session(client):
    payload = {
        "name": "Ada",
        "email": "ada@example.com",
        "password": "hunter2pw",
        "confirm_password": "hunter2pw",
    }

    resp = client.post("/api/auth/register", json=payload)

    assert resp.status_code == 201
    body = resp.json()
    assert isinstance(body["id"], int)
    assert body["name"] == "Ada"
    assert body["email"] == "ada@example.com"

    # no secret material ever leaks through the response body
    for leak in ("password", "confirm_password", "password_hash", "hash", "verifier", "salt"):
        assert leak not in body, f"response body leaked {leak!r}"

    # a session cookie is set, httpOnly and SameSite (CSRF contract)
    set_cookie = resp.headers.get("set-cookie", "")
    assert "session=" in set_cookie
    assert "httponly" in set_cookie.lower()
    assert "samesite=lax" in set_cookie.lower()
