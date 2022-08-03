import { useQuery } from 'react-query'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import { useAccount } from 'wagmi'

import { Quiz } from '@/api/quizzes'
import Button from '@/components/Button'
import { useApiClient, useUser } from '@/contexts/AuthProvider'
import { useQuizContractRead } from '@/hooks/useContractRead'
import { useQuizContractWrite } from '@/hooks/useContractWriteAndWait'
import useTokenBalance from '@/hooks/useTokenBalance'
import { formatAmount } from '@/utils/math'
import QuizStatusCard from './QuizStatusCard'

interface QuizEndedProps {
  quiz: Quiz
}

const QuizEnded = ({ quiz }: QuizEndedProps) => {
  const { user } = useUser()
  const { address } = useAccount()
  const { balance, refetch: refetchBalance } = useTokenBalance()

  const apiClient = useApiClient()
  const { data: submissionStatus, isLoading } = useQuery(
    ['quiz-submission', quiz.id, user?.id],
    () => apiClient.quizzes.submissionStatus(quiz.id).then((data) => data.data),
  )

  const { data: winBalance, refetch: refetchWinBalance } =
    useQuizContractRead<BigNumber>({
      functionName: 'winBalance',
      args: [quiz.id, address],
    })

  const { write, status } = useQuizContractWrite({
    functionName: 'redeem',
    onSuccess() {
      refetchBalance()
      refetchWinBalance()
    },
  })

  const redeem = () => {
    write({ args: quiz.id })
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <QuizStatusCard>
        Quiz ended!
        <Link href={`/quizzes/${quiz.id}/play`}>
          <a>
            <Button>Take for free</Button>
          </a>
        </Link>
        {!isLoading && submissionStatus?.submitted && (
          <div className="text-center mt-2">
            <p>
              Your score:{' '}
              <span className="font-bold">
                {submissionStatus.submission.score}
              </span>
            </p>
            <Link href={`/submissions/${submissionStatus.submission.id}`}>
              <a className="underline text-primary hover:text-primary-hover">
                See your submission
              </a>
            </Link>
          </div>
        )}
      </QuizStatusCard>
      {winBalance?.gt(0) && (
        <QuizStatusCard className="bg-[#fdf9f1]">
          You won 🏆! You can redeem {formatAmount(winBalance)}{' '}
          {balance?.symbol}
          <Button onClick={redeem} loading={status === 'loading'}>
            Redeem
          </Button>
        </QuizStatusCard>
      )}
    </div>
  )
}

export default QuizEnded
