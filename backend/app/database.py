from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite file lives right next to this backend. Good enough for one
# person's journal; swap the URL for Postgres later without touching
# anything else if this ever needs multiple concurrent users at scale.
DATABASE_URL = "sqlite:///./lighthouse.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
