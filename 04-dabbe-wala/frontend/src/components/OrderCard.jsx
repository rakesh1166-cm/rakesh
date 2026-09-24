import { useState } from 'react'
import { orderHistory } from '../api.js'
import { LABEL, STATUSES, fmt, nextStatus } from '../status.js'
import StatusTrack from './StatusTrack.jsx'

/** One order: advance its status, edit it, see its history, delete it. */
export default function OrderCard({ order, onUpdate, onDelete, busy }) {
  const [editing, setEditing] = useState(false)
  const [address, setAddress] = useState(order.delivery_address)
  const [status, setStatus] = useState(order.status)
  const [history, setHistory] = useState(null)

  const next = nextStatus(order.status)

  // PATCH only what actually changed
  const patch = {}
  if (status !== order.status) patch.status = status
  if (address.trim() !== order.delivery_address) patch.delivery_address = address.trim()
  const dirty = Object.keys(patch).length > 0

  const cancel = () => {
    setEditing(false)
    setAddress(order.delivery_address)
    setStatus(order.status)
  }

  const toggleHistory = async () => {
    if (history) return setHistory(null)
    try {
      setHistory(await orderHistory(order.id))
    } catch {
      setHistory([])
    }
  }

  return (
    <article className={editing ? 'card editing' : 'card'}>
      <div className="card-top">
        <div>
          <h3>
            #{order.id} · {order.customer_name}
          </h3>
          <p className="meta">
            Created {fmt(order.created_at)} · updated {fmt(order.updated_at)}
          </p>
        </div>
        <span className={`pill ${order.status}`}>{LABEL[order.status]}</span>
      </div>

      <p className="comment">
        <strong>Items:</strong> {order.items}
        <br />
        <strong>Deliver to:</strong> {order.delivery_address}
      </p>

      <StatusTrack status={order.status} />

      {editing ? (
        <div className="edit-area">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Delivery address
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <div className="patch-preview">
            <code className="endpoint patch">PATCH /orders/{order.id}</code>
            {dirty ? <pre>{JSON.stringify(patch, null, 2)}</pre> : <em> nothing changed yet</em>}
          </div>
          <div className="row-actions">
            <button
              className="btn primary small"
              disabled={!dirty || !address.trim() || busy}
              onClick={() => onUpdate(order.id, patch)}
            >
              Save
            </button>
            <button className="btn ghost small" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="row-actions">
          {next && (
            <button
              className="btn primary small"
              disabled={busy}
              onClick={() => onUpdate(order.id, { status: next })}
            >
              Mark {LABEL[next].toLowerCase()} →
            </button>
          )}
          <button className="btn small" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="btn small" onClick={toggleHistory}>
            {history ? 'Hide history' : 'History'}
          </button>
          <button
            className="btn danger small"
            disabled={busy}
            onClick={() => window.confirm(`Delete order #${order.id}?`) && onDelete(order.id)}
          >
            Delete
          </button>
        </div>
      )}

      {history && (
        <div className="history">
          {history.length === 0 ? (
            <p className="empty">No status changes yet.</p>
          ) : (
            <ul>
              {history.map((h) => (
                <li key={h.id}>
                  <span className="ms">{fmt(h.changed_at)}</span>
                  {LABEL[h.old_status]} → <strong>{LABEL[h.new_status]}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  )
}
