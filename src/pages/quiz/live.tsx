import type { NextPage } from 'next'
import { useQuery } from 'react-query'

import QuizProvider from '@components/Quiz/QuizProvider'
import { useApiClient } from '@contexts/AuthProvider'
import QuizContainer from '@components/Quiz/QuizContainer'

const QuizPage: NextPage = () => {
  const apiClient = useApiClient()
  const { data: quiz } = useQuery('nextQuiz', () =>
    apiClient.quizzes.next().then((data) => data.data),
  )

  if (!quiz) return null

  // quiz.startTime = '2022-05-08T16:06:55'

  return (
    <QuizProvider quiz={quiz} isLive>
      <div className="flex justify-center mt-20">
        <QuizContainer />
      </div>
    </QuizProvider>
  )
}

export default QuizPage
