import Link from 'next/link'

import { countCorrectAnswers } from '@/api/submissions'
import Button from '@/components/Button'
import SubmissionAnswerCard from '@/components/SubmissionAnswerCard'
import { useQuiz } from './QuizProvider'

const QuizResult = () => {
  const [{ quiz, answers, questions }] = useQuiz()

  const count = countCorrectAnswers(
    questions,
    answers.map((a) => a.id),
  )

  return (
    <div className="flex flex-col mt-20 mb-20">
      <h2 className="text-3xl mb-8 font-bold">{quiz.title}</h2>
      <p className="mb-6">
        <span className="font-bold">Correct answers: </span>
        {count} / {questions.length}
      </p>
      <div className="flex flex-col gap-8 mb-8">
        {questions.map((question, index) => (
          <SubmissionAnswerCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            givenAnswer={answers[index].id}
          />
        ))}
      </div>
      <Link href={`/quizzes/${quiz.id}`}>
        <a className="flex justify-end">
          <Button>Back to quiz page</Button>
        </a>
      </Link>
    </div>
  )
}

export default QuizResult
