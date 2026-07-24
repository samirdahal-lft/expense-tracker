"""B-2 (guard): login with an unknown email or a wrong password → one generic 401.

The error body is identical between the two cases (no signal which was wrong) and
no session cookie is issued. The failure path is intrinsic to the login endpoint
(built in B-1); this locks the generic-error + no-session property.
"""


def _register(client, email="ada@example.com", password="hunter2pw", name="Ada"):
    return client.post(
        "/api/auth/register",
        json={"name": name, "email": email, "password": password, "confirm_password": password},
    )


def test_login_failure_is_generic_and_sessionless(client):
    assert _register(client).status_code == 201
    client.cookies.clear()

    unknown = client.post(
        "/api/auth/login", json={"email": "nobody@example.com", "password": "whatever8"}
    )
    wrong = client.post(
        "/api/auth/login", json={"email": "ada@example.com", "password": "wrongpass8"}
    )

    assert unknown.status_code == 401
    assert wrong.status_code == 401
    # identical generic message — unknown-email and wrong-password are indistinguishable
    assert unknown.json() == wrong.json()
    # no session cookie issued on either rejection
    assert "session=" not in unknown.headers.get("set-cookie", "")
    assert "session=" not in wrong.headers.get("set-cookie", "")
