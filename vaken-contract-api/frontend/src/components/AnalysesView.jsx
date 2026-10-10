import { useEffect, useState } from 'react'
import AnalysisCard from './AnalysisCard.jsx'

/** GET /analysis/ — every analysis across all contracts, newest first. */
export default function AnalysesView({ onLoad, contracts }) {
  const [analyses, setAnalyses] = useState(null)
  const names = Object.fromEntries(contracts.map((c) => [c.id, c.original_name]))

  useEffect(() => {
    onLoad().then(setAnalyses)
  }, [onLoad])

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>{analyses ? `${analyses.length} analyses` : 'Loading…'}</h2>
          <code className="endpoint get">GET /analysis/</code>
        </header>
        <p className="hint" style={{ margin: 0 }}>
          Run an analysis from the Contracts screen; every result is stored in the <code>analyses</code> table.
        </p>
      </section>

      {analyses?.length === 0 && <p className="empty panel">No analyses yet.</p>}

      <div className="cards">
        {analyses?.map((a) => (
          <AnalysisCard key={a.id} analysis={a} title={`#${a.id} · ${names[a.contract_id] ?? `contract #${a.contract_id}`}`} />
        ))}
      </div>
    </>
  )
}
