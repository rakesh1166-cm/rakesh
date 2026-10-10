/**
 * One tiny wrapper around fetch() so every call looks the same.
 */

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8008'
const API_KEY = import.meta.env.VITE_API_KEY || 'my_secret_api_key'

export const imageUrl = (storedName) => `${API_BASE}/uploads/${storedName}`

async function request(method, path, { body, params, form } = {}) {
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

  let res
  try {
    res = await fetch(url, {
      method,
      headers,
      // FormData sets its own multipart Content-Type with the boundary
      body: form ?? (body ? JSON.stringify(body) : undefined),
    })
  } catch (err) {
    throw new Error(
      `Could not reach ${API_BASE}. Is the FastAPI server running? (${err.message})`
    )
  }

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

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

/* ---- Calls mapped 1:1 to routes/analyse.py, routes/analyses.py and routes/stats.py ---- */

export const analyseOne = (file) => {
  const form = new FormData()
  form.append('file', file)
  return request('POST', '/analyse/', { form })
}

export const analyseBatch = (files) => {
  const form = new FormData()
  files.forEach((f) => form.append('files', f))
  return request('POST', '/analyse/batch', { form })
}

export const listAnalyses = (params) => request('GET', '/analyses/', { params })
export const getAnalysis = (id) => request('GET', `/analyses/${id}`)
export const deleteAnalysis = (id) => request('DELETE', `/analyses/${id}`)

export const summary = () => request('GET', '/stats/summary')
