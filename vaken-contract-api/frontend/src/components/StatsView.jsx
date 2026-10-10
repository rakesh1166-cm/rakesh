import { useEffect, useState } from 'react'

/** GET /stats/summary — contracts by status and analyses by risk level. */
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
            Totals across every contract in <code>vaken_db</code>.
          </p>
          <button className="btn" onClick={load}>
            Refresh
          </button>
        </div>
      </section>

      {stats && (
        <>
          <div className="stat-grid">
            <div className="stat">
              <span>Contracts</span>
              <strong>{stats.contracts}</strong>
              <em>uploaded</em>
            </div>
            <div className="stat available">
              <span>Analysed</span>
              <strong>{stats.contracts_by_status.analyzed ?? 0}</strong>
              <em>{stats.contracts_by_status.uploaded ?? 0} waiting for analysis</em>
            </div>
            <div className="stat sold">
              <span>Analyses run</span>
              <strong>{stats.analyses}</strong>
              <em>{stats.contracts_by_status.error ?? 0} contract(s) in error</em>
            </div>
          </div>

          <section className="panel">
            <header className="panel-head">
              <h2>Analyses by overall risk</h2>
            </header>
            <div className="risk-grid">
              {Object.entries(stats.analyses_by_risk).map(([level, count]) => (
                <div key={level} className={`risk-tile ${level}`}>
                  <span className={`risk ${level}`}>{level}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}
