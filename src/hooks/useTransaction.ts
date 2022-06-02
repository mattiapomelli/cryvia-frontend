import { ContractTransaction } from 'ethers'
import { useState } from 'react'
import { useWeb3Context } from '../contexts/Web3Provider'

type Transaction = () => Promise<ContractTransaction>

const useTransaction = () => {
  const { active } = useWeb3Context()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleTransaction = async (transaction: Transaction) => {
    if (!active) return
    setPending(true)

    try {
      const tx = await transaction()
      const res = await tx.wait()
      setPending(false)
      setError(null)

      return res
    } catch (error) {
      setPending(false)
      setError(error as Error)
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