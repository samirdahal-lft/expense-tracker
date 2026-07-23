"""Auth HTTP routes. Thin — validation/serialization via Pydantic, logic in the service."""
from fastapi import APIRouter, HTTPException, Request, Response, status

from app.models.user import RegisterRequest, UserOut
from app.repositories import users as users_repo
from app.services import auth as service
from app.services.auth import EmailTakenError
from app.session import COOKIE_NAME, DEFAULT_MAX_AGE, issue_token, verify_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _set_session_cookie(response: Response, user_id: int) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=issue_token(user_id),
        max_age=DEFAULT_MAX_AGE,
        httponly=True,
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
    _set_session_cookie(response, user["id"])
    return user


@router.get("/me", response_model=UserOut)
def me(request: Request) -> dict:
    user_id = verify_token(request.cookies.get(COOKIE_NAME))
    user = users_repo.get_user_by_id(user_id) if user_id is not None else None
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return user
