/**
 * Every HTTP call this page made, newest first.
 * Entries are held in App so they survive switching between screens.
 */
export default function RequestLog({ entries, onClear }) {
  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Request log</h2>
        {entries.length > 0 && (
          <button className="btn ghost small" onClick={onClear}>
            Clear
          </button>
        )}
      </header>

      <p className="hint block">
        Method, URL, request body and response for every call, in order. Click a row to expand it.
      </p>

      {entries.length === 0 ? (
        <p className="empty">
          Nothing yet. Use any screen in the menu and the calls will appear here.
        </p>
      ) : (
        <ul className="log-list">
          {entries.map((e) => (
            <li key={e.id}>
              <details>
                <summary>
                  <span className={`verb ${e.method.toLowerCase()}`}>{e.method}</span>
                  <span className="path">{e.url.replace(/^https?:\/\/[^/]+/, '')}</span>
                  <span className={e.ok ? 'status ok' : 'status err'}>{e.status || 'ERR'}</span>
                  <span className="ms">{e.ms}ms</span>
                </summary>
                <div className="log-body">
                  {e.body && (
                    <>
                      <h4>Request body</h4>
                      <pre>{JSON.stringify(e.body, null, 2)}</pre>
                    </>
                  )}
                  <h4>Response</h4>
                  <pre>{JSON.stringify(e.response, null, 2)}</pre>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
