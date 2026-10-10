export const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : '')

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
