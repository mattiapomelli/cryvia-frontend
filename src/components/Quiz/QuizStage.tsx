import { useEffect, useRef, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'

import Quiz from './Quiz'

const QuizStage = () => {
  const [startTime, setStartTime] = useState<Date | null>(null)
  const fetchedQuestions = useRef(false)

  useEffect(() => {
    setStartTime(new Date('2022-05-04T08:00:40'))
  }, [])

  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      return <Quiz />
    }

    return (
      <span>
        {hours}:{minutes}:{seconds}
      </span>
    )
  }

  const startQuiz = () => {
    console.log('Quiz starteeeed!')
  }

  const onTick = () => {
    if (
      startTime &&
      !fetchedQuestions.current &&
      startTime.getTime() - Date.now() < 5000
    ) {
      console.log('Fetch questions')
      fetchedQuestions.current = true
    }
  }

  return (
    <div className="flex justify-center mt-4">
      {startTime && (
        <Countdown
          date={startTime}
          renderer={renderer}
          onComplete={startQuiz}
          onTick={onTick}
        />
      )}
    </div>
  )
}

export default QuizStage
