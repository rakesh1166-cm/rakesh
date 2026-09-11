const ROWS = [
  { letter: 'c', op: 'Create', verb: 'POST', path: '/review/', fn: 'create_review', note: 'Body = ReviewCreate. Server assigns id and created_at.' },
  { letter: 'r', op: 'Read all', verb: 'GET', path: '/review/', fn: 'list_reviews', note: 'Filters and paging go in the query string.' },
  { letter: 'r', op: 'Read one', verb: 'GET', path: '/review/{id}', fn: 'get_review', note: 'Missing row → 404, not an empty body.' },
  { letter: 'u', op: 'Update', verb: 'PATCH', path: '/review/{id}', fn: 'update_review', note: 'Only rating and comment; only changed fields are sent.' },
  { letter: 'd', op: 'Delete', verb: 'DELETE', path: '/review/{id}', fn: 'delete_review', note: 'Returns a message, not the deleted row.' },
]

export default function CheatSheet() {
  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>The five operations</h2>
        </header>
        <div className="sheet">
          {ROWS.map((r) => (
            <div className="sheet-row" key={r.op}>
              <span className={`letter ${r.letter}`}>{r.letter.toUpperCase()}</span>
              <span className="sheet-op">{r.op}</span>
              <span className={`verb ${r.verb.toLowerCase()}`}>{r.verb}</span>
              <code className="sheet-path">{r.path}</code>
              <code className="sheet-fn">{r.fn}()</code>
              <span className="sheet-note">{r.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <header className="panel-head">
          <h2>Things that trip people up</h2>
        </header>
        <ul className="notes">
          <li>
            <strong>The trailing slash matters.</strong> The router is{' '}
            <code>prefix="/review"</code> with a path of <code>"/"</code>, so the list and create
            endpoints are <code>/review/</code>. Asking for <code>/review</code> gets a 307 redirect.
          </li>
          <li>
            <strong>PATCH is not PUT.</strong> PATCH sends only the fields you changed; PUT would
            replace the whole row. Open the edit form and watch the body shrink and grow.
          </li>
          <li>
            <strong>The API decides what is editable.</strong> <code>ReviewUpate</code> only exposes
            rating and comment, so no frontend can rename a play — by design.
          </li>
          <li>
            <strong>Validation lives on both sides.</strong> The stars widget stops you at 1–5, and
            so does <code>Field(ge=1, le=5)</code>. The browser check is a courtesy; the server
            check is the real one.
          </li>
          <li>
            <strong>CORS is a browser rule, not a server one.</strong> curl and Swagger never needed
            it. The <code>CORSMiddleware</code> in main.py is what lets this page read the response.
          </li>
        </ul>
      </section>
    </>
  )
}
