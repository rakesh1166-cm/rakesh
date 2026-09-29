import { useState } from 'react'
import BookCard from './BookCard.jsx'

/** READ (one) — GET /books/{id}. Sold books are found here too. */
export default function FindBook({ owners, onLookup, actions, busy }) {
  const [id, setId] = useState('')
  const [book, setBook] = useState(undefined)

  const find = async (e) => {
    e.preventDefault()
    setBook(await onLookup(id))
  }

  // Re-read after a write so the card shows fresh data (or disappears after delete)
  const wrap = (fn) => async (bookId, ...rest) => {
    const ok = await fn(bookId, ...rest)
    if (ok) setBook(await onLookup(bookId))
    return ok
  }
  const remove = async (bookId) => {
    if (await actions.onDelete(bookId)) setBook(undefined)
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Look up a book</h2>
          <code className="endpoint get">GET /books/{id || '{id}'}</code>
        </header>
        <form className="inline-form" onSubmit={find}>
          <input type="number" min={1} value={id} onChange={(e) => setId(e.target.value)} placeholder="Book ID" />
          <button className="btn primary" disabled={!id}>
            Find
          </button>
        </form>
      </section>

      {book === null && <p className="empty panel">No book with ID {id} (404).</p>}
      {book && (
        <BookCard
          key={`${book.id}-${book.price}-${book.title}-${book.author}-${book.is_sold}`}
          book={book}
          owner={owners[book.user_id]}
          onUpdate={wrap(actions.onUpdate)}
          onSold={wrap(actions.onSold)}
          onDelete={remove}
          busy={busy}
        />
      )}
    </>
  )
}
