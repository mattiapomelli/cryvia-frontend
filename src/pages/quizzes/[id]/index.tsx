import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import ApiClient from '@/api/client'
import { getQuizStatus, QuizStatus, QuizWithResources } from '@/api/quizzes'
import Container from '@/components/Layout/Container'
import Leaderboard from '@/components/Quiz/QuizInfo/Leaderboard'
import QuizInfo from '@/components/Quiz/QuizInfo/QuizInfo'
import SubscriptionList from '@/components/Quiz/QuizInfo/SubscriptionList'
import QuizStatusSection from '@/components/Quiz/QuizStatus/QuizStatusSection'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'

const QuizPage: PageWithLayout<{ quiz: QuizWithResources }> = ({ quiz }) => {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <div className="text-center mt-20 font-bold text-3xl">Loading...</div>
    )
  }

  return (
    <Container className="mt-12">
      <div className="flex flex-col lg:flex-row gap-x-20 gap-y-4">
        <QuizInfo quiz={quiz} className="flex-1" />
        <div className="max-w-full lg:w-[400px] flex-shrink-0 flex items-center justify-center">
          <QuizStatusSection quiz={quiz} />
        </div>
      </div>
      <div className="mt-8">
        {getQuizStatus(quiz) === QuizStatus.Ended ? (
          <Leaderboard quiz={quiz} />
        ) : (
          <SubscriptionList quiz={quiz} />
        )}
      </div>
    </Container>
  )
}

QuizPage.getLayout = getDefaultLayout

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id?.toString() || ''

  const apiClient = new ApiClient()
  const { data: quiz } = await apiClient.quizzes.read(Number(id))

  return {
    props: {
      quiz,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apiClient = new ApiClient()
  const { data: quizzes } = await apiClient.quizzes.list()

  const paths = quizzes.map((quiz) => ({
    params: { id: quiz.id.toString() },
  }))

  return {
    paths,
    fallback: true,
  }
}

export default QuizPage
