import { useState } from 'react'
import { userBooks } from '../api.js'
import { initials, rupees } from '../format.js'

const EMPTY = { name: '', email: '', college: '' }

/** POST /users/ to register, GET /users/ to list, GET /users/{id}/books for one student's shelf. */
export default function UsersView({ users, onCreated, busy }) {
  const [form, setForm] = useState(EMPTY)
  const [selected, setSelected] = useState(null)
  const [shelf, setShelf] = useState([])
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const valid = form.name.trim() && form.email.trim() && form.college.trim()

  const submit = async (e) => {
    e.preventDefault()
    const ok = await onCreated({
      name: form.name.trim(),
      email: form.email.trim(),
      college: form.college.trim(),
    })
    if (ok) setForm(EMPTY)
  }

  const open = async (user) => {
    if (selected?.id === user.id) return setSelected(null)
    setSelected(user)
    try {
      setShelf(await userBooks(user.id))
    } catch {
      setShelf([])
    }
  }

  return (
    <>
      <section className="panel">
        <header className="panel-head">
          <h2>Register a student</h2>
          <code className="endpoint post">POST /users/</code>
        </header>
        <form onSubmit={submit} className="form">
          <label>
            Name
            <input value={form.name} onChange={set('name')} placeholder="Aisha Khan" />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={set('email')} placeholder="aisha@college.edu" />
          </label>
          <label>
            College
            <input value={form.college} onChange={set('college')} placeholder="IIT Bombay" />
          </label>
          <button className="btn primary" disabled={!valid || busy}>
            {busy ? 'Saving…' : 'Register'}
          </button>
        </form>
      </section>

      <section className="panel">
        <header className="panel-head">
          <h2>All students ({users.length})</h2>
          <code className="endpoint get">GET /users/</code>
        </header>
        {users.length === 0 ? (
          <p className="empty">No students yet.</p>
        ) : (
          <ul className="user-list">
            {users.map((u) => (
              <li key={u.id}>
                <button
                  className={selected?.id === u.id ? 'user-row active' : 'user-row'}
                  onClick={() => open(u)}
                >
                  <span className="avatar">{initials(u.name)}</span>
                  <span className="who">
                    <strong>
                      #{u.id} · {u.name}
                    </strong>
                    <span>
                      {u.email} · {u.college}
                    </span>
                  </span>
                  <span className="hint">{selected?.id === u.id ? 'hide' : 'books →'}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selected && (
        <section className="panel">
          <header className="panel-head">
            <h2>{selected.name}’s books</h2>
            <code className="endpoint get">GET /users/{selected.id}/books</code>
          </header>
          {shelf.length === 0 ? (
            <p className="empty">Nothing listed yet.</p>
          ) : (
            <ul className="user-list">
              {shelf.map((b) => (
                <li key={b.id} className="user-row" style={{ cursor: 'default' }}>
                  <span className="who">
                    <strong>
                      #{b.id} · {b.title}
                    </strong>
                    <span>by {b.author}</span>
                  </span>
                  <span className={`pill ${b.is_sold ? 'sold' : 'available'}`}>
                    {b.is_sold ? 'Sold' : 'Available'}
                  </span>
                  <span className="price">{rupees(b.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
}
