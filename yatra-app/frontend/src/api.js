/**
 * One tiny wrapper around fetch() so every call looks the same,
 * and so the UI can show exactly what went over the wire.
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8005'
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

const unreachable = (err) =>
  // The browser gives JS the same opaque TypeError for "nothing is listening" and for
  // "answered, but CORS blocked the reply" — so name both causes rather than guess.
  `The browser could not read a response from ${API_BASE}. Either nothing is listening ` +
  `there, or a different app answered without CORS for this origin. (${err.message})`

// FastAPI validation errors are a list of { loc, msg } — show them readably
function errorMessage(data, status) {
  const detail = data?.detail
  return Array.isArray(detail)
    ? detail.map((d) => `${d.loc?.slice(1).join('.')}: ${d.msg}`).join('; ')
    : typeof detail === 'string'
      ? detail
      : `HTTP ${status}`
}

function prepare(method, path, { body, params } = {}) {
  const url = new URL(API_BASE + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) url.searchParams.set(k, v)
    })
  }

  // Writes are protected by verify_api_key in auth.py
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (method !== 'GET' && method !== 'POST_OPEN') headers['X-API-Key'] = API_KEY

  const entry = {
    id: crypto.randomUUID(),
    method: method === 'POST_OPEN' ? 'POST' : method,
    url: url.toString(),
    body: body ?? null,
    at: new Date().toLocaleTimeString(),
  }
  const init = { method: entry.method, headers, body: body ? JSON.stringify(body) : undefined }
  return { url, init, entry }
}

async function request(method, path, opts) {
  const { url, init, entry } = prepare(method, path, opts)
  const started = performance.now()

  let res, data
  try {
    res = await fetch(url, init)
  } catch (err) {
    const detail = unreachable(err)
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

  if (!res.ok) throw new Error(errorMessage(data, res.status))
  return data
}

/**
 * POST /stream/plan — read the Server-Sent Events as they arrive.
 * EventSource only does GET, so this parses the text/event-stream body by hand.
 */
export async function streamPlan(payload, onEvent) {
  const { url, init, entry } = prepare('POST_OPEN', '/stream/plan', { body: payload })
  const started = performance.now()
  const events = []

  let res
  try {
    res = await fetch(url, init)
  } catch (err) {
    const detail = unreachable(err)
    emit({ ...entry, status: 0, ms: 0, ok: false, response: { detail } })
    throw new Error(detail)
  }

  // Validation (400 / 422) happens before streaming starts, so it arrives as normal JSON
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    emit({ ...entry, status: res.status, ms: Math.round(performance.now() - started), ok: false, response: data })
    throw new Error(errorMessage(data, res.status))
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += value
    // Each event ends with a blank line
    let cut
    while ((cut = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, cut)
      buffer = buffer.slice(cut + 2)
      let event = 'message'
      let data = ''
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim()
        else if (line.startsWith('data:')) data += line.slice(5).trim()
      }
      const parsed = { event, data: data ? JSON.parse(data) : null, ms: Math.round(performance.now() - started) }
      events.push(parsed)
      onEvent(parsed)
    }
  }

  emit({
    ...entry,
    status: res.status,
    ms: Math.round(performance.now() - started),
    ok: !events.some((e) => e.event === 'error'),
    response: events.map((e) => ({ event: e.event, at_ms: e.ms, data: e.data })),
  })
  return events
}

/* ---- Calls mapped 1:1 to routes/*.py ---- */

// PLAN (aggregation, nothing saved — open to everyone, like a read)
export const buildPlan = (payload) => request('POST_OPEN', '/plan/', { body: payload })
export const cacheStats = () => request('GET', '/plan/cache-stats')
export const clearCache = () => request('DELETE', '/plan/cache')

// TRIPS
export const listTrips = (params) => request('GET', '/trips/', { params })
export const getTrip = (id) => request('GET', `/trips/${id}`)
export const saveTrip = (payload) => request('POST', '/trips/', { body: payload })
export const deleteTrip = (id) => request('DELETE', `/trips/${id}`)

// DESTINATIONS + PLACES
export const listDestinations = () => request('GET', '/destinations/')
export const getDestination = (id) => request('GET', `/destinations/${id}`)
export const createDestination = (payload) => request('POST', '/destinations/', { body: payload })
export const deleteDestination = (id) => request('DELETE', `/destinations/${id}`)
export const addPlace = (id, payload) => request('POST', `/destinations/${id}/places`, { body: payload })
export const deletePlace = (id, placeId) => request('DELETE', `/destinations/${id}/places/${placeId}`)

// STATS
export const summary = () => request('GET', '/stats/summary')
