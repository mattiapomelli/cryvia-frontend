import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { Quiz } from '@/api/quizzes'
import { QUIZ_CONTRACT_ADDRESS } from '@/constants/addresses'
import { CHAIN } from '@/constants/chains'
import { UserStatus, useUser } from '@/contexts/AuthProvider'
import { parseAmount } from '@/utils/math'
import { useQuizContractRead, useTokenContractRead } from './useContractRead'

export enum SubscriptionStatus {
  Loading,
  NotApproved,
  Approved,
  Subscribed,
}

const useSubscriptionStatus = (quiz: Quiz) => {
  const { status: userStatus } = useUser()
  const { address } = useAccount()
  const [status, setStatus] = useState(SubscriptionStatus.Loading)

  const { data: isSubscribed, isLoading: loadingIsSubscribed } =
    useQuizContractRead<boolean>({
      functionName: 'isSubscribed',
      args: [quiz.id, address],
      enabled: address !== undefined,
      onSuccess(isSubscribed) {
        if (isSubscribed) {
          setStatus(SubscriptionStatus.Subscribed)
        }
      },
    })

  useTokenContractRead({
    functionName: 'allowance',
    args: [address, QUIZ_CONTRACT_ADDRESS[CHAIN.id]],
    enabled: !loadingIsSubscribed && !isSubscribed && address !== undefined,
    onSuccess(allowance) {
      if (allowance.gte(parseAmount(quiz.price))) {
        setStatus(SubscriptionStatus.Approved)
      } else {
        setStatus(SubscriptionStatus.NotApproved)
      }
    },
  })

  useEffect(() => {
    if (userStatus === UserStatus.Disconnected) {
      setStatus(SubscriptionStatus.NotApproved)
    }
  }, [userStatus])

  return {
    loading: status === SubscriptionStatus.Loading,
    status,
    setStatus,
  }
}

export default useSubscriptionStatus
