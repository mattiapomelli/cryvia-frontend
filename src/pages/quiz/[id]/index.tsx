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

  return (
    <div>
      {status === QuizStatus.Subscription && (
        <QuizSubscription
          quiz={quiz}
          onCountdownComplete={onSubscriptionCountdownComplete}
        />
      )}
      {status === QuizStatus.WaitingStart && (
        <div>
          Quiz starts in <Countdown date={quiz.startTime} />{' '}
          {subscriptionStatus === SubscriptionStatus.Subscribed && (
            <Link href="/quiz/live">
              <a>
                <Button>Go to stage</Button>
              </a>
            </Link>
          )}
        </div>
      )}
      {status === QuizStatus.Playing && <div>Playing right now</div>}
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
    <Container className="mt-10 flex justify-center">
      {quiz && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p>{quiz.description}</p>
          <div>
            <span className="font-bold">Price: </span>
            <span>{quiz.price}</span>
          </div>
          <div>
            <span className="font-bold">Starts at: </span>
            <span>{quiz.startTime}</span>
          </div>
          <div>
            <span className="font-bold">Categories: </span>
            {quiz.categories.map((category) => (
              <span key={category.id}>{category.name} </span>
            ))}
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
    </Container>
  )
}

QuizPage.getLayout = getDefaultLayout

export default QuizPage
