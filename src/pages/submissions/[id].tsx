import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import classNames from 'classnames'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { useApiClient } from '@contexts/AuthProvider'

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

  return (
    <Container className="mt-10 flex justify-center">
      {submission && (
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">{submission.quiz.title}</h1>
          <p>Score: {submission.score / 100}</p>
          <div className="flex flex-col gap-4">
            {submission.answers.map(({ question, answer }) => (
              <div key={question.id}>
                <p>{question.text}</p>
                {answer ? (
                  <p
                    className={classNames(
                      answer.correct ? 'text-green-500' : 'text-red-500',
                    )}
                  >
                    {answer.text}
                  </p>
                ) : (
                  <p className="text-gray-500">Answer not given</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}

SubmissionPage.getLayout = getDefaultLayout

export default SubmissionPage
