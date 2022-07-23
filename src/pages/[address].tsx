/* eslint-disable react-hooks/rules-of-hooks */
import Link from 'next/link'
import { useQuery } from 'react-query'

import Container from '@components/Layout/Container'
import { useApiClient, useUser } from '@contexts/AuthProvider'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { User } from '@api/users'
import AddressAvatar from '@components/AddressAvatar'
import { GetStaticProps, GetStaticPropsContext, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'

import useApiRequest from '@hooks/useApiRequest'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface UserSubmissionsProps {
  user: User
}

const UserSubmissions = ({ user }: UserSubmissionsProps) => {
  const apiClient = useApiClient()

  const { data: submissions } = useQuery(`user-${user.id}-submissions`, () =>
    apiClient.users.submissions(user.id).then((data) => data.data),
  )

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-8">
      {submissions?.map((submission) => (
        <Link href={`/submissions/${submission.id}`} key={submission.id}>
          <a className="p-6 rounded-lg bg-tertiary">
            <h4 className="text-xl font-bold mb-2">{submission.quiz.title}</h4>
            <p className="text-text-secondary mb-2">
              {submission.quiz.description}
            </p>
            <p className="text-text-secondary mb-4">
              <span>Submitted: </span>
              <strong>
                {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </strong>
            </p>
          </a>
        </Link>
      ))}
    </div>
  )
}

const ProfilePage: PageWithLayout = (props) => {
  const user: User = props.user
  const [isWindow, setIsWindow] = useState(false)

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsWindow(true)
    }
  }, [])

  return (
    <Container className="mt-10 flex justify-center">
      <div>
        <p className="text-lg font-bold">
          {isWindow && user && <AddressAvatar address={user?.address} />}

          <span className="pl-1"> {user?.address}</span>
        </p>
        <p className="text-lg font-bold">{user?.username}</p>
        <p className="text-xl font-bold py-8">Submissions</p>
        {user && <UserSubmissions user={user} />}
      </div>
    </Container>
  )
}

ProfilePage.getLayout = getDefaultLayout

interface IParams extends ParsedUrlQuery {
  address: string
}

export const getStaticProps: GetStaticProps = async (
  contex: GetStaticPropsContext,
) => {
  const { address } = contex?.params as IParams

  // const { loading, error, handleRequest } = useApiRequest()

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/address/${address}`,
  )
  const { data: user } = data
  return {
    props: {
      user,
    },
  }
}

export const getStaticPaths: GetStaticPaths<{ address: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking', //indicates the type of fallback
  }
}

export default ProfilePage
