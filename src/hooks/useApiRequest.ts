import { useState } from 'react'

type Request = () => Promise<void>

const useApiRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleRequest = async (onRequest: Request) => {
    if (loading) return
    setLoading(true)

    try {
      await onRequest()
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    handleRequest,
    loading,
    error,
  }
}

export default useApiRequest
