"""Shared FastAPI dependencies for authenticated, CSRF-protected routes."""
from fastapi import HTTPException, Request, status

from app.session import COOKIE_NAME, verify_token


def require_user(request: Request) -> int:
    """Return the authenticated user's id from the session cookie, else 401."""
    user_id = verify_token(request.cookies.get(COOKIE_NAME))
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return user_id
