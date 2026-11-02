export function ReflectionBlocks({ reflection, animated }) {
  if (!reflection) return null

  const blocks = [
    { title: 'Summary', body: reflection.summary, delay: 0 },
    {
      title: 'Thinking patterns',
      body: (reflection.patterns || []).map((p) => '· ' + p).join('\n'),
      delay: 0.12
    },
    {
      title: 'Questions worth sitting with',
      body: (reflection.questions || []).map((q) => '· ' + q).join('\n'),
      delay: 0.24
    },
    { title: 'One small step', body: reflection.action, delay: 0.36, action: true }
  ]

  return (
    <>
      {reflection.isDemo && (
        <div className="demo-note">
          — sample reflection: connect /api/reflect to your backend for real AI analysis —
        </div>
      )}
      {blocks.map((b) => (
        <div
          key={b.title}
          className={
            'reflect-block' + (b.action ? ' action' : '') + (animated ? '' : ' static')
          }
          style={animated ? { animationDelay: `${b.delay}s` } : undefined}
        >
          <h4>{b.title}</h4>
          <div className="body">{b.body || ''}</div>
        </div>
      ))}
    </>
  )
}

export default function Reflection({ loading, reflection, onKeepWriting, onFinish }) {
  return (
    <section className="view">
      <div className="section-head">
        <div className="eyebrow">reflection</div>
        <h2>Sitting with what you wrote</h2>
      </div>

      {loading && (
        <div className="reflect-loading">
          <div className="pulse-dot" />
          <span>Reading it over…</span>
        </div>
      )}

      {!loading && <ReflectionBlocks reflection={reflection} animated />}

      {!loading && (
        <div className="reflect-actions">
          <button className="btn btn-primary" onClick={onKeepWriting}>
            Keep writing
          </button>
          <button className="btn btn-ghost" onClick={onFinish}>
            Finish for today
          </button>
        </div>
      )}
    </section>
  )
}
