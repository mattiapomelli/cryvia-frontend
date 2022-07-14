import { useEffect, useState } from 'react'

import { Quiz } from '@api/quizzes'
import { useWeb3Context } from '@contexts/Web3Provider'
import { parseAmount } from '@utils/math'
import { useQuizContract, useTokenContract } from './useContract'

export enum SubscriptionStatus {
  NotApproved,
  Approved,
  Subscribed,
}

const useSubscriptionStatus = (quiz: Quiz) => {
  const { account } = useWeb3Context()
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(SubscriptionStatus.NotApproved)

  const quizContract = useQuizContract()
  const tokenContract = useTokenContract()

  useEffect(() => {
    if (!quizContract || !tokenContract || !account) {
      setLoading(false)
      return
    }

    const getSubscriptionStatus = async () => {
      setLoading(true)
      const isSubscribed = await quizContract.isSubscribed(quiz.id, account)

      if (isSubscribed) {
        setStatus(SubscriptionStatus.Subscribed)
      } else {
        const allowance = await tokenContract.allowance(
          account,
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
  }, [quizContract, tokenContract, account, quiz.id, quiz.price])

  return {
    loading,
    status,
    setStatus,
  }
}

export default useSubscriptionStatus
