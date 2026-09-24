import { LABEL, STATUSES } from '../status.js'
import OrderCard from './OrderCard.jsx'

/** READ (list) — GET /orders/ with status / date filters and skip/limit paging. */
export default function OrdersView({ orders, query, setQuery, onRefresh, onUpdate, onDelete, busy }) {
  // Changing a filter resets to page 1; App re-fetches whenever the query changes.
  const set = (k) => (e) => setQuery({ ...query, [k]: e.target.value, skip: 0 })

  const page = Math.floor(query.skip / query.limit) + 1

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Filters</h2>
          <code className="endpoint get">GET /orders/</code>
        </header>
        <div className="filters">
          <label>
            Status
            <select value={query.status} onChange={set('status')}>
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Created on
            <input type="date" value={query.created_date} onChange={set('created_date')} />
          </label>
          <label>
            Per page
            <input
              type="number"
              min={1}
              max={100}
              value={query.limit}
              onChange={(e) => setQuery({ ...query, limit: Number(e.target.value) || 1, skip: 0 })}
            />
          </label>
          <button className="btn" disabled={busy} onClick={() => onRefresh(query)}>
            Refresh
          </button>
        </div>
      </section>

      {orders.length === 0 ? (
        <p className="empty panel">{busy ? 'Loading…' : 'No orders match. Create one from “New order”.'}</p>
      ) : (
        <div className="cards">
          {orders.map((o) => (
            // updated_at in the key resets the card's local edit state after a PATCH
            <OrderCard
              key={`${o.id}-${o.updated_at}`}
              order={o}
              onUpdate={onUpdate}
              onDelete={onDelete}
              busy={busy}
            />
          ))}
        </div>
      )}

      <div className="pager">
        <button
          className="btn small"
          disabled={query.skip === 0 || busy}
          onClick={() => setQuery({ ...query, skip: Math.max(0, query.skip - query.limit) })}
        >
          ← Prev
        </button>
        <span className="hint">
          Page {page} · skip={query.skip} limit={query.limit}
        </span>
        <button
          className="btn small"
          disabled={orders.length < query.limit || busy}
          onClick={() => setQuery({ ...query, skip: query.skip + query.limit })}
        >
          Next →
        </button>
      </div>
    </>
  )
}
