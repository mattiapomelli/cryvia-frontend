import { useEffect } from 'react'

import { useApiClient } from '@/contexts/AuthProvider'
import { useQuiz } from './QuizProvider'

const QuizLoading = () => {
  const [{ quiz }, dispatch] = useQuiz()
  const apiClient = useApiClient()

  useEffect(() => {
    const getQuestions = async () => {
      try {
        // Fetch quiz questions
        const { data: questions } = await apiClient.quizzes.questions(quiz.id)
        dispatch({ type: 'SET_QUESTIONS', questions })
        dispatch({ type: 'INIT' })
      } catch (error) {
        console.error(error)
      }
    }

    getQuestions()
  }, [apiClient, quiz.id, dispatch])

  return (
    <div className="text-center mt-20 font-bold text-3xl">Loading quiz...</div>
  )
}

export default QuizLoading
