import { useEffect, useReducer } from 'react'
import Countdown from 'react-countdown'

const questions = [
  {
    text: 'Question 1',
    answers: [
      {
        text: 'Answer 1',
      },
      {
        text: 'Answer 2',
      },
      {
        text: 'Answer 3',
      },
      {
        text: 'Answer 4',
      },
    ],
  },
  {
    text: 'Question 2',
    answers: [
      {
        text: 'Answer 2.1',
      },
      {
        text: 'Answer 2.2',
      },
      {
        text: 'Answer 2.3',
      },
      {
        text: 'Answer 2.4',
      },
    ],
  },
  {
    text: 'Question 3',
    answers: [
      {
        text: 'Answer 3.1',
      },
      {
        text: 'Answer 3.2',
      },
      {
        text: 'Answer 3.3',
      },
      {
        text: 'Answer 3.4',
      },
    ],
  },
]

interface QuizState {
  currentQuestion: number
  ended: boolean
  questionDeadline: number
  answers: (number | null)[]
}

type QuizAction = { type: 'NEXT_QUESTION'; answer?: number }

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'NEXT_QUESTION': {
      const answer = action.answer || null
      const newAnswers = [...state.answers, answer]

      if (state.currentQuestion === questions.length - 1) {
        return {
          ...state,
          ended: true,
          questionDeadline: Date.now(),
          answers: newAnswers,
        }
      }

      return {
        ...state,
        currentQuestion: state.currentQuestion + 1,
        questionDeadline: Date.now() + 3000,
        answers: newAnswers,
      }
    }
    default:
      return state
  }
}

const Quiz = () => {
  const [quizState, dispatch] = useReducer(quizReducer, {
    currentQuestion: 0,
    ended: false,
    questionDeadline: Date.now() + 3000,
    answers: [],
  })

  useEffect(() => {
    if (quizState.ended) {
      console.log('Quiz completed')
    }
  }, [quizState.ended])

  const onSelectAnswer = (answerId: number) => {
    dispatch({ type: 'NEXT_QUESTION', answer: answerId })
  }

  const onDeadlineReached = () => {
    dispatch({ type: 'NEXT_QUESTION' })
  }

  return (
    <div>
      {!quizState.ended ? (
        <div>
          {quizState.questionDeadline}
          <Countdown
            date={quizState.questionDeadline}
            onComplete={onDeadlineReached}
            key={quizState.questionDeadline} // key is needed to make the countdown re-render when the deadline changes
          />
          <h1 className="text-3xl font-bold mb-8 text-center">
            {questions[quizState.currentQuestion].text}
          </h1>
          <div className="flex flex-col gap-4">
            {questions[quizState.currentQuestion].answers.map(
              (answer, index) => (
                <button
                  key={answer.text}
                  className="p-2 bg-gray-100 w-[300px] rounded-lg hover:bg-gray-200"
                  onClick={() => onSelectAnswer(index)}
                >
                  {answer.text}
                </button>
              ),
            )}
          </div>
        </div>
      ) : (
        <div>Quiz ended</div>
      )}
    </div>
  )
}

export default Quiz
