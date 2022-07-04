import type { NextPage } from 'next'
import { useQuery } from 'react-query'

import QuizProvider from '@components/Quiz/QuizProvider'
import { useApiClient } from '@contexts/AuthProvider'
import QuizContainer from '@components/Quiz/QuizContainer'

let done = false

const QuizPage: NextPage = () => {
  const apiClient = useApiClient()
  const { data: quiz } = useQuery('nextQuiz', () =>
    apiClient.quizzes.next().then((data) => data.data),
  )

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

export default QuizPage
