import { useState } from 'react'
import OrderCard from './OrderCard.jsx'

/** READ (one) — GET /orders/{id} */
export default function FindOne({ onLookup, onUpdate, onDelete, busy }) {
  const [id, setId] = useState('')
  const [order, setOrder] = useState(undefined)

  const find = async (e) => {
    e.preventDefault()
    setOrder(await onLookup(id))
  }

  // Re-read after a write so the card shows fresh data (or disappears after delete)
  const update = async (orderId, patch) => {
    const ok = await onUpdate(orderId, patch)
    if (ok) setOrder(await onLookup(orderId))
    return ok
  }
  const remove = async (orderId) => {
    if (await onDelete(orderId)) setOrder(undefined)
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Look up an order</h2>
          <code className="endpoint get">GET /orders/{id || '{id}'}</code>
        </header>
        <form className="inline-form" onSubmit={find}>
          <input type="number" min={1} value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID" />
          <button className="btn primary" disabled={!id}>
            Find
          </button>
        </form>
      </section>

      {order === null && <p className="empty panel">No order with ID {id} (404).</p>}
      {order && (
        <OrderCard
          key={`${order.id}-${order.updated_at}`}
          order={order}
          onUpdate={update}
          onDelete={remove}
          busy={busy}
        />
      )}
    </>
  )
}
