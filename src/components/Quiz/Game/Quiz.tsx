import Countdown from 'react-countdown'
import { useQuiz } from './QuizProvider'

const Quiz = () => {
  const [
    { questionDeadline, currentQuestion, playersCount, questions, isLive },
    dispatch,
  ] = useQuiz()

  const onSelectAnswer = (answerId: number) => {
    dispatch({ type: 'NEXT_QUESTION', answer: answerId })
  }

  const onDeadlineReached = () => {
    dispatch({ type: 'NEXT_QUESTION' })
  }

  return (
    <div className="flex flex-col w-full max-w-md">
      <div className="flex justify-between w-full">
        {isLive && <span>{playersCount}</span>}
        <Countdown
          date={questionDeadline}
          onComplete={onDeadlineReached}
          key={questionDeadline} // key is needed to make the countdown re-render when the deadline changes
        />
      </div>
      <h3 className="text-2xl font-bold mt-8 mb-8 text-center">
        {questions[currentQuestion]?.question.text}
      </h3>
      <div className="flex flex-col gap-4">
        {questions[currentQuestion]?.question.answers.map((answer) => (
          <button
            key={answer.text}
            className="p-3 bg-[#e7d8f2] rounded-lg hover:bg-[#d5c1e3]"
            onClick={() => onSelectAnswer(answer.id)}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Quiz
