import { useEffect, useState } from 'react'
import BeaconField from './components/BeaconField'
import Nav from './components/Nav'
import Welcome from './components/Welcome'
import PromptSelect from './components/PromptSelect'
import Writing from './components/Writing'
import Reflection from './components/Reflection'
import History from './components/History'
import AuthScreen from './components/AuthScreen'
import { useAuth } from './lib/AuthContext'
import { getReflection } from './lib/reflectApi'
import { appendSession, clearDraft, loadEntries } from './lib/storage'

export default function App() {
  const { user, checkingSession, logout } = useAuth()

  const [view, setView] = useState('welcome')
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [saveError, setSaveError] = useState('')

  const [currentSession, setCurrentSession] = useState(null)
  const [activePrompt, setActivePrompt] = useState(null)
  const [writingEyebrow, setWritingEyebrow] = useState('your entry')

  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflection, setReflection] = useState(null)

  // Load this user's sessions once they're signed in.
  useEffect(() => {
    if (!user) return
    setSessionsLoading(true)
    loadEntries()
      .then(setSessions)
      .catch(() => setSaveError('Could not load your past entries.'))
      .finally(() => setSessionsLoading(false))
  }, [user])

  function goTo(nextView) {
    setView(nextView)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBegin() {
    goTo('promptSelect')
  }

  function handlePromptContinue(prompt) {
    setActivePrompt(prompt)
    setWritingEyebrow('your entry')
    setCurrentSession({
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      prompt,
      entries: []
    })
    goTo('writing')
  }

  async function handleReflect(text) {
    goTo('reflection')
    setReflectionLoading(true)
    setReflection(null)

    const result = await getReflection(activePrompt, text)

    setCurrentSession((prev) => ({
      ...prev,
      entries: [...prev.entries, { writing: text, reflection: result }]
    }))
    setReflection(result)
    setReflectionLoading(false)
  }

  function handleKeepWriting() {
    setActivePrompt('Keep going')
    setWritingEyebrow('continuing')
    goTo('writing')
  }

  async function handleFinish() {
    if (currentSession && currentSession.entries.length) {
      try {
        setSaveError('')
        await appendSession(currentSession)
        const fresh = await loadEntries()
        setSessions(fresh)
      } catch (err) {
        setSaveError('Could not save this session. Your writing is still here — try again.')
        return // stay on the reflection view so nothing is lost
      }
    }
    clearDraft()
    setCurrentSession(null)
    setActivePrompt(null)
    setReflection(null)
    goTo('welcome')
  }

  if (checkingSession) {
    return (
      <>
        <BeaconField />
        <div className="shell">
          <div className="reflect-loading" style={{ paddingTop: '30vh' }}>
            <div className="pulse-dot" />
            <span>Finding your lighthouse…</span>
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <BeaconField />
        <div className="shell">
          <nav className="topbar">
            <div className="brand">
              <div className="brand-mark" />
              <div className="brand-name">The Lighthouse</div>
            </div>
          </nav>
          <AuthScreen />
        </div>
      </>
    )
  }

  return (
    <>
      <BeaconField />
      <div className="shell">
        <Nav view={view} onNavigate={goTo} user={user} onLogout={logout} />

        {saveError && (
          <div
            style={{
              color: '#e08585',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.78rem',
              marginBottom: 20
            }}
          >
            {saveError}
          </div>
        )}

        {view === 'welcome' && (
          <Welcome sessions={sessions} onBegin={handleBegin} onViewHistory={() => goTo('history')} />
        )}

        {view === 'promptSelect' && (
          <PromptSelect onContinue={handlePromptContinue} onBack={() => goTo('welcome')} />
        )}

        {view === 'writing' && (
          <Writing
            prompt={activePrompt}
            eyebrow={writingEyebrow}
            onReflect={handleReflect}
            onBack={() => goTo('promptSelect')}
          />
        )}

        {view === 'reflection' && (
          <Reflection
            loading={reflectionLoading}
            reflection={reflection}
            onKeepWriting={handleKeepWriting}
            onFinish={handleFinish}
          />
        )}

        {view === 'history' && (
          sessionsLoading
            ? <div className="reflect-loading"><div className="pulse-dot" /><span>Loading entries…</span></div>
            : <History sessions={sessions} />
        )}

        <footer className="closing">Take care of yourself. The lighthouse is always here.</footer>
      </div>
    </>
  )
}
