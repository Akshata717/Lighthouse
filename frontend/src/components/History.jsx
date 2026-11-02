import { useState } from 'react'
import { ReflectionBlocks } from './Reflection'

export default function History({ sessions }) {
  const [openIndex, setOpenIndex] = useState(null)
  const ordered = sessions.slice().reverse()

  if (ordered.length === 0) {
    return (
      <section className="view">
        <div className="section-head">
          <div className="eyebrow">archive</div>
          <h2>Past entries</h2>
        </div>
        <div className="empty-state">
          <h3>Nothing here yet</h3>
          <p>
            Your past sessions will show up here once you finish your first one. The page is
            yours whenever you're ready to fill it.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="view">
      <div className="section-head">
        <div className="eyebrow">archive</div>
        <h2>Past entries</h2>
      </div>

      {ordered.map((session, idx) => {
        const firstWriting = session.entries[0]?.writing || ''
        const snippet =
          firstWriting.length > 120 ? firstWriting.slice(0, 120) + '…' : firstWriting
        const isOpen = openIndex === idx

        return (
          <div
            key={idx}
            className="history-item"
            onClick={() => setOpenIndex(isOpen ? null : idx)}
          >
            <div className="history-meta">
              {session.date} · {session.time} · {session.entries.length} entr
              {session.entries.length === 1 ? 'y' : 'ies'}
            </div>
            <div className="history-prompt">{session.prompt}</div>
            <div className="history-snippet">{snippet}</div>

            {isOpen && (
              <div className="history-detail">
                {session.entries.map((entry, eIdx) => (
                  <div key={eIdx}>
                    {eIdx > 0 && <div className="history-divider" />}
                    <div className="writing">{entry.writing}</div>
                    <ReflectionBlocks reflection={entry.reflection} animated={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
