// Calls your backend. Point this at wherever your Python service
// (the one running the Gemini call) is deployed — in dev, the
// vite.config.js proxy forwards /api/* to your local backend.
// Until that endpoint exists, this falls back to a local,
// clearly-labeled sample reflection so the interface stays fully
// demoable without a backend running.
//
// Expected shape of a real response from POST /api/reflect:
// { summary: string, patterns: string[], questions: string[], action: string }
export async function getReflection(prompt, text) {
  try {
    const res = await fetch('/api/reflect', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, text })
    })
    if (!res.ok) throw new Error('backend not available')
    const data = await res.json()
    return { ...data, isDemo: false }
  } catch (err) {
    await new Promise((r) => setTimeout(r, 900)) // mirrors real latency
    return {
      summary:
        "You're processing something that matters to you, and putting it into words on its own.",
      patterns: [
        'Naming a feeling before it\u2019s fully resolved',
        'Comparing this moment to how you think you \u2018should\u2019 feel',
        'Looking for a next step rather than sitting with the moment'
      ],
      questions: [
        'What would you say to a friend who wrote exactly this?',
        'Is there a smaller, kinder version of the thought you just had?'
      ],
      action: 'Reread what you wrote once, slowly, before you close this tab.',
      isDemo: true
    }
  }
}
