import classNames from 'classnames'

import { Answer, QuestionWithAnswers } from '@/api/types'

interface AnswerCardProps {
  answer: Answer
  givenAnswer: number | null
}

const AnswerCard = ({ answer, givenAnswer }: AnswerCardProps) => {
  const isCorrect = answer.correct
  const isWrong = givenAnswer === answer.id && !isCorrect
  const isNothing = !isCorrect && !isWrong

  return (
    <div
      className={classNames(
        'py-2 px-5 rounded-default',
        { 'bg-[#f9f1ff] opacity-60': isNothing },
        {
          'text-green-500 border border-green-400 font-bold bg-green-50':
            isCorrect,
        },
        {
          'text-red-500 font-bold border border-red-400 bg-red-50': isWrong,
        },
      )}
    >
      {answer.text}
    </div>
  )
}

interface SubmissionAnswerCardProps {
  question: QuestionWithAnswers
  questionNumber: number
  givenAnswer: number | null
}

const SubmissionAnswerCard = ({
  question,
  questionNumber,
  givenAnswer,
}: SubmissionAnswerCardProps) => {
  return (
    <div className="bg-[#e7d8f2] rounded-default p-5">
      <div className="flex gap-2 mb-2">
        <span className="rounded-full bg-white w-7 h-7 font-bold inline-flex justify-center items-center">
          {questionNumber}
        </span>
        <h4 className="text-lg font-bold mb-2">{question.text}</h4>
      </div>
      <div className="flex flex-col gap-2.5">
        {question.answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            givenAnswer={givenAnswer}
          />
        ))}
        {givenAnswer === null && (
          <div className="text-center mt-2">Did not answer</div>
        )}
      </div>
    </div>
  )
}

export default SubmissionAnswerCard
