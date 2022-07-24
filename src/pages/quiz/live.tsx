import { useQuery } from 'react-query'

import QuizProvider, {
  QuizPlayingStatus,
  useQuiz,
} from '@components/Quiz/Game/QuizProvider'
import { useApiClient } from '@contexts/AuthProvider'
import { useQuizContract } from '@hooks/useContract'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import WaitingRoom from '@components/Quiz/Game/WaitingRoom'
import Quiz from '@components/Quiz/Game/Quiz'
import FinalRoom from '@components/Quiz/Game/FinalRoom'
import { PageWithLayout } from 'types'
import Container from '@components/Layout/Container'
import { useAccount } from 'wagmi'

// let done = false

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

const LiveQuizPage: PageWithLayout = () => {
  const { address } = useAccount()
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

    if (!quiz?.id || !quizContract || !address) return

    // TODO: uncomment this for production
    // If quiz is not subscribed to the current qui, redirect to quiz page
    // const getIfSubscribed = async () => {
    //   const isSubscribed = await quizContract.isSubscribed(quiz.id, account)
    //   if (!isSubscribed) router.push(`/quiz/${quiz.id}`)
    // }

    // getIfSubscribed()
  }, [quiz, address, quizContract, router, isLoading])

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
