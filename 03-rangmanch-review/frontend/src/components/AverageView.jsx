import { useState } from 'react'

/** GET /review/average/{play_name} — an aggregate (SQL AVG + COUNT), not a CRUD operation. */
export default function AverageView({ onCompute }) {
  const [play, setPlay] = useState('')
  const [result, setResult] = useState(null)

  const compute = async () => {
    if (!play.trim()) return
    setResult(await onCompute(play.trim()))
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Average rating for a play</h2>
        <code className="endpoint get">GET /review/average/{'{play_name}'}</code>
      </header>

      <p className="hint block">
        This one is not CRUD. The database does the work — <code>func.avg</code> and{' '}
        <code>func.count</code> in a single query — instead of sending every row to the browser to
        add up. That is the habit worth copying.
      </p>

      <div className="inline-form">
        <input
          placeholder="Exact play name"
          value={play}
          onChange={(e) => setPlay(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && compute()}
        />
        <button className="btn primary" onClick={compute}>
          Compute
        </button>
      </div>

      {result && (
        <div className="avg">
          <strong>{result.average_rating}</strong>
          <span>
            ★ average from {result.total_reviews} review(s) of <em>{result.play_name}</em>
          </span>
        </div>
      )}
    </section>
  )
}
