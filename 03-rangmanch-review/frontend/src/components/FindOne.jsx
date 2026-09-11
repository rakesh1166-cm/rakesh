import { useState } from 'react'

/** READ (one) — GET /review/{id}. A 404 here is a normal, useful answer, not a crash. */
export default function FindOne({ onLookup }) {
  const [id, setId] = useState('')
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(null)

  const fetchOne = async () => {
    if (!id) return
    const review = await onLookup(Number(id))
    setResult(review)
    setNotFound(review ? null : id)
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Fetch a single review</h2>
        <code className="endpoint get">GET /review/{'{id}'}</code>
      </header>

      <p className="hint block">
        The id goes in the <em>path</em>, not the query string — that is how FastAPI's
        <code> @router.get("/{'{review_id}'}") </code> declares it.
      </p>

      <div className="inline-form">
        <input
          type="number"
          min="1"
          placeholder="Review id, e.g. 1"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchOne()}
        />
        <button className="btn primary" onClick={fetchOne}>
          Send GET
        </button>
      </div>

      {result && <pre className="result">{JSON.stringify(result, null, 2)}</pre>}
      {notFound && (
        <p className="callout warn">
          The server answered <strong>404</strong> for id {notFound} — the row does not exist.
          Compare that with an empty list from <code>GET /review/</code>, which is a 200.
        </p>
      )}
    </section>
  )
}
