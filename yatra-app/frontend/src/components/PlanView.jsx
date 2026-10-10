import { useState } from 'react'
import TripForm from './TripForm.jsx'
import PlanResult from './PlanResult.jsx'

/**
 * POST /plan/ builds the plan without saving it (weather + currency are fetched concurrently).
 * POST /trips/ builds the same plan and stores a snapshot in Postgres.
 */
export default function PlanView({ destinations, onPlan, onSave, busy }) {
  const [result, setResult] = useState(null)

  const plan = async (payload) => {
    const data = await onPlan(payload)
    if (data) setResult({ request: payload, ...data })
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Where to?</h2>
          <span className="endpoints">
            <code className="endpoint post">POST /plan/</code>
            <code className="endpoint post">POST /trips/</code>
          </span>
        </header>
        <TripForm destinations={destinations} onSubmit={plan} busy={busy} submitLabel="Build plan">
          {(payload, invalid) => (
            <button type="button" className="btn" disabled={invalid || busy} onClick={() => onSave(payload)}>
              Save as trip
            </button>
          )}
        </TripForm>
      </section>

      {result && (
        <PlanResult
          request={result.request}
          weather={result.weather_data}
          places={result.places_data}
          rates={result.currency_rates}
        />
      )}
    </>
  )
}
