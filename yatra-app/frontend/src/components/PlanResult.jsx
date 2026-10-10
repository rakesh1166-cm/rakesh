import { useState } from 'react'
import { dayName, eachDay, rupees } from '../format.js'

const WATCH = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY']

const icon = (condition = '') => {
  const c = condition.toLowerCase()
  if (c.includes('thunder')) return '⛈️'
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧️'
  if (c.includes('snow') || c.includes('sleet') || c.includes('ice')) return '❄️'
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return '🌫️'
  if (c.includes('cloud') || c.includes('overcast')) return '☁️'
  if (c.includes('partly')) return '⛅'
  return '☀️'
}

/**
 * Renders the three parts of a plan. Used by Plan a trip, Live stream and Saved trips,
 * so `weather`, `places` and `rates` may each be missing while a stream is still running.
 */
export default function PlanResult({ request, weather, places, rates }) {
  const [showAll, setShowAll] = useState(false)
  const byDate = Object.fromEntries((weather ?? []).map((w) => [w.date, w]))
  const days = request ? eachDay(request.start_date, request.end_date) : []

  const base = request?.base_currency ?? 'INR'
  const allCodes = rates ? Object.keys(rates).filter((c) => c !== base) : []
  const codes = showAll ? allCodes : WATCH.filter((c) => c !== base && rates?.[c] !== undefined)

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>☁ Weather</h2>
          <span className="hint">{weather ? `${weather.length} of ${days.length} days forecast` : 'waiting…'}</span>
        </header>
        {weather && (
          <div className="weather-row">
            {days.map((d) => {
              const w = byDate[d]
              return w ? (
                <div className="day" key={d}>
                  <span className="day-name">{dayName(d)}</span>
                  <span className="day-icon">{icon(w.condition)}</span>
                  <strong>
                    {Math.round(w.temperature_high)}° <em>{Math.round(w.temperature_low)}°</em>
                  </strong>
                  <span className="day-cond">{w.condition}</span>
                  <span className="day-meta">
                    💧 {w.rain_chance}% · {w.humidity}% RH
                  </span>
                </div>
              ) : (
                <div className="day empty-day" key={d}>
                  <span className="day-name">{dayName(d)}</span>
                  <span className="day-cond">No forecast yet — too far ahead</span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <header className="panel-head">
          <h2>📍 Places to visit</h2>
          {places && (
            <span className="hint">
              {places.length} places · {places.reduce((h, p) => h + p.estimated_time_hours, 0)} hours in total
            </span>
          )}
        </header>
        {!places ? (
          <p className="empty">waiting…</p>
        ) : places.length === 0 ? (
          <p className="empty">
            No places stored for “{request?.destination}”. Add some under <strong>Destinations</strong>.
          </p>
        ) : (
          <ul className="user-list">
            {places.map((p) => (
              <li key={p.id ?? p.name} className="user-row static">
                <span className="avatar">{p.rating.toFixed(1)}</span>
                <span className="who">
                  <strong>{p.name}</strong>
                  <span>{p.description}</span>
                </span>
                <span className="tag">{p.category}</span>
                <span className="place-meta">
                  {p.estimated_time_hours}h
                  <br />
                  {p.entry_fee ? rupees(p.entry_fee) : 'free'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <header className="panel-head">
          <h2>💱 Currency</h2>
          {rates && (
            <button className="btn ghost small" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show common' : `Show all ${allCodes.length}`}
            </button>
          )}
        </header>
        {!rates ? (
          <p className="empty">waiting…</p>
        ) : (
          <div className="rate-grid">
            {codes.map((c) => (
              <div className="rate" key={c}>
                <span>
                  1 {base} → {c}
                </span>
                <strong>{rates[c] < 1 ? rates[c].toFixed(4) : rates[c].toFixed(2)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
