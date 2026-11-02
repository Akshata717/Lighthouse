import { useState } from 'react'
import { PROMPTS } from '../lib/prompts'

export default function PromptSelect({ onContinue, onBack }) {
  const [mode, setMode] = useState(null) // 'free' | 'prompted'
  const [selectedPrompt, setSelectedPrompt] = useState(null)

  function chooseMode(next) {
    setMode(next)
    if (next === 'free') {
      setSelectedPrompt('Free writing')
    } else {
      setSelectedPrompt(null)
    }
  }

  const canContinue = mode === 'free' || (mode === 'prompted' && selectedPrompt)

  return (
    <section className="view">
      <div className="section-head">
        <div className="eyebrow">step one</div>
        <h2>Would you like a prompt?</h2>
        <p>Pick whichever feels right today. There's no wrong way to start.</p>
      </div>

      <div className="choice-row">
        <button
          className={'choice-card' + (mode === 'free' ? ' selected' : '')}
          onClick={() => chooseMode('free')}
        >
          <h3>Free write</h3>
          <p>Start from a blank page, no prompt needed.</p>
        </button>
        <button
          className={'choice-card' + (mode === 'prompted' ? ' selected' : '')}
          onClick={() => chooseMode('prompted')}
        >
          <h3>Use a prompt</h3>
          <p>Choose from three gentle starting points.</p>
        </button>
      </div>

      {mode === 'prompted' && (
        <div className="prompt-cards">
          {PROMPTS.map((p) => (
            <button
              key={p}
              className={'prompt-card' + (selectedPrompt === p ? ' selected' : '')}
              onClick={() => setSelectedPrompt(p)}
            >
              <span className="text">{p}</span>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      )}

      <div className="btn-row">
        {canContinue && (
          <button className="btn btn-primary" onClick={() => onContinue(selectedPrompt)}>
            Continue
          </button>
        )}
        <button className="btn btn-ghost" onClick={onBack}>
          Back
        </button>
      </div>
    </section>
  )
}
