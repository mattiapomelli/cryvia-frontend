import { useRef, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'

import { useQuiz } from './QuizProvider'
import useMounted from '@hooks/useMounted'
import { useApiClient } from '@contexts/AuthProvider'

const QuizStage = () => {
  const [{ quiz, playersCount }, dispatch] = useQuiz()
  const fetchedQuestions = useRef(false)
  const mounted = useMounted()
  const apiClient = useApiClient()

  const [intervalDelay, setIntervalDelay] = useState(1000)

  const startQuiz = () => {
    dispatch({ type: 'INIT' })
  }

  const onTick = async () => {
    if (
      !fetchedQuestions.current &&
      new Date(quiz.startTime).getTime() - Date.now() < 5000
    ) {
      // When less than 5 seconds are left for start, set interval precision to a 100th of a second
      // so that all user's countdowns get syncrhonized and end at the same exact time
      setIntervalDelay(10)
      fetchedQuestions.current = true

      try {
        // Fetch quiz questions
        const { data: questions } = await apiClient.quizzes.questions(quiz.id)
        dispatch({ type: 'SET_QUESTIONS', questions })
      } catch (error) {
        console.error(error)
      }
    }
  }

  const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => {
    console.log('render')
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
          intervalDelay={intervalDelay}
          key={intervalDelay}
        />
      )}
      <div className="mt-2">People waiting: {playersCount}</div>
    </div>
  )
}

export default QuizStage
