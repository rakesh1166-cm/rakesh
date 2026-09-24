import { useEffect, useState } from 'react'
import { LABEL, STATUSES } from '../status.js'

const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time

/** GET /stats/daily — order counts per status for one day. */
export default function StatsView({ onCompute }) {
  const [day, setDay] = useState(today())
  const [stats, setStats] = useState(null)

  const load = () => onCompute(day).then(setStats)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day])

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Orders created on</h2>
          <code className="endpoint get">GET /stats/daily?summary_date={day}</code>
        </header>
        <div className="inline-form">
          <input type="date" value={day} onChange={(e) => setDay(e.target.value || today())} />
          <button className="btn" onClick={load}>
            Refresh
          </button>
        </div>

        {stats && (
          <div className="avg">
            <strong>{stats.total_orders}</strong>
            <span>total orders on {stats.date}</span>
          </div>
        )}
      </section>

      {stats && (
        <div className="stat-grid">
          {STATUSES.map((s) => (
            <div key={s} className={`stat ${s}`}>
              <span>{LABEL[s]}</span>
              <strong>{stats.by_status[s] ?? 0}</strong>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
