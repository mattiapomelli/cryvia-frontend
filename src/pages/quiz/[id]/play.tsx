import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import QuizProvider from '@components/Quiz/QuizProvider'
import QuizContainer from '@components/Quiz/QuizContainer'
import { useApiClient } from '@contexts/AuthProvider'

const QuizPage: NextPage = () => {
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

  if (!quiz) return null

  quiz.startTime = '2022-05-08T14:17:10'

  return (
    <QuizProvider quiz={quiz}>
      <div className="flex justify-center mt-20">
        <QuizContainer />
      </div>
    </QuizProvider>
  )
}

export default QuizPage
