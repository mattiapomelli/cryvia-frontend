import Countdown from 'react-countdown'
import { useQuiz } from './QuizProvider'

const Quiz = () => {
  const [{ quiz, questionDeadline, currentQuestion, playersCount }, dispatch] =
    useQuiz()

  const onSelectAnswer = (answerId: number) => {
    dispatch({ type: 'NEXT_QUESTION', answer: answerId })
  }

  const onDeadlineReached = () => {
    dispatch({ type: 'NEXT_QUESTION' })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full">
        <span>{playersCount}</span>
        <Countdown
          date={questionDeadline}
          onComplete={onDeadlineReached}
          key={questionDeadline} // key is needed to make the countdown re-render when the deadline changes
        />
      </div>
      <h1 className="text-3xl font-bold mb-8 text-center">
        {quiz.questions[currentQuestion].text}
      </h1>
      <div className="flex flex-col gap-4">
        {quiz.questions[currentQuestion].answers.map((answer, index) => (
          <button
            key={answer.text}
            className="p-2 bg-gray-100 w-[300px] rounded-lg hover:bg-gray-200"
            onClick={() => onSelectAnswer(index)}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Quiz
