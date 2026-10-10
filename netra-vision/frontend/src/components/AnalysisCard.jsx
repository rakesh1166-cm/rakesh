import { imageUrl } from '../api.js'

export function SeverityBadge({ severity }) {
  const s = severity || 'unknown'
  return <span className={`badge sev-${s}`}>{s}</span>
}

const URGENCY = { immediate: 'Immediate', within_week: 'Within a week', seasonal: 'Seasonal' }

export default function AnalysisCard({ analysis, onDelete }) {
  const a = analysis
  return (
    <article className="card analysis">
      <img className="analysis-img" src={imageUrl(a.stored_name)} alt={a.filename} />

      <div className="analysis-body">
        <header className="analysis-head">
          <div>
            <h3>{a.crop_detected || 'Unknown crop'}</h3>
            <div className="muted">
              #{a.id} · {a.filename} · {new Date(a.created_at).toLocaleString()}
            </div>
          </div>
          <SeverityBadge severity={a.severity} />
        </header>

        {a.overall_health && <p className="summary">{a.overall_health}</p>}

        {a.diseases?.length > 0 && (
          <section>
            <h4>Diseases</h4>
            <ul className="list">
              {a.diseases.map((d, i) => (
                <li key={i}>
                  <div className="row">
                    <strong>{d.name}</strong>
                    {typeof d.confidence === 'number' && (
                      <span className="confidence">
                        <span className="bar" style={{ width: `${Math.round(d.confidence * 100)}%` }} />
                        <em>{Math.round(d.confidence * 100)}%</em>
                      </span>
                    )}
                  </div>
                  <p>{d.description}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {a.treatments?.length > 0 && (
          <section>
            <h4>Treatments</h4>
            <ul className="list">
              {a.treatments.map((t, i) => (
                <li key={i}>
                  <div className="row">
                    <strong>{t.treatment_name}</strong>
                    <span className="tags">
                      {t.treatment_type && <span className="tag">{t.treatment_type}</span>}
                      {t.urgency && <span className={`tag urg-${t.urgency}`}>{URGENCY[t.urgency] || t.urgency}</span>}
                    </span>
                  </div>
                  <p>{t.instructions}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {a.additional_notes && (
          <section>
            <h4>Notes</h4>
            <p>{a.additional_notes}</p>
          </section>
        )}

        {onDelete && (
          <div className="actions">
            <button className="btn danger" onClick={() => onDelete(a)}>Delete</button>
          </div>
        )}
      </div>
    </article>
  )
}
