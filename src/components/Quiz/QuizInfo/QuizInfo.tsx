import classNames from 'classnames'

import { Quiz } from '@/api/quizzes'
import { useQuizContractRead } from '@/hooks/useContractRead'
import { formatDateTime } from '@/utils/dates'
import { formatAmount } from '@/utils/math'

const NUMBER_OF_WINNERS = 3

interface QuizInfoProps {
  quiz: Quiz
  className?: string
}

const QuizInfo = ({ quiz, className }: QuizInfoProps) => {
  const { data: quizFund } = useQuizContractRead({
    functionName: 'quizFund',
    args: quiz?.id,
    enabled: quiz?.id !== undefined,
  })

  return (
    <div className={classNames(className)}>
      <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-text-secondary mb-4">{quiz.description}</p>
      <div className="mb-6">
        {quiz.categories.map((category) => (
          <span
            className="bg-[#0B0E11] text-white rounded-full py-1.5 px-3 text-sm"
            key={category.id}
          >
            {category.name}{' '}
          </span>
        ))}
      </div>
      <div className="">
        <div className="flex flex-wrap mb-2 gap-x-4 gap-y-2">
          <div>
            <span className="font-bold">Price: </span>
            <span className="text-text-secondary">{quiz.price} MTK</span>
          </div>
          <span>·</span>
          <div>
            <span className="font-bold">Starts at: </span>
            <span className="text-text-secondary">
              {formatDateTime(quiz.startTime)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap mb-6 gap-x-4 gap-y-2">
          <div>
            <span className="font-bold">Winners: </span>
            <span className="text-text-secondary">{NUMBER_OF_WINNERS}</span>
          </div>
          <span>·</span>
          <div>
            <span className="font-bold">Total prize: </span>
            <span className="text-text-secondary">
              {quizFund && `${formatAmount(quizFund)} MTK`}
            </span>
          </div>
          <span>·</span>
          <div>
            <span className="font-bold">Prize per winner: </span>
            <span className="text-text-secondary">
              {quizFund &&
                `${formatAmount(quizFund.div(NUMBER_OF_WINNERS))} MTK`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizInfo
