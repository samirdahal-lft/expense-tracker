"""Auth HTTP routes. Thin — validation/serialization via Pydantic, logic in the service."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.dependencies import require_csrf, require_user
from app.models.user import LoginRequest, RegisterRequest, UserOut
from app.repositories import users as users_repo
from app.services import auth as service
from app.services.auth import EmailTakenError
from app.session import (
    COOKIE_NAME,
    CSRF_COOKIE_NAME,
    DEFAULT_MAX_AGE,
    issue_csrf_token,
    issue_token,
    verify_token,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _establish_session(response: Response, user_id: int) -> None:
    """Set the signed httpOnly session cookie plus the readable CSRF cookie."""
    response.set_cookie(
        key=COOKIE_NAME,
        value=issue_token(user_id),
        max_age=DEFAULT_MAX_AGE,
        httponly=True,
        samesite="lax",
        path="/",
    )
    response.set_cookie(
        key=CSRF_COOKIE_NAME,
        value=issue_csrf_token(),
        max_age=DEFAULT_MAX_AGE,
        httponly=False,  # readable by the client so it can echo it in the CSRF header
        samesite="lax",
        path="/",
    )


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, response: Response) -> dict:
    try:
        user = service.register(payload)
    except EmailTakenError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )
    _establish_session(response, user["id"])
    return user


@router.post("/login", response_model=UserOut)
def login(payload: LoginRequest, response: Response) -> dict:
    user = service.authenticate(str(payload.email), payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    _establish_session(response, user["id"])
    return user


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_user), Depends(require_csrf)],
)
def logout(response: Response) -> dict:
    """End the current session immediately (no confirmation): clear both cookies."""
    response.delete_cookie(COOKIE_NAME, path="/")
    response.delete_cookie(CSRF_COOKIE_NAME, path="/")
    return {"status": "logged out"}


@router.get("/me", response_model=UserOut)
def me(request: Request) -> dict:
    user_id = verify_token(request.cookies.get(COOKIE_NAME))
    user = users_repo.get_user_by_id(user_id) if user_id is not None else None
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return user
