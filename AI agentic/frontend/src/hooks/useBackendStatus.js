import { useCallback, useEffect, useState } from 'react'

import { fetchDatabaseHealth, fetchHome } from '../api/client'

/**
 * Polls the backend once on mount for its identity and database status.
 * `state` is one of: 'loading' | 'ready' | 'unreachable'.
 */
export function useBackendStatus() {
  const [state, setState] = useState('loading')
  const [info, setInfo] = useState(null)
  const [database, setDatabase] = useState(null)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      const [home, db] = await Promise.all([fetchHome(), fetchDatabaseHealth()])
      setInfo(home)
      setDatabase(db)
      setState('ready')
    } catch (err) {
      setInfo(null)
      setDatabase(null)
      setError(err.message)
      setState('unreachable')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { state, info, database, error, refresh }
}
