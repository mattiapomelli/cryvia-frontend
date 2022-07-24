import { useQuery } from 'react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { countCorrectAnswers, SubmissionWithAnswers } from '@/api/submissions'
import Button from '@/components/Button'
import Container from '@/components/Layout/Container'
import SubmissionAnswerCard from '@/components/SubmissionAnswerCard'
import { useApiClient } from '@/contexts/AuthProvider'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'

const Submission = ({ submission }: { submission: SubmissionWithAnswers }) => {
  const count = countCorrectAnswers(
    submission.answers.map((a) => a.question),
    submission.answers.map((a) => a.answerId),
  )

  return (
    <>
      <h2 className="text-3xl mb-8 font-bold">{submission.quiz.title}</h2>
      <p className="mb-2">
        <span className="font-bold">Correct answers: </span>
        {count} / {submission.answers.length}
      </p>
      <p className="mb-6">
        <span className="font-bold">Score: </span>
        {submission.score}
      </p>
      <div className="flex flex-col gap-8 mb-8">
        {submission.answers.map(({ question, answerId }, index) => (
          <SubmissionAnswerCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            givenAnswer={answerId}
          />
        ))}
      </div>
      <Link href={`/quiz/${submission.quiz.id}`}>
        <a className="flex justify-end">
          <Button>Back to quiz page</Button>
        </a>
      </Link>
    </>
  )
}

const SubmissionPage: PageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id?.toString()
  const submissionId = Number(id)

  const apiClient = useApiClient()
  const { data: submission, isLoading } = useQuery(
    ['submission', submissionId],
    () => apiClient.submissions.read(submissionId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  if (isLoading)
    return (
      <div className="text-center mt-20 font-bold text-3xl">Loading...</div>
    )

  return (
    <Container>
      <div className="max-w-xl mx-auto mt-10 flex flex-col mb-20">
        {submission && <Submission submission={submission} />}
      </div>
    </Container>
  )
}

SubmissionPage.getLayout = getDefaultLayout

export default SubmissionPage
