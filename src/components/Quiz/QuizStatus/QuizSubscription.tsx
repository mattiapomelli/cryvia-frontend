import { Dispatch, SetStateAction, useState } from 'react'
import { ethers } from 'ethers'
import Countdown from 'react-countdown'

import Button from '@components/Button'
import { Quiz, Subscription } from '@api/quizzes'
import { useQuizContract, useTokenContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'
import { useWeb3Context } from '@contexts/Web3Provider'
import Modal, { BaseModalProps } from '@components/Modal'
import { useApiClient, UserStatus, useUser } from '@contexts/AuthProvider'
import useApiRequest from '@hooks/useApiRequest'
import useSubscriptionStatus from '@hooks/useSubscriptionStatus'
import { useQueryClient } from 'react-query'
import Link from 'next/link'

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
  const { updateBalance, balance } = useWeb3Context()

  const quizContract = useQuizContract(true)
  const tokenContract = useTokenContract(true)
  const { handleTransaction, pending, error } = useTransaction()

  const apiClient = useApiClient()
  const { handleRequest, loading } = useApiRequest()
  const queryClient = useQueryClient()
  const { user, status: userStatus } = useUser()

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
        await queryClient.setQueryData<Subscription[] | undefined>(
          `quiz-${quiz.id}-subscriptions`,
          (subscriptions) => {
            if (!subscriptions || !user) return subscriptions
            const { id, address, username } = user
            return [
              ...subscriptions,
              {
                user: {
                  id,
                  address,
                  username,
                },
              },
            ]
          },
        )
        updateBalance()
        setStatus(SubscriptionStatus.Subscribed)
      })
    }
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

  const canPayFee = balance.gte(ethers.utils.parseEther(quiz.price.toString()))

  if (!canPayFee) {
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
    <Modal show={show} onClose={onClose} closable={!pending && !loading}>
      {status === SubscriptionStatus.NotApproved && (
        <div>
          <h4 className="font-bold text-xl mb-2">Approve</h4>
          <p className="mb-4">
            You first have to approve the spending of your tokens to be able to
            subscribe.
          </p>
          <div className="flex justify-end">
            <Button onClick={approveSpending} loading={pending}>
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
            <Button onClick={suscribe} loading={pending || loading}>
              Subscribe
            </Button>
          </div>
        </div>
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
    <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-xl items-center mb-10">
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
