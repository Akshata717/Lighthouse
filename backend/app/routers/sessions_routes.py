from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from ..auth import get_current_user
from ..database import get_db
from ..models import JournalEntry, JournalSession, User
from ..schemas import SessionIn, SessionOut

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionOut])
def list_sessions(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    sessions = (
        db.query(JournalSession)
        .options(joinedload(JournalSession.entries))
        .filter(JournalSession.user_id == current_user.id)
        .order_by(JournalSession.created_at.asc())
        .all()
    )
    return sessions


@router.post("", response_model=SessionOut, status_code=201)
def create_session(
    payload: SessionIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = JournalSession(
        user_id=current_user.id,
        date=payload.date,
        time=payload.time,
        prompt=payload.prompt,
    )
    db.add(session)
    db.flush()  # get session.id before adding entries

    for entry in payload.entries:
        db.add(
            JournalEntry(
                session_id=session.id,
                writing=entry.writing,
                reflection=entry.reflection.model_dump(),
            )
        )

    db.commit()
    db.refresh(session)
    return session
