/**
 * One tiny wrapper around fetch() so every CRUD call looks the same,
 * and so the UI can show exactly what went over the wire.
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

// Anyone can subscribe to see each request/response (used by the Request Log panel).
const listeners = new Set()
export function onRequest(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
function emit(entry) {
  listeners.forEach((fn) => fn(entry))
}

async function request(method, path, { body, params } = {}) {
  const url = new URL(API_BASE + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) url.searchParams.set(k, v)
    })
  }

  const started = performance.now()
  const entry = {
    id: crypto.randomUUID(),
    method,
    url: url.toString(),
    body: body ?? null,
    at: new Date().toLocaleTimeString(),
  }

  let res, data
  try {
    res = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    // The browser gives JS the same opaque TypeError for "nothing is listening" and for
    // "answered, but CORS blocked the reply" — so name both causes rather than guess.
    const detail =
      `The browser could not read a response from ${API_BASE}. Either nothing is listening ` +
      `there, or a different app answered without CORS for this origin. (${err.message})`
    emit({ ...entry, status: 0, ms: 0, ok: false, response: { detail } })
    throw new Error(detail)
  }

  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  emit({
    ...entry,
    status: res.status,
    ms: Math.round(performance.now() - started),
    ok: res.ok,
    response: data,
  })

  if (!res.ok) {
    const detail = data?.detail
    throw new Error(
      typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : `HTTP ${res.status}`
    )
  }
  return data
}

/* ---- The five CRUD calls, mapped 1:1 to routes/reviews.py ---- */

// CREATE  ->  POST /review/
export const createReview = (payload) => request('POST', '/review/', { body: payload })

// READ (list) -> GET /review/?play_name=&skip=&limit=
export const listReviews = (params) => request('GET', '/review/', { params })

// READ (one)  -> GET /review/{id}
export const getReview = (id) => request('GET', `/review/${id}`)

// UPDATE      -> PATCH /review/{id}   (only rating + comment are updatable)
export const updateReview = (id, payload) => request('PATCH', `/review/${id}`, { body: payload })

// DELETE      -> DELETE /review/{id}
export const deleteReview = (id) => request('DELETE', `/review/${id}`)

// EXTRA       -> GET /review/average/{play_name}
export const averageRating = (playName) =>
  request('GET', `/review/average/${encodeURIComponent(playName)}`)
