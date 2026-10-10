import { API_BASE } from '../api.js'

const ITEMS = [
  { key: 'analyse', label: 'Analyse', hint: 'Upload plant photos' },
  { key: 'history', label: 'History', hint: 'Past diagnoses' },
  { key: 'stats', label: 'Stats', hint: 'Totals by severity' },
]

export default function Sidebar({ view, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">◉</span>
        <div>
          <div className="brand-name">Netra Vision</div>
          <div className="brand-sub">Crop disease detection</div>
        </div>
      </div>

      <nav>
        {ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${view === item.key ? 'active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            <span>{item.label}</span>
            <small>{item.hint}</small>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        API: <code>{API_BASE}</code>
        <br />
        <a href={`${API_BASE}/docs`} target="_blank" rel="noreferrer">Swagger docs ↗</a>
      </div>
    </aside>
  )
}
