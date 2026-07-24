"""Shared FastAPI dependencies for authenticated, CSRF-protected routes."""
import hmac

from fastapi import HTTPException, Request, status

from app.session import COOKIE_NAME, CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verify_token


def require_user(request: Request) -> int:
    """Return the authenticated user's id from the session cookie, else 401."""
    user_id = verify_token(request.cookies.get(COOKIE_NAME))
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return user_id


def require_csrf(request: Request) -> None:
    """Double-submit CSRF check: the X-CSRF-Token header must match the CSRF cookie.

    For cookie-authenticated state-changing (non-GET) routes. Absent/mismatched → 403."""
    cookie = request.cookies.get(CSRF_COOKIE_NAME)
    header = request.headers.get(CSRF_HEADER_NAME)
    if not cookie or not header or not hmac.compare_digest(cookie, header):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="CSRF check failed"
        )
