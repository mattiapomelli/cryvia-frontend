import Countdown from 'react-countdown'

import Container from '@components/Layout/Container'
import { useQuiz } from './QuizProvider'
import PeopleIcon from '@icons/people.svg'

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
    <div className="flex flex-col">
      <div className="flex justify-between w-full">
        {isLive && (
          <div>
            <p className="font-bold text-sm mb-1">People at this question</p>
            <span className="flex items-center gap-2 text-lg">
              {playersCount}
              <PeopleIcon />
            </span>
          </div>
        )}
        <div className="text-right ml-auto">
          <p className="font-bold text-sm mb-1">Time left</p>
          <Countdown
            date={questionDeadline}
            onComplete={onDeadlineReached}
            key={questionDeadline} // key is needed to make the countdown re-render when the deadline changes
          />
        </div>
      </div>
      <div className="w-full border-t border-gray-200 my-4" />
      <h3 className="text-xl font-bold mt-6 mb-8">
        {questions[currentQuestion]?.question.text}
      </h3>
      <div className="flex flex-col gap-4">
        {questions[currentQuestion]?.question.answers.map((answer) => (
          <button
            key={answer.text}
            className="py-3 px-5 bg-[#e9d9f3] rounded-xl hover:bg-[#d5c1e3] text-left"
            onClick={() => onSelectAnswer(answer.id)}
          >
            {answer.text}
          </button>
        ))}
      </div>
      {/* Progress Banner */}
      <div className="absolute bg-primary w-full h-12 bottom-0 left-0 flex items-center">
        <Container className="flex items-center gap-8 w-full">
          <span className="font-bold whitespace-nowrap text-white">
            {currentQuestion + 1} / {questions.length}
          </span>
          <div className="h-3 w-full bg-[#787af6] rounded-full relative">
            <div
              className="h-3 absolute bg-[#e5d64d] rounded-full"
              style={{
                width:
                  ((currentQuestion * 100) / questions.length).toFixed(0) + '%',
              }}
            />
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Quiz
