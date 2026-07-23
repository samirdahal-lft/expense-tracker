"""API models for accounts / registration.

Passwords cross the boundary only inbound (register); no response model ever
carries the password or its stored verifier.
"""
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
