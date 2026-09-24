/**
 * One tiny wrapper around fetch() so every CRUD call looks the same,
 * and so the UI can show exactly what went over the wire.
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8002'

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

/* ---- Calls mapped 1:1 to routes/orders.py and routes/stats.py ---- */

// CREATE  ->  POST /orders/
export const createOrder = (payload) => request('POST', '/orders/', { body: payload })

// READ (list) -> GET /orders/?status=&created_date=&skip=&limit=
export const listOrders = (params) => request('GET', '/orders/', { params })

// READ (one)  -> GET /orders/{id}
export const getOrder = (id) => request('GET', `/orders/${id}`)

// UPDATE      -> PATCH /orders/{id}   (status and/or delivery_address)
export const updateOrder = (id, payload) => request('PATCH', `/orders/${id}`, { body: payload })

// DELETE      -> DELETE /orders/{id}
export const deleteOrder = (id) => request('DELETE', `/orders/${id}`)

// HISTORY     -> GET /orders/{id}/history
export const orderHistory = (id) => request('GET', `/orders/${id}/history`)

// STATS       -> GET /stats/daily?summary_date=
export const dailyStats = (summaryDate) =>
  request('GET', '/stats/daily', { params: { summary_date: summaryDate } })
