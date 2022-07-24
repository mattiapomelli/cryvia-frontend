import { useState } from 'react'
import Countdown from 'react-countdown'
import { useQuery } from 'react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { getQuizStatus, Quiz, QuizStatus } from '@/api/quizzes'
import Button from '@/components/Button'
import Container from '@/components/Layout/Container'
import Leaderboard from '@/components/Quiz/QuizInfo/Leaderboard'
import SubscriptionList from '@/components/Quiz/QuizInfo/SubscriptionList'
import QuizEnded from '@/components/Quiz/QuizStatus/QuizEnded'
import QuizSubscription from '@/components/Quiz/QuizStatus/QuizSubscription'
import { useApiClient } from '@/contexts/AuthProvider'
import { useQuizContractRead } from '@/hooks/useContractRead'
import useSubscriptionStatus, {
  SubscriptionStatus,
} from '@/hooks/useSubscriptionStatus'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'
import { formatDateTime } from '@/utils/dates'
import { formatAmount } from '@/utils/math'

const NUMBER_OF_WINNERS = 3

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
        <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-default items-center mb-10">
          Quiz starts in:
          <Countdown
            date={quiz.startTime}
            onComplete={onCountdownComplete}
            className="font-bold text-xl"
          />{' '}
          {subscriptionStatus === SubscriptionStatus.Subscribed && (
            <Link href="/quizzes/live">
              <a>
                <Button>Go to waiting room</Button>
              </a>
            </Link>
          )}
        </div>
      )}
      {status === QuizStatus.Playing && (
        <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-default items-center mb-10">
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
    ['quiz', quizId],
    () => apiClient.quizzes.read(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  const { data: quizFund } = useQuizContractRead({
    functionName: 'quizFund',
    args: quizId,
    enabled: id !== undefined,
  })

  return (
    <Container className="mt-8">
      <div className="max-w-xl mx-auto">
        {quiz && (
          <div>
            <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
            <p className="text-text-secondary mb-7">{quiz.description}</p>
            <div className="flex">
              <div className="flex flex-col gap-3 mb-12 flex-1">
                <div>
                  <span className="font-bold">Price: </span>
                  <span className="text-text-secondary">{quiz.price} MTK</span>
                </div>
                <div>
                  <span className="font-bold">Starts at: </span>
                  <span className="text-text-secondary">
                    {formatDateTime(quiz.startTime)}
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
              <div className="flex flex-col gap-3 mb-12 flex-1">
                <div>
                  <span className="font-bold">Number of winners: </span>
                  <span className="text-text-secondary">
                    {NUMBER_OF_WINNERS}
                  </span>
                </div>
                {quizFund && (
                  <>
                    <div>
                      <span className="font-bold">Total prize: </span>
                      <span className="text-text-secondary">
                        {formatAmount(quizFund)} MTK
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">Prize per winner: </span>
                      <span className="text-text-secondary">
                        {formatAmount(quizFund.div(NUMBER_OF_WINNERS))} MTK
                      </span>
                    </div>
                  </>
                )}
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
