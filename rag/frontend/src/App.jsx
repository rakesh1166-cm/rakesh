import { useCallback, useEffect, useState } from 'react'
import {
  API_BASE,
  ask,
  deleteDocument,
  documentChunks,
  history,
  listDocuments,
  onRequest,
  summary,
  uploadDocument,
} from './api.js'
import Sidebar from './components/Sidebar.jsx'
import StatsView from './components/StatsView.jsx'
import AskView from './components/AskView.jsx'
import DocumentsView from './components/DocumentsView.jsx'
import HistoryView from './components/HistoryView.jsx'
import RequestLog from './components/RequestLog.jsx'

// One entry per menu item: what the screen is called and what it is for.
const VIEWS = {
  stats: { title: 'Knowledge base', blurb: 'How many documents, chunks and questions are stored in Postgres.' },
  ask: { title: 'Ask a question', blurb: 'Retrieve the most similar chunks, then let the LLM answer from them.' },
  docs: { title: 'Documents', blurb: 'Upload PDFs to index, inspect their chunks, or delete them.' },
  history: { title: 'History', blurb: 'Every question and answer, with the sources used.' },
  log: { title: 'Request log', blurb: 'Exactly what went over the wire, newest first.' },
}

export default function App() {
  const [view, setView] = useState('ask')
  const [documents, setDocuments] = useState([])
  const [answers, setAnswers] = useState([])
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

  const refreshDocuments = useCallback(async () => {
    try {
      setDocuments(await listDocuments())
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refreshDocuments()
  }, [refreshDocuments])

  // Every write follows the same shape: call, re-read, report.
  const run = async (fn, successMsg) => {
    setBusy(true)
    setError(null)
    try {
      const result = await fn()
      await refreshDocuments()
      if (successMsg) say(typeof successMsg === 'function' ? successMsg(result) : successMsg)
      return result ?? true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setBusy(false)
    }
  }

  const handleAsk = (payload) =>
    run(async () => {
      const result = await ask(payload)
      setAnswers((prev) => [result, ...prev])
      return result
    })

  const handleUpload = (file) =>
    run(() => uploadDocument(file), (doc) => `“${doc.filename}” indexed — ${doc.chunk_count} chunks`)

  const handleDelete = (id) => run(() => deleteDocument(id), `Document #${id} deleted`)

  // These report their own results inline, so they return the value instead of a flag.
  const load = (fn) => async (...args) => {
    setError(null)
    try {
      return await fn(...args)
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
          {view === 'stats' && <StatsView onLoad={load(summary)} />}

          {view === 'ask' && (
            <AskView
              documents={documents}
              onAsk={handleAsk}
              busy={busy}
              answers={answers}
              onNeedDocs={() => setView('docs')}
            />
          )}

          {view === 'docs' && (
            <DocumentsView
              documents={documents}
              onUpload={handleUpload}
              onDelete={handleDelete}
              onChunks={async (id) => (await load(documentChunks)(id)) ?? []}
              busy={busy}
            />
          )}

          {view === 'history' && <HistoryView onLoad={async () => (await load(history)()) ?? []} />}

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
