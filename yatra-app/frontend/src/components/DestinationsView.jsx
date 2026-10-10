import { useEffect, useState } from 'react'
import { getDestination } from '../api.js'
import { rupees, title } from '../format.js'

const EMPTY_DEST = { name: '', state: '', weather_query: '' }
const EMPTY_PLACE = { name: '', description: '', category: 'Nature', rating: '4.5', estimated_time_hours: '2', entry_fee: '' }
const CATEGORIES = ['Nature', 'Beach', 'Historical Site', 'Religious Site', 'Museum', 'Market', 'Food']

/**
 * Destinations and their places — the Postgres data behind "places_data" in every plan.
 * POST /destinations/, DELETE /destinations/{id}, POST and DELETE /destinations/{id}/places
 */
export default function DestinationsView({ destinations, actions, busy }) {
  const [dest, setDest] = useState(EMPTY_DEST)
  const [place, setPlace] = useState(EMPTY_PLACE)
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)

  const setD = (k) => (e) => setDest({ ...dest, [k]: e.target.value })
  const setP = (k) => (e) => setPlace({ ...place, [k]: e.target.value })

  // Re-read the open destination whenever the list changes (after any write)
  useEffect(() => {
    if (!selectedId) return setDetail(null)
    if (!destinations.some((d) => d.id === selectedId)) return setSelectedId(null)
    getDestination(selectedId).then(setDetail, () => setDetail(null))
  }, [selectedId, destinations])

  const destPayload = {
    name: dest.name.trim(),
    state: dest.state.trim(),
    ...(dest.weather_query.trim() && { weather_query: dest.weather_query.trim() }),
  }

  const placePayload = {
    name: place.name.trim(),
    description: place.description.trim(),
    category: place.category,
    rating: Number(place.rating),
    estimated_time_hours: Number(place.estimated_time_hours),
    entry_fee: place.entry_fee === '' ? null : Number(place.entry_fee),
  }
  const placeValid =
    placePayload.name && placePayload.description && placePayload.rating >= 0 && placePayload.rating <= 5 &&
    placePayload.estimated_time_hours > 0

  const submitDest = async (e) => {
    e.preventDefault()
    if (await actions.onCreateDestination(destPayload)) setDest(EMPTY_DEST)
  }

  const submitPlace = async (e) => {
    e.preventDefault()
    if (await actions.onAddPlace(selectedId, placePayload)) setPlace(EMPTY_PLACE)
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>All destinations ({destinations.length})</h2>
          <code className="endpoint get">GET /destinations/</code>
        </header>
        <ul className="user-list">
          {destinations.map((d) => (
            <li key={d.id}>
              <button
                className={selectedId === d.id ? 'user-row active' : 'user-row'}
                onClick={() => setSelectedId(selectedId === d.id ? null : d.id)}
              >
                <span className="avatar">{d.name[0].toUpperCase()}</span>
                <span className="who">
                  <strong>
                    #{d.id} · {title(d.name)}
                  </strong>
                  <span>
                    {d.state} · {d.place_count} places · weather for “{d.weather_query}”
                  </span>
                </span>
                <span className="hint">{selectedId === d.id ? 'hide' : 'places →'}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {detail && (
        <section className="panel">
          <header className="panel-head">
            <h2>{title(detail.name)} — places</h2>
            <span className="endpoints">
              <code className="endpoint get">GET /destinations/{detail.id}</code>
              <button
                className="btn danger small"
                disabled={busy}
                onClick={() =>
                  confirm(`Delete ${title(detail.name)} and all ${detail.place_count} of its places?`) &&
                  actions.onDeleteDestination(detail.id)
                }
              >
                Delete destination
              </button>
            </span>
          </header>

          {detail.places.length === 0 ? (
            <p className="empty">No places yet — add the first one below.</p>
          ) : (
            <ul className="user-list">
              {detail.places.map((p) => (
                <li key={p.id} className="user-row static">
                  <span className="avatar">{p.rating.toFixed(1)}</span>
                  <span className="who">
                    <strong>
                      #{p.id} · {p.name}
                    </strong>
                    <span>{p.description}</span>
                  </span>
                  <span className="tag">{p.category}</span>
                  <span className="place-meta">
                    {p.estimated_time_hours}h
                    <br />
                    {p.entry_fee ? rupees(p.entry_fee) : 'free'}
                  </span>
                  <button className="btn danger small" disabled={busy} onClick={() => actions.onDeletePlace(detail.id, p.id)}>
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={submitPlace} className="form sub-form">
            <h3>
              Add a place <code className="endpoint post">POST /destinations/{detail.id}/places</code>
            </h3>
            <div className="edit-grid">
              <label>
                Name
                <input value={place.name} onChange={setP('name')} placeholder="Calangute Beach" />
              </label>
              <label>
                Category
                <select value={place.category} onChange={setP('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Rating (0–5)
                <input type="number" step="0.1" min="0" max="5" value={place.rating} onChange={setP('rating')} />
              </label>
            </div>
            <label>
              Description
              <input value={place.description} onChange={setP('description')} placeholder="What makes it worth a visit" />
            </label>
            <div className="edit-grid two">
              <label>
                Hours to spend
                <input type="number" step="0.5" min="0.5" value={place.estimated_time_hours} onChange={setP('estimated_time_hours')} />
              </label>
              <label>
                Entry fee (₹, blank = free)
                <input type="number" min="0" value={place.entry_fee} onChange={setP('entry_fee')} />
              </label>
            </div>
            <button className="btn primary" disabled={!placeValid || busy}>
              Add place
            </button>
          </form>
        </section>
      )}

      <section className="panel">
        <header className="panel-head">
          <h2>Add a destination</h2>
          <code className="endpoint post">POST /destinations/</code>
        </header>
        <form onSubmit={submitDest} className="form">
          <div className="edit-grid two">
            <label>
              Name
              <input value={dest.name} onChange={setD('name')} placeholder="Udaipur" />
            </label>
            <label>
              State
              <input value={dest.state} onChange={setD('state')} placeholder="Rajasthan" />
            </label>
          </div>
          <label>
            Weather query <span className="hint">optional — defaults to “name, state, India”</span>
            <input value={dest.weather_query} onChange={setD('weather_query')} placeholder="Udaipur, Rajasthan, India" />
          </label>
          <p className="hint">
            Names are stored lower-case and must be unique. A precise weather query matters: WeatherAPI reads a bare
            “goa” as Genoa, Italy.
          </p>
          <button className="btn primary" disabled={!destPayload.name || !destPayload.state || busy}>
            Add destination
          </button>
        </form>
      </section>
    </>
  )
}
