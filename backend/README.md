# The Lighthouse — backend

FastAPI service handling auth, journal sessions, and the Gemini reflection call.

## Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Open `.env` and fill in `GEMINI_API_KEY` (get one at
https://aistudio.google.com/apikey) and a random `JWT_SECRET` — the
`.env.example` file has a one-line command to generate one.

## Run it

```bash
uvicorn app.main:app --reload --port 8000
```

A `lighthouse.db` SQLite file gets created automatically on first run —
nothing else to set up.

API docs (auto-generated) are at `http://localhost:8000/docs` — useful for
testing endpoints directly without the frontend.

## Routes

| Route | Method | Auth required | Purpose |
|---|---|---|---|
| `/api/auth/signup` | POST | no | Create an account, sets session cookie |
| `/api/auth/login` | POST | no | Sign in, sets session cookie |
| `/api/auth/logout` | POST | no | Clears the session cookie |
| `/api/auth/me` | GET | yes | Returns the current user, or 401 |
| `/api/sessions` | GET | yes | List the current user's journal sessions |
| `/api/sessions` | POST | yes | Save a new journal session |
| `/api/reflect` | POST | yes | Calls Gemini, returns structured reflection JSON |

## How auth works

- Passwords are hashed with bcrypt (`passlib`) — never stored in plain text.
- On signup/login, a JWT is issued and set as an **httpOnly cookie**, so
  frontend JS never touches the token directly (harder for XSS to steal it).
- Every protected route depends on `get_current_user`, which reads that
  cookie, verifies the JWT, and loads the matching user from the DB.
- `COOKIE_SECURE = False` in `app/routers/auth_routes.py` is fine for local
  dev over `http://`. Flip it to `True` once this is deployed over `https://`,
  or the browser will refuse to send the cookie back.

## Data

SQLite via SQLAlchemy — three tables: `users`, `journal_sessions`, and
`journal_entries` (entries belong to a session, sessions belong to a user).
Good enough for a personal project; swap `DATABASE_URL` in `app/database.py`
for a Postgres connection string later without touching any route code.

## Deploying

Render, Railway, or Fly.io all work well for a small FastAPI + SQLite app.
Whichever you pick, set `GEMINI_API_KEY`, `JWT_SECRET`, and `FRONTEND_ORIGIN`
as environment variables there (don't commit `.env`), and update
`FRONTEND_ORIGIN` to your deployed frontend's real URL so CORS allows it.
