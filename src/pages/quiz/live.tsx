import type { NextPage } from 'next'
import { useQuery } from 'react-query'

import QuizProvider, {
  QuizPlayingStatus,
  useQuiz,
} from '@components/Quiz/Game/QuizProvider'
import { useApiClient } from '@contexts/AuthProvider'
import { useQuizContract } from '@hooks/useContract'
import { useEffect } from 'react'
import { useWeb3Context } from '@contexts/Web3Provider'
import { useRouter } from 'next/router'
import WaitingRoom from '@components/Quiz/Game/WaitingRoom'
import Quiz from '@components/Quiz/Game/Quiz'
import FinalRoom from '@components/Quiz/Game/FinalRoom'

let done = false

const LiveQuizPageInner = () => {
  const [{ status }] = useQuiz()

  if (status === QuizPlayingStatus.Waiting) {
    return <WaitingRoom />
  }

  if (status === QuizPlayingStatus.Started) {
    return <Quiz />
  }

  return <FinalRoom />
}

const LiveQuizPage: NextPage = () => {
  const { account } = useWeb3Context()
  const apiClient = useApiClient()
  const router = useRouter()
  const quizContract = useQuizContract(true)

  const { data: quiz, isLoading } = useQuery(
    'nextQuiz',
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
      return
    }

    if (!quiz?.id || !quizContract || !account) return

    // If quiz is not subscribed to the current qui, redirect to quiz page
    const getIfSubscribed = async () => {
      const isSubscribed = await quizContract.isSubscribed(quiz.id, account)
      if (!isSubscribed) router.push(`/quiz/${quiz.id}`)
    }

    getIfSubscribed()
  }, [quiz, account, quizContract, router, isLoading])

  if (!quiz) return null

  if (!done) {
    quiz.startTime = new Date(Date.now() + 2000).toISOString()
    done = true
  }

  return (
    <QuizProvider quiz={quiz} isLive>
      <div className="flex justify-center pt-20 pb-20">
        <LiveQuizPageInner />
      </div>
    </QuizProvider>
  )
}

export default LiveQuizPage
