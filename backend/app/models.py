from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship(
        "JournalSession", back_populates="owner", cascade="all, delete-orphan"
    )


class JournalSession(Base):
    __tablename__ = "journal_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False)   # "2026-08-12"
    time = Column(String, nullable=False)   # "14:05"
    prompt = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="sessions")
    entries = relationship(
        "JournalEntry", back_populates="session", cascade="all, delete-orphan"
    )


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("journal_sessions.id"), nullable=False)
    writing = Column(Text, nullable=False)
    reflection = Column(JSON, nullable=False)  # {summary, patterns, questions, action}
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("JournalSession", back_populates="entries")
