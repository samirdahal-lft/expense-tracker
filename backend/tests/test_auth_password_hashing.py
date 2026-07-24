"""AC-4 invariant guard: the stored password verifier is one-way, salted, and
never the plaintext (off-ledger; complements the B-1 response-omission check)."""
from app.repositories import users as repo
from app.services.auth import hash_password, verify_password


def test_hash_is_one_way_salted_and_verifiable():
    pw = "hunter2pw"
    h1 = hash_password(pw)
    h2 = hash_password(pw)

    assert pw not in h1  # plaintext never embedded in the verifier
    assert h1 != h2  # per-call random salt → different verifiers for the same password
    assert verify_password(pw, h1)  # verifies the correct password
    assert not verify_password("wrongpass", h1)  # rejects a wrong password


def test_registered_account_persists_no_plaintext(client):
    resp = client.post(
        "/api/auth/register",
        json={
            "name": "Ada",
            "email": "ada@example.com",
            "password": "hunter2pw",
            "confirm_password": "hunter2pw",
        },
    )
    assert resp.status_code == 201

    row = repo.get_user_by_email("ada@example.com")
    assert row is not None
    assert row["password_hash"] != "hunter2pw"
    assert "hunter2pw" not in row["password_hash"]
    assert verify_password("hunter2pw", row["password_hash"])
