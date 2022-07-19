import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery } from 'react-query'
import Countdown from 'react-countdown'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { useApiClient } from '@contexts/AuthProvider'
import Button from '@components/Button'
import { getQuizStatus, Quiz, QuizStatus } from '@api/quizzes'
import QuizSubscription from '@components/Quiz/QuizStatus/QuizSubscription'
import Leaderboard from '@components/Quiz/QuizInfo/Leaderboard'
import SubscriptionList from '@components/Quiz/QuizInfo/SubcriptionList'
import QuizEnded from '@components/Quiz/QuizStatus/QuizEnded'
import useSubscriptionStatus, {
  SubscriptionStatus,
} from '@hooks/useSubscriptionStatus'

const QuizStatusSection = ({ quiz }: { quiz: Quiz }) => {
  const [status, setStatus] = useState(getQuizStatus(quiz))
  const { status: subscriptionStatus } = useSubscriptionStatus(quiz)

  const onSubscriptionCountdownComplete = () => {
    setStatus(QuizStatus.WaitingStart)
  }

  const onCountdownComplete = () => {
    setStatus(QuizStatus.Playing)
  }

  return (
    <div>
      {status === QuizStatus.Subscription && (
        <QuizSubscription
          quiz={quiz}
          onCountdownComplete={onSubscriptionCountdownComplete}
        />
      )}
      {status === QuizStatus.WaitingStart && (
        <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-xl items-center mb-10">
          Quiz starts in:
          <Countdown
            date={quiz.startTime}
            onComplete={onCountdownComplete}
            className="font-bold text-xl"
          />{' '}
          {subscriptionStatus === SubscriptionStatus.Subscribed && (
            <Link href="/quiz/live">
              <a>
                <Button>Go to waiting room</Button>
              </a>
            </Link>
          )}
        </div>
      )}
      {status === QuizStatus.Playing && (
        <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-xl items-center mb-10">
          <p className="font-bold text-primary">In live right now...</p>
        </div>
      )}
      {status === QuizStatus.Ended && <QuizEnded quiz={quiz} />}
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

  return (
    <Container className="mt-10">
      <div className="max-w-xl mx-auto">
        {quiz && (
          <div>
            <div className="flex flex-col gap-4 mb-12">
              <h1 className="text-4xl font-bold">{quiz.title}</h1>
              <p className="text-text-secondary mb-2">{quiz.description}</p>
              <div>
                <span className="font-bold">Price: </span>
                <span className="text-text-secondary">{quiz.price} MTK</span>
              </div>
              <div>
                <span className="font-bold">Starts at: </span>
                <span className="text-text-secondary">
                  {new Date(quiz.startTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
              <div>
                <span className="font-bold">Categories: </span>
                {quiz.categories.map((category) => (
                  <span
                    className="bg-[#0B0E11] text-white rounded-full py-1.5 px-3 text-sm"
                    key={category.id}
                  >
                    {category.name}{' '}
                  </span>
                ))}
              </div>
            </div>
            <QuizStatusSection quiz={quiz} />
            <div>
              {getQuizStatus(quiz) === QuizStatus.Ended ? (
                <Leaderboard quiz={quiz} />
              ) : (
                <SubscriptionList quiz={quiz} />
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

QuizPage.getLayout = getDefaultLayout

export default QuizPage
