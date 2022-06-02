import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Countdown from 'react-countdown'

import Button from '@components/Button'
import { Quiz } from '@api/quizzes'
import { useQuizContract, useTokenContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'
import { useWeb3Context } from '@contexts/Web3Provider'

enum SubscriptionStatus {
  NotApproved,
  Approved,
  Subscribed,
}

interface QuizSubscriptionProps {
  quiz: Quiz
  onCountdownComplete: () => void
}

const QuizSubscription = ({
  quiz,
  onCountdownComplete,
}: QuizSubscriptionProps) => {
  const { account } = useWeb3Context()
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    SubscriptionStatus.NotApproved,
  )

  // Subscription closes 10 minutes before the beginning of the quiz
  const subscriptionEnd = new Date(quiz.startTime).getTime() - 1000 * 60 * 10

  const quizContract = useQuizContract(true)
  const tokenContract = useTokenContract(true)
  const { handleTransaction, pending, error } = useTransaction()

  useEffect(() => {
    if (!quizContract || !tokenContract || !account) return

    const getSubscriptionStatus = async () => {
      const isSubscribed = await quizContract.isSubscribed(1, account) // TODO: replace with actual quiz id

      if (isSubscribed) {
        setSubscriptionStatus(SubscriptionStatus.Subscribed)
      } else {
        const allowance = await tokenContract.allowance(
          account,
          quizContract.address,
        )
        // TODO: replace with actual quiz price
        if (allowance.gte(1)) {
          setSubscriptionStatus(SubscriptionStatus.Approved)
        } else {
          setSubscriptionStatus(SubscriptionStatus.NotApproved)
        }
      }
    }

    getSubscriptionStatus()
  }, [quizContract, tokenContract, account])

  const approveSpending = async () => {
    if (!tokenContract || !quizContract) return

    const res = await handleTransaction(() =>
      tokenContract.approve(
        quizContract.address,
        ethers.utils.parseUnits('1.0', 18), // TODO: replace with actual quiz price
      ),
    )

    if (res) {
      setSubscriptionStatus(SubscriptionStatus.Approved)
    }
  }

  const suscribe = async () => {
    if (!quizContract) return

    const res = await handleTransaction(() => quizContract.subscribe(1)) // TODO: replace with actual quiz id
    if (res) {
      setSubscriptionStatus(SubscriptionStatus.Subscribed)
    }
  }

  return (
    <div>
      Subscriptions close in:{' '}
      <Countdown date={subscriptionEnd} onComplete={onCountdownComplete} />
      {subscriptionStatus === SubscriptionStatus.NotApproved && (
        <div>
          <p>
            You first have to approve the spending of your tokens to be able to
            subscribe
          </p>
          <Button onClick={approveSpending} loading={pending}>
            Approve
          </Button>
        </div>
      )}
      {subscriptionStatus === SubscriptionStatus.Approved && (
        <Button onClick={suscribe} loading={pending}>
          Subscribe
        </Button>
      )}
      {subscriptionStatus === SubscriptionStatus.Subscribed && (
        <p>You are subscribed to this quiz!</p>
      )}
      {error && <p className="text-red-500">Something went wrong</p>}
    </div>
  )
}

export default QuizSubscription
