"""B-3: invalid registration input is rejected before any account is created."""
import pytest


def _payload(**over):
    base = {
        "name": "Ada",
        "email": "ada@example.com",
        "password": "hunter2pw",
        "confirm_password": "hunter2pw",
    }
    base.update(over)
    return base


@pytest.mark.parametrize(
    "bad",
    [
        _payload(name=""),  # empty required field (name)
        _payload(email=""),  # empty required field (email)
        _payload(password="", confirm_password=""),  # empty password
        _payload(password="hunter2pw", confirm_password="hunter2px"),  # confirmation mismatch
        _payload(password="short7!", confirm_password="short7!"),  # 7 chars < 8
    ],
    ids=["empty-name", "empty-email", "empty-password", "confirm-mismatch", "too-short"],
)
def test_register_invalid_input_is_rejected(client, bad):
    resp = client.post("/api/auth/register", json=bad)

    # rejected as a validation error, naming the offending field/rule
    assert resp.status_code == 422
    assert resp.json().get("detail")  # non-empty validation detail

    # no session cookie issued
    assert "session=" not in resp.headers.get("set-cookie", "")

    # nothing was created: a valid registration for the canonical email still succeeds
    ok = client.post("/api/auth/register", json=_payload())
    assert ok.status_code == 201
