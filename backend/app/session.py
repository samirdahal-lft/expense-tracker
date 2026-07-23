"""Session cookie issue/verify — a signed, httpOnly, SameSite cookie carrying user_id.

Standard-library only (hmac + hashlib). The signing secret comes from the
``SESSION_SECRET`` environment variable (injected seam, like ``EXPENSE_DB_PATH``);
the clock is an injectable parameter so tests can pin "now" and assert expiry.
"""
import hashlib
import hmac
import os
import time

COOKIE_NAME = "session"
DEFAULT_MAX_AGE = 60 * 60 * 24 * 7  # 7 days, in seconds
_DEV_SECRET = "dev-insecure-secret-change-me"


def _secret() -> bytes:
    return os.environ.get("SESSION_SECRET", _DEV_SECRET).encode()


def _now(now: float | None) -> int:
    return int(now if now is not None else time.time())


def issue_token(user_id: int, *, now: float | None = None, max_age: int = DEFAULT_MAX_AGE) -> str:
    """Return a signed token ``<user_id>.<expiry_epoch>.<hex_sig>``."""
    expiry = _now(now) + max_age
    payload = f"{user_id}.{expiry}"
    sig = hmac.new(_secret(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{sig}"


def verify_token(token: str | None, *, now: float | None = None) -> int | None:
    """Return the user_id for a valid, unexpired, correctly-signed token, else None."""
    if not token:
        return None
    try:
        user_id_s, expiry_s, sig = token.split(".")
    except (ValueError, AttributeError):
        return None
    payload = f"{user_id_s}.{expiry_s}"
    expected = hmac.new(_secret(), payload.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return None
    try:
        expiry = int(expiry_s)
        user_id = int(user_id_s)
    except ValueError:
        return None
    if _now(now) >= expiry:
        return None
    return user_id
