import { useState } from 'react'

const EMPTY = { title: '', author: '', price: '', user_id: '' }

/** CREATE — POST /books/  (body must match BookCreate in models/book.py) */
export default function SellForm({ users, onCreated, onNeedUser, busy }) {
  const [form, setForm] = useState(EMPTY)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const payload = {
    title: form.title.trim(),
    author: form.author.trim(),
    price: Number(form.price),
    user_id: Number(form.user_id),
  }
  const valid = payload.title && payload.author && payload.price > 0 && payload.user_id

  const submit = async (e) => {
    e.preventDefault()
    const ok = await onCreated(payload)
    // Keep the seller selected so listing several books in a row is quick
    if (ok) setForm({ ...EMPTY, user_id: form.user_id })
  }

  if (users.length === 0) {
    return (
      <section className="panel">
        <p className="empty">Every book needs an owner — register a student first.</p>
        <button className="btn primary small" style={{ marginTop: 12 }} onClick={onNeedUser}>
          Go to Students →
        </button>
      </section>
    )
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Book details</h2>
        <code className="endpoint post">POST /books/</code>
      </header>

      <form onSubmit={submit} className="form">
        <label>
          Seller
          <select value={form.user_id} onChange={set('user_id')}>
            <option value="">Choose a student…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                #{u.id} · {u.name} ({u.college})
              </option>
            ))}
          </select>
        </label>
        <label>
          Title
          <input value={form.title} onChange={set('title')} placeholder="Concepts of Physics Vol. 1" />
        </label>
        <label>
          Author
          <input value={form.author} onChange={set('author')} placeholder="H.C. Verma" />
        </label>
        <label>
          Price (₹)
          <input type="number" min={1} value={form.price} onChange={set('price')} placeholder="250" />
        </label>
        <p className="hint">
          Needs the <code>X-API-Key</code> header — sent automatically from <code>VITE_API_KEY</code>.
        </p>

        <details className="preview">
          <summary>Request body that will be sent</summary>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </details>

        <button className="btn primary" disabled={!valid || busy}>
          {busy ? 'Saving…' : 'List book for sale'}
        </button>
      </form>
    </section>
  )
}
