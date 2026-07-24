"""API models for accounts / registration.

Passwords cross the boundary only inbound (register); no response model ever
carries the password or its stored verifier.
"""
from pydantic import BaseModel, EmailStr, Field, model_validator

MIN_PASSWORD_LENGTH = 8


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    password: str
    confirm_password: str

    @model_validator(mode="after")
    def _check_password(self) -> "RegisterRequest":
        if len(self.password) < MIN_PASSWORD_LENGTH:
            raise ValueError(
                f"password must be at least {MIN_PASSWORD_LENGTH} characters"
            )
        if self.password != self.confirm_password:
            raise ValueError("password and confirm_password do not match")
        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
