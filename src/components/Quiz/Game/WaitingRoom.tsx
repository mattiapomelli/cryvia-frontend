import { useRef, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'

import { useApiClient } from '@/contexts/AuthProvider'
import useMounted from '@/hooks/useMounted'
import { useQuiz } from './QuizProvider'

const WaitingRoom = () => {
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
    return (
      <span className="font-bold text-4xl text-primary">
        {hours}:{minutes}:{seconds}
      </span>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center mt-20">
        {quiz.title}
      </h1>
      <div className="bg-tertiary flex flex-col gap-2 p-4 rounded-xl items-center">
        <p className="text-text-secondary">Starts in:</p>
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
        <div className="font-semibold mt-4">People waiting: {playersCount}</div>
      </div>
    </>
  )
}

export default WaitingRoom
