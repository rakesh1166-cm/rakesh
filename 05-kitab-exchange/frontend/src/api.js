/**
 * One tiny wrapper around fetch() so every call looks the same,
 * and so the UI can show exactly what went over the wire.
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8003'
const API_KEY = import.meta.env.VITE_API_KEY || 'my_secret_api_key'

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

  // Writes are protected by verify_api_key in auth.py
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (method !== 'GET') headers['X-API-Key'] = API_KEY

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
      headers,
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
    // FastAPI validation errors are a list of { loc, msg } — show them readably
    const msg = Array.isArray(detail)
      ? detail.map((d) => `${d.loc?.slice(1).join('.')}: ${d.msg}`).join('; ')
      : typeof detail === 'string'
        ? detail
        : `HTTP ${res.status}`
    throw new Error(msg)
  }
  return data
}

/* ---- Calls mapped 1:1 to routes/books.py, routes/users.py and routes/stats.py ---- */

// BOOKS
export const listBooks = (params) => request('GET', '/books/', { params })
export const getBook = (id) => request('GET', `/books/${id}`)
export const createBook = (payload) => request('POST', '/books/', { body: payload })
export const updateBook = (id, payload) => request('PATCH', `/books/${id}`, { body: payload })
export const markSold = (id) => request('PATCH', `/books/${id}/sold`)
export const deleteBook = (id) => request('DELETE', `/books/${id}`)

// USERS
export const listUsers = () => request('GET', '/users/')
export const createUser = (payload) => request('POST', '/users/', { body: payload })
export const userBooks = (id) => request('GET', `/users/${id}/books`)

// STATS
export const summary = () => request('GET', '/stats/summary')
