export const rupees = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN')}`

export const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : '')

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
