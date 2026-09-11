import { API_BASE } from '../api.js'

/**
 * Left-hand menu. Each item is one screen, and most screens are exactly one endpoint —
 * that pairing is the whole point of this app.
 */
const GROUPS = [
  {
    title: 'Create',
    items: [{ id: 'create', label: 'New review', letter: 'c', verb: 'POST' }],
  },
  {
    title: 'Read',
    items: [
      { id: 'browse', label: 'Browse reviews', letter: 'r', verb: 'GET' },
      { id: 'find', label: 'Find by ID', letter: 'r', verb: 'GET' },
      { id: 'average', label: 'Average rating', letter: 'r', verb: 'GET' },
    ],
  },
  {
    title: 'Update / Delete',
    items: [{ id: 'modify', label: 'Edit & delete', letter: 'u', verb: 'PATCH' }],
  },
  {
    title: 'Learn',
    items: [
      { id: 'log', label: 'Request log', letter: 'l', verb: '' },
      { id: 'cheatsheet', label: 'Cheat sheet', letter: 'l', verb: '' },
    ],
  },
]

export default function Sidebar({ view, onNavigate, logCount, online }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">🎭</span>
        <div>
          <strong>Rangmanch</strong>
          <span>Reviews CRUD</span>
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
