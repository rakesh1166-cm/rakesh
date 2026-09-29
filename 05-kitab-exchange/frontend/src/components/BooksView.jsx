import BookCard from './BookCard.jsx'

/** READ (list) — GET /books/ with title / author search, include_sold and skip/limit paging. */
export default function BooksView({ books, owners, query, setQuery, onRefresh, actions, busy }) {
  // Changing a filter resets to page 1; App re-fetches whenever the query changes.
  const set = (k) => (e) => setQuery({ ...query, [k]: e.target.value, skip: 0 })

  const page = Math.floor(query.skip / query.limit) + 1

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Search</h2>
          <code className="endpoint get">GET /books/</code>
        </header>
        <div className="filters books">
          <label>
            Title contains
            <input value={query.title} onChange={set('title')} placeholder="physics" />
          </label>
          <label>
            Author contains
            <input value={query.author} onChange={set('author')} placeholder="verma" />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={query.include_sold}
              onChange={(e) => setQuery({ ...query, include_sold: e.target.checked, skip: 0 })}
            />
            Include sold
          </label>
          <button className="btn" disabled={busy} onClick={() => onRefresh(query)}>
            Refresh
          </button>
        </div>
      </section>

      {books.length === 0 ? (
        <p className="empty panel">{busy ? 'Loading…' : 'No books match. List one from “Sell a book”.'}</p>
      ) : (
        <div className="cards">
          {books.map((b) => (
            // price/title/sold in the key resets the card's local edit state after a PATCH
            <BookCard
              key={`${b.id}-${b.price}-${b.title}-${b.author}-${b.is_sold}`}
              book={b}
              owner={owners[b.user_id]}
              busy={busy}
              {...actions}
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
          disabled={books.length < query.limit || busy}
          onClick={() => setQuery({ ...query, skip: query.skip + query.limit })}
        >
          Next →
        </button>
      </div>
    </>
  )
}
