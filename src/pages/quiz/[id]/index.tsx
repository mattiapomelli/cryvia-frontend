import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useQuery } from 'react-query'
import Countdown from 'react-countdown'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { useApiClient } from '@contexts/AuthProvider'
import Button from '@components/Button'
import { getQuizStatus, Quiz, QuizStatus } from '@api/quizzes'
import { useQuizContract, useTokenContract } from '@hooks/useContract'
import useTransaction from '@hooks/useTransaction'

enum SubscriptionStatus {
  NotApproved,
  Approved,
  Subscribed,
}

interface QuizSubscriptionSectionProps {
  quiz: Quiz
  onCountdownComplete: () => void
}

const QuizSubscriptionSection = ({
  quiz,
  onCountdownComplete,
}: QuizSubscriptionSectionProps) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    SubscriptionStatus.NotApproved,
  )

  // Subscription closes 10 minutes before the beginning of the quiz
  const subscriptionEnd = new Date(quiz.startTime).getTime() - 1000 * 60 * 10

  const quizContract = useQuizContract(true)
  const tokenContract = useTokenContract(true)
  const { handleTransaction, pending } = useTransaction()

  const approveSpending = async () => {
    if (!tokenContract || !quizContract) return

    const res = await handleTransaction(() =>
      tokenContract.approve(
        quizContract.address,
        ethers.utils.parseUnits('1.0', 18),
      ),
    )

    if (res) {
      setSubscriptionStatus(SubscriptionStatus.Approved)
    }
  }

  const suscribe = async () => {
    if (!quizContract) return

    const res = await handleTransaction(() => quizContract.subscribe(1))
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
    </div>
  )
}

const QuizStatusSection = ({ quiz }: { quiz: Quiz }) => {
  const [status, setStatus] = useState(getQuizStatus(quiz.startTime))

  const onSubscriptionCountdownComplete = () => {
    setStatus(QuizStatus.WaitingStart)
  }

  return (
    <div>
      {status === QuizStatus.Subscription && (
        <QuizSubscriptionSection
          quiz={quiz}
          onCountdownComplete={onSubscriptionCountdownComplete}
        />
      )}
      {status === QuizStatus.WaitingStart && (
        <div>
          Quiz starts in <Countdown date={quiz.startTime} />{' '}
          {/* TODO: show only if user has suscribed */}
          <Link href="/quiz/live">
            <a>
              <Button>Go to stage</Button>
            </a>
          </Link>
        </div>
      )}
      {status === QuizStatus.Ended && (
        <div>
          <Link href={`/quiz/${quiz.id}/play`}>
            <a>
              <Button>Take for free</Button>
            </a>
          </Link>
          <div>Leaderboard</div>
        </div>
      )}
    </div>
  )
}

const QuizPage: PageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id?.toString()
  const quizId = Number(id)

  const apiClient = useApiClient()
  const { data: quiz } = useQuery(
    `quiz-${quizId}`,
    () => apiClient.quizzes.read(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  const { data: submissions } = useQuery(
    `quiz-${quizId}-submissions`,
    () => apiClient.quizzes.submissions(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  return (
    <Container className="mt-10 flex justify-center">
      {quiz && (
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p>{quiz.description}</p>
          <div>
            <span>Price: </span>
            <span>{quiz.price}</span>
          </div>
          <div>
            <span>Starts at: </span>
            <span>{quiz.startTime}</span>
          </div>
          <div>
            <span>Categories: </span>
            {quiz.categories.map((category) => (
              <span key={category.id}>{category.name} </span>
            ))}
          </div>
          <QuizStatusSection quiz={quiz} />
          <div>
            {submissions?.map((submission) => (
              <div key={submission.id}>{submission.user.address}</div>
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}

QuizPage.getLayout = getDefaultLayout

export default QuizPage
