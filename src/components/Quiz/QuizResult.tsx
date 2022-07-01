import Button from '@components/Button'
import classNames from 'classnames'
import Link from 'next/link'
import { useQuiz } from './QuizProvider'

const QuizResult = () => {
  const [{ answers, questions }] = useQuiz()

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-3xl font-bold">Result:</h2>
      {questions.map(({ question }, index) => (
        <div key={question.id}>
          <h4 className="text-xl font-bold">{question.text}</h4>
          <div>
            {question.answers.map((answer) => (
              <div
                key={answer.id}
                className={classNames(
                  { 'text-green-500': answer.correct },
                  {
                    'text-red-500':
                      answers[index].id === answer.id && !answer.correct,
                  },
                )}
              >
                {answer.text}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Link href={'/'}>
        <a>
          <Button>Back to home</Button>
        </a>
      </Link>
    </div>
  )
}

export default QuizResult
