from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="At least 8 characters")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Reflection ----------
class ReflectRequest(BaseModel):
    prompt: str
    text: str


class ReflectResponse(BaseModel):
    summary: str
    patterns: list[str]
    questions: list[str]
    action: str


# ---------- Journal sessions ----------
class EntryIn(BaseModel):
    writing: str
    reflection: ReflectResponse


class EntryOut(BaseModel):
    id: int
    writing: str
    reflection: dict
    timestamp: datetime

    class Config:
        from_attributes = True


class SessionIn(BaseModel):
    date: str
    time: str
    prompt: str
    entries: list[EntryIn]


class SessionOut(BaseModel):
    id: int
    date: str
    time: str
    prompt: str
    entries: list[EntryOut]

    class Config:
        from_attributes = True
