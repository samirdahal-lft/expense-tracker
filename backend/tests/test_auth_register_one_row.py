"""AC-2 guard: a rejected duplicate registration leaves exactly one account (off-ledger)."""
from app.db import get_connection


def _count_users(email: str) -> int:
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT COUNT(*) AS c FROM users WHERE email = ?", (email,)
        ).fetchone()
        return int(row["c"])
    finally:
        conn.close()


def test_duplicate_register_leaves_exactly_one_account(client):
    payload = {
        "name": "Ada",
        "email": "ada@example.com",
        "password": "hunter2pw",
        "confirm_password": "hunter2pw",
    }
    assert client.post("/api/auth/register", json=payload).status_code == 201

    dup = {**payload, "name": "Ada Two", "password": "different9", "confirm_password": "different9"}
    assert client.post("/api/auth/register", json=dup).status_code == 409

    assert _count_users("ada@example.com") == 1
