export const rupees = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN')}`

export const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : '')

export const title = (s = '') => s.replace(/\b\w/g, (c) => c.toUpperCase())

export const addDays = (d, n) => {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

// YYYY-MM-DD in local time (toISOString would shift to UTC and can land on yesterday)
export const isoDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Every date from start to end inclusive, as YYYY-MM-DD strings
export const eachDay = (start, end) => {
  const out = []
  for (let d = new Date(`${start}T00:00`); isoDate(d) <= end; d = addDays(d, 1)) out.push(isoDate(d))
  return out
}

export const dayName = (iso) =>
  new Date(`${iso}T00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

export const range = (start, end) => `${dayName(start)} → ${dayName(end)}`
