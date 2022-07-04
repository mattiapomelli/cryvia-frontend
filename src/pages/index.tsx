import { useQuery } from 'react-query'
import Link from 'next/link'

import Container from '@components/Layout/Container'
// import Button from '@components/Button'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { useApiClient } from '@contexts/AuthProvider'
import { PageWithLayout } from 'types'
import QuizCard from '@components/QuizCard'

const HomePage: PageWithLayout = () => {
  const apiClient = useApiClient()
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery(
    'quizzes',
    () => apiClient.quizzes.list().then((data) => data.data),
  )

  // const { data: nextQuiz, isLoading: isLoadingNextQuiz } = useQuery(
  //   'nextQuiz',
  //   () => apiClient.quizzes.next().then((data) => data.data),
  // )

  // const loading = isLoadingNextQuiz || isLoadingQuizzes

  // const filteredQuizzes = !loading
  //   ? quizzes?.filter((quiz) => quiz.id !== nextQuiz?.id)
  //   : []

  return (
    <Container className="mt-10">
      {!isLoadingQuizzes && (
        <>
          {/* <h4 className="font-bold">Next Quiz</h4>
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
            )} */}
          <h4 className="font-bold text-2xl mb-4">Quizzes</h4>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-8">
            {quizzes?.map((quiz) => (
              <QuizCard quiz={quiz} key={quiz.id} />
            ))}
          </div>
        </>
      )}
    </Container>
  )
}

HomePage.getLayout = getDefaultLayout

export default HomePage
