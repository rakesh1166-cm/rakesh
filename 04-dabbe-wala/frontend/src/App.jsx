import { useCallback, useEffect, useState } from 'react'
import {
  API_BASE,
  createOrder,
  dailyStats,
  deleteOrder,
  getOrder,
  listOrders,
  onRequest,
  updateOrder,
} from './api.js'
import Sidebar from './components/Sidebar.jsx'
import CreateForm from './components/CreateForm.jsx'
import OrdersView from './components/OrdersView.jsx'
import FindOne from './components/FindOne.jsx'
import StatsView from './components/StatsView.jsx'
import RequestLog from './components/RequestLog.jsx'

// One entry per menu item: what the screen is called and what it is for.
const VIEWS = {
  stats: { title: 'Daily summary', blurb: 'How many tiffins are at each stage on a given day.' },
  create: { title: 'New order', blurb: 'Book a tiffin delivery. It starts as “preparing”.' },
  orders: {
    title: 'Orders',
    blurb: 'Filter by status or date, move tiffins along the route, edit or delete.',
  },
  find: { title: 'Find by ID', blurb: 'Read a single order by its primary key.' },
  log: { title: 'Request log', blurb: 'Exactly what went over the wire, newest first.' },
}

export default function App() {
  const [view, setView] = useState('orders')
  const [orders, setOrders] = useState([])
  const [query, setQuery] = useState({ status: '', created_date: '', skip: 0, limit: 10 })
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
      setOrders(await listOrders(q))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    refresh(query)
  }, [query, refresh])

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

  const handleCreate = (form) =>
    run(() => createOrder(form), 'Order created — it is now in Orders as “preparing”')

  const handleUpdate = (id, patch) => run(() => updateOrder(id, patch), `Order #${id} updated`)

  const handleDelete = (id) => run(() => deleteOrder(id), `Order #${id} deleted`)

  // These report their own results inline, so they return the value instead of a flag.
  const handleLookup = async (id) => {
    setError(null)
    try {
      return await getOrder(id)
    } catch {
      return null
    }
  }

  const handleStats = async (day) => {
    setError(null)
    try {
      return await dailyStats(day)
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
                {`.venv\\Scripts\\uvicorn main:app --reload --port ${new URL(API_BASE).port || 80}`}
              </code>
            )}
          </div>
        )}
        {flash && <div className="banner ok">✓ {flash}</div>}

        <div className="view">
          {view === 'stats' && <StatsView onCompute={handleStats} />}

          {view === 'create' && <CreateForm onCreated={handleCreate} busy={busy} />}

          {view === 'orders' && (
            <OrdersView
              orders={orders}
              query={query}
              setQuery={setQuery}
              onRefresh={refresh}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              busy={busy}
            />
          )}

          {view === 'find' && (
            <FindOne onLookup={handleLookup} onUpdate={handleUpdate} onDelete={handleDelete} busy={busy} />
          )}

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
