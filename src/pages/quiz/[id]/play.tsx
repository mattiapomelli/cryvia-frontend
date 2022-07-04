import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import QuizProvider, {
  QuizPlayingStatus,
  useQuiz,
} from '@components/Quiz/QuizProvider'
import { useApiClient } from '@contexts/AuthProvider'
import Button from '@components/Button'
import Quiz from '@components/Quiz/Quiz'
import QuizResult from '@components/Quiz/QuizResult'

const QuizPageInner = () => {
  const [{ quiz, status }, dispatch] = useQuiz()
  const apiClient = useApiClient()
  const { data: questions } = useQuery(`quiz${quiz.id}-questions`, () =>
    apiClient.quizzes.questions(quiz.id).then((data) => data.data),
  )

  useEffect(() => {
    if (questions) {
      dispatch({ type: 'SET_QUESTIONS', questions })
    }
  }, [questions, dispatch])

  const startQuiz = () => {
    dispatch({ type: 'INIT' })
  }

  if (status === QuizPlayingStatus.Waiting) {
    return (
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-4xl font-bold">{quiz.title}</h1>
        <Button onClick={startQuiz}>Start quiz</Button>
      </div>
    )
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
    `quiz-${quizId}`,
    () => apiClient.quizzes.read(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  if (!quiz) return null

  return (
    <QuizProvider quiz={quiz} isLive={false}>
      <div className="flex justify-center pt-20 pb-20">
        <QuizPageInner />
      </div>
    </QuizProvider>
  )
}

export default QuizPage
