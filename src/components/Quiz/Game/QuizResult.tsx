import Button from '@components/Button'
import classNames from 'classnames'
import Link from 'next/link'
import { useQuiz } from './QuizProvider'

const QuizResult = () => {
  const [{ answers, questions }] = useQuiz()

  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-3xl mb-8 font-bold">Result:</h2>
      <div className="flex flex-col gap-8 mb-8">
        {questions.map(({ question }, index) => (
          <div key={question.id}>
            <h4 className="text-xl font-bold mb-2">{question.text}</h4>
            <div className="flex flex-col gap-2">
              {question.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={classNames(
                    'p-3 bg-[#e7d8f2] rounded-lg',
                    { 'text-green-500 font-bold': answer.correct },
                    {
                      'text-red-500 font-bold':
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
      </div>
      <Link href={'/'}>
        <a>
          <Button>Back to home</Button>
        </a>
      </Link>
    </div>
  )
}

export default QuizResult
