import { useEffect, useState } from 'react'
import { fmt, plural } from '../format.js'
import AnalysisCard from './AnalysisCard.jsx'

/**
 * GET /contracts/ on the left; pick one to see GET /contracts/{id} + its analyses,
 * run POST /analysis/analyse/{id}, or DELETE /contracts/{id}.
 */
export default function ContractsView({ contracts, selectedId, onSelect, loadDetail, actions, busy, onNeedUpload }) {
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    if (selectedId == null) {
      setDetail(null)
      return
    }
    loadDetail(selectedId).then(setDetail)
  }, [selectedId, contracts, loadDetail])

  if (contracts.length === 0) {
    return (
      <p className="empty panel">
        No contracts yet.{' '}
        <button className="btn small" onClick={onNeedUpload}>
          Upload one →
        </button>
      </p>
    )
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>{plural(contracts.length, 'contract')}</h2>
          <code className="endpoint get">GET /contracts/</code>
        </header>
        <ul className="user-list">
          {contracts.map((c) => (
            <li key={c.id}>
              <button
                className={c.id === selectedId ? 'user-row active' : 'user-row'}
                onClick={() => onSelect(c.id === selectedId ? null : c.id)}
              >
                <span className="avatar">{c.original_name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT'}</span>
                <span className="who">
                  <strong>
                    #{c.id} · {c.original_name}
                  </strong>
                  <span>
                    {plural(c.page_count, 'page')} · {plural(c.word_count, 'word')} · {fmt(c.upload_date)}
                  </span>
                </span>
                <span className={`pill status-${c.status}`}>{c.status}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {detail && (
        <>
          <section className="panel">
            <header className="panel-head">
              <h2>
                #{detail.contract.id} · {detail.contract.original_name}
              </h2>
              <code className="endpoint get">GET /contracts/{detail.contract.id}</code>
            </header>

            <details className="preview">
              <summary>Extracted text ({plural(detail.contract.word_count, 'word')})</summary>
              <pre className="contract-text">{detail.contract.text_content || '(empty)'}</pre>
            </details>

            <div className="row-actions" style={{ marginTop: 14 }}>
              <button className="btn primary" disabled={busy} onClick={() => actions.onAnalyse(detail.contract.id)}>
                {busy ? 'Working… (Gemini can take ~20s)' : detail.analyses.length ? 'Analyse again' : 'Analyse with AI'}
              </button>
              <button
                className="btn danger"
                disabled={busy}
                onClick={() => {
                  if (confirm(`Delete contract #${detail.contract.id} and its analyses?`)) {
                    actions.onDelete(detail.contract.id)
                  }
                }}
              >
                Delete
              </button>
            </div>
            <p className="hint" style={{ marginTop: 10 }}>
              <code>POST /analysis/analyse/{detail.contract.id}</code> · <code>DELETE /contracts/{detail.contract.id}</code>
            </p>
          </section>

          {detail.analyses.length === 0 ? (
            <p className="empty panel">No analyses for this contract yet.</p>
          ) : (
            <div className="cards">
              {detail.analyses.map((a) => (
                <AnalysisCard key={a.id} analysis={a} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
