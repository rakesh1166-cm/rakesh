import { useState } from 'react'

/** POST /documents/ to upload, GET to list, GET /{id}/chunks to inspect, DELETE to remove. */
export default function DocumentsView({ documents, onUpload, onDelete, onChunks, busy }) {
  const [file, setFile] = useState(null)
  const [inputKey, setInputKey] = useState(0)
  const [open, setOpen] = useState(null)
  const [chunks, setChunks] = useState([])

  const submit = async (e) => {
    e.preventDefault()
    if (await onUpload(file)) {
      setFile(null)
      setInputKey((k) => k + 1)
    }
  }

  const toggle = async (id) => {
    if (open === id) return setOpen(null)
    setOpen(id)
    setChunks(await onChunks(id))
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Upload a PDF</h2>
          <code className="endpoint post">POST /documents/</code>
        </header>
        <form className="inline-form" onSubmit={submit}>
          <input key={inputKey} type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files[0] ?? null)} />
          <button className="btn primary" disabled={busy || !file}>
            {busy ? 'Indexing…' : 'Upload & index'}
          </button>
        </form>
        <p className="hint" style={{ marginBottom: 0 }}>
          The text is split into ~1000-character chunks, embedded with OpenAI and stored in Postgres.
        </p>
      </section>

      {documents.length === 0 ? (
        <p className="empty panel">No documents yet.</p>
      ) : (
        <div className="cards">
          {documents.map((d) => (
            <article className="card" key={d.id}>
              <div className="card-top">
                <div>
                  <h3>📄 {d.filename}</h3>
                  <p className="meta">
                    #{d.id} · {d.pages} pages · {d.chunk_count} chunks · {new Date(d.uploaded_at).toLocaleString()}
                  </p>
                </div>
                <div className="row-actions">
                  <button className="btn small" onClick={() => toggle(d.id)}>
                    {open === d.id ? 'Hide chunks' : 'Chunks'}
                  </button>
                  <button
                    className="btn small danger"
                    disabled={busy}
                    onClick={() => confirm(`Delete “${d.filename}” and its chunks?`) && onDelete(d.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {open === d.id && (
                <ul className="sources">
                  {chunks.map((c) => (
                    <li key={c.id}>
                      <div className="source-head">
                        <strong>chunk #{c.id}</strong>
                        <span>page {c.page}</span>
                      </div>
                      <p>{c.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
