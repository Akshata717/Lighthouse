import os

from dotenv import load_dotenv

load_dotenv()  # must run before routers import anything that reads env vars

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth_routes, reflect_routes, sessions_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="The Lighthouse API")

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,  # required so the session cookie is sent/received
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(sessions_routes.router)
app.include_router(reflect_routes.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
