import { useEffect, useState } from 'react'
import { rupees } from '../format.js'

/** GET /stats/summary — users, available vs sold books and their value. */
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
            Totals across every listing in <code>kitab_db</code>.
          </p>
          <button className="btn" onClick={load}>
            Refresh
          </button>
        </div>
      </section>

      {stats && (
        <div className="stat-grid">
          <div className="stat">
            <span>Students</span>
            <strong>{stats.users}</strong>
            <em>registered</em>
          </div>
          <div className="stat available">
            <span>Available</span>
            <strong>{stats.available.count}</strong>
            <em>{rupees(stats.available.value)} on the shelf</em>
          </div>
          <div className="stat sold">
            <span>Sold</span>
            <strong>{stats.sold.count}</strong>
            <em>{rupees(stats.sold.value)} changed hands</em>
          </div>
        </div>
      )}
    </>
  )
}
