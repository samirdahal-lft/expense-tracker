"""Session cookie issue/verify — a signed, httpOnly, SameSite cookie carrying user_id.

Signed with ``itsdangerous`` (CONSTITUTION: session via an httpOnly signed cookie
holding the user id). The signing secret comes from the ``SESSION_SECRET``
environment variable (injected seam, like ``EXPENSE_DB_PATH``); the token's age
is checked on verify so a session expires. Fails closed if the secret is unset —
never sign or verify with a guessable default key.
"""
import os

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

COOKIE_NAME = "session"
DEFAULT_MAX_AGE = 60 * 60 * 24 * 7  # 7 days, in seconds
_SALT = "expense-tracker.session"


def _serializer() -> URLSafeTimedSerializer:
    """Build the signer from the injected secret. Fails closed if unset."""
    secret = os.environ.get("SESSION_SECRET")
    if not secret:
        raise RuntimeError(
            "SESSION_SECRET is not set — refusing to sign or verify sessions "
            "with a default key"
        )
    return URLSafeTimedSerializer(secret, salt=_SALT)


def issue_token(user_id: int) -> str:
    """Return a signed token carrying the user id (and an embedded timestamp)."""
    return _serializer().dumps(user_id)


def verify_token(token: str | None, *, max_age: int = DEFAULT_MAX_AGE) -> int | None:
    """Return the user_id for a valid, unexpired, correctly-signed token, else None.

    An absent/empty token short-circuits to None without touching the secret."""
    if not token:
        return None
    try:
        user_id = _serializer().loads(token, max_age=max_age)
    except (BadSignature, SignatureExpired):
        return None
    if not isinstance(user_id, int):
        return None
    return user_id
