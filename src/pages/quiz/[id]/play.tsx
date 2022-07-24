import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import QuizProvider, {
  QuizPlayingStatus,
  useQuiz,
} from '@components/Quiz/Game/QuizProvider'
import { useApiClient } from '@contexts/AuthProvider'
import Quiz from '@components/Quiz/Game/Quiz'
import QuizResult from '@components/Quiz/Game/QuizResult'
import Container from '@components/Layout/Container'
import QuizLoading from '@components/Quiz/Game/QuizLoading'

const QuizPageInner = () => {
  const [{ quiz, status }, dispatch] = useQuiz()
  const apiClient = useApiClient()
  const { data: questions } = useQuery(['quiz-questions', quiz.id], () =>
    apiClient.quizzes.questions(quiz.id).then((data) => data.data),
  )

  useEffect(() => {
    if (questions) {
      dispatch({ type: 'SET_QUESTIONS', questions })
    }
  }, [questions, dispatch])

  if (status === QuizPlayingStatus.Waiting) {
    return <QuizLoading />
  }

  if (status === QuizPlayingStatus.Started) {
    return <Quiz />
  }

  return <QuizResult />
}

const QuizPage: NextPage = () => {
  const router = useRouter()
  const id = router.query.id?.toString()
  const quizId = Number(id)

  const apiClient = useApiClient()
  const { data: quiz } = useQuery(
    [`quiz-${quizId}`],
    () => apiClient.quizzes.read(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  useEffect(() => {
    if (quiz && !quiz.ended) {
      router.push('/')
    }
  }, [quiz, router])

  if (!quiz) return null

  return (
    <QuizProvider quiz={quiz} isLive={false}>
      <Container className="mt-10">
        <div className="max-w-xl mx-auto">
          <QuizPageInner />
        </div>
      </Container>
    </QuizProvider>
  )
}

export default QuizPage
