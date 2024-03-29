import { GetStaticProps } from 'next'

import ApiClient from '@/api/client'
import { Quiz } from '@/api/quizzes'
import Container from '@/components/Layout/Container'
import NextQuizCard from '@/components/Quiz/NextQuizCard'
import QuizCard from '@/components/Quiz/QuizCard'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'

interface HomePageProps {
  quizzes: Quiz[]
  nextQuiz: Quiz
}

const HomePage: PageWithLayout<HomePageProps> = ({ quizzes, nextQuiz }) => {
  return (
    <Container className="mt-6">
      {nextQuiz && <NextQuizCard quiz={nextQuiz} />}
      <h4 className="font-bold text-2xl mb-4 mt-10">Quizzes</h4>
      <div className="grid grid-cols-autofill gap-8">
        {quizzes?.map((quiz) => (
          <QuizCard quiz={quiz} key={quiz.id} />
        ))}
      </div>
    </Container>
  )
}

HomePage.getLayout = getDefaultLayout

export const getStaticProps: GetStaticProps = async () => {
  const apiClient = new ApiClient()
  const { data: nextQuiz } = await apiClient.quizzes.nextOrLast()
  const { data: quizzes } = await apiClient.quizzes.list()

  return {
    props: {
      quizzes,
      nextQuiz,
    },
    revalidate: 60,
  }
}

export default HomePage
