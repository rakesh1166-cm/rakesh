import { useEffect, useRef, useState } from 'react'
import { analyseBatch, analyseOne } from '../api.js'
import AnalysisCard from './AnalysisCard.jsx'

const ACCEPT = ['image/jpeg', 'image/png']

export default function AnalyseView() {
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  // Object URLs for thumbnails; revoked when the selection changes
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  function pick(list) {
    const chosen = Array.from(list || [])
    const bad = chosen.filter((f) => !ACCEPT.includes(f.type))
    setError(bad.length ? `Only JPEG or PNG allowed — skipped: ${bad.map((f) => f.name).join(', ')}` : '')
    setFiles(chosen.filter((f) => ACCEPT.includes(f.type)))
  }

  async function submit() {
    if (!files.length) return
    setBusy(true)
    setError('')
    try {
      const out = files.length === 1 ? [await analyseOne(files[0])] : await analyseBatch(files)
      setResults(out)
      setFiles([])
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h1>Analyse plant photos</h1>
      <p className="muted">Upload one or more JPEG/PNG photos of a leaf or plant. Each is diagnosed by the vision model and saved to PostgreSQL.</p>

      <div
        className={`dropzone ${dragging ? 'drag' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files) }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(',')}
          multiple
          hidden
          onChange={(e) => { pick(e.target.files); e.target.value = '' }}
        />
        <strong>Drop images here</strong> or click to choose
      </div>

      {files.length > 0 && (
        <div className="previews">
          {files.map((f, i) => (
            <figure key={f.name + i}>
              <img src={previews[i]} alt={f.name} />
              <figcaption>{f.name}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="actions">
        <button className="btn primary" disabled={!files.length || busy} onClick={submit}>
          {busy ? 'Analysing…' : `Analyse ${files.length || ''} image${files.length === 1 ? '' : 's'}`}
        </button>
        {files.length > 0 && !busy && (
          <button className="btn" onClick={() => setFiles([])}>Clear</button>
        )}
      </div>

      {busy && <div className="notice">The vision model can take 10–30 seconds per image.</div>}
      {error && <div className="error">{error}</div>}

      {results.length > 0 && (
        <>
          <h2>Results</h2>
          {results.map((r) => <AnalysisCard key={r.id} analysis={r} />)}
        </>
      )}
    </div>
  )
}
