import useMounted from '@hooks/useMounted'
import { useRef } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { useQuiz } from './QuizProvider'

const QuizStage = () => {
  const [{ quiz }, dispatch] = useQuiz()
  const fetchedQuestions = useRef(false)
  const mounted = useMounted()

  const startQuiz = () => {
    dispatch({ type: 'INIT' })
  }

  const onTick = () => {
    if (
      !fetchedQuestions.current &&
      new Date(quiz.startTime).getTime() - Date.now() < 1000 // TODO: change with about 5 seconds
    ) {
      console.log('Fetch questions')
      fetchedQuestions.current = true
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
    <div className="flex justify-center mt-4">
      {/* We need to show countdown only when component mounted, to match server and client content  */}
      {mounted && (
        <Countdown
          date={quiz.startTime}
          renderer={renderer}
          onComplete={startQuiz}
          onTick={onTick}
        />
      )}
    </div>
  )
}

export default QuizStage
