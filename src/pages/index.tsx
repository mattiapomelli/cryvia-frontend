import { useQuery } from 'react-query'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { useApiClient } from '@contexts/AuthProvider'
import Button from '@components/Button'
import Link from 'next/link'

const HomePage: PageWithLayout = () => {
  const apiClient = useApiClient()
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery(
    'quizzes',
    () => apiClient.quizzes.list().then((data) => data.data),
  )

  const { data: nextQuiz, isLoading: isLoadingNextQuiz } = useQuery(
    'nextQuiz',
    () => apiClient.quizzes.next().then((data) => data.data),
  )

  const loading = isLoadingNextQuiz || isLoadingQuizzes

  const filteredQuizzes = !loading
    ? quizzes?.filter((quiz) => quiz.id !== nextQuiz?.id)
    : []

  return (
    <Container className="mt-10 flex justify-center">
      <div className="flex flex-col gap-6">
        {!loading && (
          <>
            <h4 className="font-bold">Next Quiz</h4>
            {nextQuiz && (
              <Link href={`/quiz/${nextQuiz.id}`}>
                <a className="bg-blue-200 p-4 rounded-lg">
                  <h4 className="text-lg font-bold">{nextQuiz.title}</h4>
                  <p>{nextQuiz.description}</p>
                  <div>
                    <span>Price: </span>
                    <span>{nextQuiz.price}</span>
                  </div>
                  <div>
                    <span>Starts at: </span>
                    <span>{nextQuiz.startTime}</span>
                  </div>
                  <div>
                    <span>Categories: </span>
                    {nextQuiz.categories.map((category) => (
                      <span key={category.id}>{category.name} </span>
                    ))}
                  </div>
                  <Button>Suscribe</Button>
                </a>
              </Link>
            )}
            <h4 className="font-bold">Past quizzes</h4>
            {filteredQuizzes?.map((quiz) => (
              <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                <a className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="text-lg font-bold">{quiz.title}</h4>
                  <p>{quiz.description}</p>
                  <div>
                    <span>Categories: </span>
                    {quiz.categories.map((category) => (
                      <span key={category.id}>{category.name} </span>
                    ))}
                  </div>
                </a>
              </Link>
            ))}
          </>
        )}
      </div>
    </Container>
  )
}

HomePage.getLayout = getDefaultLayout

export default HomePage
