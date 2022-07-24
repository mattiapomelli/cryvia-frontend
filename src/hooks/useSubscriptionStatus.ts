import { useEffect, useState } from 'react'

import { Quiz } from '@api/quizzes'
import { parseAmount } from '@utils/math'
import { useQuizContract, useTokenContract } from './useContract'
import { useAccount } from 'wagmi'

export enum SubscriptionStatus {
  NotApproved,
  Approved,
  Subscribed,
}

const useSubscriptionStatus = (quiz: Quiz) => {
  const { address } = useAccount()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(SubscriptionStatus.NotApproved)

  const quizContract = useQuizContract()
  const tokenContract = useTokenContract()

  useEffect(() => {
    if (!quizContract || !tokenContract || !address) {
      setLoading(false)
      return
    }

    const getSubscriptionStatus = async () => {
      setLoading(true)
      const isSubscribed = await quizContract.isSubscribed(quiz.id, address)

      if (isSubscribed) {
        setStatus(SubscriptionStatus.Subscribed)
      } else {
        const allowance = await tokenContract.allowance(
          address,
          quizContract.address,
        )

        if (allowance.gte(parseAmount(quiz.price))) {
          setStatus(SubscriptionStatus.Approved)
        } else {
          setStatus(SubscriptionStatus.NotApproved)
        }
      }

      setLoading(false)
    }

    getSubscriptionStatus()
  }, [quizContract, tokenContract, address, quiz.id, quiz.price])

  return {
    loading,
    status,
    setStatus,
  }
}

export default useSubscriptionStatus
