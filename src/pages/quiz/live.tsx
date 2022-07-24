import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

import Container from '@/components/Layout/Container'
import FinalRoom from '@/components/Quiz/Game/FinalRoom'
import Quiz from '@/components/Quiz/Game/Quiz'
import QuizProvider, {
  QuizPlayingStatus,
  useQuiz,
} from '@/components/Quiz/Game/QuizProvider'
import WaitingRoom from '@/components/Quiz/Game/WaitingRoom'
import { useApiClient } from '@/contexts/AuthProvider'
import useSubscriptionStatus, {
  SubscriptionStatus,
} from '@/hooks/useSubscriptionStatus'
import { PageWithLayout } from '@/types'

// let done = false

const LiveQuizPageInner = () => {
  const [{ status, quiz }] = useQuiz()
  const router = useRouter()
  const { loading, status: subscriptionStatus } = useSubscriptionStatus(quiz)

  useEffect(() => {
    // If user hasn't subscribed to quiz, redirect to quiz page
    if (!loading && subscriptionStatus !== SubscriptionStatus.Subscribed) {
      router.push(`/quiz/${quiz.id}`)
    }
  }, [loading, subscriptionStatus, router, quiz.id])

  if (status === QuizPlayingStatus.Waiting) {
    return <WaitingRoom />
  }

  if (status === QuizPlayingStatus.Started) {
    return <Quiz />
  }

  return <FinalRoom />
}

const LiveQuizPage: PageWithLayout = () => {
  const apiClient = useApiClient()
  const router = useRouter()

  const { data: quiz, isLoading } = useQuery(
    ['nextQuiz'],
    () => apiClient.quizzes.next().then((data) => data.data),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    // If there is no next quiz at the moment, redirect to homepage
    if (!isLoading && !quiz) {
      router.push(`/`)
    }
  }, [quiz, router, isLoading])

  if (!quiz) return null

  // if (!done) {
  //   quiz.startTime = new Date(Date.now() + 2000).toISOString()
  //   done = true
  // }

  return (
    <QuizProvider quiz={quiz} isLive>
      <Container className="mt-10">
        <div className="max-w-xl mx-auto">
          <LiveQuizPageInner />
        </div>
      </Container>
    </QuizProvider>
  )
}

export default LiveQuizPage
