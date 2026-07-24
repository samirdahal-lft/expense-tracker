"""B-1: POST /api/auth/login with valid credentials starts an authenticated session.

Sets a session cookie (httpOnly, SameSite) plus a readable CSRF cookie; the
issued session authorizes a subsequent GET /api/auth/me for that account.
"""


def _register(client, email="ada@example.com", password="hunter2pw", name="Ada"):
    return client.post(
        "/api/auth/register",
        json={"name": name, "email": email, "password": password, "confirm_password": password},
    )


def test_login_with_valid_credentials_starts_session(client):
    # an account exists; drop the register-issued cookies so we test login in isolation
    assert _register(client).status_code == 201
    client.cookies.clear()

    resp = client.post(
        "/api/auth/login",
        json={"email": "ada@example.com", "password": "hunter2pw"},
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body["email"] == "ada@example.com"
    assert body["name"] == "Ada"

    set_cookie = resp.headers.get("set-cookie", "")
    assert "session=" in set_cookie
    assert "httponly" in set_cookie.lower()
    assert "samesite=lax" in set_cookie.lower()
    # a readable (non-httpOnly) CSRF cookie is issued alongside the session
    assert "csrf_token=" in set_cookie

    # the issued session authorizes /api/auth/me
    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == "ada@example.com"
