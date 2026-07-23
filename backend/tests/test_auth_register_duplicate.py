"""B-2: registering an already-used email is rejected; no second account, no session."""


def _payload(**over):
    base = {
        "name": "Ada",
        "email": "ada@example.com",
        "password": "hunter2pw",
        "confirm_password": "hunter2pw",
    }
    base.update(over)
    return base


def test_register_duplicate_email_is_rejected(client):
    first = client.post("/api/auth/register", json=_payload())
    assert first.status_code == 201

    resp = client.post(
        "/api/auth/register",
        json=_payload(name="Ada Two", password="different9", confirm_password="different9"),
    )

    # rejected, identifying the email as already taken
    assert resp.status_code == 409
    assert "email" in str(resp.json()).lower()

    # no session cookie issued on the rejection
    assert "session=" not in resp.headers.get("set-cookie", "")
