import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  API_BASE,
  createBook,
  createUser,
  deleteBook,
  getBook,
  listBooks,
  listUsers,
  markSold,
  onRequest,
  summary,
  updateBook,
} from './api.js'
import Sidebar from './components/Sidebar.jsx'
import StatsView from './components/StatsView.jsx'
import SellForm from './components/SellForm.jsx'
import UsersView from './components/UsersView.jsx'
import BooksView from './components/BooksView.jsx'
import FindBook from './components/FindBook.jsx'
import RequestLog from './components/RequestLog.jsx'

// One entry per menu item: what the screen is called and what it is for.
const VIEWS = {
  stats: { title: 'Marketplace', blurb: 'How many students, and how many books are on the shelf vs sold.' },
  sell: { title: 'Sell a book', blurb: 'List a used book under a registered student.' },
  users: { title: 'Students', blurb: 'Register sellers and see what each one has listed.' },
  books: { title: 'Browse books', blurb: 'Search by title or author, mark sold, edit price, or delete.' },
  find: { title: 'Find by ID', blurb: 'Read a single book by its primary key — sold ones too.' },
  log: { title: 'Request log', blurb: 'Exactly what went over the wire, newest first.' },
}

export default function App() {
  const [view, setView] = useState('books')
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState({ title: '', author: '', include_sold: false, skip: 0, limit: 10 })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [flash, setFlash] = useState(null)
  const [log, setLog] = useState([])

  // Keep the log in App so it survives moving between screens.
  useEffect(() => onRequest((entry) => setLog((prev) => [entry, ...prev].slice(0, 50))), [])

  // status 0 is our marker for "fetch never reached the server".
  const online = log.length === 0 ? null : log[0].status !== 0

  const owners = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users])

  const say = (msg) => {
    setFlash(msg)
    setTimeout(() => setFlash(null), 2500)
  }

  const refreshUsers = useCallback(async () => {
    try {
      setUsers(await listUsers())
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const refreshBooks = useCallback(async (q) => {
    setBusy(true)
    setError(null)
    try {
      setBooks(await listBooks(q))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    refreshUsers()
  }, [refreshUsers])

  useEffect(() => {
    refreshBooks(query)
  }, [query, refreshBooks])

  // Every write follows the same shape: call, re-read, report.
  const run = async (fn, successMsg) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
      await Promise.all([refreshBooks(query), refreshUsers()])
      say(successMsg)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  const actions = {
    onUpdate: (id, patch) => run(() => updateBook(id, patch), `Book #${id} updated`),
    onSold: (id) => run(() => markSold(id), `Book #${id} marked as sold`),
    onDelete: (id) => run(() => deleteBook(id), `Book #${id} deleted`),
  }

  const handleSell = (payload) =>
    run(() => createBook(payload), `“${payload.title}” is listed — find it in Browse books`)

  const handleRegister = (payload) => run(() => createUser(payload), `${payload.name} registered`)

  // These report their own results inline, so they return the value instead of a flag.
  const handleLookup = async (id) => {
    setError(null)
    try {
      return await getBook(id)
    } catch {
      return null
    }
  }

  const handleStats = async () => {
    setError(null)
    try {
      return await summary()
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
          {view === 'stats' && <StatsView onLoad={handleStats} />}

          {view === 'sell' && (
            <SellForm users={users} onCreated={handleSell} onNeedUser={() => setView('users')} busy={busy} />
          )}

          {view === 'users' && <UsersView users={users} onCreated={handleRegister} busy={busy} />}

          {view === 'books' && (
            <BooksView
              books={books}
              owners={owners}
              query={query}
              setQuery={setQuery}
              onRefresh={refreshBooks}
              actions={actions}
              busy={busy}
            />
          )}

          {view === 'find' && <FindBook owners={owners} onLookup={handleLookup} actions={actions} busy={busy} />}

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
