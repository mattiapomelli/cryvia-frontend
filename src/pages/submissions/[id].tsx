import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import classNames from 'classnames'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { useApiClient } from '@contexts/AuthProvider'
import { Answer } from '@api/types'
import { QuizQuestion } from '@api/quizzes'
import Link from 'next/link'
import Button from '@components/Button'

function countCorrectAnswers(
  questions: QuizQuestion[],
  answers: { id: number | null }[],
) {
  let count = 0

  for (let i = 0; i < questions.length; i++) {
    const answer = answers[i]

    // If no answer was given, continue
    if (!answer) continue

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

const SubmissionPage: PageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id?.toString()
  const submissionId = Number(id)

  const apiClient = useApiClient()
  const { data: submission } = useQuery(
    `submission-${submissionId}`,
    () => apiClient.submissions.read(submissionId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  const count = submission
    ? countCorrectAnswers(
        submission?.quiz.questions,
        submission.answers.map((a) => a.answer),
      )
    : 0

  return (
    <Container>
      <div className="max-w-xl mx-auto mt-10 flex flex-col mb-20">
        {submission && (
          <>
            <h2 className="text-3xl mb-8 font-bold">{submission.quiz.title}</h2>
            <p className="mb-2">
              <span className="font-bold">Correct answers: </span>
              {count} / {submission.quiz.questions.length}
            </p>
            <p className="mb-6">
              <span className="font-bold">Score: </span>
              {submission.score}
            </p>
            <div className="flex flex-col gap-8 mb-8">
              {submission.answers.map(
                ({ question, answer: givenAnswer }, index) => (
                  <div
                    key={question.id}
                    className="bg-[#e7d8f2] rounded-xl p-5"
                  >
                    <div className="flex gap-2 mb-2">
                      <span className="rounded-full bg-white w-7 h-7 font-bold inline-flex justify-center items-center">
                        {index + 1}
                      </span>
                      <h4 className="text-lg font-bold mb-2">
                        {submission.quiz.questions[index].question.text}
                      </h4>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {submission.quiz.questions[index].question.answers.map(
                        (answer) => (
                          <AnswerCard
                            key={answer.id}
                            answer={answer}
                            givenAnswer={givenAnswer?.id || null}
                          />
                        ),
                      )}
                      {givenAnswer === null && (
                        <div className="text-center mt-2">Did not answer</div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
            <Link href={`/quiz/${submission.quiz.id}`}>
              <a className="flex justify-end">
                <Button>Back to quiz page</Button>
              </a>
            </Link>
          </>
        )}
      </div>
    </Container>
  )
}

SubmissionPage.getLayout = getDefaultLayout

export default SubmissionPage
