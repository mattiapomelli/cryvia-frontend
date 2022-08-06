import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import Container from '@/components/Layout/Container'
import Button from '@/components/UI/Button'
import { useApiClient, UserStatus, useUser } from '@/contexts/AuthProvider'
import { useQuizContractWrite } from '@/hooks/useContractWriteAndWait'
import { getDefaultLayout } from '@/layouts/DefaultLayout'
import { PageWithLayout } from '@/types'

const OWNER_ADDRESS = '0x8F255911988e25d126608b18cf1B8047D0E8878D'

const WinnersPage: PageWithLayout = () => {
  const { address } = useAccount()
  const { status: userStatus, openConnectModal, openVerifyModal } = useUser()

  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    setIsOwner(address === OWNER_ADDRESS)
  }, [address])

  const router = useRouter()
  const id = router.query.id?.toString()
  const quizId = Number(id)

  const apiClient = useApiClient()
  const { data: quiz } = useQuery(
    ['quiz', quizId],
    () => apiClient.quizzes.read(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  const { data: winnerSubmissions } = useQuery(
    ['quiz-winners', quizId],
    () => apiClient.quizzes.winners(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  const { write, status, error } = useQuizContractWrite({
    functionName: 'setWinners',
  })

  const onSetWinners = () => {
    if (userStatus === UserStatus.Logged) {
      const winners = winnerSubmissions?.map(
        (submission) => submission.user.address,
      )
      console.log('Quiz id: ', quizId)
      console.log('Winners: ', winners)

      write({ args: [quizId, winners] })
    } else if (userStatus === UserStatus.Connected) {
      openVerifyModal()
    } else {
      openConnectModal()
    }
  }

  return (
    <Container className="mt-10 flex justify-center">
      <div className="flex flex-col gap-4 items-center max-w-sm text-center">
        {!isOwner && (
          <div className="bg-red-200 text-red-600 p-4 rounded-default">
            You are not the owner!
          </div>
        )}
        <p className="text-lg">Set winners of:</p>
        <h3 className="text-2xl font-bold">{quiz?.title}</h3>

        <div className="flex flex-col gap-2">
          {winnerSubmissions?.map((submission) => (
            <div
              key={submission.id}
              className="bg-gray-100 rounded-default p-4 text-left"
            >
              <p className="font-bold">{submission.user.address}</p>
              <p>
                <span className="font-bold">Score: </span>
                {submission.score}
              </p>
            </div>
          ))}
        </div>
        {status === 'success' ? (
          <div>
            <p className="font-bold text-green-500">
              Successfully set winners! ✔️
            </p>
          </div>
        ) : (
          <Button
            loading={status === 'loading'}
            onClick={onSetWinners}
            disabled={!isOwner}
          >
            Set winners
          </Button>
        )}
        {status === 'error' && (
          <p className="text-red-500">Error: {error?.message}</p>
        )}
      </div>
    </Container>
  )
}

WinnersPage.getLayout = getDefaultLayout

export default WinnersPage
