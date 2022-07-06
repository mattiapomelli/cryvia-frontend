import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Countdown from 'react-countdown'

import Button from '@components/Button'
import { Quiz } from '@api/quizzes'
import { useQuizContract, useTokenContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'
import { useWeb3Context } from '@contexts/Web3Provider'
import Modal, { BaseModalProps } from '@components/Modal'
import { parseAmount } from '@utils/math'
import { useApiClient } from '@contexts/AuthProvider'
import useApiRequest from '@hooks/useApiRequest'

enum SubscriptionStatus {
  NotApproved,
  Approved,
  Subscribed,
}

interface SubscribeModalProps extends BaseModalProps {
  quiz: Quiz
  status: SubscriptionStatus
  setStatus: Dispatch<SetStateAction<SubscriptionStatus>>
}

const SubscribeModal = ({
  show,
  onClose,
  quiz,
  status,
  setStatus,
}: SubscribeModalProps) => {
  const { account, updateBalance } = useWeb3Context()

  const quizContract = useQuizContract(true)
  const tokenContract = useTokenContract(true)
  const { handleTransaction, pending, error } = useTransaction()

  const apiClient = useApiClient()
  const { handleRequest, loading } = useApiRequest()

  const approveSpending = async () => {
    if (!account) {
      // TODO: show message/modal telling to connect wallet
      return
    }

    if (!tokenContract || !quizContract) return

    const res = await handleTransaction(() =>
      tokenContract.approve(
        quizContract.address,
        ethers.utils.parseUnits(quiz.price.toString(), 18), // TODO: replace with actual quiz price
      ),
    )

    if (res) {
      setStatus(SubscriptionStatus.Approved)
    }
  }

  const suscribe = async () => {
    if (!quizContract) return

    const res = await handleTransaction(() => quizContract.subscribe(quiz.id))

    if (res) {
      handleRequest(async () => {
        await apiClient.quizzes.subscribe(quiz.id)
        setStatus(SubscriptionStatus.Subscribed)
        updateBalance()
      })
    }
  }

  return (
    <Modal show={show} onClose={onClose}>
      {status === SubscriptionStatus.NotApproved && (
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
      {status === SubscriptionStatus.Approved && (
        <Button onClick={suscribe} loading={pending || loading}>
          Subscribe
        </Button>
      )}
      {error && <p className="text-red-500">Something went wrong</p>}
    </Modal>
  )
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
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(SubscriptionStatus.NotApproved)

  const [showSubscribeModal, setShowSubscribeModal] = useState(false)

  // Subscription closes 10 minutes before the beginning of the quiz
  const subscriptionEnd = new Date(quiz.startTime).getTime() - 1000 * 60 * 10

  const quizContract = useQuizContract(true)
  const tokenContract = useTokenContract(true)

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

  return (
    <div>
      <div>
        Subscriptions close in:
        <Countdown date={subscriptionEnd} onComplete={onCountdownComplete} />
      </div>
      {!loading && (
        <>
          {(status === SubscriptionStatus.NotApproved ||
            status === SubscriptionStatus.Approved) && (
            <>
              <SubscribeModal
                show={showSubscribeModal}
                onClose={() => setShowSubscribeModal(false)}
                quiz={quiz}
                status={status}
                setStatus={setStatus}
              />
              {/* TODO: show connect modal on click if no user is connected */}
              <Button onClick={() => setShowSubscribeModal(true)}>
                Subscribe
              </Button>
            </>
          )}
          {status === SubscriptionStatus.Subscribed && (
            <p>You are subscribed to this quiz!</p>
          )}
        </>
      )}
    </div>
  )
}

export default QuizSubscription
