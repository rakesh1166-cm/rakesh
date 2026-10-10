import { useEffect, useState } from 'react'
import { title } from '../format.js'

/** GET /stats/summary, plus GET /plan/cache-stats and DELETE /plan/cache. */
export default function StatsView({ onLoad, onLoadCache, onClearCache, busy }) {
  const [stats, setStats] = useState(null)
  const [cache, setCache] = useState(null)

  const load = () => {
    onLoad().then(setStats)
    onLoadCache().then(setCache)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clear = async () => {
    if (await onClearCache()) load()
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Right now</h2>
          <code className="endpoint get">GET /stats/summary</code>
        </header>
        <div className="inline-form">
          <p className="hint" style={{ flex: 1, margin: 0, alignSelf: 'center' }}>
            Totals across <code>yatra_db</code>, and what the in-memory cache is holding.
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
              <span>Destinations</span>
              <strong>{stats.destinations}</strong>
              <em>{stats.places} places stored</em>
            </div>
            <div className="stat available">
              <span>Saved trips</span>
              <strong>{stats.trips}</strong>
              <em>snapshots in Postgres</em>
            </div>
            <div className="stat sold">
              <span>Cache</span>
              <strong>{stats.cache_entries}</strong>
              <em>weather / currency entries</em>
            </div>
          </div>

          <section className="panel">
            <header className="panel-head">
              <h2>Most planned</h2>
            </header>
            {stats.top_destinations.length === 0 ? (
              <p className="empty">No trips saved yet.</p>
            ) : (
              <ul className="bars">
                {stats.top_destinations.map((d) => (
                  <li key={d.destination}>
                    <span>{title(d.destination)}</span>
                    <span className="bar">
                      <span style={{ width: `${(d.trips / stats.top_destinations[0].trips) * 100}%` }} />
                    </span>
                    <strong>{d.trips}</strong>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {cache && (
        <section className="panel">
          <header className="panel-head">
            <h2>Cache entries ({cache.total_entries})</h2>
            <span className="endpoints">
              <code className="endpoint get">GET /plan/cache-stats</code>
              <button className="btn danger small" disabled={busy || cache.total_entries === 0} onClick={clear}>
                Clear cache
              </button>
            </span>
          </header>
          {cache.entries.length === 0 ? (
            <p className="empty">Empty — the next plan will call WeatherAPI and ExchangeRate-API directly.</p>
          ) : (
            <ul className="log-list">
              {cache.entries.map((e) => (
                <li key={e.key}>
                  <div className="cache-row">
                    <span className="path">{e.key}</span>
                    <span className="ms">
                      {e.age_seconds}s old · expires in {Math.ceil(e.expires_in_seconds / 60)} min
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
}
