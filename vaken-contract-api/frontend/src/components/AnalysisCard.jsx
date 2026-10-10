import { fmt } from '../format.js'

/** One stored analysis: summary, risk flags, key clauses and recommendations. */
export default function AnalysisCard({ analysis, title }) {
  const a = analysis
  return (
    <article className="card analysis">
      <div className="card-top">
        <div>
          <h3>{title ?? `Analysis #${a.id}`}</h3>
          <p className="meta">
            {a.contract_type || 'Unknown type'} · {fmt(a.analysis_date)} · contract #{a.contract_id}
          </p>
        </div>
        <span className={`risk ${a.overall_risk_level}`}>{a.overall_risk_level} risk</span>
      </div>

      <p className="comment">{a.summary}</p>

      {a.risk_flags.length > 0 && (
        <details open>
          <summary>Risk flags ({a.risk_flags.length})</summary>
          <ul className="flag-list">
            {a.risk_flags.map((r, i) => (
              <li key={i} className={`flag ${r.risk_level}`}>
                <div className="flag-head">
                  <strong>{r.risk_title}</strong>
                  <span className={`risk ${r.risk_level}`}>{r.risk_level}</span>
                </div>
                <p>{r.description}</p>
                <p className="rec">
                  <strong>Do:</strong> {r.recommendation}
                </p>
                {r.clause_reference && <p className="meta">Clause: {r.clause_reference}</p>}
              </li>
            ))}
          </ul>
        </details>
      )}

      {a.key_clauses.length > 0 && (
        <details>
          <summary>Key clauses ({a.key_clauses.length})</summary>
          <ul className="flag-list">
            {a.key_clauses.map((c, i) => (
              <li key={i} className="flag">
                <div className="flag-head">
                  <strong>{c.clause_title}</strong>
                  <span className={c.is_standard ? 'pill available' : 'pill nonstd'}>
                    {c.is_standard ? 'standard' : 'non-standard'}
                  </span>
                </div>
                <p>{c.explanation}</p>
                <blockquote>{c.clause_text}</blockquote>
              </li>
            ))}
          </ul>
        </details>
      )}

      {a.recommendations.length > 0 && (
        <details>
          <summary>Recommendations ({a.recommendations.length})</summary>
          <ol className="notes">
            {a.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </details>
      )}
    </article>
  )
}
