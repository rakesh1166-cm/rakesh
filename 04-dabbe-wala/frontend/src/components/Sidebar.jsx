import { API_BASE } from '../api.js'

/**
 * Left-hand menu. Each item is one screen, and most screens are exactly one endpoint.
 */
const GROUPS = [
  {
    title: 'Overview',
    items: [{ id: 'stats', label: 'Daily summary', letter: 'r', verb: 'GET' }],
  },
  {
    title: 'Create',
    items: [{ id: 'create', label: 'New order', letter: 'c', verb: 'POST' }],
  },
  {
    title: 'Read / Update / Delete',
    items: [
      { id: 'orders', label: 'Orders', letter: 'u', verb: 'PATCH' },
      { id: 'find', label: 'Find by ID', letter: 'r', verb: 'GET' },
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
        <span className="brand-mark">🍱</span>
        <div>
          <strong>Dabbawala</strong>
          <span>Delivery tracker</span>
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
