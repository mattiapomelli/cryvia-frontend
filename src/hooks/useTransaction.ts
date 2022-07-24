import { ContractTransaction } from 'ethers'
import { useState } from 'react'
import { useAccount } from 'wagmi'

type Transaction = () => Promise<ContractTransaction>

const useTransaction = () => {
  const { isConnected } = useAccount()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleTransaction = async (transaction: Transaction) => {
    if (!isConnected) return
    setPending(true)

    try {
      const tx = await transaction()
      const res = await tx.wait()
      setPending(false)
      setError(null)

      return res
    } catch (err) {
      setPending(false)
      setError(err as Error)
      return null
    }
  }

  return {
    handleTransaction,
    error,
    pending,
  }
}

export default useTransaction
