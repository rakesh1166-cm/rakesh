import { useState } from 'react'
import Stars from './Stars.jsx'

/**
 * One review row.
 * UPDATE — PATCH /review/{id}   (ReviewUpate only allows rating + comment)
 * DELETE — DELETE /review/{id}
 */
export default function ReviewCard({ review, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [rating, setRating] = useState(review.rating)
  const [comment, setComment] = useState(review.comment)

  const startEdit = () => {
    setRating(review.rating)
    setComment(review.comment)
    setEditing(true)
  }

  // PATCH sends only what actually changed — that is the whole point of PATCH vs PUT.
  const changed = {}
  if (rating !== review.rating) changed.rating = Number(rating)
  if (comment !== review.comment) changed.comment = comment

  const save = async () => {
    if (Object.keys(changed).length === 0) return setEditing(false)
    const ok = await onUpdate(review.id, changed)
    if (ok) setEditing(false)
  }

  return (
    <article className={editing ? 'card editing' : 'card'}>
      <div className="card-top">
        <div>
          <h3>{review.play_name}</h3>
          <p className="meta">
            by <strong>{review.reviewer_name}</strong> · id {review.id} ·{' '}
            {new Date(review.created_at).toLocaleString()}
          </p>
        </div>
        {!editing && <Stars value={review.rating} />}
      </div>

      {editing ? (
        <div className="edit-area">
          <label>
            Rating
            <Stars value={rating} onChange={setRating} />
          </label>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
          <div className="patch-preview">
            <span className="endpoint patch">PATCH /review/{review.id}</span>
            <pre>{JSON.stringify(changed, null, 2)}</pre>
            {Object.keys(changed).length === 0 && <em>Nothing changed yet — an empty body sends nothing.</em>}
          </div>
          <div className="row-actions">
            <button className="btn primary" onClick={save}>Save (PATCH)</button>
            <button className="btn ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className="comment">{review.comment}</p>
          <div className="row-actions">
            <button className="btn" onClick={startEdit}>Edit</button>
            <button
              className="btn danger"
              onClick={() => {
                if (confirm(`Delete review #${review.id}?`)) onDelete(review.id)
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  )
}
