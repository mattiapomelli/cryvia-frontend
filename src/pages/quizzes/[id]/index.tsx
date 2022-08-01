import { useState } from 'react'
import Countdown from 'react-countdown'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import ApiClient from '@/api/client'
import { getQuizStatus, Quiz, QuizStatus } from '@/api/quizzes'
import Button from '@/components/Button'
import Container from '@/components/Layout/Container'
import Leaderboard from '@/components/Quiz/QuizInfo/Leaderboard'
import SubscriptionList from '@/components/Quiz/QuizInfo/SubscriptionList'
import QuizEnded from '@/components/Quiz/QuizStatus/QuizEnded'
import QuizSubscription from '@/components/Quiz/QuizStatus/QuizSubscription'
import { useQuizContractRead } from '@/hooks/useContractRead'
import useMounted from '@/hooks/useMounted'
import useSubscriptionStatus, {
  SubscriptionStatus,
} from '@/hooks/useSubscriptionStatus'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'
import { formatDateTime } from '@/utils/dates'
import { formatAmount } from '@/utils/math'

const NUMBER_OF_WINNERS = 3

interface QuizProp {
  quiz: Quiz
}

const QuizStatusSection = ({ quiz }: QuizProp) => {
  const [status, setStatus] = useState(getQuizStatus(quiz))
  const { status: subscriptionStatus } = useSubscriptionStatus(quiz)
  const mounted = useMounted()

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
          <div className="h-6">
            {mounted && (
              <Countdown
                date={quiz.startTime}
                onComplete={onCountdownComplete}
                className="font-bold text-xl"
              />
            )}
          </div>
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

const QuizPage: PageWithLayout<QuizProp> = ({ quiz }) => {
  const router = useRouter()

  const { data: quizFund } = useQuizContractRead({
    functionName: 'quizFund',
    args: quiz?.id,
    enabled: quiz?.id !== undefined,
  })

  if (router.isFallback) {
    return (
      <div className="text-center mt-20 font-bold text-3xl">Loading...</div>
    )
  }

  return (
    <Container className="mt-8">
      <div className="max-w-xl mx-auto">
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
              <span className="text-text-secondary">{NUMBER_OF_WINNERS}</span>
            </div>
            <div>
              <span className="font-bold">Total prize: </span>
              <span className="text-text-secondary">
                {quizFund && `${formatAmount(quizFund)} MTK`}
              </span>
            </div>
            <div>
              <span className="font-bold">Prize per winner: </span>
              <span className="text-text-secondary">
                {quizFund &&
                  `${formatAmount(quizFund.div(NUMBER_OF_WINNERS))} MTK`}
              </span>
            </div>
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
    </Container>
  )
}

QuizPage.getLayout = getDefaultLayout

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id?.toString() || ''

  const apiClient = new ApiClient()
  const { data: quiz } = await apiClient.quizzes.read(Number(id))

  return {
    props: {
      quiz,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apiClient = new ApiClient()
  const { data: quizzes } = await apiClient.quizzes.list()

  const paths = quizzes.map((quiz) => ({
    params: { id: quiz.id.toString() },
  }))

  return {
    paths,
    fallback: true,
  }
}

export default QuizPage
