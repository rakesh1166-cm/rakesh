import ReviewCard from './ReviewCard.jsx'

/**
 * READ (list) — GET /review/?play_name=&skip=&limit=
 * Also the home of UPDATE and DELETE, because both need a row to act on.
 */
export default function BrowseView({
  reviews,
  query,
  setQuery,
  onRefresh,
  onUpdate,
  onDelete,
  busy,
  highlightWrite,
}) {
  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Query the list</h2>
          <code className="endpoint get">{'GET /review/?play_name=&skip=&limit='}</code>
        </header>

        <div className="filters">
          <label>
            Filter by play <span className="hint">exact match</span>
            <input
              value={query.play_name}
              placeholder="e.g. chaicode"
              onChange={(e) => setQuery({ ...query, play_name: e.target.value })}
            />
          </label>
          <label>
            Skip
            <input
              type="number"
              min="0"
              value={query.skip}
              onChange={(e) => setQuery({ ...query, skip: Number(e.target.value) })}
            />
          </label>
          <label>
            Limit <span className="hint">1–50</span>
            <input
              type="number"
              min="1"
              max="50"
              value={query.limit}
              onChange={(e) => setQuery({ ...query, limit: Number(e.target.value) })}
            />
          </label>
          <button className="btn primary" onClick={() => onRefresh(query)} disabled={busy}>
            {busy ? 'Loading…' : 'Send GET'}
          </button>
        </div>

        <div className="pager">
          <button
            className="btn ghost small"
            disabled={query.skip === 0}
            onClick={() => setQuery({ ...query, skip: Math.max(0, query.skip - query.limit) })}
          >
            ← Prev page
          </button>
          <span className="hint">
            {reviews.length} row(s) returned · offset {query.skip}
          </span>
          <button
            className="btn ghost small"
            disabled={reviews.length < query.limit}
            onClick={() => setQuery({ ...query, skip: query.skip + query.limit })}
          >
            Next page →
          </button>
        </div>
      </section>

      {highlightWrite && (
        <p className="callout">
          Update and delete both need a row to act on, so they live here. Each card below has an
          <strong> Edit</strong> button (<span className="verb patch">PATCH</span>
          <code>/review/{'{id}'}</code>) and a <strong>Delete</strong> button (
          <span className="verb delete">DELETE</span> <code>/review/{'{id}'}</code>).
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="empty panel">
          No reviews came back. Create one from the menu, or clear the play filter above.
        </p>
      ) : (
        <div className="cards">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </>
  )
}
