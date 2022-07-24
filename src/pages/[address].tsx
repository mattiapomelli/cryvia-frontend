import { useQuery } from 'react-query'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import ApiClient from '@/api/client'
import { User } from '@/api/users'
import Address from '@/components/Address'
import AddressAvatar from '@/components/AddressAvatar'
import Container from '@/components/Layout/Container'
import { useApiClient } from '@/contexts/AuthProvider'
import useMounted from '@/hooks/useMounted'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'
import { formatDate, formatDateTime } from '@/utils/dates'

interface UserProp {
  user: User
}

const UserSubmissions = ({ user }: UserProp) => {
  const apiClient = useApiClient()

  const { data: submissions, isLoading } = useQuery(
    ['user-submissions', user.id],
    () => apiClient.users.submissions(user.id).then((data) => data.data),
  )

  if (!isLoading && submissions?.length === 0) {
    return (
      <div className="text-text-secondary font-bold text-lg text-center mt-16">
        No submissions yet 😢
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-8">
      {submissions?.map((submission) => (
        <Link href={`/quizzes/${submission.quiz.id}`} key={submission.id}>
          <a className="p-6 rounded-lg bg-tertiary">
            <h4 className="text-xl font-bold mb-4">{submission.quiz.title}</h4>
            <div className="text-text-secondary mb-2">
              <span className="font-bold">Submitted at: </span>
              <span>{formatDateTime(submission.submittedAt)}</span>
            </div>
            <div className="text-text-secondary">
              <span className="font-bold">Score: </span>
              <span>{submission.score}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}

const ProfilePage: PageWithLayout<UserProp> = ({ user }) => {
  const router = useRouter()
  const mounted = useMounted()

  if (router.isFallback) {
    return (
      <div className="text-center mt-20 font-bold text-3xl">Loading...</div>
    )
  }

  return (
    <Container className="mt-10">
      <div className="mb-10">
        <div className="flex gap-3 items-center mb-4">
          {mounted && <AddressAvatar address={user.address} size={34} />}
          <Address address={user.address} className="text-3xl font-bold" />
        </div>
        <div>
          <span className="font-bold">Joined on: </span>
          <span className="text-text-secondary">
            {formatDate(user.createdAt)}
          </span>
        </div>
      </div>
      <p className="font-bold text-xl mb-4">Quizzes submitted</p>
      {user && <UserSubmissions user={user} />}
    </Container>
  )
}

ProfilePage.getLayout = getDefaultLayout

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const address = params?.address?.toString() || ''

  const apiClient = new ApiClient()
  const { data: user } = await apiClient.users.getByAddress(address)

  return {
    props: {
      user,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apiClient = new ApiClient()
  const { data: users } = await apiClient.users.list()

  const paths = users.map((user) => ({
    params: { address: user.address.toString() },
  }))

  return {
    paths,
    fallback: true,
  }
}

export default ProfilePage
