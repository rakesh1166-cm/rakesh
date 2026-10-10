import { useEffect, useState } from 'react'
import Answer from './Answer.jsx'

/** GET /query/history — every question asked, read back from the queries table. */
export default function HistoryView({ onLoad }) {
  const [items, setItems] = useState(null)
  const load = () => onLoad().then(setItems)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Past questions</h2>
          <code className="endpoint get">GET /query/history</code>
        </header>
        <div className="inline-form">
          <p className="hint" style={{ flex: 1, margin: 0, alignSelf: 'center' }}>
            The latest 20 rows from the <code>queries</code> table.
          </p>
          <button className="btn" onClick={load}>
            Refresh
          </button>
        </div>
      </section>

      {items && items.length === 0 && <p className="empty panel">No questions asked yet.</p>}
      <div className="cards">{items?.map((a) => <Answer key={a.id} item={a} />)}</div>
    </>
  )
}
