import { useState } from 'react'
import Stars from './Stars.jsx'

const EMPTY = { play_name: '', reviewer_name: '', rating: 5, comment: '' }

/** CREATE — POST /review/  (body must match ReviewCreate in models.py) */
export default function CreateForm({ onCreated, busy }) {
  const [form, setForm] = useState(EMPTY)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const ok = await onCreated(form)
    if (ok) setForm(EMPTY)
  }

  const valid = form.play_name.trim() && form.reviewer_name.trim() && form.comment.trim()

  return (
    <section className="panel">
      <header className="panel-head">
        <h2>Review details</h2>
        <code className="endpoint post">POST /review/</code>
      </header>

      <form onSubmit={submit} className="form">
        <label>
          Play name
          <input value={form.play_name} onChange={set('play_name')} placeholder="Wada Chirebandi" />
        </label>
        <label>
          Reviewer name
          <input value={form.reviewer_name} onChange={set('reviewer_name')} placeholder="Rakesh" />
        </label>
        <label>
          Rating <span className="hint">1–5, validated by the API too</span>
          <Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
        </label>
        <label>
          Comment
          <textarea rows={3} value={form.comment} onChange={set('comment')} placeholder="What did you think?" />
        </label>

        <details className="preview">
          <summary>Request body that will be sent</summary>
          <pre>{JSON.stringify({ ...form, rating: Number(form.rating) }, null, 2)}</pre>
        </details>

        <button className="btn primary" disabled={!valid || busy}>
          {busy ? 'Saving…' : 'POST review'}
        </button>
      </form>
    </section>
  )
}
