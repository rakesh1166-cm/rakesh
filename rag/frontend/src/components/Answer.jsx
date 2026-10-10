/** One question + answer, with the retrieved chunks it was grounded on. */
export default function Answer({ item }) {
  return (
    <article className="card">
      <div className="card-top">
        <h3>{item.question}</h3>
        <span className="meta">#{item.id} · {new Date(item.created_at).toLocaleString()}</span>
      </div>
      <p className="answer">{item.answer}</p>

      {item.sources.length > 0 && (
        <details className="preview">
          <summary>{item.sources.length} source chunks</summary>
          <ul className="sources">
            {item.sources.map((s) => (
              <li key={s.chunk_id}>
                <div className="source-head">
                  <strong>{s.filename}</strong>
                  <span>page {s.page}</span>
                  <span className="score">score {s.score.toFixed(3)}</span>
                </div>
                <p>{s.content}</p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}
