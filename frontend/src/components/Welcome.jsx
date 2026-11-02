export default function Welcome({ sessions, onBegin, onViewHistory }) {
  const stat = (() => {
    if (sessions.length === 0) return 'No entries yet — this will be your first.'
    const total = sessions.reduce((sum, s) => sum + s.entries.length, 0)
    return `${sessions.length} session${sessions.length === 1 ? '' : 's'} · ${total} entr${
      total === 1 ? 'y' : 'ies'
    } logged`
  })()

  return (
    <section className="view welcome">
      <div className="eyebrow">a quiet space</div>
      <h1>
        The storm always passes,
        <br />
        and you'll find your way home.
      </h1>
      <p className="tagline">
        Write freely, or start from a prompt. When you're ready, the lighthouse will offer a
        gentle reflection back — no pressure, no judgment.
      </p>
      <div className="stat">{stat}</div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={onBegin}>
          Begin writing
        </button>
        <button className="btn btn-ghost" onClick={onViewHistory}>
          See past entries
        </button>
      </div>
    </section>
  )
}
