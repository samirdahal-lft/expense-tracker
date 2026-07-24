"""Auth service — registration, password hashing, session issuance logic.

Password verifier: bcrypt via ``passlib`` (CONSTITUTION: password hashing via
``passlib[bcrypt]``) — one-way and per-hash salted; the plaintext is never
stored or returned.
"""
from datetime import datetime, timezone

from passlib.context import CryptContext

from app.models.user import RegisterRequest
from app.repositories import users as repo

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class EmailTakenError(Exception):
    """Raised when registering an email that already has an account."""


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(password: str, stored: str) -> bool:
    try:
        return _pwd_context.verify(password, stored)
    except (ValueError, TypeError):
        return False


# A precomputed hash to verify against when no account matches, so an unknown
# email and a wrong password take the same work — no timing signal (AC-2).
_DUMMY_HASH = _pwd_context.hash("verify-against-me-when-user-absent")


def authenticate(email: str, password: str) -> dict | None:
    """Return the account for valid credentials, else None (no unknown/wrong distinction)."""
    user = repo.get_user_by_email(email)
    if user is None:
        verify_password(password, _DUMMY_HASH)  # equalize timing
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user


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
