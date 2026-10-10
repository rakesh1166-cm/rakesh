import { useCallback, useEffect, useState } from 'react'
import {
  API_BASE,
  addPlace,
  buildPlan,
  cacheStats,
  clearCache,
  createDestination,
  deleteDestination,
  deletePlace,
  deleteTrip,
  listDestinations,
  listTrips,
  onRequest,
  saveTrip,
  summary,
} from './api.js'
import { title } from './format.js'
import Sidebar from './components/Sidebar.jsx'
import StatsView from './components/StatsView.jsx'
import PlanView from './components/PlanView.jsx'
import StreamView from './components/StreamView.jsx'
import TripsView from './components/TripsView.jsx'
import DestinationsView from './components/DestinationsView.jsx'
import RequestLog from './components/RequestLog.jsx'

// One entry per menu item: what the screen is called and what it is for.
const VIEWS = {
  stats: { title: 'Dashboard', blurb: 'What is stored in yatra_db, and what the cache is holding.' },
  plan: { title: 'Plan a trip', blurb: 'Weather, places and exchange rates for a destination, in one call.' },
  stream: { title: 'Live stream', blurb: 'The same plan over Server-Sent Events — watch each part arrive.' },
  trips: { title: 'Saved trips', blurb: 'Plans stored in Postgres. Open one to see its snapshot, or delete it.' },
  destinations: { title: 'Destinations', blurb: 'The places behind every plan. Add a city or a sight to see.' },
  log: { title: 'Request log', blurb: 'Exactly what went over the wire, newest first.' },
}

export default function App() {
  const [view, setView] = useState('plan')
  const [destinations, setDestinations] = useState([])
  const [trips, setTrips] = useState([])
  const [tripFilter, setTripFilter] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [flash, setFlash] = useState(null)
  const [log, setLog] = useState([])

  // Keep the log in App so it survives moving between screens.
  useEffect(() => onRequest((entry) => setLog((prev) => [entry, ...prev].slice(0, 50))), [])

  // status 0 is our marker for "fetch never reached the server".
  const online = log.length === 0 ? null : log[0].status !== 0

  const say = (msg) => {
    setFlash(msg)
    setTimeout(() => setFlash(null), 2500)
  }

  const refreshDestinations = useCallback(async () => {
    try {
      setDestinations(await listDestinations())
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const refreshTrips = useCallback(async (destination) => {
    try {
      setTrips(await listTrips({ destination }))
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refreshDestinations()
  }, [refreshDestinations])

  useEffect(() => {
    refreshTrips(tripFilter)
  }, [tripFilter, refreshTrips])

  // Every write follows the same shape: call, re-read, report.
  const run = async (fn, successMsg) => {
    setBusy(true)
    setError(null)
    try {
      const result = await fn()
      await Promise.all([refreshDestinations(), refreshTrips(tripFilter)])
      say(typeof successMsg === 'function' ? successMsg(result) : successMsg)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  const actions = {
    onCreateDestination: (p) => run(() => createDestination(p), `${title(p.name)} added`),
    onDeleteDestination: (id) => run(() => deleteDestination(id), `Destination #${id} deleted`),
    onAddPlace: (id, p) => run(() => addPlace(id, p), `${p.name} added`),
    onDeletePlace: (id, placeId) => run(() => deletePlace(id, placeId), `Place #${placeId} deleted`),
  }

  const handleSave = (payload) =>
    run(() => saveTrip(payload), (trip) => `Trip #${trip.id} to ${title(trip.destination)} saved — see Saved trips`)

  const handleDeleteTrip = (id) => run(() => deleteTrip(id), `Trip #${id} deleted`)

  // These show their results inline, so they return the value instead of a flag.
  const load = (fn) => async (...args) => {
    setBusy(true)
    setError(null)
    try {
      return await fn(...args)
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setBusy(false)
    }
  }

  const screen = VIEWS[view]

  return (
    <div className="shell">
      <Sidebar view={view} onNavigate={setView} logCount={log.length} online={online} />

      <main className="main">
        <header className="page-head">
          <h1>{screen.title}</h1>
          <p>{screen.blurb}</p>
        </header>

        {error && (
          <div className="banner error">
            <span>⚠ {error}</span>
            {online === false && (
              <code>
                {`.venv\\Scripts\\uvicorn main:app --reload --port ${new URL(API_BASE).port || 80}`}
              </code>
            )}
          </div>
        )}
        {flash && <div className="banner ok">✓ {flash}</div>}

        <div className="view">
          {view === 'stats' && (
            <StatsView
              onLoad={load(summary)}
              onLoadCache={load(cacheStats)}
              onClearCache={() => run(clearCache, 'Cache cleared')}
              busy={busy}
            />
          )}

          {view === 'plan' && (
            <PlanView destinations={destinations} onPlan={load(buildPlan)} onSave={handleSave} busy={busy} />
          )}

          {view === 'stream' && <StreamView destinations={destinations} onError={setError} />}

          {view === 'trips' && (
            <TripsView
              trips={trips}
              filter={tripFilter}
              setFilter={setTripFilter}
              onDelete={handleDeleteTrip}
              onPlanNew={() => setView('plan')}
              busy={busy}
            />
          )}

          {view === 'destinations' && <DestinationsView destinations={destinations} actions={actions} busy={busy} />}

          {view === 'log' && <RequestLog entries={log} onClear={() => setLog([])} />}
        </div>
      </main>

      {/* Last call, always visible — the log is a click away without leaving the screen. */}
      {log.length > 0 && view !== 'log' && (
        <button className="last-call" onClick={() => setView('log')}>
          <span className="hint">last call</span>
          <span className={`verb ${log[0].method.toLowerCase()}`}>{log[0].method}</span>
          <span className="path">{log[0].url.replace(/^https?:\/\/[^/]+/, '')}</span>
          <span className={log[0].ok ? 'status ok' : 'status err'}>{log[0].status || 'ERR'}</span>
          <span className="ms">{log[0].ms}ms</span>
          <span className="open">open log →</span>
        </button>
      )}
    </div>
  )
}
