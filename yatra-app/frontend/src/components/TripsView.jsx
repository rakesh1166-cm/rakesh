import { useEffect, useState } from 'react'
import { getTrip } from '../api.js'
import { fmt, range, title } from '../format.js'
import PlanResult from './PlanResult.jsx'

/** GET /trips/ to list, GET /trips/{id} for the stored snapshot, DELETE /trips/{id}. */
export default function TripsView({ trips, filter, setFilter, onDelete, onPlanNew, busy }) {
  const [selected, setSelected] = useState(null)

  // Drop the open trip if it was just deleted
  useEffect(() => {
    if (selected && !trips.some((t) => t.id === selected.id)) setSelected(null)
  }, [trips, selected])

  const open = async (trip) => {
    if (selected?.id === trip.id) return setSelected(null)
    try {
      setSelected(await getTrip(trip.id))
    } catch {
      setSelected(null)
    }
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Saved trips ({trips.length})</h2>
          <code className="endpoint get">GET /trips/</code>
        </header>
        <div className="inline-form">
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by destination…" />
        </div>
      </section>

      {trips.length === 0 ? (
        <section className="panel">
          <p className="empty">{busy ? 'Loading…' : 'No saved trips yet.'}</p>
          <button className="btn primary small" style={{ marginTop: 12 }} onClick={onPlanNew}>
            Plan a trip →
          </button>
        </section>
      ) : (
        <ul className="user-list">
          {trips.map((t) => (
            <li key={t.id}>
              <div className={selected?.id === t.id ? 'user-row active' : 'user-row'} onClick={() => open(t)}>
                <span className="avatar">#{t.id}</span>
                <span className="who">
                  <strong>
                    {title(t.destination)} · {range(t.start_date, t.end_date)}
                  </strong>
                  <span>
                    {t.place_count} places · {t.forecast_days} forecast days · {t.base_currency} · saved {fmt(t.created_at)}
                  </span>
                </span>
                <button
                  className="btn danger small"
                  disabled={busy}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete trip #${t.id}?`)) onDelete(t.id)
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <>
          <p className="callout">
            <strong>Trip #{selected.id}</strong> — a snapshot from {fmt(selected.created_at)} (
            <code>GET /trips/{selected.id}</code>). Weather and rates are as they were when it was saved.
          </p>
          <PlanResult
            request={selected}
            weather={selected.weather}
            places={selected.places}
            rates={selected.currency_rates}
          />
        </>
      )}
    </>
  )
}
