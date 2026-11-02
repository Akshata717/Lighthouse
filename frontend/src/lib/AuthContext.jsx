import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

async function parseJson(res) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) setUser(await res.json())
      })
      .finally(() => setCheckingSession(false))
  }, [])

  async function signup(email, password) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await parseJson(res)
    if (!res.ok) throw new Error(data?.detail || 'Could not create account')
    setUser(data)
    return data
  }

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await parseJson(res)
    if (!res.ok) throw new Error(data?.detail || 'Could not sign in')
    setUser(data)
    return data
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, checkingSession, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
