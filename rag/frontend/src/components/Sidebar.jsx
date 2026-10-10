import { API_BASE } from '../api.js'

/**
 * Left-hand menu. Each item is one screen, and most screens are exactly one endpoint.
 */
const GROUPS = [
  {
    title: 'Overview',
    items: [{ id: 'stats', label: 'Knowledge base', letter: 'r', verb: 'GET' }],
  },
  {
    title: 'RAG',
    items: [
      { id: 'ask', label: 'Ask a question', letter: 'c', verb: 'POST' },
      { id: 'docs', label: 'Documents', letter: 'c', verb: 'POST' },
      { id: 'history', label: 'History', letter: 'r', verb: 'GET' },
    ],
  },
  {
    title: 'Debug',
    items: [{ id: 'log', label: 'Request log', letter: 'l', verb: '' }],
  },
]

export default function Sidebar({ view, onNavigate, logCount, online }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">🧠</span>
        <div>
          <strong>RAG</strong>
          <span>Ask questions about your PDFs</span>
        </div>
      </div>

      <nav className="nav">
        {GROUPS.map((group) => (
          <div className="nav-group" key={group.title}>
            <p className="nav-title">{group.title}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={view === item.id ? 'nav-item active' : 'nav-item'}
                onClick={() => onNavigate(item.id)}
              >
                <span className={`letter ${item.letter}`}>{item.letter.toUpperCase()}</span>
                <span className="nav-label">{item.label}</span>
                {item.verb && <span className={`verb ${item.verb.toLowerCase()}`}>{item.verb}</span>}
                {item.id === 'log' && logCount > 0 && <span className="badge">{logCount}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <p className={online === false ? 'conn off' : online ? 'conn on' : 'conn idle'}>
          <span className="dot" />
          {online === false ? 'API unreachable' : online ? 'API connected' : 'Checking API…'}
        </p>
        <code>{API_BASE}</code>
        <a href={`${API_BASE}/docs`} target="_blank" rel="noreferrer">
          Open Swagger /docs ↗
        </a>
      </div>
    </aside>
  )
}
