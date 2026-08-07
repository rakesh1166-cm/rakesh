const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with ${response.status}`)
  }
  return response.json()
}

export function fetchHome() {
  return getJson('/')
}

export function fetchDatabaseHealth() {
  return getJson('/api/health/db')
}

export { API_BASE_URL }
