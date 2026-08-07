import { useBackendStatus } from '../hooks/useBackendStatus'
import { API_BASE_URL } from '../api/client'
import './Home.css'

const FEATURES = [
  {
    title: 'Plan a trip in plain English',
    body: 'Describe where you want to go and how long you have. The agent turns it into a day-by-day plan.',
  },
  {
    title: 'Structured, not prose',
    body: 'Every itinerary comes back as a validated object — days, stops, timings — so the UI never parses text.',
  },
  {
    title: 'Grounded in real tools',
    body: 'Weather, distances, and a curated landmark dataset feed the plan instead of guesswork.',
  },
]

function StatusPill({ state, database }) {
  if (state === 'loading') {
    return <span className="pill pill--pending">Checking backend…</span>
  }
  if (state === 'unreachable') {
    return <span className="pill pill--down">Backend offline</span>
  }
  if (database?.status === 'connected') {
    return <span className="pill pill--up">API + Postgres connected</span>
  }
  return <span className="pill pill--warn">API up · database unreachable</span>
}

export default function Home() {
  const { state, info, database, error, refresh } = useBackendStatus()

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">HolidayLandmarks</p>
        <h1>Your agentic trip assistant</h1>
        <p className="lede">
          Tell it a destination and a few days. It plans the route, checks the
          weather, and hands back an itinerary you can actually follow.
        </p>
        <StatusPill state={state} database={database} />
      </header>

      <section className="features">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="card">
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <section className="status">
        <div className="status__head">
          <h2>System status</h2>
          <button type="button" onClick={refresh} disabled={state === 'loading'}>
            {state === 'loading' ? 'Checking…' : 'Re-check'}
          </button>
        </div>

        <dl className="status__grid">
          <div>
            <dt>API endpoint</dt>
            <dd>{API_BASE_URL}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{info ? `${info.app} v${info.version}` : '—'}</dd>
          </div>
          <div>
            <dt>Environment</dt>
            <dd>{info?.environment ?? '—'}</dd>
          </div>
          <div>
            <dt>Database</dt>
            <dd>
              {database?.status === 'connected'
                ? `${database.database} (${database.dialect})`
                : database?.detail ?? '—'}
            </dd>
          </div>
          <div>
            <dt>Server</dt>
            <dd>{database?.server_version ?? '—'}</dd>
          </div>
        </dl>

        {state === 'unreachable' && (
          <p className="status__error">
            Could not reach the API ({error}). Start it with{' '}
            <code>uvicorn app.main:app --reload</code> from <code>backend/</code>.
          </p>
        )}
      </section>
    </div>
  )
}
