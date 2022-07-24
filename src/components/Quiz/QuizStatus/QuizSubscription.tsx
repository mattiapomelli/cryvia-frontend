import { Dispatch, SetStateAction, useState } from 'react'
import Countdown from 'react-countdown'
import { useMutation, useQueryClient } from 'react-query'
import Link from 'next/link'
import { ethers } from 'ethers'

import { Quiz, Subscription } from '@/api/quizzes'
import Button from '@/components/Button'
import Modal, { BaseModalProps } from '@/components/Modal'
import { QUIZ_CONTRACT_ADDRESS } from '@/constants/addresses'
import { CHAIN } from '@/constants/chains'
import { useApiClient, UserStatus, useUser } from '@/contexts/AuthProvider'
import {
  useQuizContractWrite,
  useTokenContractWrite,
} from '@/hooks/useContractWriteAndWait'
import useSubscriptionStatus, {
  SubscriptionStatus,
} from '@/hooks/useSubscriptionStatus'
import useTokenBalance from '@/hooks/useTokenBalance'

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
  const { balance, refetch } = useTokenBalance()

  const {
    write: writeApprove,
    error: approveError,
    isLoading: loadingApprove,
  } = useTokenContractWrite({
    functionName: 'approve',
    onSuccess() {
      setStatus(SubscriptionStatus.Approved)
    },
  })

  const apiClient = useApiClient()
  const { mutate, isLoading } = useMutation(
    () => apiClient.quizzes.subscribe(quiz.id),
    {
      onSuccess() {
        queryClient.setQueryData<Subscription[] | undefined>(
          ['quiz-subscriptions', quiz.id],
          (subscriptions) => {
            if (!subscriptions || !user) return subscriptions
            const { id, address, username } = user
            const newSubscription = { user: { id, address, username } }
            return [...subscriptions, newSubscription]
          },
        )
        refetch()
        setStatus(SubscriptionStatus.Subscribed)
      },
    },
  )

  const {
    write: writeSubscribe,
    error: subscribeError,
    isLoading: loadingSubscribe,
  } = useQuizContractWrite({
    functionName: 'subscribe',
    onSuccess() {
      mutate()
    },
  })

  const queryClient = useQueryClient()
  const { user, status: userStatus } = useUser()

  const approveSpending = () => {
    writeApprove({
      args: [
        QUIZ_CONTRACT_ADDRESS[CHAIN.id],
        ethers.utils.parseUnits(quiz.price.toString(), 18), // TODO: replace with actual decimal digits
      ],
    })
  }

  const subscribe = () => {
    writeSubscribe({
      args: [quiz.id],
    })
  }

  if (userStatus !== UserStatus.Logged) {
    return (
      <Modal show={show} onClose={onClose}>
        <div>
          <p className="mb-4">
            Please connect your wallet and verify your address in order to
            subscribe to the quiz
          </p>
        </div>
      </Modal>
    )
  }

  const canPayQuizFee = balance?.value.gte(
    ethers.utils.parseEther(quiz.price.toString()),
  )

  if (!canPayQuizFee) {
    return (
      <Modal show={show} onClose={onClose}>
        <div>
          <p className="mb-4">
            You don&apos;t have enough MTK tokens to subscribe to the quiz. Get
            some{' '}
            <Link href="/mint">
              <a className="underline font-bold">here</a>
            </Link>{' '}
          </p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      closable={!loadingApprove && !loadingSubscribe && !isLoading}
    >
      {status === SubscriptionStatus.NotApproved && (
        <div>
          <h4 className="font-bold text-xl mb-2">Approve</h4>
          <p className="mb-4">
            You first have to approve the spending of your tokens to be able to
            subscribe.
          </p>
          <div className="flex justify-end">
            <Button onClick={approveSpending} loading={loadingApprove}>
              Approve
            </Button>
          </div>
        </div>
      )}
      {status === SubscriptionStatus.Approved && (
        <div>
          <h4 className="font-bold text-xl mb-2">Subscribe</h4>
          <p>Subscribe to the quiz by paying the quiz fee.</p>
          <p className="mb-4">Price: {quiz.price} USDC</p>
          <div className="flex justify-end">
            <Button onClick={subscribe} loading={loadingSubscribe || isLoading}>
              Subscribe
            </Button>
          </div>
        </div>
      )}
      {(approveError || subscribeError) && (
        <p className="text-red-500">
          {approveError?.message ||
            subscribeError?.message ||
            'Something went wrong'}
        </p>
      )}
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
    <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-default items-center mb-10">
      Subscriptions close in:
      <Countdown
        date={subscriptionEnd}
        onComplete={onCountdownComplete}
        className="font-bold text-xl"
      />
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
            <p className="font-bold text-primary">
              You are subscribed to this quiz! ✔️
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default QuizSubscription
