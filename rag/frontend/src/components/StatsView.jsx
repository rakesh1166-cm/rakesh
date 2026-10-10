import { useEffect, useState } from 'react'

/** GET /stats/summary — what is indexed in rag_db and which models are used. */
export default function StatsView({ onLoad }) {
  const [stats, setStats] = useState(null)
  const load = () => onLoad().then(setStats)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Right now</h2>
          <code className="endpoint get">GET /stats/summary</code>
        </header>
        <div className="inline-form">
          <p className="hint" style={{ flex: 1, margin: 0, alignSelf: 'center' }}>
            Totals across everything stored in <code>rag_db</code>
            {stats && (
              <>
                {' '}· embeddings <code>{stats.embedding_model}</code> · answers <code>{stats.chat_model}</code>
              </>
            )}
          </p>
          <button className="btn" onClick={load}>
            Refresh
          </button>
        </div>
      </section>

      {stats && (
        <div className="stat-grid">
          <div className="stat">
            <span>Documents</span>
            <strong>{stats.documents}</strong>
            <em>{stats.pages} pages</em>
          </div>
          <div className="stat available">
            <span>Chunks</span>
            <strong>{stats.chunks}</strong>
            <em>embedded and searchable</em>
          </div>
          <div className="stat sold">
            <span>Questions</span>
            <strong>{stats.queries}</strong>
            <em>answered so far</em>
          </div>
        </div>
      )}
    </>
  )
}
