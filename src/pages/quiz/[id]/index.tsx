import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'
import Countdown from 'react-countdown'

import Container from '@components/Layout/Container'
import { getDefaultLayout } from '@layouts/DefaultLayout'
import { PageWithLayout } from 'types'
import { useApiClient } from '@contexts/AuthProvider'
import Button from '@components/Button'
import { getQuizStatus, Quiz, QuizStatus } from '@api/quizzes'
import QuizSubscription from '@components/Quiz/QuizStatus/QuizSubscription'
import { useQuizContract } from '@hooks/useContract'
import { useWeb3Context } from '@contexts/Web3Provider'
import { formatAmount } from '@utils/math'
import useTransaction from '@hooks/useTransaction'
import Leaderboard from '@components/Quiz/QuizInfo/Leaderboard'
import SubscriptionList from '@components/Quiz/QuizInfo/SubcriptionList'

const QuizStatusSection = ({ quiz }: { quiz: Quiz }) => {
  const [status, setStatus] = useState(getQuizStatus(quiz))
  const { account, updateBalance } = useWeb3Context()
  const quizContract = useQuizContract(true)

  const [winBalance, setWinBalance] = useState(BigNumber.from(0))
  const { handleTransaction, pending } = useTransaction()

  const onSubscriptionCountdownComplete = () => {
    setStatus(QuizStatus.WaitingStart)
  }

  useEffect(() => {
    if (!quizContract || !account) return

    const getWinBalance = async () => {
      const winBalance = await quizContract.winBalance(1, account) // TODO: replace with actual quizId

      setWinBalance(winBalance)
    }

    getWinBalance()
  }, [quizContract, account])

  const redeem = async () => {
    if (!quizContract) return

    const res = await handleTransaction(
      () => quizContract.redeem(1), // TODO: replace with actual quizId
    )

    if (res) {
      updateBalance()
    }
  }

  return (
    <div>
      {status === QuizStatus.Subscription && (
        <QuizSubscription
          quiz={quiz}
          onCountdownComplete={onSubscriptionCountdownComplete}
        />
      )}
      {status === QuizStatus.WaitingStart && (
        <div>
          Quiz starts in <Countdown date={quiz.startTime} />{' '}
          {/* TODO: show only if user has suscribed */}
          <Link href="/quiz/live">
            <a>
              <Button>Go to stage</Button>
            </a>
          </Link>
        </div>
      )}
      {status === QuizStatus.Playing && <div>Playing right now</div>}
      {/* TODO: move redeem logic to another component */}
      {status === QuizStatus.Ended && (
        <div>
          {winBalance.gt(0) && (
            <div>
              You won! You can redeem: {formatAmount(winBalance)}
              <Button onClick={redeem} loading={pending}>
                Redeem
              </Button>
            </div>
          )}
          <Link href={`/quiz/${quiz.id}/play`}>
            <a>
              <Button>Take for free</Button>
            </a>
          </Link>
          <div>Leaderboard</div>
        </div>
      )}
    </div>
  )
}

const QuizPage: PageWithLayout = () => {
  const router = useRouter()
  const id = router.query.id?.toString()
  const quizId = Number(id)

  const apiClient = useApiClient()
  const { data: quiz } = useQuery(
    `quiz-${quizId}`,
    () => apiClient.quizzes.read(quizId).then((data) => data.data),
    {
      enabled: id !== undefined,
    },
  )

  return (
    <Container className="mt-10 flex justify-center">
      {quiz && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p>{quiz.description}</p>
          <div>
            <span className="font-bold">Price: </span>
            <span>{quiz.price}</span>
          </div>
          <div>
            <span className="font-bold">Starts at: </span>
            <span>{quiz.startTime}</span>
          </div>
          <div>
            <span className="font-bold">Categories: </span>
            {quiz.categories.map((category) => (
              <span key={category.id}>{category.name} </span>
            ))}
          </div>
          <QuizStatusSection quiz={quiz} />
          <div>
            {getQuizStatus(quiz) === QuizStatus.Ended ? (
              <Leaderboard quiz={quiz} />
            ) : (
              <SubscriptionList quiz={quiz} />
            )}
          </div>
        </div>
      )}
    </Container>
  )
}

QuizPage.getLayout = getDefaultLayout

export default QuizPage
