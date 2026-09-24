import { useState } from 'react'

const EMPTY = { customer_name: '', delivery_address: '', items: '' }

/** CREATE — POST /orders/  (body must match OrderCreate in models.py) */
export default function CreateForm({ onCreated, busy }) {
  const [form, setForm] = useState(EMPTY)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const ok = await onCreated(form)
    if (ok) setForm(EMPTY)
  }

  const valid = form.customer_name.trim() && form.delivery_address.trim() && form.items.trim()

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Order details</h2>
        <code className="endpoint post">POST /orders/</code>
      </header>

      <form onSubmit={submit} className="form">
        <label>
          Customer name
          <input value={form.customer_name} onChange={set('customer_name')} placeholder="Rakesh" />
        </label>
        <label>
          Delivery address
          <input
            value={form.delivery_address}
            onChange={set('delivery_address')}
            placeholder="Office 4B, Nariman Point, Mumbai"
          />
        </label>
        <label>
          Items
          <textarea rows={3} value={form.items} onChange={set('items')} placeholder="2 roti, dal, rice, sabzi" />
        </label>
        <p className="hint">
          New orders always start as <code>preparing</code>.
        </p>

        <details className="preview">
          <summary>Request body that will be sent</summary>
          <pre>{JSON.stringify(form, null, 2)}</pre>
        </details>

        <button className="btn primary" disabled={!valid || busy}>
          {busy ? 'Saving…' : 'POST order'}
        </button>
      </form>
    </section>
  )
}
