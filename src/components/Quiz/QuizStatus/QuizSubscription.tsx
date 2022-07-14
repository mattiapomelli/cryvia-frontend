import { Dispatch, SetStateAction, useState } from 'react'
import { ethers } from 'ethers'
import Countdown from 'react-countdown'

import Button from '@components/Button'
import { Quiz } from '@api/quizzes'
import { useQuizContract, useTokenContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'
import { useWeb3Context } from '@contexts/Web3Provider'
import Modal, { BaseModalProps } from '@components/Modal'
import { useApiClient } from '@contexts/AuthProvider'
import useApiRequest from '@hooks/useApiRequest'
import useSubscriptionStatus from '@hooks/useSubscriptionStatus'

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
  const { updateBalance } = useWeb3Context()

  const quizContract = useQuizContract(true)
  const tokenContract = useTokenContract(true)
  const { handleTransaction, pending, error } = useTransaction()

  const apiClient = useApiClient()
  const { handleRequest, loading } = useApiRequest()

  const approveSpending = async () => {
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
  const { loading, status, setStatus } = useSubscriptionStatus(quiz)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)

  // Subscription closes 10 minutes before the beginning of the quiz
  const subscriptionEnd = new Date(quiz.startTime).getTime() - 1000 * 60 * 10

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
