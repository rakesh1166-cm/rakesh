import { useCallback, useEffect, useState } from 'react'
import {
  API_BASE,
  averageRating,
  createReview,
  deleteReview,
  getReview,
  listReviews,
  onRequest,
  updateReview,
} from './api.js'
import Sidebar from './components/Sidebar.jsx'
import CreateForm from './components/CreateForm.jsx'
import BrowseView from './components/BrowseView.jsx'
import FindOne from './components/FindOne.jsx'
import AverageView from './components/AverageView.jsx'
import RequestLog from './components/RequestLog.jsx'
import CheatSheet from './components/CheatSheet.jsx'

// One entry per menu item: what the screen is called and what it is for.
const VIEWS = {
  create: {
    title: 'Create a review',
    blurb: 'Fill the form, watch the JSON body build itself, then POST it.',
  },
  browse: {
    title: 'Browse reviews',
    blurb: 'Read the collection, with an exact-match filter and offset/limit paging.',
  },
  find: { title: 'Find by ID', blurb: 'Read a single row by its primary key.' },
  average: { title: 'Average rating', blurb: 'An aggregate query the database answers for you.' },
  modify: {
    title: 'Edit & delete',
    blurb: 'Change a row with PATCH, or remove it with DELETE.',
  },
  log: { title: 'Request log', blurb: 'Exactly what went over the wire, newest first.' },
  cheatsheet: { title: 'Cheat sheet', blurb: 'The five operations, and the traps around them.' },
}

export default function App() {
  const [view, setView] = useState('browse')
  const [reviews, setReviews] = useState([])
  const [query, setQuery] = useState({ play_name: '', skip: 0, limit: 10 })
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

  // READ (list)
  const refresh = useCallback(async (q) => {
    setBusy(true)
    setError(null)
    try {
      setReviews(await listReviews(q))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    refresh(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.skip, query.limit])

  // Every write follows the same shape: call, re-read the list, report.
  const run = async (fn, successMsg) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await refresh(query)
      say(successMsg)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  const handleCreate = async (form) => {
    const ok = await run(
      () => createReview({ ...form, rating: Number(form.rating) }),
      'Created — the new row is in Browse reviews'
    )
    return ok
  }

  const handleUpdate = (id, patch) => run(() => updateReview(id, patch), `Review #${id} patched`)

  const handleDelete = (id) => run(() => deleteReview(id), `Review #${id} deleted`)

  // These two report their own results inline, so they return the value instead of a flag.
  const handleLookup = async (id) => {
    setError(null)
    try {
      return await getReview(id)
    } catch {
      return null
    }
  }

  const handleAverage = async (playName) => {
    setError(null)
    try {
      return await averageRating(playName)
    } catch (err) {
      setError(err.message)
      return null
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
                {`.venv\\Scripts\\uvicorn main:app --reload --port ${
                  new URL(API_BASE).port || 80
                }`}
              </code>
            )}
          </div>
        )}
        {flash && <div className="banner ok">✓ {flash}</div>}

        <div className="view">
          {view === 'create' && <CreateForm onCreated={handleCreate} busy={busy} />}

          {(view === 'browse' || view === 'modify') && (
            <BrowseView
              reviews={reviews}
              query={query}
              setQuery={setQuery}
              onRefresh={refresh}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              busy={busy}
              highlightWrite={view === 'modify'}
            />
          )}

          {view === 'find' && <FindOne onLookup={handleLookup} />}

          {view === 'average' && <AverageView onCompute={handleAverage} />}

          {view === 'log' && <RequestLog entries={log} onClear={() => setLog([])} />}

          {view === 'cheatsheet' && <CheatSheet />}
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
