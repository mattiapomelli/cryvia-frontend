import { useQuery } from 'react-query'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { useApiClient } from '@contexts/AuthProvider'
import { PageWithLayout } from 'types'
import QuizCard from '@components/QuizCard'
import NextQuizCard from '@components/NextQuizCard'

const HomePage: PageWithLayout = () => {
  const apiClient = useApiClient()
  const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery(
    ['quizzes'],
    () => apiClient.quizzes.list().then((data) => data.data),
  )

  const { data: nextQuiz, isLoading: isLoadingNextQuiz } = useQuery(
    ['nextQuiz'],
    () => apiClient.quizzes.next().then((data) => data.data),
  )

  const loading = isLoadingNextQuiz || isLoadingQuizzes

  const filteredQuizzes = !loading
    ? quizzes?.filter((quiz) => quiz.id !== nextQuiz?.id)
    : []

  return (
    <Container className="mt-8">
      {!loading && (
        <>
          {nextQuiz && <NextQuizCard quiz={nextQuiz} />}
          <h4 className="font-bold text-2xl mb-4">Past Quizzes</h4>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-8">
            {filteredQuizzes?.map((quiz) => (
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
