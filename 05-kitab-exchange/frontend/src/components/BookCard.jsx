import { useState } from 'react'
import { fmt, rupees } from '../format.js'

/** One book: mark it sold, edit title/author/price, or delete it. */
export default function BookCard({ book, owner, onUpdate, onSold, onDelete, busy }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: book.title, author: book.author, price: String(book.price) })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // PATCH only what actually changed
  const patch = {}
  if (form.title.trim() !== book.title) patch.title = form.title.trim()
  if (form.author.trim() !== book.author) patch.author = form.author.trim()
  if (Number(form.price) !== book.price) patch.price = Number(form.price)
  const dirty = Object.keys(patch).length > 0
  const valid = form.title.trim() && form.author.trim() && Number(form.price) > 0

  const cancel = () => {
    setEditing(false)
    setForm({ title: book.title, author: book.author, price: String(book.price) })
  }

  return (
    <article className={`card ${editing ? 'editing' : ''} ${book.is_sold ? 'sold' : ''}`}>
      <div className="card-top">
        <div>
          <h3>
            #{book.id} · {book.title}
          </h3>
          <p className="meta">
            by {book.author} · listed {fmt(book.listed_at)}
          </p>
        </div>
        <span className={`pill ${book.is_sold ? 'sold' : 'available'}`}>
          {book.is_sold ? 'Sold' : 'Available'}
        </span>
      </div>

      <div className="comment price-row">
        <span>
          <strong>Seller:</strong>{' '}
          {owner ? `${owner.name} · ${owner.college}` : `user #${book.user_id}`}
        </span>
        <span className="price">{rupees(book.price)}</span>
      </div>

      {editing ? (
        <div className="edit-area">
          <div className="edit-grid">
            <label>
              Title
              <input value={form.title} onChange={set('title')} />
            </label>
            <label>
              Author
              <input value={form.author} onChange={set('author')} />
            </label>
            <label>
              Price (₹)
              <input type="number" min={1} value={form.price} onChange={set('price')} />
            </label>
          </div>
          <div className="patch-preview">
            <code className="endpoint patch">PATCH /books/{book.id}</code>
            {dirty ? <pre>{JSON.stringify(patch, null, 2)}</pre> : <em> nothing changed yet</em>}
          </div>
          <div className="row-actions">
            <button
              className="btn primary small"
              disabled={!dirty || !valid || busy}
              onClick={() => onUpdate(book.id, patch)}
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
          {!book.is_sold && (
            <button className="btn primary small" disabled={busy} onClick={() => onSold(book.id)}>
              Mark sold ✓
            </button>
          )}
          {book.is_sold && (
            <button
              className="btn small"
              disabled={busy}
              onClick={() => onUpdate(book.id, { is_sold: false })}
            >
              Relist
            </button>
          )}
          <button className="btn small" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button
            className="btn danger small"
            disabled={busy}
            onClick={() => window.confirm(`Delete “${book.title}”?`) && onDelete(book.id)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  )
}
