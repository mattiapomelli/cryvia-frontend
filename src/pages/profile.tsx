import { useQuery } from 'react-query'
import Link from 'next/link'

import { User } from '@/api/users'
import Container from '@/components/Layout/Container'
import { useApiClient, useUser } from '@/contexts/AuthProvider'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'

interface UserSubmissionsProps {
  user: User
}

const UserSubmissions = ({ user }: UserSubmissionsProps) => {
  const apiClient = useApiClient()

  const { data: submissions } = useQuery(['user-submissions', user.id], () =>
    apiClient.users.submissions(user.id).then((data) => data.data),
  )

  return (
    <div>
      {submissions?.map((submission) => (
        <Link href={`/submissions/${submission.id}`} key={submission.id}>
          <a>{submission.quiz.title}</a>
        </Link>
      ))}
    </div>
  )
}

const ProfilePage: PageWithLayout = () => {
  const { user } = useUser()

  return (
    <Container className="mt-10 flex justify-center">
      <div>
        <p className="text-lg font-bold">{user?.address}</p>
        <p className="text-lg font-bold">{user?.username}</p>
        {user && <UserSubmissions user={user} />}
      </div>
    </Container>
  )
}

ProfilePage.getLayout = getDefaultLayout

export default ProfilePage
