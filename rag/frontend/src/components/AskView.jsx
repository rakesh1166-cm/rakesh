import { useState } from 'react'
import Answer from './Answer.jsx'

/** POST /query/ — retrieve the closest chunks and let the LLM answer from them. */
export default function AskView({ documents, onAsk, busy, answers, onNeedDocs }) {
  const [question, setQuestion] = useState('')
  const [topK, setTopK] = useState(4)
  const [documentId, setDocumentId] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const ok = await onAsk({
      question: question.trim(),
      top_k: Number(topK),
      document_id: documentId === '' ? null : Number(documentId),
    })
    if (ok) setQuestion('')
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Ask</h2>
          <code className="endpoint post">POST /query/</code>
        </header>

        {documents.length === 0 ? (
          <p className="callout">
            <strong>No documents yet.</strong> Upload a PDF first —{' '}
            <button className="btn small" onClick={onNeedDocs}>Go to Documents</button>
          </p>
        ) : (
          <form className="form" onSubmit={submit}>
            <label>
              Question
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) submit(e)
                }}
                placeholder="What is this document about?"
                autoFocus
              />
            </label>
            <div className="ask-row">
              <label>
                Search in
                <select value={documentId} onChange={(e) => setDocumentId(e.target.value)}>
                  <option value="">All documents</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      #{d.id} {d.filename}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Chunks (top_k)
                <input type="number" min={1} max={20} value={topK} onChange={(e) => setTopK(e.target.value)} />
              </label>
              <button className="btn primary" disabled={busy || !question.trim()}>
                {busy ? 'Thinking…' : 'Ask'}
              </button>
            </div>
          </form>
        )}
      </section>

      <div className="cards">
        {answers.map((a) => (
          <Answer key={a.id} item={a} />
        ))}
      </div>
    </>
  )
}
