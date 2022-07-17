import { QuizQuestion } from '@api/quizzes'
import { Answer, GivenAnswer } from '@api/types'
import Button from '@components/Button'
import classNames from 'classnames'
import Link from 'next/link'
import { useQuiz } from './QuizProvider'

function countCorrectAnswers(
  questions: QuizQuestion[],
  answers: GivenAnswer[],
) {
  let count = 0

  for (let i = 0; i < questions.length; i++) {
    const answer = answers[i]

    // If no answer was given, continue
    if (!answer.id) continue

    const correctAnswer = questions[i].question.answers.find((a) => a.correct)

    // Check if answer is correct
    if (answer.id === correctAnswer?.id) {
      count += 1
    }
  }

  return count
}

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
        'py-2 px-5 rounded-xl',
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

const QuizResult = () => {
  const [{ quiz, answers, questions }] = useQuiz()

  const count = countCorrectAnswers(questions, answers)

  return (
    <div className="flex flex-col mt-20 mb-20">
      <h2 className="text-3xl mb-8 font-bold">{quiz.title}</h2>
      <p className="mb-6">
        Correct answers: {count} / {questions.length}
      </p>
      <div className="flex flex-col gap-8 mb-8">
        {questions.map(({ question }, index) => (
          <div key={question.id} className="bg-[#e7d8f2] rounded-xl p-5">
            <div className="flex gap-2 mb-2">
              <span className="rounded-full bg-white w-7 h-7 font-bold inline-flex justify-center items-center">
                {index + 1}
              </span>
              <h4 className="text-lg font-bold mb-2">{question.text}</h4>
            </div>
            <div className="flex flex-col gap-2.5">
              {question.answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  givenAnswer={answers[index].id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Link href={`/quiz/${quiz.id}`}>
        <a className="flex justify-end">
          <Button>Back to home</Button>
        </a>
      </Link>
    </div>
  )
}

export default QuizResult
