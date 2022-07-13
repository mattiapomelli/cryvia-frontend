import type { NextPage } from 'next'
import { useQuery } from 'react-query'

import QuizProvider from '@components/Quiz/QuizProvider'
import { useApiClient } from '@contexts/AuthProvider'
import QuizContainer from '@components/Quiz/QuizContainer'
import { useQuizContract } from '@hooks/useContract'
import { useEffect } from 'react'
import { useWeb3Context } from '@contexts/Web3Provider'
import { useRouter } from 'next/router'

let done = false

const LiveQuizPage: NextPage = () => {
  const { account } = useWeb3Context()
  const apiClient = useApiClient()
  const router = useRouter()
  const quizContract = useQuizContract(true)

  const { data: quiz } = useQuery(
    'nextQuiz',
    () => apiClient.quizzes.next().then((data) => data.data),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (!quiz?.id || !quizContract || !account) return

    // If quiz is not subscribed to the current qui, redirect to quiz page
    const getIfSubscribed = async () => {
      const isSubscribed = await quizContract.isSubscribed(quiz.id, account)
      if (!isSubscribed) router.push(`/quiz/${quiz.id}`)
    }

    getIfSubscribed()
  }, [quiz?.id, account, quizContract, router])

  if (!quiz) return null

  if (!done) {
    quiz.startTime = new Date(Date.now() + 2000).toISOString()
    done = true
  }

  return (
    <QuizProvider quiz={quiz} isLive>
      <div className="flex justify-center pt-20 pb-20">
        <QuizContainer />
      </div>
    </QuizProvider>
  )
}

export default LiveQuizPage
