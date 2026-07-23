"""Auth service — registration, password hashing, session issuance logic.

Password verifier: PBKDF2-HMAC-SHA256 with a per-user random salt (stdlib only).
Stored as ``pbkdf2_sha256$<iterations>$<salt_hex>$<hash_hex>`` — one-way; the
plaintext is never stored or returned.
"""
import hashlib
import hmac
import secrets
from datetime import datetime, timezone

from app.models.user import RegisterRequest
from app.repositories import users as repo

_PBKDF2_ITERATIONS = 240_000


class EmailTakenError(Exception):
    """Raised when registering an email that already has an account."""


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _PBKDF2_ITERATIONS)
    return f"pbkdf2_sha256${_PBKDF2_ITERATIONS}${salt.hex()}${dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _algo, iters_s, salt_hex, hash_hex = stored.split("$")
        iterations = int(iters_s)
        salt = bytes.fromhex(salt_hex)
    except (ValueError, AttributeError):
        return False
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations)
    return hmac.compare_digest(dk.hex(), hash_hex)


def register(data: RegisterRequest) -> dict:
    """Create an account and return its row. Raises EmailTakenError on a duplicate email."""
    created_at = datetime.now(timezone.utc).isoformat()
    user = repo.create_user(
        name=data.name,
        email=str(data.email),
        password_hash=hash_password(data.password),
        created_at=created_at,
    )
    if user is None:
        raise EmailTakenError(str(data.email))
    return user
