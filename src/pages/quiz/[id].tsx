import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Countdown from 'react-countdown'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { useApiClient } from '@contexts/AuthProvider'
import Button from '@components/Button'
import { getQuizStatus, QuizStatus } from '@api/quizzes'
import { useState } from 'react'

const QuizStatusSection = ({ startTime }: { startTime: string }) => {
  const [status, setStatus] = useState<QuizStatus>(getQuizStatus(startTime))

  const onSubscriptionCountdownComplete = () => {
    setStatus(QuizStatus.WaitingStart)
  }

  return (
    <div>
      {status === QuizStatus.Subscription && (
        <div>
          Subscriptions close in:{' '}
          <Countdown
            date={new Date(startTime).getTime() - 1000 * 60 * 10}
            onComplete={onSubscriptionCountdownComplete}
          />
          <Button>Suscribe</Button>
        </div>
      )}
      {status === QuizStatus.WaitingStart && (
        <div>
          Quiz starts in <Countdown date={startTime} />{' '}
          {/* TODO: show only if user has suscribed */}
          <Button>Go to stage</Button>
        </div>
      )}
      {status === QuizStatus.Ended && (
        <div>
          <Button>Take for free</Button>
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
    `quiz${quizId}`,
    () => apiClient.quizzes.read(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  console.log('render')

  if (quiz) {
    quiz.startTime = '2022-05-08T09:41:40.000Z'
  }

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
          <QuizStatusSection startTime={quiz.startTime} />
        </div>
      )}
    </Container>
  )
}

QuizPage.getLayout = getDefaultLayout

export default QuizPage
