import { useState } from 'react'
import classNames from 'classnames'

import { QuizWithResources } from '@/api/quizzes'
import { useQuizContractRead } from '@/hooks/useContractRead'
import DocumentIcon from '@/icons/document.svg'
import { formatDateTime } from '@/utils/dates'
import { formatAmount } from '@/utils/math'
import ResourcesModal from './ResourcesModal'

const NUMBER_OF_WINNERS = 3

interface QuizInfoProps {
  quiz: QuizWithResources
  className?: string
}

const QuizInfo = ({ quiz, className }: QuizInfoProps) => {
  const [showResourcesModal, setShowResourcesModal] = useState(false)

  const { data: quizFund } = useQuizContractRead({
    functionName: 'quizFund',
    args: quiz?.id,
    enabled: quiz?.id !== undefined,
  })

  return (
    <div className={classNames(className)}>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-text-secondary mb-4">{quiz.description}</p>
      <div className="mb-6 flex gap-3 items-center">
        {quiz.categories.map((category) => (
          <span
            className="bg-[#0B0E11] text-white rounded-full py-1.5 px-3 text-sm"
            key={category.id}
          >
            {category.name}{' '}
          </span>
        ))}
        <span>·</span>
        {quiz.resources.length && (
          <>
            <button
              onClick={() => setShowResourcesModal(true)}
              className="bg-secondary hover:bg-secondary-hover text-primary w-8 h-8 p-1 -mt-1 rounded-full inline-flex justify-center items-center"
            >
              <DocumentIcon />
            </button>
            <ResourcesModal
              show={showResourcesModal}
              onClose={() => setShowResourcesModal(false)}
              resources={quiz.resources}
            />
          </>
        )}
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
