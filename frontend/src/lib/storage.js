// Sessions now live in the backend database, scoped to the logged-in
// user (see backend/app/routers/sessions_routes.py). Drafts stay in
// localStorage since they're transient and don't need a server round
// trip on every keystroke.

const DRAFT_KEY = 'lighthouse_draft'

export async function loadEntries() {
  const res = await fetch('/api/sessions', { credentials: 'include' })
  if (!res.ok) throw new Error('Could not load past entries')
  return res.json()
}

export async function appendSession(session) {
  const res = await fetch('/api/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session)
  })
  if (!res.ok) throw new Error('Could not save this session')
  return res.json()
}

export function saveDraft(text) {
  localStorage.setItem(DRAFT_KEY, text)
}

export function loadDraft() {
  return localStorage.getItem(DRAFT_KEY) || ''
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}
