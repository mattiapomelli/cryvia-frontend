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

    try {
      const tx = await transaction()

      setPending(true)
      const res = await tx.wait()
      setPending(false)

      return res
    } catch (error) {
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
