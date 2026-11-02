export default function Nav({ view, onNavigate, user, onLogout }) {
  return (
    <nav className="topbar">
      <button className="brand" onClick={() => onNavigate('welcome')}>
        <div className="brand-mark" />
        <div className="brand-name">The Lighthouse</div>
      </button>
      <div className="nav-links">
        <button
          className={view !== 'history' ? 'active' : ''}
          onClick={() => onNavigate('welcome')}
        >
          Write
        </button>
        <button
          className={view === 'history' ? 'active' : ''}
          onClick={() => onNavigate('history')}
        >
          History
        </button>
        {user && (
          <button onClick={onLogout} title={user.email}>
            Sign out
          </button>
        )}
      </div>
    </nav>
  )
}
