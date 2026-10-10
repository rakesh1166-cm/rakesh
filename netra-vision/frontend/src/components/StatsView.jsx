import { useEffect, useState } from 'react'
import { summary } from '../api.js'

const ORDER = ['healthy', 'mild', 'moderate', 'severe', 'critical', 'unknown']

export default function StatsView() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    summary().then(setData).catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="error">{error}</div>
  if (!data) return <p className="muted">Loading…</p>

  const max = Math.max(1, ...Object.values(data.by_severity))

  return (
    <div>
      <h1>Stats</h1>

      <div className="tiles">
        <div className="tile">
          <div className="tile-label">Total analyses</div>
          <div className="tile-value">{data.total}</div>
        </div>
        <div className="tile">
          <div className="tile-label">Healthy</div>
          <div className="tile-value">{data.by_severity.healthy || 0}</div>
        </div>
        <div className="tile">
          <div className="tile-label">Severe + critical</div>
          <div className="tile-value">{(data.by_severity.severe || 0) + (data.by_severity.critical || 0)}</div>
        </div>
      </div>

      <div className="card">
        <h3>By severity</h3>
        {ORDER.filter((s) => data.by_severity[s]).map((s) => (
          <div className="hbar" key={s}>
            <span className="hbar-label">{s}</span>
            <span className="hbar-track">
              <span className={`hbar-fill sev-${s}`} style={{ width: `${(data.by_severity[s] / max) * 100}%` }} />
            </span>
            <span className="hbar-value">{data.by_severity[s]}</span>
          </div>
        ))}
        {data.total === 0 && <p className="muted">No data yet.</p>}
      </div>

      <div className="card">
        <h3>Top crops</h3>
        {data.top_crops.length === 0 ? (
          <p className="muted">No data yet.</p>
        ) : (
          <ul className="plain">
            {data.top_crops.map((c) => (
              <li key={c.crop}><span>{c.crop}</span><strong>{c.count}</strong></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
