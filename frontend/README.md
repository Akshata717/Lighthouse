# The Lighthouse

A quiet, CBT-inspired journaling app. Write freely or from a prompt, get an AI reflection back, and revisit past sessions.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                top-level view state + session flow
  index.css               design tokens + all styling
  components/
    BeaconField.jsx        ambient background sweep (signature visual)
    Nav.jsx                 top nav
    Welcome.jsx              landing screen
    PromptSelect.jsx          free-write vs. prompt picker
    Writing.jsx                textarea + autosaving draft
    Reflection.jsx              progressive reveal of the AI reflection
    History.jsx                  archive of past sessions
  lib/
    prompts.js              the three built-in prompts
    storage.js                localStorage helpers (sessions + drafts)
    reflectApi.js              calls /api/reflect, falls back to a demo reflection
```

## Backend

This frontend now talks to a real backend (in `../backend`) for auth,
saving sessions, and the Gemini reflection call. See `../backend/README.md`
to set it up — `npm run dev` here proxies `/api/*` to `http://localhost:8000`,
so run both servers side by side.

`src/lib/AuthContext.jsx` handles sign-in state, `src/lib/storage.js` fetches
and saves journal sessions, and `src/lib/reflectApi.js` calls `/api/reflect` —
all three assume the backend is running and send `credentials: 'include'` so
the session cookie goes along with each request.
