import { useCallback, useEffect, useState } from 'react'
import {
  API_BASE,
  analyseContract,
  contractAnalyses,
  deleteContract,
  getContract,
  listAnalyses,
  listContracts,
  onRequest,
  summary,
  uploadContract,
} from './api.js'
import Sidebar from './components/Sidebar.jsx'
import StatsView from './components/StatsView.jsx'
import UploadForm from './components/UploadForm.jsx'
import ContractsView from './components/ContractsView.jsx'
import AnalysesView from './components/AnalysesView.jsx'
import RequestLog from './components/RequestLog.jsx'

// One entry per menu item: what the screen is called and what it is for.
const VIEWS = {
  stats: { title: 'Dashboard', blurb: 'How many contracts are uploaded, analysed, and how risky they look.' },
  upload: { title: 'Upload contract', blurb: 'Send a PDF or TXT contract; the server extracts its text.' },
  contracts: { title: 'Contracts', blurb: 'Pick a contract to read its text, run the AI analysis, or delete it.' },
  analyses: { title: 'All analyses', blurb: 'Every Gemini analysis stored in Postgres, newest first.' },
  log: { title: 'Request log', blurb: 'Exactly what went over the wire, newest first.' },
}

export default function App() {
  const [view, setView] = useState('contracts')
  const [contracts, setContracts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
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
    setTimeout(() => setFlash(null), 3000)
  }

  const refreshContracts = useCallback(async () => {
    try {
      setContracts(await listContracts())
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    refreshContracts()
  }, [refreshContracts])

  // Every write follows the same shape: call, re-read, report.
  const run = async (fn, successMsg) => {
    setBusy(true)
    setError(null)
    try {
      const result = await fn()
      await refreshContracts()
      say(typeof successMsg === 'function' ? successMsg(result) : successMsg)
      return result ?? true
    } catch (err) {
      setError(err.message)
      await refreshContracts()
      return false
    } finally {
      setBusy(false)
    }
  }

  const handleUpload = async (file) => {
    const created = await run(() => uploadContract(file), (c) => `“${c.original_name}” uploaded as contract #${c.id}`)
    if (created) {
      setSelectedId(created.id)
      setView('contracts')
    }
    return Boolean(created)
  }

  const actions = {
    onAnalyse: (id) => run(() => analyseContract(id), (a) => `Contract #${id} analysed — overall ${a.overall_risk_level} risk`),
    onDelete: async (id) => {
      const ok = await run(() => deleteContract(id), `Contract #${id} deleted`)
      if (ok) setSelectedId(null)
    },
  }

  // Detail = the contract (with text) plus its analyses, read together.
  const loadDetail = useCallback(async (id) => {
    try {
      const [contract, analyses] = await Promise.all([getContract(id), contractAnalyses(id)])
      return { contract, analyses }
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [])

  const handleStats = async () => {
    setError(null)
    try {
      return await summary()
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  const handleAnalyses = useCallback(async () => {
    setError(null)
    try {
      return await listAnalyses()
    } catch (err) {
      setError(err.message)
      return []
    }
  }, [])

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
              <code>{`.venv\\Scripts\\uvicorn main:app --reload --port ${new URL(API_BASE).port || 80}`}</code>
            )}
          </div>
        )}
        {flash && <div className="banner ok">✓ {flash}</div>}

        <div className="view">
          {view === 'stats' && <StatsView onLoad={handleStats} />}

          {view === 'upload' && <UploadForm onUpload={handleUpload} busy={busy} />}

          {view === 'contracts' && (
            <ContractsView
              contracts={contracts}
              selectedId={selectedId}
              onSelect={setSelectedId}
              loadDetail={loadDetail}
              actions={actions}
              busy={busy}
              onNeedUpload={() => setView('upload')}
            />
          )}

          {view === 'analyses' && <AnalysesView onLoad={handleAnalyses} contracts={contracts} />}

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
