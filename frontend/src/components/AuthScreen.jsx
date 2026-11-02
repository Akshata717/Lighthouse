import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function AuthScreen() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="view welcome" style={{ minHeight: '70vh' }}>
      <div className="eyebrow">{mode === 'login' ? 'welcome back' : 'a quiet space'}</div>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', marginBottom: 14 }}>
        {mode === 'login' ? 'Sign in to your lighthouse' : 'Create your lighthouse'}
      </h1>
      <p className="tagline" style={{ marginBottom: 32 }}>
        {mode === 'login'
          ? 'Your entries are private to your account.'
          : 'Takes a few seconds — no email verification needed to get started.'}
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: 360 }}>
        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="email"
            className="eyebrow"
            style={{ display: 'block', marginBottom: 8, color: 'var(--mist)' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label
            htmlFor="password"
            className="eyebrow"
            style={{ display: 'block', marginBottom: 8, color: 'var(--mist)' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            style={inputStyle}
          />
        </div>

        {mode === 'signup' && (
          <div style={{ fontSize: '0.8rem', color: 'var(--mist-dim)', marginBottom: 16 }}>
            At least 8 characters.
          </div>
        )}

        {error && (
          <div
            style={{
              color: '#e08585',
              fontSize: '0.85rem',
              marginBottom: 16,
              fontFamily: "'IBM Plex Mono', monospace"
            }}
          >
            {error}
          </div>
        )}

        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting
              ? 'Please wait…'
              : mode === 'login'
              ? 'Sign in'
              : 'Create account'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError('')
            }}
          >
            {mode === 'login' ? 'Create an account instead' : 'Sign in instead'}
          </button>
        </div>
      </form>
    </section>
  )
}

const inputStyle = {
  width: '100%',
  background: 'var(--panel)',
  border: '1px solid var(--panel-line)',
  borderRadius: 10,
  padding: '12px 14px',
  color: 'var(--foam)',
  fontFamily: "'Public Sans', sans-serif",
  fontSize: '0.95rem',
  outline: 'none'
}
