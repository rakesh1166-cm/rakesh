import { useState } from 'react'
import { addDays, isoDate } from '../format.js'

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY']

/**
 * The TravelRequestModel body (models/schemas.py), shared by Plan a trip and Live stream.
 * The server's rules are echoed here: end after start, 1 to 14 days.
 */
export default function TripForm({ destinations, onSubmit, busy, children, submitLabel }) {
  const [form, setForm] = useState({
    destination: destinations[0]?.name ?? 'goa',
    start_date: isoDate(addDays(new Date(), 1)),
    end_date: isoDate(addDays(new Date(), 3)),
    base_currency: 'INR',
  })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const payload = { ...form, destination: form.destination.trim() }
  const days = Math.round((new Date(form.end_date) - new Date(form.start_date)) / 86400000)
  const problem = !payload.destination
    ? 'Pick a destination'
    : !(days >= 1)
      ? 'End date must be at least one day after the start date'
      : days > 14
        ? 'A trip can be at most 14 days long'
        : null

  const submit = (e) => {
    e.preventDefault()
    onSubmit(payload)
  }

  return (
    <form onSubmit={submit} className="form">
      <div className="trip-grid">
        <label>
          Destination
          <input list="destination-names" value={form.destination} onChange={set('destination')} />
          <datalist id="destination-names">
            {destinations.map((d) => (
              <option key={d.id} value={d.name}>
                {d.state}
              </option>
            ))}
          </datalist>
        </label>
        <label>
          Start date
          <input type="date" value={form.start_date} onChange={set('start_date')} />
        </label>
        <label>
          End date
          <input type="date" value={form.end_date} onChange={set('end_date')} />
        </label>
        <label>
          Base currency
          <select value={form.base_currency} onChange={set('base_currency')}>
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="hint">
        {problem ? (
          <span className="warn-text">{problem}</span>
        ) : (
          <>
            {days} day trip. Places come from <code>yatra_db</code> for known destinations; any city works for
            weather, which only reaches a few days ahead.
          </>
        )}
      </p>

      <details className="preview">
        <summary>Request body that will be sent</summary>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </details>

      <div className="row-actions">
        <button className="btn primary" disabled={!!problem || busy}>
          {busy ? 'Working…' : submitLabel}
        </button>
        {children?.(payload, !!problem)}
      </div>
    </form>
  )
}
