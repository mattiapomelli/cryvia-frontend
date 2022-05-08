import { useRef } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'

import { useQuiz } from './QuizProvider'
import useMounted from '@hooks/useMounted'
import { useApiClient } from '@contexts/AuthProvider'

const QuizStage = () => {
  const [{ quiz, playersCount }, dispatch] = useQuiz()
  const fetchedQuestions = useRef(false)
  const mounted = useMounted()
  const apiClient = useApiClient()

  const startQuiz = () => {
    dispatch({ type: 'INIT' })
  }

  const onTick = async () => {
    if (
      !fetchedQuestions.current &&
      new Date(quiz.startTime).getTime() - Date.now() < 5000 // TODO: change with about 5 seconds
    ) {
      fetchedQuestions.current = true

      try {
        const { data: questions } = await apiClient.quizzes.questions(quiz.id)
        dispatch({ type: 'SET_QUESTIONS', questions })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => {
    return (
      <span className="text-3xl font-bold">
        {hours}:{minutes}:{seconds}
      </span>
    )
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
      <p className="mb-2">Starts in:</p>
      {/* We need to show countdown only when component mounted, to match server and client content  */}
      {mounted && (
        <Countdown
          date={quiz.startTime}
          renderer={renderer}
          onComplete={startQuiz}
          onTick={onTick}
        />
      )}
      <div className="mt-2">People waiting: {playersCount}</div>
    </div>
  )
}

export default QuizStage
