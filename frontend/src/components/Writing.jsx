import { useEffect, useRef, useState } from 'react'
import { saveDraft } from '../lib/storage'

export default function Writing({ prompt, eyebrow, onReflect, onBack }) {
  const [text, setText] = useState('')
  const [autosaveNote, setAutosaveNote] = useState('not yet saved')
  const debounceRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [prompt])

  function handleChange(e) {
    const value = e.target.value
    setText(value)
    setAutosaveNote('saving…')
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveDraft(value)
      setAutosaveNote('draft saved')
    }, 600)
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  return (
    <section className="view">
      <div className="eyebrow writing-eyebrow">{eyebrow}</div>
      <h2 className="writing-prompt">{prompt}</h2>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="Start writing whenever you're ready…"
      />
      <div className="writing-footer">
        <div className="word-count">
          {wordCount} word{wordCount === 1 ? '' : 's'}
        </div>
        <div className="autosave-note">{autosaveNote}</div>
      </div>
      <div className="btn-row" style={{ marginTop: 28 }}>
        <button
          className="btn btn-primary"
          disabled={!text.trim()}
          onClick={() => text.trim() && onReflect(text.trim())}
        >
          Reflect on this
        </button>
        <button className="btn btn-ghost" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  )
}
