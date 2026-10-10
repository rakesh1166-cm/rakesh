import { useEffect, useState } from 'react'
import { deleteAnalysis, listAnalyses } from '../api.js'
import AnalysisCard from './AnalysisCard.jsx'

const SEVERITIES = ['', 'healthy', 'mild', 'moderate', 'severe', 'critical']

export default function HistoryView() {
  const [items, setItems] = useState([])
  const [severity, setSeverity] = useState('')
  const [crop, setCrop] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      setItems(await listAnalyses({ severity, crop }))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [severity])

  async function remove(a) {
    if (!confirm(`Delete analysis #${a.id} (${a.filename})?`)) return
    try {
      await deleteAnalysis(a.id)
      setItems((list) => list.filter((x) => x.id !== a.id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1>History</h1>

      <form className="filters" onSubmit={(e) => { e.preventDefault(); load() }}>
        <label>
          Severity
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
          </select>
        </label>
        <label>
          Crop
          <input value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="e.g. tomato" />
        </label>
        <button className="btn" type="submit">Search</button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">No analyses yet. Upload a photo from the Analyse tab.</p>
      ) : (
        items.map((a) => <AnalysisCard key={a.id} analysis={a} onDelete={remove} />)
      )}
    </div>
  )
}
