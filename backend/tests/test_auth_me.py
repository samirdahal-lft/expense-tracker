"""B-4 (e2e): the session issued by register authorizes GET /api/auth/me.

Exercises the real clock, real signing secret, and real SQLite through the
running app: register returns a session cookie; reusing it identifies the
account, while no cookie / a tampered cookie is rejected as unauthenticated.
"""


def _register(client):
    return client.post(
        "/api/auth/register",
        json={
            "name": "Ada",
            "email": "ada@example.com",
            "password": "hunter2pw",
            "confirm_password": "hunter2pw",
        },
    )


def test_register_session_authorizes_me(client):
    reg = _register(client)
    assert reg.status_code == 201
    user = reg.json()

    # (a) reusing the issued session cookie returns the same account
    me = client.get("/api/auth/me")
    assert me.status_code == 200
    body = me.json()
    assert body["id"] == user["id"]
    assert body["email"] == "ada@example.com"
    assert body["name"] == "Ada"

    # (b) with no cookie → unauthenticated
    client.cookies.clear()
    assert client.get("/api/auth/me").status_code == 401

    # (c) with a tampered cookie → unauthenticated
    client.cookies.set("session", "1.9999999999.deadbeefdeadbeef")
    assert client.get("/api/auth/me").status_code == 401
