import { useState } from 'react'
import { streamPlan } from '../api.js'
import TripForm from './TripForm.jsx'
import PlanResult from './PlanResult.jsx'

/**
 * POST /stream/plan — the same plan, delivered as Server-Sent Events.
 * Each section of the result fills in as soon as its *_complete event arrives.
 */
export default function StreamView({ destinations, onError }) {
  const [running, setRunning] = useState(false)
  const [events, setEvents] = useState([])
  const [result, setResult] = useState(null)

  const start = async (payload) => {
    setRunning(true)
    setEvents([])
    setResult({ request: payload })
    onError(null)
    try {
      await streamPlan(payload, (e) => {
        setEvents((prev) => [...prev, e])
        if (e.event === 'weather_complete') setResult((r) => ({ ...r, weather: e.data.weather_data }))
        if (e.event === 'places_complete') setResult((r) => ({ ...r, places: e.data.places_data }))
        if (e.event === 'currency_complete') setResult((r) => ({ ...r, rates: e.data.currency_data }))
        if (e.event === 'error') onError(e.data.detail)
      })
    } catch (err) {
      onError(err.message)
      setResult(null)
    } finally {
      setRunning(false)
    }
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Stream a plan</h2>
          <code className="endpoint post">POST /stream/plan</code>
        </header>
        <TripForm destinations={destinations} onSubmit={start} busy={running} submitLabel="Start stream" />
      </section>

      {events.length > 0 && (
        <section className="panel">
          <header className="panel-head">
            <h2>Events</h2>
            <span className="hint">{running ? 'streaming…' : `${events.length} events`}</span>
          </header>
          <ol className="timeline">
            {events.map((e, i) => (
              <li key={i} className={e.event === 'error' ? 'err' : e.event.endsWith('complete') ? 'done' : ''}>
                <code>{e.event}</code>
                <span>{e.data?.message ?? e.data?.detail ?? Object.keys(e.data ?? {}).join(', ')}</span>
                <em>{e.ms}ms</em>
              </li>
            ))}
          </ol>
        </section>
      )}

      {result && <PlanResult request={result.request} weather={result.weather} places={result.places} rates={result.rates} />}
    </>
  )
}
